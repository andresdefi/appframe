/**
 * Active preview backend selector.
 *
 * Default since Phase 6: shadow DOM. `?shadow=0` opts back into the
 * iframe path as an escape hatch for diagnosis (e.g. a real-user
 * report that a screen looks wrong in shadow but right in iframe —
 * sending them the same project URL with `?shadow=0` proves the
 * regression sits in the shadow renderer).
 *
 * Earlier Phases 3-5 had this off by default behind `?shadow=1`.
 * The flip happens here, not in any consumer — every caller continues
 * to ask `isShadowPreviewEnabled()` and gets the new default.
 *
 * Reads on every call rather than caching at module load so the flag
 * can be flipped by editing the URL bar + reloading without a hot
 * module reload. SSR/Node-safe — falls back to `false` when `window`
 * is undefined (no DOM = no shadow DOM either way).
 */
export function isShadowPreviewEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    // Explicit opt-out → iframe. Any other value (including missing,
    // empty, '1', 'true', 'whatever') → shadow.
    return params.get('shadow') !== '0';
  } catch {
    // URLSearchParams shouldn't throw in any modern browser, but if
    // window.location is somehow inaccessible (e.g. sandboxed iframe
    // with a hostile parent), fall back to the safer historical
    // default — iframe — rather than enabling the newer code path.
    return false;
  }
}
