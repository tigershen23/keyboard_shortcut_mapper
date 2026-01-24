import React from "react";
import { useLayerContext } from "../context/LayerContext";
import type { LayerType } from "../types";

export function LayerIndicator() {
  const { currentLayer, setLayer, layers } = useLayerContext();

  return (
    <div className="layer-indicator-container">
      <div className="layer-indicator-header">
        <span className="layer-indicator-title">Layer</span>
        <kbd className="layer-indicator-shortcut">Tab</kbd>
      </div>
      <div className="layer-indicator-tabs">
        {layers.map((layer) => (
          <button
            key={layer.id}
            className={`layer-tab ${currentLayer === layer.id ? "layer-tab-active" : ""}`}
            onClick={() => setLayer(layer.id)}
            style={{ "--tab-accent": layer.accentColor } as React.CSSProperties}
          >
            <span className="layer-tab-dot" />
            <span className="layer-tab-label">{layer.shortLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
