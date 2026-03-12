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
  // The server is started manually before running tests (see e2e/README.md).
  // To auto-start, uncomment webServer below:
  // webServer: {
  //   command: 'cd examples/panoramic-demo && node ../../packages/cli/dist/index.js preview',
  //   url: 'http://localhost:4400',
  //   reuseExistingServer: true,
  //   timeout: 15_000,
  // },
});
