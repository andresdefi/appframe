/**
 * Variant thumbnail capture. One hidden iframe + a single-flight queue
 * rasterizes a variant's saved snapshot to a small PNG data URL so the
 * VariantsTab cards show recognisable previews instead of "No preview
 * rendered yet" placeholders.
 *
 * Mirrors the captureManager flow (POST → hidden iframe → modern-screenshot
 * → domToPng) but persists data URLs into the variant record. Unlike the
 * inactive-locale capture path, these strings round-trip through
 * appframe.json, so size matters — domToPng's `scale` knob keeps each
 * thumbnail at ~10-30 KB.
 *
 * Individual-mode variants composite every screen side-by-side so the
 * card reflects the whole set rather than just frame 1. Panoramic
 * variants already render as a single wide canvas, so they go through
 * one rasterization.
 */

import type { VariantRecord } from '../store';
import type { ScreenState, AppframeConfig } from './../types';
import {
  buildPreviewBody,
  rewritePanoramicBackgroundForPreview,
  rewritePanoramicElementsForPreview,
} from './previewBody';

// Lazy-loaded — same chunk as captureManager / clientExport.
import type { domToPng } from 'modern-screenshot';
type DomToPng = typeof domToPng;
let domToPngPromise: Promise<DomToPng> | null = null;
function loadDomToPng(): Promise<DomToPng> {
  if (!domToPngPromise) {
    domToPngPromise = import('modern-screenshot').then((m) => m.domToPng);
  }
  return domToPngPromise;
}

// Single hidden iframe reused across captures.
let captureIframe: HTMLIFrameElement | null = null;
function ensureIframe(width: number, height: number): HTMLIFrameElement {
  if (!captureIframe || !captureIframe.isConnected) {
    captureIframe = document.createElement('iframe');
    captureIframe.setAttribute('aria-hidden', 'true');
    captureIframe.setAttribute('title', 'appframe variant thumbnail capture');
    captureIframe.style.cssText =
      'position: fixed; top: 0; left: -99999px; border: none; pointer-events: none;';
    document.body.appendChild(captureIframe);
  }
  captureIframe.style.width = `${width}px`;
  captureIframe.style.height = `${height}px`;
  return captureIframe;
}

// Single-flight tracking. Multiple components calling captureVariantThumbnail
// for the same variant id at the same time share one in-flight Promise.
const inFlight = new Map<string, Promise<string>>();

// Global queue. Captures run one at a time — both to prevent a render
// storm when the Variants tab opens with N variants all missing
// thumbnails, AND because the underlying hidden iframe is shared
// across captures (`ensureIframe`). Concurrent doc.open/write/close
// calls on the same iframe would race and produce stale or corrupted
// PNGs. The work is background-fill anyway, so sequential is fine.
const queue: Array<() => Promise<void>> = [];
let processing = false;

// scale=0.4 of the native preview keeps each per-screen PNG small enough
// to stitch and embed in the project JSON without bloating it. Fonts /
// images still render at full res inside the iframe so the downscale
// doesn't visibly degrade.
const THUMBNAIL_SCALE = 0.4;
const STITCH_GAP_PX = 4;

export interface CaptureContext {
  config: AppframeConfig;
  sessionLocales: Record<string, unknown>;
}

export function captureVariantThumbnail(
  variant: VariantRecord,
  ctx: CaptureContext,
): Promise<string> {
  const existing = inFlight.get(variant.id);
  if (existing) return existing;

  let resolveOuter!: (value: string) => void;
  let rejectOuter!: (err: Error) => void;
  const promise = new Promise<string>((resolve, reject) => {
    resolveOuter = resolve;
    rejectOuter = reject;
  });
  inFlight.set(variant.id, promise);

  queue.push(async () => {
    try {
      const dataUrl = await runCapture(variant, ctx);
      resolveOuter(dataUrl);
    } catch (err) {
      rejectOuter(err instanceof Error ? err : new Error(String(err)));
    } finally {
      inFlight.delete(variant.id);
    }
  });
  void processQueue();
  return promise;
}

async function processQueue(): Promise<void> {
  if (processing) return;
  processing = true;
  while (queue.length > 0) {
    const job = queue.shift()!;
    // The job catches its own errors and rejects the outer Promise —
    // we just keep the queue moving.
    await job();
  }
  processing = false;
}

async function runCapture(variant: VariantRecord, ctx: CaptureContext): Promise<string> {
  const snapshot = variant.snapshot;
  const previewW = snapshot.previewW;
  const previewH = snapshot.previewH;

  if (snapshot.isPanoramic) {
    const canvasW = previewW * Math.max(1, snapshot.panoramicFrameCount);
    const canvasH = previewH;
    const body = {
      locale: 'default',
      localeConfig: undefined,
      frameCount: snapshot.panoramicFrameCount,
      frameWidth: previewW,
      frameHeight: previewH,
      background: rewritePanoramicBackgroundForPreview(snapshot.panoramicBackground),
      elements: rewritePanoramicElementsForPreview(snapshot.panoramicElements),
      font: ctx.config.theme.font,
      fontWeight: ctx.config.theme.fontWeight,
      frameStyle: ctx.config.frames.style,
      effects: snapshot.panoramicEffects,
      previewMode: true,
    };
    return rasterize('/api/panoramic-preview-html', body, canvasW, canvasH);
  }

  // Individual mode: capture every screen sequentially and stitch
  // them side-by-side so the card reflects the entire set. Falls
  // back to a single placeholder if the variant has no screens.
  const screens = snapshot.screens;
  if (screens.length === 0) {
    throw new Error('variant has no screens to capture');
  }
  const platform = ctx.config.app.platforms?.[0] ?? 'iphone';
  const perScreen: string[] = [];
  for (const screen of screens) {
    const body = buildPreviewBody(
      screen as ScreenState,
      platform,
      previewW,
      previewH,
      'default',
      undefined,
      [],
      true,
    );
    const dataUrl = await rasterize('/api/preview-html', body, previewW, previewH);
    perScreen.push(dataUrl);
  }
  if (perScreen.length === 1) return perScreen[0]!;
  return stitchHorizontally(perScreen, STITCH_GAP_PX);
}

async function rasterize(
  endpoint: '/api/preview-html' | '/api/panoramic-preview-html',
  body: Record<string, unknown>,
  canvasW: number,
  canvasH: number,
): Promise<string> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, width: canvasW, height: canvasH }),
  });
  if (!res.ok) throw new Error(`${endpoint} ${res.status}`);
  const html = await res.text();

  const iframe = ensureIframe(canvasW, canvasH);
  const doc = iframe.contentDocument;
  if (!doc) throw new Error('thumbnail iframe has no contentDocument');
  doc.open();
  doc.write(html);
  doc.close();

  // Same readiness wait as captureManager — fonts must load and images
  // must decode before domToPng walks the tree, otherwise the snapshot
  // catches a half-rendered page.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fontsReady = (doc as any).fonts?.ready
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (doc as any).fonts.ready.catch(() => undefined)
    : Promise.resolve();
  const images = Array.from(doc.images);
  const imagesDecoded = Promise.allSettled(images.map((img) => img.decode()));
  await Promise.all([fontsReady, imagesDecoded]);

  const domToPngFn = await loadDomToPng();
  return domToPngFn(doc.documentElement, {
    scale: THUMBNAIL_SCALE,
    width: canvasW,
    height: canvasH,
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('thumbnail image load failed'));
    img.src = src;
  });
}

async function stitchHorizontally(dataUrls: string[], gapPx: number): Promise<string> {
  const images = await Promise.all(dataUrls.map(loadImage));
  const maxH = Math.max(...images.map((i) => i.naturalHeight));
  const totalW =
    images.reduce((sum, img) => sum + img.naturalWidth, 0) +
    gapPx * Math.max(0, images.length - 1);

  const canvas = document.createElement('canvas');
  canvas.width = totalW;
  canvas.height = maxH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d canvas context unavailable');

  let x = 0;
  for (const img of images) {
    const y = Math.round((maxH - img.naturalHeight) / 2);
    ctx.drawImage(img, x, y);
    x += img.naturalWidth + gapPx;
  }
  return canvas.toDataURL('image/png');
}
