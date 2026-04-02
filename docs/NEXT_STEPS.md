# AppFrame Autopilot Next Steps

This file is the handoff document for future threads working on AppFrame's AI-agent-native screenshot generation flow.

It is intended to answer:
- what has already been implemented
- what is still missing
- what order future work should happen in
- what files matter
- what can be checked off as work completes

Use this together with [AI_DESIGN_SYSTEM_ROADMAP.md](/Users/bastianvidela/appframe/docs/AI_DESIGN_SYSTEM_ROADMAP.md).

## Current State

AppFrame now has an initial autopilot pipeline implemented:

- screenshot analysis exists
- copy candidate generation/scoring/selection exists
- 4-concept planning exists
- plan materialization into real AppFrame configs exists
- manifest-driven variant sessions exist
- preview rendering exists for generated sessions
- heuristic scoring/recommendation exists
- preview UI can display recommendation metadata and preview thumbnails
- preview UI now surfaces active concept frame strategy, crop guidance, OCR occupied regions, and per-screen individual plan rationale
- variant sessions now persist explicit per-concept copy-slot assignments
- preview UI now exposes the selected copy plan for each concept
- preview UI now supports optional AI-backed refinement planning that maps freeform prompts onto safe branch actions
- web-preview now has dedicated refinement session save/load round-trip coverage
- `appframe_run_autopilot` now supports stage-aware resume, forced reruns, stale-artifact detection, and a machine-readable run-status manifest
- MCP tools can now start preview directly for a generated session via `appframe_open_preview_session`
- preview scoring now inspects rendered PNG previews for contrast, text-zone safety, whitespace balance, clutter, and panoramic seam continuity
- preview scoring now measures concept diversity across the full rendered concept set, explains concrete layout/copy issues, and can call a live model-assisted visual ranking pass behind optional AI credentials with safe fallback behavior
- screenshot analysis now derives actual-pixel palette extraction, quiet text zones, and focal-point estimates from PNG screenshots
- copy candidate generation can now use screenshot-derived slot signals from analysis to steer role-aware, focus-aware headline options and avoid echoing embedded OCR/vision UI text
- copy selection now runs a final cross-slot anti-repetition pass and uses broader category-aware phrase banks across hero, differentiator, feature, and summary slots
- copy generation/selection now builds real subtitle candidates, persists subtitle-aware selected copy through sessions, and exposes subtitle context in the preview UI
- copy tools and autopilot now accept agent-provided/external copy candidates, rescore them locally, and merge them back into final selection without bundling built-in model generation
- copy scoring now penalizes raw feature-list / feature-label headlines more aggressively, and weak-copy rejection coverage now includes those patterns explicitly
- copy generation/selection is now locale-aware for deterministic built-in packs (`en`, `es`, `fr`, `de`, `pt`), carries locale/fallback metadata through artifacts, and falls back safely to English for unsupported locales
- planning/materialization now emit dynamic individual compositions with extra screenshots, loupes, overlays, and palette-informed backgrounds
- planning now resequences screenshots per concept, diversifies lead/closing assignment across the concept set, and constrains shared support-screen reuse so concepts do not silently collapse onto the same screenshots
- planning now emits explicit per-concept frame strategies plus per-screen/per-frame crop plans that react to focal points and OCR/text-occupied regions
- materialization now consumes `frameStrategy` and `cropPlan` so generated configs react to plan-time framing, loupe anchoring, support-crop usage, text-occupied-region avoidance, subtitle sizing, palette-led backgrounds, and deeper device-frame treatment
- planning now selects category-aware concept recipes, naming, strategies, and role weighting for finance, health, productivity, social, creative, games, and general apps
- the core renderer pipeline now passes multi-device compositions and screen effects through to template rendering
- panoramic `crop` and `card` primitives now exist across schema, renderer, preview server, and editor
- panoramic `group` primitives now exist across schema, renderer, preview server, and editor
- panoramic `badge` and `logo` primitives now exist across schema, renderer, preview server, and editor
- panoramic layered background systems now exist across schema, renderer, preview server, and editor
- panoramic `proof-chip` primitives now exist across schema, renderer, preview server, and editor
- panoramic planning/materialization now uses grouped crop-and-card systems in generated concepts
- panoramic planning/materialization now emits `badge` and `logo` elements in generated panoramic concepts
- panoramic planning/materialization now emits layered backgrounds and proof chips in generated panoramic concepts
- screenshot analysis now includes ordering inference, hero explanations, and unsafe text-overlay flags
- screenshot analysis now supports optional OCR/vision text enrichment from local sidecars or opt-in local Tesseract, feeding role detection and overlay safety without bundling built-in model dependencies
- screenshot analysis now uses OCR/layout semantics to better distinguish onboarding, paywall, settings, communication, and data-heavy dashboard/reporting screens, feeding denser overlay-risk, crop-suitability, and copy-direction guidance
- screenshot analysis now also derives raster-only occupied-region and semantic layout signals when OCR/text enrichment is absent, so onboarding/paywall/settings/chat/dashboard-style screenshots still feed role, crop, and copy guidance deterministically
- screenshot analysis now also broadens deterministic non-OCR understanding for workflow/action and discovery/browse screens, and local ambiguity guards reduce some raster-only false positives where wide panels previously collapsed into settings or reporting
- screenshot analysis now also uses stronger local cue families for editor/canvas, catalog/store, profile/community, map/navigation, and media/player screenshots, widening deterministic understanding and cutting more raster-only settings/reporting false positives without bundling built-in model dependencies
- dynamic individual planning/materialization now reacts more explicitly to onboarding, paywall, settings, chat, and reporting-style screens with role-aware composition/background strategies instead of only generic frameStrategy/cropPlan behavior
- dynamic individual planning/materialization now also reacts more explicitly to workflow and discovery screens with dedicated composition/background treatments instead of folding them back into generic proof-grid behavior
- dynamic planning/materialization now also reacts more explicitly to editor/profile/catalog/map/media-style screens with dedicated individual backgrounds, copy guidance, and richer panoramic tool-ribbon / profile-spotlight / browse-strip / route-arc / playback-marquee treatments
- the AppFrame skill has been rewritten around the autopilot flow

The current default concept contract is:

- `concept-a`: `individual` / Clean Hero
- `concept-b`: `individual` / Dynamic Individual
- `concept-c`: `panoramic` / Editorial Panorama
- `concept-d`: `panoramic` / Bold Panorama

This means the minimum viable AI flow now exists, but it is still a first version. Quality is now less constrained by basic composition, pixel analysis, and text-aware screenshot understanding, but still limited by deeper scene semantics, screenshot-to-plan intelligence, copy sophistication, and refinement tooling.

## Files Added Or Extended

Primary MCP/autopilot files:
- [suggestion-tools.ts](/Users/bastianvidela/appframe/packages/mcp-server/src/tools/suggestion-tools.ts)
- [design-planning.ts](/Users/bastianvidela/appframe/packages/mcp-server/src/tools/design-planning.ts)
- [plan-materializer.ts](/Users/bastianvidela/appframe/packages/mcp-server/src/tools/plan-materializer.ts)
- [copy-planning.ts](/Users/bastianvidela/appframe/packages/mcp-server/src/tools/copy-planning.ts)
- [preview-scoring.ts](/Users/bastianvidela/appframe/packages/mcp-server/src/tools/preview-scoring.ts)
- [variant-session-lib.ts](/Users/bastianvidela/appframe/packages/mcp-server/src/tools/variant-session-lib.ts)
- [variant-session-tools.ts](/Users/bastianvidela/appframe/packages/mcp-server/src/tools/variant-session-tools.ts)

Tests:
- [design-planning.test.ts](/Users/bastianvidela/appframe/packages/mcp-server/src/tools/design-planning.test.ts)
- [suggestion-tools.test.ts](/Users/bastianvidela/appframe/packages/mcp-server/src/tools/suggestion-tools.test.ts)
- [plan-materializer.test.ts](/Users/bastianvidela/appframe/packages/mcp-server/src/tools/plan-materializer.test.ts)
- [copy-planning.test.ts](/Users/bastianvidela/appframe/packages/mcp-server/src/tools/copy-planning.test.ts)
- [preview-scoring.test.ts](/Users/bastianvidela/appframe/packages/mcp-server/src/tools/preview-scoring.test.ts)

Preview/web UI files:
- [store.ts](/Users/bastianvidela/appframe/packages/web-preview/src/client/store.ts)
- [VariantsTab.tsx](/Users/bastianvidela/appframe/packages/web-preview/src/client/components/Sidebar/VariantsTab.tsx)
- [App.tsx](/Users/bastianvidela/appframe/packages/web-preview/src/client/App.tsx)
- [server.ts](/Users/bastianvidela/appframe/packages/web-preview/src/server.ts)

Agent skill:
- [SKILL.md](/Users/bastianvidela/appframe/skills/appframe-screenshots/SKILL.md)

Roadmap docs:
- [AI_DESIGN_SYSTEM_ROADMAP.md](/Users/bastianvidela/appframe/docs/AI_DESIGN_SYSTEM_ROADMAP.md)
- [NEXT_STEPS.md](/Users/bastianvidela/appframe/docs/NEXT_STEPS.md)

## Implemented MCP Tools

These tools now exist and are part of the autopilot path:

- `appframe_analyze_screenshot_set`
- `appframe_plan_variant_set`
- `appframe_materialize_variant_plan`
- `appframe_generate_copy_candidates`
- `appframe_score_copy_candidates`
- `appframe_select_copy_set`
- `appframe_run_autopilot`
- `appframe_open_preview_session`
- `appframe_create_variant_session_from_manifest`
- `appframe_render_variant_previews`
- `appframe_score_variant_previews`
- `appframe_recommend_variant`

Legacy/manual session tools still exist:

- `appframe_create_variant_session`
- `appframe_list_variant_session`
- `appframe_select_variant`
- `appframe_approve_variant`
- `appframe_export_variant`
- `appframe_export_approved_variant`

## Verified Commands

These passed after the latest implementation:

```bash
pnpm --filter @appframe/mcp-server typecheck
pnpm --filter @appframe/web-preview typecheck
pnpm vitest run packages/mcp-server/src/tools/design-planning.test.ts \
  packages/mcp-server/src/tools/copy-planning.test.ts \
  packages/mcp-server/src/tools/plan-materializer.test.ts \
  packages/mcp-server/src/tools/variant-session-lib.test.ts \
  packages/mcp-server/src/tools/suggestion-tools.test.ts
```

Run these again after any work in the touched areas.

## What Is Still Missing

The current implementation is not yet the full target product. The biggest remaining gaps are:

1. broader screenshot-to-plan and screenshot-to-copy intelligence
2. deeper OCR/vision enrichment beyond text-aware heuristics
3. refinement actions inside the preview flow
4. tighter orchestration with preview launch/open behavior
5. more capable panoramic and layered compositions
6. deeper category-specific layout, frame, and screenshot-assignment coverage

## Priority Order For Future Threads

Recommended order:

1. Screenshot-to-plan and screenshot-to-copy intelligence
2. Better screenshot understanding and pluggable OCR/vision enrichment
3. Preview UI refinement actions + session history
4. Full autopilot polish and resume/retry behavior
5. Better before.click-style recipe coverage
6. Panoramic composition expansion

## Detailed Checklist

### 1. Autopilot Pipeline Hardening

- [x] Add a one-shot autopilot tool.
- [x] Persist analysis, copy, plan, manifest, and session artifacts to disk.
- [x] Default to 4 concepts with 2 individual and 2 panoramic.
- [x] Create sessions from materialized manifests.
- [x] Render preview artifacts for generated concepts.
- [x] Score generated concepts and store a recommendation.
- [x] Add explicit stage resume support in `appframe_run_autopilot`.
- [x] Add `resumeFrom` support so a user can rerun only analysis, copy, planning, materialization, previews, or scoring.
- [x] Add `force` options per stage to regenerate stale artifacts.
- [x] Add stale-artifact detection based on source screenshot mtimes and config changes.
- [x] Add a machine-readable autopilot run status model, not just loose JSON artifacts.
- [x] Add structured failure payloads for each autopilot stage.
- [x] Add better output for the agent to know when it should call `appframe preview --session <sessionPath>`.
- [x] Optionally add a direct preview-open helper if the product wants the MCP layer to initiate preview itself.

### 2. Copy System

- [x] Add structured slot-based copy generation.
- [x] Add copy scoring heuristics.
- [x] Add copy selection output.
- [x] Reuse selected copy set during config materialization.
- [x] Add copy slot metadata into sessions in a UI-readable way.
- [x] Expose selected copy directly in the preview UI.
- [x] Use screenshot-derived slot signals to steer copy candidate phrasing.
- [x] Add subtitle candidate generation instead of mostly headline-only generation.
- [ ] Add category-specific copy templates for:
  - [x] finance
  - [x] health/wellness
  - [x] productivity
  - [x] social
  - [x] creative
  - [x] games
- [x] Add anti-repetition checks across the full selected copy set.
- [x] Use OCR/text insights to avoid repeating embedded UI text in generated copy.
- [x] Add stronger "no feature list headline" detection.
- [x] If model-assisted copy returns, accept agent-provided outputs rather than bundling API-key-based generation inside AppFrame.
- [x] Add fallback merging logic so externally generated copy can be rescored by the heuristic system before selection.
- [x] Add locale-aware copy generation.
  Status: deterministic locale packs now exist for `en`, `es`, `fr`, `de`, and `pt`, with locale-aware scoring/selection metadata and safe English fallback for unsupported locales.
- [x] Add tests covering weak copy rejection patterns.

### 3. Screenshot Understanding

- [x] Add role inference.
- [x] Add density inference.
- [x] Add text risk.
- [x] Add hero priority.
- [x] Add safe text zones.
- [x] Add crop suitability.
- [x] Add recommended usage.
- [x] Add OCR-based detection of in-screenshot text.
  Status: `analyzeScreenshotSet` now accepts optional `ocrJsonPath` sidecars, auto-discovers local `.ocr.json` / `.vision.json` files, and can use opt-in local Tesseract via `APPFRAME_ENABLE_TESSERACT_OCR=1` without bundling a built-in model dependency.
- [x] Add heuristics for actual whitespace/empty-region detection from pixels.
- [x] Add focal-point estimation based on simple saliency/image heuristics.
- [x] Add screenshot color extraction from actual image contents instead of role heuristics only.
- [ ] Add optional vision-model enrichment when AI credentials are present.
- [x] Add better role detection for:
  - [x] onboarding
  - [x] paywall
  - [x] settings
  - [x] communication/chat
  - [x] data-heavy dashboard/reporting
  - [x] workflow/action
  - [x] discovery/browse/template-library
  Status: OCR/layout semantics now improve these cases when text enrichment is available, raster/non-OCR deterministic logic now covers the same families plus workflow/discovery and local editor/profile/catalog cue families, and ambiguity guards now cut more settings/reporting false positives; broader scene-graph understanding is still incomplete.
- [x] Add raster-only occupied-region heuristics when OCR/text enrichment is absent.
  Status: screenshot analysis now infers top/bottom/left/right/center occupancy from local PNG structure, and those regions feed crop avoidance plus copy/planning guidance even without OCR sidecars.
- [x] Add screenshot ordering inference from filenames, timestamps, and roles.
- [x] Add "best screenshot for hero" explanation fields in analysis output.
- [x] Add "unsafe for text overlay" flags.
- [x] Add tests with real-ish sample screenshots instead of only SVG fixtures.
  Status: coverage now includes richer PNG fixtures for occupied regions plus onboarding/paywall/settings/chat/dashboard/reporting semantics with and without OCR.

### 4. Planning System

- [x] Default plan to 4 concepts.
- [x] Lock concept identities to 2 individual + 2 panoramic.
- [x] Add new plan metadata fields to analysis.
- [ ] Add explicit concept diversity constraints so two concepts cannot collapse into minor recolors.
  Status: concept-specific screenshot resequencing now exists, but recipe/style diversity is still narrower than the target quality bar.
- [x] Add plan-time recipe selection based on app category.
- [x] Add plan-time frame strategy:
  - [x] which concepts must use frames
  - [x] which concepts may go frameless
  - [x] why frameless is allowed
  Status: plans now include explicit per-concept `frameStrategy` metadata with framed/frameless rules and rationale.
- [x] Add plan-time screenshot assignment constraints to avoid overusing the same screenshot.
  Status: planning now penalizes repeated lead/closing emphasis across concepts and shares support-screen reuse tracking across individual concepts, while still keeping a deterministic local-first assignment pass.
- [x] Add crop-level planning once crop primitives exist.
  Status: plans now emit per-screen/per-frame `cropPlan` metadata with crop usage, anchor, and OCR/text-avoidance regions.
- [ ] Add support for alternate 5th concept families after renderer expansion.
- [x] Add richer plan output for the UI so users can inspect rationale concept-by-concept.
  Status: preview now shows active concept frame strategy, crop guidance, OCR occupied regions, and per-screen/per-frame planning notes.

### 5. Materialization

- [x] Materialize planned variants into real configs.
- [x] Inject selected copy set into generated configs.
- [x] Use frameless rounded treatment when requested by the plan.
- [x] Materialize dynamic individual compositions with extra screenshots, loupes, overlays, and palette-aware backgrounds.
- [x] Use `frameStrategy` and `cropPlan` during materialization so generated layouts respond to plan metadata.
- [ ] Expand materializer for future primitives:
  - [x] `crop`
  - [x] `card`
  - [x] `group`
  - [x] `badge`
  - [x] `logo`
  - [ ] multi-layer backgrounds
- [ ] Add stronger background strategy mapping from plan to config.
- [x] Add device frame selection logic beyond the current default.
- [x] Add better typography defaults per concept style.
- [ ] Add concept-specific per-screen/per-frame composition rules.
  Status: the materializer now responds to `cropPlan` and `frameStrategy`, and now pushes that metadata into subtitle sizing, support-card copy, palette-led backgrounds, and frameless device treatment; concept-specific composition expansion is still open.
- [ ] Add richer panoramic element layout logic after new primitives land.

### 6. Variant Sessions

- [x] Create sessions from manifests.
- [x] Store screenshot analysis in session autopilot metadata.
- [x] Store copy candidates and selected copy in session autopilot metadata.
- [x] Store plan metadata in session autopilot metadata.
- [x] Store recommendation metadata in session autopilot metadata.
- [x] Store preview artifacts in session variants.
- [ ] Add explicit approved concept metadata beyond draft/approved status.
- [ ] Add final export artifact history under a clearer v2 session structure.
- [ ] Add schema version upgrade tests for old session files.
- [ ] Add dedicated session typings shared between MCP and web-preview packages.
- [ ] Add refinement history support in the web UI, not just in session storage helpers.
- [ ] Add duplication and manual-edit provenance to session history.
- [ ] Add support for session-safe rerendering after manual config edits.

### 7. Preview Rendering

- [x] Render previews for all variants from session configs.
- [x] Store preview artifact paths back into the session.
- [ ] Render richer preview sets:
  - [ ] first individual slide thumbnail
  - [ ] first two individual slides
  - [ ] panoramic thumbnail
  - [ ] panoramic strip preview
  - [ ] optional contact sheet across all concepts
- [ ] Distinguish preview artifacts from export artifacts more clearly in the UI.
- [ ] Add a render-manifest per concept for debugging.
- [ ] Add better preview caching and invalidation.
- [ ] Add tests for preview rendering session updates.

### 8. Preview Scoring / Ranking

- [x] Add deterministic heuristic scoring.
- [x] Add recommendation persistence.
- [x] Score actual rendered preview images, not just config heuristics.
- [ ] Add image-based checks for:
  - [x] contrast/readability
  - [x] text collisions
  - [x] excessive empty space
  - [x] panoramic continuity quality
  - [x] visual clutter
- [x] Add diversity scoring across all 4 concepts together.
- [x] Add score explanations that point to concrete layout/copy problems.
- [x] Add model-assisted visual scoring behind optional AI credentials.
- [x] Blend heuristic and model scores into one final recommendation formula.
- [x] Add test fixtures for weak vs strong concept scoring.

### 9. Scene Graph / Renderer Expansion

This is the most important remaining capability area for before.click-level quality.

- [x] Add `crop` primitive to schema.
- [x] Add `crop` rendering to panoramic renderer.
- [x] Add `crop` editing support in the panoramic editor.
- [x] Add `crop` support in preview server serialization.
- [x] Add `crop` validation tests.

- [x] Add `card` primitive to schema.
- [x] Add `card` rendering.
- [x] Add `card` editor controls.
- [x] Add `card` validation tests.

- [x] Add `group` primitive to schema.
- [x] Add grouped transform/rendering behavior.
- [x] Add grouped editor manipulation.
- [x] Add group validation tests.

- [x] Add `badge` primitive.
- [x] Add `logo` primitive or semantic badge/logo wrappers.
- [x] Add ratings/proof chip support.

- [ ] Add richer background system:
  - [x] multiple background layers
  - [x] soft/mesh gradients
  - [x] texture/image overlays
  - [x] glow/blur layers
  - [x] blend/opacity controls

- [x] Add support for layered extracted screenshot details.
- [x] Add support for floating UI detail cards.
- [x] Add support for grouped decorative systems.
- [x] Pass multi-device individual compositions and screen effects through the core renderer pipeline.

### 10. Preview UI As Review Surface

- [x] Load autopilot-generated sessions.
- [x] Show recommendation metadata.
- [x] Show preview thumbnails in the variants tab.
- [x] Support 4-concept sessions.
- [x] Show analysis/copy/plan metadata in dedicated panels.
- [x] Add side-by-side concept comparison view.
- [ ] Add quick filter tabs for:
  - [x] all concepts
  - [x] individual only
  - [x] panoramic only
  - [x] approved only
- [x] Add richer recommendation UI with score breakdown display.
- [x] Add explicit "approve recommended" action.
- [x] Add "duplicate concept" in session-aware autopilot flows without losing metadata.
- [x] Add "edit manually" affordance that preserves autopilot metadata.
- [x] Add "refine with AI" buttons in the UI.
- [x] Add preview thumbnails to any future concept comparison grid.
- [x] Improve panoramic concept preview UX so users can evaluate cross-frame continuity more clearly.

### 10.5. Useful Follow-Ups From PR #1

These ideas are worth keeping, but should be rebuilt on top of the current session-first architecture instead of merging the old implementation directly.

- [x] Add a preview UI action to persist the active concept after a user selects or approves it.
  Desired shape: save back into the active variant session or export a materialized config artifact for that concept, not overwrite the source input config blindly.
- [ ] Define the exact persistence actions the UI should support:
  - [x] save edits to active variant snapshot in session
  - [x] materialize active variant to a standalone config file
  - [x] promote approved variant to export-ready artifact
- [x] Add validation-backed save endpoints for whichever persistence flow is chosen.
- [x] Add explicit dirty-state / save-state UI in web preview once session-backed persistence exists.
- [x] Verify App Store size mappings against the current Apple spec and update `packages/core/src/renderer/sizes.ts` where needed.
- [ ] Consider keeping improved Koubou stderr logging, but only as a small isolated patch with cleanup behavior decided explicitly.
- [x] Add tests for any persistence flow so preview edits round-trip through load/save without losing config fields or session metadata.

### 11. Refinement Loop

This is not fully implemented yet.

- [ ] Add MCP refinement tools for common actions:
  - [ ] make this more premium
  - [ ] shorten the copy
  - [ ] use frameless instead of frames
  - [ ] make this lighter
  - [ ] make this darker
  - [ ] make Concept B feel more like Concept D
  - [ ] reduce overlap
  - [ ] increase text size
  - [ ] swap screenshot order
- [x] Record refinement prompts into session history.
- [x] Apply refinement actions to a chosen concept without destroying the original.
- [x] Add a duplicate-before-refine option so users can branch variants safely.
- [x] Add UI hooks to trigger refinement tools from the preview app.
- [x] Add tests for refinement-session updates.

### 12. Skill And Agent Workflow

- [x] Rewrite the AppFrame skill around autopilot.
- [ ] Add examples to the skill for:
  - [ ] minimal user request with only screenshots
  - [ ] user request with references and brand colors
  - [ ] refinement follow-up after concept selection
- [ ] Add explicit fallback behavior when some metadata is missing.
- [ ] Add explicit instructions for when to ask questions vs infer defaults.
- [ ] Add references to concrete MCP tools in the skill body only where useful.
- [ ] Consider adding an `agents/openai.yaml` metadata file if the team wants better skill surfacing in UI.

### 13. CLI / Launch Flow

- [ ] Ensure the agent can consistently open preview after autopilot with one obvious command.
- [ ] Consider a dedicated CLI helper for autopilot sessions, for example:
  - [ ] `appframe preview --session <sessionPath>`
  - [ ] `appframe autopilot --session <sessionPath>` if a dedicated CLI command is added later
- [x] Decide whether preview launch belongs in MCP, CLI, or agent workflow only.
  Current direction: support both the existing CLI launch path and the MCP-side `appframe_open_preview_session` helper so agents can open preview without leaving the tool surface.
- [ ] Add docs covering the intended agent invocation flow.

### 14. Documentation

- [x] Add roadmap doc.
- [x] Add this handoff doc.
- [ ] Update top-level README to mention autopilot MCP tools.
- [ ] Document the session v2 structure.
- [ ] Document the recommended AI-agent workflow for Codex/Claude Code.
- [ ] Document renderer limitations and future scene-graph roadmap.
- [ ] Add an example autopilot output directory tree to docs.

### 15. Testing Gaps

- [x] Add tests for copy planning.
- [x] Add tests for preview scoring.
- [x] Extend design planning tests.
- [ ] Add tests for:
  - [ ] `appframe_run_autopilot`
  - [ ] manifest-driven session creation
  - [ ] preview rendering session updates
  - [ ] recommendation persistence
  - [ ] old session upgrade compatibility
  - [ ] frameless rounded concept materialization
  - [ ] 4-concept contract enforcement
  - [ ] plan diversity logic once added
  - [ ] future scene-graph primitives

## Recommended Next Implementation Slice

If a future thread should continue immediately, the best next slice is:

1. improve screenshot understanding so plans react more confidently to onboarding, paywall, settings, chat, workflow, discovery, and data-heavy reporting screens
2. keep expanding screenshot-understanding quality beyond the current raster-layout heuristics and local note/filename cues so non-OCR analysis keeps improving without regressing into false positives, especially for scene families beyond the current workflow/discovery/editor/profile/catalog coverage
3. keep expanding recipe-specific composition and background mapping now that role-aware onboarding/paywall/settings/chat/reporting/workflow/discovery/editor/profile/catalog reactions are landed
4. continue refinement flow polish and richer panoramic composition systems after the screenshot-intelligence slice

That is the next quality step now that the planning metadata is no longer only emitted, but also consumed by the generated outputs.

## Suggested Concrete Next Task Prompt

Use this to start a future thread:

> Continue AppFrame autopilot work. Read [NEXT_STEPS.md](/Users/bastianvidela/appframe/docs/NEXT_STEPS.md) and [AI_DESIGN_SYSTEM_ROADMAP.md](/Users/bastianvidela/appframe/docs/AI_DESIGN_SYSTEM_ROADMAP.md). Build the next screenshot-intelligence slice after the current local cue-family pass: reduce remaining non-OCR false positives, broaden semantic coverage beyond the current onboarding/paywall/settings/chat/dashboard/workflow/discovery/editor/profile/catalog heuristics, and keep expanding recipe-specific composition/background mapping for both individual and panoramic concepts.

## Notes For Future Threads

- The repo may have unrelated untracked files; do not revert unrelated user changes.
- Existing manual variant workflows still matter; preserve backward compatibility where possible.
- Session compatibility matters now that sessions can be created from both manual configs and autopilot manifests.
- The current scoring system is now partly visual and can optionally use live model ranking, but it is still not a full art-direction loop.
- The current screenshot understanding now includes real pixel heuristics plus optional OCR/vision text enrichment, but richer semantic scene understanding is still open.
- The current renderer is broader than the original single-device flow, but it still limits how close AppFrame can get to before.click-style layouts.
- Prefer local deterministic logic or agent-provided model outputs over adding new built-in API-key dependencies inside AppFrame itself.
