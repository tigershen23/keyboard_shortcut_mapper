import React from "react";
import styled, { css, keyframes } from "styled-components";
import type { KeyDefinition, KeyMapping, LayerType } from "../types";

const keyFlash = keyframes`
  0% { opacity: 0; }
  20% { opacity: 1; }
  100% { opacity: 0; }
`;

const keyGlow = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  30% {
    opacity: 0.8;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
`;

interface StyledKeyProps {
  $isFunction?: boolean;
  $isModifier?: boolean;
  $isSpace?: boolean;
  $isPressed?: boolean;
  $isDimmed?: boolean;
  $isEditable?: boolean;
  $isSelected?: boolean;
  $layerAccent?: string;
  $rippleColor?: string;
  $width: number;
  $height: number;
}

const StyledKey = styled.div<StyledKeyProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ $height }: { $height: number }) =>
    $height === 0.5 ? `calc(var(--key-unit) / 2 - var(--key-gap) / 2)` : `var(--key-unit)`};
  min-width: var(--key-unit);
  width: ${({ $width }: { $width: number }) => `calc(${$width} * var(--key-unit) + ${$width - 1} * var(--key-gap))`};
  background: linear-gradient(
    180deg,
    #2c2c2e 0%,
    #1d1d1f 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--key-radius);
  cursor: default;
  user-select: none;
  transition: all 0.1s ease-out;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  overflow: hidden;

  --ripple-color: ${({ $rippleColor }) => $rippleColor || "rgba(140, 160, 150, 0.3)"};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      var(--ripple-color) 0%,
      transparent 50%,
      ${({ $rippleColor }) => $rippleColor || "rgba(140, 160, 150, 0.15)"} 100%
    );
    opacity: 0;
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--ripple-color);
    opacity: 0;
    pointer-events: none;
    z-index: 0;
  }

  &:hover {
    background: linear-gradient(
      180deg,
      #3a3a3c 0%,
      #2c2c2e 100%
    );
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  }

  &:active {
    background: linear-gradient(
      180deg,
      #252527 0%,
      #1a1a1c 100%
    );
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
  }

  ${({ $isFunction }) =>
    $isFunction &&
    css`
      background: linear-gradient(
        180deg,
        #2a2a2c 0%,
        #1c1c1e 100%
      );
      &:hover {
        background: linear-gradient(
          180deg,
          #383838 0%,
          #2a2a2c 100%
        );
      }
    `}

  ${({ $isSpace }) =>
    $isSpace &&
    css`
      background: linear-gradient(
        180deg,
        #2e2e30 0%,
        #1f1f21 100%
      );
      &:hover {
        background: linear-gradient(
          180deg,
          #3c3c3e 0%,
          #2e2e30 100%
        );
      }
    `}

  ${({ $isPressed }) =>
    $isPressed &&
    css`
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
      &::before {
        animation: ${keyFlash} 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      &::after {
        animation: ${keyGlow} 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
    `}

  ${({ $isDimmed }) =>
    $isDimmed &&
    css`
      opacity: 0.4;
      background: linear-gradient(
        180deg,
        #252527 0%,
        #1a1a1c 100%
      );
      &:hover {
        opacity: 0.55;
        background: linear-gradient(
          180deg,
          #2a2a2c 0%,
          #1e1e20 100%
        );
      }
    `}

  ${({ $isEditable }) =>
    $isEditable &&
    css`
      cursor: pointer;
    `}

  ${({ $isSelected, $layerAccent }) =>
    $isSelected &&
    css`
      box-shadow:
        inset 0 0 0 2px ${$layerAccent || "rgba(100, 180, 160, 0.9)"},
        0 0 16px ${$layerAccent || "rgba(100, 180, 160, 0.4)"},
        0 1px 2px rgba(0, 0, 0, 0.3);
      z-index: 10;
    `}
`;

const KeyLabels = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(0px, 0.15vw, 2px);
  line-height: 1;
  position: relative;
  z-index: 2;
`;

const KeyLabel = styled.span<{ $isFunction?: boolean; $isModifier?: boolean }>`
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
  font-size: var(--font-key);
  font-weight: 500;
  color: #ffffff;
  line-height: 1;
  white-space: nowrap;
  text-align: center;
  position: relative;
  z-index: 2;

  ${({ $isFunction }) =>
    $isFunction &&
    css`
      font-size: var(--font-key-function);
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      text-transform: lowercase;
    `}

  ${({ $isModifier }) =>
    $isModifier &&
    css`
      font-size: var(--font-key-modifier);
      font-weight: 400;
      color: rgba(255, 255, 255, 0.95);
    `}
`;

const KeyLabelSecondary = styled.span`
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
  font-size: var(--font-key-secondary);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
`;

const KeyLabelPrimary = styled.span`
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
  font-size: var(--font-key);
  font-weight: 500;
  color: #ffffff;
`;

const KeyMapping = styled.div<{ $isSpace?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(2px, 0.3vw, 4px);
  position: relative;
  z-index: 2;
  padding: clamp(2px, 0.3vw, 4px);
  width: 100%;
  height: 100%;

  ${({ $isSpace }) =>
    $isSpace &&
    css`
      flex-direction: row;
      gap: clamp(6px, 0.8vw, 10px);
    `}
`;

const KeyMappingIcon = styled.img<{ $isSpace?: boolean }>`
  width: clamp(16px, 2vw, 32px);
  height: clamp(16px, 2vw, 32px);
  object-fit: contain;
  border-radius: clamp(3px, 0.4vw, 6px);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));

  ${({ $isSpace }) =>
    $isSpace &&
    css`
      width: clamp(20px, 2.5vw, 36px);
      height: clamp(20px, 2.5vw, 36px);
    `}
`;

const KeyMappingLabel = styled.span<{
  $isSpace?: boolean;
  $isCommandLayer?: boolean;
  $hasIcon?: boolean;
}>`
  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(7px, 0.8vw, 11px);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 1.1;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ $isSpace }) =>
    $isSpace &&
    css`
      font-size: clamp(9px, 1vw, 13px);
    `}

  ${({ $isCommandLayer }) =>
    $isCommandLayer &&
    css`
      font-weight: 600;
      letter-spacing: 0.02em;
    `}

  ${({ $isCommandLayer, $hasIcon }) =>
    $isCommandLayer &&
    !$hasIcon &&
    css`
      white-space: normal;
      overflow-wrap: break-word;
      word-break: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    `}
`;

// Modifier key specific styled components
const ModifierTextLabel = styled.span<{ $align?: "left" | "right" | "center" }>`
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
  font-size: clamp(7px, 0.9vw, 12px);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
  text-transform: lowercase;
  line-height: 1;
  position: absolute;
  z-index: 2;

  ${({ $align }) => {
    if ($align === "left") {
      return css`
        left: clamp(4px, 0.5vw, 8px);
        bottom: clamp(3px, 0.4vw, 6px);
      `;
    }
    if ($align === "right") {
      return css`
        right: clamp(4px, 0.5vw, 8px);
        bottom: clamp(3px, 0.4vw, 6px);
      `;
    }
    return css`
      bottom: clamp(3px, 0.4vw, 6px);
    `;
  }}
`;

const ModifierStackedLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: clamp(3px, 0.4vw, 6px) clamp(4px, 0.5vw, 8px);
  position: relative;
  z-index: 2;
`;

const ModifierSymbol = styled.span`
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
  font-size: clamp(10px, 1.3vw, 18px);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1;
`;

const ModifierText = styled.span`
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
  font-size: clamp(6px, 0.75vw, 10px);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
  text-transform: lowercase;
  line-height: 1;
`;

const FnKeyLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(1px, 0.15vw, 3px);
  position: relative;
  z-index: 2;
`;

const FnGlobe = styled.span`
  font-size: clamp(10px, 1.2vw, 16px);
  line-height: 1;
`;

const FnText = styled.span`
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
  font-size: clamp(7px, 0.9vw, 12px);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1;
`;

const CapsLockIndicator = styled.span`
  position: absolute;
  left: clamp(4px, 0.5vw, 8px);
  top: 50%;
  transform: translateY(-50%);
  width: clamp(3px, 0.4vw, 5px);
  height: clamp(3px, 0.4vw, 5px);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  z-index: 2;
`;

interface KeyProps {
  definition: KeyDefinition;
  isPressed?: boolean;
  onClick?: () => void;
  rippleColor?: string;
  currentLayer?: LayerType;
  mapping?: KeyMapping | null;
  iconPath?: string | null;
  isEditable?: boolean;
  isSelected?: boolean;
  layerAccent?: string;
  onSelect?: (keyId: string, element: HTMLElement) => void;
}

export function Key({
  definition,
  isPressed,
  onClick,
  rippleColor,
  currentLayer = "base",
  mapping,
  iconPath,
  isEditable,
  isSelected,
  layerAccent,
  onSelect,
}: KeyProps) {
  const { id, width = 1, height = 1, isModifier, isFunction } = definition;

  const isBaseLayer = currentLayer === "base";
  const isRegularKey = !isModifier && !isFunction && !isSpecialKey(id);
  const hasMapping = mapping !== null && mapping !== undefined;
  const isSpace = id === "space";
  const isCommandLayer = currentLayer === "command";

  const showBaseLabel = isBaseLayer || !isRegularKey;
  const showMapping = !isBaseLayer && isRegularKey && hasMapping;
  const isDimmed = !isBaseLayer && isRegularKey && !hasMapping;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditable && onSelect) {
      onSelect(id, e.currentTarget);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <StyledKey
      $isFunction={isFunction}
      $isModifier={isModifier}
      $isSpace={isSpace}
      $isPressed={isPressed}
      $isDimmed={isDimmed}
      $isEditable={isEditable}
      $isSelected={isSelected}
      $layerAccent={layerAccent}
      $rippleColor={rippleColor}
      $width={width}
      $height={height}
      data-key-id={id}
      onClick={handleClick}
    >
      {showBaseLabel && renderBaseLabel(definition, isFunction, isModifier)}
      {showMapping && mapping && renderMappingContent(mapping, iconPath, isSpace, isCommandLayer)}
    </StyledKey>
  );
}

function renderBaseLabel(definition: KeyDefinition, isFunction?: boolean, isModifier?: boolean) {
  const { id, label, secondaryLabel, textLabel, symbolLabel, hasIndicator } = definition;

  // Fn key has special stacked layout with globe
  if (id === "fn") {
    return (
      <FnKeyLayout>
        <FnGlobe>{symbolLabel}</FnGlobe>
        <FnText>{label}</FnText>
      </FnKeyLayout>
    );
  }

  // Bottom-row modifiers with symbol on top, text below (control, option, command)
  if (symbolLabel && textLabel) {
    return (
      <ModifierStackedLayout>
        <ModifierSymbol>{symbolLabel}</ModifierSymbol>
        <ModifierText>{textLabel}</ModifierText>
      </ModifierStackedLayout>
    );
  }

  // Text-only modifiers (tab, caps lock, shift, delete, return)
  if (textLabel && !symbolLabel) {
    const align = getTextLabelAlignment(id);
    return (
      <>
        {hasIndicator && <CapsLockIndicator />}
        <ModifierTextLabel $align={align}>{textLabel}</ModifierTextLabel>
      </>
    );
  }

  // Standard keys with secondary labels (number row, punctuation)
  if (secondaryLabel) {
    return (
      <KeyLabels>
        <KeyLabelSecondary>{secondaryLabel}</KeyLabelSecondary>
        <KeyLabelPrimary>{label}</KeyLabelPrimary>
      </KeyLabels>
    );
  }

  // Simple single-label keys (letters, arrows)
  return (
    <KeyLabel $isFunction={isFunction} $isModifier={isModifier}>
      {label}
    </KeyLabel>
  );
}

function getTextLabelAlignment(keyId: string): "left" | "right" | "center" {
  switch (keyId) {
    case "backspace":
    case "return":
      return "right";
    case "shift-right":
      return "right";
    case "tab":
    case "caps":
    case "shift-left":
    default:
      return "left";
  }
}

function renderMappingContent(
  mapping: KeyMapping,
  iconPath?: string | null,
  isSpace?: boolean,
  isCommandLayer?: boolean,
) {
  const hasIcon = Boolean(iconPath);
  return (
    <KeyMapping $isSpace={isSpace}>
      {iconPath && (
        <KeyMappingIcon src={iconPath} alt={mapping.action} $isSpace={isSpace} loading="lazy" />
      )}
      <KeyMappingLabel $isSpace={isSpace} $isCommandLayer={isCommandLayer} $hasIcon={hasIcon}>
        {mapping.action}
      </KeyMappingLabel>
    </KeyMapping>
  );
}

function isSpecialKey(id: string): boolean {
  const specialKeys = [
    "esc",
    "backspace",
    "tab",
    "caps",
    "return",
    "space",
    "arrow-left",
    "arrow-right",
    "arrow-up",
    "arrow-down",
  ];
  return specialKeys.includes(id);
}
