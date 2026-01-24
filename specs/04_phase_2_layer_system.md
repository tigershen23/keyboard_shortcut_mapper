# Phase 2: Layer System & Key Interaction

**Goal**: Implement the three-layer system with keyboard-driven navigation and rich key press feedback.

---

## Overview

This phase adds:
1. Layer state management (Base → Hyper → Command)
2. Visual layer indicator with smooth transitions
3. Physical keyboard listeners that mirror UI click behavior
4. A distinctive "ink ripple" press effect on keys
5. Proper modifier key handling to avoid clobbering system shortcuts

---

## Architecture

### Layer Types

```typescript
// src/types/index.ts (additions)
export type LayerType = "base" | "hyper" | "command";

export interface LayerConfig {
  id: LayerType;
  label: string;
  shortLabel: string;
  accentColor: string;  // CSS color for layer theming
}
```

### State Flow

```
Tab press → cycle layer: base → hyper → command → base
Key press (no modifiers) → trigger key action + show visual feedback
Key press (with Cmd/Ctrl/Alt) → propagate to browser (don't intercept)
```

---

## Implementation Steps

### Step 1: Extend Types

**File**: `src/types/index.ts`

Add the `LayerType` and `LayerConfig` types shown above. The existing `KeyDefinition` stays unchanged for now—mappings are Phase 3.

### Step 2: Create Layer Context

**File**: `src/context/LayerContext.tsx` (new)

A React context to manage current layer state:

```typescript
interface LayerContextValue {
  currentLayer: LayerType;
  setLayer: (layer: LayerType) => void;
  cycleLayer: () => void;
  layers: LayerConfig[];
}
```

The cycle order: `base → hyper → command → base`

Layer configurations:

| Layer | Label | Short | Accent |
|-------|-------|-------|--------|
| base | Base Layer | Base | (neutral, no accent) |
| hyper | Hyper Layer | ⌃⌥⇧⌘ | `rgba(100, 180, 160, 0.85)` (muted seafoam) |
| command | Command Layer | ⌘ | `rgba(200, 140, 120, 0.85)` (dusty terracotta) |

### Step 3: Create Keyboard Event Hook

**File**: `src/hooks/useKeyboardListener.ts` (new)

This hook:
1. Listens to `keydown` events on `window`
2. Maps `event.code` → key ID from our layout
3. Only triggers on keys without Cmd/Ctrl/Alt modifiers (allows system shortcuts through)
4. Calls a callback with the matched key ID
5. Handles Tab separately for layer cycling

**Key Mapping Strategy**:

The keyboard `event.code` values (e.g., `"KeyA"`, `"Digit1"`, `"BracketLeft"`) need mapping to our layout IDs (e.g., `"a"`, `"1"`, `"bracket-left"`).

```typescript
// Mapping rules (partial, full list in implementation):
const codeToKeyId: Record<string, string> = {
  // Letters
  KeyA: "a", KeyB: "b", /* ... */ KeyZ: "z",
  // Numbers
  Digit1: "1", Digit2: "2", /* ... */ Digit0: "0",
  // Special
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
  AltLeft: "option-left",
  AltRight: "option-right",
  MetaLeft: "command-left",
  MetaRight: "command-right",
  CapsLock: "caps",
  // Function keys
  Escape: "esc",
  F1: "f1", /* ... */ F12: "f12",
  Backspace: "backspace",
  Enter: "return",
  // Arrows
  ArrowLeft: "arrow-left",
  ArrowRight: "arrow-right",
  ArrowUp: "arrow-up",
  ArrowDown: "arrow-down",
};
```

**Modifier passthrough logic**:

```typescript
function handleKeyDown(event: KeyboardEvent) {
  // Always allow system shortcuts through
  if (event.metaKey || event.ctrlKey || event.altKey) {
    return; // Don't preventDefault, let browser handle
  }

  const keyId = codeToKeyId[event.code];
  if (!keyId) return;

  // Tab cycles layers
  if (keyId === "tab") {
    event.preventDefault();
    cycleLayer();
    return;
  }

  // Trigger key action
  event.preventDefault();
  onKeyPress(keyId);
}
```

### Step 4: Create Layer Indicator Component

**File**: `src/components/LayerIndicator.tsx` (new)

A pill-shaped indicator above the keyboard showing current layer:

**Design**:
- Horizontal pill with subtle backdrop blur
- Layer label with a colored dot indicator
- Smooth crossfade transition on layer change
- Positioned above keyboard, centered

**Visual treatment**:
- Background: `rgba(0, 0, 0, 0.25)` with `backdrop-filter: blur(12px)`
- Border: subtle 1px `rgba(255, 255, 255, 0.1)`
- Layer dot: colored circle matching layer accent
- Text: Instrument Sans, 500 weight, white with 0.85 opacity
- Entry animation: fade up, staggered after keyboard

**CSS**:
```css
.layer-indicator {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1vw, 14px);
  padding: clamp(8px, 1vw, 14px) clamp(16px, 2vw, 28px);
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  /* animation on layer change */
}

.layer-dot {
  width: clamp(8px, 1vw, 12px);
  height: clamp(8px, 1vw, 12px);
  border-radius: 50%;
  background: var(--layer-accent);
  transition: background 0.3s ease, transform 0.3s ease;
}

.layer-label {
  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(11px, 1.2vw, 16px);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.05em;
  transition: opacity 0.2s ease;
}
```

### Step 5: Add Key Press Feedback Effect

**File**: `src/components/Key.tsx` (modify)

Add an "ink ripple" effect when a key is pressed—either by clicking the UI or pressing the physical key.

**Effect Design**:

A radial gradient that expands from center and fades out, reminiscent of ink spreading on paper. The effect:
- Starts small and semi-transparent
- Expands to fill the key
- Uses the layer's accent color
- Fades out as it expands
- Duration: 400ms

**Implementation Approach**:

1. Add `isPressed` state to Key component
2. When pressed (click or keyboard), set `isPressed = true`
3. After animation duration, reset to false
4. Use CSS `::after` pseudo-element for the ripple

**Props Addition**:

```typescript
interface KeyProps {
  definition: KeyDefinition;
  isActive?: boolean;  // Triggered from keyboard listener
  onKeyTrigger?: (keyId: string) => void;
}
```

**CSS Addition** to `src/styles/main.css`:

```css
.key {
  /* existing styles... */
  overflow: hidden;  /* contain the ripple */
}

.key::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center,
    var(--ripple-color, rgba(140, 160, 150, 0.45)) 0%,
    transparent 70%
  );
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
}

.key.key-pressed::after {
  animation: inkRipple 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes inkRipple {
  0% {
    opacity: 0.6;
    transform: scale(0);
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}
```

**Layer-specific ripple colors** (set via CSS variable):

| Layer | Ripple Color |
|-------|-------------|
| base | `rgba(140, 160, 150, 0.45)` — neutral sage |
| hyper | `rgba(100, 180, 160, 0.5)` — muted seafoam |
| command | `rgba(200, 140, 120, 0.5)` — dusty terracotta |

### Step 6: Wire Up Components

**File**: `src/frontend.tsx` (modify)

```typescript
import { LayerProvider, useLayerContext } from "./context/LayerContext";
import { LayerIndicator } from "./components/LayerIndicator";
import { useKeyboardListener } from "./hooks/useKeyboardListener";

function App() {
  return (
    <LayerProvider>
      <AppContent />
    </LayerProvider>
  );
}

function AppContent() {
  const { currentLayer, cycleLayer } = useLayerContext();
  const [pressedKeyId, setPressedKeyId] = useState<string | null>(null);

  // Handle key press (from keyboard or click)
  const handleKeyPress = useCallback((keyId: string) => {
    setPressedKeyId(keyId);
    // Clear after animation
    setTimeout(() => setPressedKeyId(null), 400);
  }, []);

  // Physical keyboard listener
  useKeyboardListener({
    onKeyPress: handleKeyPress,
    onLayerCycle: cycleLayer,
  });

  return (
    <>
      <LayerIndicator />
      <Keyboard
        layout={macbookLayout}
        currentLayer={currentLayer}
        pressedKeyId={pressedKeyId}
        onKeyPress={handleKeyPress}
      />
      <p className="keyboard-title">MacBook Pro — US ANSI</p>
    </>
  );
}
```

**File**: `src/components/Keyboard.tsx` (modify)

Pass `pressedKeyId` and `onKeyPress` down to Key components:

```typescript
interface KeyboardProps {
  layout: KeyboardLayout;
  className?: string;
  currentLayer: LayerType;
  pressedKeyId: string | null;
  onKeyPress: (keyId: string) => void;
}
```

**File**: `src/components/Key.tsx` (modify)

Accept `isPressed` prop and `onClick` handler:

```typescript
interface KeyProps {
  definition: KeyDefinition;
  isPressed?: boolean;
  onClick?: () => void;
}

export function Key({ definition, isPressed, onClick }: KeyProps) {
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
    <div
      className={classNames}
      style={style}
      data-key-id={id}
      onClick={onClick}
    >
      {/* ... existing label rendering */}
    </div>
  );
}
```

### Step 7: Layer Transition Animation

Add smooth transitions when switching layers. The keyboard frame gets a subtle glow tint matching the layer accent:

**CSS Addition** to `src/styles/main.css`:

```css
.keyboard-frame {
  /* existing styles... */
  --layer-glow: transparent;
  transition: box-shadow 0.4s ease;
}

.keyboard-frame[data-layer="hyper"] {
  --layer-glow: rgba(100, 180, 160, 0.08);
}

.keyboard-frame[data-layer="command"] {
  --layer-glow: rgba(200, 140, 120, 0.08);
}

.keyboard-frame::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: var(--layer-glow);
  opacity: 1;
  z-index: -1;
  filter: blur(20px);
  transition: background 0.4s ease;
}
```

---

## File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `src/types/index.ts` | Modify | Add `LayerType`, `LayerConfig` types |
| `src/context/LayerContext.tsx` | New | Layer state context provider |
| `src/hooks/useKeyboardListener.ts` | New | Physical keyboard event handling |
| `src/components/LayerIndicator.tsx` | New | Visual layer indicator pill |
| `src/components/Keyboard.tsx` | Modify | Accept layer props, pass to keys |
| `src/components/Key.tsx` | Modify | Add press effect, click handler |
| `src/styles/main.css` | Modify | Add ripple animation, layer glow, indicator styles |
| `src/frontend.tsx` | Modify | Wire up context, hook, and components |

---

## Keyboard Event Handling Rules

### What We Intercept

| Scenario | Behavior |
|----------|----------|
| Single letter/number key (e.g., `L`) | `preventDefault`, trigger in-app action |
| Tab key | `preventDefault`, cycle layer |
| Function keys (F1-F12) | `preventDefault`, trigger in-app action |
| Arrow keys | `preventDefault`, trigger in-app action |
| Space bar | `preventDefault`, trigger in-app action |

### What We Allow Through

| Scenario | Behavior |
|----------|----------|
| Cmd + any key | Let browser handle (copy, paste, save, etc.) |
| Ctrl + any key | Let browser handle |
| Alt/Option + any key | Let browser handle |
| Any modifier combo | Let browser handle |

### Implementation Detail

```typescript
function shouldInterceptKey(event: KeyboardEvent): boolean {
  // Never intercept if any modifier is held
  if (event.metaKey || event.ctrlKey || event.altKey) {
    return false;
  }

  // Shift alone is okay (for uppercase typing simulation)
  // but we're not doing text input, so we intercept anyway

  return codeToKeyId.has(event.code);
}
```

---

## Visual Design Notes

### Color Palette Rationale

The layer colors complement the existing warm coral/amber background gradient while providing clear visual distinction:

- **Base layer**: No accent—neutral state, keys appear in their default light gray
- **Hyper layer** (seafoam `#64b4a0`): A cool, muted green-blue that contrasts with the warm background without clashing. Evokes calm focus.
- **Command layer** (terracotta `#c88c78`): A dusty, earthy red-orange that harmonizes with the background's coral tones while remaining distinct. Evokes action/importance.

### Layer Indicator Aesthetic

The indicator follows the refined aesthetic established in Phase 1:
- Frosted glass appearance (backdrop blur)
- Soft shadows
- Instrument Sans typography
- Colored accent dot provides instant visual feedback
- Positioned to feel like an integral part of the keyboard interface

### Ink Ripple Effect

The ripple effect evokes:
- Ink spreading on paper
- Subtle tactile feedback
- Colors that feel natural within each layer's mode

Key characteristics:
- Originates from center (not click point—simpler and works for keyboard too)
- Expands beyond key bounds slightly (scale 1.2)
- Color intensity peaks early, then fades
- Fast but perceptible (400ms)

### Layer Glow

The subtle glow behind the keyboard frame:
- Nearly imperceptible on base layer (no glow)
- Soft seafoam tint on Hyper layer
- Warm terracotta tint on Command layer
- Creates a sense of "mode" without being distracting

---

## Testing Checklist

- [ ] Tab key cycles through all three layers
- [ ] Layer indicator updates with correct label and dot color
- [ ] Pressing a key on physical keyboard shows ink ripple
- [ ] Clicking a key in UI shows ink ripple
- [ ] Cmd+L opens location bar (not intercepted)
- [ ] Cmd+C copies (not intercepted)
- [ ] Ctrl+Tab switches browser tabs (not intercepted)
- [ ] Layer glow transitions smoothly
- [ ] Arrow keys trigger properly despite cluster layout
- [ ] Function keys trigger properly
- [ ] No console errors during interaction
