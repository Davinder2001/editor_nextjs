const TimeLine: React.FC<PreviewProps> = ({
  slideForTimeline,
  selectedSvgIndex,
  handleSvgClick,
  playWalkingAnimation,
  currentReplayIndex,
}) => {
  return (
    <div className="timeline-container">
      <h3>Timeline:</h3>
      <div className="svg-container-for-timeline">
        {slideForTimeline.map((slide) => (
          <div
            key={slide.index}
            
          >
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
        ))}
      </div>
    </div>
  );
};

export default TimeLine;
