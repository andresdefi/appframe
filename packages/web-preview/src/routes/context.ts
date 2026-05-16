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
}
