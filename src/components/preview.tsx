    import React, { useEffect, useRef, useState } from "react";
import SvgPreviewMain from "./svgPreviewMain";
import TimeLine from "./timeLine";

    interface PreviewProps {
        setSvgDataList: any;
        selectedSvg: any;
        backgroundImage: any;
        svgContainerRef: React.RefObject<HTMLInputElement> | any;
        setSelectedSvg: any;
        setBackgroundImage: any;
        isPlaying: boolean;
        togglePlayPause: () => void;
        selectedLayers: any;
        timelineRef: React.RefObject<HTMLInputElement> | any;
        currentTime: number;
        setCurrentTime: any;
        playAnimation: (duration: number) => void;
        pauseAnimation: () => void;
        durationInputRef : any;
        slideForTimeline : any;
        playWalkingAnimation: () => void;
    }

    function Preview({
        setSvgDataList,
        selectedSvg,
        backgroundImage,
        svgContainerRef,
        setSelectedSvg,
        setBackgroundImage,
        isPlaying,
        togglePlayPause,
        selectedLayers,
        timelineRef,
        // currentTime,
        // setCurrentTime,
        playAnimation,
        // pauseAnimation,
        slideForTimeline,
        playWalkingAnimation
    }: PreviewProps) {
        const [svgPosition, setSvgPosition] = useState({ x: 0, y: 0 });
        const [tracks, setTracks] = useState([
            { id: "track1", name: "Layer 1", startTime: 10, endTime: 40 },
        ]);
        const [playheadPosition, setPlayheadPosition] = useState(0); // Playhead in percentage
        const [animationDuration, setAnimationDuration] = useState(3); // Animation duration in seconds

        const isDragging = useRef(false);
        const dragStart = useRef({ x: 0, y: 0 });
        const animationFrame = useRef<number | null>(null);
        const playbackStartTime = useRef<number | null>(null);

        const startDrag = (e: React.MouseEvent) => {
            isDragging.current = true;
            dragStart.current = { x: e.clientX, y: e.clientY };
        };

        const onDrag = (e: React.MouseEvent) => {
            if (!isDragging.current) return;

            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;

            setSvgPosition((prev) => ({
                x: prev.x + dx,
                y: prev.y + dy,
            }));

            dragStart.current = { x: e.clientX, y: e.clientY };
        };

        const stopDrag = () => {
            isDragging.current = false;
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

        const applyLayerStyles = (svg: string, layersToHighlight: string[]) => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svg, "image/svg+xml");

            svgDoc.querySelectorAll("g").forEach((layer) => {
                const layerId =
                    layer.id || `layer-${Array.from(layer.parentElement?.children || []).indexOf(layer)}`;

                if (layersToHighlight.includes(layerId)) {
                    layer.setAttribute("stroke", "red");
                    layer.setAttribute("stroke-width", "4");
                    Array.from(layer.children).forEach((child) => {
                        if (
                            layersToHighlight.includes(
                                child.id || `${layerId}-child-${Array.from(layer.children).indexOf(child)}`
                            )
                        ) {
                            child.setAttribute("stroke", "red");
                            child.setAttribute("stroke-width", "4");
                        }
                    });
                } else {
                    layer.removeAttribute("stroke");
                    layer.removeAttribute("stroke-width");
                    Array.from(layer.children).forEach((child) => {
                        child.removeAttribute("stroke");
                        child.removeAttribute("stroke-width");
                    });
                }
            });

            return svgDoc.documentElement.outerHTML;
        };

        const updateAnimationDuration = () => {
            if (timelineRef.current) {
                const timelineWidth = timelineRef.current.offsetWidth || 1; // Avoid division by zero
                const track = tracks[0]; // Assuming single track for simplicity
                const layerWidth = ((track.endTime - track.startTime) / 100) * timelineWidth;
                const duration = Math.round((layerWidth / timelineWidth) * 10);
                setAnimationDuration(duration);
            }
        };

        useEffect(() => {
            updateAnimationDuration();
        }, [tracks, timelineRef]);

        const play = () => {
            if (!isPlaying) togglePlayPause();

            playbackStartTime.current = performance.now();

            const animate = (time: number) => {
                const elapsed = time - (playbackStartTime.current || time);
                const newPosition = (elapsed / (animationDuration * 1000)) * 100;

                // Check if playhead is engaging with the layer
                const activeLayers = tracks.filter(
                    (track) => newPosition >= track.startTime && newPosition <= track.endTime
                );

                if (activeLayers.length > 0) {
                    // Trigger animation effect (example: playAnimation for engaging layers)
                    playAnimation(animationDuration);
                }

                if (newPosition >= 100) {
                    setPlayheadPosition(0);
                    togglePlayPause();
                    playbackStartTime.current = null;
                    cancelAnimationFrame(animationFrame.current!);
                } else {
                    setPlayheadPosition(newPosition);
                    animationFrame.current = requestAnimationFrame(animate);
                }
            };

            animationFrame.current = requestAnimationFrame(animate);
        };

        const pause = () => {
            if (isPlaying) togglePlayPause();
            cancelAnimationFrame(animationFrame.current!);
        };

        return (
            <>
                {selectedSvg ? (
                  
                        <div className="right-side">
                            <h1 className="main-heading">Preview</h1>
                        <SvgPreviewMain backgroundImage={backgroundImage}
                                        svgContainerRef={svgContainerRef} 
                                        startDrag={startDrag}
                                        onDrag={onDrag} 
                                        stopDrag={stopDrag}
                                        svgPosition={svgPosition}
                                        applyLayerStyles={applyLayerStyles}
                                        selectedSvg={selectedSvg}
                                        selectedLayers={selectedLayers} />
                         

                            {/* Timeline and Play/Pause Button */}
                           <TimeLine    play={play}
                                        pause={pause}
                                        timelineRef={timelineRef}
                                        playheadPosition={playheadPosition}
                                        slideForTimeline={slideForTimeline}
                                        // playWalkingAnimation={playWalkingAnimation}
                                        svgContainerRef={svgContainerRef} 
                           />

                        </div>
                ) : (
                    <p>Select an SVG to preview it here.</p>
                )}
            </>
        );
    }

    export default Preview;
