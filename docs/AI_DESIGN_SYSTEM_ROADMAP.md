# AppFrame AI Design System Roadmap

Date: 2026-03-18

Goal: let an AI agent take raw product screenshots plus a brief like "create different App Store screenshot variants" and reliably produce multiple high-quality concepts in the visual range users expect from sites like before.click.

## Target Experience

User prompt:

> Create different App Store screenshot variants on AppFrame using my screenshots.

Agent workflow:

1. Understand the app, target audience, screenshot set, and visual goal.
2. Produce 3-5 clearly different design concepts.
3. Render low-resolution candidates fast.
4. Rank the candidates for readability, hierarchy, and brand fit.
5. Refine the best concept into exportable store assets.

## The 5 Required Capability Areas

### 1. Richer Scene Graph

AppFrame must support more than device + text + simple decoration.

Required primitives:

- `image` elements for logos, stickers, texture cards, floating artwork, and editorial assets
- grouped/layered element support
- richer shape and card components
- masking and cropping primitives
- blend/blur/shadow controls that work across all visual elements

Why it matters:

- before.click-style layouts often rely on layered non-device assets
- the current model is strong for templated compositions but still too narrow for wide creative coverage

Implementation order:

1. Add `image` element support in panoramic mode
2. Add reusable card/mask primitives
3. Add grouping and shared transforms
4. Add richer effects and compositing

Current status:

- panoramic `image` support is in place
- panoramic `crop` and `card` primitives are now in place across schema, renderer, preview server, and editor
- panoramic `group` support is now in place across schema, renderer, preview server, and editor
- panoramic `badge` and `logo` support are now in place across schema, renderer, preview server, and editor
- panoramic layered backgrounds and `proof-chip` support are now in place across schema, renderer, preview server, and editor
- panoramic planning/materialization now emits grouped crop-and-card systems plus semantic badge/logo elements in generated concepts
- panoramic planning/materialization now emits layered backgrounds and proof chips in generated concepts
- extracted screenshot detail layers and floating UI detail cards are the next major scene-graph gap

### 2. Design Recipe System

AppFrame needs reusable design strategies, not only template names.

Required outputs:

- named design recipes such as `clean-hero`, `editorial-split`, `stacked-cards`, `cinematic-panoramic`, `brand-poster`, `playful-spotlight`
- recipe constraints for typography, spacing, background treatment, and screenshot usage
- compatibility rules by app category and screenshot density

Why it matters:

- "any design" is unrealistic without a controlled recipe library
- recipe families let the agent explore breadth while staying inside proven compositions

Implementation order:

1. Define recipe schema and metadata
2. Map existing templates into recipe families
3. Add recipe-specific layout generators
4. Add recipe evaluation heuristics

### 3. Screenshot Understanding

The agent needs to inspect the screenshots, not just place them.

Required capabilities:

- detect focal regions, whitespace, dense UI zones, and safe text areas
- detect screenshot type: home, feed, detail, onboarding, stats, messaging, settings
- recommend crops and callouts
- identify when multiple screenshots should be combined into one visual story

Why it matters:

- high-quality screenshot design depends on content-aware placement
- otherwise text and assets collide with important UI details

Implementation order:

1. Add screenshot metadata model
2. Add heuristic screenshot analysis
3. Add AI-assisted screenshot analysis for ambiguous cases
4. Feed analysis into recipe selection and ranking

### 4. Generate-Then-Rank Loop

The system should generate many candidates, then filter.

Required capabilities:

- generate 10-30 low-resolution candidates from multiple recipes
- score each candidate on readability, collision risk, thumbnail legibility, and visual diversity
- keep the best 3-5 for agent review or user selection

Why it matters:

- top-quality results come from search plus evaluation, not one-shot generation

Implementation order:

1. Create candidate plan objects
2. Add fast preview rendering
3. Add heuristic scoring
4. Add optional model-based scoring from rendered previews

### 5. Real Agent Tooling

The MCP and AppFrame workflow need explicit design-planning tools.

Required capabilities:

- create a structured design brief from screenshots and goals
- generate concept plans and recipe assignments
- create file-backed variant sessions from those plans
- compare and approve variants with explicit scoring and rationale

Why it matters:

- current prompt scaffolding is useful but not yet a full agent workflow surface

Implementation order:

1. Add `appframe_create_design_brief`
2. Add `appframe_plan_variant_set`
3. Add candidate scoring + comparison output
4. Add closed-loop refinement tools

## Execution Plan

### Phase 1: Foundations

- Add panoramic `image` elements
- Add `appframe_create_design_brief`
- Formalize recipe metadata and capability gaps

### Phase 2: Controlled Breadth

- Add recipe library
- Add screenshot analysis model
- Add richer element primitives beyond `image`
  Status: `crop`, `card`, `group`, `badge`, `logo`, layered backgrounds, and proof chips are now landed; extracted screenshot details and floating UI detail cards remain.

### Phase 3: Search And Evaluation

- Generate candidate sets automatically
- Add heuristic ranking
- Add side-by-side review workflow in preview

### Phase 4: Agent Autopilot

- Turn design brief + screenshots into renderable concepts
- Auto-refine top concepts
- Export approved variant directly to store-ready outputs

## What This Patch Starts

This roadmap now has three concrete pieces underway:

- richer scene graph: panoramic `image`, `crop`, `card`, and `group` elements
- real agent tooling: variant planning/materialization with file-backed autopilot sessions
- generate-then-rank foundations: preview rendering plus heuristic scoring/recommendation
- preview review surface: sessions now carry per-concept copy-slot assignments and the preview UI now supports concept filters, side-by-side comparison, and score breakdown review
- manual refinement path: users can now approve the recommended concept, persist manual edits back into the active variant session, export the selected variant as a standalone config, and materialize the approved concept into an export-ready artifact directory without depending on an AI agent for every change
- screenshot understanding foundations: analysis now includes inferred screen ordering, hero-candidate explanations, and unsafe-overlay flags
