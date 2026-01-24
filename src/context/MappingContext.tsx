import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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

export function MappingProvider({ children }: { children: React.ReactNode }) {
  const [mappings, setMappings] = useState<LayerMappings>(() => loadMappings());
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [selectedKeyRect, setSelectedKeyRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    saveMappings(mappings);
  }, [mappings]);

  const hyperMap = useMemo(() => {
    const map = new Map<string, KeyMapping>();
    mappings.hyper.forEach((m) => map.set(m.keyId, m));
    return map;
  }, [mappings.hyper]);

  const commandMap = useMemo(() => {
    const map = new Map<string, KeyMapping>();
    mappings.command.forEach((m) => map.set(m.keyId, m));
    return map;
  }, [mappings.command]);

  const getMappingForKey = useCallback(
    (keyId: string, layer: LayerType): KeyMapping | null => {
      if (layer === "base") return null;
      if (layer === "hyper") return hyperMap.get(keyId) ?? null;
      if (layer === "command") return commandMap.get(keyId) ?? null;
      return null;
    },
    [hyperMap, commandMap],
  );

  const getIconForMapping = useCallback((mapping: KeyMapping): string | null => {
    if (mapping.iconPath) return mapping.iconPath;
    if (mapping.appName) return getIconPath(mapping.appName);
    return null;
  }, []);

  const updateMapping = useCallback((layer: LayerType, mapping: KeyMapping) => {
    if (layer === "base") return;

    setMappings((prev) => {
      const layerKey = layer as "hyper" | "command";
      const existingIndex = prev[layerKey].findIndex((m) => m.keyId === mapping.keyId);

      const newLayerMappings =
        existingIndex >= 0
          ? prev[layerKey].map((m, i) => (i === existingIndex ? mapping : m))
          : [...prev[layerKey], mapping];

      return {
        ...prev,
        [layerKey]: newLayerMappings,
      };
    });
  }, []);

  const deleteMapping = useCallback((layer: LayerType, keyId: string) => {
    if (layer === "base") return;

    setMappings((prev) => {
      const layerKey = layer as "hyper" | "command";
      return {
        ...prev,
        [layerKey]: prev[layerKey].filter((m) => m.keyId !== keyId),
      };
    });
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

  const value: MappingContextValue = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );

  return <MappingContext.Provider value={value}>{children}</MappingContext.Provider>;
}

export function useMappingContext() {
  const context = useContext(MappingContext);
  if (!context) {
    throw new Error("useMappingContext must be used within MappingProvider");
  }
  return context;
}
