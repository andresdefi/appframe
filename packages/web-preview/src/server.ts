import express from 'express';
import cors from 'cors';
import { join, dirname, resolve } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { startHttpServer } from 'agentation-mcp';
import {
  loadConfig,
  validateConfigOrThrow,
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
  resolveLocalizedAsset,
} from '@appframe/core';
import type {
  AppframeConfig,
  TemplateStyle,
  LayoutVariant,
  FrameStyle,
  CompositionPreset,
  FrameDefinition,
  KoubouSingleScreenOptions,
  PanoramicElement,
  PanoramicBackground,
  Loupe,
  LocaleConfig,
} from '@appframe/core';
import type {
  TemplateContext,
  DeviceContext,
  PanoramicTemplateContext,
  PanoramicRenderedElement,
} from '@appframe/core';
import { autoTranslateLocale } from './translation.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const AGENTATION_PORT = 4747;

export interface PreviewServerOptions {
  configPath?: string;
  sessionPath?: string;
  port?: number;
}

function createDefaultConfig(): AppframeConfig {
  return {
    mode: 'individual',
    app: {
      name: 'My App',
      description: 'App Store screenshot preview',
      platforms: ['ios'],
      features: [],
    },
    theme: {
      style: 'minimal',
      colors: {
        primary: '#2563EB',
        secondary: '#7C3AED',
        background: '#F8FAFC',
        text: '#0F172A',
        subtitle: '#64748B',
      },
      font: 'inter',
      fontWeight: 600,
    },
    frames: { style: 'flat' },
    screens: [
      {
        screenshot: '__placeholder__',
        headline: 'Your headline here',
        subtitle: 'Add a subtitle for extra context',
        layout: 'center',
        composition: 'single',
        autoSizeHeadline: true,
        autoSizeSubtitle: false,
        annotations: [],
      },
      {
        screenshot: '__placeholder__',
        headline: 'Highlight a key feature',
        subtitle: 'Describe what makes it special',
        layout: 'angled-right',
        composition: 'single',
        autoSizeHeadline: true,
        autoSizeSubtitle: false,
        annotations: [],
      },
      {
        screenshot: '__placeholder__',
        headline: 'Show your app in action',
        subtitle: '',
        layout: 'center',
        composition: 'single',
        autoSizeHeadline: true,
        autoSizeSubtitle: false,
        annotations: [],
      },
      {
        screenshot: '__placeholder__',
        headline: 'Another great feature',
        subtitle: 'Users will love this',
        layout: 'angled-left',
        composition: 'single',
        autoSizeHeadline: true,
        autoSizeSubtitle: false,
        annotations: [],
      },
      {
        screenshot: '__placeholder__',
        headline: 'Ready to download',
        subtitle: 'Available on the App Store',
        layout: 'center',
        composition: 'single',
        autoSizeHeadline: true,
        autoSizeSubtitle: false,
        annotations: [],
      },
    ],
    output: {
      platforms: ['ios'],
      directory: './output',
    },
  };
}

function cloneConfig<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function expectOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function buildBackgroundString(screen: Record<string, unknown>, fallback?: string): string | undefined {
  const backgroundType = expectOptionalString(screen.backgroundType);
  if (backgroundType === 'solid') {
    return expectOptionalString(screen.backgroundColor) ?? fallback;
  }
  if (backgroundType === 'gradient') {
    const gradient = screen.backgroundGradient;
    if (!isRecord(gradient) || !Array.isArray(gradient.colors) || gradient.colors.length < 2) {
      return fallback;
    }
    const colors = gradient.colors.map((entry) => String(entry)).join(', ');
    if (gradient.type === 'radial') {
      return `radial-gradient(circle at ${String(gradient.radialPosition ?? 'center')}, ${colors})`;
    }
    return `linear-gradient(${Number(gradient.direction ?? 135)}deg, ${colors})`;
  }
  if (backgroundType === 'preset') return undefined;
  return fallback;
}

function normalizeScreenshotPath(
  original: string | undefined,
  nextName: unknown,
  index: number,
): string {
  if (!original) {
    return typeof nextName === 'string' && nextName
      ? `screenshots/${nextName}`
      : `screenshots/screen-${index + 1}.png`;
  }
  if (typeof nextName !== 'string' || !nextName || original.endsWith(nextName)) {
    return original;
  }
  const parts = original.split('/');
  parts[parts.length - 1] = nextName;
  return parts.join('/');
}

function buildConfigFromEditorState(baseConfig: AppframeConfig, body: Record<string, unknown>): AppframeConfig {
  const next = cloneConfig(baseConfig);
  const mode = body.mode === 'panoramic' ? 'panoramic' : 'individual';
  const screens = Array.isArray(body.screens)
    ? body.screens.filter(isRecord)
    : [];
  const locales = isRecord(body.sessionLocales)
    ? body.sessionLocales
    : next.locales;

  next.mode = mode;
  next.locales = locales as AppframeConfig['locales'];

  const firstScreen = screens[0];
  if (firstScreen) {
    next.theme = {
      ...next.theme,
      style: (expectOptionalString(firstScreen.style) as AppframeConfig['theme']['style']) ?? next.theme.style,
      font: expectOptionalString(firstScreen.font) ?? next.theme.font,
      fontWeight:
        typeof firstScreen.fontWeight === 'number'
          ? firstScreen.fontWeight
          : next.theme.fontWeight,
      headlineSize:
        typeof firstScreen.headlineSize === 'number' && firstScreen.headlineSize > 0
          ? firstScreen.headlineSize
          : undefined,
      subtitleSize:
        typeof firstScreen.subtitleSize === 'number' && firstScreen.subtitleSize > 0
          ? firstScreen.subtitleSize
          : undefined,
      headlineGradient: isRecord(firstScreen.headlineGradient)
        ? firstScreen.headlineGradient as AppframeConfig['theme']['headlineGradient']
        : undefined,
      subtitleGradient: isRecord(firstScreen.subtitleGradient)
        ? firstScreen.subtitleGradient as AppframeConfig['theme']['subtitleGradient']
        : undefined,
      headlineLineHeight:
        typeof firstScreen.headlineLineHeight === 'number' && firstScreen.headlineLineHeight > 0
          ? firstScreen.headlineLineHeight / 100
          : undefined,
      headlineLetterSpacing:
        typeof firstScreen.headlineLetterSpacing === 'number' && firstScreen.headlineLetterSpacing !== 0
          ? `${firstScreen.headlineLetterSpacing / 100}em`
          : undefined,
      headlineTextTransform:
        (expectOptionalString(firstScreen.headlineTextTransform) as AppframeConfig['theme']['headlineTextTransform'])
        ?? undefined,
      headlineFontStyle:
        (expectOptionalString(firstScreen.headlineFontStyle) as AppframeConfig['theme']['headlineFontStyle'])
        ?? undefined,
      subtitleOpacity:
        typeof firstScreen.subtitleOpacity === 'number' && firstScreen.subtitleOpacity > 0
          ? firstScreen.subtitleOpacity / 100
          : undefined,
      subtitleLetterSpacing:
        typeof firstScreen.subtitleLetterSpacing === 'number' && firstScreen.subtitleLetterSpacing !== 0
          ? `${firstScreen.subtitleLetterSpacing / 100}em`
          : undefined,
      subtitleTextTransform:
        (expectOptionalString(firstScreen.subtitleTextTransform) as AppframeConfig['theme']['subtitleTextTransform'])
        ?? undefined,
    };

    const colors = isRecord(firstScreen.colors) ? firstScreen.colors : null;
    if (colors) {
      next.theme.colors = {
        primary: expectOptionalString(colors.primary) ?? next.theme.colors.primary,
        secondary: expectOptionalString(colors.secondary) ?? next.theme.colors.secondary,
        background: expectOptionalString(colors.background) ?? next.theme.colors.background,
        text: expectOptionalString(colors.text) ?? next.theme.colors.text,
        subtitle: expectOptionalString(colors.subtitle) ?? next.theme.colors.subtitle,
      };
    }

    next.frames = {
      ...next.frames,
      style:
        (expectOptionalString(firstScreen.frameStyle) as AppframeConfig['frames']['style'])
        ?? next.frames.style,
      deviceColor: expectOptionalString(firstScreen.deviceColor) ?? next.frames.deviceColor,
    };
  }

  if (mode === 'panoramic') {
    const fallbackPanoramic = next.panoramic;
    next.frameCount =
      typeof body.panoramicFrameCount === 'number'
        ? body.panoramicFrameCount
        : next.frameCount ?? 5;
    next.panoramic = {
      background: isRecord(body.panoramicBackground)
        ? body.panoramicBackground as NonNullable<AppframeConfig['panoramic']>['background']
        : fallbackPanoramic?.background ?? { type: 'solid' },
      elements: Array.isArray(body.panoramicElements)
        ? body.panoramicElements as NonNullable<AppframeConfig['panoramic']>['elements']
        : fallbackPanoramic?.elements ?? [],
    };
    return validateConfigOrThrow(next);
  }

  next.screens = screens.map((screen, index) => {
    const original = next.screens[index] ?? {
      screenshot: `screenshots/screen-${index + 1}.png`,
      headline: `Screen ${index + 1}`,
      layout: 'center' as const,
      composition: 'single' as const,
      autoSizeHeadline: true,
      autoSizeSubtitle: false,
      annotations: [],
    };

    return {
      ...original,
      screenshot: normalizeScreenshotPath(original.screenshot, screen.screenshotName, index),
      headline: expectOptionalString(screen.headline) ?? original.headline,
      subtitle: expectOptionalString(screen.subtitle),
      layout:
        (expectOptionalString(screen.layout) as typeof original.layout)
        ?? original.layout,
      device: expectOptionalString(screen.frameId) ?? original.device,
      background: buildBackgroundString(screen, original.background),
      composition:
        (expectOptionalString(screen.composition) as typeof original.composition)
        ?? original.composition,
      autoSizeHeadline:
        typeof screen.autoSizeHeadline === 'boolean'
          ? screen.autoSizeHeadline
          : original.autoSizeHeadline,
      autoSizeSubtitle:
        typeof screen.autoSizeSubtitle === 'boolean'
          ? screen.autoSizeSubtitle
          : original.autoSizeSubtitle,
      spotlight: isRecord(screen.spotlight)
        ? screen.spotlight as typeof original.spotlight
        : original.spotlight,
      annotations: Array.isArray(screen.annotations)
        ? screen.annotations as typeof original.annotations
        : original.annotations ?? [],
      deviceShadow: isRecord(screen.deviceShadow)
        ? screen.deviceShadow as typeof original.deviceShadow
        : original.deviceShadow,
      borderSimulation: isRecord(screen.borderSimulation)
        ? screen.borderSimulation as typeof original.borderSimulation
        : original.borderSimulation,
      cornerRadius:
        typeof screen.cornerRadius === 'number'
          ? screen.cornerRadius
          : original.cornerRadius,
      loupe: isRecord(screen.loupe)
        ? screen.loupe as typeof original.loupe
        : original.loupe,
      callouts: Array.isArray(screen.callouts)
        ? screen.callouts as typeof original.callouts
        : original.callouts,
      overlays: Array.isArray(screen.overlays)
        ? screen.overlays as typeof original.overlays
        : original.overlays,
    };
  });

  return validateConfigOrThrow(next);
}

export async function startPreviewServer(options: PreviewServerOptions): Promise<void> {
  const { configPath, sessionPath, port = 4400 } = options;

  const resolvedConfigPath = configPath ? resolve(configPath) : undefined;
  const configDir = resolvedConfigPath ? dirname(resolvedConfigPath) : process.cwd();

  let config: AppframeConfig = resolvedConfigPath
    ? await loadConfig(resolvedConfigPath)
    : createDefaultConfig();

  // Load variant session file if provided
  const resolvedSessionPath = sessionPath ? resolve(sessionPath) : undefined;
  let sessionData: unknown = null;
  if (resolvedSessionPath) {
    try {
      const raw = await readFile(resolvedSessionPath, 'utf-8');
      sessionData = JSON.parse(raw);
    } catch {
      console.log(`Warning: Could not load session file: ${resolvedSessionPath}`);
    }
  }

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
  app.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  // API: Health check
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  // API: Get variant session data (from --session flag)
  app.get('/api/session', (_req, res) => {
    res.json(sessionData);
  });

  app.post('/api/session/save', async (req, res) => {
    if (!resolvedSessionPath) {
      res.status(400).json({ error: 'Preview was not started with a session file' });
      return;
    }

    try {
      const body = req.body as {
        activeVariantId?: unknown;
        recommendedVariantId?: unknown;
        recommendationReason?: unknown;
        variants?: Array<{
          id?: unknown;
          name?: unknown;
          status?: unknown;
          snapshot?: unknown;
        }>;
      };

      const activeVariantId = expectString(body.activeVariantId);
      if (!activeVariantId) {
        res.status(400).json({ error: 'activeVariantId is required' });
        return;
      }
      if (!Array.isArray(body.variants)) {
        res.status(400).json({ error: 'variants array is required' });
        return;
      }

      const raw = await readFile(resolvedSessionPath, 'utf-8');
      const session = JSON.parse(raw) as {
        activeVariantId: string;
        updatedAt?: string;
        variants: Array<Record<string, unknown> & { id?: string }>;
        autopilot?: Record<string, unknown>;
      };

      if (!Array.isArray(session.variants)) {
        res.status(400).json({ error: 'Session file is missing variants' });
        return;
      }

      const variantMap = new Map(
        body.variants.map((variant) => {
          const id = expectString(variant.id);
          return [id, variant] as const;
        }).filter((entry): entry is readonly [string, NonNullable<typeof body.variants>[number]] => Boolean(entry[0])),
      );

      const updatedAt = new Date().toISOString();
      session.variants = session.variants.map((variant) => {
        const variantId = typeof variant.id === 'string' ? variant.id : '';
        const incoming = variantMap.get(variantId);
        if (!incoming) return variant;
        const nextName = expectString(incoming.name);
        const nextStatus = incoming.status === 'approved' ? 'approved' : 'draft';
        return {
          ...variant,
          name: nextName || variant.name,
          status: nextStatus,
          editorSnapshot: incoming.snapshot ?? variant.editorSnapshot,
        };
      });

      session.activeVariantId = activeVariantId;
      session.updatedAt = updatedAt;
      if (session.autopilot) {
        session.autopilot = {
          ...session.autopilot,
          recommendedVariantId:
            body.recommendedVariantId === null
              ? null
              : expectString(body.recommendedVariantId) || session.autopilot.recommendedVariantId,
          recommendationReason:
            body.recommendationReason === null
              ? null
              : expectString(body.recommendationReason) || session.autopilot.recommendationReason,
        };
      }

      await writeFile(resolvedSessionPath, JSON.stringify(session, null, 2), 'utf-8');
      sessionData = session;
      res.json({ success: true, updatedAt });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/export-config', async (req, res) => {
    try {
      const body = isRecord(req.body) ? req.body : {};
      const variantName = expectOptionalString(body.variantName) ?? config.app.name;
      const nextConfig = buildConfigFromEditorState(config, body);
      const yaml = `# appframe config — ${config.app.name} (${variantName})\n${JSON.stringify(nextConfig, null, 2)}`;
      const filename = `${variantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'variant'}.config.yaml`;
      res.set('Content-Type', 'application/x-yaml; charset=utf-8');
      res.set('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(yaml);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  app.get('/api/session-asset', (req, res) => {
    const pathValue = typeof req.query.path === 'string' ? req.query.path : '';
    if (!pathValue) {
      res.status(400).json({ error: 'Missing asset path' });
      return;
    }

    const resolvedAssetPath = resolve(pathValue);
    const allowedRoots = [configDir, resolvedSessionPath ? dirname(resolvedSessionPath) : null].filter(
      (value): value is string => Boolean(value),
    );

    if (!allowedRoots.some((root) => resolvedAssetPath.startsWith(root))) {
      res.status(403).json({ error: 'Asset path is outside the preview session roots' });
      return;
    }

    res.sendFile(resolvedAssetPath, (error) => {
      if (error) {
        const statusCode: number = (error as { statusCode?: number }).statusCode ?? 404;
        res.status(statusCode).json({ error: 'Asset not found' });
      }
    });
  });

  // API: Get current config
  app.get('/api/config', (_req, res) => {
    res.json(config);
  });
  app.get('/api/project', (_req, res) => {
    res.json(config);
  });

  app.post('/api/translate-locale', async (req, res) => {
    try {
      const body = req.body as Record<string, unknown>;
      const locale = expectString(body.locale);

      if (!locale || locale === 'default') {
        res.status(400).json({ error: 'A non-default locale is required' });
        return;
      }
      if (config.localization) {
        res.status(400).json({
          error: 'Automatic translation is not available when using native localization mode',
        });
        return;
      }

      const existingLocale = config.locales?.[locale];
      if (existingLocale) {
        res.json({ locale, localeConfig: existingLocale });
        return;
      }

      const sourceScreens = expectArray(body.screens)
        ?.map((screen) => expectObject(screen))
        .filter((screen): screen is Record<string, unknown> => screen !== undefined)
        .map((screen) => ({
          headline: expectString(screen.headline) ?? '',
          subtitle: expectString(screen.subtitle) ?? null,
        }));
      const sourcePanoramicElements = expectArray(body.panoramicElements) as
        | PanoramicElement[]
        | undefined;

      const localeConfig = await autoTranslateLocale(config, locale, {
        screens: sourceScreens && sourceScreens.length > 0 ? sourceScreens : undefined,
        panoramicElements: sourcePanoramicElements,
      });

      res.json({ locale, localeConfig });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      const status = message.includes('OPENAI_API_KEY') ? 503 : 500;
      res.status(status).json({ error: message });
    }
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
    const grouped: Record<
      string,
      Array<{ key: string; name: string; width: number; height: number }>
    > = {};
    const categoryMap: Record<string, string> = {
      ios: 'iphone',
      mac: 'mac',
      watch: 'watch',
      android: 'android',
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
  let koubouStatusCache: { available: boolean; version: string | null; timestamp: number } | null =
    null;

  app.get('/api/koubou-status', async (_req, res) => {
    try {
      const now = Date.now();
      if (!koubouStatusCache || now - koubouStatusCache.timestamp > KOUBOU_CACHE_TTL) {
        const detection = await detectKoubou();
        koubouStatusCache = {
          available: detection.available,
          version: detection.version,
          timestamp: now,
        };
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
    'ipad-pro-11-m4': {
      bleedLeft: 20,
      bleedTop: 20,
      bleedRight: 20,
      bleedBottom: 20,
      radiusBleed: 36,
    },
    'ipad-pro-13-m4': {
      bleedLeft: 20,
      bleedTop: 20,
      bleedRight: 20,
      bleedBottom: 20,
      radiusBleed: 36,
    },
    'macbook-air-2020': {
      bleedLeft: 4,
      bleedTop: 4,
      bleedRight: 4,
      bleedBottom: 12,
      radiusBleed: -18,
    },
    'macbook-air-2022': {
      bleedLeft: 6,
      bleedTop: 6,
      bleedRight: 6,
      bleedBottom: 6,
      radiusBleed: -57,
    },
    'macbook-pro-2021-14': {
      bleedLeft: 6,
      bleedTop: 6,
      bleedRight: 6,
      bleedBottom: 6,
      radiusBleed: -47,
    },
    'macbook-pro-2021-16': {
      bleedLeft: 6,
      bleedTop: 6,
      bleedRight: 6,
      bleedBottom: 6,
      radiusBleed: -46,
    },
    'watch-ultra': { bleedLeft: 8, bleedTop: 8, bleedRight: 8, bleedBottom: 8, radiusBleed: -44 },
    'watch-series-7-45': {
      bleedLeft: 8,
      bleedTop: 20,
      bleedRight: 8,
      bleedBottom: 8,
      radiusBleed: 0,
    },
    'watch-series-4-44': {
      bleedLeft: 8,
      bleedTop: 8,
      bleedRight: 8,
      bleedBottom: 8,
      radiusBleed: -18,
    },
    'watch-series-4-40': {
      bleedLeft: 8,
      bleedTop: 8,
      bleedRight: 8,
      bleedBottom: 8,
      radiusBleed: -18,
    },
  };

  function getKoubouPreviewAdjustment(family: KoubouFamily): KoubouPreviewAdjustment {
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
    const { bleedLeft, bleedTop, bleedRight, bleedBottom, radiusBleed } =
      getKoubouPreviewAdjustment(family);
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
    localeConfig?: LocaleConfig;
    preferLocaleText?: boolean;
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
    spotlight?: {
      x: number;
      y: number;
      w: number;
      h: number;
      shape: 'circle' | 'rectangle';
      dimOpacity: number;
      blur: number;
    };
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
    backgroundGradient?: {
      type: 'linear' | 'radial';
      colors: string[];
      direction: number;
      radialPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
    };
    backgroundImageDataUrl?: string;
    backgroundOverlay?: { color: string; opacity: number };
    // Device enhancements
    deviceShadow?: { opacity: number; blur: number; color: string; offsetY: number };
    borderSimulation?: { enabled: boolean; thickness: number; color: string; radius: number };
    cornerRadius?: number;
    // Effects
    loupe?: Loupe;
    callouts?: Array<{
      id: string;
      sourceX: number;
      sourceY: number;
      sourceW: number;
      sourceH: number;
      displayX: number;
      displayY: number;
      displayScale: number;
      rotation: number;
      borderRadius: number;
      shadow: boolean;
      borderWidth: number;
      borderColor?: string;
    }>;
    overlays?: Array<{
      id: string;
      type: 'icon' | 'badge' | 'star-rating' | 'custom' | 'shape';
      imageDataUrl?: string;
      x: number;
      y: number;
      size: number;
      rotation: number;
      opacity: number;
      shapeType?: 'circle' | 'rectangle' | 'line';
      shapeColor?: string;
      shapeOpacity?: number;
      shapeBlur?: number;
    }>;
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

  function parseBody(
    body: Record<string, unknown>,
    defaultWidth = 400,
    defaultHeight = 868,
  ): PreviewParams {
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
      localeConfig: expectObject(body.localeConfig) as LocaleConfig | undefined,
      preferLocaleText: expectBoolean(body.preferLocaleText),
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
      extraScreenshots: expectArray(body.extraScreenshots) as
        | Array<{ screenshotDataUrl?: string; frameId?: string }>
        | undefined,
      headlineGradient: expectObject(body.headlineGradient) as
        | { colors: string[]; direction: number }
        | undefined,
      subtitleGradient: expectObject(body.subtitleGradient) as
        | { colors: string[]; direction: number }
        | undefined,
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
      backgroundGradient: expectObject(
        body.backgroundGradient,
      ) as PreviewParams['backgroundGradient'],
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

  async function resolveContext(
    p: PreviewParams,
  ): Promise<{ context: TemplateContext; html?: undefined } | { context: TemplateContext }> {
    const screen = config.screens[p.screenIndex] ?? null;
    const resolvedHeadline =
      resolveLocalizedScreenText(
        config,
        p.screenIndex,
        p.locale,
        p.localeConfig,
        'headline',
        p.headline,
        screen?.headline ?? 'New Screen',
        p.preferLocaleText ?? false,
      ) ?? 'New Screen';
    const resolvedSubtitle = resolveLocalizedScreenText(
      config,
      p.screenIndex,
      p.locale,
      p.localeConfig,
      'subtitle',
      p.subtitle,
      screen?.subtitle,
      p.preferLocaleText ?? false,
    );

    let screenshotDataUrl: string;
    if (p.clientScreenshot) {
      screenshotDataUrl = p.clientScreenshot;
    } else {
      const screenshotPath = screen
        ? getLocalizedScreenshotPath(
            config,
            configDir,
            p.screenIndex,
            p.locale,
            screen.screenshot,
            p.localeConfig,
          )
        : '';
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
        ? {
            ...p.backgroundGradient,
            radialPosition: p.backgroundGradient.radialPosition ?? 'center',
          }
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
              slotFrameSvg =
                (p.fStyle ?? config.frames.style) !== 'none'
                  ? await readFile(extraFrame.framePath, 'utf-8')
                  : null;
              slotFramePngUrl = undefined;
            } else {
              const extraKoubou = getDeviceFamily(extra.frameId);
              if (extraKoubou?.screenRect && extraKoubou.framePngSize) {
                const extraKoubouId = getDeviceId(extraKoubou.id);
                const extraPngExists = extraKoubouId
                  ? await getDeviceFramePath(extraKoubouId)
                  : null;
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
                    screenArea: {
                      x: extraKoubou.screenRect.x,
                      y: extraKoubou.screenRect.y,
                      width: extraKoubou.screenRect.width,
                      height: extraKoubou.screenRect.height,
                      borderRadius: extraKoubou.screenBorderRadius ?? 0,
                    },
                    frameSize: {
                      width: extraKoubou.framePngSize.width,
                      height: extraKoubou.framePngSize.height,
                    },
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
      html = injectTextPositionCSS(
        html,
        p.headlineTop,
        p.headlineLeft,
        p.headlineWidth,
        p.subtitleTop,
        p.subtitleLeft,
        p.subtitleWidth,
      );
      if (p.spotlight) html = injectSpotlightHTML(html, p.spotlight);
      if (p.annotations && p.annotations.length > 0)
        html = injectAnnotationsHTML(html, p.annotations, p.width);
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
      const locale = expectString(body.locale) ?? 'default';
      const localeConfig = expectObject(body.localeConfig) as LocaleConfig | undefined;
      const frameCount = body.frameCount as number;
      const frameWidth = body.frameWidth as number;
      const frameHeight = body.frameHeight as number;
      const background = body.background as PanoramicBackground;
      const elements = (body.elements as PanoramicElement[]).map((element, index) =>
        localizePanoramicElement(config, configDir, element, locale, localeConfig, index),
      );
      const font = (body.font as string) ?? config.theme.font;
      const fontWeight = (body.fontWeight as number) ?? config.theme.fontWeight;
      const frameStyle = (body.frameStyle as FrameStyle) ?? config.frames.style;

      const totalWidth = frameWidth * frameCount;
      const renderedElements: PanoramicRenderedElement[] = await Promise.all(
        elements.map((element) =>
          buildPanoramicRenderedElement({
            element,
            space: {
              originXPx: 0,
              originYPx: 0,
              widthPx: totalWidth,
              heightPx: frameHeight,
            },
            config,
            configDir,
            frameStyle,
          }),
        ),
      );
      const backgroundCss = buildPanoramicBackgroundCss(background);

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
      const effects = body.effects as
        | { spotlight?: unknown; annotations?: unknown[]; overlays?: unknown[] }
        | undefined;
      if (effects) {
        if (effects.spotlight) {
          html = injectSpotlightHTML(
            html,
            effects.spotlight as Parameters<typeof injectSpotlightHTML>[1],
          );
        }
        if (effects.annotations && effects.annotations.length > 0) {
          html = injectAnnotationsHTML(
            html,
            effects.annotations as Parameters<typeof injectAnnotationsHTML>[1],
            totalWidth,
          );
        }
        if (effects.overlays && effects.overlays.length > 0) {
          html = injectOverlaysHTML(
            html,
            effects.overlays as Parameters<typeof injectOverlaysHTML>[1],
            totalWidth,
            frameHeight,
          );
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
      html = injectTextPositionCSS(
        html,
        p.headlineTop,
        p.headlineLeft,
        p.headlineWidth,
        p.subtitleTop,
        p.subtitleLeft,
        p.subtitleWidth,
      );
      if (p.spotlight) html = injectSpotlightHTML(html, p.spotlight);
      if (p.annotations && p.annotations.length > 0)
        html = injectAnnotationsHTML(html, p.annotations, p.width);

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
      'ios-6.9': 'iPhone6_9',
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
      body &&
      typeof body === 'object' &&
      'payload' in body &&
      typeof (body as { payload?: unknown }).payload === 'string'
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
      const sizeKey = p.sizeKey ?? 'ios-6.9';

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
          res.status(400).json({
            error: `Koubou does not support size: ${sizeKey}. Use Playwright for Android sizes.`,
          });
          return;
        }

        const screen = config.screens[p.screenIndex] ?? null;
        let screenshotData = p.clientScreenshot;
        if (!screenshotData && screen) {
          const screenshotPath = getLocalizedScreenshotPath(
            config,
            configDir,
            p.screenIndex,
            p.locale,
            screen.screenshot,
            p.localeConfig,
          );
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

        const resolvedHeadline =
          resolveLocalizedScreenText(
            config,
            p.screenIndex,
            p.locale,
            p.localeConfig,
            'headline',
            p.headline,
            screen?.headline ?? 'New Screen',
            p.preferLocaleText ?? false,
          ) ?? 'New Screen';
        const resolvedSubtitle = resolveLocalizedScreenText(
          config,
          p.screenIndex,
          p.locale,
          p.localeConfig,
          'subtitle',
          p.subtitle,
          screen?.subtitle,
          p.preferLocaleText ?? false,
        );

        const imageBuffer = await renderSingleScreenWithKoubou({
          screenshotData,
          headline: resolvedHeadline,
          subtitle: resolvedSubtitle,
          style: p.style ?? config.theme.style,
          colors: p.colors ? { ...config.theme.colors, ...p.colors } : config.theme.colors,
          font: p.font ?? config.theme.font,
          fontWeight: p.fontWeight ?? config.theme.fontWeight,
          headlineSize: p.headlineSize ?? config.theme.headlineSize,
          subtitleSize: p.subtitleSize ?? config.theme.subtitleSize,
          layout: p.layout ?? screen?.layout ?? 'center',
          frameId: p.frameId ?? config.frames.ios,
          frameStyle: p.fStyle ?? config.frames.style,
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
        html = injectTextPositionCSS(
          html,
          p.headlineTop,
          p.headlineLeft,
          p.headlineWidth,
          p.subtitleTop,
          p.subtitleLeft,
          p.subtitleWidth,
        );
        if (p.spotlight) html = injectSpotlightHTML(html, p.spotlight);
        if (p.annotations && p.annotations.length > 0)
          html = injectAnnotationsHTML(html, p.annotations, p.width);

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
      const locale = expectString(body.locale) ?? 'default';
      const localeConfig = expectObject(body.localeConfig) as LocaleConfig | undefined;
      const frameCount = body.frameCount as number;
      const background = body.background as PanoramicBackground;
      const elements = (body.elements as PanoramicElement[]).map((element, index) =>
        localizePanoramicElement(config, configDir, element, locale, localeConfig, index),
      );
      const font = (body.font as string) ?? config.theme.font;
      const fontWeight = (body.fontWeight as number) ?? config.theme.fontWeight;
      const frameStyle = (body.frameStyle as FrameStyle) ?? config.frames.style;
      const frameIndex = body.frameIndex as number | undefined;
      const sizeKey = (body.sizeKey as string) ?? 'ios-6.9';

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
      const renderedElements: PanoramicRenderedElement[] = await Promise.all(
        elements.map((element) =>
          buildPanoramicRenderedElement({
            element,
            space: {
              originXPx: 0,
              originYPx: 0,
              widthPx: exportTotalW,
              heightPx: exportFrameH,
            },
            config,
            configDir,
            frameStyle,
          }),
        ),
      );
      const backgroundCss = buildPanoramicBackgroundCss(background);

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
      const effects = body.effects as
        | { spotlight?: unknown; annotations?: unknown[]; overlays?: unknown[] }
        | undefined;
      if (effects) {
        if (effects.spotlight) {
          html = injectSpotlightHTML(
            html,
            effects.spotlight as Parameters<typeof injectSpotlightHTML>[1],
          );
        }
        if (effects.annotations && effects.annotations.length > 0) {
          html = injectAnnotationsHTML(
            html,
            effects.annotations as Parameters<typeof injectAnnotationsHTML>[1],
            exportTotalW,
          );
        }
        if (effects.overlays && effects.overlays.length > 0) {
          html = injectOverlaysHTML(
            html,
            effects.overlays as Parameters<typeof injectOverlaysHTML>[1],
            exportTotalW,
            exportFrameH,
          );
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
      if (!resolvedConfigPath) {
        res.json({ success: true, note: 'No config file — using defaults' });
        return;
      }
      config = await loadConfig(resolvedConfigPath);
      koubouStatusCache = null;
      res.json({ success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });
  app.post('/api/project/reload', async (_req, res) => {
    try {
      if (!resolvedConfigPath) {
        res.json({ success: true, note: 'No config file — using defaults' });
        return;
      }
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
  localeConfig: LocaleConfig | undefined,
  field: 'headline' | 'subtitle',
): string | undefined {
  if (locale === 'default') return undefined;
  const sessionValue = localeConfig?.screens?.[index]?.[field];
  if (sessionValue !== undefined) return sessionValue;
  return config.locales?.[locale]?.screens?.[index]?.[field];
}

function resolveLocalizedScreenText(
  config: AppframeConfig,
  index: number,
  locale: string,
  localeConfig: LocaleConfig | undefined,
  field: 'headline' | 'subtitle',
  requestedValue: string | undefined,
  fallbackValue: string | undefined,
  preferLocaleText: boolean,
): string | undefined {
  const localizedValue = getLocaleText(config, index, locale, localeConfig, field);
  if (preferLocaleText && localizedValue !== undefined) return localizedValue;
  return requestedValue ?? localizedValue ?? fallbackValue;
}

function getLocalizedScreenshotPath(
  config: AppframeConfig,
  configDir: string,
  index: number,
  locale: string,
  defaultScreenshot: string,
  localeConfig?: LocaleConfig,
): string {
  if (locale !== 'default') {
    const sessionScreen = localeConfig?.screens?.[index];
    if (sessionScreen?.screenshot) return resolve(configDir, sessionScreen.screenshot);

    const localeScreen = config.locales?.[locale]?.screens?.[index];
    if (localeScreen?.screenshot) return resolve(configDir, localeScreen.screenshot);
  }

  if (locale !== 'default' && config.localization) {
    return resolveLocalizedAsset(
      defaultScreenshot,
      locale,
      config.localization.baseLanguage,
      configDir,
    );
  }

  return resolve(configDir, defaultScreenshot);
}

function localizePanoramicElement(
  config: AppframeConfig,
  configDir: string,
  element: PanoramicElement,
  locale: string,
  localeConfig: LocaleConfig | undefined,
  elementIndex?: number,
): PanoramicElement {
  if (element.type === 'group') {
    return {
      ...element,
      children: element.children.map((child) =>
        localizePanoramicElement(config, configDir, child, locale, localeConfig) as typeof child,
      ),
    };
  }

  if (locale === 'default') return element;

  const localePanoramicOverride =
    elementIndex !== undefined
      ? (localeConfig?.panoramic?.elements?.[elementIndex] ??
        config.locales?.[locale]?.panoramic?.elements?.[elementIndex])
      : undefined;

  if (localePanoramicOverride) {
    if ((element.type === 'device' || element.type === 'crop') && localePanoramicOverride.screenshot) {
      return {
        ...element,
        screenshot: resolve(configDir, localePanoramicOverride.screenshot),
      };
    }

    if (
      (element.type === 'text' || element.type === 'label' || element.type === 'badge') &&
      localePanoramicOverride.content
    ) {
      return {
        ...element,
        content: localePanoramicOverride.content,
      };
    }
  }

  if (
    (element.type === 'device' || element.type === 'crop') &&
    element.localeSourceScreen !== undefined &&
    !element.screenshot.startsWith('data:')
  ) {
    return {
      ...element,
      screenshot: getLocalizedScreenshotPath(
        config,
        configDir,
        element.localeSourceScreen,
        locale,
        element.screenshot,
        localeConfig,
      ),
    };
  }

  if (
    (element.type === 'text' || element.type === 'label' || element.type === 'badge') &&
    element.localeSourceScreen !== undefined &&
    element.localeSourceField
  ) {
    const localizedContent = getLocaleText(
      config,
      element.localeSourceScreen,
      locale,
      localeConfig,
      element.localeSourceField,
    );
    if (localizedContent !== undefined) {
      return {
        ...element,
        content: localizedContent,
      };
    }
  }

  return element;
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
    rules.push(
      `.headline { position: fixed; top: ${headlineTop}%; left: ${headlineLeft}%; transform: translateX(-50%); z-index: 10; margin: 0; ${w} }`,
    );
  }
  if (subtitleTop !== undefined && subtitleLeft !== undefined) {
    const w = subtitleWidth !== undefined ? `width: ${subtitleWidth}%;` : '';
    rules.push(
      `.subtitle { position: fixed; top: ${subtitleTop}%; left: ${subtitleLeft}%; transform: translateX(-50%); z-index: 10; margin: 0; ${w} }`,
    );
  }
  if (rules.length === 0) return html;
  return html.replace('</head>', `<style>${rules.join('\n')}</style>\n</head>`);
}

function placeholderSvgDataUrl(): string {
  return (
    'data:image/svg+xml;base64,' +
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800">
      <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea"/><stop offset="100%" style="stop-color:#764ba2"/>
      </linearGradient></defs>
      <rect width="400" height="800" fill="url(#g)"/>
      <text x="200" y="400" text-anchor="middle" fill="white" font-family="sans-serif" font-size="14">Screenshot placeholder</text>
    </svg>`,
    ).toString('base64')
  );
}

function buildPanoramicShadowCss(
  shadow: { opacity: number; blur: number; color: string; offsetY: number } | undefined,
  fallback = '',
): string {
  if (!shadow) return fallback;
  return `filter: drop-shadow(0 ${shadow.offsetY}px ${shadow.blur}px ${shadow.color}${Math.round(
    shadow.opacity * 255,
  )
    .toString(16)
    .padStart(2, '0')});`;
}

function computeCropTranslation(
  widthPx: number,
  heightPx: number,
  focusX: number,
  focusY: number,
  zoom: number,
): { translateXPx: number; translateYPx: number } {
  const maxShiftX = ((zoom - 1) * widthPx) / 2;
  const maxShiftY = ((zoom - 1) * heightPx) / 2;
  return {
    translateXPx: ((50 - focusX) / 50) * maxShiftX,
    translateYPx: ((50 - focusY) / 50) * maxShiftY,
  };
}

type PanoramicRenderSpace = {
  originXPx: number;
  originYPx: number;
  widthPx: number;
  heightPx: number;
};

type PreviewKoubouFamily = NonNullable<ReturnType<typeof getDeviceFamily>>;

type PreviewKoubouAdjustment = {
  bleedLeft: number;
  bleedTop: number;
  bleedRight: number;
  bleedBottom: number;
  radiusBleed: number;
};

const PREVIEW_KOUBOU_ADJUSTMENTS: Record<string, PreviewKoubouAdjustment> = {
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

function getPreviewKoubouAdjustment(family: PreviewKoubouFamily): PreviewKoubouAdjustment {
  const explicit = PREVIEW_KOUBOU_ADJUSTMENTS[family.id];
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

function buildPanoramicKoubouPreviewFrame(family: PreviewKoubouFamily): FrameDefinition {
  const { bleedLeft, bleedTop, bleedRight, bleedBottom, radiusBleed } =
    getPreviewKoubouAdjustment(family);
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
  };
}

function buildPanoramicBackgroundCss(background: PanoramicBackground): string {
  if (background.type === 'gradient' && background.gradient) {
    const colors = background.gradient.colors.join(', ');
    return background.gradient.type === 'radial'
      ? `radial-gradient(circle at ${background.gradient.radialPosition}, ${colors})`
      : `linear-gradient(${background.gradient.direction}deg, ${colors})`;
  }
  if (background.type === 'image' && background.image) {
    return `url('${background.image}') center/cover no-repeat`;
  }
  if (background.type === 'solid' && background.color) {
    return background.color;
  }
  return '#000000';
}

async function buildPanoramicRenderedElement(args: {
  element: PanoramicElement;
  space: PanoramicRenderSpace;
  config: AppframeConfig;
  configDir: string;
  frameStyle: FrameStyle;
}): Promise<PanoramicRenderedElement> {
  const { element, space, config, configDir, frameStyle } = args;
  const xPx = space.originXPx + (element.x / 100) * space.widthPx;
  const yPx = space.originYPx + (element.y / 100) * space.heightPx;

  if (element.type === 'device') {
    const widthPx = (element.width / 100) * space.widthPx;
    const screenshotDataUrl = await resolveCanvasAssetDataUrl(
      element.screenshot,
      configDir,
      'Screenshot',
    );

    const frameId = element.frame ?? config.frames.ios ?? undefined;
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
            const deviceColor = element.deviceColor ?? config.frames.deviceColor;
              const koubouId = getDeviceId(koubouFamily.id, deviceColor || undefined);
              const pngPath = koubouId ? await getDeviceFramePath(koubouId) : null;
              if (pngPath) {
                const pngBuffer = await readFile(pngPath);
                framePngUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;
                frame = buildPanoramicKoubouPreviewFrame(koubouFamily);
              }
            }
          }
      }
    } else {
      frame = await getDefaultFrame('ios');
    }

    let clipLeft = 0;
    let clipTop = 0;
    let clipWidth = widthPx;
    let clipHeight = widthPx * 2;
    let clipRadius = 0;

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

    return {
      type: 'device',
      z: element.z,
      xPx,
      yPx,
      widthPx,
      rotation: element.rotation,
      screenshotDataUrl,
      frameSvg,
      framePngUrl,
      shadowCss: buildPanoramicShadowCss(element.shadow),
      clipLeft,
      clipTop,
      clipWidth,
      clipHeight,
      clipRadius,
      borderSimulation: element.borderSimulation
        ? {
            thickness: element.borderSimulation.thickness,
            color: element.borderSimulation.color,
            radius: element.borderSimulation.radius,
          }
        : undefined,
    };
  }

  if (element.type === 'text') {
    let gradientCss: string | undefined;
    if (element.gradient) {
      const colors = element.gradient.colors.join(', ');
      gradientCss =
        element.gradient.type === 'radial'
          ? `radial-gradient(circle at ${element.gradient.radialPosition ?? 'center'}, ${colors})`
          : `linear-gradient(${element.gradient.direction ?? 135}deg, ${colors})`;
    }

    return {
      type: 'text',
      z: element.z,
      xPx,
      yPx,
      content: element.content,
      fontSizePx: (element.fontSize / 100) * space.heightPx,
      color: element.color,
      font: element.font,
      fontWeight: element.fontWeight,
      fontStyle: element.fontStyle,
      textAlign: element.textAlign,
      lineHeight: element.lineHeight,
      maxWidthPx: element.maxWidth ? (element.maxWidth / 100) * space.widthPx : undefined,
      gradientCss,
    };
  }

  if (element.type === 'label') {
    return {
      type: 'label',
      z: element.z,
      xPx,
      yPx,
      content: element.content,
      fontSizePx: (element.fontSize / 100) * space.heightPx,
      color: element.color,
      backgroundColor: element.backgroundColor,
      paddingPx: (element.padding / 100) * space.heightPx,
      borderRadius: element.borderRadius,
    };
  }

  if (element.type === 'decoration') {
    return {
      type: 'decoration',
      z: element.z,
      xPx,
      yPx,
      widthPx: (element.width / 100) * space.widthPx,
      heightPx: element.height
        ? (element.height / 100) * space.heightPx
        : (element.width / 100) * space.widthPx,
      shape: element.shape,
      color: element.color,
      opacity: element.opacity,
      rotation: element.rotation,
    };
  }

  if (element.type === 'image') {
    return {
      type: 'image',
      z: element.z,
      xPx,
      yPx,
      widthPx: (element.width / 100) * space.widthPx,
      heightPx: (element.height / 100) * space.heightPx,
      rotation: element.rotation,
      opacity: element.opacity,
      borderRadius: element.borderRadius,
      srcDataUrl: await resolveCanvasAssetDataUrl(element.src, configDir, 'Image'),
      fit: element.fit,
      shadowCss: buildPanoramicShadowCss(element.shadow),
    };
  }

  if (element.type === 'logo') {
    return {
      type: 'logo',
      z: element.z,
      xPx,
      yPx,
      widthPx: (element.width / 100) * space.widthPx,
      heightPx: (element.height / 100) * space.heightPx,
      rotation: element.rotation,
      opacity: element.opacity,
      borderRadius: element.borderRadius,
      paddingPx: (element.padding / 100) * space.heightPx,
      backgroundColor: element.backgroundColor,
      srcDataUrl: await resolveCanvasAssetDataUrl(element.src, configDir, 'Logo'),
      fit: element.fit,
      shadowCss: buildPanoramicShadowCss(element.shadow),
    };
  }

  if (element.type === 'crop') {
    const widthPx = (element.width / 100) * space.widthPx;
    const heightPx = (element.height / 100) * space.heightPx;
    const { translateXPx, translateYPx } = computeCropTranslation(
      widthPx,
      heightPx,
      element.focusX,
      element.focusY,
      element.zoom,
    );

    return {
      type: 'crop',
      z: element.z,
      xPx,
      yPx,
      widthPx,
      heightPx,
      rotation: element.rotation,
      borderRadius: element.borderRadius,
      screenshotDataUrl: await resolveCanvasAssetDataUrl(element.screenshot, configDir, 'Crop'),
      zoom: element.zoom,
      translateXPx,
      translateYPx,
      shadowCss: buildPanoramicShadowCss(element.shadow),
    };
  }

  if (element.type === 'card') {
    return {
      type: 'card',
      z: element.z,
      xPx,
      yPx,
      widthPx: (element.width / 100) * space.widthPx,
      heightPx: (element.height / 100) * space.heightPx,
      rotation: element.rotation,
      borderRadius: element.borderRadius,
      paddingPx: (element.padding / 100) * space.heightPx,
      backgroundColor: element.backgroundColor,
      opacity: element.opacity,
      borderColor: element.borderColor,
      borderWidthPx: element.borderWidth,
      eyebrow: element.eyebrow,
      title: element.title,
      body: element.body,
      align: element.align,
      eyebrowColor: element.eyebrowColor,
      titleColor: element.titleColor,
      bodyColor: element.bodyColor,
      eyebrowSizePx: (element.eyebrowSize / 100) * space.heightPx,
      titleSizePx: (element.titleSize / 100) * space.heightPx,
      bodySizePx: (element.bodySize / 100) * space.heightPx,
      shadowCss: buildPanoramicShadowCss(element.shadow),
    };
  }

  if (element.type === 'badge') {
    return {
      type: 'badge',
      z: element.z,
      xPx,
      yPx,
      widthPx: (element.width / 100) * space.widthPx,
      heightPx: (element.height / 100) * space.heightPx,
      rotation: element.rotation,
      opacity: element.opacity,
      borderRadius: element.borderRadius,
      content: element.content,
      color: element.color,
      backgroundColor: element.backgroundColor,
      borderColor: element.borderColor,
      borderWidthPx: element.borderWidth,
      fontSizePx: (element.fontSize / 100) * space.heightPx,
      fontWeight: element.fontWeight,
      letterSpacing: element.letterSpacing,
      textTransform: element.textTransform,
      shadowCss: buildPanoramicShadowCss(element.shadow),
    };
  }

  const widthPx = (element.width / 100) * space.widthPx;
  const heightPx = (element.height / 100) * space.heightPx;
  const children = await Promise.all(
    element.children.map((child) =>
      buildPanoramicRenderedElement({
        element: child,
        space: {
          originXPx: 0,
          originYPx: 0,
          widthPx,
          heightPx,
        },
        config,
        configDir,
        frameStyle,
      }),
    ),
  );

  return {
    type: 'group',
    z: element.z,
    xPx,
    yPx,
    widthPx,
    heightPx,
    rotation: element.rotation,
    opacity: element.opacity,
    children: children.sort((a, b) => a.z - b.z),
  };
}

async function resolveCanvasAssetDataUrl(
  value: string,
  baseDir: string,
  fallbackLabel: string,
): Promise<string> {
  if (value.startsWith('data:')) {
    return value;
  }

  const assetPath = resolve(baseDir, value);
  if (!assetPath.startsWith(resolve(baseDir))) {
    return placeholderSvgDataUrlWithLabel(fallbackLabel);
  }
  return screenshotToDataUrl(assetPath, fallbackLabel);
}

function placeholderSvgDataUrlWithLabel(label: string): string {
  return (
    'data:image/svg+xml;base64,' +
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800">
      <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea"/><stop offset="100%" style="stop-color:#764ba2"/>
      </linearGradient></defs>
      <rect width="400" height="800" fill="url(#g)"/>
      <text x="200" y="400" text-anchor="middle" fill="white" font-family="sans-serif" font-size="14">${label} placeholder</text>
    </svg>`,
    ).toString('base64')
  );
}

async function screenshotToDataUrl(path: string, fallbackLabel = 'Screenshot'): Promise<string> {
  try {
    const buffer = await readFile(path);
    const lower = path.toLowerCase();
    const ext =
      lower.endsWith('.jpg') || lower.endsWith('.jpeg')
        ? 'jpeg'
        : lower.endsWith('.webp')
          ? 'webp'
          : lower.endsWith('.svg')
            ? 'svg+xml'
            : 'png';
    return `data:image/${ext};base64,${buffer.toString('base64')}`;
  } catch {
    return placeholderSvgDataUrlWithLabel(fallbackLabel);
  }
}
