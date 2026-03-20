import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import {
  analyzeScreenshotSet,
  buildVariantSetPlan,
  inferCategory,
  type ScreenshotAnalysis,
  type VariantSetPlan,
} from './design-planning.js';
import { materializeVariantPlan } from './plan-materializer.js';
import {
  generateCopyCandidates,
  scoreHeadline,
  selectCopySet,
  type CopyCandidateSet,
  type SelectedCopySet,
} from './copy-planning.js';
import { createSessionFromManifest, readSession, type VariantSessionFile } from './variant-session-lib.js';
import { renderVariantPreviews, scoreVariantPreviews } from './variant-session-tools.js';

type DesignVariantPlan = {
  id: string;
  name: string;
  mode: 'individual' | 'panoramic';
  style: string;
  recipe: string;
  rationale: string;
  screenPlan: string[];
};

function parseJsonInput<T>(label: string, raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Invalid ${label}: ${message}`);
  }
}

function defaultAutopilotOutputDir(appName: string): string {
  const slug = appName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return join(process.cwd(), 'output', 'autopilot', slug || 'app');
}

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function buildVariantPlans(
  variantCount: number,
  features: string[],
  screenshotCount: number,
): DesignVariantPlan[] {
  const featureSummary = features.length > 0 ? features : ['core product flow'];
  const variants: DesignVariantPlan[] = [
    {
      id: 'concept-a',
      name: 'Clean Hero',
      mode: 'individual',
      style: 'minimal',
      recipe: 'clean-hero',
      rationale:
        'Safe first-pass concept focused on clarity, thumbnail legibility, and a strong headline-to-device hierarchy.',
      screenPlan: [
        'Hero slide with the strongest outcome statement and clean centered device.',
        `Feature slides that each sell one idea from: ${featureSummary.slice(0, 3).join(', ')}.`,
        'Closing trust or summary slide with reduced visual complexity.',
      ],
    },
    {
      id: 'concept-b',
      name: 'Dynamic Individual',
      mode: 'individual',
      style: 'bold',
      recipe: 'layered-momentum',
      rationale:
        'Higher-energy concept using stronger contrast, more visual rhythm, and frameless rounded screenshots when they read cleaner.',
      screenPlan: [
        'Hero slide with oversized typography and one dominant screenshot.',
        'Mid-sequence slides keep one dominant idea per frame while pushing more contrast and motion.',
        'Final slide compresses supporting features into a punchier visual summary.',
      ],
    },
    {
      id: 'concept-c',
      name: 'Editorial Panorama',
      mode: 'panoramic',
      style: 'editorial',
      recipe: 'editorial-panorama',
      rationale:
        'Connected premium storytelling with stronger whitespace, slower pacing, and a more editorial visual voice.',
      screenPlan: [
        `Use ${Math.max(screenshotCount, 4)} connected frames with shared background and deliberate whitespace.`,
        'Place devices and headline blocks to read as one connected sequence instead of isolated slides.',
        'Let frame breaks mark narrative beats rather than restarting the layout each time.',
      ],
    },
    {
      id: 'concept-d',
      name: 'Bold Panorama',
      mode: 'panoramic',
      style: 'branded',
      recipe: 'bold-panorama',
      rationale:
        'Campaign-like panoramic concept with stronger brand color, larger transitions, and a more cinematic feel.',
      screenPlan: [
        `Use ${Math.max(screenshotCount, 4)} connected frames with stronger color blocking and motion.`,
        'Mix headline-led moments with hero devices and supporting image assets across the strip.',
        'Close with a stronger branded finish instead of a quiet editorial ending.',
      ],
    },
  ];

  if (variantCount >= 5) {
    variants.push({
      id: 'concept-e',
      name: 'Brand Poster',
      mode: 'individual',
      style: 'branded',
      recipe: 'brand-poster',
      rationale:
        'Poster-like concept that leans on strong brand color, graphic assets, and direct benefit messaging.',
      screenPlan: [
        'Brand-led hero slide with the product promise first.',
        'Feature slides that use graphic assets around the screenshots rather than only framing them.',
        'Summary slide with strong visual closure and minimal copy.',
      ],
    });
  }

  return variants.slice(0, variantCount);
}

export const AUTOPILOT_STAGES = [
  'analysis',
  'copy',
  'planning',
  'materialization',
  'session',
  'previews',
  'scoring',
] as const;

export type AutopilotStage = (typeof AUTOPILOT_STAGES)[number];

type AutopilotRunState = 'running' | 'completed' | 'failed';
type AutopilotStageState = 'pending' | 'running' | 'completed' | 'failed';

interface AutopilotStageStatus {
  stage: AutopilotStage;
  status: AutopilotStageState;
  startedAt?: string;
  completedAt?: string;
  reused?: boolean;
  forced?: boolean;
  stale?: boolean;
  staleReason?: string;
  fingerprint?: string;
  artifactPaths?: string[];
  summary?: Record<string, unknown>;
  error?: {
    message: string;
  };
}

interface AutopilotPaths {
  analysisPath: string;
  copyCandidatesPath: string;
  selectedCopySetPath: string;
  planPath: string;
  materializedManifestPath: string;
  sessionPath: string;
  runManifestPath: string;
  previewOutputDir: string;
}

export interface AutopilotRunStatus {
  version: 1;
  status: AutopilotRunState;
  createdAt: string;
  updatedAt: string;
  outputDir: string;
  app: {
    appName: string;
    appDescription: string;
    platforms: Array<'ios' | 'android'>;
  };
  options: {
    variantCount: number;
    screenCount: number | null;
    resumeFrom: AutopilotStage | null;
    forceStages: AutopilotStage[];
  };
  artifacts: AutopilotPaths;
  stages: AutopilotStageStatus[];
  result?: {
    sessionPath: string;
    materializedManifestPath: string;
    recommendedVariantId: string | null;
    recommendationReason: string | null;
    previewCommand: string;
    previewArtifacts: Array<{
      variantId: string;
      filePaths: string[];
      thumbnailPath: string | null;
    }>;
  };
  nextAction: {
    kind: 'preview';
    command: string;
    toolName: 'appframe_open_preview_session';
    toolArgs: {
      sessionPath: string;
    };
    when: 'after_success';
    reason: string;
  };
  failure?: {
    stage: AutopilotStage;
    message: string;
  };
}

export interface RunAutopilotArgs {
  appName: string;
  appDescription: string;
  platforms: Array<'ios' | 'android'>;
  features: string[];
  screenshots: Array<{ path: string; note?: string }>;
  goals?: string[];
  primaryColor?: string;
  secondaryColor?: string;
  font?: string;
  assetImagePath?: string;
  outputDir?: string;
  sessionPath?: string;
  manifestPath?: string;
  screenCount?: number;
  variantCount?: number;
  resumeFrom?: AutopilotStage;
  forceStages?: AutopilotStage[];
}

type AutopilotStageDecision = {
  stage: AutopilotStage;
  run: boolean;
  forced: boolean;
  stale: boolean;
  fingerprint: string;
  reason?: string;
};

type FileVersion = {
  path: string;
  exists: boolean;
  size: number | null;
  mtimeMs: number | null;
};

function stageIndex(stage: AutopilotStage): number {
  return AUTOPILOT_STAGES.indexOf(stage);
}

async function getFileVersion(path: string): Promise<FileVersion> {
  try {
    const fileStat = await stat(path);
    return {
      path,
      exists: true,
      size: fileStat.size,
      mtimeMs: fileStat.mtimeMs,
    };
  } catch {
    return {
      path,
      exists: false,
      size: null,
      mtimeMs: null,
    };
  }
}

function hashValue(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

async function readJsonArtifactIfExists<T>(path: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(path, 'utf-8')) as T;
  } catch {
    return null;
  }
}

function getStageStatus(
  runStatus: AutopilotRunStatus | undefined,
  stage: AutopilotStage,
): AutopilotStageStatus | undefined {
  return runStatus?.stages.find((entry) => entry.stage === stage);
}

function defaultAutopilotManifestPath(appName: string, configOutputDir: string): string {
  const slug = appName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return join(configOutputDir, `${slug || 'app'}-variant-manifest.json`);
}

function buildAutopilotPaths(args: {
  appName: string;
  outputDir: string;
  sessionPath?: string;
  manifestPath?: string;
}): AutopilotPaths {
  return {
    analysisPath: join(args.outputDir, 'analysis.json'),
    copyCandidatesPath: join(args.outputDir, 'copy-candidates.json'),
    selectedCopySetPath: join(args.outputDir, 'selected-copy.json'),
    planPath: join(args.outputDir, 'variant-plan.json'),
    materializedManifestPath:
      args.manifestPath ?? defaultAutopilotManifestPath(args.appName, join(args.outputDir, 'configs')),
    sessionPath: args.sessionPath ?? join(args.outputDir, 'autopilot.session.json'),
    runManifestPath: join(args.outputDir, 'autopilot-run.json'),
    previewOutputDir: join(args.outputDir, 'preview-artifacts'),
  };
}

async function loadPreviousAutopilotRunStatus(runManifestPath: string): Promise<AutopilotRunStatus | null> {
  try {
    const raw = JSON.parse(await readFile(runManifestPath, 'utf-8')) as Partial<AutopilotRunStatus>;
    if (raw.version !== 1 || !Array.isArray(raw.stages)) {
      return null;
    }
    return raw as AutopilotRunStatus;
  } catch {
    return null;
  }
}

async function buildStageFingerprint(args: {
  stage: AutopilotStage;
  autopilotArgs: RunAutopilotArgs;
  paths: AutopilotPaths;
  previewCommand: string;
}): Promise<string> {
  const { stage, autopilotArgs, paths, previewCommand } = args;

  switch (stage) {
    case 'analysis': {
      const screenshots = await Promise.all(
        autopilotArgs.screenshots.map(async (screenshot) => ({
          path: screenshot.path,
          note: screenshot.note ?? null,
          version: await getFileVersion(screenshot.path),
        })),
      );
      return hashValue({ stage, screenshots });
    }
    case 'copy':
      return hashValue({
        stage,
        appName: autopilotArgs.appName,
        appDescription: autopilotArgs.appDescription,
        category: inferCategory(autopilotArgs.appDescription, autopilotArgs.features),
        features: autopilotArgs.features,
        goals: autopilotArgs.goals ?? [],
        screenshotCount: autopilotArgs.screenCount ?? Math.min(5, autopilotArgs.screenshots.length),
      });
    case 'planning': {
      const screenshots = await Promise.all(
        autopilotArgs.screenshots.map(async (screenshot) => ({
          path: screenshot.path,
          note: screenshot.note ?? null,
          version: await getFileVersion(screenshot.path),
        })),
      );
      return hashValue({
        stage,
        appName: autopilotArgs.appName,
        appDescription: autopilotArgs.appDescription,
        platforms: autopilotArgs.platforms,
        features: autopilotArgs.features,
        goals: autopilotArgs.goals ?? [],
        variantCount: autopilotArgs.variantCount ?? 4,
        screenCount: autopilotArgs.screenCount ?? null,
        screenshots,
      });
    }
    case 'materialization': {
      const [plan, selectedCopySet, assetImage] = await Promise.all([
        readJsonArtifactIfExists<VariantSetPlan>(paths.planPath),
        readJsonArtifactIfExists<SelectedCopySet>(paths.selectedCopySetPath),
        autopilotArgs.assetImagePath ? getFileVersion(autopilotArgs.assetImagePath) : null,
      ]);
      return hashValue({
        stage,
        plan,
        selectedCopySet,
        primaryColor: autopilotArgs.primaryColor ?? null,
        secondaryColor: autopilotArgs.secondaryColor ?? null,
        font: autopilotArgs.font ?? null,
        assetImage,
      });
    }
    case 'session': {
      const [analysis, copyCandidates, selectedCopySet, plan, manifest] = await Promise.all([
        readJsonArtifactIfExists<ScreenshotAnalysis[]>(paths.analysisPath),
        readJsonArtifactIfExists<CopyCandidateSet>(paths.copyCandidatesPath),
        readJsonArtifactIfExists<SelectedCopySet>(paths.selectedCopySetPath),
        readJsonArtifactIfExists<VariantSetPlan>(paths.planPath),
        readJsonArtifactIfExists<Record<string, unknown>>(paths.materializedManifestPath),
      ]);
      return hashValue({
        stage,
        manifest,
        analysis,
        copyCandidates,
        selectedCopySet,
        plan,
        previewCommand,
      });
    }
    case 'previews': {
      const session = await readJsonArtifactIfExists<VariantSessionFile>(paths.sessionPath);
      return hashValue({
        stage,
        platform: autopilotArgs.platforms.includes('ios') ? 'ios' : autopilotArgs.platforms[0] ?? 'ios',
        variants: session?.variants.map((variant) => ({
          id: variant.id,
          config: variant.config,
        })) ?? null,
      });
    }
    case 'scoring': {
      const session = await readJsonArtifactIfExists<VariantSessionFile>(paths.sessionPath);
      const previewFiles = await Promise.all(
        (session?.variants ?? []).flatMap((variant) => (
          (variant.previewArtifacts?.[0]?.filePaths ?? []).map((filePath) => getFileVersion(filePath))
        )),
      );
      return hashValue({
        stage,
        variants: session?.variants.map((variant) => ({
          id: variant.id,
          config: variant.config,
          previewArtifacts: variant.previewArtifacts?.[0]?.filePaths ?? [],
        })) ?? null,
        previewFiles,
      });
    }
  }
}

async function getStageArtifactProblem(
  stage: AutopilotStage,
  paths: AutopilotPaths,
): Promise<string | null> {
  switch (stage) {
    case 'analysis': {
      const analysis = await getFileVersion(paths.analysisPath);
      return analysis.exists ? null : `Missing analysis artifact: ${paths.analysisPath}`;
    }
    case 'copy': {
      const [copyCandidates, selectedCopySet] = await Promise.all([
        getFileVersion(paths.copyCandidatesPath),
        getFileVersion(paths.selectedCopySetPath),
      ]);
      if (!copyCandidates.exists) return `Missing copy artifact: ${paths.copyCandidatesPath}`;
      if (!selectedCopySet.exists) return `Missing copy artifact: ${paths.selectedCopySetPath}`;
      return null;
    }
    case 'planning': {
      const plan = await getFileVersion(paths.planPath);
      return plan.exists ? null : `Missing planning artifact: ${paths.planPath}`;
    }
    case 'materialization': {
      const manifest = await readJsonArtifactIfExists<{ variants?: Array<{ configPath?: string }> }>(
        paths.materializedManifestPath,
      );
      if (!manifest) return `Missing materialized manifest: ${paths.materializedManifestPath}`;
      for (const variant of manifest.variants ?? []) {
        if (!variant.configPath) {
          return `Materialized manifest is missing config paths: ${paths.materializedManifestPath}`;
        }
        const configVersion = await getFileVersion(variant.configPath);
        if (!configVersion.exists) {
          return `Missing materialized config: ${variant.configPath}`;
        }
      }
      return null;
    }
    case 'session': {
      const sessionVersion = await getFileVersion(paths.sessionPath);
      return sessionVersion.exists ? null : `Missing session artifact: ${paths.sessionPath}`;
    }
    case 'previews': {
      const session = await readJsonArtifactIfExists<VariantSessionFile>(paths.sessionPath);
      if (!session) return `Missing session artifact: ${paths.sessionPath}`;
      for (const variant of session.variants) {
        const previewArtifact = variant.previewArtifacts?.[0];
        if (!previewArtifact) {
          return `Variant ${variant.id} is missing preview artifacts in ${paths.sessionPath}`;
        }
        for (const filePath of previewArtifact.filePaths) {
          const previewFile = await getFileVersion(filePath);
          if (!previewFile.exists) {
            return `Missing preview artifact: ${filePath}`;
          }
        }
      }
      return null;
    }
    case 'scoring': {
      const session = await readJsonArtifactIfExists<VariantSessionFile>(paths.sessionPath);
      if (!session) return `Missing session artifact: ${paths.sessionPath}`;
      if (!session.autopilot?.recommendedVariantId || !session.autopilot?.recommendationReason) {
        return `Session is missing recommendation metadata: ${paths.sessionPath}`;
      }
      for (const variant of session.variants) {
        if (!variant.score) {
          return `Variant ${variant.id} is missing score metadata in ${paths.sessionPath}`;
        }
      }
      return null;
    }
  }
}

async function decideStageExecution(args: {
  stage: AutopilotStage;
  autopilotArgs: RunAutopilotArgs;
  paths: AutopilotPaths;
  previewCommand: string;
  previousRunStatus: AutopilotRunStatus | null;
  upstreamChanged: boolean;
}): Promise<AutopilotStageDecision> {
  const forced = (args.autopilotArgs.forceStages ?? []).includes(args.stage);
  const fingerprint = await buildStageFingerprint({
    stage: args.stage,
    autopilotArgs: args.autopilotArgs,
    paths: args.paths,
    previewCommand: args.previewCommand,
  });

  if (forced) {
    return {
      stage: args.stage,
      run: true,
      forced: true,
      stale: false,
      fingerprint,
      reason: 'Forced regeneration was requested.',
    };
  }

  if (args.upstreamChanged) {
    return {
      stage: args.stage,
      run: true,
      forced: false,
      stale: true,
      fingerprint,
      reason: 'An upstream stage changed, so downstream artifacts are stale.',
    };
  }

  const resumeFrom = args.autopilotArgs.resumeFrom;
  if (resumeFrom && stageIndex(args.stage) >= stageIndex(resumeFrom)) {
    return {
      stage: args.stage,
      run: true,
      forced: false,
      stale: false,
      fingerprint,
      reason: `Resume was requested from ${resumeFrom}.`,
    };
  }

  const previousStageStatus = getStageStatus(args.previousRunStatus ?? undefined, args.stage);
  if (!previousStageStatus || previousStageStatus.status !== 'completed') {
    return {
      stage: args.stage,
      run: true,
      forced: false,
      stale: true,
      fingerprint,
      reason: 'No completed stage metadata is available to reuse prior artifacts.',
    };
  }

  const artifactProblem = await getStageArtifactProblem(args.stage, args.paths);
  if (artifactProblem) {
    return {
      stage: args.stage,
      run: true,
      forced: false,
      stale: true,
      fingerprint,
      reason: artifactProblem,
    };
  }

  if (!previousStageStatus.fingerprint || previousStageStatus.fingerprint !== fingerprint) {
    return {
      stage: args.stage,
      run: true,
      forced: false,
      stale: true,
      fingerprint,
      reason: 'The current inputs no longer match the previously generated artifacts.',
    };
  }

  return {
    stage: args.stage,
    run: false,
    forced: false,
    stale: false,
    fingerprint,
  };
}

function createInitialAutopilotRunStatus(args: {
  appName: string;
  appDescription: string;
  platforms: Array<'ios' | 'android'>;
  outputDir: string;
  paths: AutopilotPaths;
  variantCount: number;
  screenCount?: number;
  resumeFrom?: AutopilotStage;
  forceStages: AutopilotStage[];
  previewCommand: string;
}): AutopilotRunStatus {
  const timestamp = new Date().toISOString();
  return {
    version: 1,
    status: 'running',
    createdAt: timestamp,
    updatedAt: timestamp,
    outputDir: args.outputDir,
    app: {
      appName: args.appName,
      appDescription: args.appDescription,
      platforms: args.platforms,
    },
    options: {
      variantCount: args.variantCount,
      screenCount: args.screenCount ?? null,
      resumeFrom: args.resumeFrom ?? null,
      forceStages: [...args.forceStages],
    },
    artifacts: args.paths,
    stages: AUTOPILOT_STAGES.map((stage) => ({ stage, status: 'pending' })),
    nextAction: {
      kind: 'preview',
      command: args.previewCommand,
      toolName: 'appframe_open_preview_session',
      toolArgs: {
        sessionPath: args.paths.sessionPath,
      },
      when: 'after_success',
      reason: 'Open the generated variant session in preview after autopilot completes successfully.',
    },
  };
}

async function writeAutopilotRunStatus(status: AutopilotRunStatus): Promise<void> {
  status.updatedAt = new Date().toISOString();
  await writeFile(status.artifacts.runManifestPath, JSON.stringify(status, null, 2), 'utf-8');
}

function updateStageStatus(
  status: AutopilotRunStatus,
  stage: AutopilotStage,
  patch: Partial<AutopilotStageStatus>,
): void {
  status.stages = status.stages.map((entry) => (
    entry.stage === stage
      ? { ...entry, ...patch, stage }
      : entry
  ));
}

async function readJsonArtifact<T>(label: string, path: string): Promise<T> {
  try {
    return JSON.parse(await readFile(path, 'utf-8')) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Unable to load ${label} from ${path}: ${message}`);
  }
}

async function markStageRunning(
  status: AutopilotRunStatus,
  stage: AutopilotStage,
  args: {
    forced: boolean;
    stale?: boolean;
    staleReason?: string;
    fingerprint?: string;
  },
): Promise<void> {
  updateStageStatus(status, stage, {
    status: 'running',
    forced: args.forced,
    stale: args.stale ?? false,
    staleReason: args.staleReason,
    fingerprint: args.fingerprint,
    reused: false,
    error: undefined,
    startedAt: new Date().toISOString(),
    completedAt: undefined,
  });
  await writeAutopilotRunStatus(status);
}

async function markStageCompleted(
  status: AutopilotRunStatus,
  stage: AutopilotStage,
  args: {
    reused: boolean;
    forced: boolean;
    stale?: boolean;
    staleReason?: string;
    fingerprint?: string;
    artifactPaths?: string[];
    summary?: Record<string, unknown>;
  },
): Promise<void> {
  updateStageStatus(status, stage, {
    status: 'completed',
    reused: args.reused,
    forced: args.forced,
    stale: args.stale ?? false,
    staleReason: args.staleReason,
    fingerprint: args.fingerprint,
    artifactPaths: args.artifactPaths,
    summary: args.summary,
    completedAt: new Date().toISOString(),
    error: undefined,
  });
  await writeAutopilotRunStatus(status);
}

async function markStageFailed(
  status: AutopilotRunStatus,
  stage: AutopilotStage,
  error: unknown,
): Promise<never> {
  const message = error instanceof Error ? error.message : 'Unknown error';
  status.status = 'failed';
  status.failure = { stage, message };
  updateStageStatus(status, stage, {
    status: 'failed',
    completedAt: new Date().toISOString(),
    error: { message },
  });
  await writeAutopilotRunStatus(status);
  throw error;
}

export async function runAutopilotPipeline(args: RunAutopilotArgs): Promise<AutopilotRunStatus> {
  const variantCount = args.variantCount ?? 4;
  const resolvedOutputDir = args.outputDir ?? defaultAutopilotOutputDir(args.appName);
  const resolvedForceStages = dedupe((args.forceStages ?? []) as string[]) as AutopilotStage[];
  const autopilotArgs: RunAutopilotArgs = {
    ...args,
    variantCount,
    outputDir: resolvedOutputDir,
    forceStages: resolvedForceStages,
  };
  const paths = buildAutopilotPaths({
    appName: args.appName,
    outputDir: resolvedOutputDir,
    sessionPath: args.sessionPath,
    manifestPath: args.manifestPath,
  });
  const previewCommand = `appframe preview --session ${paths.sessionPath}`;

  await mkdir(resolvedOutputDir, { recursive: true });
  const previousRunStatus = await loadPreviousAutopilotRunStatus(paths.runManifestPath);
  const runStatus = createInitialAutopilotRunStatus({
    appName: args.appName,
    appDescription: args.appDescription,
    platforms: args.platforms,
    outputDir: resolvedOutputDir,
    paths,
    variantCount,
    screenCount: args.screenCount,
    resumeFrom: args.resumeFrom,
    forceStages: resolvedForceStages,
    previewCommand,
  });
  await writeAutopilotRunStatus(runStatus);
  let upstreamChanged = false;

  try {
    let analysis: ScreenshotAnalysis[];
    const analysisDecision = await decideStageExecution({
      stage: 'analysis',
      autopilotArgs,
      paths,
      previewCommand,
      previousRunStatus,
      upstreamChanged,
    });
    if (analysisDecision.run) {
      await markStageRunning(runStatus, 'analysis', {
        forced: analysisDecision.forced,
        stale: analysisDecision.stale,
        staleReason: analysisDecision.reason,
        fingerprint: analysisDecision.fingerprint,
      });
      analysis = await analyzeScreenshotSet(args.screenshots);
      await writeFile(paths.analysisPath, JSON.stringify(analysis, null, 2), 'utf-8');
      await markStageCompleted(runStatus, 'analysis', {
        reused: false,
        forced: analysisDecision.forced,
        stale: analysisDecision.stale,
        staleReason: analysisDecision.reason,
        fingerprint: analysisDecision.fingerprint,
        artifactPaths: [paths.analysisPath],
        summary: {
          count: analysis.length,
          topHeroCandidate: analysis[0]?.path ?? null,
        },
      });
    } else {
      await markStageRunning(runStatus, 'analysis', {
        forced: false,
        stale: false,
        fingerprint: analysisDecision.fingerprint,
      });
      analysis = await readJsonArtifact<ScreenshotAnalysis[]>('analysis', paths.analysisPath);
      await markStageCompleted(runStatus, 'analysis', {
        reused: true,
        forced: false,
        stale: false,
        fingerprint: analysisDecision.fingerprint,
        artifactPaths: [paths.analysisPath],
        summary: {
          count: analysis.length,
          topHeroCandidate: analysis[0]?.path ?? null,
        },
      });
    }
    if (analysisDecision.run && previousRunStatus) upstreamChanged = true;

    const category = inferCategory(args.appDescription, args.features);
    let copyCandidates: CopyCandidateSet;
    let selectedCopySet: SelectedCopySet;
    const copyDecision = await decideStageExecution({
      stage: 'copy',
      autopilotArgs,
      paths,
      previewCommand,
      previousRunStatus,
      upstreamChanged,
    });
    if (copyDecision.run) {
      await markStageRunning(runStatus, 'copy', {
        forced: copyDecision.forced,
        stale: copyDecision.stale,
        staleReason: copyDecision.reason,
        fingerprint: copyDecision.fingerprint,
      });
      copyCandidates = generateCopyCandidates({
        appName: args.appName,
        appDescription: args.appDescription,
        category,
        features: args.features,
        goals: args.goals,
        screenshotCount: args.screenCount ?? Math.min(5, args.screenshots.length),
      });
      selectedCopySet = selectCopySet(copyCandidates);
      await Promise.all([
        writeFile(paths.copyCandidatesPath, JSON.stringify(copyCandidates, null, 2), 'utf-8'),
        writeFile(paths.selectedCopySetPath, JSON.stringify(selectedCopySet, null, 2), 'utf-8'),
      ]);
      await markStageCompleted(runStatus, 'copy', {
        reused: false,
        forced: copyDecision.forced,
        stale: copyDecision.stale,
        staleReason: copyDecision.reason,
        fingerprint: copyDecision.fingerprint,
        artifactPaths: [paths.copyCandidatesPath, paths.selectedCopySetPath],
        summary: {
          slotCount: copyCandidates.slots.length,
          selectedFeatureCount: selectedCopySet.features.length,
        },
      });
    } else {
      await markStageRunning(runStatus, 'copy', {
        forced: false,
        stale: false,
        fingerprint: copyDecision.fingerprint,
      });
      copyCandidates = await readJsonArtifact<CopyCandidateSet>('copy candidates', paths.copyCandidatesPath);
      selectedCopySet = await readJsonArtifact<SelectedCopySet>('selected copy set', paths.selectedCopySetPath);
      await markStageCompleted(runStatus, 'copy', {
        reused: true,
        forced: false,
        stale: false,
        fingerprint: copyDecision.fingerprint,
        artifactPaths: [paths.copyCandidatesPath, paths.selectedCopySetPath],
        summary: {
          slotCount: copyCandidates.slots.length,
          selectedFeatureCount: selectedCopySet.features.length,
        },
      });
    }
    if (copyDecision.run && previousRunStatus) upstreamChanged = true;

    let plan: VariantSetPlan;
    const planningDecision = await decideStageExecution({
      stage: 'planning',
      autopilotArgs,
      paths,
      previewCommand,
      previousRunStatus,
      upstreamChanged,
    });
    if (planningDecision.run) {
      await markStageRunning(runStatus, 'planning', {
        forced: planningDecision.forced,
        stale: planningDecision.stale,
        staleReason: planningDecision.reason,
        fingerprint: planningDecision.fingerprint,
      });
      plan = await buildVariantSetPlan({
        appName: args.appName,
        appDescription: args.appDescription,
        platforms: args.platforms,
        features: args.features,
        screenshots: args.screenshots,
        goals: args.goals,
        variantCount,
        screenCount: args.screenCount,
      });
      await writeFile(paths.planPath, JSON.stringify(plan, null, 2), 'utf-8');
      await markStageCompleted(runStatus, 'planning', {
        reused: false,
        forced: planningDecision.forced,
        stale: planningDecision.stale,
        staleReason: planningDecision.reason,
        fingerprint: planningDecision.fingerprint,
        artifactPaths: [paths.planPath],
        summary: {
          selectedScreens: plan.selectedScreens.length,
          variantCount: plan.variants.length,
        },
      });
    } else {
      await markStageRunning(runStatus, 'planning', {
        forced: false,
        stale: false,
        fingerprint: planningDecision.fingerprint,
      });
      plan = await readJsonArtifact<VariantSetPlan>('variant plan', paths.planPath);
      await markStageCompleted(runStatus, 'planning', {
        reused: true,
        forced: false,
        stale: false,
        fingerprint: planningDecision.fingerprint,
        artifactPaths: [paths.planPath],
        summary: {
          selectedScreens: plan.selectedScreens.length,
          variantCount: plan.variants.length,
        },
      });
    }
    if (planningDecision.run && previousRunStatus) upstreamChanged = true;

    const materializationDecision = await decideStageExecution({
      stage: 'materialization',
      autopilotArgs,
      paths,
      previewCommand,
      previousRunStatus,
      upstreamChanged,
    });
    if (materializationDecision.run) {
      await markStageRunning(runStatus, 'materialization', {
        forced: materializationDecision.forced,
        stale: materializationDecision.stale,
        staleReason: materializationDecision.reason,
        fingerprint: materializationDecision.fingerprint,
      });
      const materialized = await materializeVariantPlan({
        plan,
        outputDir: join(resolvedOutputDir, 'configs'),
        primaryColor: args.primaryColor,
        secondaryColor: args.secondaryColor,
        font: args.font,
        assetImagePath: args.assetImagePath,
        manifestPath: paths.materializedManifestPath,
        selectedCopySet,
      });
      await markStageCompleted(runStatus, 'materialization', {
        reused: false,
        forced: materializationDecision.forced,
        stale: materializationDecision.stale,
        staleReason: materializationDecision.reason,
        fingerprint: materializationDecision.fingerprint,
        artifactPaths: [
          materialized.manifestPath,
          ...materialized.variants.map((variant) => variant.configPath),
        ],
        summary: {
          variantCount: materialized.variants.length,
          manifestPath: materialized.manifestPath,
        },
      });
    } else {
      await markStageRunning(runStatus, 'materialization', {
        forced: false,
        stale: false,
        fingerprint: materializationDecision.fingerprint,
      });
      const materialized = await readJsonArtifact<{
        variants: Array<{ configPath: string }>;
      }>('materialized manifest', paths.materializedManifestPath);
      await markStageCompleted(runStatus, 'materialization', {
        reused: true,
        forced: false,
        stale: false,
        fingerprint: materializationDecision.fingerprint,
        artifactPaths: [
          paths.materializedManifestPath,
          ...materialized.variants.map((variant) => variant.configPath),
        ],
        summary: {
          variantCount: materialized.variants.length,
          manifestPath: paths.materializedManifestPath,
        },
      });
    }
    if (materializationDecision.run && previousRunStatus) upstreamChanged = true;

    let session: VariantSessionFile;
    const sessionDecision = await decideStageExecution({
      stage: 'session',
      autopilotArgs,
      paths,
      previewCommand,
      previousRunStatus,
      upstreamChanged,
    });
    if (sessionDecision.run) {
      await markStageRunning(runStatus, 'session', {
        forced: sessionDecision.forced,
        stale: sessionDecision.stale,
        staleReason: sessionDecision.reason,
        fingerprint: sessionDecision.fingerprint,
      });
      const createdSession = await createSessionFromManifest({
        manifestPath: paths.materializedManifestPath,
        sessionPath: paths.sessionPath,
        screenshotAnalysis: analysis,
        copyCandidates,
        selectedCopySet,
        conceptPlan: plan,
        runManifestPath: paths.runManifestPath,
        previewCommand,
      });
      session = createdSession.session;
      await markStageCompleted(runStatus, 'session', {
        reused: false,
        forced: sessionDecision.forced,
        stale: sessionDecision.stale,
        staleReason: sessionDecision.reason,
        fingerprint: sessionDecision.fingerprint,
        artifactPaths: [createdSession.sessionPath],
        summary: {
          activeVariantId: session.activeVariantId,
          variantCount: session.variants.length,
        },
      });
    } else {
      await markStageRunning(runStatus, 'session', {
        forced: false,
        stale: false,
        fingerprint: sessionDecision.fingerprint,
      });
      session = await readSession(paths.sessionPath);
      await markStageCompleted(runStatus, 'session', {
        reused: true,
        forced: false,
        stale: false,
        fingerprint: sessionDecision.fingerprint,
        artifactPaths: [paths.sessionPath],
        summary: {
          activeVariantId: session.activeVariantId,
          variantCount: session.variants.length,
        },
      });
    }
    if (sessionDecision.run && previousRunStatus) upstreamChanged = true;

    let previewArtifacts: Array<{ variantId: string; filePaths: string[]; thumbnailPath: string | null }>;
    const previewsDecision = await decideStageExecution({
      stage: 'previews',
      autopilotArgs,
      paths,
      previewCommand,
      previousRunStatus,
      upstreamChanged,
    });
    if (previewsDecision.run) {
      await markStageRunning(runStatus, 'previews', {
        forced: previewsDecision.forced,
        stale: previewsDecision.stale,
        staleReason: previewsDecision.reason,
        fingerprint: previewsDecision.fingerprint,
      });
      const previewResult = await renderVariantPreviews({
        sessionPath: paths.sessionPath,
        outputDir: paths.previewOutputDir,
        platform: args.platforms.includes('ios') ? 'ios' : args.platforms[0] ?? 'ios',
      });
      previewArtifacts = previewResult.previewArtifacts;
      await markStageCompleted(runStatus, 'previews', {
        reused: false,
        forced: previewsDecision.forced,
        stale: previewsDecision.stale,
        staleReason: previewsDecision.reason,
        fingerprint: previewsDecision.fingerprint,
        artifactPaths: previewArtifacts.flatMap((entry) => entry.filePaths),
        summary: {
          previewVariantCount: previewArtifacts.length,
        },
      });
    } else {
      await markStageRunning(runStatus, 'previews', {
        forced: false,
        stale: false,
        fingerprint: previewsDecision.fingerprint,
      });
      session = await readSession(paths.sessionPath);
      previewArtifacts = session.variants.flatMap((variant) => {
        const latestPreview = variant.previewArtifacts?.[0];
        return latestPreview
          ? [{
              variantId: variant.id,
              filePaths: latestPreview.filePaths,
              thumbnailPath: latestPreview.thumbnailPath,
            }]
          : [];
      });
      if (previewArtifacts.length === 0) {
        throw new Error(`Cannot resume after previews because no preview artifacts were found in ${paths.sessionPath}`);
      }
      await markStageCompleted(runStatus, 'previews', {
        reused: true,
        forced: false,
        stale: false,
        fingerprint: previewsDecision.fingerprint,
        artifactPaths: previewArtifacts.flatMap((entry) => entry.filePaths),
        summary: {
          previewVariantCount: previewArtifacts.length,
        },
      });
    }
    if (previewsDecision.run && previousRunStatus) upstreamChanged = true;

    let recommendedVariantId: string | null;
    let recommendationReason: string | null;
    const scoringDecision = await decideStageExecution({
      stage: 'scoring',
      autopilotArgs,
      paths,
      previewCommand,
      previousRunStatus,
      upstreamChanged,
    });
    if (scoringDecision.run) {
      await markStageRunning(runStatus, 'scoring', {
        forced: scoringDecision.forced,
        stale: scoringDecision.stale,
        staleReason: scoringDecision.reason,
        fingerprint: scoringDecision.fingerprint,
      });
      const scoreResult = await scoreVariantPreviews({
        sessionPath: paths.sessionPath,
      });
      recommendedVariantId = scoreResult.recommendedVariantId;
      recommendationReason = scoreResult.recommendationReason;
      await markStageCompleted(runStatus, 'scoring', {
        reused: false,
        forced: scoringDecision.forced,
        stale: scoringDecision.stale,
        staleReason: scoringDecision.reason,
        fingerprint: scoringDecision.fingerprint,
        artifactPaths: [paths.sessionPath],
        summary: {
          recommendedVariantId,
          recommendationReason,
        },
      });
    } else {
      await markStageRunning(runStatus, 'scoring', {
        forced: false,
        stale: false,
        fingerprint: scoringDecision.fingerprint,
      });
      session = await readSession(paths.sessionPath);
      recommendedVariantId = session.autopilot?.recommendedVariantId ?? null;
      recommendationReason = session.autopilot?.recommendationReason ?? null;
      if (!recommendedVariantId || !recommendationReason) {
        throw new Error(`Cannot resume after scoring because recommendation metadata is missing in ${paths.sessionPath}`);
      }
      await markStageCompleted(runStatus, 'scoring', {
        reused: true,
        forced: false,
        stale: false,
        fingerprint: scoringDecision.fingerprint,
        artifactPaths: [paths.sessionPath],
        summary: {
          recommendedVariantId,
          recommendationReason,
        },
      });
    }

    runStatus.status = 'completed';
    runStatus.result = {
      sessionPath: paths.sessionPath,
      materializedManifestPath: paths.materializedManifestPath,
      recommendedVariantId,
      recommendationReason,
      previewCommand,
      previewArtifacts,
    };
    await writeAutopilotRunStatus(runStatus);
    return runStatus;
  } catch (error) {
    const activeStage = runStatus.stages.find((stage) => stage.status === 'running')?.stage;
    if (activeStage) {
      await markStageFailed(runStatus, activeStage, error);
    }
    throw error;
  }
}

export function registerSuggestionTools(server: McpServer): void {
  server.tool(
    'appframe_analyze_screenshot_set',
    'Analyze a raw screenshot set for likely roles, hero priority, density, and text-risk. Use this before planning variants so the agent works from explicit screenshot understanding instead of guessing from filenames.',
    {
      screenshots: z
        .array(
          z.object({
            path: z.string().describe('Absolute path to a raw screenshot'),
            note: z.string().optional().describe('Optional note about what the screenshot shows'),
          }),
        )
        .min(1)
        .describe('Raw screenshot inventory'),
    },
    async ({ screenshots }) => {
      const analysis = await analyzeScreenshotSet(screenshots);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                screenshots: analysis,
                summary: {
                  count: analysis.length,
                  topHeroCandidate: analysis[0]?.path ?? null,
                },
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.tool(
    'appframe_plan_variant_set',
    'Plan a concrete AppFrame concept set from app metadata and a screenshot inventory. Returns selected source screens plus variant-by-variant structure, including which concepts are supported now versus which still need future layout expansion.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Short product description'),
      platforms: z.array(z.enum(['ios', 'android'])).describe('Target platforms'),
      features: z.array(z.string()).describe('Key product features or selling points'),
      screenshots: z
        .array(
          z.object({
            path: z.string().describe('Absolute path to a raw screenshot'),
            note: z.string().optional().describe('Optional note about what the screenshot shows'),
          }),
        )
        .min(1)
        .describe('Raw screenshot inventory'),
      goals: z.array(z.string()).optional().describe('What the screenshots should emphasize'),
      variantCount: z.number().min(2).max(5).default(4).describe('How many concepts to plan'),
      screenCount: z
        .number()
        .min(3)
        .max(10)
        .optional()
        .describe('How many source screens to select for the plan'),
    },
    async ({
      appName,
      appDescription,
      platforms,
      features,
      screenshots,
      goals,
      variantCount,
      screenCount,
    }) => {
      const plan = await buildVariantSetPlan({
        appName,
        appDescription,
        platforms,
        features,
        screenshots,
        goals,
        variantCount,
        screenCount,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(plan, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    'appframe_generate_copy_candidates',
    'Generate structured App Store screenshot copy candidates with explicit hero, differentiator, feature, trust, and summary slots. Use this before planning layouts so all concepts share the same narrative backbone.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Short product description'),
      features: z.array(z.string()).describe('Prioritized features'),
      goals: z.array(z.string()).optional().describe('Optional marketing goals'),
      category: z.string().optional().describe('Optional category override'),
      screenshotCount: z.number().min(1).max(10).optional().describe('Expected slide count'),
    },
    async ({ appName, appDescription, features, goals, category, screenshotCount }) => {
      const candidateSet = generateCopyCandidates({
        appName,
        appDescription,
        category: category ?? inferCategory(appDescription, features),
        features,
        goals,
        screenshotCount,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(candidateSet, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    'appframe_score_copy_candidates',
    'Score an existing copy candidate set and return a slot-by-slot view of the best headline options plus issues that should be fixed before layout generation.',
    {
      candidateSetJson: z.string().describe('JSON output from appframe_generate_copy_candidates'),
    },
    async ({ candidateSetJson }) => {
      try {
        const candidateSet = parseJsonInput<CopyCandidateSet>('candidateSetJson', candidateSetJson);
        const scored = candidateSet.slots.map((slot) => ({
          slot: slot.slot,
          sourceFeature: slot.sourceFeature ?? null,
          candidates: slot.candidates.map((candidate) => ({
            ...candidate,
            rescored: scoreHeadline(candidate.headline, candidate.slot, candidate.sourceFeature),
          })),
        }));

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  appName: candidateSet.appName,
                  generatedAt: candidateSet.generatedAt,
                  slots: scored,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return {
          content: [{ type: 'text' as const, text: `Failed to score copy candidates: ${message}` }],
        };
      }
    },
  );

  server.tool(
    'appframe_select_copy_set',
    'Select the best copy candidate for each slot from a generated candidate set. The selected copy set should be reused across all concepts unless the user asks for a different narrative.',
    {
      candidateSetJson: z.string().describe('JSON output from appframe_generate_copy_candidates'),
    },
    async ({ candidateSetJson }) => {
      try {
        const candidateSet = parseJsonInput<CopyCandidateSet>('candidateSetJson', candidateSetJson);
        const selected = selectCopySet(candidateSet);

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(selected, null, 2),
            },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return {
          content: [{ type: 'text' as const, text: `Failed to select copy set: ${message}` }],
        };
      }
    },
  );

  server.tool(
    'appframe_materialize_variant_plan',
    'Materialize a planned variant set into real AppFrame YAML config files. Use this after appframe_plan_variant_set to turn concept plans into renderable current-AppFrame configs.',
    {
      planJson: z
        .string()
        .describe(
          'The JSON output from appframe_plan_variant_set or equivalent VariantSetPlan JSON',
        ),
      outputDir: z.string().describe('Absolute directory where config files should be written'),
      primaryColor: z.string().optional().describe('Optional primary brand color override'),
      secondaryColor: z.string().optional().describe('Optional secondary brand color override'),
      font: z.string().optional().describe('Optional font override'),
      assetImagePath: z
        .string()
        .optional()
        .describe(
          'Optional absolute path to a logo or supporting image asset for panoramic concepts',
        ),
      manifestPath: z
        .string()
        .optional()
        .describe('Optional absolute path for the generated manifest JSON'),
      selectedCopySetJson: z
        .string()
        .optional()
        .describe('Optional SelectedCopySet JSON used to materialize real copy into the configs'),
    },
    async ({
      planJson,
      outputDir,
      primaryColor,
      secondaryColor,
      font,
      assetImagePath,
      manifestPath,
      selectedCopySetJson,
    }) => {
      try {
        const plan = JSON.parse(planJson) as Awaited<ReturnType<typeof buildVariantSetPlan>>;
        const selectedCopySet = selectedCopySetJson
          ? parseJsonInput<SelectedCopySet>('selectedCopySetJson', selectedCopySetJson)
          : undefined;
        const result = await materializeVariantPlan({
          plan,
          outputDir,
          primaryColor,
          secondaryColor,
          font,
          assetImagePath,
          manifestPath,
          selectedCopySet,
        });

        const lines = result.variants.map(
          (variant) => `- ${variant.id} (${variant.mode}): ${variant.configPath}`,
        );
        return {
          content: [
            {
              type: 'text' as const,
              text: `Materialized ${result.variants.length} variants.\nManifest: ${result.manifestPath}\n\n${lines.join('\n')}`,
            },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to materialize variant plan: ${message}`,
            },
          ],
        };
      }
    },
  );

  server.tool(
    'appframe_run_autopilot',
    'Run the full AppFrame autopilot pipeline: analyze screenshots, generate/select copy, plan 4 concepts, materialize configs, create a variant session, render previews, score variants, and return a preview-ready session path.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Short product description'),
      platforms: z.array(z.enum(['ios', 'android'])).describe('Target platforms'),
      features: z.array(z.string()).min(1).describe('Prioritized features'),
      screenshots: z
        .array(
          z.object({
            path: z.string().describe('Absolute path to a raw screenshot'),
            note: z.string().optional().describe('Optional note about what the screenshot shows'),
          }),
        )
        .min(1)
        .describe('Raw screenshot inventory'),
      goals: z.array(z.string()).optional().describe('Optional marketing goals'),
      primaryColor: z.string().optional().describe('Optional primary brand color'),
      secondaryColor: z.string().optional().describe('Optional secondary brand color'),
      font: z.string().optional().describe('Optional font override'),
      assetImagePath: z.string().optional().describe('Optional logo or supporting asset'),
      outputDir: z.string().optional().describe('Optional output directory for autopilot artifacts'),
      sessionPath: z.string().optional().describe('Optional output path for the variant session JSON'),
      manifestPath: z.string().optional().describe('Optional output path for the materialized manifest JSON'),
      screenCount: z.number().min(3).max(10).optional().describe('Optional screen count to plan'),
      variantCount: z.number().min(4).max(5).default(4).describe('How many concepts to produce'),
      resumeFrom: z.enum(AUTOPILOT_STAGES).optional().describe('Optional stage to resume from using saved artifacts'),
      forceStages: z
        .array(z.enum(AUTOPILOT_STAGES))
        .optional()
        .describe('Optional stages to force-regenerate, along with any downstream stages'),
    },
    async ({
      appName,
      appDescription,
      platforms,
      features,
      screenshots,
      goals,
      primaryColor,
      secondaryColor,
      font,
      assetImagePath,
      outputDir,
      sessionPath,
      manifestPath,
      screenCount,
      variantCount,
      resumeFrom,
      forceStages,
    }) => {
      try {
        const runStatus = await runAutopilotPipeline({
          appName,
          appDescription,
          platforms,
          features,
          screenshots,
          goals,
          primaryColor,
          secondaryColor,
          font,
          assetImagePath,
          outputDir,
          sessionPath,
          manifestPath,
          screenCount,
          variantCount,
          resumeFrom,
          forceStages,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(runStatus, null, 2),
            },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return {
          content: [{ type: 'text' as const, text: `Failed to run autopilot: ${message}` }],
        };
      }
    },
  );

  server.tool(
    'appframe_create_design_brief',
    'Create a structured design brief and concept plan for AI-driven App Store screenshot generation. Use this before generating variants when the agent needs an explicit brief, concept set, evaluation rubric, and implementation priorities.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Short product description'),
      platforms: z.array(z.enum(['ios', 'android'])).describe('Target platforms'),
      features: z.array(z.string()).describe('Key product features or selling points'),
      screenshots: z
        .array(
          z.object({
            path: z.string().describe('Path to a raw app screenshot'),
            note: z.string().optional().describe('Optional note about what the screenshot shows'),
          }),
        )
        .describe('Available raw screenshots'),
      goals: z
        .array(z.string())
        .optional()
        .describe('What the user wants the screenshots to emphasize'),
      brandColors: z.array(z.string()).optional().describe('Known brand colors as hex values'),
      references: z.array(z.string()).optional().describe('Reference styles or URLs'),
      variantCount: z.number().min(2).max(5).default(4).describe('How many concepts to plan'),
    },
    async ({
      appName,
      appDescription,
      platforms,
      features,
      screenshots,
      goals,
      brandColors,
      references,
      variantCount,
    }) => {
      const category = inferCategory(appDescription, features);
      const variants = buildVariantPlans(variantCount, features, screenshots.length);
      const visualGoals = dedupe([
        ...(goals ?? []),
        'Readable at thumbnail size',
        'One idea per slide',
        'Clear visual hierarchy',
      ]);

      const assetNeeds = dedupe([
        'App icon in transparent PNG or SVG',
        brandColors && brandColors.length > 0
          ? 'Verified brand color palette'
          : 'Primary and secondary brand colors',
        screenshots.length < 4 ? 'More screenshot coverage across the core product flow' : '',
        'Optional supporting assets: logo lockup, badges, rating proof, or textured graphics',
      ]);

      const capabilityAreas = [
        {
          name: 'Richer Scene Graph',
          status: 'in_progress',
          next: 'Use panoramic image elements for logos, supporting artwork, and layered editorial assets.',
        },
        {
          name: 'Design Recipe System',
          status: 'planned',
          next: 'Map concepts onto explicit recipes like clean-hero, stacked-cards, and cinematic-panoramic.',
        },
        {
          name: 'Screenshot Understanding',
          status: 'planned',
          next: 'Analyze screenshots for focal points, whitespace, and collision-free copy zones.',
        },
        {
          name: 'Generate-Then-Rank Loop',
          status: 'planned',
          next: 'Render multiple candidate concepts, then score for readability and diversity.',
        },
        {
          name: 'Real Agent Tooling',
          status: 'in_progress',
          next: 'Use this design brief as the planning layer ahead of variant generation and approval.',
        },
      ];

      const output = {
        app: {
          name: appName,
          description: appDescription,
          category,
          platforms,
        },
        screenshotInventory: screenshots.map((s, index) => ({
          index: index + 1,
          path: s.path,
          note: s.note ?? null,
        })),
        designObjectives: visualGoals,
        assetNeeds,
        references: references ?? [],
        brandColors: brandColors ?? [],
        conceptPlans: variants,
        evaluationRubric: [
          'Headline remains readable at thumbnail size.',
          'Text does not collide with dense UI regions.',
          'Each slide sells exactly one idea.',
          'The concept set is visually differentiated, not superficial recolors.',
          'The chosen visuals match the app category and brand tone.',
        ],
        implementationWorkstreams: capabilityAreas,
      };

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(output, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    'appframe_suggest_copy',
    'Suggest promotional headlines and subtitles for App Store screenshots based on app metadata. Returns a copywriting framework and guidelines that should be used to generate copy for user review.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Description of what the app does'),
      features: z.array(z.string()).describe('Key features of the app'),
      screenCount: z.number().describe('Number of screenshot screens to generate copy for'),
      locale: z
        .string()
        .optional()
        .describe('Target language (e.g., "en", "es", "pt"). Default: English'),
      tone: z
        .string()
        .optional()
        .describe('Desired tone: professional, casual, bold, playful, minimal'),
    },
    async ({ appName, appDescription, features, screenCount, locale, tone }) => {
      const language = locale ?? 'en';
      const toneGuide = tone ?? 'professional';

      const prompt = `Generate ${screenCount} promotional headline/subtitle pairs for "${appName}" App Store screenshots.

App: ${appName}
Description: ${appDescription}
Features: ${features.join(', ')}
Language: ${language}
Tone: ${toneGuide}

## Copywriting Framework

Use one of these three approaches per headline:

1. **Paint a moment** — The reader pictures themselves doing it.
   Example: "Check your coffee without opening the app."

2. **State an outcome** — What life looks like after using the app.
   Example: "A home for every coffee you buy."

3. **Kill a pain** — Name a problem and destroy it.
   Example: "Never waste a great bag of coffee."

## Iron Rules

- One idea per headline. Never join two things with "and."
- Short, common words. 1-2 syllables. No jargon unless domain-specific.
- 3-5 words per line. Must be readable at thumbnail size in the App Store.
- Line breaks are intentional — use \\n to control where lines break.
- Subtitles are optional. When used, they add context (6-12 words).

## What NEVER Works

- Feature lists: "Log every item with tags, categories, and notes"
- Two ideas with "and": "Track X and never miss Y"
- Vague aspirational: "Every item, tracked"
- Marketing buzzwords: "AI-powered tips" (unless it genuinely is AI)
- Generic CTAs: "Download now" or "Try it today"

## Slide Narrative Arc

| Slot | Purpose |
|------|---------|
| #1 | Hero — app's main benefit, the one thing it does best |
| #2 | Differentiator — what makes it unique vs alternatives |
| #3 | Ecosystem — widgets, watch, extensions (skip if N/A) |
| #4+ | Core features — one per slide, most important first |
| 2nd to last | Trust signal — "made for people who [X]" |
| Last | Summary — remaining features or coming soon |

## Output Format

Return suggestions as a JSON array. For each slide, provide 2 options using different approaches:
[
  {
    "slide": 1,
    "feature": "which feature this highlights",
    "option_a": { "headline": "...", "subtitle": "...", "approach": "paint a moment|state an outcome|kill a pain" },
    "option_b": { "headline": "...", "subtitle": "...", "approach": "paint a moment|state an outcome|kill a pain" }
  },
  ...
]`;

      return {
        content: [
          {
            type: 'text' as const,
            text: prompt,
          },
        ],
      };
    },
  );

  server.tool(
    'appframe_suggest_theme',
    'Suggest a visual theme (colors, style, font) for an app based on its character. Returns a theme config that should be reviewed by the user.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Description of the app'),
      appCategory: z
        .string()
        .describe('App category (e.g., finance, games, productivity, health, social)'),
      existingBrandColors: z
        .array(z.string())
        .optional()
        .describe('Existing brand colors as hex values'),
      preference: z.string().optional().describe('Style preference hint from user'),
    },
    async ({ appName, appDescription, appCategory, existingBrandColors, preference }) => {
      const prompt = `Suggest a visual theme for "${appName}" App Store screenshots.

App: ${appName}
Description: ${appDescription}
Category: ${appCategory}
${existingBrandColors ? `Brand colors: ${existingBrandColors.join(', ')}` : 'No existing brand colors'}
${preference ? `User preference: ${preference}` : ''}

Choose from these template styles:
- minimal: Clean, light, Apple-style. Best for: productivity, finance, health, utilities
- bold: Vibrant gradients, big text. Best for: social, entertainment, lifestyle
- glow: Premium, sleek, glowing accents on dark backgrounds. Best for: finance, pro tools, music, photography
- playful: Colorful, fun shapes. Best for: games, education, kids, casual
- clean: Zero decoration, huge screenshot, just text + device. Best for: any app wanting a modern, no-frills look (like YouTube, Uber, Base)
- branded: Strong brand color background, large device. Best for: apps with a strong brand identity (like Vipps, FINN, Blocket)
- editorial: Elegant, muted tones, refined typography. Best for: lifestyle, wellness, premium apps (like Lively, Tiimo, BankID)

Available fonts: inter, space-grotesk, poppins, montserrat, dm-sans, plus-jakarta-sans, raleway, playfair-display

Return a theme config as JSON:
{
  "style": "minimal|bold|glow|playful|clean|branded|editorial",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "background": "#hex",
    "text": "#hex",
    "subtitle": "#hex"
  },
  "font": "inter|space-grotesk|poppins|montserrat|dm-sans|plus-jakarta-sans|raleway|playfair-display",
  "fontWeight": 600,
  "reasoning": "Why this theme fits the app"
}`;

      return {
        content: [
          {
            type: 'text' as const,
            text: prompt,
          },
        ],
      };
    },
  );

  server.tool(
    'appframe_generate_variants',
    'Generate 4 complete appframe config variants with the default AppFrame concept mix: 2 individual concepts and 2 panoramic concepts. Returns YAML config guidance for each variant.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Short description of the app'),
      platforms: z.array(z.enum(['ios', 'android'])).describe('Target platforms'),
      features: z.array(z.string()).describe('Key features of the app'),
      screens: z
        .array(
          z.object({
            screenshot: z.string().describe('Path to screenshot file'),
            headline: z.string().describe('Headline text'),
            subtitle: z.string().optional().describe('Optional subtitle'),
          }),
        )
        .describe('Screen definitions with headlines'),
      primaryColor: z.string().optional().describe('Primary brand color as hex'),
      secondaryColor: z.string().optional().describe('Secondary brand color as hex'),
      font: z.string().optional().describe('Preferred font'),
      variantCount: z
        .number()
        .min(4)
        .max(5)
        .default(4)
        .describe('Number of variants to generate (default 4)'),
    },
    async ({
      appName,
      appDescription,
      platforms,
      features,
      screens,
      primaryColor,
      secondaryColor,
      font,
      variantCount,
    }) => {
      const prompt = `Generate ${variantCount} complete appframe YAML config variants for "${appName}".

App: ${appName}
Description: ${appDescription}
Platforms: ${platforms.join(', ')}
Features: ${features.join(', ')}
${primaryColor ? `Primary color: ${primaryColor}` : ''}
${secondaryColor ? `Secondary color: ${secondaryColor}` : ''}
${font ? `Font: ${font}` : ''}

Screens (${screens.length} total):
${screens.map((s, i) => `  ${i + 1}. "${s.headline}"${s.subtitle ? ` — "${s.subtitle}"` : ''} [${s.screenshot}]`).join('\n')}

## Generate These Variants

### Variant A: Clean & Safe
- Style: \`minimal\` or \`clean\`
- All screens use \`layout: center\`, \`composition: single\`
- Light, consistent background across all slides
- Safe, professional look
- Font weight: 600

### Variant B: Dynamic Individual
- Style: \`bold\` or \`glow\`
- Keep it in \`individual\` mode
- Use more dramatic visual presence and stronger contrast
- Frameless is allowed, but must use rounded corners
- Font weight: 700-800

### Variant C: Editorial Panorama
- Mode: \`panoramic\`
- Style: \`editorial\`
- Premium connected sequence with stronger whitespace
- More refined, slower pacing across the strip

### Variant D: Bold Panorama
- Mode: \`panoramic\`
- Style: \`branded\` or \`bold\`
- Stronger brand color, larger transitions, campaign-like energy

## Output Format

Return each variant as a complete, valid appframe YAML config block. Separate variants with:
--- VARIANT A ---
(yaml)
--- VARIANT B ---
(yaml)
--- VARIANT C ---
(yaml)
--- VARIANT D ---
(yaml)

Each config must include: app, theme, frames, screens, output sections.
Each screen must include: screenshot, headline, layout, composition.
Vary the compositions and per-screen backgrounds between variants.
The headlines and subtitles should be identical across variants — only the visual design changes.`;

      return {
        content: [
          {
            type: 'text' as const,
            text: prompt,
          },
        ],
      };
    },
  );
}
