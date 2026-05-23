import type { ContentResult, ToolDefinition } from './types.js';
import { annotationTools } from './annotation.js';
import { assetTools } from './asset.js';
import { calloutTools } from './callout.js';
import { discoveryTools } from './discovery.js';
import { localeTools } from './locale.js';
import { overlayTools } from './overlay.js';
import { projectTools } from './project.js';
import { screenLifecycleTools } from './screen-lifecycle.js';
import { screenTools } from './screen.js';
import { screenTextTools } from './screen-text.js';
import { screenDeviceTools } from './screen-device.js';
import { screenBackgroundTools } from './screen-background.js';
import { screenEffectsTools } from './screen-effects.js';
import { screenLayoutTools } from './screen-layout.js';
import { variantTools } from './variant.js';
import { isRecord, jsonContent, requireRecord } from './helpers.js';

const NON_BATCH_TOOLS: ToolDefinition[] = [
  ...discoveryTools,
  ...projectTools,
  ...localeTools,
  ...variantTools,
  ...screenTools,
  ...screenTextTools,
  ...screenDeviceTools,
  ...screenBackgroundTools,
  ...screenEffectsTools,
  ...screenLayoutTools,
  ...screenLifecycleTools,
  ...calloutTools,
  ...annotationTools,
  ...overlayTools,
  ...assetTools,
];

// Generic batch dispatch — runs N tool calls in one stdio round-trip.
// Each result is paired with its tool name + ordinal so the agent can
// associate them even if some fail. `batch` itself is excluded from
// the lookup so a malformed agent can't recurse into infinite nesting.
const batchTool: ToolDefinition = {
  descriptor: {
    name: 'batch',
    description:
      'Run multiple tools in one stdio round-trip. `ops` is an array of ' +
      '`{ tool, args }` entries. Each runs in order (sequentially) and ' +
      'its result is collected into the response. If one entry throws, ' +
      'the error is recorded and the batch continues (no all-or-nothing ' +
      'semantics — use `batch_patch_screens` for atomic disk writes). ' +
      'Use when you have a chain of independent reads (e.g. ' +
      'list_projects + get_overview + list_fonts) and want one ' +
      'round-trip instead of N. `batch` cannot call itself.',
    inputSchema: {
      type: 'object',
      required: ['ops'],
      properties: {
        ops: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['tool'],
            properties: {
              tool: { type: 'string', minLength: 1 },
              args: { type: 'object' },
            },
            additionalProperties: false,
          },
        },
      },
      additionalProperties: false,
    },
  },
  handler: async (args, ctx) => {
    const a = requireRecord(args, 'batch');
    const { ops } = a;
    if (!Array.isArray(ops) || ops.length === 0) {
      throw new Error('`ops` must be a non-empty array');
    }
    const lookup = new Map(NON_BATCH_TOOLS.map((t) => [t.descriptor.name, t]));
    const results: Array<{ tool: string; ok: boolean; result?: unknown; error?: string }> = [];
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      if (!isRecord(op) || typeof op.tool !== 'string') {
        results.push({ tool: '(invalid)', ok: false, error: 'each op needs `tool: string`' });
        continue;
      }
      const tool = lookup.get(op.tool);
      if (!tool) {
        results.push({ tool: op.tool, ok: false, error: `unknown tool "${op.tool}"` });
        continue;
      }
      try {
        const r = await tool.handler(op.args ?? {}, ctx);
        results.push({ tool: op.tool, ok: true, result: r });
      } catch (err) {
        results.push({
          tool: op.tool,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
    return jsonContent({ results }) as ContentResult;
  },
};

// Order is purely cosmetic for tools/list responses. Group by domain so
// MCP clients that surface the catalog see a logical ordering. `batch`
// goes last because it's a meta-tool.
export const ALL_TOOLS: ToolDefinition[] = [...NON_BATCH_TOOLS, batchTool];

export type { ContentResult, ToolDefinition, ToolHandler, ToolHandlerContext } from './types.js';
