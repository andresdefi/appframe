# Overlay tooling gaps

## Summary

While recreating a ChatGPT-style marketing screenshot (small red speed
lines top-left, small purple speed lines bottom-left, decorative Lucide
icons), the agent-and-UI workflow hit four real friction points around
shape and icon overlays: an effective 50-px floor on overlay size that
makes tight line clusters impossible, a missing line-thickness control
(line height is hard-coded to 4 px in two render paths), no MCP
discovery surface for valid `iconRef` values, and an `add_overlay`
description that under-sells the already-exposed `rotation` field. The
order below is pure-impact rather than dependency-driven — none of the
open gaps require schema changes that would migrate existing on-disk
data.

The original investigation prompt enumerated six gaps; Gap 3 (MCP
`add_overlay` icon not rendering) and Gap 6 (misleading tool
description) were resolved in PR #59 and merged to `main` (commit
`c03c9bf`) before this proposal was finalized, so they are not
re-described here. Gap numbering below is kept stable with the
original prompt for cross-referencing.

## Gap 1: Line shape minimum size

### Current behavior

`overlaySchema.size` (`packages/core/src/config/schema.ts:290-304`) has
`.min(20)` but a `preprocess` step ahead of validation clamps anything
under 50 to `Math.max(50, Math.round(v * 12.9))`:

```ts
size: z.preprocess(
  (v) => {
    if (typeof v !== 'number') return v;
    if (v < 50) return Math.max(50, Math.round(v * 12.9));
    return v;
  },
  z.number().min(20).max(3000).default(200) ...
)
```

The preprocess exists to migrate legacy 1-50 percent-style sizes from
older project files to absolute pixels. Side effect: an agent (or a
user via a future slider) cannot reach a 10-40 px line — anything
under 50 px is read as "legacy percent" and rewritten upward. The MCP
schema (`packages/mcp/src/tools/overlay.ts:20`) advertises
`minimum: 20` but the core preprocess wins on save.

### User impact

Decorative speed-line clusters need 20-40 px on a 1290+ canvas. The
50-px floor forces lines that visually read as bars; the user works
around it by stacking thin opacity instead, which is the wrong knob.

### Proposed implementation

Replace the always-on preprocess with a date-bounded migration: only
apply the 1-50 → percent conversion when the envelope's
`schemaVersion` is below the version that introduced absolute pixels
(or when the project file was written before the cutoff `savedAt`).
For new writes the value passes through unmodified, so a legitimately
small line at 12 px stays at 12 px.

A leaner alternative if a global change feels risky: bypass the
preprocess specifically when `type === 'shape' && shapeType === 'line'`
(or `shapeType === 'arrow'`), which are the geometries where small
values genuinely make sense. Circle / rectangle floors stay where they
are.

Update `OVERLAY_FIELD_SCHEMA.size.minimum` in
`packages/mcp/src/tools/overlay.ts:20` to `10` once the core path
agrees so the MCP schema advertises what the renderer will actually
accept.

### Acceptance criteria

- `add_overlay { type: "shape", shapeType: "line", size: 12 }` saves
  with `size: 12` on disk and renders as a thin 12-px line on canvas.
- Pre-existing projects with `size: 8` (interpreted as 8% under the
  old contract) still load to a sensible pixel size — covered by a
  round-trip test on a fixture envelope.
- Schema documentation in the `size.describe(...)` block updated to
  drop the "legacy percent" sentence once the preprocess is gone.

### Estimated complexity

**M** — straightforward code change, but the legacy-data migration
needs a fixture-based test to prevent silently breaking projects
saved under the old contract.

---

## Gap 2: Line thickness control

### Current behavior

Line shape height is hard-coded to 4 px in **both** render paths:

- Server-side export renderer
  (`packages/core/src/templates/injectors.ts:174-176`):
  ```ts
  } else if (ov.shapeType === 'line') {
    inner = `<div style="width:100%;height:4px;margin-top:...;background:${color};opacity:${shapeOpacity};border-radius:2px;"></div>`;
  }
  ```
- Live canvas patcher (`packages/web-preview/src/client/hooks/useInstantPatch.ts:803-819`)
  styles a `<div>` child whose template assumes a fixed-height bar.

The overlay schema and the MCP tool surface offer no
`shapeStrokeWidth` / `shapeThickness` field. Annotations (a sibling
primitive) already expose `strokeWidth` (`packages/web-preview/src/client/components/Sidebar/EffectsTab.tsx:108` and `:252`) so the agent
prompt user is right to expect parity.

### User impact

Every line overlay renders at the same 4 px. Mixed-thickness compositions
(1 px hairline next to a 6 px stem) are not expressible. The agent has
no field to set; the UI sidebar's shape panel (`ElementsTab.tsx:231`)
exposes only `shapeType`.

### Proposed implementation

Add `shapeStrokeWidth: z.number().min(1).max(30).optional()` to
`overlaySchema` (`packages/core/src/config/schema.ts:265`). Default to
`4` to preserve current visuals when the field is absent.

Then:

1. Renderer (`injectors.ts:174`): use the new field in the inline
   style, falling back to 4. Adjust the `margin-top` math to keep the
   line vertically centred regardless of thickness.
2. Live patcher (`useInstantPatch.ts:803`): mirror the same fallback
   so drag updates feel instant.
3. UI: add a `RangeSlider label="Line thickness" min={1} max={30}`
   inside `ElementsTab.tsx` next to the existing shape controls, gated
   on `ov.shapeType === 'line'`. Annotation tab already shows the
   pattern (`EffectsTab.tsx:252`).
4. MCP: add `shapeStrokeWidth: { type: 'number', minimum: 1, maximum: 30 }`
   to `OVERLAY_FIELD_SCHEMA`
   (`packages/mcp/src/tools/overlay.ts:14`) so agents can set it via
   `add_overlay` / `update_overlay`. Mention in the tool description
   that it only applies when `shapeType === 'line'`.

Arrow shapes use an SVG `<g>` (not a `<div>`); applying
`shapeStrokeWidth` there is a follow-up — out of scope unless the
implementation cost is trivial.

### Acceptance criteria

- New field round-trips through write/read with no migration code
  needed (optional + default keeps old envelopes loading unchanged).
- `add_overlay { shapeType: "line", shapeStrokeWidth: 1 }` produces a
  hairline; `shapeStrokeWidth: 12` produces a thick bar.
- UI slider only appears for lines; switching to circle/rectangle
  hides it.
- Live drag updates the rendered thickness without a save/reload.

### Estimated complexity

**S** — additive schema change, two render paths to touch, one new
slider, one MCP field. Mostly mechanical.

---

## Gap 4: Icon catalog scope

### Current behavior

`/api/elements/icons/catalog`
(`packages/web-preview/src/routes/elements.ts:79-87`) returns the full
Lucide catalog from `lucide-static/tags.json` — every icon Lucide
ships, with their tag list, in one payload. So the catalog itself
isn't truncated.

What IS limited:

1. **No MCP discovery surface.** The browser UI lists icons via the
   HTTP endpoint, but there is no `list_icons` MCP tool. The CLAUDE.md
   "Discoverable IDs" rule (`CLAUDE.md` §"MCP for AI agents") is honored
   for frames / fonts (`list_frames`, `list_fonts`) but not icons. An
   agent has to guess `iconRef` strings, then fail at add-time when
   the icon doesn't exist (the bake path added in PR #59 catches this
   for `lucide:` with a clear error, but discovery still belongs
   up-front).
2. **Single source only.** The infrastructure (curated `arrows/` and
   `blobs/` sources under `packages/web-preview/data/`, see
   `elements.ts:115`) shows the pattern for adding other libraries —
   but no second icon library is bundled.
3. **No alias / brand surface.** Lucide doesn't ship brand glyphs
   (Slack, GitHub, X). Adding Simple Icons or a comparable
   permissively-licensed brand set is a known want.

### User impact

Agents writing `add_overlay { iconRef: "lucide:bubble" }` (no such
icon) get an HTTP 404 from the icon-fetch path. Users searching the UI
for "burst" find nothing because Lucide names that shape "sparkles",
not "burst". Multiple expected variants (filled vs stroked, comic-style
sparkles, brand marks) aren't reachable at all.

### Proposed implementation

Phase 1 — discovery, no new icons:

- Add `list_icons` MCP tool that proxies `/api/elements/icons/catalog`,
  returns `{ icons: [{ name, tags, categories }] }`. Mirror the
  per-page pagination of `list_assets`
  (`packages/mcp/src/tools/asset.ts:151`) so a 1500-item payload
  doesn't blow the response budget — accept `query?`, `category?`,
  `limit?`, `offset?`. Wire it into the `index.ts` catalog
  (`packages/mcp/src/tools/index.test.ts:53` will catch missing
  registrations).
- Update `add_overlay`'s tool description to point at `list_icons`
  ("Call `list_icons` first to find a valid `name`. The full Lucide
  catalog (~1500 icons) is searchable by tag.").

Phase 2 — additional libraries (defer pending demand signal):

- Decide which second library to bundle (Phosphor, Heroicons, Simple
  Icons). License compatibility for each is documented; pick one that
  fits screenshot-marketing iconography.
- Add it under `packages/web-preview/data/icons-<source>/` with the
  same recolor strategy if it uses `currentColor`, or a per-library
  recolor function.
- Extend `iconRef` parser in
  `packages/mcp/src/tools/overlay.ts:resolveIconImageDataUrl` to
  branch on the source prefix.

### Acceptance criteria

Phase 1:
- `list_icons` returns the full Lucide catalog with search + category
  filter; the catalog tool's response shape is stable enough that an
  agent can cache and re-query without surprise.
- `add_overlay` tool description references it.

Phase 2 (per added library):
- `add_overlay { iconRef: "<library>:<name>" }` produces an overlay
  that renders correctly.
- `list_icons { source: "<library>" }` surfaces names from that
  library.

### Estimated complexity

Phase 1: **S** — one MCP tool, no new client code (proxies an
existing HTTP endpoint), small description tweak. Phase 2: **M per
library** — adding the library, licensing diligence, and the recolor
adapter is the bulk of the work.

---

## Gap 5: `rotation` on MCP `add_overlay` [NOT A GAP]

### Current behavior

`OVERLAY_FIELD_SCHEMA.rotation` (`packages/mcp/src/tools/overlay.ts:74`)
is already exposed:

```ts
rotation: { type: 'number', minimum: -180, maximum: 180 },
```

and the tool description (`overlay.ts:119`) mentions "rotation -180 to
180". It applies to every overlay type — icons included — because the
renderer reads `rotation` off the wrapper (`injectors.ts:185` and
`useInstantPatch.ts:783`), not the inner content.

### User impact

None. The agent reporting this gap likely missed it in the schema. The
existing tool description does name the field but tucks it inside a
prose block; promoting it to a clearer position in the description
would help future readers without changing behavior.

### Proposed implementation

Documentation-only: split the prose description into a bulleted
"positioning" section so `x`, `y`, `size`, `rotation`, and `opacity`
are visually scannable. No schema change.

### Acceptance criteria

- The `add_overlay` description renders the per-field block as a list
  in the MCP catalog dump (`get_help` output).
- A regression that's worth catching: add a test asserting the
  `add_overlay` descriptor surfaces `rotation` in `properties` so a
  future trim doesn't quietly drop it.

### Estimated complexity

**S** — description copy + a one-line test.

---

## Prioritization

Ship order, by reader value vs cost:

1. **Gap 4 Phase 1 — `list_icons` MCP tool.** S. Highest agent-side
   leverage: agents stop guessing names; the failure-to-render path
   (already error-handled in the lucide bake) becomes rare.
2. **Gap 2 — line thickness.** S. Additive schema field, two render
   paths, one slider. Covers the speed-line use case directly.
3. **Gap 5 — description polish.** S. Bundle with Gap 2's PR since
   both touch the `add_overlay` description.
4. **Gap 1 — line size floor.** M. Legacy-data migration is the only
   real risk; gate behind a fixture round-trip test. Ship after Gap 2
   so thickness control exists before small sizes hit the canvas.
5. **Gap 4 Phase 2 — additional library.** M per library. Only pick
   up given a concrete library + use case request.
