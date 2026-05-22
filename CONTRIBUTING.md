# Contributing to appframe

Hey! Thanks for thinking about contributing. appframe is an open-source tool for generating App Store and Play Store screenshots, and it's still small enough that every PR meaningfully shapes the direction. This doc is here so your contribution lands cleanly and stays in line with where the project is going.

## What appframe is (and isn't)

appframe is a local, project-based tool: open it, drop in screenshots, get polished store-ready output. Two surfaces matter:

- **The web UI** at `http://localhost:4400` for humans editing screens by hand.
- **The MCP server** (`packages/mcp/`) so AI agents can observe and edit a running preview.

What we're not building:

- Live API integrations for backgrounds (no Unsplash, no AI generation). Curated bundled assets are welcome.
- Account-bound publishing flows (App Store Connect uploads, etc.)

## Issues vs PRs

Bug reports and feature ideas are welcome as issues, no friction. That said, if you've identified something you want to see and you can code it, **opening a PR is more useful than opening an issue and waiting**. This is a small project and I'm maintaining it alongside other things, so a PR with a working implementation moves a lot faster than a request that ends up in my queue.

For trivial fixes (a typo, an obvious bug, a small dep bump), PR directly. For larger work, you can still open an issue first if you want a sanity check on the approach, but it's not required.

## Quick start

```bash
git clone https://github.com/andresdefi/appframe.git
cd appframe
pnpm install
pnpm build
pnpm preview
```

That opens the editor at `http://localhost:4400`. Requires Node 20.19+, 22.13+, or 24+.

A few sharp edges worth knowing:

- After **server-side TypeScript** changes: rebuild + restart the preview. `pnpm --filter @appframe/web-preview exec tsc && lsof -ti :4400 | xargs kill && pnpm preview &`
- After **client-side** changes: `pnpm --filter @appframe/web-preview build:client` and then hard-refresh (`Cmd+Shift+R`) because the client assets ship with immutable cache headers.
- `pnpm preview` errors out until `pnpm build` has run once. The server reads from `packages/web-preview/dist/` and `packages/web-preview/client-dist/`, both git-ignored.

## Project structure

- `packages/core/` - config loading, the Nunjucks template engine, the render pipeline, frame asset management. No DOM, no React.
- `packages/web-preview/` - the local Vite-built UI plus the Express server. Depends on core.
- `packages/mcp/` - the agent-facing MCP server. Wraps the web-preview HTTP API as MCP tools.
- `frames/` - device frame SVG/PNG assets with a manifest. Each frame is content-addressed.
- `fonts/` - bundled open-source fonts.

## The non-negotiables

These are the rules we genuinely won't bend on, because each one is anchored to a past incident or a load-bearing architectural decision. If your PR violates one, the review will block until it's fixed.

- **Agent writes target the rich envelope, never the slim config.** The MCP and any future out-of-band writer must go through `POST /api/projects/:slug/patch-screen` (the rich editor-state shape). Never write to `/api/config` (the slim `AppframeConfig`). Round-tripping through the slim form loses callouts, gradients, spotlight flags, shadow toggles, and similar. See the "MCP for AI agents" section in `CLAUDE.md` for the full story.
- **Hydrate, never re-init.** When refreshing the browser's editor state from disk (SSE-triggered reload, project switch, locale switch), use `hydrateProjectSnapshot`. Never call `initScreens` outside the boot path. `initScreens` reads theme defaults and is destructive to in-memory state.
- **Atomic file writes.** Project state on disk is written via temp-file + rename. If you add a new persistence path, follow the same pattern.
- **Slim persistence.** `appframe.json` strips any field that matches `STATIC_SCREEN_DEFAULTS` at save time and re-injects on load via `fattenScreen`. New screen fields should add a default there if they have a reasonable static fallback. Don't bypass this.
- **No magic `default` slug.** Project slugs are validated. The codebase deliberately doesn't fall back to a magic name. First-launch auto-creates `Untitled 1` instead.
- **Don't add fallbacks for impossible states.** Validate at system boundaries (user input, external APIs, MCP arguments). Trust internal code. Don't add defensive checks for cases the type system already guarantees.

For the full architectural picture, read `CLAUDE.md` before opening a non-trivial PR. It captures the "why" behind a lot of decisions that aren't obvious from the code alone.

## Code conventions

- TypeScript strict mode. ESM modules everywhere. Named exports only.
- Functional and declarative patterns over class hierarchies.
- `import type` for type-only imports (enforced by `verbatimModuleSyntax`).
- Default to writing no comments. When you do write one, explain the WHY (a constraint, a workaround, a non-obvious invariant), not the WHAT. Don't reference the current PR or issue in a comment - that context rots.
- No emojis in code or output unless something explicitly asks for them.
- Use regular hyphens, not em dashes.
- Don't add backwards-compatibility shims for code paths nobody uses anymore. If something is dead, delete it.

## UI / UX bar

appframe is a visual tool. The bar for anything user-facing is "feels polished, smooth, professional." Concretely:

- Animate only compositor properties (`transform`, `opacity`). Don't animate `blur()` or `backdrop-filter` on large surfaces.
- Use `h-dvh`, not `h-screen`. Respect `safe-area-inset` for fixed bottom elements.
- Accessible primitives for keyboard / focus. Don't block paste in inputs.
- Errors next to the action that caused them. Confirmation dialogs for destructive actions.
- Empty states need one clear next action.

**Any PR that changes something a user can see MUST include screenshots.** Before/after where it makes sense. For features that involve a flow (drag interactions, multi-step setups, animations), a short screen recording is strongly encouraged but not mandatory. Screenshots are required because text descriptions can't convey visual change accurately - the reviewer needs to see what landed without checking out the branch.

This applies to: sidebar controls, preview rendering, dropdowns, color pickers, export output, anything that shows up in the UI. Skip it only for purely backend work (renderer internals, MCP plumbing, server routes, build config) where there's literally nothing visual to show.

## MCP contributions

The MCP server is a primary product surface, not a side project. Make it as good as the web UI. The rules:

- **Cover the UI surface.** Every editable field reachable in the UI should be reachable from `patch_screen` or an ergonomic helper.
- **Discoverable IDs.** Any tool that takes an opaque ID (a frame, a font, a callout, an overlay) needs a corresponding `list_*` or `get_*` tool so the agent can find valid values without guessing.
- **Merge, don't replace.** Partial-field helpers (`set_spotlight`, `update_callout`, etc.) must read the current screen first and shallow-merge so the agent can tweak one field without resending the rest.
- **Tool descriptions must name units** (px vs %, fractions vs %), defaults, and valid enum values. Point to the `list_*` the agent should call first.
- **Smoke-test end-to-end.** Don't claim an MCP tool is done without a disk-state diff that round-trips through revert cleanly. The integration test in `packages/mcp/src/integration.test.ts` shows the pattern.

## Testing

- Unit + integration tests live next to source files as `*.test.ts` and run via `vitest`.
- Run `pnpm test` before opening a PR. CI runs the same thing on Node 20 and 22.
- `pnpm typecheck` should be clean across all packages.
- For UI changes, manual verification in the browser is required (see the UI/UX bar above).
- New tests aren't required for every change, but if you're changing behaviour that's already covered, don't drop the coverage.

## Pull request process

- Branch from `main`. Name it something descriptive (`feat/locale-export`, `fix/spotlight-blur`, `chore/bump-tiptap`).
- Conventional commit prefixes: `feat(scope):`, `fix(scope):`, `chore:`, `docs:`, `refactor(scope):`, `test(scope):`. The scope is usually the package: `core`, `preview`, `mcp`.
- One feature per PR. Refactors that touch unrelated areas should be their own PR.
- CI must be green before merge. Three required checks: `build-and-test (20.19.0)`, `build-and-test (22.13.0)`, CodeQL.
- If you used an AI assistant, add it as a `Co-Authored-By:` trailer in the commit. Don't hide it.
- Force-pushes are fine on your own branch before merge. Once merged to `main`, the branch is deleted automatically.

## Reporting security issues

Don't open a public issue for a security vulnerability. Use [GitHub Private Vulnerability Reporting](https://github.com/andresdefi/appframe/security/advisories) (link is in the Security tab). We'll respond within a few days and coordinate disclosure.

## Recognition

Every contribution is welcome and every contributor is credited. If your PR lands, you're part of how appframe ships.
