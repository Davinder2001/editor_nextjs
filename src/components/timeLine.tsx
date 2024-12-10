const TimeLine: React.FC = ({
  slideForTimeline,
  selectedSvgIndex,
  handleSvgClick,
  playWalkingAnimation,
  currentReplayIndex,
  replayActivities,
  downloadVideo,
  playheadPosition,
  seconds,
}) => {
  return (
    <div className="timeline-container">
      <h3>Timeline:</h3>
      {/* Replay and Download Buttons */}
      <button onClick={replayActivities} style={{ marginTop: "20px" }}>
        Replay Activities
      </button>
      <button onClick={downloadVideo} style={{ marginTop: "20px" }}>
        Download
      </button>

     
      <div
  className="time-ruler"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
    marginBottom: "10px",
    position: "relative",
    height: "30px",
    borderBottom: "1px solid gray",
  }}
>
  {[...Array(30)].map((_, index) => (
    <div
      key={index}
      style={{
        width: "3.33%",
        textAlign: "center",
        position: "relative",
      }}
    >
      <span style={{ fontSize: "12px" }}>{index}s</span>
    </div>
  ))}
  </div>

      {/* Playhead */}
      <div
        className="timeline"
        style={{
          position: "relative",
          height: "30px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc",
          marginBottom: "20px",
           transition: "left 0.2s linear",
        }}
      >
        <div
          className="playhead"
          style={{
            position: "absolute",
            left: `${playheadPosition}%`,
            width: "2px",
            height: "100%",
            backgroundColor: "red",
          }}
        ></div>
        <p style={{ position: "absolute", left: `${playheadPosition}%` }}>
          {seconds + 1}s
        </p>
      </div>

      {/* SVG Timeline */}
      <div className="svg-container-for-timeline">
        {slideForTimeline.map((slide, index) => {
      
          return (
            <div key={slide.index} style={{ marginBottom: "10px" }}>
              <div
                dangerouslySetInnerHTML={{ __html: slide.svg }}
                className={
                  currentReplayIndex === slide.index
                    ? "timeline active"
                    : "timeline"
                }
                onClick={() => handleSvgClick(slide.svg, slide.index)}
              />
              
              <p>Animation: {slide.animationType || "None"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeLine;
