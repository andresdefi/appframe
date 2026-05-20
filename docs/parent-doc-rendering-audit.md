# Parent-document rendering — Phase 0 audit

Scope: code-level inventory of the four shadow-DOM risk areas called out in
`docs/parent-doc-rendering-plan.md` (`body`/`html`/`:root` CSS, viewport units,
`position: fixed`, iframe-document access), plus the iframe surfaces that stay
out of scope. No runtime change is made by this document — it's the input to
Phases 1-4.

Generated 2026-05-20 against `packages/core/templates` and
`packages/web-preview/src/client`.

## 1. Template `body` / `html` / `:root`

The Nunjucks templates all emit a full HTML document, so every template has a
`<body>` rule that an iframe consumes as the document body and a shadow root
would simply ignore.

| File | Lines | What the rule does |
| --- | --- | --- |
| `packages/core/templates/_base/layout.html` | 10-16 (`body { width, height, overflow, font-family, font-smoothing }`), 77-81 (`<body>` wrapping `.canvas`) | Base layout extended by other templates. Sets the canvas-sized body. |
| `packages/core/templates/universal/base.html` | 9-13 (fullscreen branch: `body { width, height, overflow }`), 30-34 (`<body><div class="canvas"><img>`), 48-54 (composed branch: `body { width, height, overflow, font-family, font-smoothing }`), 300-408 (composed `<body>` wrapping `.canvas`) | Two body blocks because the template forks between fullscreen and composed modes. Both encode canvas dimensions on `<body>`. |
| `packages/core/templates/panoramic/base.html` | 10-17 (`body { width, height, overflow, font-family, font-smoothing }`), 175-526 (`<body>` wrapping `.panoramic-canvas`) | Panoramic body is the wide canvas. |

No `:root { ... }` selectors are present. No CSS custom-property declarations
target `:root`, so the `:host` migration concern from the plan is empty for the
current template set (still worth re-grepping at Phase 4 in case templates
change).

Action implied for Phases 3-4: every template needs its `body { width, height,
overflow, font-family, font-smoothing }` rule mirrored on the
`.preview-document` wrapper the shadow renderer mounts. The cleanest route is
the plan's "preferred" option — update templates to style a wrapper class that
sits inside `<body>`, so iframe rendering still works and shadow rendering
just consumes the inner subtree.

## 2. Viewport units (`vw` / `vh` / `vmin` / `vmax`)

```
rg -n "\b\d*\.?\d+(vw|vh|vmin|vmax)\b" packages/core/templates packages/core/src
```

returns **zero hits**. Every dimension in the templates is computed in pixels
from `canvasWidth` / `canvasHeight` at render time (see e.g.
`universal/base.html:74`, `_base/layout.html:35`). This whole risk category is
already absent — no template change required.

## 3. `position: fixed`

Three real sites, all in the live-editing path:

### 3a. `useDragPosition.ts:326` — drag-start text positioning

```ts
el.style.position = 'fixed';
el.style.top = vr.top + 'px';
el.style.left = centerX + 'px';
```

Sets the headline / subtitle / free-text element to fixed positioning while a
drag is in progress so the runtime move math can use viewport coordinates
directly. In shadow DOM, `position: fixed` resolves against the browser
viewport, not the preview wrapper, so the drag would move the text out into
the editor chrome. Must become absolute positioning within
`.preview-document` for the shadow backend.

### 3b. `injectTextPositionCSS` in `packages/web-preview/src/routes/preview.ts:631-671`

```ts
rules.push(
  `.headline { position: fixed; top: ${positions.headlineTop}%; left: ${positions.headlineLeft}%; ... }`,
);
```

The preview server bakes `position: fixed` into the rendered HTML for any
text element that has a saved position, before the iframe ever sees the
markup. Same as 3a, this is iframe-only valid. For the shadow path the
injected CSS needs to switch to `position: absolute` and a containing block
that is `.preview-document`.

This is the most load-bearing of the three sites — it's the persisted shape
of every screen whose text the user has previously dragged.

### 3c. `useInstantPatch.ts:206` and `ScreenCard.tsx:374, 408` — "is this text already drag-positioned" probes

```ts
const isFixed = doc.defaultView?.getComputedStyle(el).position === 'fixed';
...
if (target.kind === 'text' && view?.getComputedStyle(el).position !== 'fixed') {...}
```

These three reads use `computed.position === 'fixed'` as a sentinel for "this
text has been positioned, so the rotation/center-guide math is meaningful".
Once 3a and 3b stop emitting `fixed`, these probes become wrong by default.
The plan already calls this out — move to an explicit "drag-positioned" model
(e.g. a `data-positioned="true"` attribute set wherever `injectTextPositionCSS`
+ `useDragPosition` set the styles).

Non-issues that show up in grep:

- `packages/web-preview/src/client/utils/clientExport.ts:51`,
  `captureManager.ts:165`, `variantThumbnailCapture.ts:55`,
  `exportDiagnostic.ts:213` — all set `position: fixed` on a host-page
  iframe / textarea to hide it. These are parent-document elements, not
  inside the preview surface, so they are unaffected by the migration.

## 4. Iframe-document reach-through (Phase 1 surface area)

Files that go through `contentDocument` / `contentWindow` and therefore need
to flip to the `PreviewSurface` adapter:

- `packages/web-preview/src/client/hooks/useDragPosition.ts`
- `packages/web-preview/src/client/hooks/useInstantPatch.ts`
- `packages/web-preview/src/client/hooks/usePanoramicInstantPatch.ts`
- `packages/web-preview/src/client/components/Preview/ScreenCard.tsx`
- `packages/web-preview/src/client/components/Preview/PanoramicPreview.tsx`

(Confirmed via `rg -ln "doc\.open|doc\.write|contentDocument"
packages/web-preview/src/client`.)

`packages/web-preview/src/client/utils/iframeRegistry.ts` (17 lines) is the
shared registry. The shadow path will need its own equivalent
`hostRegistry.ts` (mapping screen index → shadow host) or a unified
`previewSurfaceRegistry` that the adapter abstracts over.

Out-of-scope iframe sites (kept on iframe per plan §"Current Iframe Surfaces
To Preserve For Now"):

- `packages/web-preview/src/client/utils/clientExport.ts`
- `packages/web-preview/src/client/utils/captureManager.ts`
- `packages/web-preview/src/client/utils/variantThumbnailCapture.ts`

The three above all share the same pattern: create a hidden, fixed-position,
fully-sized iframe → `doc.open/write/close` → wait on
`document.fonts.ready` + `img.decode()` → hand to `modern-screenshot`. None
of these is reached by the active-preview migration.

## 5. Template font emission

Every template currently injects `{{ fontFaceCss | safe }}` unconditionally
(`_base/layout.html:6`, `universal/base.html:44`, `panoramic/base.html:6`).
The engine builds it from the active font keys
(`packages/core/src/templates/engine.ts:484-510, 513-535`) and merges it into
the render context as `fontFaceCss`.

For Phase 2 the engine needs a `FontFaceMode` knob (`'inline' | 'url' |
'none'`); when callers pass `'none'`, `fontFaceCss` should be the empty
string and templates should still safely interpolate it (current `{{
fontFaceCss | safe }}` already tolerates an empty string).

## 6. Open questions surfaced by the audit

1. **Server-side injected fixed positioning vs. shadow rendering.** §3b is
   the cleanest break: shadow rendering cannot consume the served HTML
   verbatim because the persisted text positions are encoded as `position:
   fixed`. Options are (a) teach the server to emit `absolute` when a
   `shadow=1` query flag is set, or (b) strip & re-inject the rule client-
   side in the shadow renderer. (a) feels lower-risk — same code path, one
   conditional.
2. **`isolation: isolate` on `.canvas`** (`universal/base.html:62-66`) is a
   stacking-context hack for iframe blend-mode behavior. Worth re-verifying
   in shadow DOM; if blend modes still target the shadow root correctly,
   the rule can stay as-is on `.canvas` inside the wrapper.
3. **Safari bitmap-purge workarounds** (`will-change: transform;
   translate3d(0,0,0); backface-visibility: hidden` at e.g.
   `panoramic/base.html:67-72` and the device-image rules in
   `universal/base.html`) exist specifically because of the iframe lifecycle
   problem this migration removes. They are safe to keep through Phase 6 but
   can be revisited as a cleanup after the iframe path is deleted in Phase 7.

## 7. Risk summary going into Phase 1

- `body { ... }` CSS in **3 templates** needs a wrapper-targeted equivalent.
- **5 client files** need to swap direct `contentDocument` access for the
  `PreviewSurface` adapter.
- **3 sites** that emit or read `position: fixed` need an explicit
  drag-positioned model. The server-side `injectTextPositionCSS` is the
  load-bearing one because it touches persisted state.
- **0** viewport-unit fixes needed.
- **0** `:root` selector rewrites needed.

The migration's per-file blast radius is therefore smaller than the plan's
text reads — the heavy lift is concentrated in the text-positioning model
(3 sites that move together) and in the `PreviewSurface` adapter (5
consumers). Everything else is mechanical.
