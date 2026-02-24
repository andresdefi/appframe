import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { listFrames } from '@appframe/core';

export function registerFrameTools(server: McpServer): void {
  server.tool(
    'appframe_list_frames',
    'List all available device frames with their specifications',
    {},
    async () => {
      try {
        const frames = await listFrames();
        const lines = frames.map((f) =>
          `  ${f.id} — ${f.name} (${f.year}) | Screen: ${f.screenResolution.width}x${f.screenResolution.height} | Platform: ${f.platform}${f.tags.length > 0 ? ` | Tags: ${f.tags.join(', ')}` : ''}`
        );

        return {
          content: [{
            type: 'text' as const,
            text: `Available device frames (${frames.length}):\n\n${lines.join('\n')}`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Error: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_list_templates',
    'List all available screenshot template styles with descriptions',
    {},
    async () => {
      const templates = [
        { id: 'minimal', name: 'Minimal', description: 'Apple-clean style: light backgrounds, thin fonts, lots of whitespace, subtle shadows' },
        { id: 'bold', name: 'Bold', description: 'Vibrant & energetic: strong gradients, large heavy typography, saturated colors, high contrast' },
        { id: 'dark', name: 'Dark', description: 'Premium & sleek: dark backgrounds, glowing accents, subtle grid pattern, luminous effects' },
        { id: 'playful', name: 'Playful', description: 'Fun & colorful: bright colors, decorative shapes, tilted devices, rounded feel' },
      ];

      const lines = templates.map((t) => `  ${t.id} — ${t.name}: ${t.description}`);

      return {
        content: [{
          type: 'text' as const,
          text: `Available templates:\n\n${lines.join('\n')}\n\nLayouts available for all templates: center, left, right, angled-left, angled-right, floating`,
        }],
      };
    },
  );
}
