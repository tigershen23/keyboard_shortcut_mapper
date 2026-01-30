import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import type { LayerConfig, LayerType } from "../types";
import { loadSelectedLayer, saveSelectedLayer } from "../utils/storage";

const LAYERS: LayerConfig[] = [
  {
    id: "base",
    label: "Base",
    shortLabel: "Base",
  },
  {
    id: "hyper",
    label: "Hyper",
    shortLabel: "Hyper",
  },
  {
    id: "command",
    label: "Command",
    shortLabel: "Command",
  },
];

interface LayerContextValue {
  currentLayer: LayerType;
  currentLayerConfig: LayerConfig;
  setLayer: (layer: LayerType) => void;
  cycleLayer: (direction?: "forward" | "backward") => void;
  layers: LayerConfig[];
}

const LayerContext = createContext<LayerContextValue | null>(null);

export function LayerProvider({ children }: { children: ReactNode }) {
  const [currentLayer, setCurrentLayer] = useState<LayerType>(loadSelectedLayer);

  const cycleLayer = useCallback((direction: "forward" | "backward" = "forward") => {
    setCurrentLayer((current) => {
      const currentIndex = LAYERS.findIndex((l) => l.id === current);
      const nextIndex =
        direction === "forward"
          ? (currentIndex + 1) % LAYERS.length
          : (currentIndex - 1 + LAYERS.length) % LAYERS.length;
      const nextLayer = LAYERS[nextIndex]!.id;
      saveSelectedLayer(nextLayer);
      return nextLayer;
    });
  }, []);

  const setLayer = useCallback((layer: LayerType) => {
    saveSelectedLayer(layer);
    setCurrentLayer(layer);
  }, []);

  const currentLayerConfig = LAYERS.find((l) => l.id === currentLayer) ?? LAYERS[0]!;

  return (
    <LayerContext.Provider
      value={{
        currentLayer,
        currentLayerConfig,
        setLayer,
        cycleLayer,
        layers: LAYERS,
      }}
    >
      {children}
    </LayerContext.Provider>
  );
}

export function useLayerContext() {
  const context = useContext(LayerContext);
  if (!context) {
    throw new Error("useLayerContext must be used within a LayerProvider");
  }
  return context;
}
