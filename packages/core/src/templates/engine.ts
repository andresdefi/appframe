import nunjucks from 'nunjucks';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { TemplateStyle, LayoutVariant, ColorConfig, FrameStyle } from '../config/schema.js';
import type { FrameDefinition } from '../frames/types.js';

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
}

export interface TemplateRenderOptions {
  templateDir?: string;
}

export class TemplateEngine {
  private env: nunjucks.Environment;
  private templateDir: string;

  constructor(options?: TemplateRenderOptions) {
    this.templateDir = options?.templateDir ?? join(__dirname, '..', '..', 'templates');
    this.env = nunjucks.configure(this.templateDir, {
      autoescape: true,
      noCache: true,
    });
  }

  async render(context: TemplateContext): Promise<string> {
    const templatePath = this.resolveTemplatePath(context.style, context.layout);
    const templateContent = await readFile(templatePath, 'utf-8');
    return this.env.renderString(templateContent, context);
  }

  private resolveTemplatePath(style: TemplateStyle, _layout: LayoutVariant): string {
    // base.html handles all layout variants via conditionals
    return join(this.templateDir, style, 'base.html');
  }
}
