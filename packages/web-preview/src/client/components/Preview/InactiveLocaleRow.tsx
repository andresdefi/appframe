import { useEffect, useMemo, useRef, useState } from 'react';
import { usePreviewStore } from '../../store';
import type { ScreenState, LocaleConfig } from '../../types';
import { buildPreviewBody } from '../../utils/previewBody';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import {
  getCapture,
  isCapturing,
  requestCapture,
  subscribeCaptures,
} from '../../utils/captureManager';

interface InactiveLocaleRowProps {
  locale: string;
  localeConfig: LocaleConfig | undefined;
  screens: ScreenState[];
  platform: string;
  previewW: number;
  previewH: number;
  scale: number;
  /**
   * Capture cache invalidation knobs. `screensVersion` bumps when any
   * default screen field changes (cascades, so every locale's cache
   * invalidates); `localeVersion` bumps only when this specific locale's
   * overrides change. Together they avoid re-capturing every locale on
   * every text edit at 30+ locales.
   */
  screensVersion: number;
  localeVersion: number;
  variantKey: string;
  onActivate: () => void;
}

export function InactiveLocaleRow({
  locale,
  localeConfig,
  screens,
  platform,
  previewW,
  previewH,
  scale,
  screensVersion,
  localeVersion,
  variantKey,
  onActivate,
}: InactiveLocaleRowProps) {
  const deviceFamilies = usePreviewStore((s) => s.deviceFamilies);
  const [, forceUpdate] = useState(0);

  // Per-screen "last known good URL" so when the cache key changes (e.g.
  // user edits text on Default and screensVersion bumps), the row keeps
  // showing the previous PNG with a small "Capturing..." overlay until
  // the fresh capture lands. Without this, every text-commit on Default
  // would clear the inactive locale's PNG back to a placeholder for
  // ~500ms per locale — jarring while typing.
  const lastUrlsRef = useRef<(string | undefined)[]>([]);

  // Re-render this row whenever any capture finishes, so the <img>s can pick
  // up freshly-cached ObjectURLs. The cache is module-global; subscribers
  // are the only way React knows to refresh.
  useEffect(() => {
    return subscribeCaptures(() => forceUpdate((n) => n + 1));
  }, []);

  // Debounce the cache-key inputs so rapid edits (slider drags, fast
  // typing) don't churn the capture queue. The active row's iframe still
  // updates live via the existing render path; only the inactive rows'
  // re-capture is held until the user pauses.
  const debouncedScreensVersion = useDebouncedValue(screensVersion, 400);
  const debouncedLocaleVersion = useDebouncedValue(localeVersion, 400);

  // Cache key per screen: depends on the variant axis, the locale, the
  // default's data version (screensVersion — cascades), and this locale's
  // overrides version (localeVersion). Stale captures fall through the
  // LRU eviction once the key changes.
  const captureKeys = useMemo(
    () =>
      screens.map(
        (_, i) =>
          `${variantKey}|${locale}|screen-${i}|sv-${debouncedScreensVersion}|lv-${debouncedLocaleVersion}`,
      ),
    [screens, variantKey, locale, debouncedScreensVersion, debouncedLocaleVersion],
  );

  // Kick off captures for any uncached screens. Sequential by virtue of the
  // capture manager's single-concurrency queue.
  useEffect(() => {
    screens.forEach((screen, i) => {
      const key = captureKeys[i];
      if (!key) return;
      if (getCapture(key)) return;
      const body = buildPreviewBody(
        screen,
        platform,
        previewW,
        previewH,
        locale,
        localeConfig,
        deviceFamilies,
      );
      void requestCapture({
        key,
        endpoint: '/api/preview-html',
        body,
        width: previewW,
        height: previewH,
      }).catch(() => {
        // Cancellation is expected when a fresher renderVersion supersedes
        // this row mid-flight. Other errors are surfaced to the user via the
        // placeholder staying put.
      });
    });
  }, [screens, captureKeys, platform, previewW, previewH, locale, localeConfig, deviceFamilies]);

  return (
    <div
      className="flex items-center gap-4 p-6 min-w-min cursor-pointer group"
      style={{ justifyContent: 'safe center' }}
      onClick={onActivate}
      title={`Activate ${locale} locale`}
    >
      {screens.map((screen, i) => {
        const key = captureKeys[i]!;
        const freshUrl = getCapture(key);
        const busy = isCapturing(key);
        if (freshUrl) lastUrlsRef.current[i] = freshUrl;
        const displayUrl = freshUrl ?? lastUrlsRef.current[i];
        return (
          <div
            key={screen.id}
            className="shrink-0 rounded-lg overflow-hidden bg-surface ring-1 ring-border group-hover:ring-text-dim/70 transition-shadow"
            style={{ width: previewW * scale }}
          >
            <div className="flex items-center px-2 py-1 bg-surface text-[10px] text-text-dim/70">
              <span className="font-medium">Screen {i + 1}</span>
            </div>
            <div
              className="relative overflow-hidden bg-bg"
              style={{ width: previewW * scale, height: previewH * scale }}
            >
              {displayUrl ? (
                <img
                  src={displayUrl}
                  alt={`Screen ${i + 1} preview (${locale})`}
                  className="block"
                  style={{
                    width: previewW * scale,
                    height: previewH * scale,
                  }}
                  draggable={false}
                />
              ) : (
                <Placeholder busy={busy} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Placeholder({ busy }: { busy: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-dim text-[10px] animate-pulse">
      <div className="w-3 h-3 border-2 border-text-dim/40 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      <span>{busy ? 'Capturing...' : 'Preparing...'}</span>
    </div>
  );
}

