/**
 * Module-level registry mapping screen index to iframe element.
 * PreviewArea registers iframes here; useInstantPatch reads from here.
 */
const iframes = new Map<number, HTMLIFrameElement>();

export function registerIframe(index: number, el: HTMLIFrameElement | null) {
  if (el) {
    iframes.set(index, el);
  } else {
    iframes.delete(index);
  }
}

export function getIframe(index: number): HTMLIFrameElement | null {
  return iframes.get(index) ?? null;
}
