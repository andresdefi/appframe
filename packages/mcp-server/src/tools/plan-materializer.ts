import type { AppframeConfig, PanoramicElement, Platform, TemplateStyle } from '@appframe/core';
import { validateConfig } from '@appframe/core';
import { mkdir, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative } from 'node:path';
import { stringify } from 'yaml';
import type {
  PlannedIndividualScreen,
  PlannedPanoramicFrame,
  PlannedPanoramicVariant,
  PlannedVariant,
  VariantSetPlan,
} from './design-planning.js';
import type { SelectedCopySet } from './copy-planning.js';

export interface MaterializedVariantFile {
  id: string;
  name: string;
  mode: 'individual' | 'panoramic';
  configPath: string;
}

export interface MaterializedVariantSet {
  manifestPath: string;
  variants: MaterializedVariantFile[];
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'variant';
}

function toConfigRelativePath(configDir: string, assetPath: string): string {
  if (assetPath.startsWith('data:')) return assetPath;
  if (!isAbsolute(assetPath)) return assetPath;
  const rel = relative(configDir, assetPath);
  return rel === '' ? basename(assetPath) : rel;
}

type MaterializedPalette = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  subtitle: string;
};

function buildPalette(
  style: string,
  primaryColor?: string,
  secondaryColor?: string,
): MaterializedPalette {
  const paletteByStyle: Record<string, MaterializedPalette> = {
    minimal: {
      primary: '#2563EB',
      secondary: '#7C3AED',
      background: '#F8FAFC',
      text: '#0F172A',
      subtitle: '#64748B',
    },
    bold: {
      primary: '#FF4D6A',
      secondary: '#7B2FFF',
      background: '#151726',
      text: '#FFFFFF',
      subtitle: '#D5D9E4',
    },
    glow: {
      primary: '#6366F1',
      secondary: '#EC4899',
      background: '#090B13',
      text: '#F8FAFC',
      subtitle: '#94A3B8',
    },
    clean: {
      primary: '#111111',
      secondary: '#6B7280',
      background: '#FFFFFF',
      text: '#111111',
      subtitle: '#6B7280',
    },
    branded: {
      primary: '#FF6B00',
      secondary: '#FF9A45',
      background: '#FFF4EC',
      text: '#2C1608',
      subtitle: '#7A4A2A',
    },
    editorial: {
      primary: '#8B7355',
      secondary: '#A0926B',
      background: '#F5F0E8',
      text: '#2C2416',
      subtitle: '#7A7062',
    },
    playful: {
      primary: '#F59E0B',
      secondary: '#10B981',
      background: '#FFF7ED',
      text: '#1C1917',
      subtitle: '#78716C',
    },
  };

  const fallback = paletteByStyle.minimal!;
  const base = paletteByStyle[style] ?? fallback;
  const palette: MaterializedPalette = {
    primary: base.primary,
    secondary: base.secondary,
    background: base.background,
    text: base.text,
    subtitle: base.subtitle,
  };
  if (primaryColor) palette.primary = primaryColor;
  if (secondaryColor) palette.secondary = secondaryColor;
  return palette;
}

function buildOutputConfig(platforms: Platform[]): AppframeConfig['output'] {
  return {
    platforms,
    ...(platforms.includes('ios') ? { ios: { sizes: [6.7, 6.5], format: 'png' as const } } : {}),
    ...(platforms.includes('android')
      ? { android: { sizes: ['phone'], format: 'png' as const, featureGraphic: true } }
      : {}),
    directory: './output',
  };
}

function buildHeadline(focus: string, fallback: string): string {
  const cleaned = focus.replace(/\s+/g, ' ').trim().split(' ').slice(0, 4).join(' ');
  const text = cleaned || fallback;
  const words = text.split(' ');
  if (words.length <= 2) return words.join('\n');
  return `${words.slice(0, 2).join(' ')}\n${words.slice(2).join(' ')}`;
}

function formatHeadline(headline: string): string {
  const words = headline.replace(/\n/g, ' ').split(/\s+/).filter(Boolean);
  if (words.length <= 3) return words.join('\n');
  return `${words.slice(0, 2).join(' ')}\n${words.slice(2).join(' ')}`;
}

function resolveCopyForSlot(
  selectedCopySet: SelectedCopySet | undefined,
  slideRole: string,
  featureIndex: number,
): { headline: string; subtitle?: string } | null {
  if (!selectedCopySet) return null;

  switch (slideRole) {
    case 'hero':
      return { headline: formatHeadline(selectedCopySet.hero.headline) };
    case 'differentiator':
      return { headline: formatHeadline(selectedCopySet.differentiator.headline) };
    case 'trust':
      return selectedCopySet.trust
        ? { headline: formatHeadline(selectedCopySet.trust.headline) }
        : null;
    case 'summary':
      return { headline: formatHeadline(selectedCopySet.summary.headline) };
    case 'feature': {
      const feature = selectedCopySet.features[Math.min(featureIndex, selectedCopySet.features.length - 1)];
      return feature ? { headline: formatHeadline(feature.headline) } : null;
    }
    default:
      return null;
  }
}

function buildSubtitle(slideRole: string): string | undefined {
  switch (slideRole) {
    case 'differentiator':
      return 'Show what makes it different';
    case 'trust':
      return 'Built for repeat use';
    case 'summary':
      return 'Close with the remaining highlights';
    default:
      return undefined;
  }
}

function styleToFontWeight(style: string): number {
  switch (style) {
    case 'bold':
    case 'branded':
      return 700;
    case 'editorial':
      return 600;
    default:
      return 600;
  }
}

function normalizeStyle(style: string): TemplateStyle {
  const allowed: TemplateStyle[] = [
    'minimal',
    'bold',
    'glow',
    'playful',
    'clean',
    'branded',
    'editorial',
    'fullscreen',
  ];
  return allowed.includes(style as TemplateStyle) ? (style as TemplateStyle) : 'minimal';
}

function storyBeatTitle(storyBeat: string): string {
  switch (storyBeat) {
    case 'hero':
      return 'Hero moment';
    case 'differentiator':
      return 'Why it stands out';
    case 'trust':
      return 'Proof point';
    case 'summary':
      return 'Close strong';
    default:
      return 'Feature focus';
  }
}

function storyBeatBody(frame: PlannedPanoramicFrame): string {
  return (
    frame.assetGuidance ??
    frame.pacing ??
    `Use the ${frame.sourceRole} screen as a supporting proof detail.`
  );
}

function buildPanoramicSupportGroup(args: {
  screenshot: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  storyBeat: string;
  title: string;
  body: string;
  accentColor: string;
  textColor: string;
  subtitleColor: string;
  focusX: number;
  focusY: number;
  zoom: number;
}): PanoramicElement {
  return {
    type: 'group',
    x: args.x,
    y: args.y,
    width: args.width,
    height: args.height,
    rotation: args.rotation,
    opacity: 1,
    z: 8,
    children: [
      {
        type: 'crop',
        screenshot: args.screenshot,
        x: 0,
        y: 0,
        width: 100,
        height: 62,
        focusX: args.focusX,
        focusY: args.focusY,
        zoom: args.zoom,
        rotation: args.rotation > 0 ? -6 : 6,
        borderRadius: 24,
        z: 1,
      },
      {
        type: 'card',
        x: 10,
        y: 54,
        width: 82,
        height: 36,
        eyebrow: args.storyBeat,
        title: args.title,
        body: args.body,
        align: 'left',
        backgroundColor: '#FFFFFF',
        opacity: 0.96,
        borderColor: args.accentColor,
        borderWidth: 1,
        borderRadius: 24,
        padding: 2,
        rotation: 0,
        eyebrowColor: args.subtitleColor,
        titleColor: args.textColor,
        bodyColor: args.subtitleColor,
        eyebrowSize: 3.5,
        titleSize: 7.2,
        bodySize: 4.1,
        z: 2,
      },
    ],
  };
}

function buildIndividualConfig(args: {
  plan: VariantSetPlan;
  variant: Extract<PlannedVariant, { mode: 'individual' }>;
  configDir: string;
  primaryColor?: string;
  secondaryColor?: string;
  font?: string;
  selectedCopySet?: SelectedCopySet;
}): AppframeConfig {
  const style = normalizeStyle(args.variant.style);
  const colors = buildPalette(style, args.primaryColor, args.secondaryColor);
  let featureIndex = 0;
  const screens = args.variant.screens.map((screen: PlannedIndividualScreen) => {
    const copy = resolveCopyForSlot(args.selectedCopySet, screen.slideRole, featureIndex);
    if (screen.slideRole === 'feature') featureIndex += 1;

    return {
      screenshot: toConfigRelativePath(args.configDir, screen.sourcePath),
      headline: copy?.headline ?? buildHeadline(screen.copyDirection, screen.slideRole),
      subtitle: copy?.subtitle ?? buildSubtitle(screen.slideRole),
      layout: screen.layout,
      composition: 'single' as const,
      autoSizeHeadline: true,
      autoSizeSubtitle: false,
      annotations: [],
      cornerRadius: screen.framing === 'frameless-rounded' ? 24 : 0,
      ...(screen.backgroundStrategy === 'primary-tint' ? { background: colors.background } : {}),
    };
  });
  const useFrameless = args.variant.screens.some((screen) => screen.framing === 'frameless-rounded');

  return {
    mode: 'individual',
    app: {
      name: args.plan.app.name,
      description: args.plan.app.description,
      platforms: args.plan.app.platforms as Platform[],
      features: args.plan.goals,
    },
    theme: {
      style,
      colors,
      font: args.font ?? 'inter',
      fontWeight: styleToFontWeight(style),
    },
    frames: {
      ios: args.plan.app.platforms.includes('ios') ? 'iphone-17-pro' : undefined,
      android: args.plan.app.platforms.includes('android') ? 'generic-phone' : undefined,
      style: useFrameless ? 'none' : 'flat',
    },
    screens,
    output: buildOutputConfig(args.plan.app.platforms as Platform[]),
  };
}

function buildPanoramicElements(args: {
  variant: PlannedPanoramicVariant;
  configDir: string;
  assetImagePath?: string;
  textColor: string;
  subtitleColor: string;
  accentColor: string;
  backgroundColor: string;
  frameId: string | undefined;
  selectedCopySet?: SelectedCopySet;
}): PanoramicElement[] {
  const frames = args.variant.frames ?? [];
  const frameCount = args.variant.canvasPlan.frameCount;
  const elements: PanoramicElement[] = [];
  let featureIndex = 0;

  frames.forEach((frame: PlannedPanoramicFrame, index) => {
    const sliceWidth = 100 / frameCount;
    const frameSliceStart = (index / frameCount) * 100;
    const frameCenter = frameSliceStart + 50 / frameCount;
    const copy = resolveCopyForSlot(args.selectedCopySet, frame.storyBeat, featureIndex);
    if (frame.storyBeat === 'feature') featureIndex += 1;
    const sourceScreenshot = toConfigRelativePath(args.configDir, frame.sourcePath);
    const supportTitle = storyBeatTitle(frame.storyBeat);
    const supportBody = storyBeatBody(frame);

    elements.push({
      type: 'device',
      screenshot: sourceScreenshot,
      frame: args.frameId,
      frameStyle: 'flat',
      x: Math.max(2, frameCenter - 7),
      y: 24,
      width: 14,
      rotation: index % 2 === 0 ? -2 : 2,
      deviceScale: 92,
      deviceTop: 15,
      deviceOffsetX: 0,
      deviceAngle: 8,
      deviceTilt: 0,
      cornerRadius: 0,
      fullscreenScreenshot: false,
      z: 5,
    });

    elements.push({
      type: 'text',
      content: copy?.headline ?? buildHeadline(frame.storyBeat, frame.sourceRole),
      x: frameSliceStart + 4,
      y: 6,
      fontSize: args.variant.recipe === 'editorial-panorama' ? 3.4 : 3.8,
      color: args.textColor,
      fontWeight: 700,
      fontStyle: 'normal',
      textAlign: 'left',
      lineHeight: 1.1,
      maxWidth: Math.max(12, Math.floor(100 / frameCount) - 6),
      letterSpacing: 0,
      textTransform: '',
      rotation: 0,
      z: 10,
    });

    elements.push({
      type: 'label',
      content: frame.storyBeat,
      x: frameSliceStart + 4,
      y: 17,
      fontSize: 1.2,
      color: args.subtitleColor,
      backgroundColor: undefined,
      padding: 0,
      borderRadius: 0,
      z: 11,
    });

    if (index === 0 || frame.storyBeat === 'trust') {
      elements.push({
        type: 'badge',
        content:
          index === 0
            ? args.variant.recipe === 'bold-panorama'
              ? 'Campaign concept'
              : 'Featured flow'
            : 'Proof point',
        x: frameSliceStart + 4,
        y: args.variant.recipe === 'bold-panorama' ? 21 : 20,
        width: Math.max(11, sliceWidth - 10),
        height: 4.8,
        color: args.variant.recipe === 'bold-panorama' ? '#FFFFFF' : args.textColor,
        backgroundColor: args.variant.recipe === 'bold-panorama' ? args.accentColor : '#FFFFFF',
        opacity: 0.96,
        borderColor: args.variant.recipe === 'bold-panorama' ? undefined : args.accentColor,
        borderWidth: args.variant.recipe === 'bold-panorama' ? 0 : 1,
        borderRadius: 100,
        fontSize: 1.05,
        fontWeight: 700,
        letterSpacing: 12,
        textTransform: 'uppercase',
        rotation: 0,
        z: 12,
      });
    }

    if (args.variant.recipe === 'editorial-panorama') {
      const groupWidth = Math.max(12.5, sliceWidth - 8);
      elements.push(
        buildPanoramicSupportGroup({
          screenshot: sourceScreenshot,
          x: frameSliceStart + sliceWidth - groupWidth - 2,
          y: index % 2 === 0 ? 52 : 56,
          width: groupWidth,
          height: 28,
          rotation: index % 2 === 0 ? -3 : 3,
          storyBeat: frame.storyBeat,
          title: supportTitle,
          body: supportBody,
          accentColor: args.accentColor,
          textColor: args.textColor,
          subtitleColor: args.subtitleColor,
          focusX: frame.sourceRole === 'detail' || frame.sourceRole === 'paywall' ? 55 : 50,
          focusY: 38,
          zoom: frame.cropSuitability === 'high' ? 1.8 : 1.5,
        }),
      );
    }

    if (args.variant.recipe === 'bold-panorama' && frame.cropSuitability !== 'low') {
      const groupWidth = Math.max(13, sliceWidth - 7);
      elements.push(
        buildPanoramicSupportGroup({
          screenshot: sourceScreenshot,
          x: frameSliceStart + 3,
          y: 54,
          width: groupWidth,
          height: 29,
          rotation: index % 2 === 0 ? -5 : 5,
          storyBeat: frame.storyBeat,
          title: supportTitle,
          body: supportBody,
          accentColor: args.accentColor,
          textColor: '#111827',
          subtitleColor: '#475569',
          focusX: frame.sourceRole === 'detail' || frame.sourceRole === 'paywall' ? 55 : 50,
          focusY: 38,
          zoom: frame.cropSuitability === 'high' ? 1.9 : 1.55,
        }),
      );
    } else if (
      args.variant.recipe === 'bold-panorama' &&
      (index === 0 || frame.storyBeat === 'trust' || frame.storyBeat === 'summary')
    ) {
      elements.push({
        type: 'card',
        x: frameSliceStart + 3,
        y: 66,
        width: Math.max(12, sliceWidth - 8),
        height: 14,
        eyebrow: frame.storyBeat,
        title: supportTitle,
        body: supportBody,
        align: 'left',
        backgroundColor: '#FFFFFF',
        opacity: 0.95,
        borderColor: args.accentColor,
        borderWidth: 1,
        borderRadius: 24,
        padding: 1.7,
        rotation: 0,
        eyebrowColor: args.accentColor,
        titleColor: '#111827',
        bodyColor: '#475569',
        eyebrowSize: 1,
        titleSize: 1.8,
        bodySize: 1.1,
        z: 8,
      });
    }
  });

  if (args.assetImagePath) {
    elements.push({
      type: 'logo',
      src: toConfigRelativePath(args.configDir, args.assetImagePath),
      x: 80,
      y: 5.5,
      width: 11,
      height: 10,
      fit: 'contain',
      opacity: 0.95,
      rotation: 0,
      padding: 1,
      backgroundColor: args.variant.style === 'editorial' ? '#FFFFFFCC' : '#FFFFFFE6',
      borderRadius: 24,
      z: 8,
    });
  } else {
    elements.push({
      type: 'decoration',
      shape: 'circle',
      x: 84,
      y: 8,
      width: 10,
      height: 14,
      color: '#FFFFFF',
      opacity: 0.08,
      rotation: 0,
      z: 2,
    });
  }

  return elements;
}

function buildPanoramicConfig(args: {
  plan: VariantSetPlan;
  variant: Extract<PlannedVariant, { mode: 'panoramic' }>;
  configDir: string;
  primaryColor?: string;
  secondaryColor?: string;
  font?: string;
  assetImagePath?: string;
  selectedCopySet?: SelectedCopySet;
}): AppframeConfig {
  const style = normalizeStyle(args.variant.style);
  const colors = buildPalette(style, args.primaryColor, args.secondaryColor);
  const frameId = args.plan.app.platforms.includes('ios') ? 'iphone-17-pro' : 'generic-phone';

  return {
    mode: 'panoramic',
    app: {
      name: args.plan.app.name,
      description: args.plan.app.description,
      platforms: args.plan.app.platforms as Platform[],
      features: args.plan.goals,
    },
    theme: {
      style,
      colors,
      font: args.font ?? 'inter',
      fontWeight: styleToFontWeight(style),
    },
    frames: {
      ios: args.plan.app.platforms.includes('ios') ? 'iphone-17-pro' : undefined,
      android: args.plan.app.platforms.includes('android') ? 'generic-phone' : undefined,
      style: 'flat',
    },
    screens: [],
    frameCount: args.variant.canvasPlan.frameCount,
    panoramic: {
      background: {
        type: 'solid',
        color: colors.background,
      },
      elements: buildPanoramicElements({
        variant: args.variant,
        configDir: args.configDir,
        assetImagePath: args.assetImagePath,
        textColor: colors.text,
        subtitleColor: colors.subtitle,
        accentColor: colors.primary,
        backgroundColor: colors.background,
        frameId,
        selectedCopySet: args.selectedCopySet,
      }),
    },
    output: buildOutputConfig(args.plan.app.platforms as Platform[]),
  };
}

function ensureValid(config: AppframeConfig, label: string): AppframeConfig {
  const result = validateConfig(config);
  if (!result.success) {
    const message = result.errors.map((error) => `${error.path}: ${error.message}`).join('; ');
    throw new Error(`${label} is invalid: ${message}`);
  }
  return result.config;
}

export async function materializeVariantPlan(args: {
  plan: VariantSetPlan;
  outputDir: string;
  primaryColor?: string;
  secondaryColor?: string;
  font?: string;
  assetImagePath?: string;
  manifestPath?: string;
  selectedCopySet?: SelectedCopySet;
}): Promise<MaterializedVariantSet> {
  await mkdir(args.outputDir, { recursive: true });

  const variants: MaterializedVariantFile[] = [];

  for (const variant of args.plan.variants) {
    const filename = `${slugify(args.plan.app.name)}-${variant.id}.yml`;
    const configPath = join(args.outputDir, filename);
    const configDir = dirname(configPath);

    const config =
      variant.mode === 'individual'
        ? buildIndividualConfig({
            plan: args.plan,
            variant,
            configDir,
            primaryColor: args.primaryColor,
            secondaryColor: args.secondaryColor,
            font: args.font,
            selectedCopySet: args.selectedCopySet,
          })
        : buildPanoramicConfig({
            plan: args.plan,
            variant,
            configDir,
            primaryColor: args.primaryColor,
            secondaryColor: args.secondaryColor,
            font: args.font,
            assetImagePath: args.assetImagePath,
            selectedCopySet: args.selectedCopySet,
          });

    const validated = ensureValid(config, variant.name);
    await writeFile(
      configPath,
      `# appframe config — ${args.plan.app.name} (${variant.name})\n${stringify(validated)}`,
      'utf-8',
    );

    variants.push({
      id: variant.id,
      name: variant.name,
      mode: variant.mode,
      configPath,
    });
  }

  const manifestPath =
    args.manifestPath ??
    join(args.outputDir, `${slugify(args.plan.app.name)}-variant-manifest.json`);
  await writeFile(
    manifestPath,
    JSON.stringify(
      {
        app: args.plan.app,
        generatedAt: new Date().toISOString(),
        assetImagePath: args.assetImagePath ?? null,
        variants,
      },
      null,
      2,
    ),
    'utf-8',
  );

  return { manifestPath, variants };
}
