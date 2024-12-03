import React from 'react'
const playWalkingAnimation = () => {
    console.log("Walking Animations")
} 

const Animations = () => {
  return (
    <button className=''
    style={{ marginBottom: "10px", padding: '10px', width: '100%' }}
    onClick={playWalkingAnimation}
    >
         Walking Animation</button>
  )
}

export default Animations