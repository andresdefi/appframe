import { describe, it, expect, vi, beforeEach } from 'vitest';
import type * as FontsLoader from '../fonts/loader.js';

vi.mock('../fonts/loader.js', async () => {
  const actual = await vi.importActual<typeof FontsLoader>('../fonts/loader.js');
  return {
    ...actual,
    loadFontFaces: vi
      .fn()
      .mockResolvedValue('@font-face { font-family: "Inter"; src: url("data:..."); }'),
    loadFontFacesUrl: vi
      .fn()
      .mockResolvedValue('@font-face { font-family: "Inter"; src: url("/preview-fonts/inter/Inter-Regular.woff2"); }'),
  };
});

import { TemplateEngine } from './engine.js';
import type { TemplateContext } from './engine.js';
import { mockScreenshotDataUrl } from '../test-utils.js';

function makeContext(overrides?: Partial<TemplateContext>): TemplateContext {
  return {
    headline: 'Test Headline',
    screenshotUrl: mockScreenshotDataUrl(),
    colors: { primary: '#2563EB', secondary: '#7C3AED', background: '#F8FAFC', text: '#0F172A' },
    font: 'inter',
    fontWeight: 600,
    layout: 'center',
    frame: null,
    frameStyle: 'flat',
    frameSvg: null,
    canvasWidth: 645,
    canvasHeight: 1398,
    ...overrides,
  };
}

describe('TemplateEngine', () => {
  let engine: TemplateEngine;

  beforeEach(() => {
    engine = new TemplateEngine();
  });

  it('renders HTML for a minimal context', async () => {
    const html = await engine.render(makeContext());
    expect(html).toContain('Test Headline');
    expect(html).toContain('<html');
    expect(html).toContain('</html>');
  });

  it('renders fullscreen mode when isFullscreen is true', async () => {
    const html = await engine.render(makeContext({ isFullscreen: true }));
    expect(html).toContain('<html');
  });

  it('includes headline text in output', async () => {
    const html = await engine.render(makeContext({ headline: 'My App' }));
    expect(html).toContain('My App');
  });

  it('includes subtitle when provided', async () => {
    const html = await engine.render(makeContext({ subtitle: 'Subtitle Text' }));
    expect(html).toContain('Subtitle Text');
  });

  it('includes screenshot data URL', async () => {
    const dataUrl = mockScreenshotDataUrl();
    const html = await engine.render(makeContext({ screenshotUrl: dataUrl }));
    expect(html).toContain('data:image/png;base64');
  });

  it('includes font CSS', async () => {
    const html = await engine.render(makeContext());
    expect(html).toContain('@font-face');
  });

  describe('FontFaceMode', () => {
    it("emits inline data-URI faces when constructed without fontBaseUrl (default = 'inline')", async () => {
      const html = await new TemplateEngine().render(makeContext());
      expect(html).toContain('@font-face');
      expect(html).toContain('data:');
    });

    it("emits URL-based faces when constructed with fontBaseUrl (default = 'url')", async () => {
      const html = await new TemplateEngine({ fontBaseUrl: '/preview-fonts' }).render(
        makeContext(),
      );
      expect(html).toContain('@font-face');
      expect(html).toContain('/preview-fonts/');
    });

    it("emits NO @font-face when fontFaceMode='none'", async () => {
      const html = await new TemplateEngine({ fontBaseUrl: '/preview-fonts' }).render(
        makeContext(),
        { fontFaceMode: 'none' },
      );
      expect(html).not.toContain('@font-face');
      // Sanity — the rest of the document still renders.
      expect(html).toContain('Test Headline');
    });

    it("explicit 'inline' overrides the URL default at the call site", async () => {
      const html = await new TemplateEngine({ fontBaseUrl: '/preview-fonts' }).render(
        makeContext(),
        { fontFaceMode: 'inline' },
      );
      expect(html).toContain('@font-face');
      expect(html).toContain('data:');
      expect(html).not.toContain('/preview-fonts/');
    });

    it("throws when 'url' is requested without a constructor fontBaseUrl", async () => {
      await expect(
        new TemplateEngine().render(makeContext(), { fontFaceMode: 'url' }),
      ).rejects.toThrow(/fontBaseUrl/);
    });
  });
});
