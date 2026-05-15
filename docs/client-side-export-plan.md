# Client-Side Export — Done

Status: **complete (2026-05-15)**. This doc is now a historical record of
how the migration went. Original plan was written 2026-05-12.

## What shipped

The server-side Playwright export path is gone. The web preview app does
all rasterization in the user's browser via `modern-screenshot`. The
`playwright` package is no longer a runtime dependency of `@appframe/core`.

End-to-end:

- One Download button per mode renders client-side: individual mode hits
  `exportScreenClientSide`, panoramic mode hits `exportPanoramicSlicesClientSide`
  which rasterizes the wide canvas once then crops it into N frame PNGs.
- A single hidden iframe is reused across all renders (created lazily on
  first export, kept alive after).
- Fonts load via `/preview-fonts/<family>/<file>` instead of inline base64,
  so each rasterization HTML payload stays under ~6 KB instead of ~338 KB.
- The CSS spotlight overlay uses a `box-shadow: 0 0 BLUR 9999px rgba()`
  cutout instead of an SVG `<mask>` — the mask approach was breaking
  rasterizer parity because `url(#mask-id)` references don't survive
  `foreignObject` serialization.

## Measurements at the end

| Path | Server (Playwright, before) | Client (current) |
|------|-----------------------------|------------------|
| Single screen | ~1250 ms | ~300 ms |
| 5-screen batch | ~6 s | ~1.7 s |
| 5-frame panoramic | ~6 s (separate renders per frame) | ~1.7 s (single rasterization + N crops) |
| Per-render HTML payload | ~338 KB | ~5.9 KB |

The cumulative diff across the migration is roughly −3,800 lines, mostly
deleted server-side render code, the Renderer wrapper, the approve-artifact
flow, and a layer of flag-gated UI scaffolding that was retired once the
client-side path became the default.

## Phase log

### Phase 1 — POC + parity gate (commit `7725415`)

Side-by-side bake-off at `/poc/export-bakeoff` compared `html-to-image`,
`dom-to-image-more`, and `modern-screenshot` against the server. All three
produced visually equivalent output to Chromium for everything *except*
the SVG-mask spotlight cutout, which was identified as a contained
foreignObject limitation. modern-screenshot won on speed (~107 ms vs
1247 ms server) and was picked for production. POC route deleted in Phase 5.

### Phase 2 — spotlight fix + single-screen wired (commit `6e0954c`)

`injectSpotlightHTML` rewritten to use a `box-shadow` cutout instead of
SVG mask + `feGaussianBlur`. Same technique works in Chromium AND the
client rasterizers, so server-side parity automatically aligned with
client-side output. Flag-gated "Download (client)" button shipped in
ExportTab.

### Phase 3 — batch + panoramic slicing (commit `be9bbaa`)

Batch individual export looped the single-screen helper. Panoramic
introduced `exportPanoramicSlicesClientSide` which rasterizes the wide
canvas exactly once then crops N slices via `canvas.drawImage` — much
cheaper than N separate Playwright renders.

### Phase 4 — delete server-side (commit `43eb0e0`)

`/api/export`, `/api/panoramic-export`, `/api/export-approved-artifact`,
`/api/preview` (the unused render-to-PNG preview endpoint), the `Renderer`
class, `generateScreenshots`, `generatePanoramicScreenshots`, and the
`playwright` runtime dep — all gone. The flag-gated client buttons lost
their flag and became the only Download buttons. SPA fallback fixed to
return JSON 404 for unmatched `/api/*` routes instead of silently serving
the SPA HTML.

The approve-artifact workflow (which let session-mode users persist a
canonical exported artifact to disk) was a casualty — it depended on
server-side rendering. Marked for client-side reconstruction later.

### Phase 5 — cleanup + iframe reuse + explicit awaits + verification

- Deleted the POC bake-off (`/poc/export-bakeoff`, `ExportBakeoff.tsx`),
  its `/poc/test-screenshot` static route, the `html-to-image` and
  `dom-to-image-more` deps (kept `modern-screenshot`)
- Removed stale `Renderer: vi.fn()` mock from server.test.ts and the
  no-op `isClientExportEnabled` flag helpers from clientExport.ts
- iframe reuse: a single hidden export iframe is created lazily and
  reused across all renders. doc.open/doc.write wipes the previous
  contents, so reuse is safe. Saves a handful of ms per export and,
  more importantly, avoids GC churn during long batches
- Replaced the 200ms generic settle window with explicit awaits:
  `fonts.ready` (already exact) + `Promise.allSettled` over every
  `<img>.decode()`. Removes a timing-guess heuristic that could
  half-snapshot slow images, and cuts the 5-screen batch from 2.8s to
  1.7s (~38% faster) — the 200ms tax was being paid unconditionally on
  every screen, and most renders don't need that much wait
- Cross-browser status: Chromium verified working via Playwright.
  Firefox + WebKit were not tested locally (would require ~500 MB of
  browser-binary downloads). modern-screenshot has documented
  cross-browser support but the real-world surface hasn't been hit yet —
  if a Safari user reports a render bug, that's where to dig

## What didn't survive

- `/api/export`, `/api/panoramic-export`, `/api/preview`,
  `/api/export-approved-artifact` server endpoints
- `Renderer` class (`packages/core/src/renderer/renderer.ts`)
- `generateScreenshots`, `generatePanoramicScreenshots` (the per-screen
  Playwright loop and the panoramic equivalent)
- `playwright` as a runtime dep of `@appframe/core`
- The approve-and-persist artifact workflow (the disk-write side of it).
  Easy to rebuild on top of the client path when needed: client renders
  all PNGs locally, POSTs the blobs to a new server-side save-only
  endpoint, server writes them to the artifact dir
- `html-to-image`, `dom-to-image-more` (only `modern-screenshot` stayed)
- The "POC" route and supporting code at `/poc/export-bakeoff`
- `appframe.clientExport` localStorage flag (was load-bearing in
  Phases 2-3, became no-op in Phase 4)

## Followups (not blockers)

- Cross-browser verification in Firefox + WebKit. The infrastructure is
  there (`npx playwright install`) — just nobody ran it
- Rebuild the approve-and-persist artifact workflow on the client path
  when session-mode usage warrants it. Shape: client renders all PNGs
  via the existing `exportScreenClientSide` / `exportPanoramicSlicesClientSide`
  helpers, POSTs the blobs + config YAML to a small new endpoint that
  only writes to disk — no rendering, no Playwright on the server
