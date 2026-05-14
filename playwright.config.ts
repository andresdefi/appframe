import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4400',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  // Start the preview server manually with `pnpm preview` before running tests.
  // To auto-start, uncomment webServer below:
  // webServer: {
  //   command: 'pnpm preview',
  //   url: 'http://localhost:4400',
  //   reuseExistingServer: true,
  //   timeout: 15_000,
  // },
});
