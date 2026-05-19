# Codex review action plan

Status: open. Drafted 2026-05-19 after Codex reviewed the project and found 8 issues across security, code health, and product quality. Items verified against the actual codebase in the planning session — Codex sometimes hallucinates file locations; this doc lists only what's real.

This is a self-contained brief for a future Claude Code session. Start a new session and tell Claude: "read `docs/codex-review-plan.md` and implement it."

## Hard constraints

1. **No breaking changes.** Every commit ships independently green — `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all pass before commit, plus user live-test against `localhost:4400` before commit lands.
2. **One logical fix per commit.** No "and while I was there." Coherent, reversible units.
3. **Hand to user for live verification before each commit.** Workflow established in the prior session: implement → typecheck/lint/test/build → restart preview → user tests in Safari → user confirms → commit + push → next item.
4. **Tests where they meaningfully verify behavior** — regression tests for the fixes that catch real bugs. Skip tests for purely mechanical changes (e.g. adding a CLI flag) where the cost outweighs the value.

## Findings — verified

| # | What | Where | Severity | Notes |
|---|---|---|---|---|
| **H1** | Permissive CORS + binds to 0.0.0.0 | `server.ts` lines 119 + 200; mutating routes in `projectStorage.ts`, `config.ts` | **High** (security) | Any website you visit can fetch/mutate/delete local projects via JS while the preview server is running. Any LAN client can too. |
| **H2** | Client TypeScript not covered by root typecheck; currently fails | Root `tsconfig.json` line 7 (excludes `src/client/**`); `package.json` runs `typecheck:client` separately and CI doesn't | **High** (process gap) | Real type errors in `previewBody.ts`, `previewBody.test.ts`, and unrelated client code are sitting on `main`. CI is green because client typecheck never runs. |
| **H3** | `makeId` used but not imported in `store.ts:780,800` | `recordVariantArtifact` after Download | **High** (runtime crash) | Throws `ReferenceError` when an artifact is recorded after a successful export. Latent because it hasn't fired in user testing yet, but it will. |
| **M1** | Duplicate project doesn't rewrite screenshot URLs | `projectStorage.ts:535` (`duplicateProject`) | **Medium** | After duplicating, the new project still references `/api/screenshots/<old-slug>/...`. Deleting/renaming the original breaks the duplicate. Rename already rewrites correctly at `projectStorage.ts:497`; duplicate just `cp`s the dir. |
| **M2** | Panoramic background image layers miss preview-resize | `previewBody.ts:206-207` — code reads `layer.src`; schema uses `layer.image` | **Medium** (perf regression I introduced) | The previous session's preview-resize work doesn't actually apply to panoramic background image layers because the field name was wrong. Full-res images still load in the live panoramic iframe. |
| **M3** | ZIP bundling re-compresses already-compressed PNGs | `zipExport.ts:41` uses DEFLATE level 6 | **Medium** (CPU/time) | Multi-locale exports burn extra CPU for ~0% size benefit. PNGs are already DEFLATE-compressed internally. |
| **M4** | Lint excludes TSX | `package.json:10-12` runs ESLint on `packages/*/src/**/*.ts` only | **Medium** (process gap) | Most of the actual UI code is TSX and isn't linted. Hides unused imports / React patterns. |
| **P1** | Variants have no visual preview AND today's "+" silently snapshots current state | `VariantsTab.tsx:12` hardcodes thumbnails to `null`; `store.ts:599` `createVariant` captures current state instead of starting fresh | **Product gap + UX mismatch** | Intended mental model: variants are alternate canvases; "+" should prompt fresh-vs-duplicate; comparison needs thumbnails to work. Scoped in phase 9 below. |

### Bonus errors uncovered by H2 (real client typecheck output)

When H2 lands and we run `typecheck:client` properly, these errors must also be fixed before the gate turns green:

- `previewBody.test.ts:237, 265, 298` — fixture passes `height` on `type: 'device'` panoramic element; device variant doesn't have a `height` field. Wrong fixture.
- `previewBody.test.ts:292` — fixture passes `width` on `type: 'text'`; text variant doesn't have `width`.
- `previewBody.test.ts:319` — asserts a panoramic background layer has a `src` field; only image layers do, and the field is actually `image` (see M2).
- `previewBody.ts:168` — discriminated-union recursion in `rewritePanoramicElementsForPreview` is hitting two different `PanoramicElement` types (client vs core re-export); TS sees them as unrelated because of the structural import path.

These are all mine from the preview-resize work and the locale snapshot fixes. Sloppy because I never ran `typecheck:client` while building.

## Implementation order

Sequencing matters: fix the runtime/security bugs first because they affect real users; fix the CI gap last because it'd otherwise block every PR until the long tail of client errors is resolved.

### Phase 1 — High: makeId import + crash test (H3)

Smallest commit, highest immediate value. Add `makeId` to the existing import block in `store.ts` (line 26-29 or 32-42, the storeSnapshots imports). Add a focused test in a new or existing store test file that exercises `recordVariantArtifact` and asserts no exception.

Files: `packages/web-preview/src/client/store.ts`; new test or addition to `storeSnapshots.test.ts`. ~10 line code change + ~20 line test.

### Phase 2 — High: server security hardening (H1)

Two parallel changes in `server.ts`:

1. **Bind to localhost by default.** `app.listen(port, '127.0.0.1', ...)`. Add a `--host` CLI flag (or `APPFRAME_HOST` env var) for users who really need LAN access. Default OFF.
2. **Restrict CORS.** Replace `app.use(cors())` with a function-based CORS config that only allows the preview origin (`http://localhost:<port>`) and rejects everything else. For internal calls (same-origin), no preflight is needed at all — Express already accepts them.

Optional but worth considering as part of this phase: a same-origin or token check on the mutating endpoints (`PUT /api/config`, `POST /api/screenshots/upload`, project create/delete/duplicate). The host bind + CORS lock already removes the practical attack surface; the token would be defense in depth.

Files: `packages/web-preview/src/server.ts`, possibly `packages/web-preview/src/bin.ts` for the CLI flag. New tests in `server.test.ts` to verify rejection of cross-origin requests and lack of LAN binding.

**Risk note:** binding to 127.0.0.1 only could break users who proxy localhost from another machine. Mention this in the commit + announce in the next release notes. Worth the trade-off — the current default is unsafe.

### Phase 3 — Medium: M2 (panoramic image-layer preview-resize)

I introduced this in commit `08b747c`. Fix:
- `previewBody.ts:206-207`: change `layer.src` → `layer.image`, and the spread on line 209 too.
- `previewBody.test.ts:319`: fixture should use `image` not `src`, and the layer kind union needs to be cast carefully.
- Confirm the schema field at `packages/core/src/config/schema.ts:229` is `image: z.string().min(1)`.

Files: `previewBody.ts`, `previewBody.test.ts`. ~5 lines code, ~10 lines test fix.

**Verify live**: load a project with a panoramic image background layer; confirm the network request hits `/api/screenshots/<proj>/.previews/...` not the full-res path.

### Phase 4 — Medium: M1 (duplicate project rewrites URLs)

In `projectStorage.ts:535`, after the `cp` call, read the duplicated `appframe.json`, run the existing `rewriteScreenshotProjectInJson(from, safeTo)` helper (already used by `renameProject`), and write back atomically.

Files: `packages/web-preview/src/projectStorage.ts`. Regression test in `projectStorage.test.ts`: duplicate a project with a screenshot URL, then verify the duplicated JSON references the new slug, not the original.

### Phase 5 — Medium: M3 (skip DEFLATE for PNG entries in ZIP)

In `zipExport.ts:41`, change `compression: 'DEFLATE'` to per-entry `STORE` for `.png` files and keep DEFLATE only for entries that benefit. JSZip's `file()` method accepts per-file `compression` options.

Files: `packages/web-preview/src/client/utils/zipExport.ts`, `zipExport.test.ts`. Benchmark: time a multi-locale 12-PNG export before and after; expect 30-50% faster zipping with negligible size change.

### Phase 6 — Process: fix the typecheck:client errors (the H2 prerequisites)

Before we can wire `typecheck:client` into CI (phase 7), the current errors must be cleared:

1. **`previewBody.test.ts` fixture cleanup**: remove `height` from device variant fixtures, remove `width` from text fixtures, change `src` to `image` on layer fixtures. ~5 line changes.
2. **`previewBody.ts:168` discriminated-union recursion**: the `PanoramicElement` is imported from `'../types'` which re-exports from `@appframe/core`. The recursion in `rewritePanoramicElementsForPreview` should use the same import path consistently. Either (a) annotate the children parameter explicitly with `PanoramicElement[]`, or (b) avoid the cast altogether by structuring the recursion to work on the union directly.
3. Any other client typecheck failures revealed once these are fixed.

Files: `previewBody.test.ts`, `previewBody.ts`. Could be split into 2-3 commits if errors come in distinct categories.

### Phase 7 — Process: wire client typecheck into root + CI (H2)

Once phase 6 has the client typecheck clean:

1. Add `typecheck:client` to the workspace's `typecheck` script so `pnpm typecheck` runs both server and client.
2. Verify CI picks it up (`.github/workflows/*.yml` already runs `pnpm typecheck`).

Files: root `package.json`, web-preview `package.json`. Trivial.

### Phase 8 — Process: include TSX in lint (M4)

Update `package.json:10-12` lint glob to include `*.tsx` and probably client tests too. Run lint locally, fix any new errors that surface (likely unused imports), commit.

Files: root `package.json`. Plus whatever lint cleanups the new scope surfaces — those are mechanical and grouped into one commit.

### Phase 9 — Variants: fresh-start creation + thumbnails (P1, scoped)

**Product spec (2026-05-19):**

User mental model — variants are named **alternate canvases** within a project. The user works on one variant, hits "+" to start a parallel attempt, and can flip between them to compare. Edits in one never affect another. Original is preserved.

What changes vs. today's code:

1. **Variant creation prompts the user with two paths.**
   - **"Start fresh"** — new variant initializes to 1 screen, default platform, placeholder text, no screenshots. (No screenshots: deliberate; if users push back later, switch to "inherit the default variant's screenshots." Park as a future option, don't pre-build.)
   - **"Duplicate current"** — fork the active variant's full state into a new one. This is today's `duplicateActiveVariant` flow, with the parent/branch-depth metadata it already produces.
2. **Existing `createVariant` (which silently snapshots the current state) gets removed or rewired.** The current "+" button in `VariantsTab.tsx` should open the prompt, not silently create a snapshot.
3. **Thumbnails on every variant card.** Captured on create, on duplicate, and on the user's "save" action for a variant (or on a debounced interval after edits, if save isn't an explicit thing). Without thumbnails the flip-between-to-compare model is too slow to be useful.

**Implementation sketch:**

- New store action `createBlankVariant(name?)`: builds a `ScreenState[]` of length 1 using `createScreenState(0, config, defaultPlatform)`, wraps in a `VariantRecord` via `buildVariantRecord` with `history: ['created (blank)']` and `provenance: { origin: 'blank' }`. Sets it active.
- Keep `duplicateActiveVariant` as is (already correct for the "fork this" path).
- Wire `VariantsTab.tsx`'s "+" to open a small popover/modal with the two options. UI: either a popover with "Start fresh" / "Duplicate current" buttons, or two adjacent toolbar buttons. Implementing session picks based on what fits the existing sidebar style.
- Thumbnail capture: re-use `modern-screenshot`'s `domToPng` (already a dep, already lazy-loaded). Capture from the active screen's iframe at low resolution (e.g., 240px wide), store as a data URL on the `VariantRecord.thumbnail` field. Persist in the project file like any other variant field.
- `VariantsTab.tsx:12` removes the hardcoded `null`; reads `variant.thumbnail` instead. The fallback "No preview rendered yet" stays as the empty state for variants created before this lands or when capture fails.

**Files:**
- `packages/web-preview/src/client/store.ts` — new action, possibly rewire of existing `createVariant`
- `packages/web-preview/src/client/storeFactory.ts` — fresh-state builder
- `packages/web-preview/src/client/storeSnapshots.ts` — `VariantRecord` type gets a `thumbnail?: string` field; `variantSnapshotFromState` + `applyVariantSnapshot` cope with the new field
- `packages/web-preview/src/client/components/Sidebar/VariantsTab.tsx` — the "+" UI + the card thumbnail rendering
- Tests: store actions for blank-creation, persistence round-trip including the thumbnail field

**Risk areas:**
- `VariantRecord` shape change ripples through serialization. Migration in `coerceVariantSnapshot` should treat missing `thumbnail` as `null` so old projects load fine.
- Thumbnail capture costs CPU. Capture on create/duplicate (one-time, fine). On edit-save (debounced, fine). Don't capture on every render.
- Storing thumbnail data URLs in the project file inflates `appframe.json` modestly (~10-30 KB per variant). Acceptable.

**Verification:**
- Click "+" → see the two-option prompt.
- "Start fresh" → variant appears with 1 screen, placeholder text, no screenshots, default platform.
- "Duplicate current" → variant appears as a copy of the active one.
- Each variant card in the Variants tab shows a thumbnail.
- Switch between variants → each preserves its own state.
- Close + reopen project → thumbnails still there, state still split per variant.

**Effort:** ~1 day of focused work; deferred to its own commit (probably 2-3 logical commits: store changes, UI changes, persistence/migration).

## Commit cadence

Aim for one commit per phase. Phase 6 may split into 2-3 commits if the client errors are heterogeneous. Each commit:

1. Implement the fix.
2. `pnpm typecheck && pnpm lint && pnpm test && pnpm --filter @appframe/web-preview build:client` — all green.
3. Restart `pnpm preview`.
4. Hand to user for live verification of the specific behavior.
5. On confirmation: commit with a message describing what + why, then push.

Total: 9-12 commits across phases 1-9. Roughly 1.5 days of focused work: phases 1-8 are half a day; phase 9 (variants rework) is the bigger ~1 day chunk.

## What stays out

- **Any other new product features**: this plan is defect + process + the single scoped product change (variants in phase 9). Anything else gets its own brief.
- **Big architectural changes**: option C from `parent-doc-rendering-plan.md` is independent of this work. Don't touch.
- **Touching the multi-locale snapshot model**: nothing here changes how `localeScreens` / `localePanoramicElements` work. The H3 fix is a one-line import addition. M2 is purely a URL-rewrite path. Etc.

## Verification checklist for the implementing session

Before declaring this plan done, the following must all be true:

- [ ] H1: `curl -i http://localhost:4400/api/config -H "Origin: https://evil.example"` returns CORS-blocked or 4xx
- [ ] H1: `nc -z <LAN-IP> 4400` from another machine on the LAN refuses connection (default config)
- [ ] H2: `pnpm typecheck` (root) covers client code; CI passes after the change
- [ ] H3: triggering a Download produces no console error; the artifact record persists
- [ ] M1: duplicate a project with screenshots; the duplicated `appframe.json` references the new slug
- [ ] M2: load a project with a panoramic image background layer; iframe loads `.previews/` URL not full-res
- [ ] M3: time a 12-PNG export before/after; faster with no visual diff in output ZIP
- [ ] M4: `pnpm lint` flags an introduced `tsx`-only error (sanity check that scope expanded)
- [ ] P1: "+" in Variants tab prompts "Start fresh" vs "Duplicate current"
- [ ] P1: Start fresh produces 1 screen, default platform, placeholder text, no screenshots
- [ ] P1: Duplicate current produces a fork of the active variant's full state
- [ ] P1: Every variant card shows a thumbnail; switching between variants is visually obvious from the grid
- [ ] P1: Close + reopen project preserves both thumbnails and per-variant state
- [ ] All tests green, all builds green, no Safari smoke regressions
