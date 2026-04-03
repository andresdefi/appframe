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
- deterministic category-aware concept selection is now in place for finance, health, productivity, social, creative, games, and general app categories
- panoramic `crop` and `card` primitives are now in place across schema, renderer, preview server, and editor
- panoramic `group` support is now in place across schema, renderer, preview server, and editor
- panoramic `badge` and `logo` support are now in place across schema, renderer, preview server, and editor
- panoramic layered backgrounds and `proof-chip` support are now in place across schema, renderer, preview server, and editor
- panoramic planning/materialization now emits grouped crop-and-card systems plus semantic badge/logo elements in generated concepts
- panoramic planning/materialization now emits layered backgrounds and proof chips in generated concepts
- extracted screenshot detail layers, floating UI detail cards, and grouped decorative systems are now in place in panoramic planning/materialization and visible in the preview review UI

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

Current status:

- deterministic recipe selection now goes beyond category naming: individual recipe labels now steer composition/copy constraints more directly, and panoramic concepts now resolve into category-specific recipe archetypes such as `editorial-confidence`, `workflow-panorama`, `conversation-panorama`, `gallery-panorama`, `proof-panorama`, `launch-panorama`, and `cinematic-panorama`
- panoramic planning now emits opener / relay / proof-close style layout archetypes plus continuity rules, and materialization uses those cues to vary text/device geometry across the strip more intentionally instead of treating most panoramas as one editorial-vs-bold split
- panoramic planning now also emits explicit per-frame support systems and transition intents, making recipe rhythm more legible in both the generated plan and the preview review surface
- panoramic materialization now maps those support systems into deterministic quote-stack / metric-ladder / signal-chain / milestone-band / curation-shelf / proof-column groups so the strip can vary proof pacing and non-device rhythm without model-dependent generation

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
3. Add pluggable OCR/vision enrichment for ambiguous cases via local tools, sidecars, or agent-provided outputs
4. Feed analysis into recipe selection and ranking

Current status:

- OCR/vision text enrichment now feeds role detection, overlay safety, screenshot-to-copy de-duplication, and plan-time crop guidance without bundling built-in model dependencies
- OCR/layout semantics now better distinguish onboarding, paywall, settings, communication, workflow/discovery cues, and data-heavy dashboard/reporting screens when text enrichment is available, improving density, crop, and copy-direction decisions
- raster layout heuristics plus local deterministic note/filename cues now extend those occupied-region and screen-type cues to non-OCR screenshots, so local analysis can still infer onboarding/paywall/settings/chat/dashboard/workflow/discovery-style structure without sidecars
- raster ambiguity guards now reduce some false positives where wide non-OCR panels previously over-read as settings or reporting structure
- local semantic cue families now also separate editor/canvas, catalog/store, profile/community, activity/feed, document/review, map/navigation, media/player, capture/scan, schedule/calendar, commerce/checkout, secure-access, support/help, and rewards/loyalty screenshots from those broader buckets, reducing more note/filename-driven non-OCR false positives without bundling built-in model dependencies
- variant plans now emit explicit per-concept frame strategies plus per-screen/per-frame crop plans, including text-occupied-region avoidance and focal-point anchoring
- materialized configs now consume that planning metadata to drive frameless support treatment, loupe anchoring, support-card crop behavior, safer text offsets, palette-led backgrounds, deeper device-frame treatment, family-aware panoramic pacing, recipe-aware opener/relay/close variation, and role-aware composition/background reactions for onboarding/paywall/settings/chat/reporting/workflow/discovery/editor/profile/catalog/activity/document/map/media/capture/schedule/commerce/security/support/reward-style screens

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

Current status:

- heuristic scoring already blends config analysis, rendered-preview metrics, concept diversity, and optional model ranking
- scoring now also rejects structurally generic concepts more directly by measuring recipe specificity, support-system richness, and repeated layout rhythm instead of relying on preview pixels alone
- scoring now also inspects panoramic support-group signature diversity, so strips that reuse the same support-card structure across frames are penalized more directly

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
  Status: `crop`, `card`, `group`, `badge`, `logo`, layered backgrounds, proof chips, extracted screenshot details, floating UI detail cards, and grouped decorative systems are now landed.

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
- preview review surface: sessions now carry per-concept copy-slot assignments and the preview UI now supports concept filters, side-by-side comparison, score breakdown review, frame strategy, crop guidance, and OCR occupied-region inspection
- richer panoramic composition review: sessions now expose screenshot analysis, selected copy, concept-plan metadata, and composition summaries in the preview variants surface so layered-detail systems are inspectable without leaving the session
- refinement review surface: preview sessions now support safe branch-and-refine actions, variant provenance/history, and panoramic continuity review without leaving the session flow
- AI-backed refinement planning now exists in preview sessions behind optional OpenAI credentials, mapping freeform refinement prompts onto safe branch actions and persisting that history through session save/load
- manual refinement path: users can now approve the recommended concept, persist manual edits back into the active variant session, export the selected variant as a standalone config, and materialize the approved concept into an export-ready artifact directory without depending on an AI agent for every change
- screenshot understanding foundations: analysis now includes inferred screen ordering, hero-candidate explanations, unsafe-overlay flags, and PNG-derived palette / quiet-zone / focal-point signals
- screenshot understanding now also supports optional OCR/vision text enrichment through local sidecars and opt-in local Tesseract, improving role detection and text-overlay safety without bundling a built-in model dependency
- screenshot understanding now also uses OCR/layout semantics to better read onboarding, paywall, settings, chat, workflow/discovery, and data-heavy dashboard/reporting screenshots instead of treating them as mostly generic dense screens
- screenshot understanding now also derives raster-only occupied-region and semantic layout cues so non-OCR screenshots can still drive crop avoidance, copy direction, and role-aware planning deterministically
- non-OCR local cues now also include stronger discovery/template-browse and workflow/action phrase banks plus ambiguity guards against settings/reporting false positives
- local cue-family understanding now also detects editor/canvas, catalog/store, profile/community, activity/feed, document/review, map/navigation, media/player, capture/scan, schedule/calendar, commerce/checkout, secure-access, support/help, and rewards/loyalty screenshots so those flows stop collapsing into generic settings/detail/reporting/editor/media/paywall reads as often
- individual composition breadth: dynamic individual concepts now materialize multi-device compositions, supporting screenshots, loupes, overlays, and palette-aware backgrounds instead of staying inside a single-device layout
- recipe-specific composition/background reactions now respond more explicitly to onboarding, paywall, settings, chat, reporting, workflow, discovery, editor, profile, catalog, activity, document, map, media, capture, schedule, commerce, security, support, and reward-style screens instead of only generic frame/crop signals
- panoramic planning/materialization now also emits tool-ribbon, profile-spotlight, activity-wave, folio-stack, browse-strip, route-arc, playback-marquee, capture-focus, timeline-band, checkout-lane, trust-shield, support-beacon, and reward-ribbon treatments plus background accents and family-aware pacing when those local cue families are present, so the strip reacts more clearly than generic proof/decorative systems alone
- recipe-aware panoramic planning now also varies opener / relay / close archetypes and continuity rules by category-specific recipe family, pulling the system closer to before.click-style pacing breadth without bundling model-dependent generation
- recipe-aware panoramic planning/materialization now also carries explicit support-system and transition-intent metadata through to the preview UI, improving local-first review tooling for continuity and frame-to-frame rhythm
- deterministic concept planning: concepts now resequence screenshots differently, constrain support-screen reuse, and derive per-screen copy direction from screenshot role, density, quiet-space, and focal cues instead of sharing one generic ordering/story pass
- cross-concept screenshot assignment: planning now runs a deterministic shared assignment pass so lead/closing emphasis and support-screen reuse are diversified across concepts instead of repeatedly centering the same screenshot
- screenshot-aware copy generation: copy candidates can now consume screenshot-derived slot signals so hero, differentiator, feature, trust, and summary lines respond to actual screen content instead of only the feature list
- subtitle-aware copy generation: candidate sets now include real subtitle options and final selected copy persists headline/subtitle pairs through materialization and session review
- locale-aware copy generation/selection: deterministic local copy packs now exist for `en`, `es`, `fr`, `de`, and `pt`, and unsupported locales now fall back to English with explicit metadata instead of silently pretending full locale support
- OCR-aware copy de-duplication: generated copy now avoids echoing embedded UI text discovered through OCR/vision sidecars or opt-in local OCR
- final copy-set de-duplication: selection now runs a cross-slot anti-repetition pass so the chosen hero, differentiator, feature, trust, and summary lines do not collapse onto the same phrasing
- broader category-aware copy templates: hero, differentiator, feature, and summary phrase banks now vary more by inferred app category while staying deterministic and local-first
- weak-copy rejection now penalizes raw feature-list / feature-label headlines more aggressively instead of letting them compete with benefit-led lines
- agent-provided copy merging: external or model-assisted copy can now be merged back into the local candidate pool, heuristically rescored, and selected without bundling built-in API-key dependencies
- explicit planning guidance: variant plans now include concept-level frame strategy plus crop-level usage/anchor/avoidance metadata for individual screens and panoramic frames
- plan-aware materialization: generated individual and panoramic configs now consume `frameStrategy` / `cropPlan` instead of only storing them as metadata, including typography/background/device-frame responses
- design recipe selection now varies concept naming, supported recipe labels, strategies, panoramic goals, and screenshot role weighting by inferred app category instead of using one generic 4-concept set for every app
- local-first product direction: core AppFrame behavior should prefer deterministic local logic and agent-provided outputs over bundling new API-key-based model dependencies directly into the app
- autopilot hardening foundations: `appframe_run_autopilot` now persists a stage-by-stage run manifest with resume, forced rerun, stale-artifact detection, structured failure, and explicit preview-next-step metadata
- preview launch helper: agents can now start the preview server directly from MCP with `appframe_open_preview_session` instead of only receiving a shell command
- rendered preview scoring: recommendation now blends config heuristics with rendered PNG analysis for contrast, text-zone safety, whitespace balance, clutter, and panoramic seam continuity
- rendered preview scoring now also penalizes structurally generic outputs when support systems or frame rhythm repeat too mechanically, improving local-first candidate rejection without requiring AI credentials
- rendered preview scoring now also penalizes repeated support-group signatures across panoramic frames, so deterministic support-system breadth shows up in ranking more directly
- rendered preview scoring now also measures set-wide concept diversity, emits concrete layout/copy explanation text, and can run optional live model-assisted visual ranking from rendered previews when AI credentials are available
