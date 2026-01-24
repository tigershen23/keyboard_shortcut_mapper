import React from "react";
import { Key } from "./Key";
import type { KeyboardLayout, KeyDefinition, LayerType } from "../types";

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
  return (
    <div
      className={`keyboard-frame ${className ?? ""}`}
      data-layer={currentLayer}
    >
      {layout.map((row, rowIndex) => {
        if (rowIndex === 5) {
          return (
            <ModifierRow
              key={rowIndex}
              keys={row.keys}
              pressedKeyId={pressedKeyId}
              onKeyPress={onKeyPress}
              rippleColor={rippleColor}
              currentLayer={currentLayer}
            />
          );
        }

        return (
          <div key={rowIndex} className="keyboard-row">
            {row.keys.map((key) => (
              <Key
                key={key.id}
                definition={key}
                isPressed={pressedKeyId === key.id}
                onClick={() => onKeyPress(key.id)}
                rippleColor={rippleColor}
                currentLayer={currentLayer}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

interface ModifierRowProps {
  keys: KeyDefinition[];
  pressedKeyId: string | null;
  onKeyPress: (keyId: string) => void;
  rippleColor: string;
  currentLayer: LayerType;
}

function ModifierRow({
  keys,
  pressedKeyId,
  onKeyPress,
  rippleColor,
  currentLayer,
}: ModifierRowProps) {
  const modifierKeys = keys.slice(0, 7);
  const arrowKeys = keys.slice(7);

  const arrowLeft = arrowKeys.find((k) => k.id === "arrow-left");
  const arrowUp = arrowKeys.find((k) => k.id === "arrow-up");
  const arrowDown = arrowKeys.find((k) => k.id === "arrow-down");
  const arrowRight = arrowKeys.find((k) => k.id === "arrow-right");

  return (
    <div className="keyboard-row">
      {modifierKeys.map((key) => (
        <Key
          key={key.id}
          definition={key}
          isPressed={pressedKeyId === key.id}
          onClick={() => onKeyPress(key.id)}
          rippleColor={rippleColor}
          currentLayer={currentLayer}
        />
      ))}

      <div className="arrow-cluster">
        {arrowLeft && (
          <Key
            definition={arrowLeft}
            isPressed={pressedKeyId === arrowLeft.id}
            onClick={() => onKeyPress(arrowLeft.id)}
            rippleColor={rippleColor}
            currentLayer={currentLayer}
          />
        )}
        <div className="arrow-vertical">
          {arrowUp && (
            <Key
              definition={arrowUp}
              isPressed={pressedKeyId === arrowUp.id}
              onClick={() => onKeyPress(arrowUp.id)}
              rippleColor={rippleColor}
              currentLayer={currentLayer}
            />
          )}
          {arrowDown && (
            <Key
              definition={arrowDown}
              isPressed={pressedKeyId === arrowDown.id}
              onClick={() => onKeyPress(arrowDown.id)}
              rippleColor={rippleColor}
              currentLayer={currentLayer}
            />
          )}
        </div>
        {arrowRight && (
          <Key
            definition={arrowRight}
            isPressed={pressedKeyId === arrowRight.id}
            onClick={() => onKeyPress(arrowRight.id)}
            rippleColor={rippleColor}
            currentLayer={currentLayer}
          />
        )}
      </div>
    </div>
  );
}
