import { readFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';
import { toDisplayP3 } from '@appframe/core';
import type { AppframeClient } from '../client.js';
import type { ContentResult } from './types.js';

// ---------- Type guards ----------

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// ---------- Arg validators ----------
// Throwing helpers keep handler bodies declarative. Errors are caught
// once in server.ts and surfaced as MCP isError responses.

export function requireString(args: Record<string, unknown>, name: string): string {
  const v = args[name];
  if (typeof v !== 'string' || v.length === 0) {
    throw new Error(`\`${name}\` is required (non-empty string)`);
  }
  return v;
}

export function requireSlug(args: Record<string, unknown>): string {
  const v = args.slug;
  if (typeof v !== 'string' || v.length === 0) {
    throw new Error('`slug` is required — call `get_active_project` first');
  }
  return v;
}

export function requireIndex(args: Record<string, unknown>): number {
  const v = args.index;
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 0) {
    throw new Error('`index` must be a non-negative integer');
  }
  return v;
}

export function requireRecord(args: unknown, label: string): Record<string, unknown> {
  if (!isRecord(args)) {
    throw new Error(`${label} requires an object of arguments`);
  }
  return args;
}

// Belt-and-braces safety check on destructive operations. The user's
// CLAUDE.md tells agents to confirm before destructive actions, but
// that's a polite-agent contract — `requireConfirm` enforces it at the
// tool boundary so a forgetful or buggy agent can't silently delete
// data. Pass `confirm: true` to proceed.
export function requireConfirm(
  args: Record<string, unknown>,
  label: string,
  what: string,
): void {
  if (args.confirm !== true) {
    throw new Error(
      `${label} would permanently ${what}. ` +
        'Pass `confirm: true` to proceed. ' +
        'This guard prevents accidental data loss — confirm with the user first.',
    );
  }
}

// ---------- Text + color normalization ----------

// The editor stores text fields as HTML (centered <p> by default). The
// ergonomic helpers accept either: plain text (wrapped in a centered
// paragraph) or already-formed HTML (any leading `<`). Trim is
// intentional — leading whitespace from heredocs would otherwise be
// treated as HTML.
export function wrapTextAsHtml(text: string): string {
  const trimmed = text.trimStart();
  if (trimmed.startsWith('<')) return text;
  return `<p style="text-align: center;">${text}</p>`;
}

// Normalize hex / display-p3 to display-p3 storage form. Accepts the
// same inputs core's toDisplayP3 accepts; passes unrecognized values
// through unchanged (the server will reject them on save if invalid).
export function normalizeColor(color: string): string {
  return toDisplayP3(color);
}

// ---------- File reading for upload tools ----------

const IMAGE_MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
};

// Read a local image file into a base64 data URL. The MCP runs as a
// child process of the agent, so it has read access to the user's
// machine — the agent can pass a path and we convert in memory.
export async function readFileAsDataUrl(
  filePath: string,
): Promise<{ dataUrl: string; filename: string }> {
  const ext = extname(filePath).toLowerCase();
  const mime = IMAGE_MIME_BY_EXT[ext];
  if (!mime) {
    throw new Error(
      `Unsupported image extension "${ext}" — supported: ${Object.keys(IMAGE_MIME_BY_EXT).join(', ')}`,
    );
  }
  let buf: Buffer;
  try {
    buf = await readFile(filePath);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // `cause` preserves the original errno + stack for downstream
    // logging while the message stays user-friendly.
    throw new Error(`Could not read "${filePath}": ${message}`, { cause: err });
  }
  return {
    dataUrl: `data:${mime};base64,${buf.toString('base64')}`,
    filename: basename(filePath),
  };
}

// ---------- Envelope read helpers ----------

// Read screens[index] from the on-disk envelope so an ergonomic helper
// can merge with existing field values (vs blindly overwriting). Throws
// on out-of-bounds index or malformed envelope so the caller doesn't
// have to repeat the same checks.
export async function readScreen(
  client: AppframeClient,
  slug: string,
  index: number,
): Promise<Record<string, unknown>> {
  const envelope = await client.getProjectEnvelope(slug);
  if (typeof envelope.data !== 'object' || envelope.data === null) {
    throw new Error('project envelope `data` is not an object');
  }
  const screens = (envelope.data as Record<string, unknown>).screens;
  if (!Array.isArray(screens) || index >= screens.length) {
    throw new Error(`screen index ${index} out of bounds`);
  }
  const screen = screens[index];
  if (typeof screen !== 'object' || screen === null || Array.isArray(screen)) {
    throw new Error(`screens[${index}] is not an object`);
  }
  return screen as Record<string, unknown>;
}

// ---------- Did-you-mean suggestions ----------

// Levenshtein distance — small implementation, fine for catalog sizes
// (typically < 100 entries). Used to suggest a likely-correct id when
// the agent passes something unknown.
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const prev: number[] = new Array(n + 1);
  const curr: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(
        (prev[j] ?? 0) + 1,           // deletion
        (curr[j - 1] ?? 0) + 1,       // insertion
        (prev[j - 1] ?? 0) + cost,    // substitution
      );
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j] ?? 0;
  }
  return prev[n] ?? 0;
}

// Find up to `max` candidates from `pool` that are closest to `input`.
// Returns lower-case-normalized lookup but keeps the original casing of
// the pool entries in the output. Empty array when nothing's close
// enough (filtered by `maxDistance`).
export function suggestSimilar(
  input: string,
  pool: Iterable<string>,
  options: { maxDistance?: number; max?: number } = {},
): string[] {
  // Threshold scales with input length, capped at 3. Stricter than the
  // textbook "max(3, ...)" so a 3-char typo doesn't suggest unrelated
  // 3-char ids (e.g. "qqq" -> "mac"). Long ids get a bit more leeway.
  const maxDistance = options.maxDistance ?? Math.min(3, Math.max(1, Math.ceil(input.length / 3)));
  const max = options.max ?? 3;
  const lower = input.toLowerCase();
  const scored: { id: string; d: number }[] = [];
  for (const candidate of pool) {
    const d = editDistance(lower, candidate.toLowerCase());
    if (d <= maxDistance) scored.push({ id: candidate, d });
  }
  scored.sort((a, b) => a.d - b.d);
  return scored.slice(0, max).map((s) => s.id);
}

// Convenience: build an error message that includes did-you-mean
// suggestions. Used by the validation helpers below for catalog ids.
export function unknownIdError(
  kind: string,
  value: string,
  pool: Iterable<string>,
  helpHint?: string,
): Error {
  const suggestions = suggestSimilar(value, pool);
  const suggestionPart =
    suggestions.length > 0
      ? ` Did you mean: ${suggestions.map((s) => `"${s}"`).join(', ')}?`
      : '';
  const helpPart = helpHint ? ` ${helpHint}` : '';
  return new Error(`unknown ${kind} "${value}".${suggestionPart}${helpPart}`);
}

// ---------- Result helper ----------

// Pretty-printed JSON content result. Most handlers return either the
// raw API response or a small shape — both flow through here.
export function jsonContent(payload: unknown): ContentResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
  };
}
