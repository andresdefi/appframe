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
  TextShadow,
} from '../types';

/**
 * "Off but ready" shape used as the static default for each text
 * shadow. When the user toggles enabled=true, these become the
 * starting tuned values. Picked to render a clean, soft drop shadow
 * (offsetY=4, blur=8, half-opacity black) — common-case enough that
 * the first enable doesn't look broken.
 */
const TEXT_SHADOW_DEFAULT: TextShadow = {
  enabled: false,
  offsetX: 0,
  offsetY: 4,
  blur: 8,
  color: '#000000',
  opacity: 50,
};

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
  spotlightEnabled: boolean;
  spotlight: SpotlightConfig | null;
  annotations: Annotation[];
  textPositions: {
    headline: TextPosition | null;
    subtitle: TextPosition | null;
    freeText: TextPosition | null;
  };
  screenshotUrl: string | null;
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
  loupeEnabled: boolean;
  loupe: Loupe | null;
  callouts: Callout[];
  overlays: Overlay[];
  extraDevices: ScreenState['extraDevices'];
  headlineShadow: TextShadow;
  subtitleShadow: TextShadow;
  freeTextShadow: TextShadow;
} = {
  isFullscreen: false,
  layout: 'center',
  // Slim-default sizes that match the "reset" px values exposed in the
  // Text tab: 110/55/55. Stored as concrete numbers so the slider readout
  // matches what the renderer draws — no more "0 means auto, slider min-
  // clamps to 40, renderer falls back to preset" round-trip.
  headlineSize: 110,
  subtitleSize: 55,
  headlineRotation: 0,
  subtitleRotation: 0,
  freeText: '',
  freeTextEnabled: false,
  freeTextSize: 55,
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
  spotlightEnabled: false,
  spotlight: null,
  annotations: [],
  textPositions: { headline: null, subtitle: null, freeText: null },
  screenshotUrl: null,
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
  loupeEnabled: false,
  loupe: null,
  callouts: [],
  overlays: [],
  extraDevices: [],
  headlineShadow: TEXT_SHADOW_DEFAULT,
  subtitleShadow: TEXT_SHADOW_DEFAULT,
  freeTextShadow: TEXT_SHADOW_DEFAULT,
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
    // Always persist the spotlight/loupe enabled flag when their
    // corresponding shape data is present, even if the flag itself is
    // at its default. The shape persists across disable so the user
    // can re-enable without losing tweaks; without this, "enabled=
    // false (default)" would be stripped from the file, and on load
    // fattenScreen's legacy migration would see the data and re-infer
    // enabled=true — making "disable then reload" silently flip back
    // to enabled.
    if (key === 'spotlightEnabled' && screen.spotlight) {
      slim[key] = value;
      continue;
    }
    if (key === 'loupeEnabled' && screen.loupe) {
      slim[key] = value;
      continue;
    }
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
  const obj = saved as Record<string, unknown>;
  // Legacy alias: the field used to be called `screenshotDataUrl`, which
  // was misleading because it held an HTTP URL most of the time. Existing
  // project files on disk still use the old name — promote them to the
  // new `screenshotUrl` field on load. Next save writes the new name.
  // The translation is a one-time pass; once a project has been opened
  // and re-saved, the legacy key never appears again.
  let migrated = obj;
  if ('screenshotDataUrl' in obj && !('screenshotUrl' in obj)) {
    const { screenshotDataUrl, ...rest } = obj;
    migrated = { ...rest, screenshotUrl: screenshotDataUrl };
  }
  // Legacy "auto" sentinel for text sizes was `0` / `null`, with the
  // renderer falling back to a preset scale and the slider clamping its
  // display to its min (40 / 20). The new model stores concrete px so
  // the slider readout matches what gets rendered. Promote any legacy
  // 0/null reads to the new explicit defaults (110/55/55) so older
  // projects open in the new state without the user having to click
  // reset per slider.
  const normalized: Record<string, unknown> = { ...migrated };
  for (const key of ['headlineSize', 'subtitleSize', 'freeTextSize'] as const) {
    if (key in normalized) {
      const v = normalized[key];
      if (v === null || v === 0) delete normalized[key];
    }
  }
  // Spotlight / loupe used to be "data present === enabled" (null meant
  // off, otherwise on). The current model splits the on/off switch
  // (`*Enabled`) from the persisted shape, so toggling off and back on
  // doesn't wipe the user's tuned config. For legacy projects, infer
  // the enabled flag from whether the data was present.
  if (!('spotlightEnabled' in normalized) && normalized.spotlight) {
    normalized.spotlightEnabled = true;
  }
  if (!('loupeEnabled' in normalized) && normalized.loupe) {
    normalized.loupeEnabled = true;
  }
  // Spread defaults FIRST so saved values win.
  return {
    ...STATIC_SCREEN_DEFAULTS,
    ...normalized,
  } as Partial<ScreenState> & Record<string, unknown>;
}

/**
 * Walk every record of locale screens (Record<code, ScreenState[]>)
 * and slim each ScreenState inside. Returns a new record with the
 * same keys, or the original value if it isn't a record-of-arrays
 * shape (so malformed input passes through untouched).
 */
function slimLocaleScreens(value: unknown): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const input = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [code, screens] of Object.entries(input)) {
    if (!Array.isArray(screens)) {
      out[code] = screens;
      continue;
    }
    out[code] = screens.map((s) =>
      s && typeof s === 'object' ? slimScreen(s as ScreenState) : s,
    );
  }
  return out;
}

/**
 * Walk a project snapshot and slim every screens array we find:
 * the top-level `screens` and `localeScreens[code][]`, plus each
 * variant's `snapshot.screens` and `snapshot.localeScreens[code][]`.
 * Without slimming the locale arrays, multi-locale projects would
 * carry full default-heavy ScreenState arrays on disk for every
 * locale × screen — undermining the slim persistence model entirely.
 *
 * The snapshot is treated structurally — we don't import the full
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
  if (out.localeScreens) {
    out.localeScreens = slimLocaleScreens(out.localeScreens);
  }
  const variants = out.variants;
  if (Array.isArray(variants)) {
    out.variants = variants.map((variant) => {
      if (!variant || typeof variant !== 'object') return variant;
      const v = variant as Record<string, unknown>;
      const innerSnapshot = v.snapshot;
      if (!innerSnapshot || typeof innerSnapshot !== 'object') return variant;
      const inner = { ...(innerSnapshot as Record<string, unknown>) };
      const innerScreens = inner.screens;
      if (Array.isArray(innerScreens)) {
        inner.screens = innerScreens.map((s) =>
          s && typeof s === 'object' ? slimScreen(s as ScreenState) : s,
        );
      }
      if (inner.localeScreens) {
        inner.localeScreens = slimLocaleScreens(inner.localeScreens);
      }
      return { ...v, snapshot: inner };
    });
  }
  return out;
}
