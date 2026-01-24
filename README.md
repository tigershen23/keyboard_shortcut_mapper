# Keyboard Shortcut Mapper

A visual keyboard mapping tool for MacBook that lets you view and edit keyboard shortcut layers. Built with React and Bun.

**Live Demo:** https://tigershen23.github.io/keyboard_shortcut_mapper/

## Features

- **Three Layers**: Base (standard layout), Hyper (app switching), Command (system commands)
- **Visual Keyboard**: 64-key MacBook US ANSI layout with responsive sizing
- **Layer Switching**: Tab/Shift+Tab to cycle, or click layer tabs
- **Ink Ripple Effect**: Visual feedback on key press with layer-colored animations
- **Inline Editor**: Click any key to edit mappings via popover
- **Searchable App Dropdown**: Combobox with 33 app icons
- **Persistent State**: Mappings and selected layer saved to localStorage
- **Copy to Clipboard**: Export mappings as markdown

## Development

```bash
# Install dependencies
bun install

# Run dev server with HMR
bun --hot src/index.ts
# Opens at http://localhost:3000

# Build for production
bun run build
# Output in dist/
```

## Deployment

The app is automatically deployed to GitHub Pages on push to `master` via GitHub Actions.

- Workflow: `.github/workflows/deploy.yml`
- Build: Bun HTML bundler (`bun build ./src/index.html`)
- Static assets: Icons copied to `dist/icons/`

## Tech Stack

- **Runtime**: Bun
- **UI**: React 19 + styled-components
- **Components**: Base UI (headless popover/combobox)
- **Build**: Bun HTML bundler
- **Hosting**: GitHub Pages

## Project Structure

```
src/
├── index.ts            # Bun.serve() dev server
├── index.html          # HTML entry point
├── frontend.tsx        # React app entry
├── components/         # UI components
│   ├── Keyboard.tsx    # Main keyboard grid
│   ├── Key.tsx         # Individual key with ripple effect
│   ├── KeyPopover.tsx  # Edit popover for mappings
│   ├── AppCombobox.tsx # Searchable app selector
│   ├── LayerIndicator.tsx # Layer tabs
│   └── ActionBar.tsx   # Copy/clear actions
├── context/            # React context providers
│   ├── LayerContext.tsx    # Selected layer state
│   └── MappingContext.tsx  # Key mappings state
├── data/               # Static data
│   ├── macbook-layout.ts   # Key positions/sizes
│   ├── default-mappings.ts # Initial mappings
│   └── icon-manifest.ts    # App icon paths
├── hooks/              # Custom hooks
│   └── useKeyboardListener.ts
├── styles/             # Global styles
├── types/              # TypeScript interfaces
├── utils/              # Helpers (storage, markdown export)
└── static/icons/       # App icons (33 PNGs)
```
