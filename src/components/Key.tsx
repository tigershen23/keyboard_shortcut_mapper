import React from "react";
import type { KeyDefinition } from "../types";

interface KeyProps {
  definition: KeyDefinition;
}

export function Key({ definition }: KeyProps) {
  const { id, label, secondaryLabel, width = 1, height = 1, isModifier, isFunction } = definition;

  const style: React.CSSProperties = {
    width: `calc(${width} * var(--key-unit) + ${width - 1} * var(--key-gap))`,
    height: height === 0.5
      ? `calc(var(--key-unit) / 2 - var(--key-gap) / 2)`
      : `var(--key-unit)`,
  };

  const classNames = [
    "key",
    isFunction && "key-function",
    isModifier && "key-modifier",
    id === "space" && "key-space",
  ].filter(Boolean).join(" ");

  return (
    <div className={classNames} style={style} data-key-id={id}>
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
