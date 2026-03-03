import { Command } from 'commander';
import { resolve } from 'node:path';
import chalk from 'chalk';
import { generateKoubouConfig, detectKoubou, mapSizeToKoubou } from '@appframe/core';

interface KoubouConfigOptions {
  config: string;
  size?: string;
  screen?: string;
}

export const koubouConfigCommand = new Command('koubou-config')
  .description('Output the translated Koubou YAML config (for debugging)')
  .option('-c, --config <path>', 'Path to config file', 'appframe.yml')
  .option('-s, --size <size>', 'Output size (e.g., 6.7, 6.5, iPhone6_7)')
  .option('-n, --screen <index>', 'Only output config for a single screen (0-based index)')
  .action(async (options: KoubouConfigOptions) => {
    const configPath = resolve(options.config);

    // Show Koubou status
    const detection = await detectKoubou();
    if (detection.available) {
      console.error(chalk.green(`Koubou detected: v${detection.version} at ${detection.binaryPath}`));
    } else {
      console.error(chalk.yellow('Koubou not installed. Config will be generated but cannot be rendered.'));
      console.error(chalk.dim('Install with: pip install koubou'));
    }
    console.error();

    // Resolve size
    let outputSize = options.size;
    if (outputSize && !outputSize.startsWith('iPhone') && !outputSize.startsWith('iPad')) {
      outputSize = mapSizeToKoubou(parseFloat(outputSize)) ?? undefined;
    }

    // Resolve screen index
    const screenIndex = options.screen !== undefined ? parseInt(options.screen, 10) : undefined;
    if (screenIndex !== undefined && (isNaN(screenIndex) || screenIndex < 0)) {
      console.error(chalk.red('--screen must be a non-negative integer'));
      process.exit(1);
    }

    try {
      const yaml = await generateKoubouConfig(configPath, outputSize ?? undefined, screenIndex);
      // Output YAML to stdout (messages go to stderr so piping works)
      console.log(yaml);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(chalk.red(`Failed: ${message}`));
      process.exit(1);
    }
  });
