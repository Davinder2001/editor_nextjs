import React from 'react'
interface PreviewProps {
    playWalkingAnimation: () => void;
}

const Animations = ({playWalkingAnimation}: PreviewProps) => {
  return (<>
    <button className=''
    style={{ marginBottom: "10px", padding: '10px', width: '100%' }}
    onClick={playWalkingAnimation}
    >
         Walking</button>

         <button className=''
         style={{ marginBottom: "10px", padding: '10px', width: '100%' }}>
            Sitting
         </button>
         <button className=''
         style={{ marginBottom: "10px", padding: '10px', width: '100%' }}>
            Jumping
         </button>
             </>
  )
}

export default Animations