import React, { createContext, useContext, useMemo } from "react";
import type { KeyMapping, LayerMappings, LayerType } from "../types";
import { defaultMappings } from "../data/default-mappings";
import { getIconPath } from "../data/icon-manifest";

interface MappingContextValue {
  mappings: LayerMappings;
  getMappingForKey: (keyId: string, layer: LayerType) => KeyMapping | null;
  getIconForMapping: (mapping: KeyMapping) => string | null;
}

const MappingContext = createContext<MappingContextValue | null>(null);

export function MappingProvider({ children }: { children: React.ReactNode }) {
  const hyperMap = useMemo(() => {
    const map = new Map<string, KeyMapping>();
    defaultMappings.hyper.forEach((m) => map.set(m.keyId, m));
    return map;
  }, []);

  const commandMap = useMemo(() => {
    const map = new Map<string, KeyMapping>();
    defaultMappings.command.forEach((m) => map.set(m.keyId, m));
    return map;
  }, []);

  const getMappingForKey = (keyId: string, layer: LayerType): KeyMapping | null => {
    if (layer === "base") return null;
    if (layer === "hyper") return hyperMap.get(keyId) ?? null;
    if (layer === "command") return commandMap.get(keyId) ?? null;
    return null;
  };

  const getIconForMapping = (mapping: KeyMapping): string | null => {
    if (mapping.iconPath) return mapping.iconPath;
    if (mapping.appName) return getIconPath(mapping.appName);
    return null;
  };

  const value: MappingContextValue = {
    mappings: defaultMappings,
    getMappingForKey,
    getIconForMapping,
  };

  return (
    <MappingContext.Provider value={value}>
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
