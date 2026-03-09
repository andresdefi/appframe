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
          const origDw = parseFloat(wrapper.dataset.origDw);
          const newDw = Math.round(canvasWidth * partial.deviceScale / 100);
          const ratio = newDw / origDw;
          wrapper.style.width = newDw + 'px';
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

      if (partial.headlineSize !== undefined || partial.headlineRotation !== undefined) {
        const headline = doc.querySelector('.headline') as HTMLElement | null;
        if (headline) {
          if (partial.headlineSize !== undefined) {
            headline.style.fontSize = `${Math.round(partial.headlineSize * scaleFactor)}px`;
          }
          if (partial.headlineRotation !== undefined) {
            const parts = ['translateX(-50%)'];
            if (partial.headlineRotation) parts.push(`rotate(${partial.headlineRotation}deg)`);
            headline.style.transform = parts.join(' ');
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
            const parts = ['translateX(-50%)'];
            if (partial.subtitleRotation) parts.push(`rotate(${partial.subtitleRotation}deg)`);
            subtitle.style.transform = parts.join(' ');
          }
        }
      }
    },
    [getDoc, previewW],
  );

  return { patchDevice, patchBackground, patchText };
}
