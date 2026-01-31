# Keyboard Shortcut Mapper

A visual keyboard mapping tool for MacBook that displays and edits keyboard shortcut layers. Built with React and Bun.

**Live:** https://tigershen23.github.io/keyboard_shortcut_mapper/

### Key Features

- Three keyboard layers with Tab/Shift+Tab cycling
- Inline key editing via popover with app icon dropdown
- Mappings and selected layer persisted to localStorage

## Development

### Dev Server (PM2-managed)

The dev server runs under PM2 as, separately so you don't need to manage it as a bash `keyboard_shortcut_mapper`:

```bash
# View logs
pm2 logs keyboard_shortcut_mapper

# Restart server
pm2 restart keyboard_shortcut_mapper

# Check status
pm2 describe keyboard_shortcut_mapper
```

Logs are stored in `~/.pm2/logs/`.

### Testing

```bash
# E2E sanity check test (requires dev server running via PM2)
mise test:e2e
# Quick healthcheck (~1.3s) - use frequently during development
mise healthcheck

```

### Code Quality

**Checks run automatically.** mise format, lint, and typecheck are executed automatically after file edits via agent hooks. You should never need to run these commands manually during normal development. The commands are still listed below for your reference

```bash
# Run all checks (typecheck, lint, format)
mise check

# Individual tools
mise typecheck    # Type checking with tsgo
mise lint:fix     # Linting with oxlint
mise format       # Format files with oxfmt
```

## Architecture

### State Management

- `LayerContext` - Selected layer (base/hyper/command), persisted to localStorage
- `MappingContext` - Key→mapping data, persisted to localStorage
- No external state library - React Context + localStorage

### Data Flow

1. `src/data/macbook-layout.ts` - Key positions/sizes
2. `src/data/default-mappings.ts` - Initial mapping data
3. `MappingContext` loads from localStorage or falls back to defaults
4. `Keyboard` component renders keys
5. `KeyPopover` allows editing via `AppCombobox`

### Build Pipeline

- **Dev:** `bun --hot src/index.ts` (Bun.serve with HMR)
- **Prod:** `bun build ./src/index.html --outdir ./dist --minify`
- **Deploy:** GitHub Actions on push to master → GitHub Pages

## Key Files

| File                              | Purpose                                 |
| --------------------------------- | --------------------------------------- |
| `src/index.ts`                    | Dev server (Bun.serve)                  |
| `src/frontend.tsx`                | React app entry                         |
| `src/components/Keyboard.tsx`     | Main keyboard grid                      |
| `src/components/Key.tsx`          | Individual key with ripple              |
| `src/components/KeyPopover.tsx`   | Edit popover                            |
| `src/context/MappingContext.tsx`  | Mapping state + persistence             |
| `src/data/default-mappings.ts`    | Initial key mappings                    |
| `ecosystem.config.cjs`            | PM2 process configuration               |
| `tests/e2e/critical-path.spec.ts` | E2E test covering critical user journey |

## Conventions

- When writing plans, use prose and instructions rather than code blocks
- Code should be written during the coding step, not the planning step

## Imported Rules

@.claude/rules/bun.md
