import React, { useEffect, useRef, useState } from "react";
import SvgPreviewMain from "./svgPreviewMain";
import TimeLine from "./timeLine";

interface PreviewProps {
  setSvgDataList: any;
  selectedSvg: any;
  backgroundImage: any;
  svgContainerRef: any;
  setSelectedSvg: React.Dispatch<React.SetStateAction<string | null>>;
  setBackgroundImage: any;
  isPlaying: boolean;
  togglePlayPause: () => void;
  selectedLayers: any;
 
  playAnimation: (duration: number) => void;
  slideForTimeline: any;
  playWalkingAnimation: () => void;
  selectedSvgIndex: number;
  handleWalkingAnimation: () => void;
  replayActivities: () => void;
  downloadVideo: () => void;
  svgPosition:any
  setSvgPosition:any
  handleSvgClick:any
  playheadPosition:number
  seconds:number
  currentReplayIndex:null|number
}

const Preview: React.FC<PreviewProps> = ({
  setSvgDataList,
  selectedSvg,
  backgroundImage,
  svgContainerRef,
  setSelectedSvg,
  setBackgroundImage,
 
  selectedLayers,
 
  
  slideForTimeline,
  playWalkingAnimation,
  selectedSvgIndex,
  handleWalkingAnimation,
  replayActivities,
  downloadVideo,
  svgPosition,
  setSvgPosition,
  handleSvgClick ,
  playheadPosition,
  seconds,
  currentReplayIndex
}) => {
 
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  

 

 

  useEffect(() => {
    const savedSVGs = localStorage.getItem("uploadedSVGs");
    if (savedSVGs) {
      const svgList: string[] = JSON.parse(savedSVGs); // Explicitly type the parsed data
      setSvgDataList(svgList);
      // setSelectedSvg(svgList[0] || null); 
    }
  
    const savedBackground = localStorage.getItem("backgroundImage");
    if (savedBackground) {
      setBackgroundImage(savedBackground);
    }
  }, []); // Dependencies are left empty because this effect runs only once on mount
  

  const applyLayerStyles = (svg: string, layersToHighlight: string[]) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svg, "image/svg+xml");

    svgDoc.querySelectorAll("g").forEach((layer) => {
      const layerId =
        layer.id || `layer-${Array.from(layer.parentElement?.children || []).indexOf(layer)}`;

      if (layersToHighlight.includes(layerId)) {
        layer.setAttribute("stroke", "red");
        layer.setAttribute("stroke-width", "4");
        Array.from(layer.children).forEach((child) => {
          if (
            layersToHighlight.includes(
              child.id || `${layerId}-child-${Array.from(layer.children).indexOf(child)}`
            )
          ) {
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
          <h1 className="main-heading">Preview</h1>
          <SvgPreviewMain
            backgroundImage={backgroundImage}
            svgContainerRef={svgContainerRef}
            svgPosition={svgPosition}
            applyLayerStyles={applyLayerStyles}
            selectedSvg={selectedSvg}
            selectedLayers={selectedLayers}
            setSvgPosition={setSvgPosition}
          
          />

          {/* Timeline */}
          <TimeLine
      currentReplayIndex={currentReplayIndex}
            slideForTimeline={slideForTimeline}
            playWalkingAnimation={playWalkingAnimation}
        
            selectedSvgIndex={selectedSvgIndex}
            
           
            replayActivities={replayActivities}
            downloadVideo={downloadVideo}
            handleSvgClick={handleSvgClick}
            playheadPosition={playheadPosition}
            seconds={seconds}
          />
        </>
      ) : (
        <p>Select an SVG to preview it here.</p>
      )}
    </>
  );
};

export default Preview;
