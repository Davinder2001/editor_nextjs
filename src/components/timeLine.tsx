import React, { useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

interface PreviewProps {
  play: () => void;
  pause: () => void;
  playheadPosition: number;
  slideForTimeline: string[];
  selectedSvg: string | null;
  selectedSvgIndex: number | null;
  handleSvgClick: (svg: string, index: number) => void;
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
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
      className='timeline-main-container'
    >
      <button className='play-and-pause-btn' onClick={handlePlayPause} style={{ marginBottom: "10px" }}>
        {isPlaying ? <FaPause /> : <FaPlay />}
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
              className={selectedSvgIndex === index + 100 ? "active" : ""}
              onClick={() => handleSvgClick(svg, index + 100)}
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
          display: 'none'
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
