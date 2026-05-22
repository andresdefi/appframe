import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { AppframeClient } from '../client.js';

// What every tool handler is given. Just the HTTP client today; if a
// future tool needs session state (e.g. last-seen-slug heuristics) it
// goes here so handlers stay easy to test.
export interface ToolHandlerContext {
  client: AppframeClient;
}

// Content items the SDK supports inside a tool result. Text is the
// common case; image is used for render_preview (PNG snapshot of a
// screen) where the agent benefits from actually seeing the result
// rather than parsing a data-url string. `data` is base64-encoded
// without the `data:image/...;base64,` prefix.
export type ToolContentItem =
  | { type: 'text'; text: string }
  | { type: 'image'; mimeType: string; data: string };

// Shape the MCP SDK expects back from tools/call. `isError: true` makes
// the SDK report the failure to the agent without the agent having to
// parse a sentinel.
export interface ContentResult {
  content: ToolContentItem[];
  isError?: boolean;
}

export type ToolHandler = (
  args: unknown,
  ctx: ToolHandlerContext,
) => Promise<ContentResult>;

// Co-locate descriptor + handler so they can't drift. Each category
// module exports a `xxxTools: ToolDefinition[]` and server.ts only
// needs to concatenate.
export interface ToolDefinition {
  descriptor: Tool;
  handler: ToolHandler;
}
