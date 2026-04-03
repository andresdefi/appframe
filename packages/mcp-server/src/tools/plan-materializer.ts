import type { AppframeConfig, PanoramicElement, Platform, TemplateStyle } from '@appframe/core';
import { validateConfig } from '@appframe/core';
import { mkdir, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative } from 'node:path';
import { stringify } from 'yaml';
import type {
  PanoramicCompositionFeature,
  PanoramicSupportSystem,
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

function hexToRgb(value: string): { r: number; g: number; b: number } | null {
  const normalized = value.trim().replace(/^#/, '');
  const expanded = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;
  if (!/^[0-9a-f]{6}$/i.test(expanded)) return null;

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

function mixHexColors(primary: string, secondary: string, weight = 0.5): string | null {
  const left = hexToRgb(primary);
  const right = hexToRgb(secondary);
  if (!left || !right) return null;
  const clampedWeight = Math.max(0, Math.min(1, weight));
  const mixChannel = (leftValue: number, rightValue: number) =>
    Math.round((leftValue * (1 - clampedWeight)) + (rightValue * clampedWeight));

  return `#${[
    mixChannel(left.r, right.r),
    mixChannel(left.g, right.g),
    mixChannel(left.b, right.b),
  ].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
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
  const accent = args.screen.dominantPalette?.[0] ?? args.colors.primary;
  const mixedBackground = (base: string | undefined, overlay: string, weight: number): string | undefined =>
    mixHexColors(base ?? args.colors.background, overlay, weight) ?? base ?? args.colors.background;

  switch (args.screen.backgroundStrategy) {
    case 'airy-spotlight':
      return { background: mixedBackground(backgroundFromPalette, '#FFFFFF', 0.5) };
    case 'community-spotlight':
      return { background: mixedBackground(backgroundFromPalette, args.colors.secondary, 0.22) };
    case 'care-surface':
      return { background: mixedBackground(backgroundFromPalette, '#FFFFFF', 0.42) };
    case 'folio-surface':
      return { background: mixedBackground(backgroundFromPalette, '#F8FAFC', 0.46) };
    case 'signal-burst':
      return { background: mixedBackground(accent, args.colors.primary, 0.18) };
    case 'vault-glow':
      return { background: mixedBackground(backgroundFromPalette ?? accent, '#0F172A', 0.22) };
    case 'perk-glow':
      return { background: mixedBackground(accent, args.colors.secondary, 0.24) };
    case 'route-glow':
      return { background: mixedBackground(backgroundFromPalette, args.colors.primary, 0.24) };
    case 'quiet-surface':
      return { background: mixedBackground(backgroundFromPalette, args.colors.subtitle, 0.12) };
    case 'playback-stage':
      return { background: mixedBackground(accent, args.colors.secondary, 0.28) };
    case 'premium-spotlight':
      return { background: mixedBackground(accent, args.colors.secondary, 0.3) };
    case 'studio-surface':
      return { background: mixedBackground(backgroundFromPalette, args.colors.primary, 0.2) };
    case 'workflow-surface':
      return { background: mixedBackground(backgroundFromPalette, args.colors.primary, 0.1) };
    case 'catalog-glow':
      return { background: mixedBackground(accent, args.colors.secondary, 0.22) };
    case 'checkout-lane':
      return { background: mixedBackground(accent, args.colors.primary, 0.2) };
    case 'capture-stage':
      return { background: mixedBackground(accent, '#0F172A', 0.34) };
    case 'timeline-surface':
      return { background: mixedBackground(backgroundFromPalette, args.colors.primary, 0.16) };
    case 'discovery-glow':
      return { background: mixedBackground(accent, '#FFFFFF', 0.38) };
    case 'conversation-glow':
      return { background: mixedBackground(backgroundFromPalette, args.colors.primary, 0.18) };
    case 'proof-grid':
      return { background: mixedBackground(backgroundFromPalette, args.colors.secondary, 0.16) };
    case 'proof-tint':
      return { background: mixedBackground(backgroundFromPalette, accent, 0.14) };
    default:
      break;
  }

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

function panoramicRecipeFamily(recipe: string): 'editorial' | 'bold' {
  switch (recipe) {
    case 'editorial-panorama':
    case 'editorial-confidence':
    case 'wellness-panorama':
    case 'workflow-panorama':
    case 'conversation-panorama':
    case 'gallery-panorama':
    case 'world-panorama':
      return 'editorial';
    default:
      return 'bold';
  }
}

function panoramicRecipeArchetype(recipe: string):
  | 'confidence'
  | 'wellness'
  | 'workflow'
  | 'conversation'
  | 'gallery'
  | 'world'
  | 'default' {
  switch (recipe) {
    case 'editorial-confidence':
    case 'proof-panorama':
      return 'confidence';
    case 'wellness-panorama':
    case 'progress-panorama':
      return 'wellness';
    case 'workflow-panorama':
    case 'momentum-panorama':
      return 'workflow';
    case 'conversation-panorama':
    case 'launch-panorama':
      return 'conversation';
    case 'gallery-panorama':
    case 'portfolio-panorama':
      return 'gallery';
    case 'world-panorama':
    case 'cinematic-panorama':
      return 'world';
    default:
      return 'default';
  }
}

function isEditorialPanoramaRecipe(recipe: string): boolean {
  return panoramicRecipeFamily(recipe) === 'editorial';
}

function isBoldPanoramaRecipe(recipe: string): boolean {
  return panoramicRecipeFamily(recipe) === 'bold';
}

function panoramicTextPlacement(args: {
  frame: PlannedPanoramicFrame;
  recipe: PlannedPanoramicVariant['recipe'];
  frameSliceStart: number;
  sliceWidth: number;
  frameStrategy: PlannedFrameStrategy | undefined;
}): { x: number; maxWidth: number; fontSize: number } {
  const recipeFamily = panoramicRecipeFamily(args.recipe);
  const recipeArchetype = panoramicRecipeArchetype(args.recipe);
  let x = args.frameSliceStart + 4;
  let maxWidth = Math.max(12, Math.floor(args.sliceWidth) - 6);
  let fontSize = recipeFamily === 'editorial' ? 3.4 : 3.8;

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
  if (hasCompositionFeature(args.frame, 'toolbar-ribbon')) {
    x += 1;
    maxWidth -= 2;
    fontSize -= 0.1;
  }
  if (hasCompositionFeature(args.frame, 'trust-shield')) {
    x += 1;
    maxWidth -= 2;
    fontSize -= 0.08;
  }
  if (hasCompositionFeature(args.frame, 'support-beacon')) {
    x += 1;
    maxWidth -= 2;
    fontSize -= 0.08;
  }
  if (hasCompositionFeature(args.frame, 'browse-strip')) {
    maxWidth -= 1;
  }
  if (hasCompositionFeature(args.frame, 'reward-ribbon')) {
    maxWidth -= 1;
  }
  if (hasCompositionFeature(args.frame, 'checkout-lane')) {
    maxWidth -= 1;
  }
  if (hasCompositionFeature(args.frame, 'route-arc')) {
    maxWidth -= 1;
  }
  if (hasCompositionFeature(args.frame, 'media-marquee')) {
    maxWidth -= 2;
    fontSize -= 0.05;
  }
  if (args.frame.supportSystem === 'quote-stack' || args.frame.supportSystem === 'proof-column' || args.frame.supportSystem === 'metric-ladder') {
    maxWidth -= 2;
  }
  if (args.frame.supportSystem === 'milestone-band') {
    maxWidth -= 1;
    fontSize -= 0.05;
  }
  if (hasCompositionFeature(args.frame, 'profile-orbit')) {
    fontSize -= 0.05;
  }
  if (args.frame.layoutArchetype?.includes('split') || args.frame.layoutArchetype?.includes('signal-opener')) {
    maxWidth -= 3;
    fontSize -= 0.1;
  }
  if (args.frame.layoutArchetype?.includes('poster') || args.frame.layoutArchetype?.includes('gallery-opener')) {
    maxWidth += 1;
    fontSize += recipeFamily === 'editorial' ? 0.08 : 0.14;
  }
  if (args.frame.layoutArchetype?.includes('close')) {
    maxWidth -= 1;
  }
  if (recipeArchetype === 'workflow') {
    x += 0.5;
    maxWidth -= 1;
  } else if (recipeArchetype === 'conversation') {
    maxWidth -= 1.5;
  } else if (recipeArchetype === 'gallery' || recipeArchetype === 'world') {
    fontSize += 0.06;
  }

  return {
    x,
    maxWidth: Math.max(10, maxWidth),
    fontSize: Math.max(3.05, fontSize),
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

function supportSystemLabel(system: PanoramicSupportSystem | undefined): string | null {
  switch (system) {
    case 'quote-stack':
      return 'Quote stack';
    case 'metric-ladder':
      return 'Metric ladder';
    case 'signal-chain':
      return 'Signal chain';
    case 'milestone-band':
      return 'Milestone band';
    case 'curation-shelf':
      return 'Curation shelf';
    case 'proof-column':
      return 'Proof column';
    default:
      return null;
  }
}

function hasCompositionFeature(
  frame: PlannedPanoramicFrame,
  feature: PanoramicCompositionFeature,
): boolean {
  return frame.compositionFeatures?.includes(feature) ?? false;
}

function panoramicSupportSystemPlacement(args: {
  frame: PlannedPanoramicFrame;
  index: number;
  frameSliceStart: number;
  sliceWidth: number;
  boldRecipe: boolean;
}): { x: number; y: number; width: number; height: number; rotation: number } | null {
  const supportSystem = args.frame.supportSystem;
  if (!supportSystem) return null;

  const isClose = args.frame.storyBeat === 'summary' || args.frame.layoutArchetype?.includes('close');
  const width = Math.max(12.5, args.sliceWidth - (args.boldRecipe ? 5.5 : 6.5));
  const rotation = args.index % 2 === 0 ? (args.boldRecipe ? -4 : -3) : (args.boldRecipe ? 4 : 3);

  switch (supportSystem) {
    case 'quote-stack':
      return {
        x: args.boldRecipe ? args.frameSliceStart + 2.5 : args.frameSliceStart + args.sliceWidth - width - 2,
        y: isClose ? 50 : 38,
        width,
        height: 29,
        rotation,
      };
    case 'metric-ladder':
      return {
        x: args.frameSliceStart + args.sliceWidth - width - 2,
        y: args.frame.storyBeat === 'hero' ? 18 : isClose ? 56 : 46,
        width,
        height: 20,
        rotation,
      };
    case 'signal-chain':
      return {
        x: args.frameSliceStart + 2,
        y: isClose ? 74 : 68,
        width,
        height: 15,
        rotation,
      };
    case 'milestone-band':
      return {
        x: args.frameSliceStart + 2,
        y: args.frame.storyBeat === 'hero' ? 18 : isClose ? 70 : 60,
        width,
        height: 18,
        rotation,
      };
    case 'curation-shelf':
      return {
        x: args.frameSliceStart + 2,
        y: isClose ? 70 : 66,
        width,
        height: 20,
        rotation,
      };
    case 'proof-column':
      return {
        x: args.boldRecipe ? args.frameSliceStart + 2.5 : args.frameSliceStart + args.sliceWidth - width - 2,
        y: isClose ? 52 : 40,
        width,
        height: 22,
        rotation,
      };
  }
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

function buildPanoramicQuoteStackGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  textColor: string;
  subtitleColor: string;
  dark: boolean;
  title: string;
  body: string;
}): PanoramicElement {
  const cardBackground = args.dark ? '#111827E8' : '#FFFFFFEE';
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : args.textColor;
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Story quote',
      x: 0,
      y: 0,
      width: 38,
      height: 9,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.9,
      fontWeight: 700,
      letterSpacing: 7,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'card',
      x: 0,
      y: 12,
      width: 78,
      height: 36,
      eyebrow: 'Lead',
      title: args.title,
      body: args.body,
      align: 'left',
      backgroundColor: cardBackground,
      opacity: 0.97,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 22,
      padding: 2.2,
      rotation: -2,
      eyebrowColor: args.subtitleColor,
      titleColor: args.dark ? '#FFFFFF' : args.textColor,
      bodyColor: args.dark ? '#CBD5E1' : args.subtitleColor,
      eyebrowSize: 2.8,
      titleSize: 6.4,
      bodySize: 3.5,
      shadow: buildShadow({ opacity: 0.16, blur: 18, offsetY: 6, color: args.dark ? '#020617' : '#0F172A' }),
      z: 2,
    },
    {
      type: 'card',
      x: 18,
      y: 42,
      width: 74,
      height: 28,
      eyebrow: 'Why it lands',
      title: 'Proof stays readable',
      body: 'Keep the support copy shorter than the headline so the stack closes cleanly.',
      align: 'left',
      backgroundColor: cardBackground,
      opacity: 0.94,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 22,
      padding: 2.1,
      rotation: 3,
      eyebrowColor: args.subtitleColor,
      titleColor: args.dark ? '#FFFFFF' : args.textColor,
      bodyColor: args.dark ? '#CBD5E1' : args.subtitleColor,
      eyebrowSize: 2.4,
      titleSize: 5.4,
      bodySize: 3.1,
      shadow: buildShadow({ opacity: 0.12, blur: 16, offsetY: 5, color: args.dark ? '#020617' : '#0F172A' }),
      z: 1,
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
    z: 8,
    children,
  };
}

function buildPanoramicMetricLadderGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  dark: boolean;
}): PanoramicElement {
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const trackColor = args.dark ? '#FFFFFF66' : '#CBD5E1';
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Metric ladder',
      x: 0,
      y: 0,
      width: 38,
      height: 9,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.9,
      fontWeight: 700,
      letterSpacing: 7,
      textTransform: 'uppercase',
      rotation: 0,
      z: 4,
    },
    {
      type: 'badge',
      content: 'Lift',
      x: 72,
      y: 14,
      width: 18,
      height: 8,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.92,
      borderColor: args.secondaryColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.78,
      fontWeight: 700,
      letterSpacing: 5,
      textTransform: 'uppercase',
      rotation: 0,
      z: 4,
    },
  ];

  [0, 1, 2].forEach((step) => {
    children.push({
      type: 'decoration',
      shape: 'line',
      x: 8,
      y: 20 + (step * 14),
      width: 38 + (step * 14),
      height: 3,
      color: step === 2 ? args.accentColor : step === 1 ? args.secondaryColor : trackColor,
      opacity: args.dark ? 0.58 - (step * 0.08) : 0.34 + (step * 0.08),
      rotation: 0,
      z: 2,
    });
  });

  children.push(
    {
      type: 'decoration',
      shape: 'circle',
      x: 50,
      y: 44,
      width: 8,
      height: 8,
      color: args.secondaryColor,
      opacity: args.dark ? 0.52 : 0.28,
      rotation: 0,
      z: 3,
    },
    {
      type: 'decoration',
      shape: 'circle',
      x: 72,
      y: 58,
      width: 10,
      height: 10,
      color: args.accentColor,
      opacity: args.dark ? 0.58 : 0.34,
      rotation: 0,
      z: 3,
    },
  );

  return {
    type: 'group',
    x: args.x,
    y: args.y,
    width: args.width,
    height: args.height,
    rotation: args.rotation,
    opacity: 0.98,
    z: 8,
    children,
  };
}

function buildPanoramicSignalChainGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  dark: boolean;
}): PanoramicElement {
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Signal chain',
      x: 0,
      y: 0,
      width: 34,
      height: 8.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.82,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 4,
    },
  ];

  const labels = ['Live', 'Reply', 'Share', 'Return'];
  labels.forEach((label, index) => {
    children.push({
      type: 'badge',
      content: label,
      x: 4 + (index * 22),
      y: 18 + ((index % 2) * 10),
      width: 18,
      height: 7.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.92,
      borderColor: index % 2 === 0 ? args.accentColor : args.secondaryColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.72,
      fontWeight: 700,
      letterSpacing: 5,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    });
    if (index < labels.length - 1) {
      children.push({
        type: 'decoration',
        shape: 'line',
        x: 20 + (index * 22),
        y: index % 2 === 0 ? 27 : 35,
        width: 10,
        height: 2,
        color: index % 2 === 0 ? args.secondaryColor : args.accentColor,
        opacity: args.dark ? 0.42 : 0.24,
        rotation: index % 2 === 0 ? 10 : -10,
        z: 2,
      });
    }
  });

  return {
    type: 'group',
    x: args.x,
    y: args.y,
    width: args.width,
    height: args.height,
    rotation: args.rotation,
    opacity: 0.98,
    z: 8,
    children,
  };
}

function buildPanoramicMilestoneBandGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  textColor: string;
  subtitleColor: string;
  dark: boolean;
  title: string;
}): PanoramicElement {
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const cardBackground = args.dark ? '#111827E6' : '#FFFFFFEE';
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Milestone band',
      x: 0,
      y: 0,
      width: 36,
      height: 8.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.82,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 4,
    },
    {
      type: 'card',
      x: 56,
      y: 28,
      width: 40,
      height: 22,
      eyebrow: 'Next',
      title: args.title,
      body: 'Keep the next checkpoint obvious.',
      align: 'left',
      backgroundColor: cardBackground,
      opacity: 0.96,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 18,
      padding: 1.8,
      rotation: 0,
      eyebrowColor: args.subtitleColor,
      titleColor: args.dark ? '#FFFFFF' : args.textColor,
      bodyColor: args.dark ? '#CBD5E1' : args.subtitleColor,
      eyebrowSize: 2.3,
      titleSize: 4.8,
      bodySize: 2.8,
      shadow: buildShadow({ opacity: 0.12, blur: 14, offsetY: 5, color: args.dark ? '#020617' : '#0F172A' }),
      z: 3,
    },
  ];

  [0, 1, 2].forEach((step) => {
    children.push({
      type: 'decoration',
      shape: 'circle',
      x: 8 + (step * 18),
      y: 34,
      width: step === 2 ? 10 : 8,
      height: step === 2 ? 10 : 8,
      color: step === 2 ? args.accentColor : step === 1 ? args.secondaryColor : badgeColor,
      opacity: args.dark ? 0.58 - (step * 0.06) : 0.26 + (step * 0.08),
      rotation: 0,
      z: 3,
    });
    if (step < 2) {
      children.push({
        type: 'decoration',
        shape: 'line',
        x: 16 + (step * 18),
        y: 37,
        width: 16,
        height: 2,
        color: step === 0 ? args.secondaryColor : args.accentColor,
        opacity: args.dark ? 0.42 : 0.24,
        rotation: 0,
        z: 2,
      });
    }
  });

  return {
    type: 'group',
    x: args.x,
    y: args.y,
    width: args.width,
    height: args.height,
    rotation: args.rotation,
    opacity: 0.98,
    z: 8,
    children,
  };
}

function buildPanoramicCurationShelfGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  textColor: string;
  subtitleColor: string;
  dark: boolean;
}): PanoramicElement {
  const cardBackground = args.dark ? '#111827E6' : '#FFFFFFEE';
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Curated shelf',
      x: 0,
      y: 0,
      width: 34,
      height: 8.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.82,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 4,
    },
  ];

  const cards = [
    { title: 'Pick', body: 'Lead with one strong surface.', borderColor: args.accentColor },
    { title: 'Mix', body: 'Keep one support beat lighter.', borderColor: args.secondaryColor },
    { title: 'Close', body: 'Land on the cleanest payoff.', borderColor: args.accentColor },
  ];

  cards.forEach((card, index) => {
    children.push({
      type: 'card',
      x: 2 + (index * 30),
      y: 16 + ((index % 2) * 6),
      width: 28,
      height: 28,
      eyebrow: `0${index + 1}`,
      title: card.title,
      body: card.body,
      align: 'left',
      backgroundColor: cardBackground,
      opacity: 0.96,
      borderColor: card.borderColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 18,
      padding: 1.7,
      rotation: index === 1 ? 0 : index === 0 ? -2 : 2,
      eyebrowColor: args.subtitleColor,
      titleColor: args.dark ? '#FFFFFF' : args.textColor,
      bodyColor: args.dark ? '#CBD5E1' : args.subtitleColor,
      eyebrowSize: 2.2,
      titleSize: 4.6,
      bodySize: 2.7,
      shadow: buildShadow({ opacity: 0.1, blur: 12, offsetY: 4, color: args.dark ? '#020617' : '#0F172A' }),
      z: 3,
    });
  });

  children.push({
    type: 'decoration',
    shape: 'line',
    x: 6,
    y: 52,
    width: 82,
    height: 2,
    color: args.secondaryColor,
    opacity: args.dark ? 0.34 : 0.18,
    rotation: 0,
    z: 1,
  });

  return {
    type: 'group',
    x: args.x,
    y: args.y,
    width: args.width,
    height: args.height,
    rotation: args.rotation,
    opacity: 0.98,
    z: 8,
    children,
  };
}

function buildPanoramicProofColumnGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  textColor: string;
  subtitleColor: string;
  dark: boolean;
}): PanoramicElement {
  const cardBackground = args.dark ? '#111827E6' : '#FFFFFFEE';
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Proof column',
      x: 0,
      y: 0,
      width: 34,
      height: 8.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.82,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 4,
    },
    {
      type: 'badge',
      content: 'Trusted',
      x: 0,
      y: 16,
      width: 24,
      height: 7.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.92,
      borderColor: args.secondaryColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.72,
      fontWeight: 700,
      letterSpacing: 5,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'card',
      x: 0,
      y: 28,
      width: 56,
      height: 24,
      eyebrow: 'Proof',
      title: 'Trust stays visible',
      body: 'Stack validation and reassurance as one vertical beat.',
      align: 'left',
      backgroundColor: cardBackground,
      opacity: 0.96,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 18,
      padding: 1.8,
      rotation: 0,
      eyebrowColor: args.subtitleColor,
      titleColor: args.dark ? '#FFFFFF' : args.textColor,
      bodyColor: args.dark ? '#CBD5E1' : args.subtitleColor,
      eyebrowSize: 2.3,
      titleSize: 4.6,
      bodySize: 2.8,
      shadow: buildShadow({ opacity: 0.1, blur: 12, offsetY: 4, color: args.dark ? '#020617' : '#0F172A' }),
      z: 3,
    },
    {
      type: 'decoration',
      shape: 'line',
      x: 64,
      y: 18,
      width: 3,
      height: 40,
      color: args.accentColor,
      opacity: args.dark ? 0.4 : 0.22,
      rotation: 0,
      z: 1,
    },
    {
      type: 'decoration',
      shape: 'line',
      x: 74,
      y: 24,
      width: 3,
      height: 28,
      color: args.secondaryColor,
      opacity: args.dark ? 0.34 : 0.18,
      rotation: 0,
      z: 1,
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
    z: 8,
    children,
  };
}

function buildPanoramicToolbarRibbonGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  dark: boolean;
}): PanoramicElement {
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Tool ribbon',
      x: 4,
      y: 0,
      width: 42,
      height: 10,
      color: args.dark ? '#FFFFFF' : '#0F172A',
      backgroundColor: args.dark ? '#0F172ACC' : '#FFFFFFE8',
      opacity: 0.96,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 1,
      fontWeight: 700,
      letterSpacing: 9,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'decoration',
      shape: 'line',
      x: 6,
      y: 20,
      width: 46,
      height: 3,
      color: args.accentColor,
      opacity: args.dark ? 0.44 : 0.28,
      rotation: 0,
      z: 2,
    },
    {
      type: 'decoration',
      shape: 'line',
      x: 6,
      y: 31,
      width: 34,
      height: 3,
      color: args.secondaryColor,
      opacity: args.dark ? 0.32 : 0.22,
      rotation: 0,
      z: 2,
    },
    {
      type: 'decoration',
      shape: 'circle',
      x: 58,
      y: 12,
      width: 16,
      height: 16,
      color: args.accentColor,
      opacity: args.dark ? 0.26 : 0.18,
      rotation: 0,
      z: 1,
    },
  ];

  return {
    type: 'group',
    x: args.x,
    y: args.y,
    width: args.width,
    height: args.height,
    rotation: args.rotation,
    opacity: 0.96,
    z: 7,
    children,
  };
}

function buildPanoramicBrowseStripGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  dark: boolean;
}): PanoramicElement {
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const labels = ['Curated', 'Popular', 'Fresh'];
  const children: PanoramicGroupChild[] = labels.map((label, index) => ({
    type: 'badge',
    content: label,
    x: 2 + (index * 31),
    y: 8 + ((index % 2) * 3),
    width: 28,
    height: 9,
    color: badgeColor,
    backgroundColor: badgeBackground,
    opacity: 0.95,
    borderColor: index === 1 ? args.secondaryColor : args.accentColor,
    borderWidth: args.dark ? 0 : 1,
    borderRadius: 100,
    fontSize: 0.92,
    fontWeight: 700,
    letterSpacing: 7,
    textTransform: 'uppercase',
    rotation: 0,
    z: 2,
  }));

  children.push({
    type: 'decoration',
    shape: 'line',
    x: 6,
    y: 28,
    width: 88,
    height: 2,
    color: args.accentColor,
    opacity: args.dark ? 0.32 : 0.22,
    rotation: 0,
    z: 1,
  });

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

function buildPanoramicRouteArcGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  dark: boolean;
}): PanoramicElement {
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Route arc',
      x: 2,
      y: 0,
      width: 30,
      height: 9,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.92,
      fontWeight: 700,
      letterSpacing: 7,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'decoration',
      shape: 'line',
      x: 8,
      y: 20,
      width: 74,
      height: 2,
      color: args.accentColor,
      opacity: args.dark ? 0.44 : 0.28,
      rotation: -8,
      z: 1,
    },
    {
      type: 'decoration',
      shape: 'circle',
      x: 6,
      y: 16,
      width: 10,
      height: 10,
      color: args.secondaryColor,
      opacity: args.dark ? 0.42 : 0.26,
      rotation: 0,
      z: 2,
    },
    {
      type: 'decoration',
      shape: 'circle',
      x: 72,
      y: 9,
      width: 12,
      height: 12,
      color: args.accentColor,
      opacity: args.dark ? 0.52 : 0.34,
      rotation: 0,
      z: 2,
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

function buildPanoramicMediaMarqueeGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  dark: boolean;
}): PanoramicElement {
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Now playing',
      x: 2,
      y: 0,
      width: 34,
      height: 9,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.secondaryColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.92,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'badge',
      content: 'Queue',
      x: 40,
      y: 4,
      width: 20,
      height: 8,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.9,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.82,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'decoration',
      shape: 'line',
      x: 6,
      y: 22,
      width: 78,
      height: 2,
      color: args.secondaryColor,
      opacity: args.dark ? 0.38 : 0.24,
      rotation: 0,
      z: 1,
    },
    {
      type: 'decoration',
      shape: 'line',
      x: 14,
      y: 30,
      width: 62,
      height: 2,
      color: args.accentColor,
      opacity: args.dark ? 0.46 : 0.28,
      rotation: 0,
      z: 2,
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

function buildPanoramicActivityWaveGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  dark: boolean;
}): PanoramicElement {
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const labels = ['Updates', 'Reactions', 'Follows'];
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Live feed',
      x: 2,
      y: 0,
      width: 24,
      height: 8.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.82,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'badge',
      content: 'Activity',
      x: 29,
      y: 4,
      width: 18,
      height: 8,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.92,
      borderColor: args.secondaryColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.78,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
  ];

  labels.forEach((label, index) => {
    children.push({
      type: 'badge',
      content: label,
      x: 4 + (index * 19),
      y: 26,
      width: 18,
      height: 7.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.9,
      borderColor: index === 1 ? args.secondaryColor : args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.7,
      fontWeight: 700,
      letterSpacing: 5,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    });
  });

  children.push({
    type: 'decoration',
    shape: 'line',
    x: 6,
    y: 18,
    width: 48,
    height: 2,
    color: args.accentColor,
    opacity: args.dark ? 0.4 : 0.24,
    rotation: 0,
    z: 1,
  });
  children.push({
    type: 'decoration',
    shape: 'circle',
    x: 54,
    y: 12,
    width: 12,
    height: 12,
    color: args.secondaryColor,
    opacity: args.dark ? 0.42 : 0.28,
    rotation: 0,
    z: 2,
  });

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

function buildPanoramicFolioStackGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  dark: boolean;
}): PanoramicElement {
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Document review',
      x: 2,
      y: 0,
      width: 34,
      height: 8.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.78,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'badge',
      content: 'Signed',
      x: 39,
      y: 4,
      width: 16,
      height: 8,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.92,
      borderColor: args.secondaryColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.78,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'card',
      x: 8,
      y: 16,
      width: 26,
      height: 18,
      eyebrow: 'Review',
      title: 'Page 1',
      body: 'Key record',
      align: 'left',
      backgroundColor: badgeBackground,
      opacity: 0.92,
      borderColor: `${args.accentColor}66`,
      borderWidth: 1,
      borderRadius: 8,
      padding: 1.4,
      rotation: -4,
      eyebrowColor: args.secondaryColor,
      titleColor: badgeColor,
      bodyColor: badgeColor,
      eyebrowSize: 2.1,
      titleSize: 3.6,
      bodySize: 2.4,
      z: 1,
    },
    {
      type: 'card',
      x: 14,
      y: 20,
      width: 26,
      height: 18,
      eyebrow: 'Record',
      title: 'Signed',
      body: 'Ready to send',
      align: 'left',
      backgroundColor: badgeBackground,
      opacity: 0.96,
      borderColor: `${args.secondaryColor}66`,
      borderWidth: 1,
      borderRadius: 8,
      padding: 1.4,
      rotation: 4,
      eyebrowColor: args.accentColor,
      titleColor: badgeColor,
      bodyColor: badgeColor,
      eyebrowSize: 2.1,
      titleSize: 3.6,
      bodySize: 2.4,
      z: 2,
    },
    {
      type: 'badge',
      content: 'Pages',
      x: 44,
      y: 22,
      width: 14,
      height: 7.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.9,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.7,
      fontWeight: 700,
      letterSpacing: 5,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'decoration',
      shape: 'line',
      x: 20,
      y: 30,
      width: 18,
      height: 2,
      color: args.accentColor,
      opacity: args.dark ? 0.36 : 0.22,
      rotation: 0,
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

function buildPanoramicCaptureFocusGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  dark: boolean;
}): PanoramicElement {
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Live capture',
      x: 2,
      y: 0,
      width: 34,
      height: 9,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.92,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'badge',
      content: 'Scan',
      x: 40,
      y: 4,
      width: 18,
      height: 8,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.9,
      borderColor: args.secondaryColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.82,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'decoration',
      shape: 'circle',
      x: 22,
      y: 16,
      width: 28,
      height: 28,
      color: args.secondaryColor,
      opacity: args.dark ? 0.16 : 0.12,
      rotation: 0,
      z: 1,
    },
    {
      type: 'decoration',
      shape: 'line',
      x: 12,
      y: 30,
      width: 48,
      height: 2,
      color: args.accentColor,
      opacity: args.dark ? 0.46 : 0.3,
      rotation: 0,
      z: 2,
    },
    {
      type: 'decoration',
      shape: 'line',
      x: 34,
      y: 12,
      width: 2,
      height: 36,
      color: args.accentColor,
      opacity: args.dark ? 0.46 : 0.3,
      rotation: 0,
      z: 2,
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

function buildPanoramicTimelineBandGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  dark: boolean;
}): PanoramicElement {
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Agenda',
      x: 2,
      y: 0,
      width: 22,
      height: 8,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.82,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'badge',
      content: 'Next',
      x: 28,
      y: 4,
      width: 18,
      height: 8,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.9,
      borderColor: args.secondaryColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.8,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'decoration',
      shape: 'line',
      x: 6,
      y: 22,
      width: 80,
      height: 2,
      color: args.accentColor,
      opacity: args.dark ? 0.4 : 0.24,
      rotation: 0,
      z: 1,
    },
    {
      type: 'decoration',
      shape: 'circle',
      x: 14,
      y: 17,
      width: 10,
      height: 10,
      color: args.secondaryColor,
      opacity: args.dark ? 0.42 : 0.3,
      rotation: 0,
      z: 2,
    },
    {
      type: 'decoration',
      shape: 'circle',
      x: 42,
      y: 17,
      width: 10,
      height: 10,
      color: args.accentColor,
      opacity: args.dark ? 0.48 : 0.32,
      rotation: 0,
      z: 2,
    },
    {
      type: 'decoration',
      shape: 'circle',
      x: 70,
      y: 17,
      width: 10,
      height: 10,
      color: args.secondaryColor,
      opacity: args.dark ? 0.34 : 0.22,
      rotation: 0,
      z: 2,
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

function buildPanoramicSupportBeaconGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  dark: boolean;
}): PanoramicElement {
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Help center',
      x: 3,
      y: 0,
      width: 28,
      height: 8.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.82,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'badge',
      content: 'Resolved',
      x: 34,
      y: 4,
      width: 20,
      height: 8,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.92,
      borderColor: args.secondaryColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.78,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'decoration',
      shape: 'circle',
      x: 14,
      y: 18,
      width: 14,
      height: 14,
      color: args.accentColor,
      opacity: args.dark ? 0.34 : 0.22,
      rotation: 0,
      z: 2,
    },
    {
      type: 'decoration',
      shape: 'line',
      x: 24,
      y: 24,
      width: 30,
      height: 2,
      color: args.accentColor,
      opacity: args.dark ? 0.38 : 0.24,
      rotation: 0,
      z: 1,
    },
    {
      type: 'decoration',
      shape: 'circle',
      x: 46,
      y: 16,
      width: 10,
      height: 10,
      color: args.secondaryColor,
      opacity: args.dark ? 0.44 : 0.28,
      rotation: 0,
      z: 2,
    },
    {
      type: 'decoration',
      shape: 'dot-grid',
      x: 56,
      y: 10,
      width: 18,
      height: 16,
      color: args.secondaryColor,
      opacity: args.dark ? 0.2 : 0.14,
      rotation: 0,
      z: 1,
    },
  ];

  return {
    type: 'group',
    x: args.x,
    y: args.y,
    width: args.width,
    height: args.height,
    rotation: args.rotation,
    opacity: 0.97,
    z: 7,
    children,
  };
}

function buildPanoramicRewardRibbonGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  dark: boolean;
}): PanoramicElement {
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const rewards = ['Perks', 'Points', 'Redeem'];
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Member perks',
      x: 2,
      y: 0,
      width: 30,
      height: 8.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.82,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'badge',
      content: 'Rewards',
      x: 35,
      y: 4,
      width: 18,
      height: 8,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.92,
      borderColor: args.secondaryColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.78,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
  ];

  rewards.forEach((label, index) => {
    children.push({
      type: 'badge',
      content: label,
      x: 6 + (index * 19),
      y: 26,
      width: 16,
      height: 7.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.9,
      borderColor: index === 1 ? args.secondaryColor : args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.72,
      fontWeight: 700,
      letterSpacing: 5,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    });
  });
  children.push({
    type: 'decoration',
    shape: 'line',
    x: 8,
    y: 18,
    width: 46,
    height: 2,
    color: args.accentColor,
    opacity: args.dark ? 0.38 : 0.24,
    rotation: 0,
    z: 1,
  });
  children.push({
    type: 'decoration',
    shape: 'circle',
    x: 54,
    y: 12,
    width: 12,
    height: 12,
    color: args.secondaryColor,
    opacity: args.dark ? 0.4 : 0.26,
    rotation: 0,
    z: 2,
  });

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

function buildPanoramicCheckoutLaneGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  dark: boolean;
}): PanoramicElement {
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const steps = ['Cart', 'Pay', 'Ship'];
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Checkout flow',
      x: 2,
      y: 0,
      width: 34,
      height: 8,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.82,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'badge',
      content: 'Delivery',
      x: 38,
      y: 4,
      width: 20,
      height: 8,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.92,
      borderColor: args.secondaryColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.8,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
  ];

  steps.forEach((label, index) => {
    const x = 8 + (index * 28);
    const color = index === 1 ? args.secondaryColor : args.accentColor;
    children.push({
      type: 'decoration',
      shape: 'circle',
      x,
      y: 20,
      width: 10,
      height: 10,
      color,
      opacity: args.dark ? 0.44 : 0.3,
      rotation: 0,
      z: 2,
    });
    children.push({
      type: 'badge',
      content: label,
      x: x - 4,
      y: 33,
      width: 18,
      height: 7.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.9,
      borderColor: color,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.74,
      fontWeight: 700,
      letterSpacing: 5,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    });
    if (index < steps.length - 1) {
      children.push({
        type: 'decoration',
        shape: 'line',
        x: x + 9,
        y: 24,
        width: 20,
        height: 2,
        color,
        opacity: args.dark ? 0.34 : 0.22,
        rotation: 0,
        z: 1,
      });
    }
  });

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

function buildPanoramicTrustShieldGroup(args: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accentColor: string;
  secondaryColor: string;
  dark: boolean;
}): PanoramicElement {
  const badgeBackground = args.dark ? '#0F172ACC' : '#FFFFFFE8';
  const badgeColor = args.dark ? '#FFFFFF' : '#0F172A';
  const children: PanoramicGroupChild[] = [
    {
      type: 'badge',
      content: 'Secure access',
      x: 4,
      y: 0,
      width: 30,
      height: 8.5,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.95,
      borderColor: args.accentColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.82,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'badge',
      content: 'Verified',
      x: 38,
      y: 4,
      width: 18,
      height: 8,
      color: badgeColor,
      backgroundColor: badgeBackground,
      opacity: 0.9,
      borderColor: args.secondaryColor,
      borderWidth: args.dark ? 0 : 1,
      borderRadius: 100,
      fontSize: 0.78,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: 'uppercase',
      rotation: 0,
      z: 3,
    },
    {
      type: 'decoration',
      shape: 'circle',
      x: 22,
      y: 16,
      width: 28,
      height: 28,
      color: args.accentColor,
      opacity: args.dark ? 0.2 : 0.14,
      rotation: 0,
      z: 1,
    },
    {
      type: 'decoration',
      shape: 'circle',
      x: 30,
      y: 24,
      width: 12,
      height: 12,
      color: args.secondaryColor,
      opacity: args.dark ? 0.4 : 0.26,
      rotation: 0,
      z: 2,
    },
    {
      type: 'decoration',
      shape: 'line',
      x: 18,
      y: 50,
      width: 36,
      height: 2,
      color: args.accentColor,
      opacity: args.dark ? 0.42 : 0.24,
      rotation: 0,
      z: 2,
    },
    {
      type: 'decoration',
      shape: 'dot-grid',
      x: 58,
      y: 18,
      width: 22,
      height: 18,
      color: args.secondaryColor,
      opacity: args.dark ? 0.24 : 0.18,
      rotation: 0,
      z: 1,
    },
  ];

  return {
    type: 'group',
    x: args.x,
    y: args.y,
    width: args.width,
    height: args.height,
    rotation: args.rotation,
    opacity: 0.96,
    z: 7,
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
  const boldRecipe = isBoldPanoramaRecipe(recipe);
  const recipeArchetype = panoramicRecipeArchetype(recipe);
  if (hasCompositionFeature(frame, 'toolbar-ribbon')) {
    return boldRecipe ? 11 : 12;
  }
  if (hasCompositionFeature(frame, 'trust-shield')) {
    return boldRecipe ? 11 : 12;
  }
  if (hasCompositionFeature(frame, 'support-beacon')) {
    return boldRecipe ? 11 : 12;
  }
  if (hasCompositionFeature(frame, 'timeline-band')) {
    return boldRecipe ? 11 : 12;
  }
  if (frame.cropPlan?.avoidRegions.includes('top')) {
    return boldRecipe ? 10 : 11;
  }
  if (frame.layoutArchetype?.includes('close')) return boldRecipe ? 14 : 11;
  if (frame.layoutArchetype?.includes('split') || frame.layoutArchetype?.includes('text-rail')) {
    return boldRecipe ? 12 : 10;
  }
  if (recipeArchetype === 'gallery' || recipeArchetype === 'world') return boldRecipe ? 7 : 6.5;
  return 6;
}

function panoramicLabelY(frame: PlannedPanoramicFrame, recipe: PlannedPanoramicVariant['recipe']): number {
  return panoramicTextY(frame, recipe) + (isBoldPanoramaRecipe(recipe) ? 13 : 11);
}

function panoramicProofChipY(
  frame: PlannedPanoramicFrame,
  recipe: PlannedPanoramicVariant['recipe'],
): number {
  const boldRecipe = isBoldPanoramaRecipe(recipe);
  if (frame.storyBeat === 'summary') return 72;
  if (hasCompositionFeature(frame, 'profile-orbit')) {
    return boldRecipe ? 30 : 28;
  }
  if (hasCompositionFeature(frame, 'trust-shield')) {
    return boldRecipe ? 32 : 29;
  }
  if (hasCompositionFeature(frame, 'support-beacon')) {
    return boldRecipe ? 32 : 29;
  }
  if (hasCompositionFeature(frame, 'media-marquee')) {
    return boldRecipe ? 34 : 31;
  }
  if (hasCompositionFeature(frame, 'reward-ribbon')) {
    return boldRecipe ? 34 : 31;
  }
  if (hasCompositionFeature(frame, 'checkout-lane')) {
    return boldRecipe ? 35 : 32;
  }
  if (hasCompositionFeature(frame, 'capture-focus')) {
    return boldRecipe ? 36 : 33;
  }
  if (hasCompositionFeature(frame, 'timeline-band')) {
    return boldRecipe ? 33 : 30;
  }
  if (hasCompositionFeature(frame, 'route-arc')) {
    return boldRecipe ? 32 : 30;
  }
  if (frame.cropPlan?.avoidRegions.includes('top')) {
    return boldRecipe ? 34 : 31;
  }
  if (frame.layoutArchetype?.includes('close') || frame.layoutArchetype?.includes('punch')) {
    return boldRecipe ? 24 : 22;
  }
  return boldRecipe ? 26 : 24;
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
  recipe: PlannedPanoramicVariant['recipe'],
  frameStrategy: PlannedFrameStrategy | undefined,
): { x: number; y: number; width: number; rotation: number } {
  const recipeArchetype = panoramicRecipeArchetype(recipe);
  const extractDriven = frameStrategy?.defaultTreatment === 'mixed' && frame.cropPlan?.usage !== 'full-device';
  const xOffset = frame.cropPlan?.anchor === 'left-rail'
    ? -1.5
    : frame.cropPlan?.anchor === 'right-rail'
      ? 1.5
      : 0;
  const toolbarRibbon = hasCompositionFeature(frame, 'toolbar-ribbon');
  const browseStrip = hasCompositionFeature(frame, 'browse-strip');
  const activityWave = hasCompositionFeature(frame, 'activity-wave');
  const checkoutLane = hasCompositionFeature(frame, 'checkout-lane');
  const folioStack = hasCompositionFeature(frame, 'folio-stack');
  const profileOrbit = hasCompositionFeature(frame, 'profile-orbit');
  const trustShield = hasCompositionFeature(frame, 'trust-shield');
  const supportBeacon = hasCompositionFeature(frame, 'support-beacon');
  const routeArc = hasCompositionFeature(frame, 'route-arc');
  const mediaMarquee = hasCompositionFeature(frame, 'media-marquee');
  const captureFocus = hasCompositionFeature(frame, 'capture-focus');
  const timelineBand = hasCompositionFeature(frame, 'timeline-band');
  const rewardRibbon = hasCompositionFeature(frame, 'reward-ribbon');
  const y = frame.cropPlan?.avoidRegions.includes('top')
    ? (toolbarRibbon || timelineBand || trustShield || supportBeacon || folioStack ? 30 : mediaMarquee ? 31 : 28)
    : extractDriven
      ? (profileOrbit ? 27 : trustShield || supportBeacon || folioStack ? 27 : routeArc ? 28 : captureFocus ? 27 : activityWave ? 28 : 26)
      : (browseStrip || activityWave || checkoutLane || rewardRibbon ? 25 : mediaMarquee ? 26 : timelineBand ? 25.5 : folioStack ? 24.5 : 24);
  let x = Math.max(2, frameCenter - (extractDriven ? 6.5 : browseStrip || activityWave || checkoutLane || rewardRibbon ? 6.6 : 7) + xOffset);
  let width = extractDriven
    ? (toolbarRibbon || timelineBand || trustShield || supportBeacon || folioStack ? 12.4 : 13)
    : (browseStrip || activityWave || checkoutLane || rewardRibbon || timelineBand ? 13.2 : 14);
  let rotation = index % 2 === 0 ? -2 : 2;

  if (frame.layoutArchetype?.includes('split') || frame.layoutArchetype?.includes('text-rail')) {
    x = frameCenter + 0.8;
    width -= 0.9;
    rotation = index % 2 === 0 ? 3 : -3;
  } else if (frame.layoutArchetype?.includes('poster') || frame.layoutArchetype?.includes('gallery-opener') || frame.layoutArchetype?.includes('showcase-opener')) {
    x = frameCenter - 7.4;
    width += 0.8;
    rotation = index % 2 === 0 ? -1 : 1;
  } else if (frame.layoutArchetype?.includes('close') || frame.layoutArchetype?.includes('punch')) {
    x -= 0.6;
    width -= 0.4;
    rotation = index % 2 === 0 ? -4 : 4;
  } else if (frame.layoutArchetype?.includes('relay')) {
    x += index % 2 === 0 ? -0.8 : 0.8;
    rotation = index % 2 === 0 ? -3 : 3;
  }

  if (recipeArchetype === 'workflow') {
    x += index % 2 === 0 ? -0.3 : 0.3;
    width -= 0.2;
  } else if (recipeArchetype === 'conversation') {
    width -= 0.4;
  } else if (recipeArchetype === 'gallery' || recipeArchetype === 'world') {
    width += 0.35;
  }

  return {
    x: Math.max(2, x),
    y: frame.layoutArchetype?.includes('close') ? y + 2 : frame.layoutArchetype?.includes('poster') ? y - 0.8 : y,
    width,
    rotation,
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
  const editorialRecipe = isEditorialPanoramaRecipe(args.variant.recipe);
  const boldRecipe = isBoldPanoramaRecipe(args.variant.recipe);
  const elements: PanoramicElement[] = [];
  let featureIndex = 0;

  frames.forEach((frame: PlannedPanoramicFrame, index) => {
    const sliceWidth = 100 / frameCount;
    const frameSliceStart = (index / frameCount) * 100;
    const frameCenter = frameSliceStart + 50 / frameCount;
    const hasLayeredDetail = hasCompositionFeature(frame, 'layered-detail-extract');
    const hasFloatingDetailCard = hasCompositionFeature(frame, 'floating-detail-card');
    const hasDecorativeCluster = hasCompositionFeature(frame, 'decorative-cluster');
    const hasToolbarRibbon = hasCompositionFeature(frame, 'toolbar-ribbon');
    const hasProfileOrbit = hasCompositionFeature(frame, 'profile-orbit');
    const hasBrowseStrip = hasCompositionFeature(frame, 'browse-strip');
    const hasActivityWave = hasCompositionFeature(frame, 'activity-wave');
    const hasCheckoutLane = hasCompositionFeature(frame, 'checkout-lane');
    const hasFolioStack = hasCompositionFeature(frame, 'folio-stack');
    const hasTrustShield = hasCompositionFeature(frame, 'trust-shield');
    const hasSupportBeacon = hasCompositionFeature(frame, 'support-beacon');
    const hasRewardRibbon = hasCompositionFeature(frame, 'reward-ribbon');
    const hasRouteArc = hasCompositionFeature(frame, 'route-arc');
    const hasMediaMarquee = hasCompositionFeature(frame, 'media-marquee');
    const hasCaptureFocus = hasCompositionFeature(frame, 'capture-focus');
    const hasTimelineBand = hasCompositionFeature(frame, 'timeline-band');
    const supportSystem = frame.supportSystem;
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
      args.variant.recipe,
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
      ?? (boldRecipe ? '#FFFFFFF0' : '#FFFFFFF2');
    const supportSystemBadge = supportSystemLabel(supportSystem);
    const supportSystemPlacement = panoramicSupportSystemPlacement({
      frame,
      index,
      frameSliceStart,
      sliceWidth,
      boldRecipe,
    });
    const usesSpecificSupportSystem = Boolean(supportSystem && supportSystemPlacement);

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
            ? hasProfileOrbit
              ? 'Creator spotlight'
              : hasActivityWave
                ? 'Live feed'
              : hasToolbarRibbon
                ? 'Build flow'
                : hasFolioStack
                  ? 'Document review'
                : hasTrustShield
                  ? 'Secure access'
                  : hasCheckoutLane
                    ? 'Checkout flow'
                : hasCaptureFocus
                  ? 'Capture flow'
                  : hasTimelineBand
                    ? 'Scheduled flow'
                : hasRouteArc
                  ? 'Guided route'
                : hasMediaMarquee
                  ? 'Playback cue'
                : hasBrowseStrip
                  ? 'Curated browse'
                  : boldRecipe
                    ? 'Campaign concept'
                    : supportSystemBadge ?? 'Featured flow'
            : hasProfileOrbit
              ? 'Community proof'
              : hasActivityWave
                ? 'Momentum proof'
              : hasTrustShield
                ? 'Verified flow'
                : hasFolioStack
                  ? 'Review proof'
                : hasCheckoutLane
                  ? 'Order proof'
              : supportSystemBadge ?? 'Proof point',
        x: frameSliceStart + 4,
        y: boldRecipe ? 21 : 20,
        width: Math.max(11, sliceWidth - 10),
        height: 4.8,
        color: boldRecipe ? '#FFFFFF' : args.textColor,
        backgroundColor: boldRecipe ? args.accentColor : '#FFFFFF',
        opacity: 0.96,
        borderColor: boldRecipe ? undefined : args.accentColor,
        borderWidth: boldRecipe ? 0 : 1,
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
            ? hasProfileOrbit
              ? 'Community-loved'
              : hasActivityWave
                ? 'Always active'
              : hasTrustShield
                ? 'Protected flow'
                : hasFolioStack
                  ? 'Review complete'
                : hasCheckoutLane
                  ? 'Cart to door'
              : hasRouteArc
                ? 'Always nearby'
                : hasCaptureFocus
                  ? 'Ready to scan'
                  : hasTimelineBand
                    ? 'On schedule'
                : hasMediaMarquee
                  ? 'Plays all day'
              : 'Power-user approved'
            : boldRecipe
              ? hasToolbarRibbon
                ? 'Built fast'
                : hasActivityWave
                  ? 'Always moving'
                : hasTrustShield
                  ? 'Verified entry'
                  : hasFolioStack
                    ? 'Ready to sign'
                : hasCheckoutLane
                  ? 'Ready to convert'
                : hasCaptureFocus
                  ? 'Capture ready'
                  : hasTimelineBand
                    ? 'Always lined up'
                : hasMediaMarquee
                  ? 'Always on'
                : '4.9 out of 5'
              : hasBrowseStrip
                ? 'Curated picks'
                : hasActivityWave
                  ? 'Updates stay live'
                : hasCheckoutLane
                  ? 'Friction stays low'
                  : hasFolioStack
                    ? 'Records stay clear'
                : hasTrustShield
                  ? 'Access stays trusted'
                : hasRouteArc
                  ? 'Route ready'
                : 'Top rated flow',
        detail:
          frame.storyBeat === 'summary'
            ? hasProfileOrbit
              ? 'Shared by active members'
              : hasActivityWave
                ? 'Fresh updates and follow-through'
              : hasTrustShield
                ? 'Identity stays protected'
                : hasFolioStack
                  ? 'Clear pages and approvals'
                : hasCheckoutLane
                  ? 'From checkout to delivery'
              : hasRouteArc
                ? 'Coverage across key stops'
                : hasCaptureFocus
                  ? 'Fast scanning and framing'
                  : hasTimelineBand
                    ? 'Plans stay on track'
                : hasMediaMarquee
                  ? 'Queued for repeat sessions'
              : 'Built for daily use'
            : boldRecipe
              ? hasToolbarRibbon
                ? 'Template workflow'
                : hasActivityWave
                  ? 'Feed and notification rhythm'
                : hasTrustShield
                  ? 'Passkeys and approvals'
                  : hasFolioStack
                    ? 'Pages, signatures, and review'
                : hasCheckoutLane
                  ? 'Order path stays clear'
                : hasCaptureFocus
                  ? 'Live preview system'
                  : hasTimelineBand
                    ? 'Agenda rhythm'
                : hasMediaMarquee
                  ? 'Queue stays moving'
                : 'App Store reviews'
              : hasBrowseStrip
                ? 'Fresh each visit'
                : hasActivityWave
                  ? 'Reactions, follows, and updates'
                : hasCheckoutLane
                  ? 'Clear handoff to delivery'
                  : hasFolioStack
                    ? 'Readable review and record state'
                : hasTrustShield
                  ? 'Private by default'
                : hasRouteArc
                  ? 'Nearby and on route'
                : 'Trusted by repeat users',
        rating: boldRecipe ? 5 : undefined,
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
        borderColor: boldRecipe ? '#FFFFFF66' : args.accentColor,
        borderWidth: boldRecipe ? 0.5 : 1,
        borderRadius: 28,
        valueSize: 1.65,
        detailSize: 0.95,
        padding: 1.4,
        rotation: 0,
        z: 11,
      });
    }

    if (supportSystem && supportSystemPlacement) {
      switch (supportSystem) {
        case 'quote-stack':
          elements.push(
            buildPanoramicQuoteStackGroup({
              ...supportSystemPlacement,
              accentColor: args.accentColor,
              textColor: boldRecipe ? '#FFFFFF' : args.textColor,
              subtitleColor: boldRecipe ? '#CBD5E1' : args.subtitleColor,
              dark: boldRecipe,
              title: supportTitle,
              body: supportBody,
            }),
          );
          break;
        case 'metric-ladder':
          elements.push(
            buildPanoramicMetricLadderGroup({
              ...supportSystemPlacement,
              accentColor: args.accentColor,
              secondaryColor: boldRecipe ? '#FFFFFF' : args.subtitleColor,
              dark: boldRecipe,
            }),
          );
          break;
        case 'signal-chain':
          elements.push(
            buildPanoramicSignalChainGroup({
              ...supportSystemPlacement,
              accentColor: args.accentColor,
              secondaryColor: boldRecipe ? '#FFFFFF' : args.subtitleColor,
              dark: boldRecipe,
            }),
          );
          break;
        case 'milestone-band':
          elements.push(
            buildPanoramicMilestoneBandGroup({
              ...supportSystemPlacement,
              accentColor: args.accentColor,
              secondaryColor: boldRecipe ? '#FFFFFF' : args.subtitleColor,
              textColor: boldRecipe ? '#FFFFFF' : args.textColor,
              subtitleColor: boldRecipe ? '#CBD5E1' : args.subtitleColor,
              dark: boldRecipe,
              title: supportTitle,
            }),
          );
          break;
        case 'curation-shelf':
          elements.push(
            buildPanoramicCurationShelfGroup({
              ...supportSystemPlacement,
              accentColor: args.accentColor,
              secondaryColor: boldRecipe ? '#FFFFFF' : args.subtitleColor,
              textColor: boldRecipe ? '#FFFFFF' : args.textColor,
              subtitleColor: boldRecipe ? '#CBD5E1' : args.subtitleColor,
              dark: boldRecipe,
            }),
          );
          break;
        case 'proof-column':
          elements.push(
            buildPanoramicProofColumnGroup({
              ...supportSystemPlacement,
              accentColor: args.accentColor,
              secondaryColor: boldRecipe ? '#FFFFFF' : args.subtitleColor,
              textColor: boldRecipe ? '#FFFFFF' : args.textColor,
              subtitleColor: boldRecipe ? '#CBD5E1' : args.subtitleColor,
              dark: boldRecipe,
            }),
          );
          break;
      }
    }

    if (
      editorialRecipe
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

    if (editorialRecipe && hasFloatingDetailCard && !usesSpecificSupportSystem) {
      const groupWidth = Math.max(12.5, sliceWidth - 8);
      elements.push(
        buildPanoramicSupportGroup({
          screenshot: sourceScreenshot,
          x: frameSliceStart + sliceWidth - groupWidth - 2,
          y: hasToolbarRibbon
            ? 36
            : hasProfileOrbit
              ? 46
              : hasActivityWave
                ? 54
              : hasTrustShield
                ? 40
                : hasFolioStack
                  ? 38
                : hasSupportBeacon
                  ? 40
                  : hasRewardRibbon
                    ? 54
                : hasCheckoutLane
                  ? 54
                  : hasCaptureFocus
                ? 44
                : hasTimelineBand
                  ? 40
                  : hasRouteArc
                ? 40
                : hasMediaMarquee
                  ? 48
                  : hasBrowseStrip
                ? 58
                : frame.cropPlan?.avoidRegions.includes('bottom') ? 42 : index % 2 === 0 ? 52 : 56,
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
          badgeContent:
            hasProfileOrbit
              ? frame.storyBeat === 'hero' ? 'Creator card' : 'Community card'
              : hasActivityWave
                ? frame.storyBeat === 'trust' ? 'Signal card' : 'Feed card'
              : hasToolbarRibbon
                ? 'Tool card'
                : hasFolioStack
                  ? frame.storyBeat === 'trust' ? 'Review card' : 'Document card'
                : hasTrustShield
                  ? frame.storyBeat === 'trust' ? 'Trust card' : 'Secure card'
                  : hasSupportBeacon
                    ? frame.storyBeat === 'trust' ? 'Resolution card' : 'Help card'
                    : hasRewardRibbon
                      ? frame.storyBeat === 'trust' ? 'Perk proof' : 'Perk card'
                  : hasCheckoutLane
                    ? frame.storyBeat === 'trust' ? 'Order card' : 'Checkout card'
                    : hasCaptureFocus
                  ? 'Capture card'
                  : hasTimelineBand
                    ? 'Agenda card'
                    : hasRouteArc
                  ? 'Route card'
                  : hasMediaMarquee
                    ? 'Now playing'
                    : hasBrowseStrip
                  ? 'Browse card'
                  : frame.storyBeat === 'hero'
                    ? 'Editorial system'
                    : 'Story card',
          cardBackgroundColor: supportCardBackground,
          includeCrop: includeSupportCrop && allowFramelessExtracts,
        }),
      );
    }

    if (editorialRecipe && hasDecorativeCluster) {
      elements.push(
        buildPanoramicDecorativeGroup({
          x: frameSliceStart + Math.max(2, sliceWidth - 11),
          y: hasBrowseStrip ? 68 : frame.storyBeat === 'summary' ? 70 : 18,
          width: 10,
          height: 18,
          rotation: index % 2 === 0 ? 8 : -8,
          accentColor: args.accentColor,
          secondaryColor: args.subtitleColor,
          label:
            hasProfileOrbit
              ? frame.storyBeat === 'hero' ? 'Community' : undefined
              : hasActivityWave
                ? frame.storyBeat === 'hero' ? 'Live' : undefined
              : hasTrustShield
                ? frame.storyBeat === 'hero' ? 'Secure' : undefined
                : hasFolioStack
                  ? frame.storyBeat === 'hero' ? 'Review' : undefined
                : hasSupportBeacon
                  ? frame.storyBeat === 'hero' ? 'Support' : undefined
                  : hasRewardRibbon
                    ? frame.storyBeat === 'hero' ? 'Perks' : undefined
                : hasCheckoutLane
                  ? frame.storyBeat === 'hero' ? 'Checkout' : undefined
              : hasCaptureFocus
                ? frame.storyBeat === 'hero' ? 'Live' : undefined
                : hasTimelineBand
                  ? frame.storyBeat === 'hero' ? 'Scheduled' : undefined
                : hasRouteArc
                  ? frame.storyBeat === 'hero' ? 'Nearby' : undefined
                  : hasMediaMarquee
                  ? frame.storyBeat === 'hero' ? 'Playing' : undefined
              : frame.storyBeat === 'hero'
                ? 'Featured'
                : undefined,
          dark: false,
        }),
      );
    }

    if (editorialRecipe && hasToolbarRibbon) {
      elements.push(
        buildPanoramicToolbarRibbonGroup({
          x: frameSliceStart + 2,
          y: 17,
          width: Math.max(11.5, sliceWidth - 7),
          height: 10.5,
          rotation: index % 2 === 0 ? -2 : 2,
          accentColor: args.accentColor,
          secondaryColor: args.subtitleColor,
          dark: false,
        }),
      );
    }

    if (editorialRecipe && hasBrowseStrip) {
      elements.push(
        buildPanoramicBrowseStripGroup({
          x: frameSliceStart + 2,
          y: 74,
          width: Math.max(12, sliceWidth - 5),
          height: 13,
          rotation: index % 2 === 0 ? -2 : 2,
          accentColor: args.accentColor,
          secondaryColor: args.subtitleColor,
          dark: false,
        }),
      );
    }

    if (editorialRecipe && hasActivityWave) {
      elements.push(
        buildPanoramicActivityWaveGroup({
          x: frameSliceStart + 2,
          y: 72,
          width: Math.max(12, sliceWidth - 4),
          height: 14,
          rotation: index % 2 === 0 ? -2 : 2,
          accentColor: args.accentColor,
          secondaryColor: args.subtitleColor,
          dark: false,
        }),
      );
    }

    if (editorialRecipe && hasFolioStack) {
      elements.push(
        buildPanoramicFolioStackGroup({
          x: frameSliceStart + Math.max(2, sliceWidth - 15),
          y: 18,
          width: Math.max(12, sliceWidth - 5),
          height: 14,
          rotation: index % 2 === 0 ? -2 : 2,
          accentColor: args.accentColor,
          secondaryColor: args.subtitleColor,
          dark: false,
        }),
      );
    }

    if (hasTrustShield) {
      elements.push(
        buildPanoramicTrustShieldGroup({
          x: frameSliceStart + Math.max(2, sliceWidth - 15),
          y: boldRecipe ? 17 : 18,
          width: Math.max(12, sliceWidth - 5),
          height: 14,
          rotation: index % 2 === 0 ? -2 : 2,
          accentColor: args.accentColor,
          secondaryColor: args.subtitleColor,
          dark: boldRecipe,
        }),
      );
    }

    if (hasSupportBeacon) {
      elements.push(
        buildPanoramicSupportBeaconGroup({
          x: frameSliceStart + Math.max(2, sliceWidth - 15),
          y: boldRecipe ? 17 : 18,
          width: Math.max(12, sliceWidth - 5),
          height: 14,
          rotation: index % 2 === 0 ? -2 : 2,
          accentColor: args.accentColor,
          secondaryColor: args.subtitleColor,
          dark: boldRecipe,
        }),
      );
    }

    if (hasCheckoutLane) {
      elements.push(
        buildPanoramicCheckoutLaneGroup({
          x: frameSliceStart + 2,
          y: boldRecipe ? 74 : 72,
          width: Math.max(12, sliceWidth - 4),
          height: 14,
          rotation: index % 2 === 0 ? -2 : 2,
          accentColor: args.accentColor,
          secondaryColor: args.subtitleColor,
          dark: boldRecipe,
        }),
      );
    }

    if (hasRewardRibbon) {
      elements.push(
        buildPanoramicRewardRibbonGroup({
          x: frameSliceStart + 2,
          y: boldRecipe ? 74 : 72,
          width: Math.max(12, sliceWidth - 4),
          height: 14,
          rotation: index % 2 === 0 ? -2 : 2,
          accentColor: args.accentColor,
          secondaryColor: args.subtitleColor,
          dark: boldRecipe,
        }),
      );
    }

    if (hasCaptureFocus) {
      elements.push(
        buildPanoramicCaptureFocusGroup({
          x: frameSliceStart + 2,
          y: boldRecipe ? 18 : 20,
          width: Math.max(12, sliceWidth - 4),
          height: 14,
          rotation: index % 2 === 0 ? -2 : 2,
          accentColor: args.accentColor,
          secondaryColor: args.subtitleColor,
          dark: boldRecipe,
        }),
      );
    }

    if (hasTimelineBand) {
      elements.push(
        buildPanoramicTimelineBandGroup({
          x: frameSliceStart + 2,
          y: boldRecipe ? 18 : 20,
          width: Math.max(12, sliceWidth - 4),
          height: 12,
          rotation: index % 2 === 0 ? -2 : 2,
          accentColor: args.accentColor,
          secondaryColor: args.subtitleColor,
          dark: boldRecipe,
        }),
      );
    }

    if (hasRouteArc) {
      elements.push(
        buildPanoramicRouteArcGroup({
          x: frameSliceStart + 2,
          y: boldRecipe ? 72 : 70,
          width: Math.max(12, sliceWidth - 4),
          height: 12,
          rotation: index % 2 === 0 ? -2 : 2,
          accentColor: args.accentColor,
          secondaryColor: args.subtitleColor,
          dark: boldRecipe,
        }),
      );
    }

    if (hasMediaMarquee) {
      elements.push(
        buildPanoramicMediaMarqueeGroup({
          x: frameSliceStart + 2,
          y: boldRecipe ? 16 : 18,
          width: Math.max(12, sliceWidth - 4),
          height: 12,
          rotation: index % 2 === 0 ? -2 : 2,
          accentColor: args.accentColor,
          secondaryColor: args.subtitleColor,
          dark: boldRecipe,
        }),
      );
    }

    if (
      boldRecipe
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
      boldRecipe
      && hasFloatingDetailCard
      && !usesSpecificSupportSystem
      && includeSupportCrop
      && frame.cropSuitability !== 'low'
    ) {
      const groupWidth = Math.max(13, sliceWidth - 7);
      elements.push(
        buildPanoramicSupportGroup({
          screenshot: sourceScreenshot,
          x: frameSliceStart + 3,
          y: hasToolbarRibbon
            ? 48
            : hasProfileOrbit
              ? 50
              : hasActivityWave
                ? 56
              : hasTrustShield
                ? 46
                : hasFolioStack
                  ? 44
                : hasSupportBeacon
                  ? 46
                  : hasRewardRibbon
                    ? 54
                : hasCheckoutLane
                  ? 54
                  : hasCaptureFocus
                ? 50
                : hasTimelineBand
                  ? 48
                  : hasBrowseStrip
                    ? 58
                    : 54,
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
          badgeContent:
            hasProfileOrbit
              ? frame.storyBeat === 'trust' ? 'Community proof' : 'Creator card'
              : hasActivityWave
                ? frame.storyBeat === 'trust' ? 'Signal proof' : 'Feed card'
              : hasToolbarRibbon
                ? 'Build card'
                : hasFolioStack
                  ? frame.storyBeat === 'trust' ? 'Review proof' : 'Document card'
                : hasTrustShield
                  ? frame.storyBeat === 'trust' ? 'Trust proof' : 'Secure card'
                  : hasSupportBeacon
                    ? frame.storyBeat === 'trust' ? 'Resolution proof' : 'Help card'
                    : hasRewardRibbon
                      ? frame.storyBeat === 'trust' ? 'Perk proof' : 'Perk card'
                  : hasCheckoutLane
                    ? frame.storyBeat === 'trust' ? 'Order proof' : 'Checkout card'
                : hasCaptureFocus
                  ? frame.storyBeat === 'trust' ? 'Capture proof' : 'Capture card'
                  : hasTimelineBand
                    ? frame.storyBeat === 'trust' ? 'Schedule proof' : 'Agenda card'
                : hasBrowseStrip
                  ? 'Browse card'
                  : frame.storyBeat === 'trust'
                    ? 'Proof card'
                    : 'Momentum card',
          cardBackgroundColor: supportCardBackground,
          includeCrop: allowFramelessExtracts,
        }),
      );
    } else if (boldRecipe && hasFloatingDetailCard && !usesSpecificSupportSystem) {
      elements.push(
        buildPanoramicSupportGroup({
          screenshot: sourceScreenshot,
          x: frameSliceStart + 3,
          y: hasBrowseStrip
            ? 62
            : hasActivityWave
              ? 60
            : hasCheckoutLane || hasRewardRibbon
              ? 58
              : hasFolioStack
                ? 50
              : hasTrustShield || hasSupportBeacon
                ? 52
                : hasCaptureFocus
                  ? 56
                  : hasTimelineBand
                    ? 54
                    : 58,
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
          badgeContent:
            hasToolbarRibbon
              ? 'Tool card'
              : hasActivityWave
                ? 'Feed card'
              : hasTrustShield
                ? 'Secure card'
                : hasFolioStack
                  ? 'Document card'
                : hasSupportBeacon
                  ? 'Help card'
                  : hasRewardRibbon
                    ? 'Perk card'
                : hasCheckoutLane
                  ? 'Checkout card'
              : hasCaptureFocus
                ? 'Capture card'
                : hasTimelineBand
                  ? 'Agenda card'
                  : hasBrowseStrip
                    ? 'Browse card'
                    : 'Focus card',
          cardBackgroundColor: supportCardBackground,
          includeCrop: false,
        }),
      );
    }

    if (boldRecipe && hasDecorativeCluster) {
      elements.push(
        buildPanoramicDecorativeGroup({
          x: frameSliceStart + 2,
          y: hasProfileOrbit ? 18 : frame.storyBeat === 'summary' ? 16 : 72,
          width: 10.5,
          height: 18,
          rotation: index % 2 === 0 ? -10 : 10,
          accentColor: args.accentColor,
          secondaryColor: '#FFFFFF',
          label:
            hasProfileOrbit
              ? frame.storyBeat === 'hero' ? 'Community' : undefined
              : hasActivityWave
                ? frame.storyBeat === 'hero' ? 'Live' : undefined
              : hasTrustShield
                ? frame.storyBeat === 'hero' ? 'Secure' : undefined
                : hasFolioStack
                  ? frame.storyBeat === 'hero' ? 'Review' : undefined
                : hasSupportBeacon
                  ? frame.storyBeat === 'hero' ? 'Support' : undefined
                  : hasRewardRibbon
                    ? frame.storyBeat === 'hero' ? 'Perks' : undefined
                : hasCheckoutLane
                  ? frame.storyBeat === 'hero' ? 'Order' : undefined
              : hasCaptureFocus
                ? frame.storyBeat === 'hero' ? 'Live' : undefined
                : hasTimelineBand
                  ? frame.storyBeat === 'hero' ? 'On time' : undefined
              : frame.storyBeat === 'summary'
                ? 'Finale'
                : undefined,
          dark: true,
        }),
      );
    }

    if (boldRecipe && hasToolbarRibbon) {
      elements.push(
        buildPanoramicToolbarRibbonGroup({
          x: frameSliceStart + sliceWidth - Math.max(11.5, sliceWidth - 7) - 1.5,
          y: 18,
          width: Math.max(11.5, sliceWidth - 7),
          height: 10.5,
          rotation: index % 2 === 0 ? 3 : -3,
          accentColor: args.accentColor,
          secondaryColor: '#FFFFFF',
          dark: true,
        }),
      );
    }

    if (boldRecipe && hasBrowseStrip) {
      elements.push(
        buildPanoramicBrowseStripGroup({
          x: frameSliceStart + 2,
          y: 76,
          width: Math.max(12, sliceWidth - 4),
          height: 13,
          rotation: index % 2 === 0 ? -3 : 3,
          accentColor: args.accentColor,
          secondaryColor: '#FFFFFF',
          dark: true,
        }),
      );
    }

    if (boldRecipe && hasActivityWave) {
      elements.push(
        buildPanoramicActivityWaveGroup({
          x: frameSliceStart + 2,
          y: 76,
          width: Math.max(12, sliceWidth - 4),
          height: 14,
          rotation: index % 2 === 0 ? -3 : 3,
          accentColor: args.accentColor,
          secondaryColor: '#FFFFFF',
          dark: true,
        }),
      );
    }

    if (boldRecipe && hasFolioStack) {
      elements.push(
        buildPanoramicFolioStackGroup({
          x: frameSliceStart + Math.max(2, sliceWidth - 15),
          y: 18,
          width: Math.max(12, sliceWidth - 5),
          height: 14,
          rotation: index % 2 === 0 ? 3 : -3,
          accentColor: args.accentColor,
          secondaryColor: '#FFFFFF',
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
  variant: Extract<PlannedVariant, { mode: 'panoramic' }>;
  style: TemplateStyle;
  colors: MaterializedPalette;
}): NonNullable<AppframeConfig['panoramic']>['background'] {
  const hasToolbarRibbon = args.variant.frames?.some((frame) => hasCompositionFeature(frame, 'toolbar-ribbon')) ?? false;
  const hasProfileOrbit = args.variant.frames?.some((frame) => hasCompositionFeature(frame, 'profile-orbit')) ?? false;
  const hasBrowseStrip = args.variant.frames?.some((frame) => hasCompositionFeature(frame, 'browse-strip')) ?? false;
  const hasActivityWave = args.variant.frames?.some((frame) => hasCompositionFeature(frame, 'activity-wave')) ?? false;
  const hasCheckoutLane = args.variant.frames?.some((frame) => hasCompositionFeature(frame, 'checkout-lane')) ?? false;
  const hasFolioStack = args.variant.frames?.some((frame) => hasCompositionFeature(frame, 'folio-stack')) ?? false;
  const hasTrustShield = args.variant.frames?.some((frame) => hasCompositionFeature(frame, 'trust-shield')) ?? false;
  const hasSupportBeacon = args.variant.frames?.some((frame) => hasCompositionFeature(frame, 'support-beacon')) ?? false;
  const hasRewardRibbon = args.variant.frames?.some((frame) => hasCompositionFeature(frame, 'reward-ribbon')) ?? false;
  const hasRouteArc = args.variant.frames?.some((frame) => hasCompositionFeature(frame, 'route-arc')) ?? false;
  const hasMediaMarquee = args.variant.frames?.some((frame) => hasCompositionFeature(frame, 'media-marquee')) ?? false;
  const hasCaptureFocus = args.variant.frames?.some((frame) => hasCompositionFeature(frame, 'capture-focus')) ?? false;
  const hasTimelineBand = args.variant.frames?.some((frame) => hasCompositionFeature(frame, 'timeline-band')) ?? false;

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
        ...(hasToolbarRibbon ? [{
          kind: 'solid' as const,
          color: args.colors.primary,
          opacity: 0.08,
          blendMode: 'multiply' as const,
          blur: 0,
        }] : []),
        ...(hasProfileOrbit ? [{
          kind: 'glow' as const,
          color: args.colors.secondary,
          x: 82,
          y: 18,
          width: 22,
          height: 18,
          opacity: 0.24,
          blur: 72,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasBrowseStrip ? [{
          kind: 'glow' as const,
          color: args.colors.primary,
          x: 50,
          y: 82,
          width: 48,
          height: 18,
          opacity: 0.16,
          blur: 80,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasActivityWave ? [{
          kind: 'glow' as const,
          color: args.colors.primary,
          x: 52,
          y: 80,
          width: 44,
          height: 16,
          opacity: 0.16,
          blur: 78,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasCheckoutLane ? [{
          kind: 'glow' as const,
          color: args.colors.primary,
          x: 54,
          y: 82,
          width: 46,
          height: 16,
          opacity: 0.18,
          blur: 82,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasRewardRibbon ? [{
          kind: 'glow' as const,
          color: args.colors.secondary,
          x: 52,
          y: 82,
          width: 44,
          height: 16,
          opacity: 0.16,
          blur: 80,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasTrustShield ? [{
          kind: 'glow' as const,
          color: args.colors.secondary,
          x: 80,
          y: 22,
          width: 24,
          height: 18,
          opacity: 0.18,
          blur: 74,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasSupportBeacon ? [{
          kind: 'glow' as const,
          color: args.colors.secondary,
          x: 80,
          y: 22,
          width: 24,
          height: 18,
          opacity: 0.16,
          blur: 72,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasFolioStack ? [{
          kind: 'solid' as const,
          color: '#FFFFFF',
          opacity: 0.08,
          blendMode: 'screen' as const,
          blur: 0,
        }] : []),
        ...(hasRouteArc ? [{
          kind: 'glow' as const,
          color: args.colors.primary,
          x: 28,
          y: 74,
          width: 36,
          height: 16,
          opacity: 0.18,
          blur: 84,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasMediaMarquee ? [{
          kind: 'solid' as const,
          color: args.colors.secondary,
          opacity: 0.06,
          blendMode: 'multiply' as const,
          blur: 0,
        }] : []),
        ...(hasCaptureFocus ? [{
          kind: 'glow' as const,
          color: args.colors.secondary,
          x: 54,
          y: 26,
          width: 30,
          height: 24,
          opacity: 0.16,
          blur: 78,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasTimelineBand ? [{
          kind: 'glow' as const,
          color: args.colors.primary,
          x: 50,
          y: 18,
          width: 48,
          height: 12,
          opacity: 0.14,
          blur: 72,
          blendMode: 'screen' as const,
        }] : []),
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
        ...(hasToolbarRibbon ? [{
          kind: 'solid' as const,
          color: '#FFFFFF',
          opacity: 0.06,
          blendMode: 'screen' as const,
          blur: 0,
        }] : []),
        ...(hasProfileOrbit ? [{
          kind: 'glow' as const,
          color: args.colors.secondary,
          x: 76,
          y: 14,
          width: 24,
          height: 24,
          opacity: 0.2,
          blur: 72,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasBrowseStrip ? [{
          kind: 'glow' as const,
          color: '#FFFFFF',
          x: 50,
          y: 84,
          width: 44,
          height: 14,
          opacity: 0.12,
          blur: 78,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasActivityWave ? [{
          kind: 'glow' as const,
          color: '#FFFFFF',
          x: 54,
          y: 84,
          width: 42,
          height: 14,
          opacity: 0.12,
          blur: 76,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasCheckoutLane ? [{
          kind: 'glow' as const,
          color: '#FFFFFF',
          x: 52,
          y: 84,
          width: 46,
          height: 16,
          opacity: 0.14,
          blur: 84,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasRewardRibbon ? [{
          kind: 'glow' as const,
          color: '#FFFFFF',
          x: 54,
          y: 84,
          width: 44,
          height: 14,
          opacity: 0.1,
          blur: 76,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasTrustShield ? [{
          kind: 'glow' as const,
          color: args.colors.secondary,
          x: 78,
          y: 18,
          width: 22,
          height: 18,
          opacity: 0.18,
          blur: 78,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasSupportBeacon ? [{
          kind: 'glow' as const,
          color: '#FFFFFF',
          x: 78,
          y: 18,
          width: 22,
          height: 18,
          opacity: 0.14,
          blur: 74,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasFolioStack ? [{
          kind: 'solid' as const,
          color: '#FFFFFF',
          opacity: 0.05,
          blendMode: 'screen' as const,
          blur: 0,
        }] : []),
        ...(hasRouteArc ? [{
          kind: 'glow' as const,
          color: args.colors.primary,
          x: 28,
          y: 74,
          width: 38,
          height: 18,
          opacity: 0.18,
          blur: 88,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasMediaMarquee ? [{
          kind: 'glow' as const,
          color: args.colors.secondary,
          x: 52,
          y: 18,
          width: 34,
          height: 14,
          opacity: 0.18,
          blur: 74,
          blendMode: 'screen' as const,
        }] : []),
        ...(hasCaptureFocus ? [{
          kind: 'solid' as const,
          color: '#08111F',
          opacity: 0.08,
          blendMode: 'multiply' as const,
          blur: 0,
        }] : []),
        ...(hasTimelineBand ? [{
          kind: 'glow' as const,
          color: '#FFFFFF',
          x: 50,
          y: 18,
          width: 46,
          height: 10,
          opacity: 0.12,
          blur: 70,
          blendMode: 'screen' as const,
        }] : []),
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
      background: buildPanoramicBackground({ variant: args.variant, style, colors }),
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
