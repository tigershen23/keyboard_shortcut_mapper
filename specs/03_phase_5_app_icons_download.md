# Phase 5: App Icons Download Script

## Objective

Create a one-off script that fetches macOS app icons from macosicons.com for all installed applications, storing them locally for use in the keyboard mapper UI.

---

## Prerequisites

- macosicons.com API key (set as `MACOSICONS_API_KEY` environment variable)
- Bun runtime

---

## API Reference

### Endpoint

```
POST https://api.macosicons.com/api/v1/search
```

### Headers

```
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

### Request Body

```json
{
  "query": "Messages"
}
```

### Response

```json
{
  "hits": [
    {
      "appName": "Messages",
      "lowResPngUrl": "https://...",
      "icnsUrl": "https://...",
      "iOSUrl": "https://...",
      "category": "Social",
      "credit": "Artist Name",
      "creditUrl": "https://...",
      "downloads": 1234
    }
  ],
  "query": "Messages",
  "totalHits": 15,
  "limit": 10,
  "offset": 0,
  "page": 1,
  "totalPages": 2
}
```

### Rate Limits

- Free tier: 50 requests/month
- Paid tier: 1000 requests/month for €4.99

---

## Script Design

### `scripts/fetch-icons.ts`

```typescript
import { $ } from "bun";

const API_URL = "https://api.macosicons.com/api/v1/search";
const API_KEY = process.env.MACOSICONS_API_KEY;
const ICONS_DIR = "./public/icons";
const MANIFEST_PATH = "./src/data/icon-manifest.json";

interface IconHit {
  appName: string;
  lowResPngUrl: string;
  icnsUrl: string;
  downloads: number;
  credit: string;
  creditUrl?: string;
}

interface IconManifest {
  [appName: string]: {
    iconPath: string;
    credit: string;
    creditUrl?: string;
  };
}

async function getInstalledApps(): Promise<string[]> {
  const dirs = ["/Applications", `${process.env.HOME}/Applications`, "/System/Applications"];
  const apps: string[] = [];

  for (const dir of dirs) {
    try {
      const result = await $`ls ${dir}`.text();
      const appNames = result
        .split("\n")
        .filter((name) => name.endsWith(".app"))
        .map((name) => name.replace(".app", ""));
      apps.push(...appNames);
    } catch {
      // Directory doesn't exist, skip
    }
  }

  return [...new Set(apps)].sort();
}

async function searchIcon(appName: string): Promise<IconHit | null> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY!,
    },
    body: JSON.stringify({ query: appName }),
  });

  if (!response.ok) {
    console.error(`API error for "${appName}": ${response.status}`);
    return null;
  }

  const data = await response.json();

  if (!data.hits || data.hits.length === 0) {
    return null;
  }

  // Find best match: exact name match preferred, then highest downloads
  const exactMatch = data.hits.find(
    (h: IconHit) => h.appName.toLowerCase() === appName.toLowerCase()
  );

  return exactMatch ?? data.hits[0];
}

async function downloadIcon(url: string, filename: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) return false;

    const buffer = await response.arrayBuffer();
    await Bun.write(`${ICONS_DIR}/${filename}`, buffer);
    return true;
  } catch (error) {
    console.error(`Download failed for ${filename}:`, error);
    return false;
  }
}

function sanitizeFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "-");
}

async function main() {
  if (!API_KEY) {
    console.error("Error: MACOSICONS_API_KEY environment variable not set");
    process.exit(1);
  }

  // Ensure icons directory exists
  await $`mkdir -p ${ICONS_DIR}`;

  const apps = await getInstalledApps();
  console.log(`Found ${apps.length} installed apps`);

  const manifest: IconManifest = {};
  let successCount = 0;
  let failCount = 0;

  for (const appName of apps) {
    console.log(`Searching: ${appName}...`);

    const hit = await searchIcon(appName);

    if (!hit) {
      console.log(`  ❌ No icon found`);
      failCount++;
      continue;
    }

    const filename = `${sanitizeFilename(appName)}.png`;
    const iconUrl = hit.lowResPngUrl; // Use lowRes for smaller file size

    const success = await downloadIcon(iconUrl, filename);

    if (success) {
      console.log(`  ✅ Downloaded: ${filename}`);
      manifest[appName] = {
        iconPath: `/icons/${filename}`,
        credit: hit.credit,
        creditUrl: hit.creditUrl,
      };
      successCount++;
    } else {
      console.log(`  ❌ Download failed`);
      failCount++;
    }

    // Rate limiting: small delay between requests
    await Bun.sleep(200);
  }

  // Write manifest
  await Bun.write(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`\nComplete!`);
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log(`  📄 Manifest: ${MANIFEST_PATH}`);
}

main();
```

---

## Output Structure

### Icons Directory

```
public/icons/
├── messages.png
├── safari.png
├── finder.png
├── terminal.png
├── visual-studio-code.png
└── ... (one per app)
```

### Manifest File

`src/data/icon-manifest.json`:

```json
{
  "Messages": {
    "iconPath": "/icons/messages.png",
    "credit": "Elías",
    "creditUrl": "https://..."
  },
  "Safari": {
    "iconPath": "/icons/safari.png",
    "credit": "Apple",
    "creditUrl": null
  }
}
```

---

## Usage

```bash
# Set API key and run
MACOSICONS_API_KEY=c7cb464ff7623480f5e1400eeeca5f4e6961c17c6e444c6a50dceb9381a441ac bun run scripts/fetch-icons.ts

# Or export first
export MACOSICONS_API_KEY=c7cb464ff7623480f5e1400eeeca5f4e6961c17c6e444c6a50dceb9381a441ac
bun run scripts/fetch-icons.ts
```

---

## Integration with App

### Icon Lookup Hook

```typescript
// src/hooks/useAppIcon.ts
import iconManifest from "../data/icon-manifest.json";

export function useAppIcon(appName: string): string | null {
  const entry = iconManifest[appName];
  return entry?.iconPath ?? null;
}
```

### In Key Component

```typescript
// src/components/Key.tsx
import { useAppIcon } from "../hooks/useAppIcon";

function Key({ definition, mapping }: KeyProps) {
  const iconPath = mapping?.appName ? useAppIcon(mapping.appName) : null;

  return (
    <div className="key">
      {iconPath && <img src={iconPath} alt="" className="key-icon" />}
      <span className="key-label">{mapping?.action ?? definition.label}</span>
    </div>
  );
}
```

---

## Error Handling

### Common Issues

| Issue | Handling |
|-------|----------|
| No API key | Exit with clear error message |
| API rate limit | Script includes 200ms delay; for 50 requests, batch in multiple runs |
| App not found | Log and continue; manifest only includes successful fetches |
| Download failure | Log and continue; retry logic optional |
| Duplicate apps | Use Set to deduplicate before processing |

### Partial Runs

If rate limited mid-run:
1. Check which icons already exist in `public/icons/`
2. Modify script to skip already-downloaded icons
3. Resume from where you left off

Add to script:

```typescript
// Skip if already downloaded
const existingFile = Bun.file(`${ICONS_DIR}/${filename}`);
if (await existingFile.exists()) {
  console.log(`  ⏭️ Already exists, skipping`);
  // Still add to manifest from existing
  continue;
}
```

---

## Rate Limit Strategy

With 138 apps and 50 free requests/month:

**Option A: Prioritize**
1. Create list of apps you actually use for shortcuts (~20-30)
2. Fetch those first
3. Remaining apps can use fallback (initial letter, generic icon)

**Option B: Batch over time**
1. Run script for first 45 apps
2. Wait until next billing cycle
3. Run for next 45
4. Repeat

**Option C: Upgrade**
1. Pay €4.99 for 1000 requests
2. Fetch all 138 apps in one run
3. Have headroom for future additions

---

## Fallback for Missing Icons

When an app has no icon in the manifest:

```typescript
function getIconOrFallback(appName: string): React.ReactNode {
  const iconPath = useAppIcon(appName);

  if (iconPath) {
    return <img src={iconPath} alt="" className="key-icon" />;
  }

  // Fallback: first letter in a colored circle
  const initial = appName.charAt(0).toUpperCase();
  const hue = hashStringToHue(appName); // Consistent color per app

  return (
    <div className="key-icon-fallback" style={{ backgroundColor: `hsl(${hue}, 60%, 50%)` }}>
      {initial}
    </div>
  );
}

function hashStringToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}
```

---

## Acceptance Criteria

- [ ] Script runs with `bun run scripts/fetch-icons.ts`
- [ ] Reads API key from environment variable
- [ ] Discovers all installed apps from standard locations
- [ ] Fetches icons from macosicons.com API
- [ ] Downloads PNG files to `public/icons/`
- [ ] Generates `icon-manifest.json` with paths and credits
- [ ] Handles missing icons gracefully (logs, continues)
- [ ] Includes rate limiting delay
- [ ] Skips already-downloaded icons on re-run

---
