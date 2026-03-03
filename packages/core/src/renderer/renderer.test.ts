import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('playwright', () => {
  const mockPage = {
    setViewportSize: vi.fn().mockResolvedValue(undefined),
    setContent: vi.fn().mockResolvedValue(undefined),
    evaluate: vi.fn().mockResolvedValue(undefined),
    waitForTimeout: vi.fn().mockResolvedValue(undefined),
    screenshot: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  };
  const mockContext = {
    newPage: vi.fn().mockResolvedValue(mockPage),
    close: vi.fn().mockResolvedValue(undefined),
  };
  const mockBrowser = {
    newContext: vi.fn().mockResolvedValue(mockContext),
    close: vi.fn().mockResolvedValue(undefined),
  };
  return {
    chromium: {
      launch: vi.fn().mockResolvedValue(mockBrowser),
    },
    __mockPage: mockPage,
    __mockContext: mockContext,
    __mockBrowser: mockBrowser,
  };
});

vi.mock('node:fs/promises', () => ({
  stat: vi.fn().mockResolvedValue({ size: 50000 }),
}));

import { Renderer } from './renderer.js';
import * as pw from 'playwright';

const mocks = pw as unknown as {
  chromium: typeof pw.chromium;
  __mockPage: Record<string, ReturnType<typeof vi.fn>>;
  __mockContext: Record<string, ReturnType<typeof vi.fn>>;
  __mockBrowser: Record<string, ReturnType<typeof vi.fn>>;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Renderer', () => {
  it('init() launches chromium and creates context with deviceScaleFactor=2', async () => {
    const renderer = new Renderer();
    await renderer.init();

    expect(pw.chromium.launch).toHaveBeenCalledWith({ headless: true });
    expect(mocks.__mockBrowser['newContext']).toHaveBeenCalledWith({ deviceScaleFactor: 2 });

    await renderer.close();
  });

  it('render() sets viewport, content, waits for fonts, and screenshots', async () => {
    const renderer = new Renderer();
    await renderer.init();

    const result = await renderer.render({
      html: '<html><body>Hello</body></html>',
      width: 645,
      height: 1398,
      outputPath: '/tmp/test.png',
    });

    expect(mocks.__mockPage['setViewportSize']).toHaveBeenCalledWith({ width: 645, height: 1398 });
    expect(mocks.__mockPage['setContent']).toHaveBeenCalledWith('<html><body>Hello</body></html>', { waitUntil: 'networkidle' });
    expect(mocks.__mockPage['evaluate']).toHaveBeenCalledWith('document.fonts.ready');
    expect(mocks.__mockPage['screenshot']).toHaveBeenCalled();
    expect(result.outputPath).toBe('/tmp/test.png');
    expect(result.width).toBe(1290); // 645 * 2
    expect(result.height).toBe(2796); // 1398 * 2
    expect(result.fileSize).toBe(50000);

    await renderer.close();
  });

  it('close() closes browser and context', async () => {
    const renderer = new Renderer();
    await renderer.init();
    await renderer.close();

    expect(mocks.__mockContext['close']).toHaveBeenCalled();
    expect(mocks.__mockBrowser['close']).toHaveBeenCalled();
  });

  it('close() handles not-initialized state', async () => {
    const renderer = new Renderer();
    await renderer.close();
  });

  it('render() auto-initializes if not called init()', async () => {
    const renderer = new Renderer();
    const result = await renderer.render({
      html: '<html></html>',
      width: 400,
      height: 800,
      outputPath: '/tmp/auto.png',
    });
    expect(result.outputPath).toBe('/tmp/auto.png');
    await renderer.close();
  });
});
