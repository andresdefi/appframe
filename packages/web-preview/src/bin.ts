#!/usr/bin/env node
import { startPreviewServer } from './server.js';

interface ParsedArgs {
  config?: string;
  port?: number;
  host?: string;
}

function parseArgs(argv: string[]): ParsedArgs {
  const out: ParsedArgs = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];
    if ((arg === '-c' || arg === '--config') && next) {
      out.config = next;
      i++;
    } else if (arg === '--port' && next) {
      out.port = parseInt(next, 10);
      i++;
    } else if (arg === '--host' && next) {
      out.host = next;
      i++;
    } else if (arg === '-h' || arg === '--help') {
      console.log(
        'Usage: appframe-preview [options]\n\n' +
          'Options:\n' +
          '  -c, --config <path>   Path to config file\n' +
          '      --port <port>     Port for preview server (default: 4400)\n' +
          '      --host <host>     Interface to bind on (default: 127.0.0.1).\n' +
          '                        Pass 0.0.0.0 to expose to the LAN.\n' +
          '                        Also reads APPFRAME_HOST.\n' +
          '  -h, --help            Show this help',
      );
      process.exit(0);
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

startPreviewServer({
  configPath: args.config,
  port: args.port ?? 4400,
  host: args.host ?? process.env.APPFRAME_HOST,
}).catch((err: unknown) => {
  const message = err instanceof Error ? err.message : 'Unknown error';
  console.error(`Failed to start preview server: ${message}`);
  process.exit(1);
});
