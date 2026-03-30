import { deflateSync } from 'node:zlib';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { AppframeConfig } from '@appframe/core';
import { readSession, writeSession, type VariantSessionFile } from './variant-session-lib.js';

const webPreviewMocks = vi.hoisted(() => ({
  startPreviewServer: vi.fn().mockResolvedValue(undefined),
}));

const probeState = vi.hoisted(() => ({
  nextProbeError: null as NodeJS.ErrnoException | null,
}));

vi.mock('@appframe/web-preview', () => ({
  startPreviewServer: webPreviewMocks.startPreviewServer,
}));

vi.mock('node:net', () => ({
  createServer: vi.fn(() => {
    const handlers: {
      error?: (error: NodeJS.ErrnoException) => void;
      listening?: () => void;
    } = {};

    return {
      once(event: 'error' | 'listening', handler: ((error: NodeJS.ErrnoException) => void) | (() => void)) {
        if (event === 'error') handlers.error = handler as (error: NodeJS.ErrnoException) => void;
        if (event === 'listening') handlers.listening = handler as () => void;
        return this;
      },
      listen() {
        queueMicrotask(() => {
          if (probeState.nextProbeError) handlers.error?.(probeState.nextProbeError);
          else handlers.listening?.();
        });
      },
      close(callback?: () => void) {
        callback?.();
      },
    };
  }),
}));

vi.mock('@appframe/core', () => ({
  generatePanoramicScreenshots: vi.fn(),
  generateScreenshots: vi.fn(),
  loadConfig: vi.fn(),
  validateConfig: vi.fn((config: AppframeConfig) => ({ success: true, config })),
}));

import { openPreviewSession, scoreVariantPreviews } from './variant-session-tools.js';

const tempDirs: string[] = [];
const originalOpenAiApiKey = process.env.OPENAI_API_KEY;
const originalVisualScoringModel = process.env.APPFRAME_VISUAL_SCORING_MODEL;

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc ^= buffer[i] ?? 0;
    for (let bit = 0; bit < 8; bit += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function encodePng(width: number, height: number, pixelAt: (x: number, y: number) => [number, number, number, number]): Buffer {
  const rows: Buffer[] = [];
  for (let y = 0; y < height; y += 1) {
    const row = Buffer.alloc(1 + (width * 4));
    row[0] = 0;
    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a] = pixelAt(x, y);
      const offset = 1 + (x * 4);
      row[offset] = r;
      row[offset + 1] = g;
      row[offset + 2] = b;
      row[offset + 3] = a;
    }
    rows.push(row);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(Buffer.concat(rows))),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

async function makeTempDir(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'appframe-variant-session-tools-'));
  tempDirs.push(dir);
  return dir;
}

async function makePngFile(
  dir: string,
  name: string,
  width: number,
  height: number,
  pixelAt: (x: number, y: number) => [number, number, number, number],
): Promise<string> {
  const filePath = join(dir, `${name}.png`);
  await writeFile(filePath, encodePng(width, height, pixelAt));
  return filePath;
}

function makeConfig(): AppframeConfig {
  return {
    mode: 'individual',
    app: {
      name: 'FitFlow',
      description: 'Workout planning',
      platforms: ['ios'],
      features: ['Workout plans'],
    },
    theme: {
      style: 'minimal',
      colors: {
        primary: '#2563EB',
        secondary: '#7C3AED',
        background: '#F8FAFC',
        text: '#0F172A',
        subtitle: '#64748B',
      },
      font: 'inter',
      fontWeight: 600,
    },
    frames: { ios: 'iphone-17-pro', style: 'flat' },
    screens: [
      {
        screenshot: 'screen-1.png',
        headline: 'Stay on track',
        layout: 'center',
        composition: 'single',
        autoSizeHeadline: true,
        autoSizeSubtitle: false,
        annotations: [],
      },
      {
        screenshot: 'screen-2.png',
        headline: 'Weekly plans ready',
        layout: 'center',
        composition: 'single',
        autoSizeHeadline: true,
        autoSizeSubtitle: false,
        annotations: [],
      },
    ],
    output: {
      platforms: ['ios'],
      ios: { sizes: [6.7], format: 'png' },
      directory: './output',
    },
  };
}

async function writeSessionFixture(args: {
  sessionPath: string;
  strongPreview: string;
  weakPreview: string;
}): Promise<void> {
  const timestamp = new Date().toISOString();
  const config = makeConfig();
  const session: VariantSessionFile = {
    version: 2,
    sourceConfigPath: join(tmpdir(), 'base.appframe.yml'),
    createdAt: timestamp,
    updatedAt: timestamp,
    activeVariantId: 'concept-a',
    variants: [
      {
        id: 'concept-a',
        name: 'Clean Hero',
        description: 'Clear default concept.',
        status: 'draft',
        config,
        artifacts: [],
        previewArtifacts: [{
          id: 'preview-a',
          createdAt: timestamp,
          outputDir: join(tmpdir(), 'preview-a'),
          mode: 'individual',
          platform: 'ios',
          filePaths: [args.strongPreview],
          thumbnailPath: args.strongPreview,
        }],
        copyAssignments: [],
        history: [],
        provenance: { origin: 'autopilot', branchDepth: 0 },
      },
      {
        id: 'concept-b',
        name: 'Noisy Hero',
        description: 'Alternative concept.',
        status: 'draft',
        config,
        artifacts: [],
        previewArtifacts: [{
          id: 'preview-b',
          createdAt: timestamp,
          outputDir: join(tmpdir(), 'preview-b'),
          mode: 'individual',
          platform: 'ios',
          filePaths: [args.weakPreview],
          thumbnailPath: args.weakPreview,
        }],
        copyAssignments: [],
        history: [],
        provenance: { origin: 'autopilot', branchDepth: 0 },
      },
    ],
    autopilot: {
      mode: 'autopilot',
      sourceScreenshots: [],
      recommendedVariantId: null,
      recommendationReason: null,
      refinementHistory: [],
    },
  };

  await writeSession(args.sessionPath, session);
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (originalOpenAiApiKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalOpenAiApiKey;
  if (originalVisualScoringModel === undefined) delete process.env.APPFRAME_VISUAL_SCORING_MODEL;
  else process.env.APPFRAME_VISUAL_SCORING_MODEL = originalVisualScoringModel;
});

beforeEach(() => {
  vi.clearAllMocks();
  probeState.nextProbeError = null;
});

describe('openPreviewSession', () => {
  it('starts preview and returns the live localhost URL', async () => {
    const result = await openPreviewSession({
      sessionPath: '/tmp/focusflow.session.json',
      port: 4414,
    });

    expect(webPreviewMocks.startPreviewServer).toHaveBeenCalledWith({
      configPath: undefined,
      sessionPath: '/tmp/focusflow.session.json',
      port: 4414,
    });
    expect(result).toEqual({
      url: 'http://localhost:4414',
      port: 4414,
      sessionPath: '/tmp/focusflow.session.json',
      configPath: null,
    });
  });

  it('rejects port conflicts clearly', async () => {
    probeState.nextProbeError = Object.assign(new Error('address in use'), { code: 'EADDRINUSE' });

    await expect(openPreviewSession({
      sessionPath: '/tmp/focusflow.session.json',
      port: 4400,
    })).rejects.toThrow('Port 4400 is already in use.');

    expect(webPreviewMocks.startPreviewServer).not.toHaveBeenCalled();
  });

  it('requires a session or config path', async () => {
    await expect(openPreviewSession({ port: 4400 })).rejects.toThrow(
      'Preview launch requires either a sessionPath or a configPath.',
    );
  });
});

describe('variant session live visual scoring', () => {
  it('uses live AI visual ranking when credentials are present', async () => {
    const dir = await makeTempDir();
    const strongPreview = await makePngFile(dir, 'strong', 120, 180, (x, y) => {
      if (y < 44) return [245, 247, 250, 255];
      if (x > 34 && x < 86 && y > 55 && y < 162) return [22, 28, 45, 255];
      return [118, 77, 255, 255];
    });
    const weakPreview = await makePngFile(dir, 'weak', 120, 180, (x, y) => {
      const base = 148 + ((x * 7 + y * 11) % 46);
      return [base, base - 6, base + 3, 255];
    });
    const sessionPath = join(dir, 'autopilot.session.json');
    await writeSessionFixture({ sessionPath, strongPreview, weakPreview });

    process.env.OPENAI_API_KEY = 'test-key';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: JSON.stringify({
          rankings: [
            {
              variantId: 'concept-a',
              rank: 2,
              score: 46,
              confidence: 0.6,
              reason: 'clean but less differentiated',
            },
            {
              variantId: 'concept-b',
              rank: 1,
              score: 95,
              confidence: 0.96,
              reason: 'stronger visual hierarchy',
            },
          ],
        }),
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await scoreVariantPreviews({
      sessionPath,
      useAiVisualScoring: true,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.aiVisualScoring.status).toBe('used');
    expect(result.recommendedVariantId).toBe('concept-b');

    const session = await readSession(sessionPath);
    const recommended = session.variants.find((variant) => variant.id === 'concept-b');
    expect(recommended?.score?.modelRanking?.score).toBeGreaterThan(90);
    expect(session.autopilot?.recommendationReason).toContain('visual-model ranking');
  });

  it('falls back safely when AI credentials are missing', async () => {
    const dir = await makeTempDir();
    const strongPreview = await makePngFile(dir, 'strong-no-key', 120, 180, (x, y) => {
      if (y < 44) return [245, 247, 250, 255];
      if (x > 34 && x < 86 && y > 55 && y < 162) return [22, 28, 45, 255];
      return [118, 77, 255, 255];
    });
    const weakPreview = await makePngFile(dir, 'weak-no-key', 120, 180, (x, y) => {
      const base = 148 + ((x * 7 + y * 11) % 46);
      return [base, base - 6, base + 3, 255];
    });
    const sessionPath = join(dir, 'autopilot.session.json');
    await writeSessionFixture({ sessionPath, strongPreview, weakPreview });

    delete process.env.OPENAI_API_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await scoreVariantPreviews({
      sessionPath,
      useAiVisualScoring: true,
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.aiVisualScoring.status).toBe('skipped');
    expect(result.aiVisualScoring.reason).toContain('OPENAI_API_KEY');
    expect(result.recommendedVariantId).toBe('concept-a');
  });

  it('falls back safely when the live scoring request fails', async () => {
    const dir = await makeTempDir();
    const strongPreview = await makePngFile(dir, 'strong-fail', 120, 180, (x, y) => {
      if (y < 44) return [245, 247, 250, 255];
      if (x > 34 && x < 86 && y > 55 && y < 162) return [22, 28, 45, 255];
      return [118, 77, 255, 255];
    });
    const weakPreview = await makePngFile(dir, 'weak-fail', 120, 180, (x, y) => {
      const base = 148 + ((x * 7 + y * 11) % 46);
      return [base, base - 6, base + 3, 255];
    });
    const sessionPath = join(dir, 'autopilot.session.json');
    await writeSessionFixture({ sessionPath, strongPreview, weakPreview });

    process.env.OPENAI_API_KEY = 'test-key';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      text: async () => 'temporary upstream issue',
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await scoreVariantPreviews({
      sessionPath,
      useAiVisualScoring: true,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.aiVisualScoring.status).toBe('failed');
    expect(result.aiVisualScoring.reason).toContain('503');
    expect(result.recommendedVariantId).toBe('concept-a');
  });
});
