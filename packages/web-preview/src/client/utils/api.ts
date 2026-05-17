import type { AppframeConfig } from '../types';

const API = '';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function fetchProject(): Promise<AppframeConfig> {
  return fetchJson<AppframeConfig>('/api/project');
}

export async function fetchConfig(): Promise<AppframeConfig> {
  return fetchProject();
}

export async function reloadProject(): Promise<AppframeConfig> {
  await fetch(`${API}/api/project/reload`, { method: 'POST' });
  return fetchProject();
}

export async function putLiveConfig(body: Record<string, unknown>, signal?: AbortSignal): Promise<void> {
  const res = await fetch(`${API}/api/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, __editorState: true }),
    signal,
  });
  if (!res.ok) throw new Error(`Live config update failed: ${res.statusText}`);
}

export async function reloadConfig(): Promise<AppframeConfig> {
  return reloadProject();
}

export async function fetchPreviewHtml(body: Record<string, unknown>, signal?: AbortSignal): Promise<string> {
  const res = await fetch(`${API}/api/preview-html`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new Error(`Preview render failed: ${res.statusText}`);
  return res.text();
}

export async function fetchFrames(): Promise<unknown[]> {
  const res = await fetch(`${API}/api/frames`);
  if (!res.ok) throw new Error(`Failed to fetch frames: ${res.statusText}`);
  return res.json() as Promise<unknown[]>;
}

export async function fetchFonts(): Promise<unknown[]> {
  const res = await fetch(`${API}/api/fonts`);
  if (!res.ok) throw new Error(`Failed to fetch fonts: ${res.statusText}`);
  return res.json() as Promise<unknown[]>;
}

export async function fetchKoubouDevices(): Promise<{ families: unknown[]; grouped: Record<string, unknown[]> }> {
  const res = await fetch(`${API}/api/koubou-devices`);
  if (!res.ok) throw new Error(`Failed to fetch koubou devices: ${res.statusText}`);
  return res.json() as Promise<{ families: unknown[]; grouped: Record<string, unknown[]> }>;
}

export async function fetchSizes(): Promise<Record<string, unknown[]>> {
  const res = await fetch(`${API}/api/sizes`);
  if (!res.ok) throw new Error(`Failed to fetch sizes: ${res.statusText}`);
  return res.json() as Promise<Record<string, unknown[]>>;
}

export async function fetchPanoramicPreviewHtml(body: Record<string, unknown>, signal?: AbortSignal): Promise<string> {
  const res = await fetch(`${API}/api/panoramic-preview-html`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new Error(`Panoramic preview failed: ${res.statusText}`);
  return res.text();
}

export interface ProjectEnvelope<T = unknown> {
  schemaVersion: number;
  savedAt: string;
  data: T;
}

export type LoadProjectResult<T = unknown> =
  | { kind: 'loaded'; envelope: ProjectEnvelope<T> }
  | { kind: 'missing' }
  | { kind: 'corrupt'; message: string }
  | { kind: 'futureSchema'; message: string; schemaVersion: number };

export async function loadProject<T = unknown>(project: string): Promise<LoadProjectResult<T>> {
  if (!project) throw new Error('loadProject: project name is required');
  const res = await fetch(`${API}/api/projects/${encodeURIComponent(project)}`);
  if (res.status === 404) return { kind: 'missing' };
  if (res.status === 422) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { kind: 'corrupt', message: data.error ?? 'project file is corrupted' };
  }
  if (res.status === 409) {
    const data = (await res.json().catch(() => ({}))) as { error?: string; schemaVersion?: number };
    return {
      kind: 'futureSchema',
      message: data.error ?? 'project file is from a newer version',
      schemaVersion: data.schemaVersion ?? 0,
    };
  }
  if (!res.ok) throw new Error(`Load project failed: ${res.statusText}`);
  const envelope = (await res.json()) as ProjectEnvelope<T>;
  return { kind: 'loaded', envelope };
}

export async function saveProject(
  data: unknown,
  project: string,
  signal?: AbortSignal,
): Promise<{ savedAt: string }> {
  if (!project) throw new Error('saveProject: project name is required');
  const res = await fetch(`${API}/api/projects/${encodeURIComponent(project)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal,
  });
  if (!res.ok) {
    let message = `Save project failed: ${res.statusText}`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // keep default
    }
    throw new Error(message);
  }
  return res.json() as Promise<{ savedAt: string }>;
}

export interface ProjectSummary {
  /** Filesystem slug (directory name). */
  name: string;
  /** Human-readable name; falls back to slug when meta.json is missing. */
  displayName: string;
  createdAt: string;
  lastOpenedAt: string;
  savedAt: string;
  hasProjectFile: boolean;
}

export interface ProjectMeta {
  schemaVersion: number;
  name: string;
  displayName: string;
  createdAt: string;
  lastOpenedAt: string;
}

export async function fetchProjects(): Promise<ProjectSummary[]> {
  const res = await fetch(`${API}/api/projects`);
  if (!res.ok) throw new Error(`List projects failed: ${res.statusText}`);
  const body = (await res.json()) as { projects: ProjectSummary[] };
  return body.projects;
}

async function postProjectAction<T = { meta: ProjectMeta }>(
  path: string,
  body: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = `Project action failed: ${res.statusText}`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // keep default
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function createProject(name: string): Promise<ProjectMeta> {
  const res = await postProjectAction('/api/projects', { name });
  return res.meta;
}

export async function renameProjectApi(from: string, to: string): Promise<ProjectMeta> {
  const res = await postProjectAction(`/api/projects/${encodeURIComponent(from)}/rename`, { to });
  return res.meta;
}

export async function duplicateProjectApi(from: string, to: string): Promise<ProjectMeta> {
  const res = await postProjectAction(`/api/projects/${encodeURIComponent(from)}/duplicate`, { to });
  return res.meta;
}

export async function touchProject(project: string): Promise<ProjectMeta> {
  const res = await postProjectAction(`/api/projects/${encodeURIComponent(project)}/touch`);
  return res.meta;
}

export async function deleteProjectApi(project: string): Promise<void> {
  const res = await fetch(`${API}/api/projects/${encodeURIComponent(project)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    let message = `Delete project failed: ${res.statusText}`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // keep default
    }
    throw new Error(message);
  }
}

export interface UploadedScreenshot {
  project: string;
  filename: string;
  relPath: string;
  absPath: string;
  url: string;
  bytes: number;
}

export async function uploadScreenshot(input: {
  filename: string;
  dataUrl: string;
  project?: string;
}): Promise<UploadedScreenshot> {
  const res = await fetch(`${API}/api/screenshots/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    let message = `Screenshot upload failed: ${res.statusText}`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // keep default
    }
    throw new Error(message);
  }
  return res.json() as Promise<UploadedScreenshot>;
}

export async function fetchAutoTranslateLocale(
  locale: string,
  body: Record<string, unknown> = {},
): Promise<{ locale: string; localeConfig: unknown }> {
  const res = await fetch(`${API}/api/translate-locale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locale, ...body }),
  });
  if (!res.ok) {
    let message = `Automatic translation failed: ${res.statusText}`;
    try {
      const data = await res.json() as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // Keep the default status text.
    }
    throw new Error(message);
  }
  return res.json() as Promise<{ locale: string; localeConfig: unknown }>;
}
