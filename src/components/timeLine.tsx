import React, { useState } from 'react';

interface PreviewProps {
  play: () => void;
  pause: () => void;
  timelineRef: React.RefObject<HTMLDivElement>;
  playheadPosition: number;
  slideForTimeline: string; // SVG markup
  svgContainerRef: () => any;
}

const TimeLine = ({ play, pause, timelineRef, playheadPosition, slideForTimeline, svgContainerRef }: PreviewProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [selectedSvg, setSelectedSvg] = useState<string | null>(null);

  const handleSvgClick = () => {
    setIsSelected(!isSelected);
    setSelectedSvg(isSelected ? null : slideForTimeline); // Capture or deselect the SVG
  };
console.log(selectedSvg)
//   const handlePerformTask = () => {
//     if (selectedSvg) {
//       // Perform some task with the selected SVG
//       console.log("Performing a task with the selected SVG:", selectedSvg);
//       playWalkingAnimation()
//       // Add any additional functionality here as needed
//     } else {
//       console.log("No SVG selected");
//     }
//   };

  return (
    <>
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
        <div className="svg-container-for-timeline"
         ref={svgContainerRef}
         >
          {slideForTimeline ? (
            <div
              onClick={handleSvgClick}
              dangerouslySetInnerHTML={{
                __html: slideForTimeline,
              }}
              style={{
                maxHeight: "600px",
                border: isSelected ? "2px solid blue" : "1px solid #ccc",
                cursor: "pointer",
              }}
            />
          ) : (
            <p>No SVG available</p>
          )}
        </div>

      

        {/* Timeline */}
        <div
          className="timeline-test"
          ref={timelineRef}
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
    </>
  );
};

export default TimeLine;
