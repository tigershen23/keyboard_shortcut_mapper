import React from "react";
import styled, { css, keyframes } from "styled-components";
import { Key } from "./Key";
import { useMappingContext } from "../context/MappingContext";
import type { KeyboardLayout, KeyDefinition, LayerType } from "../types";

const keyboardEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

interface KeyboardFrameProps {
  $layer: LayerType;
}

const KeyboardFrame = styled.div<KeyboardFrameProps>`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: var(--key-gap);
  padding: var(--frame-padding);
  background: linear-gradient(
    168deg,
    #d8d8dc 0%,
    #cdcdd1 15%,
    #c2c2c6 40%,
    #b7b7bb 70%,
    #acacb0 100%
  );
  border-radius: var(--frame-radius);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 0 clamp(60px, 10vw, 150px) clamp(20px, 4vw, 60px)
      rgba(180, 100, 60, 0.1),
    0 0 clamp(40px, 6vw, 100px) clamp(10px, 2vw, 30px) rgba(160, 120, 70, 0.06),
    0 clamp(20px, 4vw, 60px) clamp(40px, 8vw, 120px) clamp(-10px, -2vw, -30px)
      rgba(0, 0, 0, 0.5),
    0 clamp(10px, 2vw, 30px) clamp(20px, 4vw, 60px) clamp(-8px, -1.5vw, -20px)
      rgba(0, 0, 0, 0.35),
    0 clamp(4px, 0.8vw, 12px) clamp(12px, 2vw, 30px) rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 2px rgba(0, 0, 0, 0.06);
  animation: ${keyboardEnter} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  --layer-glow: transparent;
  transition: box-shadow 0.4s ease;

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    background: var(--layer-glow);
    opacity: 1;
    z-index: -1;
    filter: blur(20px);
    transition: background 0.4s ease;
    pointer-events: none;
  }

  ${({ $layer }) =>
    $layer === "hyper" &&
    css`
      --layer-glow: rgba(100, 180, 160, 0.15);
    `}

  ${({ $layer }) =>
    $layer === "command" &&
    css`
      --layer-glow: rgba(200, 140, 120, 0.15);
    `}
`;

const KeyboardRow = styled.div`
  display: flex;
  gap: var(--key-gap);
  justify-content: flex-start;
`;

const ArrowCluster = styled.div`
  display: flex;
  align-items: flex-end;
  gap: var(--key-gap);
`;

const ArrowVertical = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;

  & > div {
    border-radius: var(--key-radius);
  }

  & > div:first-child {
    border-bottom-left-radius: clamp(1px, 0.2vw, 3px);
    border-bottom-right-radius: clamp(1px, 0.2vw, 3px);
  }

  & > div:last-child {
    border-top-left-radius: clamp(1px, 0.2vw, 3px);
    border-top-right-radius: clamp(1px, 0.2vw, 3px);
  }
`;

interface KeyboardProps {
  layout: KeyboardLayout;
  className?: string;
  currentLayer: LayerType;
  pressedKeyId: string | null;
  onKeyPress: (keyId: string) => void;
  rippleColor: string;
}

export function Keyboard({
  layout,
  className,
  currentLayer,
  pressedKeyId,
  onKeyPress,
  rippleColor,
}: KeyboardProps) {
  const { getMappingForKey, getIconForMapping } = useMappingContext();

  const renderKey = (key: KeyDefinition) => {
    const mapping = getMappingForKey(key.id, currentLayer);
    const iconPath = mapping ? getIconForMapping(mapping) : null;

    return (
      <Key
        key={key.id}
        definition={key}
        isPressed={pressedKeyId === key.id}
        onClick={() => onKeyPress(key.id)}
        rippleColor={rippleColor}
        currentLayer={currentLayer}
        mapping={mapping}
        iconPath={iconPath}
      />
    );
  };

  return (
    <KeyboardFrame $layer={currentLayer} className={className}>
      {layout.map((row, rowIndex) => {
        if (rowIndex === 4) {
          return (
            <ModifierRow
              key={rowIndex}
              keys={row.keys}
              renderKey={renderKey}
            />
          );
        }

        return (
          <KeyboardRow key={rowIndex}>{row.keys.map(renderKey)}</KeyboardRow>
        );
      })}
    </KeyboardFrame>
  );
}

interface ModifierRowProps {
  keys: KeyDefinition[];
  renderKey: (key: KeyDefinition) => React.ReactNode;
}

function ModifierRow({ keys, renderKey }: ModifierRowProps) {
  const modifierKeys = keys.slice(0, 7);
  const arrowKeys = keys.slice(7);

  const arrowLeft = arrowKeys.find((k) => k.id === "arrow-left");
  const arrowUp = arrowKeys.find((k) => k.id === "arrow-up");
  const arrowDown = arrowKeys.find((k) => k.id === "arrow-down");
  const arrowRight = arrowKeys.find((k) => k.id === "arrow-right");

  return (
    <KeyboardRow>
      {modifierKeys.map(renderKey)}
      <ArrowCluster>
        {arrowLeft && renderKey(arrowLeft)}
        <ArrowVertical>
          {arrowUp && renderKey(arrowUp)}
          {arrowDown && renderKey(arrowDown)}
        </ArrowVertical>
        {arrowRight && renderKey(arrowRight)}
      </ArrowCluster>
    </KeyboardRow>
  );
}
