import { Agent, setGlobalDispatcher } from 'undici';
import type { AppframeConfig } from '@appframe/core';

const DEFAULT_BASE_URL = 'http://localhost:4400';

// Keep-alive HTTP connection pool. Node's default Agent closes the
// socket after every request, which on localhost adds ~1-3 ms per call
// (handshake + slow-start). Reusing sockets matters for render
// batches and integration test suites that fire dozens of requests.
// `setGlobalDispatcher` is idempotent — calling it once at import time
// is enough.
let keepAliveInstalled = false;
function installKeepAlive(): void {
  if (keepAliveInstalled) return;
  keepAliveInstalled = true;
  setGlobalDispatcher(
    new Agent({
      keepAliveTimeout: 30_000,
      keepAliveMaxTimeout: 60_000,
      connections: 16,
    }),
  );
}

// Shapes returned by /api/projects family — mirrors the browser client
// types in src/client/utils/api.ts. Kept here so the MCP doesn't
// depend on a deep internal module.
export interface ProjectSummary {
  name: string;
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

export interface AppframeClientOptions {
  baseUrl?: string;
}

export class AppframeClient {
  readonly baseUrl: string;
  // Per-instance memo for catalogs that don't change at runtime.
  // Cleared by `clearCatalogCache` when (rarely) the user installs a
  // new Koubou device pack mid-session and wants to see it.
  private readonly catalogCache = new Map<string, unknown>();

  constructor(options: AppframeClientOptions = {}) {
    const raw = options.baseUrl ?? process.env.APPFRAME_PREVIEW_URL ?? DEFAULT_BASE_URL;
    // Cap before regex strip — a pathological caller supplying a
    // baseUrl with thousands of trailing slashes could trigger
    // polynomial regex backtracking. Real URLs are well under 2048
    // chars per RFC 3986 recommendation.
    if (raw.length > 2048) {
      throw new Error('baseUrl exceeds 2048 characters');
    }
    this.baseUrl = raw.replace(/\/+$/, '');
    installKeepAlive();
  }

  // Memoize-and-fetch for static-for-the-session catalogs. Returns a
  // shared reference, so consumers must not mutate the result.
  private async cachedList<T>(key: string, fetch: () => Promise<T>): Promise<T> {
    if (this.catalogCache.has(key)) return this.catalogCache.get(key) as T;
    const value = await fetch();
    this.catalogCache.set(key, value);
    return value;
  }

  clearCatalogCache(): void {
    this.catalogCache.clear();
  }

  async health(): Promise<{ status: string }> {
    return this.request<{ status: string }>('GET', '/api/health');
  }

  // Soft compat probe. Returns the preview server's package version.
  // Used by the MCP bin to warn on major-version mismatch — the
  // protocols can drift if a user upgrades one package and not the
  // other.
  async serverVersion(): Promise<{ name: string; version: string }> {
    return this.request<{ name: string; version: string }>('GET', '/api/version');
  }

  // GET /api/project returns the live editor state (the in-memory hydrated
  // config — same shape the browser UI reads). This is the agent's primary
  // "see everything" surface: every screen, position, font, color, callout,
  // spotlight/loupe, etc.
  async getProject(): Promise<AppframeConfig> {
    return this.request<AppframeConfig>('GET', '/api/project');
  }

  // PUT /api/config without the __editorState flag — the server runs
  // validateConfig() on the body. Always send the full AppframeConfig
  // (read-modify-write pattern). NOTE: avoid for editor changes — the
  // AppframeConfig is a slim projection and round-tripping back to
  // editor state loses callouts, gradients, spotlight flags, etc. Use
  // `patchScreen` (project envelope) for edits.
  async updateProject(config: AppframeConfig): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('PUT', '/api/config', config);
  }

  // Catalog of device frames the renderer knows about. Returned shape
  // comes straight from GET /api/frames (built-in manifest + any
  // koubou-installed frames). Use the `id` field for `frameId` in
  // patch_screen / move_device_frame.
  async listFrames(): Promise<unknown[]> {
    return this.cachedList('frames', () => this.request<unknown[]>('GET', '/api/frames'));
  }

  // Catalog of bundled fonts the renderer can use. Returned shape comes
  // straight from GET /api/fonts. Use the entry's id for set_font /
  // patch_screen `headlineFont` etc.
  async listFonts(): Promise<unknown[]> {
    return this.cachedList('fonts', () => this.request<unknown[]>('GET', '/api/fonts'));
  }

  // Categorised background palette (same data the UI Background tab
  // renders): 50+ solid colors across Mono/Vibrant/Pastel/Earth/Brand,
  // 66+ gradients across Sunset/Ocean/Cosmic/Aurora/Vivid/Pastel/Glow/
  // Mesh. Each gradient carries colors, direction, optional type+
  // radialPosition. Bigger than @appframe/core's flat SOLID_PRESETS /
  // GRADIENT_PRESETS — the UI's data wins.
  async listBackgroundPresets(): Promise<{
    solids: { name: string; colors: string[] }[];
    gradients: { name: string; presets: unknown[] }[];
  }> {
    return this.cachedList('background-presets', () =>
      this.request('GET', '/api/background-presets'),
    );
  }

  // Externally installed device families (iPhone-17 line, iPad-M4 line,
  // etc). Disjoint from listFrames(): builtin frames cover generic and a
  // few iPad sizes; koubou covers the modern Apple device families. Use
  // the entry's `id` as `frameId` (e.g. "iphone-17-pro-max").
  async listKoubouDevices(): Promise<{ families: unknown[] }> {
    return this.cachedList('koubou-devices', () =>
      this.request<{ families: unknown[]; grouped?: Record<string, unknown[]> }>(
        'GET',
        '/api/koubou-devices',
      ),
    );
  }

  // Lifecycle: list, create, rename, duplicate, delete projects. Wraps
  // the existing /api/projects family. `switch` is a new endpoint that
  // also broadcasts a project-switched SSE event so the browser
  // navigates to the new slug.

  async listProjects(): Promise<{ projects: ProjectSummary[] }> {
    return this.request<{ projects: ProjectSummary[] }>('GET', '/api/projects');
  }

  async createProject(name: string): Promise<{ success: boolean; meta: ProjectMeta }> {
    return this.request('POST', '/api/projects', { name });
  }

  async renameProject(from: string, to: string): Promise<{ success: boolean; meta: ProjectMeta }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(from)}/rename`,
      { to },
    );
  }

  async duplicateProject(from: string, to: string): Promise<{ success: boolean; meta: ProjectMeta }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(from)}/duplicate`,
      { to },
    );
  }

  async deleteProject(slug: string): Promise<{ success: boolean }> {
    return this.request('DELETE', `/api/projects/${encodeURIComponent(slug)}`);
  }

  async switchProject(slug: string): Promise<{ success: boolean; slug: string }> {
    return this.request('POST', `/api/projects/${encodeURIComponent(slug)}/switch`);
  }

  // Server-side undo history. Each successful envelope write through
  // /patch-screen, /patch-batch, /locales/*, /variants/*, etc. pushes
  // a snapshot of the previous data onto an in-memory per-slug ring
  // buffer. listRecentWrites surfaces the metadata; undoLastWrite pops
  // the top entry and restores its `beforeData` to disk.
  async listRecentWrites(slug: string, limit?: number): Promise<{
    slug: string;
    entries: Array<{ opName: string; savedAt: string; index: number }>;
    total: number;
  }> {
    const query = typeof limit === 'number' ? `?limit=${encodeURIComponent(String(limit))}` : '';
    return this.request(
      'GET',
      `/api/projects/${encodeURIComponent(slug)}/recent-writes${query}`,
    );
  }

  async undoLastWrite(slug: string): Promise<{
    success: boolean;
    undone: { opName: string; savedAt: string };
    remaining: number;
    newSavedAt: string;
  }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/undo-last-write`,
      {},
    );
  }

  // Asset inventory + cleanup. Read-only listAssets is paired with two
  // server-side mutators: deleteScreenshot (single file, refuses on
  // referenced) and cleanupUnusedScreenshots (sweep every unreferenced
  // file in the project's screenshots/ dir).

  async listAssets(slug: string): Promise<{
    project: string;
    assets: Array<{ filename: string; bytes: number; referenced: boolean }>;
    unreferenced: string[];
    referencedButMissing: string[];
  }> {
    return this.request(
      'GET',
      `/api/projects/${encodeURIComponent(slug)}/assets`,
    );
  }

  async deleteScreenshot(slug: string, filename: string): Promise<{
    success: boolean;
    deleted: string;
    previewDeleted: boolean;
  }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/screenshots/delete`,
      { filename },
    );
  }

  async cleanupUnusedScreenshots(slug: string): Promise<{
    success: boolean;
    deleted: string[];
    failed: Array<{ filename: string; error: string }>;
  }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/screenshots/cleanup`,
      {},
    );
  }

  // Upload a screenshot image as a data URL. Body shape matches the
  // existing UI upload path so the file lands at the same location and
  // the URL is reachable for the renderer.
  async uploadScreenshot(args: {
    slug: string;
    filename: string;
    dataUrl: string;
  }): Promise<{
    project: string;
    filename: string;
    relPath: string;
    absPath: string;
    url: string;
    bytes: number;
  }> {
    return this.request(
      'POST',
      '/api/screenshots/upload',
      { project: args.slug, filename: args.filename, dataUrl: args.dataUrl },
    );
  }

  // The slug of the project the browser currently has open. The server
  // tracks this via POST /api/active-project, which the client fires
  // on every project switch. Returns null when no project is active
  // (server just booted, no browser connected yet).
  async getActiveProject(): Promise<{ slug: string | null }> {
    return this.request<{ slug: string | null }>('GET', '/api/active-project');
  }

  // Server-coordinated render of a single screen as a PNG. The server
  // broadcasts a render-request SSE event; the browser runs
  // modern-screenshot via exportScreenClientSide; the result POSTs back;
  // the server hands the base64 data URL to the MCP. Ephemeral round-
  // trip — no disk writes.
  async renderPreview(args: {
    slug: string;
    index: number;
    locale?: string;
    width?: number;
  }): Promise<{ dataUrl: string }> {
    return this.request('POST', '/api/render-preview', args);
  }

  async renderBatch(args: {
    slug: string;
    outDir: string;
    items: Array<{
      locale: string;
      index: number;
      width: number;
      height: number;
      relPath: string;
    }>;
  }): Promise<{
    files: Array<{ relPath: string; absPath: string; bytes: number }>;
    errors: Array<{ relPath: string; error: string }>;
  }> {
    return this.requestWithTimeout(
      'POST',
      '/api/render-batch',
      args,
      15_000 + Math.ceil(args.items.length / 3) * 10_000,
    );
  }

  async getSizes(): Promise<Record<string, Array<{ key: string; name: string; width: number; height: number }>>> {
    return this.request('GET', '/api/sizes');
  }

  // Top-level project field patcher (export size, etc). Whitelisted on
  // the server — see TOP_LEVEL_PATCH_WHITELIST in routes/projectPatch.ts.
  async patchProject(slug: string, patch: Record<string, unknown>): Promise<{
    success: boolean;
    savedAt: string;
    applied: Record<string, unknown>;
  }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/patch-project`,
      { patch },
    );
  }

  // Variant lifecycle. Variants are A/B alternatives inside a project —
  // each one carries its own snapshot of screens / locales / panoramic
  // state. The UI shows one at a time; switching active replaces the
  // top-level state with the chosen variant's snapshot.

  async createVariant(
    slug: string,
    options: { name?: string; mode?: 'blank' | 'duplicate-active' } = {},
  ): Promise<{ success: boolean; savedAt: string; variant: Record<string, unknown> }> {
    const body: Record<string, unknown> = {};
    if (options.name !== undefined) body.name = options.name;
    if (options.mode !== undefined) body.mode = options.mode;
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/variants/create`,
      body,
    );
  }

  async deleteVariant(slug: string, variantId: string): Promise<{
    success: boolean;
    savedAt: string;
    deleted: string;
  }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/variants/${encodeURIComponent(variantId)}/delete`,
      {},
    );
  }

  async setActiveVariant(slug: string, variantId: string): Promise<{
    success: boolean;
    savedAt?: string;
    active?: string;
    alreadyActive?: boolean;
  }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/variants/${encodeURIComponent(variantId)}/set-active`,
      {},
    );
  }

  async renameVariant(
    slug: string,
    variantId: string,
    patch: { name?: string; description?: string; status?: 'draft' | 'approved' },
  ): Promise<{ success: boolean; savedAt: string; variant: Record<string, unknown> }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/variants/${encodeURIComponent(variantId)}/rename`,
      patch,
    );
  }

  // Locale lifecycle. Mirrors the UI's snapshot-at-add-time model: add
  // deep-clones the current Default screens, set-active flips the
  // currently rendered locale, remove drops both metadata and screens.
  // The default locale isn't stored in sessionLocales — it's the
  // implicit top-level data.screens.

  async addLocale(slug: string, code: string, label?: string): Promise<{
    success: boolean;
    savedAt: string;
    code: string;
    label: string;
  }> {
    const body: Record<string, unknown> = { code };
    if (label !== undefined) body.label = label;
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/locales`,
      body,
    );
  }

  async removeLocale(slug: string, code: string): Promise<{
    success: boolean;
    savedAt: string;
    removed: string;
  }> {
    return this.request(
      'DELETE',
      `/api/projects/${encodeURIComponent(slug)}/locales/${encodeURIComponent(code)}`,
    );
  }

  async setActiveLocale(slug: string, code: string): Promise<{
    success: boolean;
    savedAt: string;
    locale: string;
  }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/locales/set-active`,
      { code },
    );
  }

  async patchLocaleScreen(
    slug: string,
    code: string,
    index: number,
    patch: Record<string, unknown>,
  ): Promise<{
    success: boolean;
    savedAt: string;
    screen?: Record<string, unknown>;
  }> {
    return this.request(
      'PATCH',
      `/api/projects/${encodeURIComponent(slug)}/locales/${encodeURIComponent(code)}/screens/${encodeURIComponent(String(index))}`,
      patch,
    );
  }

  // Locale-scoped batch of patch ops. Mirrors patchScreensBatch but
  // targets localeScreens[code] instead of the default data.screens.
  async patchLocaleScreensBatch(
    slug: string,
    code: string,
    ops: Array<{ index: number; patch: Record<string, unknown> }>,
  ): Promise<{
    success: boolean;
    savedAt: string;
    applied: number;
    screens?: Record<string, unknown>[];
  }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/locales/${encodeURIComponent(code)}/patch-batch`,
      { ops },
    );
  }

  // Replace localeScreens[*][sourceIndex] with structuredClone of
  // data.screens[sourceIndex] across every configured locale in one
  // atomic write. Returns the list of locale codes that actually got
  // updated — locales whose snapshot is too short get skipped.
  async broadcastScreenToLocales(slug: string, sourceIndex: number): Promise<{
    success: boolean;
    savedAt: string | null;
    affected: string[];
    note?: string;
  }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/locales/broadcast-screen`,
      { sourceIndex },
    );
  }

  // Read a single screen from the envelope on disk. Returns just the
  // schemaVersion + savedAt + index + screen object — typically ~2 KB
  // vs the full envelope's ~40 KB. Used by the inspect tools
  // (get_screen, inspect_fonts, diff_screens, layout-prediction) to
  // avoid envelope-read amplification when 5-10 inspects happen per
  // agent turn.
  async readScreen(slug: string, index: number): Promise<{
    schemaVersion: number;
    savedAt: string;
    index: number;
    screen: Record<string, unknown>;
  }> {
    return this.request(
      'GET',
      `/api/projects/${encodeURIComponent(slug)}/screens/${encodeURIComponent(String(index))}`,
    );
  }

  // Read the project envelope from disk. Returns the schemaVersion +
  // savedAt + data, where data is the rich editor-state shape (same as
  // what the autosave writes). Use this when an ergonomic helper needs
  // to merge with the existing screen shape (e.g. tweak spotlight.x
  // without resending the rest of spotlight).
  async getProjectEnvelope(slug: string): Promise<{
    schemaVersion: number;
    savedAt: string;
    data: unknown;
  }> {
    return this.request<{ schemaVersion: number; savedAt: string; data: unknown }>(
      'GET',
      `/api/projects/${encodeURIComponent(slug)}`,
    );
  }

  // Insert a new screen into the project. atIndex undefined = append.
  // The server generates a fresh id and fills missing fields on hydrate
  // from STATIC_SCREEN_DEFAULTS. Returns the new screen + its index.
  async insertScreen(
    slug: string,
    atIndex?: number,
    screen?: Record<string, unknown>,
  ): Promise<{
    success: boolean;
    savedAt: string;
    atIndex: number;
    screen: Record<string, unknown>;
  }> {
    const body: Record<string, unknown> = {};
    if (typeof atIndex === 'number') body.atIndex = atIndex;
    if (screen !== undefined) body.screen = screen;
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/screens/insert`,
      body,
    );
  }

  // Remove the screen at `index`. Rejects if it would leave the project
  // with zero screens.
  async removeScreen(slug: string, index: number): Promise<{
    success: boolean;
    savedAt: string;
    removed: unknown;
    remaining: number;
  }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/screens/remove`,
      { index },
    );
  }

  // Reorder screens by passing a permutation: result[i] = screens[order[i]].
  // The server validates that `order` is a complete permutation.
  async reorderScreens(slug: string, order: number[]): Promise<{
    success: boolean;
    savedAt: string;
    order: number[];
  }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/screens/reorder`,
      { order },
    );
  }

  // Shallow-merge `patch` into screens[index] of the project envelope on
  // disk. `patch` is a Partial<ScreenState> in editor-state shape — same
  // fields the UI persists (spotlight, loupe, callouts, gradients,
  // background type, fonts, etc.). The server writes atomically and
  // broadcasts a project-changed SSE event so the browser refetches and
  // re-hydrates via the same restore code path the project picker uses.
  async patchScreen(slug: string, index: number, patch: Record<string, unknown>): Promise<{
    success: boolean;
    savedAt: string;
    screen?: Record<string, unknown>;
  }> {
    return this.request<{ success: boolean; savedAt: string; screen?: Record<string, unknown> }>(
      'PATCH',
      `/api/projects/${encodeURIComponent(slug)}/screens/${encodeURIComponent(String(index))}`,
      patch,
    );
  }

  // Batch version of patchScreen — N patches in one round-trip + one
  // atomic write. Ops applied in array order; malformed ops fail the
  // whole batch.
  async patchScreensBatch(
    slug: string,
    ops: Array<{ index: number; patch: Record<string, unknown> }>,
  ): Promise<{
    success: boolean;
    savedAt: string;
    applied: number;
    screens?: Record<string, unknown>[];
  }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/patch-batch`,
      { ops },
    );
  }

  async batchMixed(
    slug: string,
    ops: Array<Record<string, unknown>>,
  ): Promise<{
    success: boolean;
    savedAt: string;
    applied: number;
    results: Array<Record<string, unknown>>;
  }> {
    return this.request(
      'POST',
      `/api/projects/${encodeURIComponent(slug)}/batch`,
      { ops },
    );
  }

  private async requestWithTimeout<T>(
    method: string,
    path: string,
    body: unknown,
    timeoutMs: number,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new AppframeClientError(
          `${method} ${path} failed: ${res.status} ${res.statusText}${text ? ` — ${text}` : ''}`,
        );
      }
      return (await res.json()) as T;
    } catch (err) {
      if (err instanceof AppframeClientError) throw err;
      const message = err instanceof Error ? err.message : String(err);
      throw new AppframeClientError(`${method} ${path}: ${message}`);
    } finally {
      clearTimeout(timer);
    }
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const init: RequestInit = {
      method,
      headers: { 'content-type': 'application/json' },
    };
    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    // Retry-once on transient failures only:
    //  - network errors (fetch throws — connection refused, dropped, etc.)
    //  - 5xx responses (server-side bug or restart-in-progress)
    // We do NOT retry 4xx — those are caller errors and would just
    // burn time. The short backoff lets a server restart settle without
    // pinning a request hopelessly.
    const RETRY_BACKOFF_MS = 150;
    let attempt = 0;
    let lastError: unknown;
    while (attempt < 2) {
      attempt += 1;
      try {
        const res = await fetch(url, init);
        if (res.ok) return (await res.json()) as T;
        if (res.status >= 500 && attempt < 2) {
          // Drain the body so the socket can reuse and try again.
          await res.text().catch(() => '');
          await sleep(RETRY_BACKOFF_MS);
          continue;
        }
        const text = await res.text().catch(() => '');
        throw new AppframeClientError(
          `${method} ${path} failed: ${res.status} ${res.statusText}${text ? ` — ${text}` : ''}`,
        );
      } catch (err) {
        if (err instanceof AppframeClientError) throw err;
        lastError = err;
        if (attempt < 2) {
          await sleep(RETRY_BACKOFF_MS);
          continue;
        }
        const message = err instanceof Error ? err.message : String(err);
        throw new AppframeClientError(
          `Could not reach appframe preview server at ${this.baseUrl} (${message}). ` +
            'Start it with `pnpm preview` from the appframe repo.',
        );
      }
    }
    // Unreachable — the loop either returns, throws, or continues.
    throw new AppframeClientError(`request failed: ${String(lastError)}`);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class AppframeClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppframeClientError';
  }
}
