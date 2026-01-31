import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getIconPath } from "../data/icon-manifest";
import type { KeyMapping, LayerMappings, LayerType } from "../types";
import { loadMappings, resetMappings as resetStoredMappings, saveMappings } from "../utils/storage";

interface MappingContextValue {
  mappings: LayerMappings;
  getMappingForKey: (keyId: string, layer: LayerType) => KeyMapping | null;
  getIconForMapping: (mapping: KeyMapping) => string | null;
  updateMapping: (layer: LayerType, mapping: KeyMapping) => void;
  deleteMapping: (layer: LayerType, keyId: string) => void;
  resetToDefaults: () => void;
  selectedKeyId: string | null;
  selectedKeyRect: DOMRect | null;
  selectKey: (keyId: string, element: HTMLElement) => void;
  clearSelection: () => void;
}

const MappingContext = createContext<MappingContextValue | null>(null);

type ModifiableLayer = "hyper" | "command";

function isModifiableLayer(layer: LayerType): layer is ModifiableLayer {
  return layer === "hyper" || layer === "command";
}

export function MappingProvider({ children }: { children: React.ReactNode }) {
  const [mappings, setMappings] = useState<LayerMappings>(() => loadMappings());
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [selectedKeyRect, setSelectedKeyRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    saveMappings(mappings);
  }, [mappings]);

  const getMappingForKey = useCallback(
    (keyId: string, layer: LayerType): KeyMapping | null => {
      if (!isModifiableLayer(layer)) return null;
      return mappings[layer].find((m) => m.keyId === keyId) ?? null;
    },
    [mappings],
  );

  const getIconForMapping = (mapping: KeyMapping): string | null => {
    if (mapping.iconPath) return mapping.iconPath;
    if (mapping.appName) return getIconPath(mapping.appName);
    return null;
  };

  const updateMapping = useCallback((layer: LayerType, mapping: KeyMapping) => {
    if (!isModifiableLayer(layer)) return;

    setMappings((prev) => {
      const existingIndex = prev[layer].findIndex((m) => m.keyId === mapping.keyId);

      const newLayerMappings =
        existingIndex >= 0 ? prev[layer].map((m, i) => (i === existingIndex ? mapping : m)) : [...prev[layer], mapping];

      return {
        ...prev,
        [layer]: newLayerMappings,
      };
    });
  }, []);

  const deleteMapping = useCallback((layer: LayerType, keyId: string) => {
    if (!isModifiableLayer(layer)) return;

    setMappings((prev) => ({
      ...prev,
      [layer]: prev[layer].filter((m) => m.keyId !== keyId),
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaults = resetStoredMappings();
    setMappings(defaults);
  }, []);

  const selectKey = useCallback((keyId: string, element: HTMLElement) => {
    setSelectedKeyId(keyId);
    setSelectedKeyRect(element.getBoundingClientRect());
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedKeyId(null);
    setSelectedKeyRect(null);
  }, []);

  return (
    <MappingContext.Provider
      value={{
        mappings,
        getMappingForKey,
        getIconForMapping,
        updateMapping,
        deleteMapping,
        resetToDefaults,
        selectedKeyId,
        selectedKeyRect,
        selectKey,
        clearSelection,
      }}
    >
      {children}
    </MappingContext.Provider>
  );
}

export function useMappingContext() {
  const context = useContext(MappingContext);
  if (!context) {
    throw new Error("useMappingContext must be used within MappingProvider");
  }
  return context;
}
