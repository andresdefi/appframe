// Server-side rendering pipeline for the panoramic mode: turns the
// editor's PanoramicElement[] + PanoramicBackground into the
// PanoramicRenderedElement[] / PanoramicRenderedBackgroundLayer[] shape
// the template engine consumes. Resolves any disk-backed assets to
// data URLs along the way.

import { readFile } from 'node:fs/promises';
import {
  getFrame,
  getDefaultFrame,
  getDeviceFamily,
  getDeviceId,
  getDeviceFramePath,
} from '@appframe/core';
import type {
  AppframeConfig,
  FrameStyle,
  FrameDefinition,
  PanoramicBackground,
  PanoramicBackgroundLayer,
  PanoramicElement,
} from '@appframe/core';
import type {
  PanoramicRenderedBackgroundLayer,
  PanoramicRenderedElement,
} from '@appframe/core';
import { buildKoubouPreviewFrame } from './koubouPreviewFrame.js';
import { resolveCanvasAssetDataUrl } from './previewShared.js';

export function buildPanoramicShadowCss(
  shadow: { opacity: number; blur: number; color: string; offsetY: number } | undefined,
  fallback = '',
): string {
  if (!shadow) return fallback;
  return `filter: drop-shadow(0 ${shadow.offsetY}px ${shadow.blur}px ${shadow.color}${Math.round(
    shadow.opacity * 255,
  )
    .toString(16)
    .padStart(2, '0')});`;
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

type PanoramicRenderSpace = {
  originXPx: number;
  originYPx: number;
  widthPx: number;
  heightPx: number;
};

export function buildPanoramicBackgroundCss(background: PanoramicBackground): string {
  if (background.type === 'gradient' && background.gradient) {
    const colors = background.gradient.colors.join(', ');
    return background.gradient.type === 'radial'
      ? `radial-gradient(circle at ${background.gradient.radialPosition}, ${colors})`
      : `linear-gradient(${background.gradient.direction}deg, ${colors})`;
  }
  if (background.type === 'image' && background.image) {
    return `url('${background.image}') center/cover no-repeat`;
  }
  if (background.type === 'solid' && background.color) {
    return background.color;
  }
  return '#000000';
}

function buildPanoramicBackgroundLayerCss(layer: PanoramicBackgroundLayer): string {
  if (layer.kind === 'solid') {
    return layer.color;
  }
  if (layer.kind === 'gradient') {
    if (layer.gradientType === 'mesh') {
      const [a, b, c = layer.colors[0]!, d = layer.colors[1]!] = layer.colors;
      return `radial-gradient(circle at 20% 20%, ${a} 0%, transparent 55%), radial-gradient(circle at 78% 24%, ${b} 0%, transparent 58%), radial-gradient(circle at 52% 78%, ${c} 0%, transparent 62%), linear-gradient(${layer.direction}deg, ${d}, ${a})`;
    }
    const colors = layer.colors.join(', ');
    return layer.gradientType === 'radial'
      ? `radial-gradient(circle at ${layer.radialPosition}, ${colors})`
      : `linear-gradient(${layer.direction}deg, ${colors})`;
  }
  if (layer.kind === 'image') {
    const size =
      layer.fit === 'tile'
        ? `${layer.scale}% auto`
        : layer.fit === 'contain'
          ? 'contain'
          : 'cover';
    const repeat = layer.fit === 'tile' ? 'repeat' : 'no-repeat';
    return `url('${layer.image}') ${layer.position}/${size} ${repeat}`;
  }
  return `radial-gradient(circle at center, ${layer.color} 0%, transparent 72%)`;
}

export async function buildPanoramicRenderedBackgroundLayers(args: {
  background: PanoramicBackground;
  configDir: string;
  canvasWidth: number;
  canvasHeight: number;
}): Promise<PanoramicRenderedBackgroundLayer[]> {
  const { background, configDir, canvasWidth, canvasHeight } = args;
  const rendered: PanoramicRenderedBackgroundLayer[] = [];

  for (const layer of background.layers ?? []) {
    if (layer.kind === 'image') {
      const imageDataUrl = await resolveCanvasAssetDataUrl(layer.image, configDir, 'Background');
      rendered.push({
        kind: 'image',
        backgroundCss: buildPanoramicBackgroundLayerCss({ ...layer, image: imageDataUrl }),
        opacity: layer.opacity,
        blendMode: layer.blendMode,
        blurPx: layer.blur,
      });
      continue;
    }

    if (layer.kind === 'glow') {
      rendered.push({
        kind: 'glow',
        backgroundCss: buildPanoramicBackgroundLayerCss(layer),
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
      backgroundCss: buildPanoramicBackgroundLayerCss(layer),
      opacity: layer.opacity,
      blendMode: layer.blendMode,
      blurPx: layer.blur,
    });
  }

  if (rendered.length === 0) {
    let legacyCss = buildPanoramicBackgroundCss(background);
    if (background.type === 'image' && background.image) {
      legacyCss = `url('${await resolveCanvasAssetDataUrl(background.image, configDir, 'Background')}') center/cover no-repeat`;
    }
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

export async function buildPanoramicRenderedElement(args: {
  element: PanoramicElement;
  space: PanoramicRenderSpace;
  config: AppframeConfig;
  configDir: string;
  frameStyle: FrameStyle;
}): Promise<PanoramicRenderedElement> {
  const { element, space, config, configDir, frameStyle } = args;
  const xPx = space.originXPx + (element.x / 100) * space.widthPx;
  const yPx = space.originYPx + (element.y / 100) * space.heightPx;

  if (element.type === 'device') {
    const widthPx = (element.width / 100) * space.widthPx;
    const screenshotDataUrl = await resolveCanvasAssetDataUrl(
      element.screenshot,
      configDir,
      'Screenshot',
    );

    const frameId = element.frame ?? config.frames.ios ?? undefined;
    let frame: FrameDefinition | undefined;
    let frameSvg: string | null = null;
    let framePngUrl: string | undefined;

    if (frameId) {
      frame = await getFrame(frameId);

      if (!frame) {
        const koubouFamily = getDeviceFamily(frameId);
        if (koubouFamily) {
          if (koubouFamily.previewFrameId) {
            frame = await getFrame(koubouFamily.previewFrameId);
          }
          if (koubouFamily.screenRect && koubouFamily.framePngSize) {
            const deviceColor = element.deviceColor ?? config.frames.deviceColor;
              const koubouId = getDeviceId(koubouFamily.id, deviceColor || undefined);
              const pngPath = koubouId ? await getDeviceFramePath(koubouId) : null;
              if (pngPath && koubouId) {
                // Same URL-not-base64 treatment as the individual mode.
                framePngUrl = `/api/device-frame?id=${encodeURIComponent(koubouId)}`;
                frame = buildKoubouPreviewFrame(koubouFamily);
              }
            }
          }
      }
    } else {
      frame = await getDefaultFrame('ios');
    }

    let clipLeft = 0;
    let clipTop = 0;
    let clipWidth = widthPx;
    let clipHeight = widthPx * 2;
    let clipRadius = 0;

    if (frame && frameStyle !== 'none') {
      if (!framePngUrl && frame.framePath) {
        frameSvg = await readFile(frame.framePath, 'utf-8');
      }
      const scale = widthPx / frame.frameSize.width;
      clipLeft = frame.screenArea.x * scale;
      clipTop = frame.screenArea.y * scale;
      clipWidth = frame.screenArea.width * scale;
      clipHeight = frame.screenArea.height * scale;
      clipRadius = frame.screenArea.borderRadius * scale;
    }

    return {
      type: 'device',
      z: element.z,
      xPx,
      yPx,
      widthPx,
      rotation: element.rotation,
      screenshotDataUrl,
      frameSvg,
      framePngUrl,
      shadowCss: buildPanoramicShadowCss(element.shadow),
      clipLeft,
      clipTop,
      clipWidth,
      clipHeight,
      clipRadius,
      borderSimulation: element.borderSimulation
        ? {
            thickness: element.borderSimulation.thickness,
            color: element.borderSimulation.color,
            radius: element.borderSimulation.radius,
          }
        : undefined,
    };
  }

  if (element.type === 'text') {
    let gradientCss: string | undefined;
    if (element.gradient) {
      const colors = element.gradient.colors.join(', ');
      gradientCss =
        element.gradient.type === 'radial'
          ? `radial-gradient(circle at ${element.gradient.radialPosition ?? 'center'}, ${colors})`
          : `linear-gradient(${element.gradient.direction ?? 135}deg, ${colors})`;
    }

    return {
      type: 'text',
      z: element.z,
      xPx,
      yPx,
      content: element.content,
      fontSizePx: (element.fontSize / 100) * space.heightPx,
      color: element.color,
      font: element.font,
      fontWeight: element.fontWeight,
      fontStyle: element.fontStyle,
      textAlign: element.textAlign,
      lineHeight: element.lineHeight,
      maxWidthPx: element.maxWidth ? (element.maxWidth / 100) * space.widthPx : undefined,
      gradientCss,
    };
  }

  if (element.type === 'label') {
    return {
      type: 'label',
      z: element.z,
      xPx,
      yPx,
      content: element.content,
      fontSizePx: (element.fontSize / 100) * space.heightPx,
      color: element.color,
      backgroundColor: element.backgroundColor,
      paddingPx: (element.padding / 100) * space.heightPx,
      borderRadius: element.borderRadius,
    };
  }

  if (element.type === 'decoration') {
    return {
      type: 'decoration',
      z: element.z,
      xPx,
      yPx,
      widthPx: (element.width / 100) * space.widthPx,
      heightPx: element.height
        ? (element.height / 100) * space.heightPx
        : (element.width / 100) * space.widthPx,
      shape: element.shape,
      color: element.color,
      opacity: element.opacity,
      rotation: element.rotation,
    };
  }

  if (element.type === 'image') {
    return {
      type: 'image',
      z: element.z,
      xPx,
      yPx,
      widthPx: (element.width / 100) * space.widthPx,
      heightPx: (element.height / 100) * space.heightPx,
      rotation: element.rotation,
      opacity: element.opacity,
      borderRadius: element.borderRadius,
      srcDataUrl: await resolveCanvasAssetDataUrl(element.src, configDir, 'Image'),
      fit: element.fit,
      shadowCss: buildPanoramicShadowCss(element.shadow),
    };
  }

  if (element.type === 'logo') {
    return {
      type: 'logo',
      z: element.z,
      xPx,
      yPx,
      widthPx: (element.width / 100) * space.widthPx,
      heightPx: (element.height / 100) * space.heightPx,
      rotation: element.rotation,
      opacity: element.opacity,
      borderRadius: element.borderRadius,
      paddingPx: (element.padding / 100) * space.heightPx,
      backgroundColor: element.backgroundColor,
      srcDataUrl: await resolveCanvasAssetDataUrl(element.src, configDir, 'Logo'),
      fit: element.fit,
      shadowCss: buildPanoramicShadowCss(element.shadow),
    };
  }

  if (element.type === 'crop') {
    const widthPx = (element.width / 100) * space.widthPx;
    const heightPx = (element.height / 100) * space.heightPx;
    const { translateXPx, translateYPx } = computeCropTranslation(
      widthPx,
      heightPx,
      element.focusX,
      element.focusY,
      element.zoom,
    );

    return {
      type: 'crop',
      z: element.z,
      xPx,
      yPx,
      widthPx,
      heightPx,
      rotation: element.rotation,
      borderRadius: element.borderRadius,
      screenshotDataUrl: await resolveCanvasAssetDataUrl(element.screenshot, configDir, 'Crop'),
      zoom: element.zoom,
      translateXPx,
      translateYPx,
      shadowCss: buildPanoramicShadowCss(element.shadow),
    };
  }

  if (element.type === 'card') {
    return {
      type: 'card',
      z: element.z,
      xPx,
      yPx,
      widthPx: (element.width / 100) * space.widthPx,
      heightPx: (element.height / 100) * space.heightPx,
      rotation: element.rotation,
      borderRadius: element.borderRadius,
      paddingPx: (element.padding / 100) * space.heightPx,
      backgroundColor: element.backgroundColor,
      opacity: element.opacity,
      borderColor: element.borderColor,
      borderWidthPx: element.borderWidth,
      eyebrow: element.eyebrow,
      title: element.title,
      body: element.body,
      align: element.align,
      eyebrowColor: element.eyebrowColor,
      titleColor: element.titleColor,
      bodyColor: element.bodyColor,
      eyebrowSizePx: (element.eyebrowSize / 100) * space.heightPx,
      titleSizePx: (element.titleSize / 100) * space.heightPx,
      bodySizePx: (element.bodySize / 100) * space.heightPx,
      shadowCss: buildPanoramicShadowCss(element.shadow),
    };
  }

  if (element.type === 'badge') {
    return {
      type: 'badge',
      z: element.z,
      xPx,
      yPx,
      widthPx: (element.width / 100) * space.widthPx,
      heightPx: (element.height / 100) * space.heightPx,
      rotation: element.rotation,
      opacity: element.opacity,
      borderRadius: element.borderRadius,
      content: element.content,
      color: element.color,
      backgroundColor: element.backgroundColor,
      borderColor: element.borderColor,
      borderWidthPx: element.borderWidth,
      fontSizePx: (element.fontSize / 100) * space.heightPx,
      fontWeight: element.fontWeight,
      letterSpacing: element.letterSpacing,
      textTransform: element.textTransform,
      shadowCss: buildPanoramicShadowCss(element.shadow),
    };
  }

  if (element.type === 'proof-chip') {
    return {
      type: 'proof-chip',
      z: element.z,
      xPx,
      yPx,
      widthPx: (element.width / 100) * space.widthPx,
      heightPx: (element.height / 100) * space.heightPx,
      rotation: element.rotation,
      opacity: element.opacity,
      borderRadius: element.borderRadius,
      value: element.value,
      detail: element.detail,
      rating: element.rating !== undefined ? Math.round(element.rating) : undefined,
      maxRating: element.maxRating,
      color: element.color,
      mutedColor: element.mutedColor,
      starColor: element.starColor,
      backgroundColor: element.backgroundColor,
      borderColor: element.borderColor,
      borderWidthPx: element.borderWidth,
      valueSizePx: (element.valueSize / 100) * space.heightPx,
      detailSizePx: (element.detailSize / 100) * space.heightPx,
      paddingPx: (element.padding / 100) * space.heightPx,
      shadowCss: buildPanoramicShadowCss(element.shadow),
    };
  }

  const widthPx = (element.width / 100) * space.widthPx;
  const heightPx = (element.height / 100) * space.heightPx;
  const children = await Promise.all(
    element.children.map((child) =>
      buildPanoramicRenderedElement({
        element: child,
        space: {
          originXPx: 0,
          originYPx: 0,
          widthPx,
          heightPx,
        },
        config,
        configDir,
        frameStyle,
      }),
    ),
  );

  return {
    type: 'group',
    z: element.z,
    xPx,
    yPx,
    widthPx,
    heightPx,
    rotation: element.rotation,
    opacity: element.opacity,
    children: children.sort((a, b) => a.z - b.z),
  };
}
