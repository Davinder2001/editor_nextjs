'use client';
import React, { useState, useEffect } from "react";

const Page: React.FC = () => {
  const [svgDataList, setSvgDataList] = useState<string[]>([]);
  const [selectedSvg, setSelectedSvg] = useState<string | null>(null);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);

  useEffect(() => {
    const savedSVGs = localStorage.getItem("uploadedSVGs");
    if (savedSVGs) {
      const svgList = JSON.parse(savedSVGs);
      setSvgDataList(svgList);
      setSelectedSvg(svgList[0] || null);
    }
  }, []);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files) {
      const newSvgDataList: string[] = [];
      Array.from(files).forEach((file) => {
        if (file.type === "image/svg+xml") {
          const reader = new FileReader();
          reader.onload = (e) => {
            const svgContent = e.target?.result as string;
            newSvgDataList.push(svgContent);

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

  const handleSvgClick = (svg: string) => {
    setSelectedSvg(svg);
    setSelectedLayers([]); // Reset selected layers
  };

  const handleLayerClick = (layerId: string) => {
    setSelectedLayers([layerId]); // Select only the clicked layer
  };

  const parseSvgLayers = (svg: string) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svg, "image/svg+xml");

    // Select only top-level <g> elements
    const topLevelLayers = Array.from(svgDoc.documentElement.querySelectorAll(":scope > g")).map((layer, index) => ({
      id: layer.id || `layer-${index}`,
      content: layer.outerHTML,
    }));

    return topLevelLayers;
  };

  const applyLayerStyles = (svg: string, layersToHighlight: string[]) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svg, "image/svg+xml");

    svgDoc.querySelectorAll("g").forEach((layer) => {
      const layerId = layer.id || `layer-${Array.from(layer.parentElement?.children || []).indexOf(layer)}`;
      if (layersToHighlight.includes(layerId)) {
        layer.setAttribute("style", "border: 2px solid #000;");
        layer.setAttribute("stroke", "red");
        layer.setAttribute("stroke-width", "4");
      } else {
        layer.removeAttribute("style");
        layer.removeAttribute("stroke");
        layer.removeAttribute("stroke-width");
      }
    });

    return svgDoc.documentElement.outerHTML;
  };

  return (
    <div className="container">
      {/* <h1 className="main-heading">Editor</h1> */}
      <div className="frame-container">
        <div className="left-side">
        <h1 className="main-heading">Upload</h1>
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

          <div className="svg-thumb-container">
            {svgDataList.length > 0 ? (
              svgDataList.map((svg, index) => (
                <div
                  key={index}
                  onClick={() => handleSvgClick(svg)}
                  dangerouslySetInnerHTML={{ __html: svg }}
                  style={{
                
                    maxHeight: "200px",
                    border: "1px solid #ccc",
                    marginBottom: '20px',
                    cursor: "pointer",
                  
                  }}
                  className={selectedSvg === svg ? "active" : ""}
                />
              ))
            ) : (
              <p>No SVGs uploaded yet.</p>
            )}
          </div>
        </div>
            <>
          {selectedSvg ? (
            <>
        <div className="right-side">
        <h1 className="main-heading">Preview</h1>
            <div className="right-side-inner">
              <div className="svg-preview-container">
                <div
                  dangerouslySetInnerHTML={{
                    __html: applyLayerStyles(selectedSvg, selectedLayers),
                  }}
                  style={{
                    height: "auto",
                    border: "1px solid #ccc",
                    padding: "16px",
                  }}
                  />
              </div>
             
            </div>
          </div>
           <div className="layers-prev-container">
           <h1 className="main-heading">Layers</h1>
           <ul>
             {parseSvgLayers(selectedSvg).map((layer) => (
               <li key={layer.id}>
                 <button
                   onClick={() => handleLayerClick(layer.id)}
                   style={{
                     background: selectedLayers.includes(layer.id) ? "lightblue" : "transparent",
                     padding: "8px",
                     cursor: "pointer",
                     margin: "4px 0",
                     width: '100%'
                    }}
                    >
                   {layer.id}
                 </button>
               </li>
             ))}
           </ul>
         </div>
             </>
          ) : (
            <p>Select an SVG to preview it here.</p>
          )}

          
          </>
      </div>
    </div>
  );
};

export default Page;
