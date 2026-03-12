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
  // Sans-serif
  { id: 'inter', name: 'Inter', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'roboto', name: 'Roboto', weights: [400, 500, 700, 900], category: 'sans-serif' },
  { id: 'open-sans', name: 'Open Sans', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'lato', name: 'Lato', weights: [400, 700, 900], category: 'sans-serif' },
  { id: 'poppins', name: 'Poppins', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'montserrat', name: 'Montserrat', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'nunito', name: 'Nunito', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'dm-sans', name: 'DM Sans', weights: [400, 500, 600, 700], category: 'sans-serif' },
  { id: 'plus-jakarta-sans', name: 'Plus Jakarta Sans', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'raleway', name: 'Raleway', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'space-grotesk', name: 'Space Grotesk', weights: [400, 500, 700], category: 'sans-serif' },
  { id: 'work-sans', name: 'Work Sans', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'manrope', name: 'Manrope', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'outfit', name: 'Outfit', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'sora', name: 'Sora', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'figtree', name: 'Figtree', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'rubik', name: 'Rubik', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'urbanist', name: 'Urbanist', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'lexend', name: 'Lexend', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'albert-sans', name: 'Albert Sans', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  { id: 'red-hat-display', name: 'Red Hat Display', weights: [400, 500, 600, 700, 800], category: 'sans-serif' },
  // Serif
  { id: 'playfair-display', name: 'Playfair Display', weights: [400, 500, 600, 700, 800], category: 'serif' },
  { id: 'merriweather', name: 'Merriweather', weights: [400, 700, 900], category: 'serif' },
  { id: 'lora', name: 'Lora', weights: [400, 500, 600, 700], category: 'serif' },
  { id: 'source-serif-4', name: 'Source Serif 4', weights: [400, 500, 600, 700, 800], category: 'serif' },
  { id: 'libre-baskerville', name: 'Libre Baskerville', weights: [400, 700], category: 'serif' },
  { id: 'crimson-text', name: 'Crimson Text', weights: [400, 600, 700], category: 'serif' },
  { id: 'eb-garamond', name: 'EB Garamond', weights: [400, 500, 600, 700, 800], category: 'serif' },
  // Display
  { id: 'bebas-neue', name: 'Bebas Neue', weights: [400], category: 'display' },
  { id: 'oswald', name: 'Oswald', weights: [400, 500, 600, 700], category: 'display' },
  { id: 'archivo-black', name: 'Archivo Black', weights: [400], category: 'display' },
  { id: 'anton', name: 'Anton', weights: [400], category: 'display' },
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
