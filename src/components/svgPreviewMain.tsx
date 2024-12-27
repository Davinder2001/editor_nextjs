import React, { useEffect, useRef } from "react";

interface PreviewProps {
  backgroundImage: string | null;
  svgContainerRef: React.RefObject<HTMLCanvasElement>;
  svgPosition: { x: number; y: number };
  setSvgPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  applyLayerStyles: (svg: string, layersToHighlight: string[]) => string;
  selectedSvg: string | null;
  selectedLayers: string[];
}

const SvgPreviewMain: React.FC<PreviewProps> = ({
  backgroundImage,
  svgContainerRef,
  svgPosition,
  setSvgPosition,
  applyLayerStyles,
  selectedSvg,
  selectedLayers,
  
}) => {
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default drag behavior
    e.stopPropagation(); // Prevent propagation to parent elements

    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - svgPosition.x,
      y: e.clientY - svgPosition.y,
    };
  };

  const onDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDragging.current) return;

    setSvgPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const stopDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    isDragging.current = false;
  };

  useEffect(() => {
    if (!svgContainerRef.current) {
      return;
    }
  
    const canvas = svgContainerRef.current;
    const ctx = canvas.getContext("2d");
  
    if (!ctx) {
      console.error("Canvas context could not be initialized.");
      return;
    }
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    if (selectedSvg) {
      // Load the SVG content dynamically
      const svgContent = applyLayerStyles(selectedSvg, selectedLayers);
      const img = new Image();
      const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
  
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctx.drawImage(img, svgPosition.x, svgPosition.y, canvas.width, canvas.height);
        URL.revokeObjectURL(url); // Clean up the object URL
      };
  
      img.onerror = () => {
        console.error("Failed to load SVG image.");
      };
  
      img.src = url;
    } else {
      // Render an empty canvas with placeholder text
      ctx.fillStyle = "#ffffff"; // Set canvas background color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      ctx.fillStyle = "#555"; // Set text color
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "Select an SVG to preview it here.",
        canvas.width / 2,
        canvas.height / 2
      );
    }
  }, [svgContainerRef, selectedSvg, selectedLayers, svgPosition, applyLayerStyles]);
  
  

  return (
    <div className="right-side-inner">
      {!selectedSvg ? (
        <div
          // style={{
          //   height: "450px",
          //   width: "800px",
          //   display: "flex",
          //   justifyContent: "center",
          //   alignItems: "center",
          //   border: "1px solid #000",
          //   backgroundColor: "#f0f0f0",
          // }}
        >
          <p style={{ fontSize: "18px", color: "#555" }}>No SVG selected. Upload or select an SVG to preview.</p>
        </div>
      ) : (
        <canvas
          ref={svgContainerRef}
          height={600}
          width={800}
          className="svg-preview-container"
          onMouseDown={startDrag}
          onMouseMove={onDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          style={{
            cursor: "move",
            border: "1px solid #000",
            backgroundImage: `url(${backgroundImage || ''})`,
            backgroundSize: "cover", // Ensures the background image covers the canvas
            backgroundPosition: "center", // Centers the image
          }}
        />
      )}
    </div>
  );
};

export default SvgPreviewMain;
