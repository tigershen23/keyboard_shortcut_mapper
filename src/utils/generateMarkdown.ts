import type { KeyboardLayout, KeyMapping, LayerMappings } from "../types";

export function generateMappingsMarkdown(mappings: LayerMappings, layout: KeyboardLayout): string {
  const keyLookup = buildKeyLookup(layout);

  const sections: string[] = [];

  const hyperMappings = sortMappingsByKeyOrder(mappings.hyper, keyLookup);
  if (hyperMappings.length > 0) {
    sections.push(formatLayerSection("Hyper", hyperMappings, keyLookup));
  }

  const commandMappings = sortMappingsByKeyOrder(mappings.command, keyLookup);
  if (commandMappings.length > 0) {
    sections.push(formatLayerSection("Command", commandMappings, keyLookup));
  }

  return sections.join("\n\n");
}

interface KeyInfo {
  order: number;
  label: string;
}

function buildKeyLookup(layout: KeyboardLayout): Map<string, KeyInfo> {
  const lookup = new Map<string, KeyInfo>();
  let order = 0;
  for (const row of layout) {
    for (const key of row.keys) {
      lookup.set(key.id, {
        order,
        label: formatKeyLabel(key.id, key.label, key.textLabel),
      });
      order++;
    }
  }
  return lookup;
}

function sortMappingsByKeyOrder(mappings: KeyMapping[], lookup: Map<string, KeyInfo>): KeyMapping[] {
  return [...mappings].sort((a, b) => {
    const orderA = lookup.get(a.keyId)?.order ?? Infinity;
    const orderB = lookup.get(b.keyId)?.order ?? Infinity;
    return orderA - orderB;
  });
}

function formatLayerSection(layerName: string, mappings: KeyMapping[], lookup: Map<string, KeyInfo>): string {
  const header = `## ${layerName}`;
  const items = mappings.map((m) => {
    const label = lookup.get(m.keyId)?.label ?? m.keyId.toUpperCase();
    return `- ${label}: ${m.action}`;
  });
  return [header, "", ...items].join("\n");
}

// Overrides for markdown output where layout labels aren't ideal
const LABEL_OVERRIDES: Record<string, string> = {
  backspace: "Backspace",
  fn: "Fn",
  space: "Space",
  "arrow-left": "←",
  "arrow-up": "↑",
  "arrow-down": "↓",
  "arrow-right": "→",
};

function formatKeyLabel(id: string, label: string, textLabel?: string): string {
  if (LABEL_OVERRIDES[id]) return LABEL_OVERRIDES[id];
  if (textLabel) {
    if (id.endsWith("-left")) return `Left ${capitalize(textLabel)}`;
    if (id.endsWith("-right")) return `Right ${capitalize(textLabel)}`;
    return capitalize(textLabel);
  }
  if (label) return label;
  return id.toUpperCase();
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
