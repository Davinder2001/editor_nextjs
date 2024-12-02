import React from 'react'

interface Props{
  durationInputRef:string
  playAnimation:()=>void
  pauseAnimation:()=>void
}


function PlayPause({ durationInputRef, playAnimation, pauseAnimation }:Props) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
        <input
          ref={durationInputRef}
          type="number"
          placeholder="Enter duration in seconds"
          min="1"
          style={{ padding: "8px", marginRight: "10px", fontSize: "16px" }}
        />
        <button
          onClick={playAnimation}
          style={{ padding: "8px 16px", fontSize: "16px", cursor: "pointer", marginRight: "10px" }}
        >
          Play
        </button>
        <button
          onClick={pauseAnimation}
          style={{ padding: "8px 16px", fontSize: "16px", cursor: "pointer" }}
        >
          Pause
        </button>

      </div>
    </>
  )
}

export default PlayPause