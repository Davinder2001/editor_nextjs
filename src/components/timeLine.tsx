import PlayHead from "./playhead";

const TimeLine: React.FC<Timeline> = ({
  slideForTimeline,
 
  handleSvgClick,
  replayActivities,
  downloadVideo,
  playheadPosition,
  currentReplayIndex,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  playPauseAni
}) => {
  // Filter slides with animations assigned
  const filteredSlides = slideForTimeline.filter((slide) => slide.animationType);

  // Calculate cumulative durations (in milliseconds)
  const cumulativeDurations = filteredSlides.reduce<number[]>((acc, slide) => {
    const lastTime = acc.length > 0 ? acc[acc.length - 1] : 0;
    const newTime = lastTime + slide.duration; // Keep duration in milliseconds
    return [...acc, newTime];
  }, []);

  // Total duration in milliseconds
  const totalDurationInMs = cumulativeDurations[cumulativeDurations.length - 1] || 0;
  const totalDurationInSeconds = Math.ceil(totalDurationInMs / 1000);

  return (
    <div className="timeline-container">
      <h3>Timeline:</h3>
      <button onClick={replayActivities} style={{ marginTop: "20px" }}>
        Render Timeline
      </button>
      <button onClick={downloadVideo} style={{ marginTop: "20px" }}>
        Download as Mp4
      </button>
      <button style={{ marginBottom: "10px" }} onClick={playPauseAni}>
        Play
      </button>

      {/* Time Ruler */}
      {filteredSlides.length > 0 && (
        <div
          className="time-ruler"
          style={{
            position: "relative",
            height: "50px",
            marginTop: "10px",
            borderTop: "1px solid gray"
          }}
        >
          {Array.from(
            { length: totalDurationInMs / 100 + 1 }, // Include the last increment
            (_, i) => i * 100
          ).map((time, index) => {
            const isSecond = time % 1000 === 0; // Check if the tick is a whole second
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: `${(time / totalDurationInMs) * 100}%`,
                  height: isSecond ? "20px" : "10px",
                  borderLeft: "2px solid gray",
                  transform: "translateX(-50%)",
                  fontSize: "10px"
                }}
              >
                {isSecond && (
                  <span style={{ position: "absolute", top: "25px" }}>
                    {time / 1000}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <PlayHead
        playheadPosition={playheadPosition}
        cumulativeDurations={cumulativeDurations}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
      />

      {/* SVG Slides */}
      <div className="svg-container-for-timeline">
  {slideForTimeline.length > 0 ? (
    slideForTimeline.map((slide: Slide) => (
      <div key={slide.index} style={{ marginBottom: "10px" }} className="timeline-wrapper">
        <div
          dangerouslySetInnerHTML={{ __html: slide.svg }}
          className={
            currentReplayIndex === slide.index
              ? "timeline active"
              : "timeline"
          }
          onClick={() => handleSvgClick(slide.svg, slide.index)}
        />
 
        <p> {slide.animationType}</p>
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
