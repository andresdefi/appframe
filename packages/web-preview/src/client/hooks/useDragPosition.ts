import { useCallback, useRef } from 'react';
import type { ScreenState, TextPosition } from '../types';

type DragKind = 'device' | 'text';

interface DragState {
  kind: DragKind;
  cls?: string; // 'headline' | 'subtitle' for text drags
  el: HTMLElement;
  startX: number;
  startY: number;
  startDeviceTop: number;
  startDeviceOffsetX: number;
  offsetX: number;
  offsetY: number;
  origWidth: number;
  scale: number;
}

function getElPos(el: HTMLElement) {
  return {
    top: el.offsetTop,
    left: el.offsetLeft,
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

/**
 * Compute element position relative to the iframe viewport using offset
 * properties. Unlike getBoundingClientRect(), this is not affected by CSS
 * transforms on the iframe element in the parent page, avoiding
 * progressive shrinking when the preview is scaled.
 */
function getViewportRect(el: HTMLElement) {
  let left = el.offsetLeft;
  let top = el.offsetTop;
  let parent = el.offsetParent as HTMLElement | null;
  while (parent) {
    left += parent.offsetLeft - parent.scrollLeft;
    top += parent.offsetTop - parent.scrollTop;
    parent = parent.offsetParent as HTMLElement | null;
  }
  return { left, top, width: el.offsetWidth, height: el.offsetHeight };
}

/**
 * Provides drag-to-reposition for device and text elements inside an iframe preview.
 * The drag overlay sits on top of the iframe and intercepts pointer events.
 *
 * Returns:
 * - onOverlayMouseDown: attach to the overlay div's onMouseDown
 */
export function useDragPosition(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  screen: ScreenState | undefined,
  scale: number,
  canvasW: number,
  canvasH: number,
  onDeviceDrop: (partial: { deviceTop: number; deviceOffsetX: number }) => void,
  onTextDrop: (cls: 'eyebrow' | 'headline' | 'subtitle', pos: TextPosition) => void,
) {
  const dragRef = useRef<DragState | null>(null);

  const hitTest = useCallback(
    (ix: number, iy: number): { cls: string; el: HTMLElement; kind: DragKind } | null => {
      try {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) return null;

        // Use elementsFromPoint to get ALL elements at the click position,
        // then walk ancestors of each to classify the hit.
        // Collect unique text/device hits and prefer the closest text element.
        const allEls = doc.elementsFromPoint(ix, iy) as HTMLElement[];
        let eyebrowEl: HTMLElement | null = null;
        let headlineEl: HTMLElement | null = null;
        let subtitleEl: HTMLElement | null = null;
        let deviceEl: HTMLElement | null = null;

        for (const startEl of allEls) {
          let el: HTMLElement | null = startEl;
          while (el && el !== doc.documentElement) {
            if (!eyebrowEl && el.classList?.contains('eyebrow')) eyebrowEl = el;
            if (!headlineEl && el.classList?.contains('headline')) headlineEl = el;
            if (!subtitleEl && el.classList?.contains('subtitle')) subtitleEl = el;
            if (!deviceEl && el.classList?.contains('device-wrapper')) deviceEl = el;
            el = el.parentElement as HTMLElement | null;
          }
        }

        // When multiple text elements overlap, pick the one whose vertical center is closest to the click.
        const textHits: Array<{ cls: 'eyebrow' | 'headline' | 'subtitle'; el: HTMLElement; dy: number }> = [];
        if (eyebrowEl) {
          const vr = getViewportRect(eyebrowEl);
          textHits.push({ cls: 'eyebrow', el: eyebrowEl, dy: Math.abs(iy - (vr.top + vr.height / 2)) });
        }
        if (headlineEl) {
          const vr = getViewportRect(headlineEl);
          textHits.push({ cls: 'headline', el: headlineEl, dy: Math.abs(iy - (vr.top + vr.height / 2)) });
        }
        if (subtitleEl) {
          const vr = getViewportRect(subtitleEl);
          textHits.push({ cls: 'subtitle', el: subtitleEl, dy: Math.abs(iy - (vr.top + vr.height / 2)) });
        }
        if (textHits.length > 0) {
          textHits.sort((a, b) => a.dy - b.dy);
          const best = textHits[0]!;
          return { cls: best.cls, el: best.el, kind: 'text' };
        }
        if (deviceEl) return { cls: 'device-wrapper', el: deviceEl, kind: 'device' };
      } catch {
        // Cross-origin or unavailable
      }
      return null;
    },
    [iframeRef],
  );

  const toIframe = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } => {
      const container = containerRef.current;
      if (!container) return { x: 0, y: 0 };
      const rect = container.getBoundingClientRect();
      return {
        x: (clientX - rect.left) / scale,
        y: (clientY - rect.top) / scale,
      };
    },
    [containerRef, scale],
  );

  const onOverlayMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!screen) return;
      const pos = toIframe(e.clientX, e.clientY);
      const hit = hitTest(pos.x, pos.y);
      if (!hit) return;

      e.preventDefault();

      if (hit.kind === 'device') {
        dragRef.current = {
          kind: 'device',
          el: hit.el,
          startX: e.clientX,
          startY: e.clientY,
          startDeviceTop: screen.deviceTop,
          startDeviceOffsetX: screen.deviceOffsetX,
          offsetX: 0,
          offsetY: 0,
          origWidth: 0,
          scale,
        };
        hit.el.style.outline = '2px solid rgba(99,102,241,0.5)';

        const onMove = (ev: MouseEvent) => {
          const drag = dragRef.current;
          if (!drag || drag.kind !== 'device') return;
          const dx = (ev.clientX - drag.startX) / drag.scale;
          const dy = (ev.clientY - drag.startY) / drag.scale;
          const newOffsetX = Math.max(-80, Math.min(80, drag.startDeviceOffsetX + Math.round((dx / canvasW) * 100)));
          const newTop = Math.max(-80, Math.min(80, drag.startDeviceTop + Math.round((dy / canvasH) * 100)));

          // Instant patch
          drag.el.style.top = newTop + '%';
          drag.el.style.left = newOffsetX
            ? `calc(50% + ${(newOffsetX / 100) * canvasW}px)`
            : '50%';
        };

        const onUp = (ev: MouseEvent) => {
          const drag = dragRef.current;
          if (!drag || drag.kind !== 'device') return;
          drag.el.style.outline = 'none';
          const dx = (ev.clientX - drag.startX) / drag.scale;
          const dy = (ev.clientY - drag.startY) / drag.scale;
          const newOffsetX = Math.max(-80, Math.min(80, drag.startDeviceOffsetX + Math.round((dx / canvasW) * 100)));
          const newTop = Math.max(-80, Math.min(80, drag.startDeviceTop + Math.round((dy / canvasH) * 100)));
          dragRef.current = null;
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          onDeviceDrop({ deviceTop: newTop, deviceOffsetX: newOffsetX });
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      } else if (hit.kind === 'text') {
        const el = hit.el;
        const cls = hit.cls as 'eyebrow' | 'headline' | 'subtitle';
        const vr = getViewportRect(el);
        const alreadyPositioned = !!screen.textPositions[cls];
        // When already positioned, the element has transform: translateX(-50%),
        // so offsetLeft IS the visual center. In normal flow, the visual center
        // is left + width/2.
        const centerX = alreadyPositioned ? vr.left : vr.left + vr.width / 2;
        const origWidth = vr.width;

        if (!alreadyPositioned) {
          const rotation = cls === 'headline'
            ? screen.headlineRotation
            : cls === 'subtitle'
              ? screen.subtitleRotation
              : 0;
          const parts = ['translateX(-50%)'];
          if (rotation) parts.push(`rotate(${rotation}deg)`);
          el.style.position = 'fixed';
          el.style.top = vr.top + 'px';
          el.style.left = centerX + 'px';
          el.style.transform = parts.join(' ');
          el.style.zIndex = '10';
          el.style.margin = '0';
          el.style.width = vr.width + 'px';
        }

        dragRef.current = {
          kind: 'text',
          cls,
          el,
          startX: e.clientX,
          startY: e.clientY,
          startDeviceTop: 0,
          startDeviceOffsetX: 0,
          offsetX: pos.x - centerX,
          offsetY: pos.y - vr.top,
          origWidth,
          scale,
        };
        el.style.outline = '2px dashed rgba(99,102,241,0.5)';

        const onMove = (ev: MouseEvent) => {
          const drag = dragRef.current;
          if (!drag || drag.kind !== 'text') return;
          const p = toIframe(ev.clientX, ev.clientY);
          drag.el.style.top = (p.y - drag.offsetY) + 'px';
          drag.el.style.left = (p.x - drag.offsetX) + 'px';
        };

        const onUp = () => {
          const drag = dragRef.current;
          if (!drag || drag.kind !== 'text') return;
          drag.el.style.outline = 'none';
          const finalPos = getElPos(drag.el);
          const topPct = Math.round(((finalPos.top / canvasH) * 100) * 10) / 10;
          const leftPct = Math.round(((finalPos.left / canvasW) * 100) * 10) / 10;
          const widthPct = Math.round(((drag.origWidth / canvasW) * 100) * 10) / 10;
          dragRef.current = null;
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          onTextDrop(drag.cls as 'eyebrow' | 'headline' | 'subtitle', { x: leftPct, y: topPct, width: widthPct });
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      }
    },
    [screen, scale, toIframe, hitTest, onDeviceDrop, onTextDrop],
  );

  const getCursorForPosition = useCallback(
    (clientX: number, clientY: number): string => {
      const pos = toIframe(clientX, clientY);
      const hit = hitTest(pos.x, pos.y);
      if (!hit) return 'default';
      return hit.kind === 'device' ? 'move' : 'grab';
    },
    [toIframe, hitTest],
  );

  return { onOverlayMouseDown, getCursorForPosition };
}
