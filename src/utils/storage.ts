import { defaultMappings } from "../data/default-mappings";
import type { LayerMappings, StoredConfig } from "../types";

const STORAGE_KEY = "keyboard-shortcut-mapper";
const CURRENT_VERSION = 1;

export function saveMappings(mappings: LayerMappings): void {
  const config: StoredConfig = {
    version: CURRENT_VERSION,
    layers: mappings,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save mappings:", e);
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
    console.error("Failed to load mappings:", e);
    return defaultMappings;
  }
}

export function resetMappings(): LayerMappings {
  localStorage.removeItem(STORAGE_KEY);
  return defaultMappings;
}
