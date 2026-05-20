/**
 * Parent-document font registration for the Phase 3+ shadow-DOM preview.
 *
 * Today each iframe preview re-injects the full `@font-face` block into
 * its own document — for a 6-screen project that's 6 copies of every
 * font family in use. Shadow DOM doesn't isolate document-level @font-face
 * rules, so we want the fonts registered exactly once on the parent.
 *
 * `ensurePreviewFontsRegistered(ids)` fetches URL-mode @font-face CSS for
 * the requested ids from the preview server, injects it into a single
 * shared <style> element in document.head, and tracks which ids are
 * already registered so subsequent calls are no-ops for known ids.
 *
 * Phase 2 ships this helper; nothing calls it yet. Phase 3's shadow
 * renderer will call it before mounting each card's content (paired with
 * `fontFaceMode: 'none'` in the POST body to /api/preview-html so the
 * server skips inline @font-face emission).
 */

const STYLE_ID = 'appframe-preview-fonts';
const registered = new Set<string>();
let inflight = new Map<string, Promise<void>>();

/**
 * Register the given font ids on the parent document. Idempotent: ids
 * already present are skipped, and concurrent calls for the same id
 * share one network fetch.
 *
 * Resolves once the requested faces are *registered* (the @font-face
 * declarations are in the document). Actual file loading happens lazily
 * when something on the page references the family. Callers that need
 * the file bytes before painting should `await document.fonts.ready`
 * after their content references the font.
 *
 * `baseUrl` defaults to the same URL prefix the preview server expects
 * for /api/preview-font-faces. Override only in tests.
 */
export async function ensurePreviewFontsRegistered(
  ids: ReadonlyArray<string>,
  baseUrl: string = '',
): Promise<void> {
  const wanted = Array.from(new Set(ids.filter((id) => typeof id === 'string' && id.length > 0)));
  const todo = wanted.filter((id) => !registered.has(id));
  if (todo.length === 0) return;

  // Coalesce overlapping requests so two cards asking for the same id
  // at once share one network round-trip.
  const promises = todo.map((id) => {
    const existing = inflight.get(id);
    if (existing) return existing;
    const p = registerOne(id, baseUrl).finally(() => {
      inflight.delete(id);
    });
    inflight.set(id, p);
    return p;
  });
  await Promise.all(promises);
}

async function registerOne(id: string, baseUrl: string): Promise<void> {
  const url = `${baseUrl}/api/preview-font-faces?ids=${encodeURIComponent(id)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`ensurePreviewFontsRegistered: ${url} returned ${res.status}`);
  }
  const css = (await res.text()).trim();
  if (css.length > 0) {
    appendCss(css);
  }
  // Mark registered even on empty CSS — an unknown id returns '' and we
  // shouldn't retry it forever.
  registered.add(id);
}

function appendCss(css: string): void {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    style.dataset.appframeManaged = 'true';
    document.head.appendChild(style);
  }
  // Concatenate with the existing CSS — the server already deduplicated
  // within a single response, and the registered Set deduplicates across
  // calls, so appending is safe.
  style.appendChild(document.createTextNode(`\n${css}\n`));
}

/** Test-only: forget every registration so a fresh test starts clean. */
export function __resetPreviewFontRegistryForTests(): void {
  registered.clear();
  inflight = new Map();
  const style = document.getElementById(STYLE_ID);
  if (style) style.remove();
}
