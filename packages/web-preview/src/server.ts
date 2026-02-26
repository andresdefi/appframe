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
  FONT_CATALOG,
  COMPOSITION_PRESETS,
} from '@appframe/core';
import type { AppframeConfig, TemplateStyle, LayoutVariant, FrameStyle, CompositionPreset } from '@appframe/core';
import type { TemplateContext, DeviceContext } from '@appframe/core';

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
  app.use(express.json({ limit: '50mb' }));

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
    res.json(['minimal', 'bold', 'glow', 'playful', 'clean', 'branded', 'editorial', 'fullscreen']);
  });

  // API: List available fonts
  app.get('/api/fonts', (_req, res) => {
    res.json(FONT_CATALOG);
  });

  // API: List available compositions
  app.get('/api/compositions', (_req, res) => {
    res.json(Object.values(COMPOSITION_PRESETS));
  });

  // API: Render a single screen preview
  const renderer = new Renderer();
  await renderer.init();

  const templateEngine = new TemplateEngine();

  // Shared: extract preview params from request body and resolve screenshot/headline/subtitle
  interface PreviewParams {
    screenIndex: number;
    locale: string;
    style?: TemplateStyle;
    layout?: LayoutVariant;
    headline?: string;
    subtitle?: string;
    colors?: Record<string, string>;
    font?: string;
    fontWeight?: number;
    frameId?: string;
    fStyle?: FrameStyle;
    width: number;
    height: number;
    deviceTop?: number;
    deviceScale?: number;
    deviceRotation?: number;
    deviceOffsetX?: number;
    deviceAngle?: number;
    deviceTilt?: number;
    headlineTop?: number;
    headlineLeft?: number;
    headlineWidth?: number;
    subtitleTop?: number;
    subtitleLeft?: number;
    subtitleWidth?: number;
    clientScreenshot?: string;
    platform?: string;
    sizeKey?: string;
    composition?: CompositionPreset;
    extraScreenshots?: Array<{ screenshotDataUrl?: string; frameId?: string }>;
  }

  function parseBody(body: Record<string, unknown>, defaultWidth = 400, defaultHeight = 868): PreviewParams {
    return {
      screenIndex: (body.screenIndex as number) ?? 0,
      locale: (body.locale as string) ?? 'default',
      style: body.style as TemplateStyle | undefined,
      layout: body.layout as LayoutVariant | undefined,
      headline: body.headline as string | undefined,
      subtitle: body.subtitle as string | undefined,
      colors: body.colors as Record<string, string> | undefined,
      font: body.font as string | undefined,
      fontWeight: body.fontWeight as number | undefined,
      frameId: body.frameId as string | undefined,
      fStyle: body.frameStyle as FrameStyle | undefined,
      width: (body.width as number) ?? defaultWidth,
      height: (body.height as number) ?? defaultHeight,
      deviceTop: body.deviceTop as number | undefined,
      deviceScale: body.deviceScale as number | undefined,
      deviceRotation: body.deviceRotation as number | undefined,
      deviceOffsetX: body.deviceOffsetX as number | undefined,
      deviceAngle: body.deviceAngle as number | undefined,
      deviceTilt: body.deviceTilt as number | undefined,
      headlineTop: body.headlineTop as number | undefined,
      headlineLeft: body.headlineLeft as number | undefined,
      headlineWidth: body.headlineWidth as number | undefined,
      subtitleTop: body.subtitleTop as number | undefined,
      subtitleLeft: body.subtitleLeft as number | undefined,
      subtitleWidth: body.subtitleWidth as number | undefined,
      clientScreenshot: body.screenshotDataUrl as string | undefined,
      platform: body.platform as string | undefined,
      sizeKey: body.sizeKey as string | undefined,
      composition: body.composition as CompositionPreset | undefined,
      extraScreenshots: body.extraScreenshots as Array<{ screenshotDataUrl?: string; frameId?: string }> | undefined,
    };
  }

  async function resolveContext(p: PreviewParams): Promise<{ context: TemplateContext; html?: undefined } | { context: TemplateContext }> {
    const screen = config.screens[p.screenIndex] ?? null;

    const resolvedHeadline = p.headline ?? getLocaleText(config, p.screenIndex, p.locale, 'headline') ?? screen?.headline ?? 'New Screen';
    const resolvedSubtitle = p.subtitle ?? getLocaleText(config, p.screenIndex, p.locale, 'subtitle') ?? screen?.subtitle;

    let screenshotDataUrl: string;
    if (p.clientScreenshot) {
      screenshotDataUrl = p.clientScreenshot;
    } else {
      const screenshotPath = screen ? join(configDir, screen.screenshot) : '';
      screenshotDataUrl = await screenshotToDataUrl(screenshotPath);
    }

    const frame = p.frameId
      ? await getFrame(p.frameId)
      : await getDefaultFrame((p.platform as 'ios' | 'android') ?? 'ios');
    let frameSvg: string | null = null;
    if (frame && (p.fStyle ?? config.frames.style) !== 'none') {
      frameSvg = await readFile(frame.framePath, 'utf-8');
    }

    const context: TemplateContext = {
      headline: resolvedHeadline,
      subtitle: resolvedSubtitle,
      screenshotDataUrl,
      style: p.style ?? config.theme.style,
      colors: p.colors ? { ...config.theme.colors, ...p.colors } : config.theme.colors,
      font: p.font ?? config.theme.font,
      fontWeight: p.fontWeight ?? config.theme.fontWeight,
      layout: p.layout ?? screen?.layout ?? 'center',
      frame: frame ?? null,
      frameStyle: p.fStyle ?? config.frames.style,
      frameSvg,
      canvasWidth: p.width,
      canvasHeight: p.height,
      deviceTop: p.deviceTop,
      deviceScale: p.deviceScale,
      deviceRotation: p.deviceRotation,
      deviceOffsetX: p.deviceOffsetX,
      deviceAngle: p.deviceAngle,
      deviceTilt: p.deviceTilt,
    };

    // Apply composition preset
    const compositionId = p.composition ?? 'single';
    const preset = COMPOSITION_PRESETS[compositionId];

    if (compositionId !== 'single' && preset && preset.deviceCount === 1) {
      // Single-device composition (edge bleed presets like peek-right, tilt-left)
      // Apply the preset's positioning to the single-device context
      const slot = preset.slots[0]!;
      context.deviceOffsetX = slot.offsetX;
      context.deviceTop = slot.offsetY;
      context.deviceScale = slot.scale;
      context.deviceRotation = slot.rotation;
      context.deviceAngle = slot.angle;
      context.deviceTilt = slot.tilt;
    } else if (compositionId !== 'single' && preset && preset.deviceCount > 1) {
      const devices: DeviceContext[] = [];

      for (let i = 0; i < preset.deviceCount; i++) {
        const slot = preset.slots[i]!;
        let slotScreenshotDataUrl: string;
        let slotFrame = frame ?? null;
        let slotFrameSvg = frameSvg;

        if (i === 0) {
          slotScreenshotDataUrl = screenshotDataUrl;
        } else {
          const extra = p.extraScreenshots?.[i - 1];
          if (extra?.screenshotDataUrl) {
            slotScreenshotDataUrl = extra.screenshotDataUrl;
          } else {
            slotScreenshotDataUrl = screenshotDataUrl;
          }
          if (extra?.frameId) {
            const extraFrame = await getFrame(extra.frameId);
            if (extraFrame) {
              slotFrame = extraFrame;
              slotFrameSvg = (p.fStyle ?? config.frames.style) !== 'none'
                ? await readFile(extraFrame.framePath, 'utf-8')
                : null;
            }
          }
        }

        devices.push({
          screenshotDataUrl: slotScreenshotDataUrl,
          frame: slotFrame,
          frameSvg: slotFrameSvg,
          offsetX: slot.offsetX,
          offsetY: slot.offsetY,
          scale: slot.scale,
          rotation: slot.rotation,
          angle: slot.angle,
          tilt: slot.tilt,
          zIndex: slot.zIndex,
        });
      }

      context.composition = compositionId;
      context.devices = devices;
    }

    return { context };
  }

  // API: Render HTML only (no Playwright screenshot — used by iframe preview)
  app.post('/api/preview-html', async (req, res) => {
    try {
      const p = parseBody(req.body as Record<string, unknown>);
      const { context } = await resolveContext(p);

      let html = await templateEngine.render(context);
      html = injectTextPositionCSS(html, p.headlineTop, p.headlineLeft, p.headlineWidth, p.subtitleTop, p.subtitleLeft, p.subtitleWidth);
      res.set('Content-Type', 'text/html');
      res.send(html);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/preview', async (req, res) => {
    try {
      const p = parseBody(req.body as Record<string, unknown>);
      const { context } = await resolveContext(p);

      let html = await templateEngine.render(context);
      html = injectTextPositionCSS(html, p.headlineTop, p.headlineLeft, p.headlineWidth, p.subtitleTop, p.subtitleLeft, p.subtitleWidth);

      const tmpPath = join(configDir, `.appframe-preview-${Date.now()}.png`);
      await renderer.render({
        html,
        width: p.width,
        height: p.height,
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
      const p = parseBody(req.body as Record<string, unknown>);
      const sizeKey = p.sizeKey ?? 'ios-6.7';

      const { STORE_SIZES } = await import('@appframe/core');
      const sizeSpec = STORE_SIZES[sizeKey];
      if (!sizeSpec) {
        res.status(400).json({ error: `Unknown size: ${sizeKey}` });
        return;
      }

      // Override width/height with the export size
      p.width = sizeSpec.width;
      p.height = sizeSpec.height;

      const { context } = await resolveContext(p);

      let html = await templateEngine.render(context);
      html = injectTextPositionCSS(html, p.headlineTop, p.headlineLeft, p.headlineWidth, p.subtitleTop, p.subtitleLeft, p.subtitleWidth);

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

      const filename = `${config.app.name.replace(/[^a-zA-Z0-9]/g, '_')}_screen_${p.screenIndex + 1}_${sizeKey}.png`;
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

function injectTextPositionCSS(
  html: string,
  headlineTop?: number,
  headlineLeft?: number,
  headlineWidth?: number,
  subtitleTop?: number,
  subtitleLeft?: number,
  subtitleWidth?: number,
): string {
  const rules: string[] = [];
  if (headlineTop !== undefined && headlineLeft !== undefined) {
    const w = headlineWidth !== undefined ? `width: ${headlineWidth}% !important;` : '';
    rules.push(`.headline { position: fixed !important; top: ${headlineTop}% !important; left: ${headlineLeft}% !important; transform: translateX(-50%) !important; z-index: 10 !important; margin: 0 !important; ${w} }`);
  }
  if (subtitleTop !== undefined && subtitleLeft !== undefined) {
    const w = subtitleWidth !== undefined ? `width: ${subtitleWidth}% !important;` : '';
    rules.push(`.subtitle { position: fixed !important; top: ${subtitleTop}% !important; left: ${subtitleLeft}% !important; transform: translateX(-50%) !important; z-index: 10 !important; margin: 0 !important; ${w} }`);
  }
  if (rules.length === 0) return html;
  return html.replace('</head>', `<style>${rules.join('\n')}</style>\n</head>`);
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
