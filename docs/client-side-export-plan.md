# Client-Side Export — Future Work

Status: deferred. Captured 2026-05-12 so we can pick this up later without rediscovering the trade-offs.

## Why we'd do this

The web preview currently exports via Playwright on the server. The flow:

1. User clicks Download in the Export tab
2. Server boots Chromium (~1-2s cold start, amortized across a batch)
3. Server navigates to the rendered HTML, calls `page.screenshot()` per screen
4. PNGs stream back to the user

For local CLI use this is fine. For a **hosted version of appframe** (multi-user SaaS), this is the wrong shape:

- Every export reserves a Chromium process on the server (memory + cold-start cost)
- Batches like "6 screens × 28 locales = 168 screenshots" tie up a server worker for minutes
- Per-user concurrency caps are painful — one heavy user can starve everyone else
- Scaling means renting more compute proportional to export volume

Client-side export moves the rasterization to the user's browser. The server only serves the HTML template and assets. This is what shots.so / applaunchpad / appscreens do and it's why they feel instant.

## What we'd build

The proposal: add an `html-to-image`-style path that runs entirely in the browser, alongside the existing Playwright path. Web UI uses the browser path; CLI keeps Playwright.

### Phase 1 — Proof of concept (2-3 days)

- Add `html-to-image` (or `dom-to-image`, evaluate both) to `packages/web-preview`
- Wire a single button — "Download current screen, client-side" — behind a feature flag
- Capture the live preview iframe contents and rasterize to PNG
- Side-by-side compare against the existing Playwright export at 1x, 2x, 3x scale
- **Decision gate:** is visual parity acceptable? If diffs are subtle (sub-pixel font rendering, minor SVG drift) we proceed. If diffs are blocking (broken text, misaligned device frames) the project stops and we look at a different approach (e.g., embedding `@resvg/resvg-wasm` or a custom SVG-to-canvas pipeline).

### Phase 2 — Resource pipeline (3-4 days)

Every external resource the template loads has to be either same-origin + CORS-friendly OR pre-fetched and inlined as base64 before snapshot. Audit list:

- Fonts (served from `/fonts/*.woff2`) — already same-origin, `document.fonts.ready` already used
- Lucide icons (fetched from `/api/elements/icons/svg/*`) — same-origin
- Blob SVGs (`/api/elements/blobs/svg/*`) — same-origin
- Arrow SVGs (`/api/elements/arrows/svg/*`) — same-origin
- User-uploaded custom images — embedded as data URIs in the overlay state already
- Device frame SVGs/PNGs (`/frames/*`) — same-origin
- Background images (custom user uploads) — data URIs

Most things are already same-origin. The risk surface is mainly:
- Fonts with multiple weights — verify `document.fonts.ready` waits for all loaded variants
- SVG `<use href="#id">` references — html-to-image has historical issues with these
- CSS filters / backdrop-filter — Safari vs Chrome rendering differences

### Phase 3 — Batch, locales, sizes (2-3 days)

- Convert "Download all N" to a client-side loop
- Add `JSZip` for batch zipping into a single download
- UX: progress bar with cancel button. The render runs on the main thread (Web Workers can't access the DOM), so the tab will be partially blocked during the batch. Acceptable for a few seconds, painful for a 170-screenshot run.
- Optimization: render to OffscreenCanvas where supported, batch DOM mutations
- Consider: render 4-8 screens in parallel by cloning the iframe content into multiple hidden containers

### Phase 4 — Keep CLI working (1-2 days)

CLI cannot run html-to-image (no browser). Two options:

- **Option A (recommended):** keep Playwright as the CLI renderer, html-to-image for the web UI. Document the difference — output is functionally identical for App Store submissions but byte-different. This is the path that ships fastest.
- **Option B:** extract a shared "render HTML to PNG" interface with two backends. Won't produce byte-identical output, so the abstraction is mostly cosmetic. Not worth the complexity.

Go with Option A.

### Phase 5 — Quality, edge cases, parity testing (2-3 days)

- Stress test with the worst-case batch: max screens × max locales × max sizes
- Compare visual output against current Playwright export on a corpus of real user configs
- Test in Safari, Chrome, Firefox — fix browser-specific rendering bugs
- Verify mobile browsers can still export (or gracefully fall back)
- Measure: does client-side actually beat server-side once Chromium's cold start is amortized? For a 168-screenshot batch, server-side might still win on raw throughput. The user-facing win is "no server queue, no rate limits, runs while user does other things."

## Realistic timeline

**Total: ~2 weeks of focused work.** Add 1 week of buffer for the inevitable browser-specific surprises = ~3 weeks calendar.

## Open questions to resolve before starting

1. **Library choice:** `html-to-image` vs `dom-to-image` vs `modern-screenshot` (a newer fork). Bake-off in Phase 1.
2. **Browser support floor:** is Safari 15+ enough? Safari is historically the messiest for SVG rasterization.
3. **What's the failure mode** if the user is on an old browser or has resource-loading issues? Fall back to server-side Playwright, or just refuse to export?
4. **For the hosted version specifically:** do we want client-side as the *only* path, or as the fast path with server-side as a paid feature for headless batch jobs? (E.g., a future API that lets a customer's CI generate screenshots without a browser.)

## Why we deferred this

- Current export speed is acceptable for local CLI use
- No hosted version yet — the urgency depends on whether/when that ships
- The visual parity work in Phase 1 is the real risk; until we prove it works, we don't know if any of this is feasible
- More urgent items in the queue: Download tab UX audit, the before.click gap-list editing primitives, repo hygiene cleanup

## When to pick this up

Pre-conditions:

- Decision made on hosted version (the trigger event)
- Or: export speed becomes a top-3 user complaint
- Or: a 2-week slot opens with no higher-priority feature work

The first task on day one: prototype Phase 1, decide the parity question, commit or kill the project.
