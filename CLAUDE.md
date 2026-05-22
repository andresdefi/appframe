# appframe

Open-source tool for generating professional App Store & Play Store promotional screenshots.

## Tech Stack
- TypeScript (strict mode) with Node.js
- pnpm monorepo with 2 packages: core, web-preview
- Client-side `modern-screenshot` for the export render pipeline; Playwright is dev-only (E2E tests)
- Nunjucks + Tailwind CSS for templates
- Zod for runtime schema validation
- YAML only for the preview server's `--config` flag (`bin.ts`); JSON (`appframe.json`) for in-UI persistence
- `jszip` for client-side ZIP bundling of multi-file exports

## Code Conventions
- ESM modules (`"type": "module"`) everywhere
- Named exports only
- Functional patterns preferred
- Types defined in dedicated schema files, imported with `type` keyword
- `import type` enforced by TypeScript (`verbatimModuleSyntax`)

## Project Structure
- `packages/core/` — Config loading, template engine, rendering pipeline, frame management
- `packages/web-preview/` — Vite-based local preview UI + Express server, depends on core
- `frames/` — Device frame SVG/PNG assets with manifest.json
- `fonts/` — Bundled open-source fonts

## Build
- First-time / fresh-clone setup: `pnpm install && pnpm build`. The web-preview server reads from `packages/web-preview/dist/` and the UI from `packages/web-preview/client-dist/`; both are git-ignored and produced by `pnpm build`. `pnpm preview` errors out until that build has run.
- `pnpm build` — Build all packages
- `pnpm dev` — Watch mode for all packages
- `pnpm test` — Vitest across all packages
- `pnpm typecheck` — `tsc --noEmit` across all packages
- `pnpm lint` — ESLint
- `pnpm format` — Prettier
- `pnpm preview` — Start the local web UI at http://localhost:4400
- Publishing the web-preview package runs `pnpm run build` via `prepublishOnly`, so the published tarball always contains a fresh `dist/` and `client-dist/` even though those folders aren't tracked in git.

## Testing
- Vitest for unit and integration tests
- Test files co-located: `*.test.ts` next to source files
- After **server-side TS** changes, rebuild + restart: `pnpm --filter @appframe/web-preview exec tsc && lsof -ti :4400 | xargs kill && pnpm preview &`
- After **client-side** changes, rebuild + hard-refresh browser: `pnpm --filter @appframe/web-preview build:client` then Cmd+Shift+R (client-dist assets ship with `immutable` cache headers)

## Project storage
Each user project lives at `~/Documents/appframe/projects/<slug>/` and contains two files, both written atomically (`.tmp` + rename):

- **`appframe.json`** — full project state (screens, variants, panoramic data). Persisted **slim**: any field matching `STATIC_SCREEN_DEFAULTS` (see `utils/screenSerialization`) is stripped at save time and re-injected at load time via `fattenScreen`. Theme-derived fields (font, colors, etc.) are intentionally NOT in the defaults set — they snapshot-at-creation, diverge from the theme afterward, and need to round-trip exactly. `fattenScreen` also normalises two legacy patterns at load:
  - Text-size `null` / `0` (the old "use preset auto" sentinel) → promoted to the explicit px defaults `headlineSize: 110`, `subtitleSize: 55`, `freeTextSize: 55`. Slider readouts now match the rendered size; there is no "Auto" UI state.
  - Spotlight / Loupe shape data without an `*Enabled` flag → enabled inferred from data presence. The current model splits the on/off switch (`spotlightEnabled` / `loupeEnabled`) from the persisted shape so toggling off keeps the user's tuned config. `slimScreen` always preserves the enabled flag when the corresponding shape is non-null (otherwise "disable then reload" would silently flip back to enabled).
- **`meta.json`** — small index (displayName / createdAt / lastOpenedAt / savedAt). `listProjects` reads only this; never parses `appframe.json` to populate the picker.

No magic `default` slug anywhere. First-launch auto-creates an `Untitled 1` project with 3 placeholder screens.

## Export
"Download all N screens" produces a single ZIP via `bundleAsZip` (no per-file browser downloads — Chrome / Safari throttle those after ~3 from the same origin and they can't carry folder structure). Single-locale export puts files at the archive root; multi-locale export (Download tab's "Locales to export" section, all checked by default) puts each locale in its own folder (`default/screen-N.png`, `es-MX/screen-N.png`, ...). macOS Archive Utility auto-wraps in a folder named after the ZIP, so the extracted layout reads `<project>-screens/<locale>/screen-N.png`. "Download screen X" stays on the single-file browser-download path and uses the currently-active locale.

## Locales (multi-locale screenshot sets)
Snapshot-at-add-time model: `Add Locale` deep-clones the active mode's full state (`state.screens` or `state.panoramicElements`) into `state.localeScreens[code]` or `state.localePanoramicElements[code]`. Each locale is then independent — Default's edits never propagate. The Text sidebar tab is fully editable per locale (text, typography, colors, position, gradients, per-locale screenshots); Variants / Background / Device / Extras / Elements tabs are disabled when a non-default locale is active, and Add/Remove/Reorder Screen is blocked too. Canvas-level drag is filtered to text-kind only on non-default rows (`useDragPosition`'s `allowedKinds`). Canvas shows max two rows (Default + active locale); the Locales sidebar tab has a "Compare all" toggle that opts into the legacy stacked view. Each mode has its own locale list (Individual ↔ Panoramic don't share).

## Editor primitives
- **Drag surface (`useDragPosition.ts`)** — device frame, headline / subtitle / free text, annotations, overlays, loupe, spotlight cutout, and callout card are all draggable on the canvas. Drag commits state on release; instant-patch hooks (`useInstantPatch.ts`) mutate the iframe DOM directly during drag for smoothness. Loupe and callout content tracks the cursor live via their respective patch fns (the loupe template derives source from display position, so dragging the wrapper naturally pans the magnified content). MutationObserver gating in `ScreenCard.tsx` scopes `refreshLoupe` to device-wrapper mutations only — wiring it to every observed element causes per-tick stutter on callout drags. The spotlight cutout has `pointer-events: auto` (the wrapper stays `pointer-events: none`) so its bright region intercepts drags without dim regions stealing clicks.
- **Equal-spacing guides** — when dragging one of {headline, subtitle, device frame} and it sits at equal centre-to-centre distance from the other two of the trio, `ScreenCard.tsx` renders green bracketed segments showing the matched gaps. Scoped to the trio intentionally to keep visual noise down. All guide lines (centre + equal-spacing) carry a 1px black halo via `box-shadow` so the bright core stays visible on any background — including matching-colour canvases.
- **Add Screen does NOT inherit text sizes from theme** — `createScreenState` hard-codes `headlineSize: 110`, `subtitleSize: 55`, `freeTextSize: 55` rather than falling back to `config.theme.*`. Reason: `editorState.ts` derives `config.theme.headlineSize` from screen 0's value (used in agent-facing config snapshots), so naive theme inheritance propagates accidental screen-0 edits to every newly-added screen. The slider reset chip points at the same px literals.
- **Per-slider reset chip** — `RangeSlider` exposes a `resetTo` prop; when set and the current value differs, a small circular-arrow icon appears next to the value readout. The chip's footprint is always rendered (opacity-toggled) so the row doesn't reflow when the chip appears / disappears. Wire `resetTo` at the call site with the factory default used at feature-enable time (e.g. spotlight position 50/50, loupe zoom 2.5x).
- **Callouts (stable track)** — `Select Area` in the Effects > Callouts panel arms a pointer-capture overlay on the active screen card; dragging a rectangle on the screenshot and releasing creates a callout with `sourceLocked: true`. Locked-source decouples crop from card position: `sourceX/Y/W/H` are the actual screenshot crop coordinates, `displayX/Y` just position the card on canvas — dragging the card later moves only the card, cropped content stays pinned. Legacy callouts (no `sourceLocked` flag, created via the `+ Add Callout` button) keep the original "crop follows card" rendering so existing projects render unchanged. **Reselect Area** per callout redraws the source rectangle; the existing card is hidden via `visibility: hidden` during redraw and patched-in-place via `useInstantPatch.patchCallout` on commit to avoid the 150ms render-pipeline flash. Gated to flat / front-facing layouts + default locale + single-device composition — angled layouts apply perspective + `rotateY` and warp the pointer-to-screenshot-% mapping. Non-rectangular masks / boundary detection are explicitly Magic Callout (Beta) territory, not this track.

## MCP for AI agents (`packages/mcp/`)

Agent-facing surface that lets Claude / Cursor / Zed observe and edit a running appframe preview. Treat this as a primary product surface, not a side project — **make it as good as possible**. Concretely:
- **Cover the UI surface.** Every editable field reachable in the UI must be reachable via at least `patch_screen`. Add ergonomic helpers (`set_*`, `add_*`, etc.) for common cases so the agent doesn't have to remember field names.
- **Discoverable IDs.** Any helper that takes an opaque id (frame, font, device family, callout id, etc.) must have a corresponding `list_*` / `get_*` tool so the agent can find valid values before guessing.
- **Editor-state shape on writes.** Agent writes go through `POST /api/projects/:slug/patch-screen` (rich envelope). NEVER write to `/api/config` (the slim AppframeConfig) — round-tripping the slim form loses callouts / gradients / spotlight & loupe flags / shadow toggles. The 2026-05-21 incident lost the user's in-memory rich state via exactly this mistake.
- **Merge-with-existing.** Partial-field helpers (`set_spotlight`, `set_loupe`, `update_callout`, etc.) must call `readScreen(client, slug, index)` first and shallow-merge so the agent can tweak one field without resending the rest.
- **Hydrate, never re-init.** The SSE-triggered browser reload uses `hydrateProjectSnapshot` (the project picker's restore path), never `initScreens` (the boot-time fresh init from theme defaults — destructive). Same rule for any future server-pushed UI sync.
- **Tool descriptions** must name units (px vs %, fractions vs %), defaults, valid enum values, and which `list_*` to call first.
- **Smoke-test end-to-end.** MCP stdio → SSE broadcast → browser updates → disk file changes verified. Don't claim a tool is done without a disk-state diff that round-trips through revert cleanly.

## TODO

### Individual-mode UI inspection not yet done
The 2026-04-20 pass reviewed Platform / Screenshot / Device Frame / Device Layout / Device Shadow / Composition / Background / Text tabs. Extras and Download were audited later. Still un-inspected in that depth:
- **Variants tab** — Two pieces landed 2026-05-19: `createVariant` now produces a blank canvas rather than silently snapshotting the active variant; `VariantRecord.thumbnail` carries a small composite render captured via modern-screenshot (multi-screen variants stitch every frame side-by-side; panoramic captures the full canvas). The approval / artifact flow + the variant card UX beyond thumbnails still hasn't been deeply reviewed.
- **Panoramic mode** — entire mode untouched. Sidebar tabs differ (`PanoramicTab`, `PanoramicEffectsTab`).

### Background catalog is intentionally local-only
The Background tab ships with a curated catalog (50 solid colors + 66 gradients across Sunset / Ocean / Cosmic / Aurora / Vivid / Pastel / Glow / Mesh categories). Plus user image upload. **No live API integrations are planned** — no Unsplash search, no AI-generated backgrounds. Those would balloon the scope (API keys, licensing complexity, asset hosting, backend dependencies) without changing the core value-add.

What IS open: **bundled high-quality image / texture / photo presets** added directly to the repo as static assets (license-cleared, hand-curated, no runtime API). New categories like "Photo", "Texture", "Abstract" can be added the same way the existing Solid/Gradient categories work.

### before.click gap list → editing primitives
Captured earlier: layer system, rich-text headlines, split / banded backgrounds, device bleed-off-canvas, multi-device collage, text-pattern backgrounds, z-order control. Pick the top 3–5 and scope a plan.

### Agent skill
Rewrite `skills/appframe-screenshots/SKILL.md` from scratch using before.click vocabulary. The old one was deleted alongside autopilot — the new one should describe the agent-drives-design-appframe-renders flow and the editing primitives the agent should reach for.

### Device frames — quality pass needed
Current frames are not up to standard. 3D frame style was removed in the 2026-05-14 hygiene pass. Asset sourcing is the real blocker: appframe is MIT-licensed, so bundled frame PNGs need a permissive license — most paid packs (Angle, Rotato, Mockuuups) forbid redistribution. The Koubou-style external-installable pattern (already used for iPad / Mac / Watch frames) is one escape hatch; commissioning original renders is the other. When picked up: design the approach first, don't resurrect the old `frameStyle == '3d'` runtime path — anything new should ship as part of the frame definitions / SVGs.

### Stable Callouts follow-ups
The drag-to-select track shipped 2026-05-21 covers the rectangular-crop case end-to-end (`docs/callouts-improvement-plan.md` Phases 1–5). Open follow-ups deliberately deferred to Magic Callout (Beta), not this track: non-rectangular / pill / arbitrary-shape masks, component boundary detection, edge-snap or ML-based source refinement. Tier-2 pixel-luminance edge-snap was prototyped + reverted — false positives on inner UI content + undershoot on antialiased curved edges made it less reliable than the literal drag rect.
