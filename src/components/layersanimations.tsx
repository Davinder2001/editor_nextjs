import React from "react";
import Animations from "./animations";
import TimeLine from "./timeLine";

interface Slide {
  svg: string;
  animationType: string | null;
  duration: number;
  index: number; // Unique index for each slide
  isPlaying: boolean;
}

interface TimelineProps {
  
  handleWalkingAnimation: () => void;
  handlehandstandAnimation: () => void;
  slideForTimeline: Slide[];
  handleSvgClick: (svg: string, slideIndex: number) => void;
  replayActivities: () => void;
  playheadPosition: number;
  currentReplayIndex: number | null;
  handleMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
  playPauseAni: () => void;
  setLayerIndex: React.Dispatch<React.SetStateAction<number | null>>;
  downloadVideo: () => void;
  dragging: boolean;
  playheadRef:React.RefObject<HTMLDivElement>;
}

const Layersanimations: React.FC<TimelineProps> = ({
 
  handleWalkingAnimation,
  handlehandstandAnimation,
  currentReplayIndex,
  slideForTimeline,
  replayActivities,
  handleSvgClick,
  playheadPosition,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  playPauseAni,
  setLayerIndex,
  downloadVideo,
  dragging,
  playheadRef,
  handleMouseLeave
}) => {
  return (
    <>
      <div className="layers-prev-container">
        <h1 className="main-heading">Animations</h1>
        <div className="layersOuter">
          <Animations
          
            handleWalkingAnimation={handleWalkingAnimation}
            handlehandstandAnimation={handlehandstandAnimation}
          />
        </div>
      </div>

      <div className="timeline">
        <TimeLine
          currentReplayIndex={currentReplayIndex}
          slideForTimeline={slideForTimeline}
          replayActivities={replayActivities}
          handleSvgClick={handleSvgClick}
          playheadPosition={playheadPosition}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          playPauseAni={playPauseAni}
          setLayerIndex={setLayerIndex}
          downloadVideo={downloadVideo}
          dragging={dragging}
          playheadRef={playheadRef}
          handleMouseLeave={handleMouseLeave}
        />
      </div>
    </>
  );
};

export default Layersanimations;
