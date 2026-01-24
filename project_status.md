# Keyboard Shortcut Mapper

**Status:** Phase 1 Complete, Phase 5 Partially Complete

A fully client-side TypeScript/React application to visualize keyboard mapping layers on a MacBook keyboard. Displays three layers:

1. **Base Layer** — Standard MacBook keyboard layout
2. **Hyper Layer** — Mappings triggered by Hyper key (app switching)
3. **Hyper+Command Layer** — Mappings triggered by Hyper+Command (system commands)

---

## Project Structure

```
keyboard_shortcut_mapper/
├── src/
│   ├── index.ts              # Bun server with HMR
│   ├── index.html            # Entry HTML with bg-gradient div
│   ├── frontend.tsx          # React root + Keyboard component
│   ├── components/
│   │   ├── Keyboard.tsx      # Full keyboard layout renderer
│   │   └── Key.tsx           # Individual key component
│   ├── data/
│   │   └── macbook-layout.ts # 78-key MacBook US ANSI layout definition
│   ├── styles/
│   │   └── main.css          # Responsive styling, animated gradient bg
│   ├── types/
│   │   └── index.ts          # TypeScript types for keys/layout
│   └── static/icons/         # Downloaded app icons (PNG/ICNS)
│       └── icon-manifest.json
├── scripts/
│   ├── fetch-icons.ts        # Icon fetcher from macosicons.com API
│   └── apps_list.md          # List of 50 apps to fetch icons for
├── specs/                    # Design specifications
│   ├── 00_start.md
│   ├── 01_phases.md
│   ├── 02_phase_1_initial_layout.md
│   └── 03_phase_5_app_icons_download.md
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
| 2     | Layer System     | ⬜ Not started                |
| 3     | Mapping Display  | ⬜ Not started                |
| 4     | Local Storage    | ⬜ Not started                |
| 5     | App Icons        | 🟡 Partial (icons downloaded) |
| 6     | Editor UI        | ⬜ Not started                |
| 7     | Polish           | ⬜ Not started                |

---

## Phase 1 — Complete

**Goal:** Render a static MacBook keyboard with polished styling

### What was built:

- Full 78-key MacBook US ANSI layout (6 rows)
- React components: `Keyboard.tsx`, `Key.tsx`
- Layout data: `macbook-layout.ts` with all key definitions
- Accurate key widths (Tab 1.5u, Caps Lock 1.75u, Shift 2.25u/2.75u, Space 6.25u, etc.)
- Proper arrow key cluster with half-height up/down keys
- Keys with dual labels (number row shows both symbol and number)

### Styling features:

- Viewport-responsive sizing using CSS `clamp()` with vw/vh units
- Animated gradient mesh background (warm amber/coral tones)
- Keyboard frame with depth shadows and ambient glow
- Individual key styling with hover/active states
- Entry animations for keyboard and title
- Media queries for ultrawide (21:9) and mobile (<768px) screens
- Noise texture overlay for visual depth

### Key CSS variables:

```css
--key-unit: clamp(28px, 5vw, 70px) --key-gap: clamp(2px, 0.35vw, 6px)
  --key-radius: clamp(4px, 0.6vw, 10px)
  --frame-padding: clamp(12px, 1.8vw, 32px);
```

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

**Phase 2: Layer System**

- Tab key toggles between Base/Hyper/Hyper+Cmd layers
- Visual indicator for active layer
- Transition animations between layers

**Phase 3: Mapping Display**

- Show shortcut mappings overlaid on keys
- App icons on Hyper layer keys
- Dimmed styling for unmapped keys
