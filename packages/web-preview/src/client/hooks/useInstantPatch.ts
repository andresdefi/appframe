import { useCallback } from 'react';
import { getIframe } from '../utils/iframeRegistry';
import { usePreviewStore } from '../store';

/**
 * Returns patch functions that directly manipulate iframe DOM for smooth slider
 * interactions. These bypass React state — the full re-render happens on
 * slider mouseup via the normal update → triggerRender flow.
 *
 * Usage in sidebar tabs: call patchDevice/patchBackground/patchText from
 * the slider's `onInstant` callback.
 */
export function useInstantPatch() {
  const selectedScreen = usePreviewStore((s) => s.selectedScreen);
  const previewW = usePreviewStore((s) => s.previewW);

  const getDoc = useCallback((): Document | null => {
    try {
      const iframe = getIframe(selectedScreen);
      return iframe?.contentDocument ?? null;
    } catch {
      return null;
    }
  }, [selectedScreen]);

  /**
   * Patch device wrapper: size, position, rotation, angle, tilt.
   */
  const patchDevice = useCallback(
    (partial: {
      deviceScale?: number;
      deviceTop?: number;
      deviceOffsetX?: number;
      deviceRotation?: number;
      deviceAngle?: number;
      deviceTilt?: number;
    }) => {
      const doc = getDoc();
      if (!doc) return;

      const wrapper = doc.querySelector('.device-wrapper') as HTMLElement | null;
      if (!wrapper) return;

      if (partial.deviceScale !== undefined) {
        const canvas = doc.querySelector('.canvas') as HTMLElement | null;
        if (canvas) {
          const canvasWidth = canvas.getBoundingClientRect().width;
          // Store original server-rendered dw on first patch to avoid cumulative drift
          if (!wrapper.dataset.origDw) {
            wrapper.dataset.origDw = String(parseFloat(wrapper.style.width) || wrapper.getBoundingClientRect().width);
          }
          if (!wrapper.dataset.origPerspective) {
            const pVal = getComputedStyle(wrapper).getPropertyValue('--device-perspective');
            wrapper.dataset.origPerspective = String(parseFloat(pVal) || 1500);
          }
          const origDw = parseFloat(wrapper.dataset.origDw);
          const newDw = Math.round(canvasWidth * partial.deviceScale / 100);
          const ratio = newDw / origDw;
          wrapper.style.width = newDw + 'px';
          // Scale perspective proportionally so tilt effect stays consistent
          const origPerspective = parseFloat(wrapper.dataset.origPerspective);
          wrapper.style.setProperty('--device-perspective', Math.round(origPerspective * ratio) + 'px');
          // Scale screenshot-clip from original dimensions (not current, to avoid drift)
          wrapper.querySelectorAll('.screenshot-clip').forEach((clip) => {
            const el = clip as HTMLElement;
            if (!el.dataset.origLeft) {
              el.dataset.origLeft = el.style.left;
              el.dataset.origTop = el.style.top;
              el.dataset.origWidth = el.style.width;
              el.dataset.origHeight = el.style.height;
              el.dataset.origBr = el.style.borderRadius || '';
            }
            el.style.left = Math.round(parseFloat(el.dataset.origLeft!) * ratio) + 'px';
            el.style.top = Math.round(parseFloat(el.dataset.origTop!) * ratio) + 'px';
            el.style.width = Math.round(parseFloat(el.dataset.origWidth!) * ratio) + 'px';
            el.style.height = Math.round(parseFloat(el.dataset.origHeight!) * ratio) + 'px';
            if (el.dataset.origBr) el.style.borderRadius = Math.round(parseFloat(el.dataset.origBr) * ratio) + 'px';
          });
        }
      }
      if (partial.deviceTop !== undefined) {
        wrapper.style.top = partial.deviceTop + '%';
        // Also patch decorations
        for (const sel of ['.glow-1', '.glow-2', '.orb-1', '.orb-2', '.bg-glow', '.shape-1', '.shape-3', '.bg-shape-1']) {
          const el = doc.querySelector(sel) as HTMLElement | null;
          if (el) el.style.top = partial.deviceTop + '%';
        }
      }
      if (partial.deviceOffsetX !== undefined) {
        wrapper.style.left = partial.deviceOffsetX
          ? `calc(50% + ${(partial.deviceOffsetX / 100) * previewW}px)`
          : '50%';
      }
      if (partial.deviceRotation !== undefined) wrapper.style.setProperty('--device-rotation', `${partial.deviceRotation}deg`);
      if (partial.deviceAngle !== undefined) wrapper.style.setProperty('--device-angle', `${partial.deviceAngle}deg`);
      if (partial.deviceTilt !== undefined) wrapper.style.setProperty('--device-tilt', `${partial.deviceTilt}deg`);
    },
    [getDoc, previewW],
  );

  /**
   * Patch background: solid color or gradient on the .canvas element.
   */
  const patchBackground = useCallback(
    (bg: {
      type: 'solid' | 'gradient' | 'image';
      color?: string;
      gradientType?: 'linear' | 'radial';
      colors?: string[];
      direction?: number;
      radialPosition?: string;
      imageDataUrl?: string;
      imageFit?: 'cover' | 'contain' | 'fill';
      imagePositionX?: number;
      imagePositionY?: number;
      imageScale?: number;
    }) => {
      const doc = getDoc();
      if (!doc) return;

      const canvas = doc.querySelector('.canvas') as HTMLElement | null;
      if (!canvas) return;

      if (bg.type === 'solid' && bg.color) {
        canvas.style.background = bg.color;
      } else if (bg.type === 'gradient' && bg.colors) {
        const colorStr = bg.colors.join(', ');
        if (bg.gradientType === 'radial') {
          canvas.style.background = `radial-gradient(circle at ${bg.radialPosition ?? 'center'}, ${colorStr})`;
        } else {
          canvas.style.background = `linear-gradient(${bg.direction ?? 135}deg, ${colorStr})`;
        }
      } else if (bg.type === 'image' && bg.imageDataUrl) {
        // Update the canvas-bg-image <img> element's style directly.
        // Object-fit handles fit, object-position handles pan, transform
        // scale handles zoom — all orthogonal.
        const img = doc.querySelector('.canvas-bg-image') as HTMLImageElement | null;
        if (!img) {
          // No img element yet (e.g. user just switched to image type and
          // the full re-render hasn't landed). Skip the instant patch; the
          // next render will set up the element with correct styles.
          return;
        }
        if (bg.imageFit !== undefined) img.style.objectFit = bg.imageFit;
        const posX = bg.imagePositionX;
        const posY = bg.imagePositionY;
        if (posX !== undefined || posY !== undefined) {
          // Read current values from the img if only one axis is provided.
          const currentPos = img.style.objectPosition.split(' ');
          const x = posX ?? parseInt(currentPos[0] ?? '50', 10);
          const y = posY ?? parseInt(currentPos[1] ?? '50', 10);
          img.style.objectPosition = `${x}% ${y}%`;
        }
        if (bg.imageScale !== undefined) {
          img.style.transform = `scale(${bg.imageScale / 100})`;
        }
      }
    },
    [getDoc],
  );

  /** Patch the image-background dim overlay (color + opacity) live. */
  const patchBgOverlay = useCallback(
    (overlay: { color?: string; opacity?: number }) => {
      const doc = getDoc();
      if (!doc) return;
      const el = doc.querySelector('.bg-overlay') as HTMLElement | null;
      if (!el) return;
      if (overlay.color !== undefined) el.style.background = overlay.color;
      if (overlay.opacity !== undefined) el.style.opacity = String(overlay.opacity);
    },
    [getDoc],
  );

  /**
   * Patch text: font size, rotation, color, and inner HTML for headline/subtitle.
   * innerHTML patches give keystroke-by-keystroke feedback from the rich-text
   * editor without paying for a full template re-render.
   */
  const patchText = useCallback(
    (partial: {
      headlineSize?: number;
      subtitleSize?: number;
      headlineRotation?: number;
      subtitleRotation?: number;
      headlineHtml?: string;
      subtitleHtml?: string;
      headlineColor?: string;
      subtitleColor?: string;
      freeTextSize?: number;
      freeTextRotation?: number;
      freeTextHtml?: string;
      freeTextColor?: string;
    }) => {
      const doc = getDoc();
      if (!doc) return;

      const scaleFactor = previewW / 1290;

      const applyRotation = (el: HTMLElement, deg: number) => {
        // translateX(-50%) is only needed when the element has been repositioned
        // via injectTextPositionCSS (position: fixed + left: X%). In normal
        // flow the block is full-width inside .text-area and translateX would
        // shift the whole block off-center.
        const isFixed = doc.defaultView?.getComputedStyle(el).position === 'fixed';
        const parts: string[] = [];
        if (isFixed) parts.push('translateX(-50%)');
        if (deg) parts.push(`rotate(${deg}deg)`);
        el.style.transform = parts.length > 0 ? parts.join(' ') : '';
      };

      const headline = doc.querySelector('.headline') as HTMLElement | null;
      if (headline) {
        if (partial.headlineSize !== undefined) {
          headline.style.fontSize = `${Math.round(partial.headlineSize * scaleFactor)}px`;
        }
        if (partial.headlineRotation !== undefined) {
          applyRotation(headline, partial.headlineRotation);
        }
        if (partial.headlineHtml !== undefined) {
          headline.innerHTML = partial.headlineHtml;
        }
        if (partial.headlineColor !== undefined) {
          headline.style.color = partial.headlineColor;
        }
      }

      const subtitle = doc.querySelector('.subtitle') as HTMLElement | null;
      if (subtitle) {
        if (partial.subtitleSize !== undefined) {
          subtitle.style.fontSize = `${Math.round(partial.subtitleSize * scaleFactor)}px`;
        }
        if (partial.subtitleRotation !== undefined) {
          applyRotation(subtitle, partial.subtitleRotation);
        }
        if (partial.subtitleHtml !== undefined) {
          subtitle.innerHTML = partial.subtitleHtml;
        }
        if (partial.subtitleColor !== undefined) {
          subtitle.style.color = partial.subtitleColor;
        }
      }

      const freeText = doc.querySelector('.free-text') as HTMLElement | null;
      if (freeText) {
        if (partial.freeTextSize !== undefined) {
          freeText.style.fontSize = `${Math.round(partial.freeTextSize * scaleFactor)}px`;
        }
        if (partial.freeTextRotation !== undefined) {
          applyRotation(freeText, partial.freeTextRotation);
        }
        if (partial.freeTextHtml !== undefined) {
          freeText.innerHTML = partial.freeTextHtml;
        }
        if (partial.freeTextColor !== undefined) {
          freeText.style.color = partial.freeTextColor;
        }
      }
    },
    [getDoc, previewW],
  );

  /**
   * Patch border simulation: thickness and radius on the .border-sim wrapper.
   */
  const patchBorder = useCallback(
    (partial: { thickness?: number; radius?: number; color?: string }) => {
      const doc = getDoc();
      if (!doc) return;
      const el = doc.querySelector('.border-sim') as HTMLElement | null;
      if (!el) return;
      if (partial.thickness !== undefined || partial.color !== undefined) {
        const currentColor = partial.color ?? el.style.borderColor ?? '#1a1a1a';
        const thickness = partial.thickness ?? parseFloat(el.style.borderWidth) ?? 0;
        el.style.border = `${thickness}px solid ${currentColor}`;
      }
      if (partial.radius !== undefined) {
        el.style.borderRadius = `${partial.radius}px`;
      }
    },
    [getDoc],
  );

  /**
   * Patch spotlight overlay: position, size, dim opacity, and blur.
   *
   * The spotlight is rendered as a single `.spotlight-cutout` div positioned
   * where the cutout should appear, with a huge box-shadow painting the dim
   * everywhere outside it (see injectSpotlightHTML for context). Patches
   * just mutate that one element's inline style — position/size for moves,
   * border-radius for shape changes, and box-shadow for opacity and blur.
   */
  const patchSpotlight = useCallback(
    (spotlight: {
      x: number;
      y: number;
      w: number;
      h: number;
      shape: 'rectangle' | 'circle';
      dimOpacity: number;
      blur: number;
    }) => {
      const doc = getDoc();
      if (!doc) return;
      const cutout = doc.querySelector('.spotlight-cutout') as HTMLElement | null;
      if (!cutout) return;
      cutout.style.left = `${spotlight.x - spotlight.w / 2}%`;
      cutout.style.top = `${spotlight.y - spotlight.h / 2}%`;
      cutout.style.width = `${spotlight.w}%`;
      cutout.style.height = `${spotlight.h}%`;
      cutout.style.borderRadius = spotlight.shape === 'circle' ? '50%' : '0';
      cutout.style.boxShadow = `0 0 ${spotlight.blur > 0 ? spotlight.blur : 0}px 9999px rgba(0,0,0,${spotlight.dimOpacity})`;
    },
    [getDoc],
  );

  /**
   * Patch an annotation shape by index: position, size, stroke.
   *
   * Shape changes (rectangle / rounded-rect / circle) restructure the
   * element (border-radius switches between fixed px and 50%), so they
   * still go through the full re-render via onChange.
   */
  const patchAnnotation = useCallback(
    (
      index: number,
      partial: {
        x?: number;
        y?: number;
        w?: number;
        h?: number;
        strokeWidth?: number;
        strokeColor?: string;
      },
    ) => {
      const doc = getDoc();
      if (!doc) return;
      const shapes = doc.querySelectorAll('.annotation-overlay .annotation-shape');
      const el = shapes[index] as HTMLElement | undefined;
      if (!el) return;
      if (partial.x !== undefined) el.style.left = `${partial.x}%`;
      if (partial.y !== undefined) el.style.top = `${partial.y}%`;
      if (partial.w !== undefined) el.style.width = `${partial.w}%`;
      if (partial.h !== undefined) el.style.height = `${partial.h}%`;
      if (partial.strokeWidth !== undefined || partial.strokeColor !== undefined) {
        // Server uses scale = canvasWidth / 1290 (1290 is the reference
        // canvas width). Read the iframe-CSS width so the patched stroke
        // matches what the server would re-render on release.
        const canvas = doc.querySelector('.canvas') as HTMLElement | null;
        const canvasWidth = canvas?.clientWidth || 1290;
        const scale = canvasWidth / 1290;
        const sw =
          partial.strokeWidth !== undefined
            ? Math.round(partial.strokeWidth * scale)
            : parseFloat(el.style.borderWidth) || 0;
        const color = partial.strokeColor ?? (el.style.borderColor || '#FF3B30');
        el.style.border = `${sw}px solid ${color}`;
      }
    },
    [getDoc],
  );

  /**
   * Patch the loupe magnifier: size, position, zoom, frame styling.
   *
   * Recomputes the inner magnified image's offset so the screenshot pixel
   * under the loupe's center stays at the loupe's center as the user
   * tweaks position or zoom. Reads the screenshot-clip's canvas-space
   * rect via getBoundingClientRect (iframe-CSS pixels, post-transform) to
   * stay accurate even when devices are tilted or angled.
   */
  const patchLoupe = useCallback(
    (loupe: {
      width: number;
      height: number;
      displayX?: number;
      displayY?: number;
      zoom: number;
      xOffset?: number;
      yOffset?: number;
      cornerRadius?: number;
      borderWidth?: number;
      borderColor?: string;
      shadow?: boolean;
      shadowColor?: string;
      shadowRadius?: number;
      shadowOffsetX?: number;
      shadowOffsetY?: number;
    }) => {
      const doc = getDoc();
      if (!doc) return;
      const wrapper = doc.querySelector('.loupe-wrapper') as HTMLElement | null;
      const img = doc.querySelector('.loupe-img') as HTMLElement | null;
      const canvas = doc.querySelector('.canvas') as HTMLElement | null;
      if (!wrapper || !img || !canvas) return;

      const cRect = canvas.getBoundingClientRect();
      const canvasWidth = cRect.width;
      const canvasHeight = cRect.height;

      const loupeW = Math.round(canvasWidth * loupe.width);
      const loupeH = Math.round(canvasHeight * loupe.height);
      const displayX = loupe.displayX ?? 50;
      const displayY = loupe.displayY ?? 50;
      const loupePosX = Math.round((canvasWidth * displayX) / 100 + (loupe.xOffset ?? 0));
      const loupePosY = Math.round((canvasHeight * displayY) / 100 + (loupe.yOffset ?? 0));

      // Resolve the screenshot's canvas-space rect. Prefer .screenshot-clip
      // (framed device); fall back to the device-wrapper for frameless
      // configurations where the screenshot fills the device area.
      const clip =
        (doc.querySelector('.screenshot-clip') as HTMLElement | null) ??
        (doc.querySelector('.device-wrapper') as HTMLElement | null);
      if (!clip) return;
      const sRect = clip.getBoundingClientRect();
      const ssLeft = sRect.left - cRect.left;
      const ssTop = sRect.top - cRect.top;
      const ssWidth = sRect.width;
      const ssHeight = sRect.height;

      const magW = Math.round(ssWidth * loupe.zoom);
      const magH = Math.round(ssHeight * loupe.zoom);
      const sx = (loupePosX - ssLeft) / ssWidth;
      const sy = (loupePosY - ssTop) / ssHeight;
      const imgLeft = Math.round(sx * magW - loupeW / 2);
      const imgTop = Math.round(sy * magH - loupeH / 2);

      wrapper.style.width = `${loupeW}px`;
      wrapper.style.height = `${loupeH}px`;
      wrapper.style.left = `${Math.round(loupePosX - loupeW / 2)}px`;
      wrapper.style.top = `${Math.round(loupePosY - loupeH / 2)}px`;
      wrapper.style.borderRadius = `${loupe.cornerRadius ?? 0}%`;

      if ((loupe.borderWidth ?? 0) > 0) {
        wrapper.style.border = `${loupe.borderWidth}px solid ${loupe.borderColor ?? '#ffffff'}`;
      } else {
        wrapper.style.border = '';
      }

      if (loupe.shadow) {
        wrapper.style.boxShadow = `${loupe.shadowOffsetX ?? 0}px ${loupe.shadowOffsetY ?? 0}px ${loupe.shadowRadius ?? 30}px ${loupe.shadowColor ?? '#000000'}`;
      } else {
        wrapper.style.boxShadow = '';
      }

      img.style.width = `${magW}px`;
      img.style.height = `${magH}px`;
      img.style.left = `${-imgLeft}px`;
      img.style.top = `${-imgTop}px`;
    },
    [getDoc],
  );

  /**
   * Patch a callout card by index: source/display position, scale,
   * rotation, radius, padding. Mirrors the math in
   * `_base/callouts.html`. Background colour, shadow toggle, and border
   * style still go through full re-renders since they aren't slider
   * targets in the current UI.
   */
  const patchCallout = useCallback(
    (
      index: number,
      callout: {
        sourceX: number;
        sourceY: number;
        sourceW: number;
        sourceH: number;
        displayX: number;
        displayY: number;
        displayScale: number;
        rotation: number;
        borderRadius: number;
        padding?: number;
        cardScale?: number;
      },
    ) => {
      const doc = getDoc();
      if (!doc) return;
      const card = doc.querySelector(`.callout-card[data-idx="${index}"]`) as HTMLElement | null;
      if (!card) return;
      const clip = card.querySelector('.callout-clip') as HTMLElement | null;
      const img = card.querySelector('.callout-img') as HTMLElement | null;
      if (!clip || !img) return;

      const canvas = doc.querySelector('.canvas') as HTMLElement | null;
      if (!canvas) return;
      const cRect = canvas.getBoundingClientRect();

      // Resolve the screenshot's canvas-space rect so source/display coords
      // (both in screenshot-%) translate to the right pixels.
      const screenshotClip =
        (doc.querySelector('.screenshot-clip') as HTMLElement | null) ??
        (doc.querySelector('.device-wrapper') as HTMLElement | null);
      if (!screenshotClip) return;
      const sRect = screenshotClip.getBoundingClientRect();
      const ssLeft = sRect.left - cRect.left;
      const ssTop = sRect.top - cRect.top;
      const ssWidth = sRect.width;
      const ssHeight = sRect.height;

      const cw = callout.sourceW / 100;
      const ch = callout.sourceH / 100;
      const cx = callout.displayX / 100;
      const cy = callout.displayY / 100;
      const zoom = callout.displayScale || 1;
      const cardScale = callout.cardScale ?? 1;
      // Source region shrinks as zoom grows; card visual size is set by
      // cw/ch and cardScale, so zoom no longer scales the card.
      const srcW = cw / zoom;
      const srcH = ch / zoom;
      const srcX = cx - srcW / 2;
      const srcY = cy - srcH / 2;

      const contentW = Math.round(ssWidth * cw * cardScale);
      const contentH = Math.round(ssHeight * ch * cardScale);
      const padPx = Math.round((ssWidth * (callout.padding ?? 0)) / 100);
      const cardW = contentW + padPx * 2;
      const cardH = contentH + padPx * 2;
      const centerCanvasX = Math.round(ssLeft + ssWidth * cx);
      const centerCanvasY = Math.round(ssTop + ssHeight * cy);

      // Position the card by its centre via translate(-50%, -50%). This
      // keeps the visual centre fixed when width/height change, so
      // resizing doesn't visibly shift the card.
      card.style.left = `${centerCanvasX}px`;
      card.style.top = `${centerCanvasY}px`;
      card.style.width = `${cardW}px`;
      card.style.height = `${cardH}px`;
      card.style.padding = `${padPx}px`;
      card.style.borderRadius = `${callout.borderRadius}px`;
      card.style.transform = `translate(-50%, -50%) rotate(${callout.rotation}deg)`;

      clip.style.width = `${contentW}px`;
      clip.style.height = `${contentH}px`;
      clip.style.borderRadius = `${callout.borderRadius}px`;

      // Mirror the rounding order of templates/_base/callouts.html exactly.
      // Server does NOT share a pre-rounded fullImg* between width and
      // offset — both rounds operate on the un-rounded `contentW / srcW`
      // expression. Pre-rounding here used to produce up to ~1px of
      // displacement on slider release.
      const fullImgWRaw = srcW > 0 ? contentW / srcW : 0;
      const fullImgHRaw = srcH > 0 ? contentH / srcH : 0;
      img.style.width = `${Math.round(fullImgWRaw)}px`;
      img.style.height = `${Math.round(fullImgHRaw)}px`;
      img.style.left = `${-Math.round(srcX * fullImgWRaw)}px`;
      img.style.top = `${-Math.round(srcY * fullImgHRaw)}px`;
    },
    [getDoc],
  );

  /**
   * Patch a floating element (overlay) by index: position, size, rotation,
   * opacity. Type-specific styling (shape color/blur, etc.) is also live
   * for the existing inner element.
   */
  const patchOverlay = useCallback(
    (
      index: number,
      overlay: {
        type: string;
        x: number;
        y: number;
        size: number;
        rotation: number;
        opacity: number;
        shapeType?: string;
        shapeColor?: string;
        shapeOpacity?: number;
        shapeBlur?: number;
        layer?: 'front' | 'default' | 'behind-text' | 'behind-device';
        blendMode?: string;
        softBlur?: number;
      },
    ) => {
      const doc = getDoc();
      if (!doc) return;
      const item = doc.querySelector(`.overlay-item[data-idx="${index}"]`) as HTMLElement | null;
      if (!item) return;
      const canvas = doc.querySelector('.canvas') as HTMLElement | null;
      if (!canvas) return;
      const cRect = canvas.getBoundingClientRect();
      const canvasWidth = cRect.width;
      const canvasHeight = cRect.height;

      const sizePx = Math.round(overlay.size);
      const baseX = Math.round((canvasWidth * overlay.x) / 100);
      const baseY = Math.round((canvasHeight * overlay.y) / 100);
      // Grow the wrapper to give blur halo transparent room while keeping
      // the visible content area = sizePx at the original (x, y).
      const blurPad = Math.round((overlay.softBlur ?? 0) * 1.5);
      const wrapperSize = sizePx + 2 * blurPad;
      item.style.left = `${baseX - blurPad}px`;
      item.style.top = `${baseY - blurPad}px`;
      item.style.width = `${wrapperSize}px`;
      item.style.height = `${wrapperSize}px`;
      item.style.padding = blurPad > 0 ? `${blurPad}px` : '';
      item.style.boxSizing = 'border-box';
      item.style.transform = `rotate(${overlay.rotation}deg)`;
      item.style.opacity = String(overlay.opacity);
      // Layer tier — maps to z-index so the element stacks against the
      // canvas: front (20) > default (10) > text (2) > behind-text (1) >
      // device (1) > behind-device (0) > background (0).
      const layer = overlay.layer ?? 'default';
      const zByLayer: Record<string, string> = {
        front: '20',
        default: '10',
        'behind-text': '1',
        'behind-device': '0',
      };
      item.style.zIndex = zByLayer[layer] ?? '10';
      // Blend with canvas background. "normal" clears the property.
      const blend = overlay.blendMode ?? 'normal';
      item.style.mixBlendMode = blend === 'normal' ? '' : blend;
      // Heavy CSS blur — large values produce atmospheric glow blobs.
      const softBlur = overlay.softBlur ?? 0;
      item.style.filter = softBlur > 0 ? `blur(${softBlur}px)` : '';

      // Shape-specific inner element styling.
      if (overlay.type === 'shape') {
        const inner = item.firstElementChild as HTMLElement | null;
        if (inner) {
          if (overlay.shapeColor !== undefined) {
            // Inner is either a <div> with `background` (circle/rect/line)
            // or an <svg> (arrow). Mutate accordingly.
            if (inner.tagName.toLowerCase() === 'div') {
              inner.style.background = overlay.shapeColor;
            } else if (inner.tagName.toLowerCase() === 'svg') {
              const g = inner.querySelector('g');
              if (g) {
                g.setAttribute('stroke', overlay.shapeColor);
                g.setAttribute('fill', overlay.shapeColor);
              }
            }
          }
          if (overlay.shapeOpacity !== undefined) {
            if (inner.tagName.toLowerCase() === 'div') {
              inner.style.opacity = String(overlay.shapeOpacity);
            } else {
              const g = inner.querySelector('g');
              if (g) g.setAttribute('opacity', String(overlay.shapeOpacity));
            }
          }
          if (overlay.shapeBlur !== undefined) {
            if (inner.tagName.toLowerCase() === 'div') {
              inner.style.filter = overlay.shapeBlur > 0 ? `blur(${overlay.shapeBlur}px)` : '';
            }
          }
        }
      } else if (overlay.type === 'star-rating' && overlay.shapeColor !== undefined) {
        const svg = item.firstElementChild as SVGElement | null;
        if (svg && svg.tagName.toLowerCase() === 'svg') {
          svg.setAttribute('fill', overlay.shapeColor);
        }
      }
    },
    [getDoc],
  );

  return { patchDevice, patchBackground, patchBgOverlay, patchText, patchBorder, patchSpotlight, patchAnnotation, patchLoupe, patchCallout, patchOverlay };
}
