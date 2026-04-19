import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerConfigTools } from './config-tools.js';
import { registerGenerateTools } from './generate-tools.js';
import { registerFrameTools } from './frame-tools.js';
import { registerUploadTools } from './upload-tools.js';

export function registerTools(server: McpServer): void {
  registerConfigTools(server);
  registerGenerateTools(server);
  registerFrameTools(server);
  registerUploadTools(server);
}
