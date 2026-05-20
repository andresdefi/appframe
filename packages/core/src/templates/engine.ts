import nunjucks from 'nunjucks';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
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
import { loadFontFaces, loadFontFacesUrl, getFontName } from '../fonts/loader.js';
import { sanitizeRichHtml } from '../sanitize/richHtml.js';

interface TypographyDefaults {
  fontWeight: number;
  headlineFontSizeScale: number;
  subtitleFontSizeScale: number;
  headlineLineHeight: number;
  headlineLetterSpacing: string;
  headlineTextTransform: string;
  headlineFontStyle: string;
  subtitleOpacity: number;
  subtitleLineHeight: number;
  subtitleLetterSpacing: string;
  subtitleTextTransform: string;
  fontFallback: string;
}

type ShadowIntensity = 'light' | 'medium' | 'heavy' | 'glow';

interface ShadowConfig {
  intensity: ShadowIntensity;
  standard: Array<[number, number, number]>;
  angled: Array<[number, number, number]>;
  glowScale?: number;
  glowAlpha?: string;
}

type BgEffect = 'none' | 'orbs' | 'glow' | 'shapes' | 'flat-circles' | 'divider';

interface StylePreset {
  backgroundCss: (colors: ColorConfig) => string;
  bgEffect: BgEffect;
  typography: TypographyDefaults;
  shadow: ShadowConfig;
  perspective: { angled: number; standard: number };
  textAreaTop: number;
  textAreaPadding: number;
}

const BASELINE: StylePreset = {
  backgroundCss: (colors) => colors.background,
  bgEffect: 'none',
  typography: {
    fontWeight: 600,
    headlineFontSizeScale: 0.085,
    subtitleFontSizeScale: 0.035,
    headlineLineHeight: 1.12,
    headlineLetterSpacing: '-0.02em',
    headlineTextTransform: 'none',
    headlineFontStyle: 'normal',
    subtitleOpacity: 0.5,
    subtitleLineHeight: 1.4,
    subtitleLetterSpacing: '0',
    subtitleTextTransform: 'none',
    fontFallback: "'Inter', -apple-system, sans-serif",
  },
  shadow: {
    intensity: 'light',
    standard: [[0.02, 0.05, 0.15]],
    angled: [[0.02, 0.05, 0.18]],
  },
  perspective: { angled: 1200, standard: 1500 },
  textAreaTop: 0.03,
  textAreaPadding: 0.07,
};

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface TemplateContext {
  // Screen content
  headline: string;
  subtitle?: string;
  screenshotUrl: string;

  // Theme
  colors: ColorConfig;
  font: string;
  fontWeight: number;

  // Per-screen layout flag — when true, the screenshot fills the canvas and
  // the headline/subtitle text area is hidden.
  isFullscreen?: boolean;

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
  backgroundImageFit?: 'cover' | 'contain' | 'fill';
  backgroundImagePositionX?: number;
  backgroundImagePositionY?: number;
  backgroundImageScale?: number;
  backgroundOverlay?: { color: string; opacity: number };

  // Device enhancements
  deviceShadow?: DeviceShadow;
  borderSimulation?: BorderSimulation;
  cornerRadius?: number;

  // Effects
  loupe?: Loupe;
  callouts?: Callout[];
  overlays?: Overlay[];

  // Per-element font/weight overrides — each falls back to the global font / fontWeight
  headlineFont?: string;
  headlineFontWeight?: number;
  subtitleFont?: string;
  subtitleFontWeight?: number;

  // Free text — third text slot (toggleable). When freeTextEnabled is true
  // and freeText is non-empty, the engine renders <div class="free-text">
  // beneath the subtitle inside .text-area.
  freeText?: string;
  freeTextEnabled?: boolean;
  freeTextSize?: number;
  freeTextFont?: string;
  freeTextFontWeight?: number;
  freeTextRotation?: number;
  freeTextLetterSpacing?: string;
  freeTextTextTransform?: string;
  freeTextColor?: string;

  // Injected by engine
  fontFaceCss?: string;
  fontFamily?: string;
  headlineFontFamily?: string;
  subtitleFontFamily?: string;
  freeTextFontFamily?: string;
}

export interface DeviceContext {
  screenshotUrl: string;
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
  backgroundLayers?: PanoramicRenderedBackgroundLayer[];

  // Debug
  showGuides?: boolean;
  guideColor?: string;

  // Pre-computed elements with pixel values
  elements: PanoramicRenderedElement[];

  // Injected by engine
  fontFaceCss?: string;
  fontFamily?: string;
}

export interface PanoramicRenderedBackgroundLayer {
  kind: 'solid' | 'gradient' | 'image' | 'glow';
  backgroundCss: string;
  opacity: number;
  blendMode: string;
  blurPx?: number;
  xPx?: number;
  yPx?: number;
  widthPx?: number;
  heightPx?: number;
}

export interface PanoramicRenderedElement {
  type:
    | 'device'
    | 'text'
    | 'label'
    | 'decoration'
    | 'image'
    | 'logo'
    | 'crop'
    | 'card'
    | 'badge'
    | 'proof-chip'
    | 'group';
  z: number;

  // Pixel positions (computed from % of canvas)
  xPx: number;
  yPx: number;

  // Device-specific
  widthPx?: number;
  rotation?: number;
  screenshotUrl?: string;
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

  // Crop-specific
  focusX?: number;
  focusY?: number;
  zoom?: number;
  translateXPx?: number;
  translateYPx?: number;

  // Card-specific
  eyebrow?: string;
  title?: string;
  body?: string;
  align?: 'left' | 'center';
  borderColor?: string;
  borderWidthPx?: number;
  eyebrowColor?: string;
  titleColor?: string;
  bodyColor?: string;
  eyebrowSizePx?: number;
  titleSizePx?: number;
  bodySizePx?: number;

  // Badge-specific
  letterSpacing?: number;
  textTransform?: string;

  // Proof-chip-specific
  value?: string;
  detail?: string;
  rating?: number;
  maxRating?: number;
  mutedColor?: string;
  starColor?: string;
  valueSizePx?: number;
  detailSizePx?: number;

  // Group-specific
  children?: PanoramicRenderedElement[];
}

export interface TemplateRenderOptions {
  templateDir?: string;
  fontsDir?: string;
  /**
   * Optional URL prefix that the fonts/ directory is served from. When set,
   * the engine emits @font-face declarations with `src: url(<fontBaseUrl>/<family>/<file>)`
   * instead of inlining the font as a base64 data URI. The live preview
   * server uses this to keep each iframe rewrite at ~6KB instead of ~338KB;
   * the export pipeline leaves it unset so Playwright renders fonts via
   * data URIs without an HTTP server.
   */
  fontBaseUrl?: string;
}

/**
 * Per-call override for how the engine emits @font-face declarations.
 *
 * - `inline`: base64 data URI font CSS. Self-contained — works without an
 *   HTTP server. Used by the export pipeline.
 * - `url`: `src: url(<fontBaseUrl>/<family>/<file>)` declarations. Tiny
 *   payload but the consumer must serve the font files. Used by the live
 *   preview server's iframes.
 * - `none`: emit no @font-face at all. The consumer is expected to have
 *   already registered the required fonts on the parent document — the
 *   shadow-DOM live preview (Phase 3+) uses this path so fonts aren't
 *   duplicated per card.
 *
 * When undefined, falls back to the construction-time default: `url` when
 * `fontBaseUrl` was provided to the constructor, otherwise `inline`.
 */
export type FontFaceMode = 'inline' | 'url' | 'none';

export interface RenderOptions {
  fontFaceMode?: FontFaceMode;
}

function buildShadowCss(preset: StylePreset, context: TemplateContext): string {
  const cw = context.canvasWidth;
  const layout = context.layout;
  const colors = context.colors;

  if (context.isFullscreen) return '';

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
  private fontBaseUrl?: string;
  private fontFaceCache = new Map<string, string>();
  private compiledTemplateCache = new Map<string, nunjucks.Template>();

  constructor(options?: TemplateRenderOptions) {
    this.templateDir = options?.templateDir ?? join(__dirname, '..', '..', 'templates');
    this.fontsDir = options?.fontsDir;
    this.fontBaseUrl = options?.fontBaseUrl;
    this.env = nunjucks.configure(this.templateDir, {
      autoescape: true,
      noCache: true,
    });
    // Custom filter that runs the rich-text allowlist sanitizer before
    // the templates emit user-controlled HTML. Templates use it as
    // `{{ headline | sanitizeRichHtml | safe }}` — sanitize strips
    // anything outside the TipTap allowlist, then `| safe` opts back
    // out of autoescape so the kept tags actually render.
    this.env.addFilter('sanitizeRichHtml', (value: unknown) => sanitizeRichHtml(value));
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

  /**
   * Resolve the effective FontFaceMode for a call. Explicit override wins;
   * otherwise fall back to the constructor's setup (url when fontBaseUrl is
   * set, else inline). `none` is never the default — callers opt in.
   */
  private resolveFontFaceMode(override: FontFaceMode | undefined): FontFaceMode {
    if (override) return override;
    return this.fontBaseUrl ? 'url' : 'inline';
  }

  /**
   * Cache key includes mode because the same fontKey produces different
   * CSS under 'inline' vs 'url'. Without this, an 'inline' call after a
   * 'url' call returns the wrong format.
   */
  private async getFontFaceCss(fontKey: string, mode: FontFaceMode): Promise<string> {
    if (mode === 'none') return '';
    if (mode === 'url' && !this.fontBaseUrl) {
      throw new Error(
        "TemplateEngine: fontFaceMode='url' requires a fontBaseUrl in the constructor",
      );
    }
    const cacheKey = `${mode}:${fontKey}`;
    const cached = this.fontFaceCache.get(cacheKey);
    if (cached !== undefined) return cached;
    const css =
      mode === 'url'
        ? await loadFontFacesUrl(fontKey, this.fontBaseUrl!, this.fontsDir)
        : await loadFontFaces(fontKey, this.fontsDir);
    this.fontFaceCache.set(cacheKey, css);
    return css;
  }

  async render(context: TemplateContext, options?: RenderOptions): Promise<string> {
    const mode = this.resolveFontFaceMode(options?.fontFaceMode);
    const fontKey = context.font || 'inter';

    const fontKeys = Array.from(
      new Set(
        [
          fontKey,
          context.headlineFont,
          context.subtitleFont,
          context.freeTextFont,
        ].filter((k): k is string => typeof k === 'string' && k.length > 0),
      ),
    );

    // Skip font-face loading entirely in 'none' mode — saves the disk read
    // for the shadow-DOM path where the parent document already has the
    // fonts registered.
    const combinedFontFaceCss =
      mode === 'none'
        ? ''
        : (await Promise.all(fontKeys.map((k) => this.getFontFaceCss(k, mode)))).join('\n\n');

    const presetContext = resolvePresetContext(BASELINE, context);

    const globalFontFamily = getFontName(fontKey);

    const templatePath = this.resolveTemplatePath();
    const compiled = await this.getCompiledTemplate(templatePath);
    return compiled.render({
      ...context,
      ...presetContext,
      fontFaceCss: combinedFontFaceCss,
      fontFamily: globalFontFamily,
      // Per-element fonts are concrete (the cascade was removed). Fall back
      // to the global family only when the caller didn't pass anything,
      // which protects legacy SDK consumers passing partial contexts.
      headlineFontFamily: context.headlineFont
        ? getFontName(context.headlineFont)
        : globalFontFamily,
      subtitleFontFamily: context.subtitleFont
        ? getFontName(context.subtitleFont)
        : globalFontFamily,
      freeTextFontFamily: context.freeTextFont
        ? getFontName(context.freeTextFont)
        : globalFontFamily,
    });
  }

  async renderPanoramic(
    context: PanoramicTemplateContext,
    options?: RenderOptions,
  ): Promise<string> {
    const mode = this.resolveFontFaceMode(options?.fontFaceMode);
    const fontKey = context.font || 'inter';

    const fontFaceCss = mode === 'none' ? '' : await this.getFontFaceCss(fontKey, mode);

    const templatePath = join(this.templateDir, 'panoramic', 'base.html');
    const compiled = await this.getCompiledTemplate(templatePath);

    // Sort elements by z-index for proper layering
    const sortedElements = [...context.elements].sort((a, b) => a.z - b.z);

    return compiled.render({
      ...context,
      elements: sortedElements,
      fontFaceCss,
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
    // Image bg is rendered as a separate <img class="canvas-bg-image">
    // element inside .canvas (see universal/base.html). The canvas itself
    // gets a transparent background so the img shows through. This lets
    // Fit (object-fit) and Zoom (transform: scale) be controlled
    // independently — using background-size for both was conflicting.
    resolvedBackgroundCss = 'transparent';
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
    isFullscreen: context.isFullscreen ?? false,
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
