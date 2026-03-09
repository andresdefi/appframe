import { execFile } from 'node:child_process';
import { writeFile, readFile, mkdir, stat, readdir, unlink, rename, rm } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';
import { stringify } from 'yaml';
import { loadConfig } from '../config/loader.js';
import { detectKoubou } from './detector.js';
import { translateConfig, translateConfigWithLocale, translateConfigWithLocalization, mapSizeToKoubou } from './translator.js';
import { KOUBOU_DIMENSIONS } from './types.js';
import type { KoubouConfig } from './types.js';
import type { AppframeConfig, TemplateStyle, LayoutVariant, TextGradient, SpotlightConfig, Annotation } from '../config/schema.js';
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

interface KoubouPipelineContext {
  binaryPath: string;
  config: AppframeConfig;
  configDir: string;
  baseOutputDir: string;
  koubouSizes: Array<{ original: number; koubou: string }>;
  options: GenerateOptions;
}

async function setupPipelineContext(options: GenerateOptions): Promise<KoubouPipelineContext> {
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

  const iosSizes = config.output.ios?.sizes ?? [6.7, 6.5];
  const koubouSizes = iosSizes
    .map(size => ({ original: size, koubou: mapSizeToKoubou(size) }))
    .filter((s): s is { original: number; koubou: string } => s.koubou !== null);

  if (koubouSizes.length === 0) {
    throw new Error('No compatible Koubou output sizes found for the configured iOS sizes.');
  }

  if (options.platform && options.platform !== 'all' && options.platform !== 'ios') {
    throw new Error(
      `Koubou renderer only supports iOS. Got platform: ${options.platform}\n` +
      'Use --renderer playwright for Android screenshots.',
    );
  }

  return { binaryPath: detection.binaryPath, config, configDir, baseOutputDir, koubouSizes, options };
}

// --- Inline locales mode (multi-pass, original behavior) ---

async function generateWithKoubouInlineLocales(ctx: KoubouPipelineContext): Promise<RenderResult[]> {
  const { binaryPath, config, configDir, baseOutputDir, koubouSizes, options } = ctx;
  const locales = getLocalesToGenerate(config, options.locale);

  const totalSteps = koubouSizes.length * locales.length;
  let currentStep = 0;
  const allResults: RenderResult[] = [];

  for (const { original: sizeKey, koubou: outputSize } of koubouSizes) {
    const dims = KOUBOU_DIMENSIONS[outputSize];
    if (!dims) continue;

    for (const locale of locales) {
      currentStep++;

      const runId = `kou_${outputSize}_${locale}_${Date.now()}`;
      const tempOutputDir = join(baseOutputDir, `.tmp_${runId}`);
      await mkdir(tempOutputDir, { recursive: true });

      let koubouConfig: KoubouConfig;

      if (locale !== 'default' && config.locales?.[locale]) {
        const localeOverrides = config.locales[locale]!.screens.map(s => ({
          headline: s.headline,
          subtitle: s.subtitle,
          screenshot: s.screenshot,
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

      if (options.screenIndex !== undefined) {
        const keys = Object.keys(koubouConfig.screenshots);
        const targetKey = keys[options.screenIndex];
        if (targetKey) {
          koubouConfig.screenshots = { [targetKey]: koubouConfig.screenshots[targetKey]! };
        }
      }

      const configPath = join(baseOutputDir, `.tmp_${runId}.yaml`);
      const yamlContent = stringify(koubouConfig);
      await writeFile(configPath, yamlContent, 'utf-8');

      const screenCount = Object.keys(koubouConfig.screenshots).length;
      const sizeName = `${sizeKey}"`;
      options.onProgress?.(currentStep, totalSteps, `Koubou: ${screenCount} screens @ ${sizeName} (${locale})`);

      try {
        await runKou(binaryPath, configPath);
      } catch (err) {
        try { await unlink(configPath); } catch { /* ignore */ }
        const message = err instanceof Error ? err.message : 'Unknown error';
        throw new Error(`Koubou generation failed: ${message}`);
      }

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

      try { await unlink(configPath); } catch { /* ignore */ }
      try { await rm(tempOutputDir, { recursive: true, force: true }); } catch { /* ignore */ }
    }
  }

  return allResults;
}

// --- Native localization mode (xcstrings, single-pass per size) ---

async function generateWithKoubouNativeLocalization(ctx: KoubouPipelineContext): Promise<RenderResult[]> {
  const { binaryPath, config, configDir, baseOutputDir, koubouSizes, options } = ctx;
  const localization = config.localization!;

  const totalSteps = koubouSizes.length;
  let currentStep = 0;
  const allResults: RenderResult[] = [];

  for (const { original: sizeKey, koubou: outputSize } of koubouSizes) {
    const dims = KOUBOU_DIMENSIONS[outputSize];
    if (!dims) continue;

    currentStep++;

    const runId = `kou_${outputSize}_xcstrings_${Date.now()}`;
    const tempOutputDir = join(baseOutputDir, `.tmp_${runId}`);
    await mkdir(tempOutputDir, { recursive: true });

    // Single config with localization block — Koubou handles all languages in one pass
    const koubouConfig = translateConfigWithLocalization({
      config,
      configDir,
      outputSize,
      outputDir: tempOutputDir,
    });

    if (options.screenIndex !== undefined) {
      const keys = Object.keys(koubouConfig.screenshots);
      const targetKey = keys[options.screenIndex];
      if (targetKey) {
        koubouConfig.screenshots = { [targetKey]: koubouConfig.screenshots[targetKey]! };
      }
    }

    const configPath = join(baseOutputDir, `.tmp_${runId}.yaml`);
    const yamlContent = stringify(koubouConfig);
    await writeFile(configPath, yamlContent, 'utf-8');

    const screenCount = Object.keys(koubouConfig.screenshots).length;
    const sizeName = `${sizeKey}"`;
    const langCount = localization.languages.length;
    options.onProgress?.(currentStep, totalSteps, `Koubou: ${screenCount} screens @ ${sizeName} (${langCount} languages, xcstrings)`);

    try {
      await runKou(binaryPath, configPath);
    } catch (err) {
      try { await unlink(configPath); } catch { /* ignore */ }
      const message = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(`Koubou generation failed: ${message}`);
    }

    // Koubou with localization outputs to {output_dir}/{language}/{device}/
    // Collect from all language subdirs
    for (const language of localization.languages) {
      const langDir = join(tempOutputDir, language);
      const outputFiles = await collectOutputFiles(langDir);
      const screenKeys = Object.keys(koubouConfig.screenshots);

      for (let i = 0; i < outputFiles.length && i < screenKeys.length; i++) {
        const file = outputFiles[i]!;
        const screenIdx = options.screenIndex ?? i;
        const appframeName = `${sanitizeFilename(config.app.name)}_ios_${outputSize}_${language}_${screenIdx + 1}.png`;
        const finalPath = join(baseOutputDir, appframeName);

        await rename(file.path, finalPath);

        allResults.push({
          outputPath: finalPath,
          width: dims.width,
          height: dims.height,
          fileSize: file.fileSize,
        });
      }
    }

    try { await unlink(configPath); } catch { /* ignore */ }
    try { await rm(tempOutputDir, { recursive: true, force: true }); } catch { /* ignore */ }
  }

  return allResults;
}

// --- Public API ---

export async function generateWithKoubou(options: GenerateOptions): Promise<GenerateResult> {
  const startTime = Date.now();
  const ctx = await setupPipelineContext(options);

  const allResults = ctx.config.localization
    ? await generateWithKoubouNativeLocalization(ctx)
    : await generateWithKoubouInlineLocales(ctx);

  return {
    screenshots: allResults,
    totalTime: Date.now() - startTime,
  };
}

// Generate just the Koubou YAML config without rendering (for debugging / `appframe koubou-config`)
export async function generateKoubouConfig(
  configPath: string,
  outputSize?: string,
  screenIndex?: number,
): Promise<string> {
  const config = await loadConfig(configPath);
  const configDir = dirname(resolve(configPath));

  const size = outputSize ?? mapSizeToKoubou(config.output.ios?.sizes?.[0] ?? 6.7) ?? 'iPhone6_7';

  let koubouConfig: KoubouConfig;

  if (config.localization) {
    koubouConfig = translateConfigWithLocalization({
      config,
      configDir,
      outputSize: size,
      outputDir: './output',
    });
  } else {
    koubouConfig = translateConfig({
      config,
      configDir,
      outputSize: size,
      outputDir: './output',
    });
  }

  if (screenIndex !== undefined) {
    const keys = Object.keys(koubouConfig.screenshots);
    if (screenIndex < 0 || screenIndex >= keys.length) {
      throw new Error(`Screen index ${screenIndex} out of range (0-${keys.length - 1})`);
    }
    const targetKey = keys[screenIndex]!;
    koubouConfig.screenshots = { [targetKey]: koubouConfig.screenshots[targetKey]! };
  }

  return stringify(koubouConfig);
}

// --- Single-screen render for Web UI ---

export interface KoubouSingleScreenOptions {
  screenshotData: string;
  headline: string;
  subtitle?: string;
  style: TemplateStyle;
  colors: { primary: string; secondary: string; background: string; text: string; subtitle?: string };
  font: string;
  fontWeight: number;
  headlineSize?: number;
  subtitleSize?: number;
  layout: LayoutVariant;
  frameId?: string;
  frameStyle: string;
  koubouColor?: string;
  outputSize: string;
  headlineGradient?: TextGradient;
  subtitleGradient?: TextGradient;
  spotlight?: SpotlightConfig;
  annotations?: Annotation[];
}

export async function renderSingleScreenWithKoubou(
  options: KoubouSingleScreenOptions,
): Promise<Buffer> {
  const detection = await detectKoubou();
  if (!detection.available || !detection.binaryPath) {
    throw new Error('Koubou (kou) not found. Install it with: pip install koubou');
  }

  const tempDir = join(tmpdir(), `appframe_kou_${Date.now()}`);
  await mkdir(tempDir, { recursive: true });

  try {
    // Write base64 screenshot data URL to temp PNG
    const base64Match = options.screenshotData.match(/^data:image\/\w+;base64,(.+)$/);
    if (!base64Match) {
      throw new Error('Invalid screenshot data URL');
    }
    const screenshotPath = join(tempDir, 'screenshot.png');
    await writeFile(screenshotPath, Buffer.from(base64Match[1]!, 'base64'));

    // Build a minimal AppframeConfig
    const config: AppframeConfig = {
      app: {
        name: 'preview',
        description: 'Web UI export',
        platforms: ['ios'],
        features: [],
      },
      theme: {
        style: options.style,
        colors: options.colors,
        font: options.font,
        fontWeight: options.fontWeight,
        headlineSize: options.headlineSize,
        subtitleSize: options.subtitleSize,
        headlineGradient: options.headlineGradient,
        subtitleGradient: options.subtitleGradient,
      },
      frames: {
        style: options.frameStyle as 'flat' | '3d' | 'floating' | 'none',
        ios: options.frameId,
        koubouColor: options.koubouColor,
      },
      screens: [{
        screenshot: screenshotPath,
        headline: options.headline,
        subtitle: options.subtitle,
        layout: options.layout,
        composition: 'single',
        autoSizeHeadline: false,
        autoSizeSubtitle: false,
        annotations: options.annotations ?? [],
        spotlight: options.spotlight,
      }],
      output: {
        platforms: ['ios'],
        directory: './output',
      },
    };

    const outputDir = join(tempDir, 'output');
    await mkdir(outputDir, { recursive: true });

    // Translate to Koubou config — use absolute screenshot path (already absolute)
    const koubouConfig = translateConfig({
      config,
      configDir: tempDir,
      outputSize: options.outputSize,
      outputDir: outputDir,
    });

    // Write YAML config
    const configPath = join(tempDir, 'config.yaml');
    await writeFile(configPath, stringify(koubouConfig), 'utf-8');

    // Run Koubou
    await runKou(detection.binaryPath, configPath);

    // Collect output PNG
    const outputFiles = await collectOutputFiles(outputDir);
    if (outputFiles.length === 0) {
      throw new Error('Koubou produced no output files');
    }

    return await readFile(outputFiles[0]!.path);
  } finally {
    try { await rm(tempDir, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}
