import type { TextShadow } from '../types';

/**
 * Render a `TextShadow` config as the value for a CSS `text-shadow`
 * property — or `undefined` when the effect is disabled. Colour
 * arrives as a hex literal; opacity is 0..100 and becomes the alpha
 * channel.
 *
 * Returning `undefined` (instead of `''`) lets the server-side
 * template gate emission with `{% if textShadow... %}` and lets the
 * instant-patch path clear the property when the user disables it.
 *
 * Shared by `buildScreenRenderBody` (full re-render path) and
 * `useInstantPatch.patchText` (per-slider-tick DOM mutation) so the
 * live preview during slider drag stays consistent with the
 * canonical render on release — no jump-on-release when the values
 * are tuned correctly.
 */
export function buildTextShadowCss(shadow: TextShadow | undefined | null): string | undefined {
  if (!shadow || !shadow.enabled) return undefined;
  const hex = (shadow.color || '#000000').replace(/^#/, '');
  // Tolerate 3-char shorthand (`#abc` → `#aabbcc`). Out-of-range
  // values fall back to black so we never emit `rgba(NaN, ...)`.
  const norm = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  const r = parseInt(norm.slice(0, 2), 16);
  const g = parseInt(norm.slice(2, 4), 16);
  const b = parseInt(norm.slice(4, 6), 16);
  const safeR = Number.isFinite(r) ? r : 0;
  const safeG = Number.isFinite(g) ? g : 0;
  const safeB = Number.isFinite(b) ? b : 0;
  const alpha = Math.max(0, Math.min(1, (shadow.opacity ?? 0) / 100));
  return `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px rgba(${safeR},${safeG},${safeB},${alpha})`;
}
