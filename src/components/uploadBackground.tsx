import { IMAGE_SIZE } from "@/utils/animationsType";
import { uploadBackground } from "@/utils/types";
import { toast } from "sonner";



const UploadBackground: React.FC<uploadBackground> = ({ setBackgroundImage }) => {
    const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size <= IMAGE_SIZE) {
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const uploadedBackground = e.target?.result as string;
                        setBackgroundImage(uploadedBackground);
                        localStorage.setItem("backgroundImage", uploadedBackground);
                        toast.success("Background image uploaded successfully!");
                    };
                    reader.readAsDataURL(file);
                } else {
                    toast.error("Please upload a valid image file.");
                }
            } else {
                toast.error("Image should be less than 250KB or less");
            }
        } else {
            toast.error("No file selected.");
        }
    };
    return (
        <>
            <div className="choose_file-container">
                <label htmlFor="background-upload" className="custom-file-upload">
                    Upload Background
                </label>
                <input
                    id="background-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundUpload}
                    className="hidden"
                />
            </div>
        </>
    )
}

export default UploadBackground