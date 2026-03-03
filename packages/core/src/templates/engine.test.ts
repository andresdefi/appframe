import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../fonts/loader.js', async () => {
  const actual = await vi.importActual<typeof import('../fonts/loader.js')>('../fonts/loader.js');
  return {
    ...actual,
    loadFontFaces: vi.fn().mockResolvedValue('@font-face { font-family: "Inter"; }'),
  };
});

import { TemplateEngine } from './engine.js';
import type { TemplateContext } from './engine.js';
import { mockScreenshotDataUrl } from '../test-utils.js';

function makeContext(overrides?: Partial<TemplateContext>): TemplateContext {
  return {
    headline: 'Test Headline',
    screenshotDataUrl: mockScreenshotDataUrl(),
    style: 'minimal',
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

  it('renders HTML for minimal style', async () => {
    const html = await engine.render(makeContext({ style: 'minimal' }));
    expect(html).toContain('Test Headline');
    expect(html).toContain('<html');
    expect(html).toContain('</html>');
  });

  it('renders HTML for all 8 styles', async () => {
    const styles = ['minimal', 'bold', 'glow', 'playful', 'clean', 'branded', 'editorial', 'fullscreen'] as const;
    for (const style of styles) {
      const html = await engine.render(makeContext({ style }));
      expect(html).toContain('<html');
    }
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
    const html = await engine.render(makeContext({ screenshotDataUrl: dataUrl }));
    expect(html).toContain('data:image/png;base64');
  });

  it('includes font CSS', async () => {
    const html = await engine.render(makeContext());
    expect(html).toContain('@font-face');
  });
});
