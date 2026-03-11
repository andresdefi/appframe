import { chromium } from 'playwright';
import type { Browser, BrowserContext } from 'playwright';
import type { RenderOptions, RenderResult } from './types.js';
import { stat } from 'node:fs/promises';

export class Renderer {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;

  async init(): Promise<void> {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext({
      deviceScaleFactor: 2,
    });
  }

  async render(options: RenderOptions): Promise<RenderResult> {
    if (!this.context) {
      await this.init();
    }

    const page = await this.context!.newPage();

    try {
      await page.setViewportSize({
        width: options.width,
        height: options.height,
      });

      await page.setContent(options.html, {
        waitUntil: 'networkidle',
      });

      // Wait for fonts to load
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      await page.evaluate('document.fonts.ready');

      // Small delay for any CSS transitions/rendering to settle
      await page.waitForTimeout(200);

      const clipRegion = options.clip ?? {
        x: 0,
        y: 0,
        width: options.width,
        height: options.height,
      };

      await page.screenshot({
        path: options.outputPath,
        type: 'png',
        fullPage: false,
        clip: clipRegion,
      });

      const scaleFactor = options.deviceScaleFactor ?? 2;
      const stats = await stat(options.outputPath);

      return {
        outputPath: options.outputPath,
        width: clipRegion.width * scaleFactor,
        height: clipRegion.height * scaleFactor,
        fileSize: stats.size,
      };
    } finally {
      await page.close();
    }
  }

  async close(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
