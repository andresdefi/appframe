import { parseDisplayP3 } from '@appframe/core/color/p3';
import type { TextShadow } from '../types';

/**
 * Render a `TextShadow` config as the value for a CSS `text-shadow`
 * property — or `undefined` when the effect is disabled. Colour can
 * arrive as either a hex literal or a `color(display-p3 ...)` string;
 * opacity is 0..100 and becomes the alpha channel.
 *
 * P3 input emits a `color(display-p3 r g b / alpha)` value so wide-
 * gamut shadow colours render at full fidelity on P3 displays. Hex
 * input emits a classic `rgba(...)` so nothing regresses on stored
 * projects that haven't been touched since the P3 migration.
 *
 * Returning `undefined` (instead of `''`) lets the server-side
 * template gate emission with `{% if textShadow... %}` and lets the
 * instant-patch path clear the property when the user disables it.
 *
 * Shared by `buildScreenRenderBody` (full re-render path) and
 * `useInstantPatch.patchText` (per-slider-tick DOM mutation) so the
 * live preview during slider drag stays consistent with the
 * canonical render on release.
 */
export function buildTextShadowCss(shadow: TextShadow | undefined | null): string | undefined {
  if (!shadow || !shadow.enabled) return undefined;
  const alpha = Math.max(0, Math.min(1, (shadow.opacity ?? 0) / 100));
  const offsets = `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px`;
  const color = shadow.color || '#000000';
  const p3 = parseDisplayP3(color);
  if (p3 !== null) {
    return `${offsets} color(display-p3 ${p3.r} ${p3.g} ${p3.b} / ${alpha})`;
  }
  const hex = color.replace(/^#/, '');
  const norm = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  const r = parseInt(norm.slice(0, 2), 16);
  const g = parseInt(norm.slice(2, 4), 16);
  const b = parseInt(norm.slice(4, 6), 16);
  const safeR = Number.isFinite(r) ? r : 0;
  const safeG = Number.isFinite(g) ? g : 0;
  const safeB = Number.isFinite(b) ? b : 0;
  return `${offsets} rgba(${safeR},${safeG},${safeB},${alpha})`;
}
