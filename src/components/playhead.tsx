import React from 'react';

function PlayHead({
  playheadPosition,
  cumulativeDurations,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
}) {
  const isRulerVisible = cumulativeDurations && cumulativeDurations.length > 0;

  return (
    <>
      <div
        className="timeline"
        style={{
          position: 'relative',
          height: '30px',
          marginBottom: '20px',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Conditionally render the playhead only if the ruler is visible */}
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
}

export default PlayHead;
