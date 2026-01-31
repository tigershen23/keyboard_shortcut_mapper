const SPECIAL_KEYS = new Set([
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
]);

export function isSpecialKey(id: string): boolean {
  return SPECIAL_KEYS.has(id);
}
