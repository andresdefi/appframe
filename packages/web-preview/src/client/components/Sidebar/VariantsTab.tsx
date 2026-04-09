import { useMemo, useState } from 'react';
import { Section } from '../Controls/Section';
import { buildSessionSavePayload, getRefinementLabel, usePreviewStore, variantSnapshotFromState } from '../../store';
import type {
  AutopilotPanoramicReviewControls,
  AutopilotPlanVariant,
  AutopilotSelectedCopySet,
  RefinementActionId,
  VariantRecord,
  VariantSnapshot,
} from '../../store';
import { refineWithAi } from '../../utils/api';
import { useConfirmDialog } from '../Controls/ConfirmDialog';
import {
  countReviewedPanoramicControlVariants,
  describeReviewedRebuildInputs,
  hasReviewedRebuildInputs,
} from './variantsTabReview';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'individual', label: 'Individual' },
  { id: 'panoramic', label: 'Panoramic' },
  { id: 'approved', label: 'Approved' },
] as const;

const REFINEMENT_ACTIONS: RefinementActionId[] = [
  'premium',
  'shorter-copy',
  'frameless',
  'lighter',
  'darker',
  'bigger-text',
  'reduce-overlap',
];

const SEMANTIC_FLAVOR_OPTIONS = [
  'activity',
  'profile',
  'editor',
  'catalog',
  'document',
  'map',
  'media',
  'capture',
  'schedule',
  'commerce',
  'security',
  'support',
  'reward',
] as const;

const PANORAMIC_RECIPE_OPTIONS = [
  'editorial-panorama',
  'bold-panorama',
  'editorial-confidence',
  'proof-panorama',
  'wellness-panorama',
  'progress-panorama',
  'workflow-panorama',
  'momentum-panorama',
  'conversation-panorama',
  'launch-panorama',
  'gallery-panorama',
  'portfolio-panorama',
  'world-panorama',
  'cinematic-panorama',
] as const;

const PANORAMIC_CONTINUITY_OPTIONS = [
  'text-rail',
  'proof-lane',
  'signal-wave',
  'progress-track',
  'curation-run',
  'poster-anchor',
] as const;

const PANORAMIC_SUPPORT_SYSTEM_OPTIONS = [
  'quote-stack',
  'metric-ladder',
  'signal-chain',
  'milestone-band',
  'curation-shelf',
  'proof-column',
] as const;

const PANORAMIC_PACING_OPTIONS = [
  'calmer',
  'bolder',
] as const;

const PANORAMIC_PROOF_DENSITY_OPTIONS = [
  'lighter',
  'heavier',
] as const;

const PANORAMIC_DECORATIVE_INTENSITY_OPTIONS = [
  'quieter',
  'bolder',
] as const;

function formatCopySlot(slot: 'hero' | 'differentiator' | 'feature' | 'trust' | 'summary'): string {
  switch (slot) {
    case 'hero':
      return 'Hero';
    case 'differentiator':
      return 'Differentiator';
    case 'feature':
      return 'Feature';
    case 'trust':
      return 'Trust';
    case 'summary':
      return 'Summary';
  }
}

function formatTimestamp(value: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function sessionAssetUrl(pathValue: string | null | undefined): string | null {
  if (!pathValue) return null;
  return `/api/session-asset?path=${encodeURIComponent(pathValue)}`;
}

function basenameLabel(pathValue: string | null | undefined): string {
  if (!pathValue) return 'Unknown';
  const normalized = pathValue.replace(/\\/g, '/');
  return normalized.split('/').pop() || normalized;
}

function formatCompositionFeature(feature: string): string {
  switch (feature) {
    case 'layered-detail-extract':
      return 'Layered details';
    case 'floating-detail-card':
      return 'Floating detail card';
    case 'decorative-cluster':
      return 'Decorative cluster';
    case 'proof-stack':
      return 'Proof stack';
    case 'checkout-lane':
      return 'Checkout lane';
    case 'trust-shield':
      return 'Trust shield';
    default:
      return feature.replace(/-/g, ' ');
  }
}

function formatSlugLabel(value: string): string {
  return value.replace(/-/g, ' ');
}

function formatFrameTreatment(value: string): string {
  switch (value) {
    case 'framed':
      return 'Framed';
    case 'frameless':
      return 'Frameless';
    case 'mixed':
      return 'Mixed';
    default:
      return formatSlugLabel(value);
  }
}

function semanticFlavorSelectValue(entry: {
  semanticFlavor?: string;
  semanticFlavorOverride?: string | null;
}): string {
  if (entry.semanticFlavorOverride) return entry.semanticFlavorOverride;
  return '';
}

function formatSemanticAlternatives(entry: {
  semanticFlavor?: string;
  semanticFlavorAlternatives?: Array<{ flavor: string; score: number }>;
}): string | null {
  const alternatives = (entry.semanticFlavorAlternatives ?? [])
    .filter((alternative) => alternative.flavor !== entry.semanticFlavor)
    .slice(0, 2)
    .map((alternative) => `${formatSlugLabel(alternative.flavor)} (${alternative.score})`);
  return alternatives.length > 0 ? alternatives.join(' · ') : null;
}

function summarizePanoramicComposition(snapshot: VariantSnapshot): string[] {
  if (!snapshot.isPanoramic) return [];

  const elements = snapshot.panoramicElements;
  const groups = elements.filter((element) => element.type === 'group');
  const hasLayeredBackground = (snapshot.panoramicBackground.layers?.length ?? 0) > 1;
  const hasLayeredDetails = groups.some((group) =>
    group.children.filter((child) => child.type === 'crop').length >= 2,
  );
  const hasFloatingCards = groups.some((group) =>
    group.children.some((child) => child.type === 'card'),
  );
  const hasDecorativeCluster = groups.some((group) =>
    group.children.some((child) => child.type === 'decoration'),
  );
  const hasProof = elements.some((element) => element.type === 'proof-chip')
    || groups.some((group) => group.children.some((child) => child.type === 'proof-chip'));

  return [
    hasLayeredBackground ? 'Layered background' : null,
    hasLayeredDetails ? 'Layered details' : null,
    hasFloatingCards ? 'Floating detail cards' : null,
    hasDecorativeCluster ? 'Decorative system' : null,
    hasProof ? 'Proof signals' : null,
  ].filter((value): value is string => value !== null);
}

function panoramicReviewControlValue(value: string | null | undefined): string {
  return typeof value === 'string' ? value : '';
}

function summarizePanoramicReviewControls(
  controls: AutopilotPanoramicReviewControls | undefined,
): string | null {
  if (!controls) return null;
  const parts = [
    controls.recipe ? `recipe ${formatSlugLabel(controls.recipe)}` : null,
    controls.continuityMotif ? `continuity ${formatSlugLabel(controls.continuityMotif)}` : null,
    controls.supportSystem ? `support ${formatSlugLabel(controls.supportSystem)}` : null,
    controls.pacing ? `pace ${formatSlugLabel(controls.pacing)}` : null,
    controls.proofDensity ? `proof ${formatSlugLabel(controls.proofDensity)}` : null,
    controls.decorativeIntensity ? `decor ${formatSlugLabel(controls.decorativeIntensity)}` : null,
  ].filter((value): value is string => value !== null);
  return parts.length > 0 ? parts.join(' · ') : null;
}

function describeProvenance(variant: VariantRecord): string | null {
  const provenance = variant.provenance;
  if (!provenance) return null;
  switch (provenance.origin) {
    case 'autopilot':
      return 'Autopilot concept';
    case 'duplicate':
      return provenance.parentVariantName ? `Branched from ${provenance.parentVariantName}` : 'Branched duplicate';
    case 'refinement':
      return provenance.parentVariantName ? `Refined from ${provenance.parentVariantName}` : 'Refinement branch';
    default:
      return provenance.note ?? null;
  }
}

function summarizeContinuity(snapshot: VariantSnapshot): {
  score: number;
  summary: string;
  flags: string[];
} | null {
  if (!snapshot.isPanoramic) return null;

  const frameWidth = 100 / Math.max(snapshot.panoramicFrameCount, 1);
  const devices = snapshot.panoramicElements.filter((element) => element.type === 'device');
  const textBlocks = snapshot.panoramicElements.filter((element) => element.type === 'text');
  const spanningElements = snapshot.panoramicElements.filter((element) => {
    const width = 'width' in element ? element.width : 0;
    return width > 0 && Math.floor(element.x / frameWidth) !== Math.floor((element.x + width) / frameWidth);
  });

  const coveredFrames = new Set(
    devices.map((device) => clampFrameIndex(Math.floor((device.x + device.width / 2) / frameWidth), snapshot.panoramicFrameCount)),
  );
  const deviceCoverage = coveredFrames.size / Math.max(snapshot.panoramicFrameCount, 1);
  const avgDeviceY = devices.reduce((sum, device) => sum + device.y, 0) / Math.max(devices.length, 1);
  const yVariance = devices.reduce((sum, device) => sum + Math.abs(device.y - avgDeviceY), 0) / Math.max(devices.length, 1);
  const score = Math.round(
    Math.min(
      100,
      35 * deviceCoverage
      + Math.min(25, spanningElements.length * 8)
      + Math.min(20, textBlocks.length * 4)
      + Math.max(0, 20 - yVariance * 2),
    ),
  );
  const flags: string[] = [];
  if (deviceCoverage < 0.75) flags.push('Some frames lack a clear device anchor');
  if (spanningElements.length === 0) flags.push('Few elements connect across frame boundaries');
  if (yVariance > 6) flags.push('Device rhythm drifts vertically between frames');

  return {
    score,
    summary:
      score >= 80 ? 'Strong cross-frame continuity'
      : score >= 60 ? 'Mostly coherent panoramic rhythm'
      : 'Continuity needs more shared anchors',
    flags,
  };
}

function clampFrameIndex(index: number, frameCount: number): number {
  return Math.max(0, Math.min(frameCount - 1, index));
}

function renderSelectedCopyRows(selectedCopySet: AutopilotSelectedCopySet): Array<{
  key: string;
  label: string;
  headline: string;
  subtitle?: string;
  sourceFeature?: string;
}> {
  return [
    {
      key: 'hero',
      label: 'Hero',
      headline: selectedCopySet.hero.headline,
      subtitle: selectedCopySet.hero.subtitle,
      sourceFeature: selectedCopySet.hero.sourceFeature,
    },
    {
      key: 'differentiator',
      label: 'Differentiator',
      headline: selectedCopySet.differentiator.headline,
      subtitle: selectedCopySet.differentiator.subtitle,
      sourceFeature: selectedCopySet.differentiator.sourceFeature,
    },
    ...selectedCopySet.features.map((feature, index) => ({
      key: `feature-${index + 1}`,
      label: `Feature ${index + 1}`,
      headline: feature.headline,
      subtitle: feature.subtitle,
      sourceFeature: feature.sourceFeature,
    })),
    ...(selectedCopySet.trust
      ? [{
          key: 'trust',
          label: 'Trust',
          headline: selectedCopySet.trust.headline,
          subtitle: selectedCopySet.trust.subtitle,
          sourceFeature: selectedCopySet.trust.sourceFeature,
        }]
      : []),
    {
      key: 'summary',
      label: 'Summary',
      headline: selectedCopySet.summary.headline,
      subtitle: selectedCopySet.summary.subtitle,
      sourceFeature: selectedCopySet.summary.sourceFeature,
    },
  ];
}

export function VariantsTab() {
  const variants = usePreviewStore((s) => s.variants);
  const activeVariantId = usePreviewStore((s) => s.activeVariantId);
  const recommendedVariantId = usePreviewStore((s) => s.recommendedVariantId);
  const recommendationReason = usePreviewStore((s) => s.recommendationReason);
  const autopilotAnalysis = usePreviewStore((s) => s.autopilotAnalysis);
  const autopilotSelectedCopySet = usePreviewStore((s) => s.autopilotSelectedCopySet);
  const autopilotConceptPlan = usePreviewStore((s) => s.autopilotConceptPlan);
  const autopilotReviewControls = usePreviewStore((s) => s.autopilotReviewControls);
  const autopilotRefinementHistory = usePreviewStore((s) => s.autopilotRefinementHistory);
  const sessionSaveBaseline = usePreviewStore((s) => s.sessionSaveBaseline);
  const createVariant = usePreviewStore((s) => s.createVariant);
  const duplicateActiveVariant = usePreviewStore((s) => s.duplicateActiveVariant);
  const applyRefinementToActive = usePreviewStore((s) => s.applyRefinementToActive);
  const applyAiRefinementPlanToActive = usePreviewStore((s) => s.applyAiRefinementPlanToActive);
  const setAutopilotSemanticFlavorOverride = usePreviewStore((s) => s.setAutopilotSemanticFlavorOverride);
  const setAutopilotSemanticFlavorOverrides = usePreviewStore((s) => s.setAutopilotSemanticFlavorOverrides);
  const resetAutopilotSemanticFlavorOverrides = usePreviewStore((s) => s.resetAutopilotSemanticFlavorOverrides);
  const setAutopilotPanoramicReviewControls = usePreviewStore((s) => s.setAutopilotPanoramicReviewControls);
  const createVariantSet = usePreviewStore((s) => s.createVariantSet);
  const selectVariant = usePreviewStore((s) => s.selectVariant);
  const approveVariant = usePreviewStore((s) => s.approveVariant);
  const renameVariant = usePreviewStore((s) => s.renameVariant);
  const deleteVariant = usePreviewStore((s) => s.deleteVariant);
  const setVariantStatus = usePreviewStore((s) => s.setVariantStatus);
  const sessionBacked = usePreviewStore((s) => s.sessionBacked);
  const saveSession = usePreviewStore((s) => s.saveSession);
  const rebuildAutopilotSessionFromReview = usePreviewStore((s) => s.rebuildAutopilotSessionFromReview);
  const isSavingSession = usePreviewStore((s) => s.isSavingSession);
  const platform = usePreviewStore((s) => s.platform);
  const previewW = usePreviewStore((s) => s.previewW);
  const previewH = usePreviewStore((s) => s.previewH);
  const locale = usePreviewStore((s) => s.locale);
  const currentSessionLocales = usePreviewStore((s) => s.sessionLocales);
  const isPanoramic = usePreviewStore((s) => s.isPanoramic);
  const screens = usePreviewStore((s) => s.screens);
  const selectedScreen = usePreviewStore((s) => s.selectedScreen);
  const panoramicFrameCount = usePreviewStore((s) => s.panoramicFrameCount);
  const panoramicBackground = usePreviewStore((s) => s.panoramicBackground);
  const panoramicElements = usePreviewStore((s) => s.panoramicElements);
  const panoramicEffects = usePreviewStore((s) => s.panoramicEffects);
  const selectedElementIndex = usePreviewStore((s) => s.selectedElementIndex);
  const exportSize = usePreviewStore((s) => s.exportSize);
  const exportRenderer = usePreviewStore((s) => s.exportRenderer);
  const { confirm, dialog } = useConfirmDialog();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [aiStatus, setAiStatus] = useState<string | null>(null);
  const [isReviewRebuilding, setIsReviewRebuilding] = useState(false);
  const [reviewRebuildStatus, setReviewRebuildStatus] = useState<string | null>(null);

  const approvedCount = useMemo(
    () => variants.filter((variant) => variant.status === 'approved').length,
    [variants],
  );
  const activeVariant = useMemo(
    () => variants.find((variant) => variant.id === activeVariantId) ?? null,
    [variants, activeVariantId],
  );
  const currentSnapshot = useMemo(
    () =>
      variantSnapshotFromState({
        platform,
        previewW,
        previewH,
        locale,
        sessionLocales: currentSessionLocales,
        isPanoramic,
        screens,
        selectedScreen,
        panoramicFrameCount,
        panoramicBackground,
        panoramicElements,
        panoramicEffects,
        selectedElementIndex,
        exportSize,
        exportRenderer,
      }),
    [
      platform,
      previewW,
      previewH,
      locale,
      currentSessionLocales,
      isPanoramic,
      screens,
      selectedScreen,
      panoramicFrameCount,
      panoramicBackground,
      panoramicElements,
      panoramicEffects,
      selectedElementIndex,
      exportSize,
      exportRenderer,
    ],
  );
  const syncedVariants = useMemo(
    () => (
      activeVariantId == null
        ? variants
        : variants.map((variant) =>
            variant.id === activeVariantId
              ? { ...variant, snapshot: currentSnapshot }
              : variant)
    ),
    [variants, activeVariantId, currentSnapshot],
  );
  const currentSessionPayload = useMemo(
    () => (
      sessionBacked && activeVariantId
        ? JSON.stringify(buildSessionSavePayload({
            activeVariantId,
            recommendedVariantId,
            recommendationReason,
            autopilotAnalysis,
            autopilotSelectedCopySet,
            autopilotConceptPlan,
            autopilotReviewControls,
            autopilotRefinementHistory,
            variants: syncedVariants,
          }))
        : null
    ),
    [
      sessionBacked,
      activeVariantId,
      recommendedVariantId,
      recommendationReason,
      autopilotAnalysis,
      autopilotSelectedCopySet,
      autopilotConceptPlan,
      autopilotReviewControls,
      autopilotRefinementHistory,
      syncedVariants,
    ],
  );
  const isSessionDirty = useMemo(
    () => sessionBacked && currentSessionPayload !== sessionSaveBaseline,
    [sessionBacked, currentSessionPayload, sessionSaveBaseline],
  );
  const filteredVariants = useMemo(
    () =>
      variants.filter((variant) => {
        switch (filter) {
          case 'individual':
            return !variant.snapshot.isPanoramic;
          case 'panoramic':
            return variant.snapshot.isPanoramic;
          case 'approved':
            return variant.status === 'approved';
          default:
            return true;
        }
      }),
    [variants, filter],
  );
  const comparisonPair = useMemo(() => {
    const comparisonPool = filteredVariants.length >= 2 ? filteredVariants : variants;
    if (comparisonPool.length < 2) return null;

    const active = comparisonPool.find((variant) => variant.id === activeVariantId) ?? activeVariant;
    const recommended = comparisonPool.find((variant) => variant.id === recommendedVariantId)
      ?? variants.find((variant) => variant.id === recommendedVariantId);
    if (active && recommended && active.id !== recommended.id) {
      return [active, recommended] as const;
    }

    const approved = comparisonPool.find((variant) => variant.status === 'approved' && variant.id !== active?.id);
    if (active && approved) {
      return [active, approved] as const;
    }

    const [first] = comparisonPool;
    if (!first) return null;
    const second = comparisonPool.find((variant) => variant.id !== first.id);
    return first && second ? [first, second] as const : null;
  }, [filteredVariants, variants, activeVariantId, activeVariant, recommendedVariantId]);
  const analysisUnsafeCount = useMemo(
    () => autopilotAnalysis.filter((entry) => entry.unsafeForTextOverlay).length,
    [autopilotAnalysis],
  );
  const flaggedSemanticFlavorPaths = useMemo(
    () =>
      autopilotAnalysis
        .filter((entry) => entry.semanticFlavorNeedsReview)
        .map((entry) => entry.path),
    [autopilotAnalysis],
  );
  const reviewedSemanticFlavorCount = useMemo(
    () => autopilotAnalysis.filter((entry) => Boolean(entry.semanticFlavorOverride)).length,
    [autopilotAnalysis],
  );
  const reviewedPanoramicControlVariantCount = useMemo(
    () => countReviewedPanoramicControlVariants(autopilotReviewControls),
    [autopilotReviewControls],
  );
  const hasReviewedInputs = useMemo(
    () => hasReviewedRebuildInputs({
      reviewedSemanticFlavorCount,
      reviewedPanoramicControlVariantCount,
    }),
    [reviewedSemanticFlavorCount, reviewedPanoramicControlVariantCount],
  );
  const reviewedRebuildSourceLabel = useMemo(
    () => describeReviewedRebuildInputs({
      reviewedSemanticFlavorCount,
      reviewedPanoramicControlVariantCount,
    }),
    [reviewedSemanticFlavorCount, reviewedPanoramicControlVariantCount],
  );
  const activePlanVariant = useMemo<AutopilotPlanVariant | null>(
    () => autopilotConceptPlan?.variants.find((variant) => variant.id === activeVariantId) ?? null,
    [autopilotConceptPlan, activeVariantId],
  );
  const activePanoramicReviewControls = useMemo(
    () => (activeVariantId ? autopilotReviewControls[activeVariantId] : undefined),
    [autopilotReviewControls, activeVariantId],
  );
  const activePanoramicReviewControlSummary = useMemo(
    () => summarizePanoramicReviewControls(activePanoramicReviewControls),
    [activePanoramicReviewControls],
  );
  const hasActivePanoramicReviewControls = activePanoramicReviewControlSummary !== null;
  const aiPromptSuggestions = useMemo(() => {
    const suggestions = [
      'Make this more premium without losing clarity',
      activeVariant?.snapshot.isPanoramic
        ? 'Reduce overlap and improve panoramic continuity'
        : 'Shorten the copy and increase text size slightly',
    ];
    if (activeVariant && recommendedVariantId && recommendedVariantId !== activeVariant.id) {
      const referenceVariant = variants.find((variant) => variant.id === recommendedVariantId);
      if (referenceVariant) {
        suggestions.push(`Make ${activeVariant.name} feel more like ${referenceVariant.name}`);
      }
    }
    return Array.from(new Set(suggestions.filter(Boolean)));
  }, [activeVariant, recommendedVariantId, variants]);

  async function handleAiRefinement(promptOverride?: string) {
    if (!activeVariantId) return;
    const prompt = (promptOverride ?? aiPrompt).trim();
    if (!prompt) return;

    setIsAiRefining(true);
    setAiStatus(null);
    try {
      const payload = buildSessionSavePayload({
        activeVariantId,
        recommendedVariantId,
        recommendationReason,
        autopilotAnalysis,
        autopilotSelectedCopySet,
        autopilotConceptPlan,
        autopilotReviewControls,
        autopilotRefinementHistory,
        variants: syncedVariants,
      });
      const result = await refineWithAi({
        prompt,
        activeVariantId,
        variants: payload.variants,
      });
      applyAiRefinementPlanToActive({
        prompt,
        label: result.label,
        detail: result.rationale,
        actions: result.actions,
        nameSuggestion: result.nameSuggestion,
        referenceVariantId: result.referenceVariantId,
        referenceVariantName: result.referenceVariantName,
      });
      setAiPrompt('');
      setAiStatus(`Created ${result.nameSuggestion ?? 'an AI refinement branch'} using ${result.actions.length} safe action${result.actions.length === 1 ? '' : 's'}.`);
    } catch (err) {
      setAiStatus(err instanceof Error ? err.message : 'AI refinement failed');
    } finally {
      setIsAiRefining(false);
    }
  }

  async function handleReviewedRebuild(options?: {
    refreshPreviews?: boolean;
    branchVariants?: boolean;
  }) {
    const refreshPreviews = options?.refreshPreviews === true;
    const branchVariants = options?.branchVariants === true;
    const confirmed = await confirm({
      title: branchVariants
        ? (refreshPreviews
            ? 'Branch, rerender, and rescore from review?'
            : 'Create reviewed comparison branches?')
        : refreshPreviews
        ? 'Rebuild, rerender, and rescore from review?'
        : 'Rebuild autopilot concepts from review?',
      message: branchVariants
        ? (refreshPreviews
            ? `This saves the current session, regenerates reviewed autopilot concepts into fresh comparison branches using ${reviewedRebuildSourceLabel}, rerenders only those new branches, rescoring the session so you can compare new and existing concepts side by side. Existing concepts stay intact.`
            : `This saves the current session and regenerates reviewed autopilot concepts into fresh comparison branches using ${reviewedRebuildSourceLabel} without overwriting the existing concepts. Existing concepts stay intact until you rerender and rescore.`)
        : refreshPreviews
        ? `This saves the current session, regenerates autopilot concepts from ${reviewedRebuildSourceLabel}, rerenders fresh previews, rescoring the rebuilt concepts, and reloads the session. Manual branches stay in the session.`
        : `This saves the current session, regenerates autopilot concepts from ${reviewedRebuildSourceLabel}, clears stale previews and scores for rebuilt concepts, and reloads the session. Manual branches stay in the session.`,
      confirmLabel: branchVariants
        ? (refreshPreviews ? 'Branch + Rescore' : 'Branch Concepts')
        : refreshPreviews ? 'Rebuild + Rescore' : 'Rebuild Concepts',
      destructive: false,
    });
    if (!confirmed) return;

    setIsReviewRebuilding(true);
    setReviewRebuildStatus(null);
    try {
      const result = await rebuildAutopilotSessionFromReview({ refreshPreviews, branchVariants });
      setReviewRebuildStatus(branchVariants
        ? (refreshPreviews
            ? `Created ${result.updatedVariantIds.length} reviewed branch${result.updatedVariantIds.length === 1 ? '' : 'es'}, rerendered those concepts, and rescored ${result.scores?.length ?? 0} session variant${(result.scores?.length ?? 0) === 1 ? '' : 's'}.`
            : `Created ${result.updatedVariantIds.length} reviewed branch${result.updatedVariantIds.length === 1 ? '' : 'es'}. Rerender previews and rescore when you are ready to compare them.`)
        : refreshPreviews
          ? `Rebuilt ${result.updatedVariantIds.length} autopilot concept${result.updatedVariantIds.length === 1 ? '' : 's'}, refreshed previews, and rescored ${result.scores?.length ?? 0} concept${(result.scores?.length ?? 0) === 1 ? '' : 's'}.`
          : `Rebuilt ${result.updatedVariantIds.length} autopilot concept${result.updatedVariantIds.length === 1 ? '' : 's'}. Fresh previews and rescoring are now required.`);
    } catch (err) {
      setReviewRebuildStatus(err instanceof Error ? err.message : 'Reviewed rebuild failed');
    } finally {
      setIsReviewRebuilding(false);
    }
  }

  return (
    <>
      {dialog}
      <Section
        title="Variants"
        tooltip="Create and compare multiple screenshot concepts in one session. Agents can iterate on each concept separately, and you can approve the one that should be exported."
        defaultCollapsed={false}
      >
        <div className="flex gap-2 mb-3">
          <button
            className="flex-1 py-2 text-xs bg-accent hover:bg-accent-hover text-white rounded-md"
            onClick={() => createVariant()}
          >
            New Variant
          </button>
          <button
            className="flex-1 py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
            onClick={duplicateActiveVariant}
            disabled={variants.length === 0}
          >
            Branch Active
          </button>
        </div>

        {activeVariant && (
          <div className="mb-3 rounded-lg border border-border bg-surface/40 p-3">
            <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-text-dim">
              Quick Refine
            </div>
            <div className="mb-2 text-[11px] text-text-dim">
              Each action creates a safe branch from the active concept and records it in session history.
            </div>
            <div className="grid grid-cols-2 gap-2">
              {REFINEMENT_ACTIONS.map((actionId) => (
                <button
                  key={actionId}
                  className="rounded-md border border-border bg-bg px-2.5 py-2 text-[11px] text-text-dim hover:text-text"
                  onClick={() => applyRefinementToActive(actionId)}
                >
                  {getRefinementLabel(actionId)}
                </button>
              ))}
            </div>
          </div>
        )}

        {sessionBacked && activeVariant && (
          <div className="mb-3 rounded-lg border border-border bg-surface/40 p-3">
            <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-text-dim">
              AI Refine
            </div>
            <div className="mb-2 text-[11px] text-text-dim">
              Describe the change you want. The server maps it onto the existing safe refinement actions and creates a new branch.
            </div>
            <textarea
              className="mb-2 min-h-[72px] w-full rounded-md border border-border bg-bg px-3 py-2 text-[12px] text-text outline-none placeholder:text-text-dim"
              value={aiPrompt}
              onChange={(event) => setAiPrompt(event.target.value)}
              placeholder="Make this more premium without losing readability"
            />
            <div className="mb-2 flex flex-wrap gap-1.5">
              {aiPromptSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  className="rounded-full border border-border bg-bg px-2.5 py-1 text-[10px] text-text-dim hover:text-text"
                  onClick={() => void handleAiRefinement(suggestion)}
                  disabled={isAiRefining}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <button
              className="w-full rounded-md bg-accent py-2 text-xs text-white disabled:opacity-60"
              onClick={() => void handleAiRefinement()}
              disabled={isAiRefining || aiPrompt.trim().length === 0}
            >
              {isAiRefining ? 'Planning AI Refinement...' : 'Refine With AI'}
            </button>
            <div className="mt-2 text-[10px] text-text-dim">
              Requires `OPENAI_API_KEY` on the preview server.
            </div>
            {aiStatus && (
              <div className="mt-2 rounded-md border border-border bg-bg/50 px-2.5 py-2 text-[11px] text-text-dim">
                {aiStatus}
              </div>
            )}
          </div>
        )}

        <button
          className="w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-3"
          onClick={createVariantSet}
        >
          Create 4 Concepts
        </button>

        {recommendedVariantId && (
          <button
            className="w-full py-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-md mb-3"
            onClick={() => approveVariant(recommendedVariantId)}
          >
            Approve Recommended
          </button>
        )}

        {sessionBacked && (
          <button
            className="w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-3 disabled:opacity-60"
            onClick={() => void saveSession()}
            disabled={isSavingSession || !isSessionDirty}
          >
            {isSavingSession ? 'Saving Session...' : isSessionDirty ? 'Save Session' : 'Session Saved'}
          </button>
        )}

        {sessionBacked && (
          <div className={`mb-3 rounded-lg border px-3 py-2 text-[11px] ${isSessionDirty ? 'border-amber-500/20 bg-amber-500/8 text-amber-100' : 'border-emerald-500/20 bg-emerald-500/8 text-emerald-200'}`}>
            {isSessionDirty
              ? 'This variant has unsaved manual edits in the current session.'
              : 'Session is in sync with the current manual edits.'}
          </div>
        )}

        <div className="text-[10px] text-text-dim mb-3">
          {variants.length} variants in session, {approvedCount} approved
        </div>

        {recommendedVariantId && (
          <div className="mb-3 rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-3 py-2 text-[11px] text-emerald-200">
            Recommended: {variants.find((variant) => variant.id === recommendedVariantId)?.name ?? recommendedVariantId}
            {recommendationReason ? ` — ${recommendationReason}` : ''}
          </div>
        )}

        <div className="mb-3 flex flex-wrap gap-1">
          {FILTERS.map((entry) => (
            <button
              key={entry.id}
              className={`rounded-full px-2.5 py-1 text-[10px] transition-colors ${filter === entry.id ? 'bg-accent/10 text-accent border border-accent/30' : 'bg-surface border border-border text-text-dim hover:text-text'}`}
              onClick={() => setFilter(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </div>

        {comparisonPair && (
          <div className="mb-3 rounded-lg border border-border bg-surface/40 p-3">
            <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-text-dim">
              Compare Concepts
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {comparisonPair.map((variant) => {
                const preview = sessionAssetUrl(variant.previewArtifacts[0]?.thumbnailPath);
                const isActive = variant.id === activeVariantId;
                const mode = variant.snapshot.isPanoramic ? 'Panoramic' : 'Individual';
                const unitCount = variant.snapshot.isPanoramic
                  ? `${variant.snapshot.panoramicFrameCount} frames`
                  : `${variant.snapshot.screens.length} screens`;
                const compositionSummary = summarizePanoramicComposition(variant.snapshot);
                const continuity = summarizeContinuity(variant.snapshot);

                return (
                  <div
                    key={`compare-${variant.id}`}
                    className="min-w-[220px] flex-1 rounded-md border border-border bg-bg/60 p-2.5"
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt={`${variant.name} comparison preview`}
                        className="mb-2 block h-24 w-full rounded-md border border-border object-cover object-top"
                      />
                    ) : (
                      <div className="mb-2 flex h-24 items-center justify-center rounded-md border border-dashed border-border text-[10px] text-text-dim">
                        No preview yet
                      </div>
                    )}

                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="text-xs font-medium text-text">{variant.name}</div>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${variant.status === 'approved' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-surface text-text-dim'}`}>
                        {variant.status === 'approved' ? 'Approved' : 'Draft'}
                      </span>
                    </div>

                    <div className="space-y-1 text-[10px] text-text-dim">
                      <div>{mode} · {unitCount}</div>
                      <div>{Object.keys(variant.snapshot.sessionLocales).length} locales · {variant.copyAssignments.length} copy slots</div>
                      {variant.score && <div>Score {variant.score.total}/100</div>}
                      {variant.score?.reason && <div>{variant.score.reason}</div>}
                      {compositionSummary.length > 0 && <div>{compositionSummary.slice(0, 3).join(' · ')}</div>}
                      {continuity && <div>Continuity {continuity.score}/100 · {continuity.summary}</div>}
                    </div>

                    <button
                      className={`mt-2 w-full rounded-md py-1.5 text-[11px] ${isActive ? 'bg-accent text-white' : 'bg-surface border border-border text-text-dim hover:text-text'}`}
                      onClick={() => selectVariant(variant.id)}
                    >
                      {isActive ? 'Active In Editor' : 'Open In Editor'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(autopilotAnalysis.length > 0 || autopilotSelectedCopySet || activePlanVariant || (activeVariant?.history.length ?? 0) > 0 || autopilotRefinementHistory.length > 0) && (
          <div className="mb-3 space-y-3">
            {autopilotAnalysis.length > 0 && (
              <details className="rounded-md border border-border bg-bg/40" open={Boolean(activePlanVariant)}>
                <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-text-dim">
                  Session Analysis
                </summary>
                <div className="space-y-2 border-t border-border px-3 py-2 text-[11px] text-text-dim">
                  <div>
                    {autopilotConceptPlan?.analysisSummary?.selectedCount ?? autopilotAnalysis.length}
                    {' of '}
                    {autopilotConceptPlan?.analysisSummary?.screenshotCount ?? autopilotAnalysis.length}
                    {' screenshots selected'}
                    {analysisUnsafeCount > 0 ? ` · ${analysisUnsafeCount} risky for overlay copy` : ''}
                  </div>
                  {autopilotConceptPlan?.analysisSummary?.topHeroCandidate && (
                    <div>
                      Hero candidate: {basenameLabel(autopilotConceptPlan.analysisSummary.topHeroCandidate)}
                    </div>
                  )}
                  {(flaggedSemanticFlavorPaths.length > 0 || hasReviewedInputs) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {flaggedSemanticFlavorPaths.length > 0 ? (
                        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-100">
                          {flaggedSemanticFlavorPaths.length} screenshot {flaggedSemanticFlavorPaths.length === 1 ? 'needs' : 'need'} family review
                        </span>
                      ) : null}
                      {reviewedSemanticFlavorCount > 0 ? (
                        <span className="rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] text-text-dim">
                          {reviewedSemanticFlavorCount} reviewed override{reviewedSemanticFlavorCount === 1 ? '' : 's'}
                        </span>
                      ) : null}
                      {reviewedPanoramicControlVariantCount > 0 ? (
                        <span className="rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] text-text-dim">
                          {reviewedPanoramicControlVariantCount} panoramic concept override{reviewedPanoramicControlVariantCount === 1 ? '' : 's'}
                        </span>
                      ) : null}
                      {flaggedSemanticFlavorPaths.length > 0 ? (
                        <button
                          className="rounded-md border border-border bg-bg px-2 py-1 text-[10px] text-text-dim hover:text-text"
                          onClick={() => setAutopilotSemanticFlavorOverrides(flaggedSemanticFlavorPaths, 'none')}
                        >
                          Mark Flagged Generic
                        </button>
                      ) : null}
                      {reviewedSemanticFlavorCount > 0 ? (
                        <button
                          className="rounded-md border border-border bg-bg px-2 py-1 text-[10px] text-text-dim hover:text-text"
                          onClick={() => resetAutopilotSemanticFlavorOverrides()}
                        >
                          Reset Reviewed Families
                        </button>
                      ) : null}
                      {hasReviewedInputs && sessionBacked ? (
                        <button
                          className="rounded-md border border-accent/40 bg-accent/15 px-2 py-1 text-[10px] text-accent hover:bg-accent/20 disabled:opacity-60"
                          onClick={() => void handleReviewedRebuild({ refreshPreviews: true, branchVariants: true })}
                          disabled={isReviewRebuilding || isSavingSession}
                        >
                          {isReviewRebuilding ? 'Branching Reviews...' : 'Branch + Rescore'}
                        </button>
                      ) : null}
                      {hasReviewedInputs && sessionBacked ? (
                        <button
                          className="rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-[10px] text-accent hover:bg-accent/15 disabled:opacity-60"
                          onClick={() => void handleReviewedRebuild()}
                          disabled={isReviewRebuilding || isSavingSession}
                        >
                          {isReviewRebuilding ? 'Rebuilding Concepts...' : 'Rebuild Reviewed Concepts'}
                        </button>
                      ) : null}
                      {hasReviewedInputs && sessionBacked ? (
                        <button
                          className="rounded-md border border-accent bg-accent px-2 py-1 text-[10px] text-white hover:bg-accent-hover disabled:opacity-60"
                          onClick={() => void handleReviewedRebuild({ refreshPreviews: true })}
                          disabled={isReviewRebuilding || isSavingSession}
                        >
                          {isReviewRebuilding ? 'Refreshing Reviews...' : 'Rebuild + Rescore'}
                        </button>
                      ) : null}
                    </div>
                  )}
                  {hasReviewedInputs && sessionBacked ? (
                    <div className="mt-2 rounded-md border border-border bg-bg/60 px-2.5 py-2 text-[10px] text-text-dim">
                      Reviewed rebuild can now update concepts in place or create fresh comparison branches from {reviewedRebuildSourceLabel}, and the full refresh loop rerenders only the reviewed concepts instead of repainting every variant in the session.
                    </div>
                  ) : null}
                  {reviewRebuildStatus ? (
                    <div className="mt-2 rounded-md border border-border bg-bg/60 px-2.5 py-2 text-[10px] text-text-dim">
                      {reviewRebuildStatus}
                    </div>
                  ) : null}
                  <div className="space-y-1">
                    {autopilotAnalysis
                      .slice()
                      .sort((left, right) => (left.inferredOrder ?? 999) - (right.inferredOrder ?? 999))
                      .map((entry) => (
                        <div key={entry.path} className="rounded-md border border-border bg-surface px-2.5 py-2">
                          <div className="text-[10px] uppercase tracking-[0.12em] text-text-dim">
                            {(entry.inferredOrder ?? '?')} · {entry.role}
                            {entry.semanticFlavor ? ` · ${formatSlugLabel(entry.semanticFlavor)}` : ''}
                            {!entry.semanticFlavor && entry.semanticFlavorNeedsReview ? ' · generic fallback' : ''}
                            {entry.semanticFlavorNeedsReview ? ' · needs review' : ''}
                            {entry.unsafeForTextOverlay ? ' · text risk' : ''}
                          </div>
                          <div className="mt-1 text-[11px] text-text">{basenameLabel(entry.path)}</div>
                          <div className="mt-1 text-[10px] text-text-dim">
                            Hero {entry.heroPriority}/100 · {entry.focus}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <select
                              className="min-w-0 flex-1 rounded-md border border-border bg-bg px-2 py-1 text-[10px] text-text outline-none"
                              value={semanticFlavorSelectValue(entry)}
                              onChange={(event) => {
                                const value = event.target.value;
                                setAutopilotSemanticFlavorOverride(
                                  entry.path,
                                  value.length > 0 ? value : null,
                                );
                              }}
                            >
                              <option value="">Auto family</option>
                              <option value="none">Generic / none</option>
                              {SEMANTIC_FLAVOR_OPTIONS.map((flavor) => (
                                <option key={flavor} value={flavor}>
                                  {formatSlugLabel(flavor)}
                                </option>
                              ))}
                            </select>
                            {entry.semanticFlavorOverride ? (
                              <button
                                className="rounded-md border border-border bg-bg px-2 py-1 text-[10px] text-text-dim hover:text-text"
                                onClick={() => setAutopilotSemanticFlavorOverride(entry.path, null)}
                              >
                                Reset
                              </button>
                            ) : null}
                          </div>
                          {entry.semanticFlavor && entry.semanticFlavorConfidence ? (
                            <div className="mt-1 text-[10px] text-text-dim">
                              Family confidence: {entry.semanticFlavorConfidence}
                            </div>
                          ) : null}
                          {entry.semanticFlavorReason?.length ? (
                            <div className="mt-1 space-y-1 text-[10px] text-text-dim">
                              {entry.semanticFlavorReason.slice(0, 3).map((line, index) => (
                                <div key={`${entry.path}-reason-${index}`}>{line}</div>
                              ))}
                            </div>
                          ) : null}
                          {formatSemanticAlternatives(entry) ? (
                            <div className="mt-1 text-[10px] text-text-dim">
                              Alternatives: {formatSemanticAlternatives(entry)}
                            </div>
                          ) : null}
                          {entry.semanticFlavorOverride ? (
                            <div className="mt-1 text-[10px] text-text-dim">
                              Reviewed override:
                              {' '}
                              {entry.semanticFlavorOverride === 'none'
                                ? 'generic / none'
                                : formatSlugLabel(entry.semanticFlavorOverride)}
                              {entry.inferredSemanticFlavor
                                ? ` · inferred ${formatSlugLabel(entry.inferredSemanticFlavor)}${entry.inferredSemanticFlavorConfidence ? ` (${entry.inferredSemanticFlavorConfidence})` : ''}`
                                : ''}
                            </div>
                          ) : null}
                          {entry.embeddedTextSample?.length ? (
                            <div className="mt-1 text-[10px] text-text-dim">
                              OCR: {entry.embeddedTextSample.join(' · ')}
                            </div>
                          ) : null}
                          {entry.textOccupiedRegions?.length ? (
                            <div className="mt-1 text-[10px] text-text-dim">
                              Occupied: {entry.textOccupiedRegions.map(formatSlugLabel).join(' · ')}
                            </div>
                          ) : null}
                        </div>
                      ))}
                  </div>
                </div>
              </details>
            )}

            {autopilotSelectedCopySet && (
              <details className="rounded-md border border-border bg-bg/40">
                <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-text-dim">
                  Selected Copy
                </summary>
                <div className="space-y-2 border-t border-border px-3 py-2">
                  {renderSelectedCopyRows(autopilotSelectedCopySet).map((row) => (
                    <div key={row.key} className="rounded-md border border-border bg-surface px-2.5 py-2">
                      <div className="text-[10px] text-text-dim">
                        {row.label}
                        {row.sourceFeature ? ` · ${row.sourceFeature}` : ''}
                      </div>
                      <div className="mt-1 whitespace-pre-line text-[11px] font-medium text-text">
                        {row.headline}
                      </div>
                      {row.subtitle ? (
                        <div className="mt-1 text-[10px] leading-4 text-text-dim">
                          {row.subtitle}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </details>
            )}

            {activePlanVariant && (
              <details className="rounded-md border border-border bg-bg/40" open>
                <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-text-dim">
                  Active Concept Plan
                </summary>
                <div className="space-y-3 border-t border-border px-3 py-2 text-[11px] text-text-dim">
                  <div>
                    <div className="text-text">{activePlanVariant.name}</div>
                    <div>{activePlanVariant.recipe} · {activePlanVariant.style}</div>
                    <div className="mt-1">{activePlanVariant.strategy}</div>
                  </div>

                  {sessionBacked && activePlanVariant.mode === 'panoramic' && activeVariantId ? (
                    <div className="rounded-md border border-border bg-surface px-2.5 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[10px] uppercase tracking-[0.12em] text-text-dim">
                          Recipe Controls
                        </div>
                        {activePanoramicReviewControlSummary ? (
                          <span className="rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] text-text-dim">
                            {activePanoramicReviewControlSummary}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 grid gap-2 md:grid-cols-3">
                        <label className="space-y-1">
                          <div className="text-[10px] text-text-dim">Recipe</div>
                          <select
                            className="w-full rounded-md border border-border bg-bg px-2 py-1 text-[10px] text-text outline-none"
                            value={panoramicReviewControlValue(activePanoramicReviewControls?.recipe)}
                            onChange={(event) => {
                              const value = event.target.value;
                              setAutopilotPanoramicReviewControls(activeVariantId, {
                                recipe: value.length > 0 ? value : null,
                              });
                            }}
                          >
                            <option value="">Auto recipe</option>
                            {PANORAMIC_RECIPE_OPTIONS.map((recipe) => (
                              <option key={recipe} value={recipe}>
                                {formatSlugLabel(recipe)}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="space-y-1">
                          <div className="text-[10px] text-text-dim">Pacing</div>
                          <select
                            className="w-full rounded-md border border-border bg-bg px-2 py-1 text-[10px] text-text outline-none"
                            value={panoramicReviewControlValue(activePanoramicReviewControls?.pacing)}
                            onChange={(event) => {
                              const value = event.target.value;
                              setAutopilotPanoramicReviewControls(activeVariantId, {
                                pacing: value.length > 0 ? value as AutopilotPanoramicReviewControls['pacing'] : null,
                              });
                            }}
                          >
                            <option value="">Auto pacing</option>
                            {PANORAMIC_PACING_OPTIONS.map((pacing) => (
                              <option key={pacing} value={pacing}>
                                {formatSlugLabel(pacing)}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="space-y-1">
                          <div className="text-[10px] text-text-dim">Continuity</div>
                          <select
                            className="w-full rounded-md border border-border bg-bg px-2 py-1 text-[10px] text-text outline-none"
                            value={panoramicReviewControlValue(activePanoramicReviewControls?.continuityMotif)}
                            onChange={(event) => {
                              const value = event.target.value;
                              setAutopilotPanoramicReviewControls(activeVariantId, {
                                continuityMotif: value.length > 0 ? value : null,
                              });
                            }}
                          >
                            <option value="">Auto motif</option>
                            {PANORAMIC_CONTINUITY_OPTIONS.map((motif) => (
                              <option key={motif} value={motif}>
                                {formatSlugLabel(motif)}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="space-y-1">
                          <div className="text-[10px] text-text-dim">Support System</div>
                          <select
                            className="w-full rounded-md border border-border bg-bg px-2 py-1 text-[10px] text-text outline-none"
                            value={panoramicReviewControlValue(activePanoramicReviewControls?.supportSystem)}
                            onChange={(event) => {
                              const value = event.target.value;
                              setAutopilotPanoramicReviewControls(activeVariantId, {
                                supportSystem: value.length > 0 ? value : null,
                              });
                            }}
                          >
                            <option value="">Auto support</option>
                            {PANORAMIC_SUPPORT_SYSTEM_OPTIONS.map((system) => (
                              <option key={system} value={system}>
                                {formatSlugLabel(system)}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="space-y-1">
                          <div className="text-[10px] text-text-dim">Proof Density</div>
                          <select
                            className="w-full rounded-md border border-border bg-bg px-2 py-1 text-[10px] text-text outline-none"
                            value={panoramicReviewControlValue(activePanoramicReviewControls?.proofDensity)}
                            onChange={(event) => {
                              const value = event.target.value;
                              setAutopilotPanoramicReviewControls(activeVariantId, {
                                proofDensity: value.length > 0 ? value as AutopilotPanoramicReviewControls['proofDensity'] : null,
                              });
                            }}
                          >
                            <option value="">Auto proof</option>
                            {PANORAMIC_PROOF_DENSITY_OPTIONS.map((density) => (
                              <option key={density} value={density}>
                                {formatSlugLabel(density)}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="space-y-1">
                          <div className="text-[10px] text-text-dim">Decorative Intensity</div>
                          <select
                            className="w-full rounded-md border border-border bg-bg px-2 py-1 text-[10px] text-text outline-none"
                            value={panoramicReviewControlValue(activePanoramicReviewControls?.decorativeIntensity)}
                            onChange={(event) => {
                              const value = event.target.value;
                              setAutopilotPanoramicReviewControls(activeVariantId, {
                                decorativeIntensity: value.length > 0 ? value as AutopilotPanoramicReviewControls['decorativeIntensity'] : null,
                              });
                            }}
                          >
                            <option value="">Auto decor</option>
                            {PANORAMIC_DECORATIVE_INTENSITY_OPTIONS.map((intensity) => (
                              <option key={intensity} value={intensity}>
                                {formatSlugLabel(intensity)}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="mt-2 text-[10px] text-text-dim">
                        {hasActivePanoramicReviewControls
                          ? 'These saved overrides will be reapplied during reviewed rebuilds for this concept, including pacing, proof weight, and decorative restraint.'
                          : 'Adjust these controls, save the session, then rebuild or rescore to materialize deterministic panoramic overrides.'}
                      </div>
                      {sessionBacked && hasActivePanoramicReviewControls ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            className="rounded-md border border-accent/40 bg-accent/15 px-2 py-1 text-[10px] text-accent hover:bg-accent/20 disabled:opacity-60"
                            onClick={() => void handleReviewedRebuild({ refreshPreviews: true, branchVariants: true })}
                            disabled={isReviewRebuilding || isSavingSession}
                          >
                            {isReviewRebuilding ? 'Branching Reviews...' : 'Branch + Rescore'}
                          </button>
                          <button
                            className="rounded-md border border-accent bg-accent px-2 py-1 text-[10px] text-white hover:bg-accent-hover disabled:opacity-60"
                            onClick={() => void handleReviewedRebuild({ refreshPreviews: true })}
                            disabled={isReviewRebuilding || isSavingSession}
                          >
                            {isReviewRebuilding ? 'Refreshing Reviews...' : 'Rebuild + Rescore'}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {activePlanVariant.frameStrategy && (
                    <div className="rounded-md border border-border bg-surface px-2.5 py-2">
                      <div className="text-[10px] uppercase tracking-[0.12em] text-text-dim">
                        Frame Strategy
                      </div>
                      <div className="mt-1 text-text">
                        {formatFrameTreatment(activePlanVariant.frameStrategy.defaultTreatment)}
                      </div>
                      <div className="mt-1">{activePlanVariant.frameStrategy.rationale}</div>
                      {activePlanVariant.frameStrategy.framelessAllowedWhen.length ? (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {activePlanVariant.frameStrategy.framelessAllowedWhen.map((rule) => (
                            <span
                              key={`${activePlanVariant.id}-${rule}`}
                              className="rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] text-text-dim"
                            >
                              {rule}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {activePlanVariant.screens?.length ? (
                    <div className="space-y-2">
                      {activePlanVariant.screens.map((screen) => (
                        <div
                          key={`${activePlanVariant.id}-screen-${screen.index}`}
                          className="rounded-md border border-border bg-surface px-2.5 py-2"
                        >
                          <div className="text-[10px] uppercase tracking-[0.12em] text-text-dim">
                            Screen {screen.index} · {screen.slideRole} · {screen.sourceRole}
                          </div>
                          <div className="mt-1 text-[10px] text-text-dim">
                            {basenameLabel(screen.sourcePath)} · {formatSlugLabel(screen.composition)} · {formatSlugLabel(screen.layout)}
                          </div>
                          <div className="mt-2 text-[11px] text-text">{screen.copyDirection}</div>
                          {screen.cropPlan && (
                            <div className="mt-2 rounded-md border border-border bg-bg/60 px-2 py-2 text-[10px] text-text-dim">
                              Crop {formatSlugLabel(screen.cropPlan.usage)} · anchor {formatSlugLabel(screen.cropPlan.anchor)}
                              {screen.cropPlan.avoidRegions.length
                                ? ` · avoid ${screen.cropPlan.avoidRegions.map(formatSlugLabel).join(', ')}`
                                : ''}
                              <div className="mt-1">{screen.cropPlan.rationale}</div>
                            </div>
                          )}
                          {screen.implementationNote && (
                            <div className="mt-2 text-[10px] text-text-dim">{screen.implementationNote}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {activePlanVariant.canvasPlan && (
                    <div className="rounded-md border border-border bg-surface px-2.5 py-2">
                      <div className="text-[10px] uppercase tracking-[0.12em] text-text-dim">
                        Canvas Goal
                      </div>
                      <div className="mt-1 text-text">{activePlanVariant.canvasPlan.designGoal}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {activePlanVariant.canvasPlan.requiredElements.map((element) => (
                          <span
                            key={`${activePlanVariant.id}-${element.type}-${element.purpose}`}
                            className="rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] text-text-dim"
                          >
                            {element.type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activePlanVariant.frames?.length ? (
                    <div className="space-y-2">
                      {activePlanVariant.frames.map((frame) => (
                        <div
                          key={`${activePlanVariant.id}-frame-${frame.frame}`}
                          className="rounded-md border border-border bg-surface px-2.5 py-2"
                        >
                          <div className="text-[10px] uppercase tracking-[0.12em] text-text-dim">
                            Frame {frame.frame} · {frame.storyBeat} · {frame.sourceRole}
                          </div>
                          <div className="mt-1 text-[10px] text-text-dim">
                            {basenameLabel(frame.sourcePath)} · crop {frame.cropSuitability}
                          </div>
                          {(frame.rhythmRole || frame.layoutArchetype || frame.continuityMotif || frame.supportSystem) && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {frame.rhythmRole ? (
                                <span className="rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] text-text-dim">
                                  {formatSlugLabel(frame.rhythmRole)}
                                </span>
                              ) : null}
                              {frame.layoutArchetype ? (
                                <span className="rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] text-text-dim">
                                  {formatSlugLabel(frame.layoutArchetype)}
                                </span>
                              ) : null}
                              {frame.continuityMotif ? (
                                <span className="rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] text-text-dim">
                                  {formatSlugLabel(frame.continuityMotif)}
                                </span>
                              ) : null}
                              {frame.supportSystem ? (
                                <span className="rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] text-text-dim">
                                  {formatSlugLabel(frame.supportSystem)}
                                </span>
                              ) : null}
                            </div>
                          )}
                          {frame.cropPlan && (
                            <div className="mt-2 rounded-md border border-border bg-bg/60 px-2 py-2 text-[10px] text-text-dim">
                              Crop {formatSlugLabel(frame.cropPlan.usage)} · anchor {formatSlugLabel(frame.cropPlan.anchor)}
                              {frame.cropPlan.avoidRegions.length
                                ? ` · avoid ${frame.cropPlan.avoidRegions.map(formatSlugLabel).join(', ')}`
                                : ''}
                              <div className="mt-1">{frame.cropPlan.rationale}</div>
                            </div>
                          )}
                          {frame.compositionFeatures?.length ? (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {frame.compositionFeatures.map((feature) => (
                                <span
                                  key={`${activePlanVariant.id}-frame-${frame.frame}-${feature}`}
                                  className="rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] text-text-dim"
                                >
                                  {formatCompositionFeature(feature)}
                                </span>
                              ))}
                            </div>
                          ) : null}
                          {frame.compositionNote && (
                            <div className="mt-2 text-[11px] text-text">{frame.compositionNote}</div>
                          )}
                          {frame.transitionIntent && (
                            <div className="mt-2 text-[10px] text-text-dim">{frame.transitionIntent}</div>
                          )}
                          {frame.continuityRule && (
                            <div className="mt-1 text-[10px] text-text-dim">{frame.continuityRule}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </details>
            )}

            {(activeVariant?.history.length || autopilotRefinementHistory.length > 0) && (
              <details className="rounded-md border border-border bg-bg/40">
                <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-text-dim">
                  Session History
                </summary>
                <div className="space-y-2 border-t border-border px-3 py-2 text-[11px] text-text-dim">
                  {activeVariant?.history.slice(0, 8).map((entry) => (
                    <div key={entry.id} className="rounded-md border border-border bg-surface px-2.5 py-2">
                      <div className="text-[10px] uppercase tracking-[0.12em] text-text-dim">
                        {entry.type} · {formatTimestamp(entry.createdAt)}
                      </div>
                      <div className="mt-1 text-text">{entry.label}</div>
                      {entry.detail && <div className="mt-1">{entry.detail}</div>}
                    </div>
                  ))}
                  {autopilotRefinementHistory.slice(0, 6).map((entry, index) => (
                    <div key={`${entry.createdAt}-${index}`} className="rounded-md border border-border bg-surface px-2.5 py-2">
                      <div className="text-[10px] uppercase tracking-[0.12em] text-text-dim">
                        {entry.mode === 'ai' ? 'ai refinement' : 'refinement log'} · {formatTimestamp(entry.createdAt)}
                      </div>
                      <div className="mt-1 text-text">{entry.prompt}</div>
                      {entry.detail && <div className="mt-1">{entry.detail}</div>}
                      {entry.actions?.length ? (
                        <div className="mt-1 text-[10px] text-text-dim">
                          {entry.actions.map((actionId) => getRefinementLabel(actionId)).join(' · ')}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        <div className="space-y-2">
          {filteredVariants.map((variant) => {
            const isActive = variant.id === activeVariantId;
            const isRecommended = variant.id === recommendedVariantId;
            const mode = variant.snapshot.isPanoramic ? 'Panoramic' : 'Individual';
            const unitCount = variant.snapshot.isPanoramic
              ? `${variant.snapshot.panoramicFrameCount} frames`
              : `${variant.snapshot.screens.length} screens`;
            const lastArtifact = variant.artifacts[0];
            const preview = variant.previewArtifacts[0];
            const previewUrl = sessionAssetUrl(preview?.thumbnailPath);
            const hasCopyPlan = variant.copyAssignments.length > 0;
            const compositionSummary = summarizePanoramicComposition(variant.snapshot);
            const continuity = summarizeContinuity(variant.snapshot);
            const provenance = describeProvenance(variant);
            const reviewControlSummary = summarizePanoramicReviewControls(autopilotReviewControls[variant.id]);

            return (
              <div
                key={variant.id}
                className={`rounded-lg border p-3 ${isActive ? 'border-accent bg-accent/5' : 'border-border bg-surface-2/40'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    className="flex-1 bg-bg border border-border rounded px-2 py-1 text-xs text-text"
                    value={variant.name}
                    onChange={(e) => renameVariant(variant.id, e.target.value)}
                    aria-label="Variant name"
                  />
                  <span className={`text-[10px] px-2 py-1 rounded ${variant.status === 'approved' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-surface text-text-dim'}`}>
                    {variant.status === 'approved' ? 'Approved' : 'Draft'}
                  </span>
                  {isRecommended && (
                    <span className="text-[10px] px-2 py-1 rounded bg-amber-500/15 text-amber-200">
                      Recommended
                    </span>
                  )}
                </div>

                {previewUrl && (
                  <div className="mb-3 overflow-hidden rounded-md border border-border bg-bg">
                    <img
                      src={previewUrl}
                      alt={`${variant.name} preview`}
                      className="block w-full h-28 object-cover object-top"
                    />
                  </div>
                )}

                {variant.description && (
                  <div className="text-[11px] text-text-dim mb-3">
                    {variant.description}
                  </div>
                )}

                {provenance && (
                  <div className="mb-3 rounded-md border border-border bg-bg/40 px-2.5 py-2 text-[10px] text-text-dim">
                    {provenance}
                  </div>
                )}

                {reviewControlSummary && (
                  <div className="mb-3 rounded-md border border-border bg-bg/40 px-2.5 py-2 text-[10px] text-text-dim">
                    Review controls: {reviewControlSummary}
                  </div>
                )}

                {hasCopyPlan && (
                  <details
                    className="mb-3 rounded-md border border-border bg-bg/40"
                    open={isActive || isRecommended}
                  >
                    <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-text-dim">
                      Copy Plan · {variant.copyAssignments.length} slots
                    </summary>
                    <div className="space-y-2 border-t border-border px-3 py-2">
                      {variant.copyAssignments.map((assignment, index) => (
                        <div
                          key={`${assignment.unitKind}-${assignment.unitIndex}-${assignment.slot}-${index}`}
                          className="rounded-md border border-border bg-surface px-2.5 py-2"
                        >
                          <div className="text-[10px] text-text-dim">
                            {assignment.unitKind === 'frame' ? 'Frame' : 'Screen'} {assignment.unitIndex}
                            {' · '}
                            {formatCopySlot(assignment.slot)}
                            {assignment.sourceFeature ? ` · ${assignment.sourceFeature}` : ''}
                          </div>
                          <div className="mt-1 whitespace-pre-line text-[11px] font-medium text-text">
                            {assignment.headline}
                          </div>
                          {assignment.subtitle ? (
                            <div className="mt-1 text-[10px] leading-4 text-text-dim">
                              {assignment.subtitle}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </details>
                )}

                <div className="text-[10px] text-text-dim space-y-1 mb-3">
                  <div>{mode} · {unitCount} · {Object.keys(variant.snapshot.sessionLocales).length} locales</div>
                  <div>Updated {formatTimestamp(variant.updatedAt)}</div>
                  <div>{variant.artifacts.length} exports recorded</div>
                  {compositionSummary.length > 0 && (
                    <div>{compositionSummary.join(' · ')}</div>
                  )}
                  {continuity && (
                    <div>Continuity {continuity.score}/100 · {continuity.summary}</div>
                  )}
                  {variant.score && (
                    <div>Score {variant.score.total}/100 · {variant.score.reason}</div>
                  )}
                  {lastArtifact && (
                    <div>
                      Last export: {lastArtifact.kind === 'frames' ? 'frames' : 'screens'} · {formatTimestamp(lastArtifact.exportedAt)}
                    </div>
                  )}
                  {variant.score?.flags.length ? (
                    <div>
                      Flags: {variant.score.flags.join(' · ')}
                    </div>
                  ) : null}
                  {variant.score?.modelRanking ? (
                    <div>
                      Visual model {variant.score.modelRanking.score}/100
                      {typeof variant.score.modelRanking.rank === 'number' ? ` · rank ${variant.score.modelRanking.rank}` : ''}
                    </div>
                  ) : null}
                </div>

                {variant.score && (
                  <details className="mb-3 rounded-md border border-border bg-bg/40">
                    <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-text-dim">
                      Score Breakdown
                    </summary>
                    <div className="space-y-2 border-t border-border px-3 py-2">
                      {variant.score.highlights?.length ? (
                        <div className="rounded-md border border-emerald-500/20 bg-emerald-500/8 px-2.5 py-2 text-[10px] text-emerald-100">
                          Highlights: {variant.score.highlights.join(' · ')}
                        </div>
                      ) : null}
                      {variant.score.issues?.length ? (
                        <div className="rounded-md border border-amber-500/20 bg-amber-500/8 px-2.5 py-2 text-[10px] text-amber-100">
                          Issues: {variant.score.issues.join(' · ')}
                        </div>
                      ) : null}
                      {Object.entries(variant.score.breakdown).map(([label, value]) => (
                        <div key={label}>
                          <div className="mb-1 flex items-center justify-between text-[10px] text-text-dim">
                            <span>{label}</span>
                            <span>{value}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-surface">
                            <div
                              className="h-full rounded-full bg-accent"
                              style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}

                {continuity && continuity.flags.length > 0 && (
                  <details className="mb-3 rounded-md border border-border bg-bg/40">
                    <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-text-dim">
                      Continuity Review
                    </summary>
                    <div className="space-y-2 border-t border-border px-3 py-2 text-[11px] text-text-dim">
                      {continuity.flags.map((flag) => (
                        <div key={`${variant.id}-${flag}`} className="rounded-md border border-border bg-surface px-2.5 py-2">
                          {flag}
                        </div>
                      ))}
                    </div>
                  </details>
                )}

                {variant.history.length > 0 && (
                  <details className="mb-3 rounded-md border border-border bg-bg/40">
                    <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-text-dim">
                      Variant History
                    </summary>
                    <div className="space-y-2 border-t border-border px-3 py-2 text-[11px] text-text-dim">
                      {variant.history.slice(0, 6).map((entry) => (
                        <div key={entry.id} className="rounded-md border border-border bg-surface px-2.5 py-2">
                          <div className="text-[10px] uppercase tracking-[0.12em] text-text-dim">
                            {entry.type} · {formatTimestamp(entry.createdAt)}
                          </div>
                          <div className="mt-1 text-text">{entry.label}</div>
                          {entry.detail && <div className="mt-1">{entry.detail}</div>}
                        </div>
                      ))}
                    </div>
                  </details>
                )}

                <div className="flex gap-2">
                  <button
                    className={`flex-1 py-2 text-xs rounded-md ${isActive ? 'bg-accent text-white' : 'bg-surface border border-border text-text-dim hover:text-text'}`}
                    onClick={() => selectVariant(variant.id)}
                  >
                    {isActive ? 'Active' : 'Open'}
                  </button>
                  <button
                    className={`flex-1 py-2 text-xs rounded-md border ${variant.status === 'approved' ? 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10' : 'border-border text-text-dim hover:text-text bg-surface'}`}
                    onClick={() =>
                      variant.status === 'approved'
                        ? setVariantStatus(variant.id, 'draft')
                        : approveVariant(variant.id)
                    }
                  >
                    {variant.status === 'approved' ? 'Unapprove' : 'Approve'}
                  </button>
                  <button
                    className="py-2 px-3 text-xs rounded-md border border-border text-text-dim hover:text-red-300 bg-surface disabled:opacity-50"
                    disabled={variants.length <= 1}
                    onClick={async () => {
                      const ok = await confirm({
                        title: 'Delete Variant',
                        message: `Delete ${variant.name}?`,
                      });
                      if (ok) deleteVariant(variant.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
