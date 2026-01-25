# Human

Here's the current way the app handles icons:

Current Setup

  Icon Storage:
  - Icons stored in src/static/icons/ as PNG files (33 total)
  - Manifest file: src/static/icons/icon-manifest.json tracks available icons
  - TypeScript wrapper: src/data/icon-manifest.ts provides typed access

  Icon Manifest Structure:
  Each icon entry contains:
  - pngPath: Local path to PNG file
  - icnsPath: Local path to ICNS file (macOS icon format)
  - pngUrl: Source URL from macosicons.com
  - icnsUrl: Source URL for ICNS
  - credit: Attribution (optional)

  Available Icons (29 apps):
  - Ghostty, ChatGPT Atlas, Bitwarden, Cursor, Spotify, Rize, Aqua Voice,
  Superhuman, Google Chrome, Anki, Obsidian, WhatsApp, Discord, Safari, Trello,
   zoom.us, QMK Toolbox, Stats, ChatGPT, Raindrop.io, Loom, Amazon Kindle,
  Linear, Windsurf, Conductor, TablePlus, RuneLite, NordVPN, OrbStack

  Fetch Script

  Location: scripts/fetch-icons.ts

  The script automates icon downloading from macosicons.com. Based on the
  manifest structure, it likely:
  1. Reads icon URLs from the manifest
  2. Downloads PNG and ICNS files
  3. Saves them to src/static/icons/
  4. Updates the manifest with local paths

  Missing Icons (21 apps from your most-used list)

  Apps without icons: Streaks, Copilot, Exponent, Claude, Vimcal,
  MonitorControl, League of Legends, Raycast, Homerow, CleanShot X, Slack,
  Granola, Pocket Casts, Handy, Framer, Willow Voice, Google Meet, Clay, Jagex
  Launcher, Telegram, Grok

  Usage in App

  The getIconPath() function in src/data/icon-manifest.ts looks up icons by app
   name and returns the PNG path for rendering in the UI.

Let's do a dump of all of the applications I have installed locally and their icons. We should be able to use `IconUtil` for this, and we want to basically merge where the local icons override the existing ones. Or actually, let's just completely wipe out the previous way we handled icons, including the stuff in the scripts directory. We can always go back to it.

But yeah, we should rebuild everything from scratch using the exact icons and application names that I have locally, and we should just pull in all icons for all applications because we have them all here. The one thing we'll probably want to carry over is the specs for the PNGs. I think they are pretty lightweight, and we want to have similarly lightweight ones that we bring in locally. You might have to do a bit of research for this. 

---

# Agent

## Overview

Replace the existing macosicons.com-based icon system with one that extracts icons directly from locally installed applications. The new system will:

1. Extract PNG icons from apps in `/Applications` and `~/Applications`
2. Use the 100 most recently opened apps (determined via macOS metadata)
3. Compress icons to ~5KB each using pngquant (256-color indexed PNG, 256×256)
4. Simplify the manifest structure to just `{ appName: pngPath }`

## Key Decisions

- **Scope**: Top 100 most recently used apps (via `kMDItemLastUsedDate` metadata)
- **Updates**: Document instructions only, no auto-update mechanism
- **Manifest format**: Simplified to `{ "AppName": "./icons/appname.png" }`
- **Icon specs**: 256×256 PNG, 8-bit colormap (indexed color via pngquant), ~5KB each

## Files to Remove

Delete the entire old icon infrastructure:
- `scripts/fetch-icons.ts` - macosicons.com fetcher
- `scripts/apps_list.md` - old app list (if exists)
- All existing files in `src/static/icons/` (will be regenerated)

## Files to Create/Modify

### 1. New Script: `scripts/extract-local-icons.ts`

A Bun script that:

1. **Gets recently used apps**: Use `mdfind` and `mdls` to query `kMDItemLastUsedDate` from Spotlight metadata for apps in `/Applications` and `~/Applications`

2. **Sorts by recency** and takes top 100

3. **For each app**:
   - Read `Info.plist` using `/usr/libexec/PlistBuddy` to get `CFBundleIconFile` or `CFBundleIconName`
   - Locate the .icns file in `Contents/Resources/`
   - If .icns not found, check for `Assets.car` and use `iconutil` to extract

4. **Extract 256×256 PNG**:
   - Use `sips -s format png -z 256 256 <icns> --out <temp.png>`
   - For Assets.car: `iconutil -c iconset <car> <iconname> -o <tempdir>` then grab `icon_128x128@2x.png` (which is 256×256)

5. **Compress with pngquant**:
   - Run `pngquant 256 <input.png> --output <final.png>`
   - This produces ~5-7KB indexed PNGs matching current quality

6. **Generate manifest**:
   - Output simplified JSON: `{ "AppName": "./icons/appname.png" }`
   - Write to `src/static/icons/icon-manifest.json`

**Script structure** (pseudocode):

```
- getRecentApps(): string[]
  → mdfind + mdls to get apps sorted by kMDItemLastUsedDate
  → return top 100 app paths

- getIconPath(appPath): string | null
  → read Info.plist for CFBundleIconFile
  → return full path to .icns or null

- extractIcon(icnsPath, appName): boolean
  → tempFile = scratchpad/temp.png
  → sips -s format png -z 256 256 icnsPath --out tempFile
  → pngquant 256 tempFile --output finalPath
  → return success

- extractFromAssetsCar(appPath, iconName, appName): boolean
  → iconutil -c iconset Assets.car iconName -o tempdir
  → copy icon_128x128@2x.png (the 256×256 version)
  → pngquant compress
  → return success

- main():
  → clear icons directory
  → apps = getRecentApps()
  → manifest = {}
  → for app in apps:
      → sanitizedName = lowercase, replace non-alphanum with dash
      → if extractIcon(app) succeeds:
          → manifest[appName] = "./icons/{sanitizedName}.png"
  → write manifest to icon-manifest.json
```

**Dependencies**: Relies on macOS tools available on the system:
- `mdfind`, `mdls` - Spotlight metadata queries
- `/usr/libexec/PlistBuddy` - plist reading
- `sips` - image processing
- `iconutil` - icns/iconset conversion
- `pngquant` - PNG compression (already installed via Homebrew)

### 2. Modify: `src/data/icon-manifest.ts`

Simplify the interface and helper:

```typescript
// Before: Complex structure with pngUrl, icnsUrl, credit, etc.
// After: Simple mapping

import manifestData from "../static/icons/icon-manifest.json";

// Simplified: just appName → pngPath
export type IconManifest = Record<string, string>;

export const iconManifest: IconManifest = manifestData as IconManifest;

export function getIconPath(appName: string): string | null {
  return iconManifest[appName] ?? null;
}
```

### 3. Update: `src/static/icons/icon-manifest.json`

Will be regenerated by the script. New format:

```json
{
  "Cursor": "./icons/cursor.png",
  "Ghostty": "./icons/ghostty.png",
  "Claude": "./icons/claude.png",
  ...
}
```

### 4. Documentation Update

Create a note at the top of the script explaining:
- How to re-run the script when you install new apps
- Requirements (pngquant via Homebrew)
- The 100-app limit and how it's determined

## Migration Considerations

### Existing Mappings in localStorage

Users who have saved mappings will have `appName` fields like "Spotify" or "Claude". As long as:
1. The app names in the new manifest match the existing app names
2. The icon paths resolve correctly

...existing mappings will continue to work. The app names come from the `.app` bundle name (e.g., "Spotify.app" → "Spotify"), which should match what users selected previously.

**Potential issue**: If an app was renamed or the user typed a custom name that doesn't match the bundle name, that mapping's icon won't resolve. This is acceptable - the mapping still works, just without an icon.

### Icon Path Format

Current: `./icons/spotify.png`
New: Same format, `./icons/spotify.png`

The paths are relative to the HTML file and will work the same way.

## Implementation Order

1. Create `scripts/extract-local-icons.ts`
2. Run it to generate new icons and manifest
3. Simplify `src/data/icon-manifest.ts`
4. Remove old script (`scripts/fetch-icons.ts`)
5. Verify the app works with new icons

---

# Implementation

## What Was Built

1. **New script: `scripts/extract-local-icons.ts`**
   - Checks for pngquant at runtime with graceful error message if missing
   - Uses mdfind/mdls to find top 100 most recently used apps
   - Extracts icons from .icns files using sips (resize to 256x256)
   - Falls back to actool for Assets.car extraction
   - Compresses with pngquant (256 colors) for ~5-15KB files
   - Generates simplified manifest

2. **Simplified `src/data/icon-manifest.ts`**
   - Removed complex IconEntry interface
   - Now just `Record<string, string>` (appName → pngPath)
   - Simplified getIconPath() to direct lookup

3. **New manifest format**
   - Human-readable app names as keys (e.g., "CleanShot X")
   - Sanitized filenames (e.g., "./icons/cleanshot-x.png")

## Decisions Made

- **Icon path format**: Kept `./icons/appname.png` relative format (matches existing)
- **App names**: Used human-readable display names from CFBundleDisplayName/CFBundleName as keys for UI display, sanitized names only for filenames
- **WhatsApp fix**: Manually removed hidden zero-width character from manifest key

## Results

- **Extracted**: 99 icons (98 unique files due to duplicate Grok entry)
- **Skipped**: 1 (Anki - no icon found in bundle)
- **Total size**: 1.3MB (~13KB average per icon)
- **Build**: Production build succeeds

## Files Removed

- `scripts/fetch-icons.ts` - Old macosicons.com fetcher
- `scripts/apps_list.md` - Old app list

## Deviations from Plan

- Added try/catch for rm commands to handle empty directories gracefully
- WhatsApp had a hidden Unicode character (U+200E left-to-right mark) in its bundle name that was manually cleaned from the manifest
