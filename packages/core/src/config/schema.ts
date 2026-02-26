import { z } from 'zod';

// --- Shared enums/primitives ---

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, 'Must be a valid hex color');

export const platformSchema = z.enum(['ios', 'android']);
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

export const themeConfigSchema = z.object({
  style: templateStyleSchema,
  colors: colorConfigSchema,
  font: z.string().default('inter'),
  fontWeight: z.number().int().min(100).max(900).default(600),
});

// --- Frames section ---

export const frameConfigSchema = z.object({
  ios: z.string().optional(),
  android: z.string().optional(),
  style: frameStyleSchema.default('flat'),
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

export const screenConfigSchema = z.object({
  screenshot: z.string().min(1, 'Screenshot path is required'),
  headline: z.string().min(1, 'Headline is required'),
  subtitle: z.string().optional(),
  layout: layoutVariantSchema.default('center'),
  device: z.string().optional(),
  background: z.string().optional(),
  composition: compositionPresetSchema.default('single'),
  extraDevices: z.array(compositionDeviceSchema).optional(),
});

// --- Locale section ---

export const localeScreenConfigSchema = z.object({
  headline: z.string().min(1),
  subtitle: z.string().optional(),
});

export const localeConfigSchema = z.object({
  screens: z.array(localeScreenConfigSchema),
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

export const outputConfigSchema = z.object({
  platforms: z.array(platformSchema).min(1),
  ios: iosOutputConfigSchema.optional(),
  android: androidOutputConfigSchema.optional(),
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
export type IOSOutputConfig = z.infer<typeof iosOutputConfigSchema>;
export type AndroidOutputConfig = z.infer<typeof androidOutputConfigSchema>;
export type OutputConfig = z.infer<typeof outputConfigSchema>;
export type AppframeConfig = z.infer<typeof appframeConfigSchema>;
