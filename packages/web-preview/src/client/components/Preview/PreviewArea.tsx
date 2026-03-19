import { useEffect, useRef, useState, useCallback } from 'react';
import { usePreviewStore } from '../../store';
import { fetchPreviewHtml } from '../../utils/api';
import { buildPreviewBody } from '../../utils/previewBody';
import { useDragPosition } from '../../hooks/useDragPosition';
import { registerIframe } from '../../utils/iframeRegistry';
import { useConfirmDialog } from '../Controls/ConfirmDialog';
import type { TextPosition } from '../../types';

export function PreviewArea() {
  const screens = usePreviewStore((s) => s.screens);
  const selectedScreen = usePreviewStore((s) => s.selectedScreen);
  const setSelectedScreen = usePreviewStore((s) => s.setSelectedScreen);
  const addScreen = usePreviewStore((s) => s.addScreen);
  const removeScreen = usePreviewStore((s) => s.removeScreen);
  const moveScreen = usePreviewStore((s) => s.moveScreen);
  const previewW = usePreviewStore((s) => s.previewW);
  const previewH = usePreviewStore((s) => s.previewH);
  const previewBg = usePreviewStore((s) => s.previewBg);
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
    s = Math.max(s, 0.1);
    setScale(s);
  }, [previewH, previewW, screens.length]);

  useEffect(() => {
    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [computeScale]);

  const bgClass = previewBg === 'light' ? 'bg-gray-100' : 'bg-bg';

  const [manualZoom, setManualZoom] = useState<number | null>(null);
  const effectiveScale = manualZoom ?? scale;

  return (
    <div ref={areaRef} className={`flex-1 flex flex-col overflow-hidden ${bgClass}`}>
      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-center gap-4 p-6 min-w-min min-h-full">
          {screens.map((screen, i) => (
            <ScreenCard
              key={`screen-${screen.screenIndex}-${i}`}
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
            />
          ))}
          <button
            className="shrink-0 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-text-dim text-xs hover:border-accent hover:text-accent transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            style={{
              width: Math.round(previewW * effectiveScale * 0.5),
              height: Math.round(previewH * effectiveScale),
            }}
            onClick={addScreen}
            aria-label="Add a new frame"
          >
            + Add Frame
          </button>
        </div>
      </div>
      {/* Zoom control */}
      <div className="flex items-center gap-2 px-4 py-2 border-t border-border bg-surface">
        <span className="text-[10px] text-text-dim">Zoom</span>
        <input
          type="range"
          min={10}
          max={150}
          value={Math.round((manualZoom ?? scale) * 100)}
          onChange={(e) => setManualZoom(parseInt(e.target.value, 10) / 100)}
          className="flex-1 h-1 accent-accent"
          aria-label="Zoom level"
          aria-valuemin={10}
          aria-valuemax={150}
          aria-valuenow={Math.round((manualZoom ?? scale) * 100)}
          aria-valuetext={`${Math.round((manualZoom ?? scale) * 100)}%`}
        />
        <span className="text-[10px] text-text-dim w-8 text-right">{Math.round((manualZoom ?? scale) * 100)}%</span>
        <button
          className={`text-[10px] transition-opacity ${manualZoom !== null ? 'text-text-dim hover:text-text' : 'text-text-dim/50 cursor-default'}`}
          onClick={() => setManualZoom(null)}
          disabled={manualZoom === null}
          aria-label="Reset zoom to fit"
        >
          Fit
        </button>
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
}

function ScreenCard({
  index,
  selected,
  previewW,
  previewH,
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
    (cls: 'headline' | 'subtitle', pos: TextPosition) => {
      const textPositions = { ...(screen?.textPositions ?? { headline: null, subtitle: null }) };
      textPositions[cls] = pos;
      updateScreen(index, { textPositions });
    },
    [index, screen?.textPositions, updateScreen],
  );

  const { onOverlayMouseDown, getCursorForPosition } = useDragPosition(
    iframeRef,
    containerRef,
    screen,
    scale,
    previewW,
    previewH,
    handleDeviceDrop,
    handleTextDrop,
  );

  const [cursorStyle, setCursorStyle] = useState('default');

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
  }, [screen, renderVersion, platform, previewW, previewH, locale, localeConfig, deviceFamilies]);

  return (
    <>
    {dialog}
    <div
      className={`shrink-0 cursor-pointer rounded-lg overflow-hidden transition-shadow ${
        selected ? 'ring-2 ring-accent shadow-lg' : 'hover:ring-1 hover:ring-border'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1 bg-surface text-[10px]">
        {canMoveLeft ? (
          <button
            className="text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            onClick={(e) => { e.stopPropagation(); onMoveLeft(); }}
            title="Move left"
            aria-label={`Move frame ${index + 1} left`}
          >
            &lsaquo;
          </button>
        ) : <span className="w-4" />}
        <span className="text-text-dim font-medium">Frame {index + 1}</span>
        <div className="flex items-center gap-0.5">
          {canMoveRight && (
            <button
              className="text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              onClick={(e) => { e.stopPropagation(); onMoveRight(); }}
              title="Move right"
              aria-label={`Move frame ${index + 1} right`}
            >
              &rsaquo;
            </button>
          )}
          {canRemove && (
            <button
              className="text-text-dim hover:text-red-400 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              onClick={async (e) => {
                e.stopPropagation();
                const ok = await confirm({ title: 'Remove Frame', message: `Remove Frame ${index + 1}? This cannot be undone.` });
                if (ok) onRemove();
              }}
              title="Remove frame"
              aria-label={`Remove frame ${index + 1}`}
            >
              &times;
            </button>
          )}
        </div>
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
          title={`Frame ${index + 1}`}
        />
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
