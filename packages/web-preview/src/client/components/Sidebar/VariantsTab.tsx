import { useEffect, useRef, useState } from 'react';
import { Section } from '../Controls/Section';
import { usePreviewStore } from '../../store';
import type { VariantRecord } from '../../store';
import { useConfirmDialog } from '../Controls/ConfirmDialog';

function sessionAssetUrl(pathValue: string | null | undefined): string | null {
  if (!pathValue) return null;
  return `/api/session-asset?path=${encodeURIComponent(pathValue)}`;
}

function variantMode(variant: VariantRecord): 'Individual' | 'Panoramic' {
  return variant.snapshot.isPanoramic ? 'Panoramic' : 'Individual';
}

function variantThumb(variant: VariantRecord): string | null {
  const artifact = variant.previewArtifacts[0];
  if (!artifact) return null;
  return sessionAssetUrl(artifact.thumbnailPath ?? artifact.filePaths[0] ?? null);
}

interface VariantCardProps {
  variant: VariantRecord;
  isActive: boolean;
  isRecommended: boolean;
  onSelect: () => void;
  onRename: (nextName: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onApprove: () => void;
}

function VariantCard({
  variant,
  isActive,
  isRecommended,
  onSelect,
  onRename,
  onDuplicate,
  onDelete,
  onApprove,
}: VariantCardProps) {
  const thumb = variantThumb(variant);
  const mode = variantMode(variant);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(variant.name);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  useEffect(() => {
    if (!editing) setDraftName(variant.name);
  }, [variant.name, editing]);

  const commitRename = () => {
    const next = draftName.trim();
    if (next && next !== variant.name) onRename(next);
    setEditing(false);
  };

  return (
    <div
      className={`relative rounded-lg border transition-colors ${
        isActive
          ? 'border-accent bg-accent/5'
          : 'border-border bg-surface hover:border-accent/40'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-t-lg overflow-hidden"
        aria-pressed={isActive}
        aria-label={`Select variant ${variant.name}`}
      >
        <div className="aspect-[9/19.5] bg-bg flex items-center justify-center overflow-hidden">
          {thumb ? (
            <img
              src={thumb}
              alt=""
              className="w-full h-full object-contain"
              draggable={false}
            />
          ) : (
            <span className="text-[10px] text-text-dim px-2 text-center">No preview rendered yet</span>
          )}
        </div>
      </button>

      <div className="px-2.5 py-2 flex items-start gap-1.5">
        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') {
                  setDraftName(variant.name);
                  setEditing(false);
                }
              }}
              autoFocus
              className="w-full bg-bg border border-accent/40 rounded px-1 py-0.5 text-[11px] text-text focus:outline-none"
            />
          ) : (
            <div
              className="text-[11px] font-medium text-text truncate"
              onDoubleClick={() => setEditing(true)}
              title={variant.name}
            >
              {variant.name}
            </div>
          )}
          <div className="flex items-center gap-1 mt-0.5">
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded ${
                mode === 'Panoramic'
                  ? 'bg-purple-500/10 text-purple-300'
                  : 'bg-blue-500/10 text-blue-300'
              }`}
            >
              {mode}
            </span>
            {variant.status === 'approved' && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                Approved
              </span>
            )}
            {isRecommended && !isActive && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                Recommended
              </span>
            )}
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((open) => !open);
            }}
            className="text-text-dim hover:text-text rounded p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Actions for ${variant.name}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <circle cx="3" cy="7" r="1.2" />
              <circle cx="7" cy="7" r="1.2" />
              <circle cx="11" cy="7" r="1.2" />
            </svg>
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-1 z-10 w-36 rounded-md border border-border bg-surface-2 shadow-lg py-1 text-[11px]"
            >
              <button
                role="menuitem"
                className="w-full px-3 py-1.5 text-left hover:bg-accent/10 text-text"
                onClick={() => {
                  setMenuOpen(false);
                  setEditing(true);
                }}
              >
                Rename
              </button>
              <button
                role="menuitem"
                className="w-full px-3 py-1.5 text-left hover:bg-accent/10 text-text"
                onClick={() => {
                  setMenuOpen(false);
                  onDuplicate();
                }}
              >
                Duplicate
              </button>
              {variant.status !== 'approved' && (
                <button
                  role="menuitem"
                  className="w-full px-3 py-1.5 text-left hover:bg-accent/10 text-emerald-300"
                  onClick={() => {
                    setMenuOpen(false);
                    onApprove();
                  }}
                >
                  Approve
                </button>
              )}
              <button
                role="menuitem"
                className="w-full px-3 py-1.5 text-left hover:bg-red-500/10 text-red-300"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function VariantsTab() {
  const variants = usePreviewStore((s) => s.variants);
  const activeVariantId = usePreviewStore((s) => s.activeVariantId);
  const recommendedVariantId = usePreviewStore((s) => s.recommendedVariantId);
  const recommendationReason = usePreviewStore((s) => s.recommendationReason);
  const selectVariant = usePreviewStore((s) => s.selectVariant);
  const renameVariant = usePreviewStore((s) => s.renameVariant);
  const duplicateActiveVariant = usePreviewStore((s) => s.duplicateActiveVariant);
  const deleteVariant = usePreviewStore((s) => s.deleteVariant);
  const approveVariant = usePreviewStore((s) => s.approveVariant);
  const createVariant = usePreviewStore((s) => s.createVariant);
  const setActiveTab = usePreviewStore((s) => s.setActiveTab);

  const { confirm, dialog } = useConfirmDialog();

  const recommended = variants.find((variant) => variant.id === recommendedVariantId) ?? null;

  const handleDelete = async (variant: VariantRecord) => {
    if (variants.length <= 1) return;
    const ok = await confirm({
      title: `Delete ${variant.name}?`,
      message: 'This will remove the variant from the session. You can always run autopilot again.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (ok) deleteVariant(variant.id);
  };

  return (
    <>
      {dialog}
      <Section
        title="Variants"
        tooltip="Pick a variant to load it into the editor. Double-click a name to rename it."
        defaultCollapsed={false}
      >
        {recommended && (
          <div className="mb-2 rounded-md border border-accent/30 bg-accent/5 px-2.5 py-1.5 text-[10px] text-text-dim">
            <span className="text-accent font-medium">Recommended: </span>
            <span className="text-text">{recommended.name}</span>
          </div>
        )}

        {variants.length === 0 ? (
          <div className="text-[11px] text-text-dim text-center py-4">
            No variants yet. Run <code className="px-1 bg-surface-2 rounded">appframe autopilot</code> or
            create one below.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {variants.map((variant) => (
              <VariantCard
                key={variant.id}
                variant={variant}
                isActive={variant.id === activeVariantId}
                isRecommended={variant.id === recommendedVariantId}
                onSelect={() => selectVariant(variant.id)}
                onRename={(next) => renameVariant(variant.id, next)}
                onDuplicate={() => {
                  if (variant.id !== activeVariantId) selectVariant(variant.id);
                  duplicateActiveVariant();
                }}
                onDelete={() => handleDelete(variant)}
                onApprove={() => approveVariant(variant.id)}
              />
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={() => createVariant()}
            className="flex-1 text-[11px] py-1.5 rounded-md bg-surface-2 border border-border text-text-dim hover:text-text hover:border-accent/30"
          >
            New variant
          </button>
          <button
            type="button"
            onClick={duplicateActiveVariant}
            disabled={!activeVariantId}
            className="flex-1 text-[11px] py-1.5 rounded-md bg-surface-2 border border-border text-text-dim hover:text-text hover:border-accent/30 disabled:opacity-40"
          >
            Duplicate current
          </button>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('export')}
          className="w-full mt-2 text-[11px] py-1.5 rounded-md bg-accent text-white hover:bg-accent-hover"
        >
          Go to Download
        </button>
      </Section>
    </>
  );
}
