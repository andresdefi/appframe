import type { PreviewSurface } from './previewSurface';

/**
 * Helpers for the drag-to-select callout source rectangle flow.
 *
 * The screenshot lives inside the active ScreenCard's shadow surface
 * under either `.screenshot-clip` (framed devices) or `.device-wrapper > img`
 * (bare screenshot). Pointer events arrive in client (viewport) px; the
 * Callout schema stores source coordinates as percentages of that
 * screenshot rectangle. This module is the glue.
 *
 * v1 supports flat / front-facing devices only. Angled layouts and the
 * panoramic mode get a disabled Select Area with a tooltip rather than
 * silently producing wrong source coordinates — see CalloutSelectionOverlay.
 */

/**
 * Locate the screenshot rectangle the user is going to select inside of.
 * Prefers the framed `.screenshot-clip` because that's the actually-visible
 * portion of the screenshot bitmap; falls back to the device-wrapper image
 * when no frame is in use. Returns null if neither is mounted.
 */
export function findScreenshotElement(surface: PreviewSurface): HTMLElement | null {
  const clip = surface.querySelector<HTMLElement>('.screenshot-clip');
  if (clip) return clip;
  const bare = surface.querySelector<HTMLElement>('.device-wrapper > img');
  return bare ?? null;
}

/**
 * Whether the active screenshot's transform is flat enough that
 * getBoundingClientRect coordinates map back to screenshot percentages
 * without a perspective inverse. In individual mode the layout enum is
 * authoritative — `angled-left` / `angled-right` apply rotateY with a
 * non-zero angle that warps pointer-to-pixel mapping. Everything else
 * resolves to an axis-aligned rectangle.
 *
 * Note: the `center` layout *also* composes to matrix3d in computed style
 * because the template's transform includes `perspective(...)` and
 * `rotateX/Z(0deg)` unconditionally. Visually it's still flat, so we
 * don't try to decompose the matrix — the enum-level gate is enough.
 *
 * `surface` is unused today but kept in the signature for forward
 * compatibility with future runtime-only transforms (e.g. user-set
 * rotation on individual screens).
 */
export function isFlatScreenshotTransform(
  _surface: PreviewSurface,
  layout: string | undefined,
): boolean {
  return layout !== 'angled-left' && layout !== 'angled-right';
}

export interface ClientRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Source rectangle in screenshot-percent coordinates, plus the card centre
 *  (also in screenshot %). All values are clamped to ranges the Callout
 *  schema accepts: sourceX/Y in [0,100], sourceW/H in [1,100], displayX/Y
 *  in [0,100]. Returns null if the drag was below the tiny-drag threshold
 *  on either axis. */
export interface CalloutSourceFromDrag {
  sourceX: number;
  sourceY: number;
  sourceW: number;
  sourceH: number;
  displayX: number;
  displayY: number;
}

/** Tiny-drag threshold. A press-and-release with no real motion (or a
 *  pixel-thin sliver) shouldn't create a callout — the user almost
 *  certainly didn't mean to. Picked as 2% of either screenshot axis,
 *  matching the schema's `sourceW/sourceH >= 1` floor with a small
 *  buffer so we don't ship a callout that's just barely visible. */
export const MIN_DRAG_FRACTION = 0.02;

/**
 * Convert a drag rectangle expressed in normalised screenshot coordinates
 * (`u`/`v` ∈ [0,1] for the two corner points, in any order) into the
 * Callout schema's source + display fields. The rectangle is normalised
 * to its bounding box, dimensions clamped to [1,100]%, and the card
 * centre placed at the rectangle's centre.
 *
 * `displayX/Y` returned here is the card centre. Phase 3 layers placement
 * heuristics on top (offset the card so it pops out next to the source
 * area instead of covering it).
 */
export function rectToCalloutSource(
  u0: number,
  v0: number,
  u1: number,
  v1: number,
): CalloutSourceFromDrag | null {
  // Reject NaN inputs outright. Coercing NaN to 0 via clamp would
  // silently produce a corner-anchored rectangle from a degenerate
  // pointer event, which is more surprising than no-op.
  if (!Number.isFinite(u0) || !Number.isFinite(v0) || !Number.isFinite(u1) || !Number.isFinite(v1)) {
    return null;
  }
  const a = clampUnit(u0);
  const b = clampUnit(v0);
  const c = clampUnit(u1);
  const d = clampUnit(v1);
  const lo_u = Math.min(a, c);
  const hi_u = Math.max(a, c);
  const lo_v = Math.min(b, d);
  const hi_v = Math.max(b, d);
  const wFrac = hi_u - lo_u;
  const hFrac = hi_v - lo_v;
  if (wFrac < MIN_DRAG_FRACTION || hFrac < MIN_DRAG_FRACTION) return null;
  // Clamp percentages to schema ranges and round to one decimal — matches
  // the Position/Width/Height slider step so a value typed back from a
  // drag doesn't read as `50.252607…%` in the readout.
  const sourceW = round1(Math.min(100, Math.max(1, wFrac * 100)));
  const sourceH = round1(Math.min(100, Math.max(1, hFrac * 100)));
  const sourceX = round1(Math.min(100, Math.max(0, lo_u * 100)));
  const sourceY = round1(Math.min(100, Math.max(0, lo_v * 100)));
  const displayX = round1(Math.min(100, Math.max(0, (lo_u + wFrac / 2) * 100)));
  const displayY = round1(Math.min(100, Math.max(0, (lo_v + hFrac / 2) * 100)));
  return { sourceX, sourceY, sourceW, sourceH, displayX, displayY };
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

/** Default card-scale multiplier for new drag-selected callouts. Picked
 *  small enough that the card reads as a lifted version of the source —
 *  not a sticker. Matches the plan's "1.1 or 1.15" range. */
export const DEFAULT_CARD_SCALE = 1.15;

function clampUnit(v: number): number {
  if (Number.isNaN(v)) return 0;
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

/**
 * Read the screenshot's on-screen bounding rect in client (viewport) px.
 * Pointer events from the React overlay arrive in the same coordinate
 * space, so the caller can compute `(clientX - rect.left) / rect.width`
 * directly without further conversion.
 */
export function getScreenshotClientRect(surface: PreviewSurface): ClientRect | null {
  const el = findScreenshotElement(surface);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width <= 0 || r.height <= 0) return null;
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}
