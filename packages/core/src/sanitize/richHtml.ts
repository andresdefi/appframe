/**
 * HTML sanitizer for the headline / subtitle / freeText fields.
 *
 * The editor produces these strings via TipTap with a fixed extension
 * set — bold, italic, underline, strikethrough, hard breaks, inline
 * color spans, and text-align on paragraphs. Anything else in the
 * input (imported `appframe.json`, hand-written YAML, etc.) is
 * untrusted: those strings flow into a same-origin preview iframe via
 * `doc.write` and into the live DOM via `innerHTML`. Without an
 * allowlist sanitizer, a `<script>` tag could execute inside the
 * editor's origin.
 *
 * Conservative by design: when in doubt, drop. The TipTap allowlist
 * is small and well-known; anything beyond it loses formatting in
 * exchange for safety. Pure function, no dependencies, runs in
 * Node and the browser.
 */

const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  's',
  'strike',
  'u',
  'span',
]);

const VOID_TAGS = new Set(['br']);

const ALLOWED_ATTRS_PER_TAG: Record<string, Set<string>> = {
  p: new Set(['style']),
  span: new Set(['style']),
};

const ALLOWED_STYLE_PROPS = new Set(['color', 'text-align']);
const ALIGN_VALUES = new Set(['left', 'center', 'right', 'justify']);

// Strict color value allowlist. Hex (#rgb, #rgba, #rrggbb, #rrggbbaa),
// rgb(...), rgba(...), hsl(...), hsla(...). Rejects `javascript:`,
// `url(...)`, `expression(...)`, and anything else that could carry
// executable side-effects through a style attribute.
const COLOR_RE =
  /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(?:0|1|0?\.\d+)\s*\)|hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)|hsla\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*(?:0|1|0?\.\d+)\s*\))$/;

interface Attr {
  name: string;
  value: string;
}

type Token =
  | { type: 'text'; value: string }
  | { type: 'open'; name: string; selfClose: boolean; attrs: Attr[] }
  | { type: 'close'; name: string }
  | { type: 'comment' };

export function sanitizeRichHtml(input: unknown): string {
  if (typeof input !== 'string' || input.length === 0) return '';
  const tokens = tokenize(input);
  const out: string[] = [];
  for (const tok of tokens) {
    if (tok.type === 'text') {
      out.push(escapeText(tok.value));
    } else if (tok.type === 'comment') {
      // strip
    } else if (tok.type === 'open') {
      if (!ALLOWED_TAGS.has(tok.name)) continue;
      const attrs = sanitizeAttrs(tok.name, tok.attrs);
      const slash = VOID_TAGS.has(tok.name) || tok.selfClose ? ' /' : '';
      out.push(`<${tok.name}${attrs}${slash}>`);
    } else if (tok.type === 'close') {
      if (!ALLOWED_TAGS.has(tok.name) || VOID_TAGS.has(tok.name)) continue;
      out.push(`</${tok.name}>`);
    }
  }
  return out.join('');
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = input.length;
  let textStart = 0;

  while (i < len) {
    const ch = input[i];
    if (ch !== '<') {
      i++;
      continue;
    }
    const next = input[i + 1];

    // A `<` only starts a tag if it's followed by a letter, `/`, `!`,
    // or `?`. Otherwise (e.g. `< 2` in `a < b`) treat it as literal
    // text. Standard HTML5 rule, and it stops the tokenizer from
    // swallowing math/comparison ambient text.
    const startsTag =
      next === '/' ||
      next === '!' ||
      next === '?' ||
      (typeof next === 'string' && /[a-zA-Z]/.test(next));
    if (!startsTag) {
      i++;
      continue;
    }

    // Flush pending text.
    if (i > textStart) {
      tokens.push({ type: 'text', value: input.slice(textStart, i) });
    }

    // Comment: <!-- ... -->
    if (input.startsWith('<!--', i)) {
      const end = input.indexOf('-->', i + 4);
      if (end === -1) {
        i = len;
      } else {
        i = end + 3;
      }
      tokens.push({ type: 'comment' });
      textStart = i;
      continue;
    }
    // DOCTYPE / CDATA / processing instructions: <! ... > or <? ... >
    if (next === '!' || next === '?') {
      const end = input.indexOf('>', i + 2);
      if (end === -1) {
        i = len;
      } else {
        i = end + 1;
      }
      textStart = i;
      continue;
    }

    // Closing tag: </name>
    if (next === '/') {
      const end = input.indexOf('>', i + 2);
      if (end === -1) {
        // Unterminated — treat the rest as text and stop.
        tokens.push({ type: 'text', value: input.slice(i) });
        i = len;
        textStart = i;
        continue;
      }
      const inner = input.slice(i + 2, end).trim();
      const name = inner.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (name) tokens.push({ type: 'close', name });
      i = end + 1;
      textStart = i;
      continue;
    }

    // Opening / self-closing tag: <name attr=val ... > or <name ... />
    const end = findTagEnd(input, i + 1);
    if (end === -1) {
      // Unterminated — treat as text and stop.
      tokens.push({ type: 'text', value: input.slice(i) });
      i = len;
      textStart = i;
      continue;
    }
    const inner = input.slice(i + 1, end);
    const parsed = parseOpenTag(inner);
    if (parsed) {
      tokens.push({ type: 'open', name: parsed.name, selfClose: parsed.selfClose, attrs: parsed.attrs });
    }
    i = end + 1;
    textStart = i;
  }
  if (textStart < len) {
    tokens.push({ type: 'text', value: input.slice(textStart) });
  }
  return tokens;
}

// Find the `>` that closes the tag we just opened, respecting quoted
// attribute values so a stray `>` inside a value doesn't terminate
// the tag early.
function findTagEnd(input: string, from: number): number {
  let inSingle = false;
  let inDouble = false;
  for (let i = from; i < input.length; i++) {
    const ch = input[i];
    if (inSingle) {
      if (ch === "'") inSingle = false;
      continue;
    }
    if (inDouble) {
      if (ch === '"') inDouble = false;
      continue;
    }
    if (ch === "'") inSingle = true;
    else if (ch === '"') inDouble = true;
    else if (ch === '>') return i;
  }
  return -1;
}

function parseOpenTag(inner: string): { name: string; selfClose: boolean; attrs: Attr[] } | null {
  let i = 0;
  // Skip leading whitespace.
  while (i < inner.length && /\s/.test(inner[i]!)) i++;
  const nameStart = i;
  while (i < inner.length && /[a-zA-Z0-9]/.test(inner[i]!)) i++;
  const name = inner.slice(nameStart, i).toLowerCase();
  if (!name) return null;
  const attrs: Attr[] = [];
  let selfClose = false;
  while (i < inner.length) {
    // Skip whitespace.
    while (i < inner.length && /\s/.test(inner[i]!)) i++;
    if (i >= inner.length) break;
    if (inner[i] === '/') {
      selfClose = true;
      i++;
      continue;
    }
    // Read attribute name.
    const attrStart = i;
    while (i < inner.length && /[a-zA-Z0-9\-_:]/.test(inner[i]!)) i++;
    const attrName = inner.slice(attrStart, i).toLowerCase();
    if (!attrName) {
      // Garbage character; skip.
      i++;
      continue;
    }
    // Read optional value.
    let value = '';
    // Skip whitespace before '='.
    while (i < inner.length && /\s/.test(inner[i]!)) i++;
    if (inner[i] === '=') {
      i++;
      // Skip whitespace after '='.
      while (i < inner.length && /\s/.test(inner[i]!)) i++;
      if (inner[i] === '"' || inner[i] === "'") {
        const quote = inner[i]!;
        i++;
        const valueStart = i;
        while (i < inner.length && inner[i] !== quote) i++;
        value = inner.slice(valueStart, i);
        if (i < inner.length) i++; // consume closing quote
      } else {
        const valueStart = i;
        while (i < inner.length && !/[\s>]/.test(inner[i]!)) i++;
        value = inner.slice(valueStart, i);
      }
    }
    attrs.push({ name: attrName, value });
  }
  return { name, selfClose, attrs };
}

function sanitizeAttrs(tag: string, attrs: Attr[]): string {
  const allowed = ALLOWED_ATTRS_PER_TAG[tag];
  if (!allowed) return '';
  const out: string[] = [];
  for (const attr of attrs) {
    if (!allowed.has(attr.name)) continue;
    let value = attr.value;
    if (attr.name === 'style') {
      value = sanitizeStyle(value);
      if (!value) continue;
    }
    out.push(` ${attr.name}="${escapeAttrValue(value)}"`);
  }
  return out.join('');
}

function sanitizeStyle(value: string): string {
  const kept: string[] = [];
  for (const part of value.split(';')) {
    const idx = part.indexOf(':');
    if (idx === -1) continue;
    const prop = part.slice(0, idx).trim().toLowerCase();
    const val = part.slice(idx + 1).trim();
    if (!ALLOWED_STYLE_PROPS.has(prop)) continue;
    if (prop === 'color' && !COLOR_RE.test(val)) continue;
    if (prop === 'text-align' && !ALIGN_VALUES.has(val.toLowerCase())) continue;
    kept.push(`${prop}: ${val}`);
  }
  return kept.join('; ');
}

function escapeText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttrValue(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
