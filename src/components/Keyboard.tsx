import React from "react";
import { Key } from "./Key";
import type { KeyboardLayout, KeyDefinition } from "../types";

interface KeyboardProps {
  layout: KeyboardLayout;
  className?: string;
}

export function Keyboard({ layout, className }: KeyboardProps) {
  return (
    <div className={`keyboard-frame ${className ?? ""}`}>
      {layout.map((row, rowIndex) => {
        if (rowIndex === 5) {
          return <ModifierRow key={rowIndex} keys={row.keys} />;
        }

        return (
          <div key={rowIndex} className="keyboard-row">
            {row.keys.map((key) => (
              <Key key={key.id} definition={key} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ModifierRow({ keys }: { keys: KeyDefinition[] }) {
  const modifierKeys = keys.slice(0, 7);
  const arrowKeys = keys.slice(7);

  const arrowLeft = arrowKeys.find((k) => k.id === "arrow-left");
  const arrowUp = arrowKeys.find((k) => k.id === "arrow-up");
  const arrowDown = arrowKeys.find((k) => k.id === "arrow-down");
  const arrowRight = arrowKeys.find((k) => k.id === "arrow-right");

  return (
    <div className="keyboard-row">
      {modifierKeys.map((key) => (
        <Key key={key.id} definition={key} />
      ))}

      <div className="arrow-cluster">
        {arrowLeft && <Key definition={arrowLeft} />}
        <div className="arrow-vertical">
          {arrowUp && <Key definition={arrowUp} />}
          {arrowDown && <Key definition={arrowDown} />}
        </div>
        {arrowRight && <Key definition={arrowRight} />}
      </div>
    </div>
  );
}
