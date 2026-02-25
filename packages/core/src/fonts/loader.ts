import { readFile, readdir } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getFontsDir(): string {
  return join(__dirname, '..', '..', '..', '..', 'fonts');
}

export interface FontInfo {
  id: string;
  name: string;
  weights: number[];
  category: 'sans-serif' | 'serif' | 'display';
}

export const FONT_CATALOG: FontInfo[] = [
  { id: 'inter', name: 'Inter', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'space-grotesk', name: 'Space Grotesk', weights: [400, 500, 700], category: 'sans-serif' },
  { id: 'poppins', name: 'Poppins', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'montserrat', name: 'Montserrat', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'dm-sans', name: 'DM Sans', weights: [400, 500, 600, 700], category: 'sans-serif' },
  { id: 'plus-jakarta-sans', name: 'Plus Jakarta Sans', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'raleway', name: 'Raleway', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'playfair-display', name: 'Playfair Display', weights: [400, 500, 600, 700, 800], category: 'serif' },
];

const FONT_NAME_MAP: Record<string, string> = Object.fromEntries(
  FONT_CATALOG.map((f) => [f.id, f.name]),
);

interface FontFace {
  family: string;
  weight: number;
  src: string; // data URI
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
 * with embedded base64 data URIs. Results are cached.
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
    // Font dir not found — return empty (will fall back to system fonts)
    return '';
  }

  const fontFiles = files.filter((f) => {
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
      src: dataUri,
      format: formatName(ext),
    });
  }

  // Sort by weight
  faces.sort((a, b) => a.weight - b.weight);

  const css = faces
    .map((f) => `@font-face {
  font-family: '${f.family}';
  font-weight: ${f.weight};
  font-style: normal;
  font-display: block;
  src: url('${f.src}') format('${f.format}');
}`)
    .join('\n\n');

  fontCache.set(cacheKey, css);
  return css;
}

/**
 * Load font-face CSS for both Inter and Space Grotesk (kept for backward compat).
 */
export async function loadAllFontFaces(fontsDir?: string): Promise<string> {
  const [inter, spaceGrotesk] = await Promise.all([
    loadFontFaces('inter', fontsDir),
    loadFontFaces('space-grotesk', fontsDir),
  ]);
  return `${inter}\n\n${spaceGrotesk}`;
}
