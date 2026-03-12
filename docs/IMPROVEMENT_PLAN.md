# appframe Improvement Plan

Based on analysis of ParthJadhav/app-store-screenshots (1.5k+ stars, AI skill for store screenshots)
and a deep audit of appframe's current templates, design quality, and feature gaps.

Date: 2026-03-11

---

## Reference: ParthJadhav/app-store-screenshots

- **What it is**: An AI agent "skill" (a SKILL.md prompt file + 1 mockup PNG). Not a tool — the AI generates a Next.js project from scratch each time.
- **Stars**: 1,496 (went viral in 4 days, created 2026-03-07)
- **Strengths**: Amazing copywriting guidelines, "screenshots are ads not docs" philosophy, varied layouts per slide, conversational UX
- **Weaknesses**: iOS-only, non-deterministic (AI regenerates differently every time), no config, no i18n, no store upload, no Android/iPad/Watch
- **Key insight**: Their value is in the design philosophy and UX, not in code (there is none). appframe has the engine — we need their design quality and discoverability.

---

## Part 1: Design Quality Gaps

### 1.1 Composition Presets Need Usability Work

**Problem**: The composition presets (`peek-right`, `tilt-left`, `duo-overlap`, etc.) exist but have two issues:
1. They appear in zero examples, so users don't know they exist
2. When selected, the device position is **completely locked** — the preset hardcodes offsetX, offsetY, scale, rotation, angle, tilt, and zIndex with no way for the user to adjust from there. The device can't be moved or tweaked at all.

The default `center` layout is the right default — `peek` and `tilt` presets should be used deliberately and carefully. But when users do choose them, they need the ability to fine-tune.

**What they do better**: Every slide in their Bloom example has a different phone placement — centered, offset left, two devices (watch + phone), phone with floating cards, no-phone slide.

**Fix**:
- Make composition presets act as **starting points**, not locks — apply the preset values but allow per-screen overrides of deviceScale, deviceTop, deviceOffsetX, rotation, etc.
- The presets should set initial values that the user can then adjust in the web preview or YAML
- Keep `center`/`single` as the default — the varied compositions should be showcased through AI-generated variant examples (see 2.2), not forced on users

### 1.2 Per-Screen Background Exists but Underused

**Current state**: The schema already supports a per-screen `background` field (`screenConfigSchema` line 223). Each screen can override the theme's background color.

**Gap**: This capability is not showcased in any example config, and no example demonstrates alternating light/dark slides for visual rhythm. The AI agent variants (see 2.2) should demonstrate this pattern — e.g., one variant with consistent backgrounds, another with alternating light/dark for contrast.

**Possible enhancement**: Consider allowing per-screen `style` override too (e.g., screen 1 uses `bold`, screen 2 uses `minimal`) for even more variety.

### 1.3 Text Positioning Could Have More Options

**Current state**: Text can be positioned by the user (not strictly locked), but the default template structure places text at the top-center with `text-align: center`. The web preview allows adjusting position.

**Enhancement opportunity**: High-quality store screenshots (Robinhood, Revolut, Duolingo) use varied text layouts — split layouts (text left, phone right), bottom-positioned text, text overlaid on device screenshots. Adding more explicit `textPosition` options would make this easier:
- `top-center` (default), `top-left`, `top-right`, `bottom-center`, `bottom-left`, `bottom-right`, `overlay`
- Implement the `side-by-side` layout that's declared in the schema but has no implementation — this would enable the text-left/phone-right pattern

### 1.4 Hero Slide Concept (Optional)

**Observation**: Premium App Store sets often treat the first screenshot differently — larger text, app icon, identity-establishing. Currently slide 1 has the same structure as slides 2-5.

**Approach**: This should be **optional**, not forced. The idea is that the AI agent (see 2.2) generates multiple variant examples for the user — one variant might have a hero-style first slide, another might use consistent layouts throughout. The user chooses what they like.

**Implementation options**:
- Add an optional `hero: true` flag per screen that triggers larger headline scale, app icon placement, and potentially a different device size
- Or: a dedicated `hero` composition preset
- Either way, it's a tool in the toolbox — the AI agent decides when to use it based on the app's style

### 1.5 Copy Quality Has No Guardrails

**Problem**: The only copy guidance is buried in the MCP suggestion tool prompt. Schema allows 1-char to infinite headlines. `autoSizeHeadline` defaults to false, so long headlines overflow.

**What they do better**: Entire copywriting framework in SKILL.md — "one idea per headline", "3-5 words per line", "readable at thumbnail size", three approaches (paint a moment, state an outcome, kill a pain).

**Fix**:
- Add `maxLength` warning in validator for headlines (soft warning at >30 chars)
- Default `autoSizeHeadline` to true
- Include copywriting guidelines in `appframe init` comments and README
- Port their 3 copy approaches into the MCP suggestion tool

### 1.6 Background Effects Too Subtle

**Problem**: `flat-circles` effect (used by clean/branded) is nearly invisible (9.4% opacity). `glow` can be too subtle on some color combos.

**Fix**: Increase default opacities. Better to be slightly too visible than invisible.

### 1.7 `side-by-side` Layout Not Implemented

**Problem**: Defined in `layoutVariantSchema` enum but no template handles it. Schema accepts it, validator passes it, template silently renders as `center`.

**Fix**: Either implement it properly or remove it from the schema to stop lying to users.

### 1.8 Composition Presets Are Invisible

**Problem**: `peek-right`, `tilt-left`, `duo-overlap`, `hero-tilt`, `fanned-cards` — these are visually interesting features, but they appear in zero examples and no documentation. Users don't know they exist.

**Fix**:
- Feature them in README documentation with visual examples
- Add a `compositions` gallery/preview to web preview so users can see what each looks like
- The AI agent variant system (see 2.2) is the primary way users will discover these — one variant uses all centered, another uses dynamic compositions
- Add at least one example config that demonstrates a few composition presets

---

## Part 2: New Features

### 2.1 Panoramic Canvas Mode (NEW — HIGH PRIORITY)

**Concept**: A new rendering mode where all screens are designed on a single continuous canvas, then sliced into individual store screenshots at export.

**How it works**:
1. User defines a canvas that is N frames wide (e.g., 5 × 1320px = 6600px wide, 2868px tall)
2. Elements (devices, text, decorations, backgrounds) are placed using **absolute coordinates on the full canvas** — not per-frame
3. Visible "slice lines" show where each individual screenshot will be cut
4. A device can span frames 1-2, text can sit in frame 3, another device can span frames 3-4-5
5. On export, the canvas is sliced at the frame boundaries into individual PNGs at store-required dimensions
6. In the App Store, when a user scrolls, the screenshots feel **connected** — like one continuous scene

**Design reference** (from user-provided images):
- **Reading app example**: 5 frames, 2 phones placed freely across the canvas. Frame 1 has "Cut through the noise" + phone overflowing into frame 2. Frame 3 has "Built around you" + phone overflowing into frames 4-5. Each frame has its own category label and headline, but the devices are positioned on the global canvas.
- **iPhone 15 Pro Max example**: 5 frames on a purple background. A side-view iPhone spans frames 1-2. Front-view phones span frames 3-4-5. Dashed blue lines show the slice boundaries. The user can drag devices around and see how they'll be split. Multiple variations shown (device positions adjusted) to demonstrate editability.

**Key properties**:
- `mode: panoramic` in config (vs default `mode: individual`)
- `frameCount: 5` (how many store screenshots to produce)
- Elements use `canvasX`, `canvasY` absolute positioning (percentage of total canvas)
- Devices can be dragged across frame boundaries in web preview
- Slice lines are visible overlays that can be toggled
- Background is continuous across the full canvas
- Export slices at each frame boundary and outputs individual PNGs

**Why this matters**:
- Many top apps use this technique (creates a "scroll story" effect in the App Store)
- It's the kind of design that's hard to do manually without Figma/Photoshop
- It differentiates appframe from every other screenshot tool
- It's a separate mode, so it doesn't complicate the default individual-screen workflow

**Implementation approach**:
- Render the full panoramic canvas as one wide HTML page in Playwright
- Use Playwright's `page.screenshot({ clip: { x, y, width, height } })` to extract each frame
- Web preview shows the full canvas with draggable elements and visible slice guides
- YAML config uses a `panoramic` section with global element positioning

**YAML config sketch**:
```yaml
mode: panoramic
frameCount: 5

panoramic:
  background:
    type: gradient
    colors: ["#4F46E5", "#6366F1"]
    direction: 135

  elements:
    - type: device
      screenshot: screenshots/home.png
      frame: iphone-17-pro
      # Position as % of total canvas
      x: 5       # left edge at 5% of total width
      y: 20      # top at 20% of height
      width: 30  # 30% of total canvas width
      rotation: -5
      z: 2

    - type: device
      screenshot: screenshots/detail.png
      frame: iphone-17-pro
      x: 45
      y: 15
      width: 35
      rotation: 3
      z: 1

    - type: text
      content: "Cut through\nthe noise."
      x: 2
      y: 5
      fontSize: 4   # % of canvas width
      color: "#FFFFFF"
      fontWeight: 700

    - type: text
      content: "Built around you"
      x: 40
      y: 5
      fontSize: 3.5
      color: "#FFFFFF"
      fontWeight: 700

    - type: label
      content: "AI CURATION"
      x: 2
      y: 3
      frame: 1      # appears in frame 1 area

    - type: decoration
      shape: circle
      x: 2
      y: 70
      size: 8
      color: "#000000"
      opacity: 0.3
```

### 2.2 AI Agent Multi-Variant Generation (CORE STRATEGY)

**Concept**: When AI agents use appframe (via MCP or skill), they should generate 2-3 different complete screenshot sets for the user to choose from. This is central to the appframe experience — instead of the user having to know about composition presets, text positions, background styles, etc., the AI agent explores the design space and presents curated options.

**How it works**:
1. AI agent asks user about their app (name, features, brand colors, style preference, platforms, screenshot count)
2. Agent generates 2-3 complete `appframe.yml` configs, each with a **different design strategy**:
   - Variant A: e.g., minimal style + all centered layouts + light backgrounds (clean, safe)
   - Variant B: e.g., bold style + dynamic compositions (peek, tilt, duo) + dark gradient + alternating backgrounds (energetic, varied)
   - Variant C: e.g., panoramic canvas mode + cross-screen layout (connected, cinematic)
3. Agent runs `appframe generate` for each variant (or just previews screen 1 of each)
4. User picks their favorite, agent refines from there
5. This is how users discover features like composition presets, per-screen backgrounds, hero slides, panoramic mode — through AI-curated examples, not by reading docs

**Implementation**:
- Add an `appframe_generate_variants` MCP tool that returns 2-3 complete configs with different design strategies
- Add a CLI command: `appframe generate --variants 3` that outputs to `output/variant-a/`, `output/variant-b/`, etc.
- Web preview could show variants side-by-side for comparison
- The skill (see 2.3) should instruct AI agents to always generate multiple variants

### 2.3 Create an appframe Skill (SKILL.md)

**Purpose**: Make appframe installable via `npx skills add` for Claude Code, Cursor, Windsurf, and 40+ other AI agents.

**How it differs from app-store-screenshots**:
- Their skill tells the AI to scaffold a Next.js project from scratch
- Our skill tells the AI to use `appframe` CLI (deterministic, reproducible, multi-platform)
- The AI still does the conversational UX (asks about app, brand, style)
- But rendering is done by appframe's Playwright pipeline — consistent results every time

**Skill flow**:
1. Ask user about app (name, features, brand colors, style preference, platforms, screenshot count)
2. Run `appframe init` or directly write an `appframe.yml` with the user's answers
3. Guide user to add their screenshots to `screenshots/` folder
4. Run `appframe generate --variants 2` to produce 2 style variants
5. Preview with `appframe preview` or show output images
6. User picks favorite, agent refines
7. Final `appframe generate` for all platforms/sizes

---

## Part 3: Existing Bug Fixes

### 3.1 `side-by-side` Layout Ghost
Schema defines it, nothing implements it. Either implement or remove from schema.

### 3.2 3D Frame Style Disabled
Most premium visual output path is blocked by Playwright CSS preserve-3d + filter conflict. Worth another attempt with the split-wrapper approach — shadow on outer div, 3D transforms on inner div, with explicit background on the inner div to prevent bleed-through.

### 3.3 Composition Devices Ignore Style Shadow
`composition-devices.html` uses hardcoded `rgba(0,0,0,0.25)` shadow instead of the template's shadow preset. Should read from style context.

---

## Part 4: Action Plan (Priority Order)

### Phase 1: Composition & Layout Fixes (Quick Wins)
1. Make composition presets act as starting points, not locks — allow user overrides of device position after preset is applied
2. Implement or remove `side-by-side` layout (schema declares it, nothing renders it)
3. Increase opacity of `flat-circles` background effect
4. Default `autoSizeHeadline` to true
5. Add headline max-length soft warning in validator
6. Fix composition device shadow to use style presets instead of hardcoded values
7. Add at least one example config that demonstrates varied compositions and per-screen backgrounds

### Phase 2: AI Agent Integration (Core Strategy)
1. Create SKILL.md for `npx skills add` distribution
2. Implement `appframe_generate_variants` MCP tool — generates 2-3 complete configs with different design strategies (centered/safe, dynamic/varied, panoramic/cinematic)
3. Add `--variants N` flag to CLI generate command
4. Enhance MCP `suggest_copy` tool with copywriting framework (paint a moment, state an outcome, kill a pain)
5. Test with Claude Code, Cursor, Windsurf

### Phase 3: Copywriting & Docs
1. Port copy guidelines from app-store-screenshots SKILL.md into README
2. Add "screenshots are ads, not docs" section to README
3. Include copy guidance in `appframe init` output comments

### Phase 4: Panoramic Canvas Mode
1. Design the YAML schema for panoramic mode
2. Implement panoramic renderer (full-canvas → slice at boundaries)
3. Add panoramic editing to web preview (draggable elements, visible slice lines)
4. Create example panoramic configs
5. Integrate panoramic as one of the AI-generated variant options

### Phase 5: Additional Enhancements
1. Add more `textPosition` options (top-left, bottom-center, overlay, etc.)
2. Optional hero slide concept (hero composition preset or `hero: true` flag)
3. Per-screen `style` override (mix templates across slides)

### Phase 6: Community
1. Small PR to ParthJadhav/app-store-screenshots mentioning appframe as complementary tool for Android/multi-platform
2. Publish appframe skill to skills.sh registry

---

## Appendix: Their Copywriting Framework (Reference)

From app-store-screenshots SKILL.md — worth incorporating into appframe's docs and MCP tools:

### Three Approaches Per Headline
| Type | What it does | Example |
|------|-------------|---------|
| Paint a moment | You picture yourself doing it | "Check your coffee without opening the app." |
| State an outcome | What your life looks like after | "A home for every coffee you buy." |
| Kill a pain | Name a problem and destroy it | "Never waste a great bag of coffee." |

### Iron Rules
1. One idea per headline. Never join two things with "and."
2. Short, common words. 1-2 syllables. No jargon unless domain-specific.
3. 3-5 words per line. Must be readable at thumbnail size.
4. Line breaks are intentional. Control where lines break.

### What Never Works
- Feature lists as headlines: "Log every item with tags, categories, and notes"
- Two ideas joined by "and": "Track X and never miss Y"
- Compound clauses: "Save and customize X for every Y you own"
- Vague aspirational: "Every item, tracked"
- Marketing buzzwords: "AI-powered tips" (unless it's actually AI)

### Slide Framework (Narrative Arc)
| Slot | Purpose |
|------|---------|
| #1 | Hero / Main Benefit — app icon + tagline + home screen |
| #2 | Differentiator — what makes this app unique |
| #3 | Ecosystem — widgets, watch, extensions (if applicable) |
| #4+ | Core Features — one feature per slide, most important first |
| 2nd to last | Trust Signal — identity/craft |
| Last | More Features — pills listing extras + coming soon |
