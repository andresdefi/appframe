import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { loadConfig, validateConfig } from '@appframe/core';
import { readFile, writeFile } from 'node:fs/promises';
import { parse, stringify } from 'yaml';

export function registerConfigTools(server: McpServer): void {
  server.tool(
    'appframe_validate_config',
    'Validate an appframe YAML config file and report any errors',
    { configPath: z.string().describe('Absolute path to the appframe.yml config file') },
    async ({ configPath }) => {
      try {
        const content = await readFile(configPath, 'utf-8');
        const raw = parse(content);
        const result = validateConfig(raw);

        if (!result.success) {
          return {
            content: [{
              type: 'text' as const,
              text: `Validation failed:\n${result.errors.map(e => `  ${e.path}: ${e.message}`).join('\n')}`,
            }],
          };
        }

        return {
          content: [{
            type: 'text' as const,
            text: `Config is valid.\n  App: ${result.config.app.name}\n  Platforms: ${result.config.app.platforms.join(', ')}\n  Style: ${result.config.theme.style}\n  Screens: ${result.config.screens.length}\n  Locales: ${Object.keys(result.config.locales ?? {}).length || 'default only'}`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Error: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_read_config',
    'Read and return the contents of an appframe config file',
    { configPath: z.string().describe('Absolute path to the appframe.yml config file') },
    async ({ configPath }) => {
      try {
        const config = await loadConfig(configPath);
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(config, null, 2),
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Error: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_update_config',
    'Update specific fields in an appframe config file. Provide the field path and new value.',
    {
      configPath: z.string().describe('Absolute path to the appframe.yml config file'),
      updates: z.string().describe('JSON object with dot-notation paths as keys and new values. Example: {"theme.colors.primary": "#FF0000", "screens.0.headline": "New headline"}'),
    },
    async ({ configPath, updates }) => {
      try {
        const content = await readFile(configPath, 'utf-8');
        const config = parse(content) as Record<string, unknown>;
        const updateObj = JSON.parse(updates) as Record<string, unknown>;

        for (const [path, value] of Object.entries(updateObj)) {
          setNestedValue(config, path, value);
        }

        const result = validateConfig(config);
        if (!result.success) {
          return {
            content: [{
              type: 'text' as const,
              text: `Update would create invalid config:\n${result.errors.map(e => `  ${e.path}: ${e.message}`).join('\n')}`,
            }],
          };
        }

        await writeFile(configPath, stringify(config), 'utf-8');
        return {
          content: [{
            type: 'text' as const,
            text: `Config updated successfully. Changed: ${Object.keys(updateObj).join(', ')}`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Error: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_init_config',
    'Create a new appframe config file for an app. Returns the generated YAML.',
    {
      outputPath: z.string().describe('Absolute path where the config file should be written'),
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Short description of the app'),
      platforms: z.array(z.enum(['ios', 'android'])).describe('Target platforms'),
      style: z.enum(['minimal', 'bold', 'glow', 'playful', 'clean', 'branded', 'editorial']).describe('Visual template style'),
      features: z.array(z.string()).describe('Key features of the app (used for copy generation)'),
      primaryColor: z.string().optional().describe('Primary brand color as hex (e.g. #2563EB)'),
    },
    async ({ outputPath, appName, appDescription, platforms, style, features, primaryColor }) => {
      const themePresets: Record<string, Record<string, string>> = {
        minimal: { primary: '#2563EB', secondary: '#7C3AED', background: '#F8FAFC', text: '#0F172A', subtitle: '#64748B' },
        bold: { primary: '#FF4D6A', secondary: '#7B2FFF', background: '#1A1A2E', text: '#FFFFFF', subtitle: '#E2E8F0' },
        dark: { primary: '#6366F1', secondary: '#EC4899', background: '#0A0A0F', text: '#F8FAFC', subtitle: '#94A3B8' },
        playful: { primary: '#F59E0B', secondary: '#10B981', background: '#FFF7ED', text: '#1C1917', subtitle: '#78716C' },
        clean: { primary: '#000000', secondary: '#666666', background: '#FFFFFF', text: '#000000', subtitle: '#6B7280' },
        branded: { primary: '#FF6B00', secondary: '#FF9A45', background: '#FF6B00', text: '#FFFFFF', subtitle: '#FFFFFFCC' },
        editorial: { primary: '#8B7355', secondary: '#A0926B', background: '#F5F0E8', text: '#2C2416', subtitle: '#7A7062' },
      };

      const colors = { ...themePresets[style] };
      if (primaryColor) colors['primary'] = primaryColor;

      const config = {
        app: { name: appName, description: appDescription, platforms, features },
        theme: { style, colors, font: 'inter', fontWeight: 600 },
        frames: {
          ios: platforms.includes('ios') ? 'generic-phone' : undefined,
          android: platforms.includes('android') ? 'generic-phone' : undefined,
          style: 'flat',
        },
        screens: [
          { screenshot: 'screenshots/screen-1.png', headline: 'Your main headline here', subtitle: 'A supporting line', layout: 'center' },
          { screenshot: 'screenshots/screen-2.png', headline: 'Highlight a key feature', layout: 'angled-right' },
          { screenshot: 'screenshots/screen-3.png', headline: 'Show another great feature', layout: 'center' },
        ],
        output: {
          platforms,
          ...(platforms.includes('ios') ? { ios: { sizes: [6.7, 6.5], format: 'png' } } : {}),
          ...(platforms.includes('android') ? { android: { sizes: ['phone'], format: 'png', featureGraphic: true } } : {}),
          directory: './output',
        },
      };

      const yaml = stringify(config);
      await writeFile(outputPath, `# appframe config — ${appName}\n${yaml}`, 'utf-8');

      return {
        content: [{
          type: 'text' as const,
          text: `Config created at ${outputPath}.\n\nGenerated config:\n${yaml}\n\nNext: Add screenshots to the screenshots/ folder, edit headlines, then run appframe generate.`,
        }],
      };
    },
  );
}

function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!;
    const numKey = parseInt(key, 10);

    if (!isNaN(numKey) && Array.isArray(current)) {
      current = current[numKey] as Record<string, unknown>;
    } else {
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }
  }

  const lastKey = parts[parts.length - 1]!;
  current[lastKey] = value;
}
