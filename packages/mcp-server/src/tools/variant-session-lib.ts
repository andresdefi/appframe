import { dirname, join, parse as parsePath } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { loadConfig } from '@appframe/core';
import type { AppframeConfig } from '@appframe/core';
import type { CopyCandidate, CopyCandidateSet, CopySlot, SelectedCopySet } from './copy-planning.js';
import type {
  PanoramicVariantReviewControls,
  PlannedVariant,
  ScreenshotAnalysis,
  ScreenshotRole,
  VariantSetPlan,
} from './design-planning.js';
import type { VariantScore } from './preview-scoring.js';

export type VariantStatus = 'draft' | 'approved';

export interface VariantExportArtifact {
  id: string;
  exportedAt: string;
  outputDir: string;
  mode: 'individual' | 'panoramic';
  platform: string;
  locale?: string;
  filePaths: string[];
}

export interface VariantPreviewArtifact {
  id: string;
  createdAt: string;
  outputDir: string;
  mode: 'individual' | 'panoramic';
  platform: string;
  filePaths: string[];
  thumbnailPath: string | null;
}

export interface VariantCopyAssignment {
  unitKind: 'screen' | 'frame';
  unitIndex: number;
  slot: CopySlot;
  headline: string;
  subtitle?: string;
  sourceFeature?: string;
  sourcePath?: string;
  sourceRole?: ScreenshotRole;
}

export interface VariantHistoryEntry {
  id: string;
  createdAt: string;
  type: 'created' | 'duplicated' | 'refined' | 'status-change' | 'saved';
  label: string;
  detail?: string;
  actionId?: string;
  sourceVariantId?: string;
}

export interface VariantProvenance {
  origin: 'manual' | 'autopilot' | 'duplicate' | 'refinement';
  parentVariantId?: string;
  parentVariantName?: string;
  branchDepth: number;
  note?: string;
}

export interface VariantSessionVariant {
  id: string;
  name: string;
  description: string;
  status: VariantStatus;
  config: AppframeConfig;
  artifacts: VariantExportArtifact[];
  previewArtifacts?: VariantPreviewArtifact[];
  copyAssignments?: VariantCopyAssignment[];
  score?: VariantScore;
  history?: VariantHistoryEntry[];
  provenance?: VariantProvenance;
}

export interface VariantSessionAutopilot {
  mode: 'autopilot';
  manifestPath?: string;
  runManifestPath?: string;
  previewCommand?: string;
  sourceScreenshots: string[];
  screenshotAnalysis?: ScreenshotAnalysis[];
  copyCandidates?: CopyCandidateSet;
  selectedCopySet?: SelectedCopySet;
  conceptPlan?: VariantSetPlan;
  reviewControls?: Record<string, PanoramicVariantReviewControls | undefined>;
  recommendedVariantId?: string | null;
  recommendationReason?: string | null;
  refinementHistory: Array<{
    createdAt: string;
    prompt: string;
    variantId?: string;
    branchVariantId?: string;
    actionId?: string;
  }>;
}

export interface VariantSessionFile {
  version: 2;
  sourceConfigPath: string;
  createdAt: string;
  updatedAt: string;
  activeVariantId: string;
  variants: VariantSessionVariant[];
  autopilot?: VariantSessionAutopilot;
}

type LegacyVariantSessionFile = {
  version: 1;
  sourceConfigPath: string;
  createdAt: string;
  updatedAt: string;
  activeVariantId: string;
  variants: Array<{
    id: string;
    name: string;
    description: string;
    status: VariantStatus;
    config: AppframeConfig;
    artifacts: VariantExportArtifact[];
  }>;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeHistoryEntry(
  type: VariantHistoryEntry['type'],
  label: string,
  extras: Omit<VariantHistoryEntry, 'id' | 'createdAt' | 'type' | 'label'> = {},
): VariantHistoryEntry {
  return {
    id: makeId('history'),
    createdAt: new Date().toISOString(),
    type,
    label,
    ...extras,
  };
}

export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'variant';
}

export function defaultSessionPath(configPath: string): string {
  const parsed = parsePath(configPath);
  return join(parsed.dir, `${parsed.name}.variants.session.json`);
}

export function sessionPathFromManifest(manifestPath: string): string {
  const parsed = parsePath(manifestPath);
  return join(parsed.dir, `${parsed.name}.session.json`);
}

export async function readSession(sessionPath: string): Promise<VariantSessionFile> {
  const raw = JSON.parse(await readFile(sessionPath, 'utf-8')) as VariantSessionFile | LegacyVariantSessionFile;
  if (raw.version === 2) {
    return {
      ...raw,
      variants: raw.variants.map((variant) => ({
        ...variant,
        previewArtifacts: variant.previewArtifacts ?? [],
        copyAssignments: variant.copyAssignments ?? [],
        history: variant.history ?? [],
        provenance: variant.provenance ?? { origin: 'manual', branchDepth: 0 },
      })),
      autopilot: raw.autopilot
        ? {
            ...raw.autopilot,
            refinementHistory: raw.autopilot.refinementHistory ?? [],
            reviewControls: raw.autopilot.reviewControls ?? {},
          }
        : undefined,
    };
  }

  return {
    version: 2,
    sourceConfigPath: raw.sourceConfigPath,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    activeVariantId: raw.activeVariantId,
    variants: raw.variants.map((variant) => ({
      ...variant,
      previewArtifacts: [],
      copyAssignments: [],
      history: [],
      provenance: { origin: 'manual', branchDepth: 0 },
    })),
  };
}

export async function writeSession(sessionPath: string, session: VariantSessionFile): Promise<void> {
  await mkdir(dirname(sessionPath), { recursive: true });
  await writeFile(sessionPath, JSON.stringify(session, null, 2), 'utf-8');
}

function resolveCopyCandidateForSlot(
  selectedCopySet: SelectedCopySet,
  slot: CopySlot,
  featureIndex: number,
): CopyCandidate | undefined {
  switch (slot) {
    case 'hero':
      return selectedCopySet.hero;
    case 'differentiator':
      return selectedCopySet.differentiator;
    case 'trust':
      return selectedCopySet.trust;
    case 'summary':
      return selectedCopySet.summary;
    case 'feature':
      return selectedCopySet.features[Math.min(featureIndex, selectedCopySet.features.length - 1)];
  }
}

function toCopySlot(value: string): CopySlot | null {
  switch (value) {
    case 'hero':
    case 'differentiator':
    case 'feature':
    case 'trust':
    case 'summary':
      return value;
    default:
      return null;
  }
}

export function buildVariantCopyAssignments(
  variant: PlannedVariant | undefined,
  selectedCopySet: SelectedCopySet | undefined,
): VariantCopyAssignment[] {
  if (!variant || !selectedCopySet) return [];

  let featureIndex = 0;

  if (variant.mode === 'individual') {
    return variant.screens.flatMap((screen) => {
      const slot = toCopySlot(screen.slideRole);
      if (!slot) return [];

      const candidate = resolveCopyCandidateForSlot(selectedCopySet, slot, featureIndex);
      if (slot === 'feature') featureIndex += 1;
      if (!candidate) return [];

      return [{
        unitKind: 'screen' as const,
        unitIndex: screen.index,
        slot,
        headline: candidate.headline,
        subtitle: candidate.subtitle,
        sourceFeature: candidate.sourceFeature,
        sourcePath: screen.sourcePath,
        sourceRole: screen.sourceRole,
      }];
    });
  }

  return (variant.frames ?? []).flatMap((frame) => {
    const slot = toCopySlot(frame.storyBeat);
    if (!slot) return [];

    const candidate = resolveCopyCandidateForSlot(selectedCopySet, slot, featureIndex);
    if (slot === 'feature') featureIndex += 1;
    if (!candidate) return [];

    return [{
      unitKind: 'frame' as const,
      unitIndex: frame.frame,
      slot,
      headline: candidate.headline,
      subtitle: candidate.subtitle,
      sourceFeature: candidate.sourceFeature,
      sourcePath: frame.sourcePath,
      sourceRole: frame.sourceRole,
    }];
  });
}

export async function createSessionFromManifest(args: {
  manifestPath: string;
  sessionPath?: string;
  screenshotAnalysis?: ScreenshotAnalysis[];
  copyCandidates?: CopyCandidateSet;
  selectedCopySet?: SelectedCopySet;
  conceptPlan?: VariantSetPlan;
  runManifestPath?: string;
  previewCommand?: string;
}): Promise<{ sessionPath: string; session: VariantSessionFile }> {
  const rawManifest = JSON.parse(await readFile(args.manifestPath, 'utf-8')) as {
    app?: { name?: string };
    variants: Array<{
      id: string;
      name: string;
      mode: 'individual' | 'panoramic';
      configPath: string;
    }>;
  };

  if (!Array.isArray(rawManifest.variants) || rawManifest.variants.length === 0) {
    throw new Error('Manifest does not contain any variants.');
  }

  const variants = await Promise.all(rawManifest.variants.map(async (entry) => {
    const config = await loadConfig(entry.configPath);
    const plannedVariant = args.conceptPlan?.variants.find((variant) => variant.id === entry.id);
    const description =
      plannedVariant?.strategy
      ?? `Autopilot concept for ${rawManifest.app?.name ?? 'the app'}.`;
    return {
      id: entry.id,
      name: entry.name,
      description,
      status: 'draft' as const,
      config,
      artifacts: [],
      previewArtifacts: [],
      copyAssignments: buildVariantCopyAssignments(plannedVariant, args.selectedCopySet),
      history: [makeHistoryEntry('created', 'Variant created from autopilot plan')],
      provenance: {
        origin: 'autopilot' as const,
        branchDepth: 0,
        note: 'Generated from a materialized autopilot manifest.',
      },
    };
  }));

  const timestamp = new Date().toISOString();
  const session: VariantSessionFile = {
    version: 2,
    sourceConfigPath: rawManifest.variants[0]!.configPath,
    createdAt: timestamp,
    updatedAt: timestamp,
    activeVariantId: variants[0]!.id,
    variants,
    autopilot: {
      mode: 'autopilot',
      manifestPath: args.manifestPath,
      runManifestPath: args.runManifestPath,
      previewCommand: args.previewCommand,
      sourceScreenshots:
        args.screenshotAnalysis?.map((entry) => entry.path)
        ?? args.conceptPlan?.selectedScreens.map((screen) => screen.path)
        ?? [],
      screenshotAnalysis: args.screenshotAnalysis,
      copyCandidates: args.copyCandidates,
      selectedCopySet: args.selectedCopySet,
      conceptPlan: args.conceptPlan,
      reviewControls: {},
      recommendedVariantId: null,
      recommendationReason: null,
      refinementHistory: [],
    },
  };

  const sessionPath = args.sessionPath ?? sessionPathFromManifest(args.manifestPath);
  await writeSession(sessionPath, session);
  return { sessionPath, session };
}

export async function updateSessionVariants(
  sessionPath: string,
  updater: (session: VariantSessionFile) => VariantSessionFile,
): Promise<VariantSessionFile> {
  const session = await readSession(sessionPath);
  const next = updater(clone(session));
  next.updatedAt = new Date().toISOString();
  await writeSession(sessionPath, next);
  return next;
}

export async function recordPreviewArtifacts(
  sessionPath: string,
  previewArtifacts: Array<{
    variantId: string;
    artifact: VariantPreviewArtifact;
  }>,
): Promise<VariantSessionFile> {
  return updateSessionVariants(sessionPath, (session) => ({
    ...session,
    variants: session.variants.map((variant) => {
      const artifact = previewArtifacts.find((entry) => entry.variantId === variant.id)?.artifact;
      return artifact
        ? { ...variant, previewArtifacts: [artifact, ...(variant.previewArtifacts ?? [])] }
        : variant;
    }),
  }));
}

export async function recordVariantScores(
  sessionPath: string,
  args: {
    scores: Array<{ variantId: string; score: VariantScore }>;
    recommendedVariantId: string | null;
    recommendationReason: string | null;
  },
): Promise<VariantSessionFile> {
  return updateSessionVariants(sessionPath, (session) => ({
    ...session,
    variants: session.variants.map((variant) => ({
      ...variant,
      score: args.scores.find((entry) => entry.variantId === variant.id)?.score ?? variant.score,
    })),
    autopilot: session.autopilot
      ? {
          ...session.autopilot,
          recommendedVariantId: args.recommendedVariantId,
          recommendationReason: args.recommendationReason,
        }
      : undefined,
  }));
}

export async function appendRefinementHistory(
  sessionPath: string,
  prompt: string,
): Promise<VariantSessionFile> {
  return updateSessionVariants(sessionPath, (session) => ({
    ...session,
    autopilot: session.autopilot
      ? {
          ...session.autopilot,
          refinementHistory: [
            {
              createdAt: new Date().toISOString(),
              prompt,
            },
            ...session.autopilot.refinementHistory,
          ],
        }
      : undefined,
  }));
}
