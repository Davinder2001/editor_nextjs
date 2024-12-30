'use client';


import LayersComponent from "@/components/layers";
import Layersanimations from "@/components/layersanimations";


// import Layers from "@/components/layers";
import Preview from "@/components/preview";
import { ANIMATION_TIME_LINE, HANDSTAND, IMAGE_SIZE, WALKING } from "@/utils/animationsType";

// import SelectSvg from "@/components/selectSvg";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

const Page: React.FC = () => {
  const [svgDataList, setSvgDataList] = useState<string[]>([]);
  const [selectedSvg, setSelectedSvg] = useState<string | null>(null);
  const [slideForTimeline, setAddSlideRimeline] = useState<
    {
      svg: string;
      animationType: string | null;
      duration: number;
      index: number;
      isPlaying: boolean;
    }[]
  >([]);


  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);


  const svgContainerRef = useRef<HTMLCanvasElement | null>(null);



  const animationFrameId = useRef<number | null>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);


  const [selectedSvgIndex, setSelectedSvgIndex] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(100);


  const [activityLog, setActivityLog] = useState<
    { type: string; slideIndex: number; animationType?: string }[]
  >([]);
  const [currentReplayIndex, setCurrentReplayIndex] = useState<number | null>(null);
  const [svgPosition, setSvgPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [playheadPosition, setPlayheadPosition] = useState(0);

  const [dragging, setDragging] = useState<boolean>(false);
  const [layerIndex, setLayerIndex] = useState<number | null>(0)
  console.log(layerIndex)

  console.log(activityLog)

  const handlePlayPauseForSelectedSlide = () => {
    if (selectedSvgIndex === null) {
      console.warn("No slide selected.");
      return;
    }
  
    setAddSlideRimeline((prevSlides) =>
      prevSlides.map((slide) => {
        // Hide other slides
        if (slide.index !== selectedSvgIndex) {
          return { ...slide, isPlaying: false, hidden: true }; // Hide the slide (optional 'hidden' property)
        } else {
          // Play the selected slide
          if (slide.isPlaying) {
            setCurrentReplayIndex(slide.index);
            return { ...slide, isPlaying: false };
          } else {
            // Check if an animation type is assigned
            if (!slide.animationType) {
              toast.error("No animation type assigned to the selected slide.");
              updateProgressBar(0); // Reset the progress bar to 0% if no animation
              return { ...slide, isPlaying: false, hidden: false }; // Stop animation and show slide
            }
  
            // Play animation for the selected slide
            if (slide.animationType === WALKING) {
              wlkingAnimationPlay(slide.svg);
            } else if (slide.animationType === HANDSTAND) {
              handStandanimationPlay(slide.svg);
            }
  
            const animationDuration = slide.duration || ANIMATION_TIME_LINE;
            let elapsedTime = 0;
            const frameInterval = 100;
            const framesForAnimation: Frame[] = [];
            let frameIndex = 0;
  
            const canvas = svgContainerRef.current;
            if (!(canvas instanceof HTMLCanvasElement)) {
              console.warn("Canvas not found or is not a valid HTMLCanvasElement.");
              return slide;
            }
  
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              console.warn("Canvas context not available.");
              return slide;
            }
  
            // Update playhead position based on elapsed time
            const updatePlayhead = (currentElapsed: number) => {
              const progress = Math.min((currentElapsed / animationDuration) * 100, 100);
              const playheadElement = document.querySelector(".playhead");
              if (playheadElement instanceof HTMLElement) {
                playheadElement.style.left = `${progress}%`;
              }
              console.log(`Playhead updated to: ${progress.toFixed(2)}%`);
            };
  
            // Save frames during animation
            const saveFrame = () => {
              const frame = canvas.toDataURL("image/png");
              const currentTime = Date.now();
              const seconds = Math.floor(currentTime / 1000);
              const milliseconds = currentTime % 1000;
              framesForAnimation.push({ image: frame, time: { seconds, milliseconds }, index: frameIndex++ });
            };
  
            // Start updating playhead and capturing frames
            const playheadUpdateInterval = setInterval(() => {
              elapsedTime += frameInterval;
              updatePlayhead(elapsedTime); // Update playhead
              saveFrame(); // Save current frame
  
              if (elapsedTime >= animationDuration) {
                clearInterval(playheadUpdateInterval); // Stop when animation ends
                setFrames(framesForAnimation); // Store frames after the animation completes
                setAddSlideRimeline((prevSlides) =>
                  prevSlides.map((s) => (s.index === selectedSvgIndex ? { ...s, isPlaying: false } : s))
                );
              }
            }, frameInterval);
  
            return { ...slide, isPlaying: true, hidden: false }; // Show and play the selected slide
          }
        }
      })
    );
  
    // Automatically stop the animation after the duration
    setTimeout(() => {
      setAddSlideRimeline((prevSlides) =>
        prevSlides.map((slide) =>
          slide.index === selectedSvgIndex ? { ...slide, isPlaying: false, hidden: false } : slide
        )
      );
    }, ANIMATION_TIME_LINE);
  };
  
  // Update the progress bar
  const updateProgressBar = (progress: number) => {
    const playheadElement = document.querySelector(".playhead");
    if (playheadElement instanceof HTMLElement) {
      playheadElement.style.left = `${progress}%`;
    }
  };
  





  console.log(contextMenuPosition)

  console.log(currentTime)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);


  const startRecording = () => {
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

    if (backgroundImage) {
      const bgImg = new Image();
      bgImg.src = backgroundImage;

      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height); // Draw background image
      };

      bgImg.onerror = () => {
        console.error("Failed to load background image.");
      };
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
    if (!recordedChunks.current || recordedChunks.current.length === 0) {
      console.warn("No recorded video available for download.");
      return;
    }

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

    // Find the parent <g> element with id="animation_wrapper"
    const animationWrapper = svgDoc.documentElement.querySelector('g[id="animation_wrapper"]');

    if (!animationWrapper) {
      console.warn('No <g> element with id="animation_wrapper" found.');
      return [];
    }

    // Collect all <g> elements and their IDs
    const getAllGroups = (parent: Element) => {
      const groups = Array.from(parent.querySelectorAll('g')); // Get all <g> elements
      return groups.map((group) => ({
        id: (group as SVGGElement).id || "Unnamed Group", // Use ID or fallback to "Unnamed Group"
      }));
    };

    return getAllGroups(animationWrapper);
  };









  const handleLayerClick = (layerId: string) => {
    setSelectedLayers([layerId]);
  };



  interface AnimationKeys {
    r: { t: number; v: number }[]; // Rotation keys
    t?: { t: number; v: number }[]; // Optional Translation keys
  }
  
  interface AnimationTransform {
    data: {
      o: { x: number; y: number; type: string };
      t: { x: number; y: number };
    };
    keys: AnimationKeys;
  }

  let animationStarted = false;
  let initialTimestamp = 0;

 
  
  const animate = (svg: string, timestamp: number, isReverse: boolean = false) => {
    if (!animationStarted) {
        initialTimestamp = timestamp;
        animationStarted = true;
    }

    const elapsedTime = timestamp - initialTimestamp;

    if (elapsedTime >= ANIMATION_TIME_LINE) {
        console.log("Animation completed.");
        animationStarted = false;
        cancelAnimationFrame(animationFrameId.current!); // Stop further animation
        return;
    }

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

    // Parse the SVG and retrieve elements
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svg, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    // Target the <g> element with id="animation_wrapper"
    const animationWrapper = svgElement.querySelector('g[id="animation_wrapper"]');
    if (!animationWrapper) {
        toast.error('No <g> element with id="animation_wrapper" found in the SVG.');
        return;
    }

    // Updated animation data with transform information
    const animations: Record<string, { transform: AnimationTransform }> = {
        "hand-details-front": {
            transform: {
                data: {
                    o: { x: 936.363651, y: 365.4, type: "corner" },
                    t: { x: -936.363649, y: -365.4 }
                },
                keys: {
                    r: [
                        { t: 0, v: 0 },
                        { t: 1000, v: 30.170204 },  // Speed up: Reduce duration to 1000
                        { t: 2000, v: -17.915471 },
                        { t: 3000, v: 0 }
                    ]
                }
            }
        },
        "hand-details-back": {
            transform: {
                data: {
                    o: { x: 945.041116, y: 365.4, type: "corner" },
                    t: { x: -946.932186, y: -362.647241 }
                },
                keys: {
                    r: [
                        { t: 0, v: 0 },
                        { t: 1000, v: -20.826695 },  // Speed up: Reduce duration to 1000
                        { t: 2000, v: 29.534194 },
                        { t: 3000, v: 0 }
                    ]
                }
            }
        },
        "pant-front-details": {
            transform: {
                data: {
                    o: { x: 930.9, y: 552.241451, type: "corner" },
                    t: { x: -930.899978, y: -552.241449 }
                },
                keys: {
                    r: [
                        { t: 0, v: 0 },
                        { t: 1000, v: -28.314683 },  // Speed up: Reduce duration to 1000
                        { t: 2000, v: -2.293353 },
                        { t: 3000, v: 0 }
                    ]
                }
            }
        },
        "leg-front": {
            transform: {
                data: {
                    o: { x: 930.9, y: 552.241451, type: "corner" },
                    t: { x: -930.899978, y: -552.241449 }
                },
                keys: {
                    r: [
                        { t: 0, v: 0 },
                        { t: 1000, v: -28.314683 },  // Speed up: Reduce duration to 1000
                        { t: 2000, v: -2.293353 },
                        { t: 3000, v: 0 }
                    ]
                }
            }
        },
        "shoe-front": {
            transform: {
                data: {
                    o: { x: 930.9, y: 552.241451, type: "corner" },
                    t: { x: -930.899978, y: -552.241449 }
                },
                keys: {
                    r: [
                        { t: 0, v: 0 },
                        { t: 1000, v: -28.314683 },  // Speed up: Reduce duration to 1000
                        { t: 2000, v: -2.293353 },
                        { t: 3000, v: 0 }
                    ]
                }
            }
        },
        "pant-back-details": {
            transform: {
                data: {
                    o: { x: 992.137451, y: 556.6, type: "corner" },
                    t: { x: -992.137447, y: -556.599997 }
                },
                keys: {
                    r: [
                        { t: 0, v: 0 },
                        { t: 1000, v: 13.410006 },  // Speed up: Reduce duration to 1000
                        { t: 2000, v: -11.959515 },
                        { t: 3000, v: 0 }
                    ]
                }
            }
        },
        "leg-back": {
            transform: {
                data: {
                    o: { x: 992.137451, y: 556.6, type: "corner" },
                    t: { x: -992.137447, y: -556.599997 }
                },
                keys: {
                    r: [
                        { t: 0, v: 0 },
                        { t: 1000, v: 13.410006 },  // Speed up: Reduce duration to 1000
                        { t: 2000, v: -11.959515 },
                        { t: 3000, v: 0 }
                    ]
                }
            }
        },
        "shoe-back": {
            transform: {
                data: {
                    o: { x: 992.137451, y: 556.6, type: "corner" },
                    t: { x: -992.137447, y: -556.599997 }
                },
                keys: {
                    r: [
                        { t: 0, v: 0 },
                        { t: 1000, v: 13.410006 },  // Speed up: Reduce duration to 1000
                        { t: 2000, v: -11.959515 },
                        { t: 3000, v: 0 }
                    ]
                }
            }
        },
    };

    // Interpolate function for rotation values
    const interpolate = (keys: { t: number; v: number }[], currentTime: number) => {
        if (!keys || keys.length === 0) {
            console.warn("No keys provided for interpolation.");
            return 0; // Return a default value if keys are invalid
        }

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

    const stepDuration = 2500; // Speed up: Reduce the duration for a faster movement
    const elapsed = elapsedTime % stepDuration;

    const canvasWidth = canvas.width;
  const speed = 100; // Pixels per second
  const translateX = isReverse
    ? canvasWidth - ((elapsedTime / 1000) * speed) % canvasWidth // Reverse: Right to Left
    : ((elapsedTime / 1000) * speed) % canvasWidth; // Forward: Left to Right

  animationWrapper.setAttribute("transform", `translate(${translateX}, 0)`);

    Object.entries(animations).forEach(([id, { transform }]) => {
      const element = animationWrapper.querySelector(`#${id}`);
      if (element) {
        const rotationValue = interpolate(transform.keys.r, elapsed);
    
        // Apply rotation transform
        element.setAttribute(
          "transform",
          `rotate(${rotationValue} ${transform.data.o.x} ${transform.data.o.y})`
        );
    
        // Check if translation keys exist and apply translation if they do
        if (transform.keys.t) {
          const translateX = interpolate(transform.keys.t, elapsed);
          element.setAttribute(
            "transform",
            `translate(${translateX} 0) rotate(${rotationValue} ${transform.data.o.x} ${transform.data.o.y})`
          );
        } else {
          // If no translation key exists, apply just the rotation transform
          element.setAttribute(
            "transform",
            `rotate(${rotationValue} ${transform.data.o.x} ${transform.data.o.y})`
          );
        }
      }
    });
    
    

    // Serialize the updated SVG
    const updatedSvg = new XMLSerializer().serializeToString(svgDoc);
    const svgBlob = new Blob([updatedSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw updated SVG
        URL.revokeObjectURL(url);
    };

    img.onerror = () => {
        console.error("Failed to load updated SVG image.");
    };

    img.src = url;

    // Request the next frame
    animationFrameId.current = requestAnimationFrame((newTimestamp) =>
        animate(svg, newTimestamp, isReverse)
    );
};

  


  const wlkingAnimationPlay = (svg: string, isReverse: boolean = false) => {
    if (!animationStarted) {
      animationFrameId.current = requestAnimationFrame((timestamp) =>
        animate(svg, timestamp, isReverse)
      );
    }
  };


  // Function to trigger the walking animation








  ////////////////////////// hand stand animation


  const handstand = (svg: string, timestamp: number) => {
    if (!animationStarted) {
      initialTimestamp = timestamp;
      animationStarted = true;
    }

    const elapsedTime = timestamp - initialTimestamp;

    if (elapsedTime >= ANIMATION_TIME_LINE) {
      console.log("Animation completed.");
      animationStarted = false;
      cancelAnimationFrame(animationFrameId.current!);
      return;
    }

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

    // Parse the SVG and retrieve elements
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svg, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    // Target the animation wrapper
    const animationWrapper = svgElement.querySelector('g[id="animation_wrapper"]');
    if (!animationWrapper) {
      console.warn('No <g> element with id="animation_wrapper" found in the SVG.');
      return;
    }

    // Select specific elements for animation within the <g> group
    const leftHand = animationWrapper.querySelector("#hand-details-back");
    const rightHand = animationWrapper.querySelector("#hand-details-front");

    if (!leftHand || !rightHand) {
      console.warn("Some elements are missing in the animation wrapper <g>.");
      return;
    }

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

    const stepDuration = 3000;
    const elapsed = elapsedTime % stepDuration;

    Object.entries(animations).forEach(([id, { keys, origin }]) => {
      const element = animationWrapper.querySelector(`#${id}`);
      if (element) {
        const rotationValue = interpolate(keys, elapsed);
        element.setAttribute("transform", `rotate(${rotationValue} ${origin.x} ${origin.y})`);
      }
    });

    const updatedSvg = new XMLSerializer().serializeToString(svgDoc);
    const svgBlob = new Blob([updatedSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, svgPosition.x, svgPosition.y, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      console.error("Failed to load updated SVG image.");
    };

    img.src = url;

    animationFrameId.current = requestAnimationFrame((newTimestamp) => handstand(svg, newTimestamp));
  };



  const handStandanimationPlay = (svg: string) => {
    if (!animationStarted) {
      animationFrameId.current = requestAnimationFrame((timestamp) => handstand(svg, timestamp));
    }
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

            // Parse the SVG content
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
            const svgElement = svgDoc.documentElement;

            // Create a new <g> tag with id="animation_wrapper"
            const animationWrapper = svgDoc.createElementNS("http://www.w3.org/2000/svg", "g");
            animationWrapper.setAttribute("id", "animation_wrapper");

            // Move all direct child <g> elements inside the new <g> tag
            const childGroups = svgElement.querySelectorAll(":scope > g");
            childGroups.forEach((child) => {
              animationWrapper.appendChild(child);
            });

            // Append the new <g> tag back to the SVG element
            svgElement.appendChild(animationWrapper);

            // Serialize the updated SVG
            const serializer = new XMLSerializer();
            const updatedSvgContent = serializer.serializeToString(svgElement);

            // Add the updated SVG content to the list
            newSvgDataList.push(updatedSvgContent);

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

    if (file) {
      // Check if file size is 250KB or less

      if (file.size <= IMAGE_SIZE) {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const uploadedBackground = e.target?.result as string;
            setBackgroundImage(uploadedBackground);
            localStorage.setItem("backgroundImage", uploadedBackground);
            toast.success("Background image uploaded successfully!");
          };
          reader.readAsDataURL(file);
        } else {
          toast.error("Please upload a valid image file.");
        }
      } else {
        toast.error("Image should be less than 250KB or less");
      }
    } else {
      toast.error("No file selected.");
    }
  };






  const handleSvgClick = (svg: string, index: number) => {
    setSelectedSvg(svg);
    setSelectedSvgIndex(index);
    setCurrentReplayIndex(index);

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




  const addSlideToTimeline = (event: React.MouseEvent<HTMLButtonElement>) => {
    const svgIndex = parseInt(event.currentTarget.getAttribute("data-index") || "0", 10);
    if (selectedSvg) {
      const newSlide = {
        svg: selectedSvg,
        animationType: null,
        index: currentIndex,
        duration: 0,
        isPlaying: false,
        svgIndex,
      };
      setAddSlideRimeline((prevSlides) => [...prevSlides, newSlide]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setLayerIndex(currentIndex);


      setCurrentReplayIndex(currentIndex);


      setActivityLog((prevLog) => [
        ...prevLog,
        { type: "addSlide", slideIndex: currentIndex },
      ]);
    }
  };

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
              duration: ANIMATION_TIME_LINE,
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
              duration: ANIMATION_TIME_LINE,
            };
          }
          return slide;
        })
      );
    }
  };





  interface Frame {
    image: string;
    time: {
      seconds: number;
      milliseconds: number;
    };
    index: number;
  }



  const [frames, setFrames] = useState<Frame[]>([]); // State to store frames and timestamps

  console.log(frames)

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

    const filteredSlides = slideForTimeline.filter((slide) => slide.animationType);

    if (filteredSlides.length === 0) {
      toast.error("You can't download Please play the animations first??");
      return;
    }

    console.log("Starting replay and recording...");

    setFrames([]); // Clear old frames
    const tempFrames: Frame[] = [];
    let frameIndex = 0; // Initialize frame index
    let elapsedTime = 0; // Track elapsed time

    startRecording(); // Start recording once for all slides

    const totalDuration = filteredSlides.reduce((sum, slide) => sum + slide.duration, 0);

    const updatePlayhead = (currentElapsed: number) => {
      const progress = Math.min((currentElapsed / totalDuration) * 100, 100);
      const playheadElement = document.querySelector(".playhead");
      if (playheadElement instanceof HTMLElement) {
        playheadElement.style.left = `${progress}%`;
      }
      console.log(`Playhead updated to: ${progress.toFixed(2)}%`);
    };

    const saveFrame = (index: number) => {
      const frame = canvas.toDataURL("image/png");
      const currentTime = Date.now();
      const seconds = Math.floor(currentTime / 1000);
      const milliseconds = currentTime % 1000;
      tempFrames.push({ image: frame, time: { seconds, milliseconds }, index });
    };

    const replayStep = (index: number) => {
      if (index >= filteredSlides.length) {
        stopRecording(); // Stop recording after all slides are replayed
        console.log("Replay completed.");

        setFrames(tempFrames); // Save frames after replay
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.onstop = () => {
            downloadVideo(); // Download all logs as a video
            console.log("Recording stopped and video downloaded.");
          };
        }
        return;
      }

      const slide = filteredSlides[index];
      console.log(`Replaying Slide ${index + 1}/${filteredSlides.length}`);

      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(slide.svg, "image/svg+xml");
      const svgElement = svgDoc.documentElement;

      if (backgroundImage) {
        svgElement.setAttribute(
          "style",
          `background: url(${backgroundImage}); background-size: cover;`
        );
      }

      const svg = new XMLSerializer().serializeToString(svgElement);

      if (slide.animationType === WALKING) {
        wlkingAnimationPlay(svg, false);
      } else if (slide.animationType === HANDSTAND) {
        handStandanimationPlay(svg);
      }

      const img = new Image();
      const updatedSvgBlob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(updatedSvgBlob);

      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);

        const animationStartTime = Date.now();
        const animationEndTime = animationStartTime + slide.duration;

        const interval = setInterval(() => {
          elapsedTime += 300; // Update elapsed time
          updatePlayhead(elapsedTime);
          saveFrame(frameIndex++); // Save current frame

          if (Date.now() >= animationEndTime) {
            clearInterval(interval);
            replayStep(index + 1); // Move to the next slide
          }
        }, 300);
      };

      img.onerror = () => {
        console.error("Error loading updated SVG.");
        replayStep(index + 1); // Skip to the next slide
      };

      img.src = url;
    };

    replayStep(0);
  };



  const playAndPause = () => {
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

    const filteredSlides = slideForTimeline.filter((slide) => slide.animationType);

    if (filteredSlides.length === 0) {
      toast.error("No Svg with animations assigned for replay.");
      return;
    }

    console.log("Starting replay and recording...");

    // Clear old frames to ensure only the latest frames are stored
    setFrames([]);



    const totalDuration = filteredSlides.reduce((sum, slide) => sum + slide.duration, 0);
    let elapsedTime = 0;
    let frameIndex = 0; // Initialize frame index

    // Temporary array to store frames during replay
    const tempFrames: Frame[] = [];
    const updatePlayhead = (currentElapsed: number) => {
      const progress = Math.min((currentElapsed / totalDuration) * 100, 100);
      const playheadElement = document.querySelector(".playhead");
      if (playheadElement instanceof HTMLElement) {
        playheadElement.style.left = `${progress}%`;
      }
      console.log(`Playhead updated to: ${progress.toFixed(2)}%`);
    };

    const saveFrame = (index: number) => {
      // Capture the current canvas as a base64 image (PNG)
      const frame = canvas.toDataURL("image/png");

      // Get the current time in seconds and milliseconds
      const currentTime = Date.now();
      const seconds = Math.floor(currentTime / 1000); // Convert to seconds
      const milliseconds = currentTime % 1000; // Get the milliseconds part

      // Store the frame in the temporary array without triggering a re-render
      tempFrames.push({ image: frame, time: { seconds, milliseconds }, index });
    };

    const replayStep = (index: number) => {
      if (index >= filteredSlides.length) {
        setCurrentReplayIndex(null);
        stopRecording();
        console.log("Replay completed.");

        // Update frames state with the new frames after replay
        setFrames(tempFrames);

        return;
      }

      const slide = filteredSlides[index];
      setCurrentReplayIndex(slide.index);

      console.log(`Replaying Slide ${index + 1}/${filteredSlides.length}`);

      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(slide.svg, "image/svg+xml");
      const svgElement = svgDoc.documentElement;

      if (backgroundImage) {
        svgElement.setAttribute(
          "style",
          `background: url(${backgroundImage}); background-size: cover;`
        );
      }

      const animationWrapper = svgElement.querySelector('g[id="animation_wrapper"]');
      if (!animationWrapper) {
        console.warn('No <g> element with id="animation_wrapper" found in the SVG.');
        replayStep(index + 1); // Skip this slide and move to the next one
        return;
      }

      const svg = new XMLSerializer().serializeToString(svgElement);

      if (slide.animationType === WALKING) {
        wlkingAnimationPlay(svg, false);
      } else if (slide.animationType === HANDSTAND) {
        handStandanimationPlay(svg);
      }

      const img = new Image();
      const updatedSvgBlob = new Blob([new XMLSerializer().serializeToString(svgElement)], {
        type: "image/svg+xml",
      });
      const url = URL.createObjectURL(updatedSvgBlob);

      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);

        const animationStartTime = Date.now();
        const animationEndTime = animationStartTime + slide.duration;

        const interval = setInterval(() => {
          const now = Date.now();
          elapsedTime += 300; // 500 ms for 2 frames per second
          updatePlayhead(elapsedTime);

          // Save the current frame and timestamp at each step, passing the index
          saveFrame(frameIndex);

          frameIndex++; // Increment the frame index after saving the frame

          if (now >= animationEndTime) {
            clearInterval(interval);
            replayStep(index + 1);
          }
        }, 300); // 500 ms interval for 2 frames per second
      };

      img.onerror = () => {
        console.error("Error loading updated SVG.");
        replayStep(index + 1);
      };

      img.src = url;
    };

    replayStep(0);
  };








  const [currentFrameIndex, setCurrentFrameIndex] = useState(0); // For storing the current frame index

  const [currentFrame, setCurrentFrame] = useState<Frame | null>(null);


  console.log(currentFrame)

  const [lastFrameIndex, setLastFrameIndex] = useState<number | null>(null);









  const throttledUpdatePlayhead = (playheadPercentage: number) => {
    setPlayheadPosition(playheadPercentage); // Directly set the playhead position
  };


  const renderFrameAtPosition = (frameIndex: number) => {
    if (frameIndex !== lastFrameIndex) {
      setCurrentFrameIndex(frameIndex); // Set the current frame index to display it
      setCurrentFrame(frames[frameIndex]); // Set the frame details to be displayed
      setLastFrameIndex(frameIndex); // Update the last frame index to avoid re-rendering continuously
    }

    const canvas = svgContainerRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frame = frames[frameIndex]; // Get the frame at the calculated index

    if (frame) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the frame
      };
      img.src = frame.image; // Set the image source to the frame's image
    }
  };

  // Mouse down to start dragging
  const handleMouseDown = () => {
    setDragging(true); // Enable dragging state
  };

  // Mouse move to update playhead position and show frame
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left; // Calculate the mouse position relative to the container

    // Calculate the exact frame index based on the mouse position
    const totalFrames = frames.length;
    const frameIndex = Math.floor((offsetX / rect.width) * totalFrames); // Directly get the frame index from mouse position

    // Update playhead position visually and show the corresponding frame
    requestAnimationFrame(() => throttledUpdatePlayhead((frameIndex / totalFrames) * 100)); // Update playhead visually

    requestAnimationFrame(() => renderFrameAtPosition(frameIndex)); // Update the frame based on the frame index

  };

  // Mouse up to stop dragging and show the final frame
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(false);



    // Calculate the frame index directly based on the current playhead position
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left; // Calculate the mouse position relative to the container

    const totalFrames = frames.length;
    const finalFrameIndex = Math.floor((offsetX / rect.width) * totalFrames); // Final frame index where the mouse was released

    // Ensure canvas is cleared and the correct frame is rendered
    requestAnimationFrame(() => renderFrameAtPosition(finalFrameIndex));

  };



  // if (dragging) {
  //   renderFrameAtPosition(currentFrameIndex);  
  // }



  if (currentFrameIndex) {
    renderFrameAtPosition(currentFrameIndex)
  }




  return (
    <>




      <div className="container">
        <div className="animation_wrapper_main_page">
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
                        height: "150px",
                        border: "1px solid #ccc",
                        marginBottom: "20px",
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
                            padding: "8px 10px",
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
                            padding: "8px 10px",
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

                slideForTimeline={slideForTimeline}

                handleSvgClick={handleSvgClick}


                currentReplayIndex={currentReplayIndex}
                svgPosition={svgPosition}
                setSvgPosition={setSvgPosition}
                replayActivities={replayActivities}

                playheadPosition={playheadPosition}

                handleMouseDown={handleMouseDown}
                handleMouseMove={handleMouseMove}
                handleMouseUp={handleMouseUp}
                playPauseAni={handlePlayPauseForSelectedSlide}
                setLayerIndex={setLayerIndex}
                downloadVideo={downloadVideo}

                dragging={dragging}







              />

            </div>

            <div className="leayrs-container">
              {slideForTimeline.length === 0 ? (<h1 className="main-heading">Layers not Found</h1>) : (slideForTimeline.map((slide, index) => (
                layerIndex === slide.index ? (
                  <div key={slide.index} className="layer-slide-container">
                    <h1 className="main-heading">{`SVG Layers ${index + 1}`}</h1>
                    <LayersComponent
                      selectedSvg={slide.svg}
                      parseSvgLayers={parseSvgLayers}
                      selectedLayers={selectedLayers}
                      handleLayerClick={handleLayerClick}

                    />
                  </div>
                ) : null
              )))}
            </div>

          </div>


          <div className="animation_frame_line">
            <Layersanimations handleWalkingAnimation={handleWalkingAnimation} handlehandstandAnimation={handlehandstandAnimation} currentReplayIndex={currentReplayIndex}
              slideForTimeline={slideForTimeline}

              replayActivities={replayActivities}

              handleSvgClick={handleSvgClick}
              playheadPosition={playheadPosition}

              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={handleMouseUp}

              playPauseAni={handlePlayPauseForSelectedSlide}
              setLayerIndex={setLayerIndex}
              downloadVideo={downloadVideo}

              dragging={dragging}
              playheadRef={playheadRef}
              playAndPause={playAndPause}

            />
          </div>
        </div>
      </div>

    </>
  );
};

export default Page;