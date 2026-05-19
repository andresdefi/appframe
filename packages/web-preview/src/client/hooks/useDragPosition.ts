import { useCallback, useRef, useState } from 'react';
import type { ScreenState, TextPosition } from '../types';

type DragKind = 'device' | 'text' | 'annotation' | 'overlay' | 'loupe' | 'spotlight' | 'callout';

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
  annotationIdx?: number;
  startAnnX?: number;
  startAnnY?: number;
  overlayIdx?: number;
  startOverlayX?: number;
  startOverlayY?: number;
  // Loupe drag — displayX/displayY are canvas-%.
  startLoupeX?: number;
  startLoupeY?: number;
  // Spotlight drag — x/y are canvas-%.
  startSpotlightX?: number;
  startSpotlightY?: number;
  // Callout drag — displayX/displayY are screenshot-%, so we need the
  // screenshot rect captured at drag start to translate cursor canvas-px
  // into screenshot-%.
  calloutIdx?: number;
  startCalloutX?: number;
  startCalloutY?: number;
  ssLeft?: number;
  ssTop?: number;
  ssWidth?: number;
  ssHeight?: number;
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
  onTextDrop: (cls: 'headline' | 'subtitle' | 'freeText', pos: TextPosition) => void,
  onAnnotationDrop: (idx: number, partial: { x: number; y: number }) => void,
  onOverlayDrop: (idx: number, partial: { x: number; y: number }) => void,
  onLoupeDrop: (partial: { displayX: number; displayY: number }) => void,
  /** Called on every mousemove during a loupe drag so the magnified
   *  content (not just the wrapper) can track the cursor in real time.
   *  Optional — if omitted, only the release-time `onLoupeDrop` fires. */
  onLoupeInstant: ((partial: { displayX: number; displayY: number }) => void) | undefined,
  onSpotlightDrop: (partial: { x: number; y: number }) => void,
  onCalloutDrop: (idx: number, partial: { displayX: number; displayY: number }) => void,
  /** Called on every mousemove during a callout drag so the cropped /
   *  zoomed content tracks the cursor in real time. Optional. */
  onCalloutInstant: ((idx: number, partial: { displayX: number; displayY: number }) => void) | undefined,
  /** Restricts which kinds of drags can initiate. Defaults to all
   *  kinds. Non-default locales pass `['text']` so text can still be
   *  repositioned per locale (translations need different placement to
   *  fit longer / shorter text) while the device, annotation, and
   *  overlay drags stay locked to Default. */
  allowedKinds: ReadonlyArray<DragKind> = [
    'device',
    'text',
    'annotation',
    'overlay',
    'loupe',
    'spotlight',
    'callout',
  ],
) {
  const dragRef = useRef<DragState | null>(null);
  // Exposes what's actively being dragged so consumers (e.g. center guides)
  // can scope their feedback to that element rather than all draggables.
  const [dragTarget, setDragTarget] = useState<
    | { kind: 'device' }
    | { kind: 'text'; cls: 'headline' | 'subtitle' | 'freeText' }
    | { kind: 'annotation'; idx: number }
    | { kind: 'overlay'; idx: number }
    | { kind: 'loupe' }
    | { kind: 'spotlight' }
    | { kind: 'callout'; idx: number }
    | null
  >(null);
  const isDragging = dragTarget !== null;

  const hitTest = useCallback(
    (
      ix: number,
      iy: number,
    ):
      | { cls: string; el: HTMLElement; kind: 'device' | 'text' }
      | { cls: string; el: HTMLElement; kind: 'annotation'; annotationIdx: number }
      | { cls: string; el: HTMLElement; kind: 'overlay'; overlayIdx: number }
      | { cls: string; el: HTMLElement; kind: 'loupe' }
      | { cls: string; el: HTMLElement; kind: 'spotlight' }
      | { cls: string; el: HTMLElement; kind: 'callout'; calloutIdx: number }
      | null => {
      try {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) return null;

        // Use elementsFromPoint to get ALL elements at the click position,
        // then walk ancestors of each to classify the hit.
        // Collect unique text/device hits and prefer the closest text element.
        const allEls = doc.elementsFromPoint(ix, iy) as HTMLElement[];
        let headlineEl: HTMLElement | null = null;
        let subtitleEl: HTMLElement | null = null;
        let freeTextEl: HTMLElement | null = null;
        let deviceEl: HTMLElement | null = null;
        let annotationEl: HTMLElement | null = null;
        let overlayEl: HTMLElement | null = null;
        let loupeEl: HTMLElement | null = null;
        let spotlightEl: HTMLElement | null = null;
        let calloutEl: HTMLElement | null = null;

        for (const startEl of allEls) {
          let el: HTMLElement | null = startEl;
          while (el && el !== doc.documentElement) {
            if (!headlineEl && el.classList?.contains('headline')) headlineEl = el;
            if (!subtitleEl && el.classList?.contains('subtitle')) subtitleEl = el;
            if (!freeTextEl && el.classList?.contains('free-text')) freeTextEl = el;
            if (!deviceEl && el.classList?.contains('device-wrapper')) deviceEl = el;
            if (!annotationEl && el.classList?.contains('annotation-shape')) annotationEl = el;
            if (!overlayEl && el.classList?.contains('overlay-item')) overlayEl = el;
            if (!loupeEl && el.classList?.contains('loupe-wrapper')) loupeEl = el;
            if (!spotlightEl && el.classList?.contains('spotlight-cutout')) spotlightEl = el;
            if (!calloutEl && el.classList?.contains('callout-card')) calloutEl = el;
            el = el.parentElement as HTMLElement | null;
          }
        }

        // Priority matches visual z-index: overlays (z:10), callouts (z:10),
        // and loupe (z:10) sit on top of the screenshot. Then annotations
        // (z:6), then spotlight cutout (z:5), then text, then device.
        if (overlayEl) {
          const idxAttr = overlayEl.getAttribute('data-idx');
          const overlayIdx = idxAttr ? parseInt(idxAttr, 10) : -1;
          if (overlayIdx >= 0) {
            return { cls: 'overlay-item', el: overlayEl, kind: 'overlay', overlayIdx };
          }
        }
        if (calloutEl) {
          const idxAttr = calloutEl.getAttribute('data-idx');
          const calloutIdx = idxAttr ? parseInt(idxAttr, 10) : -1;
          if (calloutIdx >= 0) {
            return { cls: 'callout-card', el: calloutEl, kind: 'callout', calloutIdx };
          }
        }
        if (loupeEl) {
          return { cls: 'loupe-wrapper', el: loupeEl, kind: 'loupe' };
        }
        if (annotationEl) {
          const idxAttr = annotationEl.getAttribute('data-idx');
          const annotationIdx = idxAttr ? parseInt(idxAttr, 10) : -1;
          if (annotationIdx >= 0) {
            return { cls: 'annotation-shape', el: annotationEl, kind: 'annotation', annotationIdx };
          }
        }
        if (spotlightEl) {
          return { cls: 'spotlight-cutout', el: spotlightEl, kind: 'spotlight' };
        }
        // When multiple text elements overlap, pick the one whose vertical center is closest to the click.
        const textHits: Array<{ cls: 'headline' | 'subtitle' | 'freeText'; el: HTMLElement; dy: number }> = [];
        if (headlineEl) {
          const vr = getViewportRect(headlineEl);
          textHits.push({ cls: 'headline', el: headlineEl, dy: Math.abs(iy - (vr.top + vr.height / 2)) });
        }
        if (subtitleEl) {
          const vr = getViewportRect(subtitleEl);
          textHits.push({ cls: 'subtitle', el: subtitleEl, dy: Math.abs(iy - (vr.top + vr.height / 2)) });
        }
        if (freeTextEl) {
          const vr = getViewportRect(freeTextEl);
          textHits.push({ cls: 'freeText', el: freeTextEl, dy: Math.abs(iy - (vr.top + vr.height / 2)) });
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
      // Filter by the kinds the caller has allowed. For non-default
      // locales the caller passes ['text'] only — clicks on the device
      // or annotations should not start a drag, matching the structural
      // lock applied in the sidebar tabs.
      if (!allowedKinds.includes(hit.kind)) return;

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
        setDragTarget({ kind: 'device' });

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
          setDragTarget(null);
          onDeviceDrop({ deviceTop: newTop, deviceOffsetX: newOffsetX });
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      } else if (hit.kind === 'text') {
        const el = hit.el;
        const cls = hit.cls as 'headline' | 'subtitle' | 'freeText';
        const vr = getViewportRect(el);
        const alreadyPositioned = !!screen.textPositions[cls];
        // When already positioned, the element has transform: translateX(-50%),
        // so offsetLeft IS the visual center. In normal flow, the visual center
        // is left + width/2.
        const centerX = alreadyPositioned ? vr.left : vr.left + vr.width / 2;
        const origWidth = vr.width;

        if (!alreadyPositioned) {
          const rotation =
            cls === 'headline'
              ? screen.headlineRotation
              : cls === 'subtitle'
                ? screen.subtitleRotation
                : screen.freeTextRotation;
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
        setDragTarget({ kind: 'text', cls });

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
          setDragTarget(null);
          onTextDrop(drag.cls as 'headline' | 'subtitle' | 'freeText', { x: leftPct, y: topPct, width: widthPct });
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      } else if (hit.kind === 'annotation') {
        const idx = hit.annotationIdx;
        const ann = screen.annotations[idx];
        if (!ann) return;
        const el = hit.el;
        dragRef.current = {
          kind: 'annotation',
          el,
          startX: e.clientX,
          startY: e.clientY,
          startDeviceTop: 0,
          startDeviceOffsetX: 0,
          offsetX: 0,
          offsetY: 0,
          origWidth: 0,
          scale,
          annotationIdx: idx,
          startAnnX: ann.x,
          startAnnY: ann.y,
        };
        el.style.outline = '2px dashed rgba(99,102,241,0.5)';
        setDragTarget({ kind: 'annotation', idx });

        const onMove = (ev: MouseEvent) => {
          const drag = dragRef.current;
          if (!drag || drag.kind !== 'annotation') return;
          const dx = (ev.clientX - drag.startX) / drag.scale;
          const dy = (ev.clientY - drag.startY) / drag.scale;
          const newX = Math.max(0, Math.min(100, (drag.startAnnX ?? 0) + (dx / canvasW) * 100));
          const newY = Math.max(0, Math.min(100, (drag.startAnnY ?? 0) + (dy / canvasH) * 100));
          // x / y are center coords. Render with left = x - w/2, top = y - h/2
          // so the visual center tracks the cursor.
          const w = parseFloat(drag.el.style.width) || 0;
          const h = parseFloat(drag.el.style.height) || 0;
          drag.el.style.left = (newX - w / 2) + '%';
          drag.el.style.top = (newY - h / 2) + '%';
        };

        const onUp = (ev: MouseEvent) => {
          const drag = dragRef.current;
          if (!drag || drag.kind !== 'annotation') return;
          drag.el.style.outline = 'none';
          const dx = (ev.clientX - drag.startX) / drag.scale;
          const dy = (ev.clientY - drag.startY) / drag.scale;
          const newX = Math.max(0, Math.min(100, (drag.startAnnX ?? 0) + (dx / canvasW) * 100));
          const newY = Math.max(0, Math.min(100, (drag.startAnnY ?? 0) + (dy / canvasH) * 100));
          const roundedX = Math.round(newX * 10) / 10;
          const roundedY = Math.round(newY * 10) / 10;
          const annIdx = drag.annotationIdx ?? -1;
          dragRef.current = null;
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          setDragTarget(null);
          if (annIdx >= 0) onAnnotationDrop(annIdx, { x: roundedX, y: roundedY });
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      } else if (hit.kind === 'overlay') {
        const idx = hit.overlayIdx;
        const ov = screen.overlays[idx];
        if (!ov) return;
        const el = hit.el;
        dragRef.current = {
          kind: 'overlay',
          el,
          startX: e.clientX,
          startY: e.clientY,
          startDeviceTop: 0,
          startDeviceOffsetX: 0,
          offsetX: 0,
          offsetY: 0,
          origWidth: 0,
          scale,
          overlayIdx: idx,
          startOverlayX: ov.x,
          startOverlayY: ov.y,
        };
        el.style.outline = '2px dashed rgba(99,102,241,0.5)';
        setDragTarget({ kind: 'overlay', idx });

        const onMove = (ev: MouseEvent) => {
          const drag = dragRef.current;
          if (!drag || drag.kind !== 'overlay') return;
          const dx = (ev.clientX - drag.startX) / drag.scale;
          const dy = (ev.clientY - drag.startY) / drag.scale;
          // Allow off-canvas placement so elements can bleed past any edge.
          const newX = Math.max(-50, Math.min(150, (drag.startOverlayX ?? 0) + (dx / canvasW) * 100));
          const newY = Math.max(-50, Math.min(150, (drag.startOverlayY ?? 0) + (dy / canvasH) * 100));
          drag.el.style.left = newX + '%';
          drag.el.style.top = newY + '%';
        };

        const onUp = (ev: MouseEvent) => {
          const drag = dragRef.current;
          if (!drag || drag.kind !== 'overlay') return;
          drag.el.style.outline = 'none';
          const dx = (ev.clientX - drag.startX) / drag.scale;
          const dy = (ev.clientY - drag.startY) / drag.scale;
          const newX = Math.max(-50, Math.min(150, (drag.startOverlayX ?? 0) + (dx / canvasW) * 100));
          const newY = Math.max(-50, Math.min(150, (drag.startOverlayY ?? 0) + (dy / canvasH) * 100));
          const roundedX = Math.round(newX * 10) / 10;
          const roundedY = Math.round(newY * 10) / 10;
          const ovIdx = drag.overlayIdx ?? -1;
          dragRef.current = null;
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          setDragTarget(null);
          if (ovIdx >= 0) onOverlayDrop(ovIdx, { x: roundedX, y: roundedY });
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      } else if (hit.kind === 'loupe') {
        // Loupe displayX/Y are canvas-%. The template's source-mapping
        // is keyed off display position, so dragging the wrapper makes
        // the magnified content track whatever sits underneath it
        // automatically (no separate source update needed).
        if (!screen.loupe) return;
        const el = hit.el;
        dragRef.current = {
          kind: 'loupe',
          el,
          startX: e.clientX,
          startY: e.clientY,
          startDeviceTop: 0,
          startDeviceOffsetX: 0,
          offsetX: 0,
          offsetY: 0,
          origWidth: 0,
          scale,
          startLoupeX: screen.loupe.displayX ?? 50,
          startLoupeY: screen.loupe.displayY ?? 50,
        };
        el.style.outline = '2px dashed rgba(99,102,241,0.5)';
        setDragTarget({ kind: 'loupe' });

        const onMove = (ev: MouseEvent) => {
          const drag = dragRef.current;
          if (!drag || drag.kind !== 'loupe') return;
          const dx = (ev.clientX - drag.startX) / drag.scale;
          const dy = (ev.clientY - drag.startY) / drag.scale;
          const newX = Math.max(0, Math.min(100, (drag.startLoupeX ?? 50) + (dx / canvasW) * 100));
          const newY = Math.max(0, Math.min(100, (drag.startLoupeY ?? 50) + (dy / canvasH) * 100));
          const roundedX = Math.round(newX * 10) / 10;
          const roundedY = Math.round(newY * 10) / 10;
          if (onLoupeInstant) {
            // Lets the magnified content track the cursor too — the
            // patch re-positions wrapper AND recomputes the img
            // source offset so the loupe always shows what's beneath
            // it (Option B: coupled source).
            onLoupeInstant({ displayX: roundedX, displayY: roundedY });
          } else {
            // Fallback: just shift the wrapper without updating the
            // magnified content. Visual lag is acceptable when
            // there's no instant-patch consumer wired up.
            const wrapperW = drag.el.offsetWidth;
            const wrapperH = drag.el.offsetHeight;
            drag.el.style.left = ((newX / 100) * canvasW - wrapperW / 2) + 'px';
            drag.el.style.top = ((newY / 100) * canvasH - wrapperH / 2) + 'px';
          }
        };

        const onUp = (ev: MouseEvent) => {
          const drag = dragRef.current;
          if (!drag || drag.kind !== 'loupe') return;
          drag.el.style.outline = 'none';
          const dx = (ev.clientX - drag.startX) / drag.scale;
          const dy = (ev.clientY - drag.startY) / drag.scale;
          const newX = Math.max(0, Math.min(100, (drag.startLoupeX ?? 50) + (dx / canvasW) * 100));
          const newY = Math.max(0, Math.min(100, (drag.startLoupeY ?? 50) + (dy / canvasH) * 100));
          const roundedX = Math.round(newX * 10) / 10;
          const roundedY = Math.round(newY * 10) / 10;
          dragRef.current = null;
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          setDragTarget(null);
          onLoupeDrop({ displayX: roundedX, displayY: roundedY });
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      } else if (hit.kind === 'spotlight') {
        // Spotlight x/y are canvas-% (center of the cutout). Width/height
        // stay constant during drag — only position changes.
        if (!screen.spotlight) return;
        const el = hit.el;
        dragRef.current = {
          kind: 'spotlight',
          el,
          startX: e.clientX,
          startY: e.clientY,
          startDeviceTop: 0,
          startDeviceOffsetX: 0,
          offsetX: 0,
          offsetY: 0,
          origWidth: 0,
          scale,
          startSpotlightX: screen.spotlight.x,
          startSpotlightY: screen.spotlight.y,
        };
        el.style.outline = '2px dashed rgba(99,102,241,0.7)';
        setDragTarget({ kind: 'spotlight' });

        const onMove = (ev: MouseEvent) => {
          const drag = dragRef.current;
          if (!drag || drag.kind !== 'spotlight') return;
          if (!screen.spotlight) return;
          const dx = (ev.clientX - drag.startX) / drag.scale;
          const dy = (ev.clientY - drag.startY) / drag.scale;
          const newX = Math.max(0, Math.min(100, (drag.startSpotlightX ?? 0) + (dx / canvasW) * 100));
          const newY = Math.max(0, Math.min(100, (drag.startSpotlightY ?? 0) + (dy / canvasH) * 100));
          // Inline patch: left/top are in % and represent the top-left
          // corner of the cutout, so the center maps to (x - w/2, y - h/2).
          drag.el.style.left = (newX - screen.spotlight.w / 2) + '%';
          drag.el.style.top = (newY - screen.spotlight.h / 2) + '%';
        };

        const onUp = (ev: MouseEvent) => {
          const drag = dragRef.current;
          if (!drag || drag.kind !== 'spotlight') return;
          drag.el.style.outline = 'none';
          const dx = (ev.clientX - drag.startX) / drag.scale;
          const dy = (ev.clientY - drag.startY) / drag.scale;
          const newX = Math.max(0, Math.min(100, (drag.startSpotlightX ?? 0) + (dx / canvasW) * 100));
          const newY = Math.max(0, Math.min(100, (drag.startSpotlightY ?? 0) + (dy / canvasH) * 100));
          const roundedX = Math.round(newX * 10) / 10;
          const roundedY = Math.round(newY * 10) / 10;
          dragRef.current = null;
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          setDragTarget(null);
          onSpotlightDrop({ x: roundedX, y: roundedY });
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      } else if (hit.kind === 'callout') {
        // Callout displayX/Y are screenshot-% (relative to the .screenshot-
        // clip rect, not the canvas). Read the screenshot rect at drag
        // start to translate cursor canvas-px → screenshot-%.
        const idx = hit.calloutIdx;
        const co = screen.callouts[idx];
        if (!co) return;
        const el = hit.el;
        const ssEl = iframeRef.current?.contentDocument?.querySelector('.screenshot-clip') as
          | HTMLElement
          | null;
        if (!ssEl) return;
        // getBoundingClientRect inside an iframe returns coords in the
        // iframe's own viewport — i.e. canvas px — already unaffected by
        // the parent page's CSS transform on the iframe element. No
        // /scale conversion needed.
        const ssRect = ssEl.getBoundingClientRect();
        const ssLeft = ssRect.left;
        const ssTop = ssRect.top;
        const ssWidth = ssRect.width;
        const ssHeight = ssRect.height;
        dragRef.current = {
          kind: 'callout',
          el,
          startX: e.clientX,
          startY: e.clientY,
          startDeviceTop: 0,
          startDeviceOffsetX: 0,
          offsetX: 0,
          offsetY: 0,
          origWidth: 0,
          scale,
          calloutIdx: idx,
          startCalloutX: co.displayX,
          startCalloutY: co.displayY,
          ssLeft,
          ssTop,
          ssWidth,
          ssHeight,
        };
        el.style.outline = '2px dashed rgba(99,102,241,0.5)';
        setDragTarget({ kind: 'callout', idx });

        const onMove = (ev: MouseEvent) => {
          const drag = dragRef.current;
          if (!drag || drag.kind !== 'callout') return;
          const dx = (ev.clientX - drag.startX) / drag.scale;
          const dy = (ev.clientY - drag.startY) / drag.scale;
          const newX = Math.max(0, Math.min(100, (drag.startCalloutX ?? 50) + (dx / (drag.ssWidth ?? canvasW)) * 100));
          const newY = Math.max(0, Math.min(100, (drag.startCalloutY ?? 50) + (dy / (drag.ssHeight ?? canvasH)) * 100));
          const roundedX = Math.round(newX * 10) / 10;
          const roundedY = Math.round(newY * 10) / 10;
          const coIdx = drag.calloutIdx ?? -1;
          if (onCalloutInstant && coIdx >= 0) {
            // patchCallout repositions the card AND recomputes the
            // cropped image's offset, so the magnified content tracks
            // the cursor live.
            onCalloutInstant(coIdx, { displayX: roundedX, displayY: roundedY });
          } else {
            // Fallback: just shift the card without updating the
            // cropped content.
            const centerCanvasX = (drag.ssLeft ?? 0) + (drag.ssWidth ?? 0) * (newX / 100);
            const centerCanvasY = (drag.ssTop ?? 0) + (drag.ssHeight ?? 0) * (newY / 100);
            drag.el.style.left = centerCanvasX + 'px';
            drag.el.style.top = centerCanvasY + 'px';
          }
        };

        const onUp = (ev: MouseEvent) => {
          const drag = dragRef.current;
          if (!drag || drag.kind !== 'callout') return;
          drag.el.style.outline = 'none';
          const dx = (ev.clientX - drag.startX) / drag.scale;
          const dy = (ev.clientY - drag.startY) / drag.scale;
          const newX = Math.max(0, Math.min(100, (drag.startCalloutX ?? 50) + (dx / (drag.ssWidth ?? canvasW)) * 100));
          const newY = Math.max(0, Math.min(100, (drag.startCalloutY ?? 50) + (dy / (drag.ssHeight ?? canvasH)) * 100));
          const roundedX = Math.round(newX * 10) / 10;
          const roundedY = Math.round(newY * 10) / 10;
          const coIdx = drag.calloutIdx ?? -1;
          dragRef.current = null;
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          setDragTarget(null);
          if (coIdx >= 0) onCalloutDrop(coIdx, { displayX: roundedX, displayY: roundedY });
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      }
    },
    [screen, scale, toIframe, hitTest, onDeviceDrop, onTextDrop, onAnnotationDrop, onOverlayDrop, onLoupeDrop, onLoupeInstant, onSpotlightDrop, onCalloutDrop, onCalloutInstant, canvasW, canvasH, allowedKinds, iframeRef],
  );

  const getCursorForPosition = useCallback(
    (clientX: number, clientY: number): string => {
      const pos = toIframe(clientX, clientY);
      const hit = hitTest(pos.x, pos.y);
      if (!hit) return 'default';
      if (!allowedKinds.includes(hit.kind)) return 'default';
      if (
        hit.kind === 'device' ||
        hit.kind === 'annotation' ||
        hit.kind === 'overlay' ||
        hit.kind === 'loupe' ||
        hit.kind === 'spotlight' ||
        hit.kind === 'callout'
      ) {
        return 'move';
      }
      return 'grab';
    },
    [toIframe, hitTest, allowedKinds],
  );

  return { onOverlayMouseDown, getCursorForPosition, isDragging, dragTarget };
}
