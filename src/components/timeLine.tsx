import React from 'react';
import PlayHead from './playhead';

interface Timeline {
  slideForTimeline: { svg: string; animationType: string | null; duration: number; index: number }[];
  selectedSvgIndex: number;
  handleSvgClick: (svg: string, index: number) => void;
  replayActivities: () => void;
  downloadVideo: () => void;
  playheadPosition: number;
  seconds: number;
  currentReplayIndex: number | null;
}

interface Slide {
  index: number;
  svg: string;
  animationType?: string | null;
  duration: number; // Duration in milliseconds
}

const TimeLine: React.FC<Timeline> = ({
  slideForTimeline,
  selectedSvgIndex,
  handleSvgClick,
  replayActivities,
  downloadVideo,
  playheadPosition,
  seconds,
  currentReplayIndex,
  handleMouseDown,
        handleMouseMove,
        handleMouseUp
}) => {
  // Filter slides with animations assigned
  const filteredSlides = slideForTimeline.filter((slide) => slide.animationType);

  
  const cumulativeDurations = filteredSlides.reduce<number[]>((acc, slide) => {
    const lastTime = acc.length > 0 ? acc[acc.length - 1] : 0;
    const newTime = lastTime + slide.duration / 1000; // Convert ms to seconds
    return [...acc, newTime];
  }, []);

  
  const incrementalSeconds = Array.from(
    { length: Math.ceil(cumulativeDurations[cumulativeDurations.length - 1] || 0) },
    (_, i) => i + 1
  );

  return (
    <div className="timeline-container">
      <h3>Timeline:</h3>
      {/* Replay and Download Buttons */}
      <button onClick={replayActivities} style={{ marginTop: '20px' }}>
        Render Timeline
      </button>
      <button onClick={downloadVideo} style={{ marginTop: '20px' }}>
        Download as Mp4
      </button>

      {/* Time Ruler with Incremental Seconds */}
      {filteredSlides.length > 0 && (
        <div
          className="time-ruler"
          style={{
            display: 'flex',
            position: 'relative',
            height: '40px',
            marginTop: '10px',
            marginBottom: '10px',
            borderBottom: '1px solid gray',
          }}
        >
          {incrementalSeconds.map((time, index) => (
            <div
              key={index}
              style={{
                width: `${100 / incrementalSeconds.length}%`,
                textAlign: 'center',
                fontSize: '12px',
              }}
            >
              <span>{time}s</span>
            </div>
          ))}
        </div>
      )}

    
      <PlayHead playheadPosition={playheadPosition}
        cumulativeDurations={cumulativeDurations}  handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
      
        />

      {/* SVG Slides */}
      <div className="svg-container-for-timeline">
        {slideForTimeline.map((slide: Slide, index) => (
          <div key={slide.index} style={{ marginBottom: '10px' }}>
            <div
              dangerouslySetInnerHTML={{ __html: slide.svg }}
              className={
                currentReplayIndex === slide.index ? 'timeline active' : 'timeline'
              }
              onClick={() => handleSvgClick(slide.svg, slide.index)}
            />
            <p>Animation: {slide.animationType || 'None'}</p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeLine;
