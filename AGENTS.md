# Keyboard Shortcut Mapper

A visual keyboard mapping tool for MacBook that displays and edits keyboard shortcut layers. Built with React and Bun.

**Live:** https://tigershen23.github.io/keyboard_shortcut_mapper/

## Project Overview

This is a fully functional React app deployed to GitHub Pages. It renders a 64-key MacBook US ANSI keyboard layout with three layers (Base, Hyper, Command) and lets users click keys to assign app shortcuts via a searchable combobox.

### Key Features

- Three keyboard layers with Tab/Shift+Tab cycling
- Inline key editing via popover with app icon dropdown
- Mappings and selected layer persisted to localStorage
- Ink ripple animation on key press
- Copy mappings to clipboard as markdown

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

### Manual Commands

```bash
# Install dependencies
bun install

# Run dev server directly (with HMR)
bun --hot src/index.ts

# Build for production
bun run build
```

Dev server runs at http://localhost:3000

### Testing

```bash
# Unit tests
bun test
mise test

# E2E tests (requires dev server running via PM2)
mise test:e2e
bun run test:e2e
```

E2E tests use Playwright with Chromium. The dev server must be running at http://localhost:3000 before running E2E tests. Tests are located in `tests/e2e/`.

### Code Quality

**Always use mise commands for code quality checks.** The project uses three high-performance tools:

- **oxlint** - Linter (50-100x faster than ESLint)
- **oxfmt** - Formatter (30x faster than Prettier)
- **tsgo** - TypeScript type checker (10x faster than tsc)

```bash
# Run all read-only checks - ALWAYS run before commits
mise check

# Apply all auto-fixes
mise fix

# Individual tools
mise typecheck    # Type checking with tsgo (read-only)
mise lint         # Linting with oxlint (read-only)
mise format       # Format files with oxfmt (applies changes)
mise format:check # Check formatting without changes (read-only)
mise lint:fix     # Fix lint issues (uses --fix-dangerously, applies changes)
```

#### Targeting Specific Paths

All lint and format commands accept an optional path argument to target specific files or directories. If omitted, they default to `src/`.

```bash
# Lint a specific directory
mise lint src/components/
mise lint src/context/

# Lint a specific file
mise lint src/components/Key.tsx

# Format specific paths
mise format src/hooks/
mise format src/utils/storage.ts

# Check formatting on specific paths
mise format:check src/data/

# Auto-fix lint issues in a directory
mise lint:fix src/components/
```

Note: `mise typecheck` and `mise check` run project-wide and don't accept path arguments.

#### Using bun run

The same path argument pattern works with `bun run`:

```bash
bun run lint                        # Defaults to src/
bun run lint src/components/        # Lint specific directory
bun run format src/components/Key.tsx  # Format a single file
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

## Project Structure

```
src/
├── index.ts            # Bun.serve() dev server
├── index.html          # HTML entry point
├── frontend.tsx        # React app entry
├── components/         # UI components (Keyboard, Key, KeyPopover, etc.)
├── context/            # React context (LayerContext, MappingContext)
├── data/               # Static data (layout, mappings, icons)
├── hooks/              # Custom hooks
├── styles/             # Global styles
├── types/              # TypeScript interfaces
├── utils/              # Helpers (storage, markdown export)
└── static/icons/       # App icons (33 PNGs)
tests/
└── e2e/                # Playwright E2E tests
    └── critical-path.spec.ts
```

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
| `.github/workflows/deploy.yml` | GitHub Pages deployment |
| `ecosystem.config.cjs` | PM2 process configuration |
| `playwright.config.ts` | Playwright E2E test configuration |
| `tests/e2e/critical-path.spec.ts` | E2E test covering critical user journey |

## Conventions

- When writing plans, use prose and instructions rather than code blocks
- Code should be written during the coding step, not the planning step

## Imported Rules

@.claude/rules/bun.md
