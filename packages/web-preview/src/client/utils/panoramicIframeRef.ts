/**
 * Module-level ref for the panoramic preview iframe.
 * PanoramicPreview registers the iframe; usePanoramicInstantPatch reads it.
 */
let panoramicIframe: HTMLIFrameElement | null = null;

export function setPanoramicIframe(el: HTMLIFrameElement | null) {
  panoramicIframe = el;
}

export function getPanoramicIframe(): HTMLIFrameElement | null {
  return panoramicIframe;
}
