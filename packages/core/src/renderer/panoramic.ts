import { readFile, mkdir } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { loadConfig } from '../config/loader.js';
import { getFrame, getDefaultFrame, loadFrameManifest } from '../frames/loader.js';
import { TemplateEngine } from '../templates/engine.js';
import type {
  PanoramicTemplateContext,
  PanoramicRenderedBackgroundLayer,
  PanoramicRenderedElement,
} from '../templates/engine.js';
import { Renderer } from './renderer.js';
import { getTargetSizes } from './sizes.js';
import type { GenerateOptions, GenerateResult, RenderResult } from './types.js';
import type {
  AppframeConfig,
  PanoramicBackground,
  PanoramicBackgroundLayer,
  PanoramicElement,
} from '../config/schema.js';
import type { FrameDefinition } from '../frames/types.js';

function placeholderDataUrl(label: string): string {
  return (
    'data:image/svg+xml;base64,' +
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea"/>
          <stop offset="100%" style="stop-color:#764ba2"/>
        </linearGradient>
      </defs>
      <rect width="400" height="800" fill="url(#g)"/>
      <text x="200" y="400" text-anchor="middle" fill="white" font-family="sans-serif" font-size="16">${label}</text>
    </svg>`,
    ).toString('base64')
  );
}

async function assetToDataUrl(assetPath: string, fallbackLabel: string): Promise<string> {
  try {
    const buffer = await readFile(assetPath);
    const base64 = buffer.toString('base64');
    const lower = assetPath.toLowerCase();
    const ext =
      lower.endsWith('.jpg') || lower.endsWith('.jpeg')
        ? 'jpeg'
        : lower.endsWith('.webp')
          ? 'webp'
          : lower.endsWith('.svg')
            ? 'svg+xml'
            : 'png';
    return `data:image/${ext};base64,${base64}`;
  } catch {
    return placeholderDataUrl(fallbackLabel);
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

function buildBackgroundLayerCss(layer: PanoramicBackgroundLayer): string {
  if (layer.kind === 'solid') {
    return layer.color;
  }
  if (layer.kind === 'gradient') {
    if (layer.gradientType === 'mesh') {
      const [a, b, c = layer.colors[0]!, d = layer.colors[1]!] = layer.colors;
      return `radial-gradient(circle at 20% 20%, ${a} 0%, transparent 55%), radial-gradient(circle at 78% 24%, ${b} 0%, transparent 58%), radial-gradient(circle at 52% 78%, ${c} 0%, transparent 62%), linear-gradient(${layer.direction}deg, ${d}, ${a})`;
    }
    const colors = layer.colors.join(', ');
    if (layer.gradientType === 'radial') {
      return `radial-gradient(circle at ${layer.radialPosition}, ${colors})`;
    }
    return `linear-gradient(${layer.direction}deg, ${colors})`;
  }
  if (layer.kind === 'image') {
    const size =
      layer.fit === 'tile'
        ? `${layer.scale}% auto`
        : layer.fit === 'contain'
          ? `contain`
          : `cover`;
    const repeat = layer.fit === 'tile' ? 'repeat' : 'no-repeat';
    return `url('${layer.image}') ${layer.position}/${size} ${repeat}`;
  }
  return `radial-gradient(circle at center, ${layer.color} 0%, transparent 72%)`;
}

async function buildRenderedBackgroundLayers(
  background: PanoramicBackground,
  canvasWidth: number,
  canvasHeight: number,
  configDir: string,
): Promise<PanoramicRenderedBackgroundLayer[]> {
  const layers = background.layers ?? [];
  const rendered: PanoramicRenderedBackgroundLayer[] = [];

  for (const layer of layers) {
    if (layer.kind === 'image') {
      const imageValue = layer.image.startsWith('data:')
        ? layer.image
        : await assetToDataUrl(join(configDir, layer.image), 'Background');
      rendered.push({
        kind: 'image',
        backgroundCss: buildBackgroundLayerCss({ ...layer, image: imageValue }),
        opacity: layer.opacity,
        blendMode: layer.blendMode,
        blurPx: layer.blur,
      });
      continue;
    }

    if (layer.kind === 'glow') {
      rendered.push({
        kind: 'glow',
        backgroundCss: buildBackgroundLayerCss(layer),
        opacity: layer.opacity,
        blendMode: layer.blendMode,
        blurPx: layer.blur,
        xPx: (layer.x / 100) * canvasWidth,
        yPx: (layer.y / 100) * canvasHeight,
        widthPx: (layer.width / 100) * canvasWidth,
        heightPx: (layer.height / 100) * canvasHeight,
      });
      continue;
    }

    rendered.push({
      kind: layer.kind,
      backgroundCss: buildBackgroundLayerCss(layer),
      opacity: layer.opacity,
      blendMode: layer.blendMode,
      blurPx: layer.blur,
    });
  }

  if (rendered.length === 0) {
    const legacyCss =
      background.type === 'image' && background.image && !background.image.startsWith('data:')
        ? `url('${await assetToDataUrl(join(configDir, background.image), 'Background')}') center/cover no-repeat`
        : buildBackgroundCss(background);
    rendered.push({
      kind: background.type === 'image' ? 'image' : background.type === 'gradient' ? 'gradient' : 'solid',
      backgroundCss: legacyCss,
      opacity: 1,
      blendMode: 'normal',
      blurPx: 0,
    });
  }

  if (background.overlay) {
    rendered.push({
      kind: 'solid',
      backgroundCss: background.overlay.color,
      opacity: background.overlay.opacity,
      blendMode: 'normal',
      blurPx: 0,
    });
  }

  return rendered;
}

function buildShadowCss(
  shadow: { opacity: number; blur: number; color: string; offsetY: number } | undefined,
  fallback = '',
): string {
  if (!shadow) return fallback;
  const alphaHex = Math.round(shadow.opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return `filter: drop-shadow(0 ${shadow.offsetY}px ${shadow.blur}px ${shadow.color}${alphaHex});`;
}

function computeCropTranslation(
  widthPx: number,
  heightPx: number,
  focusX: number,
  focusY: number,
  zoom: number,
): { translateXPx: number; translateYPx: number } {
  const maxShiftX = ((zoom - 1) * widthPx) / 2;
  const maxShiftY = ((zoom - 1) * heightPx) / 2;
  return {
    translateXPx: ((50 - focusX) / 50) * maxShiftX,
    translateYPx: ((50 - focusY) / 50) * maxShiftY,
  };
}

interface RenderSpace {
  originXPx: number;
  originYPx: number;
  widthPx: number;
  heightPx: number;
}

async function buildRenderedElement(
  el: PanoramicElement,
  space: RenderSpace,
  configDir: string,
  config: AppframeConfig,
): Promise<PanoramicRenderedElement> {
  const xPx = space.originXPx + (el.x / 100) * space.widthPx;
  const yPx = space.originYPx + (el.y / 100) * space.heightPx;

  if (el.type === 'device') {
    const widthPx = (el.width / 100) * space.widthPx;
    const screenshotPath = join(configDir, el.screenshot);
    const screenshotDataUrl = await assetToDataUrl(screenshotPath, 'Screenshot');

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
    const shadowCss = buildShadowCss(el.shadow, 'filter: drop-shadow(0 10px 30px rgba(0,0,0,0.25));');

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

  if (el.type === 'image') {
    const widthPx = (el.width / 100) * space.widthPx;
    const heightPx = (el.height / 100) * space.heightPx;
    const assetPath = join(configDir, el.src);
    const srcDataUrl = await assetToDataUrl(assetPath, 'Image');

    const shadowCss = buildShadowCss(el.shadow);

    return {
      type: 'image',
      z: el.z,
      xPx,
      yPx,
      widthPx,
      heightPx,
      rotation: el.rotation,
      opacity: el.opacity,
      borderRadius: el.borderRadius,
      srcDataUrl,
      fit: el.fit,
      shadowCss,
    };
  }

  if (el.type === 'logo') {
    const widthPx = (el.width / 100) * space.widthPx;
    const heightPx = (el.height / 100) * space.heightPx;
    const assetPath = join(configDir, el.src);
    const srcDataUrl = await assetToDataUrl(assetPath, 'Logo');

    return {
      type: 'logo',
      z: el.z,
      xPx,
      yPx,
      widthPx,
      heightPx,
      rotation: el.rotation,
      opacity: el.opacity,
      borderRadius: el.borderRadius,
      paddingPx: (el.padding / 100) * space.heightPx,
      backgroundColor: el.backgroundColor,
      srcDataUrl,
      fit: el.fit,
      shadowCss: buildShadowCss(el.shadow),
    };
  }

  if (el.type === 'crop') {
    const widthPx = (el.width / 100) * space.widthPx;
    const heightPx = (el.height / 100) * space.heightPx;
    const screenshotPath = join(configDir, el.screenshot);
    const screenshotDataUrl = await assetToDataUrl(screenshotPath, 'Crop');
    const { translateXPx, translateYPx } = computeCropTranslation(
      widthPx,
      heightPx,
      el.focusX,
      el.focusY,
      el.zoom,
    );

    return {
      type: 'crop',
      z: el.z,
      xPx,
      yPx,
      widthPx,
      heightPx,
      rotation: el.rotation,
      borderRadius: el.borderRadius,
      screenshotDataUrl,
      zoom: el.zoom,
      translateXPx,
      translateYPx,
      shadowCss: buildShadowCss(el.shadow),
    };
  }

  if (el.type === 'card') {
    const widthPx = (el.width / 100) * space.widthPx;
    const heightPx = (el.height / 100) * space.heightPx;
    const paddingPx = (el.padding / 100) * space.heightPx;

    return {
      type: 'card',
      z: el.z,
      xPx,
      yPx,
      widthPx,
      heightPx,
      rotation: el.rotation,
      borderRadius: el.borderRadius,
      paddingPx,
      backgroundColor: el.backgroundColor,
      opacity: el.opacity,
      borderColor: el.borderColor,
      borderWidthPx: el.borderWidth,
      eyebrow: el.eyebrow,
      title: el.title,
      body: el.body,
      align: el.align,
      eyebrowColor: el.eyebrowColor,
      titleColor: el.titleColor,
      bodyColor: el.bodyColor,
      eyebrowSizePx: (el.eyebrowSize / 100) * space.heightPx,
      titleSizePx: (el.titleSize / 100) * space.heightPx,
      bodySizePx: (el.bodySize / 100) * space.heightPx,
      shadowCss: buildShadowCss(el.shadow),
    };
  }

  if (el.type === 'badge') {
    const widthPx = (el.width / 100) * space.widthPx;
    const heightPx = (el.height / 100) * space.heightPx;

    return {
      type: 'badge',
      z: el.z,
      xPx,
      yPx,
      widthPx,
      heightPx,
      rotation: el.rotation,
      opacity: el.opacity,
      borderRadius: el.borderRadius,
      content: el.content,
      color: el.color,
      backgroundColor: el.backgroundColor,
      borderColor: el.borderColor,
      borderWidthPx: el.borderWidth,
      fontSizePx: (el.fontSize / 100) * space.heightPx,
      fontWeight: el.fontWeight,
      letterSpacing: el.letterSpacing,
      textTransform: el.textTransform,
      shadowCss: buildShadowCss(el.shadow),
    };
  }

  if (el.type === 'proof-chip') {
    const widthPx = (el.width / 100) * space.widthPx;
    const heightPx = (el.height / 100) * space.heightPx;
    return {
      type: 'proof-chip',
      z: el.z,
      xPx,
      yPx,
      widthPx,
      heightPx,
      rotation: el.rotation,
      opacity: el.opacity,
      borderRadius: el.borderRadius,
      value: el.value,
      detail: el.detail,
      rating: el.rating !== undefined ? Math.round(el.rating) : undefined,
      maxRating: el.maxRating,
      color: el.color,
      mutedColor: el.mutedColor,
      starColor: el.starColor,
      backgroundColor: el.backgroundColor,
      borderColor: el.borderColor,
      borderWidthPx: el.borderWidth,
      valueSizePx: (el.valueSize / 100) * space.heightPx,
      detailSizePx: (el.detailSize / 100) * space.heightPx,
      paddingPx: (el.padding / 100) * space.heightPx,
      shadowCss: buildShadowCss(el.shadow),
    };
  }

  if (el.type === 'group') {
    const widthPx = (el.width / 100) * space.widthPx;
    const heightPx = (el.height / 100) * space.heightPx;
    const childSpace: RenderSpace = {
      originXPx: 0,
      originYPx: 0,
      widthPx,
      heightPx,
    };
    const children = await Promise.all(
      el.children.map((child) => buildRenderedElement(child, childSpace, configDir, config)),
    );

    return {
      type: 'group',
      z: el.z,
      xPx,
      yPx,
      widthPx,
      heightPx,
      rotation: el.rotation,
      opacity: el.opacity,
      children: children.sort((a, b) => a.z - b.z),
    };
  }

  if (el.type === 'text') {
    const fontSizePx = (el.fontSize / 100) * space.heightPx;
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
      maxWidthPx: el.maxWidth ? (el.maxWidth / 100) * space.widthPx : undefined,
    };
  }

  if (el.type === 'label') {
    const fontSizePx = (el.fontSize / 100) * space.heightPx;
    const paddingPx = (el.padding / 100) * space.heightPx;
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
  const widthPx = (el.width / 100) * space.widthPx;
  const heightPx = el.height ? (el.height / 100) * space.heightPx : widthPx;
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

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

const DEFAULT_RENDER_CONCURRENCY = 3;

export async function generatePanoramicScreenshots(
  options: GenerateOptions,
): Promise<GenerateResult> {
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
    const filteredSizes =
      options.platform && options.platform !== 'all'
        ? sizes.filter((s) => s.platform === options.platform)
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

      const backgroundCss = buildBackgroundCss(config.panoramic.background);
      const backgroundLayers = await buildRenderedBackgroundLayers(
        config.panoramic.background,
        totalCanvasWidth,
        totalCanvasHeight,
        configDir,
      );

      // Build all rendered elements with pixel positions
      const elements: PanoramicRenderedElement[] = [];
      for (const el of config.panoramic.elements) {
        const rendered = await buildRenderedElement(
          el,
          {
            originXPx: 0,
            originYPx: 0,
            widthPx: totalCanvasWidth,
            heightPx: totalCanvasHeight,
          },
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
        backgroundLayers,
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
