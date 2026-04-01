import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const designPlanningMocks = vi.hoisted(() => ({
  analyzeScreenshotSet: vi.fn(),
  buildCopyPlanningSignals: vi.fn(),
  buildVariantSetPlan: vi.fn(),
  inferCategory: vi.fn(),
}));

const copyPlanningMocks = vi.hoisted(() => ({
  generateCopyCandidates: vi.fn(),
  scoreHeadline: vi.fn(),
  selectCopySet: vi.fn(),
}));

const planMaterializerMocks = vi.hoisted(() => ({
  materializeVariantPlan: vi.fn(),
}));

const variantSessionLibMocks = vi.hoisted(() => ({
  createSessionFromManifest: vi.fn(),
  readSession: vi.fn(),
}));

const variantSessionToolMocks = vi.hoisted(() => ({
  renderVariantPreviews: vi.fn(),
  scoreVariantPreviews: vi.fn(),
}));

vi.mock('./design-planning.js', () => designPlanningMocks);
vi.mock('./copy-planning.js', () => copyPlanningMocks);
vi.mock('./plan-materializer.js', () => planMaterializerMocks);
vi.mock('./variant-session-lib.js', () => variantSessionLibMocks);
vi.mock('./variant-session-tools.js', () => variantSessionToolMocks);

import { runAutopilotPipeline } from './suggestion-tools.js';

const tempDirs: string[] = [];

async function makeScreenshotSet(dir: string): Promise<[string, string]> {
  const homePath = join(dir, 'home.png');
  const detailPath = join(dir, 'detail.png');
  await writeFile(homePath, 'home-v1', 'utf-8');
  await writeFile(detailPath, 'detail-v1', 'utf-8');
  return [homePath, detailPath];
}

function makeConfig(style: 'minimal' | 'bold') {
  return {
    mode: 'individual' as const,
    app: {
      name: 'FocusFlow',
      description: 'Plan your week without losing momentum.',
      platforms: ['ios' as const],
      features: ['Daily planning'],
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
    frames: { style: 'flat' as const },
    screens: [
      {
        screenshot: 'screen-1.png',
        headline: style === 'minimal' ? 'Own your day' : 'Move faster',
        layout: 'center' as const,
        composition: 'single' as const,
      },
    ],
    output: {
      platforms: ['ios' as const],
      ios: { sizes: [6.7], format: 'png' as const },
      directory: './output',
    },
  };
}

function clearMockCalls(): void {
  designPlanningMocks.analyzeScreenshotSet.mockClear();
  designPlanningMocks.buildCopyPlanningSignals.mockClear();
  designPlanningMocks.buildVariantSetPlan.mockClear();
  designPlanningMocks.inferCategory.mockClear();
  copyPlanningMocks.generateCopyCandidates.mockClear();
  copyPlanningMocks.scoreHeadline.mockClear();
  copyPlanningMocks.selectCopySet.mockClear();
  planMaterializerMocks.materializeVariantPlan.mockClear();
  variantSessionLibMocks.createSessionFromManifest.mockClear();
  variantSessionLibMocks.readSession.mockClear();
  variantSessionToolMocks.renderVariantPreviews.mockClear();
  variantSessionToolMocks.scoreVariantPreviews.mockClear();
}

beforeEach(() => {
  vi.clearAllMocks();

  designPlanningMocks.analyzeScreenshotSet.mockImplementation(async (screenshots: Array<{ path: string }>) => (
    screenshots.map((shot, index) => ({
      path: shot.path,
      role: index === 0 ? 'home' : 'detail',
      density: 'medium',
      textRisk: 'low',
      heroPriority: 96 - index,
      heroExplanation: ['Strong opening screen.'],
      safeTextZones: [{ x: 0, y: 0, width: 100, height: 20 }],
      cropSuitability: 'high',
      recommendedUsage: 'hero-device',
      inferredOrder: index + 1,
      orderingConfidence: 'high',
      focus: index === 0 ? 'home flow' : 'detail flow',
      unsafeForTextOverlay: false,
    }))
  ));
  designPlanningMocks.buildCopyPlanningSignals.mockReturnValue([
    {
      slot: 'hero',
      path: '/shots/home.png',
      role: 'home',
      density: 'balanced',
      focus: 'home flow',
      unsafeForTextOverlay: false,
      topQuietRatio: 0.76,
      focusStrength: 0.42,
    },
  ]);

  designPlanningMocks.inferCategory.mockReturnValue('productivity');
  designPlanningMocks.buildVariantSetPlan.mockResolvedValue({
    app: {
      name: 'FocusFlow',
      description: 'Plan your week without losing momentum.',
      category: 'productivity',
      platforms: ['ios'],
    },
    goals: ['Lead with clarity'],
    analysisSummary: {
      screenshotCount: 2,
      selectedCount: 2,
      roles: { home: 1, detail: 1 },
      topHeroCandidate: '/shots/home.png',
      topHeroExplanation: ['Strong opening screen.'],
    },
    selectedScreens: [
      {
        path: '/shots/home.png',
        role: 'home',
        heroPriority: 96,
        inferredOrder: 1,
        focus: 'home flow',
        unsafeForTextOverlay: false,
      },
      {
        path: '/shots/detail.png',
        role: 'detail',
        heroPriority: 88,
        inferredOrder: 2,
        focus: 'detail flow',
        unsafeForTextOverlay: false,
      },
    ],
    variants: [
      {
        id: 'concept-a',
        name: 'Clean Hero',
        currentCapabilityFit: 'supported_now',
        mode: 'individual',
        style: 'minimal',
        recipe: 'clean-hero',
        strategy: 'Lead with the clearest screen.',
        screens: [],
      },
      {
        id: 'concept-b',
        name: 'Dynamic Individual',
        currentCapabilityFit: 'supported_now',
        mode: 'individual',
        style: 'bold',
        recipe: 'layered-momentum',
        strategy: 'Increase contrast and pace.',
        screens: [],
      },
    ],
  });

  copyPlanningMocks.generateCopyCandidates.mockReturnValue({
    appName: 'FocusFlow',
    generatedAt: '2026-03-20T10:00:00.000Z',
    slots: [
      {
        slot: 'hero',
        candidates: [
          {
            id: 'hero-1',
            slot: 'hero',
            headline: 'Own your day',
            wordCount: 3,
            score: 94,
            rationale: [],
            issues: [],
          },
        ],
      },
    ],
  });

  copyPlanningMocks.selectCopySet.mockReturnValue({
    hero: {
      id: 'hero-1',
      slot: 'hero',
      headline: 'Own your day',
      wordCount: 3,
      score: 94,
      rationale: [],
      issues: [],
    },
    differentiator: {
      id: 'diff-1',
      slot: 'differentiator',
      headline: 'Plan with focus',
      wordCount: 3,
      score: 90,
      rationale: [],
      issues: [],
    },
    features: [],
    trust: {
      id: 'trust-1',
      slot: 'trust',
      headline: 'Built for repeat use',
      wordCount: 4,
      score: 85,
      rationale: [],
      issues: [],
    },
    summary: {
      id: 'summary-1',
      slot: 'summary',
      headline: 'Everything that matters',
      wordCount: 3,
      score: 86,
      rationale: [],
      issues: [],
    },
  });

  planMaterializerMocks.materializeVariantPlan.mockImplementation(async (args: {
    outputDir: string;
    manifestPath?: string;
  }) => {
    await mkdir(args.outputDir, { recursive: true });
    const conceptAPath = join(args.outputDir, 'concept-a.yml');
    const conceptBPath = join(args.outputDir, 'concept-b.yml');
    const manifestPath = args.manifestPath ?? join(args.outputDir, 'focusflow-variant-manifest.json');
    await writeFile(conceptAPath, 'concept-a: true\n', 'utf-8');
    await writeFile(conceptBPath, 'concept-b: true\n', 'utf-8');
    await writeFile(
      manifestPath,
      JSON.stringify(
        {
          app: { name: 'FocusFlow' },
          variants: [
            { id: 'concept-a', name: 'Clean Hero', mode: 'individual', configPath: conceptAPath },
            { id: 'concept-b', name: 'Dynamic Individual', mode: 'individual', configPath: conceptBPath },
          ],
        },
        null,
        2,
      ),
      'utf-8',
    );
    return {
      manifestPath,
      variants: [
        { id: 'concept-a', name: 'Clean Hero', mode: 'individual', configPath: conceptAPath },
        { id: 'concept-b', name: 'Dynamic Individual', mode: 'individual', configPath: conceptBPath },
      ],
    };
  });

  variantSessionLibMocks.createSessionFromManifest.mockImplementation(async (args: {
    manifestPath: string;
    sessionPath?: string;
    runManifestPath?: string;
    previewCommand?: string;
  }) => {
    const manifest = JSON.parse(await readFile(args.manifestPath, 'utf-8')) as {
      variants: Array<{ id: string; name: string; configPath: string }>;
    };
    const sessionPath = args.sessionPath ?? join(dirname(args.manifestPath), 'autopilot.session.json');
    const timestamp = '2026-03-20T10:00:00.000Z';
    const session = {
      version: 2 as const,
      sourceConfigPath: manifest.variants[0]?.configPath ?? args.manifestPath,
      createdAt: timestamp,
      updatedAt: timestamp,
      activeVariantId: manifest.variants[0]?.id ?? 'concept-a',
      variants: manifest.variants.map((variant, index) => ({
        id: variant.id,
        name: variant.name,
        description: variant.name,
        status: 'draft' as const,
        config: index === 0 ? makeConfig('minimal') : makeConfig('bold'),
        artifacts: [],
        previewArtifacts: [],
        copyAssignments: [],
        history: [],
        provenance: { origin: 'autopilot' as const, branchDepth: 0 },
      })),
      autopilot: {
        mode: 'autopilot' as const,
        manifestPath: args.manifestPath,
        runManifestPath: args.runManifestPath,
        previewCommand: args.previewCommand,
        sourceScreenshots: ['/shots/home.png', '/shots/detail.png'],
        refinementHistory: [],
      },
    };
    await mkdir(dirname(sessionPath), { recursive: true });
    await writeFile(sessionPath, JSON.stringify(session, null, 2), 'utf-8');
    return { sessionPath, session };
  });

  variantSessionLibMocks.readSession.mockImplementation(async (sessionPath: string) => (
    JSON.parse(await readFile(sessionPath, 'utf-8'))
  ));

  variantSessionToolMocks.renderVariantPreviews.mockImplementation(async (args: {
    sessionPath: string;
    outputDir?: string;
  }) => {
    const session = JSON.parse(await readFile(args.sessionPath, 'utf-8')) as {
      variants: Array<{ id: string; name: string }>;
    };
    const outputDir = args.outputDir ?? join(dirname(args.sessionPath), 'preview-artifacts');
    await mkdir(outputDir, { recursive: true });
    const previewArtifacts: Array<{
      variantId: string;
      filePaths: string[];
      thumbnailPath: string;
    }> = [];

    for (const variant of session.variants) {
      const variantDir = join(outputDir, variant.id);
      await mkdir(variantDir, { recursive: true });
      const filePath = join(variantDir, 'preview.png');
      await writeFile(filePath, `preview:${variant.id}`, 'utf-8');
      previewArtifacts.push({
        variantId: variant.id,
        filePaths: [filePath],
        thumbnailPath: filePath,
      });
    }

    const nextSession = {
      ...session,
      variants: session.variants.map((variant) => ({
        ...variant,
        previewArtifacts: previewArtifacts
          .filter((artifact) => artifact.variantId === variant.id)
          .map((artifact) => ({
            id: `preview-${variant.id}`,
            createdAt: '2026-03-20T10:00:00.000Z',
            outputDir: join(outputDir, variant.id),
            mode: 'individual',
            platform: 'ios',
            filePaths: artifact.filePaths,
            thumbnailPath: artifact.thumbnailPath,
          })),
      })),
    };
    await writeFile(args.sessionPath, JSON.stringify(nextSession, null, 2), 'utf-8');
    return {
      sessionPath: args.sessionPath,
      previewArtifacts,
    };
  });

  variantSessionToolMocks.scoreVariantPreviews.mockImplementation(async (args: {
    sessionPath: string;
  }) => {
    const session = JSON.parse(await readFile(args.sessionPath, 'utf-8')) as {
      variants: Array<{ id: string; name: string }>;
      autopilot?: Record<string, unknown>;
    };
    const nextSession = {
      ...session,
      variants: session.variants.map((variant, index) => ({
        ...variant,
        score: {
          total: index === 0 ? 74 : 91,
          reason: index === 0 ? 'Readable but conservative.' : 'Stronger contrast and hierarchy.',
        },
      })),
      autopilot: {
        ...(session.autopilot ?? {}),
        recommendedVariantId: 'concept-b',
        recommendationReason: 'Stronger contrast and hierarchy.',
      },
    };
    await writeFile(args.sessionPath, JSON.stringify(nextSession, null, 2), 'utf-8');
    return {
      sessionPath: args.sessionPath,
      recommendedVariantId: 'concept-b',
      recommendationReason: 'Stronger contrast and hierarchy.',
      scores: [
        { variantId: 'concept-a', total: 74 },
        { variantId: 'concept-b', total: 91 },
      ],
    };
  });
});

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe('runAutopilotPipeline', () => {
  it('persists structured stage status for a fresh autopilot run', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'appframe-autopilot-'));
    tempDirs.push(dir);
    const [homePath, detailPath] = await makeScreenshotSet(dir);
    const homeOcrPath = join(dir, 'home.ocr.json');
    await writeFile(homeOcrPath, '{}', 'utf-8');

    const result = await runAutopilotPipeline({
      appName: 'FocusFlow',
      appDescription: 'Plan your week without losing momentum.',
      platforms: ['ios'],
      features: ['Daily planning'],
      locale: 'es-ES',
      screenshots: [{ path: homePath, ocrJsonPath: homeOcrPath }, { path: detailPath }],
      outputDir: dir,
    });

    expect(result.status).toBe('completed');
    expect(result.result?.recommendedVariantId).toBe('concept-b');
    expect(result.nextAction.command).toBe(`appframe preview --session ${join(dir, 'autopilot.session.json')}`);
    expect(result.nextAction.toolName).toBe('appframe_open_preview_session');

    const persisted = JSON.parse(await readFile(join(dir, 'autopilot-run.json'), 'utf-8')) as {
      stages: Array<{ stage: string; status: string; reused?: boolean }>;
      result?: { previewArtifacts?: unknown[] };
    };

    expect(persisted.stages.every((stage) => stage.status === 'completed')).toBe(true);
    expect(persisted.stages.some((stage) => stage.reused)).toBe(false);
    expect(persisted.result?.previewArtifacts).toHaveLength(2);
    expect(designPlanningMocks.analyzeScreenshotSet).toHaveBeenCalledTimes(1);
    expect(designPlanningMocks.analyzeScreenshotSet).toHaveBeenCalledWith([
      { path: homePath, ocrJsonPath: homeOcrPath },
      { path: detailPath },
    ]);
    expect(copyPlanningMocks.generateCopyCandidates).toHaveBeenCalledWith(expect.objectContaining({
      locale: 'es-ES',
    }));
    expect(variantSessionToolMocks.scoreVariantPreviews).toHaveBeenCalledTimes(1);
  });

  it('resumes from scoring by reusing prior artifacts', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'appframe-autopilot-resume-'));
    tempDirs.push(dir);
    const [homePath, detailPath] = await makeScreenshotSet(dir);

    const baseArgs = {
      appName: 'FocusFlow',
      appDescription: 'Plan your week without losing momentum.',
      platforms: ['ios' as const],
      features: ['Daily planning'],
      screenshots: [{ path: homePath }, { path: detailPath }],
      outputDir: dir,
    };

    await runAutopilotPipeline(baseArgs);
    clearMockCalls();

    const resumed = await runAutopilotPipeline({
      ...baseArgs,
      resumeFrom: 'scoring',
    });

    expect(resumed.status).toBe('completed');
    expect(designPlanningMocks.analyzeScreenshotSet).not.toHaveBeenCalled();
    expect(copyPlanningMocks.generateCopyCandidates).not.toHaveBeenCalled();
    expect(variantSessionToolMocks.renderVariantPreviews).not.toHaveBeenCalled();
    expect(variantSessionToolMocks.scoreVariantPreviews).toHaveBeenCalledTimes(1);

    const persisted = JSON.parse(await readFile(join(dir, 'autopilot-run.json'), 'utf-8')) as {
      stages: Array<{ stage: string; status: string; reused?: boolean }>;
    };
    const analysisStage = persisted.stages.find((stage) => stage.stage === 'analysis');
    const scoringStage = persisted.stages.find((stage) => stage.stage === 'scoring');

    expect(analysisStage?.reused).toBe(true);
    expect(scoringStage?.reused).toBe(false);
  });

  it('forces preview regeneration and reruns scoring downstream', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'appframe-autopilot-force-'));
    tempDirs.push(dir);
    const [homePath, detailPath] = await makeScreenshotSet(dir);

    const baseArgs = {
      appName: 'FocusFlow',
      appDescription: 'Plan your week without losing momentum.',
      platforms: ['ios' as const],
      features: ['Daily planning'],
      screenshots: [{ path: homePath }, { path: detailPath }],
      outputDir: dir,
    };

    await runAutopilotPipeline(baseArgs);
    clearMockCalls();

    await runAutopilotPipeline({
      ...baseArgs,
      resumeFrom: 'scoring',
      forceStages: ['previews'],
    });

    expect(designPlanningMocks.analyzeScreenshotSet).not.toHaveBeenCalled();
    expect(variantSessionToolMocks.renderVariantPreviews).toHaveBeenCalledTimes(1);
    expect(variantSessionToolMocks.scoreVariantPreviews).toHaveBeenCalledTimes(1);

    const persisted = JSON.parse(await readFile(join(dir, 'autopilot-run.json'), 'utf-8')) as {
      stages: Array<{ stage: string; forced?: boolean; reused?: boolean }>;
    };
    const previewStage = persisted.stages.find((stage) => stage.stage === 'previews');

    expect(previewStage?.forced).toBe(true);
    expect(previewStage?.reused).toBe(false);
  });

  it('detects stale screenshot inputs and reruns the pipeline from analysis forward', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'appframe-autopilot-stale-source-'));
    tempDirs.push(dir);
    const [homePath, detailPath] = await makeScreenshotSet(dir);

    const baseArgs = {
      appName: 'FocusFlow',
      appDescription: 'Plan your week without losing momentum.',
      platforms: ['ios' as const],
      features: ['Daily planning'],
      screenshots: [{ path: homePath }, { path: detailPath }],
      outputDir: dir,
    };

    await runAutopilotPipeline(baseArgs);
    clearMockCalls();
    await writeFile(homePath, 'home-v2', 'utf-8');

    await runAutopilotPipeline(baseArgs);

    expect(designPlanningMocks.analyzeScreenshotSet).toHaveBeenCalledTimes(1);
    expect(copyPlanningMocks.generateCopyCandidates).toHaveBeenCalledTimes(1);
    expect(variantSessionToolMocks.renderVariantPreviews).toHaveBeenCalledTimes(1);
    expect(variantSessionToolMocks.scoreVariantPreviews).toHaveBeenCalledTimes(1);

    const persisted = JSON.parse(await readFile(join(dir, 'autopilot-run.json'), 'utf-8')) as {
      stages: Array<{ stage: string; stale?: boolean; staleReason?: string; reused?: boolean }>;
    };
    const analysisStage = persisted.stages.find((stage) => stage.stage === 'analysis');
    const copyStage = persisted.stages.find((stage) => stage.stage === 'copy');

    expect(analysisStage?.stale).toBe(true);
    expect(analysisStage?.staleReason).toContain('current inputs');
    expect(copyStage?.stale).toBe(true);
    expect(copyStage?.reused).toBe(false);
  });

  it('detects stale OCR sidecar inputs and reruns the pipeline from analysis forward', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'appframe-autopilot-stale-ocr-'));
    tempDirs.push(dir);
    const [homePath, detailPath] = await makeScreenshotSet(dir);
    const homeOcrPath = join(dir, 'home.ocr.json');
    await writeFile(homeOcrPath, '{"version":1}', 'utf-8');

    const baseArgs = {
      appName: 'FocusFlow',
      appDescription: 'Plan your week without losing momentum.',
      platforms: ['ios' as const],
      features: ['Daily planning'],
      screenshots: [{ path: homePath, ocrJsonPath: homeOcrPath }, { path: detailPath }],
      outputDir: dir,
    };

    await runAutopilotPipeline(baseArgs);
    clearMockCalls();
    await writeFile(homeOcrPath, '{"version":2}', 'utf-8');

    await runAutopilotPipeline(baseArgs);

    expect(designPlanningMocks.analyzeScreenshotSet).toHaveBeenCalledTimes(1);
    expect(copyPlanningMocks.generateCopyCandidates).toHaveBeenCalledTimes(1);

    const persisted = JSON.parse(await readFile(join(dir, 'autopilot-run.json'), 'utf-8')) as {
      stages: Array<{ stage: string; stale?: boolean; staleReason?: string; reused?: boolean }>;
    };
    const analysisStage = persisted.stages.find((stage) => stage.stage === 'analysis');
    const planningStage = persisted.stages.find((stage) => stage.stage === 'planning');

    expect(analysisStage?.stale).toBe(true);
    expect(analysisStage?.staleReason).toContain('current inputs');
    expect(planningStage?.reused).toBe(false);
  });

  it('detects stale session config changes and rerenders previews before rescoring', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'appframe-autopilot-stale-config-'));
    tempDirs.push(dir);
    const [homePath, detailPath] = await makeScreenshotSet(dir);

    const baseArgs = {
      appName: 'FocusFlow',
      appDescription: 'Plan your week without losing momentum.',
      platforms: ['ios' as const],
      features: ['Daily planning'],
      screenshots: [{ path: homePath }, { path: detailPath }],
      outputDir: dir,
    };

    await runAutopilotPipeline(baseArgs);
    clearMockCalls();

    const sessionPath = join(dir, 'autopilot.session.json');
    const session = JSON.parse(await readFile(sessionPath, 'utf-8')) as {
      variants: Array<{ config: { theme: { style: string } } }>;
    };
    session.variants[0]!.config.theme.style = 'editorial';
    await writeFile(sessionPath, JSON.stringify(session, null, 2), 'utf-8');

    await runAutopilotPipeline(baseArgs);

    expect(designPlanningMocks.analyzeScreenshotSet).not.toHaveBeenCalled();
    expect(variantSessionToolMocks.renderVariantPreviews).toHaveBeenCalledTimes(1);
    expect(variantSessionToolMocks.scoreVariantPreviews).toHaveBeenCalledTimes(1);

    const persisted = JSON.parse(await readFile(join(dir, 'autopilot-run.json'), 'utf-8')) as {
      stages: Array<{ stage: string; reused?: boolean; stale?: boolean }>;
    };
    const sessionStage = persisted.stages.find((stage) => stage.stage === 'session');
    const previewStage = persisted.stages.find((stage) => stage.stage === 'previews');
    const scoringStage = persisted.stages.find((stage) => stage.stage === 'scoring');

    expect(sessionStage?.reused).toBe(true);
    expect(previewStage?.stale).toBe(true);
    expect(scoringStage?.reused).toBe(false);
  });
});
