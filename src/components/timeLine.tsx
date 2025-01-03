import { ANIMATION_TIME_LINE, FIXED_ANIMATION_TIME_LINE } from "@/utils/animationsType";
import { Slide, TimelineProps } from "@/utils/types";
import React from "react";
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
  dragging,
  playheadRef,
  playAndPause
  
}) => {
 
  const fixedDuration = ANIMATION_TIME_LINE;  
  const totalDurationInMs = slideForTimeline.length * fixedDuration || FIXED_ANIMATION_TIME_LINE; 
  const totalSeconds = Math.ceil(totalDurationInMs / 1000);

  

  return (
    <div className="timeline-container">
      <h3>Timeline:</h3>
      <div className="timeline_buttons">
        <button onClick={playAndPause} style={{ marginTop: "0px" }}>
        Play All Animations
        </button>
        <button onClick={replayActivities} style={{ marginTop: "0px" }}>
        Download as Mp4
        </button>
        
        <button style={{ marginBottom: "10px" }} onClick={playPauseAni}>
          Play Single Animation
        </button>
      </div>

      {/* Ruler */}
      <div
        className="time-ruler-container"
        style={{
          position: "relative",
          marginTop: "20px",
          borderTop: "2px solid black", 
          height: "40px",
        }}
      >
        {/* Major and Minor Ticks */}
        {Array.from({ length: totalSeconds * 10 + 1 }).map((_, tickIndex) => {
          const isMajorTick = tickIndex % 10 === 0;
          const leftPosition = `${(tickIndex / (totalSeconds * 10)) * 100}%`;

          return (
            <div
              key={`ruler-tick-${tickIndex}`} 
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
            marginTop: "-65px", 
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
                  <p>{slide.animationType || 'No Animation'}</p>
              </div>
            
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
