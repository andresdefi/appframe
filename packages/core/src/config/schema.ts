import { z } from 'zod';

// --- Shared enums/primitives ---

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, 'Must be a valid hex color');

export const platformSchema = z.enum(['ios', 'android', 'mac', 'watch']);
export const templateStyleSchema = z.enum([
  'minimal',
  'bold',
  'glow',
  'playful',
  'clean',
  'branded',
  'editorial',
  'fullscreen',
]);
export const frameStyleSchema = z.enum(['flat', '3d', 'none']);
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
  thickness: z.number().min(1).max(20).default(4),
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
  cornerRadius: z.number().min(0).max(100).default(0),
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
});
export type Callout = z.infer<typeof calloutSchema>;

// --- Overlay ---

export const overlaySchema = z.object({
  id: z.string(),
  type: z.enum(['icon', 'badge', 'star-rating', 'custom', 'shape']),
  imageDataUrl: z.string().optional(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  size: z.number().min(2).max(30).default(10),
  rotation: z.number().min(-180).max(180).default(0),
  opacity: z.number().min(0).max(1).default(1),
  shapeType: z.enum(['circle', 'rectangle', 'line']).optional(),
  shapeColor: hexColor.optional(),
  shapeOpacity: z.number().min(0).max(1).optional(),
  shapeBlur: z.number().min(0).max(30).optional(),
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
  style: templateStyleSchema,
  colors: colorConfigSchema,
  font: z.string().default('inter'),
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
  backgroundOverlay: backgroundOverlaySchema.optional(),
  // Typography overrides (override preset defaults when specified)
  headlineLineHeight: z.number().min(0.8).max(2).optional(),
  headlineLetterSpacing: z.string().optional(),
  headlineTextTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
  headlineFontStyle: z.enum(['normal', 'italic']).optional(),
  subtitleOpacity: z.number().min(0).max(1).optional(),
  subtitleLetterSpacing: z.string().optional(),
  subtitleTextTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
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
});
export type SpotlightConfig = z.infer<typeof spotlightConfigSchema>;

// --- Annotation ---

export const annotationSchema = z.object({
  id: z.string().default(''),
  shape: z.enum(['circle', 'rounded-rect', 'rectangle']).default('rounded-rect'),
  x: z.number().min(0).max(100).default(40),
  y: z.number().min(0).max(100).default(40),
  w: z.number().min(1).max(100).default(20),
  h: z.number().min(1).max(100).default(20),
  strokeColor: hexColor.default('#FF3B30'),
  strokeWidth: z.number().min(1).max(20).default(4),
  fillColor: hexColor.optional(),
});
export type Annotation = z.infer<typeof annotationSchema>;

// --- Screen section ---

export const screenConfigSchema = z.object({
  screenshot: z.string().min(1, 'Screenshot path is required'),
  headline: z.string().min(1, 'Headline is required'),
  subtitle: z.string().optional(),
  layout: layoutVariantSchema.default('center'),
  device: z.string().optional(),
  background: z.string().optional(),
  composition: compositionPresetSchema.default('single'),
  extraDevices: z.array(compositionDeviceSchema).optional(),
  autoSizeHeadline: z.boolean().default(true),
  autoSizeSubtitle: z.boolean().default(false),
  spotlight: spotlightConfigSchema.optional(),
  annotations: z.array(annotationSchema).default([]),
  // Device enhancements
  deviceShadow: deviceShadowSchema.optional(),
  borderSimulation: borderSimulationSchema.optional(),
  cornerRadius: z.number().min(0).max(50).optional(),
  // Effects
  loupe: loupeSchema.optional(),
  callouts: z.array(calloutSchema).optional(),
  overlays: z.array(overlaySchema).optional(),
});

// --- Locale section ---

export const localeScreenConfigSchema = z.object({
  headline: z.string().min(1),
  subtitle: z.string().optional(),
  screenshot: z.string().min(1).optional(),
});

export const localePanoramicElementConfigSchema = z.object({
  content: z.string().min(1).optional(),
  screenshot: z.string().min(1).optional(),
});

export const localePanoramicConfigSchema = z.object({
  elements: z.array(localePanoramicElementConfigSchema),
});

export const localeConfigSchema = z.object({
  screens: z.array(localeScreenConfigSchema).optional(),
  panoramic: localePanoramicConfigSchema.optional(),
});

// --- Localization section (xcstrings mode) ---

export const localizationConfigSchema = z.object({
  baseLanguage: z.string().min(1),
  languages: z.array(z.string().min(1)).min(1),
  xcstringsPath: z.string().default('Localizable.xcstrings'),
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
  font: z.string().optional().describe('Per-element font override (defaults to theme font)'),
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
    localization: localizationConfigSchema.optional(),
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
  .refine((config) => !(config.locales && config.localization), {
    message:
      'Cannot use both "locales" (inline mode) and "localization" (xcstrings mode) — choose one',
    path: ['localization'],
  })
  .refine(
    (config) => {
      if (!config.localization) return true;
      return config.localization.languages.includes(config.localization.baseLanguage);
    },
    {
      message: '"baseLanguage" must be included in the "languages" array',
      path: ['localization', 'baseLanguage'],
    },
  );

// --- Inferred types ---

export type Platform = z.infer<typeof platformSchema>;
export type TemplateStyle = z.infer<typeof templateStyleSchema>;
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
export type LocalizationConfig = z.infer<typeof localizationConfigSchema>;
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
