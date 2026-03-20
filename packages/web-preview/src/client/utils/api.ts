import type { AppframeConfig } from '../types';

const API = '';

export interface PersistedSessionVariant {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'approved';
  snapshot: unknown;
  artifacts?: unknown[];
  previewArtifacts?: unknown[];
  copyAssignments?: unknown[];
  score?: unknown;
  history?: unknown[];
  provenance?: unknown;
}

export interface ApprovedArtifactExportResult {
  success: boolean;
  variantId: string | null;
  variantName: string;
  outputDir: string;
  configPath: string;
  manifestPath: string;
  artifact: {
    id: string;
    kind: 'screens' | 'frames';
    exportedAt: string;
    locale: string;
    mode: 'individual' | 'panoramic';
    sizeKey: string;
    renderer: string;
    fileNames: string[];
    manifestName: string;
    outputDir: string;
    filePaths: string[];
    configPath: string;
  };
}

export type AiRefinementActionId =
  | 'premium'
  | 'shorter-copy'
  | 'frameless'
  | 'lighter'
  | 'darker'
  | 'bigger-text'
  | 'reduce-overlap';

export interface AiRefinementPlanResult {
  label: string;
  rationale: string;
  actions: AiRefinementActionId[];
  nameSuggestion?: string;
  referenceVariantId?: string;
  referenceVariantName?: string;
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function fetchProject(): Promise<AppframeConfig> {
  return fetchJson<AppframeConfig>('/api/project');
}

export async function fetchSession(): Promise<unknown> {
  return fetchJson<unknown>('/api/session');
}

export async function fetchConfig(): Promise<AppframeConfig> {
  return fetchProject();
}

export async function reloadProject(): Promise<AppframeConfig> {
  await fetch(`${API}/api/project/reload`, { method: 'POST' });
  return fetchProject();
}

export async function reloadConfig(): Promise<AppframeConfig> {
  return reloadProject();
}

export async function saveSession(body: {
  activeVariantId: string;
  recommendedVariantId?: string | null;
  recommendationReason?: string | null;
  refinementHistory?: unknown[];
  variants: PersistedSessionVariant[];
}): Promise<void> {
  const res = await fetch(`${API}/api/session/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = `Failed to save session: ${res.statusText}`;
    try {
      const data = await res.json() as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // Keep the default status text.
    }
    throw new Error(message);
  }
}

export async function refineWithAi(body: {
  prompt: string;
  activeVariantId: string;
  variants: PersistedSessionVariant[];
}): Promise<AiRefinementPlanResult> {
  const res = await fetch(`${API}/api/refine-with-ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = `AI refinement failed: ${res.statusText}`;
    try {
      const data = await res.json() as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // Keep default status text.
    }
    throw new Error(message);
  }
  return res.json() as Promise<AiRefinementPlanResult>;
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

export async function fetchExport(body: Record<string, unknown>): Promise<Blob> {
  const res = await fetch(`${API}/api/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Export failed: ${res.statusText}`);
  return res.blob();
}

export async function fetchPanoramicExport(body: Record<string, unknown>): Promise<Blob> {
  const res = await fetch(`${API}/api/panoramic-export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Panoramic export failed: ${res.statusText}`);
  return res.blob();
}

export async function fetchExportConfig(body: Record<string, unknown>): Promise<Blob> {
  const res = await fetch(`${API}/api/export-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = `Config export failed: ${res.statusText}`;
    try {
      const data = await res.json() as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // Keep default status text.
    }
    throw new Error(message);
  }
  return res.blob();
}

export async function exportApprovedArtifact(
  body: Record<string, unknown>,
): Promise<ApprovedArtifactExportResult> {
  const res = await fetch(`${API}/api/export-approved-artifact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = `Approved artifact export failed: ${res.statusText}`;
    try {
      const data = await res.json() as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // Keep default status text.
    }
    throw new Error(message);
  }
  return res.json() as Promise<ApprovedArtifactExportResult>;
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
