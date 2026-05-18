import { useEffect, useMemo, useState } from 'react';
import type { LocaleConfig, PanoramicBackground, PanoramicElement } from '../../types';
import type { PanoramicEffects } from '../../types';
import {
  getCapture,
  isCapturing,
  requestCapture,
  subscribeCaptures,
} from '../../utils/captureManager';

interface InactivePanoramicRowProps {
  locale: string;
  localeConfig: LocaleConfig | undefined;
  frameCount: number;
  previewW: number;
  previewH: number;
  scale: number;
  background: PanoramicBackground;
  elements: PanoramicElement[];
  effects: PanoramicEffects;
  font: string;
  fontWeight: number;
  frameStyle: string;
  renderVersion: number;
  variantKey: string;
  onActivate: () => void;
}

export function InactivePanoramicRow({
  locale,
  localeConfig,
  frameCount,
  previewW,
  previewH,
  scale,
  background,
  elements,
  effects,
  font,
  fontWeight,
  frameStyle,
  renderVersion,
  variantKey,
  onActivate,
}: InactivePanoramicRowProps) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    return subscribeCaptures(() => forceUpdate((n) => n + 1));
  }, []);

  const totalCanvasWidth = previewW * frameCount;

  // One capture per locale — the panoramic canvas is a single wide image,
  // not a row of separate screens.
  const captureKey = useMemo(
    () => `${variantKey}|${locale}|panoramic|rv-${renderVersion}`,
    [variantKey, locale, renderVersion],
  );

  useEffect(() => {
    if (getCapture(captureKey)) return;
    const body = {
      locale,
      localeConfig,
      frameCount,
      frameWidth: previewW,
      frameHeight: previewH,
      background,
      elements,
      font,
      fontWeight,
      frameStyle,
      effects,
    };
    void requestCapture({
      key: captureKey,
      endpoint: '/api/panoramic-preview-html',
      body: body as Record<string, unknown>,
      width: totalCanvasWidth,
      height: previewH,
    }).catch(() => {
      // Cancellations are expected when a fresher renderVersion supersedes.
    });
  }, [
    captureKey,
    locale,
    localeConfig,
    frameCount,
    previewW,
    previewH,
    totalCanvasWidth,
    background,
    elements,
    effects,
    font,
    fontWeight,
    frameStyle,
  ]);

  const url = getCapture(captureKey);
  const busy = isCapturing(captureKey);

  return (
    <div
      className="cursor-pointer group"
      onClick={onActivate}
      title={`Activate ${locale} locale`}
    >
      <div className="flex items-center justify-center min-w-min">
        <div className="relative w-fit">
          {/* Frame boundary labels — match active row */}
          <div className="flex mb-1" style={{ width: totalCanvasWidth * scale }}>
            {Array.from({ length: frameCount }, (_, i) => (
              <div
                key={i}
                className="text-[9px] text-text-dim/70 text-center border-x border-border/20"
                style={{ width: previewW * scale }}
              >
                Frame {i + 1}
              </div>
            ))}
          </div>
          <div
            className="relative overflow-hidden rounded border border-border/30 group-hover:border-text-dim/50 transition-colors bg-bg"
            style={{ width: totalCanvasWidth * scale, height: previewH * scale }}
          >
            {url ? (
              <img
                src={url}
                alt={`Panoramic preview (${locale})`}
                className="block"
                style={{ width: totalCanvasWidth * scale, height: previewH * scale }}
                draggable={false}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-dim text-[10px] animate-pulse">
                <div
                  className="w-3 h-3 border-2 border-text-dim/40 border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                <span>{busy ? 'Capturing...' : 'Preparing...'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
