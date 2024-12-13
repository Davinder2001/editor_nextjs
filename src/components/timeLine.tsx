import PlayHead from "./playhead";

interface Slide {
  svg: string;
  animationType: string | null;
  duration: number;
  index: number;
  isPlaying: boolean;
}

interface TimelineProps {
  slideForTimeline: {
    svg: string;
    animationType: string | null;
    duration: number;
    index: number;
    isPlaying: boolean; // New property to track play state
  }[];
  handleSvgClick: (svg: string, index: number) => void; // Function to handle SVG click
  replayActivities: () => void; // Function to replay activities
  downloadVideo: () => void; // Function to download video
  playheadPosition: number; // Position of the playhead
  currentReplayIndex: number | null; // Index of the currently replaying slide
  handleMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void; // Mouse down handler
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void; // Mouse move handler
  handleMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void; // Mouse up handler
  playPauseAni: () => void; // Function to toggle play/pause
}

const TimeLine: React.FC<TimelineProps> = ({
  slideForTimeline,
  handleSvgClick,
  replayActivities,
  downloadVideo,
  playheadPosition,
  currentReplayIndex,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  playPauseAni,
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
            borderTop: "1px solid gray",
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
                  fontSize: "10px",
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
      <div
        key={slide.index}
        
        className={`timeline-wrapper ${
          currentReplayIndex === slide.index ? "active" : ""
        }`}
      >
        <div
          dangerouslySetInnerHTML={{ __html: slide.svg }}
          onClick={() => handleSvgClick(slide.svg, slide.index)}  
        />
        <p>{slide.animationType}</p>
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
