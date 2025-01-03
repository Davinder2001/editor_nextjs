import { Layer, LayersProps } from "@/utils/types";

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
        {layers.map((layer:Layer) => (
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