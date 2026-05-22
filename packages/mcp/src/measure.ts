// Text-measurement utilities backed by fontkit. Reads the bundled
// woff2 files directly from disk, sums glyph advances, accounts for
// word-wrap. No browser involvement, no HTTP round-trips.
//
// Used by:
//  - auto_fit_headline (binary-search font size that fits in N lines)
//  - check_text_overlap (compute text bounds + device bounds, intersect)
//  - predict_locale_overflow (estimate whether a translation overflows)

import * as fontkit from 'fontkit';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Mirrors getFontsDir in @appframe/core. Resolved relative to this
// file's compiled location: packages/mcp/dist/measure.js → up to repo
// root → fonts/. Kept in sync manually because @appframe/core doesn't
// export the path (only the loader).
function getFontsDir(): string {
  return resolve(__dirname, '..', '..', '..', 'fonts');
}

// Cache parsed fonts by absolute path. Fonts are content-addressed and
// never mutate at runtime.
const fontCache = new Map<string, fontkit.Font>();

function loadFont(fontId: string, weight: number): fontkit.Font | null {
  const dir = join(getFontsDir(), fontId);
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir);
  // Pick the closest matching weight file. Filename convention is
  // `<id>-<style>.woff2` where style is one of `regular` / `medium`
  // / `semibold` / `bold` / etc — same convention parseWeight in
  // @appframe/core understands. We do the inverse lookup here.
  const wantStyles = styleNamesForWeight(weight);
  let picked: string | undefined;
  for (const style of wantStyles) {
    picked = files.find((f) => f.toLowerCase().includes(style) && f.endsWith('.woff2'));
    if (picked) break;
  }
  if (!picked) {
    // Fall back to any non-italic woff2.
    picked = files.find((f) => f.endsWith('.woff2') && !/italic/i.test(f));
  }
  if (!picked) return null;
  const path = join(dir, picked);
  const cached = fontCache.get(path);
  if (cached) return cached;
  const buf = readFileSync(path);
  const font = fontkit.create(buf) as fontkit.Font;
  fontCache.set(path, font);
  return font;
}

// Closest-match weight name lookup. Mirrors WEIGHT_MAP in
// @appframe/core's loader.ts. Returns ordered list of substrings to
// try when picking a filename for the requested weight.
function styleNamesForWeight(weight: number): string[] {
  if (weight <= 200) return ['extralight', 'thin', 'light', 'regular'];
  if (weight <= 300) return ['light', 'extralight', 'regular'];
  if (weight <= 400) return ['regular', 'medium', 'light'];
  if (weight <= 500) return ['medium', 'regular', 'semibold'];
  if (weight <= 600) return ['semibold', 'medium', 'bold'];
  if (weight <= 700) return ['bold', 'semibold', 'extrabold'];
  if (weight <= 800) return ['extrabold', 'bold', 'black'];
  return ['black', 'extrabold', 'bold'];
}

export interface TextMetrics {
  /** Total width in pixels if the text rendered on a single line. */
  singleLineWidth: number;
  /** Width in pixels when wrapped to the given max width. */
  wrappedWidth: number;
  /** Number of lines after word-wrap to `maxWidth`. 1 if no wrap. */
  lineCount: number;
  /** Total height in pixels = lineCount * fontSize * lineHeight. */
  height: number;
}

export interface MeasureOptions {
  text: string;
  fontId: string;
  fontSize: number;
  fontWeight: number;
  /** Max width in pixels for word-wrap. If absent, no wrap (single line). */
  maxWidth?: number;
  /** CSS line-height multiplier (default 1.12 — matches the template's
   *  presetHeadlineLineHeight default). */
  lineHeight?: number;
}

/**
 * Measure rendered width / height of text using the bundled font.
 * Falls back to a heuristic estimate (0.55 em per char) if the font
 * file isn't found or fails to parse — keeps the tools usable even
 * for fonts we haven't bundled yet, just with reduced accuracy.
 */
export function measureText(opts: MeasureOptions): TextMetrics {
  const { text, fontId, fontSize, fontWeight, maxWidth, lineHeight = 1.12 } = opts;
  const font = loadFont(fontId, fontWeight);
  const measureWord = (word: string): number => {
    if (!font) return word.length * fontSize * 0.55;
    try {
      const run = font.layout(word);
      const widthInUnits = run.positions.reduce(
        (sum, pos) => sum + (pos?.xAdvance ?? 0),
        0,
      );
      return (widthInUnits / font.unitsPerEm) * fontSize;
    } catch {
      return word.length * fontSize * 0.55;
    }
  };
  const measureLine = (line: string): number => measureWord(line);

  // Split on explicit newlines first; then word-wrap each line if a
  // maxWidth was given. Mirrors how the browser's CSS would render.
  const inputLines = text.split(/\r?\n/);
  const finalLines: string[] = [];
  const spaceWidth = measureWord(' ');
  for (const inputLine of inputLines) {
    if (maxWidth === undefined) {
      finalLines.push(inputLine);
      continue;
    }
    const words = inputLine.split(/\s+/);
    let current = '';
    let currentWidth = 0;
    for (const word of words) {
      const wordWidth = measureWord(word);
      if (current === '') {
        current = word;
        currentWidth = wordWidth;
        continue;
      }
      const next = currentWidth + spaceWidth + wordWidth;
      if (next > maxWidth) {
        finalLines.push(current);
        current = word;
        currentWidth = wordWidth;
      } else {
        current = current + ' ' + word;
        currentWidth = next;
      }
    }
    if (current !== '') finalLines.push(current);
  }
  if (finalLines.length === 0) finalLines.push('');

  const singleLineWidth = measureLine(text.replace(/\s+/g, ' ').trim());
  const wrappedWidth = Math.max(...finalLines.map(measureLine));
  const lineCount = finalLines.length;
  const height = lineCount * fontSize * lineHeight;

  return { singleLineWidth, wrappedWidth, lineCount, height };
}

export interface DeviceBounds {
  /** Canvas-% x of device left edge. */
  left: number;
  /** Canvas-% y of device top edge. */
  top: number;
  /** Canvas-% width. */
  width: number;
  /** Canvas-% height (approx — depends on frame aspect). */
  height: number;
}

/**
 * Estimate the on-canvas bounds (in canvas-%) of the primary device
 * frame. Reads deviceTop / deviceScale / deviceOffsetX from the screen
 * state. Returns an approximation; the actual device height depends
 * on the frame's aspect ratio which the renderer computes.
 */
export function estimateDeviceBounds(screen: Record<string, unknown>): DeviceBounds {
  const deviceTop = typeof screen.deviceTop === 'number' ? screen.deviceTop : 15;
  const deviceScale = typeof screen.deviceScale === 'number' ? screen.deviceScale : 92;
  const deviceOffsetX = typeof screen.deviceOffsetX === 'number' ? screen.deviceOffsetX : 0;
  // iPhone-ish aspect: width ≈ 0.5 of canvas width at scale 92, height
  // ≈ 2× width. Approximation since exact depends on the frame asset
  // and platform; good enough for "does the headline overlap"
  // questions which only need to know roughly where the device is.
  const widthPct = deviceScale * 0.5;
  const heightPct = widthPct * 2;
  const left = 50 + deviceOffsetX - widthPct / 2;
  return { left, top: deviceTop, width: widthPct, height: heightPct };
}
