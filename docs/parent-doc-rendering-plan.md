# Parent-document rendering — Option C planning context

Status: open. Drafted 2026-05-19 after option A (visibility-snapshot overlay, commit 797a267) shipped as the surgical fix for Safari's tab-switch bitmap-purge flash. A covered the immediate failure mode without touching the iframe-per-card architecture; this plan captures what it would take to remove iframes from the live preview path entirely.

This doc is the brief for a future Claude Code session picking up that work. Start a new session and tell Claude: "read `docs/parent-doc-rendering-plan.md` and implement it."

## What this is

A migration of the **live editing preview** off iframes and onto shadow DOM rooted in the parent document. Each `ScreenCard` becomes a `<div>` host with an open `shadowRoot` instead of an `<iframe>` whose `contentDocument` we `doc.write()` into. The server-side template engine and the export pipeline stay on iframes — only the live in-editor preview changes.

Why the constraint to "only live preview": export uses its own offscreen iframe at full export resolution (`packages/web-preview/src/client/utils/clientExport.ts`). That's the correct pattern for export — explicit dimensions, hard isolation, no parent-doc style interference. It's also load-bearing for visual fidelity ("what you see is what you get"). Migrating export is its own multi-day project and out of scope here; this plan accepts the temporary asymmetry and addresses it via parity testing.

## Why C, not B

B was "consolidate the 6 iframes into one." It would cut device-frame bitmap duplication (one decoded copy instead of six) and help, but it doesn't eliminate the iframe-per-tab purge heuristic that bit us — it just shrinks it. C eliminates the heuristic entirely because there are no iframes left in the preview path. The effort delta between B and C is small (B already requires CSS scoping work that C subsumes), so B is a stepping stone we should skip.

## What changes user-facing

Nothing, if executed well. Same screens, same controls, same drag behavior, same export output, same fonts at same sizes. Subtle improvements:

- Tab-switch flash disappears even without the option-A overlay (Safari treats the parent doc the way it treats any normal single-page site).
- Find-in-page (Cmd+F) finds text in the previews.
- OS-level drag-and-drop into the canvas works without iframe-boundary event swallowing.
- VoiceOver and dev tools read screen contents as part of the parent document tree.
- Font loading deduplicates automatically — one `@font-face` registration in the parent doc instead of one per iframe.

Regressions worth catching with parity tests (see below): any CSS or layout primitive that quietly assumed iframe semantics.

## Risk areas

Shadow DOM is conceptually close to iframe isolation but not identical. The 80% case is a one-line swap; the 20% has real footguns.

### CSS scoping

Shadow DOM gives automatic style isolation: rules declared inside a shadow root only match elements inside that root. Existing template CSS (`/packages/core/templates/`) uses class selectors like `.canvas`, `.headline`, `.device-wrapper` — those stay as-is, no rewriting needed. **This is the biggest win over option B**, which would require attribute-prefixing every selector.

What does need attention:

- `:root` doesn't exist inside a shadow root. Any template CSS using `:root { --foo: ... }` must become `:host { --foo: ... }`. Grep the templates first.
- `:host` is the new way to style the shadow host element itself from inside the shadow root.
- Global CSS (Tailwind on the parent doc) does NOT leak into shadow roots. If any template visually depends on Tailwind utility classes inheriting from outside, those need to be brought inside. Audit the templates for class names that look like Tailwind utilities.

### Viewport-relative units

Inside an iframe, `vw` / `vh` / `vmin` / `vmax` resolve against the iframe's own viewport (`previewW × previewH`). Inside shadow DOM, they resolve against the **parent document's viewport** — i.e., the whole browser window. Any template rule using viewport units will paint wildly differently after migration.

Mitigation: `grep -rn "vw\|vh\|vmin\|vmax" packages/core/templates/` before migrating. Each hit needs a rewrite, typically to a percentage of the wrapper element or to a CSS variable computed by the host (e.g., `--canvas-width: 320px; … width: calc(var(--canvas-width) * 0.5)`).

### `position: fixed`

Inside an iframe, `position: fixed` is relative to the iframe viewport. Inside shadow DOM, it's relative to the parent document viewport. Any fixed-positioned element (the drag-state text positioning code uses `position: fixed` mid-drag — see `useDragPosition.ts`) would jump to be relative to the whole page.

Mitigation: replace `position: fixed` with `position: absolute` inside a `contain: layout` wrapper. The wrapper acts as the new containing block. Audit and rewrite.

### Containment

Iframes inherently contain layout, paint, and style. Shadow DOM does not. A bad CSS rule inside a shadow root can theoretically force the parent doc to recalc layout. Wrap every shadow host with `contain: layout style paint` to restore iframe-like behavior. This is a one-line CSS rule on the host wrapper.

### Font loading

Iframes can declare their own `@font-face` rules in their own `<head>`. Shadow DOM does not inherit `@font-face` from the parent document **automatically** when the styles are loaded via `<style>` tags, but **does** when fonts are registered on `document.fonts` (the FontFace API). Today the templates emit `@font-face` per iframe; that needs to move out to a one-time parent-doc registration on app start.

Mitigation: registerFonts() helper called once at app boot (likely in `App.tsx`). It reads `/preview-fonts/...` files into `FontFace` instances and adds them to `document.fonts`. Templates emit only `font-family: 'X'` declarations, no `@font-face` blocks.

### Export asymmetry

Live preview = shadow DOM. Export = iframe. The same template HTML rendered through both paths could differ visually if any of the above (viewport units, fixed positioning, font availability) interact differently. This is the hidden risk: a user edits in the preview, sees one thing, exports, and gets something subtly different.

**This is what "parity test pass first" exists for.** See the next section.

## Parity testing — DO THIS FIRST

Before writing one line of shadow-DOM code, build a parity harness. Without it, the migration is too risky to land.

### Harness

A test rig (Playwright or Vitest with a real browser) that:

1. Picks a curated set of test screens — 8-12 covering: long headlines, multi-line subtitles, RTL text, italic + bold variants, large device frames (iphone-17-pro-max), small device frames (iphone-17 mini), all background types (solid, gradient, image), the loupe enabled, callouts present, annotations present, overlays from the Elements catalog (shape + icon + arrow + blob), spotlight on, free-text on, and one fullscreen-screenshot screen.
2. For each test screen, renders it via the current iframe path AND via the new shadow-DOM path side by side.
3. Captures both as PNGs at identical dimensions.
4. Computes a pixel diff (e.g., `pixelmatch`) and asserts the diff is below a small threshold (say, 0.1% of pixels, accounting for AA jitter).

If any test screen exceeds the threshold, the migration is not done. The harness becomes a regression gate.

### Snapshot fixture

Commit a snapshot fixture: for each test screen, the expected PNG (rendered via the iframe path on the day the harness landed). The shadow-DOM rendering is validated against these snapshots. Re-render the fixture only on intentional template changes.

### Manual smoke

In addition to automated diffs, a manual pass that walks each test screen and visually compares. Pixel diffs catch obvious breaks; eyeballs catch subtler ones (font hinting, color blending).

### Why this is mandatory

The whole point of C is that the user sees no visible change. The only way to verify that claim is to compare pixels. Shipping C without a parity harness means relying on me-or-you noticing a regression on real projects — too slow, too unreliable.

## Build order

### Phase 0 — Parity harness (no code change to ScreenCard)

Build the harness described above. Land it green against the current iframe rendering. Output is a CI-runnable test that produces a diff report. This is the gate.

Files: `packages/web-preview/test/parity/` (new dir) with the harness + fixture PNGs + the diff utility. The harness runs against a running preview server (`pnpm preview`) over Playwright.

**Done when**: `pnpm test:parity` passes locally and on CI for 8-12 test screens.

### Phase 1 — Font loading consolidation

Move `@font-face` emission out of the template and into a one-time parent-doc registration. Templates emit only `font-family: 'X'`. Verify with the parity harness that fonts still render identically.

Files: new `packages/web-preview/src/client/utils/fontRegistry.ts`, edits to `App.tsx` boot, removal of `@font-face` block from `packages/core/templates/_base/font-face.html` (or equivalent), template engine update to skip emitting `@font-face` for the live-preview path.

This phase ships independently and is reversible. If parity breaks, revert.

### Phase 2 — Template viewport-unit + position-fixed audit

Grep all templates for `vw`, `vh`, `vmin`, `vmax`, `:root`, `position: fixed`. For each hit, decide on the rewrite (CSS variables, `:host`, absolute-in-contained). Land the rewrites. Parity harness should still pass against iframe rendering.

Files: edits across `packages/core/templates/**/*.html`. No `ScreenCard` changes.

### Phase 3 — `ShadowScreen` component, behind a feature flag

Build the new component. Same props as `ScreenCard`, internally uses a `<div>` host with `attachShadow({ mode: 'open' })`. The shadow root receives the same template HTML the iframe currently consumes — applied via a DOMParser parse + `replaceChildren()` flow (not the unsafe direct-assignment alternative), so script tags don't execute and we get a clean DOM swap. Behind a feature flag (URL param `?shadow=1` or a localStorage toggle), ScreenCard mounts `ShadowScreen` instead of an iframe.

Drag, MutationObserver, loupe, guides — all access shadow root instead of iframe contentDocument via a thin abstraction (e.g., a `getPreviewDocument(card): Document | ShadowRoot` helper). The hooks call through that helper. Result: one set of side-effect code, two render backends, switchable.

Files: new `packages/web-preview/src/client/components/Preview/ShadowScreen.tsx`, edits to hooks under `packages/web-preview/src/client/hooks/` (useDragPosition, useInstantPatch, the MutationObserver chain in ScreenCard), edits to ScreenCard.tsx to conditionally mount.

Parity harness runs against both backends in CI.

### Phase 4 — Default the flag to shadow DOM

Flip the default. Iframe path still available via `?shadow=0`. Watch for issues in real-world use over a few days.

Files: edit to the flag default.

### Phase 5 — Remove the iframe path

Delete the iframe code path, the flag, and the `getPreviewDocument` abstraction (collapse to direct shadow-root access).

Files: cleanup pass across ScreenCard.tsx + hooks. Parity harness still runs against the (now-only) shadow path to detect future regressions in templates.

### Phase 6 (separate, optional) — Migrate export to shadow DOM

This eliminates the live/export asymmetry. Significant work because export depends on iframe dimensions, hidden offscreen positioning, and modern-screenshot's expectations about its capture target. Defer until shadow-DOM live preview has been stable for 2-4 weeks. Treated as a separate doc/plan when picked up.

## Testing per phase

Beyond the parity harness:

- **Phase 0**: harness itself is the test. Fixtures committed.
- **Phase 1**: parity harness re-runs and passes after font registry change. Plus a manual smoke checking all 5 platform fonts render in the preview.
- **Phase 2**: parity harness re-runs and passes after each template rewrite. Visual regression for the loupe specifically (uses fixed positioning today) should get an extra-careful look.
- **Phase 3**: parity harness runs against BOTH backends (flag on and flag off) on every commit. Unit tests for `getPreviewDocument` abstraction.
- **Phase 4**: real-world dogfood for 3-5 days before phase 5. Look for issues that escape the harness: editor performance, drag responsiveness, focus behavior, font fallback.
- **Phase 5**: parity harness against the single (shadow) path. Removal of unused iframe-specific code paths and types.

Tests that need to land alongside the work but aren't strictly per-phase:

- **Memory benchmark**: total decoded bitmap memory of a 6-card project measured via `performance.measureUserAgentSpecificMemory()` (Safari 16.4+, behind a flag) or estimated from image dimensions. Should drop significantly after phase 4. Captured as a number in the PR description.
- **Tab-background regression**: a Playwright test that emulates tab-hide / tab-visible and asserts no visible flash. Hard to automate the visual flash detection; may settle for "no full re-render fires after visibility change" via render-counter instrumentation.

## Relevant files for the implementation session

Live editing path (the migration's primary target):

- `packages/web-preview/src/client/components/Preview/ScreenCard.tsx` — current iframe lifecycle, where the swap happens.
- `packages/web-preview/src/client/hooks/useDragPosition.ts` — reads `iframe.contentDocument` heavily; needs the abstraction.
- `packages/web-preview/src/client/hooks/useInstantPatch.ts` — same.
- `packages/web-preview/src/client/utils/iframeRegistry.ts` — registry abstraction would expand to shadow roots too, or get replaced.
- `packages/web-preview/src/client/components/Preview/PanoramicPreview.tsx` — one iframe, but same migration shape; do at the same time.

Template rules to audit:

- `packages/core/templates/**/*.html` — all of them. Use the audit grep from "Risk areas".

What stays on iframe (do NOT touch in this plan):

- `packages/web-preview/src/client/utils/clientExport.ts` — export pipeline. Phase 6 territory.
- The whole server-side render endpoint (`/api/preview-html`, `/api/panoramic-preview-html`). Same HTML is consumed by both paths; only the client mount point changes.

Parity infrastructure (all new):

- `packages/web-preview/test/parity/` — harness, fixtures, diff utility.

## Out of scope

- **Export pipeline migration.** See phase 6. Separate plan when picked up.
- **Removing the server-side template engine.** Even with shadow DOM, the same Nunjucks-rendered HTML is what gets injected. Moving rendering client-side (e.g., React for screen markup) is a different conversation.
- **Streaming / partial updates.** Today every edit re-renders the whole HTML for that card. A shadow-DOM future could do React-style diffing instead. Not part of this plan; would be a separate phase 7+.
- **Cross-browser fallback for shadow DOM.** Safari 16+ has full support including `delegatesFocus`, `slot`, etc. If the user base hits a pre-16 Safari, plan would need a polyfill or feature gate; flag the requirement at session-start but do not implement here.
- **The "snapshot overlay" in option A.** That can stay as a defense-in-depth even after C ships — costs nothing, helps in the edge case where Safari purges something we didn't anticipate. Re-evaluate after phase 5 stability.

## Effort estimate

Rough order-of-magnitude, assuming a focused Claude Code session and no scope creep:

- Phase 0: 1 day (parity harness + 8-12 fixtures + CI wiring)
- Phase 1: 0.5 day (font registry, narrow change)
- Phase 2: 0.5-1 day (template audit + rewrites, depends on grep hit count)
- Phase 3: 1-2 days (ShadowScreen + hook abstraction + dual-mode wiring)
- Phase 4: passive (dogfood time)
- Phase 5: 0.5 day (cleanup)
- Total active work: ~3-5 focused days

If parity tests reveal more rendering differences than expected (phase 2 + 3), add 1-2 days to chase them down. The biggest unknown is "are there any third-party CSS-in-iframe behaviors we didn't anticipate" — the harness exists exactly to surface those.
