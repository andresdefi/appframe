import { useCallback, useEffect, useRef, useState } from 'react';
import { usePreviewStore } from '../../store';
import {
  getScreenshotClientRect,
  isFlatScreenshotTransform,
  type ClientRect,
} from '../../utils/calloutSelectionGeometry';
import { getPreviewSurface } from '../../utils/previewSurfaceRegistry';

/**
 * Drag-to-select overlay for the Callouts feature. Renders only on the
 * active screen card while `state.calloutSelection != null`. Captures the
 * pointer, draws the live selection rectangle relative to the screenshot,
 * and on release will hand off to Phase 2's callout-creation logic.
 *
 * Coordinate model:
 *  - All math is done in client (viewport) px so it composes with the
 *    container's CSS scale automatically.
 *  - The visual rectangle is positioned absolutely inside the container
 *    via `left/top` derived from `containerRect`, which is the same
 *    element this overlay is a child of.
 *
 * v1 disables itself when the device's transform isn't flat. The Effects
 * sidebar already gates the entry point, but rechecking here covers the
 * race where a layout toggle lands between "Select Area" click and the
 * overlay mounting.
 */

interface Props {
  /** Index of the screen card hosting this overlay — used to look up the
   *  active shadow surface from the registry. */
  screenIndex: number;
  /** Layout preset of the underlying screen, used for flat-transform gating. */
  layout: string | undefined;
  /** Called on pointer-up with the final selection rectangle in normalised
   *  screenshot coordinates (0..1, top-left + bottom-right). The host is
   *  responsible for creating/updating the callout and clearing selection
   *  state; on a tiny-drag the host will typically just cancel. */
  onCommit: (rect: { u0: number; v0: number; u1: number; v1: number }) => void;
}

interface DragState {
  /** Anchor point (where pointer-down landed), client px relative to the
   *  screenshot rect's top-left corner — normalised 0..1. */
  anchor: { u: number; v: number };
  /** Current pointer position in the same normalised space. */
  current: { u: number; v: number };
}

export function CalloutSelectionOverlay({ screenIndex, layout, onCommit }: Props) {
  const calloutSelection = usePreviewStore((s) => s.calloutSelection);
  const cancelCalloutSelection = usePreviewStore((s) => s.cancelCalloutSelection);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  // Memoised screenshot rect captured at pointer-down so the rectangle's
  // anchor stays stable even if a re-render shifts surrounding elements.
  const screenshotRectRef = useRef<ClientRect | null>(null);
  // Same idea for the container (this overlay's box) — the rendered
  // rectangle is positioned relative to it.
  const containerRectRef = useRef<ClientRect | null>(null);

  const isActive = calloutSelection !== null;
  const reselectIdx = calloutSelection?.reselectIdx ?? null;

  // Hide the callout card being reselected so the user can see what's
  // underneath when redrawing the source rectangle. Restored on overlay
  // unmount; in the commit path the ScreenCard handler patches the DOM
  // with the new source before the overlay unmounts, so the card reappears
  // already showing the new content with no flash.
  useEffect(() => {
    if (!isActive || reselectIdx === null) return;
    const surface = getPreviewSurface(screenIndex);
    if (!surface) return;
    const card = surface.querySelector<HTMLElement>(`.callout-card[data-idx="${reselectIdx}"]`);
    if (!card) return;
    const prev = card.style.visibility;
    card.style.visibility = 'hidden';
    return () => {
      card.style.visibility = prev;
    };
  }, [isActive, reselectIdx, screenIndex]);

  // Escape cancels selection. Bound on window so it works even when the
  // overlay doesn't have focus (which it usually won't — the pointer
  // gesture is the only interaction, no keyboard surface to focus).
  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancelCalloutSelection();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isActive, cancelCalloutSelection]);

  const flatCheckOk = useCallback(() => {
    const surface = getPreviewSurface(screenIndex);
    if (!surface) return false;
    return isFlatScreenshotTransform(surface, layout);
  }, [screenIndex, layout]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return; // primary button only
      if (!flatCheckOk()) {
        cancelCalloutSelection();
        return;
      }
      const surface = getPreviewSurface(screenIndex);
      if (!surface) return;
      const ssRect = getScreenshotClientRect(surface);
      if (!ssRect) return;
      const overlay = overlayRef.current;
      if (!overlay) return;
      const overlayRect = overlay.getBoundingClientRect();
      // Clamp the anchor into [0,1] — pointer-down outside the screenshot
      // still anchors to the nearest edge so the user can drag inward
      // without the rectangle disappearing.
      const u = clamp01((e.clientX - ssRect.left) / ssRect.width);
      const v = clamp01((e.clientY - ssRect.top) / ssRect.height);
      screenshotRectRef.current = ssRect;
      containerRectRef.current = {
        left: overlayRect.left,
        top: overlayRect.top,
        width: overlayRect.width,
        height: overlayRect.height,
      };
      setDrag({ anchor: { u, v }, current: { u, v } });
      try {
        overlay.setPointerCapture(e.pointerId);
      } catch {
        // Pointer capture is best-effort; without it move events still
        // fire on the overlay as long as the cursor stays inside it.
      }
    },
    [screenIndex, flatCheckOk, cancelCalloutSelection],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!drag) return;
      const ssRect = screenshotRectRef.current;
      if (!ssRect) return;
      const u = clamp01((e.clientX - ssRect.left) / ssRect.width);
      const v = clamp01((e.clientY - ssRect.top) / ssRect.height);
      setDrag((prev) => (prev ? { ...prev, current: { u, v } } : null));
    },
    [drag],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!drag) {
        // Click-without-drag inside the overlay → cancel. The user
        // probably clicked-through expecting the screenshot to react.
        cancelCalloutSelection();
        return;
      }
      const overlay = overlayRef.current;
      try {
        overlay?.releasePointerCapture(e.pointerId);
      } catch {
        // Capture may have never been granted; harmless either way.
      }
      const finalRect = {
        u0: drag.anchor.u,
        v0: drag.anchor.v,
        u1: drag.current.u,
        v1: drag.current.v,
      };
      setDrag(null);
      screenshotRectRef.current = null;
      containerRectRef.current = null;
      // The host (ScreenCard) is responsible for the actual conversion
      // and store mutation, and for clearing the selection-mode flag.
      onCommit(finalRect);
    },
    [drag, cancelCalloutSelection, onCommit],
  );

  if (!isActive) return null;

  // Build the live rectangle's CSS box in container px. We have:
  //   - screenshotRectRef (client px, captured at pointer-down)
  //   - containerRect (current overlay rect)
  // Both are client-px so subtracting gives the screenshot's offset
  // inside the overlay; multiplying by u/v then yields container px.
  let rectBox: { left: number; top: number; width: number; height: number } | null = null;
  if (drag && screenshotRectRef.current && containerRectRef.current) {
    const ss = screenshotRectRef.current;
    const c = containerRectRef.current;
    const x0 = Math.min(drag.anchor.u, drag.current.u);
    const y0 = Math.min(drag.anchor.v, drag.current.v);
    const x1 = Math.max(drag.anchor.u, drag.current.u);
    const y1 = Math.max(drag.anchor.v, drag.current.v);
    rectBox = {
      left: ss.left - c.left + x0 * ss.width,
      top: ss.top - c.top + y0 * ss.height,
      width: (x1 - x0) * ss.width,
      height: (y1 - y0) * ss.height,
    };
  }

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-30"
      style={{ cursor: 'crosshair', touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label="Select callout source area"
    >
      {/* Dim mask + selection cutout. While not dragging, dim the whole
          screen card so the user sees they're in a modal-ish mode. Once
          dragging starts, the selected rectangle gets a brighter border
          and the rest stays dimmed. */}
      {!rectBox && <div className="absolute inset-0 bg-black/30 pointer-events-none" />}
      {rectBox && (
        <>
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
          <div
            className="absolute pointer-events-none"
            style={{
              left: rectBox.left,
              top: rectBox.top,
              width: rectBox.width,
              height: rectBox.height,
              // Crisp 1px white border with a black halo so it reads on
              // light AND dark screenshots without animating any expensive
              // properties.
              boxShadow:
                '0 0 0 1px #fff, 0 0 0 2px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.15)',
              background: 'rgba(59,130,246,0.18)',
            }}
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
}

function clamp01(v: number): number {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}
