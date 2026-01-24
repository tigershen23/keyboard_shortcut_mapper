import { $ } from "bun";
import { parseArgs } from "util";

const API_URL = "https://api.macosicons.com/api/v1/search";
const API_KEY = process.env.MACOSICONS_API_KEY;
const ICONS_DIR = "./src/static/icons";
const MANIFEST_PATH = "./src/static/icons/icon-manifest.json";
const APPS_LIST_PATH = "./scripts/apps_list.md";

interface IconHit {
  appName: string;
  lowResPngUrl: string;
  icnsUrl: string;
  downloads: number;
  credit: string;
  creditUrl?: string;
}

interface IconManifestEntry {
  pngPath: string;
  icnsPath: string;
  pngUrl: string;
  icnsUrl: string;
  credit: string;
  creditUrl?: string;
}

interface IconManifest {
  [appName: string]: IconManifestEntry;
}

async function getAppsFromList(): Promise<string[]> {
  const file = Bun.file(APPS_LIST_PATH);
  const content = await file.text();

  // Parse markdown list: "1. App Name" format
  const apps = content
    .split("\n")
    .filter((line) => /^\d+\.\s+/.test(line))
    .map((line) => line.replace(/^\d+\.\s+/, "").trim());

  return apps;
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
    (h: IconHit) => h.appName.toLowerCase() === appName.toLowerCase(),
  );

  return exactMatch ?? data.hits[0];
}

async function downloadFile(url: string, filepath: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`  Download failed (${response.status}): ${url}`);
      return false;
    }

    const buffer = await response.arrayBuffer();
    await Bun.write(filepath, buffer);
    return true;
  } catch (error) {
    console.error(`  Download error for ${filepath}:`, error);
    return false;
  }
}

function sanitizeFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "-");
}

async function loadExistingManifest(): Promise<IconManifest> {
  const file = Bun.file(MANIFEST_PATH);
  if (await file.exists()) {
    return await file.json();
  }
  return {};
}

async function main() {
  const { values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      limit: {
        type: "string",
        short: "l",
      },
    },
  });

  const limit = values.limit ? parseInt(values.limit, 10) : undefined;

  if (!API_KEY) {
    console.error("Error: MACOSICONS_API_KEY environment variable not set");
    process.exit(1);
  }

  // Ensure icons directory exists
  await $`mkdir -p ${ICONS_DIR}`;

  let apps = await getAppsFromList();
  console.log(`Found ${apps.length} apps in list`);

  if (limit) {
    apps = apps.slice(0, limit);
    console.log(`Limiting to first ${limit} app(s)`);
  }

  const manifest = await loadExistingManifest();
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const appName of apps) {
    const sanitized = sanitizeFilename(appName);
    const pngFilename = `${sanitized}.png`;
    const icnsFilename = `${sanitized}.icns`;
    const pngPath = `${ICONS_DIR}/${pngFilename}`;
    const icnsPath = `${ICONS_DIR}/${icnsFilename}`;

    // Skip if both files already exist
    const pngExists = await Bun.file(pngPath).exists();
    const icnsExists = await Bun.file(icnsPath).exists();

    if (pngExists && icnsExists) {
      console.log(`⏭️  ${appName}: Already downloaded, skipping`);
      skipCount++;
      continue;
    }

    console.log(`🔍 ${appName}: Searching...`);

    const hit = await searchIcon(appName);

    if (!hit) {
      console.log(`   ❌ No icon found`);
      failCount++;
      continue;
    }

    console.log(`   Found: "${hit.appName}" by ${hit.credit}`);

    // Download PNG
    let pngSuccess = pngExists;
    if (!pngExists) {
      console.log(`   Downloading PNG...`);
      pngSuccess = await downloadFile(hit.lowResPngUrl, pngPath);
    }

    // Download ICNS
    let icnsSuccess = icnsExists;
    if (!icnsExists) {
      console.log(`   Downloading ICNS...`);
      icnsSuccess = await downloadFile(hit.icnsUrl, icnsPath);
    }

    if (pngSuccess && icnsSuccess) {
      console.log(`   ✅ Complete`);
      manifest[appName] = {
        pngPath: `/icons/${pngFilename}`,
        icnsPath: `/icons/${icnsFilename}`,
        pngUrl: hit.lowResPngUrl,
        icnsUrl: hit.icnsUrl,
        credit: hit.credit,
        creditUrl: hit.creditUrl,
      };
      successCount++;
    } else {
      console.log(`   ❌ Partial failure`);
      failCount++;
    }

    // Rate limiting: small delay between requests
    await Bun.sleep(200);
  }

  // Write manifest
  await Bun.write(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`\n========== Complete ==========`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`⏭️  Skipped: ${skipCount}`);
  console.log(`❌ Failed:  ${failCount}`);
  console.log(`📄 Manifest: ${MANIFEST_PATH}`);
}

main();
