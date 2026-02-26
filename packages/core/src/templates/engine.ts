import nunjucks from 'nunjucks';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { TemplateStyle, LayoutVariant, ColorConfig, FrameStyle, CompositionPreset } from '../config/schema.js';
import type { FrameDefinition } from '../frames/types.js';
import { loadFontFaces, getFontName } from '../fonts/loader.js';

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

  // Canvas dimensions (final output size)
  canvasWidth: number;
  canvasHeight: number;

  // Device positioning (optional overrides)
  deviceTop?: number;      // Device Y position as % of canvas height (default: 15)
  deviceScale?: number;    // Device width as % of canvas width (default: 92)
  deviceRotation?: number; // Device rotation in degrees (default: 0)
  deviceOffsetX?: number;  // Horizontal offset from center as % of canvas width (default: 0)
  deviceAngle?: number;    // Perspective angle in degrees for angled layouts (default: 8)
  deviceTilt?: number;     // 3D tilt angle in degrees via rotateX (default: 0)

  // Composition
  composition?: CompositionPreset;
  devices?: DeviceContext[];

  // Injected by engine
  fontFaceCss?: string;
  fontFamily?: string;
}

export interface DeviceContext {
  screenshotDataUrl: string;
  frame: FrameDefinition | null;
  frameSvg: string | null;
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
  angle: number;
  tilt: number;
  zIndex: number;
}

export interface TemplateRenderOptions {
  templateDir?: string;
  fontsDir?: string;
}

export class TemplateEngine {
  private env: nunjucks.Environment;
  private templateDir: string;
  private fontsDir?: string;
  private fontFaceCache = new Map<string, string>();

  constructor(options?: TemplateRenderOptions) {
    this.templateDir = options?.templateDir ?? join(__dirname, '..', '..', 'templates');
    this.fontsDir = options?.fontsDir;
    this.env = nunjucks.configure(this.templateDir, {
      autoescape: true,
      noCache: true,
    });
  }

  async render(context: TemplateContext): Promise<string> {
    const fontKey = context.font || 'inter';

    // Load and cache font-face CSS per font family
    if (!this.fontFaceCache.has(fontKey)) {
      this.fontFaceCache.set(fontKey, await loadFontFaces(fontKey, this.fontsDir));
    }

    const templatePath = this.resolveTemplatePath(context.style, context.layout);
    const templateContent = await readFile(templatePath, 'utf-8');
    return this.env.renderString(templateContent, {
      ...context,
      fontFaceCss: this.fontFaceCache.get(fontKey),
      fontFamily: getFontName(fontKey),
    });
  }

  private resolveTemplatePath(style: TemplateStyle, _layout: LayoutVariant): string {
    // base.html handles all layout variants via conditionals
    return join(this.templateDir, style, 'base.html');
  }
}
