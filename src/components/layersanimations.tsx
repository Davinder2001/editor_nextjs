import React from "react";
import Animations from "./animations";
import TimeLine from "./timeLine";
import { TimelineProps, AnimationsTypes } from "@/utils/types";

type CombinedProps = TimelineProps & AnimationsTypes;
const Layersanimations: React.FC<CombinedProps> = ({
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
  playAndPause
 
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
          playAndPause={playAndPause}
         
        />
      </div>
    </>
  );
};

export default Layersanimations;
