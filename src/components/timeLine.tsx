import { ANIMATION_TIME_LINE } from "@/utils/animationsType";
import React from "react";

interface Slide {
  svg: string;
  animationType: string | null;
  duration: number;
  index: number; // Unique index for each slide
  isPlaying: boolean;
}

interface TimelineProps {
  slideForTimeline: Slide[];
  handleSvgClick: (svg: string, slideIndex: number) => void;
  replayActivities: () => void;
  playheadPosition: number;
  currentReplayIndex: number | null;
  handleMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
  playPauseAni: () => void;
  setLayerIndex: React.Dispatch<React.SetStateAction<number|null>>; 
  downloadVideo:()=>void,
  dragging:boolean
  playheadRef:React.RefObject<HTMLDivElement>;
}

const TimeLine: React.FC<TimelineProps> = ({
  slideForTimeline,
  handleSvgClick,
  replayActivities,
  playheadPosition,
  currentReplayIndex,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  playPauseAni,
  setLayerIndex,
  downloadVideo,
  dragging,
  playheadRef
  
}) => {
  // Fixed duration per slide (e.g., 3 seconds)
  const fixedDuration = ANIMATION_TIME_LINE; // 3 seconds in milliseconds

  // Total duration dynamically calculated based on slides
  const totalDurationInMs = slideForTimeline.length * fixedDuration || 12000; // Default 6 seconds
  const totalSeconds = Math.ceil(totalDurationInMs / 1000);

  return (
    <div className="timeline-container">
      <h3>Timeline:</h3>
      <div className="timeline_buttons">
        <button onClick={replayActivities} style={{ marginTop: "0px" }}>
         Render Timeline
        </button>
        <button style={{ marginBottom: "10px" }} onClick={downloadVideo}>
          Download as Mp4
        </button>
        <button style={{ marginBottom: "10px" }} onClick={playPauseAni}>
          Play Animation
        </button>
      </div>

      {/* Ruler */}
      <div
        className="time-ruler-container"
        style={{
          position: "relative",
          marginTop: "20px",
          borderTop: "2px solid black", // Main ruler bar
          height: "40px",
        }}
      >
        {/* Major and Minor Ticks */}
        {Array.from({ length: totalSeconds * 10 + 1 }).map((_, tickIndex) => {
          const isMajorTick = tickIndex % 10 === 0; // Major tick for each second
          const leftPosition = `${(tickIndex / (totalSeconds * 10)) * 100}%`; // Calculate position

          return (
            <div
              key={`ruler-tick-${tickIndex}`} // Unique key for each tick
              style={{
                position: "absolute",
                left: leftPosition,
                height: isMajorTick ? "20px" : "10px",
                borderLeft: "1px solid black",
                top: 0,
              }}
            >
              {isMajorTick && tickIndex / 10 <= totalSeconds && (
                <span
                  style={{
                    position: "absolute",
                    top: "22px",
                    fontSize: "12px",
                    transform: "translateX(-50%)",
                  }}
                >
                  {tickIndex / 10}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Playhead - Show only if slides exist */}
      {slideForTimeline.length > 0 && (
        <div
          className="timeline"
          style={{
            position: "relative",
            height: "50px",
            marginTop: "-65px", // Adjust to overlap correctly with the ruler
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="playhead"
            ref={playheadRef}
            style={{
              position: "absolute",
              left: `${playheadPosition}%`,
              width: "26px",
              height: "26px",
              backgroundColor: "rgb(34, 123, 148)",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              top: "50%",
              cursor: dragging ? "grabbing" : "grab",            
            }}
          ></div>
        </div>
      )}

      {/* SVG Slides */}
      <div
        className="svg-container-for-timeline"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${totalSeconds / 3}, ${100 / (totalSeconds / 3)}%)`, // Align slides to the grid
          gap: "2px",
          alignItems: "center",
          height: "120px",  
          marginTop: "0px",
        }}
      >
        {slideForTimeline.length > 0 ? (
          slideForTimeline.map((slide: Slide) => (
            <div key={`slide-${slide.index}`} className="slide-container">
              <div
                className={`timeline-wrapper ${
                  currentReplayIndex === slide.index ? "active" : ""
                }`}
                style={{
                  border: "1px solid #ccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: slide.svg }}
                  onClick={() => {
                    handleSvgClick(slide.svg, slide.index);
                    setLayerIndex(slide.index);
                  }}
                  
                />
              </div>
              <p>{slide.animationType || 'No Animation'}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "gray", fontSize: "14px" }}>
            No slides in the timeline.
          </p>
        )}
      </div>
    </div>
  );
};

export default TimeLine;
