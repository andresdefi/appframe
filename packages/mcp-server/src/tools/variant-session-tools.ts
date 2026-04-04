import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  registerSessionReviewRebuildHandler,
  registerSessionReviewRefreshHandler,
  startPreviewServer,
} from '@appframe/web-preview';
import {
  generatePanoramicScreenshots,
  generateScreenshots,
  loadConfig,
  validateConfig,
} from '@appframe/core';
import type { AppframeConfig, PanoramicElement, TemplateStyle } from '@appframe/core';
import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { parse, stringify } from 'yaml';
import {
  buildVariantCopyAssignments,
  createSessionFromManifest,
  defaultSessionPath,
  makeId,
  readSession,
  recordPreviewArtifacts,
  recordVariantScores,
  slugify,
  writeSession,
  type VariantExportArtifact,
  type VariantPreviewArtifact,
  type VariantSessionFile,
  type VariantSessionVariant,
} from './variant-session-lib.js';
import { buildVariantSetPlanFromAnalysis, type VariantSetPlan } from './design-planning.js';
import { materializeVariantPlan } from './plan-materializer.js';
import { scoreVariantSet, type ModelAssistedVisualRanking } from './preview-scoring.js';
import {
  requestVisualModelRanking,
  type VisualModelScoringStatus,
} from './visual-model-ranking.js';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

type VariantArtifact = VariantExportArtifact;
type PortProbeResult = { available: boolean; error?: NodeJS.ErrnoException };

interface ReviewRebuildOptions {
  sessionPath: string;
  branchVariants?: boolean;
}

interface ReviewRefreshOptions extends ReviewRebuildOptions {
  platform?: string;
  useAiVisualScoring?: boolean;
}

async function probePort(port: number): Promise<PortProbeResult> {
  return new Promise((resolve) => {
    const server = createServer();
    server.once('error', (error: NodeJS.ErrnoException) => {
      resolve({ available: false, error });
    });
    server.once('listening', () => {
      server.close(() => resolve({ available: true }));
    });
    server.listen(port);
  });
}

export async function openPreviewSession(args: {
  sessionPath?: string;
  configPath?: string;
  port?: number;
}): Promise<{
  url: string;
  port: number;
  sessionPath: string | null;
  configPath: string | null;
}> {
  const port = args.port ?? 4400;
  if (Number.isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid port "${String(args.port)}". Must be a number between 1 and 65535.`);
  }
  if (!args.sessionPath && !args.configPath) {
    throw new Error('Preview launch requires either a sessionPath or a configPath.');
  }

  const portProbe = await probePort(port);
  if (!portProbe.available) {
    if (portProbe.error?.code === 'EADDRINUSE') {
      throw new Error(`Port ${port} is already in use.`);
    }
    throw new Error(`Failed to bind preview server on port ${port}: ${portProbe.error?.message ?? 'Unknown error'}`);
  }

  await startPreviewServer({
    configPath: args.configPath,
    sessionPath: args.sessionPath,
    port,
  });

  return {
    url: `http://localhost:${port}`,
    port,
    sessionPath: args.sessionPath ?? null,
    configPath: args.configPath ?? null,
  };
}

function ensureValidConfig(config: AppframeConfig, label: string): AppframeConfig {
  const result = validateConfig(config);
  if (!result.success) {
    const message = result.errors.map((error) => `${error.path}: ${error.message}`).join('; ');
    throw new Error(`${label} is invalid: ${message}`);
  }
  return result.config;
}

function getDynamicStyle(baseStyle: TemplateStyle): TemplateStyle {
  switch (baseStyle) {
    case 'minimal':
    case 'clean':
      return 'bold';
    case 'bold':
      return 'editorial';
    case 'editorial':
      return 'branded';
    case 'branded':
      return 'clean';
    case 'glow':
      return 'minimal';
    case 'playful':
      return 'branded';
    default:
      return 'bold';
  }
}

function createDynamicIndividualVariant(source: AppframeConfig): AppframeConfig {
  const config = clone(source);
  config.mode = 'individual';
  delete config.panoramic;
  delete config.frameCount;

  config.theme.style = getDynamicStyle(config.theme.style);
  config.theme.fontWeight = Math.max(config.theme.fontWeight ?? 600, 700);

  const layouts = ['center', 'angled-right', 'angled-left', 'center'] as const;
  config.screens = config.screens.map((screen, index) => ({
    ...screen,
    layout: screen.layout ?? layouts[index % layouts.length],
    composition: 'single',
    autoSizeHeadline: screen.autoSizeHeadline ?? true,
    autoSizeSubtitle: screen.autoSizeSubtitle ?? false,
  }));

  return ensureValidConfig(config, 'Dynamic individual variant');
}

function buildPanoramicElementsFromScreens(config: AppframeConfig): PanoramicElement[] {
  const screenCount = Math.max(config.screens.length, 2);
  const frame = config.frames.ios ?? config.frames.android;
  const textColor = config.theme.colors.text ?? '#0F172A';
  const subtitleColor = config.theme.colors.subtitle ?? '#64748B';
  const elements: PanoramicElement[] = [];

  for (let i = 0; i < screenCount; i++) {
    const screen = config.screens[i] ?? config.screens[config.screens.length - 1];
    if (!screen) continue;

    const frameSliceStart = (i / screenCount) * 100;
    const frameCenter = frameSliceStart + (100 / screenCount) / 2;

    elements.push({
      type: 'device',
      screenshot: screen.screenshot,
      localeSourceScreen: i < config.screens.length ? i : undefined,
      frame,
      frameStyle: config.frames.style,
      x: frameCenter - 7,
      y: 22,
      width: 14,
      rotation: 0,
      deviceScale: 92,
      deviceTop: 15,
      deviceOffsetX: 0,
      deviceAngle: 8,
      deviceTilt: 0,
      cornerRadius: 0,
      fullscreenScreenshot: false,
      z: 5,
    });

    elements.push({
      type: 'text',
      content: screen.headline,
      localeSourceScreen: i < config.screens.length ? i : undefined,
      localeSourceField: 'headline',
      x: frameSliceStart + 4,
      y: 6,
      fontSize: 3.8,
      color: textColor,
      fontWeight: config.theme.fontWeight ?? 700,
      fontStyle: 'normal',
      textAlign: 'left',
      lineHeight: 1.1,
      maxWidth: Math.max(12, Math.floor(100 / screenCount) - 6),
      letterSpacing: 0,
      textTransform: '',
      rotation: 0,
      z: 10,
    });

    if (screen.subtitle) {
      elements.push({
        type: 'label',
        content: screen.subtitle,
        localeSourceScreen: i < config.screens.length ? i : undefined,
        localeSourceField: 'subtitle',
        x: frameSliceStart + 4,
        y: 18,
        fontSize: 1.6,
        color: subtitleColor,
        backgroundColor: undefined,
        padding: 0,
        borderRadius: 0,
        z: 11,
      });
    }
  }

  return elements;
}

function createPanoramicStoryboardVariant(source: AppframeConfig): AppframeConfig {
  const config = clone(source);

  if (config.mode === 'panoramic' && config.panoramic && config.frameCount) {
    config.theme.style = config.theme.style === 'editorial' ? 'clean' : 'editorial';
    config.theme.fontWeight = Math.min(Math.max(config.theme.fontWeight ?? 600, 600), 700);
    return ensureValidConfig(config, 'Panoramic variant');
  }

  if (config.screens.length === 0) {
    throw new Error('Cannot build a panoramic storyboard variant without screens');
  }

  config.mode = 'panoramic';
  config.frameCount = Math.max(config.screens.length, 2);
  config.theme.style = config.theme.style === 'editorial' ? 'clean' : 'editorial';
  config.theme.fontWeight = Math.min(Math.max(config.theme.fontWeight ?? 600, 600), 700);
  config.panoramic = {
    background: {
      type: 'solid',
      color: config.theme.colors.background ?? '#F8FAFC',
    },
    elements: buildPanoramicElementsFromScreens(config),
  };

  return ensureValidConfig(config, 'Panoramic storyboard variant');
}

function summarizeVariant(variant: VariantSessionVariant): string {
  const mode = variant.config.mode === 'panoramic' ? 'panoramic' : 'individual';
  const screenCount = variant.config.mode === 'panoramic'
    ? `${variant.config.frameCount ?? 0} frames`
    : `${variant.config.screens.length} screens`;
  return `- ${variant.id}: ${variant.name} [${variant.status}] (${mode}, ${screenCount}, ${variant.artifacts.length} exports)`;
}

function nextReviewedBranchId(
  variants: VariantSessionVariant[],
  baseVariantId: string,
): string {
  let index = 1;
  let candidate = `${baseVariantId}-review-${index}`;
  while (variants.some((variant) => variant.id === candidate)) {
    index += 1;
    candidate = `${baseVariantId}-review-${index}`;
  }
  return candidate;
}

function nextReviewedBranchName(
  variants: VariantSessionVariant[],
  baseName: string,
): string {
  const rootName = `${baseName} Reviewed`;
  if (!variants.some((variant) => variant.name === rootName)) {
    return rootName;
  }

  let index = 2;
  let candidate = `${rootName} ${index}`;
  while (variants.some((variant) => variant.name === candidate)) {
    index += 1;
    candidate = `${rootName} ${index}`;
  }
  return candidate;
}

function createSessionVariants(config: AppframeConfig, variantCount: number): VariantSessionVariant[] {
  const secondConceptConfig = config.mode === 'panoramic' || config.screens.length === 0
    ? createPanoramicStoryboardVariant(config)
    : createDynamicIndividualVariant(config);
  const secondConceptDescription = config.mode === 'panoramic' || config.screens.length === 0
    ? 'An alternate panoramic concept derived from the source storyboard.'
    : 'A more visually dynamic individual concept using safer single-device rendering.';

  const variants: VariantSessionVariant[] = [
    {
      id: 'concept-a',
      name: 'Concept A',
      description: 'Original concept seeded from the source config.',
      status: 'draft',
      config: ensureValidConfig(clone(config), 'Concept A'),
      artifacts: [],
      history: [{
        id: makeId('history'),
        createdAt: new Date().toISOString(),
        type: 'created',
        label: 'Variant created from source config',
      }],
      provenance: { origin: 'manual', branchDepth: 0, note: 'Seeded from the source config.' },
    },
    {
      id: 'concept-b',
      name: 'Concept B',
      description: secondConceptDescription,
      status: 'draft',
      config: secondConceptConfig,
      artifacts: [],
      history: [{
        id: makeId('history'),
        createdAt: new Date().toISOString(),
        type: 'created',
        label: 'Variant created as an alternate concept',
      }],
      provenance: { origin: 'manual', branchDepth: 0, note: secondConceptDescription },
    },
  ];

  if (variantCount === 3) {
    variants.push({
      id: 'concept-c',
      name: 'Concept C',
      description: 'A panoramic storyboard concept derived from the source screens.',
      status: 'draft',
      config: createPanoramicStoryboardVariant(config),
      artifacts: [],
      history: [{
        id: makeId('history'),
        createdAt: new Date().toISOString(),
        type: 'created',
        label: 'Variant created as a panoramic storyboard concept',
      }],
      provenance: { origin: 'manual', branchDepth: 0, note: 'Derived from the source screens.' },
    });
  }

  return variants;
}

async function writeTemporaryConfig(sourceConfigPath: string, variantId: string, config: AppframeConfig): Promise<string> {
  const tempPath = join(dirname(sourceConfigPath), `.appframe-${variantId}-${Date.now()}.yml`);
  await writeFile(tempPath, stringify(config), 'utf-8');
  return tempPath;
}

export async function renderVariantPreviews(args: {
  sessionPath: string;
  outputDir?: string;
  platform?: string;
  variantIds?: string[];
}): Promise<{
  sessionPath: string;
  previewArtifacts: Array<{ variantId: string; filePaths: string[]; thumbnailPath: string | null }>;
}> {
  const session = await readSession(args.sessionPath);
  const variantIdSet = args.variantIds && args.variantIds.length > 0
    ? new Set(args.variantIds)
    : null;
  const variantsToRender = variantIdSet
    ? session.variants.filter((variant) => variantIdSet.has(variant.id))
    : session.variants;
  const previewArtifacts: Array<{ variantId: string; artifact: VariantPreviewArtifact }> = [];

  for (const variant of variantsToRender) {
    const variantOutputDir = join(
      args.outputDir ?? join(dirname(args.sessionPath), 'preview-artifacts'),
      slugify(variant.name),
    );
    const tempConfigPath = await writeTemporaryConfig(session.sourceConfigPath, `${variant.id}-preview`, variant.config);

    try {
      const result = variant.config.mode === 'panoramic'
        ? await generatePanoramicScreenshots({
            configPath: tempConfigPath,
            outputDir: variantOutputDir,
            platform: args.platform,
          })
        : await generateScreenshots({
            configPath: tempConfigPath,
            outputDir: variantOutputDir,
            platform: args.platform,
            screenIndex: 0,
          });

      previewArtifacts.push({
        variantId: variant.id,
        artifact: {
          id: makeId('preview'),
          createdAt: new Date().toISOString(),
          outputDir: variantOutputDir,
          mode: variant.config.mode === 'panoramic' ? 'panoramic' : 'individual',
          platform: args.platform ?? 'ios',
          filePaths: result.screenshots.map((shot) => shot.outputPath),
          thumbnailPath: result.screenshots[0]?.outputPath ?? null,
        },
      });
    } finally {
      await rm(tempConfigPath, { force: true });
    }
  }

  await recordPreviewArtifacts(args.sessionPath, previewArtifacts);

  return {
    sessionPath: args.sessionPath,
    previewArtifacts: previewArtifacts.map((entry) => ({
      variantId: entry.variantId,
      filePaths: entry.artifact.filePaths,
      thumbnailPath: entry.artifact.thumbnailPath,
    })),
  };
}

export async function scoreVariantPreviews(args: {
  sessionPath: string;
  visualRanking?: ModelAssistedVisualRanking[];
  useAiVisualScoring?: boolean;
}): Promise<{
  sessionPath: string;
  recommendedVariantId: string | null;
  recommendationReason: string | null;
  scores: Array<{ variantId: string; total: number }>;
  aiVisualScoring: VisualModelScoringStatus;
}> {
  const session = await readSession(args.sessionPath);
  const liveVisualRanking = await requestVisualModelRanking({
    enabled: args.useAiVisualScoring,
    variants: session.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      config: variant.config,
      previewFilePaths: variant.previewArtifacts?.flatMap((artifact) => artifact.filePaths) ?? [],
    })),
  });
  const rankingByVariantId = new Map<string, ModelAssistedVisualRanking>();
  for (const ranking of liveVisualRanking.rankings) {
    rankingByVariantId.set(ranking.variantId, ranking);
  }
  for (const ranking of args.visualRanking ?? []) {
    rankingByVariantId.set(ranking.variantId, ranking);
  }

  const scoring = scoreVariantSet(
    session.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      config: variant.config,
      previewCount: variant.previewArtifacts?.length ?? 0,
      previewFilePaths: variant.previewArtifacts?.flatMap((artifact) => artifact.filePaths) ?? [],
    })),
    {
      visualRanking: rankingByVariantId.size > 0 ? Array.from(rankingByVariantId.values()) : undefined,
    },
  );

  await recordVariantScores(args.sessionPath, {
    scores: scoring.scored.map((variant) => ({
      variantId: variant.id,
      score: variant.score,
    })),
    recommendedVariantId: scoring.recommendedVariantId,
    recommendationReason: scoring.recommendationReason,
  });

  return {
    sessionPath: args.sessionPath,
    recommendedVariantId: scoring.recommendedVariantId,
    recommendationReason: scoring.recommendationReason,
    scores: scoring.scored.map((variant) => ({
      variantId: variant.id,
      total: variant.score.total,
    })),
    aiVisualScoring: liveVisualRanking.status,
  };
}

function parseMaterializedConfigText(raw: string): AppframeConfig {
  const normalized = raw.replace(/^#.*\n/, '');
  return ensureValidConfig(parse(normalized) as AppframeConfig, 'Materialized config');
}

async function loadMaterializedConfigsFromManifest(manifestPath: string): Promise<Map<string, AppframeConfig>> {
  const rawManifest = JSON.parse(await readFile(manifestPath, 'utf-8')) as {
    variants?: Array<{ id?: string; configPath?: string }>;
  };
  const configs = new Map<string, AppframeConfig>();

  for (const variant of rawManifest.variants ?? []) {
    if (typeof variant.id !== 'string' || typeof variant.configPath !== 'string') continue;
    const rawConfig = await readFile(variant.configPath, 'utf-8');
    configs.set(variant.id, parseMaterializedConfigText(rawConfig));
  }

  return configs;
}

async function inferAssetImagePath(args: {
  session: VariantSessionFile;
  manifestPath: string;
}): Promise<string | undefined> {
  const rawManifest = JSON.parse(await readFile(args.manifestPath, 'utf-8')) as {
    variants?: Array<{ id?: string; configPath?: string }>;
  };
  const configPathById = new Map(
    (rawManifest.variants ?? [])
      .flatMap((variant) => (
        typeof variant.id === 'string' && typeof variant.configPath === 'string'
          ? [[variant.id, variant.configPath] as const]
          : []
      )),
  );

  for (const variant of args.session.variants) {
    if (variant.config.mode !== 'panoramic') continue;
    const logo = variant.config.panoramic?.elements.find((element) => element.type === 'logo');
    const configPath = configPathById.get(variant.id);
    if (!logo || typeof logo.src !== 'string' || logo.src.length === 0 || !configPath) continue;
    return logo.src.startsWith('/') ? logo.src : join(dirname(configPath), logo.src);
  }

  return undefined;
}

export async function rebuildAutopilotSessionFromReview(args: ReviewRebuildOptions): Promise<{
  sessionPath: string;
  manifestPath: string;
  updatedVariantIds: string[];
  clearedPreviewVariantIds: string[];
  recommendationReason: string;
  plan: VariantSetPlan;
}> {
  const session = await readSession(args.sessionPath);
  const branchVariants = args.branchVariants === true;
  const autopilot = session.autopilot;
  if (!autopilot || autopilot.mode !== 'autopilot') {
    throw new Error('Session does not contain autopilot metadata to rebuild from review state.');
  }
  if (!autopilot.manifestPath) {
    throw new Error('Autopilot session is missing manifestPath.');
  }
  if (!autopilot.conceptPlan) {
    throw new Error('Autopilot session is missing conceptPlan metadata.');
  }
  if (!autopilot.screenshotAnalysis || autopilot.screenshotAnalysis.length === 0) {
    throw new Error('Autopilot session is missing screenshotAnalysis metadata.');
  }

  const plan = buildVariantSetPlanFromAnalysis({
    appName: autopilot.conceptPlan.app.name,
    appDescription: autopilot.conceptPlan.app.description,
    platforms: autopilot.conceptPlan.app.platforms,
    analysis: autopilot.screenshotAnalysis,
    goals: autopilot.conceptPlan.goals,
    variantCount: autopilot.conceptPlan.variants.length,
    screenCount:
      autopilot.conceptPlan.analysisSummary.selectedCount
      || autopilot.conceptPlan.selectedScreens.length,
    category: autopilot.conceptPlan.app.category,
  });
  const plannedVariantIds = plan.variants.map((variant) => variant.id);
  const plannedVariantIdSet = new Set(plannedVariantIds);
  const plannedVariantById = new Map(plan.variants.map((variant) => [variant.id, variant]));
  const existingAutopilotVariant = session.variants.find((variant) => plannedVariantIdSet.has(variant.id));
  const assetImagePath = await inferAssetImagePath({
    session,
    manifestPath: autopilot.manifestPath,
  });
  const materialized = await materializeVariantPlan({
    plan,
    outputDir: join(dirname(autopilot.manifestPath), 'configs'),
    manifestPath: autopilot.manifestPath,
    primaryColor: existingAutopilotVariant?.config.theme.colors.primary,
    secondaryColor: existingAutopilotVariant?.config.theme.colors.secondary,
    font: existingAutopilotVariant?.config.theme.font,
    assetImagePath,
    selectedCopySet: autopilot.selectedCopySet,
  });
  const materializedConfigs = await loadMaterializedConfigsFromManifest(materialized.manifestPath);
  const rebuildTimestamp = new Date().toISOString();
  const updatedVariantIds: string[] = [];
  let activeVariantId = session.activeVariantId;

  if (branchVariants) {
    const nextVariants = [...session.variants];
    const activeParentVariantId = plannedVariantIdSet.has(session.activeVariantId)
      ? session.activeVariantId
      : null;

    for (const plannedVariantId of plannedVariantIds) {
      const parentVariant = session.variants.find((variant) => variant.id === plannedVariantId);
      const plannedVariant = plannedVariantById.get(plannedVariantId);
      const nextConfig = materializedConfigs.get(plannedVariantId);
      if (!parentVariant || !plannedVariant || !nextConfig) continue;

      const branchId = nextReviewedBranchId(nextVariants, plannedVariantId);
      const branchName = nextReviewedBranchName(nextVariants, parentVariant.name);
      updatedVariantIds.push(branchId);

      if (activeParentVariantId === parentVariant.id) {
        activeVariantId = branchId;
      }

      nextVariants.push({
        ...parentVariant,
        id: branchId,
        name: branchName,
        description: plannedVariant.strategy,
        status: 'draft',
        config: nextConfig,
        artifacts: [],
        previewArtifacts: [],
        copyAssignments: buildVariantCopyAssignments(plannedVariant, autopilot.selectedCopySet),
        score: undefined,
        history: [
          {
            id: makeId('history'),
            createdAt: rebuildTimestamp,
            type: 'refined',
            label: 'Branched from reviewed screenshot families',
            detail: 'Created a fresh comparison branch from persisted screenshot semantic-family review state.',
            sourceVariantId: parentVariant.id,
          },
          ...(parentVariant.history ?? []),
        ],
        provenance: {
          origin: 'refinement',
          parentVariantId: parentVariant.id,
          parentVariantName: parentVariant.name,
          branchDepth: (parentVariant.provenance?.branchDepth ?? 0) + 1,
          note: 'Reviewed screenshot-family rebuild branch.',
        },
      });
    }

    session.variants = nextVariants;
  } else {
    session.variants = session.variants.map((variant) => {
      const plannedVariant = plannedVariantById.get(variant.id);
      const nextConfig = materializedConfigs.get(variant.id);
      if (!plannedVariant || !nextConfig) return variant;

      updatedVariantIds.push(variant.id);
      const rebuiltVariant = {
        ...variant,
        description: plannedVariant.strategy,
        status: 'draft' as const,
        config: nextConfig,
        previewArtifacts: [],
        copyAssignments: buildVariantCopyAssignments(plannedVariant, autopilot.selectedCopySet),
        score: undefined,
        history: [
          {
            id: makeId('history'),
            createdAt: rebuildTimestamp,
            type: 'saved' as const,
            label: 'Rebuilt from reviewed screenshot families',
            detail: 'Regenerated the autopilot concept from persisted screenshot semantic-family review state.',
          },
          ...(variant.history ?? []),
        ],
      } as VariantSessionVariant & { editorSnapshot?: unknown };
      rebuiltVariant.editorSnapshot = undefined;
      return rebuiltVariant;
    });
  }

  const recommendationReason = branchVariants
    ? 'Reviewed screenshot-family changes created fresh comparison branches. Rerender previews and rescore to compare them against existing concepts.'
    : 'Reviewed screenshot-family changes require fresh previews and rescoring.';
  session.autopilot = {
    ...autopilot,
    manifestPath: materialized.manifestPath,
    sourceScreenshots: autopilot.screenshotAnalysis.map((entry) => entry.path),
    conceptPlan: plan,
    recommendedVariantId: null,
    recommendationReason,
  };
  session.activeVariantId = activeVariantId;
  session.updatedAt = rebuildTimestamp;
  await writeSession(args.sessionPath, session);

  return {
    sessionPath: args.sessionPath,
    manifestPath: materialized.manifestPath,
    updatedVariantIds,
    clearedPreviewVariantIds: branchVariants ? [] : updatedVariantIds,
    recommendationReason,
    plan,
  };
}

export async function refreshAutopilotSessionFromReview(args: ReviewRefreshOptions): Promise<{
  sessionPath: string;
  manifestPath: string;
  updatedVariantIds: string[];
  clearedPreviewVariantIds: string[];
  recommendationReason: string;
  plan: VariantSetPlan;
  previewArtifacts: Array<{ variantId: string; filePaths: string[]; thumbnailPath: string | null }>;
  recommendedVariantId: string | null;
  scores: Array<{ variantId: string; total: number }>;
  aiVisualScoring: VisualModelScoringStatus;
}> {
  const rebuilt = await rebuildAutopilotSessionFromReview({
    sessionPath: args.sessionPath,
    branchVariants: args.branchVariants,
  });
  const rendered = await renderVariantPreviews({
    sessionPath: args.sessionPath,
    platform: args.platform,
    variantIds: rebuilt.updatedVariantIds,
  });
  const scored = await scoreVariantPreviews({
    sessionPath: args.sessionPath,
    useAiVisualScoring: args.useAiVisualScoring,
  });

  return {
    ...rebuilt,
    previewArtifacts: rendered.previewArtifacts,
    recommendedVariantId: scored.recommendedVariantId,
    recommendationReason: scored.recommendationReason ?? rebuilt.recommendationReason,
    scores: scored.scores,
    aiVisualScoring: scored.aiVisualScoring,
  };
}

export function registerPreviewSessionReviewHandlers(): void {
  registerSessionReviewRebuildHandler(rebuildAutopilotSessionFromReview);
  registerSessionReviewRefreshHandler(refreshAutopilotSessionFromReview);
}

export function registerVariantSessionTools(server: McpServer): void {
  registerPreviewSessionReviewHandlers();

  server.tool(
    'appframe_create_variant_session',
    'Create a file-backed appframe variant session from a base config. This is intended for agent workflows: it creates 2-3 explicit concepts, tracks the active concept, and stores approval/export history.',
    {
      configPath: z.string().describe('Absolute path to the base appframe.yml config file'),
      sessionPath: z.string().optional().describe('Optional absolute path for the variant session JSON file'),
      variantCount: z.number().min(2).max(3).default(3).describe('Number of concepts to create (2-3)'),
    },
    async ({ configPath, sessionPath, variantCount }) => {
      try {
        const config = await loadConfig(configPath);
        const resolvedSessionPath = sessionPath ?? defaultSessionPath(configPath);
        const timestamp = new Date().toISOString();
        const variants = createSessionVariants(config, variantCount);
        const session: VariantSessionFile = {
          version: 2,
          sourceConfigPath: configPath,
          createdAt: timestamp,
          updatedAt: timestamp,
          activeVariantId: variants[0]!.id,
          variants,
        };

        await writeSession(resolvedSessionPath, session);

        return {
          content: [{
            type: 'text' as const,
            text: `Variant session created at ${resolvedSessionPath}\n\nActive variant: ${session.activeVariantId}\n\n${variants.map(summarizeVariant).join('\n')}`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to create variant session: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_create_variant_session_from_manifest',
    'Create a file-backed variant session from a materialized variant manifest and optional autopilot metadata. Use this for AI-generated concept sets so the preview UI can load all concepts directly.',
    {
      manifestPath: z.string().describe('Absolute path to the materialized variant manifest JSON file'),
      sessionPath: z.string().optional().describe('Optional absolute session file output path'),
      screenshotAnalysisJson: z.string().optional().describe('Optional ScreenshotAnalysis[] JSON'),
      copyCandidatesJson: z.string().optional().describe('Optional CopyCandidateSet JSON'),
      selectedCopySetJson: z.string().optional().describe('Optional SelectedCopySet JSON'),
      conceptPlanJson: z.string().optional().describe('Optional VariantSetPlan JSON'),
      runManifestPath: z.string().optional().describe('Optional autopilot run manifest path'),
      previewCommand: z.string().optional().describe('Optional preview command for the agent to run'),
    },
    async ({
      manifestPath,
      sessionPath,
      screenshotAnalysisJson,
      copyCandidatesJson,
      selectedCopySetJson,
      conceptPlanJson,
      runManifestPath,
      previewCommand,
    }) => {
      try {
        const result = await createSessionFromManifest({
          manifestPath,
          sessionPath,
          screenshotAnalysis: screenshotAnalysisJson ? JSON.parse(screenshotAnalysisJson) : undefined,
          copyCandidates: copyCandidatesJson ? JSON.parse(copyCandidatesJson) : undefined,
          selectedCopySet: selectedCopySetJson ? JSON.parse(selectedCopySetJson) : undefined,
          conceptPlan: conceptPlanJson ? JSON.parse(conceptPlanJson) : undefined,
          runManifestPath,
          previewCommand,
        });

        return {
          content: [{
            type: 'text' as const,
            text: `Variant session created at ${result.sessionPath}\n\nActive variant: ${result.session.activeVariantId}\n\n${result.session.variants.map(summarizeVariant).join('\n')}`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to create session from manifest: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_render_variant_previews',
    'Render preview artifacts for every concept in a file-backed variant session and attach the preview images to the session metadata.',
    {
      sessionPath: z.string().describe('Absolute path to the variant session JSON file'),
      outputDir: z.string().optional().describe('Optional output directory for preview artifacts'),
      platform: z.enum(['ios', 'android', 'mac', 'watch']).optional().describe('Optional platform override'),
    },
    async ({ sessionPath, outputDir, platform }) => {
      try {
        const result = await renderVariantPreviews({ sessionPath, outputDir, platform });
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to render variant previews: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_rebuild_autopilot_session_from_review',
    'Rebuild an autopilot variant session from persisted screenshot semantic-family review state. This replans the concept set from reviewed screenshot analysis, rematerializes the configs, updates the session metadata, and clears stale preview-score recommendations so the refreshed concepts can be rerendered and rescored.',
    {
      sessionPath: z.string().describe('Absolute path to the autopilot variant session JSON file'),
    },
    async ({ sessionPath }) => {
      try {
        const result = await rebuildAutopilotSessionFromReview({ sessionPath });
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(
              {
                sessionPath: result.sessionPath,
                manifestPath: result.manifestPath,
                updatedVariantIds: result.updatedVariantIds,
                clearedPreviewVariantIds: result.clearedPreviewVariantIds,
                recommendationReason: result.recommendationReason,
                planVariantCount: result.plan.variants.length,
              },
              null,
              2,
            ),
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to rebuild autopilot session: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_open_preview_session',
    'Start the AppFrame web preview server directly for a variant session or config and return the live localhost URL.',
    {
      sessionPath: z.string().optional().describe('Absolute path to a variant session JSON file'),
      configPath: z.string().optional().describe('Absolute path to an AppFrame config file'),
      port: z.number().min(1).max(65535).optional().describe('Optional preview server port'),
    },
    async ({ sessionPath, configPath, port }) => {
      try {
        const result = await openPreviewSession({ sessionPath, configPath, port });
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to open preview session: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_score_variant_previews',
    'Score the variants in a file-backed variant session using rendered-preview heuristics, with optional model-assisted visual ranking inputs. Updates the session with per-concept scores and the recommended concept.',
    {
      sessionPath: z.string().describe('Absolute path to the variant session JSON file'),
      visualRanking: z.array(z.object({
        variantId: z.string(),
        score: z.number().min(0).max(100).optional(),
        rank: z.number().int().min(1).optional(),
        confidence: z.number().min(0).max(1).optional(),
        reason: z.string().optional(),
      })).optional().describe('Optional external visual-ranking signals to blend into the heuristic score.'),
      useAiVisualScoring: z.boolean().optional().describe('Attempt live visual scoring from rendered previews when OPENAI_API_KEY is available. Falls back safely to heuristic scoring.'),
    },
    async ({ sessionPath, visualRanking, useAiVisualScoring }) => {
      try {
        const result = await scoreVariantPreviews({ sessionPath, visualRanking, useAiVisualScoring });
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to score variant previews: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_recommend_variant',
    'Return the currently recommended variant from a file-backed session. If no recommendation exists yet, score the session first.',
    {
      sessionPath: z.string().describe('Absolute path to the variant session JSON file'),
    },
    async ({ sessionPath }) => {
      try {
        const session = await readSession(sessionPath);
        const recommended = session.autopilot?.recommendedVariantId
          ? session.variants.find((variant) => variant.id === session.autopilot?.recommendedVariantId)
          : null;

        if (!recommended || !session.autopilot?.recommendationReason) {
          const rescored = await scoreVariantPreviews({ sessionPath, useAiVisualScoring: true });
          return {
            content: [{
              type: 'text' as const,
              text: JSON.stringify(rescored, null, 2),
            }],
          };
        }

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(
              {
                recommendedVariantId: recommended.id,
                name: recommended.name,
                totalScore: recommended.score?.total ?? null,
                recommendationReason: session.autopilot.recommendationReason,
              },
              null,
              2,
            ),
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to recommend variant: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_list_variant_session',
    'List all variants in a file-backed appframe variant session, including which one is active and which one is approved.',
    {
      sessionPath: z.string().describe('Absolute path to the variant session JSON file'),
    },
    async ({ sessionPath }) => {
      try {
        const session = await readSession(sessionPath);
        return {
          content: [{
            type: 'text' as const,
            text: `Variant session: ${sessionPath}\nSource config: ${session.sourceConfigPath}\nActive variant: ${session.activeVariantId}\n\n${session.variants.map(summarizeVariant).join('\n')}`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to read variant session: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_select_variant',
    'Select the active variant in a file-backed appframe variant session.',
    {
      sessionPath: z.string().describe('Absolute path to the variant session JSON file'),
      variantId: z.string().describe('Variant id to make active, for example concept-a or concept-c'),
    },
    async ({ sessionPath, variantId }) => {
      try {
        const session = await readSession(sessionPath);
        const variant = session.variants.find((entry) => entry.id === variantId);
        if (!variant) {
          return { content: [{ type: 'text' as const, text: `Unknown variant id: ${variantId}` }] };
        }

        session.activeVariantId = variantId;
        session.updatedAt = new Date().toISOString();
        await writeSession(sessionPath, session);

        return {
          content: [{
            type: 'text' as const,
            text: `Active variant set to ${variantId} (${variant.name}).`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to select variant: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_approve_variant',
    'Approve one variant in a file-backed appframe variant session. Approving one concept marks all others as draft so agents can export the approved concept explicitly.',
    {
      sessionPath: z.string().describe('Absolute path to the variant session JSON file'),
      variantId: z.string().describe('Variant id to approve'),
    },
    async ({ sessionPath, variantId }) => {
      try {
        const session = await readSession(sessionPath);
        let found = false;
        session.variants = session.variants.map((variant) => {
          const approved = variant.id === variantId;
          if (approved) found = true;
          return {
            ...variant,
            status: approved ? 'approved' : 'draft',
          };
        });
        if (!found) {
          return { content: [{ type: 'text' as const, text: `Unknown variant id: ${variantId}` }] };
        }

        session.activeVariantId = variantId;
        session.updatedAt = new Date().toISOString();
        await writeSession(sessionPath, session);

        return {
          content: [{
            type: 'text' as const,
            text: `Approved ${variantId}. All other variants are now marked as draft.`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to approve variant: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_export_variant',
    'Export a specific or active variant from a file-backed appframe variant session. Uses the individual renderer for individual variants and the panoramic renderer for panoramic variants.',
    {
      sessionPath: z.string().describe('Absolute path to the variant session JSON file'),
      variantId: z.string().optional().describe('Variant id to export. Defaults to the active variant'),
      outputDir: z.string().optional().describe('Optional absolute output directory override'),
      platform: z.enum(['ios', 'android', 'mac', 'watch', 'all']).optional().describe('Optional platform filter'),
      locale: z.string().optional().describe('Optional locale for individual-mode exports only'),
    },
    async ({ sessionPath, variantId, outputDir, platform, locale }) => {
      try {
        const session = await readSession(sessionPath);
        const targetVariantId = variantId ?? session.activeVariantId;
        const variant = session.variants.find((entry) => entry.id === targetVariantId);
        if (!variant) {
          return { content: [{ type: 'text' as const, text: `Unknown variant id: ${targetVariantId}` }] };
        }
        if (locale && variant.config.mode === 'panoramic') {
          return { content: [{ type: 'text' as const, text: 'Locale-specific export is not supported for panoramic variants in the core renderer yet.' }] };
        }

        const resolvedOutputDir = outputDir
          ?? join(dirname(sessionPath), 'variant-output', slugify(variant.name));
        const tempConfigPath = await writeTemporaryConfig(session.sourceConfigPath, variant.id, variant.config);

        try {
          const result = variant.config.mode === 'panoramic'
            ? await generatePanoramicScreenshots({
                configPath: tempConfigPath,
                outputDir: resolvedOutputDir,
                platform: platform === 'all' ? undefined : platform,
              })
            : await generateScreenshots({
                configPath: tempConfigPath,
                outputDir: resolvedOutputDir,
                platform: platform === 'all' ? undefined : platform,
                locale,
              });

          const artifact: VariantArtifact = {
            id: makeId('artifact'),
            exportedAt: new Date().toISOString(),
            outputDir: resolvedOutputDir,
            mode: variant.config.mode === 'panoramic' ? 'panoramic' : 'individual',
            platform: platform ?? 'all',
            locale,
            filePaths: result.screenshots.map((shot) => shot.outputPath),
          };

          session.variants = session.variants.map((entry) => (
            entry.id === variant.id
              ? { ...entry, artifacts: [artifact, ...entry.artifacts] }
              : entry
          ));
          session.activeVariantId = variant.id;
          session.updatedAt = artifact.exportedAt;
          await writeSession(sessionPath, session);

          return {
            content: [{
              type: 'text' as const,
              text: `Exported ${variant.id} (${variant.name}) to ${resolvedOutputDir}\n\n${artifact.filePaths.join('\n')}`,
            }],
          };
        } finally {
          await rm(tempConfigPath, { force: true });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to export variant: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_export_approved_variant',
    'Export the approved variant from a file-backed appframe variant session. Fails if no variant is approved.',
    {
      sessionPath: z.string().describe('Absolute path to the variant session JSON file'),
      outputDir: z.string().optional().describe('Optional absolute output directory override'),
      platform: z.enum(['ios', 'android', 'mac', 'watch', 'all']).optional().describe('Optional platform filter'),
      locale: z.string().optional().describe('Optional locale for individual-mode exports only'),
    },
    async ({ sessionPath, outputDir, platform, locale }) => {
      try {
        const session = await readSession(sessionPath);
        const approved = session.variants.find((variant) => variant.status === 'approved');
        if (!approved) {
          return { content: [{ type: 'text' as const, text: 'No approved variant found. Use appframe_approve_variant first.' }] };
        }

        const resolvedOutputDir = outputDir
          ?? join(dirname(sessionPath), 'variant-output', slugify(approved.name));
        const tempConfigPath = await writeTemporaryConfig(session.sourceConfigPath, approved.id, approved.config);

        try {
          const result = approved.config.mode === 'panoramic'
            ? await generatePanoramicScreenshots({
                configPath: tempConfigPath,
                outputDir: resolvedOutputDir,
                platform: platform === 'all' ? undefined : platform,
              })
            : await generateScreenshots({
                configPath: tempConfigPath,
                outputDir: resolvedOutputDir,
                platform: platform === 'all' ? undefined : platform,
                locale,
              });

          const artifact: VariantArtifact = {
            id: makeId('artifact'),
            exportedAt: new Date().toISOString(),
            outputDir: resolvedOutputDir,
            mode: approved.config.mode === 'panoramic' ? 'panoramic' : 'individual',
            platform: platform ?? 'all',
            locale,
            filePaths: result.screenshots.map((shot) => shot.outputPath),
          };

          session.variants = session.variants.map((entry) => (
            entry.id === approved.id
              ? { ...entry, artifacts: [artifact, ...entry.artifacts] }
              : entry
          ));
          session.activeVariantId = approved.id;
          session.updatedAt = artifact.exportedAt;
          await writeSession(sessionPath, session);

          return {
            content: [{
              type: 'text' as const,
              text: `Exported approved variant ${approved.id} (${approved.name}) to ${resolvedOutputDir}\n\n${artifact.filePaths.join('\n')}`,
            }],
          };
        } finally {
          await rm(tempConfigPath, { force: true });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to export approved variant: ${message}` }] };
      }
    },
  );
}
