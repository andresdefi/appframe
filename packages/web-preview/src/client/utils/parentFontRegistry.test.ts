/**
 * Tests run in vitest's default node env. Rather than pull in jsdom for
 * one helper, this file stubs the minimum slice of `document` the
 * registry touches: `getElementById`, `createElement('style')`,
 * `head.appendChild`. Matches the stub-the-globals pattern used by the
 * other client-side utility tests in this package (see canvasBlob.test.ts).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ensurePreviewFontsRegistered,
  __resetPreviewFontRegistryForTests,
} from './parentFontRegistry';

const STYLE_ID = 'appframe-preview-fonts';

interface FakeNode {
  id?: string;
  textContent: string;
  dataset: Record<string, string>;
  children: FakeNode[];
  appendChild(child: FakeNode | { nodeValue: string }): void;
  remove(): void;
}

function fakeElement(): FakeNode {
  const el: FakeNode = {
    textContent: '',
    dataset: {},
    children: [],
    appendChild(child) {
      if ('nodeValue' in child) {
        el.textContent += child.nodeValue;
      } else {
        el.children.push(child);
        if (child.id) el.id = child.id;
      }
    },
    remove() {
      const i = headChildren.indexOf(el);
      if (i >= 0) headChildren.splice(i, 1);
    },
  };
  return el;
}

let headChildren: FakeNode[] = [];

function installFakeDocument(): void {
  headChildren = [];
  (globalThis as { document?: unknown }).document = {
    getElementById(id: string) {
      return headChildren.find((c) => c.id === id) ?? null;
    },
    createElement(tag: string) {
      if (tag !== 'style') throw new Error(`unexpected createElement(${tag})`);
      return fakeElement();
    },
    createTextNode(value: string) {
      return { nodeValue: value };
    },
    head: {
      appendChild(child: FakeNode) {
        headChildren.push(child);
      },
    },
  } as unknown as Document;
}

function mockFetch(responses: Record<string, string>): ReturnType<typeof vi.fn> {
  return vi.fn(async (url: string) => {
    const ids = new URL(url, 'http://localhost').searchParams.get('ids') ?? '';
    const body = responses[ids] ?? '';
    return {
      ok: true,
      status: 200,
      text: async () => body,
    } as Response;
  });
}

describe('ensurePreviewFontsRegistered', () => {
  beforeEach(() => {
    installFakeDocument();
    __resetPreviewFontRegistryForTests();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches once per id and injects the CSS into a shared <style> in document.head', async () => {
    global.fetch = mockFetch({
      inter: '@font-face { font-family: "Inter"; src: url("/preview-fonts/inter/Inter-Regular.woff2"); }',
    }) as unknown as typeof fetch;

    await ensurePreviewFontsRegistered(['inter']);

    const style = document.getElementById(STYLE_ID);
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('@font-face');
    expect(style?.textContent).toContain('Inter');
  });

  it('is idempotent: a second call for the same id makes no network request', async () => {
    const fetchFn = mockFetch({
      inter: '@font-face { font-family: "Inter"; }',
    });
    global.fetch = fetchFn as unknown as typeof fetch;

    await ensurePreviewFontsRegistered(['inter']);
    await ensurePreviewFontsRegistered(['inter']);
    await ensurePreviewFontsRegistered(['inter', 'inter']);

    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('coalesces concurrent calls for the same id into one fetch', async () => {
    const fetchFn = mockFetch({
      'playfair-display': '@font-face { font-family: "Playfair Display"; }',
    });
    global.fetch = fetchFn as unknown as typeof fetch;

    await Promise.all([
      ensurePreviewFontsRegistered(['playfair-display']),
      ensurePreviewFontsRegistered(['playfair-display']),
      ensurePreviewFontsRegistered(['playfair-display']),
    ]);

    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('issues parallel requests when ids differ, appending all CSS into the shared <style>', async () => {
    const fetchFn = mockFetch({
      inter: '@font-face { font-family: "Inter"; }',
      'jetbrains-mono': '@font-face { font-family: "JetBrains Mono"; }',
    });
    global.fetch = fetchFn as unknown as typeof fetch;

    await ensurePreviewFontsRegistered(['inter', 'jetbrains-mono']);

    expect(fetchFn).toHaveBeenCalledTimes(2);
    const style = document.getElementById(STYLE_ID);
    expect(style?.textContent).toContain('Inter');
    expect(style?.textContent).toContain('JetBrains Mono');
  });

  it('handles empty CSS responses (unknown id) without throwing or retrying', async () => {
    const fetchFn = mockFetch({ 'mystery-font': '' });
    global.fetch = fetchFn as unknown as typeof fetch;

    await ensurePreviewFontsRegistered(['mystery-font']);
    await ensurePreviewFontsRegistered(['mystery-font']);

    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(document.getElementById(STYLE_ID)).toBeNull();
  });

  it('drops empty / non-string ids before fetching', async () => {
    const fetchFn = mockFetch({});
    global.fetch = fetchFn as unknown as typeof fetch;

    await ensurePreviewFontsRegistered(['', null as unknown as string, undefined as unknown as string]);

    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('throws when the server returns a non-OK status', async () => {
    global.fetch = vi.fn(async () => ({
      ok: false,
      status: 500,
      text: async () => 'oops',
    } as Response)) as unknown as typeof fetch;

    await expect(ensurePreviewFontsRegistered(['inter'])).rejects.toThrow(/500/);
  });
});
