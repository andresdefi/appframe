import express from 'express';
import cors from 'cors';
import { join, dirname, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import {
  loadConfig,
  listFrames,
  getFrame,
  getDefaultFrame,
  TemplateEngine,
  FONT_CATALOG,
  COMPOSITION_PRESETS,
  STORE_SIZES,
  getDeviceFamilies,
  getDeviceFamily,
  getDeviceId,
  getDeviceFramePath,
  injectEffectsHTML,
  resolveLocalizedAsset,
} from '@appframe/core';
import type {
  AppframeConfig,
  LayoutVariant,
  FrameStyle,
  CompositionPreset,
  FrameDefinition,
  PanoramicElement,
  PanoramicBackground,
  PanoramicBackgroundLayer,
  Loupe,
  LocaleConfig,
} from '@appframe/core';
import type {
  TemplateContext,
  DeviceContext,
  PanoramicTemplateContext,
  PanoramicRenderedBackgroundLayer,
  PanoramicRenderedElement,
} from '@appframe/core';
import { buildConfigFromEditorState } from './editorState.js';
import { autoTranslateLocale } from './translation.js';
import {
  getDefaultProjectsRoot,
  registerScreenshotRoutes,
  resolveScreenshotUrlToDataUrl,
  type ScreenshotStorageOptions,
} from './screenshotStorage.js';
import { registerProjectRoutes, type ProjectStorageOptions } from './projectStorage.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface PreviewServerOptions {
  configPath?: string;
  port?: number;
  projectsRoot?: string;
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
        annotations: [],
      },
      {
        screenshot: '__placeholder__',
        headline: 'Highlight a key feature',
        subtitle: 'Describe what makes it special',
        layout: 'angled-right',
        composition: 'single',
        annotations: [],
      },
      {
        screenshot: '__placeholder__',
        headline: 'Show your app in action',
        subtitle: '',
        layout: 'center',
        composition: 'single',
        annotations: [],
      },
      {
        screenshot: '__placeholder__',
        headline: 'Another great feature',
        subtitle: 'Users will love this',
        layout: 'angled-left',
        composition: 'single',
        annotations: [],
      },
      {
        screenshot: '__placeholder__',
        headline: 'Ready to download',
        subtitle: 'Available on the App Store',
        layout: 'center',
        composition: 'single',
        annotations: [],
      },
    ],
    output: {
      platforms: ['ios'],
      directory: './output',
    },
  };
}

function expectOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function slugifyName(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'variant';
}

function serializeConfigText(configValue: AppframeConfig, appName: string, variantName: string): string {
  return `# appframe config — ${appName} (${variantName})\n${JSON.stringify(configValue, null, 2)}`;
}

export async function startPreviewServer(options: PreviewServerOptions): Promise<void> {
  const { configPath, port = 4400 } = options;
  const screenshotStorage: ScreenshotStorageOptions = {
    projectsRoot: options.projectsRoot ?? getDefaultProjectsRoot(),
  };
  const projectStorage: ProjectStorageOptions = {
    projectsRoot: screenshotStorage.projectsRoot,
  };

  const resolvedConfigPath = configPath ? resolve(configPath) : undefined;
  const configDir = resolvedConfigPath ? dirname(resolvedConfigPath) : process.cwd();

  let config: AppframeConfig = resolvedConfigPath
    ? await loadConfig(resolvedConfigPath)
    : createDefaultConfig();

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
  // Font files for the preview iframes — referenced by /preview-fonts/<family>/<file>
  // in the @font-face declarations the engine emits when fontBaseUrl is set.
  // Cache hard: font files are content-addressed by filename and never mutate
  // for the lifetime of the dev server.
  const fontsDir = join(__dirname, '..', '..', '..', 'fonts');
  app.use(
    '/preview-fonts',
    express.static(fontsDir, { maxAge: '1d', etag: true, immutable: true }),
  );
  app.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  registerScreenshotRoutes(app, screenshotStorage);
  registerProjectRoutes(app, projectStorage);

  // Device-frame PNGs are large (~600KB) and previously embedded as base64
  // inside every iframe preview, producing ~3MB of duplicated data per
  // render cycle. Serving via URL lets the browser cache one copy across
  // all iframes and re-renders.
  app.get('/api/device-frame', async (req, res) => {
    const id = typeof req.query.id === 'string' ? req.query.id : '';
    if (!id) {
      res.status(400).json({ error: 'missing id' });
      return;
    }
    try {
      const pngPath = await getDeviceFramePath(id);
      if (!pngPath) {
        res.status(404).json({ error: 'device frame not found' });
        return;
      }
      res.set('Content-Type', 'image/png');
      // Device frames are content-addressed by ID and never mutate, so
      // they're safe to cache aggressively.
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      res.sendFile(pngPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).json({ error: message });
    }
  });

  // API: Health check
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.post('/api/export-config', async (req, res) => {
    try {
      const body = isRecord(req.body) ? req.body : {};
      const variantName = expectOptionalString(body.variantName) ?? config.app.name;
      const nextConfig = buildConfigFromEditorState(config, body);
      const yaml = serializeConfigText(nextConfig, config.app.name, variantName);
      const filename = `${slugifyName(variantName)}.config.yaml`;
      res.set('Content-Type', 'application/x-yaml; charset=utf-8');
      res.set('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(yaml);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  // API: Get current live config (reflects in-browser edits, not disk state).
  app.get('/api/config', (_req, res) => {
    res.json(config);
  });
  app.get('/api/project', (_req, res) => {
    res.json(config);
  });

  // API: Replace the in-memory live config. Browser debounces edits here so that
  // agents querying GET /api/config see the user's latest state in real time.
  // If the body carries `__editorState: true` it is treated as the editor-state
  // shape used by /api/export-config; otherwise it is taken as a full AppframeConfig.
  app.put('/api/config', (req, res) => {
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'Request body must be an object' });
      return;
    }
    try {
      config = body.__editorState === true
        ? buildConfigFromEditorState(config, body)
        : (body as AppframeConfig);
      res.json({ success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
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

  // ---------- Elements: Icons (Lucide) ----------
  // Catalog is built once on first request from lucide-static's tags.json.
  // Each SVG is read from disk on demand; the client recolors them locally.
  let iconCatalogCache: { name: string; tags: string[] }[] | null = null;
  let iconCatalogError: string | null = null;
  const requireFromHere = createRequire(import.meta.url);
  const lucideTagsPath = (() => {
    try {
      return requireFromHere.resolve('lucide-static/tags.json');
    } catch {
      return null;
    }
  })();
  const lucideIconsDir = lucideTagsPath ? join(dirname(lucideTagsPath), 'icons') : null;

  async function loadIconCatalog(): Promise<{ name: string; tags: string[] }[]> {
    if (iconCatalogCache) return iconCatalogCache;
    if (!lucideTagsPath) {
      iconCatalogError = 'lucide-static not installed';
      return [];
    }
    const raw = await readFile(lucideTagsPath, 'utf-8');
    const parsed = JSON.parse(raw) as Record<string, string[]>;
    iconCatalogCache = Object.entries(parsed).map(([name, tags]) => ({ name, tags }));
    return iconCatalogCache;
  }

  app.get('/api/elements/icons/catalog', async (_req, res) => {
    try {
      const catalog = await loadIconCatalog();
      res.json({ source: 'lucide', icons: catalog });
    } catch (err) {
      const message = err instanceof Error ? err.message : iconCatalogError || 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  // Category metadata snapshot generated by scripts/sync-lucide-categories.mjs.
  // Lives under packages/web-preview/data/ so it's reachable both from
  // dist/ (one level up) and via the package's "files" allowlist.
  const lucideCategoriesPath = join(__dirname, '..', 'data', 'lucide-categories.json');
  let lucideCategoriesCache: { categories: { id: string; title: string }[]; iconCategories: Record<string, string[]> } | null = null;

  app.get('/api/elements/icons/categories', async (_req, res) => {
    try {
      if (!lucideCategoriesCache) {
        const raw = await readFile(lucideCategoriesPath, 'utf-8');
        lucideCategoriesCache = JSON.parse(raw);
      }
      res.json(lucideCategoriesCache);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load categories';
      res.status(500).json({ error: message });
    }
  });

  // ---------- Elements: Arrows ----------
  // Sources live under packages/web-preview/data/arrows/<source>/. Each
  // source bundles a set of hand-curated arrow SVGs from a specific
  // creator/pack — see the per-source attribution surfaced in the picker.
  const arrowsBaseDir = join(__dirname, '..', 'data', 'arrows');
  interface ArrowSourceDef {
    id: string;
    title: string;
    attribution: string;
    attributionUrl: string;
    license: string;
  }
  const ARROW_SOURCES: ArrowSourceDef[] = [
    {
      id: 'handyarrows',
      title: 'Handy Arrows',
      attribution: 'Eren Cana Arica',
      attributionUrl: 'https://handyarrows.com',
      license: 'CC-BY 4.0',
    },
    {
      id: 'yokui',
      title: 'Yokui',
      attribution: 'Yokui (Figma Community)',
      attributionUrl: 'https://www.figma.com/design/drOVURBi5jiqueM88edcTK/Yokui---Hand-Drawn-Arrows--Community-',
      license: 'Figma Community — Free for Use',
    },
    {
      id: 'handdrowing',
      title: 'Hand-Drawing',
      attribution: 'arrows hand-drowing (Figma Community)',
      attributionUrl: 'https://www.figma.com/design/sLdWVs5Z7gMQGiGEO4lYqM/arrows-hand-drowing--Community-',
      license: 'Figma Community — Free for Use',
    },
  ];

  app.get('/api/elements/arrows/catalog', async (_req, res) => {
    try {
      const { readdir, stat } = await import('node:fs/promises');
      const sources = await Promise.all(
        ARROW_SOURCES.map(async (source) => {
          const dir = join(arrowsBaseDir, source.id);
          let files: string[] = [];
          try {
            files = (await readdir(dir)).filter((n) => n.endsWith('.svg'));
          } catch {
            // Source folder absent — return empty list rather than 500.
          }
          files.sort((a, b) => {
            const an = parseInt(a.match(/(\d+)/)?.[1] ?? '0', 10);
            const bn = parseInt(b.match(/(\d+)/)?.[1] ?? '0', 10);
            return an - bn;
          });
          // Stamp each arrow with the file's mtime in seconds — the client
          // appends it to the SVG fetch URL as a version hint so updates
          // bust any client-side cache. Falling back to 0 keeps the URL
          // stable if stat fails.
          const arrows = await Promise.all(
            files.map(async (f) => {
              const name = f.replace(/\.svg$/, '');
              let v = 0;
              try {
                v = Math.floor((await stat(join(dir, f))).mtimeMs / 1000);
              } catch {
                // ignore — use 0
              }
              return { name, v };
            }),
          );
          return { ...source, arrows };
        }),
      );
      res.json({ sources });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load arrows catalog';
      res.status(500).json({ error: message });
    }
  });

  // ---------- Elements: Blobs ----------
  // Same shape as the arrows pipeline: SVGs under data/blobs/<source>/,
  // each with its own attribution/license metadata.
  const blobsBaseDir = join(__dirname, '..', 'data', 'blobs');
  const BLOB_SOURCES: ArrowSourceDef[] = [
    {
      id: 'figma-blobs',
      title: 'Blobs (Figma Community)',
      attribution: 'Blobs and Section Waves (Figma Community)',
      attributionUrl: 'https://www.figma.com/design/0xRmMhQRUuzfDEL25mkhad/Blobs-and-Section-Waves--Community-',
      license: 'Figma Community — Free for Use',
    },
  ];

  app.get('/api/elements/blobs/catalog', async (_req, res) => {
    try {
      const { readdir, stat } = await import('node:fs/promises');
      const sources = await Promise.all(
        BLOB_SOURCES.map(async (source) => {
          const dir = join(blobsBaseDir, source.id);
          let files: string[] = [];
          try {
            files = (await readdir(dir)).filter((n) => n.endsWith('.svg'));
          } catch {
            // Source folder absent — return empty list rather than 500.
          }
          files.sort((a, b) => {
            const an = parseInt(a.match(/(\d+)/)?.[1] ?? '0', 10);
            const bn = parseInt(b.match(/(\d+)/)?.[1] ?? '0', 10);
            return an - bn;
          });
          const blobs = await Promise.all(
            files.map(async (f) => {
              const name = f.replace(/\.svg$/, '');
              let v = 0;
              try {
                v = Math.floor((await stat(join(dir, f))).mtimeMs / 1000);
              } catch {
                // ignore — use 0
              }
              return { name, v };
            }),
          );
          return { ...source, blobs };
        }),
      );
      res.json({ sources });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load blobs catalog';
      res.status(500).json({ error: message });
    }
  });

  app.get('/api/elements/blobs/svg/:source/:name', async (req, res) => {
    const { source, name } = req.params;
    if (!/^[a-z0-9-]+$/.test(source) || !/^[a-z0-9-]+$/.test(name)) {
      res.status(400).json({ error: 'Invalid source or blob name' });
      return;
    }
    if (!BLOB_SOURCES.some((s) => s.id === source)) {
      res.status(404).json({ error: 'Unknown blob source' });
      return;
    }
    try {
      const raw = await readFile(join(blobsBaseDir, source, `${name}.svg`), 'utf-8');
      // Blob SVG is served as-is; soft-blur halo headroom is provided by
      // the overlay wrapper itself growing via CSS padding when blur is
      // applied (see overlays.html). That keeps the visible blob the
      // same size as the Size slider regardless of blur amount.
      const svg = raw;
      res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
      res.send(svg);
    } catch {
      res.status(404).json({ error: `Blob "${name}" not found in ${source}` });
    }
  });

  app.get('/api/elements/arrows/svg/:source/:name', async (req, res) => {
    const { source, name } = req.params;
    // Strict allowlist on both segments — keep the read inside data/arrows.
    if (!/^[a-z0-9-]+$/.test(source) || !/^[a-z0-9-]+$/.test(name)) {
      res.status(400).json({ error: 'Invalid source or arrow name' });
      return;
    }
    if (!ARROW_SOURCES.some((s) => s.id === source)) {
      res.status(404).json({ error: 'Unknown arrow source' });
      return;
    }
    try {
      const svg = await readFile(join(arrowsBaseDir, source, `${name}.svg`), 'utf-8');
      res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
      // No `immutable` — content can change when scripts re-sync. ETag
      // lets the browser revalidate cheaply.
      res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
      res.send(svg);
    } catch {
      res.status(404).json({ error: `Arrow "${name}" not found in ${source}` });
    }
  });

  app.get('/api/elements/icons/svg/:name', async (req, res) => {
    if (!lucideIconsDir) {
      res.status(500).json({ error: 'lucide-static not installed' });
      return;
    }
    // Only allow lowercase a-z, digits, and hyphens — defends against path
    // traversal since the value flows straight into a filesystem read.
    const name = req.params.name;
    if (!/^[a-z0-9-]+$/.test(name)) {
      res.status(400).json({ error: 'Invalid icon name' });
      return;
    }
    try {
      const svg = await readFile(join(lucideIconsDir, `${name}.svg`), 'utf-8');
      res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
      // No `immutable` — content can change when scripts re-sync. ETag
      // lets the browser revalidate cheaply.
      res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
      res.send(svg);
    } catch {
      res.status(404).json({ error: `Icon "${name}" not found` });
    }
  });

  // Use URL-mode fonts so every iframe rewrite stays ~6KB instead of ~338KB.
  // The /preview-fonts static route is registered below; the iframe is loaded
  // via doc.write so its base URL is inherited from the parent (same origin
  // as this server, or the Vite dev proxy when running dev:client).
  const templateEngine = new TemplateEngine({ fontBaseUrl: '/preview-fonts' });

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
    isFullscreen?: boolean;
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
    extraScreenshots?: Array<{
      screenshotDataUrl?: string;
      frameId?: string;
      offsetX?: number;
      offsetY?: number;
      scale?: number;
      rotation?: number;
      angle?: number;
      tilt?: number;
    }>;
    headlineGradient?: { colors: string[]; direction: number };
    subtitleGradient?: { colors: string[]; direction: number };
    spotlight?: {
      x: number;
      y: number;
      w: number;
      h: number;
      shape: 'circle' | 'rectangle';
      dimOpacity: number;
      blur: number;
      borderRadius?: number;
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
      borderRadius?: number;
    }>;
    headlineLineHeight?: number;
    headlineLetterSpacing?: string;
    headlineTextTransform?: string;
    headlineFontStyle?: string;
    subtitleOpacity?: number;
    subtitleLetterSpacing?: string;
    subtitleTextTransform?: string;
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
    backgroundImageFit?: 'cover' | 'contain' | 'fill';
    backgroundImagePositionX?: number;
    backgroundImagePositionY?: number;
    backgroundImageScale?: number;
    backgroundOverlay?: { color: string; opacity: number };
    // Device enhancements
    deviceShadow?: { opacity: number; blur: number; color: string; offsetY: number };
    borderSimulation?: { enabled: boolean; thickness: number; color: string; radius: number };
    cornerRadius?: number;
    // Per-element font/weight overrides
    headlineFont?: string;
    headlineFontWeight?: number;
    subtitleFont?: string;
    subtitleFontWeight?: number;
    // Free text (third text slot)
    freeText?: string;
    freeTextEnabled?: boolean;
    freeTextSize?: number;
    freeTextFont?: string;
    freeTextFontWeight?: number;
    freeTextRotation?: number;
    freeTextLetterSpacing?: string;
    freeTextTextTransform?: string;
    freeTextColor?: string;
    freeTextTop?: number;
    freeTextLeft?: number;
    freeTextWidth?: number;
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
      isFullscreen: expectBoolean(body.isFullscreen),
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
        | Array<{
            screenshotDataUrl?: string;
            frameId?: string;
            offsetX?: number;
            offsetY?: number;
            scale?: number;
            rotation?: number;
            angle?: number;
            tilt?: number;
          }>
        | undefined,
      headlineGradient: expectObject(body.headlineGradient) as
        | { colors: string[]; direction: number }
        | undefined,
      subtitleGradient: expectObject(body.subtitleGradient) as
        | { colors: string[]; direction: number }
        | undefined,
      spotlight: expectObject(body.spotlight) as PreviewParams['spotlight'] | undefined,
      annotations: expectArray(body.annotations) as PreviewParams['annotations'] | undefined,
      headlineLineHeight: expectNumber(body.headlineLineHeight),
      headlineLetterSpacing: expectString(body.headlineLetterSpacing),
      headlineTextTransform: expectString(body.headlineTextTransform),
      headlineFontStyle: expectString(body.headlineFontStyle),
      subtitleOpacity: expectNumber(body.subtitleOpacity),
      subtitleLetterSpacing: expectString(body.subtitleLetterSpacing),
      subtitleTextTransform: expectString(body.subtitleTextTransform),
      deviceColor: expectString(body.deviceColor),
      // Background overrides
      backgroundType: expectString(body.backgroundType) as PreviewParams['backgroundType'],
      backgroundColor: expectString(body.backgroundColor),
      backgroundGradient: expectObject(
        body.backgroundGradient,
      ) as PreviewParams['backgroundGradient'],
      backgroundImageDataUrl: expectString(body.backgroundImageDataUrl),
      backgroundImageFit: expectString(body.backgroundImageFit) as PreviewParams['backgroundImageFit'],
      backgroundImagePositionX: expectNumber(body.backgroundImagePositionX),
      backgroundImagePositionY: expectNumber(body.backgroundImagePositionY),
      backgroundImageScale: expectNumber(body.backgroundImageScale),
      backgroundOverlay: expectObject(body.backgroundOverlay) as PreviewParams['backgroundOverlay'],
      // Device enhancements
      deviceShadow: expectObject(body.deviceShadow) as PreviewParams['deviceShadow'],
      borderSimulation: expectObject(body.borderSimulation) as PreviewParams['borderSimulation'],
      cornerRadius: expectNumber(body.cornerRadius),
      // Per-element font/weight overrides
      headlineFont: expectString(body.headlineFont),
      headlineFontWeight: expectNumber(body.headlineFontWeight),
      subtitleFont: expectString(body.subtitleFont),
      subtitleFontWeight: expectNumber(body.subtitleFontWeight),
      // Free text
      freeText: expectString(body.freeText),
      freeTextEnabled: expectBoolean(body.freeTextEnabled),
      freeTextSize: expectNumber(body.freeTextSize),
      freeTextFont: expectString(body.freeTextFont),
      freeTextFontWeight: expectNumber(body.freeTextFontWeight),
      freeTextRotation: expectNumber(body.freeTextRotation),
      freeTextLetterSpacing: expectString(body.freeTextLetterSpacing),
      freeTextTextTransform: expectString(body.freeTextTextTransform),
      freeTextColor: expectString(body.freeTextColor),
      freeTextTop: expectNumber(body.freeTextTop),
      freeTextLeft: expectNumber(body.freeTextLeft),
      freeTextWidth: expectNumber(body.freeTextWidth),
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
    p.freeTextSize = clamp(p.freeTextSize, 0, 500);
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
      // Pass upload URLs through unchanged so the iframe loads the image
      // as a normal HTTP resource and the browser caches one copy across
      // all iframes / re-renders. Used to be resolved to a base64 data
      // URL here for legacy Playwright export, but that path is gone.
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
        if (pngExists && koubouId) {
          // Serve via URL so the browser caches one copy across all iframes.
          // Was inlined as base64 — ~600KB per iframe × 5 iframes blew up
          // browser memory on edit cycles.
          framePngUrl = `/api/device-frame?id=${encodeURIComponent(koubouId)}`;
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
      isFullscreen: p.isFullscreen ?? screen?.isFullscreen ?? false,
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
      headlineGradient: p.headlineGradient,
      subtitleGradient: p.subtitleGradient,
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
      backgroundImageFit: p.backgroundImageFit,
      backgroundImagePositionX: p.backgroundImagePositionX,
      backgroundImagePositionY: p.backgroundImagePositionY,
      backgroundImageScale: p.backgroundImageScale,
      backgroundOverlay: p.backgroundOverlay ?? config.theme.backgroundOverlay,
      // Device enhancements
      deviceShadow: p.deviceShadow,
      borderSimulation: p.borderSimulation,
      cornerRadius: p.cornerRadius,
      // Per-element font/weight. The client now always sends concrete
      // values (the cascade was removed); these fallbacks only fire for
      // legacy SDK callers / older configs that pre-date the change.
      headlineFont:
        p.headlineFont ??
        screen?.headlineFont ??
        config.theme.headlineFont ??
        config.theme.font ??
        'inter',
      headlineFontWeight:
        p.headlineFontWeight ??
        screen?.headlineFontWeight ??
        config.theme.headlineFontWeight ??
        config.theme.fontWeight ??
        600,
      subtitleFont:
        p.subtitleFont ??
        screen?.subtitleFont ??
        config.theme.subtitleFont ??
        config.theme.font ??
        'inter',
      subtitleFontWeight:
        p.subtitleFontWeight ??
        screen?.subtitleFontWeight ??
        config.theme.subtitleFontWeight ??
        400,
      // Free text (third text slot)
      freeText: p.freeText,
      freeTextEnabled: p.freeTextEnabled,
      freeTextSize: p.freeTextSize,
      freeTextFont:
        p.freeTextFont ?? config.theme.freeTextFont ?? config.theme.font ?? 'inter',
      freeTextFontWeight: p.freeTextFontWeight ?? config.theme.freeTextFontWeight ?? 400,
      freeTextRotation: p.freeTextRotation,
      freeTextLetterSpacing: p.freeTextLetterSpacing,
      freeTextTextTransform: p.freeTextTextTransform,
      freeTextColor: p.freeTextColor,
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
        let slotOffsetX = slot.offsetX;
        let slotOffsetY = slot.offsetY;
        let slotScale = slot.scale;
        let slotRotation = slot.rotation;
        let slotAngle = slot.angle;
        let slotTilt = slot.tilt;

        if (i === 0) {
          slotScreenshotDataUrl = screenshotDataUrl;
          slotOffsetX = p.deviceOffsetX ?? slot.offsetX;
          slotOffsetY = p.deviceTop ?? slot.offsetY;
          slotScale = p.deviceScale ?? slot.scale;
          slotRotation = p.deviceRotation ?? slot.rotation;
          slotAngle = p.deviceAngle ?? slot.angle;
          slotTilt = p.deviceTilt ?? slot.tilt;
        } else {
          const extra = p.extraScreenshots?.[i - 1];
          if (extra?.screenshotDataUrl) {
            // Pass through as URL — the iframe loads it as a normal
            // resource. (Used to inline as base64 here; not needed since
            // the Playwright export path was removed.)
            slotScreenshotDataUrl = extra.screenshotDataUrl;
          } else {
            slotScreenshotDataUrl = screenshotDataUrl;
          }
          slotOffsetX = extra?.offsetX ?? slot.offsetX;
          slotOffsetY = extra?.offsetY ?? slot.offsetY;
          slotScale = extra?.scale ?? slot.scale;
          slotRotation = extra?.rotation ?? slot.rotation;
          slotAngle = extra?.angle ?? slot.angle;
          slotTilt = extra?.tilt ?? slot.tilt;
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
                if (extraPngExists && extraKoubouId) {
                  // Same URL-not-base64 treatment as the primary device.
                  slotFramePngUrl = `/api/device-frame?id=${encodeURIComponent(extraKoubouId)}`;
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
          offsetX: slotOffsetX,
          offsetY: slotOffsetY,
          scale: slotScale,
          rotation: slotRotation,
          angle: slotAngle,
          tilt: slotTilt,
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
      html = injectTextPositionCSS(html, {
        headlineTop: p.headlineTop,
        headlineLeft: p.headlineLeft,
        headlineWidth: p.headlineWidth,
        headlineRotation: p.headlineRotation,
        subtitleTop: p.subtitleTop,
        subtitleLeft: p.subtitleLeft,
        subtitleWidth: p.subtitleWidth,
        subtitleRotation: p.subtitleRotation,
        freeTextTop: p.freeTextTop,
        freeTextLeft: p.freeTextLeft,
        freeTextWidth: p.freeTextWidth,
        freeTextRotation: p.freeTextRotation,
      });
      // Single pass — one </head> + </body> replace for all effects,
      // instead of two per effect. Matters when multiple effects are
      // active on the same screen.
      html = injectEffectsHTML(
        html,
        { spotlight: p.spotlight, annotations: p.annotations },
        p.width,
        p.height,
      );
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
      const backgroundLayers = await buildPanoramicRenderedBackgroundLayers({
        background,
        configDir,
        canvasWidth: totalWidth,
        canvasHeight: frameHeight,
      });

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
        backgroundLayers,
        showGuides: true,
        guideColor,
        elements: renderedElements,
      };

      let html = await templateEngine.renderPanoramic(panoramicContext);

      // Single pass — one </head> + </body> replace for all effects.
      const effects = body.effects as
        | { spotlight?: unknown; annotations?: unknown[]; overlays?: unknown[] }
        | undefined;
      if (effects) {
        html = injectEffectsHTML(
          html,
          {
            spotlight: effects.spotlight as Parameters<typeof injectEffectsHTML>[1]['spotlight'],
            annotations: effects.annotations as Parameters<typeof injectEffectsHTML>[1]['annotations'],
            overlays: effects.overlays as Parameters<typeof injectEffectsHTML>[1]['overlays'],
          },
          totalWidth,
          frameHeight,
        );
      }

      res.set('Content-Type', 'text/html');
      res.send(html);
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
      res.json({ success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  // SPA fallback: serve React index.html for non-API routes. /api/* requests
  // that didn't match a handler above return 404 instead of the SPA HTML —
  // otherwise client code that POSTs to a deleted endpoint silently gets a
  // 200 + HTML and has to parse it before noticing.
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      res.status(404).json({ error: `No handler for ${req.method} ${req.path}` });
      return;
    }
    next();
  });
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
    console.log(`live config for agents: http://localhost:${port}/api/config`);
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
  positions: {
    headlineTop?: number;
    headlineLeft?: number;
    headlineWidth?: number;
    headlineRotation?: number;
    subtitleTop?: number;
    subtitleLeft?: number;
    subtitleWidth?: number;
    subtitleRotation?: number;
    freeTextTop?: number;
    freeTextLeft?: number;
    freeTextWidth?: number;
    freeTextRotation?: number;
  },
): string {
  const rules: string[] = [];
  const transformWithRotation = (rotation?: number) =>
    rotation ? `translateX(-50%) rotate(${rotation}deg)` : 'translateX(-50%)';
  if (positions.headlineTop !== undefined && positions.headlineLeft !== undefined) {
    const w = positions.headlineWidth !== undefined ? `width: ${positions.headlineWidth}%;` : '';
    rules.push(
      `.headline { position: fixed; top: ${positions.headlineTop}%; left: ${positions.headlineLeft}%; transform: ${transformWithRotation(positions.headlineRotation)}; z-index: 10; margin: 0; ${w} }`,
    );
  }
  if (positions.subtitleTop !== undefined && positions.subtitleLeft !== undefined) {
    const w = positions.subtitleWidth !== undefined ? `width: ${positions.subtitleWidth}%;` : '';
    rules.push(
      `.subtitle { position: fixed; top: ${positions.subtitleTop}%; left: ${positions.subtitleLeft}%; transform: ${transformWithRotation(positions.subtitleRotation)}; z-index: 10; margin: 0; ${w} }`,
    );
  }
  if (positions.freeTextTop !== undefined && positions.freeTextLeft !== undefined) {
    const w = positions.freeTextWidth !== undefined ? `width: ${positions.freeTextWidth}%;` : '';
    rules.push(
      `.free-text { position: fixed; top: ${positions.freeTextTop}%; left: ${positions.freeTextLeft}%; transform: ${transformWithRotation(positions.freeTextRotation)}; z-index: 10; margin: 0; ${w} }`,
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

function buildPanoramicBackgroundLayerCss(layer: PanoramicBackgroundLayer): string {
  if (layer.kind === 'solid') {
    return layer.color;
  }
  if (layer.kind === 'gradient') {
    if (layer.gradientType === 'mesh') {
      const [a, b, c = layer.colors[0]!, d = layer.colors[1]!] = layer.colors;
      return `radial-gradient(circle at 20% 20%, ${a} 0%, transparent 55%), radial-gradient(circle at 78% 24%, ${b} 0%, transparent 58%), radial-gradient(circle at 52% 78%, ${c} 0%, transparent 62%), linear-gradient(${layer.direction}deg, ${d}, ${a})`;
    }
    const colors = layer.colors.join(', ');
    return layer.gradientType === 'radial'
      ? `radial-gradient(circle at ${layer.radialPosition}, ${colors})`
      : `linear-gradient(${layer.direction}deg, ${colors})`;
  }
  if (layer.kind === 'image') {
    const size =
      layer.fit === 'tile'
        ? `${layer.scale}% auto`
        : layer.fit === 'contain'
          ? 'contain'
          : 'cover';
    const repeat = layer.fit === 'tile' ? 'repeat' : 'no-repeat';
    return `url('${layer.image}') ${layer.position}/${size} ${repeat}`;
  }
  return `radial-gradient(circle at center, ${layer.color} 0%, transparent 72%)`;
}

async function buildPanoramicRenderedBackgroundLayers(args: {
  background: PanoramicBackground;
  configDir: string;
  canvasWidth: number;
  canvasHeight: number;
}): Promise<PanoramicRenderedBackgroundLayer[]> {
  const { background, configDir, canvasWidth, canvasHeight } = args;
  const rendered: PanoramicRenderedBackgroundLayer[] = [];

  for (const layer of background.layers ?? []) {
    if (layer.kind === 'image') {
      const imageDataUrl = await resolveCanvasAssetDataUrl(layer.image, configDir, 'Background');
      rendered.push({
        kind: 'image',
        backgroundCss: buildPanoramicBackgroundLayerCss({ ...layer, image: imageDataUrl }),
        opacity: layer.opacity,
        blendMode: layer.blendMode,
        blurPx: layer.blur,
      });
      continue;
    }

    if (layer.kind === 'glow') {
      rendered.push({
        kind: 'glow',
        backgroundCss: buildPanoramicBackgroundLayerCss(layer),
        opacity: layer.opacity,
        blendMode: layer.blendMode,
        blurPx: layer.blur,
        xPx: (layer.x / 100) * canvasWidth,
        yPx: (layer.y / 100) * canvasHeight,
        widthPx: (layer.width / 100) * canvasWidth,
        heightPx: (layer.height / 100) * canvasHeight,
      });
      continue;
    }

    rendered.push({
      kind: layer.kind,
      backgroundCss: buildPanoramicBackgroundLayerCss(layer),
      opacity: layer.opacity,
      blendMode: layer.blendMode,
      blurPx: layer.blur,
    });
  }

  if (rendered.length === 0) {
    let legacyCss = buildPanoramicBackgroundCss(background);
    if (background.type === 'image' && background.image) {
      legacyCss = `url('${await resolveCanvasAssetDataUrl(background.image, configDir, 'Background')}') center/cover no-repeat`;
    }
    rendered.push({
      kind: background.type === 'image' ? 'image' : background.type === 'gradient' ? 'gradient' : 'solid',
      backgroundCss: legacyCss,
      opacity: 1,
      blendMode: 'normal',
      blurPx: 0,
    });
  }

  if (background.overlay) {
    rendered.push({
      kind: 'solid',
      backgroundCss: background.overlay.color,
      opacity: background.overlay.opacity,
      blendMode: 'normal',
      blurPx: 0,
    });
  }

  return rendered;
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
              if (pngPath && koubouId) {
                // Same URL-not-base64 treatment as the individual mode.
                framePngUrl = `/api/device-frame?id=${encodeURIComponent(koubouId)}`;
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

  if (element.type === 'proof-chip') {
    return {
      type: 'proof-chip',
      z: element.z,
      xPx,
      yPx,
      widthPx: (element.width / 100) * space.widthPx,
      heightPx: (element.height / 100) * space.heightPx,
      rotation: element.rotation,
      opacity: element.opacity,
      borderRadius: element.borderRadius,
      value: element.value,
      detail: element.detail,
      rating: element.rating !== undefined ? Math.round(element.rating) : undefined,
      maxRating: element.maxRating,
      color: element.color,
      mutedColor: element.mutedColor,
      starColor: element.starColor,
      backgroundColor: element.backgroundColor,
      borderColor: element.borderColor,
      borderWidthPx: element.borderWidth,
      valueSizePx: (element.valueSize / 100) * space.heightPx,
      detailSizePx: (element.detailSize / 100) * space.heightPx,
      paddingPx: (element.padding / 100) * space.heightPx,
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
  storage?: ScreenshotStorageOptions,
): Promise<string> {
  if (value.startsWith('data:')) {
    return value;
  }

  if (value.startsWith('/api/screenshots/') && storage) {
    const resolved = await resolveScreenshotUrlToDataUrl(storage, value);
    if (resolved) return resolved;
    return placeholderSvgDataUrlWithLabel(fallbackLabel);
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
