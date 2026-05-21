/**
 * Comparative benchmark of the iframe and shadow preview backends.
 *
 * Loads the current editor (whatever project is active in
 * `~/Documents/appframe/projects/`) under each backend in turn,
 * waits for the live preview to settle, and reports:
 *
 * - time-to-first-card-rendered
 * - time-to-network-idle (proxy for "all cards rendered")
 * - JS heap usage (Chromium's `performance.memory`)
 * - DOM node count in the parent document
 * - distinct Document count (one per iframe; shadow contributes 0)
 *
 * The Safari iframe-bitmap-purge flash that motivated the whole
 * migration isn't reproducible in Chromium, so this benchmark
 * doesn't try to measure it — you'll need to feel it manually in
 * Safari (open the editor, switch tabs for 30 seconds, come back).
 * What this DOES show is the structural cost reduction: one document
 * tree instead of N, fewer DOM nodes overall, lower JS heap.
 *
 * Run with: `pnpm test:bench` (added in package.json).
 *
 * The output is JSON-shaped console.log lines prefixed `[bench]` so
 * a future iteration can parse them into a report; today the spec
 * itself just asserts the runs complete.
 */
import { test, expect, type Page } from '@playwright/test';

interface Scenario {
  name: 'iframe' | 'shadow';
  url: string;
}

const SCENARIOS: Scenario[] = [
  { name: 'iframe', url: '/?shadow=0' },
  { name: 'shadow', url: '/' },
];

/** Repeat each scenario this many times and report the median, so a
 *  single warm-up / GC / paint hiccup doesn't dominate the result. */
const RUNS_PER_SCENARIO = 3;

interface Sample {
  firstRenderMs: number;
  networkIdleMs: number;
  jsHeapMB: number | null;
  domNodes: number;
  distinctDocuments: number;
  previewHosts: number;
}

function median(xs: number[]): number {
  const sorted = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1]! + sorted[mid]!) / 2
    : sorted[mid]!;
}

async function takeSample(page: Page, baseURL: string, url: string): Promise<Sample> {
  const t0 = Date.now();
  await page.goto(`${baseURL}${url}`);

  // First card host attached — the iframe path renders an <iframe>,
  // the shadow path renders a <div ref={shadowHostRef}>. Both have
  // the same outer classes so we wait for either.
  await page
    .locator('iframe, div.border-none.block.origin-top-left')
    .first()
    .waitFor({ state: 'attached', timeout: 15_000 });
  const firstRenderMs = Date.now() - t0;

  // "All cards rendered" — wait until every preview host has a
  // `.canvas` element inside it (iframe: contentDocument; shadow:
  // shadowRoot). More reliable than `networkidle`, which on the dev
  // server never settles thanks to Vite's HMR socket.
  await page.waitForFunction(
    () => {
      const iframes = Array.from(document.querySelectorAll('iframe')) as HTMLIFrameElement[];
      const shadowHosts = Array.from(
        document.querySelectorAll('div.border-none.block.origin-top-left'),
      ) as HTMLDivElement[];
      const total = iframes.length + shadowHosts.length;
      if (total === 0) return false;
      const ready =
        iframes.every((f) => {
          try {
            return f.contentDocument?.querySelector('.canvas') != null;
          } catch {
            return false;
          }
        }) &&
        shadowHosts.every((h) => h.shadowRoot?.querySelector('.canvas') != null);
      return ready;
    },
    null,
    { timeout: 20_000 },
  );
  const networkIdleMs = Date.now() - t0;

  // Small additional settle so layout / paint costs of the last batch
  // are included in the memory snapshot.
  await page.waitForTimeout(500);

  const stats = await page.evaluate(() => {
    // Chromium-only API. Wrap in any-cast because the TS lib doesn't
    // type it.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m = (performance as any).memory;
    const iframes = Array.from(document.querySelectorAll('iframe'));
    const distinctDocuments = iframes.filter((f) => {
      try {
        return f.contentDocument != null;
      } catch {
        return false;
      }
    }).length;
    const previewHosts = document.querySelectorAll(
      'iframe[title^="Screen"], iframe[title^="Panoramic"], div.border-none.block.origin-top-left',
    ).length;
    return {
      jsHeapBytes: typeof m?.usedJSHeapSize === 'number' ? (m.usedJSHeapSize as number) : null,
      domNodes: document.querySelectorAll('*').length,
      distinctDocuments,
      previewHosts,
    };
  });

  return {
    firstRenderMs,
    networkIdleMs,
    jsHeapMB: stats.jsHeapBytes != null ? +(stats.jsHeapBytes / 1_000_000).toFixed(1) : null,
    domNodes: stats.domNodes,
    distinctDocuments: stats.distinctDocuments,
    previewHosts: stats.previewHosts,
  };
}

test.describe.serial('preview backend benchmark', () => {
  const results: Array<{ scenario: Scenario['name']; samples: Sample[] }> = [];

  for (const scenario of SCENARIOS) {
    test(scenario.name, async ({ page, baseURL }) => {
      if (!baseURL) throw new Error('baseURL must be set');
      const samples: Sample[] = [];
      for (let i = 0; i < RUNS_PER_SCENARIO; i++) {
        const sample = await takeSample(page, baseURL, scenario.url);
        samples.push(sample);
        console.log(
          `[bench] ${scenario.name} run ${i + 1}/${RUNS_PER_SCENARIO}`,
          JSON.stringify(sample),
        );
      }
      results.push({ scenario: scenario.name, samples });

      // Sanity — we got real numbers.
      expect(samples.length).toBe(RUNS_PER_SCENARIO);
      expect(samples.every((s) => s.firstRenderMs > 0)).toBe(true);
      expect(samples.every((s) => s.previewHosts > 0)).toBe(true);
    });
  }

  test('summary', async () => {
    if (results.length !== SCENARIOS.length) {
      console.log('[bench] summary skipped (one or both scenarios failed)');
      return;
    }
    const heap = (k: 'jsHeapMB') => (vals: Sample[]) =>
      vals.map((s) => s[k]).filter((v): v is number => v != null);
    const summary = results.map((r) => {
      const firstRender = r.samples.map((s) => s.firstRenderMs);
      const networkIdle = r.samples.map((s) => s.networkIdleMs);
      const heapVals = heap('jsHeapMB')(r.samples);
      const domNodes = r.samples.map((s) => s.domNodes);
      return {
        scenario: r.scenario,
        firstRenderMsMedian: median(firstRender),
        networkIdleMsMedian: median(networkIdle),
        jsHeapMBMedian: heapVals.length > 0 ? median(heapVals) : null,
        domNodesMedian: median(domNodes),
        distinctDocuments: r.samples[r.samples.length - 1]!.distinctDocuments,
        previewHosts: r.samples[r.samples.length - 1]!.previewHosts,
      };
    });

    console.log('\n[bench] ====== summary (medians across runs) ======');
    for (const row of summary) {
      console.log(
        `[bench] ${row.scenario.padEnd(7)}` +
          `  firstRender=${String(row.firstRenderMsMedian).padStart(5)}ms` +
          `  networkIdle=${String(row.networkIdleMsMedian).padStart(5)}ms` +
          `  jsHeap=${row.jsHeapMBMedian != null ? row.jsHeapMBMedian.toFixed(1).padStart(6) + 'MB' : '   n/a'}` +
          `  domNodes=${String(row.domNodesMedian).padStart(5)}` +
          `  distinctDocs=${String(row.distinctDocuments).padStart(2)}` +
          `  hosts=${row.previewHosts}`,
      );
    }

    // Diff
    const ifr = summary.find((s) => s.scenario === 'iframe')!;
    const shd = summary.find((s) => s.scenario === 'shadow')!;
    const diff = (label: string, a: number, b: number) =>
      `${label} ${b - a > 0 ? '+' : ''}${(b - a).toFixed(1)} (${((b / a) * 100 - 100).toFixed(1)}%)`;
    console.log('\n[bench] shadow vs iframe (negative = shadow is cheaper):');
    console.log(`[bench]   ${diff('firstRender (ms)  ', ifr.firstRenderMsMedian, shd.firstRenderMsMedian)}`);
    console.log(`[bench]   ${diff('networkIdle (ms)  ', ifr.networkIdleMsMedian, shd.networkIdleMsMedian)}`);
    if (ifr.jsHeapMBMedian != null && shd.jsHeapMBMedian != null) {
      console.log(`[bench]   ${diff('jsHeap (MB)       ', ifr.jsHeapMBMedian, shd.jsHeapMBMedian)}`);
    }
    console.log(`[bench]   ${diff('domNodes          ', ifr.domNodesMedian, shd.domNodesMedian)}`);
    console.log(
      `[bench]   distinctDocs iframe=${ifr.distinctDocuments} shadow=${shd.distinctDocuments}  (shadow should be 0 or close to it)`,
    );
    console.log('');
  });
});
