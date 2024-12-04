import React, { useState } from 'react';

interface PreviewProps {
  play: () => void;
  pause: () => void;
  playheadPosition: number;
  slideForTimeline: string[]; // Array of SVG strings
}

const TimeLine = ({ play, pause, playheadPosition, slideForTimeline }: PreviewProps) => {
  const [selectedSvgIndex, setSelectedSvgIndex] = useState<number | null>(null); // Store only one selected index, or null if none selected

  const handleSvgClick = (index: number) => {
    // Set the clicked index as the only selected index
    setSelectedSvgIndex(prev => (prev === index ? null : index)); // Deselect if clicked again, else select
  };

  console.log('Selected SVG index:', selectedSvgIndex); // Log the selected index

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <button onClick={play} style={{ marginBottom: "10px" }}>
        Play Animation
      </button>
      <button onClick={pause} style={{ marginBottom: "10px" }}>
        Pause
      </button>

      {/* SVG Preview */}
      <div className="svg-container-for-timeline">
        {slideForTimeline.length > 0 ? (
          slideForTimeline.map((svg, index) => (
            <div
              key={index}
              onClick={() => handleSvgClick(index)} // Pass the index of the SVG
              dangerouslySetInnerHTML={{
                __html: svg,
              }}
              style={{
                maxHeight: "600px",
                border: selectedSvgIndex === index ? "2px solid blue" : "1px solid #ccc", // Check if this SVG index is selected
                cursor: "pointer",
                marginBottom: "10px", // Space between SVGs
              }}
            />
          ))
        ) : (
          <p>No SVG available</p>
        )}
      </div>

      {/* Timeline */}
      <div
        className="timeline-test"
        style={{
          width: "80%",
          height: "50px",
          background: "#ccc",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            position: "absolute",
            height: "100%",
            background: "blue",
            width: "2px",
            left: `${playheadPosition}%`,
          }}
        />
      </div>
    </div>
  );
};

export default TimeLine;
