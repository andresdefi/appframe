import { useEffect, useRef, useState, useCallback } from 'react';
import { usePreviewStore } from '../../store';
import { fetchPreviewHtml } from '../../utils/api';
import { buildPreviewBody } from '../../utils/previewBody';
import { useDragPosition } from '../../hooks/useDragPosition';
import { useInstantPatch } from '../../hooks/useInstantPatch';
import { registerIframe } from '../../utils/iframeRegistry';
import { useConfirmDialog } from '../Controls/ConfirmDialog';
import { isSupportedImageFile, uploadImageFileToScreen } from '../../utils/uploadImageFile';
import { MAX_SCREENS_PER_PROJECT } from '../../utils/platformSelection';
import type { TextPosition } from '../../types';

function dataTransferHasFiles(dt: DataTransfer | null): boolean {
  if (!dt) return false;
  // Some browsers (Safari) populate items but not types until drop. Check both.
  if (dt.types && Array.from(dt.types).some((t) => t === 'Files')) return true;
  if (dt.items && Array.from(dt.items).some((i) => i.kind === 'file')) return true;
  return false;
}

export function PreviewArea() {
  const screens = usePreviewStore((s) => s.screens);
  const selectedScreen = usePreviewStore((s) => s.selectedScreen);
  const setSelectedScreen = usePreviewStore((s) => s.setSelectedScreen);
  const addScreen = usePreviewStore((s) => s.addScreen);
  const removeScreen = usePreviewStore((s) => s.removeScreen);
  const moveScreen = usePreviewStore((s) => s.moveScreen);

  // --- Drag-and-drop reorder state ---
  const [dragFromIdx, setDragFromIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [dragSide, setDragSide] = useState<'left' | 'right'>('right');

  const handleDragStart = useCallback((idx: number) => {
    setDragFromIdx(idx);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragFromIdx(null);
    setDragOverIdx(null);
  }, []);

  const handleDragOver = useCallback((idx: number, side: 'left' | 'right') => {
    setDragOverIdx(idx);
    setDragSide(side);
  }, []);

  const handleDragLeave = useCallback((idx: number) => {
    setDragOverIdx((current) => (current === idx ? null : current));
  }, []);

  const handleDrop = useCallback(() => {
    if (dragFromIdx === null || dragOverIdx === null) {
      setDragFromIdx(null);
      setDragOverIdx(null);
      return;
    }
    // Compute the target index. When dropping on the right side of a card,
    // the new position is one slot after that card. When the source is
    // already to the left of the target, dropping "right" means target+1
    // minus 1 (because removing source shifts indices) — net: target.
    let toIdx = dragSide === 'right' ? dragOverIdx + 1 : dragOverIdx;
    if (dragFromIdx < toIdx) toIdx -= 1;
    if (toIdx !== dragFromIdx && toIdx >= 0) {
      moveScreen(dragFromIdx, toIdx);
    }
    setDragFromIdx(null);
    setDragOverIdx(null);
  }, [dragFromIdx, dragOverIdx, dragSide, moveScreen]);

  // --- File-drop-from-OS state (separate from internal card reorder) ---
  const [fileDropTargetIdx, setFileDropTargetIdx] = useState<number | null>(null);
  const updateScreen = usePreviewStore((s) => s.updateScreen);

  const distributeFilesToScreens = useCallback(
    async (files: File[], startIdx: number) => {
      const images = files.filter(isSupportedImageFile);
      if (images.length === 0) return;
      // Upload sequentially so a slow connection doesn't fan out to N
      // concurrent requests, and so the user sees screens populate in order.
      const total = usePreviewStore.getState().screens.length;
      for (let i = 0; i < images.length; i++) {
        const targetIdx = startIdx + i;
        if (targetIdx >= total) break; // ignore overflow files for v1
        try {
          const patch = await uploadImageFileToScreen(images[i]!);
          updateScreen(targetIdx, patch);
        } catch (err) {
          console.error('Drop upload failed for screen', targetIdx, err);
        }
      }
    },
    [updateScreen],
  );
  const previewW = usePreviewStore((s) => s.previewW);
  const previewH = usePreviewStore((s) => s.previewH);
  const renderVersion = usePreviewStore((s) => s.renderVersion);
  const platform = usePreviewStore((s) => s.platform);
  const locale = usePreviewStore((s) => s.locale);
  const deviceFamilies = usePreviewStore((s) => s.deviceFamilies);
  const areaRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  // Compute scale to fit all screens + Add button in the available area
  const computeScale = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const padding = 48; // p-6 on both sides
    const gap = 16; // gap-4
    const headerHeight = 56; // zoom bar + some padding
    const areaW = area.clientWidth - padding;
    const areaH = area.clientHeight - headerHeight - padding;

    // Total items: N screen cards + 1 add-screen button (half-width)
    const itemCount = screens.length + 0.5;
    const totalGaps = screens.length * gap;

    // Scale to fit width: all cards + gaps must fit in areaW
    const scaleForW = (areaW - totalGaps) / (itemCount * previewW);
    // Scale to fit height: tallest card must fit in areaH
    const scaleForH = areaH / previewH;

    let s = Math.min(scaleForW, scaleForH);
    s = Math.min(s, 1.3);
    s = Math.max(s, 0.05);
    setScale(s);
  }, [previewH, previewW, screens.length]);

  useEffect(() => {
    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [computeScale]);

  // The slider stores its own position (0–100), not an absolute scale.
  // 0% always means "fit"; the effective scale recomputes when fit
  // recomputes (resize, add/remove screens) so cards re-snap to fit
  // automatically without the user touching the slider again. The Fit
  // button is now equivalent to setSliderPosition(0).
  const ZOOM_MAX = 1.5;
  const [sliderPosition, setSliderPosition] = useState(0);
  const zoomRange = Math.max(0, ZOOM_MAX - scale);
  const effectiveScale = scale + (sliderPosition / 100) * zoomRange;

  return (
    <div
      ref={areaRef}
      className="flex-1 flex flex-col overflow-hidden bg-bg relative"
      onDragOver={(e) => {
        // Stop the browser from navigating to the dropped file when the
        // user misses a card. The card-level handler still wins for files
        // dropped directly on a screen.
        if (dataTransferHasFiles(e.dataTransfer)) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }
      }}
      onDrop={(e) => {
        if (!dataTransferHasFiles(e.dataTransfer)) return;
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;
        // Fell off all cards — apply to the currently selected screen.
        void distributeFilesToScreens(files, selectedScreen);
      }}
    >
      <div className="flex-1 overflow-auto">
        <div
          className="flex items-center gap-4 p-6 min-w-min min-h-full"
          style={{ justifyContent: 'safe center' }}
        >
          {screens.map((screen, i) => (
            // Plain div, not motion.div. The framer-motion layout
            // animation was nice for reorder / add / remove, but it
            // also fired on every zoom slider tick because neighboring
            // cards shifted x as the dragged card's width changed.
            // Five springs overlapping per tick produced visible lag.
            // Zoom is used far more than reordering; bias for that.
            <div
              key={screen.id}
              className="shrink-0"
            >
            <ScreenCard
              key={`screen-${screen.id}`}
              index={i}
              selected={i === selectedScreen}
              previewW={previewW}
              previewH={previewH}
              scale={effectiveScale}
              headline={screen.headline}
              canRemove={screens.length > 1}
              canMoveLeft={i > 0}
              canMoveRight={i < screens.length - 1}
              onSelect={() => setSelectedScreen(i)}
              onRemove={() => removeScreen(i)}
              onMoveLeft={() => moveScreen(i, i - 1)}
              onMoveRight={() => moveScreen(i, i + 1)}
              renderVersion={renderVersion}
              platform={platform}
              locale={locale}
              deviceFamilies={deviceFamilies}
              fileDropActive={fileDropTargetIdx === i}
              onFileDragEnter={(idx) => setFileDropTargetIdx(idx)}
              onFileDragLeave={(idx) => setFileDropTargetIdx((cur) => (cur === idx ? null : cur))}
              onFileDrop={(idx, files) => {
                setFileDropTargetIdx(null);
                void distributeFilesToScreens(files, idx);
              }}
              dragFromIdx={dragFromIdx}
              dropIndicator={
                dragOverIdx === i && dragFromIdx !== null && dragFromIdx !== i
                  ? dragSide
                  : null
              }
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
            </div>
          ))}
          {screens.length < MAX_SCREENS_PER_PROJECT ? (
            <button
              className="shrink-0 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-border rounded-lg text-text-dim text-xs hover:border-accent hover:text-accent transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                width: Math.round(previewW * effectiveScale * 0.5),
                height: Math.round(previewH * effectiveScale),
              }}
              onClick={addScreen}
              aria-label={`Add a new screen (${screens.length} of ${MAX_SCREENS_PER_PROJECT})`}
              title={`${screens.length} of ${MAX_SCREENS_PER_PROJECT} screens used`}
            >
              <span>+ Add Screen</span>
              <span className="text-[10px] text-text-dim/70 tabular-nums">
                {screens.length}/{MAX_SCREENS_PER_PROJECT}
              </span>
            </button>
          ) : (
            <div
              className="shrink-0 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-border/50 rounded-lg text-text-dim/50 text-xs cursor-not-allowed select-none"
              style={{
                width: Math.round(previewW * effectiveScale * 0.5),
                height: Math.round(previewH * effectiveScale),
              }}
              title={`Maximum of ${MAX_SCREENS_PER_PROJECT} screens reached. Apple's App Store allows up to ${MAX_SCREENS_PER_PROJECT}; Google Play allows up to 8.`}
              aria-label={`Screen limit reached: ${MAX_SCREENS_PER_PROJECT} of ${MAX_SCREENS_PER_PROJECT}`}
            >
              <span>Max reached</span>
              <span className="text-[10px] text-text-dim/40 tabular-nums">
                {MAX_SCREENS_PER_PROJECT}/{MAX_SCREENS_PER_PROJECT}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Floating zoom pill — absolutely positioned at the bottom of
          the canvas so it doesn't claim its own row. pointer-events
          stay enabled on the pill itself; stopPropagation on each
          control prevents global drag handlers from interpreting the
          interaction as a canvas drag. z-30 sits above the screen
          card's internal spinner (z-20). */}
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
            min={0}
            max={100}
            value={sliderPosition}
            onChange={(e) => setSliderPosition(parseInt(e.target.value, 10))}
            className="flex-1 h-1 accent-accent"
            aria-label="Zoom level"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={sliderPosition}
            aria-valuetext={`${sliderPosition}% (${Math.round(effectiveScale * 100)}% scale)`}
          />
          <span className="text-[10px] text-text-dim w-9 text-right shrink-0 tabular-nums">{sliderPosition}%</span>
          <button
            className={`text-[10px] transition-opacity shrink-0 ${sliderPosition !== 0 ? 'text-text-dim hover:text-text' : 'text-text-dim/50 cursor-default'}`}
            onClick={() => setSliderPosition(0)}
            disabled={sliderPosition === 0}
            aria-label="Reset zoom to fit"
          >
            Fit
          </button>
        </div>
      </div>
    </div>
  );
}

interface ScreenCardProps {
  index: number;
  selected: boolean;
  previewW: number;
  previewH: number;
  scale: number;
  headline: string;
  canRemove: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  renderVersion: number;
  platform: string;
  locale: string;
  deviceFamilies: unknown[];
  // Drag-and-drop reorder
  dragFromIdx: number | null;
  dropIndicator: 'left' | 'right' | null;
  onDragStart: (idx: number) => void;
  onDragEnd: () => void;
  onDragOver: (idx: number, side: 'left' | 'right') => void;
  onDragLeave: (idx: number) => void;
  onDrop: () => void;
  // File drop from OS
  fileDropActive: boolean;
  onFileDragEnter: (idx: number) => void;
  onFileDragLeave: (idx: number) => void;
  onFileDrop: (idx: number, files: File[]) => void;
}

function ScreenCard({
  index,
  selected,
  previewW,
  previewH,
  dragFromIdx,
  dropIndicator,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  fileDropActive,
  onFileDragEnter,
  onFileDragLeave,
  onFileDrop,
  scale,
  canRemove,
  canMoveLeft,
  canMoveRight,
  onSelect,
  onRemove,
  onMoveLeft,
  onMoveRight,
  renderVersion,
  platform,
  locale,
  deviceFamilies,
}: ScreenCardProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { confirm, dialog } = useConfirmDialog();
  const [initialLoad, setInitialLoad] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const screen = usePreviewStore((s) => s.screens[index]);
  const localeConfig = usePreviewStore((s) => s.sessionLocales[s.locale]);
  const updateScreen = usePreviewStore((s) => s.updateScreen);

  // Register iframe in the shared registry for instant patching
  useEffect(() => {
    registerIframe(index, iframeRef.current);
    return () => registerIframe(index, null);
  }, [index]);

  const handleDeviceDrop = useCallback(
    (partial: { deviceTop: number; deviceOffsetX: number }) => {
      updateScreen(index, partial);
    },
    [index, updateScreen],
  );

  const handleTextDrop = useCallback(
    (cls: 'headline' | 'subtitle' | 'freeText', pos: TextPosition) => {
      const textPositions = {
        ...(screen?.textPositions ?? { headline: null, subtitle: null, freeText: null }),
      };
      textPositions[cls] = pos;
      updateScreen(index, { textPositions });
    },
    [index, screen?.textPositions, updateScreen],
  );

  const handleAnnotationDrop = useCallback(
    (idx: number, partial: { x: number; y: number }) => {
      if (!screen) return;
      const annotations = screen.annotations.map((a, i) =>
        i === idx ? { ...a, ...partial } : a,
      );
      updateScreen(index, { annotations });
    },
    [index, screen, updateScreen],
  );

  const handleOverlayDrop = useCallback(
    (idx: number, partial: { x: number; y: number }) => {
      if (!screen) return;
      const overlays = (screen.overlays ?? []).map((o, i) =>
        i === idx ? { ...o, ...partial } : o,
      );
      updateScreen(index, { overlays });
    },
    [index, screen, updateScreen],
  );

  const { onOverlayMouseDown, getCursorForPosition, isDragging, dragTarget } = useDragPosition(
    iframeRef,
    containerRef,
    screen,
    scale,
    previewW,
    previewH,
    handleDeviceDrop,
    handleTextDrop,
    handleAnnotationDrop,
    handleOverlayDrop,
  );

  const { patchLoupe } = useInstantPatch();
  // Ref-mirrors the latest loupe state so the MutationObserver can refresh
  // the loupe (when the device moves underneath it) without re-attaching
  // the observer on every loupe edit.
  const loupeRef = useRef(screen?.loupe);
  useEffect(() => {
    loupeRef.current = screen?.loupe;
  }, [screen?.loupe]);
  // patchLoupe's identity changes whenever `selectedScreen` flips (it closes
  // over a useCallback chained off the store subscription). Stuffing it in
  // a ref keeps `refreshLoupe` referentially stable so attachGuideObserver
  // and the render effect downstream don't re-fire on every screen click.
  // Without this, clicking any screen card rewrites all 5 iframes at once.
  const patchLoupeRef = useRef(patchLoupe);
  useEffect(() => {
    patchLoupeRef.current = patchLoupe;
  }, [patchLoupe]);
  const refreshLoupe = useCallback(() => {
    if (loupeRef.current) patchLoupeRef.current(loupeRef.current);
  }, []);

  const [cursorStyle, setCursorStyle] = useState('default');
  const [guides, setGuides] = useState<{ horizontal: boolean; vertical: boolean }>({
    horizontal: false,
    vertical: false,
  });
  // Mirror of `guides` so setGuidesIfChanged can compare against the latest
  // value without re-creating the callback on every render. Without this,
  // recomputeGuides runs on every MutationObserver tick (~60×/sec while
  // dragging) and React schedules a re-render for each one even when both
  // booleans are unchanged — because `{ vertical, horizontal }` is a new
  // object literal every call.
  const guidesRef = useRef(guides);
  const setGuidesIfChanged = useCallback(
    (next: { horizontal: boolean; vertical: boolean }) => {
      if (next.horizontal === guidesRef.current.horizontal && next.vertical === guidesRef.current.vertical) {
        return;
      }
      guidesRef.current = next;
      setGuides(next);
    },
    [],
  );
  const guideObserverRef = useRef<MutationObserver | null>(null);
  // Ref-mirror of dragTarget so recomputeGuides can stay deps-free; the
  // MutationObserver and iframe-rewrite effect that depend on it would
  // otherwise cascade-rerun on every drag start/end.
  const dragTargetRef = useRef(dragTarget);
  useEffect(() => {
    dragTargetRef.current = dragTarget;
  }, [dragTarget]);

  const recomputeGuides = useCallback(() => {
    const target = dragTargetRef.current;
    // No active drag → nothing to align, clear guides. Render-side already
    // gates on isDragging, but clearing here keeps internal state honest.
    if (!target) {
      setGuidesIfChanged({ horizontal: false, vertical: false });
      return;
    }
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc) {
      setGuidesIfChanged({ horizontal: false, vertical: false });
      return;
    }
    const canvas = doc.querySelector('.canvas') as HTMLElement | null;
    if (!canvas) {
      setGuidesIfChanged({ horizontal: false, vertical: false });
      return;
    }
    const cRect = canvas.getBoundingClientRect();
    const cCenterX = cRect.left + cRect.width / 2;
    const cCenterY = cRect.top + cRect.height / 2;
    // Drag offsets are stored as integer percentages of canvas width/height,
    // so each step moves the element by cRect.{w,h}/100 screen px. The guide
    // should fire only on the integer step closest to true center — half a
    // step in either direction.
    const tolerancePxX = cRect.width / 200;
    const tolerancePxY = cRect.height / 200;
    const view = doc.defaultView;

    // Pick the single element being dragged. Anything else has no bearing
    // on alignment feedback right now — checking all draggables would light
    // up the device's vertical guide (deviceOffsetX=0 by default) whenever
    // text is being dragged.
    let selector: string;
    if (target.kind === 'device') {
      selector = '.device-wrapper';
    } else if (target.kind === 'text') {
      // freeText maps to the CSS class `.free-text`; headline/subtitle match
      // their cls 1:1.
      selector = target.cls === 'freeText' ? '.free-text' : `.${target.cls}`;
    } else if (target.kind === 'annotation') {
      selector = `.annotation-shape[data-idx="${target.idx}"]`;
    } else {
      selector = `.overlay-item[data-idx="${target.idx}"]`;
    }
    const el = doc.querySelector(selector) as HTMLElement | null;
    if (!el) {
      setGuidesIfChanged({ horizontal: false, vertical: false });
      return;
    }
    // Text elements only produce a meaningful center check once
    // position:fixed is applied (set by useDragPosition on drag start). In
    // normal flow the block spans the entire text-area and would always
    // read as X-centered.
    if (target.kind === 'text' && view?.getComputedStyle(el).position !== 'fixed') {
      setGuidesIfChanged({ horizontal: false, vertical: false });
      return;
    }
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const vertical = Math.abs(centerX - cCenterX) <= tolerancePxX;
    const horizontal = Math.abs(centerY - cCenterY) <= tolerancePxY;
    setGuidesIfChanged({ vertical, horizontal });
  }, []);

  // MutationObserver fires only on style mutations, so drag-start (which
  // changes dragTarget but may not yet have moved the element) wouldn't
  // re-run the guide check. Recompute explicitly on every drag transition.
  useEffect(() => {
    recomputeGuides();
  }, [dragTarget, recomputeGuides]);

  // Attach a MutationObserver to every draggable element in the iframe (device
  // wrapper + headline + subtitle). Both slider instant patches and
  // mouse drags mutate inline style attributes, so watching each element's
  // style catches every reposition in real time. The iframe is rewritten on
  // full re-renders, so this is called again from the fetchPreviewHtml .then()
  // below to re-target the new element set.
  const attachGuideObserver = useCallback(() => {
    guideObserverRef.current?.disconnect();
    guideObserverRef.current = null;
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc) return;
    // Same callback handles two responsibilities: keep center guides in
    // sync with the dragged element, and re-sample the loupe whenever the
    // device-wrapper position/size changes so the magnifier tracks live.
    const onMutation = () => {
      recomputeGuides();
      refreshLoupe();
    };
    const observer = new MutationObserver(onMutation);
    const selectors = ['.device-wrapper', '.headline', '.subtitle', '.free-text'];
    let attached = 0;
    for (const selector of selectors) {
      const el = doc.querySelector(selector) as HTMLElement | null;
      if (!el) continue;
      observer.observe(el, { attributes: true, attributeFilter: ['style'] });
      attached++;
    }
    // Annotations and overlays (elements) are dynamic — observe every shape
    // that exists in the current render. The guide check filters by
    // dragTarget so only the active one matters.
    for (const el of Array.from(doc.querySelectorAll('.annotation-shape, .overlay-item'))) {
      observer.observe(el, { attributes: true, attributeFilter: ['style'] });
      attached++;
    }
    if (attached === 0) {
      setGuidesIfChanged({ horizontal: false, vertical: false });
      return;
    }
    recomputeGuides();
    guideObserverRef.current = observer;
  }, [recomputeGuides, refreshLoupe]);

  useEffect(() => () => {
    guideObserverRef.current?.disconnect();
    guideObserverRef.current = null;
  }, []);

  const handleOverlayMouseMove = useCallback(
    (e: React.MouseEvent) => {
      setCursorStyle(getCursorForPosition(e.clientX, e.clientY));
    },
    [getCursorForPosition],
  );

  useEffect(() => {
    if (!screen) return;

    // Debounce: wait for rapid changes to settle before fetching
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const body = buildPreviewBody(
        screen,
        platform,
        previewW,
        previewH,
        locale,
        localeConfig,
        deviceFamilies,
      );

      fetchPreviewHtml(body, controller.signal)
        .then((html) => {
          const iframe = iframeRef.current;
          if (!iframe) return;
          // Write directly to avoid srcdoc navigation flash
          const doc = iframe.contentDocument;
          if (doc) {
            doc.open();
            doc.write(html);
            doc.close();
          } else {
            iframe.srcdoc = html;
          }
          setInitialLoad(false);
          // The wrapper element is brand new after rewrite — re-target the
          // observer so slider + mouse drags keep firing guide updates.
          requestAnimationFrame(attachGuideObserver);
        })
        .catch((err) => {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          setInitialLoad(false);
        });
    }, initialLoad ? 0 : 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
    // renderVersion forces re-render when triggerRender() is called
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, renderVersion, platform, previewW, previewH, locale, localeConfig, deviceFamilies, attachGuideObserver]);

  return (
    <>
    {dialog}
    <div
      ref={cardRef}
      className={`shrink-0 cursor-pointer rounded-lg overflow-hidden bg-surface relative ring-1 transition-[box-shadow,border-color,opacity] duration-150 ${
        selected ? 'ring-2 ring-accent shadow-lg' : 'ring-border hover:ring-text-dim'
      } ${dragFromIdx === index ? 'opacity-40' : ''} ${
        fileDropActive ? 'ring-2 ring-accent' : ''
      }`}
      style={{ width: previewW * scale }}
      onClick={onSelect}
      onDragEnter={(e) => {
        if (dataTransferHasFiles(e.dataTransfer)) {
          e.preventDefault();
          onFileDragEnter(index);
        }
      }}
      onDragOver={(e) => {
        if (dataTransferHasFiles(e.dataTransfer)) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          // Keep the highlight in case onDragEnter didn't fire (Safari).
          if (!fileDropActive) onFileDragEnter(index);
          return;
        }
        if (dragFromIdx === null || dragFromIdx === index) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        // Direction-based: the side is determined by where the drag is
        // coming FROM, not where the cursor is within the target card.
        // Dragging leftward (from a higher index) inserts before; dragging
        // rightward inserts after. The cursor just has to be over the
        // target, no halfway threshold.
        const side: 'left' | 'right' = dragFromIdx > index ? 'left' : 'right';
        onDragOver(index, side);
      }}
      onDragLeave={(e) => {
        // Ignore dragLeave from internal child elements — only the card's
        // boundary counts. relatedTarget is null when leaving the window.
        const next = e.relatedTarget as Node | null;
        if (next && e.currentTarget.contains(next)) return;
        onDragLeave(index);
        onFileDragLeave(index);
      }}
      onDrop={(e) => {
        if (dataTransferHasFiles(e.dataTransfer)) {
          e.preventDefault();
          // Stop the event from bubbling to PreviewArea's onDrop, which
          // also handles file drops and would fire a second upload to
          // `selectedScreen` — replacing two cards from one drop.
          e.stopPropagation();
          const files = Array.from(e.dataTransfer.files);
          onFileDrop(index, files);
          return;
        }
        e.preventDefault();
        onDrop();
      }}
    >
      {/* Drop indicator — vertical bar on the targeted side */}
      {dropIndicator && (
        <div
          className={`absolute top-0 bottom-0 w-1 bg-accent rounded-full pointer-events-none z-10 ${
            dropIndicator === 'left' ? 'left-[-3px]' : 'right-[-3px]'
          }`}
          aria-hidden="true"
        />
      )}
      {/* File-drop overlay — appears when an OS file drag is over this card. */}
      {fileDropActive && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-accent/20 backdrop-blur-[2px] pointer-events-none"
          aria-hidden="true"
        >
          <div className="bg-surface/90 text-text text-xs font-medium px-3 py-1.5 rounded-full shadow">
            Drop to replace screenshot
          </div>
        </div>
      )}
      {/* Header — drag handle. Drags the WHOLE card visually via
          setDragImage(cardRef.current), not just the header strip.
          Below ~110px wide we'd be cramming controls into space that
          isn't there; we strip down to just the screen number. The
          whole header stays a drag source either way. */}
      <div
        className="flex items-center justify-between gap-1 px-2 py-1 bg-surface text-[10px] cursor-grab active:cursor-grabbing overflow-hidden"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          // Setting any drag data is required for Firefox to start the drag.
          e.dataTransfer.setData('text/plain', String(index));
          if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            e.dataTransfer.setDragImage(
              cardRef.current,
              e.clientX - rect.left,
              e.clientY - rect.top,
            );
          }
          onDragStart(index);
        }}
        onDragEnd={onDragEnd}
        title="Drag to reorder"
      >
        {previewW * scale >= 110 ? (
          <>
            {canMoveLeft ? (
              <button
                className="text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded shrink-0"
                onClick={(e) => { e.stopPropagation(); onMoveLeft(); }}
                title="Move left"
                aria-label={`Move screen ${index + 1} left`}
              >
                &lsaquo;
              </button>
            ) : <span className="w-4 shrink-0" />}
            <span className="text-text-dim font-medium truncate min-w-0">Screen {index + 1}</span>
            <div className="flex items-center gap-0.5 shrink-0">
              {canMoveRight && (
                <button
                  className="text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  onClick={(e) => { e.stopPropagation(); onMoveRight(); }}
                  title="Move right"
                  aria-label={`Move screen ${index + 1} right`}
                >
                  &rsaquo;
                </button>
              )}
              {canRemove && (
                <button
                  className="text-text-dim hover:text-red-400 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const ok = await confirm({ title: 'Remove Screen', message: `Remove Screen ${index + 1}? This cannot be undone.` });
                    if (ok) onRemove();
                  }}
                  title="Remove screen"
                  aria-label={`Remove screen ${index + 1}`}
                >
                  &times;
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <span className="w-3 shrink-0" />
            <span className="text-text-dim font-medium truncate min-w-0 text-center flex-1">{index + 1}</span>
            {canRemove ? (
              <button
                className="text-text-dim hover:text-red-400 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded shrink-0"
                onClick={async (e) => {
                  e.stopPropagation();
                  const ok = await confirm({ title: 'Remove Screen', message: `Remove Screen ${index + 1}? This cannot be undone.` });
                  if (ok) onRemove();
                }}
                title="Remove screen"
                aria-label={`Remove screen ${index + 1}`}
              >
                &times;
              </button>
            ) : <span className="w-3 shrink-0" />}
          </>
        )}
      </div>

      {/* Preview */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{
          width: previewW * scale,
          height: previewH * scale,
        }}
      >
        {initialLoad && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg z-20">
            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe
          ref={iframeRef}
          className="border-none block origin-top-left"
          style={{
            width: previewW,
            height: previewH,
            transform: `scale(${scale})`,
          }}
          title={`Screen ${index + 1}`}
        />
        {/* Center guides — only while actively dragging, and only when the
            dragged element's center exactly hits a canvas axis. */}
        {isDragging && guides.vertical && (
          <div
            className="absolute top-0 bottom-0 pointer-events-none z-10"
            style={{ left: '50%', width: 1, background: '#ef4444', transform: 'translateX(-50%)' }}
            aria-hidden="true"
          />
        )}
        {isDragging && guides.horizontal && (
          <div
            className="absolute left-0 right-0 pointer-events-none z-10"
            style={{ top: '50%', height: 1, background: '#ef4444', transform: 'translateY(-50%)' }}
            aria-hidden="true"
          />
        )}
        {/* Drag overlay — sits above iframe to capture pointer events */}
        <div
          className="absolute inset-0 z-10"
          style={{ cursor: cursorStyle }}
          onMouseDown={onOverlayMouseDown}
          onMouseMove={handleOverlayMouseMove}
        />
      </div>
    </div>
    </>
  );
}
