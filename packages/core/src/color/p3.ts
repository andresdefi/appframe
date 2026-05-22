// Display P3 colour conversion utilities.
//
// appframe stores colour values as CSS `color(display-p3 r g b)` so the
// editor can express any P3-gamut colour faithfully (red phones, neon
// brand palettes, etc. that get clamped to sRGB). Existing project files
// hold legacy hex strings; we convert those losslessly on load — re-express
// the same CIE point in P3 space, not push the value to wider gamut. A
// user only sees a brighter / more saturated colour after explicitly
// picking one in the P3 picker that's outside the sRGB gamut.
//
// Math references: CSS Color Module Level 4 (Section 17, "Sample code
// for Color Conversions"). The matrices below are the Bradford-adapted
// sRGB <-> P3 transforms with the D65 white point, which is what CSS
// uses for `color(display-p3 ...)`.

const SRGB_LINEAR_TO_P3_LINEAR: readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
] = [
  [0.8224621, 0.1775380, 0.0000000],
  [0.0331942, 0.9668058, 0.0000000],
  [0.0170828, 0.0723974, 0.9105199],
];

const P3_LINEAR_TO_SRGB_LINEAR: readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
] = [
  [1.2249401, -0.2249404, 0.0000000],
  [-0.0420569, 1.0420572, 0.0000000],
  [-0.0196376, -0.0786361, 1.0982737],
];

// sRGB / Display-P3 share the same transfer function (gamma encoding).

function gammaDecode(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function gammaEncode(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function applyMatrix(
  m: readonly [
    readonly [number, number, number],
    readonly [number, number, number],
    readonly [number, number, number],
  ],
  v: readonly [number, number, number],
): [number, number, number] {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

/** Normalize a hex string to 6-char lowercase, no leading #. Returns
 *  null when the input isn't recognisable as a 3-, 6-, or 8-char hex
 *  literal. Alpha (8-char) hex strips its alpha — callers that need
 *  alpha should parse separately. */
function normalizeHex(input: string): string | null {
  const m = input.trim().match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
  if (!m || m[1] === undefined) return null;
  let hex = m[1].toLowerCase();
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  if (hex.length === 8) hex = hex.slice(0, 6); // drop alpha
  return hex;
}

/**
 * Convert a hex colour to `color(display-p3 r g b)` losslessly — the
 * resulting P3 value renders identically to the original hex on any
 * display, sRGB or P3. Only the encoding changes, not the perceived
 * colour. Used at the hydration boundary to migrate legacy projects.
 *
 * Returns the input string unchanged when it isn't recognisable as a
 * hex literal — callers can chain this through values that may already
 * be in P3 notation.
 */
export function hexToDisplayP3(hex: string): string {
  const norm = normalizeHex(hex);
  if (norm === null) return hex;
  const r8 = parseInt(norm.slice(0, 2), 16);
  const g8 = parseInt(norm.slice(2, 4), 16);
  const b8 = parseInt(norm.slice(4, 6), 16);
  // 0..255 -> 0..1 gamma-encoded -> linear sRGB -> linear P3 -> gamma-encoded P3
  const linSrgb: [number, number, number] = [
    gammaDecode(r8 / 255),
    gammaDecode(g8 / 255),
    gammaDecode(b8 / 255),
  ];
  const linP3 = applyMatrix(SRGB_LINEAR_TO_P3_LINEAR, linSrgb);
  const p3: [number, number, number] = [
    gammaEncode(linP3[0]),
    gammaEncode(linP3[1]),
    gammaEncode(linP3[2]),
  ];
  // Four-decimal precision is enough to round-trip back to the same
  // hex byte; more digits just bloat the JSON without changing pixels.
  return `color(display-p3 ${p3[0].toFixed(4)} ${p3[1].toFixed(4)} ${p3[2].toFixed(4)})`;
}

/**
 * Parse a `color(display-p3 r g b)` string into three 0..1 components
 * (gamma-encoded, as stored). Returns null on malformed input. Values
 * outside 0..1 are preserved — callers that want clamping should do so
 * explicitly.
 */
export function parseDisplayP3(input: string): { r: number; g: number; b: number } | null {
  // Hard cap before regex matching. The longest legitimate
  // display-p3 string is ~70 chars (`color(display-p3 -0.9999e-99
  // -0.9999e-99 -0.9999e-99 / 0.99999)`). 200 leaves comfortable
  // headroom while blocking adversarial inputs that could trigger
  // polynomial backtracking in the digit-group alternation below.
  if (input.length > 200) return null;
  const m = input
    .trim()
    .match(
      /^color\(\s*display-p3\s+(-?\d*\.?\d+(?:e[+-]?\d+)?)\s+(-?\d*\.?\d+(?:e[+-]?\d+)?)\s+(-?\d*\.?\d+(?:e[+-]?\d+)?)\s*(?:\/\s*[\d.]+\s*)?\)$/i,
    );
  if (!m) return null;
  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);
  if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) return null;
  return { r, g, b };
}

/**
 * Convert a `color(display-p3 r g b)` value back to the closest sRGB
 * hex literal. Used by the colour picker's hex input row: when the
 * user types a hex, we convert TO P3 for storage; when we display a
 * P3 value in the hex field, we convert BACK for the readout.
 *
 * Values outside the sRGB gamut clamp to the nearest in-gamut point,
 * matching browser behaviour when rendering P3 on an sRGB display.
 */
export function displayP3ToHex(input: string): string | null {
  const parsed = parseDisplayP3(input);
  if (parsed === null) return null;
  const linP3: [number, number, number] = [
    gammaDecode(parsed.r),
    gammaDecode(parsed.g),
    gammaDecode(parsed.b),
  ];
  const linSrgb = applyMatrix(P3_LINEAR_TO_SRGB_LINEAR, linP3);
  // Clamp negative / >1 linear values before re-encoding so the gamma
  // function doesn't operate on out-of-range inputs.
  const srgb: [number, number, number] = [
    gammaEncode(clamp01(linSrgb[0])),
    gammaEncode(clamp01(linSrgb[1])),
    gammaEncode(clamp01(linSrgb[2])),
  ];
  const r8 = Math.round(srgb[0] * 255);
  const g8 = Math.round(srgb[1] * 255);
  const b8 = Math.round(srgb[2] * 255);
  const hh = (n: number) => n.toString(16).padStart(2, '0');
  return `#${hh(r8)}${hh(g8)}${hh(b8)}`;
}

/**
 * True for any string the editor recognises as a colour value — either
 * a CSS hex literal or a `color(display-p3 ...)` expression.
 */
export function isColorValue(input: string): boolean {
  return normalizeHex(input) !== null || parseDisplayP3(input) !== null;
}

/**
 * Idempotently normalise a colour string to P3 storage form. Hex
 * values convert via `hexToDisplayP3`; P3 values pass through unchanged;
 * anything unrecognised is returned as-is so call sites that walk over
 * mixed strings (e.g. saved project JSON) can chain this safely.
 */
export function toDisplayP3(input: string): string {
  if (parseDisplayP3(input) !== null) return input;
  return hexToDisplayP3(input);
}
