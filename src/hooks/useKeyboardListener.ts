import { useEffect } from "react";

const MODIFIER_KEYS = new Set([
  "shift-left",
  "shift-right",
  "control",
  "option-left",
  "option-right",
  "command-left",
  "command-right",
  "caps",
  "fn",
]);

const codeToKeyId: Record<string, string> = {
  // Letters
  KeyA: "a",
  KeyB: "b",
  KeyC: "c",
  KeyD: "d",
  KeyE: "e",
  KeyF: "f",
  KeyG: "g",
  KeyH: "h",
  KeyI: "i",
  KeyJ: "j",
  KeyK: "k",
  KeyL: "l",
  KeyM: "m",
  KeyN: "n",
  KeyO: "o",
  KeyP: "p",
  KeyQ: "q",
  KeyR: "r",
  KeyS: "s",
  KeyT: "t",
  KeyU: "u",
  KeyV: "v",
  KeyW: "w",
  KeyX: "x",
  KeyY: "y",
  KeyZ: "z",
  // Numbers
  Digit1: "1",
  Digit2: "2",
  Digit3: "3",
  Digit4: "4",
  Digit5: "5",
  Digit6: "6",
  Digit7: "7",
  Digit8: "8",
  Digit9: "9",
  Digit0: "0",
  // Special characters
  Backquote: "backtick",
  Minus: "minus",
  Equal: "equals",
  BracketLeft: "bracket-left",
  BracketRight: "bracket-right",
  Backslash: "backslash",
  Semicolon: "semicolon",
  Quote: "quote",
  Comma: "comma",
  Period: "period",
  Slash: "slash",
  Space: "space",
  Tab: "tab",
  // Modifiers
  ShiftLeft: "shift-left",
  ShiftRight: "shift-right",
  ControlLeft: "control",
  ControlRight: "control",
  AltLeft: "option-left",
  AltRight: "option-right",
  MetaLeft: "command-left",
  MetaRight: "command-right",
  CapsLock: "caps",
  Fn: "fn",
  // Function keys
  Escape: "esc",
  F1: "f1",
  F2: "f2",
  F3: "f3",
  F4: "f4",
  F5: "f5",
  F6: "f6",
  F7: "f7",
  F8: "f8",
  F9: "f9",
  F10: "f10",
  F11: "f11",
  F12: "f12",
  Backspace: "backspace",
  Enter: "return",
  // Arrows
  ArrowLeft: "arrow-left",
  ArrowRight: "arrow-right",
  ArrowUp: "arrow-up",
  ArrowDown: "arrow-down",
};

interface UseKeyboardListenerOptions {
  onKeyPress: (keyId: string) => void;
  onLayerCycle: (direction: "forward" | "backward") => void;
  disabled?: boolean;
}

export function useKeyboardListener({ onKeyPress, onLayerCycle, disabled }: UseKeyboardListenerOptions) {
  useEffect(() => {
    if (disabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      const keyId = codeToKeyId[event.code];
      if (!keyId) return;

      if (keyId === "tab") {
        event.preventDefault();
        onLayerCycle(event.shiftKey ? "backward" : "forward");
        return;
      }

      onKeyPress(keyId);

      // Only prevent default for plain key presses (no modifiers).
      // Allow browser shortcuts like Cmd+R, Ctrl+C etc. to propagate.
      const hasModifier = event.metaKey || event.ctrlKey || event.altKey;
      if (!MODIFIER_KEYS.has(keyId) && !hasModifier) {
        event.preventDefault();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onKeyPress, onLayerCycle, disabled]);
}
