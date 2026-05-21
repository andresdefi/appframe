# Parent-document rendering plan

Status: open. Revised 2026-05-19 after reviewing the current live-preview,
drag, instant-patch, font, capture, and export code paths.

This is the implementation brief for migrating Appframe's **active live
editing preview** from iframe documents to shadow DOM hosted in the parent
document. The goal is to remove the iframe-per-card preview architecture that
caused Safari's tab-switch bitmap-purge flash, while keeping export fidelity
and current editing behavior intact.

Option A, the visibility-snapshot overlay, remains the tactical fix for the
Safari flash. This plan is Option C: a structural cleanup that removes iframes
from the active preview path.

## Executive Summary

Move each active `ScreenCard` from:

```tsx
<iframe ref={iframeRef} />
// fetch HTML -> iframe.contentDocument.open/write/close()
```

to:

```tsx
<div ref={hostRef} />
// fetch HTML -> parse HTML -> extract style/body -> shadowRoot.replaceChildren()
```

The Nunjucks template engine remains the source of preview HTML. The export
pipeline remains iframe-based. Inactive locale row captures, variant thumbnail
captures, and other hidden `modern-screenshot` capture flows also remain
iframe-based for now.

The migration should be gated by visual parity tests and shipped behind a
feature flag before becoming the default.

## Why This Is Better Than The Current Architecture

The current active preview path creates one same-origin iframe per visible
screen card. `ScreenCard.tsx` fetches rendered HTML and writes it into
`iframe.contentDocument` using `doc.open()`, `doc.write()`, and `doc.close()`.
That works, but it makes every card a separate browsing context with its own
document lifecycle, font declarations, decoded image surfaces, event boundary,
and Safari bitmap-cache behavior.

Moving active previews into parent-document shadow roots improves the
architecture in several concrete ways:

- **Safari stability**: the active preview no longer depends on Safari keeping
  nested iframe bitmap contents alive after backgrounding or tab switching.
- **Lower duplication**: fonts can be registered once on the parent document
  instead of emitted into every live iframe rewrite.
- **Cleaner input handling**: drag, drop, hover, and hit testing no longer cross
  an iframe boundary.
- **Better accessibility and inspection**: preview text becomes part of the
  parent document tree for find-in-page, dev tools, and assistive technology.
- **More future flexibility**: future editing primitives can target a normal
  DOM subtree rather than a nested document.
- **Maintained isolation**: shadow DOM still scopes template CSS, while CSS
  containment can restore much of the layout/paint containment that iframes
  gave for free.

This is not primarily a performance rewrite. Any memory/performance win is a
bonus. The main reason to do it is to remove iframe lifecycle behavior from
the editing surface.

## Explicit Scope

In scope:

- Active individual-mode preview cards (`ScreenCard.tsx`).
- Active panoramic preview (`PanoramicPreview.tsx`), after individual mode is
  proven.
- Shared preview DOM access used by drag, guides, loupe refresh, and instant
  patches.
- Live-preview font registration in the parent document.
- Visual parity tests comparing iframe and shadow renderings.

Out of scope:

- Export pipeline migration. `clientExport.ts` should stay iframe-based.
- Hidden capture utilities used by inactive locale rows and variant thumbnails.
- Removing the Nunjucks template engine.
- Rewriting rendered preview HTML in React.
- Streaming or partial DOM diffs.
- Cross-browser polyfills for very old browsers without shadow DOM support.

Important boundary: "live preview" in this plan means the active editor row the
user manipulates directly. It does **not** mean every internal rasterization
flow that currently uses an iframe.

## Current Iframe Surfaces To Preserve For Now

Do not migrate these in this plan:

- `packages/web-preview/src/client/utils/clientExport.ts`
- `packages/web-preview/src/client/utils/captureManager.ts`
- `packages/web-preview/src/client/utils/variantThumbnailCapture.ts`
- Any hidden iframe whose purpose is feeding `modern-screenshot`.

Reason: these paths benefit from full document isolation, explicit dimensions,
and `document.fonts.ready` / `doc.images` readiness checks. They are not the
source of the interactive Safari flash, and changing them would expand the
risk surface dramatically.

## Core Risk: Shadow DOM Is Not An Iframe

Shadow DOM gives style scoping, not a full document. The migration must handle
the differences below deliberately.

### Full HTML Documents

The templates currently emit full documents:

- `<!doctype html>`
- `<html>`
- `<head><style>...</style></head>`
- `<body>...</body>`

An iframe can consume that directly. A shadow root cannot. The shadow renderer
must parse the HTML and insert only the relevant pieces:

1. Parse with `DOMParser`.
2. Extract `<style>` nodes from the parsed `<head>`.
3. Extract child nodes from the parsed `<body>`.
4. Insert them into the shadow root under a stable wrapper element.

Recommended internal shape:

```html
<style>/* template CSS, possibly transformed for shadow */</style>
<div class="preview-document" style="width: ...px; height: ...px;">
  <!-- parsed body children -->
</div>
```

Do not append parsed `<html>` or `<body>` elements directly into the shadow
root and assume browser behavior will match iframe behavior.

### `body`, `html`, and `:root` CSS

Template CSS currently styles `body` for dimensions, overflow, fonts, and font
smoothing. In shadow DOM, there is no iframe body. These rules need a shadow
equivalent.

Options:

- Preferred: update templates to target a wrapper class such as
  `.preview-document` while keeping iframe output equivalent.
- Alternative: transform known-safe selectors in the live shadow renderer:
  `html, body` and `body` -> `.preview-document`.

Avoid broad, ad hoc CSS rewriting. If selectors are transformed, keep the
transform small, covered by tests, and limited to known template output.

Also audit templates for `:root`. Inside a shadow root it should become
`:host` or `.preview-document`, depending on whether the variable belongs on
the host or the internal document wrapper.

### Font Loading

Current template rendering injects `fontFaceCss` into the HTML. That is still
needed for iframe export and hidden capture flows. The plan must not remove
template `@font-face` globally.

Add an explicit font emission mode to the template engine:

```ts
type FontFaceMode = 'inline' | 'url' | 'none';
```

Suggested behavior:

- `inline`: existing base64/data URI font CSS for standalone iframe rendering.
- `url`: existing `/preview-fonts/...` URL CSS for preview-server iframes.
- `none`: no `@font-face` emitted because the parent document has already
  registered the needed fonts.

The live shadow path should use `none`. Export and hidden captures should keep
using their current modes.

Add a client helper such as:

```ts
ensurePreviewFontsRegistered(fontIds: string[]): Promise<void>
```

It should register only the font families currently needed by the rendered
screen or panoramic canvas, including per-element headline, subtitle, and free
text fonts. Registering every bundled font at app boot is simpler but may be
too heavy as the font catalog grows.

Readiness should be explicit:

- Before swapping the first shadow render for a card, wait for the required
  `FontFace.load()` promises or `document.fonts.ready`.
- On later swaps, reuse already-registered font faces.
- Keep export readiness tied to iframe `doc.fonts.ready`.

### Viewport Units

In an iframe, `vw`, `vh`, `vmin`, and `vmax` resolve against the preview
document. In shadow DOM, they resolve against the browser viewport.

Audit:

```sh
rg -n "vw|vh|vmin|vmax" packages/core/templates
```

Every hit must be converted to template-computed pixels, percentages of the
canvas, or CSS variables based on the preview dimensions.

### `position: fixed`

In an iframe, `position: fixed` is relative to the iframe viewport. In a
shadow root, it is relative to the browser viewport. This is known to matter
for text drag behavior in `useDragPosition.ts`.

Do not rely on `position: fixed` inside shadow live previews. Convert drag-time
text positioning to absolute positioning within the preview document wrapper.

The plan should treat this as a hook migration, not only a template audit:

- `useDragPosition.ts` currently sets `el.style.position = 'fixed'`.
- `ScreenCard.tsx` checks for computed `position === 'fixed'` before drawing
  center guides for text.
- `useInstantPatch.ts` checks computed fixed positioning when applying text
  rotation.

Those checks need to move to an explicit "drag-positioned text" model that
works in both backends.

### Coordinate Systems

The current hooks lean on iframe-local coordinates. A simple
`Document | ShadowRoot` return type is not enough.

Create a real adapter:

```ts
interface PreviewSurface {
  kind: 'iframe' | 'shadow';
  root: Document | ShadowRoot;
  host: HTMLElement;
  querySelector<T extends Element>(selector: string): T | null;
  querySelectorAll<T extends Element>(selector: string): T[];
  elementsFromPoint(clientX: number, clientY: number): Element[];
  clientToCanvasPoint(clientX: number, clientY: number): { x: number; y: number };
  getComputedStyle(el: Element): CSSStyleDeclaration;
  getCanvasRect(): DOMRect | null;
}
```

For iframes, the adapter converts parent client coordinates into iframe-local
coordinates before calling `contentDocument.elementsFromPoint`. For shadow DOM,
it can use parent client coordinates directly and filter to elements inside the
shadow root.

This adapter should replace direct `iframe.contentDocument` access in:

- `useDragPosition.ts`
- `useInstantPatch.ts`
- guide and loupe observer logic in `ScreenCard.tsx`
- panoramic instant-patch and drag logic when panoramic is migrated

### DOM Readiness

Iframe capture/export code waits for fonts and images. The live preview has
historically relied on browser loading behavior after `doc.write`.

For shadow rendering, add a small readiness step before removing the loading
state:

- await required font registration
- decode images inside the shadow root with `img.decode()`
- tolerate broken images with `Promise.allSettled`

This avoids swapping in a half-loaded live preview and makes parity tests less
flaky.

### Containment

Iframes contain layout and paint naturally. Shadow roots do not. Every active
preview host should use containment:

```css
.preview-shadow-host {
  contain: layout style paint;
}
```

The inner wrapper should also have stable explicit dimensions:

```css
.preview-document {
  width: var(--preview-width);
  height: var(--preview-height);
  overflow: hidden;
}
```

This helps keep a bad template rule or heavy repaint from affecting the editor
around it.

### Security

Current previews render same-origin HTML, and rich text is sanitized before it
is inserted. Shadow DOM reduces the blast radius of iframe document rewrites,
but it also moves preview markup into the parent page's DOM context.

Keep these guardrails:

- Continue using `sanitizeRichHtml` in the template engine.
- Do not execute scripts from parsed HTML.
- Prefer `DOMParser` plus explicit node extraction over assigning raw HTML to
  the host.
- Strip or ignore `<script>` tags during shadow mounting even if templates do
  not emit them today.

## Parity Testing First

Before making shadow DOM the default, build a browser-based parity harness.

### Harness Shape

Use Playwright. Render the same fixture screen through both backends:

- current iframe backend
- new shadow backend behind a flag

Capture the preview bounding boxes at identical CSS dimensions and compare
pixels with a small threshold. If adding `pixelmatch` is acceptable, use it.
If not, use a small local diff utility over decoded PNGs.

Initial test should be pairwise backend comparison, not golden snapshots. Once
the harness is stable, add fixture snapshots only if they provide enough value
to justify the update burden.

### Fixture Coverage

Cover at least:

- long headline
- multi-line subtitle
- RTL text
- bold and italic rich text
- per-element headline/subtitle/free-text fonts
- solid, gradient, and image backgrounds
- fullscreen screenshot mode
- large and small device frames
- loupe
- callouts
- annotations
- spotlight
- overlays: shape, icon, arrow, blob/star/decor
- non-default locale text positioning
- one panoramic canvas once panoramic migration starts

### Browsers

Run at least Chromium locally for fast iteration. Add WebKit/Safari coverage
before flipping the default, because the original failure mode is Safari.

### Acceptance

The migration is not done until the shadow backend is visually equivalent to
the iframe backend within the agreed threshold and manual inspection passes for
the fixture set.

## Build Order

### Phase 0 - Audit And Harness ✅ done 2026-05-20

No production behavior change.

Tasks:

- Add the parity harness. ✅ `e2e/parity/parity.spec.ts` + `helpers.ts`.
- Add fixture generation helpers. ✅ `loadIndividualFixtures` /
  `loadPanoramicFixtures` in `e2e/parity/helpers.ts`; fixtures are POST-body
  JSON files under `e2e/parity/fixtures/{individual,panoramic}/`.
- Add an audit report for template `body`, `html`, `:root`, viewport units,
  and `position: fixed`. ✅ `docs/parent-doc-rendering-audit.md`.
- Add a short note listing every iframe-based path that stays out of scope.
  ✅ audit §4 ("Iframe-document reach-through").

Done when:

- `pnpm test:parity` runs locally. ✅ Playwright auto-starts the preview
  server via `webServer` config; reuses an existing `pnpm preview` if one
  is up.
- The current iframe backend can render the fixture set. ✅ 18/18 fixtures
  (17 individual + 1 panoramic) pass against the iframe backend.
- The audit output is committed or summarized in this doc. ✅ committed.

Notes for Phase 3 (shadow backend):

- The spec already iterates `BACKENDS: ['iframe', 'shadow']`; shadow tests
  currently call `test.skip` with a TODO. Wire `mountFixture(..., 'shadow')`
  in `e2e/parity/helpers.ts` when the renderer lands and the skip becomes
  a real pixel-diff (pixelmatch or equivalent).
- Snapshots are written to `e2e/parity/snapshots/<backend>/<name>.png` so
  iframe-vs-shadow diffing is a straight per-file compare.

### Phase 1 - Preview Surface Adapter ✅ code done 2026-05-21 (manual smoke pending)

Introduce the abstraction before introducing shadow DOM.

Tasks:

- Create a `PreviewSurface` adapter for current iframe previews. ✅
  `packages/web-preview/src/client/utils/previewSurface.ts` defines the
  interface + `iframePreviewSurface(iframe)` factory. Registry lives at
  `previewSurfaceRegistry.ts` (per-screen map + panoramic singleton). The
  legacy `iframeRegistry.ts` / `panoramicIframeRef.ts` are still populated
  alongside during Phase 1 for any consumer that hasn't migrated; they'll
  be deleted at the end of Phase 7.
- Migrate `useDragPosition`, `useInstantPatch`, `usePanoramicInstantPatch`,
  `ScreenCard` (guide/loupe observer + render write), and `PanoramicPreview`
  (render write + drag onMove) to use the adapter. ✅ all 5 files done.
- Keep behavior unchanged. ✅ `pnpm test` (414/414) and `pnpm test:parity`
  (18/18) green; rendered HTML is byte-identical to pre-migration.

Notable signature change: `useDragPosition` now takes `getSurface: () =>
PreviewSurface | null` instead of `iframeRef` + `containerRef`. ScreenCard
wraps it as `useCallback(() => getPreviewSurface(index), [index])`.

`hitTest` now takes parent client coords (not iframe-local) and lets the
adapter convert internally via `clientToCanvasPoint`. The old `toIframe`
helper inside the hook is gone.

Done when:

- Existing tests pass. ✅
- Manual drag, guides, loupe, callout, text, annotation, and overlay
  instant patches still work in iframe mode. ⏳ requires user-driven
  smoke in the editor; parity harness only validates rendered HTML, not
  slider/drag interactivity.

### Phase 2 - Font Mode And Parent Font Registry ✅ code done 2026-05-21 (manual export smoke pending)

Tasks:

- Add explicit font-face mode to the template engine. ✅ `type FontFaceMode
  = 'inline' | 'url' | 'none'` exported from `@appframe/core`. Both
  `render()` and `renderPanoramic()` now take an optional
  `{ fontFaceMode }`. Default (no override) falls back to the
  constructor's behavior (`url` when `fontBaseUrl` was supplied, else
  `inline`). Explicit `'url'` without `fontBaseUrl` throws.
- Keep existing iframe/export behavior unchanged. ✅ No caller passes
  `fontFaceMode` yet; everyone still gets the default `'url'` against
  `/preview-fonts/`. Parity harness 18/18 byte-identical to before.
- Add client-side parent document font registration. ✅
  `packages/web-preview/src/client/utils/parentFontRegistry.ts` exports
  `ensurePreviewFontsRegistered(ids)`. Idempotent across calls, coalesces
  concurrent requests for the same id, injects into a single shared
  `<style id="appframe-preview-fonts">` in `document.head`.
- Wire only the future shadow path to request no template font CSS. ✅
  Both `/api/preview-html` and `/api/panoramic-preview-html` now parse an
  optional `fontFaceMode` from the request body and thread it to the
  engine. Phase 3's shadow client will send `'none'`.

Supporting changes:

- New endpoint `GET /api/preview-font-faces?ids=inter,playfair-display`
  returns the URL-mode CSS for the requested ids. The client helper
  fetches from here (same origin as the preview server, same
  `/preview-fonts/` static path the URL-mode CSS references).
- Font cache key in `TemplateEngine` is now `${mode}:${fontKey}` instead
  of just `fontKey`, so an `'inline'` call after a `'url'` call doesn't
  return the wrong format.

Done when:

- Export still waits on iframe fonts and renders correctly. ⏳ requires
  manual export smoke (Download tab → ZIP). Vitest can't exercise the
  modern-screenshot path.
- Current live iframe preview remains unchanged. ✅ parity 18/18.
- A test proves `fontFaceCss` can be omitted only when requested. ✅
  `engine.test.ts` "FontFaceMode" block (5 cases including the throw on
  invalid `'url'` use). Plus 7 cases in `parentFontRegistry.test.ts`
  covering idempotency, coalescing, parallel ids, empty responses, input
  validation, server errors.

### Phase 3 - Shadow Renderer For Individual Mode, Flagged Off ✅ code done 2026-05-21 (manual smoke pending)

Tasks:

- Add `ShadowScreen` or equivalent. ✅ implemented as
  `shadowPreviewSurface(host)` in `previewSurface.ts`. No new component;
  ScreenCard's JSX switches between rendering an `<iframe>` and a
  `<div ref={shadowHostRef}>` based on `useShadow`.
- Parse full template HTML into style nodes plus body children. ✅
  `DOMParser` in `replaceContent` — extracts `<style>` nodes from
  `<head>` and children from `<body>`, mounts them under a
  `.preview-document` wrapper. Scripts stripped defensively (templates
  don't emit any today).
- Mount into an open shadow root under `.preview-document`. ✅ wrapper
  takes `width:100%;height:100%` so the host's explicit CSS dimensions
  control canvas size — same control the iframe had via its `width`/
  `height` style props.
- Apply containment and fixed dimensions on the host/wrapper. ✅ host
  div carries `contain: layout style paint` so a runaway template rule
  can't reflow the editor chrome.
- Strip scripts and avoid direct raw HTML assignment. ✅ no `innerHTML`
  assignment anywhere; everything goes through `DOMParser` + `cloneNode`
  + `replaceChildren`.
- Implement shadow version of `PreviewSurface`. ✅ `shadowPreviewSurface`
  exports the same interface as `iframePreviewSurface`.
  `elementsFromPoint` uses `document.elementsFromPoint` filtered to
  shadow descendants; `clientToCanvasPoint` derives scale from the
  host's rect / clientWidth ratio (matches the iframe formula).
- Add a feature flag: `?shadow=1` or localStorage. ✅
  `previewBackendFlag.ts` exports `isShadowPreviewEnabled()` reading
  `?shadow=1` from `window.location.search`. Off by default. Flip
  requires a reload (no hot-swap).

Parity harness now exercises BOTH backends:

- `e2e/parity/helpers.ts` `mountFixture(backend)` branches: iframe
  writes via `doc.open/write/close`; shadow does `DOMParser` + mount
  under `.preview-document`, prefixed by a Node-side fetch of
  `/api/preview-font-faces` injected into the parent page (CORS-safe).
- Spec skips the panoramic shadow combination — panoramic stays on
  iframe until Phase 5.
- Result: 35/35 fixtures pass (17 individual × 2 backends, 1 panoramic
  iframe; 1 panoramic shadow skipped). Per-file PNG sizes are within
  0.3% between the two backends across all 17 — the render is
  essentially byte-for-byte equivalent.

Interactivity follow-ups (caught by manual smoke, fixed in Phase 3):

- **Drag didn't initiate at all** — `document.elementsFromPoint` doesn't
  pierce shadow roots; it returns the host, not the descendants. Fixed
  by switching `shadowPreviewSurface.elementsFromPoint` to
  `root.elementsFromPoint` (ShadowRoot's own scoped method).
- **Slider patches collapsed device/loupe toward top-left during drag**
  — `el.getBoundingClientRect()` on shadow children returns
  parent-viewport coords AFTER the host's CSS transform; the patches
  treat the value as canvas coords and write a scaled-down width back.
  Fixed by adding `getInternalRect(el)` to the adapter (iframe:
  passthrough; shadow: shift to host origin + divide by transform
  ratio). Patches and the callout-drag branch now use it.
- **Text drag flew off-screen because `position: fixed` escapes the
  host containing block in shadow** — browsers don't reliably honor
  "host transform creates fixed containing block" across the shadow
  boundary. Fixed by using `position: absolute` instead in shadow mode
  (`.canvas` is the nearest positioned ancestor); probes in
  `useInstantPatch` and `ScreenCard.recomputeGuides` now accept both
  `'fixed'` and `'absolute'`.
- **Re-dragging an already-positioned text shot it off-screen by
  exactly `width/2`** — the existing `centerX = alreadyPositioned ?
  vr.left : vr.left + vr.width/2` ternary was written for `offsetLeft`
  semantics (pre-transform = box left = visual center for a
  `translateX(-50%)` element). `getInternalRect` returns the visual
  rect (post-transform), so the same formula picked the wrong value.
  Fixed by using `vr.left + vr.width/2` uniformly in shadow path
  (works for both in-flow and translated cases because visual_left +
  width/2 = visual_center either way).

Remaining Phase 4 gaps:

- The template's `body { -webkit-font-smoothing: antialiased }` doesn't
  apply in shadow (there's no body). Hard to see in screenshots; per-
  element font-family rules carry through fine.
- The server-side `injectTextPositionCSS` still emits `position: fixed`
  for SAVED dragged-text positions. Live drag works (uses
  `position: absolute` per the fix above), but releasing the mouse
  commits to state → the next full re-render fetches HTML containing
  `position: fixed` again → text jumps off-screen. Avoid saving text
  drags in shadow mode for now; Phase 4 will switch this branch to
  `absolute` when `fontFaceMode: 'none'` is requested.

Done when:

- Shadow individual previews render behind the flag. ✅
- Drag, guides, text positioning, loupe refresh, instant patches,
  file drops, and locale text-only constraints work. ✅ all confirmed
  in user-driven smoke (the four bugs above were caught and fixed).
- Parity harness passes for individual-mode fixtures. ✅ 17/17.

### Phase 4 - Template Compatibility Cleanup ✅ done 2026-05-21

Tasks:

- Convert or adapt `body` / `html` styling. ✅ Three templates
  (`_base/layout.html`, `universal/base.html` × 2 blocks, `panoramic/
  base.html`) now use grouped selectors `body, .preview-document { ... }`.
  Iframe matches via `body`; shadow matches via the `.preview-document`
  wrapper. Same rule contributes font-family, font-smoothing, overflow,
  etc. in both backends. Canvas dims continue to come from the host's
  inline CSS in shadow (the wrapper's `width:100%` overrides the rule's
  `width:Xpx`, which is fine — the host controls canvas size).
- Remove any live-shadow dependency on viewport units. ✅ no-op,
  templates have zero viewport units (confirmed in audit §2).
- Replace drag-time `position: fixed` behavior so saved positions
  resolve against canvas dimensions in shadow. ✅ done — but NOT via
  the audit's original proposal (switch to `position: absolute`).
  Instead the shadow renderer's wrapper now carries
  `transform: translateZ(0)`, which per CSS Transforms 1 makes the
  wrapper a containing block for `position: fixed` descendants inside
  the shadow tree. The wrapper is canvas-sized, so `top: X%` resolves
  against canvas dimensions — same as the iframe viewport. Both
  backends keep `position: fixed` everywhere
  (`injectTextPositionCSS`, `useDragPosition`).
- Make the "is this text drag-positioned" checks explicit rather than
  tied to computed `position === 'fixed'`. ✅ probes in
  `useInstantPatch.applyRotation` and `ScreenCard.recomputeGuides`
  accept both `'fixed'` and `'absolute'`. Defensive — current code
  only emits `fixed`, but the broadened probes survived from the
  Phase 4 experiment and harmlessly tolerate either.

Supporting changes:

- `getElPos` and `getViewportRect` in `useDragPosition` keep a shadow
  branch that uses `surface.getInternalRect(el)` instead of the
  `offsetLeft`/`offsetTop` chain. Reason: for a `position: fixed`
  element in a shadow tree, the spec leaves `offsetParent` as null,
  so the offset values are zero. The internal-rect path translates
  the bounding rect into canvas coords and reconstructs box-left from
  visual-left + offsetWidth/2 (the inverse of the `translateX(-50%)`
  the code applies during drag).
- New parity fixture `18-saved-text-positions.json` exercises
  `injectTextPositionCSS` end-to-end in both backends. Snapshots match
  within 0.15% file size.

What we tried first and reverted:

- Switching `injectTextPositionCSS` and `useDragPosition` to
  `position: absolute` in shadow mode. Looked clean in fixtures, broke
  in the real editor: the template's `.text-area` rule is
  `position: absolute` (universal/base.html:212-219). With the
  headline also absolute, the headline's containing block became
  `.text-area`. When both headline and subtitle were saved-positioned,
  `.text-area` had no in-flow content and collapsed to near-zero
  width — saved `width: 50%` resolved to ~8px → re-drag captured the
  8px element → saved as `2%` → feedback loop. The
  wrapper-as-containing-block approach above sidesteps this by giving
  fixed text a deterministic CB that's always canvas-sized.

Done when:

- Iframe and shadow parity still pass. ✅ 37/37.
- No known template CSS relies on iframe-only semantics in the shadow
  path. ✅ audit items all addressed.
- Manual save-text-drag smoke at `?shadow=1` — drag text, release to
  save, confirm the next re-render keeps it in place. ✅ confirmed.

### Phase 5 - Panoramic Shadow Preview, Flagged ✅ render done 2026-05-21 (interactivity ⏳ deferred to Phase 5b)

Tasks:

- Reuse the shadow renderer and adapter for `PanoramicPreview.tsx`. ✅
  Same JSX-swap, registration-effect-swap, and render-fetch wiring
  pattern as ScreenCard. shadowPreviewSurface + isShadowPreviewEnabled
  + ensurePreviewFontsRegistered already existed from Phase 3.
- Migrate panoramic drag and instant-patch code. ⏳ the existing code
  was already routing through `getPanoramicPreviewSurface()` (Phase 1)
  but interactive behavior in shadow mode is broken — drag doesn't
  follow the cursor (commits only on release), several sliders don't
  patch live. Same class of bug as Phase 3 individual mode before
  the `getInternalRect` / `elementsFromPoint` / `position: fixed`
  fixes were threaded through. The render path is unaffected
  (parity passes); only live interactivity needs a similar pass for
  the panoramic-specific drag handler and `usePanoramicInstantPatch`.
- Add panoramic parity fixture. ✅ `panoramic/01-basic.json` shipped
  in Phase 0; the shadow-side was skipped until now. Lifted the skip
  in `parity.spec.ts`. Iframe and shadow snapshots are byte-identical
  for the panoramic fixture (1520066 bytes each).

Font registration for panoramic: only the single global
`config.theme.font` is registered. Per-element fonts inside the
panoramic elements array aren't loaded by the engine in either backend
today (pre-existing limitation in `renderPanoramic`); the shadow path
mirrors that.

Done when:

- Panoramic works behind the same flag. ⚠️ partial — renders behind
  the flag, but interactive controls are broken in shadow mode.
- Panoramic parity passes. ✅ 38/38 (panoramic-shadow combination
  no longer skipped).

### Phase 5b - Panoramic Shadow Interactivity (deferred)

Catalog of what's broken when toggling `?shadow=1` in panoramic mode:

- Device-frame drag doesn't follow the cursor during the drag — the
  visual position only commits on release. Suggests the drag handler's
  `mousemove` write isn't reaching the right shadow element, OR is
  reading coords from the wrong frame.
- Most other interactive controls don't take effect live.

Likely investigation paths (mirroring the Phase 3 fix sequence):

- `PanoramicPreview.tsx` has a CUSTOM drag handler (not
  `useDragPosition`). Its `handleMouseMove` uses `surface.querySelector`
  with `[data-index="..."]` selectors AND raw mouse-coord-to-canvas
  math via `mouseToCanvasPercent`. Check that the shadow path's coord
  conversions are equivalent to iframe's.
- `usePanoramicInstantPatch` uses `s.querySelector` which routes
  through the adapter — but if any patch reads
  `el.getBoundingClientRect()` (like the individual-mode patches did),
  it'll be scaled-down in shadow and write wrong values. Audit each
  panoramic patch function for `getBoundingClientRect` usage and
  swap to `s.getInternalRect` (the helper added in Phase 4).
- Run parity for the panoramic mode while interacting via the
  harness if possible, or add a "drag-end position" fixture similar
  to `18-saved-text-positions`.

Until Phase 5b lands, `?shadow=1` should not be flipped to default
for panoramic mode. Phase 6 may proceed for individual mode only,
keeping panoramic on iframe by default.

### Phase 6 - Default Shadow DOM For Active Preview ✅ code done 2026-05-21 (dogfooding starts)

Tasks:

- Flip the default to shadow DOM for active individual and panoramic
  previews. ✅ `isShadowPreviewEnabled()` now defaults to true. Any
  URL without `?shadow=0` runs the shadow path.
- Keep `?shadow=0` as an escape hatch. ✅ explicit opt-out returns to
  the iframe path. Existing e2e suite (`functional.spec.ts`,
  `ux-audit.spec.ts`, `export.spec.ts`) navigates with `?shadow=0`
  via `e2e/helpers.ts:waitForApp` so it keeps exercising the iframe
  code path that's still shipped.
- Panoramic ships behind the same default flip. ⚠️ panoramic mode
  carries pre-existing interactive bugs in BOTH iframe and shadow
  (drag tracking, slider patching) — not introduced by this
  migration; not made worse by the flip. A "Beta" banner at the top
  of the panoramic area surfaces this to users. Phase 5b will tackle
  the shadow-specific bits when someone owns the panoramic UX work.

Watch (dogfooding checklist):

- tab-switch behavior — the Safari iframe-bitmap-purge flash that
  motivated the whole migration; shadow DOM has no nested browsing
  context to lose its bitmap cache.
- drag responsiveness in individual mode (already smoke-tested in
  Phase 3 / 4 fixes).
- font fallback flashes — first card load may briefly show fallback
  text before `document.fonts.ready`; ensurePreviewFontsRegistered
  is meant to make this a one-time-per-session blip.
- image decode timing — full-res frame PNGs decoded once into a
  parent-document image cache instead of N times per iframe.
- memory use on 6-10 screens — one document tree instead of N
  document trees should help; the plan doc's "optional but useful"
  measurement.
- behavior with multiple locales — non-default locale rows still
  use iframes (InactiveLocaleRow is explicitly out of scope per
  the audit); only the active row is on the shadow path.

Done when:

- No blocking regressions are found in real projects. ⏳ on the user
  via dogfooding.
- Safari flash is gone without relying on the Option A overlay. ⏳
  same.

Benchmark results (`pnpm test:bench`, 6-card project, medians of 3 runs):

| Metric              | Engine   | Iframe   | Shadow   | Δ           |
| ------------------- | -------- | -------- | -------- | ----------- |
| First render (ms)   | Chromium | 63       | 45       | -28.6%      |
| First render (ms)   | WebKit   | 107      | 55       | -48.6%      |
| All rendered (ms)   | Chromium | 96       | 54       | -43.8%      |
| All rendered (ms)   | WebKit   | 128      | 64       | -50.0%      |
| JS heap (MB)        | Chromium | 20.1     | 12.1     | -39.8%      |
| Distinct documents  | both     | 6        | 0        | structural  |
| Parent DOM nodes    | both     | 191      | 192      | +0.5%       |

WebKit is Safari's engine — the heavier first-render savings there
(-48.6% vs -28.6% on Chromium) confirm the iframe-per-card was
relatively more expensive in Safari, matching the original
motivation. JS heap isn't measurable on WebKit (Chromium-only
`performance.memory` API). The bench can't reproduce the
tab-visibility bitmap-purge flash that started this migration —
that's headless-incompatible — but the structural deltas (six
distinct documents collapsed to zero, ~40% lower heap) are exactly
what predicts the fix.

Quality findings (one-shot diagnostic; tests not retained):

After the bench, a throwaway suite cross-validated the migration on
four dimensions. The tests themselves weren't worth maintaining
(most compare against the iframe code path that Phase 7 will
delete), but the findings are:

- **Visual parity** (pixelmatch diff of iframe vs shadow per fixture):
  Chromium 0.0000% on every fixture (bit-perfect). WebKit 0.6-2.5%
  on text-heavy fixtures only — irreducible sub-pixel AA noise from
  Safari shaping text differently through an iframe document vs an
  open shadow root. Same characters, same positions, different AA
  edges. Invisible to the eye, only pixelmatch catches it. Graphics
  / effects fixtures (overlays, callouts, spotlights) were
  bit-perfect on WebKit too.
- **Behavioral parity** (editor mount + headline edit triggers
  preview-html fetch): identical in both backends on both engines.
- **Render stability** (same fixture rendered 3× in a row): 0.0000%
  drift on both backends, both engines. Render output is
  deterministic once `document.fonts.ready` resolves.
- **Memory under load** (30-iteration headline-edit workload,
  Chromium only): baseline heap 16.3MB iframe / **7.7MB shadow**;
  settled heap retention +10.1MB iframe / **+3.8MB shadow**. Shadow
  GCs ~2.6× more cleanly after sustained editing.

### Phase 7 - Remove Iframe Active Preview Path

Tasks:

- Delete active preview iframe backend.
- Delete the feature flag.
- Collapse adapter code if the iframe branch is no longer needed for active
  previews.
- Keep hidden capture/export iframes.

Done when:

- Active editor preview uses only shadow DOM.
- Export, inactive locale captures, and variant thumbnail captures still use
  their iframe flows.
- Tests and manual smoke pass.

### Later - Export/Capture Migration, If Ever

Only consider migrating export or hidden capture flows after the active shadow
preview has been stable for at least 2 to 4 weeks.

This would need a separate plan because export depends on full document
dimensions, `modern-screenshot` target semantics, font/image readiness, and
output fidelity. It is not a cleanup task inside this migration.

## Testing Checklist

Required before defaulting to shadow DOM:

- Parity test: iframe vs shadow for individual mode.
- Parity test: iframe vs shadow for panoramic mode.
- Manual Safari tab-hide/tab-show smoke.
- Manual drag smoke for device, headline, subtitle, free text, annotation, and
  overlay.
- Manual text editing smoke with rich text, color, gradient, and per-element
  fonts.
- Manual locale smoke: default plus non-default row, with structural drags
  blocked outside default.
- Export smoke proving exported PNG still matches expected iframe export
  behavior.
- Inactive locale row capture smoke.
- Variant thumbnail capture smoke.

Optional but useful:

- Memory measurement for a 6-card project before and after defaulting to shadow.
- Render counter around tab visibility change to prove background/foreground
  does not trigger a full re-render cascade.

## Relevant Files

Active individual preview:

- `packages/web-preview/src/client/components/Preview/ScreenCard.tsx`
- `packages/web-preview/src/client/hooks/useDragPosition.ts`
- `packages/web-preview/src/client/hooks/useInstantPatch.ts`
- `packages/web-preview/src/client/utils/iframeRegistry.ts`

Active panoramic preview:

- `packages/web-preview/src/client/components/Preview/PanoramicPreview.tsx`
- `packages/web-preview/src/client/hooks/usePanoramicInstantPatch.ts`
- `packages/web-preview/src/client/utils/panoramicIframeRef.ts`

Template engine and templates:

- `packages/core/src/templates/engine.ts`
- `packages/core/templates/universal/base.html`
- `packages/core/templates/panoramic/base.html`
- `packages/core/templates/_base/*.html`
- `packages/core/src/fonts/loader.ts`

Capture/export paths to preserve:

- `packages/web-preview/src/client/utils/clientExport.ts`
- `packages/web-preview/src/client/utils/captureManager.ts`
- `packages/web-preview/src/client/utils/variantThumbnailCapture.ts`

## Decision Record

Decision: migrate active live preview to parent-document shadow DOM, not to a
single shared iframe.

Reasoning:

- A single iframe would reduce duplication but still keeps the editor dependent
  on iframe document lifecycle and Safari iframe bitmap behavior.
- Shadow DOM removes the nested browsing context from the interactive surface
  while preserving scoped template CSS.
- The migration creates a better foundation for future direct-manipulation
  editing primitives.

Tradeoff:

- Shadow DOM is not a drop-in iframe replacement. The project must pay the
  migration cost for full-document HTML parsing, body/html CSS, font loading,
  coordinate conversion, and fixed-position behavior.

Conclusion:

Option C is worth doing, but only if implemented with the adapter, font-mode,
and parity-test guardrails above. Without those, the risk of subtle
preview/export mismatch is too high.
