import React from 'react'
interface PreviewProps {
    play: ()=> void;
    pause: ()=> void;
    timelineRef: string;
    playheadPosition: number;
}

const TimeLine = ({play, pause, timelineRef, playheadPosition } : PreviewProps) => {
  return (
    <>
         <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px",
            }}
        >
            <button onClick={play} style={{ marginBottom: "10px" }}>
                Play Animation
            </button>
            <button onClick={pause} style={{ marginBottom: "10px" }}>
                Pause
            </button>

            <div
                className="timeline-test"
                ref={timelineRef}
                style={{
                    width: "80%",
                    height: "50px",
                    background: "#ccc",
                    position: "relative",
                    cursor: "pointer",
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
    </>
  )
}

export default TimeLine