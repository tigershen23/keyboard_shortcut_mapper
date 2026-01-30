# Human

The task is to reduce the number of problems in the codebase to 9 (typecheck, lint, format) by getting oxfmt, oxlint, and tsgo all working. For now, please just set up these tools canonically with bun tasks and mise tasks for mise check to do all three, then sub-tasks for mise lint, mise typecheck, mise format, then update CLAUDE.md and AGENTS.md to reflect the new tooling and emphasize the mise commands should always always be used. Since these are all fairly modern tools please look up their docs first to see how they work and be super confident in your ability to set them up and use them. Don't actually start fixing things yet just make sure these all are set up and run. Then finally in # Implementation once you're done implementing give me instructions to configure my VSCode to integrate with all of these tools correctly.

---

# Agent

## Research Summary

All three tools are modern, high-performance alternatives to their predecessors:

- **oxfmt** (v0.27.0) - Prettier-compatible formatter, ~30x faster than Prettier. Part of the Oxc compiler stack. Config via `.oxfmtrc.json`.
- **oxlint** (v1.42.0) - ESLint replacement, 50-100x faster. 655+ rules. Config via `.oxlintrc.json`.
- **tsgo** (v7.0.0-dev) - Native TypeScript compiler from `@typescript/native-preview`, ~10x faster than tsc. Uses existing `tsconfig.json`.

Current state after installing packages:
- oxlint: 0 warnings, 0 errors on src/
- oxfmt: 9 files need formatting
- tsgo: Many TypeScript errors (mostly styled-components types and module resolution)

## Implementation Plan

### 1. Remove Biome

Delete Biome from package.json since oxfmt+oxlint fully replace it.

### 2. Update package.json Scripts

Replace Biome scripts with new tooling. Scripts will be the source of truth; mise will call these.

```json
"scripts": {
  "lint": "oxlint src/",
  "lint:fix": "oxlint --fix-dangerously src/",
  "format": "oxfmt src/",
  "format:check": "oxfmt --check src/",
  "typecheck": "tsgo --noEmit",
  "check": "bun run typecheck && bun run lint && bun run format:check",
  "build": "bun build ./src/index.html --outdir ./dist --minify && cp -r ./src/static/icons ./dist/icons"
}
```

Notes:
- Using `--fix-dangerously` for lint:fix per user request for unsafe flags
- oxfmt defaults to `--write` behavior (like cargo fmt), so `bun run format` writes files
- `check` runs all three: typecheck first (most likely to have issues), then lint, then format

### 3. Create mise.toml

Create `mise.toml` at project root with tasks that delegate to bun scripts. Using the `depends` pattern for `check` won't work for "run all, report all" behavior, so we'll use a shell script that captures exit codes.

```toml
[tasks.lint]
description = "Run oxlint"
run = "bun run lint"

[tasks."lint:fix"]
description = "Run oxlint with auto-fix"
run = "bun run lint:fix"

[tasks.format]
description = "Run oxfmt to format files"
run = "bun run format"

[tasks."format:check"]
description = "Check formatting without changes"
run = "bun run format:check"

[tasks.typecheck]
description = "Run tsgo type checking"
run = "bun run typecheck"

[tasks.check]
description = "Run all checks (typecheck, lint, format)"
run = '''
#!/bin/bash
exit_code=0
echo "=== TypeCheck ===" && bun run typecheck || exit_code=1
echo ""
echo "=== Lint ===" && bun run lint || exit_code=1
echo ""
echo "=== Format Check ===" && bun run format:check || exit_code=1
exit $exit_code
'''
```

The `check` task runs all three tools regardless of individual failures, then exits with failure if any failed.

### 4. Create Configuration Files

**.oxlintrc.json** - Enable React and TypeScript plugins since this is a React/TS project:

```json
{
  "plugins": ["react", "typescript"],
  "rules": {}
}
```

**.oxfmtrc.json** - Match Prettier defaults to avoid large diffs:

```json
{
  "printWidth": 80
}
```

### 5. Update CLAUDE.md

Add a new "Code Quality" section after "Development" that emphasizes:
- Always use `mise check` before commits
- `mise lint`, `mise format`, `mise typecheck` for individual tools
- Brief explanation of the three tools

### 6. Update AGENTS.md

Similar update - add "Code Quality" section. Since CLAUDE.md and AGENTS.md are currently identical, update both with the same content.

### 7. Implementation Section

After implementation, add VSCode configuration instructions:
- Install "Oxc" extension for oxlint integration
- Install "TypeScript Native Preview" extension for tsgo
- Configure oxfmt as default formatter (or continue using Prettier extension with oxfmt CLI for format-on-save via tasks)

## Files to Create/Modify

| File | Action |
|------|--------|
| `package.json` | Remove Biome, update scripts |
| `mise.toml` | Create with task definitions |
| `.oxlintrc.json` | Create with React/TS plugins |
| `.oxfmtrc.json` | Create with printWidth: 80 |
| `CLAUDE.md` | Add Code Quality section |
| `AGENTS.md` | Add Code Quality section |
| `biome.json` | Delete if exists |

## Verification Steps

After implementation, run:
1. `mise check` - Should run all three tools and report issues
2. `mise lint` - Should run oxlint
3. `mise format` - Should format files
4. `mise typecheck` - Should run tsgo

---

# Implementation

## Completed

All tooling is set up and working:

- **mise lint** - oxlint with `--type-aware` for type-informed rules via `oxlint-tsgolint`
- **mise typecheck** - tsgo type checking
- **mise format** - oxfmt formatting (writes files)
- **mise format:check** - oxfmt check (reports only)
- **mise check** - Runs typecheck, lint:fix, and format (auto-fixes issues)

## VSCode Setup

The `.vscode/settings.json` is already configured:
```json
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "oxc.typeAware": true
}
```

### Install Extensions

1. **Oxc** (`oxc.oxc-vscode`) - Provides oxlint + oxfmt integration with type-aware linting
2. **TypeScript Native Preview** - (optional) For tsgo in editor

### Enable TypeScript Native Preview (optional)

1. Open Command Palette (Cmd+Shift+P)
2. Run: "TypeScript Native Preview: Enable (Experimental)"

### Notes

- `oxc.typeAware: true` enables type-aware linting in the editor (requires `oxlint-tsgolint` package)
- The Oxc extension reads `.oxlintrc.json` automatically
- oxfmt reads `.oxfmtrc.json` automatically (printWidth: 120)
- tsgo uses the existing `tsconfig.json`
