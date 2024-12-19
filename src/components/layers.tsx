import React from "react";

interface Layer {
  id: string;
  children: Array<{ id?: string }>;
}

interface LayersProps {
  selectedSvg: string | null; // SVG string
  parseSvgLayers: (svg: string) => Layer[]; // Function to parse SVG layers
  selectedLayers: string[]; // Selected layers
  handleLayerClick: (layerId: string) => void; // Layer click handler
}

const Layers: React.FC<LayersProps> = ({
  selectedSvg,
  parseSvgLayers,
  selectedLayers,
  handleLayerClick,
}) => {
  if (!selectedSvg) return null;

  const layers = parseSvgLayers(selectedSvg);

  return (
    <div className="layers-container">
      <ul>
        {layers.map((layer) => (
          <li key={layer.id}>
            <button
              onClick={() => handleLayerClick(layer.id)}
              style={{
                background: selectedLayers.includes(layer.id)
                  ? "#f49a03e0"
                  : "#f57622",
              }}
            >
              {layer.id}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Layers;
