import { useEffect, useRef, useState, useCallback } from 'react';
import { usePreviewStore } from '../../store';
import { fetchPreviewHtml } from '../../utils/api';
import { buildPreviewBody } from '../../utils/previewBody';
import { useDragPosition } from '../../hooks/useDragPosition';
import { registerIframe } from '../../utils/iframeRegistry';
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

  // Compute scale based on area size
  const computeScale = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const areaH = area.clientHeight - 120;
    const maxCardH = Math.min(areaH * 0.85, 500);
    const maxCardW = 400;
    const scaleForH = maxCardH / previewH;
    const scaleForW = maxCardW / previewW;
    let s = Math.min(scaleForH, scaleForW);
    s = Math.min(s, 1.3);
    s = Math.max(s, 0.15);
    setScale(s);
  }, [previewH, previewW]);

  useEffect(() => {
    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [computeScale]);

  const bgClass = previewBg === 'light' ? 'bg-gray-100' : 'bg-bg';

  return (
    <div ref={areaRef} className={`flex-1 flex flex-col overflow-hidden ${bgClass}`}>
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex items-center gap-4 p-6 h-full min-w-min">
          {screens.map((screen, i) => (
            <ScreenCard
              key={i}
              index={i}
              selected={i === selectedScreen}
              previewW={previewW}
              previewH={previewH}
              scale={scale}
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
            className="shrink-0 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-text-dim text-xs hover:border-accent hover:text-accent transition-colors cursor-pointer"
            style={{
              width: Math.round(previewW * scale * 0.5),
              height: Math.round(previewH * scale),
            }}
            onClick={addScreen}
          >
            + Add Screen
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
  const [initialLoad, setInitialLoad] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const screen = usePreviewStore((s) => s.screens[index]);
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

      const body = buildPreviewBody(screen, platform, previewW, previewH, locale, deviceFamilies);

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
  }, [screen, renderVersion, platform, previewW, previewH, locale]);

  return (
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
            className="text-text-dim hover:text-text px-1"
            onClick={(e) => { e.stopPropagation(); onMoveLeft(); }}
            title="Move left"
          >
            &lsaquo;
          </button>
        ) : <span className="w-4" />}
        <span className="text-text-dim font-medium">Screen {index + 1}</span>
        <div className="flex items-center gap-0.5">
          {canMoveRight && (
            <button
              className="text-text-dim hover:text-text px-1"
              onClick={(e) => { e.stopPropagation(); onMoveRight(); }}
              title="Move right"
            >
              &rsaquo;
            </button>
          )}
          {canRemove && (
            <button
              className="text-text-dim hover:text-red-400 px-1"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              title="Remove screen"
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
          title={`Screen ${index + 1}`}
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
  );
}
