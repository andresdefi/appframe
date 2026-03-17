import express from 'express';
import cors from 'cors';
import { join, dirname, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { startHttpServer } from 'agentation-mcp';
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
  getDeviceFamilies,
  getDeviceFamily,
  getDeviceId,
  getDeviceFramePath,
  injectSpotlightHTML,
  injectAnnotationsHTML,
  injectOverlaysHTML,
  detectKoubou,
  renderSingleScreenWithKoubou,
} from '@appframe/core';
import type { AppframeConfig, TemplateStyle, LayoutVariant, FrameStyle, CompositionPreset, FrameDefinition, KoubouSingleScreenOptions, PanoramicElement, PanoramicBackground, Loupe } from '@appframe/core';
import type { TemplateContext, DeviceContext, PanoramicTemplateContext, PanoramicRenderedElement } from '@appframe/core';

const __dirname = dirname(fileURLToPath(import.meta.url));

const AGENTATION_PORT = 4747;

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
  app.use(express.urlencoded({ extended: false, limit: '50mb' }));

  // Serve React build (client-dist/) if available, fall back to legacy (public/)
  const clientDistDir = join(__dirname, '..', 'client-dist');
  const publicDir = join(__dirname, '..', 'public');
  app.use(express.static(clientDistDir, { etag: false, lastModified: false }));
  // Legacy UI accessible at /legacy/ during migration
  app.use('/legacy', express.static(publicDir, { etag: false, lastModified: false }));
  app.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });

  // API: Health check
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

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
    const families = getDeviceFamilies();
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
      const family = getDeviceFamily(familyId);
      if (!family) {
        res.status(404).json({ error: `Unknown device family: ${familyId}` });
        return;
      }

      const koubouId = getDeviceId(familyId, color || undefined);
      if (!koubouId) {
        res.status(404).json({ error: `No Koubou device ID for family: ${familyId}` });
        return;
      }

      const pngPath = await getDeviceFramePath(koubouId);
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

  // API: Koubou availability status (cached with 5-minute TTL)
  const KOUBOU_CACHE_TTL = 300_000; // 5 minutes
  let koubouStatusCache: { available: boolean; version: string | null; timestamp: number } | null = null;

  app.get('/api/koubou-status', async (_req, res) => {
    try {
      const now = Date.now();
      if (!koubouStatusCache || (now - koubouStatusCache.timestamp) > KOUBOU_CACHE_TTL) {
        const detection = await detectKoubou();
        koubouStatusCache = { available: detection.available, version: detection.version, timestamp: now };
      }
      res.json({ available: koubouStatusCache.available, version: koubouStatusCache.version });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  // API: Render a single screen preview
  const renderer = new Renderer();
  await renderer.init();

  const templateEngine = new TemplateEngine();

  type KoubouFamily = NonNullable<ReturnType<typeof getDeviceFamily>>;

  type KoubouPreviewAdjustment = {
    bleedLeft: number;
    bleedTop: number;
    bleedRight: number;
    bleedBottom: number;
    radiusBleed: number;
  };

  const KoubouPreviewAdjustments: Record<string, KoubouPreviewAdjustment> = {
    'ipad-pro-11-m4': { bleedLeft: 20, bleedTop: 20, bleedRight: 20, bleedBottom: 20, radiusBleed: 36 },
    'ipad-pro-13-m4': { bleedLeft: 20, bleedTop: 20, bleedRight: 20, bleedBottom: 20, radiusBleed: 36 },
    'macbook-air-2020': { bleedLeft: 4, bleedTop: 4, bleedRight: 4, bleedBottom: 12, radiusBleed: -18 },
    'macbook-air-2022': { bleedLeft: 6, bleedTop: 6, bleedRight: 6, bleedBottom: 6, radiusBleed: -57 },
    'macbook-pro-2021-14': { bleedLeft: 6, bleedTop: 6, bleedRight: 6, bleedBottom: 6, radiusBleed: -47 },
    'macbook-pro-2021-16': { bleedLeft: 6, bleedTop: 6, bleedRight: 6, bleedBottom: 6, radiusBleed: -46 },
    'watch-ultra': { bleedLeft: 8, bleedTop: 8, bleedRight: 8, bleedBottom: 8, radiusBleed: -44 },
    'watch-series-7-45': { bleedLeft: 8, bleedTop: 20, bleedRight: 8, bleedBottom: 8, radiusBleed: 0 },
    'watch-series-4-44': { bleedLeft: 8, bleedTop: 8, bleedRight: 8, bleedBottom: 8, radiusBleed: -18 },
    'watch-series-4-40': { bleedLeft: 8, bleedTop: 8, bleedRight: 8, bleedBottom: 8, radiusBleed: -18 },
  };

  function getKoubouPreviewAdjustment(
    family: KoubouFamily,
  ): KoubouPreviewAdjustment {
    const explicit = KoubouPreviewAdjustments[family.id];
    if (explicit) return explicit;

    switch (family.category) {
      case 'watch':
        return { bleedLeft: 8, bleedTop: 8, bleedRight: 8, bleedBottom: 8, radiusBleed: 0 };
      case 'mac':
        return { bleedLeft: 6, bleedTop: 6, bleedRight: 6, bleedBottom: 6, radiusBleed: 0 };
      case 'ipad':
        return { bleedLeft: 18, bleedTop: 18, bleedRight: 18, bleedBottom: 18, radiusBleed: 32 };
      case 'iphone':
        return { bleedLeft: 0, bleedTop: 0, bleedRight: 0, bleedBottom: 0, radiusBleed: 0 };
      default:
        return { bleedLeft: 12, bleedTop: 12, bleedRight: 12, bleedBottom: 12, radiusBleed: 24 };
    }
  }

  function buildKoubouPreviewFrame(family: KoubouFamily): FrameDefinition {
    const { bleedLeft, bleedTop, bleedRight, bleedBottom, radiusBleed } = getKoubouPreviewAdjustment(family);
    const left = Math.max(0, family.screenRect!.x - bleedLeft);
    const top = Math.max(0, family.screenRect!.y - bleedTop);
    const right = Math.min(
      family.framePngSize!.width,
      family.screenRect!.x + family.screenRect!.width + bleedRight,
    );
    const bottom = Math.min(
      family.framePngSize!.height,
      family.screenRect!.y + family.screenRect!.height + bleedBottom,
    );

    return {
      id: family.id,
      name: family.name,
      manufacturer: 'Apple',
      year: family.year,
      platform: 'ios',
      framePath: '',
      screenArea: {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
        borderRadius: Math.max(
          0,
          Math.min(
            Math.floor(Math.min(right - left, bottom - top) / 2),
            (family.screenBorderRadius ?? 0) + radiusBleed,
          ),
        ),
      },
      frameSize: {
        width: family.framePngSize!.width,
        height: family.framePngSize!.height,
      },
      screenResolution: family.screenResolution,
      tags: [family.category],
    } satisfies FrameDefinition;
  }

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
    headlineLineHeight?: number;
    headlineLetterSpacing?: string;
    headlineTextTransform?: string;
    headlineFontStyle?: string;
    subtitleOpacity?: number;
    subtitleLetterSpacing?: string;
    subtitleTextTransform?: string;
    renderer?: 'playwright' | 'koubou';
    deviceColor?: string;
    // Background overrides
    backgroundType?: 'preset' | 'solid' | 'gradient' | 'image';
    backgroundColor?: string;
    backgroundGradient?: { type: 'linear' | 'radial'; colors: string[]; direction: number; radialPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right' };
    backgroundImageDataUrl?: string;
    backgroundOverlay?: { color: string; opacity: number };
    // Device enhancements
    deviceShadow?: { opacity: number; blur: number; color: string; offsetY: number };
    borderSimulation?: { enabled: boolean; thickness: number; color: string; radius: number };
    cornerRadius?: number;
    // Effects
    loupe?: Loupe;
    callouts?: Array<{ id: string; sourceX: number; sourceY: number; sourceW: number; sourceH: number; displayX: number; displayY: number; displayScale: number; rotation: number; borderRadius: number; shadow: boolean; borderWidth: number; borderColor?: string }>;
    overlays?: Array<{ id: string; type: 'icon' | 'badge' | 'star-rating' | 'custom' | 'shape'; imageDataUrl?: string; x: number; y: number; size: number; rotation: number; opacity: number; shapeType?: 'circle' | 'rectangle' | 'line'; shapeColor?: string; shapeOpacity?: number; shapeBlur?: number }>;
  }

  // Input validation helpers
  function expectNumber(v: unknown): number | undefined {
    if (v === undefined || v === null) return undefined;
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    return undefined;
  }
  function expectString(v: unknown): string | undefined {
    if (v === undefined || v === null) return undefined;
    if (typeof v === 'string') return v;
    return undefined;
  }
  function expectBoolean(v: unknown): boolean | undefined {
    if (v === undefined || v === null) return undefined;
    if (typeof v === 'boolean') return v;
    return undefined;
  }
  function expectObject(v: unknown): Record<string, unknown> | undefined {
    if (v === undefined || v === null) return undefined;
    if (typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>;
    return undefined;
  }
  function expectArray(v: unknown): unknown[] | undefined {
    if (v === undefined || v === null) return undefined;
    if (Array.isArray(v)) return v;
    return undefined;
  }

  function parseBody(body: Record<string, unknown>, defaultWidth = 400, defaultHeight = 868): PreviewParams {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new Error('Request body must be a JSON object');
    }

    const width = expectNumber(body.width) ?? defaultWidth;
    const height = expectNumber(body.height) ?? defaultHeight;
    const screenIndex = expectNumber(body.screenIndex) ?? 0;

    if (!Number.isInteger(screenIndex) || screenIndex < 0) {
      throw new Error('screenIndex must be a non-negative integer');
    }
    if (width <= 0 || height <= 0) {
      throw new Error('width and height must be positive numbers');
    }

    return {
      screenIndex,
      locale: expectString(body.locale) ?? 'default',
      style: expectString(body.style) as TemplateStyle | undefined,
      layout: expectString(body.layout) as LayoutVariant | undefined,
      headline: expectString(body.headline),
      subtitle: expectString(body.subtitle),
      colors: expectObject(body.colors) as Record<string, string> | undefined,
      font: expectString(body.font),
      fontWeight: expectNumber(body.fontWeight),
      headlineSize: expectNumber(body.headlineSize),
      subtitleSize: expectNumber(body.subtitleSize),
      headlineRotation: expectNumber(body.headlineRotation),
      subtitleRotation: expectNumber(body.subtitleRotation),
      frameId: expectString(body.frameId),
      fStyle: expectString(body.frameStyle) as FrameStyle | undefined,
      width,
      height,
      deviceTop: expectNumber(body.deviceTop),
      deviceScale: expectNumber(body.deviceScale),
      deviceRotation: expectNumber(body.deviceRotation),
      deviceOffsetX: expectNumber(body.deviceOffsetX),
      deviceAngle: expectNumber(body.deviceAngle),
      deviceTilt: expectNumber(body.deviceTilt),
      headlineTop: expectNumber(body.headlineTop),
      headlineLeft: expectNumber(body.headlineLeft),
      headlineWidth: expectNumber(body.headlineWidth),
      subtitleTop: expectNumber(body.subtitleTop),
      subtitleLeft: expectNumber(body.subtitleLeft),
      subtitleWidth: expectNumber(body.subtitleWidth),
      clientScreenshot: expectString(body.screenshotDataUrl),
      platform: expectString(body.platform),
      sizeKey: expectString(body.sizeKey),
      composition: expectString(body.composition) as CompositionPreset | undefined,
      extraScreenshots: expectArray(body.extraScreenshots) as Array<{ screenshotDataUrl?: string; frameId?: string }> | undefined,
      headlineGradient: expectObject(body.headlineGradient) as { colors: string[]; direction: number } | undefined,
      subtitleGradient: expectObject(body.subtitleGradient) as { colors: string[]; direction: number } | undefined,
      autoSizeHeadline: expectBoolean(body.autoSizeHeadline),
      autoSizeSubtitle: expectBoolean(body.autoSizeSubtitle),
      spotlight: expectObject(body.spotlight) as PreviewParams['spotlight'] | undefined,
      annotations: expectArray(body.annotations) as PreviewParams['annotations'] | undefined,
      headlineLineHeight: expectNumber(body.headlineLineHeight),
      headlineLetterSpacing: expectString(body.headlineLetterSpacing),
      headlineTextTransform: expectString(body.headlineTextTransform),
      headlineFontStyle: expectString(body.headlineFontStyle),
      subtitleOpacity: expectNumber(body.subtitleOpacity),
      subtitleLetterSpacing: expectString(body.subtitleLetterSpacing),
      subtitleTextTransform: expectString(body.subtitleTextTransform),
      renderer: expectString(body.renderer) as 'playwright' | 'koubou' | undefined,
      deviceColor: expectString(body.deviceColor),
      // Background overrides
      backgroundType: expectString(body.backgroundType) as PreviewParams['backgroundType'],
      backgroundColor: expectString(body.backgroundColor),
      backgroundGradient: expectObject(body.backgroundGradient) as PreviewParams['backgroundGradient'],
      backgroundImageDataUrl: expectString(body.backgroundImageDataUrl),
      backgroundOverlay: expectObject(body.backgroundOverlay) as PreviewParams['backgroundOverlay'],
      // Device enhancements
      deviceShadow: expectObject(body.deviceShadow) as PreviewParams['deviceShadow'],
      borderSimulation: expectObject(body.borderSimulation) as PreviewParams['borderSimulation'],
      cornerRadius: expectNumber(body.cornerRadius),
      // Effects
      loupe: expectObject(body.loupe) as PreviewParams['loupe'],
      callouts: expectArray(body.callouts) as PreviewParams['callouts'],
      overlays: expectArray(body.overlays) as PreviewParams['overlays'],
    };
  }

  function clampPreviewParams(p: PreviewParams): PreviewParams {
    const clamp = (v: number | undefined, min: number, max: number) =>
      v === undefined ? undefined : Math.max(min, Math.min(max, v));
    p.width = Math.max(100, Math.min(10000, p.width));
    p.height = Math.max(100, Math.min(10000, p.height));
    p.deviceScale = clamp(p.deviceScale, 0, 200);
    p.deviceRotation = clamp(p.deviceRotation, -360, 360);
    p.headlineSize = clamp(p.headlineSize, 0, 500);
    p.subtitleSize = clamp(p.subtitleSize, 0, 500);
    return p;
  }

  async function resolveContext(p: PreviewParams): Promise<{ context: TemplateContext; html?: undefined } | { context: TemplateContext }> {
    const screen = config.screens[p.screenIndex] ?? null;

    const resolvedHeadline = p.headline ?? getLocaleText(config, p.screenIndex, p.locale, 'headline') ?? screen?.headline ?? 'New Screen';
    const resolvedSubtitle = p.subtitle ?? getLocaleText(config, p.screenIndex, p.locale, 'subtitle') ?? screen?.subtitle;

    let screenshotDataUrl: string;
    if (p.clientScreenshot) {
      screenshotDataUrl = p.clientScreenshot;
    } else {
      const screenshotPath = screen ? resolve(configDir, screen.screenshot) : '';
      if (screenshotPath && !screenshotPath.startsWith(resolve(configDir))) {
        screenshotDataUrl = placeholderSvgDataUrl();
      } else {
        screenshotDataUrl = await screenshotToDataUrl(screenshotPath);
      }
    }

    let frame = p.frameId
      ? await getFrame(p.frameId)
      : await getDefaultFrame((p.platform as 'ios' | 'android') ?? 'ios');
    let frameSvg: string | null = null;
    let framePngUrl: string | undefined;

    // Prefer Koubou PNG frame when available (higher quality than SVG)
    const koubouFamily = p.frameId ? getDeviceFamily(p.frameId) : null;
    if (koubouFamily) {
      // If no SVG frame was found, try the Koubou family's previewFrameId as SVG fallback
      if (!frame && koubouFamily.previewFrameId) {
        frame = await getFrame(koubouFamily.previewFrameId);
      }
      if (koubouFamily?.screenRect && koubouFamily.framePngSize) {
        const deviceColor = p.deviceColor ?? config.frames.deviceColor;
        const koubouId = getDeviceId(koubouFamily.id, deviceColor || undefined);
        const pngExists = koubouId ? await getDeviceFramePath(koubouId) : null;
        if (pngExists) {
          const pngBuffer = await readFile(pngExists);
          framePngUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;
          frame = buildKoubouPreviewFrame(koubouFamily);
        }
      }
    }
    // Fall back to SVG frame from manifest
    if (!framePngUrl && frame && (p.fStyle ?? config.frames.style) !== 'none') {
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
      headlineLineHeight: p.headlineLineHeight ?? config.theme.headlineLineHeight,
      headlineLetterSpacing: p.headlineLetterSpacing ?? config.theme.headlineLetterSpacing,
      headlineTextTransform: p.headlineTextTransform ?? config.theme.headlineTextTransform,
      headlineFontStyle: p.headlineFontStyle ?? config.theme.headlineFontStyle,
      subtitleOpacity: p.subtitleOpacity ?? config.theme.subtitleOpacity,
      subtitleLetterSpacing: p.subtitleLetterSpacing ?? config.theme.subtitleLetterSpacing,
      subtitleTextTransform: p.subtitleTextTransform ?? config.theme.subtitleTextTransform,
      // Background overrides
      backgroundType: p.backgroundType ?? config.theme.backgroundType,
      backgroundColor: p.backgroundColor ?? config.theme.backgroundColor,
      backgroundGradient: p.backgroundGradient
        ? { ...p.backgroundGradient, radialPosition: p.backgroundGradient.radialPosition ?? 'center' }
        : config.theme.backgroundGradient,
      backgroundImageDataUrl: p.backgroundImageDataUrl,
      backgroundOverlay: p.backgroundOverlay ?? config.theme.backgroundOverlay,
      // Device enhancements
      deviceShadow: p.deviceShadow,
      borderSimulation: p.borderSimulation,
      cornerRadius: p.cornerRadius,
      // Effects
      loupe: p.loupe,
      callouts: p.callouts,
      overlays: p.overlays,
    };

    // Apply composition preset
    const compositionId = p.composition ?? 'single';
    const preset = COMPOSITION_PRESETS[compositionId];

    if (compositionId !== 'single' && preset && preset.deviceCount === 1) {
      // Single-device presets: client applies preset values to sliders on selection,
      // then sends them as regular device values. No server override needed —
      // the user can freely adjust sliders after picking a preset.
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
              const extraKoubou = getDeviceFamily(extra.frameId);
              if (extraKoubou?.screenRect && extraKoubou.framePngSize) {
                const extraKoubouId = getDeviceId(extraKoubou.id);
                const extraPngExists = extraKoubouId ? await getDeviceFramePath(extraKoubouId) : null;
                if (extraPngExists) {
                  const extraPngBuffer = await readFile(extraPngExists);
                  slotFramePngUrl = `data:image/png;base64,${extraPngBuffer.toString('base64')}`;
                  slotFrame = {
                    id: extraKoubou.id,
                    name: extraKoubou.name,
                    manufacturer: 'Apple',
                    year: extraKoubou.year,
                    platform: 'ios' as const,
                    framePath: '',
                    screenArea: { x: extraKoubou.screenRect.x, y: extraKoubou.screenRect.y, width: extraKoubou.screenRect.width, height: extraKoubou.screenRect.height, borderRadius: extraKoubou.screenBorderRadius ?? 0 },
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
      const p = clampPreviewParams(parseBody(req.body as Record<string, unknown>));
      const { context } = await resolveContext(p);

      let html = await templateEngine.render(context);
      html = injectTextPositionCSS(html, p.headlineTop, p.headlineLeft, p.headlineWidth, p.subtitleTop, p.subtitleLeft, p.subtitleWidth);
      if (p.spotlight) html = injectSpotlightHTML(html, p.spotlight);
      if (p.annotations && p.annotations.length > 0) html = injectAnnotationsHTML(html, p.annotations, p.width);
      res.set('Content-Type', 'text/html');
      res.send(html);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  // API: Panoramic preview HTML (renders the wide canvas)
  app.post('/api/panoramic-preview-html', async (req, res) => {
    try {
      const body = req.body as Record<string, unknown>;
      const frameCount = body.frameCount as number;
      const frameWidth = body.frameWidth as number;
      const frameHeight = body.frameHeight as number;
      const background = body.background as PanoramicBackground;
      const elements = body.elements as PanoramicElement[];
      const font = (body.font as string) ?? config.theme.font;
      const fontWeight = (body.fontWeight as number) ?? config.theme.fontWeight;
      const frameStyle = (body.frameStyle as FrameStyle) ?? config.frames.style;

      const totalWidth = frameWidth * frameCount;

      // Build rendered elements
      const renderedElements: PanoramicRenderedElement[] = [];
      for (const el of elements) {
        const xPx = (el.x / 100) * totalWidth;
        const yPx = (el.y / 100) * frameHeight;

        if (el.type === 'device') {
          const widthPx = (el.width / 100) * totalWidth;

          // Resolve screenshot — support both file paths and inline data URLs
          let screenshotDataUrl: string;
          if (el.screenshot.startsWith('data:')) {
            screenshotDataUrl = el.screenshot;
          } else {
            const screenshotPath = resolve(configDir, el.screenshot);
            if (!screenshotPath.startsWith(resolve(configDir))) {
              screenshotDataUrl = placeholderSvgDataUrl();
            } else {
              screenshotDataUrl = await screenshotToDataUrl(screenshotPath);
            }
          }

          // Resolve frame — supports both SVG manifest frames and Koubou PNG frames
          const frameId = el.frame ?? config.frames.ios ?? undefined;
          let frame: FrameDefinition | undefined;
          let frameSvg: string | null = null;
          let framePngUrl: string | undefined;

          if (frameId) {
            frame = await getFrame(frameId);

            // If not in SVG manifest, check Koubou device families for PNG frames
            if (!frame) {
              const koubouFamily = getDeviceFamily(frameId);
              if (koubouFamily) {
                // Try SVG fallback via previewFrameId
                if (koubouFamily.previewFrameId) {
                  frame = await getFrame(koubouFamily.previewFrameId);
                }
                // Try Koubou PNG frame
                if (koubouFamily.screenRect && koubouFamily.framePngSize) {
                  const deviceColor = el.deviceColor ?? config.frames.deviceColor;
                  const koubouId = getDeviceId(koubouFamily.id, deviceColor || undefined);
                  const pngPath = koubouId ? await getDeviceFramePath(koubouId) : null;
                  if (pngPath) {
                    const pngBuffer = await readFile(pngPath);
                    framePngUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;
                    frame = buildKoubouPreviewFrame(koubouFamily);
                  }
                }
              }
            }
          } else {
            frame = await getDefaultFrame('ios');
          }

          let clipLeft = 0, clipTop = 0, clipWidth = widthPx, clipHeight = widthPx * 2, clipRadius = 0;

          if (frame && frameStyle !== 'none') {
            // Use PNG frame if available, otherwise SVG
            if (!framePngUrl && frame.framePath) {
              frameSvg = await readFile(frame.framePath, 'utf-8');
            }
            const scale = widthPx / frame.frameSize.width;
            clipLeft = frame.screenArea.x * scale;
            clipTop = frame.screenArea.y * scale;
            clipWidth = frame.screenArea.width * scale;
            clipHeight = frame.screenArea.height * scale;
            clipRadius = frame.screenArea.borderRadius * scale;
          }

          const shadowCss = el.shadow
            ? `filter: drop-shadow(0 ${el.shadow.offsetY}px ${el.shadow.blur}px ${el.shadow.color}${Math.round(el.shadow.opacity * 255).toString(16).padStart(2, '0')});`
            : '';

          renderedElements.push({
            type: 'device', z: el.z, xPx, yPx, widthPx,
            rotation: el.rotation, screenshotDataUrl, frameSvg, framePngUrl, shadowCss,
            clipLeft, clipTop, clipWidth, clipHeight, clipRadius,
            borderSimulation: el.borderSimulation
              ? { thickness: el.borderSimulation.thickness, color: el.borderSimulation.color, radius: el.borderSimulation.radius }
              : undefined,
          });
        } else if (el.type === 'text') {
          let gradientCss: string | undefined;
          if (el.gradient) {
            const colors = el.gradient.colors.join(', ');
            gradientCss = el.gradient.type === 'radial'
              ? `radial-gradient(circle at ${el.gradient.radialPosition ?? 'center'}, ${colors})`
              : `linear-gradient(${el.gradient.direction ?? 135}deg, ${colors})`;
          }
          renderedElements.push({
            type: 'text', z: el.z, xPx, yPx,
            content: el.content, fontSizePx: (el.fontSize / 100) * frameHeight,
            color: el.color, font: el.font, fontWeight: el.fontWeight, fontStyle: el.fontStyle,
            textAlign: el.textAlign, lineHeight: el.lineHeight,
            maxWidthPx: el.maxWidth ? (el.maxWidth / 100) * totalWidth : undefined,
            gradientCss,
          });
        } else if (el.type === 'label') {
          renderedElements.push({
            type: 'label', z: el.z, xPx, yPx,
            content: el.content, fontSizePx: (el.fontSize / 100) * frameHeight,
            color: el.color, backgroundColor: el.backgroundColor,
            paddingPx: (el.padding / 100) * frameHeight, borderRadius: el.borderRadius,
          });
        } else if (el.type === 'decoration') {
          renderedElements.push({
            type: 'decoration', z: el.z, xPx, yPx,
            widthPx: (el.width / 100) * totalWidth,
            heightPx: el.height ? (el.height / 100) * frameHeight : (el.width / 100) * totalWidth,
            shape: el.shape, color: el.color, opacity: el.opacity, rotation: el.rotation,
          });
        }
      }

      // Build background CSS
      let backgroundCss = '#000000';
      if (background.type === 'gradient' && background.gradient) {
        const colors = background.gradient.colors.join(', ');
        backgroundCss = background.gradient.type === 'radial'
          ? `radial-gradient(circle at ${background.gradient.radialPosition}, ${colors})`
          : `linear-gradient(${background.gradient.direction}deg, ${colors})`;
      } else if (background.type === 'image' && background.image) {
        backgroundCss = `url('${background.image}') center/cover no-repeat`;
      } else if (background.type === 'solid' && background.color) {
        backgroundCss = background.color;
      }

      // Compute a contrasting guide color from the background
      const guideColor = (() => {
        let hex = '#000000';
        if (background.type === 'solid' && background.color) {
          hex = background.color;
        } else if (background.type === 'gradient' && background.gradient?.colors?.length) {
          hex = background.gradient.colors[0] ?? hex;
        }
        // Parse hex to RGB and compute relative luminance
        const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
        if (m) {
          const r = parseInt(m[1]!, 16) / 255;
          const g = parseInt(m[2]!, 16) / 255;
          const b = parseInt(m[3]!, 16) / 255;
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          return luminance > 0.5 ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';
        }
        return 'rgba(255, 255, 255, 0.2)';
      })();

      const panoramicContext: PanoramicTemplateContext = {
        canvasWidth: totalWidth,
        canvasHeight: frameHeight,
        frameCount,
        frameWidth,
        font,
        fontWeight,
        frameStyle,
        backgroundCss,
        showGuides: true,
        guideColor,
        elements: renderedElements,
      };

      let html = await templateEngine.renderPanoramic(panoramicContext);

      // Inject effects (spotlight, annotations, overlays)
      const effects = body.effects as { spotlight?: unknown; annotations?: unknown[]; overlays?: unknown[] } | undefined;
      if (effects) {
        if (effects.spotlight) {
          html = injectSpotlightHTML(html, effects.spotlight as Parameters<typeof injectSpotlightHTML>[1]);
        }
        if (effects.annotations && effects.annotations.length > 0) {
          html = injectAnnotationsHTML(html, effects.annotations as Parameters<typeof injectAnnotationsHTML>[1], totalWidth);
        }
        if (effects.overlays && effects.overlays.length > 0) {
          html = injectOverlaysHTML(html, effects.overlays as Parameters<typeof injectOverlaysHTML>[1], totalWidth, frameHeight);
        }
      }

      res.set('Content-Type', 'text/html');
      res.send(html);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/preview', async (req, res) => {
    try {
      const p = clampPreviewParams(parseBody(req.body as Record<string, unknown>));
      const { context } = await resolveContext(p);

      let html = await templateEngine.render(context);
      html = injectTextPositionCSS(html, p.headlineTop, p.headlineLeft, p.headlineWidth, p.subtitleTop, p.subtitleLeft, p.subtitleWidth);
      if (p.spotlight) html = injectSpotlightHTML(html, p.spotlight);
      if (p.annotations && p.annotations.length > 0) html = injectAnnotationsHTML(html, p.annotations, p.width);

      const tmpPath = join(configDir, `.appframe-preview-${Date.now()}.png`);
      const { unlink } = await import('node:fs/promises');
      try {
        await renderer.render({
          html,
          width: p.width,
          height: p.height,
          outputPath: tmpPath,
        });

        const imageBuffer = await readFile(tmpPath);
        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);
      } finally {
        await unlink(tmpPath).catch(() => {});
      }
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

  function getRequestPayload(body: unknown): Record<string, unknown> {
    if (
      body
      && typeof body === 'object'
      && 'payload' in body
      && typeof (body as { payload?: unknown }).payload === 'string'
    ) {
      const raw = (body as { payload: string }).payload;
      return JSON.parse(raw) as Record<string, unknown>;
    }

    return (body ?? {}) as Record<string, unknown>;
  }

  // API: Export full-resolution screenshot
  app.post('/api/export', async (req, res) => {
    try {
      const p = clampPreviewParams(parseBody(getRequestPayload(req.body)));
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
          const screenshotPath = resolve(configDir, screen.screenshot);
          if (!screenshotPath.startsWith(resolve(configDir))) {
            res.status(400).json({ error: 'Screenshot path escapes project directory' });
            return;
          }
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
          deviceColor: p.deviceColor ?? config.frames.deviceColor,
          outputSize: koubouOutputSize,
          headlineGradient: p.headlineGradient ?? config.theme.headlineGradient,
          subtitleGradient: p.subtitleGradient ?? config.theme.subtitleGradient,
          spotlight: p.spotlight,
          annotations: p.annotations as KoubouSingleScreenOptions['annotations'],
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

        const tmpPath = join(configDir, `.appframe-export-${Date.now()}.png`);
        const { unlink } = await import('node:fs/promises');
        try {
          await renderer.render({
            html,
            width: sizeSpec.width,
            height: sizeSpec.height,
            outputPath: tmpPath,
          });

          const imageBuffer = await readFile(tmpPath);
          const filename = `${config.app.name.replace(/[^a-zA-Z0-9]/g, '_')}_screen_${p.screenIndex + 1}_${sizeKey}.png`;
          res.set('Content-Type', 'image/png');
          res.set('Content-Disposition', `attachment; filename="${filename}"`);
          res.send(imageBuffer);
        } finally {
          await unlink(tmpPath).catch(() => {});
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  // API: Export panoramic frame(s) as PNG
  app.post('/api/panoramic-export', async (req, res) => {
    try {
      const body = getRequestPayload(req.body);
      const frameCount = body.frameCount as number;
      const background = body.background as PanoramicBackground;
      const elements = body.elements as PanoramicElement[];
      const font = (body.font as string) ?? config.theme.font;
      const fontWeight = (body.fontWeight as number) ?? config.theme.fontWeight;
      const frameStyle = (body.frameStyle as FrameStyle) ?? config.frames.style;
      const frameIndex = body.frameIndex as number | undefined;
      const sizeKey = (body.sizeKey as string) ?? 'ios-6.7';

      const { STORE_SIZES } = await import('@appframe/core');
      const sizeSpec = STORE_SIZES[sizeKey];
      if (!sizeSpec) {
        res.status(400).json({ error: `Unknown size: ${sizeKey}` });
        return;
      }

      // Calculate export dimensions: each frame is sizeSpec size, total canvas is frameCount * width
      const exportFrameW = sizeSpec.width;
      const exportFrameH = sizeSpec.height;
      const exportTotalW = exportFrameW * frameCount;

      // Build rendered elements at export resolution
      const renderedElements: PanoramicRenderedElement[] = [];
      for (const el of elements) {
        const xPx = (el.x / 100) * exportTotalW;
        const yPx = (el.y / 100) * exportFrameH;

        if (el.type === 'device') {
          const widthPx = (el.width / 100) * exportTotalW;

          let screenshotDataUrl: string;
          if (el.screenshot.startsWith('data:')) {
            screenshotDataUrl = el.screenshot;
          } else {
            const screenshotPath = resolve(configDir, el.screenshot);
            if (!screenshotPath.startsWith(resolve(configDir))) {
              screenshotDataUrl = placeholderSvgDataUrl();
            } else {
              screenshotDataUrl = await screenshotToDataUrl(screenshotPath);
            }
          }

          const frameId = el.frame ?? config.frames.ios ?? undefined;
          let frame: FrameDefinition | undefined;
          let frameSvg: string | null = null;
          let framePngUrl: string | undefined;

          if (frameId) {
            frame = await getFrame(frameId);
            if (!frame) {
              const koubouFamily = getDeviceFamily(frameId);
              if (koubouFamily) {
                if (koubouFamily.previewFrameId) {
                  frame = await getFrame(koubouFamily.previewFrameId);
                }
                if (koubouFamily.screenRect && koubouFamily.framePngSize) {
                  const deviceColor = el.deviceColor ?? config.frames.deviceColor;
                  const koubouId = getDeviceId(koubouFamily.id, deviceColor || undefined);
                  const pngPath = koubouId ? await getDeviceFramePath(koubouId) : null;
                  if (pngPath) {
                    const pngBuffer = await readFile(pngPath);
                    framePngUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;
                    frame = buildKoubouPreviewFrame(koubouFamily);
                  }
                }
              }
            }
          } else {
            frame = await getDefaultFrame('ios');
          }

          let clipLeft = 0, clipTop = 0, clipWidth = widthPx, clipHeight = widthPx * 2, clipRadius = 0;

          if (frame && frameStyle !== 'none') {
            if (!framePngUrl && frame.framePath) {
              frameSvg = await readFile(frame.framePath, 'utf-8');
            }
            const scale = widthPx / frame.frameSize.width;
            clipLeft = frame.screenArea.x * scale;
            clipTop = frame.screenArea.y * scale;
            clipWidth = frame.screenArea.width * scale;
            clipHeight = frame.screenArea.height * scale;
            clipRadius = frame.screenArea.borderRadius * scale;
          }

          const shadowCss = el.shadow
            ? `filter: drop-shadow(0 ${el.shadow.offsetY}px ${el.shadow.blur}px ${el.shadow.color}${Math.round(el.shadow.opacity * 255).toString(16).padStart(2, '0')});`
            : '';

          renderedElements.push({
            type: 'device', z: el.z, xPx, yPx, widthPx,
            rotation: el.rotation, screenshotDataUrl, frameSvg, framePngUrl, shadowCss,
            clipLeft, clipTop, clipWidth, clipHeight, clipRadius,
            borderSimulation: el.borderSimulation
              ? { thickness: el.borderSimulation.thickness, color: el.borderSimulation.color, radius: el.borderSimulation.radius }
              : undefined,
          });
        } else if (el.type === 'text') {
          let gradientCss: string | undefined;
          if (el.gradient) {
            const colors = el.gradient.colors.join(', ');
            gradientCss = el.gradient.type === 'radial'
              ? `radial-gradient(circle at ${el.gradient.radialPosition ?? 'center'}, ${colors})`
              : `linear-gradient(${el.gradient.direction ?? 135}deg, ${colors})`;
          }
          renderedElements.push({
            type: 'text', z: el.z, xPx, yPx,
            content: el.content, fontSizePx: (el.fontSize / 100) * exportFrameH,
            color: el.color, font: el.font, fontWeight: el.fontWeight, fontStyle: el.fontStyle,
            textAlign: el.textAlign, lineHeight: el.lineHeight,
            maxWidthPx: el.maxWidth ? (el.maxWidth / 100) * exportTotalW : undefined,
            gradientCss,
          });
        } else if (el.type === 'label') {
          renderedElements.push({
            type: 'label', z: el.z, xPx, yPx,
            content: el.content, fontSizePx: (el.fontSize / 100) * exportFrameH,
            color: el.color, backgroundColor: el.backgroundColor,
            paddingPx: (el.padding / 100) * exportFrameH, borderRadius: el.borderRadius,
          });
        } else if (el.type === 'decoration') {
          renderedElements.push({
            type: 'decoration', z: el.z, xPx, yPx,
            widthPx: (el.width / 100) * exportTotalW,
            heightPx: el.height ? (el.height / 100) * exportFrameH : (el.width / 100) * exportTotalW,
            shape: el.shape, color: el.color, opacity: el.opacity, rotation: el.rotation,
          });
        }
      }

      // Build background CSS
      let backgroundCss = '#000000';
      if (background.type === 'gradient' && background.gradient) {
        const colors = background.gradient.colors.join(', ');
        backgroundCss = background.gradient.type === 'radial'
          ? `radial-gradient(circle at ${background.gradient.radialPosition}, ${colors})`
          : `linear-gradient(${background.gradient.direction}deg, ${colors})`;
      } else if (background.type === 'image' && background.image) {
        backgroundCss = `url('${background.image}') center/cover no-repeat`;
      } else if (background.type === 'solid' && background.color) {
        backgroundCss = background.color;
      }

      const panoramicContext: PanoramicTemplateContext = {
        canvasWidth: exportTotalW,
        canvasHeight: exportFrameH,
        frameCount,
        frameWidth: exportFrameW,
        font,
        fontWeight,
        frameStyle,
        backgroundCss,
        showGuides: false, // No guides for export
        elements: renderedElements,
      };

      let html = await templateEngine.renderPanoramic(panoramicContext);

      // Inject effects for export too
      const effects = body.effects as { spotlight?: unknown; annotations?: unknown[]; overlays?: unknown[] } | undefined;
      if (effects) {
        if (effects.spotlight) {
          html = injectSpotlightHTML(html, effects.spotlight as Parameters<typeof injectSpotlightHTML>[1]);
        }
        if (effects.annotations && effects.annotations.length > 0) {
          html = injectAnnotationsHTML(html, effects.annotations as Parameters<typeof injectAnnotationsHTML>[1], exportTotalW);
        }
        if (effects.overlays && effects.overlays.length > 0) {
          html = injectOverlaysHTML(html, effects.overlays as Parameters<typeof injectOverlaysHTML>[1], exportTotalW, exportFrameH);
        }
      }

      const tmpPath = join(configDir, `.appframe-panoramic-export-${Date.now()}.png`);
      const { unlink } = await import('node:fs/promises');
      try {
        if (frameIndex !== undefined) {
          // Export a single frame — clip to that frame's region
          await renderer.render({
            html,
            width: exportTotalW,
            height: exportFrameH,
            outputPath: tmpPath,
            clip: {
              x: frameIndex * exportFrameW,
              y: 0,
              width: exportFrameW,
              height: exportFrameH,
            },
          });
        } else {
          // Export the full panoramic canvas
          await renderer.render({
            html,
            width: exportTotalW,
            height: exportFrameH,
            outputPath: tmpPath,
          });
        }

        const imageBuffer = await readFile(tmpPath);
        const suffix = frameIndex !== undefined ? `frame_${frameIndex + 1}` : 'panoramic';
        const filename = `${config.app.name.replace(/[^a-zA-Z0-9]/g, '_')}_${suffix}_${sizeKey}.png`;
        res.set('Content-Type', 'image/png');
        res.set('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(imageBuffer);
      } finally {
        await unlink(tmpPath).catch(() => {});
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

  // SPA fallback: serve React index.html for non-API routes
  app.use((_req, res) => {
    res.sendFile(join(clientDistDir, 'index.html'), (err) => {
      if (err) {
        // client-dist not built — fall back to legacy
        res.sendFile(join(publicDir, 'index.html'));
      }
    });
  });

  app.listen(port, () => {
    console.log(`appframe preview running at http://localhost:${port}`);
  });

  // Start agentation annotation server for AI agent integration
  startHttpServer(AGENTATION_PORT);
  console.log(`agentation annotation server running at http://localhost:${AGENTATION_PORT}`);

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

function placeholderSvgDataUrl(): string {
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
