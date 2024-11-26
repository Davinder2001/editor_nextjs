'use client';
import React, { useState, useEffect } from "react";
import anime from "animejs"; // Import anime.js

const Page: React.FC = () => {
  const [svgDataList, setSvgDataList] = useState<string[]>([]);
  const [selectedSvg, setSelectedSvg] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; index: number | null } | null>(null);

  // Load SVGs from local storage when the component mounts
  useEffect(() => {
    const savedSVGs = localStorage.getItem("uploadedSVGs");
    if (savedSVGs) {
      const svgList = JSON.parse(savedSVGs);
      setSvgDataList(svgList);
      setSelectedSvg(svgList[0] || null); // Set the first SVG as the default selected one
    }
  }, []);

  useEffect(() => {
    if (selectedSvg) {
      // After the selected SVG is set, animate the hand (or any other element by its ID)
      const handElement = document.getElementById('hand-details-back');
      if (handElement) {
        anime({
          targets: handElement,
          translateX: 100,  // Example animation (move hand horizontally by 100px)
          translateY: 50,   // Move vertically by 50px
          duration: 1000,    // Duration of the animation
          easing: 'easeInOutQuad',  // Easing function
        });
      }
    }
  }, [selectedSvg]); // Run the animation whenever selectedSvg changes

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

            // Update the state and local storage after reading all files
            if (newSvgDataList.length === files.length) {
              const updatedList = [...svgDataList, ...newSvgDataList];
              setSvgDataList(updatedList);
              localStorage.setItem("uploadedSVGs", JSON.stringify(updatedList));

              // Automatically set the first SVG as the selected one after upload
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
    setSelectedSvg(svg); // Update the selected SVG when a thumbnail is clicked
  };

  const handleSvgDelete = (index: number) => {
    const updatedList = [...svgDataList];
    updatedList.splice(index, 1);
    setSvgDataList(updatedList);
    localStorage.setItem("uploadedSVGs", JSON.stringify(updatedList));
    setContextMenu(null); // Close the context menu after deletion

    // If the deleted SVG was selected, reset to the first SVG (if available)
    if (selectedSvg === svgDataList[index]) {
      setSelectedSvg(updatedList[0] || null);
    }
  };

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, index });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null); // Close context menu
  };

  return (
    <div className="p-4 flex" onClick={handleCloseContextMenu}>
      <h1 className="main-heading">Editor</h1>
      <div className="container">
        <div className="left-side">
          {/* Left side with all SVG thumbnails */}
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
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {svgDataList.length > 0 ? (
              svgDataList.map((svg, index) => (
                <div
                  key={index}
                  onClick={() => handleSvgClick(svg)}
                  onContextMenu={(event) => handleRightClick(event, index)} // Handle right-click
                  dangerouslySetInnerHTML={{ __html: svg }}
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    border: "1px solid #ccc",
                    padding: "8px",
                    cursor: "pointer",
                    marginBottom: "20px",
                  }}
                  className={selectedSvg === svg ? "active" : ""} // Apply active class
                />
              ))
            ) : (
              <p>No SVGs uploaded yet.</p>
            )}
          </div>
        </div>
        <div className="right-side">
          {/* Right side with big preview */}
          <div className="w-2/3 pl-4 border-l">
            {selectedSvg ? (
              <div
              onClick={() => handleSvgClick(selectedSvg)}
                onContextMenu={(event) => handleRightClick(event, selectedSvg)}
                dangerouslySetInnerHTML={{ __html: selectedSvg }}
                style={{
                  width: "100%",
                  height: "auto",
                  border: "1px solid #ccc",
                  padding: "16px",
                }}
              />
            ) : (
              <p>Select an SVG to preview it here.</p>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{
            position: "absolute",
            top: contextMenu.y,
            left: contextMenu.x,
            border: "1px solid #ccc",
            backgroundColor: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <button
            onClick={() => handleSvgDelete(contextMenu.index!)}
            style={{
              background: "red",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
