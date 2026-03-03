import { existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';

/**
 * Resolve a localized asset path using convention-based fallback.
 *
 * Tries in order:
 *   1. {dir}/{locale}/{filename}
 *   2. {dir}/{baseLanguage}/{filename}
 *   3. {dir}/{filename}  (original path)
 *
 * All paths are resolved relative to configDir.
 */
export function resolveLocalizedAsset(
  basePath: string,
  locale: string,
  baseLanguage: string,
  configDir: string,
): string {
  const dir = dirname(basePath);
  const filename = basename(basePath);

  // 1. Try locale-specific path
  const localePath = join(configDir, dir, locale, filename);
  if (existsSync(localePath)) return localePath;

  // 2. Try base language path
  if (locale !== baseLanguage) {
    const baseLangPath = join(configDir, dir, baseLanguage, filename);
    if (existsSync(baseLangPath)) return baseLangPath;
  }

  // 3. Fall back to original path
  return join(configDir, basePath);
}
