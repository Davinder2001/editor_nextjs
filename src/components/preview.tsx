import React, { useEffect } from "react";
import SvgPreviewMain from "./svgPreviewMain";
import { PreviewProps } from "@/utils/types";
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
  useEffect(() => {
    const savedSVGs = localStorage.getItem("uploadedSVGs");
    if (savedSVGs) {
      const svgList: string[] = JSON.parse(savedSVGs);
      setSvgDataList(svgList);
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
  );
};

export default Preview;
