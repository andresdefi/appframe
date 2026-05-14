import { access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOME = process.env.HOME ?? '';
const __dirname = dirname(fileURLToPath(import.meta.url));

function getBundledFramesDir(): string {
  return join(__dirname, '..', '..', '..', '..', 'frames');
}

/**
 * Probe common install locations for the Koubou Python package's bundled frames/
 * directory. The Koubou renderer itself is no longer wired up, but several catalog
 * entries (iPads, Macs, Watch) still reference frame PNGs that live inside that
 * site-packages tree. Returns the first existing directory, or null.
 */
export async function getKoubouFramesDir(): Promise<string | null> {
  const candidates = [
    `${HOME}/Library/Python/3.9/lib/python/site-packages/koubou/frames`,
    `${HOME}/Library/Python/3.10/lib/python/site-packages/koubou/frames`,
    `${HOME}/Library/Python/3.11/lib/python/site-packages/koubou/frames`,
    `${HOME}/Library/Python/3.12/lib/python/site-packages/koubou/frames`,
    `${HOME}/Library/Python/3.13/lib/python/site-packages/koubou/frames`,
    `${HOME}/.local/lib/python3.9/site-packages/koubou/frames`,
    `${HOME}/.local/lib/python3.10/site-packages/koubou/frames`,
    `${HOME}/.local/lib/python3.11/site-packages/koubou/frames`,
    `${HOME}/.local/lib/python3.12/site-packages/koubou/frames`,
    `${HOME}/.local/lib/python3.13/site-packages/koubou/frames`,
  ];

  for (const dir of candidates) {
    try {
      await access(dir);
      return dir;
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * Resolves a device identifier to its PNG file path.
 * Identifiers prefixed with "local:" resolve to bundled PNGs in the frames/
 * directory (e.g., "local:apple/iphone-17-pro/frame" →
 * frames/apple/iphone-17-pro/frame.png). Other identifiers resolve via the
 * Koubou Python package's site-packages frames/ directory if present.
 */
export async function getDeviceFramePath(koubouId: string): Promise<string | null> {
  if (koubouId.startsWith('local:')) {
    const relativePath = koubouId.slice('local:'.length);
    const pngPath = join(getBundledFramesDir(), `${relativePath}.png`);
    try {
      await access(pngPath);
      return pngPath;
    } catch {
      return null;
    }
  }

  const framesDir = await getKoubouFramesDir();
  if (!framesDir) return null;

  const pngPath = join(framesDir, `${koubouId}.png`);
  try {
    await access(pngPath);
    return pngPath;
  } catch {
    return null;
  }
}
