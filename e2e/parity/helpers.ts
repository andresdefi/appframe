import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';

// Resolve fixture dirs relative to this file so tests work regardless of cwd.
const HERE = fileURLToPath(new URL('.', import.meta.url));

export interface FixtureMeta {
  /** Stable name derived from the file basename (e.g. `01-long-headline`). */
  name: string;
  /** Endpoint the body should be POSTed to. */
  endpoint: '/api/preview-html' | '/api/panoramic-preview-html';
  /** Display width to mount the preview at (mirrors the canvas px the body
   *  requests, so the iframe sized to this maps 1:1 onto the rendered output). */
  width: number;
  height: number;
  /** Raw request body for the route. */
  body: Record<string, unknown>;
}

export interface FixtureFileShape {
  /** Human-readable note, ignored at runtime. */
  description?: string;
  /** Defaults to `/api/preview-html`. */
  endpoint?: FixtureMeta['endpoint'];
  /** Override the iframe mount width. Defaults to `body.width`
   *  (individual) or `body.frameWidth * body.frameCount` (panoramic). */
  width?: number;
  height?: number;
  body: Record<string, unknown>;
}

export function loadIndividualFixtures(): FixtureMeta[] {
  return loadDir(join(HERE, 'fixtures', 'individual'), '/api/preview-html');
}

export function loadPanoramicFixtures(): FixtureMeta[] {
  return loadDir(join(HERE, 'fixtures', 'panoramic'), '/api/panoramic-preview-html');
}

function loadDir(dir: string, defaultEndpoint: FixtureMeta['endpoint']): FixtureMeta[] {
  const entries = readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort();
  return entries.map((file) => {
    const raw = readFileSync(join(dir, file), 'utf8');
    const parsed = JSON.parse(raw) as FixtureFileShape;
    const endpoint = parsed.endpoint ?? defaultEndpoint;
    const isPano = endpoint === '/api/panoramic-preview-html';
    const inferredW = isPano
      ? Number(parsed.body.frameWidth ?? 0) * Number(parsed.body.frameCount ?? 0)
      : Number(parsed.body.width ?? 0);
    const inferredH = isPano
      ? Number(parsed.body.frameHeight ?? 0)
      : Number(parsed.body.height ?? 0);
    const width = parsed.width ?? inferredW;
    const height = parsed.height ?? inferredH;
    if (!width || !height) {
      throw new Error(
        `Fixture ${file}: missing width/height (body did not carry the expected px fields)`,
      );
    }
    return {
      name: basename(file, '.json'),
      endpoint,
      width,
      height,
      body: parsed.body,
    };
  });
}

/**
 * Fetch the rendered HTML for a fixture from the running preview
 * server, mount it under a shadow root on the test page, wait for
 * fonts + image decode, return a selector the caller can screenshot.
 *
 * Mirrors the production shadowPreviewSurface mount path (parse +
 * extract <style>/<body> children → wrap in `.preview-document` →
 * attach to host div) but reimplemented in-page rather than depending
 * on the client build output.
 *
 * The returned `iframeSelector` is the OUTER host div (kept the name
 * for legacy reasons — it predates Phase 7's iframe deletion).
 */
export async function mountFixture(
  page: Page,
  fixture: FixtureMeta,
  baseURL: string,
): Promise<{ iframeSelector: string }> {
  // Opt the engine into 'none' mode so it skips emitting @font-face
  // declarations — the parent-page font registration below covers them.
  const body = { ...fixture.body, fontFaceMode: 'none' };

  const res = await page.request.post(`${baseURL}${fixture.endpoint}`, {
    data: body,
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(
      `Fixture ${fixture.name}: ${fixture.endpoint} returned ${res.status()}: ${text.slice(0, 200)}`,
    );
  }
  const html = await res.text();

  await page.setViewportSize({
    width: Math.max(fixture.width + 40, 400),
    height: Math.max(fixture.height + 40, 400),
  });

  // Collect the font ids referenced by the fixture body so the parent
  // page can register them before mounting (mirrors ScreenCard's flow).
  const fontIds: string[] = [];
  const collect = (v: unknown) => {
    if (typeof v === 'string' && v.length > 0) fontIds.push(v);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b = fixture.body as any;
  collect(b.font);
  collect(b.headlineFont);
  collect(b.subtitleFont);
  collect(b.freeTextFont);

  await page.setContent(
    `<!doctype html><html><head><base href="${baseURL}/"><style>
       html,body{margin:0;padding:0;background:#1a1a1a;}
       #preview{display:block;width:${fixture.width}px;height:${fixture.height}px;contain:layout style paint;}
     </style></head><body><div id="preview"></div></body></html>`,
  );

  // Fetch the @font-face CSS Node-side (page.request is not gated by
  // the test page's CORS origin), then inject it into the parent
  // document as a <style> block — mirrors ensurePreviewFontsRegistered
  // without the in-browser fetch.
  if (fontIds.length > 0) {
    const fontsRes = await page.request.get(
      `${baseURL}/api/preview-font-faces?ids=${encodeURIComponent(fontIds.join(','))}`,
    );
    if (!fontsRes.ok()) {
      throw new Error(`fetching font-faces returned ${fontsRes.status()}`);
    }
    const fontCss = await fontsRes.text();
    if (fontCss.trim().length > 0) {
      await page.evaluate((css) => {
        const style = document.createElement('style');
        style.id = 'parity-fonts';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
      }, fontCss);
    }
  }

  // Mount the HTML into a shadow root using the same logic as
  // shadowPreviewSurface.replaceContent — duplicated here so the harness
  // doesn't depend on the client build output.
  await page.evaluate(
    ({ html }) => {
      const host = document.getElementById('preview') as HTMLElement;
      const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      parsed.querySelectorAll('script').forEach((s) => s.remove());
      const styleNodes = Array.from(parsed.head.querySelectorAll('style'));
      const bodyChildren = Array.from(parsed.body.children);
      root.replaceChildren();
      for (const style of styleNodes) {
        root.appendChild(style.cloneNode(true));
      }
      const wrapper = document.createElement('div');
      wrapper.className = 'preview-document';
      // See shadowPreviewSurface — translateZ(0) makes the wrapper a
      // containing block for position:fixed descendants inside the
      // shadow tree (so saved text positions resolve against the
      // canvas-sized wrapper instead of the browser viewport).
      wrapper.style.cssText =
        'width:100%;height:100%;position:relative;overflow:hidden;transform:translateZ(0);';
      for (const child of bodyChildren) {
        wrapper.appendChild(child);
      }
      root.appendChild(wrapper);
    },
    { html },
  );

  await page.waitForFunction(
    () => {
      const host = document.getElementById('preview');
      const root = host?.shadowRoot;
      if (!root) return false;
      const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
      if (fonts && fonts.status !== 'loaded') return false;
      const imgs = Array.from(root.querySelectorAll('img')) as HTMLImageElement[];
      return imgs.every((img) => img.complete && (img.naturalWidth > 0 || img.src.length === 0));
    },
    null,
    { timeout: 10_000 },
  );

  return { iframeSelector: '#preview' };
}
