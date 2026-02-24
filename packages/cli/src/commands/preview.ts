import { Command } from 'commander';
import { resolve } from 'node:path';
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

    console.log(chalk.blue('Starting appframe preview server...\n'));

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
