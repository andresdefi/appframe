/**
 * Capture orchestrator for the inactive locale rows in the stacked-rows
 * canvas. One hidden iframe + a single-concurrency queue rasterizes each
 * row's preview to a PNG Blob (via modern-screenshot), keyed and cached so
 * the visible rows can show a stable image while the user edits the active
 * row in the foreground.
 *
 * Same iframe-prep flow as `clientExport.ts` (doc.write → await fonts +
 * image decode → domToCanvas), but Blob-backed ObjectURLs instead of data
 * URLs so we don't carry a ~1MB string per row in JS memory. Captures
 * dedupe by key, fresher requests cancel stale in-flight ones, and the
 * cache is LRU-capped to avoid growth at very high locale counts.
 */

// modern-screenshot is heavy (~200 KB) and only fires when the user adds a
// locale (the inactive-row capture flow runs here). Dynamic-import keeps it
// out of the initial bundle; the first capture pays a one-time chunk-load
// cost that's invisible next to the rasterization itself.
import type { domToCanvas } from 'modern-screenshot';
import { canvasToPngBlob } from './canvasBlob';
import { withTimeout } from './withTimeout';

const READINESS_TIMEOUT_MS = 15_000;
const RASTERIZE_TIMEOUT_MS = 20_000;

type DomToCanvas = typeof domToCanvas;
let domToCanvasPromise: Promise<DomToCanvas> | null = null;
function loadDomToCanvas(): Promise<DomToCanvas> {
  if (!domToCanvasPromise) {
    domToCanvasPromise = import('modern-screenshot').then((m) => m.domToCanvas);
  }
  return domToCanvasPromise;
}

export interface CaptureRequest {
  key: string;
  endpoint: '/api/preview-html' | '/api/panoramic-preview-html';
  body: Record<string, unknown>;
  width: number;
  height: number;
}

interface QueuedRequest extends CaptureRequest {
  resolve: (url: string) => void;
  reject: (err: Error) => void;
  cancelled: boolean;
}

interface CachedEntry {
  url: string;
  lastUsed: number;
}

const MAX_CACHED = 120;

let captureIframe: HTMLIFrameElement | null = null;
const queue: QueuedRequest[] = [];
const cache = new Map<string, CachedEntry>();
const pending = new Map<string, QueuedRequest>();
const subscribers = new Set<() => void>();
let processing = false;
let monotonic = 0;

function notify() {
  for (const cb of subscribers) cb();
}

export function subscribeCaptures(cb: () => void): () => void {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

export function getCapture(key: string): string | undefined {
  const entry = cache.get(key);
  if (entry) {
    entry.lastUsed = ++monotonic;
    return entry.url;
  }
  return undefined;
}

export function hasCapture(key: string): boolean {
  return cache.has(key);
}

export function isCapturing(key: string): boolean {
  return pending.has(key);
}

/**
 * Drop captures whose keys match the predicate. The active row uses this
 * to clear stale entries after a structural edit so the visible PNG isn't
 * shown stale.
 */
export function invalidateCaptures(predicate: (key: string) => boolean) {
  let touched = false;
  for (const [k, v] of cache) {
    if (predicate(k)) {
      URL.revokeObjectURL(v.url);
      cache.delete(k);
      touched = true;
    }
  }
  for (const req of pending.values()) {
    if (predicate(req.key)) req.cancelled = true;
  }
  if (touched) notify();
}

/**
 * Request a capture. If one is already pending for this key, the new
 * request supersedes the in-flight one (the older promise resolves to
 * the newer URL, eventually). The promise resolves with the cached
 * ObjectURL once the capture lands.
 */
export function requestCapture(req: CaptureRequest): Promise<string> {
  const cached = cache.get(req.key);
  if (cached) {
    cached.lastUsed = ++monotonic;
    return Promise.resolve(cached.url);
  }
  const existing = pending.get(req.key);
  if (existing) {
    existing.cancelled = true;
  }
  return new Promise<string>((resolve, reject) => {
    const queued: QueuedRequest = { ...req, resolve, reject, cancelled: false };
    pending.set(req.key, queued);
    queue.push(queued);
    notify();
    void processQueue();
  });
}

async function processQueue() {
  if (processing) return;
  processing = true;
  while (queue.length > 0) {
    const req = queue.shift()!;
    if (req.cancelled) {
      pending.delete(req.key);
      req.reject(new Error('capture cancelled'));
      continue;
    }
    try {
      const url = await runCapture(req);
      pending.delete(req.key);
      req.resolve(url);
    } catch (err) {
      pending.delete(req.key);
      req.reject(err instanceof Error ? err : new Error(String(err)));
    }
    notify();
  }
  processing = false;
}

function ensureIframe(width: number, height: number): HTMLIFrameElement {
  if (!captureIframe || !captureIframe.isConnected) {
    captureIframe = document.createElement('iframe');
    captureIframe.setAttribute('aria-hidden', 'true');
    captureIframe.setAttribute('title', 'appframe locale capture');
    captureIframe.style.cssText = 'position: fixed; top: 0; left: -99999px; border: none; pointer-events: none;';
    document.body.appendChild(captureIframe);
  }
  captureIframe.style.width = `${width}px`;
  captureIframe.style.height = `${height}px`;
  return captureIframe;
}

async function runCapture(req: QueuedRequest): Promise<string> {
  const res = await fetch(req.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...req.body, width: req.width, height: req.height }),
  });
  if (!res.ok) throw new Error(`${req.endpoint} ${res.status}`);
  const html = await res.text();
  if (req.cancelled) throw new Error('capture cancelled');

  const iframe = ensureIframe(req.width, req.height);
  const doc = iframe.contentDocument;
  if (!doc) throw new Error('iframe has no contentDocument');
  doc.open();
  doc.write(html);
  doc.close();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fontsReady = (doc as any).fonts?.ready
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (doc as any).fonts.ready.catch(() => undefined)
    : Promise.resolve();
  const images = Array.from(doc.images);
  const imagesDecoded = Promise.allSettled(images.map((img) => img.decode()));
  await withTimeout(
    Promise.all([fontsReady, imagesDecoded]),
    READINESS_TIMEOUT_MS,
    'capture: font/image readiness',
  );
  if (req.cancelled) throw new Error('capture cancelled');

  const domToCanvas = await loadDomToCanvas();
  const canvas = await withTimeout(
    domToCanvas(doc.documentElement, {
      scale: 1,
      width: req.width,
      height: req.height,
    }),
    RASTERIZE_TIMEOUT_MS,
    'capture: rasterize',
  );
  if (req.cancelled) throw new Error('capture cancelled');

  const blob = await canvasToPngBlob(canvas);
  const url = URL.createObjectURL(blob);

  const prev = cache.get(req.key);
  if (prev) URL.revokeObjectURL(prev.url);
  cache.set(req.key, { url, lastUsed: ++monotonic });
  evictIfNeeded();
  return url;
}

function evictIfNeeded() {
  if (cache.size <= MAX_CACHED) return;
  const sorted = Array.from(cache.entries()).sort((a, b) => a[1].lastUsed - b[1].lastUsed);
  while (cache.size > MAX_CACHED && sorted.length > 0) {
    const [k, v] = sorted.shift()!;
    URL.revokeObjectURL(v.url);
    cache.delete(k);
  }
}
