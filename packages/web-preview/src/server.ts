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
  STORE_SIZES,
  getKoubouDeviceFamilies,
  getKoubouDeviceFamily,
  getKoubouDeviceId,
  getKoubouFramePath,
  injectSpotlightHTML,
  injectAnnotationsHTML,
  injectZoomCalloutsHTML,
  detectKoubou,
  renderSingleScreenWithKoubou,
} from '@appframe/core';
import type { AppframeConfig, TemplateStyle, LayoutVariant, FrameStyle, CompositionPreset, FrameDefinition, KoubouSingleScreenOptions } from '@appframe/core';
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

  // Serve static frontend (no-cache for development)
  const publicDir = join(__dirname, '..', 'public');
  app.use(express.static(publicDir, { etag: false, lastModified: false }));
  app.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });

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

  // API: List store sizes grouped by platform category
  app.get('/api/sizes', (_req, res) => {
    const grouped: Record<string, Array<{ key: string; name: string; width: number; height: number }>> = {};
    const categoryMap: Record<string, string> = {
      ios: 'iphone', mac: 'mac', watch: 'watch', android: 'android',
    };
    for (const [key, size] of Object.entries(STORE_SIZES)) {
      let category = categoryMap[size.platform] ?? size.platform;
      // Split iOS into iphone and ipad
      if (size.platform === 'ios' && key.includes('ipad')) category = 'ipad';
      const list = grouped[category] ?? [];
      list.push({ key, name: size.name, width: size.width * 2, height: size.height * 2 });
      grouped[category] = list;
    }
    res.json(grouped);
  });

  // API: List Koubou device catalog (grouped by category)
  app.get('/api/koubou-devices', (_req, res) => {
    const families = getKoubouDeviceFamilies();
    const grouped: Record<string, typeof families> = {};
    for (const family of families) {
      const list = grouped[family.category] ?? [];
      list.push(family);
      grouped[family.category] = list;
    }
    res.json({ families, grouped });
  });

  // API: Serve Koubou device frame PNG
  app.get('/api/koubou-frame/:familyId', async (req, res) => {
    try {
      const { familyId } = req.params;
      const color = req.query.color as string | undefined;
      const family = getKoubouDeviceFamily(familyId);
      if (!family) {
        res.status(404).json({ error: `Unknown device family: ${familyId}` });
        return;
      }

      const koubouId = getKoubouDeviceId(familyId, color || undefined);
      if (!koubouId) {
        res.status(404).json({ error: `No Koubou device ID for family: ${familyId}` });
        return;
      }

      const pngPath = await getKoubouFramePath(koubouId);
      if (!pngPath) {
        res.status(404).json({ error: 'Koubou frame not found. Is Koubou installed?' });
        return;
      }

      const pngBuffer = await readFile(pngPath);
      res.set('Content-Type', 'image/png');
      res.set('Cache-Control', 'public, max-age=3600');
      res.send(pngBuffer);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  // API: Koubou availability status (cached)
  let koubouStatusCache: { available: boolean; version: string | null } | null = null;

  app.get('/api/koubou-status', async (_req, res) => {
    try {
      if (!koubouStatusCache) {
        const detection = await detectKoubou();
        koubouStatusCache = { available: detection.available, version: detection.version };
      }
      res.json(koubouStatusCache);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
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
    headlineSize?: number;
    subtitleSize?: number;
    headlineRotation?: number;
    subtitleRotation?: number;
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
    headlineGradient?: { colors: string[]; direction: number };
    subtitleGradient?: { colors: string[]; direction: number };
    autoSizeHeadline?: boolean;
    autoSizeSubtitle?: boolean;
    spotlight?: { x: number; y: number; w: number; h: number; shape: 'circle' | 'rectangle'; dimOpacity: number; blur: number };
    annotations?: Array<{ id: string; shape: string; x: number; y: number; w: number; h: number; strokeColor: string; strokeWidth: number; fillColor?: string }>;
    zoomCallouts?: Array<{ id: string; sourceX: number; sourceY: number; sourceW: number; sourceH: number; targetX: number; targetY: number; magnification: number; connectorStyle: string; borderColor: string; borderWidth: number; shadow: boolean }>;
    renderer?: 'playwright' | 'koubou';
    koubouColor?: string;
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
      headlineSize: body.headlineSize as number | undefined,
      subtitleSize: body.subtitleSize as number | undefined,
      headlineRotation: body.headlineRotation as number | undefined,
      subtitleRotation: body.subtitleRotation as number | undefined,
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
      headlineGradient: body.headlineGradient as { colors: string[]; direction: number } | undefined,
      subtitleGradient: body.subtitleGradient as { colors: string[]; direction: number } | undefined,
      autoSizeHeadline: body.autoSizeHeadline as boolean | undefined,
      autoSizeSubtitle: body.autoSizeSubtitle as boolean | undefined,
      spotlight: body.spotlight as PreviewParams['spotlight'] | undefined,
      annotations: body.annotations as PreviewParams['annotations'] | undefined,
      zoomCallouts: body.zoomCallouts as PreviewParams['zoomCallouts'] | undefined,
      renderer: body.renderer as 'playwright' | 'koubou' | undefined,
      koubouColor: body.koubouColor as string | undefined,
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

    let frame = p.frameId
      ? await getFrame(p.frameId)
      : await getDefaultFrame((p.platform as 'ios' | 'android') ?? 'ios');
    let frameSvg: string | null = null;
    let framePngUrl: string | undefined;

    if (frame && (p.fStyle ?? config.frames.style) !== 'none') {
      frameSvg = await readFile(frame.framePath, 'utf-8');
    } else if (!frame && p.frameId) {
      // Check if this is a Koubou device family with PNG frame data
      const koubouFamily = getKoubouDeviceFamily(p.frameId);
      if (koubouFamily?.screenOffset && koubouFamily.framePngSize) {
        const koubouId = getKoubouDeviceId(koubouFamily.id);
        const pngExists = koubouId ? await getKoubouFramePath(koubouId) : null;
        if (pngExists) {
          const pngBuffer = await readFile(pngExists);
          framePngUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;
          const screenWidth = koubouFamily.framePngSize.width - 2 * koubouFamily.screenOffset.x;
          const aspectRatio = koubouFamily.screenResolution.height / koubouFamily.screenResolution.width;
          const screenHeight = Math.round(screenWidth * aspectRatio);
          frame = {
            id: koubouFamily.id,
            name: koubouFamily.name,
            manufacturer: 'Apple',
            year: koubouFamily.year,
            platform: 'ios' as const,
            framePath: '',
            screenArea: {
              x: koubouFamily.screenOffset.x,
              y: koubouFamily.screenOffset.y,
              width: screenWidth,
              height: screenHeight,
              borderRadius: koubouFamily.screenBorderRadius ?? 0,
            },
            frameSize: {
              width: koubouFamily.framePngSize.width,
              height: koubouFamily.framePngSize.height,
            },
            screenResolution: koubouFamily.screenResolution,
            tags: [koubouFamily.category],
          } satisfies FrameDefinition;
        }
      }
    }

    const context: TemplateContext = {
      headline: resolvedHeadline,
      subtitle: resolvedSubtitle,
      screenshotDataUrl,
      style: p.style ?? config.theme.style,
      colors: p.colors ? { ...config.theme.colors, ...p.colors } : config.theme.colors,
      font: p.font ?? config.theme.font,
      fontWeight: p.fontWeight ?? config.theme.fontWeight,
      headlineSize: p.headlineSize ?? config.theme.headlineSize,
      subtitleSize: p.subtitleSize ?? config.theme.subtitleSize,
      headlineRotation: p.headlineRotation,
      subtitleRotation: p.subtitleRotation,
      layout: p.layout ?? screen?.layout ?? 'center',
      frame: frame ?? null,
      frameStyle: p.fStyle ?? config.frames.style,
      frameSvg,
      framePngUrl,
      canvasWidth: p.width,
      canvasHeight: p.height,
      deviceTop: p.deviceTop,
      deviceScale: p.deviceScale,
      deviceRotation: p.deviceRotation,
      deviceOffsetX: p.deviceOffsetX,
      deviceAngle: p.deviceAngle,
      deviceTilt: p.deviceTilt,
      headlineGradient: p.headlineGradient ?? config.theme.headlineGradient,
      subtitleGradient: p.subtitleGradient ?? config.theme.subtitleGradient,
      autoSizeHeadline: p.autoSizeHeadline,
      autoSizeSubtitle: p.autoSizeSubtitle,
      spotlight: p.spotlight,
      annotations: p.annotations,
      zoomCallouts: p.zoomCallouts,
    };

    // Apply composition preset
    const compositionId = p.composition ?? 'single';
    const preset = COMPOSITION_PRESETS[compositionId];

    if (compositionId !== 'single' && preset && preset.deviceCount === 1) {
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
        let slotFramePngUrl = framePngUrl;

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
              slotFramePngUrl = undefined;
            } else {
              const extraKoubou = getKoubouDeviceFamily(extra.frameId);
              if (extraKoubou?.screenOffset && extraKoubou.framePngSize) {
                const extraKoubouId = getKoubouDeviceId(extraKoubou.id);
                const extraPngExists = extraKoubouId ? await getKoubouFramePath(extraKoubouId) : null;
                if (extraPngExists) {
                  const extraPngBuffer = await readFile(extraPngExists);
                  slotFramePngUrl = `data:image/png;base64,${extraPngBuffer.toString('base64')}`;
                  const sw = extraKoubou.framePngSize.width - 2 * extraKoubou.screenOffset.x;
                  const ar = extraKoubou.screenResolution.height / extraKoubou.screenResolution.width;
                  slotFrame = {
                    id: extraKoubou.id,
                    name: extraKoubou.name,
                    manufacturer: 'Apple',
                    year: extraKoubou.year,
                    platform: 'ios' as const,
                    framePath: '',
                    screenArea: { x: extraKoubou.screenOffset.x, y: extraKoubou.screenOffset.y, width: sw, height: Math.round(sw * ar), borderRadius: extraKoubou.screenBorderRadius ?? 0 },
                    frameSize: { width: extraKoubou.framePngSize.width, height: extraKoubou.framePngSize.height },
                    screenResolution: extraKoubou.screenResolution,
                    tags: [extraKoubou.category],
                  } satisfies FrameDefinition;
                  slotFrameSvg = null;
                }
              }
            }
          }
        }

        devices.push({
          screenshotDataUrl: slotScreenshotDataUrl,
          frame: slotFrame,
          frameSvg: slotFrameSvg,
          framePngUrl: slotFramePngUrl,
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
      if (p.spotlight) html = injectSpotlightHTML(html, p.spotlight);
      if (p.annotations && p.annotations.length > 0) html = injectAnnotationsHTML(html, p.annotations, p.width);
      if (p.zoomCallouts && p.zoomCallouts.length > 0) html = injectZoomCalloutsHTML(html, p.zoomCallouts, context.screenshotDataUrl, p.width);
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
      if (p.spotlight) html = injectSpotlightHTML(html, p.spotlight);
      if (p.annotations && p.annotations.length > 0) html = injectAnnotationsHTML(html, p.annotations, p.width);
      if (p.zoomCallouts && p.zoomCallouts.length > 0) html = injectZoomCalloutsHTML(html, p.zoomCallouts, context.screenshotDataUrl, p.width);

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

  // Map STORE_SIZES keys to Koubou output_size values (iOS only)
  function sizeKeyToKoubouOutput(sizeKey: string): string | null {
    const map: Record<string, string> = {
      'ios-6.7': 'iPhone6_7',
      'ios-6.5': 'iPhone6_5',
      'ios-5.5': 'iPhone5_5',
      'ios-ipad-12.9': 'iPadPro12_9',
      'ios-ipad-11': 'iPadPro11',
      'mac-2880x1800': 'MacBookPro14',
      'mac-2560x1600': 'MacBookAir',
      'mac-1440x900': 'MacBookAir',
      'mac-1280x800': 'MacBookAir',
      'watch-ultra3': 'WatchUltra',
      'watch-ultra': 'WatchUltra',
      'watch-s10': 'WatchS7_45',
      'watch-s7': 'WatchS7_45',
      'watch-s4': 'WatchS4_44',
      'watch-s3': 'WatchS4_40',
    };
    return map[sizeKey] ?? null;
  }

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

      if (p.renderer === 'koubou') {
        // --- Koubou rendering path ---
        const koubouOutputSize = sizeKeyToKoubouOutput(sizeKey);
        if (!koubouOutputSize) {
          res.status(400).json({ error: `Koubou does not support size: ${sizeKey}. Use Playwright for Android sizes.` });
          return;
        }

        const screen = config.screens[p.screenIndex] ?? null;
        let screenshotData = p.clientScreenshot;
        if (!screenshotData && screen) {
          const screenshotPath = join(configDir, screen.screenshot);
          screenshotData = await screenshotToDataUrl(screenshotPath);
        }
        if (!screenshotData) {
          res.status(400).json({ error: 'No screenshot data available' });
          return;
        }

        const resolvedHeadline = p.headline
          ?? getLocaleText(config, p.screenIndex, p.locale, 'headline')
          ?? screen?.headline
          ?? 'New Screen';
        const resolvedSubtitle = p.subtitle
          ?? getLocaleText(config, p.screenIndex, p.locale, 'subtitle')
          ?? screen?.subtitle;

        const imageBuffer = await renderSingleScreenWithKoubou({
          screenshotData,
          headline: resolvedHeadline,
          subtitle: resolvedSubtitle,
          style: (p.style ?? config.theme.style),
          colors: p.colors ? { ...config.theme.colors, ...p.colors } : config.theme.colors,
          font: p.font ?? config.theme.font,
          fontWeight: p.fontWeight ?? config.theme.fontWeight,
          headlineSize: p.headlineSize ?? config.theme.headlineSize,
          subtitleSize: p.subtitleSize ?? config.theme.subtitleSize,
          layout: (p.layout ?? screen?.layout ?? 'center'),
          frameId: p.frameId ?? config.frames.ios,
          frameStyle: (p.fStyle ?? config.frames.style),
          koubouColor: p.koubouColor ?? config.frames.koubouColor,
          outputSize: koubouOutputSize,
          headlineGradient: p.headlineGradient ?? config.theme.headlineGradient,
          subtitleGradient: p.subtitleGradient ?? config.theme.subtitleGradient,
          spotlight: p.spotlight,
          annotations: p.annotations as KoubouSingleScreenOptions['annotations'],
          zoomCallouts: p.zoomCallouts as KoubouSingleScreenOptions['zoomCallouts'],
        });

        const filename = `${config.app.name.replace(/[^a-zA-Z0-9]/g, '_')}_screen_${p.screenIndex + 1}_${sizeKey}_koubou.png`;
        res.set('Content-Type', 'image/png');
        res.set('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(imageBuffer);
      } else {
        // --- Playwright rendering path (default) ---
        p.width = sizeSpec.width;
        p.height = sizeSpec.height;

        const { context } = await resolveContext(p);

        let html = await templateEngine.render(context);
        html = injectTextPositionCSS(html, p.headlineTop, p.headlineLeft, p.headlineWidth, p.subtitleTop, p.subtitleLeft, p.subtitleWidth);
        if (p.spotlight) html = injectSpotlightHTML(html, p.spotlight);
        if (p.annotations && p.annotations.length > 0) html = injectAnnotationsHTML(html, p.annotations, p.width);
        if (p.zoomCallouts && p.zoomCallouts.length > 0) html = injectZoomCalloutsHTML(html, p.zoomCallouts, context.screenshotDataUrl, p.width);

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
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  // API: Reload config
  app.post('/api/reload', async (_req, res) => {
    try {
      config = await loadConfig(resolvedConfigPath);
      koubouStatusCache = null;
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
    const w = headlineWidth !== undefined ? `width: ${headlineWidth}%;` : '';
    rules.push(`.headline { position: fixed; top: ${headlineTop}%; left: ${headlineLeft}%; transform: translateX(-50%); z-index: 10; margin: 0; ${w} }`);
  }
  if (subtitleTop !== undefined && subtitleLeft !== undefined) {
    const w = subtitleWidth !== undefined ? `width: ${subtitleWidth}%;` : '';
    rules.push(`.subtitle { position: fixed; top: ${subtitleTop}%; left: ${subtitleLeft}%; transform: translateX(-50%); z-index: 10; margin: 0; ${w} }`);
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
