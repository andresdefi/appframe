---
name: appframe-screenshots
description: Use when a user wants App Store or Play Store screenshots generated from raw app screenshots with AppFrame, especially when the agent should analyze screenshots, generate copy, produce multiple concepts, open the preview UI, and refine/export the chosen concept.
---

# AppFrame Autopilot

Use AppFrame as an AI-agent-native screenshot system, not as a one-off YAML prompt generator.

Core rule: **screenshots are ads, not documentation.**

## Required behavior

- Ask only for missing inputs that cannot be inferred.
- Generate copy before locking layouts.
- Default to **4 concepts minimum**:
  - Concept A: Clean Hero (`individual`)
  - Concept B: Dynamic Individual (`individual`)
  - Concept C: Editorial Panorama (`panoramic`)
  - Concept D: Bold Panorama (`panoramic`)
- Keep the same approved copy backbone across all 4 concepts unless the user asks for a different narrative.
- Prefer framed devices unless frameless reads cleaner; frameless concepts must use rounded corners.
- End in the AppFrame preview UI unless the user explicitly asks for file-only output.
- Ask the user to choose a concept before final export unless they explicitly request auto-selection.

## Inputs

Required:
- screenshot paths
- app name
- one-line app description
- prioritized features

Recommended:
- brand colors
- app icon or logo
- reference styles

Optional:
- font
- preferred slide count
- extra PNG/SVG assets

## Default workflow

1. Validate or infer the minimum inputs.
2. Run `appframe_run_autopilot`.
3. If autopilot is unavailable, fall back to:
   - `appframe_analyze_screenshot_set`
   - `appframe_generate_copy_candidates`
   - `appframe_select_copy_set`
   - `appframe_plan_variant_set`
   - `appframe_materialize_variant_plan`
   - `appframe_create_variant_session_from_manifest`
   - `appframe_render_variant_previews`
   - `appframe_score_variant_previews`
4. Open the preview UI with `appframe preview --session <sessionPath>`.
5. Present the 4 concepts briefly and call out the recommended one.
6. Let the user pick a concept or request refinements.
7. Apply changes in AppFrame, keep the session, then export the approved concept.

## What to optimize for

- Thumbnail readability
- One idea per slide
- Strong hierarchy
- Clear concept separation
- Proper screenshot choice per concept
- Premium App Store feel over literal UI coverage

## Copy rules

- One idea per headline
- Prefer 3 to 5 words
- Avoid “and”
- Avoid vague filler and generic CTA language
- Keep subtitles secondary and short

## Refinement loop

Common valid follow-ups:
- make this more premium
- shorten the copy
- use frameless instead of frames
- make it lighter or darker
- make Concept B feel more like Concept D
- reduce overlap
- increase text size
- swap screenshot order

When refining:
- keep the selected concept id stable unless the user asks for a new concept
- append refinement history to the session when supported
- reopen or keep using the same preview session

## Output expectations

Always leave the user with:
- a variant session path
- 4 generated concepts
- a recommended concept
- a preview command or open preview UI
- a clear next step: choose, refine, or export

