import { resolve } from 'node:path';
import type {
  AppframeConfig, ScreenConfig, TemplateStyle,
  ColorConfig, LayoutVariant, CompositionPreset,
} from '../config/schema.js';
import { COMPOSITION_PRESETS } from '../composer/presets.js';
import type { DeviceSlotPreset } from '../composer/presets.js';
import { FONT_CATALOG, getFontName } from '../fonts/loader.js';
import { KOUBOU_DIMENSIONS } from './types.js';
import type { KoubouConfig, KoubouBackground, KoubouContentElement } from './types.js';
import { getKoubouDeviceId } from './catalog.js';

// Map appframe size keys to Koubou output_size names
const SIZE_MAP: Record<string, string> = {
  // iPhone
  '6.9': 'iPhone6_9',
  '6.7': 'iPhone6_7',
  '6.5': 'iPhone6_5',
  '6.1': 'iPhone6_1',
  '5.5': 'iPhone5_5',
  // iPad
  'ipad-12.9': 'iPadPro12_9',
  'ipad-11': 'iPadPro11',
  'ipad-13': 'iPadPro13',
  // Mac
  '2880x1800': 'MacBookPro14',
  '2560x1600': 'MacBookAir',
  '1440x900': 'MacBookAir',
  '1280x800': 'MacBookAir',
  // Apple Watch
  'ultra3': 'WatchUltra',
  'ultra': 'WatchUltra',
  's10': 'WatchS7_45',
  's7': 'WatchS7_45',
  's4': 'WatchS4_44',
  's3': 'WatchS4_40',
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

// --- Font resolution ---

function resolveKoubouFont(fontId: string): string | undefined {
  // Koubou uses PIL's ImageFont.truetype() which resolves system font names.
  // Return the display name (e.g. "Inter", "Poppins") — works if installed on the system.
  const catalogEntry = FONT_CATALOG.find(f => f.id === fontId);
  if (catalogEntry) return catalogEntry.name;
  // If not in catalog, return the raw ID — might be a system font name
  return getFontName(fontId);
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

// --- Composition → Koubou image positioning ---

function slotToKoubouImage(
  slot: DeviceSlotPreset,
  screenshotPath: string,
  useFrame: boolean,
): KoubouContentElement {
  // Convert appframe slot positioning to Koubou image element
  // offsetX: % of canvas width from center → Koubou position X
  // offsetY: % from top for device top → Koubou position Y (center-based, add ~40%)
  const posX = `${50 + slot.offsetX}%`;
  const posY = `${slot.offsetY + 40}%`;
  const scale = slot.scale / 100;

  return {
    type: 'image',
    asset: screenshotPath,
    position: [posX, posY] as [string, string],
    scale,
    frame: useFrame,
    ...(slot.rotation !== 0 ? { rotation: slot.rotation } : {}),
  };
}

// --- Layout → positioning (fallback for 'single' composition) ---
// Y positions push device down to avoid overlapping headline/subtitle text

function translateLayout(layout: LayoutVariant): { position: [string, string]; scale: number } {
  switch (layout) {
    case 'center':
      return { position: ['50%', '60%'], scale: 0.80 };
    case 'angled-left':
      return { position: ['45%', '60%'], scale: 0.80 };
    case 'angled-right':
      return { position: ['55%', '60%'], scale: 0.80 };
    case 'floating':
      return { position: ['50%', '62%'], scale: 0.75 };
    case 'side-by-side':
      return { position: ['50%', '60%'], scale: 0.75 };
    default:
      return { position: ['50%', '60%'], scale: 0.80 };
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

// --- Font sizing ---
// Koubou uses absolute pixel sizes on the full-resolution canvas (e.g. 1290x2796).
// If user specifies headlineSize/subtitleSize in config, use those directly.
// Otherwise scale proportionally to canvas width for readable output.

function headlineFontSize(canvasWidth: number, userSize?: number): number {
  if (userSize) return userSize;
  return Math.round(canvasWidth * 0.075); // ~97px at 1290w
}

function subtitleFontSize(canvasWidth: number, userSize?: number): number {
  if (userSize) return userSize;
  return Math.round(canvasWidth * 0.038); // ~49px at 1290w
}

// --- Screen translation ---

function translateScreen(
  screen: ScreenConfig,
  config: AppframeConfig,
  configDir: string,
  canvasWidth: number,
): KoubouContentElement[] {
  const elements: KoubouContentElement[] = [];
  const style = config.theme.style;
  const colors = config.theme.colors;
  const hasSubtitle = !!screen.subtitle;
  const fontName = resolveKoubouFont(config.theme.font);

  // Skip text elements for fullscreen template
  if (style !== 'fullscreen') {
    // Headline
    elements.push({
      type: 'text',
      content: screen.headline,
      position: headlinePosition(hasSubtitle),
      size: headlineFontSize(canvasWidth, config.theme.headlineSize),
      color: colors.text,
      weight: weightString(config.theme.fontWeight),
      alignment: 'center',
      ...(fontName ? { font: fontName } : {}),
      ...(config.theme.headlineGradient ? { gradient: config.theme.headlineGradient } : {}),
    });

    // Subtitle
    if (screen.subtitle) {
      elements.push({
        type: 'text',
        content: screen.subtitle,
        position: subtitlePosition(),
        size: subtitleFontSize(canvasWidth, config.theme.subtitleSize),
        color: colors.subtitle ?? colors.text,
        weight: 'regular',
        alignment: 'center',
        ...(fontName ? { font: fontName } : {}),
        ...(config.theme.subtitleGradient ? { gradient: config.theme.subtitleGradient } : {}),
      });
    }
  }

  // Screenshot image(s)
  const screenshotPath = resolve(configDir, screen.screenshot);
  const useFrame = config.frames.style !== 'none';
  const composition = screen.composition ?? 'single';

  if (style === 'fullscreen') {
    // Fullscreen: image fills entire canvas, no frame
    elements.push({
      type: 'image',
      asset: screenshotPath,
      position: ['50%', '50%'],
      scale: 1.0,
      frame: false,
    });
  } else if (composition !== 'single') {
    // Non-single composition: use preset slot positioning
    const preset = COMPOSITION_PRESETS[composition as CompositionPreset];
    if (preset) {
      // Primary device uses the first slot
      const primarySlot = preset.slots[0]!;
      elements.push(slotToKoubouImage(primarySlot, screenshotPath, useFrame));

      // Extra devices use subsequent slots
      if (screen.extraDevices && preset.slots.length > 1) {
        for (let i = 0; i < screen.extraDevices.length && i + 1 < preset.slots.length; i++) {
          const extraDevice = screen.extraDevices[i]!;
          const slot = preset.slots[i + 1]!;
          const extraPath = resolve(configDir, extraDevice.screenshot);
          elements.push(slotToKoubouImage(slot, extraPath, useFrame));
        }
      }
    } else {
      // Unknown composition — fall back to center layout
      const { position, scale } = translateLayout(screen.layout);
      elements.push({ type: 'image', asset: screenshotPath, position, scale, frame: useFrame });
    }
  } else {
    // Single composition: use layout-based positioning
    const { position, scale } = translateLayout(screen.layout);
    elements.push({ type: 'image', asset: screenshotPath, position, scale, frame: useFrame });
  }

  // Spotlight overlay
  if (screen.spotlight) {
    const sp = screen.spotlight;
    elements.push({
      type: 'spotlight',
      position: [`${sp.x}%`, `${sp.y}%`] as [string, string],
      size: [`${sp.w}%`, `${sp.h}%`] as [string, string],
      shape: sp.shape,
      dim_opacity: sp.dimOpacity,
      ...(sp.blur > 0 ? { blur: sp.blur } : {}),
    });
  }

  // Annotation highlights
  if (screen.annotations) {
    for (const ann of screen.annotations) {
      elements.push({
        type: 'highlight',
        shape: ann.shape as 'circle' | 'rounded-rect' | 'rectangle',
        position: [`${ann.x}%`, `${ann.y}%`] as [string, string],
        size: [`${ann.w}%`, `${ann.h}%`] as [string, string],
        color: ann.strokeColor,
        stroke_width: ann.strokeWidth,
        ...(ann.fillColor ? { fill_color: ann.fillColor } : {}),
      });
    }
  }

  // Zoom callouts
  if (screen.zoomCallouts) {
    for (const zc of screen.zoomCallouts) {
      elements.push({
        type: 'callout',
        source: {
          position: [`${zc.sourceX}%`, `${zc.sourceY}%`] as [string, string],
          size: [`${zc.sourceW}%`, `${zc.sourceH}%`] as [string, string],
        },
        target: {
          position: [`${zc.targetX}%`, `${zc.targetY}%`] as [string, string],
        },
        magnification: zc.magnification,
        connector: zc.connectorStyle as 'line' | 'elbow' | 'none',
        border_color: zc.borderColor,
        border_width: zc.borderWidth,
        shadow: zc.shadow,
      });
    }
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

  // Resolve device frame via catalog (supports color variants)
  const frameId = config.frames.ios ?? config.frames.android;
  const koubouColor = config.frames.koubouColor;
  let device = DEFAULT_DEVICE;
  if (frameId) {
    const catalogDevice = getKoubouDeviceId(frameId, koubouColor);
    device = catalogDevice ?? DEFAULT_DEVICE;
  }

  // Resolve canvas width for proportional font sizing
  const dims = KOUBOU_DIMENSIONS[outputSize];
  const canvasWidth = dims?.width ?? 1290;

  // Background
  const background = translateBackground(config.theme.style, config.theme.colors);

  // Translate each screen
  const screenshots: Record<string, { content: KoubouContentElement[]; background?: KoubouBackground }> = {};

  for (let i = 0; i < config.screens.length; i++) {
    const screen = config.screens[i]!;
    const content = translateScreen(screen, config, configDir, canvasWidth);
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
  localeOverrides: Array<{ headline: string; subtitle?: string; screenshot?: string }>,
): KoubouConfig {
  const modifiedScreens = options.config.screens.map((screen, i) => {
    const override = localeOverrides[i];
    if (!override) return screen;
    return {
      ...screen,
      headline: override.headline,
      ...(override.subtitle !== undefined ? { subtitle: override.subtitle } : {}),
      ...(override.screenshot ? { screenshot: override.screenshot } : {}),
    };
  });

  return translateConfig({
    ...options,
    config: { ...options.config, screens: modifiedScreens },
  });
}

export function translateConfigWithLocalization(options: TranslateOptions): KoubouConfig {
  const { config, configDir } = options;
  const localization = config.localization;
  if (!localization) {
    throw new Error('translateConfigWithLocalization requires config.localization to be set');
  }

  const base = translateConfig(options);

  base.localization = {
    base_language: localization.baseLanguage,
    languages: localization.languages,
    xcstrings_path: resolve(configDir, localization.xcstringsPath),
  };

  return base;
}

export function mapSizeToKoubou(sizeKey: number | string): string | null {
  return SIZE_MAP[String(sizeKey)] ?? null;
}

export function mapDeviceToKoubou(frameId: string, color?: string): string | null {
  return getKoubouDeviceId(frameId, color);
}
