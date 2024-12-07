import { WALKING,SITTING } from "@/utils/animationsType";
import React, { useState } from "react";
import { toast } from "sonner";

interface PreviewProps {
  slideForTimeline: { svg: string; animationType: string | null }[];
  selectedSvgIndex: number | null;
  handleSvgClick: (svg: string, index: number) => void;
  playWalkingAnimation: () => void;  
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
    // Find the slide matching the selectedSvgIndex
    const selectedSlide = slideForTimeline.find((slide) => slide.index === selectedSvgIndex);
  
    if (selectedSlide && selectedSlide.animationType === WALKING) {
      if (currentPlayingIndex !== null && currentPlayingIndex !== selectedSvgIndex) {
        console.log("Resetting animation for index:", currentPlayingIndex);
      }
  
      toast.success(`Playing animation for index: ${selectedSvgIndex}`);
      playWalkingAnimation();
      setCurrentPlayingIndex(selectedSvgIndex);
    } else {
      toast.error(
        `Can't play animation for index: ${selectedSvgIndex}. Please select ${WALKING}, ${SITTING} animation type first.`
      );
    }
  };
  
  

  return (
    <>
      <button onClick={togglePlayPause}>Play</button>

     <div className="svg-container-for-timeline">
  {slideForTimeline.map((slide) => (
    <div key={slide?.index} style={{ marginBottom: "10px" }}>
      <div
        dangerouslySetInnerHTML={{ __html: slide.svg }}
        className={selectedSvgIndex === slide.index + 100 ? "timeline active" : "timeline"} // Apply active class
        onClick={() => handleSvgClick(slide.svg, slide?.index)} // Offset index by 100
      />
      <p>{slide?.animationType}</p>
    </div>
  ))}
</div>
    </>
  );
};

export default TimeLine;
