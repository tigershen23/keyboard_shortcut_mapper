import styled, { css, keyframes } from "styled-components";
import { useMappingContext } from "../context/MappingContext";
import type { KeyboardLayout, KeyDefinition, LayerType } from "../types";
import { Key } from "./Key";

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
    ${({ theme }) => theme.surface.frame.start} 0%,
    #cdcdd1 15%,
    #c2c2c6 40%,
    #b7b7bb 70%,
    ${({ theme }) => theme.surface.frame.end} 100%
  );
  border-radius: var(--frame-radius);
  border: 1px solid ${({ theme }) => theme.border.focus};
  box-shadow:
    0 0 clamp(60px, 10vw, 150px) clamp(20px, 4vw, 60px) rgba(180, 100, 60, 0.1),
    0 0 clamp(40px, 6vw, 100px) clamp(10px, 2vw, 30px) rgba(160, 120, 70, 0.06),
    0 clamp(20px, 4vw, 60px) clamp(40px, 8vw, 120px) clamp(-10px, -2vw, -30px)
      ${({ theme }) => theme.shadow.heavy},
    0 clamp(10px, 2vw, 30px) clamp(20px, 4vw, 60px) clamp(-8px, -1.5vw, -20px)
      ${({ theme }) => theme.shadow.medium},
    0 clamp(4px, 0.8vw, 12px) clamp(12px, 2vw, 30px) ${({ theme }) => theme.shadow.light},
    inset 0 1px 0 ${({ theme }) => theme.shadow.heavy.replace("0, 0, 0", "255, 255, 255")},
    inset 0 -1px 2px rgba(0, 0, 0, 0.06);
  animation: ${keyboardEnter} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  --layer-glow: transparent;
  transition: box-shadow 0.4s ease;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
    box-shadow:
      0 0 clamp(30px, 8vw, 80px) clamp(10px, 3vw, 30px) rgba(180, 100, 60, 0.1),
      0 0 clamp(20px, 5vw, 50px) clamp(5px, 1.5vw, 15px) rgba(160, 120, 70, 0.06),
      0 clamp(10px, 3vw, 30px) clamp(20px, 6vw, 60px) clamp(-5px, -1.5vw, -15px)
        ${({ theme }) => theme.shadow.heavy},
      0 clamp(5px, 1.5vw, 15px) clamp(10px, 3vw, 30px) clamp(-4px, -1vw, -10px)
        ${({ theme }) => theme.shadow.medium},
      0 clamp(2px, 0.6vw, 6px) clamp(6px, 1.5vw, 15px) ${({ theme }) => theme.shadow.light},
      inset 0 1px 0 rgba(255, 255, 255, 0.5),
      inset 0 -1px 2px rgba(0, 0, 0, 0.06);
  }

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

  ${({ $layer, theme }) =>
    $layer === "hyper" &&
    theme.layers.hyper.glow &&
    css`
      --layer-glow: ${theme.layers.hyper.glow};
    `}

  ${({ $layer, theme }) =>
    $layer === "command" &&
    theme.layers.command.glow &&
    css`
      --layer-glow: ${theme.layers.command.glow};
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

const ArrowSingle = styled.div`
  display: flex;
  align-items: flex-end;
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
  layerAccent: string;
  selectedKeyId: string | null;
  onKeySelect: (keyId: string, element: HTMLElement) => void;
}

export function Keyboard({
  layout,
  className,
  currentLayer,
  pressedKeyId,
  onKeyPress,
  rippleColor,
  layerAccent,
  selectedKeyId,
  onKeySelect,
}: KeyboardProps) {
  const { getMappingForKey, getIconForMapping } = useMappingContext();

  const isEditable = currentLayer !== "base";

  const renderKey = (key: KeyDefinition) => {
    const mapping = getMappingForKey(key.id, currentLayer);
    const iconPath = mapping ? getIconForMapping(mapping) : null;
    const isRegularKey = !key.isModifier && !key.isFunction && !isSpecialKey(key.id);

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
        isEditable={isEditable && isRegularKey}
        isSelected={selectedKeyId === key.id}
        layerAccent={layerAccent}
        onSelect={onKeySelect}
      />
    );
  };

  return (
    <KeyboardFrame $layer={currentLayer} className={className}>
      {layout.map((row, rowIndex) => {
        if (rowIndex === 4) {
          return <ModifierRow key={rowIndex} keys={row.keys} renderKey={renderKey} />;
        }

        return <KeyboardRow key={rowIndex}>{row.keys.map(renderKey)}</KeyboardRow>;
      })}
    </KeyboardFrame>
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
        <ArrowSingle>{arrowLeft && renderKey(arrowLeft)}</ArrowSingle>
        <ArrowVertical>
          {arrowUp && renderKey(arrowUp)}
          {arrowDown && renderKey(arrowDown)}
        </ArrowVertical>
        <ArrowSingle>{arrowRight && renderKey(arrowRight)}</ArrowSingle>
      </ArrowCluster>
    </KeyboardRow>
  );
}
