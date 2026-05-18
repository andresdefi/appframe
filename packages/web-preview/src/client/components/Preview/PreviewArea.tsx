import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { usePreviewStore } from '../../store';
import { isSupportedImageFile, uploadImageFileToScreen } from '../../utils/uploadImageFile';
import { MAX_SCREENS_PER_PROJECT } from '../../utils/platformSelection';
import { dataTransferHasFiles } from '../../utils/dragUtils';
import { getLocaleLabel } from '@appframe/core/locales';
import { ScreenCard } from './ScreenCard';
import { InactiveLocaleRow } from './InactiveLocaleRow';
import { LocaleRowHeader } from './LocaleRowHeader';

export function PreviewArea() {
  const screens = usePreviewStore((s) => s.screens);
  const selectedScreen = usePreviewStore((s) => s.selectedScreen);
  const setSelectedScreen = usePreviewStore((s) => s.setSelectedScreen);
  const addScreen = usePreviewStore((s) => s.addScreen);
  const removeScreen = usePreviewStore((s) => s.removeScreen);
  const moveScreen = usePreviewStore((s) => s.moveScreen);

  // --- Locale axis state ---
  const sessionLocales = usePreviewStore((s) => s.sessionLocales);
  const activeLocale = usePreviewStore((s) => s.locale);
  const setLocale = usePreviewStore((s) => s.setLocale);
  const removeLocale = usePreviewStore((s) => s.removeLocale);
  const activeVariantId = usePreviewStore((s) => s.activeVariantId);

  // Default first, additional locales in insertion order. Object.keys
  // preserves insertion order for string keys (per ES2015+), so locales
  // appear in the order they were added — which matches the "chronological"
  // ordering decision from the plan. Only locales with `.screens` data show
  // here; Panoramic mode's locales (which carry `.panoramic` data instead)
  // live in PanoramicPreview.
  const localeOrder = useMemo(
    () => [
      'default',
      ...Object.keys(sessionLocales).filter((code) => sessionLocales[code]?.screens !== undefined),
    ],
    [sessionLocales],
  );

  // If the active locale isn't valid for this mode (e.g. user added Spanish
  // in Panoramic mode then switched here), fall back to default so the
  // sidebar Text tab doesn't write to an invisible locale.
  useEffect(() => {
    if (activeLocale !== 'default' && !localeOrder.includes(activeLocale)) {
      setLocale('default');
    }
  }, [activeLocale, localeOrder, setLocale]);

  // Capture cache key namespace. variants are orthogonal to locales: each
  // variant has its own locale captures, so prefix with variant id (or a
  // sentinel for "no variant") to keep them isolated.
  const variantKey = activeVariantId ?? 'no-variant';

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
  const deviceFamilies = usePreviewStore((s) => s.deviceFamilies);
  const areaRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  // Compute scale so all locale rows fit both horizontally and vertically.
  // Horizontal fit: one row's screen cards + Add button must fit areaW.
  // Vertical fit: N rows × cards + N row headers + (N-1) gaps must fit
  // areaH so the user can see every locale row at once at the default
  // zoom. Zooming in past that pushes content below the fold (vertical
  // scroll handles it).
  const localeCount = localeOrder.length;
  const computeScale = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const padding = 48; // p-6 on both sides
    const gap = 16; // gap-4 between screens in a row
    const zoomBarHeight = 56;
    const rowHeaderH = 36; // LocaleRowHeader + flex gap-1 between header and row
    const rowGap = 4; // gap-1 between locale sections (header + row pair)
    const areaW = area.clientWidth - padding;
    const areaH = area.clientHeight - zoomBarHeight - padding;

    // Total items per row: N screen cards + 1 add-screen button (half-width).
    // Even inactive rows have no add button, but using the active row's
    // width budget keeps every row visually consistent.
    const itemCount = screens.length + 0.5;
    const totalGaps = screens.length * gap;
    const scaleForW = (areaW - totalGaps) / (itemCount * previewW);

    // Total vertical budget across N locale rows.
    const N = Math.max(1, localeCount);
    const verticalOverhead = N * rowHeaderH + (N - 1) * rowGap;
    const scaleForH = (areaH - verticalOverhead) / (N * previewH);

    let s = Math.min(scaleForW, scaleForH);
    s = Math.min(s, 1.3);
    s = Math.max(s, 0.05);
    setScale(s);
  }, [previewH, previewW, screens.length, localeCount]);

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

  const renderActiveRow = () => (
    <div
      className="flex items-center gap-4 min-w-min"
      style={{ justifyContent: 'safe center' }}
    >
      {screens.map((screen, i) => (
        // Plain div, not motion.div. The framer-motion layout
        // animation was nice for reorder / add / remove, but it
        // also fired on every zoom slider tick because neighboring
        // cards shifted x as the dragged card's width changed.
        // Five springs overlapping per tick produced visible lag.
        // Zoom is used far more than reordering; bias for that.
        <div key={screen.id} className="shrink-0">
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
            locale={activeLocale}
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
  );

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
        <div className="flex flex-col gap-1 p-6 min-h-full min-w-min">
          {localeOrder.map((loc) => {
            const active = loc === activeLocale;
            const label = loc === 'default' ? 'Default' : (sessionLocales[loc]?.label ?? getLocaleLabel(loc));
            return (
              <div key={loc} className="flex flex-col gap-1">
                <LocaleRowHeader
                  locale={loc}
                  label={label}
                  active={active}
                  onActivate={() => setLocale(loc)}
                  onRemove={loc !== 'default' ? () => {
                    if (window.confirm(`Remove locale "${label}"? Its text and uploaded screenshots will be discarded.`)) {
                      removeLocale(loc);
                    }
                  } : undefined}
                />
                {active ? (
                  renderActiveRow()
                ) : (
                  <InactiveLocaleRow
                    locale={loc}
                    localeConfig={sessionLocales[loc]}
                    screens={screens}
                    platform={platform}
                    previewW={previewW}
                    previewH={previewH}
                    scale={effectiveScale}
                    renderVersion={renderVersion}
                    variantKey={variantKey}
                    onActivate={() => setLocale(loc)}
                  />
                )}
              </div>
            );
          })}
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

