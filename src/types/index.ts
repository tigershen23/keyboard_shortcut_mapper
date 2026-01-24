export interface KeyDefinition {
  id: string;
  label: string;
  secondaryLabel?: string; // For keys with shift symbols (e.g., "1" and "!")
  width?: number; // Width in units, default 1
  height?: number; // Height in units, default 1 (0.5 for half-height arrows)
  isModifier?: boolean;
  isFunction?: boolean;
}

export interface KeyboardRow {
  keys: KeyDefinition[];
}

export type KeyboardLayout = KeyboardRow[];

export type LayerType = "base" | "hyper" | "command";

export interface LayerConfig {
  id: LayerType;
  label: string;
  shortLabel: string;
  accentColor: string;
  rippleColor: string;
}
