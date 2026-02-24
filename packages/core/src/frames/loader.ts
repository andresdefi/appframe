import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { FrameManifest, FrameDefinition } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getDefaultManifestPath(): string {
  // Resolve from the package root: packages/core/src/frames/ → ../../../../frames/
  return join(__dirname, '..', '..', '..', '..', 'frames', 'manifest.json');
}

let cachedManifest: FrameManifest | null = null;
let cachedManifestPath: string | null = null;

export async function loadFrameManifest(manifestPath?: string): Promise<FrameManifest> {
  const resolvedPath = manifestPath ?? getDefaultManifestPath();

  if (cachedManifest && cachedManifestPath === resolvedPath) {
    return cachedManifest;
  }

  const content = await readFile(resolvedPath, 'utf-8');
  const manifest = JSON.parse(content) as FrameManifest;

  // Resolve frame paths relative to manifest directory
  const manifestDir = dirname(resolvedPath);
  for (const frame of manifest.frames) {
    frame.framePath = join(manifestDir, frame.framePath);
  }

  cachedManifest = manifest;
  cachedManifestPath = resolvedPath;
  return manifest;
}

export async function getFrame(
  frameId: string,
  manifestPath?: string,
): Promise<FrameDefinition | undefined> {
  const manifest = await loadFrameManifest(manifestPath);
  return manifest.frames.find((f) => f.id === frameId);
}

export async function listFrames(
  manifestPath?: string,
): Promise<FrameDefinition[]> {
  const manifest = await loadFrameManifest(manifestPath);
  return manifest.frames;
}

export async function getDefaultFrame(
  platform: 'ios' | 'android',
  type: 'phone' | 'tablet' = 'phone',
  manifestPath?: string,
): Promise<FrameDefinition | undefined> {
  const manifest = await loadFrameManifest(manifestPath);

  const tagToFind = type === 'tablet'
    ? platform === 'ios' ? 'default-ipad' : 'fallback-tablet'
    : platform === 'ios' ? 'default-ios' : 'default-android';

  const byTag = manifest.frames.find((f) => f.tags.includes(tagToFind));
  if (byTag) return byTag;

  // Fallback: find any frame for the platform
  const fallbackTag = type === 'tablet' ? 'fallback-tablet' : 'fallback-phone';
  return manifest.frames.find((f) => f.tags.includes(fallbackTag));
}

export async function loadFrameSvg(frame: FrameDefinition): Promise<string> {
  return readFile(frame.framePath, 'utf-8');
}
