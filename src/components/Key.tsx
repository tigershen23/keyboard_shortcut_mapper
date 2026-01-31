import styled, { css, keyframes } from "styled-components";
import type { KeyDefinition, KeyMapping, LayerType } from "../types";
import { isSpecialKey } from "../utils/keys.js";

const SYSTEM_FONT_STACK = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';

function setAlpha(color: string, alpha: number): string {
  return color.replace(/[\d.]+\)$/, `${alpha})`);
}

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
  height: ${({ $height }) => ($height === 0.5 ? `calc(var(--key-unit) / 2 - var(--key-gap) / 2)` : `var(--key-unit)`)};
  min-width: var(--key-unit);
  width: ${({ $width }) => `calc(${$width} * var(--key-unit) + ${$width - 1} * var(--key-gap))`};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.surface.key.start} 0%,
    ${({ theme }) => theme.surface.key.end} 100%
  );
  border: 1px solid ${({ theme }) => theme.border.subtle};
  border-radius: var(--key-radius);
  cursor: default;
  user-select: none;
  transition: all 0.1s ease-out;
  box-shadow: 0 1px 1px ${({ theme }) => theme.shadow.medium};
  flex-shrink: 0;
  overflow: hidden;

  --ripple-color: ${({ $rippleColor, theme }) => $rippleColor || theme.layers.base.ripple};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      var(--ripple-color) 0%,
      transparent 50%,
      ${({ $rippleColor, theme }) => setAlpha($rippleColor || theme.layers.base.ripple, 0.15)} 100%
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
      ${({ theme }) => theme.surface.keyHover.start} 0%,
      ${({ theme }) => theme.surface.keyHover.end} 100%
    );
    box-shadow: 0 1px 2px ${({ theme }) => theme.shadow.medium};
  }

  &:active {
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.surface.keyActive.start} 0%,
      ${({ theme }) => theme.surface.keyActive.end} 100%
    );
    box-shadow: 0 0 1px ${({ theme }) => theme.shadow.medium};
  }

  ${({ $isFunction, theme }) =>
    $isFunction &&
    css`
      background: linear-gradient(
        180deg,
        ${theme.surface.keyFunction.start} 0%,
        ${theme.surface.keyFunction.end} 100%
      );
      &:hover {
        background: linear-gradient(
          180deg,
          ${theme.surface.keyFunctionHover.start} 0%,
          ${theme.surface.keyFunctionHover.end} 100%
        );
      }
    `}

  ${({ $isSpace, theme }) =>
    $isSpace &&
    css`
      background: linear-gradient(
        180deg,
        ${theme.surface.keySpace.start} 0%,
        ${theme.surface.keySpace.end} 100%
      );
      &:hover {
        background: linear-gradient(
          180deg,
          ${theme.surface.keySpaceHover.start} 0%,
          ${theme.surface.keySpaceHover.end} 100%
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

  ${({ $isDimmed, theme }) =>
    $isDimmed &&
    css`
      opacity: 0.4;
      background: linear-gradient(
        180deg,
        ${theme.surface.keyDimmed.start} 0%,
        ${theme.surface.keyDimmed.end} 100%
      );
      &:hover {
        opacity: 0.55;
        background: linear-gradient(
          180deg,
          ${theme.surface.keyDimmedHover.start} 0%,
          ${theme.surface.keyDimmedHover.end} 100%
        );
      }
    `}

  ${({ $isEditable }) =>
    $isEditable &&
    css`
      cursor: pointer;
    `}

  ${({ $isSelected, $layerAccent, theme }) =>
    $isSelected &&
    css`
      box-shadow:
        inset 0 0 0 2px ${$layerAccent || theme.layers.hyper.accent},
        0 0 16px ${setAlpha($layerAccent || theme.layers.hyper.accent, 0.4)},
        0 1px 2px ${theme.shadow.medium};
      z-index: 10;
    `}
`;

const KeyLabels = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(4px, 0.5vw, 8px);
  line-height: 1;
  position: relative;
  z-index: 2;
`;

const KeyLabel = styled.span<{
  $isFunction?: boolean;
  $isModifier?: boolean;
  $isArrow?: boolean;
}>`
  font-family: ${SYSTEM_FONT_STACK};
  font-size: var(--font-key);
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1;
  white-space: nowrap;
  text-align: center;
  position: relative;
  z-index: 2;

  ${({ $isFunction, theme }) =>
    $isFunction &&
    css`
      font-size: var(--font-key-function);
      font-weight: 500;
      color: ${theme.text.tertiary};
      text-transform: lowercase;
    `}

  ${({ $isModifier, theme }) =>
    $isModifier &&
    css`
      font-size: var(--font-key-modifier);
      font-weight: 400;
      color: ${theme.text.secondary};
    `}

  ${({ $isArrow, theme }) =>
    $isArrow &&
    css`
      font-size: clamp(8px, 1.0vw, 14px);
      color: ${theme.text.tertiary};
    `}
`;

const KeyLabelSecondary = styled.span`
  font-family: ${SYSTEM_FONT_STACK};
  font-size: var(--font-key-secondary);
  font-weight: 500;
  color: ${({ theme }) => theme.text.tertiary};
`;

const KeyLabelPrimary = styled.span`
  font-family: ${SYSTEM_FONT_STACK};
  font-size: var(--font-key);
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

const KeyMappingContainer = styled.div<{ $isSpace?: boolean }>`
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

const BaseKeyIndicator = styled.span`
  position: absolute;
  top: clamp(2px, 0.3vw, 4px);
  left: clamp(3px, 0.4vw, 6px);
  font-family: ${SYSTEM_FONT_STACK};
  font-size: clamp(7px, 0.85vw, 12px);
  font-weight: 600;
  color: ${({ theme }) => theme.text.dimmed};
  line-height: 1;
  z-index: 3;
  text-transform: uppercase;
`;

const KeyMappingIcon = styled.img<{ $isSpace?: boolean }>`
  width: clamp(16px, 2vw, 32px);
  height: clamp(16px, 2vw, 32px);
  object-fit: contain;
  border-radius: clamp(3px, 0.4vw, 6px);
  filter: drop-shadow(0 1px 2px ${({ theme }) => theme.shadow.medium});

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
  color: ${({ theme }) => theme.text.tertiary};
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

const ModifierTextLabel = styled.span<{ $align?: "left" | "right" }>`
  font-family: ${SYSTEM_FONT_STACK};
  font-size: clamp(8px, 1.0vw, 14px);
  font-weight: 400;
  color: ${({ theme }) => theme.text.secondary};
  text-transform: lowercase;
  line-height: 1;
  position: absolute;
  bottom: clamp(5px, 0.6vw, 10px);
  z-index: 2;

  ${({ $align }) =>
    $align === "left"
      ? css`
          left: clamp(4px, 0.5vw, 8px);
        `
      : css`
          right: clamp(4px, 0.5vw, 8px);
        `}
`;

const ModifierStackedLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

const ModifierSymbol = styled.span<{ $isRightSide?: boolean }>`
  position: absolute;
  top: clamp(3px, 0.4vw, 6px);
  font-family: ${SYSTEM_FONT_STACK};
  font-size: clamp(12px, 1.5vw, 22px);
  font-weight: 400;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1;

  ${({ $isRightSide }) =>
    $isRightSide
      ? css`
          left: clamp(4px, 0.5vw, 8px);
        `
      : css`
          right: clamp(4px, 0.5vw, 8px);
        `}
`;

const ModifierText = styled.span<{ $isRightSide?: boolean }>`
  position: absolute;
  bottom: clamp(4px, 0.5vw, 8px);
  font-family: ${SYSTEM_FONT_STACK};
  font-size: clamp(7px, 0.85vw, 12px);
  font-weight: 400;
  color: ${({ theme }) => theme.text.secondary};
  text-transform: lowercase;
  line-height: 1;

  ${({ $isRightSide }) =>
    $isRightSide
      ? css`
          right: clamp(4px, 0.5vw, 8px);
        `
      : css`
          left: clamp(4px, 0.5vw, 8px);
        `}
`;

const FnKeyLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

const FnGlobe = styled.span`
  position: absolute;
  bottom: clamp(3px, 0.4vw, 6px);
  left: clamp(4px, 0.5vw, 8px);
  font-size: clamp(10px, 1.2vw, 16px);
  line-height: 1;
  filter: grayscale(1) contrast(0.8) opacity(0.85);
`;

const FnText = styled.span`
  position: absolute;
  top: clamp(3px, 0.4vw, 6px);
  right: clamp(4px, 0.5vw, 8px);
  font-family: ${SYSTEM_FONT_STACK};
  font-size: clamp(7px, 0.9vw, 12px);
  font-weight: 400;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1;
`;

const CapsLockIndicator = styled.span`
  position: absolute;
  left: clamp(4px, 0.5vw, 8px);
  top: clamp(4px, 0.5vw, 8px);
  width: clamp(3px, 0.4vw, 5px);
  height: clamp(3px, 0.4vw, 5px);
  border-radius: 50%;
  background: ${({ theme }) => theme.shadow.light};
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

  const baseLabel = definition.label;
  const showDimmedIndicator = isDimmed && baseLabel;

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
      data-mapped={hasMapping ? "true" : undefined}
      data-unmapped={isDimmed ? "true" : undefined}
      onClick={handleClick}
    >
      {showBaseLabel && renderBaseLabel(definition, isFunction, isModifier)}
      {showMapping && mapping && renderMappingContent(mapping, iconPath, isSpace, isCommandLayer, baseLabel)}
      {showDimmedIndicator && <BaseKeyIndicator>{baseLabel}</BaseKeyIndicator>}
    </StyledKey>
  );
}

function renderBaseLabel(definition: KeyDefinition, isFunction?: boolean, isModifier?: boolean) {
  const { id, label, secondaryLabel, textLabel, symbolLabel, hasIndicator } = definition;

  if (id === "fn") {
    return (
      <FnKeyLayout>
        <FnGlobe>{symbolLabel}</FnGlobe>
        <FnText>{label}</FnText>
      </FnKeyLayout>
    );
  }

  if (symbolLabel && textLabel) {
    const isRightSide = id.endsWith("-right");
    return (
      <ModifierStackedLayout>
        <ModifierSymbol $isRightSide={isRightSide}>{symbolLabel}</ModifierSymbol>
        <ModifierText $isRightSide={isRightSide}>{textLabel}</ModifierText>
      </ModifierStackedLayout>
    );
  }

  if (textLabel && !symbolLabel) {
    const align = getTextLabelAlignment(id);
    return (
      <>
        {hasIndicator && <CapsLockIndicator />}
        <ModifierTextLabel $align={align}>{textLabel}</ModifierTextLabel>
      </>
    );
  }

  if (secondaryLabel) {
    return (
      <KeyLabels>
        <KeyLabelSecondary>{secondaryLabel}</KeyLabelSecondary>
        <KeyLabelPrimary>{label}</KeyLabelPrimary>
      </KeyLabels>
    );
  }

  const isArrow = id.startsWith("arrow-");
  return (
    <KeyLabel $isFunction={isFunction} $isModifier={isModifier} $isArrow={isArrow}>
      {label}
    </KeyLabel>
  );
}

function getTextLabelAlignment(keyId: string): "left" | "right" {
  switch (keyId) {
    case "backspace":
    case "return":
    case "shift-right":
      return "right";
    default:
      return "left";
  }
}

function renderMappingContent(
  mapping: KeyMapping,
  iconPath?: string | null,
  isSpace?: boolean,
  isCommandLayer?: boolean,
  baseLabel?: string,
) {
  const hasIcon = Boolean(iconPath);
  return (
    <KeyMappingContainer $isSpace={isSpace}>
      {baseLabel && !isSpace && <BaseKeyIndicator>{baseLabel}</BaseKeyIndicator>}
      {iconPath && <KeyMappingIcon src={iconPath} alt={mapping.action} $isSpace={isSpace} loading="lazy" />}
      <KeyMappingLabel $isSpace={isSpace} $isCommandLayer={isCommandLayer} $hasIcon={hasIcon}>
        {mapping.action}
      </KeyMappingLabel>
    </KeyMappingContainer>
  );
}
