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
      type: 'solid' | 'gradient';
      color?: string;
      gradientType?: 'linear' | 'radial';
      colors?: string[];
      direction?: number;
      radialPosition?: string;
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
      }
    },
    [getDoc],
  );

  /**
   * Patch text: font size and rotation for headline/subtitle.
   */
  const patchText = useCallback(
    (partial: {
      headlineSize?: number;
      subtitleSize?: number;
      headlineRotation?: number;
      subtitleRotation?: number;
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

      if (partial.headlineSize !== undefined || partial.headlineRotation !== undefined) {
        const headline = doc.querySelector('.headline') as HTMLElement | null;
        if (headline) {
          if (partial.headlineSize !== undefined) {
            headline.style.fontSize = `${Math.round(partial.headlineSize * scaleFactor)}px`;
          }
          if (partial.headlineRotation !== undefined) {
            applyRotation(headline, partial.headlineRotation);
          }
        }
      }

      if (partial.subtitleSize !== undefined || partial.subtitleRotation !== undefined) {
        const subtitle = doc.querySelector('.subtitle') as HTMLElement | null;
        if (subtitle) {
          if (partial.subtitleSize !== undefined) {
            subtitle.style.fontSize = `${Math.round(partial.subtitleSize * scaleFactor)}px`;
          }
          if (partial.subtitleRotation !== undefined) {
            applyRotation(subtitle, partial.subtitleRotation);
          }
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
   * Shape changes (circle ↔ rectangle) and blur crossings through 0 trigger
   * full re-renders via the normal onChange flow — those mutate the DOM
   * structure (different cutout element / filter presence), not just
   * attributes, so they don't have a stable instant path.
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
      const svg = doc.querySelector('.spotlight-overlay svg');
      if (!svg) return;

      // Mask cutout is the last child of #spotlight-mask (first child is the
      // full-canvas white background rect).
      const mask = svg.querySelector('#spotlight-mask');
      const cutout = mask?.lastElementChild ?? null;
      if (cutout) {
        const tag = cutout.tagName.toLowerCase();
        if (spotlight.shape === 'circle' && tag === 'ellipse') {
          cutout.setAttribute('cx', `${spotlight.x}%`);
          cutout.setAttribute('cy', `${spotlight.y}%`);
          cutout.setAttribute('rx', `${spotlight.w / 2}%`);
          cutout.setAttribute('ry', `${spotlight.h / 2}%`);
        } else if (spotlight.shape === 'rectangle' && tag === 'rect') {
          cutout.setAttribute('x', `${spotlight.x - spotlight.w / 2}%`);
          cutout.setAttribute('y', `${spotlight.y - spotlight.h / 2}%`);
          cutout.setAttribute('width', `${spotlight.w}%`);
          cutout.setAttribute('height', `${spotlight.h}%`);
        }
      }

      // Dim layer is the final rect (the one with the mask attr applied).
      const dimRect = svg.querySelector('rect[mask]');
      if (dimRect) {
        dimRect.setAttribute('fill', `rgba(0,0,0,${spotlight.dimOpacity})`);
      }

      // Blur filter is only present in the DOM when blur > 0. Skip the
      // transition through zero; the onChange re-render adds/removes it.
      if (spotlight.blur > 0) {
        const feGaussian = svg.querySelector('#spotlight-blur feGaussianBlur');
        if (feGaussian) {
          feGaussian.setAttribute('stdDeviation', String(spotlight.blur));
        }
      }
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

  return { patchDevice, patchBackground, patchText, patchBorder, patchSpotlight, patchAnnotation, patchLoupe };
}
