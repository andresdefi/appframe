# appframe

Open-source tool for generating professional App Store & Play Store promotional screenshots.

## Tech Stack
- TypeScript (strict mode) with Node.js
- pnpm monorepo with 5 packages: core, cli, mcp-server, web-preview, store-upload
- Playwright for HTML-to-PNG rendering
- Nunjucks + Tailwind CSS for templates
- Commander.js for CLI
- YAML for per-app config files

## Code Conventions
- ESM modules (`"type": "module"`) everywhere
- Named exports only
- Functional patterns preferred
- Types defined in dedicated schema files, imported with `type` keyword
- `import type` enforced by TypeScript (`verbatimModuleSyntax`)

## Project Structure
- `packages/core/` — Config loading, template engine, rendering pipeline, frame management
- `packages/cli/` — Commander.js CLI, depends on core
- `packages/mcp-server/` — MCP server for AI agent integration, depends on core
- `packages/web-preview/` — Vite-based local preview UI, depends on core
- `packages/store-upload/` — App Store Connect + Google Play API upload, depends on core
- `frames/` — Device frame SVG/PNG assets with manifest.json
- `fonts/` — Bundled open-source fonts
- `examples/` — Example app configs and screenshots

## Build
- `pnpm build` — Build all packages
- `pnpm dev` — Watch mode for all packages
- `pnpm lint` — ESLint
- `pnpm format` — Prettier

## Testing
- Vitest for unit and integration tests
- Test files co-located: `*.test.ts` next to source files

## TODO

### Individual-mode UI inspection not yet done
The 2026-04-20 pass reviewed the Platform / Screenshot / Device Frame / Device Layout / Device Shadow / Composition / Background / Text tabs end-to-end and landed a batch of fixes. Still un-inspected in that depth:
- **Extras tab** — spotlight, annotations, loupe, callouts, overlays. Likely has dead or confusing controls (especially now that autopilot is gone). Do the same "drag each slider, check each toggle, report what feels wrong" pass.
- **Download (Export) tab** — current state: Download current screen + Download all N. Needs pass to check per-size/per-locale options, progress UX, and whether file naming makes sense.
- **Panoramic mode** — entire mode untouched this session. Sidebar tabs differ (`PanoramicTab`, `PanoramicEffectsTab`). Inspect with the same lens.

### before.click gap list → editing primitives (task #16)
Captured earlier: layer system, rich-text headlines, split / banded backgrounds, device bleed-off-canvas, multi-device collage, text-pattern backgrounds, z-order control. Pick the top 3–5 and scope a plan.

### Agent skill (task #17)
Rewrite `skills/appframe-screenshots/SKILL.md` from scratch using before.click vocabulary. The old one was deleted alongside autopilot — the new one should describe the agent-drives-design-appframe-renders flow and the editing primitives the agent should reach for.

### Remove remaining `style` field (Phase B.2)
`STYLE_PRESETS` was flattened to a single BASELINE; the enum `style: TemplateStyle` still carries 47 call sites through schema / engine / client. Removing it cleans up dead surface area. Not urgent since everything resolves to BASELINE, but it's lingering debt.

### 3D Frame Style (disabled, needs fix)
The `frameStyle: '3d'` option is implemented but disabled from the UI (removed from the Frame Style dropdown in `packages/web-preview/public/index.html`). The goal is to make devices look like real 3D objects with visible side edges, metallic bezels, and depth — similar to App Store promotional screenshots from apps like Coinbase or Kraken.

**What exists:**
- `templates/_base/3d-effects-css.html` — CSS for preserve-3d, metallic bezel overlays, screen glare, and 3D side edges (rotateY/rotateX transforms)
- `templates/_base/3d-device-body-open.html` — Opens a `.device-face` wrapper that receives the drop-shadow filter
- `templates/_base/3d-effects-overlays.html` — Closes `.device-face`, adds side edge divs as siblings in the 3D context
- All 7 template `base.html` files include these partials and have a `frameStyle == '3d'` shadow condition
- `frameBorderRadius` added to `FrameDefinition` type and `frames/manifest.json`

**The core problem:**
CSS `filter` (drop-shadow) on the same element as `transform-style: preserve-3d` forces 3D flattening — they must be on separate elements. Three approaches were tried:
1. Pure CSS overlays (no preserve-3d) — looked flat, no actual side edges
2. Split wrapper (device-wrapper for shadow, device-body for 3D rotation) — canvas background bled through because the rotated child no longer fills the parent
3. Inner face wrapper (device-wrapper keeps original transform + preserve-3d, device-face gets filter, side edges as siblings) — rendered correctly in HTML/CSS output but visually still appeared flat in Playwright screenshots

**To re-enable:** Add `<option value="3d">3D</option>` back to the Frame Style dropdown in `packages/web-preview/public/index.html`.
