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
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        // --enable-precise-memory-info un-buckets performance.memory
        // so the bench reads actual usedJSHeapSize. Without it, the
        // value is rounded to coarse 100MB-ish buckets that hide
        // small deltas (or returns 0 entirely if the page hasn't
        // crossed an origin isolation boundary). Negligible perf
        // cost; only consumed by the benchmark spec.
        launchOptions: { args: ['--enable-precise-memory-info'] },
      },
    },
    // WebKit (Safari's engine) is opt-in via `--project=webkit`.
    // Default is still chromium-only so the regular pnpm test:* runs
    // stay fast. Used by the iframe-vs-shadow benchmark in
    // e2e/bench/preview-backend.spec.ts to validate the migration on
    // the engine that motivated it.
    { name: 'webkit', use: { browserName: 'webkit' } },
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
