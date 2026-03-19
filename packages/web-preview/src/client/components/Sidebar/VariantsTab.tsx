import { useMemo } from 'react';
import { Section } from '../Controls/Section';
import { usePreviewStore } from '../../store';
import { useConfirmDialog } from '../Controls/ConfirmDialog';

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

export function VariantsTab() {
  const variants = usePreviewStore((s) => s.variants);
  const activeVariantId = usePreviewStore((s) => s.activeVariantId);
  const createVariant = usePreviewStore((s) => s.createVariant);
  const duplicateActiveVariant = usePreviewStore((s) => s.duplicateActiveVariant);
  const createVariantSet = usePreviewStore((s) => s.createVariantSet);
  const selectVariant = usePreviewStore((s) => s.selectVariant);
  const renameVariant = usePreviewStore((s) => s.renameVariant);
  const deleteVariant = usePreviewStore((s) => s.deleteVariant);
  const setVariantStatus = usePreviewStore((s) => s.setVariantStatus);
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
          Create 3 Concepts
        </button>

        <div className="text-[10px] text-text-dim mb-3">
          {variants.length} variants in session, {approvedCount} approved
        </div>

        <div className="space-y-2">
          {variants.map((variant) => {
            const isActive = variant.id === activeVariantId;
            const mode = variant.snapshot.isPanoramic ? 'Panoramic' : 'Individual';
            const lastArtifact = variant.artifacts[0];

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
                </div>

                <div className="text-[10px] text-text-dim space-y-1 mb-3">
                  <div>{mode} · {variant.snapshot.screens.length} screens · {Object.keys(variant.snapshot.sessionLocales).length} locales</div>
                  <div>Updated {formatTimestamp(variant.updatedAt)}</div>
                  <div>{variant.artifacts.length} exports recorded</div>
                  {lastArtifact && (
                    <div>
                      Last export: {lastArtifact.kind === 'frames' ? 'frames' : 'screens'} · {formatTimestamp(lastArtifact.exportedAt)}
                    </div>
                  )}
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
                    onClick={() => setVariantStatus(variant.id, variant.status === 'approved' ? 'draft' : 'approved')}
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
