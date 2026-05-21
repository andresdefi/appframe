import { z } from 'zod';
import { FONT_IDS } from '../fonts/loader.js';

// --- Shared enums/primitives ---

// Colour storage accepts either CSS hex notation or
// `color(display-p3 r g b)`. The app converts hex → P3 losslessly at
// the load boundary (see `color/p3.ts`), but legacy projects on disk
// still hold hex strings and YAML configs can use either form. The
// regex is intentionally permissive on whitespace and decimal format
// for the P3 branch so hand-edited config files stay readable.
const hexColor = z
  .string()
  .regex(
    /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|color\(\s*display-p3\s+-?\d*\.?\d+(?:e[+-]?\d+)?\s+-?\d*\.?\d+(?:e[+-]?\d+)?\s+-?\d*\.?\d+(?:e[+-]?\d+)?(?:\s*\/\s*[\d.]+)?\s*\))$/i,
    'Must be a valid hex or color(display-p3 ...) value',
  );

export const fontIdSchema = z.enum(FONT_IDS as [string, ...string[]]);

export const platformSchema = z.enum(['ios', 'android', 'mac', 'watch']);
export const frameStyleSchema = z.enum(['flat', 'none']);
export const layoutVariantSchema = z.enum(['center', 'angled-left', 'angled-right']);

// --- App section ---

export const appConfigSchema = z.object({
  name: z.string().min(1, 'App name is required'),
  description: z.string().min(1, 'App description is required'),
  platforms: z.array(platformSchema).min(1, 'At least one platform required'),
  features: z.array(z.string()).default([]),
});

// --- Theme section ---

export const colorConfigSchema = z.object({
  primary: hexColor,
  secondary: hexColor,
  background: hexColor,
  text: hexColor,
  subtitle: hexColor.optional(),
  freeText: hexColor.optional(),
});

export const textGradientSchema = z.object({
  colors: z.array(hexColor).min(2).max(5),
  direction: z.number().min(0).max(360).default(90),
});
export type TextGradient = z.infer<typeof textGradientSchema>;

// --- Background ---

export const backgroundGradientSchema = z.object({
  type: z.enum(['linear', 'radial']).default('linear'),
  colors: z.array(hexColor).min(2).max(5),
  direction: z.number().min(0).max(360).default(135),
  radialPosition: z.enum(['center', 'top', 'bottom', 'left', 'right']).default('center'),
});
export type BackgroundGradient = z.infer<typeof backgroundGradientSchema>;

export const backgroundOverlaySchema = z.object({
  color: hexColor,
  opacity: z.number().min(0).max(1).default(0.3),
});

const blendModeSchema = z.enum([
  'normal',
  'multiply',
  'screen',
  'overlay',
  'soft-light',
  'hard-light',
  'lighten',
  'darken',
]);

export const backgroundTypeSchema = z.enum(['preset', 'solid', 'gradient', 'image']);

export const backgroundImageFitSchema = z.enum(['cover', 'contain', 'fill']);
export type BackgroundImageFit = z.infer<typeof backgroundImageFitSchema>;

// --- Device Shadow ---

export const deviceShadowSchema = z.object({
  opacity: z.number().min(0).max(1).default(0.25),
  blur: z.number().min(0).max(50).default(20),
  color: hexColor.default('#000000'),
  offsetY: z.number().min(0).max(30).default(10),
});
export type DeviceShadow = z.infer<typeof deviceShadowSchema>;

// --- Border Simulation ---

export const borderSimulationSchema = z.object({
  enabled: z.boolean().default(false),
  thickness: z.number().min(0).max(20).default(4),
  color: hexColor.default('#1a1a1a'),
  radius: z.number().min(0).max(60).default(40),
});
export type BorderSimulation = z.infer<typeof borderSimulationSchema>;

// --- Loupe ---

export const loupeSchema = z.object({
  sourceX: z.number().min(-1).max(1),
  sourceY: z.number().min(-1).max(1),
  displayX: z.number().min(0).max(100).optional(),
  displayY: z.number().min(0).max(100).optional(),
  width: z.number().min(0.05).max(1).default(0.5),
  height: z.number().min(0.05).max(1).default(0.33),
  // Legacy field — mapped to width at runtime
  size: z.number().min(5).max(50).optional(),
  zoom: z.number().min(1).max(5).default(2.5),
  scale: z.number().min(1).max(3).optional(),
  // Corner radius in PIXELS for the loupe wrapper. Matches the spotlight
  // and annotation sliders — consistent units across all the extras.
  // Capped at 200 px which is enough to fully pill any practical loupe size.
  cornerRadius: z.number().min(0).max(200).default(0),
  borderWidth: z.number().min(0).max(10).default(0),
  borderColor: hexColor.default('#ffffff'),
  shadow: z.boolean().default(false),
  shadowColor: hexColor.default('#000000'),
  shadowRadius: z.number().min(0).max(100).default(30),
  shadowOffsetX: z.number().min(-50).max(50).default(0),
  shadowOffsetY: z.number().min(-50).max(50).default(0),
  xOffset: z.number().min(-100).max(100).default(0),
  yOffset: z.number().min(-100).max(100).default(0),
});
export type Loupe = z.infer<typeof loupeSchema>;

// --- Callout ---

export const calloutSchema = z.object({
  id: z.string(),
  sourceX: z.number().min(0).max(100),
  sourceY: z.number().min(0).max(100),
  sourceW: z.number().min(1).max(100),
  sourceH: z.number().min(1).max(100),
  displayX: z.number().min(0).max(100),
  displayY: z.number().min(0).max(100),
  displayScale: z.number().min(0.5).max(3).default(1),
  rotation: z.number().min(-45).max(45).default(0),
  borderRadius: z.number().min(0).max(30).default(8),
  shadow: z.boolean().default(true),
  borderWidth: z.number().min(0).max(5).default(0),
  borderColor: hexColor.optional(),
  // Card styling: optional background fill behind the cropped content,
  // plus inner padding so the card visually extends past the crop. With
  // background + padding the callout looks like a lifted "card" of the
  // highlighted row, à la App Store feature emphasis layouts.
  background: hexColor.optional(),
  padding: z.number().min(0).max(20).optional(),
  // Multiplies the card's visual size on canvas without changing what
  // portion of the screenshot is shown. Lets the card extend past the
  // device frame ("stand out") while Zoom still controls the content
  // magnification inside it.
  cardScale: z.number().min(0.5).max(3).optional(),
});
export type Callout = z.infer<typeof calloutSchema>;

// --- Overlay ---

export const overlaySchema = z.object({
  id: z.string(),
  type: z.enum(['icon', 'badge', 'star-rating', 'custom', 'shape']),
  imageDataUrl: z.string().optional(),
  // Library-qualified icon identifier (e.g. "lucide:camera"). Set on icon
  // overlays so we can re-fetch the source SVG and recolor it at any time.
  // imageDataUrl stays the rendered cache; iconRef + shapeColor are the
  // canonical source of truth for icon-type overlays.
  iconRef: z.string().optional(),
  // Element position is in canvas-% but can go negative or > 100 so the
  // element can bleed off any edge of the canvas (or sit fully outside).
  x: z.number().min(-100).max(200),
  y: z.number().min(-100).max(200),
  // Element size is in raw canvas pixels (not %) so absolute physical
  // size is predictable regardless of canvas dimensions. Min ~50px keeps
  // elements visible; max lets blobs spill far beyond the canvas for big
  // atmospheric backdrops. Pre-px configs stored size as a 1-50 percentage
  // of canvas width — anything below 50 here is treated as that legacy
  // value and converted using the standard 1290px reference.
  size: z.preprocess(
    (v) => {
      if (typeof v !== 'number') return v;
      if (v < 50) return Math.max(50, Math.round(v * 12.9));
      return v;
    },
    z.number().min(20).max(3000).default(200),
  ),
  rotation: z.number().min(-180).max(180).default(0),
  opacity: z.number().min(0).max(1).default(1),
  shapeType: z.enum(['circle', 'rectangle', 'line', 'arrow']).optional(),
  shapeColor: hexColor.optional(),
  shapeOpacity: z.number().min(0).max(1).optional(),
  shapeBlur: z.number().min(0).max(30).optional(),
  // Stacking tier. "front" sits above everything, "default" sits above
  // device + text (current behavior), "behind-text" sits under text but
  // still above the device frame, and "behind-device" tucks under the
  // device frame while remaining above the canvas background.
  layer: z.enum(['front', 'default', 'behind-text', 'behind-device']).optional(),
  // CSS mix-blend-mode applied to the overlay wrapper. Lets blobs / shapes
  // blend with the canvas background (multiply, screen, overlay, etc.).
  // Heavy CSS blur applied to the whole element. Lets a flat-color blob
  // become an atmospheric glow at 80-150px+ — the modern Stripe/Coinbase
  // background aesthetic. Distinct from the shape-internal shapeBlur
  // (small range, shape-only).
  softBlur: z.number().min(0).max(200).optional(),
  blendMode: z
    .enum([
      'normal',
      'multiply',
      'screen',
      'overlay',
      'soft-light',
      'hard-light',
      'darken',
      'lighten',
      'color-dodge',
      'color-burn',
      'difference',
      'exclusion',
    ])
    .optional(),
});
export type Overlay = z.infer<typeof overlaySchema>;

const panoramicBackgroundGradientLayerSchema = z.object({
  kind: z.literal('gradient'),
  gradientType: z.enum(['linear', 'radial', 'mesh']).default('linear'),
  colors: z.array(hexColor).min(2).max(6),
  direction: z.number().min(0).max(360).default(135),
  radialPosition: z.enum(['center', 'top', 'bottom', 'left', 'right']).default('center'),
  opacity: z.number().min(0).max(1).default(1),
  blendMode: blendModeSchema.default('normal'),
  blur: z.number().min(0).max(240).default(0),
});

const panoramicBackgroundImageLayerSchema = z.object({
  kind: z.literal('image'),
  image: z.string().min(1),
  fit: z.enum(['cover', 'contain', 'tile']).default('cover'),
  position: z.enum(['center', 'top', 'bottom', 'left', 'right']).default('center'),
  scale: z.number().min(10).max(400).default(100).describe('Percent scale for contain/tile layers'),
  opacity: z.number().min(0).max(1).default(1),
  blendMode: blendModeSchema.default('normal'),
  blur: z.number().min(0).max(240).default(0),
});

const panoramicBackgroundGlowLayerSchema = z.object({
  kind: z.literal('glow'),
  color: hexColor.default('#FFFFFF'),
  x: z.number().min(-50).max(150).default(50),
  y: z.number().min(-50).max(150).default(50),
  width: z.number().min(1).max(200).default(36),
  height: z.number().min(1).max(200).default(36),
  opacity: z.number().min(0).max(1).default(0.45),
  blur: z.number().min(0).max(320).default(80),
  blendMode: blendModeSchema.default('screen'),
});

const panoramicBackgroundSolidLayerSchema = z.object({
  kind: z.literal('solid'),
  color: hexColor,
  opacity: z.number().min(0).max(1).default(1),
  blendMode: blendModeSchema.default('normal'),
  blur: z.number().min(0).max(240).default(0),
});

export const panoramicBackgroundLayerSchema = z.discriminatedUnion('kind', [
  panoramicBackgroundGradientLayerSchema,
  panoramicBackgroundImageLayerSchema,
  panoramicBackgroundGlowLayerSchema,
  panoramicBackgroundSolidLayerSchema,
]);

export const themeConfigSchema = z.object({
  colors: colorConfigSchema,
  font: fontIdSchema.default('inter'),
  fontWeight: z.number().int().min(100).max(900).default(600),
  headlineSize: z.number().int().min(12).max(200).optional(),
  subtitleSize: z.number().int().min(8).max(120).optional(),
  headlineGradient: textGradientSchema.optional(),
  subtitleGradient: textGradientSchema.optional(),
  // Background overrides
  backgroundType: backgroundTypeSchema.optional(),
  backgroundColor: hexColor.optional(),
  backgroundGradient: backgroundGradientSchema.optional(),
  backgroundImage: z.string().optional(),
  backgroundImageFit: backgroundImageFitSchema.optional(),
  backgroundImagePositionX: z.number().min(0).max(100).optional(),
  backgroundImagePositionY: z.number().min(0).max(100).optional(),
  backgroundImageScale: z.number().min(50).max(300).optional(),
  backgroundOverlay: backgroundOverlaySchema.optional(),
  // Typography overrides (override preset defaults when specified)
  headlineLineHeight: z.number().min(0.8).max(2).optional(),
  headlineLetterSpacing: z.string().optional(),
  headlineTextTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
  headlineFontStyle: z.enum(['normal', 'italic']).optional(),
  subtitleOpacity: z.number().min(0).max(1).optional(),
  subtitleLetterSpacing: z.string().optional(),
  subtitleTextTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
  // Device positioning overrides (override preset defaults when specified)
  deviceScale: z.number().min(50).max(100).optional(),
  deviceTop: z.number().min(-80).max(80).optional(),
  // Per-element font/weight overrides (fall back to global font/fontWeight when unset)
  headlineFont: fontIdSchema.optional(),
  headlineFontWeight: z.number().int().min(100).max(900).optional(),
  subtitleFont: fontIdSchema.optional(),
  subtitleFontWeight: z.number().int().min(100).max(900).optional(),
  // Free text: theme-level font/weight defaults
  freeTextFont: fontIdSchema.optional(),
  freeTextFontWeight: z.number().int().min(100).max(900).optional(),
});

// --- Frames section ---

export const frameConfigSchema = z.object({
  ios: z.string().optional(),
  android: z.string().optional(),
  style: frameStyleSchema.default('flat'),
  deviceColor: z.string().optional(),
});

// --- Composition ---

export const compositionPresetSchema = z.enum([
  'single',
  'duo-overlap',
  'duo-split',
  'hero-tilt',
  'fanned-cards',
]);

export const compositionDeviceSchema = z.object({
  screenshot: z.string().min(1),
  device: z.string().optional(),
});

// --- Screen section ---

// --- Spotlight ---

export const spotlightConfigSchema = z.object({
  x: z.number().min(0).max(100).default(50),
  y: z.number().min(0).max(100).default(50),
  w: z.number().min(5).max(100).default(30),
  h: z.number().min(5).max(100).default(30),
  shape: z.enum(['circle', 'rectangle']).default('rectangle'),
  dimOpacity: z.number().min(0).max(1).default(0.6),
  blur: z.number().min(0).max(30).default(0),
  // Corner radius in pixels for the rectangle shape. Ignored when shape is
  // 'circle' (the cutout already uses border-radius: 50%).
  borderRadius: z.number().min(0).max(200).default(0),
});
export type SpotlightConfig = z.infer<typeof spotlightConfigSchema>;

// --- Annotation ---

export const annotationSchema = z.object({
  id: z.string().default(''),
  // 'rounded-rect' is kept in the enum for backward compatibility with
  // older project files. New annotations only use 'circle' or 'rectangle'
  // — corner radius is controlled by `borderRadius` instead of a separate
  // shape value. Hydration normalizes 'rounded-rect' into 'rectangle' +
  // a sensible default radius.
  shape: z.enum(['circle', 'rounded-rect', 'rectangle']).default('rectangle'),
  x: z.number().min(0).max(100).default(40),
  y: z.number().min(0).max(100).default(40),
  w: z.number().min(1).max(100).default(20),
  h: z.number().min(1).max(100).default(20),
  strokeColor: hexColor.default('#FF3B30'),
  strokeWidth: z.number().min(1).max(20).default(4),
  fillColor: hexColor.optional(),
  /** Corner radius in pixels for the rectangle shape. Ignored when shape
   *  is 'circle' (the shape uses border-radius: 50%). */
  borderRadius: z.number().min(0).max(200).default(0),
});
export type Annotation = z.infer<typeof annotationSchema>;

// --- Screen section ---

export const screenConfigSchema = z.object({
  screenshot: z.string().min(1, 'Screenshot path is required'),
  headline: z.string().min(1, 'Headline is required'),
  subtitle: z.string().optional(),
  layout: layoutVariantSchema.default('center'),
  isFullscreen: z.boolean().optional(),
  device: z.string().optional(),
  background: z.string().optional(),
  composition: compositionPresetSchema.default('single'),
  extraDevices: z.array(compositionDeviceSchema).optional(),
  spotlight: spotlightConfigSchema.optional(),
  annotations: z.array(annotationSchema).default([]),
  // Per-screen background overrides (take precedence over theme-level background)
  backgroundType: backgroundTypeSchema.optional(),
  backgroundColor: hexColor.optional(),
  backgroundGradient: backgroundGradientSchema.optional(),
  backgroundImage: z.string().optional(),
  backgroundImageFit: backgroundImageFitSchema.optional(),
  backgroundImagePositionX: z.number().min(0).max(100).optional(),
  backgroundImagePositionY: z.number().min(0).max(100).optional(),
  backgroundImageScale: z.number().min(50).max(300).optional(),
  backgroundOverlay: backgroundOverlaySchema.optional(),
  // Device enhancements
  deviceShadow: deviceShadowSchema.optional(),
  borderSimulation: borderSimulationSchema.optional(),
  cornerRadius: z.number().min(0).max(50).optional(),
  // Effects
  loupe: loupeSchema.optional(),
  callouts: z.array(calloutSchema).optional(),
  overlays: z.array(overlaySchema).optional(),
  // Per-element font/weight overrides (screen wins over theme; undefined falls back to global)
  headlineFont: fontIdSchema.optional(),
  headlineFontWeight: z.number().int().min(100).max(900).optional(),
  subtitleFont: fontIdSchema.optional(),
  subtitleFontWeight: z.number().int().min(100).max(900).optional(),
  // Free text: third text slot per screen — toggleable, fully styleable.
  // When freeTextEnabled is true and freeText has content, the engine
  // renders a <div class="free-text"> below the subtitle in .text-area.
  freeText: z.string().optional(),
  freeTextEnabled: z.boolean().optional(),
  freeTextSize: z.number().int().min(8).max(200).optional(),
  freeTextFont: fontIdSchema.optional(),
  freeTextFontWeight: z.number().int().min(100).max(900).optional(),
  freeTextRotation: z.number().min(-30).max(30).optional(),
  freeTextLetterSpacing: z.string().optional(),
  freeTextTextTransform: z.enum(['', 'none', 'uppercase', 'lowercase', 'capitalize']).optional(),
});

// --- Locale section ---

// Each locale screen carries the same fields as the default screen
// config, all optional. The snapshot-at-add-time model persists the
// locale's full ScreenState here; older projects (pre-snapshot) may have
// only the text fields populated. Downstream consumers read whichever
// fields are present.
export const localeScreenConfigSchema = screenConfigSchema.partial();

export const localePanoramicElementConfigSchema = z.object({
  content: z.string().min(1).optional(),
  screenshot: z.string().min(1).optional(),
});

export const localePanoramicConfigSchema = z.object({
  elements: z.array(localePanoramicElementConfigSchema),
});

export const localeConfigSchema = z.object({
  label: z.string().min(1).optional(),
  screens: z.array(localeScreenConfigSchema).optional(),
  panoramic: localePanoramicConfigSchema.optional(),
});

// --- Output section ---

export const iosOutputConfigSchema = z.object({
  sizes: z.array(z.number()).default([6.9, 6.5]),
  format: z.enum(['png', 'jpeg']).default('png'),
  quality: z.number().int().min(1).max(100).optional(),
});

export const androidOutputConfigSchema = z.object({
  sizes: z.array(z.string()).default(['phone']),
  format: z.enum(['png', 'jpeg']).default('png'),
  quality: z.number().int().min(1).max(100).optional(),
  featureGraphic: z.boolean().default(false),
});

export const macOutputConfigSchema = z.object({
  sizes: z.array(z.string()).default(['2560x1600']),
  format: z.enum(['png', 'jpeg']).default('png'),
  quality: z.number().int().min(1).max(100).optional(),
});

export const watchOutputConfigSchema = z.object({
  sizes: z.array(z.string()).default(['ultra', 's7']),
  format: z.enum(['png', 'jpeg']).default('png'),
  quality: z.number().int().min(1).max(100).optional(),
});

export const outputConfigSchema = z.object({
  platforms: z.array(platformSchema).min(1),
  ios: iosOutputConfigSchema.optional(),
  android: androidOutputConfigSchema.optional(),
  mac: macOutputConfigSchema.optional(),
  watch: watchOutputConfigSchema.optional(),
  directory: z.string().default('./output'),
});

// --- Panoramic mode ---

export const panoramicBackgroundSchema = z.object({
  type: z.enum(['solid', 'gradient', 'image', 'preset']).default('solid'),
  color: hexColor.optional(),
  gradient: backgroundGradientSchema.optional(),
  image: z.string().optional(),
  overlay: z
    .object({
      color: hexColor.default('#000000'),
      opacity: z.number().min(0).max(1).default(0.3),
    })
    .optional(),
  preset: z.string().optional(),
  layers: z.array(panoramicBackgroundLayerSchema).optional(),
});

const panoramicDeviceElementSchema = z.object({
  type: z.literal('device'),
  screenshot: z.string().min(1),
  localeSourceScreen: z.number().int().min(0).optional(),
  frame: z.string().optional(),
  deviceColor: z.string().optional(),
  frameStyle: frameStyleSchema.default('flat'),
  x: z.number().min(-50).max(150).describe('Horizontal position as % of total canvas width'),
  y: z.number().min(-50).max(150).describe('Vertical position as % of canvas height'),
  width: z.number().min(5).max(100).describe('Device width as % of canvas width'),
  rotation: z.number().min(-180).max(180).default(0),
  deviceScale: z.number().min(50).max(100).default(92),
  deviceTop: z.number().min(-80).max(80).default(15),
  deviceOffsetX: z.number().min(-80).max(80).default(0),
  deviceAngle: z.number().min(2).max(45).default(8),
  deviceTilt: z.number().min(0).max(40).default(0),
  cornerRadius: z.number().min(0).max(50).default(0),
  fullscreenScreenshot: z.boolean().default(false),
  z: z.number().int().min(0).max(100).default(1),
  shadow: deviceShadowSchema.optional(),
  borderSimulation: borderSimulationSchema.optional(),
});

const panoramicTextElementSchema = z.object({
  type: z.literal('text'),
  content: z.string().min(1),
  localeSourceScreen: z.number().int().min(0).optional(),
  localeSourceField: z.enum(['headline', 'subtitle']).optional(),
  x: z.number().min(-50).max(150),
  y: z.number().min(-50).max(150),
  fontSize: z.number().min(0.5).max(20).describe('Font size as % of canvas height'),
  color: hexColor.default('#FFFFFF'),
  font: fontIdSchema.optional().describe('Per-element font override (defaults to theme font)'),
  fontWeight: z.number().int().min(100).max(900).default(700),
  fontStyle: z.enum(['normal', 'italic']).default('normal'),
  textAlign: z.enum(['left', 'center', 'right']).default('left'),
  maxWidth: z.number().min(1).max(100).optional().describe('Max width as % of canvas width'),
  lineHeight: z.number().min(0.8).max(2).default(1.15),
  letterSpacing: z.number().min(-5).max(10).default(0).describe('Letter spacing in 0.01em units'),
  textTransform: z.enum(['', 'none', 'uppercase', 'lowercase', 'capitalize']).default(''),
  rotation: z.number().min(-30).max(30).default(0),
  gradient: backgroundGradientSchema.optional().describe('Text gradient (overrides solid color)'),
  z: z.number().int().min(0).max(100).default(10),
});

const panoramicLabelElementSchema = z.object({
  type: z.literal('label'),
  content: z.string().min(1),
  localeSourceScreen: z.number().int().min(0).optional(),
  localeSourceField: z.enum(['headline', 'subtitle']).optional(),
  x: z.number().min(-50).max(150),
  y: z.number().min(-50).max(150),
  fontSize: z.number().min(0.5).max(10).default(1.5),
  color: hexColor.default('#FFFFFF'),
  backgroundColor: hexColor.optional(),
  padding: z.number().min(0).max(5).default(0.5).describe('Padding as % of canvas height'),
  borderRadius: z.number().min(0).max(50).default(8),
  z: z.number().int().min(0).max(100).default(10),
});

const panoramicDecorationElementSchema = z.object({
  type: z.literal('decoration'),
  shape: z.enum(['circle', 'rectangle', 'line', 'dot-grid']),
  x: z.number().min(-50).max(150),
  y: z.number().min(-50).max(150),
  width: z.number().min(0.5).max(100),
  height: z.number().min(0.5).max(100).optional(),
  color: hexColor.default('#FFFFFF'),
  opacity: z.number().min(0).max(1).default(0.2),
  rotation: z.number().min(-180).max(180).default(0),
  z: z.number().int().min(0).max(100).default(0),
});

const panoramicImageElementSchema = z.object({
  type: z.literal('image'),
  src: z.string().min(1),
  x: z.number().min(-50).max(150),
  y: z.number().min(-50).max(150),
  width: z.number().min(0.5).max(100),
  height: z.number().min(0.5).max(100),
  fit: z.enum(['contain', 'cover']).default('contain'),
  opacity: z.number().min(0).max(1).default(1),
  rotation: z.number().min(-180).max(180).default(0),
  borderRadius: z.number().min(0).max(100).default(0),
  shadow: deviceShadowSchema.optional(),
  z: z.number().int().min(0).max(100).default(4),
});

const panoramicLogoElementSchema = z.object({
  type: z.literal('logo'),
  src: z.string().min(1),
  x: z.number().min(-50).max(150),
  y: z.number().min(-50).max(150),
  width: z.number().min(0.5).max(100),
  height: z.number().min(0.5).max(100),
  fit: z.enum(['contain', 'cover']).default('contain'),
  opacity: z.number().min(0).max(1).default(1),
  rotation: z.number().min(-180).max(180).default(0),
  padding: z.number().min(0).max(10).default(1.4).describe('Padding as % of canvas height'),
  backgroundColor: hexColor.optional(),
  borderRadius: z.number().min(0).max(100).default(24),
  shadow: deviceShadowSchema.optional(),
  z: z.number().int().min(0).max(100).default(8),
});

const panoramicCropElementSchema = z.object({
  type: z.literal('crop'),
  screenshot: z.string().min(1),
  localeSourceScreen: z.number().int().min(0).optional(),
  x: z.number().min(-50).max(150),
  y: z.number().min(-50).max(150),
  width: z.number().min(1).max(100),
  height: z.number().min(1).max(100),
  focusX: z.number().min(0).max(100).default(50),
  focusY: z.number().min(0).max(100).default(50),
  zoom: z.number().min(1).max(4).default(1.4),
  rotation: z.number().min(-180).max(180).default(0),
  borderRadius: z.number().min(0).max(100).default(24),
  shadow: deviceShadowSchema.optional(),
  z: z.number().int().min(0).max(100).default(7),
});

const panoramicCardElementSchema = z.object({
  type: z.literal('card'),
  x: z.number().min(-50).max(150),
  y: z.number().min(-50).max(150),
  width: z.number().min(1).max(100),
  height: z.number().min(1).max(100),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  align: z.enum(['left', 'center']).default('left'),
  backgroundColor: hexColor.default('#FFFFFF'),
  opacity: z.number().min(0).max(1).default(1),
  borderColor: hexColor.optional(),
  borderWidth: z.number().min(0).max(20).default(0),
  borderRadius: z.number().min(0).max(100).default(28),
  padding: z.number().min(0).max(10).default(2.2).describe('Padding as % of canvas height'),
  rotation: z.number().min(-180).max(180).default(0),
  shadow: deviceShadowSchema.optional(),
  eyebrowColor: hexColor.default('#64748B'),
  titleColor: hexColor.default('#0F172A'),
  bodyColor: hexColor.default('#475569'),
  eyebrowSize: z.number().min(0.5).max(6).default(1.1),
  titleSize: z.number().min(0.5).max(10).default(2.4),
  bodySize: z.number().min(0.5).max(6).default(1.4),
  z: z.number().int().min(0).max(100).default(9),
});

const panoramicBadgeElementSchema = z.object({
  type: z.literal('badge'),
  content: z.string().min(1),
  localeSourceScreen: z.number().int().min(0).optional(),
  localeSourceField: z.enum(['headline', 'subtitle']).optional(),
  x: z.number().min(-50).max(150),
  y: z.number().min(-50).max(150),
  width: z.number().min(1).max(100),
  height: z.number().min(0.5).max(100).default(6),
  color: hexColor.default('#0F172A'),
  backgroundColor: hexColor.default('#FFFFFF'),
  opacity: z.number().min(0).max(1).default(1),
  borderColor: hexColor.optional(),
  borderWidth: z.number().min(0).max(20).default(0),
  borderRadius: z.number().min(0).max(100).default(999),
  fontSize: z.number().min(0.5).max(6).default(1.3),
  fontWeight: z.number().int().min(100).max(900).default(700),
  letterSpacing: z.number().min(-5).max(20).default(12).describe('Letter spacing in 0.01em units'),
  textTransform: z.enum(['', 'none', 'uppercase', 'lowercase', 'capitalize']).default('uppercase'),
  rotation: z.number().min(-180).max(180).default(0),
  shadow: deviceShadowSchema.optional(),
  z: z.number().int().min(0).max(100).default(12),
});

const panoramicProofChipElementSchema = z.object({
  type: z.literal('proof-chip'),
  value: z.string().min(1),
  detail: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  maxRating: z.number().int().min(1).max(5).default(5),
  x: z.number().min(-50).max(150),
  y: z.number().min(-50).max(150),
  width: z.number().min(1).max(100),
  height: z.number().min(1).max(100).default(9),
  color: hexColor.default('#0F172A'),
  mutedColor: hexColor.default('#64748B'),
  starColor: hexColor.default('#F59E0B'),
  backgroundColor: hexColor.default('#FFFFFF'),
  opacity: z.number().min(0).max(1).default(1),
  borderColor: hexColor.optional(),
  borderWidth: z.number().min(0).max(20).default(0),
  borderRadius: z.number().min(0).max(100).default(28),
  valueSize: z.number().min(0.5).max(8).default(2.1),
  detailSize: z.number().min(0.5).max(6).default(1.1),
  padding: z.number().min(0).max(10).default(1.6).describe('Padding as % of canvas height'),
  rotation: z.number().min(-180).max(180).default(0),
  shadow: deviceShadowSchema.optional(),
  z: z.number().int().min(0).max(100).default(11),
});

const panoramicChildElementSchema = z.discriminatedUnion('type', [
  panoramicDeviceElementSchema,
  panoramicTextElementSchema,
  panoramicLabelElementSchema,
  panoramicDecorationElementSchema,
  panoramicImageElementSchema,
  panoramicLogoElementSchema,
  panoramicCropElementSchema,
  panoramicCardElementSchema,
  panoramicBadgeElementSchema,
  panoramicProofChipElementSchema,
]);

const panoramicGroupElementSchema = z.object({
  type: z.literal('group'),
  x: z.number().min(-50).max(150),
  y: z.number().min(-50).max(150),
  width: z.number().min(1).max(100),
  height: z.number().min(1).max(100),
  rotation: z.number().min(-180).max(180).default(0),
  opacity: z.number().min(0).max(1).default(1),
  z: z.number().int().min(0).max(100).default(6),
  children: z.array(panoramicChildElementSchema).min(1, 'Group must include at least one child'),
});

export const panoramicElementSchema = z.discriminatedUnion('type', [
  panoramicDeviceElementSchema,
  panoramicTextElementSchema,
  panoramicLabelElementSchema,
  panoramicDecorationElementSchema,
  panoramicImageElementSchema,
  panoramicLogoElementSchema,
  panoramicCropElementSchema,
  panoramicCardElementSchema,
  panoramicBadgeElementSchema,
  panoramicProofChipElementSchema,
  panoramicGroupElementSchema,
]);

export const panoramicConfigSchema = z.object({
  background: panoramicBackgroundSchema.default({ type: 'solid' }),
  elements: z.array(panoramicElementSchema).min(1, 'At least one element is required'),
});

// --- Full config ---

export const appframeConfigSchema = z
  .object({
    mode: z.enum(['individual', 'panoramic']).default('individual'),
    app: appConfigSchema,
    theme: themeConfigSchema,
    frames: frameConfigSchema.default({ style: 'flat' }),
    screens: z.array(screenConfigSchema).default([]),
    frameCount: z.number().int().min(2).max(10).optional(),
    panoramic: panoramicConfigSchema.optional(),
    locales: z.record(z.string(), localeConfigSchema).optional(),
    output: outputConfigSchema,
  })
  .refine(
    (config) => {
      if (config.mode === 'individual') return config.screens.length >= 1;
      return true;
    },
    {
      message: 'At least one screen is required in individual mode',
      path: ['screens'],
    },
  )
  .refine(
    (config) => {
      if (config.mode === 'panoramic') return config.panoramic != null;
      return true;
    },
    {
      message: 'The "panoramic" section is required when mode is "panoramic"',
      path: ['panoramic'],
    },
  )
  .refine(
    (config) => {
      if (config.mode === 'panoramic') return config.frameCount != null && config.frameCount >= 2;
      return true;
    },
    {
      message: '"frameCount" (>= 2) is required when mode is "panoramic"',
      path: ['frameCount'],
    },
  )
  .refine(
    (config) => {
      if (!config.locales) return true;
      return Object.values(config.locales).every(
        (locale) =>
          config.mode !== 'individual' || locale.screens?.length === config.screens.length,
      );
    },
    {
      message: 'Each locale must have the same number of screens as the main screens array',
      path: ['locales'],
    },
  )
  .refine(
    (config) => {
      if (!config.locales || config.mode !== 'panoramic' || !config.panoramic) return true;
      return Object.values(config.locales).every(
        (locale) =>
          locale.panoramic?.elements === undefined ||
          locale.panoramic.elements.length === config.panoramic!.elements.length,
      );
    },
    {
      message:
        'Each locale panoramic override must have the same number of elements as the main panoramic elements array',
      path: ['locales'],
    },
  )
  ;

// --- Inferred types ---

export type Platform = z.infer<typeof platformSchema>;
export type FrameStyle = z.infer<typeof frameStyleSchema>;
export type LayoutVariant = z.infer<typeof layoutVariantSchema>;
export type AppConfig = z.infer<typeof appConfigSchema>;
export type ColorConfig = z.infer<typeof colorConfigSchema>;
export type ThemeConfig = z.infer<typeof themeConfigSchema>;
export type FrameConfig = z.infer<typeof frameConfigSchema>;
export type CompositionPreset = z.infer<typeof compositionPresetSchema>;
export type ScreenConfig = z.infer<typeof screenConfigSchema>;
export type LocaleScreenConfig = z.infer<typeof localeScreenConfigSchema>;
export type LocaleConfig = z.infer<typeof localeConfigSchema>;
export type IOSOutputConfig = z.infer<typeof iosOutputConfigSchema>;
export type AndroidOutputConfig = z.infer<typeof androidOutputConfigSchema>;
export type MacOutputConfig = z.infer<typeof macOutputConfigSchema>;
export type WatchOutputConfig = z.infer<typeof watchOutputConfigSchema>;
export type OutputConfig = z.infer<typeof outputConfigSchema>;
export type AppframeConfig = z.infer<typeof appframeConfigSchema>;
export type BackgroundType = z.infer<typeof backgroundTypeSchema>;
export type BackgroundOverlay = z.infer<typeof backgroundOverlaySchema>;
export type PanoramicElement = z.infer<typeof panoramicElementSchema>;
export type PanoramicConfig = z.infer<typeof panoramicConfigSchema>;
export type PanoramicBackground = z.infer<typeof panoramicBackgroundSchema>;
export type PanoramicBackgroundLayer = z.infer<typeof panoramicBackgroundLayerSchema>;
