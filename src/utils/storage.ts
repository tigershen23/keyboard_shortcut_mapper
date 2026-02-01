import { defaultMappings } from "../data/default-mappings";
import type { LayerMappings, LayerType, StoredConfig } from "../types";

const STORAGE_KEY = "keyboard-shortcut-mapper";
const LAYER_KEY = "keyboard-shortcut-mapper-layer";
const INFO_DISMISSED_KEY = "keyboard-shortcut-mapper-info-dismissed";
const CURRENT_VERSION = 1;
const VALID_LAYERS: LayerType[] = ["base", "hyper", "command"];

export function saveMappings(mappings: LayerMappings): void {
  const config: StoredConfig = {
    version: CURRENT_VERSION,
    layers: mappings,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save mappings: localStorage unavailable or full.", e);
  }
}

export function loadMappings(): LayerMappings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultMappings;
    }

    const config: StoredConfig = JSON.parse(stored);

    if (config.version !== CURRENT_VERSION) {
      return defaultMappings;
    }

    if (!config.layers || !config.layers.hyper || !config.layers.command) {
      return defaultMappings;
    }

    return config.layers;
  } catch (e) {
    console.error("Failed to load mappings from localStorage:", e);
    return defaultMappings;
  }
}

export function resetMappings(): LayerMappings {
  localStorage.removeItem(STORAGE_KEY);
  return defaultMappings;
}

export function saveSelectedLayer(layer: LayerType): void {
  try {
    localStorage.setItem(LAYER_KEY, layer);
  } catch (e) {
    console.error("Failed to save selected layer:", e);
  }
}

export function loadSelectedLayer(): LayerType {
  try {
    const stored = localStorage.getItem(LAYER_KEY);
    if (stored && VALID_LAYERS.includes(stored as LayerType)) {
      return stored as LayerType;
    }
  } catch (e) {
    console.error("Failed to load selected layer:", e);
  }
  return "base";
}

export function isFirstVisit(): boolean {
  try {
    return localStorage.getItem(INFO_DISMISSED_KEY) !== "true";
  } catch (e) {
    console.error("Failed to check if first visit:", e);
    return true;
  }
}

export function markInfoDismissed(): void {
  try {
    localStorage.setItem(INFO_DISMISSED_KEY, "true");
  } catch (e) {
    console.error("Failed to mark info dismissed:", e);
  }
}
