# Component extraction — planning context for a fresh session

Status: open. Raised on 2026-05-15 during the callout-precision work, after the user realized the slider-based crop will never be as good as an actual component cutout:

> If we could have an engine in appframe that is able to trace different components, like the "+" button or rows of expense entries, or the pie chart... I have achieved this somewhat manually, but was wondering if we could create or integrate an engine that does so that could be able to do it with any component of the screenshots.

This doc is the brief for a future Claude Code session picking up that work. Start a new session and tell Claude: "read `docs/component-extraction-plan.md` and implement it."

## What this feature is

A **per-project component library** built by mining your own screenshots. You click any element in a screenshot — a button, a row, a card, a chart, anything — and it becomes a transparent-background PNG saved to the project's `cutouts/` dir, with a thumbnail in a Components panel. You can drag any saved cutout onto any screen in the project at any time, even one that didn't exist when you extracted it.

The model App Store screenshot here — the one the user referenced — is built from this exact pattern. The Activities card, the four stat tiles (Duration / Active Energy / Distance / Elevation Gain) are individual cutouts laid out on a green gradient with some rotation. No raw screenshot anywhere. That's the target experience.

The feature replaces three current workflows with one:

1. **Smarter callouts.** The existing callout tool crops a rectangle. The cutout follows the actual border of the component — donut chart's hole, rounded-card edges, FAB's circle — and stays selectable / movable / scalable like any overlay.
2. **Marketing composition.** Build an App Store screenshot from real app components laid out on a designer background, with the source screenshots hidden.
3. **Component reuse.** Extract once, use across every screen in the project.

## What the user wants (verified 2026-05-15)

1. **One-click magic** for the common case. Click on a component, get a clean cutout. No refinement UI in the happy path.
2. **Per-instance placement choice.** A cutout placed on a screen can be in one of three modes:
   - **Keep source visible** — cutout floats over or next to the original screenshot. Smart-callout-style use.
   - **Lift off** — cutout floats where it was, but the source screenshot now has a transparent hole where the cutout used to be. "The designer pulled this card off the screen" look.
   - **Hide source entirely** — canvas shows only cutouts on the designer background. The marketing-composition mode.
   The choice is per-instance, not per-cutout. Same pricing card can be "lift off" on one screen and "hide source" on another.
3. **Granularity is per-click.** Click the same point, get three candidates — "the icon" / "the icon + label row" / "the whole card" — pick the level you want.
4. **Refinement** (shift / alt click) exists but is the escape hatch, not the default flow.
5. **Cross-screen reuse.** A cutout extracted from screen 1 should appear in the Components panel and be draggable onto screens 2 / 3 / 4.
6. **No ongoing per-use cost.** Vision LLMs (Claude / GPT vision) explicitly ruled out. One-time model download is fine; per-click API charges are not.

## Why SAM, not the alternatives

Three real options:

1. **Heuristic computer vision** (OpenCV.js edge / contour detection). Cheap, offline. But no semantic understanding — soft shadows confuse it, donuts come out as circles, the "+" button might or might not detect. The user already showed that 0.1% slider precision isn't enough for fitting a rectangle to a card border; CV-derived masks will not be pixel-perfect either, and they fail on non-rectangular elements.

2. **Vision LLMs** (Claude vision, GPT-4V). High quality, semantic labels. Per-call cost + API key. Ruled out by the user.

3. **Segment Anything Model family (SAM)**. Meta's foundation model for click-to-mask segmentation. Open weights, ONNX exports, runs in the browser, one-time ~38 MB download, unlimited free use after. Designed for exactly this interaction.

A SAM model trained on natural images works *better* than expected on UI screenshots because UI is cleaner than natural images — sharp edges, distinct color blocks, no motion blur. The segmentation cues SAM relies on are amplified.

## Why one-click magic is actually feasible

The user's first reaction to "1-2s per click" was correctly that it's too slow. That figure was a misread on my part — here's the real performance model.

SAM is two stages:

1. **Image encoder** — turns the screenshot into a feature tensor. Heavy: ~1-2 s on CPU, ~150-300 ms on WebGPU. Output is the same for every click on the same screenshot.
2. **Mask decoder** — turns the encoder output + click coords into a mask. Light: ~50-100 ms on CPU, ~10-30 ms on WebGPU.

**Encode once per screenshot, decode per click.** The encoder runs in the background when a screenshot is loaded (or when Magic Cut is first activated on it). Every click after that is decoder-only — ~30 ms on WebGPU. Under perception threshold.

Even better, SAM's decoder returns **three mask candidates per click**, ranked by confidence and roughly corresponding to local / regional / scene-level groupings. Show the highest-confidence one immediately; the other two are one keypress away. For the user's "what counts as a component" question — that's exactly what the multi-mask output answers, no refinement needed.

So the latency profile we ship is:

| Step | First time | Subsequent |
|------|-----------|-----------|
| Model download | ~5-10 s (one-time, cached forever) | 0 |
| Screenshot encoding | 150-300 ms WebGPU, 1-2 s CPU (background) | 0 if same screenshot |
| Per click | ~30 ms WebGPU, ~50-100 ms CPU | same |
| Cycle to alternate mask | ~1 ms (it's already computed) | same |

Click → mask in roughly the time of a keypress. That is the one-click magic the user asked for.

## Model choice

Three browser-shippable variants worth considering:

| Model | Size | Quality | Notes |
|-------|------|---------|-------|
| **MobileSAM** | ~38 MB | Very good (~95% of original SAM) | Best size / quality tradeoff. ONNX exports via Xenova/Transformers.js. |
| **EfficientSAM-Tiny** | ~75 MB | Slightly better than MobileSAM | Use if MobileSAM misses on specific UI patterns. |
| **SAM-2 (Tiny)** | ~150 MB | Best | Heavier; consider only if the smaller models are inadequate. |

**Start with MobileSAM.** Same prompt API and integration code across all three, so swapping later is a weights change, not a rewrite. Bundled as static assets so there's no third-party model host dependency.

## Storage layout

Cutouts get their own directory next to `screenshots/`, mirroring the project structure that already works:

```
~/Documents/appframe/projects/<project>/
├── appframe.json
├── meta.json
├── screenshots/
│   ├── home.png
│   └── pricing.png
└── cutouts/
    ├── yearly-card.png         ← transparent-background RGBA PNG
    ├── feature-row-1.png
    ├── fab-button.png
    └── _meta/                  ← optional per-cutout sidecars
        └── yearly-card.json    ← { sourceScreenshot, prompts, modelVersion, extractedAt }
```

Cutouts are first-class assets. They have their own slugified filenames, collision auto-suffix, the same path-safety / project-aware logic as screenshots. The cutout's sidecar (optional, can ship later) records where it came from so the user can "re-extract with different prompts" without losing the original.

Server endpoints mirror the screenshot ones:
- `POST /api/cutouts/upload` — write a cutout PNG to the project's `cutouts/` dir, return the URL
- `GET /api/cutouts/:project/:filename` — serve a cutout back to the canvas

Consider extracting a shared base module — `assetStorage.ts` — from `screenshotStorage.ts` once we add the second asset type, so they don't drift apart.

## The three placement modes

When a cutout is placed on a screen, the user picks how the source screenshot behaves *on that screen*. The cutout itself is unchanged; the source is what we manipulate.

**Mode 1: Keep source visible**

The cutout sits on top of the screenshot. Looks like a callout that perfectly follows the component border. Useful for "highlight this card."

Implementation: cutout is added as an overlay element on top of the source screenshot. No change to the source.

**Mode 2: Lift off**

The cutout floats over the screen, but the source screenshot has a transparent hole where the cutout used to be. Visually reads as "this card has been pulled off the screen."

Implementation: the source screenshot is rendered with the cutout's mask subtracted from its alpha channel. The cutout is layered on top, with a slight offset and/or rotation to sell the "lifted" look. Done as a runtime composition (server-side or client-side); no edit to the source PNG on disk.

**Mode 3: Hide source entirely**

The source screenshot doesn't render. Only cutouts (and any other elements) show on the canvas. This is the marketing-composition mode.

Implementation: a per-screen flag. The source screenshot is excluded from the render. Cutouts placed on the screen render at whatever positions the user gave them.

The mode picker lives next to each cutout-overlay's existing controls (size / position / rotation / opacity). Default is **Keep source visible** because it's the least surprising; the user explicitly chooses lift-off or hide-source.

## How the interaction feels

1. User selects a screen, opens **Magic Cut** (likely a new sidebar tab named "Components" or "Cutouts").
2. The screenshot fills the canvas with a cursor mode active. While the user moves their mouse, the encoder is running in the background — if they hover for a moment before clicking, the first click already has encoding done. Otherwise the first click incurs the encoder pass once, then everything else is fast.
3. User clicks a point on the screenshot. SAM's decoder returns three mask candidates. The highest-confidence one renders immediately as an accent-colored overlay on the screenshot.
4. A floating toolbar near the cursor shows: **[Use this] [◀ Alt 1 / 3 ▶] [Refine] [Cancel]**. Cycling alternates with arrow keys / tab.
5. If none of the three candidates is right, click **Refine** — now shift-click adds a positive point, alt-click adds a negative point, mask updates after each click. (Or, since the user already clicked once, the existing prompt list is treated as positive and they can immediately shift / alt click to add more.)
6. **[Use this]** writes the cutout to `cutouts/<slug>.png`, adds a thumbnail to the Components panel, places it on the current screen as a new overlay element at the mask's natural canvas position, defaults to **Keep source visible** mode.
7. The user can now drag, scale, rotate, change opacity, switch placement mode (Keep / Lift off / Hide source), or open the Components panel and drag the same cutout onto a different screen.

The components panel itself is a vertical list of thumbnails for every cutout in the project. Each thumbnail has a quick action: drag-to-screen, rename, delete.

## Build order

Sized so every phase ships something visible, and the load-bearing pieces (model + encoder cache) land first.

### Phase 1 — Model + encoder pipeline (no UI)

Wire MobileSAM into the project. Verify loading the model, running the encoder, running the decoder with a known click, getting a binary mask out, caching the encoder output keyed by screenshot URL.

Files: `packages/web-preview/src/client/services/sam/` (new): `loader.ts` (Transformers.js or hand-rolled ONNX Runtime Web), `encoder.ts`, `decoder.ts`, `cache.ts` (in-memory map of encoder outputs, LRU-evicted at, say, 5 entries to keep RAM bounded). Bundled weights at `packages/web-preview/public/models/mobile-sam/`. Smoke test at `/_sam-test` (a dev-only HTML page that loads an image, runs a click, draws the mask) — not user-facing.

### Phase 2 — Click-to-extract MVP

User can click on the active screen's screenshot and produce a cutout PNG saved to `cutouts/`. UI is minimal: a tool toggle, click capture, single-mask preview (no multi-candidate yet), Accept / Cancel toolbar. Cutout appears in a new Components panel as a thumbnail, but does not yet auto-place on the canvas.

Files: `EffectsTab.tsx` or new `ComponentsTab.tsx` for the panel + Magic Cut button, a click-capture overlay in `PreviewArea.tsx`, new server module `cutoutStorage.ts` (sibling of `screenshotStorage.ts`, near-identical) with `POST /api/cutouts/upload` + `GET /api/cutouts/:project/:filename`.

### Phase 3 — Multi-mask candidates + cycling

The single click returns 3 masks; user cycles with keyboard arrows / tab strip in the toolbar. This is what makes Phase 2's "click" feel like one-click magic instead of "click then refine."

### Phase 4 — Cutouts as overlay elements + Keep / Lift / Hide modes

Accepting a cutout adds an overlay to `screen.overlays[]` with the cutout's URL and a default mode of **Keep source visible**. The overlay system already handles position / scale / rotation / opacity — extend it with a placement mode field. Implement the mask-subtraction render pass for **Lift off** and the source-skip pass for **Hide source**.

This is the phase where the user can actually build the Gentler Streak-style composition.

### Phase 5 — Refinement (shift / alt point prompts)

Multi-point prompts when the candidates aren't enough. Mask updates live as points are added. Anti-aliased mask edges (soft alpha at the boundary) so cutouts don't have a 1-pixel jagged ring.

### Phase 6 — Cross-screen reuse + library management

Components panel is fully realized: thumbnails, drag-onto-screen from any screen, rename, delete, "drag the same cutout onto a different screen creates a new instance with its own placement mode / transform." Cutout filenames stay readable (user can rename "yearly-card.png" to "pro-pricing-card.png" from the panel).

### Phase 7 (later) — Box-prompt mode, hover preview, batch extract

- **Box prompt** — drag a rough rectangle, SAM refines to a precise mask. For cases where a click is ambiguous because the user wants the whole region around the click, not the specific element at it.
- **Hover preview** — live mask under the cursor. Gated on WebGPU since CPU is too slow for hover-rate updates.
- **Batch extract** — automatic mask generator, returns N labeled masks at once for the obvious components. Closer to "find everything for me" but historically returns lots of noise; needs filtering heuristics. Park until the click path is solid.

## Testing

Each phase needs tests landing alongside the code. The goal is that "click on a component → get a clean cutout that aligns to the visible border" works *every time* across a wide variety of UI screenshots, not just the user's first test image.

### Phase 1 — Model + encoder pipeline

- **Unit**: model loader handles "weights not in cache" (resolves once IndexedDB has them), handles a corrupt cached weight (re-downloads), handles "weights download failed" (clear error). Encoder cache evicts least-recently-used when capacity hits.
- **Integration**: a small fixture image + a known point prompt → assert mask hash matches a recorded baseline. Guards against accidentally swapping weights without realizing the output changed. Also a deterministic seed: same image + same prompt = same mask, byte-for-byte.

### Phase 2 — Click-to-extract MVP

- **Unit**: mask → RGBA PNG converter round-trips through `decodeImageData` to the same mask. Bounding-box crop removes empty rows / columns without breaking the opaque pixels.
- **Integration**: `cutoutStorage.ts` mirrors all the existing `screenshotStorage` tests — path traversal refused, slugified filenames, collision auto-suffix, oversize cap, MIME validation.
- **E2E (Playwright)**: click on a screenshot, wait for mask preview, click Accept, assert a file appears in `cutouts/` with the expected dimensions.

### Phase 3 — Multi-mask candidates

- **Unit**: candidate cycler respects the model's confidence ordering, doesn't skip / repeat, wraps from 3 → 1 cleanly.
- **Integration**: arrow keys cycle on a real preview; the "Use this" action picks the currently-displayed candidate, not always candidate 0.

### Phase 4 — Cutouts as overlays + placement modes

- **Integration**: each placement mode renders correctly for both the iframe preview and the export pipeline. **Keep**: cutout on top of source. **Lift off**: cutout on top, source has a hole at the cutout's original position. **Hide**: source is absent.
- **E2E**: extract a cutout, switch through all three modes, assert the canvas pixels at the cutout's source position behave correctly for each mode (opaque source / transparent hole / no source at all).

### Phase 5 — Refinement

- **Unit**: prompt-list builder collects positive / negative points in the order the user clicked, encodes them in the format SAM's decoder expects, supports escape-to-clear.
- **Integration**: shift-click adds positive, alt-click adds negative, mask updates after each.

### Phase 6 — Cross-screen reuse

- **Integration**: dragging the same cutout onto two screens creates two independent overlay instances with their own transforms. Renaming a cutout updates the URL everywhere it's referenced. Deleting refuses if there are live references unless the user confirms.
- **E2E**: extract a cutout on screen 1, switch to screen 2, drag from the panel, both screens show the cutout independently.

### Cross-cutting

A handful of tests deserve their own scope, separate from any phase:

- **WebGPU vs WASM correctness.** Same image + same prompts → same mask (up to floating-point tolerance) on both backends. The user-visible difference must be speed only.
- **Large screenshots.** A 4K iPad screenshot shouldn't OOM the browser. The encoder downsamples to its expected input resolution (typically 1024×1024) — the resize-then-rescale-mask flow must preserve alignment with the original-resolution PNG.
- **Encoder cache thrash.** Switching rapidly between screens shouldn't keep re-encoding from scratch.
- **Cutout served back through the render pipeline.** The same URL-vs-data-URL handling that exists for screenshots (server reads cutout PNG from disk and inlines for Playwright export) must work for cutouts too.

## Relevant files for the implementation session

- `packages/web-preview/src/client/services/` — doesn't exist yet; new `sam/` subdir lives here
- `packages/web-preview/src/client/components/Sidebar/` — new `ComponentsTab.tsx` (or extend `EffectsTab.tsx`) for the Magic Cut entry point + Components panel
- `packages/web-preview/src/client/components/Preview/PreviewArea.tsx` — click-capture overlay layer hooks in here, similar to the existing internal drag-to-position
- `packages/web-preview/src/screenshotStorage.ts` — the cutout server module is structurally near-identical; consider extracting a shared "image asset storage" base when adding the second type
- `packages/web-preview/src/server.ts` — new endpoints register alongside existing screenshot / project routes
- `packages/web-preview/public/models/mobile-sam/` — bundled model weights (new directory)
- `packages/core/src/templates/` — the engine's overlay rendering needs to learn the three placement modes (mask subtraction for Lift off, source skip for Hide source)

## Out of scope

- **Vision-LLM-backed auto-labeling.** "Find the pricing card / FAB / chart automatically and label them by name" — useful for the batch-extract experience, but it's the per-call-cost path the user ruled out. SAM's automatic mask generator can produce candidates without an LLM, but they're unlabeled and noisy. Defer.
- **Cross-project component sharing.** Cutouts are per-project for now. "Use the FAB from project A in project B" can come later.
- **Background reconstruction / inpainting.** When the user lifts off a cutout, the hole stays transparent. Filling it with plausible content (inpainting) is a separate feature.
- **Mask paintbrush.** Manual brush refinement on top of SAM's mask. Useful for the 5% of cases where prompt-based refinement still isn't enough; revisit only if Phase 5 isn't sufficient.
- **Vector / SVG output.** Cutouts are raster RGBA PNGs. Vector extraction from screenshots is OCR + path tracing, a different problem.
- **Embedding-based similarity** ("find the same component in this other screenshot"). Useful for "automatically extract the same row from 5 list screens" but a separate model and dataset.
