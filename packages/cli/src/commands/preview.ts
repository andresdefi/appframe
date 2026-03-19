import { Command } from 'commander';
import { resolve } from 'node:path';
import { createServer } from 'node:net';
import chalk from 'chalk';

interface PreviewOptions {
  config?: string;
  session?: string;
  port: string;
}

interface PortProbeResult {
  available: boolean;
  error?: NodeJS.ErrnoException;
}

async function probePort(port: number): Promise<PortProbeResult> {
  return new Promise((resolve) => {
    const server = createServer();
    server.once('error', (error: NodeJS.ErrnoException) => {
      resolve({ available: false, error });
    });
    server.once('listening', () => {
      server.close(() => resolve({ available: true }));
    });
    server.listen(port);
  });
}

export const previewCommand = new Command('preview')
  .description('Open web preview for tweaking screenshots')
  .option('-c, --config <path>', 'Path to config file')
  .option('-s, --session <path>', 'Path to variant session file (.variants.session.json)')
  .option('--port <port>', 'Port for preview server', '4400')
  .action(async (options: PreviewOptions) => {
    const configPath = options.config ? resolve(options.config) : undefined;
    const sessionPath = options.session ? resolve(options.session) : undefined;
    const port = parseInt(options.port, 10);

    if (Number.isNaN(port) || port < 1 || port > 65535) {
      console.log(chalk.red(`Invalid port "${options.port}". Must be a number between 1 and 65535.`));
      process.exit(1);
    }

    if (configPath) {
      console.log(chalk.blue('Starting appframe preview server...\n'));
    } else {
      console.log(chalk.blue('Starting appframe preview server with default config...\n'));
    }

    const portProbe = await probePort(port);

    if (!portProbe.available && portProbe.error?.code === 'EADDRINUSE') {
      console.log(chalk.red(`Port ${port} is already in use.`));
      console.log(chalk.dim(`Try a different port with: appframe preview --port <other>`));
      process.exit(1);
    }

    if (!portProbe.available) {
      const reason = portProbe.error?.message ?? 'Unknown error';
      console.log(chalk.red(`Failed to bind preview server on port ${port}: ${reason}`));
      process.exit(1);
    }

    try {
      const { startPreviewServer } = await import('@appframe/web-preview');
      await startPreviewServer({ configPath, sessionPath, port });

      console.log();
      console.log(chalk.green(`  Preview: http://localhost:${port}`));
      console.log(chalk.dim('  Press Ctrl+C to stop.\n'));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.log(chalk.red(`Failed to start preview server: ${message}`));
      process.exit(1);
    }
  });
