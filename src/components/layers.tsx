interface Layer {
  id: string;  
}

 
interface LayersProps {
  selectedSvg: string | null;  
  parseSvgLayers: (svg: string) => Layer[];  
  selectedLayers: string[];  
  handleLayerClick: (layerId: string) => void;  
}

// LayersComponent
const LayersComponent: React.FC<LayersProps> = ({
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

export default LayersComponent;