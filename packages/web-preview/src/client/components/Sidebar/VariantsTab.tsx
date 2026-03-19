import { useMemo } from 'react';
import { Section } from '../Controls/Section';
import { usePreviewStore } from '../../store';
import { useConfirmDialog } from '../Controls/ConfirmDialog';

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
  const { confirm, dialog } = useConfirmDialog();

  const approvedCount = useMemo(
    () => variants.filter((variant) => variant.status === 'approved').length,
    [variants],
  );

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
            disabled={isSavingSession}
          >
            {isSavingSession ? 'Saving Session...' : 'Save Session'}
          </button>
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

        <div className="space-y-2">
          {variants.map((variant) => {
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
