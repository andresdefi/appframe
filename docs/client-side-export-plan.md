# Client-Side Export — Future Work

Status: picking this up 2026-05-15. Original plan written 2026-05-12; updated after the
CLI / MCP / store-upload packages were removed (see commit 345045d) and after the freeze
fix (b359ffa) that put fonts on a proper URL pipeline.

## Why we'd do this

The web preview currently exports via Playwright on the server. The flow:

1. User clicks Download in the Export tab → `POST /api/export`
2. Server runs `templateEngine.render(context)` → HTML
3. Server passes the HTML to `Renderer.render()` → Playwright `page.setContent()` + `page.screenshot()`
4. Server returns the PNG buffer

For a single user on localhost this is fine — Chromium boots once when the server starts and stays warm. The real reasons to move off it:

- **Drops Playwright entirely.** ~200MB Chromium binary, ~2s cold start, server-side dependency that has to be installed wherever the app runs. Removing it cuts the install footprint dramatically and makes the app trivially deployable (just a Node/HTTP server, no native deps).
- **Unblocks a hosted version.** Multi-user SaaS doesn't tolerate per-export Chromium processes. Batches like "6 screens × 28 locales = 168 screenshots" tie up a worker for minutes.
- **No server queue.** Exports happen in the user's tab on their CPU. Concurrent exports across users don't contend.

What we'd be replicating: shots.so / applaunchpad / appscreens all do client-side export. It's why they feel instant.

## The current export shape (after recent cleanup)

The codebase is much simpler than when this plan was first written:

- Only the **web-preview** server consumes the renderer (CLI is gone)
- Template engine and Playwright renderer both live in `packages/core`, called from `packages/web-preview/src/server.ts`
- Two export endpoints: `/api/export` (individual mode) and `/api/panoramic-export` (panoramic mode)
- One preview endpoint per mode: `/api/preview-html`, `/api/panoramic-preview-html` — these produce the **same HTML** the export uses, just sized for the preview iframe instead of the final canvas
- All resources are same-origin: fonts (`/preview-fonts/*` since b359ffa), Lucide icons (`/api/elements/icons/*`), blob/arrow SVGs (`/api/elements/*`), device frames (bundled into the HTML), user uploads (data URIs already embedded)

Because the preview iframe already renders the same HTML at preview-scale, **client-side export can reuse the existing iframe rather than spinning up a new render context**. Render a hidden full-size iframe with the export HTML, snapshot it, done.

## What we'd build

Add an `html-to-image`-style path that runs entirely in the browser. With no CLI to support, the migration can be a clean swap: replace `/api/export` and `/api/panoramic-export` with a client-side rasterizer and delete the Playwright Renderer once parity is proven.

### Phase 1 — Proof of concept + parity gate (2-3 days)

The decision gate. If parity isn't acceptable here, the rest of the project is off and we keep Playwright.

- Pick a library. Top candidates: `html-to-image`, `dom-to-image-more`, `modern-screenshot` (newer fork with bug fixes). Bake them off on a representative screen.
- Wire a feature-flagged "Download (client-side)" button in `ExportTab.tsx` next to the existing Download button
- Render a hidden full-size iframe (canvas dimensions, not preview-scaled) with the export HTML — the same HTML `/api/preview-html` returns, just sized differently
- Wait for `iframe.contentDocument.fonts.ready`, snapshot to PNG, trigger download
- Side-by-side compare against the current server-side export at 1x, 2x, 3x scale. Test corpus: at least the existing reference screenshots under `reference-screenshots/`
- **Decision gate:** is visual parity acceptable? If diffs are subtle (sub-pixel font rendering, minor SVG drift) we proceed. If diffs are blocking (broken text, misaligned device frames, missing filters) the project stops here.

### Phase 2 — Resource and font pipeline (1-2 days)

This is much smaller than originally scoped because the freeze fix (b359ffa) already moved fonts to a proper URL pipeline. The audit:

- **Fonts** — `/preview-fonts/<family>/<file>` is already same-origin and served as static. `document.fonts.ready` should be sufficient. Verify all weights resolve.
- **Lucide icons** — `/api/elements/icons/svg/*`, same-origin.
- **Blob / arrow SVGs** — `/api/elements/*`, same-origin.
- **Device frame assets** — inlined into the HTML as `frameSvg | safe` or `framePngUrl` (data URI). Already self-contained.
- **User-uploaded images** — embedded as data URIs in state. Already self-contained.

The remaining real risks:

- SVG `<use href="#id">` — `html-to-image` has historical issues with these. Spotlight masks and some icons use `<use>`. Test specifically.
- CSS `filter` / `backdrop-filter` — Safari vs Chrome differences.
- Device transforms with `perspective` + `rotateY` — confirm rasterizers handle 3D transforms correctly.

### Phase 3 — Batch, locales, sizes (2-3 days)

- Convert "Download all" into a client-side loop
- Add `JSZip` for zipping batch output
- Progress bar with cancel
- Optimization: render N screens in parallel by mounting N hidden iframes. The rasterization step is main-thread-bound (no OffscreenCanvas + foreignObject support yet), but font load and DOM layout can run concurrently
- Honest UX: a 170-screenshot batch is going to feel slow no matter what. Set expectations in the UI ("This will take ~30 seconds, your tab will be busy")

### Phase 4 — Delete server-side export (1 day)

Once client-side is the default and stable:

- Remove `/api/export` and `/api/panoramic-export` endpoints from server.ts
- Remove `Renderer` class and its imports from core
- Remove `playwright` from `packages/web-preview/package.json` dependencies
- Drop the `node packages/web-preview/dist/bin.js` requirement on having Chromium installed
- Keep `templateEngine.render()` and `/api/preview-html` — those still produce the HTML, just consumed by the iframe instead of by Playwright

This is the payoff phase. Once Playwright is out, the install footprint shrinks by ~200MB and `pnpm install` becomes much faster.

### Phase 5 — Quality, edge cases, parity testing (1-2 days)

- Stress test the worst-case batch (max screens × max locales × max sizes)
- Visual diff against the previous server-side exports on the `reference-screenshots/` corpus
- Test in Safari, Chrome, Firefox — fix browser-specific rendering bugs
- Verify mobile browsers can still export (or fall back gracefully)
- Final cleanup: anywhere in the codebase that still references `Renderer`, `chromium`, or `/api/export`

## Realistic timeline

**~7-9 days of focused work** (down from the 2-3 weeks the original plan estimated, mostly because Phase 4 "Keep CLI working" is now "Delete server-side renderer" and the resource pipeline audit got smaller).

Add a week of buffer for browser-specific surprises in Phase 2/5 = ~2 weeks calendar.

## Open questions to resolve in Phase 1

1. **Library choice:** `html-to-image` vs `dom-to-image-more` vs `modern-screenshot`. Decide in the bake-off.
2. **Snapshot source:** snapshot a hidden full-size iframe with the export HTML, or upscale-snapshot the live preview iframe? Hidden full-size is cleaner (matches export resolution directly) but means rendering twice.
3. **Fallback strategy:** if rasterization fails (old browser, blocked resource, weird SVG), do we fall back to server-side or just error? Probably error in Phase 1-3, keep server-side as a flag-gated fallback through Phase 4 in case we need to roll back, then delete it.
4. **Browser support floor:** Safari 15+? Older Safari has historically been messy for SVG-to-canvas.

## When to pick this up

Picking it up now (2026-05-15) — no specific trigger event, just a free window and the codebase is in a clean state to make the swap. First task: prototype Phase 1, decide the parity question, commit or kill the project.
