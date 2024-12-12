import React from 'react'

function PlayHead({
    playheadPosition,
    cumulativeDurations,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
}) {
    return (
        <>
            <div
                className="timeline"
                style={{
                    position: 'relative',
                    height: '30px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ccc',
                    marginBottom: '20px',
                    transition: 'left 0.2s linear',
                }}
                onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
            >
                <div
                    className="playhead"
                    style={{
                        position: 'absolute',
                        left: `${playheadPosition}%`,
                        width: '2px',
                        height: '100%',
                        backgroundColor: 'red',
                    }}
                ></div>
                <p style={{ position: 'absolute', left: `${playheadPosition}%` }}>
                    {Math.round((playheadPosition / 100) * cumulativeDurations[cumulativeDurations.length - 1])}s
                </p>
            </div>
        </>
    )
}

export default PlayHead
