import { execFile } from 'node:child_process';
import { writeFile, mkdir, stat, readdir, unlink, rename, rm } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { promisify } from 'node:util';
import { stringify } from 'yaml';
import { loadConfig } from '../config/loader.js';
import { detectKoubou } from './detector.js';
import { translateConfig, translateConfigWithLocale, mapSizeToKoubou } from './translator.js';
import { KOUBOU_DIMENSIONS } from './types.js';
import type { KoubouConfig } from './types.js';
import type { AppframeConfig } from '../config/schema.js';
import type { GenerateOptions, GenerateResult, RenderResult } from '../renderer/types.js';

const execFileAsync = promisify(execFile);

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

async function runKou(
  binaryPath: string,
  configPath: string,
): Promise<void> {
  await execFileAsync(binaryPath, ['generate', configPath], {
    timeout: 300_000, // 5 minutes for large batches
  });
}

// Recursively find all PNG files under a directory
// Koubou nests output inside a device-named subdirectory
async function collectOutputFiles(
  dir: string,
): Promise<Array<{ path: string; name: string; fileSize: number }>> {
  const results: Array<{ path: string; name: string; fileSize: number }> = [];

  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const entryStat = await stat(fullPath);

    if (entryStat.isDirectory()) {
      const nested = await collectOutputFiles(fullPath);
      results.push(...nested);
    } else if (entry.endsWith('.png')) {
      results.push({ path: fullPath, name: entry, fileSize: entryStat.size });
    }
  }

  // Sort by filename so output order matches screen order
  results.sort((a, b) => a.name.localeCompare(b.name));
  return results;
}

function getLocalesToGenerate(config: AppframeConfig, filterLocale?: string): string[] {
  if (filterLocale) return [filterLocale];
  if (!config.locales || Object.keys(config.locales).length === 0) return ['default'];
  return ['default', ...Object.keys(config.locales)];
}

export async function generateWithKoubou(options: GenerateOptions): Promise<GenerateResult> {
  const startTime = Date.now();

  // Detect Koubou
  const detection = await detectKoubou();
  if (!detection.available || !detection.binaryPath) {
    throw new Error(
      'Koubou (kou) not found. Install it with: pip install koubou\n' +
      'Or use --renderer playwright to use the default renderer.',
    );
  }

  const config = await loadConfig(options.configPath);
  const configDir = dirname(resolve(options.configPath));
  const baseOutputDir = options.outputDir ?? join(configDir, config.output.directory);
  await mkdir(baseOutputDir, { recursive: true });

  // Determine iOS sizes to generate
  const iosSizes = config.output.ios?.sizes ?? [6.7, 6.5];
  const koubouSizes = iosSizes
    .map(size => ({ original: size, koubou: mapSizeToKoubou(size) }))
    .filter((s): s is { original: number; koubou: string } => s.koubou !== null);

  if (koubouSizes.length === 0) {
    throw new Error('No compatible Koubou output sizes found for the configured iOS sizes.');
  }

  // Filter to requested platform (Koubou only supports iOS)
  if (options.platform && options.platform !== 'all' && options.platform !== 'ios') {
    throw new Error(
      `Koubou renderer only supports iOS. Got platform: ${options.platform}\n` +
      'Use --renderer playwright for Android screenshots.',
    );
  }

  const locales = getLocalesToGenerate(config, options.locale);

  const totalSteps = koubouSizes.length * locales.length;
  let currentStep = 0;
  const allResults: RenderResult[] = [];

  for (const { original: sizeKey, koubou: outputSize } of koubouSizes) {
    const dims = KOUBOU_DIMENSIONS[outputSize];
    if (!dims) continue;

    for (const locale of locales) {
      currentStep++;

      // Create a temp output dir for this Koubou run
      const runId = `kou_${outputSize}_${locale}_${Date.now()}`;
      const tempOutputDir = join(baseOutputDir, `.tmp_${runId}`);
      await mkdir(tempOutputDir, { recursive: true });

      // Build Koubou config — either default locale or localized
      let koubouConfig: KoubouConfig;

      if (locale !== 'default' && config.locales?.[locale]) {
        const localeOverrides = config.locales[locale]!.screens.map(s => ({
          headline: s.headline,
          subtitle: s.subtitle,
        }));
        koubouConfig = translateConfigWithLocale(
          { config, configDir, outputSize, outputDir: tempOutputDir },
          locale,
          localeOverrides,
        );
      } else {
        koubouConfig = translateConfig({
          config,
          configDir,
          outputSize,
          outputDir: tempOutputDir,
        });
      }

      // If filtering to a single screen, only include that screen in the config
      if (options.screenIndex !== undefined) {
        const keys = Object.keys(koubouConfig.screenshots);
        const targetKey = keys[options.screenIndex];
        if (targetKey) {
          koubouConfig.screenshots = { [targetKey]: koubouConfig.screenshots[targetKey]! };
        }
      }

      // Write temp config YAML
      const configPath = join(baseOutputDir, `.tmp_${runId}.yaml`);
      const yamlContent = stringify(koubouConfig);
      await writeFile(configPath, yamlContent, 'utf-8');

      const screenCount = Object.keys(koubouConfig.screenshots).length;
      const sizeName = `${sizeKey}"`;
      options.onProgress?.(currentStep, totalSteps, `Koubou: ${screenCount} screens @ ${sizeName} (${locale})`);

      // Run Koubou
      try {
        await runKou(detection.binaryPath, configPath);
      } catch (err) {
        // Clean up and re-throw
        try { await unlink(configPath); } catch { /* ignore */ }
        const message = err instanceof Error ? err.message : 'Unknown error';
        throw new Error(`Koubou generation failed: ${message}`);
      }

      // Collect output files and rename to appframe convention
      const outputFiles = await collectOutputFiles(tempOutputDir);
      const screenKeys = Object.keys(koubouConfig.screenshots);

      for (let i = 0; i < outputFiles.length && i < screenKeys.length; i++) {
        const file = outputFiles[i]!;
        const screenIdx = options.screenIndex ?? i;
        const appframeName = `${sanitizeFilename(config.app.name)}_ios_${outputSize}_${locale}_${screenIdx + 1}.png`;
        const finalPath = join(baseOutputDir, appframeName);

        await rename(file.path, finalPath);

        allResults.push({
          outputPath: finalPath,
          width: dims.width,
          height: dims.height,
          fileSize: file.fileSize,
        });
      }

      // Clean up temp files
      try { await unlink(configPath); } catch { /* ignore */ }
      try { await rm(tempOutputDir, { recursive: true, force: true }); } catch { /* ignore */ }
    }
  }

  return {
    screenshots: allResults,
    totalTime: Date.now() - startTime,
  };
}

// Generate just the Koubou YAML config without rendering (for debugging / `appframe koubou-config`)
export async function generateKoubouConfig(
  configPath: string,
  outputSize?: string,
): Promise<string> {
  const config = await loadConfig(configPath);
  const configDir = dirname(resolve(configPath));

  const size = outputSize ?? mapSizeToKoubou(config.output.ios?.sizes?.[0] ?? 6.7) ?? 'iPhone6_7';

  const koubouConfig = translateConfig({
    config,
    configDir,
    outputSize: size,
    outputDir: './output',
  });

  return stringify(koubouConfig);
}
