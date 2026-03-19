import { useMemo, useState } from 'react';
import { Section } from '../Controls/Section';
import { usePreviewStore, variantSnapshotFromState } from '../../store';
import { useConfirmDialog } from '../Controls/ConfirmDialog';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'individual', label: 'Individual' },
  { id: 'panoramic', label: 'Panoramic' },
  { id: 'approved', label: 'Approved' },
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

export function VariantsTab() {
  const variants = usePreviewStore((s) => s.variants);
  const activeVariantId = usePreviewStore((s) => s.activeVariantId);
  const recommendedVariantId = usePreviewStore((s) => s.recommendedVariantId);
  const recommendationReason = usePreviewStore((s) => s.recommendationReason);
  const createVariant = usePreviewStore((s) => s.createVariant);
  const duplicateActiveVariant = usePreviewStore((s) => s.duplicateActiveVariant);
  const createVariantSet = usePreviewStore((s) => s.createVariantSet);
  const selectVariant = usePreviewStore((s) => s.selectVariant);
  const approveVariant = usePreviewStore((s) => s.approveVariant);
  const renameVariant = usePreviewStore((s) => s.renameVariant);
  const deleteVariant = usePreviewStore((s) => s.deleteVariant);
  const setVariantStatus = usePreviewStore((s) => s.setVariantStatus);
  const sessionBacked = usePreviewStore((s) => s.sessionBacked);
  const saveSession = usePreviewStore((s) => s.saveSession);
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
  const isSessionDirty = useMemo(
    () => (
      sessionBacked
      && activeVariant != null
      && JSON.stringify(activeVariant.snapshot) !== JSON.stringify(currentSnapshot)
    ),
    [sessionBacked, activeVariant, currentSnapshot],
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
            Duplicate Active
          </button>
        </div>

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
                        </div>
                      ))}
                    </div>
                  </details>
                )}

                <div className="text-[10px] text-text-dim space-y-1 mb-3">
                  <div>{mode} · {unitCount} · {Object.keys(variant.snapshot.sessionLocales).length} locales</div>
                  <div>Updated {formatTimestamp(variant.updatedAt)}</div>
                  <div>{variant.artifacts.length} exports recorded</div>
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
                </div>

                {variant.score && (
                  <details className="mb-3 rounded-md border border-border bg-bg/40">
                    <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-text-dim">
                      Score Breakdown
                    </summary>
                    <div className="space-y-2 border-t border-border px-3 py-2">
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
