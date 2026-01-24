# Phase 3: Mapping Data Model & Display

**Goal**: Display shortcut mappings overlaid on keys with app icons for the Hyper and Command layers.

---

## Overview

This phase adds:

1. Mapping data schema for key → action associations
2. Default mappings for Hyper layer (app switching) and Command layer (system actions)
3. Key component updates to display mappings (app icons, action labels)
4. Visual treatment for mapped vs unmapped keys
5. Integration with pre-downloaded app icons

---

## Architecture

### Key Mapping Types

```typescript
// src/types/index.ts (additions)

export interface KeyMapping {
  keyId: string; // References KeyDefinition.id (e.g., "a", "f1")
  action: string; // Short action name displayed on key (e.g., "Safari", "Lock")
  appName?: string; // For icon lookup in manifest (e.g., "Safari", "Google Chrome")
  iconPath?: string; // Override path if different from manifest lookup
  description?: string; // Tooltip text for additional context
  color?: string; // Optional custom accent color for this mapping
}

export interface LayerMappings {
  hyper: KeyMapping[];
  command: KeyMapping[];
}
```

### Data Flow

```
LayerMappings (data) → MappingContext (state) → Key component (display)
                                              ↓
                                    IconManifest (icon lookup)
```

---

## Implementation Steps

### Step 1: Extend Types

**File**: `src/types/index.ts`

Add the `KeyMapping` and `LayerMappings` types shown above.

### Step 2: Create Default Mappings Data

**File**: `src/data/default-mappings.ts` (new)

Define default mappings for both layers. These are sample mappings the user will customize later.

The default mappings should include these Hyper layer shortcuts:

**Hyper Layer Mappings:**

| Key | App | Icon Lookup |
|-----|-----|-------------|
| Z | Chrome | Google Chrome |
| A | ChatGPT Atlas | ChatGPT Atlas |
| D | Cursor | Cursor |
| F | Slack | Slack |
| G | Messages | Messages |
| H | Superhuman | Superhuman |
| J | Trello | Trello |
| K | Obsidian | Obsidian |
| L | Raycast Notes | Raycast |
| ; | ChatGPT | ChatGPT |
| ' | Raycast AI | Raycast |
| Q | Ghostty | Ghostty |
| W | Figma | Figma |
| E | Spotify | Spotify |
| R | Vimcal | Vimcal |
| T | Linear | Linear |
| ] | Anki | Anki |
| Y | Bitwarden | Bitwarden |

Notes:
- Some apps may not have icons in the manifest (Slack, Messages, Figma, Vimcal, Raycast)
- The Command layer mappings can remain as placeholder system commands for now

### Step 3: Create Icon Manifest Loader

**File**: `src/data/icon-manifest.ts` (new)

Load and provide typed access to the icon manifest:

```typescript
import manifestData from "../static/icons/icon-manifest.json";

export interface IconEntry {
  pngPath: string;
  icnsPath: string;
  pngUrl: string;
  icnsUrl: string;
  credit: string | null;
}

export type IconManifest = Record<string, IconEntry>;

export const iconManifest: IconManifest = manifestData as IconManifest;

export function getIconPath(appName: string): string | null {
  const entry = iconManifest[appName];
  if (!entry) return null;
  // Return path relative to static serving
  // Assumes icons are served from /icons/
  return entry.pngPath;
}
```

### Step 4: Create Mapping Context

**File**: `src/context/MappingContext.tsx` (new)

Context for managing and accessing mappings:

```typescript
import React, { createContext, useContext, useMemo } from "react";
import type { KeyMapping, LayerMappings, LayerType } from "../types";
import { defaultMappings } from "../data/default-mappings";
import { getIconPath } from "../data/icon-manifest";

interface MappingContextValue {
  mappings: LayerMappings;
  getMappingForKey: (keyId: string, layer: LayerType) => KeyMapping | null;
  getIconForMapping: (mapping: KeyMapping) => string | null;
}

const MappingContext = createContext<MappingContextValue | null>(null);

export function MappingProvider({ children }: { children: React.ReactNode }) {
  // Build lookup maps for O(1) access
  const hyperMap = useMemo(() => {
    const map = new Map<string, KeyMapping>();
    defaultMappings.hyper.forEach((m) => map.set(m.keyId, m));
    return map;
  }, []);

  const commandMap = useMemo(() => {
    const map = new Map<string, KeyMapping>();
    defaultMappings.command.forEach((m) => map.set(m.keyId, m));
    return map;
  }, []);

  const getMappingForKey = (keyId: string, layer: LayerType): KeyMapping | null => {
    if (layer === "base") return null;
    if (layer === "hyper") return hyperMap.get(keyId) ?? null;
    if (layer === "command") return commandMap.get(keyId) ?? null;
    return null;
  };

  const getIconForMapping = (mapping: KeyMapping): string | null => {
    // Check for override path first
    if (mapping.iconPath) return mapping.iconPath;
    // Then look up by app name
    if (mapping.appName) return getIconPath(mapping.appName);
    return null;
  };

  const value: MappingContextValue = {
    mappings: defaultMappings,
    getMappingForKey,
    getIconForMapping,
  };

  return (
    <MappingContext.Provider value={value}>
      {children}
    </MappingContext.Provider>
  );
}

export function useMappingContext() {
  const context = useContext(MappingContext);
  if (!context) {
    throw new Error("useMappingContext must be used within MappingProvider");
  }
  return context;
}
```

### Step 5: Update Key Component for Mapping Display

**File**: `src/components/Key.tsx` (modify)

The Key component needs to handle three display modes:

1. **Base layer**: Show standard key labels
2. **Non-base layer with mapping**: Show icon + action label
3. **Non-base layer without mapping**: Show dimmed/empty key

```typescript
import React from "react";
import type { KeyDefinition, KeyMapping, LayerType } from "../types";

interface KeyProps {
  definition: KeyDefinition;
  isPressed?: boolean;
  onClick?: () => void;
  rippleColor?: string;
  currentLayer?: LayerType;
  mapping?: KeyMapping | null;
  iconPath?: string | null;
}

export function Key({
  definition,
  isPressed,
  onClick,
  rippleColor,
  currentLayer = "base",
  mapping,
  iconPath,
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

  const isBaseLayer = currentLayer === "base";
  const isRegularKey = !isModifier && !isFunction && !isSpecialKey(id);
  const hasMapping = mapping !== null && mapping !== undefined;

  // Determine what to show
  const showBaseLabel = isBaseLayer || !isRegularKey;
  const showMapping = !isBaseLayer && isRegularKey && hasMapping;
  const isDimmed = !isBaseLayer && isRegularKey && !hasMapping;

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
    isDimmed && "key-unmapped",
    showMapping && "key-mapped",
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
      {showBaseLabel && renderBaseLabel(label, secondaryLabel)}
      {showMapping && mapping && renderMapping(mapping, iconPath)}
    </div>
  );
}

function renderBaseLabel(label: string, secondaryLabel?: string) {
  if (secondaryLabel) {
    return (
      <div className="key-labels">
        <span className="key-label-secondary">{secondaryLabel}</span>
        <span className="key-label-primary">{label}</span>
      </div>
    );
  }
  return <span className="key-label">{label}</span>;
}

function renderMapping(mapping: KeyMapping, iconPath?: string | null) {
  return (
    <div className="key-mapping">
      {iconPath && (
        <img
          src={iconPath}
          alt={mapping.action}
          className="key-mapping-icon"
          loading="lazy"
        />
      )}
      <span className="key-mapping-label">{mapping.action}</span>
    </div>
  );
}

function isSpecialKey(id: string): boolean {
  const specialKeys = [
    "esc", "backspace", "tab", "caps", "return", "space",
    "arrow-left", "arrow-right", "arrow-up", "arrow-down",
  ];
  return specialKeys.includes(id);
}
```

### Step 6: Update Keyboard Component

**File**: `src/components/Keyboard.tsx` (modify)

Pass mapping data to each Key:

```typescript
import React from "react";
import { Key } from "./Key";
import { useMappingContext } from "../context/MappingContext";
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
  const { getMappingForKey, getIconForMapping } = useMappingContext();

  const renderKey = (key: KeyDefinition) => {
    const mapping = getMappingForKey(key.id, currentLayer);
    const iconPath = mapping ? getIconForMapping(mapping) : null;

    return (
      <Key
        key={key.id}
        definition={key}
        isPressed={pressedKeyId === key.id}
        onClick={() => onKeyPress(key.id)}
        rippleColor={rippleColor}
        currentLayer={currentLayer}
        mapping={mapping}
        iconPath={iconPath}
      />
    );
  };

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
              renderKey={renderKey}
            />
          );
        }

        return (
          <div key={rowIndex} className="keyboard-row">
            {row.keys.map(renderKey)}
          </div>
        );
      })}
    </div>
  );
}

// ModifierRow component for bottom row with arrow cluster
interface ModifierRowProps {
  keys: KeyDefinition[];
  renderKey: (key: KeyDefinition) => React.ReactNode;
}

function ModifierRow({ keys, renderKey }: ModifierRowProps) {
  const modifierKeys = keys.slice(0, 7);
  const arrowKeys = keys.slice(7);

  const arrowLeft = arrowKeys.find((k) => k.id === "arrow-left");
  const arrowUp = arrowKeys.find((k) => k.id === "arrow-up");
  const arrowDown = arrowKeys.find((k) => k.id === "arrow-down");
  const arrowRight = arrowKeys.find((k) => k.id === "arrow-right");

  return (
    <div className="keyboard-row">
      {modifierKeys.map(renderKey)}
      <div className="arrow-cluster">
        {arrowLeft && renderKey(arrowLeft)}
        <div className="arrow-vertical">
          {arrowUp && renderKey(arrowUp)}
          {arrowDown && renderKey(arrowDown)}
        </div>
        {arrowRight && renderKey(arrowRight)}
      </div>
    </div>
  );
}
```

### Step 7: Update Frontend Entry

**File**: `src/frontend.tsx` (modify)

Add MappingProvider to the component tree:

```typescript
import { MappingProvider } from "./context/MappingContext";

function App() {
  return (
    <LayerProvider>
      <MappingProvider>
        <AppContent />
      </MappingProvider>
    </LayerProvider>
  );
}
```

### Step 8: Add Mapping Styles

**File**: `src/styles/main.css` (additions)

```css
/* Mapped key display */
.key-mapped {
  /* Slightly elevated to indicate active mapping */
}

.key-mapping {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(2px, 0.3vw, 4px);
  position: relative;
  z-index: 2;
  padding: clamp(2px, 0.3vw, 4px);
  width: 100%;
  height: 100%;
}

.key-mapping-icon {
  width: clamp(16px, 2vw, 32px);
  height: clamp(16px, 2vw, 32px);
  object-fit: contain;
  border-radius: clamp(3px, 0.4vw, 6px);
  /* Subtle shadow for depth */
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.key-mapping-label {
  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(7px, 0.8vw, 11px);
  font-weight: 500;
  color: #3a3a3c;
  text-align: center;
  line-height: 1.1;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Unmapped keys on non-base layers */
.key-unmapped {
  opacity: 0.35;
  background: linear-gradient(
    180deg,
    #f0f0f2 0%,
    #e8e8ea 25%,
    #e2e2e4 60%,
    #dadade 100%
  );
}

.key-unmapped:hover {
  opacity: 0.5;
  background: linear-gradient(
    180deg,
    #f4f4f6 0%,
    #ececee 25%,
    #e6e6e8 60%,
    #dfe0e2 100%
  );
}

/* Icon-only mode for smaller keys */
.key-mapping.icon-only .key-mapping-label {
  display: none;
}

/* Command layer styling - slightly different treatment */
.keyboard-frame[data-layer="command"] .key-mapping-label {
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Larger keys get more room for content */
.key-space .key-mapping {
  flex-direction: row;
  gap: clamp(6px, 0.8vw, 10px);
}

.key-space .key-mapping-icon {
  width: clamp(20px, 2.5vw, 36px);
  height: clamp(20px, 2.5vw, 36px);
}

.key-space .key-mapping-label {
  font-size: clamp(9px, 1vw, 13px);
}
```

### Step 9: Serve Static Icons

**File**: `src/index.ts` (modify)

Ensure the Bun server serves static icons:

```typescript
import index from "./index.html";

Bun.serve({
  routes: {
    "/": index,
    "/icons/*": async (req) => {
      const path = new URL(req.url).pathname;
      const file = Bun.file(`./src/static${path}`);
      if (await file.exists()) {
        return new Response(file);
      }
      return new Response("Not found", { status: 404 });
    },
  },
  development: {
    hmr: true,
    console: true,
  },
});
```

---

## Visual Design

### Mapped Key Appearance

Keys with mappings display:

1. **App icon** (top, ~50% of key height)
2. **Action label** (bottom, truncated if needed)

The icon and label are vertically stacked and centered within the key.

### Unmapped Key Appearance

Keys without mappings on non-base layers:

- Reduced opacity (35%)
- Slightly desaturated background
- No label displayed
- Still responsive to hover (opacity increases to 50%)

### Icon Sizing

Icons scale with the key unit:

- Standard keys: `clamp(16px, 2vw, 32px)`
- Space bar: `clamp(20px, 2.5vw, 36px)`

### Label Truncation

Action labels use:

- `text-overflow: ellipsis`
- `white-space: nowrap`
- Max width constrained to key width

For very long app names, consider abbreviations in the mapping data (e.g., "Chrome" instead of "Google Chrome").

---

## Icon Manifest Integration

The icon manifest (`src/static/icons/icon-manifest.json`) maps app names to icon paths:

```json
{
  "Safari": {
    "pngPath": "/icons/safari.png",
    "icnsPath": "/icons/safari.icns",
    ...
  }
}
```

The `getIconPath` function returns the PNG path for web display.

### Missing Icons Handling

When an icon is not found in the manifest:

1. The key displays only the action label (no icon)
2. Label sizing adjusts to fill available space
3. Consider showing first letter as fallback in future iteration

Available icons (33 apps):

- Ghostty, ChatGPT, Bitwarden, Cursor, Spotify, Rize, Claude, Aqua Voice
- Superhuman, Google Chrome, Anki, Obsidian, WhatsApp, Discord, Safari
- Trello, Zoom, QMK Toolbox, Stats, Raindrop.io, Loom, Amazon Kindle
- Framer, Linear, Windsurf, Conductor, TablePlus, RuneLite, NordVPN, OrbStack

---

## File Changes Summary

| File                             | Change Type | Description                             |
| -------------------------------- | ----------- | --------------------------------------- |
| `src/types/index.ts`             | Modify      | Add `KeyMapping`, `LayerMappings` types |
| `src/data/default-mappings.ts`   | New         | Default mapping definitions             |
| `src/data/icon-manifest.ts`      | New         | Icon manifest loader with typed access  |
| `src/context/MappingContext.tsx` | New         | Mapping state and lookup context        |
| `src/components/Key.tsx`         | Modify      | Add mapping display mode                |
| `src/components/Keyboard.tsx`    | Modify      | Pass mapping data to keys               |
| `src/frontend.tsx`               | Modify      | Add MappingProvider                     |
| `src/styles/main.css`            | Modify      | Add mapping and unmapped key styles     |
| `src/index.ts`                   | Modify      | Add static icon serving route           |

---

## Testing Checklist

- [ ] Base layer shows standard key labels (no mappings)
- [ ] Hyper layer shows app icons + labels for mapped keys
- [ ] Command layer shows action labels for mapped keys
- [ ] Unmapped keys appear dimmed on non-base layers
- [ ] Icons load correctly from `/icons/` path
- [ ] Missing icons gracefully fall back to label-only
- [ ] Labels truncate with ellipsis when too long
- [ ] Space bar mapping displays correctly (horizontal layout)
- [ ] Modifier and special keys always show their labels
- [ ] Pressing mapped keys still triggers ink ripple effect
- [ ] Layer switching updates key display immediately
- [ ] No console errors for missing icons

---
