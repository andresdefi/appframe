import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { generateScreenshots } from '@appframe/core';

export function registerGenerateTools(server: McpServer): void {
  server.tool(
    'appframe_generate',
    'Headless batch export: renders store screenshots from an existing appframe.yml straight to disk. Use only when the user has an approved config and wants PNGs generated without review. For interactive screenshot design (analyze screenshots, compare variants, pick one) use appframe_run_autopilot instead, which opens the web preview at http://localhost:4400. Platforms: ios (iPhone/iPad), android, mac, watch.',
    {
      configPath: z.string().describe('Absolute path to the appframe.yml config file'),
      platform: z.enum(['ios', 'android', 'mac', 'watch', 'all']).optional().describe('Filter by platform: ios (iPhone/iPad), android, mac (macOS), watch (Apple Watch), or all'),
      locale: z.string().optional().describe('Generate for a specific locale only'),
      screenIndex: z.number().optional().describe('Generate a single screen by index (0-based)'),
      outputDir: z.string().optional().describe('Override output directory (absolute path)'),
      templateOverride: z.enum(['minimal', 'bold', 'glow', 'playful', 'clean', 'branded', 'editorial']).optional().describe('Override template style for all screens'),
    },
    async ({ configPath, platform, locale, screenIndex, outputDir, templateOverride }) => {
      try {
        const result = await generateScreenshots({
          configPath,
          platform: platform === 'all' ? undefined : platform,
          locale,
          screenIndex,
          outputDir,
          templateOverride,
        });

        const lines = result.screenshots.map((s) => {
          const sizeKb = Math.round(s.fileSize / 1024);
          return `  ${s.outputPath} (${s.width}x${s.height}, ${sizeKb}KB)`;
        });

        const elapsed = (result.totalTime / 1000).toFixed(1);
        return {
          content: [{
            type: 'text' as const,
            text: `Generated ${result.screenshots.length} screenshots in ${elapsed}s:\n\n${lines.join('\n')}`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Generation failed: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_preview_screen',
    'Render a single screen preview and return the image file path. Use this for quick visual checks.',
    {
      configPath: z.string().describe('Absolute path to the appframe.yml config file'),
      screenIndex: z.number().describe('Screen index to preview (0-based)'),
      outputPath: z.string().describe('Absolute path where the preview PNG should be saved'),
      locale: z.string().optional().describe('Locale to use for text'),
      templateOverride: z.enum(['minimal', 'bold', 'glow', 'playful', 'clean', 'branded', 'editorial']).optional(),
    },
    async ({ configPath, screenIndex, outputPath, locale, templateOverride }) => {
      try {
        const result = await generateScreenshots({
          configPath,
          screenIndex,
          locale,
          outputDir: require('node:path').dirname(outputPath),
          templateOverride,
          platform: 'ios',
        });

        if (result.screenshots.length === 0) {
          return { content: [{ type: 'text' as const, text: 'No screenshots generated.' }] };
        }

        const first = result.screenshots[0]!;
        return {
          content: [{
            type: 'text' as const,
            text: `Preview rendered: ${first.outputPath} (${first.width}x${first.height})`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Preview failed: ${message}` }] };
      }
    },
  );
}
