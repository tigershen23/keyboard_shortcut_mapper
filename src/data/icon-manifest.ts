import manifestData from "../static/icons/icon-manifest.json";

export type IconManifest = Record<string, string>;

export const iconManifest: IconManifest = manifestData as IconManifest;

export function getIconPath(appName: string): string | null {
  return iconManifest[appName] ?? null;
}
