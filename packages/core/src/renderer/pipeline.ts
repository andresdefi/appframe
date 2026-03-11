import { readFile, mkdir } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { loadConfig } from '../config/loader.js';
import { getFrame, getDefaultFrame, loadFrameManifest } from '../frames/loader.js';
import { TemplateEngine } from '../templates/engine.js';
import type { TemplateContext } from '../templates/engine.js';
import { Renderer } from './renderer.js';
import { getTargetSizes } from './sizes.js';
import type { GenerateOptions, GenerateResult, RenderResult, ScreenshotSize } from './types.js';
import type { AppframeConfig, ScreenConfig, TemplateStyle } from '../config/schema.js';
import type { FrameDefinition } from '../frames/types.js';
import { injectSpotlightHTML, injectAnnotationsHTML } from '../templates/injectors.js';
import { resolveLocalizedAsset } from '../devices/assets.js';

async function screenshotToDataUrl(screenshotPath: string): Promise<string> {
  try {
    const buffer = await readFile(screenshotPath);
    const base64 = buffer.toString('base64');
    const ext = screenshotPath.toLowerCase().endsWith('.jpg') || screenshotPath.toLowerCase().endsWith('.jpeg')
      ? 'jpeg'
      : 'png';
    return `data:image/${ext};base64,${base64}`;
  } catch {
    // Return a placeholder gradient if screenshot not found
    return 'data:image/svg+xml;base64,' + Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea"/>
            <stop offset="100%" style="stop-color:#764ba2"/>
          </linearGradient>
        </defs>
        <rect width="400" height="800" fill="url(#g)"/>
        <text x="200" y="400" text-anchor="middle" fill="white" font-family="sans-serif" font-size="16">Screenshot placeholder</text>
      </svg>`
    ).toString('base64');
  }
}

async function loadFrameSvgContent(frame: FrameDefinition): Promise<string> {
  return readFile(frame.framePath, 'utf-8');
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

function getLocalizedScreenshot(
  config: AppframeConfig,
  screenIndex: number,
  locale: string,
  configDir: string,
  defaultScreenshot: string,
): string {
  // Check for explicit per-locale screenshot override
  if (locale !== 'default' && config.locales) {
    const localeConfig = config.locales[locale];
    const localeScreen = localeConfig?.screens[screenIndex];
    if (localeScreen?.screenshot) {
      return join(configDir, localeScreen.screenshot);
    }
  }

  // For xcstrings localization mode, try convention-based resolution
  if (config.localization && locale !== 'default') {
    return resolveLocalizedAsset(
      defaultScreenshot,
      locale,
      config.localization.baseLanguage,
      configDir,
    );
  }

  return join(configDir, defaultScreenshot);
}

/**
 * Simple concurrency limiter — runs async tasks with at most `concurrency`
 * executing simultaneously. Results are returned in the original task order.
 */
async function runWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number,
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < tasks.length) {
      const idx = nextIndex++;
      results[idx] = await tasks[idx]!();
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, tasks.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

const DEFAULT_RENDER_CONCURRENCY = 3;

export async function generateScreenshots(options: GenerateOptions): Promise<GenerateResult> {
  const startTime = Date.now();
  const config = await loadConfig(options.configPath);
  const configDir = dirname(resolve(options.configPath));

  await loadFrameManifest();

  const templateEngine = new TemplateEngine();
  const renderer = new Renderer();

  try {
    await renderer.init();

    const sizes = getTargetSizesFromConfig(config);

    // Determine locales to generate
    const locales = getLocalesToGenerate(config, options.locale);

    // Determine screens to generate
    const screens = options.screenIndex !== undefined
      ? [{ screen: config.screens[options.screenIndex]!, index: options.screenIndex }]
      : config.screens.map((screen, index) => ({ screen, index }));

    // Ensure output directory exists once (not per-task)
    const outputDir = options.outputDir ?? join(configDir, config.output.directory);
    await mkdir(outputDir, { recursive: true });

    // Build all render tasks up-front so we can run them concurrently
    interface RenderTask {
      size: ScreenshotSize;
      locale: string;
      screen: ScreenConfig;
      screenIndex: number;
      stepNumber: number;
    }

    const renderTasks: RenderTask[] = [];
    let stepCounter = 0;

    for (const size of sizes) {
      if (options.platform && options.platform !== 'all' && size.platform !== options.platform) {
        continue;
      }
      for (const locale of locales) {
        for (const { screen, index } of screens) {
          stepCounter++;
          renderTasks.push({
            size,
            locale,
            screen,
            screenIndex: index,
            stepNumber: stepCounter,
          });
        }
      }
    }

    const totalSteps = renderTasks.length;

    const tasks = renderTasks.map((task) => async (): Promise<RenderResult> => {
      const { size, locale, screen, screenIndex: idx } = task;

      // Get localized text
      const headline = getLocalizedText(config, idx, locale, 'headline') ?? screen.headline;
      const subtitle = getLocalizedText(config, idx, locale, 'subtitle') ?? screen.subtitle;

      // Resolve screenshot path (with per-locale override support)
      const screenshotPath = getLocalizedScreenshot(config, idx, locale, configDir, screen.screenshot);
      const screenshotDataUrl = await screenshotToDataUrl(screenshotPath);

      // Resolve frame
      const frame = await resolveFrame(config, screen, size.platform);
      let frameSvg: string | null = null;
      if (frame && config.frames.style !== 'none') {
        frameSvg = await loadFrameSvgContent(frame);
      }

      // Build template context
      const style = (options.templateOverride as TemplateStyle | undefined) ?? config.theme.style;
      const context: TemplateContext = {
        headline,
        subtitle,
        screenshotDataUrl,
        style,
        colors: config.theme.colors,
        font: config.theme.font,
        fontWeight: config.theme.fontWeight,
        layout: screen.layout,
        frame: frame ?? null,
        frameStyle: config.frames.style,
        frameSvg,
        canvasWidth: size.width,
        canvasHeight: size.height,
        headlineGradient: config.theme.headlineGradient,
        subtitleGradient: config.theme.subtitleGradient,
        autoSizeHeadline: screen.autoSizeHeadline,
        autoSizeSubtitle: screen.autoSizeSubtitle,
        headlineLineHeight: config.theme.headlineLineHeight,
        headlineLetterSpacing: config.theme.headlineLetterSpacing,
        headlineTextTransform: config.theme.headlineTextTransform,
        headlineFontStyle: config.theme.headlineFontStyle,
        subtitleOpacity: config.theme.subtitleOpacity,
        subtitleLetterSpacing: config.theme.subtitleLetterSpacing,
        subtitleTextTransform: config.theme.subtitleTextTransform,
      };

      // Render template to HTML
      let html = await templateEngine.render(context);

      // Inject overlay features
      if (screen.spotlight) {
        html = injectSpotlightHTML(html, screen.spotlight);
      }
      if (screen.annotations && screen.annotations.length > 0) {
        html = injectAnnotationsHTML(html, screen.annotations, size.width);
      }

      const filename = `${sanitizeFilename(config.app.name)}_${size.platform}_${size.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${locale}_${idx + 1}.png`;
      const outputPath = join(outputDir, filename);

      options.onProgress?.(task.stepNumber, totalSteps, filename);

      // Render to PNG
      return renderer.render({
        html,
        width: size.width,
        height: size.height,
        outputPath,
      });
    });

    const concurrency = options.concurrency ?? DEFAULT_RENDER_CONCURRENCY;
    const results = await runWithConcurrency(tasks, concurrency);

    return {
      screenshots: results,
      totalTime: Date.now() - startTime,
    };
  } finally {
    await renderer.close();
  }
}

function getTargetSizesFromConfig(config: AppframeConfig): ScreenshotSize[] {
  return getTargetSizes(
    config.output.platforms,
    config.output.ios?.sizes,
    config.output.android?.sizes,
    config.output.android?.featureGraphic,
    config.output.mac?.sizes,
    config.output.watch?.sizes,
  );
}

function getLocalesToGenerate(config: AppframeConfig, filterLocale?: string): string[] {
  if (filterLocale) return [filterLocale];
  // xcstrings localization mode: generate for all configured languages
  if (config.localization) {
    return config.localization.languages;
  }
  if (!config.locales || Object.keys(config.locales).length === 0) return ['default'];
  // Always include the default (base) locale, plus all configured locales
  return ['default', ...Object.keys(config.locales)];
}

function getLocalizedText(
  config: AppframeConfig,
  screenIndex: number,
  locale: string,
  field: 'headline' | 'subtitle',
): string | undefined {
  if (locale === 'default' || !config.locales) return undefined;
  const localeConfig = config.locales[locale];
  if (!localeConfig) return undefined;
  const localeScreen = localeConfig.screens[screenIndex];
  if (!localeScreen) return undefined;
  return localeScreen[field];
}

async function resolveFrame(
  config: AppframeConfig,
  screen: ScreenConfig,
  platform: string,
): Promise<FrameDefinition | undefined> {
  // Screen-level override
  if (screen.device) {
    return getFrame(screen.device);
  }

  // Config-level frame for this platform
  if (platform === 'ios' || platform === 'mac' || platform === 'watch') {
    const configFrame = config.frames.ios;
    if (configFrame) return getFrame(configFrame);
  } else if (platform === 'android') {
    const configFrame = config.frames.android;
    if (configFrame) return getFrame(configFrame);
  }

  // Default frame for iOS/Android (Mac and Watch use Koubou PNG frames, not SVG)
  if (platform === 'ios' || platform === 'android') {
    return getDefaultFrame(platform);
  }
  return undefined;
}
