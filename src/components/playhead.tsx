import { PlayHeadProps } from '@/utils/types';
import React from 'react';
const PlayHead: React.FC<PlayHeadProps> = ({
  playheadPosition,
  cumulativeDurations,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
}) => {
  const isRulerVisible = cumulativeDurations && cumulativeDurations.length > 0;

  return (
    <>
      <div
        className="timeline"
        style={{
          position: 'relative',
          height: '30px',
          marginTop: '-68px',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
       
        {isRulerVisible && (
          <div
            className="playhead"
            style={{
              position: 'absolute',
              left: `${playheadPosition}%`,
              width: '1px',
              height: '100%',
              backgroundColor: '#007bff',
              transition: 'left 0.1s linear',
            }}
          ></div>
        )}
      </div>
    </>
  );
};

export default PlayHead;
