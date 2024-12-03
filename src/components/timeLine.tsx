import React from 'react'

interface PreviewProps {
  play: () => void;
  pause: () => void;
  timelineRef: React.RefObject<HTMLDivElement>; // Update timelineRef type to be a ref object
  playheadPosition: number;
  slideForTimeline: string; // Make sure slideForTimeline is a string type for SVG markup
}

const TimeLine = ({ play, pause, timelineRef, playheadPosition, slideForTimeline }: PreviewProps) => {
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
        <div className="svg-container-for-timeline">
          {slideForTimeline ? (
            <div
              dangerouslySetInnerHTML={{
                __html: slideForTimeline,
              }}
              style={{ maxHeight: "600px" }}
            />
          ) : (
            <p>No SVG available</p> // Optional: Handle cases where slideForTimeline is empty
          )}
        </div>
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
  )
}

export default TimeLine;
