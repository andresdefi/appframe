import { execFile } from 'node:child_process';
import { access } from 'node:fs/promises';
import { promisify } from 'node:util';
import type { KoubouDetectionResult } from './types.js';

const execFileAsync = promisify(execFile);

const HOME = process.env.HOME ?? '';

const KNOWN_PATHS = [
  // pip install --user on macOS (various Python versions)
  `${HOME}/Library/Python/3.9/bin/kou`,
  `${HOME}/Library/Python/3.10/bin/kou`,
  `${HOME}/Library/Python/3.11/bin/kou`,
  `${HOME}/Library/Python/3.12/bin/kou`,
  `${HOME}/Library/Python/3.13/bin/kou`,
  // pipx / pip install --user on Linux
  `${HOME}/.local/bin/kou`,
  // Homebrew
  '/opt/homebrew/bin/kou',
  '/usr/local/bin/kou',
];

async function findBinary(): Promise<string | null> {
  // Try PATH first
  try {
    const { stdout } = await execFileAsync('which', ['kou']);
    const path = stdout.trim();
    if (path) return path;
  } catch {
    // Not on PATH
  }

  // Try known locations
  for (const path of KNOWN_PATHS) {
    try {
      await access(path);
      return path;
    } catch {
      continue;
    }
  }

  return null;
}

async function getVersion(binaryPath: string): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync(binaryPath, ['--version']);
    const match = stdout.match(/v?(\d+\.\d+\.\d+)/);
    return match ? match[1]! : stdout.trim();
  } catch {
    return null;
  }
}

export async function detectKoubou(): Promise<KoubouDetectionResult> {
  const binaryPath = await findBinary();
  if (!binaryPath) {
    return { available: false, binaryPath: null, version: null };
  }

  const version = await getVersion(binaryPath);
  return { available: true, binaryPath, version };
}
