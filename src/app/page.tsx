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

  const [animationDuration, setAnimationDuration] = useState(10000); // Default duration (10 seconds)
  const [isPaused, setIsPaused] = useState(false); // Animation paused state
  const [startTime, setStartTime] = useState<number | null>(null); // Start time for animation, type updated
  const [pausedTime, setPausedTime] = useState<number | null>(null); // Paused time state with correct type
  const svgContainerRef = useRef<HTMLDivElement | null>(null); // Container for SVG content
  const durationInputRef = useRef<HTMLInputElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

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


  const animate = (timestamp: number) => {
    // Ensure animation starts correctly
    if (startTime === null) {
      setStartTime(timestamp);
    }

    const elapsedTime = timestamp - (startTime ?? 0);

    if (elapsedTime >= animationDuration) {
      console.log("Animation completed.");
      return; // Stop animation after the specified duration
    }

    if (isPaused) return; // Stop if paused

    // Ensure the SVG container exists
    const svgElement = svgContainerRef.current?.querySelector("svg");
    if (!svgElement) {
      console.warn("SVG element not found in the container.");
      return;
    }

    // Select specific elements for animation
    const leftHand = svgElement.querySelector("#hand-details-back");
    const rightHand = svgElement.querySelector("#hand-details-front");
    const leftLeg = svgElement.querySelector("#pant-back-details");
    const rightLeg = svgElement.querySelector("#pant-front-details");

    // Log warnings if specific elements are missing
    if (!leftHand || !rightHand || !leftLeg || !rightLeg) {
      console.error("Some elements are missing in the SVG.");
      return;
    }

    // Animation logic
    const stepDuration = 1500; // Duration of one animation cycle in ms
    const elapsed = elapsedTime % stepDuration;
    const progress = elapsed / stepDuration;

    // Calculate swing values
    const handSwing = Math.sin(progress * 2 * Math.PI) * 20; // Hand swing amplitude: 20 degrees
    const legSwing = Math.cos(progress * 2 * Math.PI) * 20; // Leg swing amplitude: 20 degrees

    // Apply transforms
    leftHand.setAttribute("transform", `rotate(${handSwing} 920 400)`);
    rightHand.setAttribute("transform", `rotate(${-handSwing} 960 400)`);
    leftLeg.setAttribute("transform", `rotate(${legSwing} 1000 500)`);
    rightLeg.setAttribute("transform", `rotate(${-legSwing} 1000 500)`);

    // Request next frame
    animationFrameId.current = requestAnimationFrame(animate);
  };


  

  const playAnimation = () => {
    const userDuration = parseInt(durationInputRef.current?.value || "0", 10);

    if (userDuration && userDuration > 0) {
      setAnimationDuration(userDuration * 1000); // Update duration
    } else {
      setAnimationDuration(10000); // Default duration
    }

    if (isPaused && pausedTime !== null) {
      setStartTime((prevStartTime) => (prevStartTime ?? 0) + performance.now() - pausedTime); // Adjust start time
      setIsPaused(false);
      setPausedTime(null);
    } else {
      setStartTime(null); // Reset start time for a fresh animation
    }

    animationFrameId.current = requestAnimationFrame(animate);
  };

  const pauseAnimation = () => {
    setIsPaused(true);
    setPausedTime(performance.now()); // Save pause time
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); // Stop animation
  };



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
              {selectedSvg && parseSvgLayers(selectedSvg).map((layer) => (
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
              <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                <input
                  ref={durationInputRef}
                  type="number"
                  placeholder="Enter duration in seconds"
                  min="1"
                  style={{ padding: "8px", marginRight: "10px", fontSize: "16px" }}
                />
                <button
                  onClick={playAnimation}
                  style={{ padding: "8px 16px", fontSize: "16px", cursor: "pointer", marginRight: "10px" }}
                >
                  Play
                </button>
                <button
                  onClick={pauseAnimation}
                  style={{ padding: "8px 16px", fontSize: "16px", cursor: "pointer" }}
                >
                  Pause
                </button>
              
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