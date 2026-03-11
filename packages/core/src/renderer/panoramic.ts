import { readFile, mkdir } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { loadConfig } from '../config/loader.js';
import { getFrame, getDefaultFrame, loadFrameManifest } from '../frames/loader.js';
import { TemplateEngine } from '../templates/engine.js';
import type { PanoramicTemplateContext, PanoramicRenderedElement } from '../templates/engine.js';
import { Renderer } from './renderer.js';
import { getTargetSizes } from './sizes.js';
import type { GenerateOptions, GenerateResult, RenderResult } from './types.js';
import type { AppframeConfig, PanoramicElement, PanoramicBackground } from '../config/schema.js';
import type { FrameDefinition } from '../frames/types.js';

async function screenshotToDataUrl(screenshotPath: string): Promise<string> {
  try {
    const buffer = await readFile(screenshotPath);
    const base64 = buffer.toString('base64');
    const ext = screenshotPath.toLowerCase().endsWith('.jpg') || screenshotPath.toLowerCase().endsWith('.jpeg')
      ? 'jpeg'
      : 'png';
    return `data:image/${ext};base64,${base64}`;
  } catch {
    return 'data:image/svg+xml;base64,' + Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea"/>
            <stop offset="100%" style="stop-color:#764ba2"/>
          </linearGradient>
        </defs>
        <rect width="400" height="800" fill="url(#g)"/>
        <text x="200" y="400" text-anchor="middle" fill="white" font-family="sans-serif" font-size="16">Screenshot</text>
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

function buildBackgroundCss(bg: PanoramicBackground): string {
  if (bg.type === 'gradient' && bg.gradient) {
    const colors = bg.gradient.colors.join(', ');
    if (bg.gradient.type === 'radial') {
      return `radial-gradient(circle at ${bg.gradient.radialPosition}, ${colors})`;
    }
    return `linear-gradient(${bg.gradient.direction}deg, ${colors})`;
  }
  if (bg.type === 'image' && bg.image) {
    return `url('${bg.image}') center/cover no-repeat`;
  }
  // solid or fallback
  return bg.color ?? '#000000';
}

async function buildRenderedElement(
  el: PanoramicElement,
  canvasWidth: number,
  canvasHeight: number,
  configDir: string,
  config: AppframeConfig,
): Promise<PanoramicRenderedElement> {
  const xPx = (el.x / 100) * canvasWidth;
  const yPx = (el.y / 100) * canvasHeight;

  if (el.type === 'device') {
    const widthPx = (el.width / 100) * canvasWidth;
    const screenshotPath = join(configDir, el.screenshot);
    const screenshotDataUrl = await screenshotToDataUrl(screenshotPath);

    // Resolve frame
    const frameId = el.frame ?? config.frames.ios ?? undefined;
    let frame: FrameDefinition | undefined;
    if (frameId) {
      frame = await getFrame(frameId);
    } else {
      frame = await getDefaultFrame('ios');
    }

    let frameSvg: string | null = null;
    let clipLeft = 0;
    let clipTop = 0;
    let clipWidth = widthPx;
    let clipHeight = widthPx * 2; // fallback aspect ratio
    let clipRadius = 0;

    if (frame && config.frames.style !== 'none') {
      frameSvg = await loadFrameSvgContent(frame);
      const scale = widthPx / frame.frameSize.width;
      clipLeft = frame.screenArea.x * scale;
      clipTop = frame.screenArea.y * scale;
      clipWidth = frame.screenArea.width * scale;
      clipHeight = frame.screenArea.height * scale;
      clipRadius = frame.screenArea.borderRadius * scale;
    }

    // Build shadow CSS
    let shadowCss = '';
    if (el.shadow) {
      const alphaHex = Math.round(el.shadow.opacity * 255).toString(16).padStart(2, '0');
      shadowCss = `filter: drop-shadow(0 ${el.shadow.offsetY}px ${el.shadow.blur}px ${el.shadow.color}${alphaHex});`;
    } else {
      // Default subtle shadow
      shadowCss = 'filter: drop-shadow(0 10px 30px rgba(0,0,0,0.25));';
    }

    return {
      type: 'device',
      z: el.z,
      xPx,
      yPx,
      widthPx,
      rotation: el.rotation,
      screenshotDataUrl,
      frameSvg,
      shadowCss,
      clipLeft,
      clipTop,
      clipWidth,
      clipHeight,
      clipRadius,
    };
  }

  if (el.type === 'text') {
    const fontSizePx = (el.fontSize / 100) * canvasHeight;
    return {
      type: 'text',
      z: el.z,
      xPx,
      yPx,
      content: el.content,
      fontSizePx,
      color: el.color,
      fontWeight: el.fontWeight,
      fontStyle: el.fontStyle,
      textAlign: el.textAlign,
      lineHeight: el.lineHeight,
      maxWidthPx: el.maxWidth ? (el.maxWidth / 100) * canvasWidth : undefined,
    };
  }

  if (el.type === 'label') {
    const fontSizePx = (el.fontSize / 100) * canvasHeight;
    const paddingPx = (el.padding / 100) * canvasHeight;
    return {
      type: 'label',
      z: el.z,
      xPx,
      yPx,
      content: el.content,
      fontSizePx,
      color: el.color,
      backgroundColor: el.backgroundColor,
      paddingPx,
      borderRadius: el.borderRadius,
    };
  }

  // decoration
  const widthPx = (el.width / 100) * canvasWidth;
  const heightPx = el.height ? (el.height / 100) * canvasHeight : widthPx;
  return {
    type: 'decoration',
    z: el.z,
    xPx,
    yPx,
    widthPx,
    heightPx,
    shape: el.shape,
    color: el.color,
    opacity: el.opacity,
    rotation: el.rotation,
  };
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

export async function generatePanoramicScreenshots(options: GenerateOptions): Promise<GenerateResult> {
  const startTime = Date.now();
  const config = await loadConfig(options.configPath);
  const configDir = dirname(resolve(options.configPath));

  if (config.mode !== 'panoramic' || !config.panoramic || !config.frameCount) {
    throw new Error('Config is not in panoramic mode or missing panoramic/frameCount fields');
  }

  await loadFrameManifest();

  const templateEngine = new TemplateEngine();
  const renderer = new Renderer();

  try {
    await renderer.init();

    const sizes = getTargetSizes(
      config.output.platforms,
      config.output.ios?.sizes,
      config.output.android?.sizes,
      config.output.android?.featureGraphic,
      config.output.mac?.sizes,
      config.output.watch?.sizes,
    );

    // Filter by platform
    const filteredSizes = options.platform && options.platform !== 'all'
      ? sizes.filter(s => s.platform === options.platform)
      : sizes;

    const frameCount = config.frameCount;
    const totalSteps = filteredSizes.length * frameCount;

    // Ensure output directory exists once (not per-task)
    const outputDir = options.outputDir ?? join(configDir, config.output.directory);
    await mkdir(outputDir, { recursive: true });

    // Build all render tasks up-front so we can run them concurrently.
    // Each task renders one clipped frame from a pre-built HTML canvas.
    interface PanoramicRenderTask {
      html: string;
      totalCanvasWidth: number;
      totalCanvasHeight: number;
      frameIndex: number;
      frameWidth: number;
      frameHeight: number;
      filename: string;
      stepNumber: number;
    }

    const renderTasks: PanoramicRenderTask[] = [];
    let stepCounter = 0;

    for (const size of filteredSizes) {
      // Total canvas: frameCount x single frame width
      const totalCanvasWidth = size.width * frameCount;
      const totalCanvasHeight = size.height;

      // Build background CSS
      const backgroundCss = buildBackgroundCss(config.panoramic.background);

      // Build all rendered elements with pixel positions
      const elements: PanoramicRenderedElement[] = [];
      for (const el of config.panoramic.elements) {
        const rendered = await buildRenderedElement(
          el,
          totalCanvasWidth,
          totalCanvasHeight,
          configDir,
          config,
        );
        elements.push(rendered);
      }

      // Build panoramic template context
      const context: PanoramicTemplateContext = {
        canvasWidth: totalCanvasWidth,
        canvasHeight: totalCanvasHeight,
        frameCount,
        frameWidth: size.width,
        font: config.theme.font,
        fontWeight: config.theme.fontWeight,
        frameStyle: config.frames.style,
        backgroundCss,
        elements,
      };

      // Render the full wide canvas as HTML (once per size)
      const html = await templateEngine.renderPanoramic(context);

      // Create a render task for each frame clip
      for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
        stepCounter++;
        const filename = `${sanitizeFilename(config.app.name)}_${size.platform}_${size.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_panoramic_${frameIndex + 1}.png`;
        renderTasks.push({
          html,
          totalCanvasWidth,
          totalCanvasHeight,
          frameIndex,
          frameWidth: size.width,
          frameHeight: size.height,
          filename,
          stepNumber: stepCounter,
        });
      }
    }

    const tasks = renderTasks.map((task) => async (): Promise<RenderResult> => {
      const outputPath = join(outputDir, task.filename);

      options.onProgress?.(task.stepNumber, totalSteps, task.filename);

      return renderer.render({
        html: task.html,
        width: task.totalCanvasWidth,
        height: task.totalCanvasHeight,
        outputPath,
        clip: {
          x: task.frameIndex * task.frameWidth,
          y: 0,
          width: task.frameWidth,
          height: task.frameHeight,
        },
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
