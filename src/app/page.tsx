'use client';

 




import Animations from "@/components/animations";

import Layers from "@/components/layers";
// import Layers from "@/components/layers";
import Preview from "@/components/preview";
import { ANIMATION_TIME_LINE, HANDSTAND, WALKING } from "@/utils/animationsType";

// import SelectSvg from "@/components/selectSvg";
import React, { useState, useEffect, useRef } from "react";

const Page: React.FC = () => {
  const [svgDataList, setSvgDataList] = useState<string[]>([]);
  const [selectedSvg, setSelectedSvg] = useState<string | null>(null);
  const [slideForTimeline, setAddSlideRimeline] = useState<
  { svg: string; animationType: string | null; index: number }[]
>([]);

  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [animationDuration, setAnimationDuration] = useState(ANIMATION_TIME_LINE);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null); // Start time for animation, type updated
  const [pausedTime, setPausedTime] = useState<number | null>(null); // Paused time state with correct type
  const svgContainerRef = useRef<HTMLCanvasElement | null>(null);
 
 
 
  const animationFrameId = useRef<number | null>(null);
  const [currentTime, setCurrentTime] = useState(1); // Current time in seconds
  const [isPlaying, setIsPlaying] = useState(false); // Play/Pause state
 
  
  const [selectedSvgIndex, setSelectedSvgIndex] = useState<number>(0); // Store selected index
  const [currentIndex, setCurrentIndex] = useState(100);
  const [Seconds, setSeconds] = useState(0);

  const [activityLog, setActivityLog] = useState<
    { type: string; slideIndex: number; animationType?: string }[]
  >([]);
  const [currentReplayIndex, setCurrentReplayIndex] = useState<number | null>(null);
  const [svgPosition, setSvgPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [playheadPosition, setPlayheadPosition] = useState(0);

 

  console.log(contextMenuPosition)
  console.log(startTime)
  console.log(currentTime)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

   
  const startRecording = () => {
    const canvas = svgContainerRef.current;
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.warn("Canvas not found or is not a valid HTMLCanvasElement.");
      return;
    }
  
    const stream = canvas.captureStream(30);  
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp9",
    });
  
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };
  
    mediaRecorderRef.current.start();
    console.log("Recording started...");
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      console.log("Recording stopped...");
    }
  };
  
  const downloadVideo = () => {
    const blob = new Blob(recordedChunks.current, { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "activities-logs.mp4";
  
    document.body.appendChild(a);
    a.click();
  
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  
    console.log("Video downloaded...");
  };




















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
      cancelAnimationFrame(animationFrameId.current!); // Stop further animation
      return;
    }
  
    if (isPaused) {
      cancelAnimationFrame(animationFrameId.current!); // Stop if paused
      return;
    }
  
    const canvas = svgContainerRef.current;
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.warn("Canvas not found or is not a valid HTMLCanvasElement.");
      return;
    }
  
    const ctx = canvas.getContext("2d");
    if (!ctx || !selectedSvg) {
      console.warn("Canvas context or SVG not available.");
      return;
    }
  
    // Parse the SVG and retrieve elements
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(selectedSvg, "image/svg+xml");
    const svgElement = svgDoc.documentElement;
  
    // Select specific elements for animation
    const leftHand = svgElement.querySelector("#hand-details-back");
    const rightHand = svgElement.querySelector("#hand-details-front");
    const leftLeg = svgElement.querySelector("#pant-back-details");
    const rightLeg = svgElement.querySelector("#pant-front-details");
    const legFront = svgElement.querySelector("#leg-front");
    const legBack = svgElement.querySelector("#leg-back");
    const footFront = svgElement.querySelector("#shoe-front");
    const footBack = svgElement.querySelector("#shoe-back");
  
    // Ensure all elements exist
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
      console.warn("Some elements are missing in the SVG.");
      return;
    }
  
    // Animation logic
    const stepDuration = 1000; // 1-second animation loop
    const elapsed = elapsedTime % stepDuration;
    const progress = elapsed / stepDuration;
  
    // Calculate swing values
    const handSwing = Math.sin(progress * 2 * Math.PI) * 20;
    const legSwing = Math.cos(progress * 2 * Math.PI) * 20;
    const legFrontSwing = Math.cos(progress * 2 * Math.PI) * 20;
    const legBackSwing = Math.cos(progress * 2 * Math.PI) * 20;
    const footFrontSwing = Math.cos(progress * 2 * Math.PI) * 20;
    const footBackSwing = Math.cos(progress * 2 * Math.PI) * 20;
  
    // Apply transformations
    leftHand.setAttribute("transform", `rotate(${handSwing} 920 400)`);
    rightHand.setAttribute("transform", `rotate(${-handSwing} 960 400)`);
    leftLeg.setAttribute("transform", `rotate(${legSwing} 1000 500)`);
    rightLeg.setAttribute("transform", `rotate(${-legSwing} 1000 500)`);
    legFront.setAttribute("transform", `rotate(${-legFrontSwing} 1000 500)`);
    legBack.setAttribute("transform", `rotate(${legBackSwing} 1000 500)`);
    footFront.setAttribute("transform", `rotate(${-footFrontSwing} 1000 500)`);
    footBack.setAttribute("transform", `rotate(${footBackSwing} 1000 500)`);
  
    // Serialize the updated SVG
    const updatedSvg = new XMLSerializer().serializeToString(svgDoc);
    const svgBlob = new Blob([updatedSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
  
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      ctx.drawImage(img, svgPosition.x, svgPosition.y, canvas.width, canvas.height); // Draw updated SVG
      URL.revokeObjectURL(url);
    };
  
    img.onerror = () => {
      console.error("Failed to load updated SVG image.");
    };
  
    img.src = url;
  
    // Request the next frame
    animationFrameId.current = requestAnimationFrame(animate);
  };
  
  // Function to trigger the walking animation
  const wlkingAnimationPlay = () => {
    if (!animationStarted) {
      animationFrameId.current = requestAnimationFrame(animate);
    }
  };
  



  ////////////////////////// hand stand animation


  const handstand = (timestamp: number) => {
    if (!animationStarted) {
      initialTimestamp = timestamp;
      animationStarted = true;
    }
  
    const elapsedTime = timestamp - initialTimestamp;
  
    if (elapsedTime >= animationDuration) {
      console.log("Animation completed.");
      animationStarted = false;
      cancelAnimationFrame(animationFrameId.current!);
      return;
    }
  
    if (isPaused) {
      cancelAnimationFrame(animationFrameId.current!);
      return;
    }
  
    const canvas = svgContainerRef.current;
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.warn("Canvas not found or is not a valid HTMLCanvasElement.");
      return;
    }
  
    const ctx = canvas.getContext("2d");
    if (!ctx || !selectedSvg) {
      console.warn("Canvas context or SVG not available.");
      return;
    }
  
    // Parse the SVG and retrieve elements
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(selectedSvg, "image/svg+xml");
    const svgElement = svgDoc.documentElement;
  
    // Select specific elements for animation
    const leftHand = svgElement.querySelector("#hand-details-back");
    const rightHand = svgElement.querySelector("#hand-details-front");
  
    // Ensure all elements exist
    if (!leftHand || !rightHand) {
      console.warn("Some elements are missing in the SVG.");
      return;
    }
  
    // Keyframe data for hands
    const animations = {
      "hand-details-back": {
        keys: [
          { t: 0, v: 0 },
          { t: 400, v: -52.081355 },
          { t: 1200, v: -94.55654 },
          { t: 1700, v: -151.389937 },
          { t: 2300, v: -60.488341 },
          { t: 3000, v: 2.015952 },
        ],
        origin: { x: 933.544556, y: 375.9555 },
      },
      "hand-details-front": {
        keys: [
          { t: 0, v: 4.969917 },
          { t: 400, v: -61.364093 },
          { t: 1200, v: -85.395581 },
          { t: 1700, v: -158.456814 },
          { t: 2300, v: -43.159225 },
          { t: 3000, v: 5.235948 },
        ],
        origin: { x: 933.544556, y: 381.769245 },
      },
    };
  
    // Interpolation function for keyframes
    const interpolate = (keys: { t: number; v: number }[], currentTime: number) => {
      let prevKey = keys[0];
      let nextKey = keys[0];
  
      for (let i = 0; i < keys.length; i++) {
        if (currentTime >= keys[i].t) {
          prevKey = keys[i];
        }
        if (currentTime < keys[i].t) {
          nextKey = keys[i];
          break;
        }
      }
  
      const timeDiff = nextKey.t - prevKey.t || 1; // Prevent division by zero
      const valueDiff = nextKey.v - prevKey.v;
      const progress = (currentTime - prevKey.t) / timeDiff;
  
      return prevKey.v + valueDiff * progress;
    };
  
    // Animation logic
    const stepDuration = 3000; // Total animation loop duration
    const elapsed = elapsedTime % stepDuration;
  
    // Apply transformations to hands
    Object.entries(animations).forEach(([id, { keys, origin }]) => {
      const element = svgElement.querySelector(`#${id}`);
      if (element) {
        const rotationValue = interpolate(keys, elapsed);
        element.setAttribute(
          "transform",
          `rotate(${rotationValue} ${origin.x} ${origin.y})`
        );
      }
    });
  
    // Serialize the updated SVG
    const updatedSvg = new XMLSerializer().serializeToString(svgDoc);
    const svgBlob = new Blob([updatedSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
  
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      ctx.drawImage(img, svgPosition.x, svgPosition.y, canvas.width, canvas.height); // Draw updated SVG
      URL.revokeObjectURL(url);
    };
  
    img.onerror = () => {
      console.error("Failed to load updated SVG image.");
    };
  
    img.src = url;
  
    // Request the next frame
    animationFrameId.current = requestAnimationFrame(handstand);
  };

  const handStandanimationPlay = () => {
    if (!animationStarted) {
      animationFrameId.current = requestAnimationFrame(handstand);
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


  // const pauseAnimation = () => {
  //   setIsPaused(true);
  //   setPausedTime(performance.now()); // Save pause time
  //   if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); // Stop animation
  // };


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




  const handlehandstandAnimation = () => {
    if (selectedSvgIndex !== null) {
      setAddSlideRimeline((prevSlides) =>
        prevSlides.map((slide) => {
          if (slide.index === selectedSvgIndex) {
            // Log the animation assignment
            setActivityLog((prevLog) => [
              ...prevLog,
              { type: "assignAnimation", slideIndex: selectedSvgIndex, animationType: HANDSTAND },
            ]);
            return {
              ...slide,
              animationType: slide.animationType === HANDSTAND ? null : HANDSTAND,
            };
          }
          return slide;
        })
      );
    }
  };
  


  const replayActivities = () => {
    const canvas = svgContainerRef.current;
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.warn("Canvas not found or is not a valid HTMLCanvasElement.");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.warn("Canvas context not available.");
      return;
    }

    if (activityLog.length === 0) {
      console.warn("No activities to replay.");
      return;
    }

    console.log("Starting replay and recording...");
    startRecording(); // Start recording

    const totalDuration = activityLog.length * 1000; // Assuming each activity takes 1 second
    let currentTime = 0;

    const replayStep = (index: number) => {
      if (index >= activityLog.length) {
        setCurrentReplayIndex(null); // Clear highlight after replaying all activities
        stopRecording(); // Stop recording
        console.log("Replay completed.");
        return;
      }

      const activity = activityLog[index];
    

      // Find the correct slide in slideForTimeline using the slideIndex from the activity
      const slide = slideForTimeline.find((e) => e.index === activity.slideIndex);

      // Check if slide exists
      if (!slide) {
        console.warn(`Slide not found for index ${activity.slideIndex}`);
        replayStep(index + 1); // Skip to the next activity
        return;
      }

      // Update the selected SVG for preview and highlight the slide in the timeline
      setSelectedSvg(slide.svg);
      setCurrentReplayIndex(activity.slideIndex);

      // Clear the canvas before rendering the new SVG
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (activity.type === "addSlide") {
        // Render the SVG to Canvas
        const svg = slide.svg; // Get the SVG content from the slide
        if (svg) {
          const img = new Image();
          const svgBlob = new Blob([svg], { type: "image/svg+xml" });
          const url = URL.createObjectURL(svgBlob);

          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url); // Cleanup
          };

          img.onerror = (e) => {
            console.error("Error loading SVG image:", e);
          };

          img.src = url;
        }
      } else if (activity.type === "assignAnimation") {
        // Play walking animation on canvas
        playAnimationForSlide(activity.slideIndex, activity.animationType);
      }

      // Update the timeline progress and current time in seconds
      setPlayheadPosition((currentTime / totalDuration) * 40);
      setSeconds(Math.floor(currentTime / 1000));

      // Move to the next activity after a short delay
      setTimeout(() => {
        currentTime += 1000; // Increment current time by activity duration (1 second)
        replayStep(index + 1);
      }, 1000); // Delay between each replay step (1 second)
    };

    replayStep(0); // Start replaying from the first activity
  };

  
  
  
  
  const playAnimationForSlide = (slideIndex: number, animationType?: string) => {
    const slide = slideForTimeline.find((slide) => slide.index === slideIndex);
  
    if (!slide) return;
  
    if (animationType === WALKING) {
      console.log(`Playing walking animation for slide at index ${slideIndex}`);
      wlkingAnimationPlay();
    } else if (animationType === HANDSTAND) {
      console.log(`Playing handstand animation for slide at index ${slideIndex}`);
      handStandanimationPlay();
    }
  };
  
  
  
  












  return (
    <>
  


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
               
                <Animations playWalkingAnimation={wlkingAnimationPlay} addAnimation={addAnimation} handleWalkingAnimation={handleWalkingAnimation} handlehandstandAnimation={handlehandstandAnimation}/>
              </div>
            </div>
          </div>
          <div className="right-side">
            <Preview
              setSvgDataList={setSvgDataList}
              selectedSvg={selectedSvg}
              backgroundImage={backgroundImage}
              svgContainerRef={svgContainerRef}
           
              
              setBackgroundImage={setBackgroundImage}
              isPlaying={isPlaying}
              togglePlayPause={togglePlayPause}
              selectedLayers={selectedLayers}
            
           
             
              playAnimation={playAnimation}
             
              slideForTimeline={slideForTimeline}
              playWalkingAnimation={wlkingAnimationPlay}
            
            
              handleSvgClick={handleSvgClick}
              selectedSvgIndex={selectedSvgIndex}
              
              currentReplayIndex={currentReplayIndex}
              svgPosition={svgPosition}
               setSvgPosition={setSvgPosition}
              replayActivities={replayActivities}
              downloadVideo={downloadVideo}
              playheadPosition={playheadPosition}
              seconds={Seconds}
             


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