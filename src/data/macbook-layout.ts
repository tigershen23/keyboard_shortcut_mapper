import type { KeyboardLayout } from "../types";

// MacBook Pro keyboard layout - US ANSI (without function row)
// All rows are 15 units wide for proper alignment
export const macbookLayout: KeyboardLayout = [
  // Row 0: Number row - 15 units total
  // backtick(1) + 12×1 + backspace(2) = 15
  {
    keys: [
      { id: "backtick", label: "`", secondaryLabel: "~", width: 1 },
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
      { id: "backspace", label: "", textLabel: "delete", width: 2, isModifier: true },
    ],
  },
  // Row 1: Top letter row (QWERTY) - 15 units total
  // tab(2) + 12×1 + backslash(1) = 15
  {
    keys: [
      { id: "tab", label: "", textLabel: "tab", width: 2, isModifier: true },
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
      { id: "backslash", label: "\\", secondaryLabel: "|", width: 1 },
    ],
  },
  // Row 2: Home row (ASDF) - 15 units total
  // caps(2) + 11×1 + return(2) = 15
  {
    keys: [
      { id: "caps", label: "", textLabel: "caps lock", hasIndicator: true, width: 2, isModifier: true },
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
      { id: "return", label: "", textLabel: "return", width: 2, isModifier: true },
    ],
  },
  // Row 3: Bottom letter row (ZXCV) - 15 units total
  // shift(2.5) + 10×1 + shift(2.5) = 15
  {
    keys: [
      { id: "shift-left", label: "", textLabel: "shift", width: 2.5, isModifier: true },
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
      { id: "shift-right", label: "", textLabel: "shift", width: 2.5, isModifier: true },
    ],
  },
  // Row 4: Modifier row (bottom) - 15 units total
  // fn(1) + ctrl(1) + opt(1) + cmd(1.25) + space(5.5) + cmd(1.25) + opt(1) + arrows(3) = 15
  {
    keys: [
      { id: "fn", label: "fn", symbolLabel: "🌐", width: 1, isModifier: true },
      { id: "control", label: "", symbolLabel: "⌃", textLabel: "control", width: 1, isModifier: true },
      { id: "option-left", label: "", symbolLabel: "⌥", textLabel: "option", width: 1, isModifier: true },
      { id: "command-left", label: "", symbolLabel: "⌘", textLabel: "command", width: 1.25, isModifier: true },
      { id: "space", label: "", width: 5.5 },
      { id: "command-right", label: "", symbolLabel: "⌘", textLabel: "command", width: 1.25, isModifier: true },
      { id: "option-right", label: "", symbolLabel: "⌥", textLabel: "option", width: 1, isModifier: true },
      // Arrow keys - all half-height, grouped together (3 visual units)
      { id: "arrow-left", label: "◀", width: 1, height: 0.5 },
      { id: "arrow-up", label: "▲", width: 1, height: 0.5 },
      { id: "arrow-down", label: "▼", width: 1, height: 0.5 },
      { id: "arrow-right", label: "▶", width: 1, height: 0.5 },
    ],
  },
];

// Key counts per row for verification:
// Row 0: 14 keys (`, 1-0, -, =, backspace)
// Row 1: 14 keys (tab, Q-P, [, ], \)
// Row 2: 13 keys (caps, A-L, ;, ', return)
// Row 3: 12 keys (shift, Z-M, ,, ., /, shift)
// Row 4: 11 keys (fn, ctrl, opt, cmd, space, cmd, opt, arrows x4)
// Total: 64 keys
export const TOTAL_KEY_COUNT = 64;
