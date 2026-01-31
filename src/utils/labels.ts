import type { KeyDefinition, KeyMapping, LayerType } from "../types";

const MODIFIER_LABELS: Record<string, string> = {
  "control-left": "Left Control",
  "control-right": "Right Control",
  "option-left": "Left Option",
  "option-right": "Right Option",
  "command-left": "Left Command",
  "command-right": "Right Command",
};

export function getKeyLabel(
  definition: KeyDefinition,
  currentLayer: LayerType,
  mapping?: KeyMapping | null,
  _isEditable?: boolean,
  isSelected?: boolean,
): string {
  const { id, label, textLabel } = definition;

  const keyIdentity = MODIFIER_LABELS[id] ?? textLabel ?? label ?? id;

  if (currentLayer === "base") {
    return `${keyIdentity} key`;
  }

  if (!mapping) {
    return `${keyIdentity} key: unmapped, click to assign`;
  }

  let mappedLabel: string;
  if (mapping.appName) {
    mappedLabel = `${keyIdentity} key: ${mapping.appName} - ${mapping.action}`;
  } else {
    mappedLabel = `${keyIdentity} key: ${mapping.action}`;
  }

  if (isSelected) {
    mappedLabel += ", editing";
  }

  return mappedLabel;
}

export function getLayerTabLabel(layerName: string, isActive: boolean, count: number | null): string {
  const countText = count !== null ? `, ${count} shortcuts` : "";
  const activeText = isActive ? " layer, active" : " layer";
  return `${layerName}${activeText}${countText}`;
}

export function getLayerSelectorLabel(layerCount: number): string {
  return `Layer selector, ${layerCount} layers`;
}

export function getActionInputLabel(currentValue: string): string {
  const valueText = currentValue ? `current value: ${currentValue}` : "empty";
  return `Action name input, ${valueText}`;
}

export function getSaveButtonLabel(isDisabled: boolean): string {
  if (isDisabled) {
    return "Save mapping, disabled - enter action name";
  }
  return "Save mapping";
}

export function getAppSearchLabel(currentValue: string, isOpen: boolean): string {
  const valueText = currentValue ? `current value: ${currentValue}` : "empty";
  const stateText = isOpen ? "dropdown open" : "dropdown closed";
  return `App search, ${valueText}, ${stateText}`;
}

export function getAppDropdownLabel(totalApps: number, filteredCount: number): string {
  return `App list, ${totalApps} apps, showing ${filteredCount} filtered`;
}

export function getAppOptionLabel(appName: string): string {
  return `Select ${appName} app`;
}
