import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { AppframeConfig } from './config/schema.js';

export function createMinimalConfig(overrides?: Partial<AppframeConfig>): AppframeConfig {
  return {
    mode: 'individual' as const,
    app: {
      name: 'Test App',
      description: 'A test application',
      platforms: ['ios'],
      features: [],
    },
    theme: {
      style: 'minimal',
      colors: {
        primary: '#2563EB',
        secondary: '#7C3AED',
        background: '#F8FAFC',
        text: '#0F172A',
      },
      font: 'inter',
      fontWeight: 600,
    },
    frames: {
      style: 'flat',
    },
    screens: [
      {
        screenshot: 'screen-1.png',
        headline: 'Welcome',
        layout: 'center',
        composition: 'single',
        autoSizeHeadline: false,
        autoSizeSubtitle: false,
        annotations: [],
      },
    ],
    output: {
      platforms: ['ios'],
      directory: './output',
    },
    ...overrides,
  };
}

export async function createTempDir(prefix = 'appframe-test-'): Promise<string> {
  return mkdtemp(join(tmpdir(), prefix));
}

export async function cleanupTempDir(dir: string): Promise<void> {
  await rm(dir, { recursive: true, force: true });
}

// Minimal valid 1x1 PNG (67 bytes)
const MINIMAL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

export function mockScreenshotBuffer(): Buffer {
  return Buffer.from(MINIMAL_PNG);
}

export function mockScreenshotDataUrl(): string {
  return `data:image/png;base64,${MINIMAL_PNG.toString('base64')}`;
}
