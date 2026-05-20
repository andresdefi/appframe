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

### Phase 3 - Shadow Renderer For Individual Mode, Flagged Off

Tasks:

- Add `ShadowScreen` or equivalent.
- Parse full template HTML into style nodes plus body children.
- Mount into an open shadow root under `.preview-document`.
- Apply containment and fixed dimensions on the host/wrapper.
- Strip scripts and avoid direct raw HTML assignment.
- Implement shadow version of `PreviewSurface`.
- Add a feature flag: `?shadow=1` or localStorage.

Important:

Individual mode only in this phase. Leave panoramic on iframe until the
surface abstraction and shadow renderer are proven.

Done when:

- Shadow individual previews render behind the flag.
- Drag, guides, text positioning, loupe refresh, instant patches, file drops,
  and locale text-only constraints work.
- Parity harness passes for individual-mode fixtures.

### Phase 4 - Template Compatibility Cleanup

Tasks:

- Convert or adapt `body` / `html` styling.
- Remove any live-shadow dependency on viewport units.
- Replace drag-time `position: fixed` behavior with absolute positioning in
  the preview wrapper.
- Make the "is this text drag-positioned" checks explicit rather than tied to
  computed `position === 'fixed'`.

This phase may happen partly before Phase 3 if the audit reveals obvious
template changes that are safe for iframe rendering too.

Done when:

- Iframe and shadow parity still pass.
- No known template CSS relies on iframe-only semantics in the shadow path.

### Phase 5 - Panoramic Shadow Preview, Flagged

Tasks:

- Reuse the shadow renderer and adapter for `PanoramicPreview.tsx`.
- Migrate panoramic drag and instant-patch code.
- Add panoramic parity fixture.

Reason:

Panoramic has different coordinate math and one wide canvas, so it should not
be bundled into the first individual-mode migration.

Done when:

- Panoramic works behind the same flag.
- Panoramic parity passes.

### Phase 6 - Default Shadow DOM For Active Preview

Tasks:

- Flip the default to shadow DOM for active individual and panoramic previews.
- Keep `?shadow=0` as an escape hatch.
- Dogfood for several days, especially in Safari.

Watch:

- tab-switch behavior
- drag responsiveness
- font fallback flashes
- image decode timing
- memory use on 6 to 10 screens
- behavior with multiple locales

Done when:

- No blocking regressions are found in real projects.
- Safari flash is gone without relying on the Option A overlay.

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
