import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';

// Resolve fixture dirs relative to this file so tests work regardless of cwd.
const HERE = fileURLToPath(new URL('.', import.meta.url));

export type PreviewBackend = 'iframe' | 'shadow';

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
 * Fetch the rendered HTML for a fixture from the running preview server,
 * mount it inside an iframe in the parent Playwright page, wait for fonts
 * and image decode, then return the iframe element handle so the caller
 * can screenshot it. The iframe sits at a fixed offset so the screenshot
 * isn't clipped by the test viewport.
 *
 * Phase 0 covers only the iframe backend; `backend === 'shadow'` is a TODO
 * that will land alongside Phase 3.
 */
export async function mountFixture(
  page: Page,
  fixture: FixtureMeta,
  backend: PreviewBackend,
  baseURL: string,
): Promise<{ iframeSelector: string }> {
  if (backend === 'shadow') {
    throw new Error('Shadow backend not implemented yet — wired in Phase 3.');
  }

  const res = await page.request.post(`${baseURL}${fixture.endpoint}`, {
    data: fixture.body,
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
  await page.setContent(
    `<!doctype html><html><head><style>
       html,body{margin:0;padding:0;background:#1a1a1a;}
       iframe{display:block;border:0;width:${fixture.width}px;height:${fixture.height}px;}
     </style></head><body><iframe id="preview"></iframe></body></html>`,
  );

  await page.evaluate(
    ({ html, baseURL }) => {
      const frame = document.getElementById('preview') as HTMLIFrameElement;
      // Same origin as the preview server so relative URLs in the template
      // (font CSS, frame SVGs, screenshot URLs) resolve correctly.
      frame.src = `${baseURL}/about:blank`;
      const doc = frame.contentDocument;
      if (!doc) throw new Error('iframe contentDocument missing');
      doc.open();
      doc.write(html);
      doc.close();
    },
    { html, baseURL },
  );

  await page.waitForFunction(
    () => {
      const f = document.getElementById('preview') as HTMLIFrameElement | null;
      const doc = f?.contentDocument;
      if (!doc) return false;
      if (doc.readyState !== 'complete') return false;
      const fonts = (doc as Document & { fonts?: FontFaceSet }).fonts;
      if (fonts && fonts.status !== 'loaded') return false;
      const imgs = Array.from(doc.images);
      return imgs.every((img) => img.complete && (img.naturalWidth > 0 || img.src.length === 0));
    },
    null,
    { timeout: 10_000 },
  );

  return { iframeSelector: '#preview' };
}
