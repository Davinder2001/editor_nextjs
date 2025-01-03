export interface svgPreview {
    svgDataList: string[],
    selectedSvgIndex: number,
    selectedSvg: string | null,
    setSvgDataList: (value: string[]) => void,
    setSelectedSvg: (value: string | null) => void,
    handleSvgClick: (svg: string, index: number) => void,
    setContextMenuPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>
    addSlideToTimeline: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export interface uploadBackground {
    setBackgroundImage: (value: string | null) => void,
}


export interface uploadSvg {
    svgDataList: string[]
    setSvgDataList: (value: string[]) => void,
    setSelectedSvg: (value: string | null) => void,
}

export interface Slide {
    svg: string;
    animationType: string | null;
    duration: number;
    index: number;
    isPlaying: boolean;
}

export interface TimelineProps {
    slideForTimeline: Slide[];
    handleSvgClick: (svg: string, slideIndex: number) => void;
    replayActivities: () => void;
    playheadPosition: number;
    currentReplayIndex: number | null;
    handleMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    handleMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
    playPauseAni: () => void;
    setLayerIndex: React.Dispatch<React.SetStateAction<number | null>>;
    downloadVideo: () => void,
    dragging: boolean
    playheadRef: React.RefObject<HTMLDivElement>;
    playAndPause: () => void
}

export interface AnimationsTypes {
    handleWalkingAnimation: () => void;
    handlehandstandAnimation: () => void;

}

export interface Layer {
    id: string;
}

export interface LayersProps {
    selectedSvg: string | null;
    parseSvgLayers: (svg: string) => Layer[];
    selectedLayers: string[];
    handleLayerClick: (layerId: string) => void;
}

export interface PlayHeadProps {
    playheadPosition: number;
    cumulativeDurations: number[];
    handleMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    handleMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface PreviewProps {
    setSvgDataList: React.Dispatch<React.SetStateAction<string[]>>;
    selectedSvg: string | null;
    svgContainerRef: React.RefObject<HTMLCanvasElement>;
    backgroundImage: string | null;
    setBackgroundImage: React.Dispatch<React.SetStateAction<string | null>>;
    selectedLayers: string[];
    svgPosition: { x: number; y: number };
    setSvgPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
}

export interface CanvasPreviewProps {
    backgroundImage: string | null;
    svgContainerRef: React.RefObject<HTMLCanvasElement>;
    svgPosition: { x: number; y: number };
    setSvgPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
    applyLayerStyles: (svg: string, layersToHighlight: string[]) => string;
    selectedSvg: string | null;
    selectedLayers: string[];
}

export interface Frame {
    image: string;
    time: {
        seconds: number;
        milliseconds: number;
    };
    index: number;
}