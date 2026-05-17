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
The 2026-04-20 pass reviewed the Platform / Screenshot / Device Frame / Device Layout / Device Shadow / Composition / Background / Text tabs end-to-end and landed a batch of fixes. Later sessions inspected the **Extras** tab and audited / restructured the **Download (Export)** tab. Still un-inspected in that depth:
- **Variants tab** — never deeply reviewed. The variant cards / grid + the approval / artifact flow.
- **Panoramic mode** — entire mode untouched this session. Sidebar tabs differ (`PanoramicTab`, `PanoramicEffectsTab`). Inspect with the same lens.

### Background catalog is intentionally local-only
The Background tab ships with a curated catalog (50 solid colors + 66 gradients across Sunset / Ocean / Cosmic / Aurora / Vivid / Pastel / Glow / Mesh categories). Plus user image upload. **No live API integrations are planned** — no Unsplash search, no AI-generated backgrounds. Those would balloon the scope (API keys, licensing complexity, asset hosting, backend dependencies) without changing the core value-add.

What IS open for the catalog: **bundled high-quality image / texture / photo presets** added directly to the repo as static assets (license-cleared, hand-curated, no runtime API). New categories like "Photo", "Texture", "Abstract" can be added the same way the existing Solid/Gradient categories work — sourced upstream, organized by category, rendered as preset tiles in the catalog. The Image preset type can store either a data URL (current user-upload path) or a bundled asset URL.

### Client-side export (deferred)
The web UI currently exports via Playwright on the server. For a future hosted version of appframe, the export should move client-side (html-to-image style) to avoid per-export Chromium boots and server queue pressure. Full plan + phasing + open questions in `docs/client-side-export-plan.md`. Trigger to pick this up: hosted-version decision, or export speed becomes a top complaint.

### Multi-locale screenshot sets (deferred)
The current locale model is text-overlay only (one shared `screens` array, headlines swapped per locale) and relies on an OpenAI translation backend. The desired model: independent screen sets per locale, each with its own device screenshots and copy. The Locale dropdown in the Export tab has been hidden until this lands. Full plan + data-model change + phased rollout in `docs/multi-locale-screenshot-sets.md`. Couples naturally with the client-side-export work since both touch the rendering pipeline.

### before.click gap list → editing primitives (task #16)
Captured earlier: layer system, rich-text headlines, split / banded backgrounds, device bleed-off-canvas, multi-device collage, text-pattern backgrounds, z-order control. Pick the top 3–5 and scope a plan.

### Agent skill (task #17)
Rewrite `skills/appframe-screenshots/SKILL.md` from scratch using before.click vocabulary. The old one was deleted alongside autopilot — the new one should describe the agent-drives-design-appframe-renders flow and the editing primitives the agent should reach for.

### Device frames — quality pass needed
Current frames are not up to standard. 3D frame style was removed in the 2026-05-14 hygiene pass (templates, schema value, store shim, engine branch, frameBorderRadius field, manifest entries — all gone). The replacement plan for visible-edge / depth / metallic-bezel devices is open. When picked up: design the approach first, do not resurrect the old `frameStyle == '3d'` path — it had a structural problem (CSS `filter` + `transform-style: preserve-3d` on the same element flattens 3D; the inner-face wrapper workaround rendered correctly in CSS but still looked flat in Playwright). Anything new should ship as part of the frame definitions / SVGs, not as a runtime style flag.
