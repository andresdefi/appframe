/**
 * Backend-agnostic interface over the editor's active preview surface.
 *
 * Every consumer that used to reach for `iframe.contentDocument` (drag,
 * instant-patch, guide observer, render write) goes through this. Phase 1
 * ships only the iframe implementation; Phase 3 adds a shadow-DOM one and
 * flips a single factory call.
 *
 * Design notes:
 * - `elementsFromPoint` takes parent client coords. The iframe impl
 *   converts to iframe-local coords using the host rect; the shadow impl
 *   calls `document.elementsFromPoint` and filters to the surface's
 *   shadow descendants. Callers stop needing their own coordinate
 *   helpers.
 * - `clientToCanvasPoint` derives the scale from the host element's
 *   bounding rect divided by its untransformed canvas size, so callers
 *   don't have to thread the parent CSS transform through hooks.
 * - `boundary` is the element that marks "you've walked out of the
 *   surface" during ancestor traversal. Iframe: documentElement. Shadow:
 *   the host (since the shadow root is its descendant subtree).
 * - `replaceContent` is the renderer write. Iframe: doc.open/write/close.
 *   Shadow: parse → extract → shadowRoot.replaceChildren (Phase 3).
 */
export interface PreviewSurface {
  readonly kind: 'iframe' | 'shadow';
  /** Element living in the parent document that owns the surface. The
   *  iframe element, or the shadow host div. Used for parent-side rect
   *  reads and scale derivation. */
  readonly host: HTMLElement;
  /** Root inside which all queries are scoped. */
  readonly root: Document | ShadowRoot;
  /** Parent-walk boundary — stop climbing parents once you hit this. */
  readonly boundary: Element;

  querySelector<T extends Element = Element>(selector: string): T | null;
  querySelectorAll<T extends Element = Element>(selector: string): T[];
  /** Hit-test scoped to this surface. clientX/clientY are PARENT client
   *  coords; the adapter handles the surface-specific conversion. */
  elementsFromPoint(clientX: number, clientY: number): Element[];
  /** Translate parent client coords into surface-internal canvas coords. */
  clientToCanvasPoint(clientX: number, clientY: number): { x: number; y: number };
  /** Computed style of an element inside this surface, resolved against
   *  the surface's own window (iframe.contentWindow for iframes, the
   *  parent window for shadow). */
  getComputedStyle(el: Element): CSSStyleDeclaration;
  /** Bounding rect of the `.canvas` element in surface-internal coords.
   *  Matches the historical behavior of calling getBoundingClientRect on
   *  iframe-internal elements. */
  getCanvasRect(): DOMRect | null;
  /**
   * An element's bounding rect in surface-internal (unscaled, host-
   * relative) coords. Use this anywhere the existing code calls
   * `el.getBoundingClientRect()` on a child of the preview content and
   * uses the result as a positional input for either a write back to
   * inline styles or relative math against another such rect.
   *
   * - iframe: passthrough — iframe-internal getBoundingClientRect is
   *   already canvas-local because the iframe is its own coordinate
   *   system unaffected by the parent's CSS transform.
   * - shadow: translates the rect so its origin is the host's top-left,
   *   then divides by the host's effective scale (read from the host's
   *   bounding rect / clientWidth ratio). The result matches what the
   *   iframe path would have returned for the same DOM element.
   *
   * Without this, instant-patch math that reads
   * `canvas.getBoundingClientRect().width` and writes
   * `wrapper.style.width = (width * scale) + 'px'` collapses the
   * wrapper toward the top-left in shadow mode (writes 67px instead
   * of 224px).
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
 * Adapter wrapping an iframe element. Phase 1 implementation.
 */
export function iframePreviewSurface(iframe: HTMLIFrameElement): PreviewSurface {
  const getDoc = (): Document | null => {
    try {
      return iframe.contentDocument ?? null;
    } catch {
      return null;
    }
  };

  return {
    kind: 'iframe',
    host: iframe,
    // Lazy reads — contentDocument can be replaced by doc.open/write/close
    // and the consumer needs the fresh reference each call. Returning the
    // current value via a getter would complicate the interface; readers
    // rarely hold these long-term anyway. Throwing null-doc surfaces an
    // empty surface that no-ops gracefully through the methods below.
    get root() {
      return getDoc() ?? document;
    },
    get boundary() {
      return getDoc()?.documentElement ?? iframe;
    },

    querySelector<T extends Element = Element>(selector: string): T | null {
      return getDoc()?.querySelector<T>(selector) ?? null;
    },
    querySelectorAll<T extends Element = Element>(selector: string): T[] {
      const doc = getDoc();
      if (!doc) return [];
      return Array.from(doc.querySelectorAll<T>(selector));
    },
    elementsFromPoint(clientX, clientY) {
      const doc = getDoc();
      if (!doc) return [];
      const { x, y } = this.clientToCanvasPoint(clientX, clientY);
      return doc.elementsFromPoint(x, y) as Element[];
    },
    clientToCanvasPoint(clientX, clientY) {
      const rect = iframe.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
      // The iframe element's bounding rect reflects any parent CSS
      // transform; its `clientWidth` is the untransformed inner width.
      // Their ratio is the parent's effective scale on this axis. Doing
      // it per-axis tolerates non-uniform scales the editor doesn't ship
      // today but might later.
      const scaleX = rect.width / iframe.clientWidth;
      const scaleY = rect.height / iframe.clientHeight;
      return {
        x: scaleX > 0 ? (clientX - rect.left) / scaleX : 0,
        y: scaleY > 0 ? (clientY - rect.top) / scaleY : 0,
      };
    },
    getComputedStyle(el) {
      const view = getDoc()?.defaultView;
      return view ? view.getComputedStyle(el) : window.getComputedStyle(el);
    },
    getCanvasRect() {
      const canvas = getDoc()?.querySelector('.canvas') as HTMLElement | null;
      return canvas?.getBoundingClientRect() ?? null;
    },
    getInternalRect(el) {
      // Iframe-internal getBoundingClientRect is already in the iframe's
      // own coord system, unaffected by any parent CSS transform.
      return el.getBoundingClientRect();
    },
    replaceContent(html) {
      const doc = getDoc();
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      } else {
        // Fallback: contentDocument may be temporarily null right after
        // mount; srcdoc triggers a navigation that re-creates it.
        iframe.srcdoc = html;
      }
    },
  };
}

/**
 * Adapter wrapping a parent-document element with an attached shadow
 * root. Phase 3 implementation — used when the `?shadow=1` flag is on.
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
    kind: 'shadow',
    host,
    get root() {
      return root;
    },
    // Walking ancestors of an element inside the shadow tree stops once
    // it hits the host — beyond that we're back in the parent document.
    get boundary() {
      return host;
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

      // Wrap the body content. The wrapper carries the canvas dimensions
      // the iframe used to get from the template's body{} rule (which
      // doesn't apply in shadow DOM — Phase 4 will transform body{} →
      // .preview-document{} at the template level; until then the
      // wrapper takes 100% of the host so the host's CSS width/height
      // controls the canvas size).
      const wrapper = document.createElement('div');
      wrapper.className = SHADOW_PREVIEW_DOCUMENT_CLASS;
      wrapper.style.cssText = 'width:100%;height:100%;position:relative;overflow:hidden;';
      for (const child of bodyChildren) {
        wrapper.appendChild(child);
      }
      root.appendChild(wrapper);
    },
  };
}
