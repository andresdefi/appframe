// Save-time slimming + load-time fattening for ScreenState. Each saved
// project file was carrying every field of every screen even when most
// were untouched defaults (66 fields per screen, with 30+ commonly at
// their default). The persisted JSON is the user's source of truth, so
// it pays to keep it compact and grep-friendly.
//
// Theme-derived defaults (font, fontWeight, colors, etc.) are
// intentionally NOT slimmed — the current model is "snapshot at
// creation": once a screen exists, its theme values are independent of
// the project theme. Stripping them and re-deriving on load would
// surprise the user the moment they change a theme color.

import type {
  Annotation,
  BackgroundGradient,
  BackgroundImageFit,
  BackgroundOverlay,
  BackgroundType,
  BorderSimulation,
  Callout,
  CompositionPreset,
  DeviceShadow,
  FrameStyle,
  LayoutVariant,
  Loupe,
  Overlay,
  ScreenState,
  SpotlightConfig,
  TextGradient,
  TextPosition,
} from '../types';

/**
 * Fields whose default value is fixed (doesn't depend on the active
 * theme or platform). Each of these gets stripped at save time if the
 * screen's value still matches the default, and gets restored at load
 * time when missing from the saved JSON.
 */
export const STATIC_SCREEN_DEFAULTS: {
  isFullscreen: boolean;
  layout: LayoutVariant;
  headlineSize: number;
  subtitleSize: number;
  headlineRotation: number;
  subtitleRotation: number;
  freeText: string;
  freeTextEnabled: boolean;
  freeTextSize: number;
  freeTextRotation: number;
  freeTextLetterSpacing: number;
  freeTextTextTransform: string;
  deviceColor: string;
  frameStyle: FrameStyle;
  composition: CompositionPreset;
  deviceRotation: number;
  deviceOffsetX: number;
  deviceTilt: number;
  headlineGradient: TextGradient | null;
  subtitleGradient: TextGradient | null;
  headlineLineHeight: number;
  headlineLetterSpacing: number;
  headlineTextTransform: string;
  headlineFontStyle: string;
  subtitleOpacity: number;
  subtitleLetterSpacing: number;
  subtitleTextTransform: string;
  spotlight: SpotlightConfig | null;
  annotations: Annotation[];
  textPositions: {
    headline: TextPosition | null;
    subtitle: TextPosition | null;
    freeText: TextPosition | null;
  };
  screenshotDataUrl: string | null;
  screenshotName: string | null;
  screenshotDims: { width: number; height: number } | null;
  backgroundType: BackgroundType;
  backgroundColor: string;
  backgroundGradient: BackgroundGradient;
  backgroundImageDataUrl: string | null;
  backgroundImageFit: BackgroundImageFit;
  backgroundImagePositionX: number;
  backgroundImagePositionY: number;
  backgroundImageScale: number;
  backgroundOverlay: BackgroundOverlay | null;
  deviceShadow: DeviceShadow | null;
  borderSimulation: BorderSimulation | null;
  cornerRadius: number;
  loupe: Loupe | null;
  callouts: Callout[];
  overlays: Overlay[];
  extraDevices: ScreenState['extraDevices'];
} = {
  isFullscreen: false,
  layout: 'center',
  headlineSize: 0,
  subtitleSize: 0,
  headlineRotation: 0,
  subtitleRotation: 0,
  freeText: '',
  freeTextEnabled: false,
  freeTextSize: 0,
  freeTextRotation: 0,
  freeTextLetterSpacing: 0,
  freeTextTextTransform: '',
  deviceColor: '',
  frameStyle: 'flat',
  composition: 'single',
  deviceRotation: 0,
  deviceOffsetX: 0,
  deviceTilt: 0,
  headlineGradient: null,
  subtitleGradient: null,
  headlineLineHeight: 0,
  headlineLetterSpacing: 0,
  headlineTextTransform: '',
  headlineFontStyle: '',
  subtitleOpacity: 0,
  subtitleLetterSpacing: 0,
  subtitleTextTransform: '',
  spotlight: null,
  annotations: [],
  textPositions: { headline: null, subtitle: null, freeText: null },
  screenshotDataUrl: null,
  screenshotName: null,
  screenshotDims: null,
  backgroundType: 'solid',
  backgroundColor: '#ffffff',
  backgroundGradient: {
    type: 'linear',
    colors: ['#6366f1', '#ec4899'],
    direction: 135,
    radialPosition: 'center',
  },
  backgroundImageDataUrl: null,
  backgroundImageFit: 'cover',
  backgroundImagePositionX: 50,
  backgroundImagePositionY: 50,
  backgroundImageScale: 100,
  backgroundOverlay: null,
  deviceShadow: null,
  borderSimulation: null,
  cornerRadius: 0,
  loupe: null,
  callouts: [],
  overlays: [],
  extraDevices: [],
};

// Deep equality for the small shapes carried by STATIC_SCREEN_DEFAULTS
// (primitives, arrays, plain objects). Good enough for our values; we
// never compare functions, Dates, Maps, etc.
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (Array.isArray(b)) return false;
  const ka = Object.keys(a as Record<string, unknown>);
  const kb = Object.keys(b as Record<string, unknown>);
  if (ka.length !== kb.length) return false;
  for (const k of ka) {
    if (!deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])) {
      return false;
    }
  }
  return true;
}

type SlimmedScreen = Partial<ScreenState>;

/**
 * Return a screen with any field that still matches its STATIC default
 * stripped out. Identity fields (id, screenIndex), content
 * (headline, subtitle), and theme-derived fields (font, fontWeight,
 * colors, headlineFont, etc.) are always preserved.
 */
export function slimScreen(screen: ScreenState): SlimmedScreen {
  const slim: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(screen)) {
    if (key in STATIC_SCREEN_DEFAULTS) {
      const defaultValue = (STATIC_SCREEN_DEFAULTS as Record<string, unknown>)[key];
      if (deepEqual(value, defaultValue)) continue;
    }
    slim[key] = value;
  }
  return slim as SlimmedScreen;
}

/**
 * Fill missing fields on a saved (slimmed) screen with their static
 * defaults. The result is NOT necessarily a fully-valid ScreenState —
 * theme-derived fields (font, colors, etc.) and identity fields
 * (id, screenIndex) still need to be present in the input. The
 * store's applyVariantSnapshot path handles those separately.
 */
export function fattenScreen(saved: unknown): Partial<ScreenState> & Record<string, unknown> {
  if (!saved || typeof saved !== 'object') {
    return { ...STATIC_SCREEN_DEFAULTS } as Partial<ScreenState> & Record<string, unknown>;
  }
  // Spread defaults FIRST so saved values win.
  return {
    ...STATIC_SCREEN_DEFAULTS,
    ...(saved as Record<string, unknown>),
  } as Partial<ScreenState> & Record<string, unknown>;
}

/**
 * Walk a project snapshot and slim every screens array we find:
 * the top-level `screens` plus each variant's `snapshot.screens`. The
 * snapshot is treated structurally — we don't import the full
 * ProjectSnapshot type here to keep this module independent of the
 * store circular-dependency tangle.
 */
export function slimProjectSnapshot(snapshot: unknown): unknown {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
    return snapshot;
  }
  const out = { ...(snapshot as Record<string, unknown>) };
  const screens = out.screens;
  if (Array.isArray(screens)) {
    out.screens = screens.map((s) => (s && typeof s === 'object' ? slimScreen(s as ScreenState) : s));
  }
  const variants = out.variants;
  if (Array.isArray(variants)) {
    out.variants = variants.map((variant) => {
      if (!variant || typeof variant !== 'object') return variant;
      const v = variant as Record<string, unknown>;
      const innerSnapshot = v.snapshot;
      if (!innerSnapshot || typeof innerSnapshot !== 'object') return variant;
      const inner = innerSnapshot as Record<string, unknown>;
      const innerScreens = inner.screens;
      if (!Array.isArray(innerScreens)) return variant;
      return {
        ...v,
        snapshot: {
          ...inner,
          screens: innerScreens.map((s) =>
            s && typeof s === 'object' ? slimScreen(s as ScreenState) : s,
          ),
        },
      };
    });
  }
  return out;
}
