import React from 'react'
interface PreviewProps {
    playWalkingAnimation: () => void;
    addAnimation: () => void;
}

const Animations = ({playWalkingAnimation, addAnimation}: PreviewProps) => {
  return (<>
    <button className=''
    style={{ marginBottom: "10px", padding: '10px', width: '100%' }}
    onClick={playWalkingAnimation}
    >
         Walking</button>

         <button className=''
               style={{ marginBottom: "10px", padding: '10px', width: '100%' }}
               onClick={addAnimation}
               >
               Add
         </button>
         <button className=''
         style={{ marginBottom: "10px", padding: '10px', width: '100%' }}>
            Jumping
         </button>
             </>
  )
}

export default Animations