import nunjucks from 'nunjucks';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  TemplateStyle,
  LayoutVariant,
  ColorConfig,
  FrameStyle,
  CompositionPreset,
  BackgroundType,
  BackgroundGradient,
  DeviceShadow,
  BorderSimulation,
  Loupe,
  Callout,
  Overlay,
} from '../config/schema.js';
import type { FrameDefinition } from '../frames/types.js';
import { loadFontFaces, getFontName } from '../fonts/loader.js';
import { STYLE_PRESETS } from '../config/presets.js';
import type { StylePreset } from '../config/presets.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface TemplateContext {
  // Screen content
  headline: string;
  subtitle?: string;
  screenshotDataUrl: string;

  // Theme
  style: TemplateStyle;
  colors: ColorConfig;
  font: string;
  fontWeight: number;

  // Layout
  layout: LayoutVariant;

  // Frame
  frame: FrameDefinition | null;
  frameStyle: FrameStyle;
  frameSvg: string | null;
  framePngUrl?: string; // URL to PNG frame image (for Koubou devices without SVG)

  // Canvas dimensions (final output size)
  canvasWidth: number;
  canvasHeight: number;

  // Font sizing (optional overrides — in pixels at 1290px reference width)
  headlineSize?: number;
  subtitleSize?: number;

  // Text rotation (in degrees)
  headlineRotation?: number;
  subtitleRotation?: number;

  // Text gradient (optional — overrides solid text color)
  headlineGradient?: { colors: string[]; direction: number };
  subtitleGradient?: { colors: string[]; direction: number };

  // Device positioning (optional overrides)
  deviceTop?: number; // Device Y position as % of canvas height (default: 15)
  deviceScale?: number; // Device width as % of canvas width (default: 92)
  deviceRotation?: number; // Device rotation in degrees (default: 0)
  deviceOffsetX?: number; // Horizontal offset from center as % of canvas width (default: 0)
  deviceAngle?: number; // Perspective angle in degrees for angled layouts (default: 8)
  deviceTilt?: number; // 3D tilt angle in degrees via rotateX (default: 0)

  // Composition
  composition?: CompositionPreset;
  devices?: DeviceContext[];

  // Auto-sizing text
  autoSizeHeadline?: boolean;
  autoSizeSubtitle?: boolean;

  // Spotlight/dimming overlay
  spotlight?: {
    x: number;
    y: number;
    w: number;
    h: number;
    shape: 'circle' | 'rectangle';
    dimOpacity: number;
    blur: number;
  };

  // Annotation highlight shapes
  annotations?: Array<{
    id: string;
    shape: string;
    x: number;
    y: number;
    w: number;
    h: number;
    strokeColor: string;
    strokeWidth: number;
    fillColor?: string;
  }>;

  // Typography overrides (from theme config — override preset defaults)
  headlineLineHeight?: number;
  headlineLetterSpacing?: string;
  headlineTextTransform?: string;
  headlineFontStyle?: string;
  subtitleOpacity?: number;
  subtitleLetterSpacing?: string;
  subtitleTextTransform?: string;

  // Background overrides
  backgroundType?: BackgroundType;
  backgroundColor?: string;
  backgroundGradient?: BackgroundGradient;
  backgroundImageDataUrl?: string;
  backgroundOverlay?: { color: string; opacity: number };

  // Device enhancements
  deviceShadow?: DeviceShadow;
  borderSimulation?: BorderSimulation;
  cornerRadius?: number;

  // Effects
  loupe?: Loupe;
  callouts?: Callout[];
  overlays?: Overlay[];

  // Injected by engine
  fontFaceCss?: string;
  fontFamily?: string;
}

export interface DeviceContext {
  screenshotDataUrl: string;
  frame: FrameDefinition | null;
  frameSvg: string | null;
  framePngUrl?: string;
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
  angle: number;
  tilt: number;
  zIndex: number;
}

export interface PanoramicTemplateContext {
  // Canvas dimensions (total wide canvas)
  canvasWidth: number;
  canvasHeight: number;
  frameCount: number;
  frameWidth: number;

  // Font
  font: string;
  fontWeight: number;

  // Frame style
  frameStyle: FrameStyle;

  // Background CSS
  backgroundCss: string;

  // Debug
  showGuides?: boolean;
  guideColor?: string;

  // Pre-computed elements with pixel values
  elements: PanoramicRenderedElement[];

  // Injected by engine
  fontFaceCss?: string;
  fontFamily?: string;
}

export interface PanoramicRenderedElement {
  type: 'device' | 'text' | 'label' | 'decoration' | 'image';
  z: number;

  // Pixel positions (computed from % of canvas)
  xPx: number;
  yPx: number;

  // Device-specific
  widthPx?: number;
  rotation?: number;
  screenshotDataUrl?: string;
  frameSvg?: string | null;
  framePngUrl?: string;
  shadowCss?: string;
  clipLeft?: number;
  clipTop?: number;
  clipWidth?: number;
  clipHeight?: number;
  clipRadius?: number;
  borderRadius?: number;
  borderSimulation?: { thickness: number; color: string; radius: number };

  // Text-specific
  content?: string;
  fontSizePx?: number;
  color?: string;
  font?: string;
  fontWeight?: number;
  fontStyle?: string;
  textAlign?: string;
  maxWidthPx?: number;
  lineHeight?: number;
  gradientCss?: string;

  // Label-specific
  backgroundColor?: string;
  paddingPx?: number;

  // Decoration-specific
  shape?: string;
  heightPx?: number;
  opacity?: number;

  // Image-specific
  srcDataUrl?: string;
  fit?: 'contain' | 'cover';
}

export interface TemplateRenderOptions {
  templateDir?: string;
  fontsDir?: string;
}

function buildShadowCss(preset: StylePreset, context: TemplateContext): string {
  const cw = context.canvasWidth;
  const layout = context.layout;
  const frameStyle = context.frameStyle;
  const colors = context.colors;

  if (preset.isFullscreen) return '';

  // 3D frame style always uses the same 4-layer cascade
  if (frameStyle === '3d') {
    const layers = [
      [0.005, 0.01, 0.3],
      [0.02, 0.04, 0.2],
      [0.06, 0.12, 0.25],
      [0.1, 0.2, 0.15],
    ];
    // Glow preset adds a color glow layer on top
    const glowLayer =
      preset.shadow.intensity === 'glow' && preset.shadow.glowScale
        ? `drop-shadow(0 0 ${Math.round(cw * preset.shadow.glowScale * 0.75)}px ${colors.primary}44) `
        : '';
    const shadowLayers = layers
      .map(
        ([y, b, a]) =>
          `drop-shadow(0 ${Math.round(cw * y!)}px ${Math.round(cw * b!)}px rgba(0,0,0,${a}))`,
      )
      .join('\n          ');
    return `filter: ${glowLayer}${shadowLayers};`;
  }

  let shadowDefs: Array<[number, number, number]>;
  if (layout === 'angled-left' || layout === 'angled-right') {
    shadowDefs = preset.shadow.angled;
  } else {
    shadowDefs = preset.shadow.standard;
  }

  if (shadowDefs.length === 0) return '';

  const shadowLayers = shadowDefs
    .map(
      ([y, b, a]) =>
        `drop-shadow(0 ${Math.round(cw * y!)}px ${Math.round(cw * b!)}px rgba(0,0,0,${a}))`,
    )
    .join(' ');

  // Glow preset adds a color glow layer
  if (preset.shadow.intensity === 'glow') {
    const glowScale = preset.shadow.glowScale ?? 0.08;
    const glowAlpha = preset.shadow.glowAlpha ?? '66';
    return `filter: drop-shadow(0 0 ${Math.round(cw * glowScale)}px ${colors.primary}${glowAlpha}) ${shadowLayers};`;
  }

  return `filter: ${shadowLayers};`;
}

export class TemplateEngine {
  private env: nunjucks.Environment;
  private templateDir: string;
  private fontsDir?: string;
  private fontFaceCache = new Map<string, string>();
  private compiledTemplateCache = new Map<string, nunjucks.Template>();

  constructor(options?: TemplateRenderOptions) {
    this.templateDir = options?.templateDir ?? join(__dirname, '..', '..', 'templates');
    this.fontsDir = options?.fontsDir;
    this.env = nunjucks.configure(this.templateDir, {
      autoescape: true,
      noCache: true,
    });
  }

  /**
   * Load a template from disk, compile it once via nunjucks, and cache the
   * compiled Template object. Subsequent calls for the same path skip both
   * the disk read *and* the nunjucks parse/compile step.
   */
  private async getCompiledTemplate(templatePath: string): Promise<nunjucks.Template> {
    const cached = this.compiledTemplateCache.get(templatePath);
    if (cached !== undefined) return cached;
    const content = await readFile(templatePath, 'utf-8');
    const compiled = new nunjucks.Template(content, this.env, templatePath, true);
    this.compiledTemplateCache.set(templatePath, compiled);
    return compiled;
  }

  async render(context: TemplateContext): Promise<string> {
    const fontKey = context.font || 'inter';

    // Load and cache font-face CSS per font family
    if (!this.fontFaceCache.has(fontKey)) {
      this.fontFaceCache.set(fontKey, await loadFontFaces(fontKey, this.fontsDir));
    }

    const preset = STYLE_PRESETS[context.style];
    const presetContext = resolvePresetContext(preset, context);

    const templatePath = this.resolveTemplatePath();
    const compiled = await this.getCompiledTemplate(templatePath);
    return compiled.render({
      ...context,
      ...presetContext,
      fontFaceCss: this.fontFaceCache.get(fontKey),
      fontFamily: getFontName(fontKey),
    });
  }

  async renderPanoramic(context: PanoramicTemplateContext): Promise<string> {
    const fontKey = context.font || 'inter';

    if (!this.fontFaceCache.has(fontKey)) {
      this.fontFaceCache.set(fontKey, await loadFontFaces(fontKey, this.fontsDir));
    }

    const templatePath = join(this.templateDir, 'panoramic', 'base.html');
    const compiled = await this.getCompiledTemplate(templatePath);

    // Sort elements by z-index for proper layering
    const sortedElements = [...context.elements].sort((a, b) => a.z - b.z);

    return compiled.render({
      ...context,
      elements: sortedElements,
      fontFaceCss: this.fontFaceCache.get(fontKey),
      fontFamily: getFontName(fontKey),
    });
  }

  private resolveTemplatePath(): string {
    return join(this.templateDir, 'universal', 'base.html');
  }
}

function buildGradientCss(gradient: BackgroundGradient): string {
  const colorList = gradient.colors.join(', ');
  if (gradient.type === 'radial') {
    return `radial-gradient(circle at ${gradient.radialPosition}, ${colorList})`;
  }
  return `linear-gradient(${gradient.direction}deg, ${colorList})`;
}

function buildDeviceShadowCss(shadow: DeviceShadow): string {
  const alphaHex = Math.round(shadow.opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return `filter: drop-shadow(0 ${shadow.offsetY}px ${shadow.blur}px ${shadow.color}${alphaHex});`;
}

function resolvePresetContext(preset: StylePreset, context: TemplateContext) {
  // Priority chain: user-specified values > preset defaults
  const typo = preset.typography;

  // Resolve background CSS based on backgroundType
  const bgType = context.backgroundType ?? 'preset';
  let resolvedBackgroundCss = preset.backgroundCss(context.colors);
  let resolvedBgEffect = preset.bgEffect;

  if (bgType === 'solid' && context.backgroundColor) {
    resolvedBackgroundCss = context.backgroundColor;
    resolvedBgEffect = 'none' as typeof resolvedBgEffect;
  } else if (bgType === 'gradient' && context.backgroundGradient) {
    resolvedBackgroundCss = buildGradientCss(context.backgroundGradient);
    resolvedBgEffect = 'none' as typeof resolvedBgEffect;
  } else if (bgType === 'image' && context.backgroundImageDataUrl) {
    resolvedBackgroundCss = `url('${context.backgroundImageDataUrl}') center/cover no-repeat`;
    resolvedBgEffect = 'none' as typeof resolvedBgEffect;
  }

  // Resolve shadow CSS — custom deviceShadow overrides preset.
  // When background is not 'preset', show no shadow unless the user
  // explicitly enabled a custom deviceShadow in the Device tab.
  const shadowCss = context.deviceShadow
    ? buildDeviceShadowCss(context.deviceShadow)
    : bgType !== 'preset'
      ? ''
      : buildShadowCss(preset, context);

  return {
    isFullscreen: preset.isFullscreen,
    presetBackgroundCss: resolvedBackgroundCss,
    presetBgEffect: resolvedBgEffect,
    presetFontFallback: typo.fontFallback,
    presetFontWeight: typo.fontWeight,
    presetHeadlineFontSizeScale: typo.headlineFontSizeScale,
    presetSubtitleFontSizeScale: typo.subtitleFontSizeScale,
    presetHeadlineLineHeight: context.headlineLineHeight ?? typo.headlineLineHeight,
    presetHeadlineLetterSpacing: context.headlineLetterSpacing ?? typo.headlineLetterSpacing,
    presetHeadlineTextTransform: context.headlineTextTransform ?? typo.headlineTextTransform,
    presetHeadlineFontStyle: context.headlineFontStyle ?? typo.headlineFontStyle,
    presetSubtitleOpacity: context.subtitleOpacity ?? typo.subtitleOpacity,
    presetSubtitleLineHeight: typo.subtitleLineHeight,
    presetSubtitleLetterSpacing: context.subtitleLetterSpacing ?? typo.subtitleLetterSpacing,
    presetSubtitleTextTransform: context.subtitleTextTransform ?? typo.subtitleTextTransform,
    presetTextAreaTop: preset.textAreaTop,
    presetTextAreaPadding: preset.textAreaPadding,
    presetPerspectiveAngled: preset.perspective.angled,
    presetPerspectiveStandard: preset.perspective.standard,
    presetShadowCss: shadowCss,
  };
}
