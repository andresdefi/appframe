import type { AppframeConfig, PanoramicElement, Platform, TemplateStyle } from '@appframe/core';
import { validateConfig } from '@appframe/core';
import { mkdir, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative } from 'node:path';
import { stringify } from 'yaml';
import type {
  PlannedCropPlan,
  PlannedFrameStrategy,
  PlannedIndividualScreen,
  PlannedPanoramicFrame,
  PlannedPanoramicVariant,
  PlannedVariant,
  VariantSetPlan,
} from './design-planning.js';
import type { SelectedCopySet } from './copy-planning.js';

type PanoramicGroupChild = Extract<PanoramicElement, { type: 'group' }>['children'][number];

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

function lightPaletteColor(palette: string[] | undefined): string | undefined {
  return palette?.find((value) => /^#(?:f|e|d|c|b|a|9)/i.test(value));
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
      return {
        headline: formatHeadline(selectedCopySet.hero.headline),
        subtitle: selectedCopySet.hero.subtitle,
      };
    case 'differentiator':
      return {
        headline: formatHeadline(selectedCopySet.differentiator.headline),
        subtitle: selectedCopySet.differentiator.subtitle,
      };
    case 'trust':
      return selectedCopySet.trust
        ? {
            headline: formatHeadline(selectedCopySet.trust.headline),
            subtitle: selectedCopySet.trust.subtitle,
          }
        : null;
    case 'summary':
      return {
        headline: formatHeadline(selectedCopySet.summary.headline),
        subtitle: selectedCopySet.summary.subtitle,
      };
    case 'feature': {
      const feature = selectedCopySet.features[Math.min(featureIndex, selectedCopySet.features.length - 1)];
      return feature
        ? {
            headline: formatHeadline(feature.headline),
            subtitle: feature.subtitle,
          }
        : null;
    }
    default:
      return null;
  }
}

function compactSubtitleFocus(value: string | undefined): string | null {
  if (!value) return null;
  const compact = value.replace(/\s+/g, ' ').trim().split(' ').slice(0, 4).join(' ');
  return compact.length > 0 ? compact : null;
}

function buildSubtitle(args: {
  category: string;
  slideRole: string;
  sourceRole: string;
  focus?: string;
  cropPlan?: PlannedCropPlan;
  selectedSubtitle?: string;
}): string | undefined {
  if (args.selectedSubtitle) return args.selectedSubtitle;

  const focus = compactSubtitleFocus(args.focus);
  const avoidTop = args.cropPlan?.avoidRegions.includes('top') ?? false;

  switch (args.slideRole) {
    case 'hero':
      switch (args.category) {
        case 'finance':
          return 'Turn complex money decisions into one clear story';
        case 'health':
          return 'Keep daily progress readable and calm';
        case 'productivity':
          return 'Show the workflow that keeps the day moving';
        case 'social':
          return 'Lead with the community moment people come back to';
        case 'creative':
          return 'Open with the most visual product moment';
        case 'games':
          return 'Set the tone with the strongest momentum beat';
        default:
          return 'Lead with the clearest product outcome';
      }
    case 'differentiator':
      if (focus) return `Use ${focus.toLowerCase()} to prove the product feels distinct`;
      return 'Show what makes the experience feel distinct';
    case 'feature':
      if (focus) return `Keep the story grounded in ${focus.toLowerCase()}`;
      return args.sourceRole === 'detail'
        ? 'Pull forward the proof inside the screen'
        : 'Sell one product moment, not every control';
    case 'trust':
      switch (args.category) {
        case 'finance':
          return 'Reinforce trust with clarity, control, and steady proof';
        case 'health':
          return 'Use gentle proof that feels repeatable every day';
        default:
          return 'Make the proof feel reliable enough for repeat use';
      }
    case 'summary':
      return avoidTop
        ? 'Close with the broader value while staying clear of busy UI'
        : 'Close with the remaining benefit, not a repeat of the hero';
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

function normalizedLoupeCoordinate(value: number | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Math.max(-0.9, Math.min(0.9, (value - 50) / 50));
}

function anchorSourceCoordinate(
  cropPlan: PlannedCropPlan | undefined,
  focalPoint: PlannedIndividualScreen['focalPoint'] | PlannedPanoramicFrame['focalPoint'],
): { x: number; y: number } {
  if (cropPlan?.anchor === 'focal-point' && focalPoint) {
    return {
      x: normalizedLoupeCoordinate(focalPoint.x),
      y: normalizedLoupeCoordinate(focalPoint.y),
    };
  }

  switch (cropPlan?.anchor) {
    case 'upper-half':
      return { x: 0, y: -0.42 };
    case 'lower-half':
      return { x: 0, y: 0.36 };
    case 'left-rail':
      return { x: -0.42, y: 0 };
    case 'right-rail':
      return { x: 0.42, y: 0 };
    default:
      return focalPoint
        ? {
            x: normalizedLoupeCoordinate(focalPoint.x),
            y: normalizedLoupeCoordinate(focalPoint.y),
          }
        : { x: 0, y: 0 };
  }
}

function loupeDisplayPlacement(
  cropPlan: PlannedCropPlan | undefined,
  composition: PlannedIndividualScreen['composition'],
): { displayX: number; displayY: number } {
  const single = composition === 'single';
  let displayX = single ? 76 : 18;
  let displayY = single ? 67 : 74;

  if (cropPlan?.avoidRegions.includes('right')) displayX = single ? 22 : 16;
  if (cropPlan?.avoidRegions.includes('left')) displayX = single ? 80 : 82;
  if (cropPlan?.avoidRegions.includes('bottom')) displayY = single ? 32 : 26;
  if (cropPlan?.avoidRegions.includes('top')) displayY = single ? 76 : 82;

  return { displayX, displayY };
}

function resolveIndividualFraming(
  screen: PlannedIndividualScreen,
  frameStrategy: PlannedFrameStrategy | undefined,
): PlannedIndividualScreen['framing'] {
  if (screen.framing === 'frameless-rounded') return screen.framing;
  if (frameStrategy?.defaultTreatment === 'frameless') return 'frameless-rounded';
  if (frameStrategy?.defaultTreatment === 'mixed' && screen.cropPlan?.usage === 'supporting-crop') {
    return 'frameless-rounded';
  }
  return 'framed';
}

function buildIndividualDeviceTreatment(args: {
  resolvedFraming: PlannedIndividualScreen['framing'];
  screen: PlannedIndividualScreen;
  colors: MaterializedPalette;
}): Pick<AppframeConfig['screens'][number], 'deviceShadow' | 'borderSimulation'> {
  if (args.resolvedFraming !== 'frameless-rounded') {
    return args.screen.cropPlan?.usage === 'loupe-detail'
      ? {
          deviceShadow: {
            opacity: 0.22,
            blur: 26,
            color: '#0F172A',
            offsetY: 14,
          },
        }
      : {};
  }

  return {
    deviceShadow: {
      opacity: 0.18,
      blur: 28,
      color: '#0F172A',
      offsetY: 16,
    },
    borderSimulation: {
      enabled: true,
      thickness: 3,
      color: `${args.colors.background}CC`,
      radius: 28,
    },
  };
}

function buildIndividualBackground(args: {
  screen: PlannedIndividualScreen;
  colors: MaterializedPalette;
  resolvedFraming: PlannedIndividualScreen['framing'];
}): Pick<AppframeConfig['screens'][number], 'background'> {
  const backgroundFromPalette = lightPaletteColor(args.screen.dominantPalette);
  if (args.screen.backgroundStrategy === 'primary-tint') {
    return { background: backgroundFromPalette ?? args.colors.background };
  }
  if (args.screen.backgroundStrategy === 'contrast-rhythm' && backgroundFromPalette) {
    return { background: backgroundFromPalette };
  }
  if (args.resolvedFraming === 'frameless-rounded' && backgroundFromPalette) {
    return { background: backgroundFromPalette };
  }
  if (
    (args.screen.cropPlan?.usage === 'loupe-detail' || args.screen.cropPlan?.usage === 'supporting-crop')
    && backgroundFromPalette
  ) {
    return { background: backgroundFromPalette };
  }
  return {};
}

function panoramicTextPlacement(args: {
  frame: PlannedPanoramicFrame;
  recipe: PlannedPanoramicVariant['recipe'];
  frameSliceStart: number;
  sliceWidth: number;
  frameStrategy: PlannedFrameStrategy | undefined;
}): { x: number; maxWidth: number; fontSize: number } {
  let x = args.frameSliceStart + 4;
  let maxWidth = Math.max(12, Math.floor(args.sliceWidth) - 6);
  let fontSize = args.recipe === 'editorial-panorama' ? 3.4 : 3.8;

  if (args.frame.cropPlan?.avoidRegions.includes('left')) {
    x += 4;
    maxWidth -= 4;
  }
  if (args.frame.cropPlan?.avoidRegions.includes('right')) {
    maxWidth -= 4;
  }
  if (
    args.frameStrategy?.defaultTreatment === 'mixed'
    && args.frame.cropPlan?.usage
    && args.frame.cropPlan.usage !== 'full-device'
  ) {
    fontSize -= 0.15;
    maxWidth -= 1;
  }
  if (args.frame.cropPlan?.usage === 'loupe-detail' || args.frame.cropPlan?.usage === 'layered-extract') {
    fontSize -= 0.15;
  }

  return {
    x,
    maxWidth: Math.max(10, maxWidth),
    fontSize: Math.max(3.1, fontSize),
  };
}

function panoramicDeviceTreatment(
  frame: PlannedPanoramicFrame,
  frameStrategy: PlannedFrameStrategy | undefined,
  backgroundColor: string,
): Pick<
  Extract<PanoramicElement, { type: 'device' }>,
  'frameStyle' | 'cornerRadius' | 'shadow' | 'borderSimulation' | 'deviceScale' | 'deviceTop' | 'deviceAngle'
> {
  const useFrameless = frameStrategy?.defaultTreatment === 'frameless'
    || (
      frameStrategy?.defaultTreatment === 'mixed'
      && frame.cropPlan?.usage
      && frame.cropPlan.usage !== 'full-device'
    );
  if (!useFrameless) {
    return {
      frameStyle: 'flat',
      cornerRadius: 0,
      shadow: undefined,
      borderSimulation: undefined,
      deviceScale: 92,
      deviceTop: 15,
      deviceAngle: 8,
    };
  }

  return {
    frameStyle: 'none',
    cornerRadius: 24,
    shadow: {
      opacity: 0.2,
      blur: 24,
      color: '#0F172A',
      offsetY: 12,
    },
    borderSimulation: {
      enabled: true,
      thickness: 3,
      color: `${backgroundColor}CC`,
      radius: 26,
    },
    deviceScale: 94,
    deviceTop: 10,
    deviceAngle: 5,
  };
}

function buildLoupeForScreen(
  screen: PlannedIndividualScreen,
  colors: MaterializedPalette,
  composition: PlannedIndividualScreen['composition'],
) {
  const shouldUseLoupe = screen.cropPlan?.usage === 'loupe-detail'
    || (
      Boolean(screen.focalPoint)
      && screen.cropPlan?.usage !== 'supporting-crop'
      && (screen.sourceRole === 'detail' || screen.sourceRole === 'paywall' || screen.sourceRole === 'feature')
    )
    || (!screen.cropPlan && Boolean(screen.focalPoint));
  if (composition === 'fanned-cards' || !shouldUseLoupe) return undefined;

  const source = anchorSourceCoordinate(screen.cropPlan, screen.focalPoint);
  const display = loupeDisplayPlacement(screen.cropPlan, composition);

  return {
    sourceX: source.x,
    sourceY: source.y,
    displayX: display.displayX,
    displayY: display.displayY,
    width: composition === 'single' ? 0.34 : 0.24,
    height: composition === 'single' ? 0.24 : 0.19,
    zoom: screen.sourceRole === 'detail' || screen.sourceRole === 'paywall' ? 2.7 : 2.35,
    cornerRadius: 18,
    borderWidth: 4,
    borderColor: colors.background,
    shadow: true,
    shadowColor: '#00000033',
    shadowRadius: 26,
    shadowOffsetX: 0,
    shadowOffsetY: 10,
    xOffset: 0,
    yOffset: 0,
  };
}

function buildOverlaysForScreen(
  screen: PlannedIndividualScreen,
  colors: MaterializedPalette,
): AppframeConfig['screens'][number]['overlays'] {
  const accent = screen.dominantPalette?.[0] ?? colors.primary;
  const overlays: NonNullable<AppframeConfig['screens'][number]['overlays']> = [];
  const avoidTop = screen.cropPlan?.avoidRegions.includes('top') ?? false;
  const avoidBottom = screen.cropPlan?.avoidRegions.includes('bottom') ?? false;

  if (screen.slideRole === 'trust' || screen.slideRole === 'summary') {
    overlays.push({
      id: `trust-${screen.index}`,
      type: 'star-rating',
      x: 72,
      y: avoidTop ? 34 : 22,
      size: 14,
      rotation: 0,
      opacity: 0.96,
      shapeColor: '#F59E0B',
    });
  }

  if (screen.composition !== 'single') {
    overlays.push({
      id: `shape-${screen.index}`,
      type: 'shape',
      x: 8,
      y: avoidBottom ? 52 : 66,
      size: screen.composition === 'fanned-cards' ? 16 : 12,
      rotation: screen.index % 2 === 0 ? -8 : 8,
      opacity: 0.88,
      shapeType: 'circle',
      shapeColor: accent,
      shapeOpacity: 0.24,
      shapeBlur: 4,
    });
  }

  return overlays.length > 0 ? overlays : undefined;
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
    frame.compositionNote ??
    frame.assetGuidance ??
    frame.pacing ??
    `Use the ${frame.sourceRole} screen as a supporting proof detail.`
  );
}

function hasCompositionFeature(
  frame: PlannedPanoramicFrame,
  feature: 'layered-detail-extract' | 'floating-detail-card' | 'decorative-cluster' | 'proof-stack',
): boolean {
  return frame.compositionFeatures?.includes(feature) ?? false;
}

function buildShadow(args: {
  opacity: number;
  blur: number;
  offsetY: number;
  color?: string;
}) {
  return {
    opacity: args.opacity,
    blur: args.blur,
    offsetY: args.offsetY,
    color: args.color ?? '#0F172A',
  };
}

function buildPanoramicDetailStackGroup(args: {
  screenshot: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  textColor: string;
  badgeText: string;
  focusX: number;
  focusY: number;
  zoom: number;
  tone: 'light' | 'dark';
}): PanoramicElement {
  const shadowColor = args.tone === 'dark' ? '#020617' : '#0F172A';
  const badgeColor = args.tone === 'dark' ? '#FFFFFF' : args.textColor;
  const badgeBackground = args.tone === 'dark' ? '#0F172ACC' : '#FFFFFFE8';
  const children: PanoramicGroupChild[] = [
    {
      type: 'crop',
      screenshot: args.screenshot,
      x: 4,
      y: 15,
      width: 56,
      height: 44,
      focusX: Math.max(12, args.focusX - 4),
      focusY: Math.min(88, args.focusY + 2),
      zoom: Math.max(1.35, args.zoom - 0.15),
      rotation: -7,
      borderRadius: 20,
      shadow: buildShadow({ opacity: 0.16, blur: 18, offsetY: 8, color: shadowColor }),
      z: 1,
    },
    {
      type: 'crop',
      screenshot: args.screenshot,
      x: 28,
      y: 4,
      width: 64,
      height: 52,
      focusX: args.focusX,
      focusY: args.focusY,
      zoom: args.zoom,
      rotation: 6,
      borderRadius: 24,
      shadow: buildShadow({ opacity: 0.22, blur: 24, offsetY: 10, color: shadowColor }),
      z: 2,
    },
    {
      type: 'badge',
      content: args.badgeText,
      x: 6,
      y: 0,
      width: 36,
      height: 8.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.96,
      borderColor: args.accentColor,
      borderWidth: args.tone === 'dark' ? 0 : 1,
      borderRadius: 100,
      fontSize: 1.05,
      fontWeight: 700,
      letterSpacing: 9,
      textTransform: 'uppercase',
      rotation: 0,
      shadow: buildShadow({ opacity: 0.08, blur: 14, offsetY: 4, color: shadowColor }),
      z: 3,
    },
  ];

  return {
    type: 'group',
    x: args.x,
    y: args.y,
    width: args.width,
    height: args.height,
    rotation: args.rotation,
    opacity: 0.98,
    z: 7,
    children,
  };
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
  badgeContent?: string;
  cardBackgroundColor?: string;
  includeCrop?: boolean;
}): PanoramicElement {
  const includeCrop = args.includeCrop ?? true;
  const children: PanoramicGroupChild[] = [];

  if (args.badgeContent) {
    children.push({
      type: 'badge',
      content: args.badgeContent,
      x: 10,
      y: 0,
      width: 36,
      height: 8.4,
      color: args.textColor,
      backgroundColor: '#FFFFFFE8',
      opacity: 0.96,
      borderColor: args.accentColor,
      borderWidth: 1,
      borderRadius: 100,
      fontSize: 1,
      fontWeight: 700,
      letterSpacing: 9,
      textTransform: 'uppercase',
      rotation: 0,
      shadow: buildShadow({ opacity: 0.08, blur: 12, offsetY: 3 }),
      z: 3,
    });
  }

  if (includeCrop) {
    children.push({
      type: 'crop',
      screenshot: args.screenshot,
      x: 0,
      y: args.badgeContent ? 7 : 0,
      width: 100,
      height: 58,
      focusX: args.focusX,
      focusY: args.focusY,
      zoom: args.zoom,
      rotation: args.rotation > 0 ? -6 : 6,
      borderRadius: 24,
      shadow: buildShadow({ opacity: 0.18, blur: 22, offsetY: 8 }),
      z: 1,
    });
  }

  children.push({
    type: 'card',
    x: includeCrop ? 10 : 6,
    y: includeCrop ? 50 : 10,
    width: includeCrop ? 82 : 88,
    height: includeCrop ? 36 : 44,
    eyebrow: args.storyBeat,
    title: args.title,
    body: args.body,
    align: 'left',
    backgroundColor: args.cardBackgroundColor ?? '#FFFFFF',
    opacity: 0.97,
    borderColor: args.accentColor,
    borderWidth: 1,
    borderRadius: 24,
    padding: includeCrop ? 2 : 2.4,
    rotation: 0,
    eyebrowColor: args.subtitleColor,
    titleColor: args.textColor,
    bodyColor: args.subtitleColor,
    eyebrowSize: includeCrop ? 3.5 : 3.2,
    titleSize: includeCrop ? 7.2 : 7.8,
    bodySize: includeCrop ? 4.1 : 4.3,
    shadow: buildShadow({ opacity: 0.12, blur: 20, offsetY: 6 }),
    z: 2,
  });

  return {
    type: 'group',
    x: args.x,
    y: args.y,
    width: args.width,
    height: args.height,
    rotation: args.rotation,
    opacity: 1,
    z: 8,
    children,
  };
}

function buildPanoramicDecorativeGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  label?: string;
  dark: boolean;
}): PanoramicElement {
  const children: PanoramicGroupChild[] = [
    {
      type: 'decoration',
      shape: 'circle',
      x: 0,
      y: 12,
      width: 18,
      height: 18,
      color: args.accentColor,
      opacity: args.dark ? 0.34 : 0.2,
      rotation: 0,
      z: 1,
    },
    {
      type: 'decoration',
      shape: 'dot-grid',
      x: 18,
      y: 0,
      width: 36,
      height: 22,
      color: args.secondaryColor,
      opacity: args.dark ? 0.28 : 0.2,
      rotation: 0,
      z: 2,
    },
    {
      type: 'decoration',
      shape: 'line',
      x: 12,
      y: 34,
      width: 44,
      height: 2,
      color: args.accentColor,
      opacity: args.dark ? 0.42 : 0.28,
      rotation: 12,
      z: 3,
    },
  ];

  if (args.label) {
    children.push({
      type: 'badge',
      content: args.label,
      x: 8,
      y: 24,
      width: 34,
      height: 9,
      color: args.dark ? '#FFFFFF' : '#0F172A',
      backgroundColor: args.dark ? '#0F172ACC' : '#FFFFFFE0',
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 1,
      fontWeight: 700,
      letterSpacing: 8,
      textTransform: 'uppercase',
      rotation: 0,
      z: 4,
    });
  }

  return {
    type: 'group',
    x: args.x,
    y: args.y,
    width: args.width,
    height: args.height,
    rotation: args.rotation,
    opacity: args.dark ? 0.92 : 0.88,
    z: 4,
    children,
  };
}

function panoramicTextY(frame: PlannedPanoramicFrame, recipe: PlannedPanoramicVariant['recipe']): number {
  if (frame.cropPlan?.avoidRegions.includes('top')) {
    return recipe === 'bold-panorama' ? 10 : 11;
  }
  return 6;
}

function panoramicLabelY(frame: PlannedPanoramicFrame, recipe: PlannedPanoramicVariant['recipe']): number {
  return panoramicTextY(frame, recipe) + (recipe === 'bold-panorama' ? 13 : 11);
}

function panoramicProofChipY(
  frame: PlannedPanoramicFrame,
  recipe: PlannedPanoramicVariant['recipe'],
): number {
  if (frame.storyBeat === 'summary') return 72;
  if (frame.cropPlan?.avoidRegions.includes('top')) {
    return recipe === 'bold-panorama' ? 34 : 31;
  }
  return recipe === 'bold-panorama' ? 26 : 24;
}

function panoramicFocusPoint(
  frame: PlannedPanoramicFrame,
  fallbackX: number,
  fallbackY: number,
): { x: number; y: number } {
  if (!frame.cropPlan) return { x: fallbackX, y: fallbackY };

  switch (frame.cropPlan.anchor) {
    case 'upper-half':
      return { x: fallbackX, y: 28 };
    case 'lower-half':
      return { x: fallbackX, y: 64 };
    case 'left-rail':
      return { x: 34, y: fallbackY };
    case 'right-rail':
      return { x: 66, y: fallbackY };
    default:
      return { x: fallbackX, y: fallbackY };
  }
}

function panoramicDevicePlacement(
  frame: PlannedPanoramicFrame,
  index: number,
  frameCenter: number,
  frameStrategy: PlannedFrameStrategy | undefined,
): { x: number; y: number; width: number; rotation: number } {
  const extractDriven = frameStrategy?.defaultTreatment === 'mixed' && frame.cropPlan?.usage !== 'full-device';
  const xOffset = frame.cropPlan?.anchor === 'left-rail'
    ? -1.5
    : frame.cropPlan?.anchor === 'right-rail'
      ? 1.5
      : 0;
  const y = frame.cropPlan?.avoidRegions.includes('top')
    ? 28
    : extractDriven
      ? 26
      : 24;
  return {
    x: Math.max(2, frameCenter - (extractDriven ? 6.5 : 7) + xOffset),
    y,
    width: extractDriven ? 13 : 14,
    rotation: index % 2 === 0 ? -2 : 2,
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
    const resolvedFraming = resolveIndividualFraming(screen, args.variant.frameStrategy);
    const extraScreenshots = screen.cropPlan?.usage === 'supporting-crop'
      ? (screen.extraScreenshots ?? [])
        .slice(0, screen.composition === 'fanned-cards' ? 2 : 1)
        .map((pathValue) => ({ screenshot: toConfigRelativePath(args.configDir, pathValue) }))
      : [];
    const loupe = buildLoupeForScreen(screen, colors, screen.composition);
    const overlays = buildOverlaysForScreen(screen, colors);
    const deviceTreatment = buildIndividualDeviceTreatment({
      resolvedFraming,
      screen,
      colors,
    });
    const subtitle = buildSubtitle({
      category: args.plan.app.category,
      slideRole: screen.slideRole,
      sourceRole: screen.sourceRole,
      focus: screen.copyDirection,
      cropPlan: screen.cropPlan,
      selectedSubtitle: copy?.subtitle,
    });

    return {
      screenshot: toConfigRelativePath(args.configDir, screen.sourcePath),
      headline: copy?.headline ?? buildHeadline(screen.copyDirection, screen.slideRole),
      subtitle,
      layout: screen.layout,
      composition: screen.composition,
      ...(extraScreenshots.length > 0 ? { extraDevices: extraScreenshots } : {}),
      autoSizeHeadline: true,
      autoSizeSubtitle:
        Boolean(subtitle)
        && (
          resolvedFraming === 'frameless-rounded'
          || (screen.cropPlan?.avoidRegions.length ?? 0) > 0
          || screen.composition !== 'single'
        ),
      annotations: [],
      cornerRadius: resolvedFraming === 'frameless-rounded' ? 24 : 0,
      ...buildIndividualBackground({
        screen,
        colors,
        resolvedFraming,
      }),
      ...deviceTreatment,
      ...(loupe ? { loupe } : {}),
      ...(overlays ? { overlays } : {}),
    };
  });
  const useFrameless = args.variant.frameStrategy?.defaultTreatment === 'frameless'
    || screens.every((screen) => (screen.cornerRadius ?? 0) > 0);

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
    const hasLayeredDetail = hasCompositionFeature(frame, 'layered-detail-extract');
    const hasFloatingDetailCard = hasCompositionFeature(frame, 'floating-detail-card');
    const hasDecorativeCluster = hasCompositionFeature(frame, 'decorative-cluster');
    const allowFramelessExtracts = args.variant.frameStrategy?.defaultTreatment === 'mixed';
    const includeSupportCrop = frame.cropPlan?.usage === 'supporting-crop'
      || frame.cropPlan?.usage === 'layered-extract'
      || frame.cropPlan?.usage === 'loupe-detail';
    const copy = resolveCopyForSlot(args.selectedCopySet, frame.storyBeat, featureIndex);
    if (frame.storyBeat === 'feature') featureIndex += 1;
    const sourceScreenshot = toConfigRelativePath(args.configDir, frame.sourcePath);
    const supportTitle = storyBeatTitle(frame.storyBeat);
    const defaultDetailFocusX = frame.focalPoint?.x
      ?? (frame.sourceRole === 'detail' || frame.sourceRole === 'paywall' ? 55 : 50);
    const defaultDetailFocusY = frame.focalPoint?.y
      ?? (frame.storyBeat === 'hero' ? 32 : 40);
    const detailFocus = panoramicFocusPoint(frame, defaultDetailFocusX, defaultDetailFocusY);
    const devicePlacement = panoramicDevicePlacement(
      frame,
      index,
      frameCenter,
      args.variant.frameStrategy,
    );
    const deviceTreatment = panoramicDeviceTreatment(
      frame,
      args.variant.frameStrategy,
      args.backgroundColor,
    );
    const textPlacement = panoramicTextPlacement({
      frame,
      recipe: args.variant.recipe,
      frameSliceStart,
      sliceWidth,
      frameStrategy: args.variant.frameStrategy,
    });
    const textY = panoramicTextY(frame, args.variant.recipe);
    const labelY = panoramicLabelY(frame, args.variant.recipe);
    const supportBody = copy?.subtitle ?? storyBeatBody(frame);
    const supportCardBackground = lightPaletteColor(frame.dominantPalette)
      ?? (args.variant.recipe === 'bold-panorama' ? '#FFFFFFF0' : '#FFFFFFF2');

    elements.push({
      type: 'device',
      screenshot: sourceScreenshot,
      frame: args.frameId,
      frameStyle: deviceTreatment.frameStyle,
      x: devicePlacement.x,
      y: devicePlacement.y,
      width: devicePlacement.width,
      rotation: devicePlacement.rotation,
      deviceScale: deviceTreatment.deviceScale,
      deviceTop: deviceTreatment.deviceTop,
      deviceOffsetX: 0,
      deviceAngle: deviceTreatment.deviceAngle,
      deviceTilt: 0,
      cornerRadius: deviceTreatment.cornerRadius,
      fullscreenScreenshot: false,
      ...(deviceTreatment.shadow ? { shadow: deviceTreatment.shadow } : {}),
      ...(deviceTreatment.borderSimulation ? { borderSimulation: deviceTreatment.borderSimulation } : {}),
      z: 5,
    });

    elements.push({
      type: 'text',
      content: copy?.headline ?? buildHeadline(frame.storyBeat, frame.sourceRole),
      x: textPlacement.x,
      y: textY,
      fontSize: textPlacement.fontSize,
      color: args.textColor,
      fontWeight: 700,
      fontStyle: 'normal',
      textAlign: 'left',
      lineHeight: 1.1,
      maxWidth: textPlacement.maxWidth,
      letterSpacing: 0,
      textTransform: '',
      rotation: 0,
      z: 10,
    });

    elements.push({
      type: 'label',
      content: frame.storyBeat,
      x: frameSliceStart + 4,
      y: labelY,
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

    if (index === 0 || frame.storyBeat === 'trust' || frame.storyBeat === 'summary') {
      elements.push({
        type: 'proof-chip',
        value:
          frame.storyBeat === 'summary'
            ? 'Power-user approved'
            : args.variant.recipe === 'bold-panorama'
              ? '4.9 out of 5'
              : 'Top rated flow',
        detail:
          frame.storyBeat === 'summary'
            ? 'Built for daily use'
            : args.variant.recipe === 'bold-panorama'
              ? 'App Store reviews'
              : 'Trusted by repeat users',
        rating: args.variant.recipe === 'bold-panorama' ? 5 : undefined,
        maxRating: 5,
        x: frameSliceStart + Math.max(2.5, sliceWidth - 18),
        y: panoramicProofChipY(frame, args.variant.recipe),
        width: Math.min(16, sliceWidth - 4),
        height: 8.5,
        color: args.textColor,
        mutedColor: args.subtitleColor,
        starColor: '#F59E0B',
        backgroundColor: '#FFFFFFE8',
        opacity: 0.98,
        borderColor: args.variant.recipe === 'bold-panorama' ? '#FFFFFF66' : args.accentColor,
        borderWidth: args.variant.recipe === 'bold-panorama' ? 0.5 : 1,
        borderRadius: 28,
        valueSize: 1.65,
        detailSize: 0.95,
        padding: 1.4,
        rotation: 0,
        z: 11,
      });
    }

    if (
      args.variant.recipe === 'editorial-panorama'
      && hasLayeredDetail
      && allowFramelessExtracts
      && frame.cropPlan?.usage === 'layered-extract'
    ) {
      const detailWidth = Math.max(11, sliceWidth - 10);
      elements.push(
        buildPanoramicDetailStackGroup({
          screenshot: sourceScreenshot,
          x: frameSliceStart + 1.5,
          y: index % 2 === 0 ? 24 : 30,
          width: detailWidth,
          height: 18,
          rotation: index % 2 === 0 ? -4 : 4,
          accentColor: args.accentColor,
          textColor: args.textColor,
          badgeText: frame.storyBeat === 'hero' ? 'Key detail' : 'UI detail',
          focusX: detailFocus.x,
          focusY: detailFocus.y,
          zoom: frame.cropPlan?.usage === 'layered-extract'
            ? 2.2
            : frame.cropSuitability === 'high'
              ? 2.1
              : 1.75,
          tone: 'light',
        }),
      );
    }

    if (args.variant.recipe === 'editorial-panorama' && hasFloatingDetailCard) {
      const groupWidth = Math.max(12.5, sliceWidth - 8);
      elements.push(
        buildPanoramicSupportGroup({
          screenshot: sourceScreenshot,
          x: frameSliceStart + sliceWidth - groupWidth - 2,
          y: frame.cropPlan?.avoidRegions.includes('bottom') ? 42 : index % 2 === 0 ? 52 : 56,
          width: groupWidth,
          height: 28,
          rotation: index % 2 === 0 ? -3 : 3,
          storyBeat: frame.storyBeat,
          title: supportTitle,
          body: supportBody,
          accentColor: args.accentColor,
          textColor: args.textColor,
          subtitleColor: args.subtitleColor,
          focusX: detailFocus.x,
          focusY: detailFocus.y,
          zoom: includeSupportCrop
            ? frame.cropSuitability === 'high' ? 1.8 : 1.5
            : 1.35,
          badgeContent: frame.storyBeat === 'hero' ? 'Editorial system' : 'Story card',
          cardBackgroundColor: supportCardBackground,
          includeCrop: includeSupportCrop && allowFramelessExtracts,
        }),
      );
    }

    if (args.variant.recipe === 'editorial-panorama' && hasDecorativeCluster) {
      elements.push(
        buildPanoramicDecorativeGroup({
          x: frameSliceStart + Math.max(2, sliceWidth - 11),
          y: frame.storyBeat === 'summary' ? 70 : 18,
          width: 10,
          height: 18,
          rotation: index % 2 === 0 ? 8 : -8,
          accentColor: args.accentColor,
          secondaryColor: args.subtitleColor,
          label: frame.storyBeat === 'hero' ? 'Featured' : undefined,
          dark: false,
        }),
      );
    }

    if (
      args.variant.recipe === 'bold-panorama'
      && hasLayeredDetail
      && allowFramelessExtracts
      && frame.cropPlan?.usage === 'layered-extract'
    ) {
      const detailWidth = Math.max(11.5, sliceWidth - 9);
      elements.push(
        buildPanoramicDetailStackGroup({
          screenshot: sourceScreenshot,
          x: frameSliceStart + sliceWidth - detailWidth - 1.5,
          y: 18,
          width: detailWidth,
          height: 18.5,
          rotation: index % 2 === 0 ? 5 : -5,
          accentColor: args.accentColor,
          textColor: '#0F172A',
          badgeText: frame.storyBeat === 'hero' ? 'Hero detail' : 'Zoomed UI',
          focusX: detailFocus.x,
          focusY: detailFocus.y,
          zoom: frame.cropPlan?.usage === 'layered-extract'
            ? 2.3
            : frame.cropSuitability === 'high'
              ? 2.2
              : 1.85,
          tone: 'dark',
        }),
      );
    }

    if (
      args.variant.recipe === 'bold-panorama'
      && hasFloatingDetailCard
      && includeSupportCrop
      && frame.cropSuitability !== 'low'
    ) {
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
          focusX: detailFocus.x,
          focusY: detailFocus.y,
          zoom: frame.cropSuitability === 'high' ? 1.9 : 1.55,
          badgeContent: frame.storyBeat === 'trust' ? 'Proof card' : 'Momentum card',
          cardBackgroundColor: supportCardBackground,
          includeCrop: allowFramelessExtracts,
        }),
      );
    } else if (args.variant.recipe === 'bold-panorama' && hasFloatingDetailCard) {
      elements.push(
        buildPanoramicSupportGroup({
          screenshot: sourceScreenshot,
          x: frameSliceStart + 3,
          y: 58,
          width: Math.max(12.5, sliceWidth - 7),
          height: 21,
          rotation: index % 2 === 0 ? -3 : 3,
          storyBeat: frame.storyBeat,
          title: supportTitle,
          body: supportBody,
          accentColor: args.accentColor,
          textColor: '#111827',
          subtitleColor: '#475569',
          focusX: detailFocus.x,
          focusY: detailFocus.y,
          zoom: 1.45,
          badgeContent: 'Focus card',
          cardBackgroundColor: supportCardBackground,
          includeCrop: false,
        }),
      );
    }

    if (args.variant.recipe === 'bold-panorama' && hasDecorativeCluster) {
      elements.push(
        buildPanoramicDecorativeGroup({
          x: frameSliceStart + 2,
          y: frame.storyBeat === 'summary' ? 16 : 72,
          width: 10.5,
          height: 18,
          rotation: index % 2 === 0 ? -10 : 10,
          accentColor: args.accentColor,
          secondaryColor: '#FFFFFF',
          label: frame.storyBeat === 'summary' ? 'Finale' : undefined,
          dark: true,
        }),
      );
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

function buildPanoramicBackground(args: {
  style: TemplateStyle;
  colors: MaterializedPalette;
}): NonNullable<AppframeConfig['panoramic']>['background'] {
  if (args.style === 'editorial') {
    return {
      type: 'solid',
      color: args.colors.background,
      layers: [
        {
          kind: 'gradient',
          gradientType: 'mesh',
          colors: [args.colors.secondary, '#F8E7C9', args.colors.primary],
          direction: 145,
          radialPosition: 'center',
          opacity: 0.58,
          blendMode: 'soft-light',
          blur: 0,
        },
        {
          kind: 'glow',
          color: '#FFF2D6',
          x: 68,
          y: 16,
          width: 36,
          height: 28,
          opacity: 0.34,
          blur: 96,
          blendMode: 'screen',
        },
      ],
    };
  }

  if (args.style === 'branded' || args.style === 'bold') {
    return {
      type: 'solid',
      color: args.colors.background,
      layers: [
        {
          kind: 'gradient',
          gradientType: 'mesh',
          colors: [args.colors.primary, args.colors.secondary, '#FFFFFF'],
          direction: 135,
          radialPosition: 'center',
          opacity: 0.72,
          blendMode: 'overlay',
          blur: 0,
        },
        {
          kind: 'solid',
          color: '#0B1020',
          opacity: 0.12,
          blendMode: 'multiply',
          blur: 0,
        },
        {
          kind: 'glow',
          color: args.colors.primary,
          x: 24,
          y: 18,
          width: 42,
          height: 34,
          opacity: 0.38,
          blur: 110,
          blendMode: 'screen',
        },
      ],
    };
  }

  return {
    type: 'solid',
    color: args.colors.background,
    layers: [
      {
        kind: 'gradient',
        gradientType: 'radial',
        colors: ['#FFFFFF', args.colors.primary],
        direction: 135,
        radialPosition: 'top',
        opacity: 0.3,
        blendMode: 'soft-light',
        blur: 0,
      },
    ],
  };
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
      style: args.variant.frameStrategy?.defaultTreatment === 'frameless' ? 'none' : 'flat',
    },
    screens: [],
    frameCount: args.variant.canvasPlan.frameCount,
    panoramic: {
      background: buildPanoramicBackground({ style, colors }),
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
