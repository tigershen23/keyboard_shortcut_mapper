import React from "react";
import { useLayerContext } from "../context/LayerContext";

export function LayerIndicator() {
  const { currentLayer, setLayer, layers } = useLayerContext();

  return (
    <div className="layer-indicator-container">
      <h1 className="page-title">Mac Keyboard Shortcuts</h1>
      <div className="layer-indicator-wrapper">
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
        <div className="layer-indicator-caption">
          <span className="layer-indicator-label">Layer</span>
          <kbd className="layer-indicator-shortcut">⇥</kbd>
        </div>
      </div>
    </div>
  );
}
