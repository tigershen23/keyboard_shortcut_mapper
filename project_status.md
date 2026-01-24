# Keyboard Shortcut Mapper

**Status:** Phase 3 Complete

A fully client-side TypeScript/React application to visualize keyboard mapping layers on a MacBook keyboard. Displays three layers:

1. **Base Layer** — Standard MacBook keyboard layout
2. **Hyper Layer** — Mappings triggered by Hyper key (app switching)
3. **Command Layer** — Mappings triggered by Hyper+Command (system commands)

---

## Project Structure

```
keyboard_shortcut_mapper/
├── src/
│   ├── index.ts              # Bun server with HMR + icon serving
│   ├── index.html            # Entry HTML with bg-gradient div
│   ├── frontend.tsx          # React root + app component + GlobalStyles
│   ├── components/
│   │   ├── Keyboard.tsx      # Full keyboard layout (styled-components)
│   │   ├── Key.tsx           # Individual key with press effects (styled-components)
│   │   └── LayerIndicator.tsx # Layer tab switcher UI (styled-components)
│   ├── context/
│   │   ├── LayerContext.tsx  # Layer state management
│   │   └── MappingContext.tsx # Mapping state and lookup
│   ├── hooks/
│   │   └── useKeyboardListener.ts # Physical keyboard event handling
│   ├── data/
│   │   ├── macbook-layout.ts # 64-key MacBook US ANSI layout (no function row)
│   │   ├── default-mappings.ts # Default Hyper + Command layer mappings
│   │   └── icon-manifest.ts  # Icon manifest loader
│   ├── styles/
│   │   └── GlobalStyles.ts   # Global CSS (reset, fonts, background, CSS vars)
│   ├── types/
│   │   └── index.ts          # TypeScript types for keys/layout/layers/mappings
│   └── static/icons/         # Downloaded app icons (PNG/ICNS)
│       └── icon-manifest.json
├── scripts/
│   ├── fetch-icons.ts        # Icon fetcher from macosicons.com API
│   └── apps_list.md          # List of 50 apps to fetch icons for
├── specs/                    # Design specifications
│   ├── 00_start.md
│   ├── 01_phases.md
│   ├── 02_phase_1_initial_layout.md
│   ├── 03_phase_5_app_icons_download.md
│   ├── 04_phase_2_layer_system.md
│   └── 05_phase_3_mapping.md
├── CLAUDE.md                 # Bun/project conventions
├── package.json
├── tsconfig.json
└── bun.lock
```

---

## Phase Status

| Phase | Description      | Status                        |
| ----- | ---------------- | ----------------------------- |
| 1     | Base Keyboard UI | ✅ Complete                   |
| 2     | Layer System     | ✅ Complete                   |
| 3     | Mapping Display  | ✅ Complete                   |
| 4     | Local Storage    | ⬜ Not started                |
| 5     | App Icons        | 🟡 Partial (icons downloaded) |
| 6     | Editor UI        | ⬜ Not started                |
| 7     | Polish           | ⬜ Not started                |

---

## Phase 1 — Complete

**Goal:** Render a static MacBook keyboard with polished styling

### What was built:

- Full 64-key MacBook US ANSI layout (5 rows, no function row)
- React components: `Keyboard.tsx`, `Key.tsx`
- Layout data: `macbook-layout.ts` with all key definitions
- Accurate key widths (Tab 1.5u, Caps Lock 1.75u, Shift 2.25u/2.75u, Space 5u, etc.)
- Proper arrow key cluster with half-height up/down keys
- Keys with dual labels (number row shows both symbol and number)

### Styling features:

- **styled-components** for colocated, type-safe component styling
- Viewport-responsive sizing using CSS `clamp()` with vw/vh units
- Animated gradient mesh background (warm amber/coral tones)
- Keyboard frame with depth shadows and ambient glow
- Individual key styling with hover/active states
- Entry animations for keyboard and title
- Media queries for ultrawide (21:9) and mobile (<768px) screens
- Noise texture overlay for visual depth

### Styling architecture:

- **GlobalStyles.ts**: CSS reset, font imports, CSS custom properties, background gradient, media query breakpoints
- **Component-level styles**: Each component (Key, Keyboard, LayerIndicator) uses styled-components with TypeScript props for dynamic styling
- **Transient props** (`$prop`): styled-components convention to prevent DOM attribute warnings

### Key CSS variables:

```css
--key-unit: clamp(28px, 5vw, 70px);
--key-gap: clamp(2px, 0.35vw, 6px);
--key-radius: clamp(4px, 0.6vw, 10px);
--frame-padding: clamp(12px, 1.8vw, 32px);
```

---

## Phase 2 — Complete

**Goal:** Implement three-layer system with keyboard navigation and visual feedback

### What was built:

- **Layer System**: Base → Hyper → Command layers with Tab key cycling (Shift+Tab goes backward)
- **LayerContext**: React context for global layer state management
- **LayerIndicator**: Tab-style switcher showing all three layers with clickable buttons
- **Physical Keyboard Listener**: Intercepts keypresses, triggers visual feedback, passes through system shortcuts (Cmd/Ctrl/Alt combos)
- **Ink Ripple Effect**: Two-layer CSS animation (diagonal gradient + solid fill) on key press
- **Layer Glow**: Subtle colored glow behind keyboard frame matching active layer

### Components created:

- `src/context/LayerContext.tsx` — Layer state provider with cycling logic
- `src/hooks/useKeyboardListener.ts` — Keyboard event handling with modifier passthrough
- `src/components/LayerIndicator.tsx` — Tab switcher UI with page title

### Layer colors:

| Layer   | Accent Color                    | Ripple Color                    |
| ------- | ------------------------------- | ------------------------------- |
| Base    | `rgba(255, 255, 255, 0.6)`      | `rgba(140, 160, 150, 0.45)`     |
| Hyper   | `rgba(100, 180, 160, 0.85)`     | `rgba(100, 180, 160, 0.5)`      |
| Command | `rgba(200, 140, 120, 0.85)`     | `rgba(200, 140, 120, 0.5)`      |

### Keyboard behavior:

- Tab: Cycle forward through layers
- Shift+Tab: Cycle backward through layers
- Any key (no modifiers): Trigger ink ripple effect
- Cmd/Ctrl/Alt + key: Passes through to browser (system shortcuts work)
- Shift alone: Does not trigger ripple (reserved for shortcuts)

### Key display changes:

- Regular keys (letters, numbers, symbols) show blank on non-base layers
- Modifier keys, function keys, and special keys (arrows, space, etc.) always show labels

---

## Phase 3 — Complete

**Goal:** Display shortcut mappings overlaid on keys with app icons

### What was built:

- **KeyMapping types**: `KeyMapping` and `LayerMappings` interfaces for mapping data
- **MappingContext**: React context with O(1) key lookups for mapping retrieval
- **Icon manifest loader**: `getIconPath()` helper for resolving app icons
- **Default mappings**: 17 Hyper layer app shortcuts + 8 Command layer system commands
- **Mapping display**: Keys show app icon + action label when mapped
- **Unmapped key styling**: Dimmed (35% opacity) on non-base layers

### Hyper Layer Mappings:

| Key | App            | Key | App           |
|-----|----------------|-----|---------------|
| Z   | Chrome         | Q   | Ghostty       |
| A   | ChatGPT Atlas  | W   | Figma         |
| D   | Cursor         | E   | Spotify       |
| F   | Slack          | R   | Vimcal        |
| G   | Messages       | T   | Linear        |
| H   | Superhuman     | ]   | Anki          |
| J   | Trello         | Y   | Bitwarden     |
| K   | Obsidian       |     |               |
| L   | Notes (Raycast)|     |               |
| ;   | ChatGPT        |     |               |
| '   | Raycast AI     |     |               |

### Command Layer Mappings:

| Key | Action    | Key | Action  |
|-----|-----------|-----|---------|
| L   | Lock      | P   | Play    |
| S   | Sleep     | N   | Next    |
| M   | Mute      | B   | Back    |
| U   | Vol +     | D   | Vol -   |

### Files created:

- `src/types/index.ts` — Added `KeyMapping`, `LayerMappings` types
- `src/data/default-mappings.ts` — Default mapping definitions
- `src/data/icon-manifest.ts` — Icon manifest loader with typed access
- `src/context/MappingContext.tsx` — Mapping state and lookup context

### Visual design:

- Mapped keys show icon (50% height) + label (truncated if needed)
- Unmapped keys: 35% opacity, slightly desaturated
- Icons scale with key size: `clamp(16px, 2vw, 32px)`
- Space bar uses horizontal layout for mappings

---

## Phase 5 — Partial

**Goal:** Fetch app icons from macosicons.com API

### What was built:

- `scripts/fetch-icons.ts` — Bun script to download icons
- `scripts/apps_list.md` — List of 50 target apps

### Results:

- **29 apps** with icons successfully downloaded to src/static/icons
- 33 PNG files, 36 ICNS files
- **10 apps** not found in API: Streaks, Vimcal, Homerow, Granola, etc.
- Some 403 errors on certain icon URLs

---

## Running the App

```bash
# Install dependencies
bun install

# Start dev server with HMR
bun --hot src/index.ts

# Server runs at http://localhost:3000
```

---

## Next Steps

**Phase 4: Local Storage**

- Persist mappings across browser sessions
- Reset to defaults option

**Phase 6: Editor UI**

- Click to edit key mappings
- App/action picker interface
- Icon upload support

