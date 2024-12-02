import React, { useEffect, useRef, useState } from 'react'
import PlayPause from './PlayPause';

function Preview({
    setSvgDataList,
    selectedSvg,
    backgroundImage,
    svgContainerRef,
    setSelectedSvg,
    setBackgroundImage,
    isPlaying,
    togglePlayPause,
    selectedLayers,
    timelineRef,
    currentTime,
    setCurrentTime,
    durationInputRef,
    playAnimation,
    pauseAnimation
}) {

    const [svgPosition, setSvgPosition] = useState({ x: 0, y: 0 });  
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });


    const startDrag = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const onDrag = (e: React.MouseEvent) => {
        if (!isDragging.current) return;

        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;

        setSvgPosition((prev: any) => ({
            x: prev.x + dx,
            y: prev.y + dy,
        }));

        dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const stopDrag = () => {
        isDragging.current = false;
    };




    useEffect(() => {
        const savedSVGs = localStorage.getItem("uploadedSVGs");
        if (savedSVGs) {
            const svgList = JSON.parse(savedSVGs);
            setSvgDataList(svgList);
            setSelectedSvg(svgList[0] || null);
        }

        const savedBackground = localStorage.getItem("backgroundImage");
        if (savedBackground) {
            setBackgroundImage(savedBackground);
        }
    }, []);


    const applyLayerStyles = (svg: string, layersToHighlight: string[]) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svg, "image/svg+xml");
    
        svgDoc.querySelectorAll("g").forEach((layer) => {
          const layerId = layer.id || `layer-${Array.from(layer.parentElement?.children || []).indexOf(layer)}`;
    
          if (layersToHighlight.includes(layerId)) {
            layer.setAttribute("stroke", "red");
            layer.setAttribute("stroke-width", "4");
            Array.from(layer.children).forEach((child) => {
              if (layersToHighlight.includes(child.id || `${layerId}-child-${Array.from(layer.children).indexOf(child)}`)) {
                child.setAttribute("stroke", "red");
                child.setAttribute("stroke-width", "4");
              }
            });
          } else {
            layer.removeAttribute("stroke");
            layer.removeAttribute("stroke-width");
            Array.from(layer.children).forEach((child) => {
              child.removeAttribute("stroke");
              child.removeAttribute("stroke-width");
            });
          }
        });
    
        return svgDoc.documentElement.outerHTML;
      };




    return (
        <>
            {selectedSvg ? (
                <>
                    <div className="right-side">
                        <h1 className="main-heading">Preview</h1>
                        <div
                            className="right-side-inner"

                            style={{
                                backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                border: "1px solid #ccc",
                                padding: "16px",
                                overflow: "hidden"
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
                        {/* Timeline and Play/Pause Button */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px" }}>
                            <button onClick={togglePlayPause} style={{ marginRight: "10px" }}>
                                {isPlaying ? "Pause" : "Play"}
                            </button>
                            <div
                                ref={timelineRef}
                                style={{
                                    width: "80%",
                                    height: "10px",
                                    background: "#ccc",
                                    borderRadius: "5px",
                                    position: "relative",
                                    cursor: "pointer",
                                }}
                                onClick={(e) => {
                                    const clickPosition = e.nativeEvent.offsetX;
                                    const timelineWidth = timelineRef.current?.offsetWidth || 0;
                                    const newTime = (clickPosition / timelineWidth) * 100; // Map click to time
                                    setCurrentTime(newTime);
                                }}
                            >
                                <div
                                    style={{
                                        width: `${currentTime}%`,
                                        height: "100%",
                                        background: "blue",
                                        borderRadius: "5px",
                                    }}
                                />
                            </div>
                        </div>
                        <PlayPause durationInputRef={durationInputRef} playAnimation={playAnimation} pauseAnimation={pauseAnimation} />
                    </div>
                    

                </>
            ) : (
                <p>Select an SVG to preview it here.</p>
            )}
        </>
    )
}

export default Preview