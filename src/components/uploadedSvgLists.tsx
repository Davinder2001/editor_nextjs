import { svgPreview } from "@/utils/types";
import React from "react";
const UploadedSvgsList: React.FC<svgPreview> = ({ svgDataList, selectedSvgIndex, selectedSvg, setSvgDataList, setSelectedSvg, setContextMenuPosition, handleSvgClick, addSlideToTimeline }) => {

    const handleDeleteSvg = () => {
        if (selectedSvg) {
            const updatedList = svgDataList.filter((svg) => svg !== selectedSvg);
            setSvgDataList(updatedList);
            localStorage.setItem("uploadedSVGs", JSON.stringify(updatedList));
            setSelectedSvg(null);
        }
        setContextMenuPosition(null);
    };

    return (
        <>
            <div className="svg-thumb-container">
                {svgDataList.length > 0 ? (
                    svgDataList.map((svg, index) => (
                        <div
                            key={index}
                            style={{
                                position: "relative",
                                height: "150px",
                                border: "1px solid #ccc",
                                marginBottom: "20px",
                                cursor: "pointer",
                            }}
                            className={selectedSvgIndex === index ? "active" : ""}
                        >
                            <div
                                onClick={() => handleSvgClick(svg, index)}
                                dangerouslySetInnerHTML={{ __html: svg }}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                }}
                            />


                            <div className="add-and-delete-buttons">
                                <button
                                    onClick={(event) => addSlideToTimeline(event)}
                                    data-index={index}
                                    style={{
                                        padding: "8px 10px",
                                        backgroundColor: "#4CAF50",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                        width: "50%",
                                    }}
                                >
                                    Add Slide
                                </button>

                                <button
                                    onClick={() => handleDeleteSvg()}
                                    style={{
                                        padding: "8px 10px",
                                        backgroundColor: "#f44336",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                        width: "50%"
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No SVGs uploaded yet.</p>
                )}
            </div>
        </>
    )
}

export default UploadedSvgsList