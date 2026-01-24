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
  $rippleColor?: string;
  $width: number;
  $height: number;
}

const StyledKey = styled.div<StyledKeyProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ $height }) =>
    $height === 0.5 ? `calc(var(--key-unit) / 2 - var(--key-gap) / 2)` : `var(--key-unit)`};
  min-width: var(--key-unit);
  width: ${({ $width }) => `calc(${$width} * var(--key-unit) + ${$width - 1} * var(--key-gap))`};
  background: linear-gradient(
    180deg,
    #fcfcfd 0%,
    #f4f4f6 25%,
    #ededf0 60%,
    #e5e5e8 100%
  );
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: var(--key-radius);
  cursor: default;
  user-select: none;
  transition: all 0.1s ease-out;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.02),
    0 1px 2px rgba(0, 0, 0, 0.08),
    0 1px 1px rgba(0, 0, 0, 0.05);
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
      #ffffff 0%,
      #fafafa 25%,
      #f5f5f7 60%,
      #efeff2 100%
    );
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.02),
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: translateY(1px);
    background: linear-gradient(
      180deg,
      #f8f8fa 0%,
      #f0f0f2 25%,
      #eaeaec 60%,
      #e3e3e6 100%
    );
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.7),
      inset 0 -1px 0 rgba(0, 0, 0, 0.01),
      0 0 2px rgba(0, 0, 0, 0.06);
  }

  ${({ $isFunction }) =>
    $isFunction &&
    css`
      background: linear-gradient(
        180deg,
        #f2f2f6 0%,
        #eaeaee 25%,
        #e4e4e8 60%,
        #dcdce0 100%
      );
      &:hover {
        background: linear-gradient(
          180deg,
          #fafafe 0%,
          #f4f4f8 25%,
          #eeeeef2 60%,
          #e6e6ea 100%
        );
      }
    `}

  ${({ $isSpace }) =>
    $isSpace &&
    css`
      background: linear-gradient(
        180deg,
        #f8f8fc 0%,
        #f0f0f4 35%,
        #e8e8ec 65%,
        #e0e0e4 100%
      );
      &:hover {
        background: linear-gradient(
          180deg,
          #ffffff 0%,
          #f8f8fc 35%,
          #f0f0f4 65%,
          #eaeaee 100%
        );
      }
    `}

  ${({ $isPressed }) =>
    $isPressed &&
    css`
      transform: translateY(1px);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        inset 0 -1px 0 rgba(0, 0, 0, 0.01),
        0 0 2px rgba(0, 0, 0, 0.08);
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
      opacity: 0.35;
      background: linear-gradient(
        180deg,
        #f0f0f2 0%,
        #e8e8ea 25%,
        #e2e2e4 60%,
        #dadade 100%
      );
      &:hover {
        opacity: 0.5;
        background: linear-gradient(
          180deg,
          #f4f4f6 0%,
          #ececee 25%,
          #e6e6e8 60%,
          #dfe0e2 100%
        );
      }
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
  font-family: "Geist Mono", "SF Mono", monospace;
  font-size: var(--font-key);
  font-weight: 500;
  color: #2a2a2c;
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
      color: #4a4a4c;
      text-transform: lowercase;
    `}

  ${({ $isModifier }) =>
    $isModifier &&
    css`
      font-size: var(--font-key-modifier);
      font-weight: 400;
      color: #3a3a3c;
    `}
`;

const KeyLabelSecondary = styled.span`
  font-family: "Geist Mono", "SF Mono", monospace;
  font-size: var(--font-key-secondary);
  font-weight: 500;
  color: #707074;
`;

const KeyLabelPrimary = styled.span`
  font-family: "Geist Mono", "SF Mono", monospace;
  font-size: var(--font-key);
  font-weight: 500;
  color: #2a2a2c;
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
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));

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
}>`
  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(7px, 0.8vw, 11px);
  font-weight: 500;
  color: #3a3a3c;
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
`;

interface KeyProps {
  definition: KeyDefinition;
  isPressed?: boolean;
  onClick?: () => void;
  rippleColor?: string;
  currentLayer?: LayerType;
  mapping?: KeyMapping | null;
  iconPath?: string | null;
}

export function Key({
  definition,
  isPressed,
  onClick,
  rippleColor,
  currentLayer = "base",
  mapping,
  iconPath,
}: KeyProps) {
  const { id, label, secondaryLabel, width = 1, height = 1, isModifier, isFunction } = definition;

  const isBaseLayer = currentLayer === "base";
  const isRegularKey = !isModifier && !isFunction && !isSpecialKey(id);
  const hasMapping = mapping !== null && mapping !== undefined;
  const isSpace = id === "space";
  const isCommandLayer = currentLayer === "command";

  const showBaseLabel = isBaseLayer || !isRegularKey;
  const showMapping = !isBaseLayer && isRegularKey && hasMapping;
  const isDimmed = !isBaseLayer && isRegularKey && !hasMapping;

  return (
    <StyledKey
      $isFunction={isFunction}
      $isModifier={isModifier}
      $isSpace={isSpace}
      $isPressed={isPressed}
      $isDimmed={isDimmed}
      $rippleColor={rippleColor}
      $width={width}
      $height={height}
      data-key-id={id}
      onClick={onClick}
    >
      {showBaseLabel && renderBaseLabel(label, secondaryLabel, isFunction, isModifier)}
      {showMapping && mapping && renderMappingContent(mapping, iconPath, isSpace, isCommandLayer)}
    </StyledKey>
  );
}

function renderBaseLabel(
  label: string,
  secondaryLabel?: string,
  isFunction?: boolean,
  isModifier?: boolean,
) {
  if (secondaryLabel) {
    return (
      <KeyLabels>
        <KeyLabelSecondary>{secondaryLabel}</KeyLabelSecondary>
        <KeyLabelPrimary>{label}</KeyLabelPrimary>
      </KeyLabels>
    );
  }
  return (
    <KeyLabel $isFunction={isFunction} $isModifier={isModifier}>
      {label}
    </KeyLabel>
  );
}

function renderMappingContent(
  mapping: KeyMapping,
  iconPath?: string | null,
  isSpace?: boolean,
  isCommandLayer?: boolean,
) {
  return (
    <KeyMapping $isSpace={isSpace}>
      {iconPath && (
        <KeyMappingIcon src={iconPath} alt={mapping.action} $isSpace={isSpace} loading="lazy" />
      )}
      <KeyMappingLabel $isSpace={isSpace} $isCommandLayer={isCommandLayer}>
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
