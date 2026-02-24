import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getUploadPlan, uploadScreenshots } from '@appframe/store-upload';

export function registerUploadTools(server: McpServer): void {
  server.tool(
    'appframe_upload_plan',
    'Show what screenshots would be uploaded to the stores. Use this before appframe_upload to preview the plan.',
    {
      configPath: z.string().describe('Absolute path to the appframe.yml config file'),
      platform: z.enum(['ios', 'android']).optional().describe('Filter by platform'),
      locale: z.string().optional().describe('Filter by locale'),
    },
    async ({ configPath, platform, locale }) => {
      try {
        const plans = await getUploadPlan({
          configPath,
          platform,
          locale,
        });

        if (plans.length === 0) {
          return {
            content: [{
              type: 'text' as const,
              text: 'No screenshots found. Run appframe_generate first.',
            }],
          };
        }

        const lines = plans.map((p) => {
          const files = p.files.map((f) => `    ${f}`).join('\n');
          return `  ${p.platform} / ${p.locale} / ${p.displayType} (${p.files.length} files)\n${files}`;
        });

        const total = plans.reduce((sum, p) => sum + p.files.length, 0);

        return {
          content: [{
            type: 'text' as const,
            text: `Upload plan (${total} screenshots):\n\n${lines.join('\n\n')}\n\nUse appframe_upload to execute. This will replace existing screenshots in the stores.`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Error: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_upload',
    'Upload generated screenshots to App Store Connect and/or Google Play Console. IMPORTANT: This replaces existing store screenshots. Always show the plan first and get user confirmation.',
    {
      configPath: z.string().describe('Absolute path to the appframe.yml config file'),
      platform: z.enum(['ios', 'android']).optional().describe('Upload to specific platform only'),
      locale: z.string().optional().describe('Upload specific locale only'),
    },
    async ({ configPath, platform, locale }) => {
      try {
        const summary = await uploadScreenshots({
          configPath,
          platform,
          locale,
        });

        const resultLines = summary.results.map((r) => {
          const status = r.errors.length > 0
            ? `${r.uploaded.length} uploaded, ${r.errors.length} failed`
            : `${r.uploaded.length} uploaded`;
          const errDetail = r.errors.length > 0
            ? `\n    Errors: ${r.errors.join(', ')}`
            : '';
          return `  ${r.platform} / ${r.locale} / ${r.displayType}: ${status}${errDetail}`;
        });

        const statusMsg = summary.totalErrors > 0
          ? `Completed with ${summary.totalErrors} errors.`
          : 'All screenshots uploaded successfully.';

        return {
          content: [{
            type: 'text' as const,
            text: `${statusMsg}\n\n${resultLines.join('\n')}\n\nTotal: ${summary.totalUploaded} uploaded.`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Upload failed: ${message}` }] };
      }
    },
  );
}
