import { useCallback } from 'react';
import { getPanoramicIframe } from '../utils/panoramicIframeRef';
import { usePreviewStore } from '../store';

/**
 * Instant DOM patching for the panoramic preview iframe.
 * Bypasses React state for smooth slider interactions —
 * full re-render happens on slider release via the store.
 */
export function usePanoramicInstantPatch() {
  const previewW = usePreviewStore((s) => s.previewW);
  const previewH = usePreviewStore((s) => s.previewH);
  const frameCount = usePreviewStore((s) => s.panoramicFrameCount);

  const getDoc = useCallback((): Document | null => {
    try {
      const iframe = getPanoramicIframe();
      return iframe?.contentDocument ?? null;
    } catch {
      return null;
    }
  }, []);

  const totalWidth = previewW * frameCount;

  /**
   * Patch the panoramic canvas background.
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
      const canvas = doc.querySelector('.panoramic-canvas') as HTMLElement | null;
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
   * Patch a specific element by its sorted index (data-index attribute).
   * The template sorts by z-index, so the data-index reflects the sorted order.
   * We need the original (unsorted) index to find the right DOM element.
   */
  const patchElement = useCallback(
    (
      sortedIndex: number,
      partial: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        rotation?: number;
        opacity?: number;
        color?: string;
        fontSize?: number;
        fontWeight?: number;
      },
    ) => {
      const doc = getDoc();
      if (!doc) return;

      const el = doc.querySelector(`[data-index="${sortedIndex}"]`) as HTMLElement | null;
      if (!el) return;

      if (partial.x !== undefined) {
        el.style.left = `${(partial.x / 100) * totalWidth}px`;
      }
      if (partial.y !== undefined) {
        el.style.top = `${(partial.y / 100) * previewH}px`;
      }
      if (partial.width !== undefined) {
        el.style.width = `${(partial.width / 100) * totalWidth}px`;
      }
      if (partial.height !== undefined) {
        el.style.height = `${(partial.height / 100) * previewH}px`;
      }
      if (partial.rotation !== undefined) {
        el.style.transform = `rotate(${partial.rotation}deg)`;
      }
      if (partial.opacity !== undefined) {
        el.style.opacity = String(partial.opacity);
      }
      if (partial.color !== undefined) {
        // For decorations, set background; for text/label, set color
        if (el.classList.contains('pano-decoration')) {
          el.style.background = partial.color;
        } else {
          el.style.color = partial.color;
        }
      }
      if (partial.fontSize !== undefined) {
        el.style.fontSize = `${(partial.fontSize / 100) * previewH}px`;
      }
      if (partial.fontWeight !== undefined) {
        el.style.fontWeight = String(partial.fontWeight);
      }
    },
    [getDoc, totalWidth, previewH],
  );

  return { patchBackground, patchElement };
}
