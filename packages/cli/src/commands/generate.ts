import { Command } from 'commander';
import { resolve } from 'node:path';
import chalk from 'chalk';
import { loadConfig, generateScreenshots, generateWithKoubou, detectKoubou } from '@appframe/core';

interface GenerateOptions {
  config: string;
  platform?: string;
  locale?: string;
  screen?: string;
  output?: string;
  template?: string;
  renderer?: string;
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
  .option('-r, --renderer <renderer>', 'Renderer to use (playwright, koubou, auto)', 'auto')
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
        : config.locales
          ? Object.keys(config.locales)
          : ['default'];

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

    // Resolve renderer
    const renderer = await resolveRenderer(options.renderer ?? 'auto');

    console.log(chalk.blue(`Generating screenshots for ${chalk.bold(config.app.name)}...`));
    console.log(chalk.dim(`  Renderer: ${renderer}\n`));

    const startTime = Date.now();

    try {
      const generateFn = renderer === 'koubou' ? generateWithKoubou : generateScreenshots;

      const result = await generateFn({
        configPath,
        platform: options.platform,
        locale: options.locale,
        screenIndex: options.screen !== undefined ? parseInt(options.screen, 10) : undefined,
        outputDir: options.output ? resolve(options.output) : undefined,
        templateOverride: options.template,
        onProgress: (current, total, name) => {
          const pct = Math.round((current / total) * 100);
          process.stdout.write(`\r  ${chalk.dim(`[${pct}%]`)} Rendering ${chalk.cyan(name)}...`);
        },
      });

      console.log('\n');

      for (const screenshot of result.screenshots) {
        const sizeKb = Math.round(screenshot.fileSize / 1024);
        console.log(`  ${chalk.green('+')} ${screenshot.outputPath} ${chalk.dim(`(${screenshot.width}x${screenshot.height}, ${sizeKb}KB)`)}`);
      }

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(chalk.green(`\nDone! ${result.screenshots.length} screenshots generated in ${elapsed}s.`));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.log(chalk.red(`\nGeneration failed: ${message}`));
      process.exit(1);
    }
  });

async function resolveRenderer(requested: string): Promise<'playwright' | 'koubou'> {
  if (requested === 'playwright') return 'playwright';
  if (requested === 'koubou') return 'koubou';

  // Auto-detect: prefer Koubou if available
  if (requested === 'auto') {
    const detection = await detectKoubou();
    if (detection.available) {
      return 'koubou';
    }
    return 'playwright';
  }

  console.log(chalk.yellow(`Unknown renderer "${requested}", falling back to playwright.`));
  return 'playwright';
}
