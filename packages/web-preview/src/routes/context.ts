import type { AppframeConfig, TemplateEngine } from '@appframe/core';
import type { ScreenshotStorageOptions } from '../screenshotStorage.js';
import type { ProjectStorageOptions } from '../projectStorage.js';

// The route modules below receive a small reference cell to the live
// config (rather than a snapshot), because PUT /api/config can replace
// it from under them and the other routes need to see the new value.
export interface RouteContext {
  configDir: string;
  resolvedConfigPath: string | undefined;
  getConfig: () => AppframeConfig;
  setConfig: (config: AppframeConfig) => void;
  templateEngine: TemplateEngine;
  screenshotStorage: ScreenshotStorageOptions;
  projectStorage: ProjectStorageOptions;
  // Fan-out to /api/events SSE listeners. Called by routes that accept
  // out-of-band writes (e.g. POST /api/projects/:slug/patch-screen) so
  // the browser UI can refetch and apply the change instantly.
  broadcastEvent: (payload: Record<string, unknown>) => void;
  // Slug of the project the browser currently has open. Posted from the
  // client on every project open/switch via POST /api/active-project so
  // agents can target the right project envelope without polling the
  // listing endpoint.
  getActiveProjectSlug: () => string | null;
  setActiveProjectSlug: (slug: string | null) => void;
}
