import { WALKING,SITTING } from "@/utils/animationsType";
import React, { useState } from "react";
import { toast } from "sonner";

interface PreviewProps {
  slideForTimeline: { svg: string; animationType: string | null }[];
  selectedSvgIndex: number | null;
  handleSvgClick: (svg: string, index: number) => void;
  playWalkingAnimation: () => void; // Pass your existing function as a prop
  
}

const TimeLine: React.FC<PreviewProps> = ({
  slideForTimeline,
  selectedSvgIndex,
  handleSvgClick,
  playWalkingAnimation,
   
}) => {
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(
    null
  );  

 
  const togglePlayPause = () => {
    if (
      selectedSvgIndex !== null &&
      slideForTimeline[selectedSvgIndex]?.animationType === WALKING 
    ) {
      if (currentPlayingIndex !== null && currentPlayingIndex !== selectedSvgIndex) {
        console.log("Resetting animation for index:", currentPlayingIndex);
      }
  
      toast.success(`Playing  animation for index: ${selectedSvgIndex}`);
      playWalkingAnimation();  
      setCurrentPlayingIndex(selectedSvgIndex);  
    }  else {
      console.log(
        toast.error(`Can't Playing animation for index: ${selectedSvgIndex} please select  ${WALKING},${SITTING} animation type first`)
       
      );
    }
  };
  

  return (
    <>
      <button onClick={togglePlayPause}>Play</button>

     <div className="svg-container-for-timeline">
  {slideForTimeline.map((slide, index) => (
    <div key={index + 100} style={{ marginBottom: "10px" }}>
      <div
        dangerouslySetInnerHTML={{ __html: slide.svg }}
        className={selectedSvgIndex === index + 100 ? "timeline active" : "timeline"} // Apply active class
        onClick={() => handleSvgClick(slide.svg, index)} // Offset index by 100
      />
      <p>{slide.animationType}</p>
    </div>
  ))}
</div>
    </>
  );
};

export default TimeLine;
