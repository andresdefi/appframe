/**
 * Phase 1 POC for the client-side export migration.
 *
 * Renders a hardcoded torture-test screen at export resolution and rasterizes
 * it with three candidate libraries — html-to-image, dom-to-image-more, and
 * modern-screenshot — plus the existing server-side Playwright path for
 * ground truth. Each result panel shows the produced PNG, the time spent
 * rasterizing, and the file size. Lets us judge visual parity and decide
 * the Phase 1 gate.
 *
 * Mounted by App.tsx when window.location.pathname starts with
 * /poc/export-bakeoff. Dev-only — deleted once a library is picked.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { toPng as htiToPng } from 'html-to-image';
import { domToPng as msDomToPng } from 'modern-screenshot';
import * as domToImageMore from 'dom-to-image-more';

// Export-resolution canvas. iPhone 6.9 — matches the default size key the
// server picks when none is supplied.
const EXPORT_WIDTH = 1290;
const EXPORT_HEIGHT = 2796;

type ScenarioId = 'torture' | 'real-screenshot' | 'multi-weight' | 'panoramic';

// Panoramic uses a different canvas — 4 frames wide.
const PANO_FRAME_WIDTH = 1290;
const PANO_FRAME_HEIGHT = 2796;
const PANO_FRAME_COUNT = 4;
const PANO_TOTAL_WIDTH = PANO_FRAME_WIDTH * PANO_FRAME_COUNT;

// Fetch a reference PNG and turn it into a data URI so it can be embedded
// directly in the preview HTML. Used by the real-screenshot scenario.
async function loadReferenceScreenshot(): Promise<string> {
  const res = await fetch('/poc/test-screenshot/impostor/screenshot-1.png');
  if (!res.ok) throw new Error(`reference screenshot fetch failed: ${res.status}`);
  const blob = await res.blob();
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(r.error ?? new Error('FileReader error'));
    r.onload = () => resolve(r.result as string);
    r.readAsDataURL(blob);
  });
}

// Hardcoded torture-test config. Exercises: headline + subtitle + free text
// with rotations, custom background gradient, device with frame + corner
// radius, device shadow, spotlight cutout, annotation overlay, callout card,
// floating overlay shape. The screenshot is a transparent placeholder served
// by the server when no screenshotDataUrl is supplied.
function buildTortureBody() {
  return {
    screenIndex: 0,
    width: EXPORT_WIDTH,
    height: EXPORT_HEIGHT,
    headline: 'Track every habit with a single tap',
    subtitle: 'Streaks, reminders, insights',
    freeText: 'Free 14-day trial',
    freeTextEnabled: true,
    freeTextSize: 28,
    layout: 'center',
    font: 'inter',
    fontWeight: 700,
    headlineSize: 88,
    subtitleSize: 36,
    headlineRotation: 0,
    subtitleRotation: 0,
    colors: {
      primary: '#6366F1',
      secondary: '#EC4899',
      background: '#0F172A',
      text: '#F8FAFC',
      subtitle: '#CBD5E1',
      freeText: '#94A3B8',
    },
    backgroundType: 'gradient',
    backgroundGradient: {
      type: 'linear',
      colors: ['#0F172A', '#312E81', '#831843'],
      direction: 135,
    },
    frameId: 'iphone-17-pro',
    fStyle: 'flat',
    deviceColor: 'Default',
    composition: 'single',
    deviceScale: 88,
    deviceTop: 22,
    deviceOffsetX: 0,
    deviceRotation: 0,
    deviceAngle: 0,
    deviceTilt: 4,
    cornerRadius: 28,
    deviceShadow: {
      opacity: 0.35,
      blur: 80,
      color: '#000000',
      offsetY: 32,
    },
    spotlight: {
      x: 50,
      y: 28,
      w: 56,
      h: 12,
      shape: 'rectangle',
      dimOpacity: 0.55,
      blur: 8,
    },
    annotations: [
      {
        id: 'ann-1',
        shape: 'rectangle',
        x: 18,
        y: 64,
        w: 24,
        h: 14,
        strokeColor: '#F472B6',
        strokeWidth: 6,
      },
    ],
    loupe: {
      width: 0.22,
      height: 0.18,
      sourceX: 0.5,
      sourceY: 0.35,
      zoom: 2.2,
      scale: 1.0,
      cornerRadius: 50,
      borderWidth: 4,
      borderColor: '#FFFFFF',
      shadow: true,
      shadowColor: '#000000',
      shadowRadius: 40,
      shadowOffsetX: 0,
      shadowOffsetY: 12,
      displayX: 76,
      displayY: 18,
      xOffset: 0,
      yOffset: 0,
    },
    callouts: [
      {
        id: 'callout-1',
        sourceX: 0.5,
        sourceY: 0.6,
        sourceW: 0.5,
        sourceH: 0.18,
        displayX: 22,
        displayY: 78,
        displayScale: 1.3,
        rotation: -4,
        borderRadius: 20,
        shadow: true,
        borderWidth: 0,
        borderColor: '#FFFFFF',
      },
    ],
    overlays: [
      {
        id: 'overlay-1',
        type: 'shape',
        x: 78,
        y: 88,
        size: 180,
        rotation: 12,
        opacity: 0.55,
        shapeType: 'circle',
        shapeColor: '#F59E0B',
        shapeOpacity: 0.85,
        shapeBlur: 0,
        layer: 'default',
        softBlur: 40,
      },
    ],
  };
}

// Same torture screen, but with a real PNG screenshot loaded as a data URI
// instead of the server-rendered placeholder. Tests whether the rasterizers
// handle large embedded raster images correctly.
async function buildRealScreenshotBody() {
  const dataUrl = await loadReferenceScreenshot();
  return { ...buildTortureBody(), screenshotDataUrl: dataUrl };
}

// Same torture screen but with fontWeight 900 and all per-element fonts
// explicit. Verifies that non-default weights load from /preview-fonts/* and
// render as heavy in the rasterized output. If the heavy weight falls back
// to a synthesized bold (or a different weight entirely), the visual diff
// against the server will be obvious.
function buildHeavyWeightBody() {
  const base = buildTortureBody();
  return {
    ...base,
    fontWeight: 900,
    headlineFontWeight: 900,
    subtitleFontWeight: 900,
    freeTextFontWeight: 900,
    headline: 'Heavy weight 900',
    subtitle: 'Should look bold',
    freeText: 'fontWeight: 900',
  };
}

// Minimal panoramic config: solid background + one device element per frame.
// Tests the panoramic render path, which uses /api/panoramic-preview-html
// instead of /api/preview-html and produces a wide composite canvas.
function buildPanoramicBody() {
  const elements = Array.from({ length: PANO_FRAME_COUNT }, (_, i) => ({
    id: `device-${i}`,
    type: 'device' as const,
    frame: 'iphone-17-pro',
    frameStyle: 'flat',
    deviceColor: 'Default',
    screenshot: '',
    fullscreenScreenshot: false,
    x: 10 + i * 22, // % of total width
    y: 8,           // % of frame height
    width: 16,
    height: 84,
    rotation: 0,
    cornerRadius: 24,
    z: 1,
  }));
  return {
    locale: 'default',
    frameCount: PANO_FRAME_COUNT,
    frameWidth: PANO_FRAME_WIDTH,
    frameHeight: PANO_FRAME_HEIGHT,
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        colors: ['#0F172A', '#312E81', '#831843'],
        direction: 135,
      },
    },
    elements,
    font: 'inter',
    fontWeight: 700,
    frameStyle: 'flat',
  };
}

interface BakeoffResult {
  label: string;
  pngDataUrl: string | null;
  bytes: number | null;
  ms: number | null;
  error: string | null;
}

async function snapshotWithHtmlToImage(node: HTMLElement, w: number, h: number): Promise<string> {
  return htiToPng(node, { pixelRatio: 1, cacheBust: false, width: w, height: h });
}

async function snapshotWithModernScreenshot(node: HTMLElement, w: number, h: number): Promise<string> {
  return msDomToPng(node, { scale: 1, width: w, height: h });
}

async function snapshotWithDomToImage(node: HTMLElement, w: number, h: number): Promise<string> {
  // dom-to-image-more is CommonJS-exported; access default export.
  const lib = (domToImageMore as { default?: typeof domToImageMore }).default ?? domToImageMore;
  const toPng = (lib as { toPng: (n: HTMLElement, opts: unknown) => Promise<string> }).toPng;
  return toPng(node, { width: w, height: h });
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error('FileReader error'));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

interface ScenarioSpec {
  id: ScenarioId;
  label: string;
  description: string;
  canvasWidth: number;
  canvasHeight: number;
  // Returns the request body + the endpoint to POST it to for preview HTML.
  buildPreviewBody: () => Promise<{ body: unknown; previewEndpoint: string }>;
  // Server export endpoint + body shape. Some scenarios export differently
  // (panoramic-export returns a ZIP of slices rather than a single PNG).
  fetchServerPng: () => Promise<{ pngDataUrl: string; bytes: number }>;
}

const SCENARIOS: Record<ScenarioId, ScenarioSpec> = {
  torture: {
    id: 'torture',
    label: 'Torture (default)',
    description: `Full-feature individual screen at ${EXPORT_WIDTH}×${EXPORT_HEIGHT}: spotlight, annotations, loupe, callout, overlay, gradient bg, device shadow, free-text. Screenshot is a placeholder SVG.`,
    canvasWidth: EXPORT_WIDTH,
    canvasHeight: EXPORT_HEIGHT,
    buildPreviewBody: async () => ({ body: buildTortureBody(), previewEndpoint: '/api/preview-html' }),
    fetchServerPng: async () => {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...buildTortureBody(), sizeKey: 'ios-6.9' }),
      });
      if (!res.ok) throw new Error(`server export failed: ${res.status}`);
      const blob = await res.blob();
      return { pngDataUrl: await blobToDataUrl(blob), bytes: blob.size };
    },
  },
  'real-screenshot': {
    id: 'real-screenshot',
    label: 'Real screenshot',
    description: 'Torture screen but with a real PNG (impostor screenshot-1) as the device content instead of the placeholder. Tests rasterizer handling of large embedded raster images.',
    canvasWidth: EXPORT_WIDTH,
    canvasHeight: EXPORT_HEIGHT,
    buildPreviewBody: async () => ({ body: await buildRealScreenshotBody(), previewEndpoint: '/api/preview-html' }),
    fetchServerPng: async () => {
      const body = await buildRealScreenshotBody();
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, sizeKey: 'ios-6.9' }),
      });
      if (!res.ok) throw new Error(`server export failed: ${res.status}`);
      const blob = await res.blob();
      return { pngDataUrl: await blobToDataUrl(blob), bytes: blob.size };
    },
  },
  'multi-weight': {
    id: 'multi-weight',
    label: 'Heavy weight (900)',
    description: 'Torture screen with all text rendered at fontWeight 900. If the heavy weight fails to load from /preview-fonts the browser will synthesize fake bold — visually obvious vs the server render.',
    canvasWidth: EXPORT_WIDTH,
    canvasHeight: EXPORT_HEIGHT,
    buildPreviewBody: async () => ({ body: buildHeavyWeightBody(), previewEndpoint: '/api/preview-html' }),
    fetchServerPng: async () => {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...buildHeavyWeightBody(), sizeKey: 'ios-6.9' }),
      });
      if (!res.ok) throw new Error(`server export failed: ${res.status}`);
      const blob = await res.blob();
      return { pngDataUrl: await blobToDataUrl(blob), bytes: blob.size };
    },
  },
  panoramic: {
    id: 'panoramic',
    label: 'Panoramic (4 frames)',
    description: `Panoramic mode: ${PANO_FRAME_COUNT} frames × ${PANO_FRAME_WIDTH}px = ${PANO_TOTAL_WIDTH}px wide canvas with one device per frame. Server export normally slices this into individual PNGs at export time; the bake-off renders the wide canvas as one PNG so the rasterizers can be compared directly.`,
    canvasWidth: PANO_TOTAL_WIDTH,
    canvasHeight: PANO_FRAME_HEIGHT,
    buildPreviewBody: async () => ({ body: buildPanoramicBody(), previewEndpoint: '/api/panoramic-preview-html' }),
    fetchServerPng: async () => {
      // panoramic-export returns a ZIP of per-frame PNGs. For the bake-off we
      // just want a single representative PNG, so we hit the wide-canvas
      // preview HTML and pipe it through the same Renderer the export uses.
      // Simpler: re-use the panoramic-preview-html, then render it through
      // /api/preview-render-from-html if it exists. It doesn't, so the
      // server-result slot is intentionally left as a "skipped" placeholder
      // for panoramic until the export endpoint is extended.
      throw new Error('Panoramic single-canvas server export not wired; see comment.');
    },
  },
};

function dataUrlBytes(dataUrl: string): number {
  // base64 payload after the comma; PNG bytes ≈ payload length * 3 / 4.
  const comma = dataUrl.indexOf(',');
  if (comma < 0) return 0;
  const base64 = dataUrl.slice(comma + 1);
  return Math.floor((base64.length * 3) / 4);
}

const EMPTY_RESULTS: BakeoffResult[] = [
  { label: 'Server (Playwright)', pngDataUrl: null, bytes: null, ms: null, error: null },
  { label: 'html-to-image', pngDataUrl: null, bytes: null, ms: null, error: null },
  { label: 'modern-screenshot', pngDataUrl: null, bytes: null, ms: null, error: null },
  { label: 'dom-to-image-more', pngDataUrl: null, bytes: null, ms: null, error: null },
];

export function ExportBakeoff() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [scenarioId, setScenarioId] = useState<ScenarioId>('torture');
  const [results, setResults] = useState<BakeoffResult[]>(EMPTY_RESULTS);
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [iframeReady, setIframeReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const scenario = SCENARIOS[scenarioId];

  // Re-prime the iframe whenever the scenario changes. Resets results so a
  // stale render from the previous scenario doesn't linger on screen.
  useEffect(() => {
    let cancelled = false;
    setIframeReady(false);
    setResults(EMPTY_RESULTS);
    setStatus('idle');
    setLoadError(null);

    (async () => {
      try {
        const { body, previewEndpoint } = await scenario.buildPreviewBody();
        const res = await fetch(previewEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`${previewEndpoint} ${res.status}`);
        const html = await res.text();
        if (cancelled) return;
        const iframe = iframeRef.current;
        if (!iframe) return;
        const doc = iframe.contentDocument;
        if (!doc) return;
        doc.open();
        doc.write(html);
        doc.close();
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (doc as any).fonts?.ready;
        } catch {
          // fonts API may be unavailable; fall through.
        }
        await new Promise((r) => setTimeout(r, 200));
        if (cancelled) return;
        setIframeReady(true);
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : String(err));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [scenario]);

  const run = useCallback(async () => {
    if (status === 'running') return;
    setStatus('running');

    const iframe = iframeRef.current;
    const node = iframe?.contentDocument?.documentElement as HTMLElement | undefined;
    const w = scenario.canvasWidth;
    const h = scenario.canvasHeight;

    const next: BakeoffResult[] = EMPTY_RESULTS.map((r) => ({ ...r }));

    const serverPromise = (async () => {
      const t0 = performance.now();
      try {
        const { pngDataUrl, bytes } = await scenario.fetchServerPng();
        next[0] = {
          label: 'Server (Playwright)',
          pngDataUrl,
          bytes,
          ms: Math.round(performance.now() - t0),
          error: null,
        };
      } catch (err) {
        next[0] = {
          label: 'Server (Playwright)',
          pngDataUrl: null,
          bytes: null,
          ms: Math.round(performance.now() - t0),
          error: err instanceof Error ? err.message : String(err),
        };
      }
    })();

    if (!node) {
      next[1].error = 'iframe document not ready';
      next[2].error = 'iframe document not ready';
      next[3].error = 'iframe document not ready';
      await serverPromise;
      setResults(next);
      setStatus('done');
      return;
    }

    const clientRunners: { idx: number; fn: (n: HTMLElement, w: number, h: number) => Promise<string> }[] = [
      { idx: 1, fn: snapshotWithHtmlToImage },
      { idx: 2, fn: snapshotWithModernScreenshot },
      { idx: 3, fn: snapshotWithDomToImage },
    ];

    for (const { idx, fn } of clientRunners) {
      const t0 = performance.now();
      try {
        const dataUrl = await fn(node, w, h);
        next[idx] = {
          label: next[idx]!.label,
          pngDataUrl: dataUrl,
          bytes: dataUrlBytes(dataUrl),
          ms: Math.round(performance.now() - t0),
          error: null,
        };
        setResults([...next]);
      } catch (err) {
        next[idx] = {
          label: next[idx]!.label,
          pngDataUrl: null,
          bytes: null,
          ms: Math.round(performance.now() - t0),
          error: err instanceof Error ? err.message : String(err),
        };
        setResults([...next]);
      }
    }

    await serverPromise;
    setResults([...next]);
    setStatus('done');
  }, [status, scenario]);

  return (
    <div style={{ background: '#0b0b0b', color: '#e5e5e5', minHeight: '100vh', padding: 24, fontFamily: 'system-ui' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Phase 1 — Client-side export bake-off</h1>
        <p style={{ margin: '8px 0 0', fontSize: 13, color: '#9ca3af', maxWidth: 900 }}>
          {scenario.description}
        </p>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {(Object.values(SCENARIOS) as ScenarioSpec[]).map((s) => {
            const active = s.id === scenarioId;
            return (
              <button
                key={s.id}
                onClick={() => setScenarioId(s.id)}
                disabled={status === 'running'}
                style={{
                  padding: '6px 12px',
                  background: active ? '#6366f1' : '#1f2937',
                  color: 'white',
                  border: active ? '1px solid #818cf8' : '1px solid #374151',
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: status === 'running' ? 'not-allowed' : 'pointer',
                }}
              >
                {s.label}
              </button>
            );
          })}
          <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 8 }}>
            Canvas: {scenario.canvasWidth}×{scenario.canvasHeight} · Iframe: <strong>{iframeReady ? 'ready' : loadError ? 'error' : 'loading…'}</strong>
            {loadError ? ` (${loadError})` : null}
          </span>
        </div>
        <button
          onClick={() => void run()}
          disabled={!iframeReady || status === 'running'}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            background: status === 'running' ? '#374151' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: status === 'running' || !iframeReady ? 'not-allowed' : 'pointer',
            fontSize: 14,
          }}
        >
          {status === 'running' ? 'Running…' : 'Run bake-off'}
        </button>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 16,
        }}
      >
        {results.map((r) => (
          <div
            key={r.label}
            style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 8,
              padding: 12,
              minWidth: 0,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{r.label}</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>
              {r.ms !== null ? `${r.ms} ms` : '—'}
              {' · '}
              {r.bytes !== null ? `${Math.round(r.bytes / 1024)} KB` : '—'}
            </div>
            {r.error ? (
              <pre
                style={{
                  background: '#3f1d1d',
                  color: '#fca5a5',
                  fontSize: 11,
                  padding: 8,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  borderRadius: 4,
                }}
              >
                {r.error}
              </pre>
            ) : r.pngDataUrl ? (
              <img
                src={r.pngDataUrl}
                alt={r.label}
                style={{ width: '100%', display: 'block', background: '#000', borderRadius: 4 }}
              />
            ) : (
              <div style={{ height: 200, background: '#262626', borderRadius: 4 }} />
            )}
          </div>
        ))}
      </div>

      {/* Hidden full-resolution iframe used as the snapshot source. The
          libraries walk its documentElement to serialize the DOM. Resized
          per scenario so the panoramic wide canvas (5160px) gets its
          own room without being clipped. */}
      <iframe
        ref={iframeRef}
        title="bakeoff-source"
        style={{
          position: 'fixed',
          top: 0,
          left: '-99999px',
          width: scenario.canvasWidth,
          height: scenario.canvasHeight,
          border: 'none',
        }}
      />
    </div>
  );
}
