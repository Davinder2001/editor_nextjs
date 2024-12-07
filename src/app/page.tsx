'use client';

import Animations from "@/components/animations";

import Layers from "@/components/layers";
// import Layers from "@/components/layers";
import Preview from "@/components/preview";
import { ANIMATION_TIME_LINE, WALKING } from "@/utils/animationsType";

// import SelectSvg from "@/components/selectSvg";
import React, { useState, useEffect, useRef } from "react";

const Page: React.FC = () => {
  const [svgDataList, setSvgDataList] = useState<string[]>([]);
  const [selectedSvg, setSelectedSvg] = useState<string | null>(null);
  // const [slideForTimeline, setAddSlideRimeline] = useState<string | null>(null);
  const [slideForTimeline, setAddSlideRimeline] = useState<{ svg: string, animationType: string | null }[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [animationDuration, setAnimationDuration] = useState(ANIMATION_TIME_LINE);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null); // Start time for animation, type updated
  const [pausedTime, setPausedTime] = useState<number | null>(null); // Paused time state with correct type
  const svgContainerRef = useRef<HTMLDivElement | null>(null); // Container for SVG content
  const svgContainerRef2 = useRef<HTMLDivElement | null>(null); // Container for SVG content
  const durationInputRef = useRef<HTMLInputElement | null>(null);
  // const durationInputRef2 = useRef<HTMLInputElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0); // Current time in seconds
  const [isPlaying, setIsPlaying] = useState(false); // Play/Pause state
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const svgContainerRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]); // Array of refs for 4 containers
  const [selectedSvgIndex, setSelectedSvgIndex] = useState<number>(0); // Store selected index
  const [currentIndex, setCurrentIndex] = useState(100);

  const [activityLog, setActivityLog] = useState<
    { type: string; slideIndex: number; animationType?: string }[]
  >([]);
  const [currentReplayIndex, setCurrentReplayIndex] = useState<number | null>(null);



   





















  useEffect(() => {
    const savedSVGs = localStorage.getItem("uploadedSVGs");
    if (savedSVGs) {
      const svgList = JSON.parse(savedSVGs);
      setSvgDataList(svgList);
      setSelectedSvg(svgList[0] || null);
    }

    const savedBackground = localStorage.getItem("backgroundImage");
    if (savedBackground) {
      setBackgroundImage(savedBackground);
    }
  }, []);

  const parseSvgLayers = (svg: string) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svg, "image/svg+xml");

    const getLayers = svgDoc.documentElement.querySelectorAll(":scope > g");

    const layersWithChildren = Array.from(getLayers).map((layer, index) => {
      return {
        index: index, // Index of the layer
        id: layer.id || `Layer ${index}`, // Name of the layer
        children: Array.from(layer.children) // Array of children for this layer
      };
    });

    return layersWithChildren;
  };


  const handleLayerClick = (layerId: string) => {
    setSelectedLayers([layerId]); // Select only the clicked layer
  };



  let animationStarted = false;
  let initialTimestamp = 0;

  const animate = (timestamp: number) => {
    if (!animationStarted) {
      initialTimestamp = timestamp;
      animationStarted = true;
    }

    const elapsedTime = timestamp - initialTimestamp;


    if (elapsedTime >= animationDuration) {
      console.log("Animation completed.");
      animationStarted = false;
      return;
    }

    if (isPaused) return;

    // Ensure the SVG container exists
    const svgElement = svgContainerRef.current?.querySelector("svg");
    if (!svgElement) {
      console.warn("SVG element not found in the container.");
      return;
    }

    // Select specific elements for animation
    const leftHand = svgElement.querySelector("#hand-details-back");
    const rightHand = svgElement.querySelector("#hand-details-front");

    const leftLeg = svgElement.querySelector("#pant-back-details");
    const rightLeg = svgElement.querySelector("#pant-front-details");

    const legFront = svgElement.querySelector("#leg-front");
    const legBack = svgElement.querySelector("#leg-back");

    const footFront = svgElement.querySelector("#shoe-front");
    const footBack = svgElement.querySelector("#shoe-back");

    // Log warnings if specific elements are missing
    if (
      !leftHand ||
      !rightHand ||
      !leftLeg ||
      !rightLeg ||
      !legFront ||
      !legBack ||
      !footFront ||
      !footBack
    ) {
      console.error("Some elements are missing in the SVG.");
      return;
    }

    // Animation logic
    const stepDuration = 1000;
    const elapsed = elapsedTime % stepDuration;
    const progress = elapsed / stepDuration;

    // Calculate swing values
    const handSwing = Math.sin(progress * 2 * Math.PI) * 20; // Hand swing amplitude: 20 degrees
    const legSwing = Math.cos(progress * 2 * Math.PI) * 20; // Leg swing amplitude: 20 degrees

    const legFrontSwing = Math.cos(progress * 2 * Math.PI) * 20; // Leg swing amplitude: 20 degrees
    const legBackSwing = Math.cos(progress * 2 * Math.PI) * 20; // Leg swing amplitude: 20 degrees

    const footFrontSwing = Math.cos(progress * 2 * Math.PI) * 20;
    const footBackSwing = Math.cos(progress * 2 * Math.PI) * 20;

    leftHand.setAttribute("transform", `rotate(${handSwing} 920 400)`);
    rightHand.setAttribute("transform", `rotate(${-handSwing} 960 400)`);

    // Leg rotate
    leftLeg.setAttribute("transform", `rotate(${legSwing} 1000 500)`);
    rightLeg.setAttribute("transform", `rotate(${-legSwing} 1000 500)`);

    // Rotate
    legFront.setAttribute("transform", `rotate(${-legFrontSwing} 1000 500)`);
    legBack.setAttribute("transform", `rotate(${legBackSwing} 1000 500)`);

    // Feet rotate
    footFront.setAttribute("transform", `rotate(${-footFrontSwing} 1000 500)`);
    footBack.setAttribute("transform", `rotate(${footBackSwing} 1000 500)`);

    // Request next frame
    animationFrameId.current = requestAnimationFrame(animate);
  };

  // Function to trigger animation
  const wlkingAnimationPlay = () => {
    if (!animationStarted) {
      animationFrameId.current = requestAnimationFrame(animate);
    }
  };






  const playAnimation = () => {
    // console.log('Play animation is triggerd')
    const userDuration = 30;

    if (userDuration && userDuration > 0) {
      setAnimationDuration(userDuration * 1000);
    } else {
      setAnimationDuration(10000);
    }

    if (isPaused && pausedTime !== null) {
      setStartTime((prevStartTime) => (prevStartTime ?? 0) + performance.now() - pausedTime); // Adjust start time
      setIsPaused(false);
      setPausedTime(null);
    } else {
      setStartTime(null); // Reset start time for a fresh animation
    }

    animationFrameId.current = requestAnimationFrame(animate);
  };


  const pauseAnimation = () => {
    setIsPaused(true);
    setPausedTime(performance.now()); // Save pause time
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); // Stop animation
  };


  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files) {
      const newSvgDataList: string[] = [];
      Array.from(files).forEach((file) => {
        if (file.type === "image/svg+xml") {
          const reader = new FileReader();
          reader.onload = (e) => {
            const svgContent = e.target?.result as string;
            newSvgDataList.push(svgContent);

            if (newSvgDataList.length === files.length) {
              const updatedList = [...svgDataList, ...newSvgDataList];
              setSvgDataList(updatedList);
              localStorage.setItem("uploadedSVGs", JSON.stringify(updatedList));
              setSelectedSvg(updatedList[0]);
            }
          };
          reader.readAsText(file);
        } else {
          alert(`File ${file.name} is not a valid SVG file.`);
        }
      });
    }
  };


  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedBackground = e.target?.result as string;
        setBackgroundImage(uploadedBackground);
        localStorage.setItem("backgroundImage", uploadedBackground);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const addAnimation = () => {
    const targetElement = document.querySelector('.timeline-test');
    if (targetElement) {
      targetElement.classList.toggle('animation-class');
      console.log('Animation added/removed on target element');
    }
  };


  const handleSvgClick = (svg: string, index: number) => {
    setSelectedSvg(svg);
    setSelectedLayers([]);
    setSelectedSvgIndex(index);

  };



  // console.log(`selectedSvgIndex in left and timeline`)
  // console.log(selectedSvgIndex)

  // const handleLayerClick = (layerId: string) => {
  //   setSelectedLayers([layerId]); // Select only the clicked layer
  // };


  // const parseSvgLayers = (svg: string) => {
  //   const parser = new DOMParser();
  //   const svgDoc = parser.parseFromString(svg, "image/svg+xml");

  //   const getLayers = svgDoc.documentElement.querySelectorAll(":scope > g");

  //   const layersWithChildren = Array.from(getLayers).map((layer, index) => {
  //     return {
  //       index: index, // Index of the layer
  //       id: layer.id || `Layer ${index}`, // Name of the layer
  //       children: Array.from(layer.children) // Array of children for this layer
  //     };
  //   });

  //   return layersWithChildren;
  // };

  // Handle the play/pause functionality for the timeline
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prevTime) => {
          // Loop the time back to 0 when it reaches the end of the timeline
          if (prevTime >= 100) return 0;
          return prevTime + 1;
        });
      }, 1000); // Update every second
    } else if (!isPlaying && timer) {
      clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);



  // const handleContextMenu = (e: React.MouseEvent, svg: string) => {
  //   e.preventDefault();
  //   setSelectedSvg(svg);
  //   setContextMenuPosition({ x: e.clientX, y: e.clientY });
  // };

  const handleDeleteSvg = () => {
    if (selectedSvg) {
      // Remove from state
      const updatedList = svgDataList.filter((svg) => svg !== selectedSvg);
      setSvgDataList(updatedList);

      // Update localStorage
      localStorage.setItem("uploadedSVGs", JSON.stringify(updatedList));

      // Reset selected SVG
      setSelectedSvg(null);
    }
    setContextMenuPosition(null); // Hide context menu
  };
  // const addSlideToTimeline = () => {

  //   const getSlideToTimeline = selectedSvg;
  //   setAddSlideRimeline(getSlideToTimeline); // Update state with the selected SVG value

  // } 

  // const addSlideToTimeline = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   const svgIndex = parseInt(event.currentTarget.getAttribute('data-index') || '0', 10);
  //   if (selectedSvg) {
  //     const newSlide = {
  //       svg: selectedSvg,
  //       animationType: null,
  //       index: currentIndex,  
  //       svgIndex,  
  //     };
  //     setAddSlideRimeline((prevSlides) => [...prevSlides, newSlide]);
  //     setCurrentIndex((prevIndex) => prevIndex + 1); 
  //   }
  // };



  const addSlideToTimeline = (event: React.MouseEvent<HTMLButtonElement>) => {
    const svgIndex = parseInt(event.currentTarget.getAttribute("data-index") || "0", 10);
    if (selectedSvg) {
      const newSlide = {
        svg: selectedSvg,
        animationType: null,
        index: currentIndex,
        svgIndex,
      };
      setAddSlideRimeline((prevSlides) => [...prevSlides, newSlide]);
      setCurrentIndex((prevIndex) => prevIndex + 1);

      // Log the slide addition
      setActivityLog((prevLog) => [
        ...prevLog,
        { type: "addSlide", slideIndex: currentIndex },
      ]);
    }
  };



  // const handleWalkingAnimation = () => {
  //   if (selectedSvgIndex !== null) { // Check if a slide is selected
  //     setAddSlideRimeline((prevSlides) => {
  //       const updatedSlides = prevSlides.map((slide) => {
  //         if (slide.index === selectedSvgIndex) { // Match using `slide.index` or `slide.id`
  //           return {
  //             ...slide,
  //             animationType: slide.animationType === WALKING ? null : WALKING,
  //           };
  //         }
  //         return slide;
  //       });

  //       return updatedSlides;
  //     });
  //   } else {
  //     console.warn("No slide selected for walking animation.");
  //   }
  // };



  const handleWalkingAnimation = () => {
    if (selectedSvgIndex !== null) {
      setAddSlideRimeline((prevSlides) =>
        prevSlides.map((slide) => {
          if (slide.index === selectedSvgIndex) {
            // Log the animation assignment
            setActivityLog((prevLog) => [
              ...prevLog,
              { type: "assignAnimation", slideIndex: selectedSvgIndex, animationType: WALKING },
            ]);
            return {
              ...slide,
              animationType: slide.animationType === WALKING ? null : WALKING,
            };
          }
          return slide;
        })
      );
    }
  };


  const replayActivities = () => {
    if (activityLog.length === 0) {
      console.warn("No activities to replay.");
      return;
    }
  
    activityLog.forEach((activity, i) => {
      setTimeout(() => {
        if (activity.type === "addSlide") {
          console.log(`Replaying: Added slide at index ${activity.slideIndex}`);
          setCurrentReplayIndex(activity.slideIndex); // Highlight the slide
        } else if (activity.type === "assignAnimation") {
          console.log(
            `Replaying: Assigned ${activity.animationType} animation to slide at index ${activity.slideIndex}`
          );
          setCurrentReplayIndex(activity.slideIndex); // Highlight the slide
          playAnimationForSlide(activity.slideIndex, activity.animationType);
        }
      }, i * 3000); // Delay of 3 seconds between activities
    });
  
    setTimeout(() => setCurrentReplayIndex(null), activityLog.length * 3000);
  };
  
  

  const playAnimationForSlide = (slideIndex: number, animationType?: string) => {
    const slide = slideForTimeline.find((slide) => slide.index === slideIndex);
    if (!slide) return;
  
    setSelectedSvg(slide.svg); // Show the slide in the preview
    if (animationType === WALKING) {
      console.log(`Playing walking animation for slide at index ${slideIndex}`);
      wlkingAnimationPlay(); // Trigger your walking animation function
    }
  };
  
  












  return (
    <>
      <button onClick={replayActivities} style={{ marginTop: "20px" }}>
  Replay Activities
</button>

      <div className="container">
        <div className="frame-container">
          <div className="left-side">
            <h1 className="main-heading">Upload</h1>
            <div className="choose_file-container">
              <label htmlFor="file-upload" className="custom-file-upload">
                Upload SVGs
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".svg"
                multiple
                onChange={handleUpload}
                className="hidden"
              />
            </div>
            <div className="choose_file-container">
              <label htmlFor="background-upload" className="custom-file-upload">
                Upload Background
              </label>
              <input
                id="background-upload"
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                className="hidden"
              />
            </div>
            <div className="svg-thumb-container">
              {svgDataList.length > 0 ? (
                svgDataList.map((svg, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      height: "200px",
                      border: "1px solid #ccc",
                      marginBottom: "50px",
                      cursor: "pointer",
                    }}
                    className={selectedSvgIndex === index ? "active" : ""}
                  >
                    <div
                      onClick={() => handleSvgClick(svg, index)}
                      dangerouslySetInnerHTML={{ __html: svg }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />


                    <div className="add-and-delete-buttons">
                      <button
                        onClick={(event) => addSlideToTimeline(event)}
                        data-index={index} // Pass the index dynamically
                        style={{
                          padding: "12px 10px",
                          backgroundColor: "#4CAF50",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          width: "50%",
                        }}
                      >
                        Add Slide
                      </button>

                      <button
                        onClick={() => handleDeleteSvg()} // Delete SVG
                        style={{
                          padding: "12px 10px",
                          backgroundColor: "#f44336", // Red for "Delete"
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          width: "50%"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No SVGs uploaded yet.</p>
              )}
            </div>
            <div className="layers-prev-container">
              <h1 className="main-heading">Animations</h1>
              <div className="layersOuter">
                {/* <Layers selectedSvg={selectedSvg}
                      parseSvgLayers={parseSvgLayers}
                      selectedLayers={selectedLayers}
                      handleLayerClick={handleLayerClick}
              /> */}
                <Animations playWalkingAnimation={wlkingAnimationPlay} addAnimation={addAnimation} handleWalkingAnimation={handleWalkingAnimation} />
              </div>
            </div>
          </div>
          <div className="right-side">
            <Preview
              setSvgDataList={setSvgDataList}
              selectedSvg={selectedSvg}
              backgroundImage={backgroundImage}
              svgContainerRef={svgContainerRef}
              svgContainerRef2={svgContainerRef2}
              setSelectedSvg={setSelectedSvg}
              setBackgroundImage={setBackgroundImage}
              isPlaying={isPlaying}
              togglePlayPause={togglePlayPause}
              selectedLayers={selectedLayers}
              timelineRef={timelineRef}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              durationInputRef={durationInputRef}
              playAnimation={playAnimation}
              pauseAnimation={pauseAnimation}
              slideForTimeline={slideForTimeline}
              playWalkingAnimation={wlkingAnimationPlay}
              svgContainerRefs={svgContainerRefs}
              addAnimation={addAnimation}
              handleSvgClick={handleSvgClick}
              selectedSvgIndex={selectedSvgIndex}
              handleWalkingAnimation={handleWalkingAnimation}
              currentReplayIndex={currentReplayIndex}


            />

          </div>
          <div className="leayrs-container">
            <Layers selectedSvg={selectedSvg}
              parseSvgLayers={parseSvgLayers}
              selectedLayers={selectedLayers}
              handleLayerClick={handleLayerClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;