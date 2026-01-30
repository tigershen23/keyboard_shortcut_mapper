import type { KeyboardLayout, KeyMapping, LayerMappings } from "../types";

/**
 * Generates a markdown string of all keyboard mappings, organized by layer.
 * Keys are ordered by keyboard row (top to bottom), then left to right.
 */
export function generateMappingsMarkdown(mappings: LayerMappings, layout: KeyboardLayout): string {
  const keyOrder = getKeyOrder(layout);

  const sections: string[] = [];

  const hyperMappings = sortMappingsByKeyOrder(mappings.hyper, keyOrder);
  if (hyperMappings.length > 0) {
    sections.push(formatLayerSection("Hyper", hyperMappings, keyOrder));
  }

  const commandMappings = sortMappingsByKeyOrder(mappings.command, keyOrder);
  if (commandMappings.length > 0) {
    sections.push(formatLayerSection("Command", commandMappings, keyOrder));
  }

  return sections.join("\n\n");
}

/**
 * Creates a flat array of key IDs in keyboard order (row by row, left to right).
 */
function getKeyOrder(layout: KeyboardLayout): string[] {
  return layout.flatMap((row) => row.keys.map((key) => key.id));
}

/**
 * Sorts mappings according to keyboard key order.
 */
function sortMappingsByKeyOrder(mappings: KeyMapping[], keyOrder: string[]): KeyMapping[] {
  return [...mappings].sort((a, b) => {
    const indexA = keyOrder.indexOf(a.keyId);
    const indexB = keyOrder.indexOf(b.keyId);
    return indexA - indexB;
  });
}

/**
 * Formats a single layer section with header and mapping list.
 */
function formatLayerSection(layerName: string, mappings: KeyMapping[], _keyOrder: string[]): string {
  const header = `## ${layerName}`;
  const items = mappings.map((m) => `- ${formatKeyLabel(m.keyId)}: ${m.action}`);
  return [header, "", ...items].join("\n");
}

/**
 * Converts a key ID to a display label for the markdown output.
 */
function formatKeyLabel(keyId: string): string {
  const labelMap: Record<string, string> = {
    backtick: "`",
    minus: "-",
    equals: "=",
    backspace: "Backspace",
    tab: "Tab",
    "bracket-left": "[",
    "bracket-right": "]",
    backslash: "\\",
    caps: "Caps Lock",
    semicolon: ";",
    quote: "'",
    return: "Return",
    "shift-left": "Left Shift",
    "shift-right": "Right Shift",
    comma: ",",
    period: ".",
    slash: "/",
    fn: "Fn",
    control: "Control",
    "option-left": "Left Option",
    "option-right": "Right Option",
    "command-left": "Left Command",
    "command-right": "Right Command",
    space: "Space",
    "arrow-left": "←",
    "arrow-up": "↑",
    "arrow-down": "↓",
    "arrow-right": "→",
  };

  return labelMap[keyId] ?? keyId.toUpperCase();
}
