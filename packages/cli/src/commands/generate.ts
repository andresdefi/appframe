import { Command } from 'commander';
import { resolve } from 'node:path';
import chalk from 'chalk';
import { loadConfig } from '@appframe/core';

interface GenerateOptions {
  config: string;
  platform?: string;
  locale?: string;
  screen?: string;
  output?: string;
  template?: string;
  dryRun?: boolean;
}

export const generateCommand = new Command('generate')
  .description('Generate screenshots from config')
  .option('-c, --config <path>', 'Path to config file', 'appframe.yml')
  .option('-p, --platform <platform>', 'Filter by platform (ios, android, all)')
  .option('-l, --locale <code>', 'Filter by locale')
  .option('-s, --screen <index>', 'Generate a single screen by index')
  .option('-o, --output <dir>', 'Override output directory')
  .option('-t, --template <name>', 'Override template for all screens')
  .option('--dry-run', 'Show what would be generated without rendering')
  .action(async (options: GenerateOptions) => {
    const configPath = resolve(options.config);

    let config;
    try {
      config = await loadConfig(configPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.log(chalk.red(message));
      process.exit(1);
    }

    if (options.dryRun) {
      console.log(chalk.blue('Dry run — would generate:\n'));

      const platforms = options.platform && options.platform !== 'all'
        ? [options.platform]
        : config.output.platforms;

      const locales = options.locale
        ? [options.locale]
        : ['default', ...Object.keys(config.locales ?? {})];

      const screens = options.screen !== undefined
        ? [config.screens[parseInt(options.screen, 10)]]
        : config.screens;

      let count = 0;
      for (const platform of platforms) {
        for (const locale of locales) {
          for (let i = 0; i < screens.length; i++) {
            const screen = screens[i];
            if (!screen) continue;
            const name = `${config.app.name}_${platform}_${locale}_${i + 1}.png`;
            console.log(`  ${chalk.dim(name)} — "${screen.headline}"`);
            count++;
          }
        }
      }

      console.log(chalk.dim(`\n${count} screenshots would be generated.`));
      return;
    }

    // TODO: Rendering pipeline (Phase 5)
    console.log(chalk.yellow('Rendering engine not yet implemented (Phase 5).'));
    console.log(chalk.dim(`Config loaded: ${config.app.name} — ${config.screens.length} screens`));
  });
