/**
 * Phase 3 feature flag: enable the shadow-DOM preview backend via
 * `?shadow=1` on the URL. Off by default so the existing iframe path
 * stays the only one users hit unless they explicitly opt in.
 *
 * Reads on every call rather than caching at module load so the flag
 * can be flipped by editing the URL bar + reloading without a hot
 * module reload (the harness and manual smokes both rely on this).
 * SSR/Node-safe — falls back to `false` when `window` is undefined.
 */
export function isShadowPreviewEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('shadow') === '1';
  } catch {
    return false;
  }
}
