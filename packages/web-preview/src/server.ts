import express from 'express';
import cors from 'cors';
import { join, dirname, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  loadConfig,
  listFrames,
  getFrame,
  getDefaultFrame,
  Renderer,
  TemplateEngine,
} from '@appframe/core';
import type { AppframeConfig, TemplateStyle, LayoutVariant, FrameStyle } from '@appframe/core';
import type { TemplateContext } from '@appframe/core';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface PreviewServerOptions {
  configPath: string;
  port?: number;
}

export async function startPreviewServer(options: PreviewServerOptions): Promise<void> {
  const { configPath, port = 4400 } = options;
  const resolvedConfigPath = resolve(configPath);
  const configDir = dirname(resolvedConfigPath);

  let config = await loadConfig(resolvedConfigPath);

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Serve static frontend
  const publicDir = join(__dirname, '..', 'public');
  app.use(express.static(publicDir));

  // API: Get current config
  app.get('/api/config', (_req, res) => {
    res.json(config);
  });

  // API: List available frames
  app.get('/api/frames', async (_req, res) => {
    try {
      const frames = await listFrames();
      res.json(frames);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  // API: List available templates
  app.get('/api/templates', (_req, res) => {
    res.json(['minimal', 'bold', 'glow', 'playful', 'clean', 'branded', 'editorial']);
  });

  // API: List available fonts
  app.get('/api/fonts', (_req, res) => {
    res.json([
      { id: 'inter', name: 'Inter', weights: [400, 500, 600, 700, 800] },
      { id: 'space-grotesk', name: 'Space Grotesk', weights: [400, 500, 600, 700] },
    ]);
  });

  // API: Render a single screen preview
  const renderer = new Renderer();
  await renderer.init();

  const templateEngine = new TemplateEngine();

  // API: Render HTML only (no Playwright screenshot — used by iframe preview)
  app.post('/api/preview-html', async (req, res) => {
    try {
      const {
        screenIndex = 0,
        locale = 'default',
        style,
        layout,
        headline,
        subtitle,
        colors,
        font,
        fontWeight,
        frameId,
        frameStyle: fStyle,
        width = 400,
        height = 868,
        deviceTop,
        deviceScale,
      } = req.body as {
        screenIndex?: number;
        locale?: string;
        style?: TemplateStyle;
        layout?: LayoutVariant;
        headline?: string;
        subtitle?: string;
        colors?: Record<string, string>;
        font?: string;
        fontWeight?: number;
        frameId?: string;
        frameStyle?: FrameStyle;
        width?: number;
        height?: number;
        deviceTop?: number;
        deviceScale?: number;
      };

      const screen = config.screens[screenIndex];
      if (!screen) {
        res.status(400).json({ error: `Screen index ${screenIndex} not found` });
        return;
      }

      const resolvedHeadline = headline ?? getLocaleText(config, screenIndex, locale, 'headline') ?? screen.headline;
      const resolvedSubtitle = subtitle ?? getLocaleText(config, screenIndex, locale, 'subtitle') ?? screen.subtitle;

      const screenshotPath = join(configDir, screen.screenshot);
      const screenshotDataUrl = await screenshotToDataUrl(screenshotPath);

      const frame = frameId
        ? await getFrame(frameId)
        : await getDefaultFrame('ios');
      let frameSvg: string | null = null;
      if (frame && (fStyle ?? config.frames.style) !== 'none') {
        frameSvg = await readFile(frame.framePath, 'utf-8');
      }

      const context: TemplateContext = {
        headline: resolvedHeadline,
        subtitle: resolvedSubtitle,
        screenshotDataUrl,
        style: style ?? config.theme.style,
        colors: colors ? { ...config.theme.colors, ...colors } : config.theme.colors,
        font: font ?? config.theme.font,
        fontWeight: fontWeight ?? config.theme.fontWeight,
        layout: layout ?? screen.layout,
        frame: frame ?? null,
        frameStyle: fStyle ?? config.frames.style,
        frameSvg,
        canvasWidth: width,
        canvasHeight: height,
        deviceTop,
        deviceScale,
      };

      const html = await templateEngine.render(context);
      res.set('Content-Type', 'text/html');
      res.send(html);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/preview', async (req, res) => {
    try {
      const {
        screenIndex = 0,
        locale = 'default',
        style,
        layout,
        headline,
        subtitle,
        colors,
        font,
        fontWeight,
        frameId,
        frameStyle: fStyle,
        width = 400,
        height = 868,
        deviceTop,
        deviceScale,
      } = req.body as {
        screenIndex?: number;
        locale?: string;
        style?: TemplateStyle;
        layout?: LayoutVariant;
        headline?: string;
        subtitle?: string;
        colors?: Record<string, string>;
        font?: string;
        fontWeight?: number;
        frameId?: string;
        frameStyle?: FrameStyle;
        width?: number;
        height?: number;
        deviceTop?: number;
        deviceScale?: number;
      };

      const screen = config.screens[screenIndex];
      if (!screen) {
        res.status(400).json({ error: `Screen index ${screenIndex} not found` });
        return;
      }

      // Resolve headline/subtitle (use overrides or locale or default)
      const resolvedHeadline = headline ?? getLocaleText(config, screenIndex, locale, 'headline') ?? screen.headline;
      const resolvedSubtitle = subtitle ?? getLocaleText(config, screenIndex, locale, 'subtitle') ?? screen.subtitle;

      // Resolve screenshot
      const screenshotPath = join(configDir, screen.screenshot);
      const screenshotDataUrl = await screenshotToDataUrl(screenshotPath);

      // Resolve frame
      const frame = frameId
        ? await getFrame(frameId)
        : await getDefaultFrame('ios');
      let frameSvg: string | null = null;
      if (frame && (fStyle ?? config.frames.style) !== 'none') {
        frameSvg = await readFile(frame.framePath, 'utf-8');
      }

      const context: TemplateContext = {
        headline: resolvedHeadline,
        subtitle: resolvedSubtitle,
        screenshotDataUrl,
        style: style ?? config.theme.style,
        colors: colors ? { ...config.theme.colors, ...colors } : config.theme.colors,
        font: font ?? config.theme.font,
        fontWeight: fontWeight ?? config.theme.fontWeight,
        layout: layout ?? screen.layout,
        frame: frame ?? null,
        frameStyle: fStyle ?? config.frames.style,
        frameSvg,
        canvasWidth: width,
        canvasHeight: height,
        deviceTop,
        deviceScale,
      };

      const html = await templateEngine.render(context);

      const tmpPath = join(configDir, `.appframe-preview-${Date.now()}.png`);
      await renderer.render({
        html,
        width,
        height,
        outputPath: tmpPath,
      });

      const imageBuffer = await readFile(tmpPath);
      const { unlink } = await import('node:fs/promises');
      await unlink(tmpPath);

      res.set('Content-Type', 'image/png');
      res.send(imageBuffer);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  // API: Export full-resolution screenshot
  app.post('/api/export', async (req, res) => {
    try {
      const {
        screenIndex = 0,
        locale = 'default',
        style,
        layout,
        headline,
        subtitle,
        colors,
        font,
        fontWeight,
        frameId,
        frameStyle: fStyle,
        platform = 'ios',
        sizeKey = 'ios-6.7',
        deviceTop,
        deviceScale,
      } = req.body as {
        screenIndex?: number;
        locale?: string;
        style?: TemplateStyle;
        layout?: LayoutVariant;
        headline?: string;
        subtitle?: string;
        colors?: Record<string, string>;
        font?: string;
        fontWeight?: number;
        frameId?: string;
        frameStyle?: FrameStyle;
        platform?: string;
        sizeKey?: string;
        deviceTop?: number;
        deviceScale?: number;
      };

      // Get the store size dimensions
      const { STORE_SIZES } = await import('@appframe/core');
      const sizeSpec = STORE_SIZES[sizeKey];
      if (!sizeSpec) {
        res.status(400).json({ error: `Unknown size: ${sizeKey}` });
        return;
      }

      const screen = config.screens[screenIndex];
      if (!screen) {
        res.status(400).json({ error: `Screen index ${screenIndex} not found` });
        return;
      }

      const resolvedHeadline = headline ?? getLocaleText(config, screenIndex, locale, 'headline') ?? screen.headline;
      const resolvedSubtitle = subtitle ?? getLocaleText(config, screenIndex, locale, 'subtitle') ?? screen.subtitle;

      const screenshotPath = join(configDir, screen.screenshot);
      const screenshotDataUrl = await screenshotToDataUrl(screenshotPath);

      const frame = frameId
        ? await getFrame(frameId)
        : await getDefaultFrame(platform as 'ios' | 'android');
      let frameSvg: string | null = null;
      if (frame && (fStyle ?? config.frames.style) !== 'none') {
        frameSvg = await readFile(frame.framePath, 'utf-8');
      }

      const context: TemplateContext = {
        headline: resolvedHeadline,
        subtitle: resolvedSubtitle,
        screenshotDataUrl,
        style: style ?? config.theme.style,
        colors: colors ? { ...config.theme.colors, ...colors } : config.theme.colors,
        font: font ?? config.theme.font,
        fontWeight: fontWeight ?? config.theme.fontWeight,
        layout: layout ?? screen.layout,
        frame: frame ?? null,
        frameStyle: fStyle ?? config.frames.style,
        frameSvg,
        canvasWidth: sizeSpec.width,
        canvasHeight: sizeSpec.height,
        deviceTop,
        deviceScale,
      };

      const html = await templateEngine.render(context);

      const tmpPath = join(configDir, `.appframe-export-${Date.now()}.png`);
      await renderer.render({
        html,
        width: sizeSpec.width,
        height: sizeSpec.height,
        outputPath: tmpPath,
      });

      const imageBuffer = await readFile(tmpPath);
      const { unlink } = await import('node:fs/promises');
      await unlink(tmpPath);

      const filename = `${config.app.name.replace(/[^a-zA-Z0-9]/g, '_')}_screen_${screenIndex + 1}_${sizeKey}.png`;
      res.set('Content-Type', 'image/png');
      res.set('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(imageBuffer);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  // API: Reload config
  app.post('/api/reload', async (_req, res) => {
    try {
      config = await loadConfig(resolvedConfigPath);
      res.json({ success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  app.listen(port, () => {
    console.log(`appframe preview running at http://localhost:${port}`);
  });

  // Cleanup on exit
  process.on('SIGINT', async () => {
    await renderer.close();
    process.exit(0);
  });
}

function getLocaleText(
  config: AppframeConfig,
  index: number,
  locale: string,
  field: 'headline' | 'subtitle',
): string | undefined {
  if (locale === 'default' || !config.locales) return undefined;
  return config.locales[locale]?.screens[index]?.[field];
}

async function screenshotToDataUrl(path: string): Promise<string> {
  try {
    const buffer = await readFile(path);
    const ext = path.toLowerCase().endsWith('.jpg') || path.toLowerCase().endsWith('.jpeg') ? 'jpeg' : 'png';
    return `data:image/${ext};base64,${buffer.toString('base64')}`;
  } catch {
    return 'data:image/svg+xml;base64,' + Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800">
        <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea"/><stop offset="100%" style="stop-color:#764ba2"/>
        </linearGradient></defs>
        <rect width="400" height="800" fill="url(#g)"/>
        <text x="200" y="400" text-anchor="middle" fill="white" font-family="sans-serif" font-size="14">Screenshot placeholder</text>
      </svg>`
    ).toString('base64');
  }
}
