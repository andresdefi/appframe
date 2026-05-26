import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, TemplateEngine } from '@appframe/core';
import type { AppframeConfig } from '@appframe/core';
import {
  getDefaultProjectsRoot,
  registerScreenshotRoutes,
  sweepPreviews,
  type ScreenshotStorageOptions,
} from './screenshotStorage.js';
import { registerProjectRoutes, type ProjectStorageOptions } from './projectStorage.js';
import type { RouteContext } from './routes/context.js';
import { registerDeviceFrameRoutes } from './routes/deviceFrame.js';
import { registerConfigRoutes } from './routes/config.js';
import { registerCatalogRoutes } from './routes/catalog.js';
import { registerElementsRoutes } from './routes/elements.js';
import { registerPreviewRoutes } from './routes/preview.js';
import { createEventBroadcaster } from './routes/events.js';
import { registerProjectScreenRoutes } from './routes/projectScreens.js';
import { registerProjectVariantRoutes } from './routes/projectVariants.js';
import { registerProjectLocaleRoutes } from './routes/projectLocales.js';
import { registerProjectAssetRoutes } from './routes/projectAssets.js';
import { registerProjectHistoryRoutes } from './routes/projectHistory.js';
import { registerRenderPreviewRoutes } from './routes/renderPreview.js';
import { registerRenderBatchRoutes } from './routes/renderBatch.js';
import { log } from './logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read once at module load. The version is the source of truth for the
// /api/version handshake — see registerVersionRoute below.
import { readFileSync } from 'node:fs';
const SERVER_VERSION: string = (() => {
  try {
    const pkgPath = resolve(__dirname, '..', 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version?: string };
    return pkg.version ?? 'unknown';
  } catch {
    return 'unknown';
  }
})();

export interface PreviewServerOptions {
  configPath?: string;
  port?: number;
  projectsRoot?: string;
  // Interface to bind on. Defaults to '127.0.0.1' — anything else opens the
  // preview to other machines on the LAN, which is unsafe because the API
  // can mutate / delete projects. Pass '0.0.0.0' (or a specific IP) only when
  // you really want remote access.
  host?: string;
}

// Origins allowed to call the API. Browsers attach the page's origin to
// every request; we accept only the preview UI itself, plus same-origin /
// non-browser clients (curl, electron, etc.) that omit Origin entirely.
export function buildAllowedOrigins(port: number): Set<string> {
  return new Set([`http://localhost:${port}`, `http://127.0.0.1:${port}`]);
}

export function isOriginAllowed(origin: string | undefined, allowed: Set<string>): boolean {
  if (!origin) return true;
  return allowed.has(origin);
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

export async function startPreviewServer(options: PreviewServerOptions): Promise<{
  port: number;
  close: () => Promise<void>;
}> {
  const { configPath, port = 4400, host = '127.0.0.1' } = options;
  const screenshotStorage: ScreenshotStorageOptions = {
    projectsRoot: options.projectsRoot ?? getDefaultProjectsRoot(),
  };
  const projectStorage: ProjectStorageOptions = {
    projectsRoot: screenshotStorage.projectsRoot,
  };

  const resolvedConfigPath = configPath ? resolve(configPath) : undefined;
  const configDir = resolvedConfigPath ? dirname(resolvedConfigPath) : process.cwd();

  // PUT /api/config can swap the whole config out; passing a getter/setter
  // pair (rather than a snapshot) keeps every route in sync with the
  // latest in-memory state.
  let config: AppframeConfig = resolvedConfigPath
    ? await loadConfig(resolvedConfigPath)
    : createDefaultConfig();

  const app = express();
  const allowedOrigins = buildAllowedOrigins(port);
  // Reject any cross-origin request outright (403). This is a single-user
  // local dev server; no third-party page has a legitimate reason to hit it.
  app.use((req, res, next) => {
    if (isOriginAllowed(req.headers.origin, allowedOrigins)) {
      next();
      return;
    }
    res.status(403).json({ error: 'origin not allowed' });
  });
  app.use(
    cors({
      origin: (origin, callback) => callback(null, isOriginAllowed(origin, allowedOrigins)),
    }),
  );
  // gzip large responses (get_project envelopes, catalogs, preview HTML)
  // — express-compression streams the response so latency is unchanged
  // for small bodies. Won't compress SSE / /api/events (text/event-stream
  // sits below its threshold and is filtered out by default).
  app.use(compression());
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

  // Use URL-mode fonts so every iframe rewrite stays ~6KB instead of ~338KB.
  // The /preview-fonts static route is registered above; the iframe is loaded
  // via doc.write so its base URL is inherited from the parent (same origin
  // as this server, or the Vite dev proxy when running dev:client).
  const templateEngine = new TemplateEngine({ fontBaseUrl: '/preview-fonts' });

  const eventBroadcaster = createEventBroadcaster();
  let activeProjectSlug: string | null = null;

  const ctx: RouteContext = {
    configDir,
    resolvedConfigPath,
    getConfig: () => config,
    setConfig: (next) => {
      config = next;
    },
    templateEngine,
    screenshotStorage,
    projectStorage,
    broadcastEvent: (payload) => eventBroadcaster.broadcast(payload),
    getActiveProjectSlug: () => activeProjectSlug,
    setActiveProjectSlug: (slug) => {
      activeProjectSlug = slug;
    },
  };

  eventBroadcaster.register(app);

  registerProjectScreenRoutes(app, ctx);
  registerProjectVariantRoutes(app, ctx);
  registerProjectLocaleRoutes(app, ctx);
  registerProjectAssetRoutes(app, ctx);
  registerProjectHistoryRoutes(app, ctx);
  registerRenderPreviewRoutes(app, ctx);
  registerRenderBatchRoutes(app, ctx);

  // Generate any missing preview-resolution screenshots and clean up
  // orphans. Runs once per boot, non-blocking — the listen call below
  // doesn't wait. First request to a missing preview heals itself on
  // demand via the lazy fallback in the GET route.
  void sweepPreviews(screenshotStorage).catch((err) => {
    log.warn('sweepPreviews failed', { error: String(err) });
  });

  registerScreenshotRoutes(app, screenshotStorage);
  registerProjectRoutes(app, projectStorage);
  registerDeviceFrameRoutes(app);
  registerConfigRoutes(app, ctx);
  registerCatalogRoutes(app);
  registerElementsRoutes(app);
  registerPreviewRoutes(app, ctx);

  // API: Health check
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  // API: Version — read at MCP startup for a soft compat check. Static
  // for the lifetime of the process; the version is baked into the
  // package.json that gets shipped.
  app.get('/api/version', (_req, res) => {
    res.json({ name: '@appframe/web-preview', version: SERVER_VERSION });
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

  return new Promise((resolve) => {
    const httpServer = app.listen(port, host, () => {
      const address = httpServer.address();
      const boundPort =
        typeof address === 'object' && address ? address.port : port;
      log.info(`appframe preview running at http://localhost:${boundPort}`, { port: boundPort });
      log.info(`live config for agents: http://localhost:${boundPort}/api/config`);
      if (host !== '127.0.0.1' && host !== 'localhost') {
        log.warn(`bound to ${host}:${boundPort} — reachable from other machines on the network`, { host, port: boundPort });
      }
      resolve({
        port: boundPort,
        close: () =>
          new Promise<void>((closeResolve, closeReject) => {
            httpServer.close((err) => (err ? closeReject(err) : closeResolve()));
          }),
      });
    });
  });
}
