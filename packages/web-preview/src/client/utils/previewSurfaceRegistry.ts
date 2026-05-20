import type { PreviewSurface } from './previewSurface';

/**
 * Registry mirroring `iframeRegistry`/`panoramicIframeRef` but holding
 * the backend-agnostic surface. Phase 1 consumers read from here instead
 * of reaching for the iframe element directly. Phase 3 will register a
 * shadow surface in the same slot and the consumers won't notice.
 *
 * Per-screen entries for individual mode, plus a singleton slot for the
 * panoramic surface.
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
