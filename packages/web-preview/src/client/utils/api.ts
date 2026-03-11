import type { AppframeConfig } from '../types';

const API = '';

export async function fetchConfig(): Promise<AppframeConfig> {
  const res = await fetch(`${API}/api/config`);
  if (!res.ok) throw new Error(`Failed to fetch config: ${res.statusText}`);
  return res.json();
}

export async function reloadConfig(): Promise<AppframeConfig> {
  await fetch(`${API}/api/reload`, { method: 'POST' });
  return fetchConfig();
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
