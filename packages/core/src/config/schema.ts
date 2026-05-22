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
  colors: z.array(hexColor).min(2).max(5).describe('2-5 hex/P3 color stops applied across the text glyphs.'),
  direction: z
    .number()
    .min(0)
    .max(360)
    .default(90)
    .describe('Gradient direction in degrees (0 = bottom-to-top, 90 = left-to-right, ...).'),
});
export type TextGradient = z.infer<typeof textGradientSchema>;

// --- Background ---

export const backgroundGradientSchema = z.object({
  type: z
    .enum(['linear', 'radial'])
    .default('linear')
    .describe('Gradient shape. "linear" uses `direction`; "radial" uses `radialPosition`.'),
  colors: z.array(hexColor).min(2).max(5).describe('2-5 hex/P3 color stops, evenly distributed.'),
  direction: z
    .number()
    .min(0)
    .max(360)
    .default(135)
    .describe('Degrees for linear gradients. 135 is the top-left to bottom-right default.'),
  radialPosition: z
    .enum(['center', 'top', 'bottom', 'left', 'right'])
    .default('center')
    .describe('Origin for radial gradients.'),
});
export type BackgroundGradient = z.infer<typeof backgroundGradientSchema>;

export const backgroundOverlaySchema = z.object({
  color: hexColor.describe('Tint color painted on top of the background image/gradient.'),
  opacity: z
    .number()
    .min(0)
    .max(1)
    .default(0.3)
    .describe('Tint opacity (0 = invisible, 1 = fully cover the background).'),
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
  opacity: z.number().min(0).max(1).default(0.25).describe('Shadow alpha 0-1.'),
  blur: z.number().min(0).max(50).default(20).describe('Shadow blur radius in pixels.'),
  color: hexColor.default('#000000').describe('Shadow color (hex or display-p3).'),
  offsetY: z
    .number()
    .min(0)
    .max(30)
    .default(10)
    .describe('Vertical shadow offset in pixels. 0 = centered glow, higher = drops further down.'),
});
export type DeviceShadow = z.infer<typeof deviceShadowSchema>;

// --- Border Simulation ---

export const borderSimulationSchema = z.object({
  enabled: z.boolean().default(false).describe('On/off toggle. False hides the border without losing thickness/color/radius.'),
  thickness: z.number().min(0).max(20).default(4).describe('Border thickness in pixels.'),
  color: hexColor.default('#1a1a1a').describe('Border color (hex or display-p3).'),
  radius: z
    .number()
    .min(0)
    .max(60)
    .default(40)
    .describe('CSS border-radius in pixels — round the simulated bezel corners.'),
});
export type BorderSimulation = z.infer<typeof borderSimulationSchema>;

// --- Loupe ---

export const loupeSchema = z.object({
  sourceX: z
    .number()
    .min(-1)
    .max(1)
    .describe('Source X on the device screen (-1 = left edge, 0 = center, 1 = right edge).'),
  sourceY: z
    .number()
    .min(-1)
    .max(1)
    .describe('Source Y on the device screen (-1 = top edge, 0 = center, 1 = bottom edge).'),
  displayX: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe('Where to place the magnified box on the canvas (X %, 0-100).'),
  displayY: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe('Where to place the magnified box on the canvas (Y %, 0-100).'),
  width: z
    .number()
    .min(0.05)
    .max(1)
    .default(0.5)
    .describe('Loupe width as a FRACTION of the preview canvas (0.05-1, not percent).'),
  height: z
    .number()
    .min(0.05)
    .max(1)
    .default(0.33)
    .describe('Loupe height as a FRACTION of the preview canvas (0.05-1, not percent).'),
  size: z
    .number()
    .min(5)
    .max(50)
    .optional()
    .describe('Legacy field — mapped to `width` at runtime. New projects should use `width`.'),
  zoom: z
    .number()
    .min(1)
    .max(5)
    .default(2.5)
    .describe('Magnification factor. 1 = same scale as the device, 2.5 = 2.5x bigger, 5 = max.'),
  scale: z
    .number()
    .min(1)
    .max(3)
    .optional()
    .describe('Legacy alias for zoom on older projects. Renderer prefers `zoom` if both are set.'),
  cornerRadius: z
    .number()
    .min(0)
    .max(200)
    .default(0)
    .describe('Loupe wrapper corner radius in pixels. Cap at 200 = fully pilled at typical sizes.'),
  borderWidth: z.number().min(0).max(10).default(0).describe('Loupe border thickness in pixels.'),
  borderColor: hexColor.default('#ffffff').describe('Loupe border color (hex or display-p3).'),
  shadow: z.boolean().default(false).describe('Toggle drop shadow under the loupe wrapper.'),
  shadowColor: hexColor.default('#000000').describe('Shadow color when `shadow` is true.'),
  shadowRadius: z.number().min(0).max(100).default(30).describe('Shadow blur radius in pixels.'),
  shadowOffsetX: z.number().min(-50).max(50).default(0).describe('Shadow X offset in pixels.'),
  shadowOffsetY: z.number().min(-50).max(50).default(0).describe('Shadow Y offset in pixels.'),
  xOffset: z
    .number()
    .min(-100)
    .max(100)
    .default(0)
    .describe('Fine X pan in pixels — moves the magnified content inside the loupe.'),
  yOffset: z
    .number()
    .min(-100)
    .max(100)
    .default(0)
    .describe('Fine Y pan in pixels — moves the magnified content inside the loupe.'),
});
export type Loupe = z.infer<typeof loupeSchema>;

// --- Callout ---

export const calloutSchema = z.object({
  id: z.string().describe('Stable id (e.g. "callout-<8 hex chars>"). Used as React key + for removal.'),
  sourceX: z.number().min(0).max(100).describe('Source crop top-left X on the screenshot (0-100, %).'),
  sourceY: z.number().min(0).max(100).describe('Source crop top-left Y on the screenshot (0-100, %).'),
  sourceW: z.number().min(1).max(100).describe('Source crop width on the screenshot (1-100, %).'),
  sourceH: z.number().min(1).max(100).describe('Source crop height on the screenshot (1-100, %).'),
  displayX: z.number().min(0).max(100).describe('Card position X on the canvas (0-100, %).'),
  displayY: z.number().min(0).max(100).describe('Card position Y on the canvas (0-100, %).'),
  displayScale: z
    .number()
    .min(0.5)
    .max(3)
    .default(1)
    .describe('Magnifies content inside the card without changing the crop region.'),
  rotation: z.number().min(-45).max(45).default(0).describe('Card rotation in degrees.'),
  borderRadius: z.number().min(0).max(30).default(8).describe('Card corner radius in pixels.'),
  shadow: z.boolean().default(true).describe('Drop shadow under the card.'),
  borderWidth: z.number().min(0).max(5).default(0).describe('Card border thickness in pixels.'),
  borderColor: hexColor.optional().describe('Card border color (hex or display-p3) when borderWidth > 0.'),
  background: hexColor
    .optional()
    .describe('Optional card background fill behind the cropped content (App-Store-style "lifted card").'),
  padding: z
    .number()
    .min(0)
    .max(20)
    .optional()
    .describe('Inner padding between the card edge and the cropped content, in pixels.'),
  cardScale: z
    .number()
    .min(0.5)
    .max(3)
    .optional()
    .describe(
      "Multiplies the card's visual size on canvas without changing what portion of the screenshot is shown.",
    ),
  sourceLocked: z
    .boolean()
    .optional()
    .describe(
      'When true, sourceX/sourceY are the actual crop coordinates and dragging the card only moves the card. Default for new callouts and drag-to-select. Legacy callouts (omitted) follow the card position.',
    ),
});
export type Callout = z.infer<typeof calloutSchema>;

// --- Overlay ---

export const overlaySchema = z.object({
  id: z.string().describe('Stable id (e.g. "overlay-<8 hex>"). Used as React key + for removal.'),
  type: z
    .enum(['icon', 'badge', 'star-rating', 'custom', 'shape'])
    .describe(
      'Overlay kind. "icon" needs iconRef; "shape" needs shapeType+shapeColor; "custom" needs imageDataUrl; "badge"/"star-rating" are preset compositions.',
    ),
  imageDataUrl: z
    .string()
    .optional()
    .describe('Image source (data URL or HTTP URL) for "custom" overlays and rendered-icon cache.'),
  iconRef: z
    .string()
    .optional()
    .describe('Library-qualified icon id (e.g. "lucide:camera"). Canonical source for "icon" overlays.'),
  x: z
    .number()
    .min(-100)
    .max(200)
    .describe('X position as canvas-% (-100 to 200, so the element can bleed off the canvas).'),
  y: z
    .number()
    .min(-100)
    .max(200)
    .describe('Y position as canvas-% (-100 to 200).'),
  size: z.preprocess(
    (v) => {
      if (typeof v !== 'number') return v;
      if (v < 50) return Math.max(50, Math.round(v * 12.9));
      return v;
    },
    z
      .number()
      .min(20)
      .max(3000)
      .default(200)
      .describe(
        'Element size in canvas pixels (NOT %), 20-3000. Values below 50 are treated as legacy 1-50 percent and converted using a 1290px reference.',
      ),
  ),
  rotation: z.number().min(-180).max(180).default(0).describe('Rotation in degrees.'),
  opacity: z.number().min(0).max(1).default(1).describe('Overall opacity 0-1.'),
  shapeType: z
    .enum(['circle', 'rectangle', 'line', 'arrow'])
    .optional()
    .describe('Required when `type` is "shape". Determines the geometry drawn.'),
  shapeColor: hexColor.optional().describe('Fill / stroke color for "shape" overlays.'),
  shapeOpacity: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('Per-shape alpha — composed with the overall `opacity`.'),
  shapeBlur: z
    .number()
    .min(0)
    .max(30)
    .optional()
    .describe('Shape-internal blur in pixels (0-30). Smaller range than `softBlur` below.'),
  layer: z
    .enum(['front', 'default', 'behind-text', 'behind-device'])
    .optional()
    .describe(
      'Stacking tier. "front" above everything, "default" above device+text, "behind-text" under text but above device frame, "behind-device" under device frame but above canvas background.',
    ),
  softBlur: z
    .number()
    .min(0)
    .max(200)
    .optional()
    .describe(
      'Heavy CSS blur (0-200 px) applied to the whole element wrapper. At 80-150 px a flat-color blob becomes an atmospheric glow (Stripe/Coinbase background look). Distinct from shape-internal `shapeBlur`.',
    ),
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
    .optional()
    .describe('CSS mix-blend-mode. Lets blobs/shapes blend with the canvas background.'),
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
  x: z.number().min(0).max(100).default(50).describe('Center X as percent of the device screen.'),
  y: z.number().min(0).max(100).default(50).describe('Center Y as percent of the device screen.'),
  w: z.number().min(5).max(100).default(30).describe('Width as percent of the device screen.'),
  h: z.number().min(5).max(100).default(30).describe('Height as percent of the device screen.'),
  shape: z
    .enum(['circle', 'rectangle'])
    .default('rectangle')
    .describe('Cutout shape. "circle" forces a 50% border-radius regardless of w/h.'),
  dimOpacity: z
    .number()
    .min(0)
    .max(1)
    .default(0.6)
    .describe('Opacity of the dim mask over the rest of the screenshot.'),
  blur: z
    .number()
    .min(0)
    .max(30)
    .default(0)
    .describe('Gaussian blur (px) applied to the dim mask outside the cutout.'),
  borderRadius: z
    .number()
    .min(0)
    .max(200)
    .default(0)
    .describe(
      'Corner radius in pixels for rectangle shapes. Ignored when shape is "circle".',
    ),
});
export type SpotlightConfig = z.infer<typeof spotlightConfigSchema>;

// --- Annotation ---

export const annotationSchema = z.object({
  id: z.string().default('').describe('Stable id (e.g. "annot-<8 hex>"). Used as React key + for removal.'),
  shape: z
    .enum(['circle', 'rounded-rect', 'rectangle'])
    .default('rectangle')
    .describe(
      '"circle" forces a circular shape via 50% border-radius. "rectangle" uses borderRadius. "rounded-rect" is legacy — normalized to rectangle on load.',
    ),
  x: z.number().min(0).max(100).default(40).describe('Top-left X on the device screen (0-100, %).'),
  y: z.number().min(0).max(100).default(40).describe('Top-left Y on the device screen (0-100, %).'),
  w: z.number().min(1).max(100).default(20).describe('Width on the device screen (1-100, %).'),
  h: z.number().min(1).max(100).default(20).describe('Height on the device screen (1-100, %).'),
  strokeColor: hexColor.default('#FF3B30').describe('Outline color. Defaults to iOS-red.'),
  strokeWidth: z.number().min(1).max(20).default(4).describe('Outline thickness in pixels.'),
  fillColor: hexColor
    .optional()
    .describe('Optional fill color. Omit for an outline-only annotation.'),
  borderRadius: z
    .number()
    .min(0)
    .max(200)
    .default(0)
    .describe('Corner radius in pixels for rectangle shape. Ignored when shape is "circle".'),
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
