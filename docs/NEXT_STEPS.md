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
- variant sessions now persist explicit per-concept copy-slot assignments
- preview UI now exposes the selected copy plan for each concept
- panoramic `crop` and `card` primitives now exist across schema, renderer, preview server, and editor
- panoramic `group` primitives now exist across schema, renderer, preview server, and editor
- panoramic `badge` and `logo` primitives now exist across schema, renderer, preview server, and editor
- panoramic planning/materialization now uses grouped crop-and-card systems in generated concepts
- panoramic planning/materialization now emits `badge` and `logo` elements in generated panoramic concepts
- screenshot analysis now includes ordering inference, hero explanations, and unsafe text-overlay flags
- the AppFrame skill has been rewritten around the autopilot flow

The current default concept contract is:

- `concept-a`: `individual` / Clean Hero
- `concept-b`: `individual` / Dynamic Individual
- `concept-c`: `panoramic` / Editorial Panorama
- `concept-d`: `panoramic` / Bold Panorama

This means the minimum viable AI flow now exists, but it is still a first version. Quality is still limited by renderer expressiveness, screenshot understanding depth, scoring sophistication, and refinement tooling.

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
  packages/mcp-server/src/tools/plan-materializer.test.ts \
  packages/mcp-server/src/tools/copy-planning.test.ts \
  packages/mcp-server/src/tools/preview-scoring.test.ts
```

Run these again after any work in the touched areas.

## What Is Still Missing

The current implementation is not yet the full target product. The biggest remaining gaps are:

1. richer renderer primitives
2. deeper screenshot understanding
3. stronger ranking from actual preview images
4. refinement actions inside the preview flow
5. tighter orchestration with preview launch/open behavior
6. more capable panoramic and layered compositions

## Priority Order For Future Threads

Recommended order:

1. Renderer + schema expansion
2. Screenshot understanding improvements
3. Better scoring/ranking from rendered previews
4. Preview UI refinement actions + session history
5. Full autopilot polish and resume/retry behavior
6. Better before.click-style recipe coverage

## Detailed Checklist

### 1. Autopilot Pipeline Hardening

- [x] Add a one-shot autopilot tool.
- [x] Persist analysis, copy, plan, manifest, and session artifacts to disk.
- [x] Default to 4 concepts with 2 individual and 2 panoramic.
- [x] Create sessions from materialized manifests.
- [x] Render preview artifacts for generated concepts.
- [x] Score generated concepts and store a recommendation.
- [ ] Add explicit stage resume support in `appframe_run_autopilot`.
- [ ] Add `resumeFrom` support so a user can rerun only analysis, copy, planning, materialization, previews, or scoring.
- [ ] Add `force` options per stage to regenerate stale artifacts.
- [ ] Add stale-artifact detection based on source screenshot mtimes and config changes.
- [ ] Add a machine-readable autopilot run status model, not just loose JSON artifacts.
- [ ] Add structured failure payloads for each autopilot stage.
- [ ] Add better output for the agent to know when it should call `appframe preview --session <sessionPath>`.
- [ ] Optionally add a direct preview-open helper if the product wants the MCP layer to initiate preview itself.

### 2. Copy System

- [x] Add structured slot-based copy generation.
- [x] Add copy scoring heuristics.
- [x] Add copy selection output.
- [x] Reuse selected copy set during config materialization.
- [x] Add copy slot metadata into sessions in a UI-readable way.
- [x] Expose selected copy directly in the preview UI.
- [ ] Add subtitle candidate generation instead of mostly headline-only generation.
- [ ] Add category-specific copy templates for:
  - [ ] finance
  - [ ] health/wellness
  - [ ] productivity
  - [ ] social
  - [ ] creative
  - [ ] games
- [ ] Add anti-repetition checks across the full selected copy set.
- [ ] Add stronger "no feature list headline" detection.
- [ ] Add support for AI-backed copy generation behind optional API credentials.
- [ ] Add fallback merging logic so AI-generated copy can be rescored by the heuristic system before selection.
- [ ] Add locale-aware copy generation.
- [ ] Add tests covering weak copy rejection patterns.

### 3. Screenshot Understanding

- [x] Add role inference.
- [x] Add density inference.
- [x] Add text risk.
- [x] Add hero priority.
- [x] Add safe text zones.
- [x] Add crop suitability.
- [x] Add recommended usage.
- [ ] Add OCR-based detection of in-screenshot text.
- [ ] Add heuristics for actual whitespace/empty-region detection from pixels.
- [ ] Add focal-point estimation based on simple saliency/image heuristics.
- [ ] Add screenshot color extraction from actual image contents instead of role heuristics only.
- [ ] Add optional vision-model enrichment when AI credentials are present.
- [ ] Add better role detection for:
  - [ ] onboarding
  - [ ] paywall
  - [ ] settings
  - [ ] communication/chat
  - [ ] data-heavy dashboard/reporting
- [x] Add screenshot ordering inference from filenames, timestamps, and roles.
- [x] Add "best screenshot for hero" explanation fields in analysis output.
- [x] Add "unsafe for text overlay" flags.
- [ ] Add tests with real-ish sample screenshots instead of only SVG fixtures.

### 4. Planning System

- [x] Default plan to 4 concepts.
- [x] Lock concept identities to 2 individual + 2 panoramic.
- [x] Add new plan metadata fields to analysis.
- [ ] Add explicit concept diversity constraints so two concepts cannot collapse into minor recolors.
- [ ] Add plan-time recipe selection based on app category.
- [ ] Add plan-time frame strategy:
  - [ ] which concepts must use frames
  - [ ] which concepts may go frameless
  - [ ] why frameless is allowed
- [ ] Add plan-time screenshot assignment constraints to avoid overusing the same screenshot.
- [ ] Add crop-level planning once crop primitives exist.
  Status: basic crop usage now exists in panoramic planning/materialization, but not explicit crop-by-crop planning output.
- [ ] Add support for alternate 5th concept families after renderer expansion.
- [ ] Add richer plan output for the UI so users can inspect rationale concept-by-concept.

### 5. Materialization

- [x] Materialize planned variants into real configs.
- [x] Inject selected copy set into generated configs.
- [x] Use frameless rounded treatment when requested by the plan.
- [ ] Expand materializer for future primitives:
  - [x] `crop`
  - [x] `card`
  - [x] `group`
  - [x] `badge`
  - [x] `logo`
  - [ ] multi-layer backgrounds
- [ ] Add stronger background strategy mapping from plan to config.
- [ ] Add device frame selection logic beyond the current default.
- [ ] Add better typography defaults per concept style.
- [ ] Add concept-specific per-screen/per-frame composition rules.
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
- [ ] Score actual rendered preview images, not just config heuristics.
- [ ] Add image-based checks for:
  - [ ] contrast/readability
  - [ ] text collisions
  - [ ] excessive empty space
  - [ ] panoramic continuity quality
  - [ ] visual clutter
- [ ] Add diversity scoring across all 4 concepts together.
- [ ] Add score explanations that point to concrete layout/copy problems.
- [ ] Add model-assisted visual scoring behind optional AI credentials.
- [ ] Blend heuristic and model scores into one final recommendation formula.
- [ ] Add test fixtures for weak vs strong concept scoring.

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
- [ ] Add ratings/proof chip support.

- [ ] Add richer background system:
  - [ ] multiple background layers
  - [ ] soft/mesh gradients
  - [ ] texture/image overlays
  - [ ] glow/blur layers
  - [ ] blend/opacity controls

- [ ] Add support for layered extracted screenshot details.
- [ ] Add support for floating UI detail cards.
- [ ] Add support for grouped decorative systems.

### 10. Preview UI As Review Surface

- [x] Load autopilot-generated sessions.
- [x] Show recommendation metadata.
- [x] Show preview thumbnails in the variants tab.
- [x] Support 4-concept sessions.
- [ ] Show analysis/copy/plan metadata in dedicated panels.
- [x] Add side-by-side concept comparison view.
- [ ] Add quick filter tabs for:
  - [x] all concepts
  - [x] individual only
  - [x] panoramic only
  - [x] approved only
- [x] Add richer recommendation UI with score breakdown display.
- [x] Add explicit "approve recommended" action.
- [ ] Add "duplicate concept" in session-aware autopilot flows without losing metadata.
- [x] Add "edit manually" affordance that preserves autopilot metadata.
- [ ] Add "refine with AI" buttons in the UI.
- [x] Add preview thumbnails to any future concept comparison grid.
- [ ] Improve panoramic concept preview UX so users can evaluate cross-frame continuity more clearly.

### 10.5. Useful Follow-Ups From PR #1

These ideas are worth keeping, but should be rebuilt on top of the current session-first architecture instead of merging the old implementation directly.

- [x] Add a preview UI action to persist the active concept after a user selects or approves it.
  Desired shape: save back into the active variant session or export a materialized config artifact for that concept, not overwrite the source input config blindly.
- [ ] Define the exact persistence actions the UI should support:
  - [x] save edits to active variant snapshot in session
  - [x] materialize active variant to a standalone config file
  - [ ] promote approved variant to export-ready artifact
- [x] Add validation-backed save endpoints for whichever persistence flow is chosen.
- [x] Add explicit dirty-state / save-state UI in web preview once session-backed persistence exists.
- [x] Verify App Store size mappings against the current Apple spec and update `packages/core/src/renderer/sizes.ts` where needed.
- [ ] Consider keeping improved Koubou stderr logging, but only as a small isolated patch with cleanup behavior decided explicitly.
- [ ] Add tests for any persistence flow so preview edits round-trip through load/save without losing config fields or session metadata.

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
- [ ] Record refinement prompts into session history.
- [ ] Apply refinement actions to a chosen concept without destroying the original.
- [ ] Add a duplicate-before-refine option so users can branch variants safely.
- [ ] Add UI hooks to trigger refinement tools from the preview app.
- [ ] Add tests for refinement-session updates.

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
- [ ] Decide whether preview launch belongs in MCP, CLI, or agent workflow only.
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

1. add richer semantic primitives such as `badge` and `logo`
2. improve panoramic compositions with grouped card/crop systems and layered backgrounds
3. add preview UI refinement actions for common edits
4. add preview-side metadata panels and comparison views for autopilot sessions

That is the next quality step now that `crop`, `card`, and `group` are available.

## Suggested Concrete Next Task Prompt

Use this to start a future thread:

> Continue AppFrame autopilot work. Read [NEXT_STEPS.md](/Users/bastianvidela/appframe/docs/NEXT_STEPS.md) and [AI_DESIGN_SYSTEM_ROADMAP.md](/Users/bastianvidela/appframe/docs/AI_DESIGN_SYSTEM_ROADMAP.md). Build the next scene-graph slice after `group`: add `badge` and `logo` primitives across schema, renderer, preview server, and panoramic editor, then update the planner/materializer to use them in panoramic concepts and richer proof systems.

## Notes For Future Threads

- The repo may have unrelated untracked files; do not revert unrelated user changes.
- Existing manual variant workflows still matter; preserve backward compatibility where possible.
- Session compatibility matters now that sessions can be created from both manual configs and autopilot manifests.
- The current scoring system is heuristic and config-based, not truly visual yet.
- The current screenshot understanding is still heuristic and not OCR/vision-driven.
- The current renderer still limits how close AppFrame can get to before.click-style layouts.
