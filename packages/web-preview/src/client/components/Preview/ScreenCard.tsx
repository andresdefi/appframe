import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { usePreviewStore, selectScreensForLocale } from '../../store';
import { fetchPreviewHtml } from '../../utils/api';
import { buildPreviewBody } from '../../utils/previewBody';
import { useDragPosition } from '../../hooks/useDragPosition';
import { useInstantPatch } from '../../hooks/useInstantPatch';
import { registerIframe } from '../../utils/iframeRegistry';
import { useConfirmDialog } from '../Controls/ConfirmDialog';
import { dataTransferHasFiles } from '../../utils/dragUtils';
import type { TextPosition } from '../../types';

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
  canDuplicate: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onDuplicate: () => void;
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

export function ScreenCard({
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
  canDuplicate,
  onSelect,
  onRemove,
  onMoveLeft,
  onMoveRight,
  onDuplicate,
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

  // Snapshot model: read the active locale's own screen, not Default's
  // overlaid with locale text. When locale === 'default' this returns
  // state.screens[index] as before.
  const screen = usePreviewStore((s) => selectScreensForLocale(s, s.locale)[index]);
  const localeConfig = usePreviewStore((s) => s.sessionLocales[s.locale]);
  const updateScreen = usePreviewStore((s) => s.updateScreen);

  // Register iframe in the shared registry for instant patching
  useEffect(() => {
    registerIframe(index, iframeRef.current);
    return () => registerIframe(index, null);
  }, [index]);

  const { patchLoupe, patchCallout } = useInstantPatch();

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

  const handleLoupeDrop = useCallback(
    (partial: { displayX: number; displayY: number }) => {
      if (!screen?.loupe) return;
      updateScreen(index, { loupe: { ...screen.loupe, ...partial } });
    },
    [index, screen?.loupe, updateScreen],
  );

  // During a loupe drag, patch the iframe directly so both the wrapper
  // position AND the magnified content track the cursor live. The
  // canonical state update happens on release via handleLoupeDrop, so
  // the expensive iframe HTML rewrite only fires once per gesture.
  const handleLoupeInstant = useCallback(
    (partial: { displayX: number; displayY: number }) => {
      if (!screen?.loupe) return;
      patchLoupe({ ...screen.loupe, ...partial });
    },
    [screen?.loupe, patchLoupe],
  );

  const handleSpotlightDrop = useCallback(
    (partial: { x: number; y: number }) => {
      if (!screen?.spotlight) return;
      updateScreen(index, { spotlight: { ...screen.spotlight, ...partial } });
    },
    [index, screen?.spotlight, updateScreen],
  );

  const handleCalloutDrop = useCallback(
    (idx: number, partial: { displayX: number; displayY: number }) => {
      if (!screen) return;
      const callouts = (screen.callouts ?? []).map((c, i) =>
        i === idx ? { ...c, ...partial } : c,
      );
      updateScreen(index, { callouts });
    },
    [index, screen, updateScreen],
  );

  // Live callout patch — repositions the card AND re-crops the image
  // inside so the magnified content tracks the cursor during drag.
  // State update is deferred to release via handleCalloutDrop.
  const handleCalloutInstant = useCallback(
    (idx: number, partial: { displayX: number; displayY: number }) => {
      if (!screen) return;
      const co = screen.callouts[idx];
      if (!co) return;
      patchCallout(idx, { ...co, ...partial });
    },
    [screen, patchCallout],
  );

  // Non-default locales are frozen for structural data — device frame,
  // annotations, overlays, loupe, spotlight, callouts. Text positions
  // stay editable per locale since translations frequently need
  // different placement to fit longer / shorter copy.
  const allowedDragKinds = useMemo<
    ReadonlyArray<'device' | 'text' | 'annotation' | 'overlay' | 'loupe' | 'spotlight' | 'callout'>
  >(
    () =>
      locale === 'default'
        ? ['device', 'text', 'annotation', 'overlay', 'loupe', 'spotlight', 'callout']
        : ['text'],
    [locale],
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
    handleLoupeDrop,
    handleLoupeInstant,
    handleSpotlightDrop,
    handleCalloutDrop,
    handleCalloutInstant,
    allowedDragKinds,
  );

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
    } else if (target.kind === 'overlay') {
      selector = `.overlay-item[data-idx="${target.idx}"]`;
    } else if (target.kind === 'loupe') {
      selector = '.loupe-wrapper';
    } else if (target.kind === 'spotlight') {
      selector = '.spotlight-cutout';
    } else {
      // callout
      selector = `.callout-card[data-idx="${target.idx}"]`;
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
    // refreshLoupe is scoped to device-wrapper mutations only — running
    // it on every observed element (annotation, overlay, callout, etc.)
    // adds a full DOM re-patch per tick of every slider / drag, which
    // shows up as stutter on the heavier shapes (callouts especially).
    const onMutation = (records: MutationRecord[]) => {
      recomputeGuides();
      const deviceMoved = records.some((r) => {
        const t = r.target as Element;
        return t.classList?.contains('device-wrapper');
      });
      if (deviceMoved) {
        refreshLoupe();
      }
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
    for (const el of Array.from(doc.querySelectorAll('.annotation-shape, .overlay-item, .loupe-wrapper, .spotlight-cutout, .callout-card'))) {
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
        // previewMode = true: swap screenshot URLs to the .previews/ variant
        // so Safari decodes ~5× smaller bitmaps per iframe. Export uses the
        // same body builder with previewMode=false (its default) to keep
        // full-res output.
        true,
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
              {canDuplicate && (
                <button
                  className="text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded inline-flex items-center"
                  onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                  title="Duplicate screen"
                  aria-label={`Duplicate screen ${index + 1}`}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <rect x="4.5" y="4.5" width="9" height="9" rx="1.5" />
                    <path d="M2.5 11.5V3a.5.5 0 0 1 .5-.5h8.5" />
                  </svg>
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
            // `translateZ(0)` forces a composited GPU layer; willChange
            // tells the engine the layer is long-lived. Together they
            // discourage Safari from purging the iframe's decoded image
            // content during the ~30s inactivity window (the visible
            // "reload" the user observed in Safari but not Chromium).
            transform: `scale(${scale}) translateZ(0)`,
            willChange: 'transform',
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
        {/* Drag overlay — sits above iframe to capture pointer events.
            useDragPosition is configured per-locale to only allow text
            drags on non-default locales, so device / annotation /
            overlay drags are filtered at the hit-test layer. */}
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
