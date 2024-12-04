import React from 'react';

interface PreviewProps {
  play: () => void;
  pause: () => void;
  playheadPosition: number;
  slideForTimeline: string[];
  selectedSvg: string | null;
  selectedSvgIndex: number;
  handleSvgClick: (svg: string, index: number) => void;
  playWalkingAnimation: () => void;
}

const TimeLine = ({
  play,
  pause,
  playheadPosition,
  slideForTimeline,
  selectedSvg,
  selectedSvgIndex,
  handleSvgClick,
}: PreviewProps) => {

  console.log(`selectedSvgIndex in timeline`)
  console.log(selectedSvgIndex)
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
              dangerouslySetInnerHTML={{ __html: svg }}
              style={{
                maxHeight: "600px",
                cursor: "pointer",
                marginBottom: "10px",
              }}
              // Apply the "active" class to the selected SVG
              className={selectedSvgIndex === index + 100 ? "active" : ""}
              onClick={() => handleSvgClick(svg, index + 100,)} // Update the selected index
            />
          ))
        ) : (
          <p>No SVG available</p>
        )}
      </div>

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
