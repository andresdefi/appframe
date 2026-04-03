import { dirname, join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { validateConfig } from '@appframe/core';
import type { AppframeConfig } from '@appframe/core';
import {
  applyReviewedPlanArtDirectionOverrides,
  buildVariantSetPlanFromAnalysis,
  type VariantSetPlan,
} from './design-planning.js';
import { materializeVariantPlan } from './plan-materializer.js';
import {
  buildVariantCopyAssignments,
  makeId,
  readSession,
  writeSession,
  type VariantSessionFile,
  type VariantSessionVariant,
} from './variant-session-lib.js';

function ensureValidConfig(config: AppframeConfig, label: string): AppframeConfig {
  const result = validateConfig(config);
  if (!result.success) {
    const message = result.errors.map((error) => `${error.path}: ${error.message}`).join('; ');
    throw new Error(`${label} is invalid: ${message}`);
  }
  return result.config;
}

function parseMaterializedConfigText(raw: string): AppframeConfig {
  const normalized = raw.replace(/^#.*\n/, '');
  return parse(normalized) as AppframeConfig;
}

async function loadMaterializedConfigsFromManifest(manifestPath: string): Promise<Map<string, AppframeConfig>> {
  const rawManifest = JSON.parse(await readFile(manifestPath, 'utf-8')) as {
    variants?: Array<{ id?: string; configPath?: string }>;
  };
  const configs = new Map<string, AppframeConfig>();

  for (const variant of rawManifest.variants ?? []) {
    if (typeof variant.id !== 'string' || typeof variant.configPath !== 'string') continue;
    const rawConfig = await readFile(variant.configPath, 'utf-8');
    configs.set(variant.id, ensureValidConfig(parseMaterializedConfigText(rawConfig), 'Materialized config'));
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

export async function rebuildAutopilotSessionFromReview(args: {
  sessionPath: string;
}): Promise<{
  sessionPath: string;
  manifestPath: string;
  updatedVariantIds: string[];
  clearedPreviewVariantIds: string[];
  recommendationReason: string;
  plan: VariantSetPlan;
}> {
  const session = await readSession(args.sessionPath);
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

  const rebuiltPlan = buildVariantSetPlanFromAnalysis({
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
  const plan = applyReviewedPlanArtDirectionOverrides({
    plan: rebuiltPlan,
    analysis: autopilot.screenshotAnalysis,
    reviewedPlan: autopilot.conceptPlan,
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

  const recommendationReason = 'Reviewed screenshot-family changes require fresh previews and rescoring.';
  session.autopilot = {
    ...autopilot,
    manifestPath: materialized.manifestPath,
    sourceScreenshots: autopilot.screenshotAnalysis.map((entry) => entry.path),
    conceptPlan: plan,
    recommendedVariantId: null,
    recommendationReason,
  };
  session.updatedAt = rebuildTimestamp;
  await writeSession(args.sessionPath, session);

  return {
    sessionPath: args.sessionPath,
    manifestPath: materialized.manifestPath,
    updatedVariantIds,
    clearedPreviewVariantIds: updatedVariantIds,
    recommendationReason,
    plan,
  };
}
