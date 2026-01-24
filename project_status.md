# Project Status

**Last Updated:** January 2026

## Current State

The app is fully functional and deployed to GitHub Pages.

**Live:** https://tigershen23.github.io/keyboard_shortcut_mapper/

## Completed Features

| Feature | Status | Notes |
|---------|--------|-------|
| Base keyboard UI | Done | 64-key MacBook US ANSI layout |
| Layer system | Done | Base/Hyper/Command layers with Tab cycling |
| Mapping display | Done | App icons + action labels on keys |
| Local storage | Done | Mappings and layer persist across sessions |
| App icons | Done | 33 PNG icons from macosicons.com |
| Editor UI | Done | Click key → popover with app combobox |
| Copy to clipboard | Done | Exports mappings as markdown |
| GitHub Pages deploy | Done | Auto-deploy on push via Actions |

## Architecture Notes

### State Management
- `LayerContext` - Selected layer (base/hyper/command), persisted to `localStorage`
- `MappingContext` - Key→mapping data, persisted to `localStorage`
- No external state library - just React Context + localStorage

### Key Data Flow
1. `macbook-layout.ts` defines key positions/sizes
2. `default-mappings.ts` provides initial mapping data
3. `MappingContext` loads from localStorage or falls back to defaults
4. `Keyboard` renders keys, `Key` handles press/ripple effects
5. `KeyPopover` allows editing via `AppCombobox`

### Build Pipeline
- Dev: `bun --hot src/index.ts` (Bun.serve with HMR)
- Prod: `bun build ./src/index.html --outdir ./dist --minify`
- Icons copied via `cp -r ./src/static/icons ./dist/icons`
- GitHub Actions deploys `dist/` to Pages

### Icon Paths
Icons use relative paths (`./icons/foo.png`) to work on both:
- Dev server at `localhost:3000/`
- GitHub Pages at `username.github.io/repo/`

## Potential Future Work

- **More icons**: Only 33 apps covered, could add more from macosicons.com
- **Mobile polish**: Works but could use touch-specific improvements
- **Animations**: Smoother layer transitions
- **Import/export**: JSON export for backup/sharing
- **Multiple layouts**: Support for non-MacBook keyboards

## Known Issues

None currently.

## Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Dev server (Bun.serve) |
| `src/frontend.tsx` | React app entry |
| `src/components/Keyboard.tsx` | Main keyboard grid |
| `src/components/Key.tsx` | Individual key with ripple |
| `src/components/KeyPopover.tsx` | Edit popover |
| `src/context/MappingContext.tsx` | Mapping state + persistence |
| `src/data/default-mappings.ts` | Initial key mappings |
| `src/data/macbook-layout.ts` | Key grid layout |
| `src/static/icons/icon-manifest.json` | App icon paths |
| `.github/workflows/deploy.yml` | GitHub Pages deployment |
