import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { usePreviewStore } from '../../store';
import { fetchPanoramicPreviewHtml } from '../../utils/api';
import { setPanoramicIframe } from '../../utils/panoramicIframeRef';
import { iframePreviewSurface } from '../../utils/previewSurface';
import {
  getPanoramicPreviewSurface,
  setPanoramicPreviewSurface,
} from '../../utils/previewSurfaceRegistry';
import {
  rewritePanoramicBackgroundForPreview,
  rewritePanoramicElementsForPreview,
} from '../../utils/previewBody';
import { getLocaleLabel } from '@appframe/core/locales';
import { InactivePanoramicRow } from './InactivePanoramicRow';
import { LocaleRowHeader } from './LocaleRowHeader';
import { useConfirmDialog } from '../Controls/ConfirmDialog';

export function PanoramicPreview() {
  const { confirm, dialog: confirmDialog } = useConfirmDialog();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = usePreviewStore((s) => s.config);
  const previewW = usePreviewStore((s) => s.previewW);
  const previewH = usePreviewStore((s) => s.previewH);
  const sessionLocales = usePreviewStore((s) => s.sessionLocales);
  const activeLocale = usePreviewStore((s) => s.locale);
  const setLocale = usePreviewStore((s) => s.setLocale);
  const removeLocale = usePreviewStore((s) => s.removeLocale);
  const activeVariantId = usePreviewStore((s) => s.activeVariantId);
  const localeConfig = usePreviewStore((s) => s.sessionLocales[s.locale]);
  const renderVersion = usePreviewStore((s) => s.renderVersion);
  const screensVersion = usePreviewStore((s) => s.screensVersion);
  const localeVersions = usePreviewStore((s) => s.localeVersions);
  const frameCount = usePreviewStore((s) => s.panoramicFrameCount);
  const background = usePreviewStore((s) => s.panoramicBackground);
  const elements = usePreviewStore((s) => s.panoramicElements);
  const panoramicEffects = usePreviewStore((s) => s.panoramicEffects);
  const selectedElementIndex = usePreviewStore((s) => s.selectedElementIndex);
  const setSelectedElement = usePreviewStore((s) => s.setSelectedElement);
  const updateElement = usePreviewStore((s) => s.updatePanoramicElement);

  // Canvas shows at most two rows by default: Default plus the
  // currently-active locale (if non-default). `canvasCompareAll` opts
  // into the full stacked view across all locales. Toggle lives in
  // PreviewArea's bottom pill (same store field — shared preference).
  const localePanoramicMap = usePreviewStore((s) => s.localePanoramicElements);
  const canvasCompareAll = usePreviewStore((s) => s.canvasCompareAll);
  const localeOrder = useMemo(() => {
    if (canvasCompareAll) return ['default', ...Object.keys(localePanoramicMap)];
    if (activeLocale === 'default') return ['default'];
    return ['default', activeLocale];
  }, [canvasCompareAll, activeLocale, localePanoramicMap]);
  const variantKey = activeVariantId ?? 'no-variant';

  // Guard against an active locale that isn't represented in this mode
  // (e.g. user added Spanish in Individual then switched here). Reset to
  // default so the live preview body doesn't reference a missing locale.
  useEffect(() => {
    if (activeLocale !== 'default' && !localeOrder.includes(activeLocale)) {
      setLocale('default');
    }
  }, [activeLocale, localeOrder, setLocale]);

  const [scale, setScale] = useState(0.3);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Drag state
  const dragRef = useRef<{
    elementIndex: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // Register both the raw iframe (legacy consumers) and the
  // PreviewSurface adapter. Phase 1 hooks should read from the adapter;
  // the iframe ref stays for any consumer that hasn't migrated yet.
  useEffect(() => {
    setPanoramicIframe(iframeRef.current);
    const surface = iframeRef.current
      ? iframePreviewSurface(iframeRef.current)
      : null;
    setPanoramicPreviewSurface(surface);
    return () => {
      setPanoramicIframe(null);
      setPanoramicPreviewSurface(null);
    };
  }, []);

  const totalCanvasWidth = previewW * frameCount;

  // Compute scale so all locale rows fit both horizontally and vertically.
  // Each panoramic row has a frame-labels strip above the canvas; rows
  // stack vertically with a small gap so the user can see every locale
  // at the default zoom.
  const localeCount = localeOrder.length;
  const computeScale = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const padding = 48;
    const zoomBarHeight = 120;
    const rowHeaderH = 36; // LocaleRowHeader + gap
    const frameLabelsH = 16; // "Frame N" strip + mb-1
    const rowGap = 8;
    const areaW = area.clientWidth - padding;
    const areaH = area.clientHeight - zoomBarHeight;

    const scaleForW = areaW / totalCanvasWidth;

    const N = Math.max(1, localeCount);
    const verticalOverhead = N * (rowHeaderH + frameLabelsH) + (N - 1) * rowGap;
    const scaleForH = (areaH - verticalOverhead) / (N * previewH);

    let s = Math.min(scaleForW, scaleForH);
    s = Math.min(s, 1);
    s = Math.max(s, 0.05);
    setScale(s);
  }, [totalCanvasWidth, previewH, localeCount]);

  useEffect(() => {
    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [computeScale]);

  // Render panoramic preview
  useEffect(() => {
    if (!config) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(
      () => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        // Rewrite screenshot URLs to their preview-resolution variants for
        // the live iframe, and ask the server to use the preview-resize
        // device-frame URL too. Export goes through its own pipeline and
        // keeps full-res URLs — only the on-screen panoramic preview
        // gets the smaller bitmaps.
        const body = {
          locale: activeLocale,
          localeConfig,
          frameCount,
          frameWidth: previewW,
          frameHeight: previewH,
          background: rewritePanoramicBackgroundForPreview(background),
          elements: rewritePanoramicElementsForPreview(elements),
          font: config.theme.font,
          fontWeight: config.theme.fontWeight,
          frameStyle: config.frames.style,
          effects: panoramicEffects.spotlightEnabled
            ? panoramicEffects
            : { ...panoramicEffects, spotlight: null },
          previewMode: true,
        };

        fetchPanoramicPreviewHtml(body as Record<string, unknown>, controller.signal)
          .then((html) => {
            const surface = getPanoramicPreviewSurface();
            if (!surface) return;
            surface.replaceContent(html);
            setLoading(false);
          })
          .catch((err) => {
            if (err instanceof DOMException && err.name === 'AbortError') return;
            console.error('[PanoramicPreview] fetch failed:', err);
            setLoading(false);
          });
      },
      loading ? 0 : 200,
    );

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [
    config,
    activeLocale,
    localeConfig,
    frameCount,
    previewW,
    previewH,
    background,
    elements,
    panoramicEffects,
    renderVersion,
  ]);

  // --- Drag-to-reposition ---
  // Convert mouse event coords to canvas % position
  const mouseToCanvasPercent = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = ((clientX - rect.left) / (totalCanvasWidth * scale)) * 100;
      const y = ((clientY - rect.top) / (previewH * scale)) * 100;
      return { x, y };
    },
    [totalCanvasWidth, previewH, scale],
  );

  // Find which element contains the click point (bounding box hit test)
  const findElementAtPoint = useCallback(
    (clientX: number, clientY: number): number | null => {
      const pos = mouseToCanvasPercent(clientX, clientY);
      if (!pos) return null;

      // Check elements in reverse z-order (highest z first) so top elements get priority
      let bestIndex: number | null = null;
      let bestZ = -1;

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i]!;

        // Compute bounding box in canvas % coordinates
        let hitW: number; // % of totalCanvasWidth
        let hitH: number; // % of previewH

        if (el.type === 'device') {
          hitW = el.width;
          // Estimate device height: typical phone frame ~2.1:1 aspect ratio
          hitH = (((el.width / 100) * totalCanvasWidth * 2.1) / previewH) * 100;
        } else if (
          el.type === 'image' ||
          el.type === 'logo' ||
          el.type === 'crop' ||
          el.type === 'card' ||
          el.type === 'badge' ||
          el.type === 'proof-chip' ||
          el.type === 'group'
        ) {
          hitW = el.width;
          hitH = el.height;
        } else if (el.type === 'text') {
          hitW = el.maxWidth || 15;
          hitH = (((el.fontSize / 100) * previewH * 2) / previewH) * 100; // ~2 lines of text
        } else if (el.type === 'decoration') {
          hitW = el.width;
          hitH = el.height
            ? (((el.height / 100) * previewH) / previewH) * 100
            : (hitW * totalCanvasWidth) / previewH;
        } else {
          // label
          hitW = 10;
          hitH = 5;
        }

        if (
          pos.x >= el.x &&
          pos.x <= el.x + hitW &&
          pos.y >= el.y &&
          pos.y <= el.y + hitH &&
          el.z > bestZ
        ) {
          bestZ = el.z;
          bestIndex = i;
        }
      }

      return bestIndex;
    },
    [elements, mouseToCanvasPercent, totalCanvasWidth, previewH],
  );

  const handleOverlayMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const pos = mouseToCanvasPercent(e.clientX, e.clientY);
      if (!pos) return;

      // Find element to drag
      const idx = findElementAtPoint(e.clientX, e.clientY);
      if (idx !== null) {
        setSelectedElement(idx);
        const el = elements[idx]!;
        dragRef.current = {
          elementIndex: idx,
          startX: e.clientX,
          startY: e.clientY,
          origX: el.x,
          origY: el.y,
        };
        setIsDragging(true);
        e.preventDefault();
      }
    },
    [mouseToCanvasPercent, findElementAtPoint, elements, setSelectedElement],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      // Compute pixel delta in iframe coordinate space (divide by view scale)
      const dxPx = (e.clientX - drag.startX) / scale;
      const dyPx = (e.clientY - drag.startY) / scale;

      // Use transform: translate() instead of left/top to avoid ghost artifacts
      // (transform is compositor-only, doesn't trigger layout/repaint of vacated area)
      const surface = getPanoramicPreviewSurface();
      if (surface) {
        const sorted = [...elements].map((el, i) => ({ z: el.z, i })).sort((a, b) => a.z - b.z);
        const sortedIdx = sorted.findIndex((s) => s.i === drag.elementIndex);
        const domEl = surface.querySelector(`[data-index="${sortedIdx}"]`) as HTMLElement | null;
        if (domEl) {
          const el = elements[drag.elementIndex]!;
          const rotation = 'rotation' in el && el.rotation ? el.rotation : 0;
          // Strip filter (drop-shadow) during drag to eliminate ghost artifacts
          domEl.style.filter = 'none';
          domEl.style.transform = `translate(${dxPx}px, ${dyPx}px) rotate(${rotation}deg)`;
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const dx = ((e.clientX - drag.startX) / (totalCanvasWidth * scale)) * 100;
      const dy = ((e.clientY - drag.startY) / (previewH * scale)) * 100;
      const newX = Math.round((drag.origX + dx) * 2) / 2;
      const newY = Math.round((drag.origY + dy) * 2) / 2;

      // Commit final position to store — triggers full re-render with correct left/top
      updateElement(drag.elementIndex, { x: newX, y: newY });
      dragRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [totalCanvasWidth, previewH, scale, elements, updateElement]);

  // Arrow key nudging for selected element
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selectedElementIndex === null) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const step = e.shiftKey ? 5 : 0.5;
      let dx = 0;
      let dy = 0;
      if (e.key === 'ArrowLeft') dx = -step;
      else if (e.key === 'ArrowRight') dx = step;
      else if (e.key === 'ArrowUp') dy = -step;
      else if (e.key === 'ArrowDown') dy = step;
      else return;

      e.preventDefault();
      const el = elements[selectedElementIndex];
      if (!el) return;
      updateElement(selectedElementIndex, {
        x: Math.round((el.x + dx) * 2) / 2,
        y: Math.round((el.y + dy) * 2) / 2,
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedElementIndex, elements, updateElement]);

  const [hoverCursor, setHoverCursor] = useState('default');

  const handleOverlayMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) return;
      const idx = findElementAtPoint(e.clientX, e.clientY);
      setHoverCursor(idx !== null ? 'grab' : 'default');
    },
    [isDragging, findElementAtPoint],
  );

  const renderActiveCanvas = () => (
    <div className="relative w-fit">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Frame boundary labels */}
      <div className="flex mb-1" style={{ width: totalCanvasWidth * scale }}>
        {Array.from({ length: frameCount }, (_, i) => (
          <div
            key={i}
            className="text-[9px] text-text-dim text-center border-x border-border/30"
            style={{ width: previewW * scale }}
          >
            Frame {i + 1}
          </div>
        ))}
      </div>

      <div
        ref={canvasRef}
        className="relative overflow-hidden rounded border border-border/30"
        style={{ width: totalCanvasWidth * scale, height: previewH * scale }}
      >
        <iframe
          ref={iframeRef}
          className="border-none block origin-top-left"
          style={{
            width: totalCanvasWidth,
            height: previewH,
            transform: `scale(${scale})`,
          }}
          title="Panoramic Preview"
        />
        {/* Drag overlay — captures mouse events above the iframe */}
        <div
          className="absolute inset-0 z-10"
          style={{ cursor: isDragging ? 'grabbing' : hoverCursor }}
          onMouseDown={handleOverlayMouseDown}
          onMouseMove={handleOverlayMouseMove}
        />
      </div>
    </div>
  );

  return (
    <>
    {confirmDialog}
    <div ref={areaRef} className="flex-1 flex flex-col overflow-hidden bg-bg relative">
      {/* Canvas — stacks one row per locale */}
      <div className="flex-1 overflow-auto">
        <div
          className={`flex flex-col gap-2 p-6 min-h-full min-w-min ${
            localeOrder.length <= 1 ? 'justify-center' : ''
          }`}
        >
          {localeOrder.map((loc) => {
            const active = loc === activeLocale;
            const label = loc === 'default' ? 'Default' : (sessionLocales[loc]?.label ?? getLocaleLabel(loc));
            return (
              <div key={loc} className="flex flex-col gap-1 items-center">
                <LocaleRowHeader
                  locale={loc}
                  label={label}
                  active={active}
                  onActivate={() => setLocale(loc)}
                  onRemove={loc !== 'default' ? async () => {
                    const ok = await confirm({
                      title: `Remove locale "${label}"?`,
                      message: 'Its text and uploaded screenshots will be discarded.',
                      confirmLabel: 'Remove',
                      destructive: true,
                    });
                    if (ok) removeLocale(loc);
                  } : undefined}
                />
                {active ? (
                  renderActiveCanvas()
                ) : (
                  <InactivePanoramicRow
                    locale={loc}
                    localeConfig={sessionLocales[loc]}
                    frameCount={frameCount}
                    previewW={previewW}
                    previewH={previewH}
                    scale={scale}
                    background={background}
                    elements={elements}
                    effects={panoramicEffects}
                    font={config?.theme.font ?? 'inter'}
                    fontWeight={config?.theme.fontWeight ?? 600}
                    frameStyle={config?.frames.style ?? 'modern'}
                    screensVersion={screensVersion}
                    localeVersion={localeVersions[loc] ?? 0}
                    variantKey={variantKey}
                    onActivate={() => setLocale(loc)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Floating zoom pill — matches individual mode. Element-select
          hint moves into its own floating chip above the pill so the
          zoom row stays compact. */}
      {selectedElementIndex !== null && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 pointer-events-none z-30">
          <div
            className="text-[9px] text-text-dim bg-surface-2 surface-card rounded-full px-3 py-1 pointer-events-auto"
            title="Use arrow keys to nudge selected element. Hold Shift for larger steps."
          >
            Arrow keys to nudge
          </div>
        </div>
      )}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 pointer-events-none z-30">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-full bg-surface-2 surface-card w-full max-w-md pointer-events-auto"
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[10px] text-text-dim shrink-0">Zoom</span>
          <input
            type="range"
            min={5}
            max={100}
            value={Math.round(scale * 100)}
            onChange={(e) => setScale(parseInt(e.target.value, 10) / 100)}
            className="flex-1 h-1 accent-accent"
            aria-label="Zoom level"
            aria-valuemin={5}
            aria-valuemax={100}
            aria-valuenow={Math.round(scale * 100)}
            aria-valuetext={`${Math.round(scale * 100)}%`}
          />
          <span className="text-[10px] text-text-dim w-9 text-right shrink-0 tabular-nums">{Math.round(scale * 100)}%</span>
          <button
            className="text-[10px] text-text-dim hover:text-text transition-opacity shrink-0"
            onClick={computeScale}
            aria-label="Reset zoom to fit"
          >
            Fit
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
