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
  /** Replace the surface's rendered HTML. */
  replaceContent(html: string): void;
}

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
