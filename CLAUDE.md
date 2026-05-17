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
- `pnpm build` — Build all packages
- `pnpm dev` — Watch mode for all packages
- `pnpm test` — Vitest across all packages
- `pnpm typecheck` — `tsc --noEmit` across all packages
- `pnpm lint` — ESLint
- `pnpm format` — Prettier
- `pnpm preview` — Start the local web UI at http://localhost:4400

## Testing
- Vitest for unit and integration tests
- Test files co-located: `*.test.ts` next to source files
- After **server-side TS** changes, rebuild + restart: `pnpm --filter @appframe/web-preview exec tsc && lsof -ti :4400 | xargs kill && pnpm preview &`
- After **client-side** changes, rebuild + hard-refresh browser: `pnpm --filter @appframe/web-preview build:client` then Cmd+Shift+R (client-dist assets ship with `immutable` cache headers)

## Project storage
Each user project lives at `~/Documents/appframe/projects/<slug>/` and contains two files, both written atomically (`.tmp` + rename):

- **`appframe.json`** — full project state (screens, variants, panoramic data). Persisted **slim**: any field matching `STATIC_SCREEN_DEFAULTS` (see `utils/screenSerialization`) is stripped at save time and re-injected at load time via `fattenScreen`. Theme-derived fields (font, colors, etc.) are intentionally NOT in the defaults set — they snapshot-at-creation, diverge from the theme afterward, and need to round-trip exactly.
- **`meta.json`** — small index (displayName / createdAt / lastOpenedAt / savedAt). `listProjects` reads only this; never parses `appframe.json` to populate the picker.

No magic `default` slug anywhere. First-launch auto-creates an `Untitled 1` project with 3 placeholder screens.

## Export
"Download all N screens" produces a single ZIP via `bundleAsZip` (no per-file browser downloads — Chrome / Safari throttle those after ~3 from the same origin and they can't carry folder structure). ZIP layout puts files at the archive root; macOS Archive Utility auto-wraps in a folder named after the ZIP. Multi-locale will prefix `relPath` with `${locale}/` (no other code change needed). "Download screen X" stays on the single-file browser-download path.

## TODO

### Individual-mode UI inspection not yet done
The 2026-04-20 pass reviewed Platform / Screenshot / Device Frame / Device Layout / Device Shadow / Composition / Background / Text tabs. Extras and Download were audited later. Still un-inspected in that depth:
- **Variants tab** — never deeply reviewed. The variant cards / grid + the approval / artifact flow.
- **Panoramic mode** — entire mode untouched. Sidebar tabs differ (`PanoramicTab`, `PanoramicEffectsTab`).

### Background catalog is intentionally local-only
The Background tab ships with a curated catalog (50 solid colors + 66 gradients across Sunset / Ocean / Cosmic / Aurora / Vivid / Pastel / Glow / Mesh categories). Plus user image upload. **No live API integrations are planned** — no Unsplash search, no AI-generated backgrounds. Those would balloon the scope (API keys, licensing complexity, asset hosting, backend dependencies) without changing the core value-add.

What IS open: **bundled high-quality image / texture / photo presets** added directly to the repo as static assets (license-cleared, hand-curated, no runtime API). New categories like "Photo", "Texture", "Abstract" can be added the same way the existing Solid/Gradient categories work.

### Multi-locale screenshot sets
Plan in `docs/multi-locale-screenshot-sets.md` (revised 2026-05-18). Phase 5 export infrastructure (ZIP bundling, folder layout, per-project slug naming) already shipped ahead of time — see commit `8121361`. Phases 1–4 + 6 still open: data layer + locale-picker UI, stacked-rows canvas, sidebar scoping + text-edit routing, per-locale screenshot upload, OpenAI auto-translate + xcstrings removal. ~5.5–7.5 sessions total.

### before.click gap list → editing primitives
Captured earlier: layer system, rich-text headlines, split / banded backgrounds, device bleed-off-canvas, multi-device collage, text-pattern backgrounds, z-order control. Pick the top 3–5 and scope a plan.

### Agent skill
Rewrite `skills/appframe-screenshots/SKILL.md` from scratch using before.click vocabulary. The old one was deleted alongside autopilot — the new one should describe the agent-drives-design-appframe-renders flow and the editing primitives the agent should reach for.

### Device frames — quality pass needed
Current frames are not up to standard. 3D frame style was removed in the 2026-05-14 hygiene pass. Asset sourcing is the real blocker: appframe is MIT-licensed, so bundled frame PNGs need a permissive license — most paid packs (Angle, Rotato, Mockuuups) forbid redistribution. The Koubou-style external-installable pattern (already used for iPad / Mac / Watch frames) is one escape hatch; commissioning original renders is the other. When picked up: design the approach first, don't resurrect the old `frameStyle == '3d'` runtime path — anything new should ship as part of the frame definitions / SVGs.
