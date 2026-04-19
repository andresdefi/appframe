import { Command } from 'commander';
import { readdir, stat } from 'node:fs/promises';
import { join, resolve, extname } from 'node:path';
import chalk from 'chalk';
import { runAutopilotPipeline } from '@appframe/mcp-server/autopilot';

interface AutopilotOptions {
  screenshots: string;
  appName: string;
  appDescription: string;
  features?: string[];
  platforms?: string[];
  goals?: string[];
  locale?: string;
  variantCount: string;
  screenCount?: string;
  outputDir?: string;
  port?: string;
  noOpen?: boolean;
}

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

async function collectScreenshotPaths(input: string): Promise<string[]> {
  const resolved = resolve(input);
  const info = await stat(resolved);
  if (info.isFile()) {
    if (!IMAGE_EXTS.has(extname(resolved).toLowerCase())) {
      throw new Error(`Not a supported image: ${resolved}`);
    }
    return [resolved];
  }
  if (!info.isDirectory()) {
    throw new Error(`Not a file or directory: ${resolved}`);
  }
  const entries = await readdir(resolved);
  const files = entries
    .filter((name) => IMAGE_EXTS.has(extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map((name) => join(resolved, name));
  if (files.length === 0) {
    throw new Error(`No supported images found in ${resolved}`);
  }
  return files;
}

export const autopilotCommand = new Command('autopilot')
  .description('Analyze raw screenshots, plan 4 concept variants (2 individual + 2 panoramic), render previews, and open the web preview for review.')
  .requiredOption('-s, --screenshots <path>', 'File or directory of raw screenshots (PNG/JPG)')
  .requiredOption('-n, --app-name <name>', 'App name shown in the layout')
  .requiredOption('-d, --app-description <text>', 'Short product description used by copy planning')
  .option('-f, --features <features...>', 'Prioritized features (space-separated, each in quotes)')
  .option('-p, --platforms <platforms...>', 'Target platforms (ios or android)', ['ios'])
  .option('-g, --goals <goals...>', 'Optional marketing goals')
  .option('-l, --locale <code>', 'Optional target locale for deterministic copy generation')
  .option('--variant-count <n>', 'Number of concepts to produce (3-5)', '4')
  .option('--screen-count <n>', 'Number of screens per concept (defaults to screenshot count)')
  .option('-o, --output-dir <path>', 'Output directory for autopilot artifacts')
  .option('--port <n>', 'Preview server port', '4400')
  .option('--no-open', 'Skip opening the web preview after the pipeline completes')
  .action(async (options: AutopilotOptions) => {
    const variantCount = Number.parseInt(options.variantCount, 10);
    if (!Number.isFinite(variantCount) || variantCount < 3 || variantCount > 5) {
      console.log(chalk.red('--variant-count must be between 3 and 5.'));
      process.exit(1);
    }
    const screenCount = options.screenCount ? Number.parseInt(options.screenCount, 10) : undefined;
    if (screenCount !== undefined && (!Number.isFinite(screenCount) || screenCount < 3 || screenCount > 10)) {
      console.log(chalk.red('--screen-count must be between 3 and 10.'));
      process.exit(1);
    }
    const port = Number.parseInt(options.port ?? '4400', 10);
    if (!Number.isFinite(port) || port < 1 || port > 65535) {
      console.log(chalk.red('--port must be between 1 and 65535.'));
      process.exit(1);
    }

    const platforms = (options.platforms ?? ['ios']).filter(
      (value): value is 'ios' | 'android' => value === 'ios' || value === 'android',
    );
    if (platforms.length === 0) {
      console.log(chalk.red('--platforms must include at least one of: ios, android.'));
      process.exit(1);
    }

    const features = options.features && options.features.length > 0
      ? options.features
      : ['Core workflow', 'Key feature', 'Differentiator'];

    let screenshotPaths: string[];
    try {
      screenshotPaths = await collectScreenshotPaths(options.screenshots);
    } catch (err) {
      console.log(chalk.red(err instanceof Error ? err.message : 'Failed to read screenshots'));
      process.exit(1);
    }

    console.log(chalk.blue(`Running autopilot for ${chalk.bold(options.appName)}...`));
    console.log(chalk.dim(`  Screenshots: ${screenshotPaths.length} from ${resolve(options.screenshots)}`));
    console.log(chalk.dim(`  Concepts: ${variantCount} (guaranteed 2 individual + 2 panoramic at 4)`));
    console.log(chalk.dim(`  Platforms: ${platforms.join(', ')}`));
    console.log(chalk.dim(`  Preview: ${options.noOpen ? 'skipped' : `http://localhost:${port}`}\n`));

    try {
      const status = await runAutopilotPipeline({
        appName: options.appName,
        appDescription: options.appDescription,
        platforms,
        features,
        goals: options.goals,
        locale: options.locale,
        screenshots: screenshotPaths.map((path) => ({ path })),
        variantCount,
        screenCount,
        outputDir: options.outputDir ? resolve(options.outputDir) : undefined,
        openPreview: options.noOpen ? false : true,
        previewPort: port,
      });

      if (status.status === 'failed' || status.failure) {
        const stage = status.failure?.stage ?? 'unknown';
        const message = status.failure?.message ?? 'unknown error';
        console.log(chalk.red(`\nAutopilot failed during ${stage}: ${message}`));
        process.exit(1);
      }

      const result = status.result;
      if (!result) {
        console.log(chalk.yellow('\nAutopilot completed without a result payload.'));
        return;
      }

      console.log(chalk.green(`\nDone.`));
      console.log(`  Session: ${chalk.dim(result.sessionPath)}`);
      console.log(`  Manifest: ${chalk.dim(result.materializedManifestPath)}`);
      if (result.recommendedVariantId) {
        console.log(`  Recommended: ${chalk.cyan(result.recommendedVariantId)} — ${chalk.dim(result.recommendationReason ?? '')}`);
      }
      if (result.previewUrl) {
        console.log(`  ${chalk.bold('Preview:')} ${chalk.cyan(result.previewUrl)}`);
        console.log(chalk.dim(`  Open the URL, pick a variant, fine-tune in the UI, then export from the Download tab.`));
      } else if (!options.noOpen) {
        console.log(chalk.yellow('  Preview did not auto-open. Run:'));
        console.log(chalk.dim(`    ${result.previewCommand}`));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.log(chalk.red(`\nAutopilot error: ${message}`));
      process.exit(1);
    }
  });
