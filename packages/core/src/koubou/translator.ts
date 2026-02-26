import { resolve } from 'node:path';
import type { AppframeConfig, ScreenConfig, TemplateStyle, ColorConfig, LayoutVariant } from '../config/schema.js';
import type { KoubouConfig, KoubouBackground, KoubouContentElement } from './types.js';

// Map appframe iOS size keys to Koubou output_size names
const SIZE_MAP: Record<string, string> = {
  '6.9': 'iPhone6_9',
  '6.7': 'iPhone6_7',
  '6.5': 'iPhone6_5',
  '6.1': 'iPhone6_1',
  '5.5': 'iPhone5_5',
  'ipad-12.9': 'iPadPro12_9',
  'ipad-11': 'iPadPro11',
  'ipad-13': 'iPadPro13',
};

// Map appframe device frame IDs to Koubou frame names
const DEVICE_MAP: Record<string, string> = {
  'iphone-16-pro-max': 'iPhone 16 Pro Max - Natural Titanium - Portrait',
  'iphone-16-pro': 'iPhone 16 Pro - Natural Titanium - Portrait',
  'iphone-16': 'iPhone 16 - Black - Portrait',
  'iphone-15-pro-max': 'iPhone 15 Pro Max - Natural Titanium - Portrait',
  'iphone-15-pro': 'iPhone 15 Pro - Natural Titanium - Portrait',
  'iphone-15': 'iPhone 15 - Black - Portrait',
  'iphone-14-pro-max': 'iPhone 14 Pro Max Portrait',
  'iphone-14-pro': 'iPhone 14 Pro Portrait',
  'iphone-13-pro-max': 'iPhone 12-13 Pro Max Portrait',
  'iphone-12-pro-max': 'iPhone 12-13 Pro Max Portrait',
  'iphone-11-pro-max': 'iPhone 11 Pro Max Portrait',
  'iphone-11': 'iPhone 11 Portrait',
};

const DEFAULT_DEVICE = 'iPhone 16 Pro Max - Natural Titanium - Portrait';

// --- Color utilities ---

function lightenHex(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function darkenHex(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// --- Background mapping ---

function translateBackground(style: TemplateStyle, colors: ColorConfig): KoubouBackground {
  switch (style) {
    case 'glow':
      return {
        type: 'linear',
        colors: [colors.background, lightenHex(colors.background, 20)],
        direction: 180,
      };
    case 'bold':
      return {
        type: 'radial',
        colors: [colors.secondary, colors.background],
        center: ['50%', '50%'],
        radius: '80%',
      };
    case 'minimal':
    case 'clean':
    case 'editorial':
      return {
        type: 'solid',
        color: colors.background,
      };
    case 'playful':
      return {
        type: 'radial',
        colors: [colors.background, darkenHex(colors.background, 10)],
        center: ['50%', '30%'],
        radius: '100%',
      };
    case 'branded':
      return {
        type: 'solid',
        color: colors.primary,
      };
    case 'fullscreen':
      return {
        type: 'solid',
        color: '#000000',
      };
    default:
      return {
        type: 'solid',
        color: colors.background,
      };
  }
}

// --- Layout → positioning ---

function translateLayout(layout: LayoutVariant): { position: [string, string]; scale: number } {
  switch (layout) {
    case 'center':
      return { position: ['50%', '55%'], scale: 0.85 };
    case 'angled-left':
      return { position: ['45%', '55%'], scale: 0.85 };
    case 'angled-right':
      return { position: ['55%', '55%'], scale: 0.85 };
    case 'floating':
      return { position: ['50%', '58%'], scale: 0.80 };
    case 'side-by-side':
      return { position: ['50%', '55%'], scale: 0.80 };
    default:
      return { position: ['50%', '55%'], scale: 0.85 };
  }
}

// --- Text helpers ---

function headlinePosition(hasSubtitle: boolean): [string, string] {
  return hasSubtitle ? ['50%', '6%'] : ['50%', '8%'];
}

function subtitlePosition(): [string, string] {
  return ['50%', '12%'];
}

function weightString(weight: number): string {
  if (weight >= 800) return 'extrabold';
  if (weight >= 700) return 'bold';
  if (weight >= 600) return 'semibold';
  if (weight >= 500) return 'medium';
  return 'regular';
}

// --- Screen name ---

function sanitizeScreenName(index: number, headline: string): string {
  const slug = headline
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 30);
  return `screen_${index + 1}_${slug}`;
}

// --- Screen translation ---

function translateScreen(
  screen: ScreenConfig,
  config: AppframeConfig,
  configDir: string,
): KoubouContentElement[] {
  const elements: KoubouContentElement[] = [];
  const style = config.theme.style;
  const colors = config.theme.colors;
  const hasSubtitle = !!screen.subtitle;

  // Skip text elements for fullscreen template
  if (style !== 'fullscreen') {
    // Headline
    elements.push({
      type: 'text',
      content: screen.headline,
      position: headlinePosition(hasSubtitle),
      size: 52,
      color: colors.text,
      weight: weightString(config.theme.fontWeight),
      alignment: 'center',
    });

    // Subtitle
    if (screen.subtitle) {
      elements.push({
        type: 'text',
        content: screen.subtitle,
        position: subtitlePosition(),
        size: 22,
        color: colors.subtitle ?? colors.text,
        weight: 'regular',
        alignment: 'center',
      });
    }
  }

  // Screenshot image
  const screenshotPath = resolve(configDir, screen.screenshot);

  if (style === 'fullscreen') {
    elements.push({
      type: 'image',
      asset: screenshotPath,
      position: ['50%', '50%'],
      scale: 1.0,
      frame: false,
    });
  } else {
    const { position, scale } = translateLayout(screen.layout);
    elements.push({
      type: 'image',
      asset: screenshotPath,
      position,
      scale,
      frame: config.frames.style !== 'none',
    });
  }

  return elements;
}

// --- Public API ---

export interface TranslateOptions {
  config: AppframeConfig;
  configDir: string;
  outputSize: string;
  outputDir: string;
}

export function translateConfig(options: TranslateOptions): KoubouConfig {
  const { config, configDir, outputSize, outputDir } = options;

  // Resolve device frame
  const frameId = config.frames.ios ?? config.frames.android;
  const device = frameId
    ? (DEVICE_MAP[frameId] ?? DEFAULT_DEVICE)
    : DEFAULT_DEVICE;

  // Background
  const background = translateBackground(config.theme.style, config.theme.colors);

  // Translate each screen
  const screenshots: Record<string, { content: KoubouContentElement[]; background?: KoubouBackground }> = {};

  for (let i = 0; i < config.screens.length; i++) {
    const screen = config.screens[i]!;
    const content = translateScreen(screen, config, configDir);
    const screenName = sanitizeScreenName(i, screen.headline);

    screenshots[screenName] = {
      content,
      ...(screen.background ? { background: { type: 'solid' as const, color: screen.background } } : {}),
    };
  }

  return {
    project: {
      name: config.app.name,
      output_dir: outputDir,
      device,
      output_size: outputSize,
    },
    defaults: { background },
    screenshots,
  };
}

export function translateConfigWithLocale(
  options: TranslateOptions,
  _locale: string,
  localeOverrides: Array<{ headline: string; subtitle?: string }>,
): KoubouConfig {
  // Create a shallow copy of config with overridden screen text
  const modifiedScreens = options.config.screens.map((screen, i) => {
    const override = localeOverrides[i];
    if (!override) return screen;
    return {
      ...screen,
      headline: override.headline,
      ...(override.subtitle !== undefined ? { subtitle: override.subtitle } : {}),
    };
  });

  return translateConfig({
    ...options,
    config: { ...options.config, screens: modifiedScreens },
  });
}

export function mapSizeToKoubou(sizeKey: number | string): string | null {
  return SIZE_MAP[String(sizeKey)] ?? null;
}

export function mapDeviceToKoubou(frameId: string): string | null {
  return DEVICE_MAP[frameId] ?? null;
}
