# Keyboard Shortcut Mapper

A client-side TypeScript/React app to visualize and edit keyboard mapping layers on a MacBook keyboard.

## Current State

**Phase 6 Complete** — Full editor UI implemented

| Phase | Description      | Status                        |
| ----- | ---------------- | ----------------------------- |
| 1     | Base Keyboard UI | Complete                      |
| 2     | Layer System     | Complete                      |
| 3     | Mapping Display  | Complete                      |
| 4     | Local Storage    | Not started                   |
| 5     | App Icons        | Partial (29/50 icons fetched) |
| 6     | Editor UI        | Complete                      |
| 7     | Polish           | Not started                   |

## Features

- **Three Layers**: Base (standard layout), Hyper (app switching), Command (system commands)
- **Visual Keyboard**: 64-key MacBook US ANSI layout with responsive sizing
- **Layer Switching**: Tab/Shift+Tab to cycle, or click layer tabs
- **Ink Ripple Effect**: Visual feedback on key press with layer-colored animations
- **Mapping Display**: App icons + action labels on mapped keys
- **Inline Editor**: Click any key on Hyper/Command layer to edit mappings via popover
- **Searchable App Dropdown**: Base UI Combobox with icon manifest integration

## Tech Stack

- **Runtime**: Bun with HMR
- **UI**: React 19 + styled-components
- **Components**: Base UI (headless popover/combobox)
- **Styling**: CSS variables with clamp() for responsive sizing

## Project Structure

```
src/
├── components/     # Keyboard, Key, KeyPopover, AppCombobox, LayerIndicator
├── context/        # LayerContext, MappingContext
├── hooks/          # useKeyboardListener
├── data/           # macbook-layout, default-mappings, icon-manifest
├── styles/         # GlobalStyles
├── types/          # TypeScript interfaces
└── static/icons/   # App icons (PNG/ICNS)
```

## Running

```bash
bun install
bun --hot src/index.ts  # http://localhost:3000
```

## Next Steps

- Phase 4: Persist mappings to localStorage
- Phase 5: Fetch remaining missing app icons
- Phase 7: Animations, accessibility, mobile polish
