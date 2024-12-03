import React, { useEffect, useRef, useState } from "react";
interface PreviewProps {
    backgroundImage: any;
    svgContainerRef: any;
    startDrag: any;
    onDrag: ()=> void;
    stopDrag:()=> void;
    svgPosition: number;
    applyLayerStyles:()=> void;
    selectedSvg: any;
    selectedLayers: any;
}

const SvgPreviewMain = ({backgroundImage, svgContainerRef, startDrag, onDrag, stopDrag, svgPosition, applyLayerStyles, selectedSvg, selectedLayers }) => {
  return (
    <>
        {/* Preview of svg */}
        <div
                                className="right-side-inner"
                                style={{
                                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    border: "1px solid #ccc",
                                    padding: "16px",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    ref={svgContainerRef}
                                    className="svg-preview-container"
                                    onMouseDown={startDrag}
                                    onMouseMove={onDrag}
                                    onMouseUp={stopDrag}
                                    onMouseLeave={stopDrag}
                                    style={{
                                        position: "relative",
                                        cursor: "move",
                                        left: `${svgPosition.x}px`,
                                        top: `${svgPosition.y}px`,
                                    }}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: applyLayerStyles(selectedSvg, selectedLayers),
                                        }}
                                        style={{ maxHeight: "600px" }}
                                    />
                                </div>
                            </div>
    </>
  )
}

export default SvgPreviewMain