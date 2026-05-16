// Helpers shared between the individual-mode preview routes
// (preview-html) and the panoramic routes (panoramic-preview-html).
// Localization lookup, screenshot/data-URL resolution, and placeholder
// SVG generation all live here so neither route module owns them.

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Buffer } from 'node:buffer';
import { resolveLocalizedAsset } from '@appframe/core';
import type { AppframeConfig, LocaleConfig, PanoramicElement } from '@appframe/core';
import {
  resolveScreenshotUrlToDataUrl,
  type ScreenshotStorageOptions,
} from './screenshotStorage.js';

export function getLocaleText(
  config: AppframeConfig,
  index: number,
  locale: string,
  localeConfig: LocaleConfig | undefined,
  field: 'headline' | 'subtitle',
): string | undefined {
  if (locale === 'default') return undefined;
  const sessionValue = localeConfig?.screens?.[index]?.[field];
  if (sessionValue !== undefined) return sessionValue;
  return config.locales?.[locale]?.screens?.[index]?.[field];
}

export function resolveLocalizedScreenText(
  config: AppframeConfig,
  index: number,
  locale: string,
  localeConfig: LocaleConfig | undefined,
  field: 'headline' | 'subtitle',
  requestedValue: string | undefined,
  fallbackValue: string | undefined,
  preferLocaleText: boolean,
): string | undefined {
  const localizedValue = getLocaleText(config, index, locale, localeConfig, field);
  if (preferLocaleText && localizedValue !== undefined) return localizedValue;
  return requestedValue ?? localizedValue ?? fallbackValue;
}

export function getLocalizedScreenshotPath(
  config: AppframeConfig,
  configDir: string,
  index: number,
  locale: string,
  defaultScreenshot: string,
  localeConfig?: LocaleConfig,
): string {
  if (locale !== 'default') {
    const sessionScreen = localeConfig?.screens?.[index];
    if (sessionScreen?.screenshot) return resolve(configDir, sessionScreen.screenshot);

    const localeScreen = config.locales?.[locale]?.screens?.[index];
    if (localeScreen?.screenshot) return resolve(configDir, localeScreen.screenshot);
  }

  if (locale !== 'default' && config.localization) {
    return resolveLocalizedAsset(
      defaultScreenshot,
      locale,
      config.localization.baseLanguage,
      configDir,
    );
  }

  return resolve(configDir, defaultScreenshot);
}

export function localizePanoramicElement(
  config: AppframeConfig,
  configDir: string,
  element: PanoramicElement,
  locale: string,
  localeConfig: LocaleConfig | undefined,
  elementIndex?: number,
): PanoramicElement {
  if (element.type === 'group') {
    return {
      ...element,
      children: element.children.map((child) =>
        localizePanoramicElement(config, configDir, child, locale, localeConfig) as typeof child,
      ),
    };
  }

  if (locale === 'default') return element;

  const localePanoramicOverride =
    elementIndex !== undefined
      ? (localeConfig?.panoramic?.elements?.[elementIndex] ??
        config.locales?.[locale]?.panoramic?.elements?.[elementIndex])
      : undefined;

  if (localePanoramicOverride) {
    if ((element.type === 'device' || element.type === 'crop') && localePanoramicOverride.screenshot) {
      return {
        ...element,
        screenshot: resolve(configDir, localePanoramicOverride.screenshot),
      };
    }

    if (
      (element.type === 'text' || element.type === 'label' || element.type === 'badge') &&
      localePanoramicOverride.content
    ) {
      return {
        ...element,
        content: localePanoramicOverride.content,
      };
    }
  }

  if (
    (element.type === 'device' || element.type === 'crop') &&
    element.localeSourceScreen !== undefined &&
    !element.screenshot.startsWith('data:')
  ) {
    return {
      ...element,
      screenshot: getLocalizedScreenshotPath(
        config,
        configDir,
        element.localeSourceScreen,
        locale,
        element.screenshot,
        localeConfig,
      ),
    };
  }

  if (
    (element.type === 'text' || element.type === 'label' || element.type === 'badge') &&
    element.localeSourceScreen !== undefined &&
    element.localeSourceField
  ) {
    const localizedContent = getLocaleText(
      config,
      element.localeSourceScreen,
      locale,
      localeConfig,
      element.localeSourceField,
    );
    if (localizedContent !== undefined) {
      return {
        ...element,
        content: localizedContent,
      };
    }
  }

  return element;
}

export function placeholderSvgDataUrl(): string {
  return (
    'data:image/svg+xml;base64,' +
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800">
      <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea"/><stop offset="100%" style="stop-color:#764ba2"/>
      </linearGradient></defs>
      <rect width="400" height="800" fill="url(#g)"/>
      <text x="200" y="400" text-anchor="middle" fill="white" font-family="sans-serif" font-size="14">Screenshot placeholder</text>
    </svg>`,
    ).toString('base64')
  );
}

export function placeholderSvgDataUrlWithLabel(label: string): string {
  return (
    'data:image/svg+xml;base64,' +
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800">
      <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea"/><stop offset="100%" style="stop-color:#764ba2"/>
      </linearGradient></defs>
      <rect width="400" height="800" fill="url(#g)"/>
      <text x="200" y="400" text-anchor="middle" fill="white" font-family="sans-serif" font-size="14">${label} placeholder</text>
    </svg>`,
    ).toString('base64')
  );
}

export async function screenshotToDataUrl(
  path: string,
  fallbackLabel = 'Screenshot',
): Promise<string> {
  try {
    const buffer = await readFile(path);
    const lower = path.toLowerCase();
    const ext =
      lower.endsWith('.jpg') || lower.endsWith('.jpeg')
        ? 'jpeg'
        : lower.endsWith('.webp')
          ? 'webp'
          : lower.endsWith('.svg')
            ? 'svg+xml'
            : 'png';
    return `data:image/${ext};base64,${buffer.toString('base64')}`;
  } catch {
    return placeholderSvgDataUrlWithLabel(fallbackLabel);
  }
}

export async function resolveCanvasAssetDataUrl(
  value: string,
  baseDir: string,
  fallbackLabel: string,
  storage?: ScreenshotStorageOptions,
): Promise<string> {
  if (value.startsWith('data:')) {
    return value;
  }

  if (value.startsWith('/api/screenshots/') && storage) {
    const resolved = await resolveScreenshotUrlToDataUrl(storage, value);
    if (resolved) return resolved;
    return placeholderSvgDataUrlWithLabel(fallbackLabel);
  }

  const assetPath = resolve(baseDir, value);
  if (!assetPath.startsWith(resolve(baseDir))) {
    return placeholderSvgDataUrlWithLabel(fallbackLabel);
  }
  return screenshotToDataUrl(assetPath, fallbackLabel);
}
