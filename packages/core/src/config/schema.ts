import { z } from 'zod';

// --- Shared enums/primitives ---

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, 'Must be a valid hex color');

export const platformSchema = z.enum(['ios', 'android', 'mac', 'watch']);
export const templateStyleSchema = z.enum(['minimal', 'bold', 'glow', 'playful', 'clean', 'branded', 'editorial', 'fullscreen']);
export const frameStyleSchema = z.enum(['flat', '3d', 'floating', 'none']);
export const layoutVariantSchema = z.enum([
  'center',
  'angled-left',
  'angled-right',
  'floating',
  'side-by-side',
]);

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
  sourceX: z.number().min(0).max(100),
  sourceY: z.number().min(0).max(100),
  displayX: z.number().min(0).max(100),
  displayY: z.number().min(0).max(100),
  size: z.number().min(5).max(50).default(20),
  zoom: z.number().min(1.5).max(5).default(2.5),
  borderWidth: z.number().min(0).max(10).default(3),
  borderColor: hexColor.default('#ffffff'),
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
  koubouColor: z.string().optional(),
});

// --- Composition ---

export const compositionPresetSchema = z.enum([
  'single',
  'peek-right',
  'peek-left',
  'tilt-left',
  'tilt-right',
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
  autoSizeHeadline: z.boolean().default(false),
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

export const localeConfigSchema = z.object({
  screens: z.array(localeScreenConfigSchema),
});

// --- Localization section (xcstrings mode) ---

export const localizationConfigSchema = z.object({
  baseLanguage: z.string().min(1),
  languages: z.array(z.string().min(1)).min(1),
  xcstringsPath: z.string().default('Localizable.xcstrings'),
});

// --- Output section ---

export const iosOutputConfigSchema = z.object({
  sizes: z.array(z.number()).default([6.7, 6.5]),
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

// --- Full config ---

export const appframeConfigSchema = z
  .object({
    app: appConfigSchema,
    theme: themeConfigSchema,
    frames: frameConfigSchema.default({ style: 'flat' }),
    screens: z.array(screenConfigSchema).min(1, 'At least one screen is required'),
    locales: z.record(z.string(), localeConfigSchema).optional(),
    localization: localizationConfigSchema.optional(),
    output: outputConfigSchema,
  })
  .refine(
    (config) => {
      if (!config.locales) return true;
      return Object.values(config.locales).every(
        (locale) => locale.screens.length === config.screens.length,
      );
    },
    {
      message: 'Each locale must have the same number of screens as the main screens array',
      path: ['locales'],
    },
  )
  .refine(
    (config) => !(config.locales && config.localization),
    {
      message: 'Cannot use both "locales" (inline mode) and "localization" (xcstrings mode) — choose one',
      path: ['localization'],
    },
  )
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
