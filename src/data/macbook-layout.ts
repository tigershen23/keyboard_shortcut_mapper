import type { KeyboardLayout } from "../types";

// MacBook Pro keyboard layout - US ANSI
// All rows are 15 units wide for proper alignment
export const macbookLayout: KeyboardLayout = [
  // Row 0: Function keys - 15 units total
  // 14 keys × 15/14 ≈ 1.071 each
  {
    keys: [
      { id: "esc", label: "esc", width: 1.5, isFunction: true },
      { id: "f1", label: "F1", width: 1, isFunction: true },
      { id: "f2", label: "F2", width: 1, isFunction: true },
      { id: "f3", label: "F3", width: 1, isFunction: true },
      { id: "f4", label: "F4", width: 1, isFunction: true },
      { id: "f5", label: "F5", width: 1, isFunction: true },
      { id: "f6", label: "F6", width: 1, isFunction: true },
      { id: "f7", label: "F7", width: 1, isFunction: true },
      { id: "f8", label: "F8", width: 1, isFunction: true },
      { id: "f9", label: "F9", width: 1, isFunction: true },
      { id: "f10", label: "F10", width: 1, isFunction: true },
      { id: "f11", label: "F11", width: 1, isFunction: true },
      { id: "f12", label: "F12", width: 1, isFunction: true },
      { id: "touchid", label: "⏏", width: 1.5, isFunction: true },
    ],
  },
  // Row 1: Number row - 15 units total
  // 1×13 + 1.5 = 14.5, need backtick at 1.5
  {
    keys: [
      { id: "backtick", label: "`", secondaryLabel: "~", width: 1.5 },
      { id: "1", label: "1", secondaryLabel: "!" },
      { id: "2", label: "2", secondaryLabel: "@" },
      { id: "3", label: "3", secondaryLabel: "#" },
      { id: "4", label: "4", secondaryLabel: "$" },
      { id: "5", label: "5", secondaryLabel: "%" },
      { id: "6", label: "6", secondaryLabel: "^" },
      { id: "7", label: "7", secondaryLabel: "&" },
      { id: "8", label: "8", secondaryLabel: "*" },
      { id: "9", label: "9", secondaryLabel: "(" },
      { id: "0", label: "0", secondaryLabel: ")" },
      { id: "minus", label: "-", secondaryLabel: "_" },
      { id: "equals", label: "=", secondaryLabel: "+" },
      { id: "backspace", label: "⌫", width: 1.5, isModifier: true },
    ],
  },
  // Row 2: Top letter row (QWERTY) - 15 units total
  // 1.5 + 1×12 + 1.5 = 15
  {
    keys: [
      { id: "tab", label: "⇥", width: 1.5, isModifier: true },
      { id: "q", label: "Q" },
      { id: "w", label: "W" },
      { id: "e", label: "E" },
      { id: "r", label: "R" },
      { id: "t", label: "T" },
      { id: "y", label: "Y" },
      { id: "u", label: "U" },
      { id: "i", label: "I" },
      { id: "o", label: "O" },
      { id: "p", label: "P" },
      { id: "bracket-left", label: "[", secondaryLabel: "{" },
      { id: "bracket-right", label: "]", secondaryLabel: "}" },
      { id: "backslash", label: "\\", secondaryLabel: "|", width: 1.5 },
    ],
  },
  // Row 3: Home row (ASDF) - 15 units total
  // 1.75 + 1×11 + 2.25 = 15
  {
    keys: [
      { id: "caps", label: "⇪", width: 1.75, isModifier: true },
      { id: "a", label: "A" },
      { id: "s", label: "S" },
      { id: "d", label: "D" },
      { id: "f", label: "F" },
      { id: "g", label: "G" },
      { id: "h", label: "H" },
      { id: "j", label: "J" },
      { id: "k", label: "K" },
      { id: "l", label: "L" },
      { id: "semicolon", label: ";", secondaryLabel: ":" },
      { id: "quote", label: "'", secondaryLabel: '"' },
      { id: "return", label: "↵", width: 2.25, isModifier: true },
    ],
  },
  // Row 4: Bottom letter row (ZXCV) - 15 units total
  // 2.25 + 1×10 + 2.75 = 15
  {
    keys: [
      { id: "shift-left", label: "⇧", width: 2.25, isModifier: true },
      { id: "z", label: "Z" },
      { id: "x", label: "X" },
      { id: "c", label: "C" },
      { id: "v", label: "V" },
      { id: "b", label: "B" },
      { id: "n", label: "N" },
      { id: "m", label: "M" },
      { id: "comma", label: ",", secondaryLabel: "<" },
      { id: "period", label: ".", secondaryLabel: ">" },
      { id: "slash", label: "/", secondaryLabel: "?" },
      { id: "shift-right", label: "⇧", width: 2.75, isModifier: true },
    ],
  },
  // Row 5: Modifier row (bottom)
  // This row has 10 visual elements vs 14 in other rows
  // Fewer elements = fewer gaps, so need less total key width
  // Total: 1 + 1 + 1.25 + 1.25 + 4.75 + 1.25 + 1.25 + 1 + 1 + 1 = 14.75
  {
    keys: [
      { id: "fn", label: "fn", width: 1, isModifier: true },
      { id: "control", label: "⌃", width: 1, isModifier: true },
      { id: "option-left", label: "⌥", width: 1.25, isModifier: true },
      { id: "command-left", label: "⌘", width: 1.25, isModifier: true },
      { id: "space", label: "", width: 5 },
      { id: "command-right", label: "⌘", width: 1.25, isModifier: true },
      { id: "option-right", label: "⌥", width: 1.25, isModifier: true },
      // Arrow keys - grouped together (3 visual units)
      { id: "arrow-left", label: "◀", width: 1 },
      { id: "arrow-up", label: "▲", width: 1, height: 0.5 },
      { id: "arrow-down", label: "▼", width: 1, height: 0.5 },
      { id: "arrow-right", label: "▶", width: 1 },
    ],
  },
];

// Key counts per row for verification:
// Row 0: 14 keys (esc, F1-F12, eject)
// Row 1: 14 keys (`, 1-0, -, =, backspace)
// Row 2: 14 keys (tab, Q-P, [, ], \)
// Row 3: 13 keys (caps, A-L, ;, ', return)
// Row 4: 12 keys (shift, Z-M, ,, ., /, shift)
// Row 5: 11 keys (fn, ctrl, opt, cmd, space, cmd, opt, arrows x4)
// Total: 78 keys
