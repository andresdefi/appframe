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
    console.log(chalk.dim(`  Config: ${configPath}`));
    console.log(chalk.dim(`  Port:   ${port}`));
    console.log();

    // TODO: Web preview implementation (Phase 8)
    console.log(chalk.yellow('Web preview not yet implemented (Phase 8).'));
    console.log(chalk.dim('For now, use "appframe generate" to render screenshots directly.'));
  });
