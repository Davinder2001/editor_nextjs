'use client';
import React, { useState, useEffect, useRef } from "react";

const Page: React.FC = () => {
  const [svgDataList, setSvgDataList] = useState<string[]>([]);
  const [selectedSvg, setSelectedSvg] = useState<string | null>(null);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [svgPosition, setSvgPosition] = useState({ x: 0, y: 0 }); // Track position
  const isDragging = useRef(false); // To track drag status
  const dragStart = useRef({ x: 0, y: 0 }); // Start coordinates for dragging
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);

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

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedBackground = e.target?.result as string;
        setBackgroundImage(uploadedBackground);
        localStorage.setItem("backgroundImage", uploadedBackground);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
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

    const getLayers = svgDoc.documentElement.querySelectorAll(":scope > g");

    const layersWithChildren = Array.from(getLayers).map((layer, index) => {
      return {
          index: index, // Index of the layer
          id: layer.id || `Layer ${index}`, // Name of the layer
          children: Array.from(layer.children) // Array of children for this layer
      };
  });
  
  // Log the structured data
  // console.log('Layers with Children:', getLayers);
  
    // // Select only top-level <g> elements
    // const topLevelLayers = Array.from(svgDoc.querySelectorAll(":scope > g")).map((layer, index) => ({
    //   id: layer.id || `layer-${index}`,
    //   content: layer.outerHTML,
    // }));

    return layersWithChildren;
  };


  // Timeline state
  const [currentTime, setCurrentTime] = useState(0); // Current time in seconds
  const [isPlaying, setIsPlaying] = useState(false); // Play/Pause state

  const timelineRef = useRef<HTMLDivElement | null>(null);
    // Handle the play/pause functionality for the timeline
    const togglePlayPause = () => {
      setIsPlaying((prev) => !prev);
    };
  
    useEffect(() => {
      let timer: NodeJS.Timeout | null = null;
  
      if (isPlaying) {
        timer = setInterval(() => {
          setCurrentTime((prevTime) => {
            // Loop the time back to 0 when it reaches the end of the timeline
            if (prevTime >= 100) return 0;
            return prevTime + 1;
          });
        }, 1000); // Update every second
      } else if (!isPlaying && timer) {
        clearInterval(timer);
      }
  
      return () => {
        if (timer) clearInterval(timer);
      };
    }, [isPlaying]);

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
  const handleContextMenu = (e: React.MouseEvent, svg: string) => {
    e.preventDefault();
    setSelectedSvg(svg);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleDeleteSvg = () => {
    if (selectedSvg) {
      // Remove from state
      const updatedList = svgDataList.filter((svg) => svg !== selectedSvg);
      setSvgDataList(updatedList);

      // Update localStorage
      localStorage.setItem("uploadedSVGs", JSON.stringify(updatedList));

      // Reset selected SVG
      setSelectedSvg(null);
    }
    setContextMenuPosition(null); // Hide context menu
  };



  const startDrag = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const onDrag = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    setSvgPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  return (
    <div className="container">
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
          <div className="svg-thumb-container">
            {svgDataList.length > 0 ? (
              svgDataList.map((svg, index) => (
                <div
                  key={index}
                  onClick={() => handleSvgClick(svg)}
                  onContextMenu={(e) => handleContextMenu(e, svg)}
                  dangerouslySetInnerHTML={{ __html: svg }}
                  style={{
                    height: "200px",
                    border: "1px solid #ccc",
                    marginBottom: "20px",
                    cursor: "pointer",
                  }}
                  className={selectedSvg === svg ? "active" : ""}
                />
              ))
            ) : (
              <p>No SVGs uploaded yet.</p>
            )}
             {/* Context Menu */}
        {contextMenuPosition && (
          <div
            className="context-menu"
            style={{
              position: "absolute",
              top: `${contextMenuPosition.y}px`,
              left: `${contextMenuPosition.x}px`,
              background: "#fff",
              border: "1px solid #ccc",
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
              zIndex: 10,
            }}
          >
            <button onClick={handleDeleteSvg} style={{ padding: "8px 12px" }}>
              Delete SVG
            </button>
          </div>
        )}
          </div>
          <div className="layers-prev-container">
            <h1 className="main-heading">Layers</h1>
            <ul>
              {parseSvgLayers(selectedSvg).map((layer) => (
                <li key={layer.id}>
                  {/* Main Layer */}
                  <button
                    onClick={() => handleLayerClick(layer.id)}
                    style={{
                      background: selectedLayers.includes(layer.id) ? "lightblue" : "transparent",
                      padding: "8px",
                      cursor: "pointer",
                      margin: "4px 0",
                      width: "100%",
                      color: "black", // Main layer in black
                    }}
                  >
                    {layer.id}
                  </button>

                  
                  {/* Children */}
                  {layer.children.length > 0 && (
                    <ul style={{ paddingLeft: "16px" }}>
                      {layer.children.map((child, childIndex) => (
                        <li key={`${layer.id}-child-${childIndex}`}>
                          <button
                            onClick={() => handleLayerClick(child.id || `${layer.id}-child-${childIndex}`)}
                            style={{
                              display: 'none',
                              background: selectedLayers.includes(child.id) ? "lightcoral" : "transparent",
                              padding: "8px",
                              cursor: "pointer",
                              margin: "4px 0",
                              width: "100%",
                              color: "red", // Children in red
                            }}
                          >
                            {child.id || `Child ${childIndex}`}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
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
            </div>
           
          </>
        ) : (
          <p>Select an SVG to preview it here.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
