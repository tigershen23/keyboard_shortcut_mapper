/**
 * Extract icons from locally installed macOS applications
 *
 * This script extracts PNG icons from apps in /Applications and ~/Applications,
 * sorted by most recently used (top 100). Icons are compressed to ~5KB each.
 *
 * Requirements:
 *   - pngquant (brew install pngquant)
 *   - Xcode Command Line Tools (for actool, used for Assets.car extraction)
 *
 * Usage:
 *   bun scripts/extract-local-icons.ts
 *
 * To refresh icons after installing new apps, simply re-run this script.
 */

import { $ } from "bun";

const ICONS_DIR = "./src/static/icons";
const MANIFEST_PATH = "./src/static/icons/icon-manifest.json";
const TEMP_DIR = "/tmp/icon-extract";
const MAX_APPS = 100;

interface AppInfo {
  path: string;
  name: string;
  lastUsed: Date;
}

/**
 * Check if required dependencies are available
 */
async function checkDependencies(): Promise<boolean> {
  // Check pngquant
  try {
    await $`which pngquant`.quiet();
  } catch {
    console.error("Error: pngquant is not installed.");
    console.error("Install it with: brew install pngquant");
    return false;
  }

  // Check sips (should always be available on macOS)
  try {
    await $`which sips`.quiet();
  } catch {
    console.error("Error: sips is not available (required macOS tool)");
    return false;
  }

  return true;
}

/**
 * Sanitize app name to create a valid filename
 */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Get the display name for an app (from Info.plist or bundle name)
 */
async function getAppDisplayName(appPath: string): Promise<string> {
  // Try to get CFBundleDisplayName first, then CFBundleName
  try {
    const result =
      await $`/usr/libexec/PlistBuddy -c "Print :CFBundleDisplayName" "${appPath}/Contents/Info.plist" 2>/dev/null`.text();
    const name = result.trim();
    if (name) return name;
  } catch {
    // Fall through to next attempt
  }

  try {
    const result =
      await $`/usr/libexec/PlistBuddy -c "Print :CFBundleName" "${appPath}/Contents/Info.plist" 2>/dev/null`.text();
    const name = result.trim();
    if (name) return name;
  } catch {
    // Fall through to bundle name
  }

  // Fall back to bundle name (remove .app extension)
  const bundleName = appPath.split("/").pop() || "";
  return bundleName.replace(/\.app$/, "");
}

/**
 * Get recently used apps sorted by last used date
 */
async function getRecentApps(): Promise<AppInfo[]> {
  const apps: AppInfo[] = [];

  // Find all .app bundles in /Applications and ~/Applications
  const appDirs = ["/Applications", `${process.env.HOME}/Applications`];

  for (const dir of appDirs) {
    try {
      // Use mdfind to get apps with their last used date
      const result =
        await $`mdfind -onlyin "${dir}" "kMDItemContentType == 'com.apple.application-bundle'" 2>/dev/null`.text();
      const appPaths = result.trim().split("\n").filter(Boolean);

      for (const appPath of appPaths) {
        try {
          // Get last used date
          const mdlsResult =
            await $`mdls -name kMDItemLastUsedDate -raw "${appPath}" 2>/dev/null`.text();

          let lastUsed = new Date(0); // Default to epoch if no date
          if (mdlsResult && mdlsResult !== "(null)") {
            lastUsed = new Date(mdlsResult.trim());
          }

          const name = await getAppDisplayName(appPath);

          apps.push({
            path: appPath,
            name,
            lastUsed,
          });
        } catch {
          // Skip apps we can't get metadata for
        }
      }
    } catch {
      // Directory doesn't exist or mdfind failed
    }
  }

  // Sort by last used date (most recent first) and take top N
  apps.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());
  return apps.slice(0, MAX_APPS);
}

/**
 * Get the icon file path from an app's Info.plist
 */
async function getIconFilePath(appPath: string): Promise<string | null> {
  const resourcesDir = `${appPath}/Contents/Resources`;

  // Try CFBundleIconFile first
  try {
    const result =
      await $`/usr/libexec/PlistBuddy -c "Print :CFBundleIconFile" "${appPath}/Contents/Info.plist" 2>/dev/null`.text();
    let iconFile = result.trim();
    if (iconFile) {
      // Add .icns extension if not present
      if (!iconFile.endsWith(".icns")) {
        iconFile += ".icns";
      }
      const fullPath = `${resourcesDir}/${iconFile}`;
      const file = Bun.file(fullPath);
      if (await file.exists()) {
        return fullPath;
      }
    }
  } catch {
    // Fall through
  }

  // Try CFBundleIconName (for Asset Catalog icons)
  try {
    const result =
      await $`/usr/libexec/PlistBuddy -c "Print :CFBundleIconName" "${appPath}/Contents/Info.plist" 2>/dev/null`.text();
    const iconName = result.trim();
    if (iconName) {
      // Check for Assets.car
      const assetsPath = `${resourcesDir}/Assets.car`;
      const file = Bun.file(assetsPath);
      if (await file.exists()) {
        return `asset:${assetsPath}:${iconName}`;
      }
    }
  } catch {
    // Fall through
  }

  // Look for any .icns file in Resources
  try {
    const result = await $`ls "${resourcesDir}"/*.icns 2>/dev/null`.text();
    const files = result.trim().split("\n").filter(Boolean);
    if (files.length > 0) {
      // Prefer AppIcon.icns or the first one
      const appIcon = files.find(
        (f) =>
          f.toLowerCase().includes("appicon") ||
          f.toLowerCase().includes("icon"),
      );
      return appIcon || files[0];
    }
  } catch {
    // No .icns files found
  }

  return null;
}

/**
 * Extract icon from .icns file using sips
 */
async function extractFromIcns(
  icnsPath: string,
  outputPath: string,
): Promise<boolean> {
  const tempPng = `${TEMP_DIR}/temp_${Date.now()}.png`;

  try {
    // Convert to PNG and resize to 256x256
    await $`sips -s format png -z 256 256 "${icnsPath}" --out "${tempPng}" 2>/dev/null`.quiet();

    // Compress with pngquant (256 colors for ~5KB files)
    await $`pngquant 256 "${tempPng}" --output "${outputPath}" --force 2>/dev/null`.quiet();

    // Clean up temp file
    await $`rm -f "${tempPng}"`.quiet();

    return true;
  } catch {
    // Try without resize if the icns doesn't have 256x256
    try {
      await $`sips -s format png "${icnsPath}" --out "${tempPng}" 2>/dev/null`.quiet();
      await $`sips -z 256 256 "${tempPng}" --out "${tempPng}" 2>/dev/null`.quiet();
      await $`pngquant 256 "${tempPng}" --output "${outputPath}" --force 2>/dev/null`.quiet();
      await $`rm -f "${tempPng}"`.quiet();
      return true;
    } catch {
      await $`rm -f "${tempPng}"`.quiet();
      return false;
    }
  }
}

/**
 * Extract icon from Assets.car using actool
 */
async function extractFromAssetsCar(
  assetsPath: string,
  iconName: string,
  outputPath: string,
): Promise<boolean> {
  const tempDir = `${TEMP_DIR}/assets_${Date.now()}`;

  try {
    await $`mkdir -p "${tempDir}"`.quiet();

    // Export all assets from the catalog
    await $`actool --export-dependency-info /dev/null --output-format human-readable-text --output-partial-info-plist /dev/null --platform macosx --minimum-deployment-target 10.15 --export "${tempDir}" "${assetsPath}" 2>/dev/null`.quiet();

    // Look for the icon files - try different naming patterns
    const patterns = [
      `${iconName}.png`,
      `${iconName}@2x.png`,
      `AppIcon.png`,
      `AppIcon@2x.png`,
      `icon_256x256.png`,
      `icon_128x128@2x.png`,
    ];

    let foundIcon: string | null = null;

    for (const pattern of patterns) {
      const checkPath = `${tempDir}/${pattern}`;
      const file = Bun.file(checkPath);
      if (await file.exists()) {
        foundIcon = checkPath;
        break;
      }
    }

    // If not found by name, look for any PNG
    if (!foundIcon) {
      try {
        const result = await $`find "${tempDir}" -name "*.png" -type f`.text();
        const pngs = result.trim().split("\n").filter(Boolean);
        if (pngs.length > 0) {
          // Prefer larger files (likely higher resolution)
          let largest = { path: pngs[0], size: 0 };
          for (const png of pngs) {
            const file = Bun.file(png);
            const size = file.size;
            if (size > largest.size) {
              largest = { path: png, size };
            }
          }
          foundIcon = largest.path;
        }
      } catch {
        // No PNGs found
      }
    }

    if (foundIcon) {
      // Resize and compress
      const tempPng = `${TEMP_DIR}/temp_asset_${Date.now()}.png`;
      await $`sips -z 256 256 "${foundIcon}" --out "${tempPng}" 2>/dev/null`.quiet();
      await $`pngquant 256 "${tempPng}" --output "${outputPath}" --force 2>/dev/null`.quiet();
      await $`rm -f "${tempPng}"`.quiet();
      await $`rm -rf "${tempDir}"`.quiet();
      return true;
    }

    await $`rm -rf "${tempDir}"`.quiet();
    return false;
  } catch {
    await $`rm -rf "${tempDir}"`.quiet();
    return false;
  }
}

/**
 * Extract icon for an app
 */
async function extractIcon(
  appPath: string,
  appName: string,
  sanitizedName: string,
): Promise<boolean> {
  const outputPath = `${ICONS_DIR}/${sanitizedName}.png`;
  const iconSource = await getIconFilePath(appPath);

  if (!iconSource) {
    return false;
  }

  if (iconSource.startsWith("asset:")) {
    // Extract from Assets.car
    const [, assetsPath, iconName] = iconSource.split(":");
    return extractFromAssetsCar(assetsPath, iconName, outputPath);
  } else {
    // Extract from .icns
    return extractFromIcns(iconSource, outputPath);
  }
}

async function main() {
  console.log("Extracting icons from locally installed applications...\n");

  // Check dependencies
  if (!(await checkDependencies())) {
    process.exit(1);
  }

  // Create directories
  await $`mkdir -p "${ICONS_DIR}"`.quiet();
  await $`mkdir -p "${TEMP_DIR}"`.quiet();

  // Clear existing icons (but keep the directory)
  console.log("Clearing existing icons...");
  try {
    await $`rm -f ${ICONS_DIR}/*.png`.quiet();
  } catch {
    // No PNG files to remove
  }
  try {
    await $`rm -f ${ICONS_DIR}/*.icns`.quiet();
  } catch {
    // No ICNS files to remove
  }

  // Get recently used apps
  console.log("Finding recently used applications...");
  const apps = await getRecentApps();
  console.log(`Found ${apps.length} apps\n`);

  const manifest: Record<string, string> = {};
  let successCount = 0;
  let failCount = 0;

  for (const app of apps) {
    const sanitizedName = sanitizeFilename(app.name);
    process.stdout.write(`${app.name}... `);

    const success = await extractIcon(app.path, app.name, sanitizedName);

    if (success) {
      manifest[app.name] = `./icons/${sanitizedName}.png`;
      console.log("OK");
      successCount++;
    } else {
      console.log("SKIP (no icon found)");
      failCount++;
    }
  }

  // Write manifest
  await Bun.write(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  // Clean up temp directory
  await $`rm -rf "${TEMP_DIR}"`.quiet();

  console.log(`\n========== Complete ==========`);
  console.log(`Extracted: ${successCount}`);
  console.log(`Skipped:   ${failCount}`);
  console.log(`Manifest:  ${MANIFEST_PATH}`);
}

main();
