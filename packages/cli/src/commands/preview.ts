import { Command } from 'commander';
import { resolve } from 'node:path';
import { createServer } from 'node:net';
import chalk from 'chalk';

interface PreviewOptions {
  config: string;
  port: string;
}

export const previewCommand = new Command('preview')
  .description('Open web preview for tweaking screenshots')
  .option('-c, --config <path>', 'Path to config file', 'appframe.yml')
  .option('--port <port>', 'Port for preview server', '4400')
  .action(async (options: PreviewOptions) => {
    const configPath = resolve(options.config);
    const port = parseInt(options.port, 10);

    if (Number.isNaN(port) || port < 1 || port > 65535) {
      console.log(chalk.red(`Invalid port "${options.port}". Must be a number between 1 and 65535.`));
      process.exit(1);
    }

    console.log(chalk.blue('Starting appframe preview server...\n'));

    // Check if the port is already in use
    const portInUse = await new Promise<boolean>((resolve) => {
      const server = createServer();
      server.once('error', () => resolve(true));
      server.once('listening', () => {
        server.close(() => resolve(false));
      });
      server.listen(port);
    });

    if (portInUse) {
      console.log(chalk.red(`Port ${port} is already in use.`));
      console.log(chalk.dim(`Try a different port with: appframe preview --port <other>`));
      process.exit(1);
    }

    try {
      const { startPreviewServer } = await import('@appframe/web-preview');
      await startPreviewServer({ configPath, port });

      console.log();
      console.log(chalk.green(`  Preview: http://localhost:${port}`));
      console.log(chalk.dim('  Press Ctrl+C to stop.\n'));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.log(chalk.red(`Failed to start preview server: ${message}`));
      process.exit(1);
    }
  });
