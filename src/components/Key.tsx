import React from "react";
import type { KeyDefinition } from "../types";

interface KeyProps {
  definition: KeyDefinition;
  isPressed?: boolean;
  onClick?: () => void;
  rippleColor?: string;
}

export function Key({ definition, isPressed, onClick, rippleColor }: KeyProps) {
  const {
    id,
    label,
    secondaryLabel,
    width = 1,
    height = 1,
    isModifier,
    isFunction,
  } = definition;

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
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} style={style} data-key-id={id} onClick={onClick}>
      {secondaryLabel ? (
        <div className="key-labels">
          <span className="key-label-secondary">{secondaryLabel}</span>
          <span className="key-label-primary">{label}</span>
        </div>
      ) : (
        <span className="key-label">{label}</span>
      )}
    </div>
  );
}
