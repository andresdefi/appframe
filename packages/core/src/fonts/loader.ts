import { readFile, readdir } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getFontsDir(): string {
  return join(__dirname, '..', '..', '..', '..', 'fonts');
}

interface FontFace {
  family: string;
  weight: number;
  src: string; // data URI
  format: string;
}

const WEIGHT_MAP: Record<string, number> = {
  'regular': 400,
  'medium': 500,
  'semibold': 600,
  'bold': 700,
  'extrabold': 800,
};

function parseWeight(filename: string): number {
  const lower = filename.toLowerCase();
  for (const [key, value] of Object.entries(WEIGHT_MAP)) {
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

  const faces: FontFace[] = [];

  for (const file of fontFiles) {
    const ext = extname(file).toLowerCase();
    const buffer = await readFile(join(fontDir, file));
    const dataUri = `data:${mimeType(ext)};base64,${buffer.toString('base64')}`;

    faces.push({
      family: fontFamily === 'inter' ? 'Inter' : 'Space Grotesk',
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
 * Load font-face CSS for both Inter and Space Grotesk.
 */
export async function loadAllFontFaces(fontsDir?: string): Promise<string> {
  const [inter, spaceGrotesk] = await Promise.all([
    loadFontFaces('inter', fontsDir),
    loadFontFaces('space-grotesk', fontsDir),
  ]);
  return `${inter}\n\n${spaceGrotesk}`;
}
