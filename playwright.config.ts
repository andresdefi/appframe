import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4400',
    headless: true,
    // Render iframes at 2x so parity snapshots have crisp corners/text.
    // The editor in a real browser typically runs at 2-3x DPR; capturing
    // at 1x makes annotations and small rounded shapes look pixelated in
    // review and obscures real rendering differences the parity tests
    // are meant to surface.
    deviceScaleFactor: 2,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  // Start the preview server automatically. Reuses an existing one if a
  // dev `pnpm preview` is already running, so the harness works both
  // headless in CI and interactively while iterating on fixtures.
  webServer: {
    command: 'pnpm preview',
    url: 'http://localhost:4400',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
