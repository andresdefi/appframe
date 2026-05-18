import express from 'express';
import cors from 'cors';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, TemplateEngine } from '@appframe/core';
import type { AppframeConfig } from '@appframe/core';
import {
  getDefaultProjectsRoot,
  registerScreenshotRoutes,
  type ScreenshotStorageOptions,
} from './screenshotStorage.js';
import { registerProjectRoutes, type ProjectStorageOptions } from './projectStorage.js';
import type { RouteContext } from './routes/context.js';
import { registerDeviceFrameRoutes } from './routes/deviceFrame.js';
import { registerConfigRoutes } from './routes/config.js';
import { registerCatalogRoutes } from './routes/catalog.js';
import { registerElementsRoutes } from './routes/elements.js';
import { registerPreviewRoutes } from './routes/preview.js';

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

  // PUT /api/config can swap the whole config out; passing a getter/setter
  // pair (rather than a snapshot) keeps every route in sync with the
  // latest in-memory state.
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

  // Use URL-mode fonts so every iframe rewrite stays ~6KB instead of ~338KB.
  // The /preview-fonts static route is registered above; the iframe is loaded
  // via doc.write so its base URL is inherited from the parent (same origin
  // as this server, or the Vite dev proxy when running dev:client).
  const templateEngine = new TemplateEngine({ fontBaseUrl: '/preview-fonts' });

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
  };

  registerScreenshotRoutes(app, screenshotStorage);
  registerProjectRoutes(app, projectStorage);
  registerDeviceFrameRoutes(app);
  registerConfigRoutes(app, ctx);
  registerCatalogRoutes(app);
  registerElementsRoutes(app);
  registerPreviewRoutes(app, ctx);

  // API: Health check
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

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
