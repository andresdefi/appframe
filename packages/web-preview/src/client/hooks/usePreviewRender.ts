import { useCallback, useRef } from 'react';
import { usePreviewStore } from '../store';
import { fetchPreviewHtml } from '../utils/api';

export function usePreviewRender() {
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const renderScreen = useCallback(async (index: number) => {
    const { screens, platform, previewW, previewH } = usePreviewStore.getState();
    const screen = screens[index];
    if (!screen) return;

    // Abort any in-flight request for this render
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const body = {
      screenIndex: index,
      headline: screen.headline,
      subtitle: screen.subtitle,
      style: screen.style,
      layout: screen.layout,
      font: screen.font,
      fontWeight: screen.fontWeight,
      headlineSize: screen.headlineSize,
      subtitleSize: screen.subtitleSize,
      headlineRotation: screen.headlineRotation,
      subtitleRotation: screen.subtitleRotation,
      colors: screen.colors,
      frameId: screen.frameId,
      deviceColor: screen.deviceColor,
      frameStyle: screen.frameStyle,
      composition: screen.composition,
      deviceScale: screen.deviceScale,
      deviceTop: screen.deviceTop,
      deviceRotation: screen.deviceRotation,
      deviceOffsetX: screen.deviceOffsetX,
      deviceAngle: screen.deviceAngle,
      deviceTilt: screen.deviceTilt,
      headlineGradient: screen.headlineGradient,
      subtitleGradient: screen.subtitleGradient,
      autoSizeHeadline: screen.autoSizeHeadline,
      autoSizeSubtitle: screen.autoSizeSubtitle,
      headlineLineHeight: screen.headlineLineHeight,
      headlineLetterSpacing: screen.headlineLetterSpacing,
      headlineTextTransform: screen.headlineTextTransform,
      headlineFontStyle: screen.headlineFontStyle,
      subtitleOpacity: screen.subtitleOpacity,
      subtitleLetterSpacing: screen.subtitleLetterSpacing,
      subtitleTextTransform: screen.subtitleTextTransform,
      spotlight: screen.spotlight,
      annotations: screen.annotations,
      textPositions: screen.textPositions,
      screenshotDataUrl: screen.screenshotDataUrl,
      backgroundType: screen.backgroundType,
      backgroundColor: screen.backgroundColor,
      backgroundGradient: screen.backgroundGradient,
      backgroundImageDataUrl: screen.backgroundImageDataUrl,
      backgroundOverlay: screen.backgroundOverlay,
      deviceShadow: screen.deviceShadow,
      borderSimulation: screen.borderSimulation,
      cornerRadius: screen.cornerRadius,
      loupe: screen.loupe,
      callouts: screen.callouts,
      overlays: screen.overlays,
      platform,
      previewW,
      previewH,
    };

    try {
      const html = await fetchPreviewHtml(body, controller.signal);
      return html;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      throw err;
    }
  }, []);

  const debouncedRender = useCallback(
    (index: number, callback: (html: string) => void, delay = 300) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        const html = await renderScreen(index);
        if (html) callback(html);
      }, delay);
    },
    [renderScreen],
  );

  return { renderScreen, debouncedRender };
}
