import { deflateSync } from 'node:zlib';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { generateScreenshots, type AppframeConfig } from '@appframe/core';
import { buildVariantSetPlanFromAnalysis, type ScreenshotAnalysis } from './design-planning.js';
import { readSession, writeSession, type VariantSessionFile } from './variant-session-lib.js';

const webPreviewMocks = vi.hoisted(() => ({
  registerSessionReviewRebuildHandler: vi.fn(),
  registerSessionReviewRefreshHandler: vi.fn(),
  startPreviewServer: vi.fn().mockResolvedValue(undefined),
}));

const probeState = vi.hoisted(() => ({
  nextProbeError: null as NodeJS.ErrnoException | null,
}));

vi.mock('@appframe/web-preview', () => ({
  registerSessionReviewRebuildHandler: webPreviewMocks.registerSessionReviewRebuildHandler,
  registerSessionReviewRefreshHandler: webPreviewMocks.registerSessionReviewRefreshHandler,
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

import {
  openPreviewSession,
  refreshAutopilotSessionFromReview,
  registerPreviewSessionReviewHandlers,
  rebuildAutopilotSessionFromReview,
  scoreVariantPreviews,
} from './variant-session-tools.js';

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

describe('preview review handler registration', () => {
  it('registers the reviewed rebuild hook explicitly', () => {
    registerPreviewSessionReviewHandlers();

    expect(webPreviewMocks.registerSessionReviewRebuildHandler).toHaveBeenCalledTimes(1);
    expect(webPreviewMocks.registerSessionReviewRebuildHandler).toHaveBeenCalledWith(
      rebuildAutopilotSessionFromReview,
    );
    expect(webPreviewMocks.registerSessionReviewRefreshHandler).toHaveBeenCalledTimes(1);
    expect(webPreviewMocks.registerSessionReviewRefreshHandler).toHaveBeenCalledWith(
      refreshAutopilotSessionFromReview,
    );
  });
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

describe('rebuildAutopilotSessionFromReview', () => {
  it('replans and rematerializes autopilot concepts from reviewed screenshot analysis', async () => {
    const dir = await makeTempDir();
    const sessionPath = join(dir, 'autopilot.session.json');
    const manifestPath = join(dir, 'manifest.json');

    await writeFile(
      manifestPath,
      JSON.stringify(
        {
          app: { name: 'FitFlow' },
          variants: [
            { id: 'concept-a', name: 'Workflow Hero', mode: 'individual', configPath: join(dir, 'stale-a.yml') },
            { id: 'concept-b', name: 'Focused Momentum', mode: 'individual', configPath: join(dir, 'stale-b.yml') },
          ],
        },
        null,
        2,
      ),
      'utf-8',
    );

    const reviewedAnalysis: ScreenshotAnalysis[] = [
      {
        path: '/shots/home.png',
        basename: 'home.png',
        format: 'png',
        width: 1290,
        height: 2796,
        aspectRatio: 0.461,
        role: 'home',
        semanticFlavor: 'document',
        semanticFlavorConfidence: 'high',
        density: 'balanced',
        textRisk: 'medium',
        heroPriority: 94,
        heroExplanation: ['Reviewed as a document-style overview'],
        inferredOrder: 1,
        orderingConfidence: 'high',
        orderingReason: ['Manual review'],
        focus: 'Daily overview',
        dominantPalette: ['#F8FAFC', '#2563EB', '#0F172A'],
        safeTextZones: [{ x: 0, y: 0, width: 100, height: 28, label: 'top' }],
        occupiedRegions: ['bottom'],
        cropSuitability: 'high',
        recommendedUsage: 'hero-device',
        unsafeForTextOverlay: false,
      },
      {
        path: '/shots/workflow.png',
        basename: 'workflow.png',
        format: 'png',
        width: 1290,
        height: 2796,
        aspectRatio: 0.461,
        role: 'workflow',
        density: 'balanced',
        textRisk: 'medium',
        heroPriority: 82,
        heroExplanation: ['Task flow'],
        inferredOrder: 2,
        orderingConfidence: 'medium',
        orderingReason: ['Follow-on workflow detail'],
        focus: 'Task flow',
        dominantPalette: ['#F8FAFC', '#16A34A', '#0F172A'],
        safeTextZones: [{ x: 0, y: 0, width: 100, height: 26, label: 'top' }],
        occupiedRegions: ['center'],
        cropSuitability: 'high',
        recommendedUsage: 'crop-card',
        unsafeForTextOverlay: false,
      },
      {
        path: '/shots/settings.png',
        basename: 'settings.png',
        format: 'png',
        width: 1290,
        height: 2796,
        aspectRatio: 0.461,
        role: 'settings',
        density: 'dense',
        textRisk: 'high',
        heroPriority: 36,
        heroExplanation: ['Dense control surface belongs later'],
        inferredOrder: 3,
        orderingConfidence: 'medium',
        orderingReason: ['Close on settings'],
        focus: 'Controls',
        dominantPalette: ['#E5E7EB', '#94A3B8', '#0F172A'],
        safeTextZones: [{ x: 0, y: 72, width: 100, height: 28, label: 'bottom' }],
        occupiedRegions: ['top', 'center'],
        cropSuitability: 'medium',
        recommendedUsage: 'support-only',
        unsafeForTextOverlay: true,
      },
    ];
    const conceptPlan = buildVariantSetPlanFromAnalysis({
      appName: 'FitFlow',
      appDescription: 'Workout planning',
      platforms: ['ios'],
      analysis: reviewedAnalysis,
      goals: ['Feel premium'],
      variantCount: 2,
      screenCount: 3,
      category: 'health',
    });
    const selectedCopySet = {
      hero: {
        id: 'hero-1',
        slot: 'hero' as const,
        headline: 'Stay on track',
        subtitle: 'Keep the plan moving',
        wordCount: 3,
        subtitleWordCount: 4,
        score: 92,
        rationale: [],
        issues: [],
      },
      differentiator: {
        id: 'diff-1',
        slot: 'differentiator' as const,
        headline: 'Plan with focus',
        subtitle: 'Show the differentiator clearly',
        wordCount: 3,
        subtitleWordCount: 4,
        score: 88,
        rationale: [],
        issues: [],
      },
      features: [{
        id: 'feature-1',
        slot: 'feature' as const,
        headline: 'Track every session',
        subtitle: 'Support the routine with proof',
        sourceFeature: 'Progress tracking',
        wordCount: 3,
        subtitleWordCount: 5,
        score: 86,
        rationale: [],
        issues: [],
      }],
      trust: {
        id: 'trust-1',
        slot: 'trust' as const,
        headline: 'Built for repeat use',
        subtitle: 'Keep the product feeling polished',
        wordCount: 4,
        subtitleWordCount: 5,
        score: 84,
        rationale: [],
        issues: [],
      },
      summary: {
        id: 'summary-1',
        slot: 'summary' as const,
        headline: 'Everything that matters',
        subtitle: 'Close on the full routine payoff',
        wordCount: 3,
        subtitleWordCount: 6,
        score: 85,
        rationale: [],
        issues: [],
      },
    };
    const config = makeConfig();
    const timestamp = new Date().toISOString();

    await writeSession(sessionPath, {
      version: 2,
      sourceConfigPath: join(dir, 'source.appframe.yml'),
      createdAt: timestamp,
      updatedAt: timestamp,
      activeVariantId: 'concept-a',
      variants: [
        {
          id: 'concept-a',
          name: 'Workflow Hero',
          description: 'Stale autopilot concept.',
          status: 'approved',
          config,
          artifacts: [],
          previewArtifacts: [{
            id: 'preview-a',
            createdAt: timestamp,
            outputDir: join(dir, 'preview-a'),
            mode: 'individual',
            platform: 'ios',
            filePaths: [join(dir, 'preview-a.png')],
            thumbnailPath: join(dir, 'preview-a.png'),
          }],
          copyAssignments: [],
          score: {
            total: 88,
            breakdown: { readability: 30 },
            flags: [],
            reason: 'Old recommendation',
          },
          history: [],
          provenance: { origin: 'autopilot', branchDepth: 0 },
        },
        {
          id: 'concept-b',
          name: 'Focused Momentum',
          description: 'Stale alternate concept.',
          status: 'draft',
          config,
          artifacts: [],
          previewArtifacts: [],
          copyAssignments: [],
          history: [],
          provenance: { origin: 'autopilot', branchDepth: 0 },
        },
      ],
      autopilot: {
        mode: 'autopilot',
        manifestPath,
        sourceScreenshots: reviewedAnalysis.map((entry) => entry.path),
        screenshotAnalysis: reviewedAnalysis,
        selectedCopySet,
        conceptPlan,
        recommendedVariantId: 'concept-a',
        recommendationReason: 'Old recommendation',
        refinementHistory: [],
      },
    });

    const result = await rebuildAutopilotSessionFromReview({ sessionPath });
    expect(result.updatedVariantIds).toEqual(['concept-a', 'concept-b']);
    expect(result.clearedPreviewVariantIds).toEqual(['concept-a', 'concept-b']);

    const rebuiltSession = await readSession(sessionPath);
    expect(rebuiltSession.autopilot?.recommendedVariantId).toBeNull();
    expect(rebuiltSession.autopilot?.conceptPlan?.selectedScreens.find((screen) => screen.path === '/shots/home.png')?.semanticFlavor).toBe('document');

    const rebuiltConceptA = rebuiltSession.variants.find((variant) => variant.id === 'concept-a');
    const rebuiltConceptB = rebuiltSession.variants.find((variant) => variant.id === 'concept-b');
    expect(rebuiltConceptA?.status).toBe('draft');
    expect(rebuiltConceptA?.previewArtifacts).toEqual([]);
    expect(rebuiltConceptA?.score).toBeUndefined();
    expect(rebuiltConceptA?.history?.[0]?.label).toBe('Rebuilt from reviewed screenshot families');
    expect((rebuiltConceptA?.copyAssignments?.length ?? 0)).toBeGreaterThan(0);

    if (rebuiltConceptB?.config.mode === 'individual') {
      expect(rebuiltConceptB.config.screens.some((screen) => screen.composition !== 'single')).toBe(true);
    }
  });

  it('applies persisted panoramic review controls during reviewed rebuilds', async () => {
    const dir = await makeTempDir();
    const sessionPath = join(dir, 'autopilot.session.json');
    const manifestPath = join(dir, 'manifest.json');
    const reviewedAnalysis: ScreenshotAnalysis[] = [
      {
        path: '/shots/home.png',
        basename: 'home.png',
        format: 'png',
        width: 1290,
        height: 2796,
        aspectRatio: 0.461,
        role: 'home',
        density: 'balanced',
        textRisk: 'medium',
        heroPriority: 94,
        heroExplanation: ['Overview'],
        inferredOrder: 1,
        orderingConfidence: 'high',
        orderingReason: ['First screen'],
        focus: 'Overview',
        dominantPalette: ['#F8FAFC', '#2563EB', '#0F172A'],
        safeTextZones: [{ x: 0, y: 0, width: 100, height: 28, label: 'top' }],
        occupiedRegions: ['bottom'],
        cropSuitability: 'high',
        recommendedUsage: 'hero-device',
        unsafeForTextOverlay: false,
      },
      {
        path: '/shots/workflow.png',
        basename: 'workflow.png',
        format: 'png',
        width: 1290,
        height: 2796,
        aspectRatio: 0.461,
        role: 'workflow',
        density: 'balanced',
        textRisk: 'medium',
        heroPriority: 82,
        heroExplanation: ['Task flow'],
        inferredOrder: 2,
        orderingConfidence: 'medium',
        orderingReason: ['Middle screen'],
        focus: 'Task flow',
        dominantPalette: ['#F8FAFC', '#16A34A', '#0F172A'],
        safeTextZones: [{ x: 0, y: 0, width: 100, height: 26, label: 'top' }],
        occupiedRegions: ['center'],
        cropSuitability: 'high',
        recommendedUsage: 'crop-card',
        unsafeForTextOverlay: false,
      },
      {
        path: '/shots/detail.png',
        basename: 'detail.png',
        format: 'png',
        width: 1290,
        height: 2796,
        aspectRatio: 0.461,
        role: 'detail',
        semanticFlavor: 'document',
        semanticFlavorConfidence: 'high',
        density: 'dense',
        textRisk: 'medium',
        heroPriority: 74,
        heroExplanation: ['Proof close'],
        inferredOrder: 3,
        orderingConfidence: 'medium',
        orderingReason: ['Last screen'],
        focus: 'Review state',
        dominantPalette: ['#E2E8F0', '#0F172A', '#16A34A'],
        safeTextZones: [{ x: 0, y: 0, width: 100, height: 18, label: 'top' }],
        occupiedRegions: ['center', 'bottom'],
        cropSuitability: 'high',
        recommendedUsage: 'support-only',
        unsafeForTextOverlay: true,
      },
    ];
    const conceptPlan = buildVariantSetPlanFromAnalysis({
      appName: 'FitFlow',
      appDescription: 'Workout planning',
      platforms: ['ios'],
      analysis: reviewedAnalysis,
      goals: ['Feel premium'],
      variantCount: 3,
      screenCount: 3,
      category: 'health',
    });
    const config = makeConfig();
    const timestamp = new Date().toISOString();

    await writeFile(
      manifestPath,
      JSON.stringify(
        {
          app: { name: 'FitFlow' },
          variants: [
            { id: 'concept-a', name: 'Calm Hero', mode: 'individual', configPath: join(dir, 'stale-a.yml') },
            { id: 'concept-b', name: 'Routine Momentum', mode: 'individual', configPath: join(dir, 'stale-b.yml') },
            { id: 'concept-c', name: 'Wellness Panorama', mode: 'panoramic', configPath: join(dir, 'stale-c.yml') },
          ],
        },
        null,
        2,
      ),
      'utf-8',
    );

    await writeSession(sessionPath, {
      version: 2,
      sourceConfigPath: join(dir, 'source.appframe.yml'),
      createdAt: timestamp,
      updatedAt: timestamp,
      activeVariantId: 'concept-c',
      variants: [
        {
          id: 'concept-a',
          name: 'Calm Hero',
          description: 'Autopilot concept.',
          status: 'draft',
          config,
          artifacts: [],
          previewArtifacts: [],
          copyAssignments: [],
          history: [],
          provenance: { origin: 'autopilot', branchDepth: 0 },
        },
        {
          id: 'concept-b',
          name: 'Routine Momentum',
          description: 'Autopilot concept.',
          status: 'draft',
          config,
          artifacts: [],
          previewArtifacts: [],
          copyAssignments: [],
          history: [],
          provenance: { origin: 'autopilot', branchDepth: 0 },
        },
        {
          id: 'concept-c',
          name: 'Wellness Panorama',
          description: 'Autopilot concept.',
          status: 'draft',
          config,
          artifacts: [],
          previewArtifacts: [],
          copyAssignments: [],
          history: [],
          provenance: { origin: 'autopilot', branchDepth: 0 },
        },
      ],
      autopilot: {
        mode: 'autopilot',
        manifestPath,
        sourceScreenshots: reviewedAnalysis.map((entry) => entry.path),
        screenshotAnalysis: reviewedAnalysis,
        conceptPlan,
        reviewControls: {
          'concept-c': {
            recipe: 'cinematic-panorama',
            continuityMotif: 'poster-anchor',
            supportSystem: 'curation-shelf',
            pacing: 'calmer',
            proofDensity: 'heavier',
            decorativeIntensity: 'quieter',
            beatOverrides: {
              open: {
                layoutArchetype: 'cinematic-opener',
              },
              resolve: {
                supportSystem: 'quote-stack',
              },
            },
          },
        },
        recommendedVariantId: 'concept-a',
        recommendationReason: 'Old recommendation',
        refinementHistory: [],
      },
    });

    const result = await rebuildAutopilotSessionFromReview({ sessionPath });
    const rebuiltConceptC = result.plan.variants.find((variant) => variant.id === 'concept-c');

    expect(rebuiltConceptC?.mode).toBe('panoramic');
    if (rebuiltConceptC?.mode === 'panoramic') {
      expect(rebuiltConceptC.recipe).toBe('cinematic-panorama');
      expect(rebuiltConceptC.style).toBe('branded');
      expect(rebuiltConceptC.frames?.every((frame) => frame.continuityMotif === 'poster-anchor')).toBe(true);
      expect(rebuiltConceptC.frames?.[0]?.supportSystem).toBe('curation-shelf');
      expect(rebuiltConceptC.frames?.[0]?.layoutArchetype).toBe('cinematic-opener');
      expect(rebuiltConceptC.frames?.[rebuiltConceptC.frames.length - 1]?.supportSystem).toBe('quote-stack');
      expect(rebuiltConceptC.frames?.every((frame) => !frame.compositionFeatures?.includes('decorative-cluster'))).toBe(true);
      expect(rebuiltConceptC.frames?.every((frame) => frame.pacing?.includes('calmer spacing'))).toBe(true);
    }
  });

  it('can branch reviewed autopilot concepts without overwriting the existing concepts', async () => {
    const dir = await makeTempDir();
    const sessionPath = join(dir, 'autopilot.session.json');
    const manifestPath = join(dir, 'manifest.json');
    const conceptPlan = buildVariantSetPlanFromAnalysis({
      appName: 'FitFlow',
      appDescription: 'Workout planning',
      platforms: ['ios'],
      analysis: [
        {
          path: '/shots/home.png',
          basename: 'home.png',
          format: 'png',
          width: 1290,
          height: 2796,
          aspectRatio: 0.461,
          role: 'home',
          semanticFlavor: 'document',
          semanticFlavorConfidence: 'high',
          density: 'balanced',
          textRisk: 'medium',
          heroPriority: 94,
          heroExplanation: ['Reviewed as a document-style overview'],
          inferredOrder: 1,
          orderingConfidence: 'high',
          orderingReason: ['Manual review'],
          focus: 'Daily overview',
          dominantPalette: ['#F8FAFC', '#2563EB', '#0F172A'],
          safeTextZones: [{ x: 0, y: 0, width: 100, height: 28, label: 'top' }],
          occupiedRegions: ['bottom'],
          cropSuitability: 'high',
          recommendedUsage: 'hero-device',
          unsafeForTextOverlay: false,
        },
        {
          path: '/shots/workflow.png',
          basename: 'workflow.png',
          format: 'png',
          width: 1290,
          height: 2796,
          aspectRatio: 0.461,
          role: 'workflow',
          density: 'balanced',
          textRisk: 'medium',
          heroPriority: 82,
          heroExplanation: ['Task flow'],
          inferredOrder: 2,
          orderingConfidence: 'medium',
          orderingReason: ['Follow-on workflow detail'],
          focus: 'Task flow',
          dominantPalette: ['#F8FAFC', '#16A34A', '#0F172A'],
          safeTextZones: [{ x: 0, y: 0, width: 100, height: 26, label: 'top' }],
          occupiedRegions: ['center'],
          cropSuitability: 'high',
          recommendedUsage: 'crop-card',
          unsafeForTextOverlay: false,
        },
      ],
      goals: ['Feel premium'],
      variantCount: 2,
      screenCount: 2,
      category: 'health',
    });
    const config = makeConfig();
    const timestamp = new Date().toISOString();

    await writeFile(
      manifestPath,
      JSON.stringify(
        {
          app: { name: 'FitFlow' },
          variants: [
            { id: 'concept-a', name: 'Workflow Hero', mode: 'individual', configPath: join(dir, 'stale-a.yml') },
            { id: 'concept-b', name: 'Focused Momentum', mode: 'individual', configPath: join(dir, 'stale-b.yml') },
          ],
        },
        null,
        2,
      ),
      'utf-8',
    );

    await writeSession(sessionPath, {
      version: 2,
      sourceConfigPath: join(dir, 'source.appframe.yml'),
      createdAt: timestamp,
      updatedAt: timestamp,
      activeVariantId: 'concept-a',
      variants: [
        {
          id: 'concept-a',
          name: 'Workflow Hero',
          description: 'Original autopilot concept.',
          status: 'approved',
          config,
          artifacts: [],
          previewArtifacts: [{
            id: 'preview-existing-a',
            createdAt: timestamp,
            outputDir: join(dir, 'preview-existing-a'),
            mode: 'individual',
            platform: 'ios',
            filePaths: ['/tmp/original-a.png'],
            thumbnailPath: '/tmp/original-a.png',
          }],
          copyAssignments: [],
          score: {
            total: 82,
            breakdown: { readability: 28 },
            flags: [],
            reason: 'Original score',
          },
          history: [],
          provenance: { origin: 'autopilot', branchDepth: 0 },
        },
        {
          id: 'concept-b',
          name: 'Focused Momentum',
          description: 'Original alternate concept.',
          status: 'draft',
          config,
          artifacts: [],
          previewArtifacts: [{
            id: 'preview-existing-b',
            createdAt: timestamp,
            outputDir: join(dir, 'preview-existing-b'),
            mode: 'individual',
            platform: 'ios',
            filePaths: ['/tmp/original-b.png'],
            thumbnailPath: '/tmp/original-b.png',
          }],
          copyAssignments: [],
          score: {
            total: 77,
            breakdown: { readability: 24 },
            flags: [],
            reason: 'Original alternate score',
          },
          history: [],
          provenance: { origin: 'autopilot', branchDepth: 0 },
        },
      ],
      autopilot: {
        mode: 'autopilot',
        manifestPath,
        sourceScreenshots: conceptPlan.selectedScreens.map((entry) => entry.path),
        screenshotAnalysis: conceptPlan.selectedScreens.map((entry) => ({
          path: entry.path,
          basename: entry.path.split('/').pop() ?? entry.path,
          format: 'png',
          width: 1290,
          height: 2796,
          aspectRatio: 0.461,
          role: entry.role,
          semanticFlavor: entry.semanticFlavor,
          semanticFlavorConfidence: entry.semanticFlavorConfidence,
          density: 'balanced',
          textRisk: 'medium',
          heroPriority: entry.heroPriority,
          heroExplanation: ['Reviewed branch source'],
          inferredOrder: entry.inferredOrder,
          orderingConfidence: 'medium',
          orderingReason: ['Reviewed branch'],
          focus: entry.focus,
          dominantPalette: ['#F8FAFC', '#2563EB', '#0F172A'],
          safeTextZones: [{ x: 0, y: 0, width: 100, height: 28, label: 'top' }],
          occupiedRegions: entry.textOccupiedRegions ?? [],
          cropSuitability: 'high',
          recommendedUsage: 'hero-device',
          unsafeForTextOverlay: entry.unsafeForTextOverlay,
        })),
        selectedCopySet: {
          hero: {
            id: 'hero-1',
            slot: 'hero',
            headline: 'Stay on track',
            subtitle: 'Keep the plan moving',
            wordCount: 3,
            subtitleWordCount: 4,
            score: 92,
            rationale: [],
            issues: [],
          },
          differentiator: {
            id: 'diff-1',
            slot: 'differentiator',
            headline: 'Plan with focus',
            subtitle: 'Show the differentiator clearly',
            wordCount: 3,
            subtitleWordCount: 4,
            score: 88,
            rationale: [],
            issues: [],
          },
          features: [],
          trust: {
            id: 'trust-1',
            slot: 'trust',
            headline: 'Built for repeat use',
            subtitle: 'Keep the product feeling polished',
            wordCount: 4,
            subtitleWordCount: 5,
            score: 84,
            rationale: [],
            issues: [],
          },
          summary: {
            id: 'summary-1',
            slot: 'summary',
            headline: 'Everything that matters',
            subtitle: 'Close on the full routine payoff',
            wordCount: 3,
            subtitleWordCount: 6,
            score: 85,
            rationale: [],
            issues: [],
          },
        },
        conceptPlan,
        recommendedVariantId: 'concept-a',
        recommendationReason: 'Original recommendation',
        refinementHistory: [],
      },
    });

    const result = await rebuildAutopilotSessionFromReview({
      sessionPath,
      branchVariants: true,
    });

    expect(result.updatedVariantIds).toEqual(['concept-a-review-1', 'concept-b-review-1']);
    expect(result.clearedPreviewVariantIds).toEqual([]);

    const rebuiltSession = await readSession(sessionPath);
    const originalConceptA = rebuiltSession.variants.find((variant) => variant.id === 'concept-a');
    const branchConceptA = rebuiltSession.variants.find((variant) => variant.id === 'concept-a-review-1');
    const branchConceptB = rebuiltSession.variants.find((variant) => variant.id === 'concept-b-review-1');

    expect(rebuiltSession.activeVariantId).toBe('concept-a-review-1');
    expect(rebuiltSession.variants).toHaveLength(4);
    expect(rebuiltSession.autopilot?.recommendedVariantId).toBeNull();
    expect(rebuiltSession.autopilot?.recommendationReason).toContain('comparison branches');
    expect(originalConceptA?.previewArtifacts?.[0]?.thumbnailPath).toBe('/tmp/original-a.png');
    expect(originalConceptA?.score?.total).toBe(82);
    expect(branchConceptA?.name).toBe('Workflow Hero Reviewed');
    expect(branchConceptA?.previewArtifacts).toEqual([]);
    expect(branchConceptA?.score).toBeUndefined();
    expect(branchConceptA?.history?.[0]?.label).toBe('Branched from reviewed screenshot families');
    expect(branchConceptA?.provenance).toMatchObject({
      origin: 'refinement',
      parentVariantId: 'concept-a',
      parentVariantName: 'Workflow Hero',
      branchDepth: 1,
    });
    expect(branchConceptB?.name).toBe('Focused Momentum Reviewed');
  });
});

describe('refreshAutopilotSessionFromReview', () => {
  it('rebuilds reviewed concepts, rerenders previews, and rescoring completes in one pass', async () => {
    const dir = await makeTempDir();
    const sessionPath = join(dir, 'autopilot.session.json');
    const manifestPath = join(dir, 'manifest.json');
    const conceptAPreview = await makePngFile(dir, 'concept-a-preview', 200, 200, (x, y) => {
      if (y < 40) return [245, 247, 250, 255];
      if (x > 40 && x < 160 && y > 56 && y < 180) return [37, 99, 235, 255];
      return [248, 250, 252, 255];
    });
    const conceptBPreview = await makePngFile(dir, 'concept-b-preview', 200, 200, (x, y) => {
      if ((x + y) % 6 < 3) return [148, 163, 184, 255];
      return [30, 41, 59, 255];
    });

    await writeFile(
      manifestPath,
      JSON.stringify(
        {
          app: { name: 'FitFlow' },
          variants: [
            { id: 'concept-a', name: 'Workflow Hero', mode: 'individual', configPath: join(dir, 'stale-a.yml') },
            { id: 'concept-b', name: 'Focused Momentum', mode: 'individual', configPath: join(dir, 'stale-b.yml') },
          ],
        },
        null,
        2,
      ),
      'utf-8',
    );

    const reviewedAnalysis: ScreenshotAnalysis[] = [
      {
        path: '/shots/home.png',
        basename: 'home.png',
        format: 'png',
        width: 1290,
        height: 2796,
        aspectRatio: 0.461,
        role: 'home',
        semanticFlavor: 'document',
        semanticFlavorConfidence: 'high',
        density: 'balanced',
        textRisk: 'medium',
        heroPriority: 94,
        heroExplanation: ['Reviewed as a document-style overview'],
        inferredOrder: 1,
        orderingConfidence: 'high',
        orderingReason: ['Manual review'],
        focus: 'Daily overview',
        dominantPalette: ['#F8FAFC', '#2563EB', '#0F172A'],
        safeTextZones: [{ x: 0, y: 0, width: 100, height: 28, label: 'top' }],
        occupiedRegions: ['bottom'],
        cropSuitability: 'high',
        recommendedUsage: 'hero-device',
        unsafeForTextOverlay: false,
      },
      {
        path: '/shots/workflow.png',
        basename: 'workflow.png',
        format: 'png',
        width: 1290,
        height: 2796,
        aspectRatio: 0.461,
        role: 'workflow',
        density: 'balanced',
        textRisk: 'medium',
        heroPriority: 82,
        heroExplanation: ['Task flow'],
        inferredOrder: 2,
        orderingConfidence: 'medium',
        orderingReason: ['Follow-on workflow detail'],
        focus: 'Task flow',
        dominantPalette: ['#F8FAFC', '#16A34A', '#0F172A'],
        safeTextZones: [{ x: 0, y: 0, width: 100, height: 26, label: 'top' }],
        occupiedRegions: ['center'],
        cropSuitability: 'high',
        recommendedUsage: 'crop-card',
        unsafeForTextOverlay: false,
      },
      {
        path: '/shots/settings.png',
        basename: 'settings.png',
        format: 'png',
        width: 1290,
        height: 2796,
        aspectRatio: 0.461,
        role: 'settings',
        density: 'dense',
        textRisk: 'high',
        heroPriority: 36,
        heroExplanation: ['Dense control surface belongs later'],
        inferredOrder: 3,
        orderingConfidence: 'medium',
        orderingReason: ['Close on settings'],
        focus: 'Controls',
        dominantPalette: ['#E5E7EB', '#94A3B8', '#0F172A'],
        safeTextZones: [{ x: 0, y: 72, width: 100, height: 28, label: 'bottom' }],
        occupiedRegions: ['top', 'center'],
        cropSuitability: 'medium',
        recommendedUsage: 'support-only',
        unsafeForTextOverlay: true,
      },
    ];
    const conceptPlan = buildVariantSetPlanFromAnalysis({
      appName: 'FitFlow',
      appDescription: 'Workout planning',
      platforms: ['ios'],
      analysis: reviewedAnalysis,
      goals: ['Feel premium'],
      variantCount: 2,
      screenCount: 3,
      category: 'health',
    });
    const config = makeConfig();
    const timestamp = new Date().toISOString();

    await writeSession(sessionPath, {
      version: 2,
      sourceConfigPath: join(dir, 'source.appframe.yml'),
      createdAt: timestamp,
      updatedAt: timestamp,
      activeVariantId: 'concept-a',
      variants: [
        {
          id: 'concept-a',
          name: 'Workflow Hero',
          description: 'Stale autopilot concept.',
          status: 'approved',
          config,
          artifacts: [],
          previewArtifacts: [],
          copyAssignments: [],
          history: [],
          provenance: { origin: 'autopilot', branchDepth: 0 },
        },
        {
          id: 'concept-b',
          name: 'Focused Momentum',
          description: 'Stale alternate concept.',
          status: 'draft',
          config,
          artifacts: [],
          previewArtifacts: [],
          copyAssignments: [],
          history: [],
          provenance: { origin: 'autopilot', branchDepth: 0 },
        },
      ],
      autopilot: {
        mode: 'autopilot',
        manifestPath,
        sourceScreenshots: reviewedAnalysis.map((entry) => entry.path),
        screenshotAnalysis: reviewedAnalysis,
        selectedCopySet: {
          hero: {
            id: 'hero-1',
            slot: 'hero',
            headline: 'Stay on track',
            subtitle: 'Keep the plan moving',
            wordCount: 3,
            subtitleWordCount: 4,
            score: 92,
            rationale: [],
            issues: [],
          },
          differentiator: {
            id: 'diff-1',
            slot: 'differentiator',
            headline: 'Plan with focus',
            subtitle: 'Show the differentiator clearly',
            wordCount: 3,
            subtitleWordCount: 4,
            score: 88,
            rationale: [],
            issues: [],
          },
          features: [],
          trust: {
            id: 'trust-1',
            slot: 'trust',
            headline: 'Built for repeat use',
            subtitle: 'Keep the product feeling polished',
            wordCount: 4,
            subtitleWordCount: 5,
            score: 84,
            rationale: [],
            issues: [],
          },
          summary: {
            id: 'summary-1',
            slot: 'summary',
            headline: 'Everything that matters',
            subtitle: 'Close on the full routine payoff',
            wordCount: 3,
            subtitleWordCount: 6,
            score: 85,
            rationale: [],
            issues: [],
          },
        },
        conceptPlan,
        recommendedVariantId: null,
        recommendationReason: null,
        refinementHistory: [],
      },
    });

    const generateScreenshotsMock = vi.mocked(generateScreenshots);
    generateScreenshotsMock.mockResolvedValueOnce({
      screenshots: [{ outputPath: conceptAPreview }],
    } as Awaited<ReturnType<typeof generateScreenshotsMock>>);
    generateScreenshotsMock.mockResolvedValueOnce({
      screenshots: [{ outputPath: conceptBPreview }],
    } as Awaited<ReturnType<typeof generateScreenshotsMock>>);

    const result = await refreshAutopilotSessionFromReview({ sessionPath });

    expect(result.previewArtifacts.map((entry) => entry.variantId)).toEqual(['concept-a', 'concept-b']);
    expect(result.scores).toHaveLength(2);
    expect(result.recommendedVariantId).toBeTruthy();

    const refreshedSession = await readSession(sessionPath);
    expect(refreshedSession.variants.every((variant) => (variant.previewArtifacts?.length ?? 0) > 0)).toBe(true);
    expect(refreshedSession.variants.every((variant) => variant.score)).toBe(true);
    expect(refreshedSession.autopilot?.recommendedVariantId).toBe(result.recommendedVariantId);
    expect(refreshedSession.autopilot?.recommendationReason).toBe(result.recommendationReason);
  });

  it('can branch reviewed concepts and rerender only the new comparison branches', async () => {
    const dir = await makeTempDir();
    const sessionPath = join(dir, 'autopilot.session.json');
    const manifestPath = join(dir, 'manifest.json');
    const originalConceptAPreview = await makePngFile(dir, 'original-concept-a-preview', 200, 200, (x, y) => {
      if (y < 40) return [245, 247, 250, 255];
      if (x > 40 && x < 160 && y > 56 && y < 180) return [37, 99, 235, 255];
      return [248, 250, 252, 255];
    });
    const originalConceptBPreview = await makePngFile(dir, 'original-concept-b-preview', 200, 200, (x, y) => {
      if ((x + y) % 6 < 3) return [148, 163, 184, 255];
      return [30, 41, 59, 255];
    });
    const branchConceptAPreview = await makePngFile(dir, 'branch-concept-a-preview', 200, 200, (x, y) => {
      if (y < 48) return [245, 247, 250, 255];
      if (x > 44 && x < 156 && y > 60 && y < 180) return [59, 130, 246, 255];
      return [248, 250, 252, 255];
    });
    const branchConceptBPreview = await makePngFile(dir, 'branch-concept-b-preview', 200, 200, (x, y) => {
      if (y < 54) return [248, 250, 252, 255];
      if (x > 38 && x < 162 && y > 70 && y < 184) return [16, 185, 129, 255];
      return [226, 232, 240, 255];
    });
    const reviewedAnalysis: ScreenshotAnalysis[] = [
      {
        path: '/shots/home.png',
        basename: 'home.png',
        format: 'png',
        width: 1290,
        height: 2796,
        aspectRatio: 0.461,
        role: 'home',
        semanticFlavor: 'document',
        semanticFlavorConfidence: 'high',
        density: 'balanced',
        textRisk: 'medium',
        heroPriority: 94,
        heroExplanation: ['Reviewed as a document-style overview'],
        inferredOrder: 1,
        orderingConfidence: 'high',
        orderingReason: ['Manual review'],
        focus: 'Daily overview',
        dominantPalette: ['#F8FAFC', '#2563EB', '#0F172A'],
        safeTextZones: [{ x: 0, y: 0, width: 100, height: 28, label: 'top' }],
        occupiedRegions: ['bottom'],
        cropSuitability: 'high',
        recommendedUsage: 'hero-device',
        unsafeForTextOverlay: false,
      },
      {
        path: '/shots/workflow.png',
        basename: 'workflow.png',
        format: 'png',
        width: 1290,
        height: 2796,
        aspectRatio: 0.461,
        role: 'workflow',
        density: 'balanced',
        textRisk: 'medium',
        heroPriority: 82,
        heroExplanation: ['Task flow'],
        inferredOrder: 2,
        orderingConfidence: 'medium',
        orderingReason: ['Follow-on workflow detail'],
        focus: 'Task flow',
        dominantPalette: ['#F8FAFC', '#16A34A', '#0F172A'],
        safeTextZones: [{ x: 0, y: 0, width: 100, height: 26, label: 'top' }],
        occupiedRegions: ['center'],
        cropSuitability: 'high',
        recommendedUsage: 'crop-card',
        unsafeForTextOverlay: false,
      },
      {
        path: '/shots/settings.png',
        basename: 'settings.png',
        format: 'png',
        width: 1290,
        height: 2796,
        aspectRatio: 0.461,
        role: 'settings',
        density: 'dense',
        textRisk: 'high',
        heroPriority: 36,
        heroExplanation: ['Dense control surface belongs later'],
        inferredOrder: 3,
        orderingConfidence: 'medium',
        orderingReason: ['Close on settings'],
        focus: 'Controls',
        dominantPalette: ['#E5E7EB', '#94A3B8', '#0F172A'],
        safeTextZones: [{ x: 0, y: 72, width: 100, height: 28, label: 'bottom' }],
        occupiedRegions: ['top', 'center'],
        cropSuitability: 'medium',
        recommendedUsage: 'support-only',
        unsafeForTextOverlay: true,
      },
    ];
    const conceptPlan = buildVariantSetPlanFromAnalysis({
      appName: 'FitFlow',
      appDescription: 'Workout planning',
      platforms: ['ios'],
      analysis: reviewedAnalysis,
      goals: ['Feel premium'],
      variantCount: 2,
      screenCount: 3,
      category: 'health',
    });
    const config = makeConfig();
    const timestamp = new Date().toISOString();

    await writeFile(
      manifestPath,
      JSON.stringify(
        {
          app: { name: 'FitFlow' },
          variants: [
            { id: 'concept-a', name: 'Workflow Hero', mode: 'individual', configPath: join(dir, 'stale-a.yml') },
            { id: 'concept-b', name: 'Focused Momentum', mode: 'individual', configPath: join(dir, 'stale-b.yml') },
          ],
        },
        null,
        2,
      ),
      'utf-8',
    );

    await writeSession(sessionPath, {
      version: 2,
      sourceConfigPath: join(dir, 'source.appframe.yml'),
      createdAt: timestamp,
      updatedAt: timestamp,
      activeVariantId: 'concept-a',
      variants: [
        {
          id: 'concept-a',
          name: 'Workflow Hero',
          description: 'Stale autopilot concept.',
          status: 'approved',
          config,
          artifacts: [],
          previewArtifacts: [{
            id: 'preview-existing-a',
            createdAt: timestamp,
            outputDir: join(dir, 'preview-existing-a'),
            mode: 'individual',
            platform: 'ios',
            filePaths: [originalConceptAPreview],
            thumbnailPath: originalConceptAPreview,
          }],
          copyAssignments: [],
          history: [],
          provenance: { origin: 'autopilot', branchDepth: 0 },
        },
        {
          id: 'concept-b',
          name: 'Focused Momentum',
          description: 'Stale alternate concept.',
          status: 'draft',
          config,
          artifacts: [],
          previewArtifacts: [{
            id: 'preview-existing-b',
            createdAt: timestamp,
            outputDir: join(dir, 'preview-existing-b'),
            mode: 'individual',
            platform: 'ios',
            filePaths: [originalConceptBPreview],
            thumbnailPath: originalConceptBPreview,
          }],
          copyAssignments: [],
          history: [],
          provenance: { origin: 'autopilot', branchDepth: 0 },
        },
      ],
      autopilot: {
        mode: 'autopilot',
        manifestPath,
        sourceScreenshots: reviewedAnalysis.map((entry) => entry.path),
        screenshotAnalysis: reviewedAnalysis,
        selectedCopySet: {
          hero: {
            id: 'hero-1',
            slot: 'hero',
            headline: 'Stay on track',
            subtitle: 'Keep the plan moving',
            wordCount: 3,
            subtitleWordCount: 4,
            score: 92,
            rationale: [],
            issues: [],
          },
          differentiator: {
            id: 'diff-1',
            slot: 'differentiator',
            headline: 'Plan with focus',
            subtitle: 'Show the differentiator clearly',
            wordCount: 3,
            subtitleWordCount: 4,
            score: 88,
            rationale: [],
            issues: [],
          },
          features: [],
          trust: {
            id: 'trust-1',
            slot: 'trust',
            headline: 'Built for repeat use',
            subtitle: 'Keep the product feeling polished',
            wordCount: 4,
            subtitleWordCount: 5,
            score: 84,
            rationale: [],
            issues: [],
          },
          summary: {
            id: 'summary-1',
            slot: 'summary',
            headline: 'Everything that matters',
            subtitle: 'Close on the full routine payoff',
            wordCount: 3,
            subtitleWordCount: 6,
            score: 85,
            rationale: [],
            issues: [],
          },
        },
        conceptPlan,
        recommendedVariantId: 'concept-a',
        recommendationReason: 'Original recommendation',
        refinementHistory: [],
      },
    });

    const generateScreenshotsMock = vi.mocked(generateScreenshots);
    generateScreenshotsMock.mockResolvedValueOnce({
      screenshots: [{ outputPath: branchConceptAPreview }],
    } as Awaited<ReturnType<typeof generateScreenshotsMock>>);
    generateScreenshotsMock.mockResolvedValueOnce({
      screenshots: [{ outputPath: branchConceptBPreview }],
    } as Awaited<ReturnType<typeof generateScreenshotsMock>>);

    const result = await refreshAutopilotSessionFromReview({
      sessionPath,
      branchVariants: true,
    });

    expect(generateScreenshotsMock).toHaveBeenCalledTimes(2);
    expect(result.updatedVariantIds).toEqual(['concept-a-review-1', 'concept-b-review-1']);
    expect(result.previewArtifacts.map((entry) => entry.variantId)).toEqual(['concept-a-review-1', 'concept-b-review-1']);
    expect(result.scores).toHaveLength(4);

    const refreshedSession = await readSession(sessionPath);
    expect(refreshedSession.variants).toHaveLength(4);
    expect(refreshedSession.variants.find((variant) => variant.id === 'concept-a')?.previewArtifacts?.[0]?.thumbnailPath)
      .toBe(originalConceptAPreview);
    expect(refreshedSession.variants.find((variant) => variant.id === 'concept-a-review-1')?.previewArtifacts?.[0]?.thumbnailPath)
      .toBe(branchConceptAPreview);
    expect(refreshedSession.autopilot?.recommendedVariantId).toBe(result.recommendedVariantId);
    expect(refreshedSession.autopilot?.recommendationReason).toBe(result.recommendationReason);
  });
});
