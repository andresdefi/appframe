import { useEffect, useState, useCallback, useRef } from 'react';
import {
  createProject,
  deleteProjectApi,
  duplicateProjectApi,
  fetchProjects,
  renameProjectApi,
  touchProject,
  type ProjectSummary,
} from '../utils/api';

export interface ProjectPickerProps {
  /** Currently active project so we can highlight / refuse to delete it. */
  activeProject: string;
  /** Called when the user picks a project. The caller is responsible for
   *  flushing pending saves, loading the new project, and hydrating. */
  onSelect: (name: string) => void;
  /** Optional dismiss. Omit to render as a modal that *must* be resolved
   *  (used on first boot when there's no project loaded yet). */
  onDismiss?: () => void;
}

function formatRelative(iso: string): string {
  if (!iso) return '';
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const diff = Date.now() - t;
  if (diff < 0) return 'just now';
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function ProjectPicker({ activeProject, onSelect, onDismiss }: ProjectPickerProps) {
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const refresh = useCallback(async () => {
    try {
      const list = await fetchProjects();
      setProjects(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!onDismiss) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDismiss]);

  const handleSelect = async (name: string) => {
    if (pending) return;
    setPending(true);
    try {
      await touchProject(name);
    } catch {
      // touch is best-effort; not blocking selection
    }
    onSelect(name);
  };

  const handleNew = async () => {
    if (pending) return;
    const raw = window.prompt('New project name:');
    if (!raw) return;
    const name = raw.trim();
    if (!name) return;
    setPending(true);
    setError(null);
    try {
      const meta = await createProject(name);
      await refresh();
      await handleSelect(meta.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      setPending(false);
    }
  };

  const handleRename = async (project: ProjectSummary) => {
    if (pending) return;
    const raw = window.prompt(`Rename "${project.displayName}" to:`, project.displayName);
    if (!raw) return;
    const to = raw.trim();
    if (!to || to === project.displayName) return;
    setPending(true);
    setError(null);
    try {
      await renameProjectApi(project.name, to);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rename failed');
    }
    setPending(false);
  };

  const handleDuplicate = async (project: ProjectSummary) => {
    if (pending) return;
    const raw = window.prompt(
      `Duplicate "${project.displayName}" as:`,
      `${project.displayName} Copy`,
    );
    if (!raw) return;
    const to = raw.trim();
    if (!to) return;
    setPending(true);
    setError(null);
    try {
      await duplicateProjectApi(project.name, to);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Duplicate failed');
    }
    setPending(false);
  };

  const handleDelete = async (project: ProjectSummary) => {
    if (pending) return;
    if (project.name === activeProject) {
      setError('Cannot delete the active project. Switch projects first.');
      return;
    }
    const ok = window.confirm(
      `Delete "${project.displayName}"? This removes the project folder from disk and cannot be undone.`,
    );
    if (!ok) return;
    setPending(true);
    setError(null);
    try {
      await deleteProjectApi(project.name);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
    setPending(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && onDismiss) onDismiss();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Projects"
        className="w-[min(420px,92vw)] max-h-[80vh] flex flex-col bg-surface rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-4 py-3 flex items-center justify-between border-b border-surface-2">
          <h2 className="text-sm font-semibold">Projects</h2>
          {onDismiss && (
            <button
              className="text-text-dim hover:text-text text-lg leading-none"
              onClick={onDismiss}
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>

        {error && (
          <div className="px-4 py-2 text-xs text-red-400 bg-red-500/10 border-b border-red-500/20">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {projects === null && (
            <div className="px-4 py-8 text-center text-xs text-text-dim">Loading...</div>
          )}
          {projects && projects.length === 0 && (
            <div className="px-4 py-8 text-center text-xs text-text-dim">
              No projects yet. Create one to get started.
            </div>
          )}
          {projects && projects.length > 0 && (
            <ul className="divide-y divide-surface-2">
              {projects.map((p) => {
                const isActive = p.name === activeProject;
                return (
                  <li key={p.name} className="px-4 py-3 flex items-center gap-3 hover:bg-surface-2">
                    <button
                      className="flex-1 text-left min-w-0"
                      onClick={() => handleSelect(p.name)}
                      disabled={pending}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{p.displayName}</span>
                        {isActive && (
                          <span className="text-[10px] text-text-dim bg-surface px-1.5 py-0.5 rounded-md">
                            active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-text-dim mt-0.5">
                        {formatRelative(p.lastOpenedAt || p.savedAt) || 'never opened'}
                        {p.displayName !== p.name && (
                          <span className="ml-1 opacity-60">· {p.name}</span>
                        )}
                      </div>
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        className="text-[11px] text-text-dim hover:text-text px-2 py-1 rounded-md hover:bg-surface"
                        onClick={() => handleRename(p)}
                        disabled={pending}
                        title="Rename"
                      >
                        Rename
                      </button>
                      <button
                        className="text-[11px] text-text-dim hover:text-text px-2 py-1 rounded-md hover:bg-surface"
                        onClick={() => handleDuplicate(p)}
                        disabled={pending}
                        title="Duplicate"
                      >
                        Duplicate
                      </button>
                      <button
                        className="text-[11px] text-text-dim hover:text-red-400 px-2 py-1 rounded-md hover:bg-surface disabled:opacity-50"
                        onClick={() => handleDelete(p)}
                        disabled={pending || isActive}
                        title={isActive ? 'Cannot delete the active project' : 'Delete'}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="px-4 py-3 border-t border-surface-2">
          <button
            className="w-full text-xs px-3 py-2 rounded-full bg-accent text-bg font-medium hover:opacity-90 disabled:opacity-50"
            onClick={handleNew}
            disabled={pending}
          >
            + New Project
          </button>
        </div>
      </div>
    </div>
  );
}
