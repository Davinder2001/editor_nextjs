import { uploadSvg } from "@/utils/types";
const UploadSvg: React.FC<uploadSvg>=({svgDataList,setSvgDataList,setSelectedSvg})=> {
    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const files = event.target.files;
        if (files) {
            const newSvgDataList: string[] = [];
            Array.from(files).forEach((file) => {
                if (file.type === "image/svg+xml") {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const svgContent = e.target?.result as string;

                        // Parse the SVG content
                        const parser = new DOMParser();
                        const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
                        const svgElement = svgDoc.documentElement;

                        // Create a new <g> tag with id="animation_wrapper"
                        const animationWrapper = svgDoc.createElementNS("http://www.w3.org/2000/svg", "g");
                        animationWrapper.setAttribute("id", "animation_wrapper");

                        // Move all direct child <g> elements inside the new <g> tag
                        const childGroups = svgElement.querySelectorAll(":scope > g");
                        childGroups.forEach((child) => {
                            animationWrapper.appendChild(child);
                        });

                        // Find the 'pant-back-details' and 'pant-front-details' groups inside the animation_wrapper
                        const pantBackDetails = animationWrapper.querySelector("g#pant-back-details");
                        const pantFrontDetails = animationWrapper.querySelector("g#pant-front-details");

                        // Insert 'pantBackDetails' before 'pantFrontDetails'
                        if (pantBackDetails && pantFrontDetails) {
                            animationWrapper.insertBefore(pantBackDetails, pantFrontDetails);
                        }

                        // Find the 'shoe-back', 'leg-back', 'shoe-front', 'leg-front' groups inside the animation_wrapper
                        const shoeBack = animationWrapper.querySelector("g#shoe-back");
                        const legBack = animationWrapper.querySelector("g#leg-back");
                        const shoeFront = animationWrapper.querySelector("g#shoe-front");
                        const legFront = animationWrapper.querySelector("g#leg-front");

                        // Find the 'pant-p1' path in pant-back-details and pant-front-details
                        const pantP1Front = pantFrontDetails?.querySelector("path#pant-p1_00000031922170619610477720000001442069305815377831_");
                        const pantP1Back = pantBackDetails?.querySelector("path#pant-p1");

                        // Insert 'leg-front' and 'shoe-front' inside 'pant-front-details' before pantP1Front
                        if (pantP1Front && pantFrontDetails && shoeFront && legFront) {
                            pantFrontDetails.insertBefore(legFront, pantP1Front); // Insert leg-front before pantP1Front
                            pantFrontDetails.insertBefore(shoeFront, pantP1Front); // Insert shoe-front before pantP1Front
                        }

                        // Insert 'leg-back' and 'shoe-back' inside 'pant-back-details' before pantP1Back
                        if (pantP1Back && pantBackDetails && shoeBack && legBack) {
                            pantBackDetails.insertBefore(legBack, pantP1Back); // Insert leg-back before pantP1Back
                            pantBackDetails.insertBefore(shoeBack, pantP1Back); // Insert shoe-back before pantP1Back
                        }

                        // Append the animation wrapper to the SVG root element
                        svgElement.appendChild(animationWrapper);

                        // Serialize the updated SVG
                        const serializer = new XMLSerializer();
                        const updatedSvgContent = serializer.serializeToString(svgElement);

                        // Add the updated SVG content to the list
                        newSvgDataList.push(updatedSvgContent);

                        if (newSvgDataList.length === files.length) {
                            const updatedList = [...svgDataList, ...newSvgDataList];
                            setSvgDataList(updatedList);
                            localStorage.setItem("uploadedSVGs", JSON.stringify(updatedList));
                            setSelectedSvg(updatedList[0]);
                        }
                    };
                    reader.readAsText(file);
                } else {
                    alert(`File ${file.name} is not a valid SVG file.`);
                }
            });
        }
    };
    return (
        <>
            <div className="choose_file-container">
                <label htmlFor="file-upload" className="custom-file-upload">
                    Upload SVGs
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept=".svg"
                    multiple
                    onChange={handleUpload}
                    className="hidden"
                />
            </div>
            
        </>
    )
}

export default UploadSvg