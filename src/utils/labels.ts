import type { KeyDefinition, KeyMapping, LayerType } from "../types";

export function getKeyLabel(
  definition: KeyDefinition,
  currentLayer: LayerType,
  mapping?: KeyMapping | null,
  isEditable?: boolean,
  isSelected?: boolean,
): string {
  const { id, label, textLabel } = definition;

  // Build base key identity
  let keyIdentity: string;
  if (textLabel) {
    // For modifiers, use textLabel with side distinction
    if (id === "control-left" || id === "control-right") {
      keyIdentity = id === "control-left" ? "Left Control modifier" : "Right Control modifier";
    } else if (id === "option-left" || id === "option-right") {
      keyIdentity = id === "option-left" ? "Left Option modifier" : "Right Option modifier";
    } else if (id === "command-left" || id === "command-right") {
      keyIdentity = id === "command-left" ? "Left Command modifier" : "Right Command modifier";
    } else {
      // Other text-based keys (tab, caps lock, shift, backspace, return, fn)
      keyIdentity = `${textLabel} key`;
    }
  } else {
    // Standard keys use their label
    keyIdentity = `${label} key`;
  }

  // Base layer: just show key identity
  if (currentLayer === "base") {
    return keyIdentity;
  }

  // Editable layers (hyper/command): show mapping state
  const hasMapping = mapping !== null && mapping !== undefined;

  if (!hasMapping) {
    return `${keyIdentity}: unmapped, click to assign`;
  }

  // Build mapped label
  let mappedLabel: string;
  if (mapping.appName) {
    mappedLabel = `${keyIdentity}: ${mapping.appName} - ${mapping.action}`;
  } else {
    mappedLabel = `${keyIdentity}: ${mapping.action}`;
  }

  // Append editing state if selected
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
