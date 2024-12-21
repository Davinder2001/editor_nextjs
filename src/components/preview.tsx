import React, { useEffect } from "react";
import SvgPreviewMain from "./svgPreviewMain";
 

interface PreviewProps {
  setSvgDataList: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSvg: string | null;
   svgContainerRef: React.RefObject<HTMLCanvasElement> ;
  // setSelectedSvg: React.Dispatch<React.SetStateAction<string | null>>;
  backgroundImage: string | null;
  setBackgroundImage: React.Dispatch<React.SetStateAction<string | null>>;
  isPlaying: boolean;
  togglePlayPause: () => void;
  selectedLayers: string[];

  
  slideForTimeline:  {
    svg: string;
    animationType: string | null;
    duration: number;
    index: number;
    isPlaying: boolean;  
  }[];
 
  
 
  replayActivities: () => void;
  
  svgPosition: { x: number; y: number };
  setSvgPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
   
  handleSvgClick:(svg: string, index: number)=>void,
  playheadPosition: number
 
  currentReplayIndex: null | number
  handleMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void; // Mouse down handler
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void; // Mouse move handler
  handleMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void; // Mouse up handler
  playPauseAni:()=>void,
  setLayerIndex: React.Dispatch<React.SetStateAction<number|null>>; 
  downloadVideo:()=>void,
  dragging:boolean
}

const Preview: React.FC<PreviewProps> = ({
  setSvgDataList,
  selectedSvg,
  backgroundImage,
  svgContainerRef,
  
  setBackgroundImage,

  selectedLayers,


  
 
  svgPosition,
  setSvgPosition,
  
  
  
  
  
}) => {

  // const isDragging = useRef(false);
  // const dragStart = useRef({ x: 0, y: 0 });







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

         
          
        </>
       
    </>
  );
};

export default Preview;
