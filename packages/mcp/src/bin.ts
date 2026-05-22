#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createAppframeMcpServer } from './server.js';
import { AppframeClient } from './client.js';

// Read our own version so the startup handshake can compare against
// the preview server. Out-of-step versions are the kind of bug whose
// symptoms (mystery 404s, wrong field shapes) are far harder to debug
// than a clear "your packages don't match" warning at boot.
const __dirname = dirname(fileURLToPath(import.meta.url));
function readOwnVersion(): string {
  try {
    const pkgPath = resolve(__dirname, '..', 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version?: string };
    return pkg.version ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

function majorOf(version: string): string {
  return version.split('.')[0] ?? '0';
}

// Best-effort version probe. Doesn't block startup — if the preview
// server isn't running yet, the MCP still comes up and the first tool
// call surfaces a clear "couldn't reach" error.
async function probeVersion(client: AppframeClient, ownVersion: string): Promise<void> {
  try {
    const remote = await client.serverVersion();
    if (majorOf(remote.version) !== majorOf(ownVersion)) {
      // stderr so MCP stdio JSON-RPC stays clean.
      process.stderr.write(
        `[appframe-mcp] version mismatch: MCP=${ownVersion}, preview server=${remote.version}. ` +
          'Major-version skew may break tool calls — update both packages to the same release.\n',
      );
    }
  } catch {
    // Preview server unreachable. Silent — first tool call surfaces it.
  }
}

async function main(): Promise<void> {
  const baseUrl = process.env.APPFRAME_PREVIEW_URL;
  const server = createAppframeMcpServer(baseUrl ? { baseUrl } : {});
  const ownVersion = readOwnVersion();
  // Fire-and-forget — doesn't block startup.
  void probeVersion(new AppframeClient(baseUrl ? { baseUrl } : {}), ownVersion);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  process.stderr.write(`[appframe-mcp] fatal: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
