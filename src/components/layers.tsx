import React from 'react'
interface PreviewProps {
    selectedSvg: any;
    parseSvgLayers: () => void;
    selectedLayers: string;
    handleLayerClick: () => void;
}

const Layers = ({selectedSvg, parseSvgLayers, selectedLayers, handleLayerClick }) => {
  return (
   <>
    <ul>
              {selectedSvg && parseSvgLayers(selectedSvg).map((layer) => (
                <li key={layer.id}>
                  {/* Main Layer */}
                  <button
                    onClick={() => handleLayerClick(layer.id)}
                    style={{
                      background: selectedLayers.includes(layer.id) ? "lightblue" : "transparent",
                      padding: "8px",
                      cursor: "pointer",
                      margin: "4px 0",
                      width: "100%",
                      color: "black", // Main layer in black
                    }}
                  >
                    {layer.id}
                  </button>


                  {/* Children */}
                  {layer.children.length > 0 && (
                    <ul style={{ paddingLeft: "16px" }}>
                      {layer.children.map((child, childIndex) => (
                        <li key={`${layer.id}-child-${childIndex}`}>
                          <button
                            onClick={() => handleLayerClick(child.id || `${layer.id}-child-${childIndex}`)}
                            style={{
                              display: 'none',
                              background: selectedLayers.includes(child.id) ? "lightcoral" : "transparent",
                              padding: "8px",
                              cursor: "pointer",
                              margin: "4px 0",
                              width: "100%",
                              color: "red", // Children in red
                            }}
                          >
                            {child.id || `Child ${childIndex}`}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
   </>
  )
}

export default Layers