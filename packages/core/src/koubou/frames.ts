import { access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { detectKoubou } from './detector.js';

const HOME = process.env.HOME ?? '';

/**
 * Derives the Koubou frames directory from the `kou` binary path.
 * Binary lives at ~/Library/Python/X.Y/bin/kou — frames are at
 * ~/Library/Python/X.Y/lib/python/site-packages/koubou/frames/
 */
export async function getKoubouFramesDir(): Promise<string | null> {
  const result = await detectKoubou();
  if (!result.available || !result.binaryPath) return null;

  const binDir = dirname(result.binaryPath);

  // Derive site-packages path from the binary's location
  // ~/Library/Python/X.Y/bin/kou → ~/Library/Python/X.Y/lib/python/site-packages/koubou/frames/
  const pythonRoot = dirname(binDir); // ~/Library/Python/X.Y
  const candidates = [
    // macOS pip install --user layout
    join(pythonRoot, 'lib', 'python', 'site-packages', 'koubou', 'frames'),
    // Linux/pipx layout: ~/.local/lib/pythonX.Y/site-packages/koubou/frames/
    join(dirname(binDir), '..', 'lib', 'python3.9', 'site-packages', 'koubou', 'frames'),
    join(dirname(binDir), '..', 'lib', 'python3.10', 'site-packages', 'koubou', 'frames'),
    join(dirname(binDir), '..', 'lib', 'python3.11', 'site-packages', 'koubou', 'frames'),
    join(dirname(binDir), '..', 'lib', 'python3.12', 'site-packages', 'koubou', 'frames'),
    join(dirname(binDir), '..', 'lib', 'python3.13', 'site-packages', 'koubou', 'frames'),
  ];

  // Also check common fallback paths
  const fallbacks = [
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

  for (const dir of [...candidates, ...fallbacks]) {
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
 * Resolves a Koubou device identifier (e.g., "MacBook Air 2022") to its PNG file path.
 * Returns null if the frames directory or file is not found.
 */
export async function getKoubouFramePath(koubouId: string): Promise<string | null> {
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
