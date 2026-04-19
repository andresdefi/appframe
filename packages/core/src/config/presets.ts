import type { TemplateStyle, ColorConfig } from './schema.js';

export interface TypographyDefaults {
  fontWeight: number;
  headlineFontSizeScale: number;
  subtitleFontSizeScale: number;
  headlineLineHeight: number;
  headlineLetterSpacing: string;
  headlineTextTransform: string;
  headlineFontStyle: string;
  subtitleOpacity: number;
  subtitleLineHeight: number;
  subtitleLetterSpacing: string;
  subtitleTextTransform: string;
  fontFallback: string;
}

export type ShadowIntensity = 'light' | 'medium' | 'heavy' | 'glow';

export interface ShadowConfig {
  intensity: ShadowIntensity;
  standard: Array<[number, number, number]>;
  angled: Array<[number, number, number]>;
  glowScale?: number;
  glowAlpha?: string;
}

export type BgEffect = 'none' | 'orbs' | 'glow' | 'shapes' | 'flat-circles' | 'divider';

export interface StylePreset {
  backgroundCss: (colors: ColorConfig) => string;
  bgEffect: BgEffect;
  typography: TypographyDefaults;
  shadow: ShadowConfig;
  perspective: { angled: number; standard: number };
  textAreaTop: number;
  textAreaPadding: number;
  isFullscreen: boolean;
}

/**
 * Single neutral baseline for every style slot (except structural 'fullscreen').
 * The `style` field in the schema is retained for backward compatibility but no
 * longer drives visual variety — all visual decisions are meant to come from
 * explicit config fields (theme and per-screen). A future pass will remove the
 * `style` field entirely once rebuilding presets as saveable config fragments.
 */
const BASELINE: StylePreset = {
  backgroundCss: (colors) => colors.background,
  bgEffect: 'none',
  typography: {
    fontWeight: 600,
    headlineFontSizeScale: 0.085,
    subtitleFontSizeScale: 0.035,
    headlineLineHeight: 1.12,
    headlineLetterSpacing: '-0.02em',
    headlineTextTransform: 'none',
    headlineFontStyle: 'normal',
    subtitleOpacity: 0.5,
    subtitleLineHeight: 1.4,
    subtitleLetterSpacing: '0',
    subtitleTextTransform: 'none',
    fontFallback: "'Inter', -apple-system, sans-serif",
  },
  shadow: {
    intensity: 'light',
    standard: [[0.02, 0.05, 0.15]],
    angled: [[0.02, 0.05, 0.18]],
  },
  perspective: { angled: 1200, standard: 1500 },
  textAreaTop: 0.03,
  textAreaPadding: 0.07,
  isFullscreen: false,
};

export const STYLE_PRESETS: Record<TemplateStyle, StylePreset> = {
  minimal: BASELINE,
  bold: BASELINE,
  glow: BASELINE,
  playful: BASELINE,
  clean: BASELINE,
  branded: BASELINE,
  editorial: BASELINE,
  fullscreen: { ...BASELINE, isFullscreen: true },
};
