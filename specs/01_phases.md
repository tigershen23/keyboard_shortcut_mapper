# Keyboard Shortcut Mapper - Project Phases

## Project Summary

A fully client-side TypeScript/React application to visualize keyboard mapping layers on a MacBook keyboard. The app displays three layers:

1. **Base Layer** - Standard MacBook keyboard layout
2. **Hyper Layer** - Mappings triggered by the Hyper key (for app switching)
3. **Hyper+Command Layer** - Mappings triggered by Hyper+Command (for system commands)

Users can toggle between layers using keyboard shortcuts, view all mappings at a glance with app icons overlaid on keys, and persist configurations to local storage.

---

## Research Findings

### react-simple-keyboard Analysis

The [react-simple-keyboard](https://github.com/hodgef/react-simple-keyboard) library provides useful patterns:

- **Layout Model**: Simple array-of-strings per row, special keys use `{bracket}` notation (e.g., `{shift}`, `{enter}`)
- **Theming**: BEM-like CSS classes (`.hg-theme-*`, `.hg-button-*`), flexbox rows, button-specific styling via `buttonTheme` prop
- **Display Customization**: `display` prop maps button identifiers to custom labels without changing layout
- **Key Access**: `getButtonElement(button)` provides DOM access for custom overlays

**Inspiration for our design:**

- Flexbox row-based layout for responsive key sizing
- Data-driven layout definition (easy to define MacBook-specific layout)
- Separation of layout structure from display labels
- CSS class-based theming for different layers

### App Icons API

[macosicons.com](https://macosicons.com/) provides 25,000+ macOS app icons via a REST API:

- **Endpoint**: `POST https://api.macosicons.com/api/v1/search`
- **Auth**: `x-api-key` header
- **Response**: Array of hits with `appName`, `lowResPngUrl`, `icnsUrl`, `category`, `downloads`
- **Rate Limit**: 50 free requests/month, 1000 for €4.99/month
- **Docs**: [docs.macosicons.com](https://docs.macosicons.com/)

**Strategy**: Write a one-off script to batch-fetch icons for installed apps (~138 apps on this machine), store locally in the project. This avoids runtime API calls and rate limit concerns.

---

## Phase 1: Project Setup & Base Keyboard UI

**Goal**: Render a beautiful, accurate MacBook keyboard layout with compelling visual design.

### Tasks

1. Initialize Bun + React + TypeScript project structure
2. Define MacBook keyboard layout data model (all keys, sizes, positions)
3. Create `Keyboard` component with flexbox rows
4. Create `Key` component with proper sizing for different key widths
5. Style with a distinctive, polished aesthetic (dark theme, subtle gradients, key shadows)
6. Ensure responsive scaling

### Deliverable

Static MacBook keyboard rendered in browser, no interactivity yet.

---

## Phase 2: Layer System & Navigation

**Goal**: Implement the three-layer system with keyboard-driven navigation.

### Tasks

1. Define layer data structure: `{ base, hyper, hyperCommand }`
2. Implement global keyboard listener for layer switching
3. Add visual indicator for current active layer (header/badge)
4. Animate layer transitions (subtle fade or slide)
5. Style keys differently per layer (base: neutral, hyper: accent color, hyper+cmd: secondary accent)

### Keyboard Controls

- Default view: Base layer
- Toggle shown layer with `Tab`
- Non-Base layers empty by default

### Deliverable

Three distinct visual layers, switchable via keyboard.

---

## Phase 3: Mapping Data Model & Display

**Goal**: Display shortcut mappings overlaid on keys.

### Tasks

1. Define mapping schema:
   ```typescript
   interface KeyMapping {
     key: string; // e.g., "a", "f1"
     action: string; // e.g., "Messages", "Lock Screen"
     appName?: string; // For icon lookup
     icon?: string; // Local icon path
     description?: string; // Tooltip text
   }
   ```
2. Create sample mappings for Hyper layer (app switching)
3. Create sample mappings for Hyper+Command layer (system commands)
4. Update `Key` component to show:
   - Original key label (smaller, top)
   - Mapping action (larger, center/bottom)
   - App icon (if available)
5. Handle keys with no mapping (show as dimmed or standard)

### Key Sizing Consideration

Keys need to be large enough to display app names like "Messages" legibly. Consider:

- Larger overall keyboard scale
- Truncation with tooltip for long names
- Icon-only mode option

### Deliverable

Keyboard displays all configured mappings with readable labels.

---

## Phase 4: Local Storage Persistence

**Goal**: Persist mappings so they survive page refreshes.

### Tasks

1. Define localStorage schema (JSON structure for all layers)
2. Implement `saveMappings()` function
3. Implement `loadMappings()` function with fallback to defaults
4. Auto-save on any mapping change
5. Add "Reset to Defaults" option

### Schema

```typescript
interface StoredConfig {
  version: number;
  layers: {
    hyper: KeyMapping[];
    hyperCommand: KeyMapping[];
  };
}
```

### Deliverable

Mappings persist across browser sessions.

---

## Phase 5: App Icons Integration

**Goal**: Display actual macOS app icons for mapped applications.

### Tasks

1. Write one-off script (`scripts/fetch-icons.ts`) to:
   - List installed apps from `/Applications`, `~/Applications`, `/System/Applications`
   - Query macosicons.com API for each app
   - Download best-match icons to `public/icons/`
   - Generate manifest file mapping app names to icon paths
2. Integrate icon manifest into the app
3. Update `Key` component to display icons
4. Handle missing icons gracefully (show app initial or generic icon)

### Script Usage

```bash
MACOSICONS_API_KEY=xxx bun run scripts/fetch-icons.ts
```

### Deliverable

App icons display on mapped keys.

---

## Phase 6: Mapping Editor UI

**Goal**: Allow users to add/edit/remove mappings directly in the UI.

### Tasks

1. Click on key to open edit modal/panel
2. Edit form with fields: action name, app name (for icon), description
3. Delete mapping option
4. Keyboard shortcut to enter "edit mode" vs "view mode"
5. Visual feedback when in edit mode

### Deliverable

Full CRUD for mappings without touching code.

---

## Phase 7: Polish & Advanced Features

**Goal**: Production-ready quality and nice-to-have features.

### Tasks

1. **Export/Import**: Download config as JSON, upload to restore
2. **Keyboard shortcut hints**: Show the actual key combo in a subtle overlay
3. **Search**: Filter/highlight keys by action name
4. **Print view**: Optimized layout for printing as reference
5. **Accessibility**: Keyboard navigation, screen reader labels
6. **PWA support**: Installable, works offline

### Deliverable

Polished, feature-complete application.
