import type { PreviewSurface } from './previewSurface';

/**
 * Module-level registry of the active editor's PreviewSurface
 * instances. ScreenCard registers a surface per card index; hooks
 * (useInstantPatch, useDragPosition) look up by index. PanoramicPreview
 * uses the singleton slot.
 */
const surfaces = new Map<number, PreviewSurface>();
let panoramicSurface: PreviewSurface | null = null;

export function registerPreviewSurface(index: number, surface: PreviewSurface | null): void {
  if (surface) {
    surfaces.set(index, surface);
  } else {
    surfaces.delete(index);
  }
}

export function getPreviewSurface(index: number): PreviewSurface | null {
  return surfaces.get(index) ?? null;
}

export function setPanoramicPreviewSurface(surface: PreviewSurface | null): void {
  panoramicSurface = surface;
}

export function getPanoramicPreviewSurface(): PreviewSurface | null {
  return panoramicSurface;
}
