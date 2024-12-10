import React from 'react'
interface PreviewProps {
  playWalkingAnimation: () => void;
  addAnimation: () => void;
  handleWalkingAnimation: () => void;
  handlehandstandAnimation: () => void;
}

const Animations = ({ handleWalkingAnimation,handlehandstandAnimation }: PreviewProps) => {
  return (<>
    <button className=''
      style={{ marginBottom: "10px", padding: '10px', width: '100%' }}
      onClick={()=>{handleWalkingAnimation()}}
    >
      Walking
      </button>

    <button className=''
      style={{ marginBottom: "10px", padding: '10px', width: '100%' }}
      onClick={()=>handlehandstandAnimation()}
    >
      hand stand
    </button>
   
  </>
  )
}

export default Animations