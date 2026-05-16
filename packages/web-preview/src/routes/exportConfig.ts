import type { Express } from 'express';
import type { AppframeConfig } from '@appframe/core';
import { buildConfigFromEditorState } from '../editorState.js';
import { isRecord, expectOptionalString, slugifyName } from './utils.js';
import type { RouteContext } from './context.js';

function serializeConfigText(
  configValue: AppframeConfig,
  appName: string,
  variantName: string,
): string {
  return `# appframe config — ${appName} (${variantName})\n${JSON.stringify(configValue, null, 2)}`;
}

export function registerExportConfigRoutes(app: Express, ctx: RouteContext): void {
  app.post('/api/export-config', async (req, res) => {
    try {
      const config = ctx.getConfig();
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
}
