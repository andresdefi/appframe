import type { TemplateStyle, ColorConfig } from './schema.js';

export interface TypographyDefaults {
  fontWeight: number;
  headlineFontSizeScale: number; // multiplied by canvasWidth
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
  // Shadow CSS values (multiplied by canvasWidth) — [y-offset-scale, blur-scale, opacity]
  standard: Array<[number, number, number]>;
  angled: Array<[number, number, number]>;
  // For glow style: extra glow shadow prepended (uses primary color)
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
  textAreaTop: number; // as fraction of canvasHeight
  textAreaPadding: number; // as fraction of canvasWidth
  isFullscreen: boolean;
}

export const STYLE_PRESETS: Record<TemplateStyle, StylePreset> = {
  minimal: {
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
  },

  bold: {
    backgroundCss: (colors) => `linear-gradient(145deg, ${colors.primary}, ${colors.secondary})`,
    bgEffect: 'orbs',
    typography: {
      fontWeight: 800,
      headlineFontSizeScale: 0.095,
      subtitleFontSizeScale: 0.036,
      headlineLineHeight: 1.05,
      headlineLetterSpacing: '-0.03em',
      headlineTextTransform: 'uppercase',
      headlineFontStyle: 'normal',
      subtitleOpacity: 0.8,
      subtitleLineHeight: 1.35,
      subtitleLetterSpacing: '0',
      subtitleTextTransform: 'none',
      fontFallback: "'Space Grotesk', 'Inter', -apple-system, sans-serif",
    },
    shadow: {
      intensity: 'heavy',
      standard: [[0.03, 0.08, 0.4]],

      angled: [[0.03, 0.08, 0.4]],
    },
    perspective: { angled: 800, standard: 1500 },
    textAreaTop: 0.03,
    textAreaPadding: 0.06,
    isFullscreen: false,
  },

  glow: {
    backgroundCss: (colors) => colors.background,
    bgEffect: 'glow',
    typography: {
      fontWeight: 700,
      headlineFontSizeScale: 0.085,
      subtitleFontSizeScale: 0.036,
      headlineLineHeight: 1.1,
      headlineLetterSpacing: '-0.02em',
      headlineTextTransform: 'none',
      headlineFontStyle: 'normal',
      subtitleOpacity: 0.55,
      subtitleLineHeight: 1.4,
      subtitleLetterSpacing: '0',
      subtitleTextTransform: 'none',
      fontFallback: "'Inter', -apple-system, sans-serif",
    },
    shadow: {
      intensity: 'glow',
      standard: [[0.03, 0.06, 0.5]],

      angled: [[0.03, 0.06, 0.5]],
      glowScale: 0.08,
      glowAlpha: '66',

    },
    perspective: { angled: 1000, standard: 1500 },
    textAreaTop: 0.03,
    textAreaPadding: 0.07,
    isFullscreen: false,
  },

  playful: {
    backgroundCss: (colors) => colors.background,
    bgEffect: 'shapes',
    typography: {
      fontWeight: 700,
      headlineFontSizeScale: 0.085,
      subtitleFontSizeScale: 0.035,
      headlineLineHeight: 1.1,
      headlineLetterSpacing: '-0.015em',
      headlineTextTransform: 'none',
      headlineFontStyle: 'normal',
      subtitleOpacity: 0.6,
      subtitleLineHeight: 1.4,
      subtitleLetterSpacing: '0',
      subtitleTextTransform: 'none',
      fontFallback: "'Space Grotesk', 'Inter', -apple-system, sans-serif",
    },
    shadow: {
      intensity: 'light',
      standard: [[0.025, 0.06, 0.22]],

      angled: [[0.025, 0.06, 0.22]],
    },
    perspective: { angled: 900, standard: 1500 },
    textAreaTop: 0.03,
    textAreaPadding: 0.07,
    isFullscreen: false,
  },

  clean: {
    backgroundCss: (colors) => `linear-gradient(160deg, ${colors.background}, ${colors.primary}22 50%, ${colors.background})`,
    bgEffect: 'flat-circles',
    typography: {
      fontWeight: 700,
      headlineFontSizeScale: 0.085,
      subtitleFontSizeScale: 0.035,
      headlineLineHeight: 1.1,
      headlineLetterSpacing: '-0.025em',
      headlineTextTransform: 'none',
      headlineFontStyle: 'normal',
      subtitleOpacity: 0.55,
      subtitleLineHeight: 1.4,
      subtitleLetterSpacing: '0',
      subtitleTextTransform: 'none',
      fontFallback: "'Inter', -apple-system, sans-serif",
    },
    shadow: {
      intensity: 'light',
      standard: [[0.02, 0.05, 0.15]],

      angled: [[0.02, 0.05, 0.15]],
    },
    perspective: { angled: 1200, standard: 1500 },
    textAreaTop: 0.03,
    textAreaPadding: 0.07,
    isFullscreen: false,
  },

  branded: {
    backgroundCss: (colors) => colors.primary,
    bgEffect: 'flat-circles',
    typography: {
      fontWeight: 800,
      headlineFontSizeScale: 0.085,
      subtitleFontSizeScale: 0.035,
      headlineLineHeight: 1.08,
      headlineLetterSpacing: '-0.02em',
      headlineTextTransform: 'none',
      headlineFontStyle: 'normal',
      subtitleOpacity: 0.8,
      subtitleLineHeight: 1.4,
      subtitleLetterSpacing: '0',
      subtitleTextTransform: 'none',
      fontFallback: "'Inter', -apple-system, sans-serif",
    },
    shadow: {
      intensity: 'medium',
      standard: [[0.025, 0.06, 0.25]],

      angled: [[0.025, 0.06, 0.25]],
    },
    perspective: { angled: 900, standard: 1500 },
    textAreaTop: 0.03,
    textAreaPadding: 0.07,
    isFullscreen: false,
  },

  editorial: {
    backgroundCss: (colors) => colors.background,
    bgEffect: 'divider',
    typography: {
      fontWeight: 500,
      headlineFontSizeScale: 0.08,
      subtitleFontSizeScale: 0.034,
      headlineLineHeight: 1.18,
      headlineLetterSpacing: '-0.01em',
      headlineTextTransform: 'none',
      headlineFontStyle: 'italic',
      subtitleOpacity: 0.5,
      subtitleLineHeight: 1.45,
      subtitleLetterSpacing: '0.02em',
      subtitleTextTransform: 'uppercase',
      fontFallback: "'Inter', Georgia, serif",
    },
    shadow: {
      intensity: 'light',
      standard: [[0.015, 0.04, 0.12]],

      angled: [[0.015, 0.04, 0.12]],
    },
    perspective: { angled: 1200, standard: 1500 },
    textAreaTop: 0.04,
    textAreaPadding: 0.07,
    isFullscreen: false,
  },

  fullscreen: {
    backgroundCss: () => '#000000',
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
      standard: [],

      angled: [],
    },
    perspective: { angled: 1200, standard: 1500 },
    textAreaTop: 0.03,
    textAreaPadding: 0.07,
    isFullscreen: true,
  },
};
