import { deflateSync } from 'node:zlib';
import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { AppframeConfig } from '@appframe/core';
import { scoreVariantSet } from './preview-scoring.js';

const tempDirs: string[] = [];

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

async function makePngFile(
  prefix: string,
  width: number,
  height: number,
  pixelAt: (x: number, y: number) => [number, number, number, number],
): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'appframe-preview-score-'));
  tempDirs.push(dir);
  const filePath = join(dir, `${prefix}.png`);
  await writeFile(filePath, encodePng(width, height, pixelAt));
  return filePath;
}

function makeConfig(
  mode: 'individual' | 'panoramic',
  style: AppframeConfig['theme']['style'],
  options?: {
    headlines?: string[];
  },
): AppframeConfig {
  const headlines = options?.headlines ?? ['Stay on track', 'Weekly plans ready'];
  return {
    mode,
    app: {
      name: 'FitFlow',
      description: 'Workout planning',
      platforms: ['ios'],
      features: ['Workout plans'],
    },
    theme: {
      style,
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
    screens: mode === 'individual'
      ? [
          {
            screenshot: 'screen-1.png',
            headline: headlines[0] ?? 'Stay on track',
            layout: 'center',
            composition: 'single',
            autoSizeHeadline: true,
            autoSizeSubtitle: false,
            annotations: [],
          },
          {
            screenshot: 'screen-2.png',
            headline: headlines[1] ?? headlines[0] ?? 'Weekly plans ready',
            layout: 'center',
            composition: 'single',
            autoSizeHeadline: true,
            autoSizeSubtitle: false,
            annotations: [],
          },
        ]
      : [],
    ...(mode === 'panoramic'
      ? {
          frameCount: 4,
          panoramic: {
            background: { type: 'solid' as const, color: '#FFFFFF' },
            elements: [
              {
                type: 'text' as const,
                content: headlines[0] ?? 'Stay on track',
                x: 4,
                y: 4,
                fontSize: 4,
                color: '#0F172A',
                fontWeight: 700,
                fontStyle: 'normal' as const,
                textAlign: 'left' as const,
                lineHeight: 1.1,
                maxWidth: 16,
                letterSpacing: 0,
                textTransform: '',
                rotation: 0,
                z: 10,
              },
            ],
          },
        }
      : {}),
    output: {
      platforms: ['ios'],
      ios: { sizes: [6.7], format: 'png' },
      directory: './output',
    },
  };
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe('preview scoring', () => {
  it('prefers rendered previews with clearer text zones and stronger contrast', async () => {
    const strongPreview = await makePngFile('strong', 120, 180, (x, y) => {
      if (y < 44) return [245, 247, 250, 255];
      if (x > 34 && x < 86 && y > 55 && y < 162) return [22, 28, 45, 255];
      return [118, 77, 255, 255];
    });

    const weakPreview = await makePngFile('weak', 120, 180, (x, y) => {
      const base = 148 + ((x * 7 + y * 11) % 46);
      return [base, base - 6, base + 3, 255];
    });

    const result = scoreVariantSet([
      {
        id: 'concept-a',
        name: 'Clean Hero',
        config: makeConfig('individual', 'minimal'),
        previewCount: 1,
        previewFilePaths: [strongPreview],
      },
      {
        id: 'concept-b',
        name: 'Noisy Hero',
        config: makeConfig('individual', 'minimal'),
        previewCount: 1,
        previewFilePaths: [weakPreview],
      },
    ]);

    expect(result.recommendedVariantId).toBe('concept-a');
    const top = result.scored[0]!;
    const weak = result.scored[1]!;
    expect(top.score.breakdown.renderedTextZoneSafety ?? 0).toBeGreaterThan(weak.score.breakdown.renderedTextZoneSafety ?? 0);
    expect(top.score.breakdown.renderedContrast ?? 0).toBeGreaterThan(weak.score.breakdown.renderedContrast ?? 0);
    expect(weak.score.flags.some((flag) => flag.includes('Top headline space is busy'))).toBe(true);
  });

  it('penalizes panoramic previews with abrupt seams', async () => {
    const smoothPanorama = await makePngFile('smooth-panorama', 160, 80, (x, _y) => {
      const tone = 40 + Math.round((x / 159) * 140);
      return [tone, tone + 20, 255 - tone, 255];
    });

    const abruptPanorama = await makePngFile('abrupt-panorama', 160, 80, (x, _y) => {
      const section = Math.floor(x / 40);
      if (section % 2 === 0) return [248, 244, 236, 255];
      return [18, 24, 40, 255];
    });

    const result = scoreVariantSet([
      {
        id: 'concept-c',
        name: 'Smooth Panorama',
        config: makeConfig('panoramic', 'editorial'),
        previewCount: 1,
        previewFilePaths: [smoothPanorama],
      },
      {
        id: 'concept-d',
        name: 'Abrupt Panorama',
        config: makeConfig('panoramic', 'editorial'),
        previewCount: 1,
        previewFilePaths: [abruptPanorama],
      },
    ]);

    const smooth = result.scored.find((variant) => variant.id === 'concept-c')!;
    const abrupt = result.scored.find((variant) => variant.id === 'concept-d')!;

    expect(smooth.score.breakdown.renderedContinuityQuality ?? 0).toBeGreaterThan(
      abrupt.score.breakdown.renderedContinuityQuality ?? 0,
    );
    expect(abrupt.score.flags.some((flag) => flag.includes('Panoramic seams'))).toBe(true);
  });

  it('still scores variants when preview artifacts are missing', () => {
    const result = scoreVariantSet([
      { id: 'concept-a', name: 'Clean Hero', config: makeConfig('individual', 'minimal'), previewCount: 0 },
      { id: 'concept-c', name: 'Editorial Panorama', config: makeConfig('panoramic', 'editorial'), previewCount: 0 },
    ]);

    expect(result.scored).toHaveLength(2);
    expect(result.recommendedVariantId).toBeTruthy();
    expect(result.scored[0]?.score.total).toBeGreaterThan(0);
    expect(result.scored.some((variant) => variant.score.flags.some((flag) => flag.includes('Preview artifacts')))).toBe(true);
  });

  it('scores diversity against the full concept set instead of only duplicate styles', async () => {
    const quietPreview = await makePngFile('quiet', 120, 180, (x, y) => {
      if (y < 52) return [246, 247, 250, 255];
      if (x > 38 && x < 82 && y > 62 && y < 165) return [24, 28, 42, 255];
      return [88, 117, 255, 255];
    });
    const twinPreview = await makePngFile('twin', 120, 180, (x, y) => {
      if (y < 52) return [242, 244, 248, 255];
      if (x > 36 && x < 84 && y > 60 && y < 164) return [30, 34, 52, 255];
      return [95, 126, 255, 255];
    });
    const panoramicPreview = await makePngFile('panoramic', 160, 80, (x, _y) => {
      const tone = 30 + Math.round((x / 159) * 170);
      return [tone, 225 - tone, 248, 255];
    });

    const result = scoreVariantSet([
      {
        id: 'concept-a',
        name: 'Clean Hero',
        config: makeConfig('individual', 'minimal'),
        previewCount: 1,
        previewFilePaths: [quietPreview],
      },
      {
        id: 'concept-b',
        name: 'Clean Hero Alt',
        config: makeConfig('individual', 'minimal'),
        previewCount: 1,
        previewFilePaths: [twinPreview],
      },
      {
        id: 'concept-c',
        name: 'Editorial Panorama',
        config: makeConfig('panoramic', 'editorial'),
        previewCount: 1,
        previewFilePaths: [panoramicPreview],
      },
    ]);

    const cleanHero = result.scored.find((variant) => variant.id === 'concept-a')!;
    const panorama = result.scored.find((variant) => variant.id === 'concept-c')!;

    expect(cleanHero.score.breakdown.conceptDiversity ?? 0).toBeLessThan(panorama.score.breakdown.conceptDiversity ?? 0);
    expect(cleanHero.score.flags.some((flag) => flag.includes('Concept diversity is weak'))).toBe(true);
    expect(cleanHero.score.reason).toContain('Clean Hero Alt');
  });

  it('writes concrete copy and layout issues into score explanations', async () => {
    const busyTopPreview = await makePngFile('busy-top', 120, 180, (x, y) => {
      if (y < 46) {
        const stripe = Math.floor(x / 6) % 2 === 0 ? 244 : 96;
        return [stripe, stripe, stripe, 255];
      }
      if (x > 36 && x < 84 && y > 58 && y < 162) return [20, 26, 40, 255];
      return [120, 72, 255, 255];
    });

    const result = scoreVariantSet([
      {
        id: 'concept-a',
        name: 'Verbose Hero',
        config: makeConfig('individual', 'minimal', {
          headlines: [
            'Track every workout milestone without losing momentum',
            'See every plan and streak in one place',
          ],
        }),
        previewCount: 1,
        previewFilePaths: [busyTopPreview],
      },
    ]);

    const verbose = result.scored[0]!;
    expect(verbose.score.reason).toContain('words');
    expect(verbose.score.flags.some((flag) => flag.includes('quiet blocks'))).toBe(true);
  });

  it('can blend optional visual-model ranking into the final recommendation', async () => {
    const strongPreview = await makePngFile('strong-model', 120, 180, (x, y) => {
      if (y < 44) return [245, 247, 250, 255];
      if (x > 34 && x < 86 && y > 55 && y < 162) return [22, 28, 45, 255];
      return [118, 77, 255, 255];
    });

    const weakPreview = await makePngFile('weak-model', 120, 180, (x, y) => {
      const base = 148 + ((x * 7 + y * 11) % 46);
      return [base, base - 6, base + 3, 255];
    });

    const result = scoreVariantSet(
      [
        {
          id: 'concept-a',
          name: 'Clean Hero',
          config: makeConfig('individual', 'minimal'),
          previewCount: 1,
          previewFilePaths: [strongPreview],
        },
        {
          id: 'concept-b',
          name: 'Noisy Hero',
          config: makeConfig('individual', 'minimal'),
          previewCount: 1,
          previewFilePaths: [weakPreview],
        },
      ],
      {
        visualRanking: [
          { variantId: 'concept-a', score: 42, confidence: 1, reason: 'too conventional' },
          { variantId: 'concept-b', score: 96, rank: 1, confidence: 1, reason: 'stronger visual novelty' },
        ],
      },
    );

    const noisy = result.scored.find((variant) => variant.id === 'concept-b')!;
    expect(result.recommendedVariantId).toBe('concept-b');
    expect(noisy.score.breakdown.modelVisualRanking ?? 0).toBeGreaterThan(90);
    expect(result.recommendationReason).toContain('visual-model ranking');
  });
});
