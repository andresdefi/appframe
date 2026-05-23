import { readFile, readdir } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getFontsDir(): string {
  return join(__dirname, '..', '..', '..', '..', 'fonts');
}

export type FontCategory = 'sans-serif' | 'serif' | 'display' | 'condensed' | 'mono' | 'script' | 'rounded';

export interface FontInfo {
  id: string;
  name: string;
  weights: number[];
  /** Weights that ship a true italic .woff2 file. Empty = no real italic (browser will skip italic styling). */
  italicWeights: number[];
  category: FontCategory;
  /** Short description of the typeface's visual character, for the UI picker. */
  description: string;
}

export const FONT_CATALOG: FontInfo[] = [
  // Sans-serif workhorses
  {
    id: 'inter', name: 'Inter',
    weights: [400, 500, 600, 700, 800], italicWeights: [400, 500, 600, 700, 800],
    category: 'sans-serif',
    description: 'Neutral geometric sans. Apple-aligned workhorse.',
  },
  {
    id: 'dm-sans', name: 'DM Sans',
    weights: [400, 500, 600, 700], italicWeights: [400, 500, 600, 700],
    category: 'sans-serif',
    description: 'Warmer humanist geometric. Softer curves than Inter.',
  },
  {
    id: 'space-grotesk', name: 'Space Grotesk',
    weights: [400, 500, 700], italicWeights: [],
    category: 'sans-serif',
    description: 'Squared terminals, semi-monospaced rhythm. Technical feel.',
  },
  {
    id: 'instrument-sans', name: 'Instrument Sans',
    weights: [400, 500, 600, 700], italicWeights: [400, 700],
    category: 'sans-serif',
    description: 'Modern grotesque with humanist quirks.',
  },
  // Condensed / display heavies
  {
    id: 'bebas-neue', name: 'Bebas Neue',
    weights: [400], italicWeights: [],
    category: 'condensed',
    description: 'Iconic thin-stem condensed caps. Billboard classic.',
  },
  {
    id: 'anton', name: 'Anton',
    weights: [400], italicWeights: [],
    category: 'condensed',
    description: 'Ultra-heavy condensed. Hits like a truck.',
  },
  {
    id: 'archivo-black', name: 'Archivo Black',
    weights: [400], italicWeights: [],
    category: 'display',
    description: 'Geometric display, heavy but not condensed.',
  },
  {
    id: 'barlow-condensed', name: 'Barlow Condensed',
    weights: [300, 400, 500, 600, 700, 800, 900], italicWeights: [],
    category: 'condensed',
    description: 'Condensed sans with full weight range.',
  },
  {
    id: 'bungee', name: 'Bungee',
    weights: [400], italicWeights: [],
    category: 'display',
    description: 'Block-stacked wide display. Retro billboard.',
  },
  {
    id: 'ultra', name: 'Ultra',
    weights: [400], italicWeights: [],
    category: 'display',
    description: 'Didone extremes. Ultra-heavy with hairline contrast.',
  },

  // Serifs
  {
    id: 'playfair-display', name: 'Playfair Display',
    weights: [400, 500, 600, 700, 800], italicWeights: [400, 500, 600, 700, 800],
    category: 'serif',
    description: 'High-contrast display serif. Editorial standard.',
  },
  {
    id: 'fraunces', name: 'Fraunces',
    weights: [400, 500, 600, 700, 800], italicWeights: [400, 600, 700],
    category: 'serif',
    description: 'Modern expressive variable serif.',
  },
  {
    id: 'cormorant-garamond', name: 'Cormorant Garamond',
    weights: [300, 400, 500, 600, 700], italicWeights: [400, 600, 700],
    category: 'serif',
    description: 'Luxe thin serif. Fashion / fine-dining register.',
  },
  {
    id: 'zilla-slab', name: 'Zilla Slab',
    weights: [400, 500, 600, 700], italicWeights: [],
    category: 'serif',
    description: 'Chunky slab serif. Editorial grounding.',
  },

  // Rounded
  {
    id: 'fredoka', name: 'Fredoka',
    weights: [400, 500, 600, 700], italicWeights: [],
    category: 'rounded',
    description: 'Fully rounded soft sans. Playful friendly tone.',
  },

  // Mono
  {
    id: 'jetbrains-mono', name: 'JetBrains Mono',
    weights: [400, 500, 600, 700, 800], italicWeights: [],
    category: 'mono',
    description: 'Technical monospace with ligatures.',
  },

  // Script
  {
    id: 'caveat', name: 'Caveat',
    weights: [400, 500, 600, 700], italicWeights: [],
    category: 'script',
    description: 'Casual handwriting. Signature accent.',
  },
  {
    id: 'dancing-script', name: 'Dancing Script',
    weights: [400, 500, 600, 700], italicWeights: [],
    category: 'script',
    description: 'Semi-formal cursive. Luxury / wedding register.',
  },
  {
    id: 'great-vibes', name: 'Great Vibes',
    weights: [400], italicWeights: [],
    category: 'script',
    description: 'Full luxury script. Flowing cursive.',
  },
  {
    id: 'kalam', name: 'Kalam',
    weights: [300, 400, 700], italicWeights: [],
    category: 'script',
    description: 'Bolder connected brush. Hand-lettered feel.',
  },
  {
    id: 'permanent-marker', name: 'Permanent Marker',
    weights: [400], italicWeights: [],
    category: 'script',
    description: 'Thick marker strokes. Hand-drawn and bold.',
  },

  // Display specials
  {
    id: 'luckiest-guy', name: 'Luckiest Guy',
    weights: [400], italicWeights: [],
    category: 'display',
    description: 'Chunky cartoon caps. American diner style.',
  },
  {
    id: 'caprasimo', name: 'Caprasimo',
    weights: [400], italicWeights: [],
    category: 'display',
    description: 'Quirky soft serif. Warm and expressive.',
  },
  {
    id: 'rubik-doodle-shadow', name: 'Rubik Doodle Shadow',
    weights: [400], italicWeights: [],
    category: 'display',
    description: 'Double-outline doodle display.',
  },
  {
    id: 'press-start-2p', name: 'Press Start 2P',
    weights: [400], italicWeights: [],
    category: 'display',
    description: 'True bitmap pixel font. 8-bit nostalgia.',
  },
  {
    id: 'staatliches', name: 'Staatliches',
    weights: [400], italicWeights: [],
    category: 'display',
    description: 'Stencil condensed caps. Badge / sticker register.',
  },
  // 2026-05 catalog expansion. Each fills a gap left by commercial
  // fonts we can't redistribute (Migra, Söhne, Editorial New, Druk).
  {
    id: 'bricolage-grotesque', name: 'Bricolage Grotesque',
    weights: [400, 500, 600, 700, 800], italicWeights: [],
    category: 'display',
    description: 'Variable display grotesque. Modern, slightly playful, distinctive.',
  },
  {
    id: 'geist-sans', name: 'Geist',
    weights: [300, 400, 500, 600, 700, 900], italicWeights: [],
    category: 'sans-serif',
    description: "Vercel's open-source sans. Crisp, neutral, tech-product feel.",
  },
  {
    id: 'crimson-pro', name: 'Crimson Pro',
    weights: [400, 500, 600, 700, 800], italicWeights: [400, 600, 700],
    category: 'serif',
    description: 'Modern serif designed for screens. Editorial gravitas.',
  },
  {
    id: 'big-shoulders-display', name: 'Big Shoulders Display',
    weights: [400, 600, 700, 800, 900], italicWeights: [],
    category: 'condensed',
    description: 'Super-condensed display. Tall, heavy, billboard-ready.',
  },
  {
    id: 'outfit', name: 'Outfit',
    weights: [400, 500, 600, 700, 800, 900], italicWeights: [],
    category: 'sans-serif',
    description: 'Geometric sans with heavy weights. Marketing-headline staple.',
  },
  // 2026-05 follow-up: 6 more distinct vibes the catalog didn't have.
  {
    id: 'newsreader', name: 'Newsreader',
    weights: [400, 500, 600, 700, 800], italicWeights: [400, 500, 600, 700, 800],
    category: 'serif',
    description: 'Variable serif with optical sizes. Long-form editorial reading.',
  },
  {
    id: 'funnel-display', name: 'Funnel Display',
    weights: [300, 400, 500, 600, 700, 800], italicWeights: [],
    category: 'display',
    description: 'Extreme-contrast variable display. Thin-to-black with character.',
  },
  {
    id: 'tiny5', name: 'Tiny5',
    weights: [400], italicWeights: [],
    category: 'display',
    description: 'Legible 5-pixel font. Cleaner than Press Start 2P, more usable.',
  },
  {
    id: 'reenie-beanie', name: 'Reenie Beanie',
    weights: [400], italicWeights: [],
    category: 'script',
    description: 'Loose handwriting. Casual notebook scribble.',
  },
  {
    id: 'homemade-apple', name: 'Homemade Apple',
    weights: [400], italicWeights: [],
    category: 'script',
    description: 'Soft cursive handwriting. Friendly, personal letter feel.',
  },
  {
    id: 'geist-mono', name: 'Geist Mono',
    weights: [400, 500, 600, 700, 900], italicWeights: [],
    category: 'mono',
    description: "Vercel's monospace, rounder than JetBrains Mono. Pairs with Geist Sans.",
  },
];

const FONT_NAME_MAP: Record<string, string> = Object.fromEntries(
  FONT_CATALOG.map((f) => [f.id, f.name]),
);

export const FONT_IDS = FONT_CATALOG.map((f) => f.id);

interface FontFace {
  family: string;
  weight: number;
  style: 'normal' | 'italic';
  src: string;
  format: string;
}

// Order matters: longer names must come before shorter ones they contain
const WEIGHT_MAP: [string, number][] = [
  ['extralight', 200],
  ['extrabold', 800],
  ['semibold', 600],
  ['regular', 400],
  ['medium', 500],
  ['light', 300],
  ['black', 900],
  ['thin', 100],
  ['bold', 700],
];

function parseWeight(filename: string): number {
  const lower = filename.toLowerCase();
  for (const [key, value] of WEIGHT_MAP) {
    if (lower.includes(key)) return value;
  }
  return 400;
}

function parseStyle(filename: string): 'normal' | 'italic' {
  return /italic/i.test(filename) ? 'italic' : 'normal';
}

function mimeType(ext: string): string {
  switch (ext) {
    case '.woff2': return 'font/woff2';
    case '.woff': return 'font/woff';
    case '.otf': return 'font/otf';
    case '.ttf': return 'font/ttf';
    default: return 'application/octet-stream';
  }
}

function formatName(ext: string): string {
  switch (ext) {
    case '.woff2': return 'woff2';
    case '.woff': return 'woff';
    case '.otf': return 'opentype';
    case '.ttf': return 'truetype';
    default: return 'truetype';
  }
}

const fontCache = new Map<string, string>();

export function getFontName(fontId: string): string {
  return FONT_NAME_MAP[fontId] ?? fontId;
}

/**
 * Load a font family from the fonts directory and return @font-face CSS declarations
 * with embedded base64 data URIs. Emits one face per (weight, style) pair so real
 * italic files are honored instead of browser-synthesized oblique.
 */
export async function loadFontFaces(fontFamily: string, fontsDir?: string): Promise<string> {
  const cacheKey = `${fontFamily}:${fontsDir ?? 'default'}`;
  const cached = fontCache.get(cacheKey);
  if (cached) return cached;

  const dir = fontsDir ?? getFontsDir();
  const fontDir = join(dir, fontFamily);

  let files: string[];
  try {
    files = await readdir(fontDir);
  } catch {
    return '';
  }

  const fontFiles = files.filter((f) => {
    // Skip variable-font master file — we only emit named weight shims.
    if (/-Variable\.(woff2|woff|ttf|otf)$/i.test(f)) return false;
    const ext = extname(f).toLowerCase();
    return ['.woff2', '.woff', '.otf', '.ttf'].includes(ext);
  });

  const cssFamily = getFontName(fontFamily);
  const faces: FontFace[] = [];

  for (const file of fontFiles) {
    const ext = extname(file).toLowerCase();
    const buffer = await readFile(join(fontDir, file));
    const dataUri = `data:${mimeType(ext)};base64,${buffer.toString('base64')}`;

    faces.push({
      family: cssFamily,
      weight: parseWeight(file),
      style: parseStyle(file),
      src: dataUri,
      format: formatName(ext),
    });
  }

  faces.sort((a, b) => a.weight - b.weight || a.style.localeCompare(b.style));

  const css = faces
    .map((f) => `@font-face {
  font-family: '${f.family}';
  font-weight: ${f.weight};
  font-style: ${f.style};
  font-display: block;
  src: url('${f.src}') format('${f.format}');
}`)
    .join('\n\n');

  fontCache.set(cacheKey, css);
  return css;
}

/**
 * Load font-face CSS for the workhorse defaults (Inter + Space Grotesk).
 */
export async function loadAllFontFaces(fontsDir?: string): Promise<string> {
  const [inter, spaceGrotesk] = await Promise.all([
    loadFontFaces('inter', fontsDir),
    loadFontFaces('space-grotesk', fontsDir),
  ]);
  return `${inter}\n\n${spaceGrotesk}`;
}

const fontUrlCache = new Map<string, string>();

/**
 * URL-based @font-face CSS — emits `src: url('<baseUrl>/<family>/<file>')`
 * instead of inlining the font as a base64 data URI. Use this for the live
 * preview server where every render rewrites the iframe and a 338KB per-render
 * font payload freezes the main thread. The export pipeline keeps using
 * `loadFontFaces` since Playwright resolves data URIs without an HTTP server.
 *
 * `baseUrl` is the path prefix the font files are served from
 * (e.g. `/preview-fonts`). The server is expected to wire that path to the
 * project's `fonts/` directory via `express.static`.
 */
export async function loadFontFacesUrl(
  fontFamily: string,
  baseUrl: string,
  fontsDir?: string,
): Promise<string> {
  const cacheKey = `${fontFamily}:${baseUrl}:${fontsDir ?? 'default'}`;
  const cached = fontUrlCache.get(cacheKey);
  if (cached) return cached;

  const dir = fontsDir ?? getFontsDir();
  const fontDir = join(dir, fontFamily);

  let files: string[];
  try {
    files = await readdir(fontDir);
  } catch {
    return '';
  }

  const fontFiles = files.filter((f) => {
    if (/-Variable\.(woff2|woff|ttf|otf)$/i.test(f)) return false;
    const ext = extname(f).toLowerCase();
    return ['.woff2', '.woff', '.otf', '.ttf'].includes(ext);
  });

  const cssFamily = getFontName(fontFamily);
  const faces: FontFace[] = fontFiles.map((file) => ({
    family: cssFamily,
    weight: parseWeight(file),
    style: parseStyle(file),
    src: `${baseUrl}/${fontFamily}/${file}`,
    format: formatName(extname(file).toLowerCase()),
  }));

  faces.sort((a, b) => a.weight - b.weight || a.style.localeCompare(b.style));

  const css = faces
    .map((f) => `@font-face {
  font-family: '${f.family}';
  font-weight: ${f.weight};
  font-style: ${f.style};
  font-display: block;
  src: url('${f.src}') format('${f.format}');
}`)
    .join('\n\n');

  fontUrlCache.set(cacheKey, css);
  return css;
}
