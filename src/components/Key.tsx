import React from "react";
import type { KeyDefinition, LayerType } from "../types";

interface KeyProps {
  definition: KeyDefinition;
  isPressed?: boolean;
  onClick?: () => void;
  rippleColor?: string;
  currentLayer?: LayerType;
}

export function Key({
  definition,
  isPressed,
  onClick,
  rippleColor,
  currentLayer = "base",
}: KeyProps) {
  const {
    id,
    label,
    secondaryLabel,
    width = 1,
    height = 1,
    isModifier,
    isFunction,
  } = definition;

  // Regular keys (not modifiers, not function keys, not special keys) show blank on non-base layers
  const isRegularKey = !isModifier && !isFunction && !isSpecialKey(id);
  const showLabel = currentLayer === "base" || !isRegularKey;

  const style: React.CSSProperties = {
    width: `calc(${width} * var(--key-unit) + ${width - 1} * var(--key-gap))`,
    height:
      height === 0.5
        ? `calc(var(--key-unit) / 2 - var(--key-gap) / 2)`
        : `var(--key-unit)`,
    "--ripple-color": rippleColor,
  } as React.CSSProperties;

  const classNames = [
    "key",
    isFunction && "key-function",
    isModifier && "key-modifier",
    id === "space" && "key-space",
    isPressed && "key-pressed",
    !showLabel && "key-blank",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classNames}
      style={style}
      data-key-id={id}
      onClick={onClick}
    >
      {showLabel &&
        (secondaryLabel ? (
          <div className="key-labels">
            <span className="key-label-secondary">{secondaryLabel}</span>
            <span className="key-label-primary">{label}</span>
          </div>
        ) : (
          <span className="key-label">{label}</span>
        ))}
    </div>
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
