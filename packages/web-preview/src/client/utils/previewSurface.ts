/**
 * Editor's active preview surface — a shadow-DOM host with helpers
 * for the drag, instant-patch, guide observer, and render-write code
 * to interact with the preview's internal DOM without reaching into
 * implementation details. Single-implementation since Phase 7 (the
 * legacy iframe alternative was removed); the interface stays for
 * the type contract and to keep dependency-direction clean.
 *
 * Design notes:
 * - `elementsFromPoint` takes parent client coords; the adapter
 *   handles the shadow-internal lookup (`ShadowRoot.elementsFromPoint`,
 *   which `document.elementsFromPoint` doesn't substitute for —
 *   `document.elementsFromPoint` returns the host, not its
 *   descendants).
 * - `clientToCanvasPoint` derives scale from the host's bounding rect
 *   divided by its untransformed canvas size, so callers don't have
 *   to thread the parent CSS transform through hooks.
 * - `replaceContent` parses the engine-produced HTML, extracts the
 *   `<style>` + `<body>` children, and mounts under a
 *   `.preview-document` wrapper carrying `transform: translateZ(0)`
 *   so the wrapper becomes a containing block for `position: fixed`
 *   text positions inside the shadow tree.
 */
export interface PreviewSurface {
  /** The shadow host div living in the parent document. Used for
   *  parent-side rect reads and scale derivation. */
  readonly host: HTMLElement;
  /** The open shadow root attached to the host — query scope for
   *  everything inside the preview. */
  readonly root: ShadowRoot;

  querySelector<T extends Element = Element>(selector: string): T | null;
  querySelectorAll<T extends Element = Element>(selector: string): T[];
  /** Hit-test scoped to this surface's shadow tree. clientX/clientY
   *  are PARENT client coords. */
  elementsFromPoint(clientX: number, clientY: number): Element[];
  /** Translate parent client coords into surface-internal canvas coords. */
  clientToCanvasPoint(clientX: number, clientY: number): { x: number; y: number };
  /** Computed style of an element inside the shadow tree. */
  getComputedStyle(el: Element): CSSStyleDeclaration;
  /** Bounding rect of the `.canvas` element in surface-internal coords. */
  getCanvasRect(): DOMRect | null;
  /**
   * An element's bounding rect in surface-internal (unscaled, host-
   * relative) coords. Use anywhere existing code calls
   * `el.getBoundingClientRect()` on a child of the preview content
   * and uses the result as a positional input. Without this,
   * instant-patch math that reads `canvas.getBoundingClientRect().width`
   * and writes `wrapper.style.width = …` collapses the wrapper toward
   * the top-left because the host's CSS transform scales the raw rect.
   */
  getInternalRect(el: Element): DOMRect;
  /** Replace the surface's rendered HTML. */
  replaceContent(html: string): void;
}

/**
 * The class the shadow renderer wraps the parsed body content in. Kept
 * in one place so the surface, the parity harness, and any future
 * template transform reference the same name.
 */
export const SHADOW_PREVIEW_DOCUMENT_CLASS = 'preview-document';

/**
 * Adapter wrapping a parent-document element with an attached shadow
 * root. The only PreviewSurface implementation since Phase 7 deleted
 * the iframe alternative.
 *
 * The host element is owned by ScreenCard's JSX and lives in the parent
 * document tree (no iframe, no nested browsing context). Constructor
 * attaches an open shadow root if the host doesn't already have one;
 * subsequent calls reuse it.
 *
 * Canvas dimensions on the wrapper are taken from the host's CSS
 * width/height so the caller controls the unscaled canvas size the
 * same way it sets the iframe's `width`/`height` style props.
 */
export function shadowPreviewSurface(host: HTMLElement): PreviewSurface {
  const root: ShadowRoot = host.shadowRoot ?? host.attachShadow({ mode: 'open' });

  return {
    host,
    get root() {
      return root;
    },

    querySelector<T extends Element = Element>(selector: string): T | null {
      return root.querySelector<T>(selector) ?? null;
    },
    querySelectorAll<T extends Element = Element>(selector: string): T[] {
      return Array.from(root.querySelectorAll<T>(selector));
    },
    elementsFromPoint(clientX, clientY) {
      // ShadowRoot.elementsFromPoint() scopes the hit-test to this tree.
      // Using document.elementsFromPoint + filter doesn't work because
      // document.elementsFromPoint stops at the shadow host (it returns
      // the host, not the descendants), so the filter yields [] and
      // useDragPosition's hitTest finds nothing.
      return root.elementsFromPoint(clientX, clientY);
    },
    clientToCanvasPoint(clientX, clientY) {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
      // The host carries the same parent CSS transform the iframe used
      // to (e.g. scale(0.3)), so its bounding rect is the transformed
      // size and its inline width/height are the untransformed canvas
      // size. clientWidth on a div equals offsetWidth (no border-box
      // surprises here because the wrapper isn't bordered), so the
      // ratio is the same as in the iframe adapter.
      const scaleX = rect.width / host.clientWidth;
      const scaleY = rect.height / host.clientHeight;
      return {
        x: scaleX > 0 ? (clientX - rect.left) / scaleX : 0,
        y: scaleY > 0 ? (clientY - rect.top) / scaleY : 0,
      };
    },
    getComputedStyle(el) {
      // Elements inside an open shadow root still resolve their styles
      // through the parent window — there's no nested defaultView like
      // in the iframe case.
      return window.getComputedStyle(el);
    },
    getCanvasRect() {
      const canvas = root.querySelector('.canvas') as HTMLElement | null;
      return canvas?.getBoundingClientRect() ?? null;
    },
    getInternalRect(el) {
      // Shadow children are subject to the host's CSS transform, so
      // getBoundingClientRect on them returns scaled, parent-viewport
      // coords. Unscale + translate to match what an iframe would have
      // returned for the same element (canvas-internal coords with
      // origin at the host's top-left).
      const rect = el.getBoundingClientRect();
      const hostRect = host.getBoundingClientRect();
      if (host.clientWidth === 0 || host.clientHeight === 0) return rect;
      const sx = hostRect.width / host.clientWidth;
      const sy = hostRect.height / host.clientHeight;
      if (sx <= 0 || sy <= 0) return rect;
      return new DOMRect(
        (rect.left - hostRect.left) / sx,
        (rect.top - hostRect.top) / sy,
        rect.width / sx,
        rect.height / sy,
      );
    },
    replaceContent(html) {
      // Parse the full template HTML — the engine emits a complete
      // <html><head>...<body>...</html>. A shadow root can't consume
      // that directly, so we DOMParser it, extract the <style> nodes
      // from <head>, and the children of <body>, then mount only those
      // pieces under a wrapper.
      const parsed = new DOMParser().parseFromString(html, 'text/html');

      // Defensive: strip any <script> tags before mounting. Templates
      // don't emit them today, but if a future template (or an HTML
      // injector) ever does, we don't want them to execute in the
      // parent document's origin.
      parsed.querySelectorAll('script').forEach((s) => s.remove());

      const styleNodes = Array.from(parsed.head.querySelectorAll('style'));
      const bodyChildren = Array.from(parsed.body.children);

      // Wipe the previous render. replaceChildren is atomic in one
      // layout pass instead of N separate removeChild calls.
      root.replaceChildren();

      // Mount style first so child nodes get their rules on attach.
      for (const style of styleNodes) {
        root.appendChild(style.cloneNode(true));
      }

      // Wrap the body content. The wrapper:
      // - takes 100% of host so the host's CSS width/height controls
      //   the canvas size (the template's body{} rule doesn't apply
      //   in shadow);
      // - is position:relative so it's the containing block for any
      //   absolute descendants;
      // - has `transform: translateZ(0)` so it ALSO becomes the
      //   containing block for any `position: fixed` descendants
      //   inside the shadow tree (per CSS Transforms 1 spec). Without
      //   this, the templates' position:fixed text positions (from
      //   injectTextPositionCSS) walk the ancestor chain looking for
      //   a transformed ancestor; some browsers don't reliably resolve
      //   that across the shadow boundary and the text lands at the
      //   browser viewport instead of the card. With the transform on
      //   the wrapper, the lookup stops inside the shadow at a
      //   canvas-sized element, so position:fixed top:X% resolves
      //   against canvas dimensions — same as the iframe path.
      //   translateZ(0) is visually a no-op (no rotation, no scale,
      //   no offset); it just promotes the wrapper to a containing
      //   block / stacking context.
      const wrapper = document.createElement('div');
      wrapper.className = SHADOW_PREVIEW_DOCUMENT_CLASS;
      wrapper.style.cssText =
        'width:100%;height:100%;position:relative;overflow:hidden;transform:translateZ(0);';
      for (const child of bodyChildren) {
        wrapper.appendChild(child);
      }
      root.appendChild(wrapper);
    },
  };
}
