// Koubou device frames ship as high-res PNGs. The renderer expects a
// FrameDefinition (with a screenArea rectangle + frameSize), so when
// previewing a Koubou device we synthesize one here. The same logic was
// previously duplicated between the individual-mode and panoramic-mode
// code paths in server.ts; the small per-device "bleed" table lets the
// composited frame extend slightly past the screen rect so the rendered
// screenshot doesn't show a hairline gap at the device bezel.

import type { FrameDefinition } from '@appframe/core';
import { getDeviceFamily } from '@appframe/core';

export type KoubouFamily = NonNullable<ReturnType<typeof getDeviceFamily>>;

interface KoubouPreviewAdjustment {
  bleedLeft: number;
  bleedTop: number;
  bleedRight: number;
  bleedBottom: number;
  radiusBleed: number;
}

const KOUBOU_PREVIEW_ADJUSTMENTS: Record<string, KoubouPreviewAdjustment> = {
  'ipad-pro-11-m4': { bleedLeft: 20, bleedTop: 20, bleedRight: 20, bleedBottom: 20, radiusBleed: 36 },
  'ipad-pro-13-m4': { bleedLeft: 20, bleedTop: 20, bleedRight: 20, bleedBottom: 20, radiusBleed: 36 },
  'macbook-air-2020': { bleedLeft: 4, bleedTop: 4, bleedRight: 4, bleedBottom: 12, radiusBleed: -18 },
  'macbook-air-2022': { bleedLeft: 6, bleedTop: 6, bleedRight: 6, bleedBottom: 6, radiusBleed: -57 },
  'macbook-pro-2021-14': { bleedLeft: 6, bleedTop: 6, bleedRight: 6, bleedBottom: 6, radiusBleed: -47 },
  'macbook-pro-2021-16': { bleedLeft: 6, bleedTop: 6, bleedRight: 6, bleedBottom: 6, radiusBleed: -46 },
  'watch-ultra': { bleedLeft: 8, bleedTop: 8, bleedRight: 8, bleedBottom: 8, radiusBleed: -44 },
  'watch-series-7-45': { bleedLeft: 8, bleedTop: 20, bleedRight: 8, bleedBottom: 8, radiusBleed: 0 },
  'watch-series-4-44': { bleedLeft: 8, bleedTop: 8, bleedRight: 8, bleedBottom: 8, radiusBleed: -18 },
  'watch-series-4-40': { bleedLeft: 8, bleedTop: 8, bleedRight: 8, bleedBottom: 8, radiusBleed: -18 },
};

function getKoubouPreviewAdjustment(family: KoubouFamily): KoubouPreviewAdjustment {
  const explicit = KOUBOU_PREVIEW_ADJUSTMENTS[family.id];
  if (explicit) return explicit;

  switch (family.category) {
    case 'watch':
      return { bleedLeft: 8, bleedTop: 8, bleedRight: 8, bleedBottom: 8, radiusBleed: 0 };
    case 'mac':
      return { bleedLeft: 6, bleedTop: 6, bleedRight: 6, bleedBottom: 6, radiusBleed: 0 };
    case 'ipad':
      return { bleedLeft: 18, bleedTop: 18, bleedRight: 18, bleedBottom: 18, radiusBleed: 32 };
    case 'iphone':
      return { bleedLeft: 0, bleedTop: 0, bleedRight: 0, bleedBottom: 0, radiusBleed: 0 };
    default:
      return { bleedLeft: 12, bleedTop: 12, bleedRight: 12, bleedBottom: 12, radiusBleed: 24 };
  }
}

export function buildKoubouPreviewFrame(family: KoubouFamily): FrameDefinition {
  const { bleedLeft, bleedTop, bleedRight, bleedBottom, radiusBleed } =
    getKoubouPreviewAdjustment(family);
  const left = Math.max(0, family.screenRect!.x - bleedLeft);
  const top = Math.max(0, family.screenRect!.y - bleedTop);
  const right = Math.min(
    family.framePngSize!.width,
    family.screenRect!.x + family.screenRect!.width + bleedRight,
  );
  const bottom = Math.min(
    family.framePngSize!.height,
    family.screenRect!.y + family.screenRect!.height + bleedBottom,
  );

  return {
    id: family.id,
    name: family.name,
    manufacturer: 'Apple',
    year: family.year,
    platform: 'ios',
    framePath: '',
    screenArea: {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
      borderRadius: Math.max(
        0,
        Math.min(
          Math.floor(Math.min(right - left, bottom - top) / 2),
          (family.screenBorderRadius ?? 0) + radiusBleed,
        ),
      ),
    },
    frameSize: {
      width: family.framePngSize!.width,
      height: family.framePngSize!.height,
    },
    screenResolution: family.screenResolution,
    tags: [family.category],
  } satisfies FrameDefinition;
}
