import manifestData from "../static/icons/icon-manifest.json";

export interface IconEntry {
  pngPath: string;
  icnsPath: string;
  pngUrl: string;
  icnsUrl: string;
  credit: string | null;
}

export type IconManifest = Record<string, IconEntry>;

export const iconManifest: IconManifest = manifestData as IconManifest;

export function getIconPath(appName: string): string | null {
  const entry = iconManifest[appName];
  if (!entry) return null;
  return entry.pngPath;
}
