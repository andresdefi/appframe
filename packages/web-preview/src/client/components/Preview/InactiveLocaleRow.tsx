import { useEffect, useMemo, useState } from 'react';
import { usePreviewStore } from '../../store';
import type { ScreenState, LocaleConfig } from '../../types';
import { buildPreviewBody } from '../../utils/previewBody';
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
  renderVersion: number;
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
  renderVersion,
  variantKey,
  onActivate,
}: InactiveLocaleRowProps) {
  const deviceFamilies = usePreviewStore((s) => s.deviceFamilies);
  const [, forceUpdate] = useState(0);

  // Re-render this row whenever any capture finishes, so the <img>s can pick
  // up freshly-cached ObjectURLs. The cache is module-global; subscribers
  // are the only way React knows to refresh.
  useEffect(() => {
    return subscribeCaptures(() => forceUpdate((n) => n + 1));
  }, []);

  // Stable cache keys per screen for this locale + variant + render version.
  // Bumping renderVersion forces a fresh capture by changing the key, which
  // also lets the LRU cache fall through cleanly without an explicit
  // invalidation step on every edit. (Cap-based eviction handles cleanup.)
  const captureKeys = useMemo(
    () => screens.map((_, i) => `${variantKey}|${locale}|screen-${i}|rv-${renderVersion}`),
    [screens, variantKey, locale, renderVersion],
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
        const url = getCapture(key);
        const busy = isCapturing(key);
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
              {url ? (
                <img
                  src={url}
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
