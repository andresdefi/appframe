import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { AppframeClient, AppframeClientError } from './client.js';
import { ALL_TOOLS } from './tools/index.js';

export interface CreateAppframeMcpServerOptions {
  baseUrl?: string;
}

export function createAppframeMcpServer(
  options: CreateAppframeMcpServerOptions = {},
): Server {
  const client = new AppframeClient({ baseUrl: options.baseUrl });

  // O(1) lookup. Built once at construction — the tool list never
  // changes at runtime.
  const toolMap = new Map(ALL_TOOLS.map((t) => [t.descriptor.name, t]));

  const server = new Server(
    { name: 'appframe-mcp', version: '0.1.0' },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: ALL_TOOLS.map((t) => t.descriptor),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request): Promise<{
    content: (
      | { type: 'text'; text: string }
      | { type: 'image'; mimeType: string; data: string }
    )[];
    isError?: boolean;
  }> => {
    const def = toolMap.get(request.params.name);
    if (!def) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Unknown tool: ${request.params.name}` }],
      };
    }
    try {
      return await def.handler(request.params.arguments, { client });
    } catch (err) {
      const message =
        err instanceof AppframeClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : String(err);
      return { isError: true, content: [{ type: 'text', text: message }] };
    }
  });

  return server;
}
