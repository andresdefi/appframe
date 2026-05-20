import type { Express } from 'express';
import { injectEffectsHTML } from '@appframe/core';
import type {
  FrameStyle,
  LocaleConfig,
  PanoramicBackground,
  PanoramicElement,
} from '@appframe/core';
import type {
  PanoramicTemplateContext,
  PanoramicRenderedElement,
} from '@appframe/core';
import { localizePanoramicElement } from '../previewShared.js';
import {
  buildPanoramicBackgroundCss,
  buildPanoramicRenderedBackgroundLayers,
  buildPanoramicRenderedElement,
} from '../panoramicRendering.js';
import { expectObject, expectString } from './utils.js';
import type { RouteContext } from './context.js';

/**
 * POST /api/panoramic-preview-html — renders the wide panoramic canvas
 * for the in-browser iframe preview. Self-contained: doesn't share the
 * individual-screen body-parsing helpers because the panoramic body
 * shape is fundamentally different (frame count, elements array,
 * background config, no per-screen fields).
 */
export function registerPanoramicPreviewRoute(app: Express, ctx: RouteContext): void {
  app.post('/api/panoramic-preview-html', async (req, res) => {
    try {
      const config = ctx.getConfig();
      const body = req.body as Record<string, unknown>;
      const locale = expectString(body.locale) ?? 'default';
      const localeConfig = expectObject(body.localeConfig) as LocaleConfig | undefined;
      const frameCount = body.frameCount as number;
      const frameWidth = body.frameWidth as number;
      const frameHeight = body.frameHeight as number;
      const background = body.background as PanoramicBackground;
      const elements = (body.elements as PanoramicElement[]).map((element, index) =>
        localizePanoramicElement(config, ctx.configDir, element, locale, localeConfig, index),
      );
      const font = (body.font as string) ?? config.theme.font;
      const fontWeight = (body.fontWeight as number) ?? config.theme.fontWeight;
      const frameStyle = (body.frameStyle as FrameStyle) ?? config.frames.style;
      const previewMode = body.previewMode === true;
      // See routes/preview.ts for the rationale on fontFaceMode.
      const fontFaceMode: import('@appframe/core').FontFaceMode | undefined =
        body.fontFaceMode === 'inline' ||
        body.fontFaceMode === 'url' ||
        body.fontFaceMode === 'none'
          ? body.fontFaceMode
          : undefined;

      const totalWidth = frameWidth * frameCount;
      const renderedElements: PanoramicRenderedElement[] = await Promise.all(
        elements.map((element) =>
          buildPanoramicRenderedElement({
            element,
            space: {
              originXPx: 0,
              originYPx: 0,
              widthPx: totalWidth,
              heightPx: frameHeight,
            },
            config,
            configDir: ctx.configDir,
            frameStyle,
            previewMode,
            screenshotStorage: ctx.screenshotStorage,
          }),
        ),
      );
      const backgroundCss = buildPanoramicBackgroundCss(background);
      const backgroundLayers = await buildPanoramicRenderedBackgroundLayers({
        background,
        configDir: ctx.configDir,
        canvasWidth: totalWidth,
        canvasHeight: frameHeight,
        screenshotStorage: ctx.screenshotStorage,
      });

      // Compute a contrasting guide color from the background
      const guideColor = (() => {
        let hex = '#000000';
        if (background.type === 'solid' && background.color) {
          hex = background.color;
        } else if (background.type === 'gradient' && background.gradient?.colors?.length) {
          hex = background.gradient.colors[0] ?? hex;
        }
        // Parse hex to RGB and compute relative luminance
        const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
        if (m) {
          const r = parseInt(m[1]!, 16) / 255;
          const g = parseInt(m[2]!, 16) / 255;
          const b = parseInt(m[3]!, 16) / 255;
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          return luminance > 0.5 ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';
        }
        return 'rgba(255, 255, 255, 0.2)';
      })();

      const panoramicContext: PanoramicTemplateContext = {
        canvasWidth: totalWidth,
        canvasHeight: frameHeight,
        frameCount,
        frameWidth,
        font,
        fontWeight,
        frameStyle,
        backgroundCss,
        backgroundLayers,
        showGuides: true,
        guideColor,
        elements: renderedElements,
      };

      let html = await ctx.templateEngine.renderPanoramic(panoramicContext, { fontFaceMode });

      // Single pass — one </head> + </body> replace for all effects.
      const effects = body.effects as
        | { spotlight?: unknown; annotations?: unknown[]; overlays?: unknown[] }
        | undefined;
      if (effects) {
        html = injectEffectsHTML(
          html,
          {
            spotlight: effects.spotlight as Parameters<typeof injectEffectsHTML>[1]['spotlight'],
            annotations: effects.annotations as Parameters<
              typeof injectEffectsHTML
            >[1]['annotations'],
            overlays: effects.overlays as Parameters<typeof injectEffectsHTML>[1]['overlays'],
          },
          totalWidth,
          frameHeight,
        );
      }

      res.set('Content-Type', 'text/html');
      res.send(html);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });
}
