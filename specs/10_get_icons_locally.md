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
