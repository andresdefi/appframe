# appframe — Building Plan

> Open-source tool for generating professional App Store & Play Store promotional screenshots.
> MIT License | Node.js + TypeScript | CLI + MCP Server + Web Preview

---

## Project Summary

**appframe** takes raw app screenshots and transforms them into polished, store-ready promotional images — the kind with device frames, compelling headlines, styled backgrounds, and professional layouts. It replaces paid tools like appscreens.com and app-mockup.com with a free, open-source, AI-agent-friendly alternative.

### Key Design Principles

1. **Theme-driven**: Each app defines its own visual personality — no two apps look the same
2. **AI-collaborative**: An MCP server lets AI agents propose copy, themes, and layouts while the user approves
3. **Multi-platform**: Generates images for both App Store (iOS/iPadOS) and Play Store (Android)
4. **Multi-language**: Screenshots can be generated in any language from a single config
5. **Extensible**: Template-based architecture — anyone can create and share new templates

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    User / AI Agent                   │
├──────────┬──────────────────┬───────────────────────┤
│   CLI    │   MCP Server     │   Web Preview (UI)    │
│ (commands)│ (AI tool calls)  │ (visual tweaking)     │
├──────────┴──────────────────┴───────────────────────┤
│                  Core Engine                         │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌────────┐ │
│  │ Config  │ │ Template │ │ Composer  │ │ Render │ │
│  │ Loader  │ │ Engine   │ │ (layout)  │ │ (PNG)  │ │
│  └─────────┘ └──────────┘ └───────────┘ └────────┘ │
├─────────────────────────────────────────────────────┤
│                  Asset Layer                         │
│  ┌─────────────┐ ┌──────────┐ ┌───────────────────┐ │
│  │Device Frames│ │  Fonts   │ │ Background Assets │ │
│  └─────────────┘ └──────────┘ └───────────────────┘ │
├─────────────────────────────────────────────────────┤
│              Optional Integrations                   │
│  ┌──────────────────┐ ┌────────────────────────────┐ │
│  │ Auto-Capture     │ │ Store Upload               │ │
│  │ (xcrun/adb)      │ │ (ASC API / Google Play API)│ │
│  └──────────────────┘ └────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack Decisions

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Language** | TypeScript (strict) | Type safety, great DX, matches your stack |
| **Runtime** | Node.js | Universal, npm ecosystem |
| **Rendering** | Playwright | Best screenshot API, supports full CSS including 3D transforms, perspective, blend modes, filters, masks — everything we need for designer-level output. Actively maintained. |
| **Templates** | HTML + Tailwind CSS + Nunjucks | Templates are plain HTML files with Tailwind for styling and Nunjucks for variable interpolation. Easy to create, easy to contribute, no framework lock-in. |
| **CLI Framework** | Commander.js | Standard, lightweight, well-documented |
| **MCP Server** | @modelcontextprotocol/sdk | Official MCP SDK for tool definitions |
| **Web Preview** | Vite + vanilla TS | Lightweight dev server, serves templates with live controls |
| **Config Format** | YAML (with JSON schema validation) | Human-readable, supports comments, familiar |
| **Image Processing** | Sharp | Post-processing (resize, optimize, format conversion) |
| **Package Manager** | pnpm | Fast, disk-efficient, good monorepo support |

---

## Store Screenshot Specifications

### Apple App Store

| Device | Label | Size (px) | Required |
|--------|-------|-----------|----------|
| iPhone 6.7" | iPhone 15/16 Pro Max | 1290 × 2796 | Yes |
| iPhone 6.5" | iPhone 14 Plus / 13 Pro Max | 1284 × 2778 | Yes |
| iPhone 5.5" | iPhone 8 Plus | 1242 × 2208 | Optional |
| iPad 12.9" | iPad Pro (6th gen) | 2048 × 2732 | Per app |
| iPad 11" | iPad Pro 11" | 1668 × 2388 | Per app |

- Up to 10 screenshots per localization
- Accepted formats: PNG, JPEG
- No alpha channel for JPEG

### Google Play Store

| Asset | Size (px) | Required |
|-------|-----------|----------|
| Phone screenshots | 1080 × 1920 (min 320px, max 3840px, 16:9 or 9:16) | Yes |
| 7" tablet | 1200 × 1920 | Optional |
| 10" tablet | 1800 × 2560 | Optional |
| Feature graphic | 1024 × 500 | Yes |

- 2-8 screenshots per listing
- PNG or JPEG, max 8MB each

---

## Project Structure

```
appframe/
├── packages/
│   ├── core/                    # Core engine (config, templates, rendering)
│   │   ├── src/
│   │   │   ├── config/          # Config loading, validation, schema
│   │   │   ├── templates/       # Template engine (Nunjucks + Tailwind)
│   │   │   ├── composer/        # Layout composition logic
│   │   │   ├── renderer/        # Playwright rendering to PNG
│   │   │   ├── frames/          # Device frame management
│   │   │   ├── fonts/           # Font management
│   │   │   ├── i18n/            # Localization utilities
│   │   │   └── index.ts         # Public API
│   │   ├── templates/           # Built-in HTML templates
│   │   │   ├── minimal/         # Apple-clean style
│   │   │   ├── bold/            # Vibrant & energetic style
│   │   │   ├── dark/            # Dark & premium style
│   │   │   ├── playful/         # Fun, colorful style
│   │   │   └── _base/           # Shared base layout/components
│   │   └── package.json
│   ├── cli/                     # CLI interface
│   │   ├── src/
│   │   │   ├── commands/        # generate, preview, init, capture, upload
│   │   │   └── index.ts
│   │   └── package.json
│   ├── mcp-server/              # MCP server for AI agents
│   │   ├── src/
│   │   │   ├── tools/           # MCP tool definitions
│   │   │   └── index.ts
│   │   └── package.json
│   ├── web-preview/             # Local web UI for previewing/tweaking
│   │   ├── src/
│   │   └── package.json
│   └── store-upload/            # Optional store upload integration
│       ├── src/
│       │   ├── apple/           # App Store Connect API
│       │   ├── google/          # Google Play Developer API
│       │   └── index.ts
│       └── package.json
├── frames/                      # Device frame assets (SVG/PNG)
│   ├── apple/
│   │   ├── iphone-16-pro-max/
│   │   ├── iphone-17-pro-max/
│   │   ├── ipad-pro-13/
│   │   └── ...
│   ├── android/
│   │   ├── pixel-10/
│   │   └── generic/
│   └── manifest.json            # Frame metadata (dimensions, offsets, etc.)
├── fonts/                       # Bundled fonts (open-source only)
│   ├── inter/
│   ├── space-grotesk/
│   └── ...
├── examples/                    # Example app configs + screenshots
│   ├── expense-tracker/
│   ├── party-game/
│   └── tradesperson-app/
├── docs/                        # Documentation
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── package.json
├── LICENSE                      # MIT
└── BUILDING_PLAN.md             # This file
```

---

## Phases

---

### Phase 1 — Project Scaffolding

**Objective**: Set up the monorepo, tooling, and basic project structure so everything builds and links correctly.

**Checkpoints**:
- [ ] Initialize git repo
- [ ] Create `pnpm-workspace.yaml` with all packages
- [ ] Set up root `package.json` with workspace scripts
- [ ] Create `tsconfig.base.json` with strict TypeScript config
- [ ] Scaffold all 5 packages (`core`, `cli`, `mcp-server`, `web-preview`, `store-upload`) with `package.json` and `tsconfig.json`
- [ ] Add ESLint + Prettier config (minimal, not opinionated)
- [ ] Add `.gitignore`, `LICENSE` (MIT), basic `README.md`
- [ ] Verify `pnpm install` and `pnpm build` work across all packages
- [ ] Create initial `CLAUDE.md` with project conventions

**Deliverables**: Clean monorepo that builds. All packages exist as stubs.

---

### Phase 2 — Config System

**Objective**: Design and implement the per-app configuration schema — this is the contract between the user and the tool.

**Checkpoints**:
- [ ] Design the YAML config schema (JSON Schema for validation)
- [ ] Implement config loader (`packages/core/src/config/`)
- [ ] Support the following config sections:
  - [ ] `app`: name, description, platforms, features (metadata for AI copy generation)
  - [ ] `theme`: style preset, colors (primary, secondary, accent, text, background), font family, font weight
  - [ ] `screens`: array of screen definitions, each with:
    - [ ] `screenshot`: path to raw screenshot file
    - [ ] `headline`: promotional text (supports i18n keys)
    - [ ] `subtitle`: optional secondary text
    - [ ] `layout`: positioning variant (center, left, right, angled-left, angled-right, floating, side-by-side)
    - [ ] `device`: override device frame for this screen (optional)
    - [ ] `background`: override background for this screen (optional)
  - [ ] `locales`: language definitions with translated strings
  - [ ] `output`: target platforms, sizes, formats, quality, output directory
  - [ ] `frames`: device frame preferences (exact model, generic, or none)
- [ ] Validate config with clear error messages on invalid input
- [ ] Write `appframe init` scaffolding (generates a starter config from prompts)
- [ ] Create 3 example configs (expense tracker, party game, tradesperson app)

**Deliverables**: Working config system. `appframe init` generates a valid config. Examples in `/examples/`.

**Example config** (for reference during build):
```yaml
app:
  name: "SpendWise"
  description: "Personal expense tracker with smart categorization"
  platforms: [ios, android]
  features:
    - Smart expense categorization
    - Monthly budget tracking
    - Beautiful charts and insights
    - Multi-currency support

theme:
  style: minimal
  colors:
    primary: "#2563EB"
    secondary: "#7C3AED"
    background: "#F8FAFC"
    text: "#0F172A"
    subtitle: "#64748B"
  font: inter
  fontWeight: 600

frames:
  ios: iphone-16-pro-max
  android: pixel-10
  style: flat  # flat | 3d | floating | none

screens:
  - screenshot: home.png
    headline: "Every expense, instantly tracked"
    subtitle: "Smart categorization does the work for you"
    layout: center

  - screenshot: charts.png
    headline: "See where your money goes"
    layout: angled-right

  - screenshot: budget.png
    headline: "Stay on budget, effortlessly"
    layout: left

locales:
  en:
    screens:
      - headline: "Every expense, instantly tracked"
        subtitle: "Smart categorization does the work for you"
      - headline: "See where your money goes"
      - headline: "Stay on budget, effortlessly"
  es:
    screens:
      - headline: "Cada gasto, registrado al instante"
        subtitle: "La categorización inteligente hace el trabajo por ti"
      - headline: "Mira a dónde va tu dinero"
      - headline: "Mantente en presupuesto, sin esfuerzo"

output:
  platforms: [ios, android]
  ios:
    sizes: [6.7, 6.5]
    format: png
  android:
    sizes: [phone]
    format: png
    featureGraphic: true
  directory: ./output
```

---

### Phase 3 — Device Frame System

**Objective**: Build a system for managing device frame assets (SVG/PNG) that can be updated as new devices are released.

**Checkpoints**:
- [ ] Design frame manifest schema (`frames/manifest.json`):
  - [ ] Device name, model year, manufacturer
  - [ ] Frame image path (SVG preferred, PNG fallback)
  - [ ] Screen area coordinates (x, y, width, height, border-radius) — where the screenshot sits inside the frame
  - [ ] Physical screen resolution
  - [ ] Aspect ratio
- [ ] Create or source device frame assets:
  - [ ] iPhone 16 Pro Max (latest available, updatable)
  - [ ] iPhone 15 Pro Max
  - [ ] iPad Pro 13" / 11"
  - [ ] Pixel 9 Pro / 10 (latest available)
  - [ ] Generic modern phone (fallback)
  - [ ] Generic modern tablet (fallback)
- [ ] Build frame loader utility that reads manifest and resolves frame assets
- [ ] Build screenshot-into-frame compositor (places raw screenshot at correct coordinates inside device frame)
- [ ] Support frame styles:
  - [ ] `flat`: Straight-on view, no perspective
  - [ ] `3d`: CSS 3D transform applied (perspective + rotation)
  - [ ] `floating`: Frame with shadow, slightly elevated look
  - [ ] `none`: No frame, just screenshot with rounded corners + shadow
- [ ] Add CLI command: `appframe frames list` — lists available frames
- [ ] Add CLI command: `appframe frames add <path>` — adds a custom frame
- [ ] Document how contributors can add new device frames

**Deliverables**: Working frame system with at least 4 real device frames and 2 generic fallbacks. Frames are updatable.

**Note on sourcing frames**: We'll need to create clean SVG device frames. Options:
1. Trace from Apple/Google design resources (check licensing)
2. Create minimal, clean SVG frames from scratch (safest for MIT license)
3. Use/adapt existing open-source frame assets (must be MIT/compatible)

Best approach: Create our own minimal SVG frames — clean outlines with the correct proportions. They'll be distinctive to appframe and free of licensing concerns.

---

### Phase 4 — Template Engine & Built-in Templates

**Objective**: Build the template rendering system and create the first set of professional templates.

**Checkpoints**:
- [ ] Set up Nunjucks environment with custom filters and helpers
- [ ] Integrate Tailwind CSS into templates (inline via CDN or pre-built CSS bundle)
- [ ] Build template resolution system (find template by name, support custom template directories)
- [ ] Define template interface/contract:
  - [ ] Required variables: `headline`, `subtitle`, `screenshot`, `device_frame`, `colors`, `font`
  - [ ] Optional variables: `badge`, `icon`, `secondary_screenshot`
  - [ ] Layout slots: `background`, `device_area`, `text_area`
- [ ] Create base template with shared structure (`_base/`)
- [ ] Build **Template: Minimal** (`minimal/`)
  - [ ] Light, clean backgrounds (white, light gray, soft pastels)
  - [ ] Thin/medium weight sans-serif typography
  - [ ] Centered device with headline above or below
  - [ ] Generous whitespace
  - [ ] Variants: center, left-aligned, right-aligned
- [ ] Build **Template: Bold** (`bold/`)
  - [ ] Strong gradient backgrounds
  - [ ] Large, heavy typography
  - [ ] Saturated colors, high contrast
  - [ ] Angled/tilted device frames
  - [ ] Variants: angled-left, angled-right, hero-center
- [ ] Build **Template: Dark** (`dark/`)
  - [ ] Dark backgrounds (#0a0a0a to #1a1a2e)
  - [ ] Glowing/luminous accent colors
  - [ ] Subtle light effects (glows, reflections)
  - [ ] Sleek, premium feel
  - [ ] Variants: center-glow, side-by-side, floating
- [ ] Build **Template: Playful** (`playful/`)
  - [ ] Rounded shapes, bubbly feel
  - [ ] Bright, fun colors
  - [ ] Decorative elements (dots, waves, confetti shapes via CSS)
  - [ ] Rounded typography
  - [ ] Variants: bouncy, stacked, scattered
- [ ] Each template supports all layout variants defined in config
- [ ] Each template renders correctly at all required sizes (iPhone, iPad, Android)
- [ ] Templates handle text overflow gracefully (truncation, scaling)

**Deliverables**: 4 complete template families, each with 3+ layout variants. Templates render pixel-perfect at all sizes.

---

### Phase 5 — Rendering Engine (Playwright)

**Objective**: Build the core rendering pipeline that takes a config + template + assets and produces final PNG images.

**Checkpoints**:
- [ ] Set up Playwright as a dependency (chromium only, minimize install size)
- [ ] Build renderer module:
  - [ ] Accepts: composed HTML string, target width/height, output path
  - [ ] Launches headless browser, sets viewport to exact pixel size
  - [ ] Renders HTML, waits for all assets (images, fonts) to load
  - [ ] Takes screenshot at exact dimensions, saves as PNG
  - [ ] Handles device pixel ratio (2x for retina-quality output)
- [ ] Build composition pipeline:
  - [ ] Load config → resolve template → inject variables → render HTML string
  - [ ] For each screen in config, for each locale, for each target size: render one image
  - [ ] Parallel rendering (multiple browser contexts for speed)
- [ ] Post-processing with Sharp:
  - [ ] Optional JPEG conversion with quality control
  - [ ] Optional resize/optimization
  - [ ] Metadata stripping
- [ ] Output file naming convention: `{app}_{platform}_{size}_{locale}_{screen_index}.png`
- [ ] Build the main `generate` function that orchestrates everything
- [ ] Performance: rendering 10 screenshots should take < 30 seconds
- [ ] Error handling: clear messages when screenshots are missing, templates not found, etc.

**Deliverables**: `appframe generate` produces all screenshots for all platforms, sizes, and locales from a single config. Output images match store specifications exactly.

---

### Phase 6 — CLI Interface

**Objective**: Build the full CLI with all commands.

**Checkpoints**:
- [ ] Set up Commander.js with main `appframe` command
- [ ] Implement commands:
  - [ ] `appframe init` — Interactive setup: asks app name, style preference, platforms, languages → generates config YAML
  - [ ] `appframe generate` — Main command: reads config, generates all screenshots
    - [ ] `--config <path>` — path to config file (default: `./appframe.yml`)
    - [ ] `--platform <ios|android|all>` — filter by platform
    - [ ] `--locale <code>` — filter by locale
    - [ ] `--screen <index>` — generate a single screen
    - [ ] `--output <dir>` — override output directory
    - [ ] `--template <name>` — override template for all screens
    - [ ] `--dry-run` — show what would be generated without rendering
  - [ ] `appframe preview` — Opens web preview (Phase 8)
  - [ ] `appframe capture` — Auto-capture screenshots from simulator/emulator (Phase 7)
  - [ ] `appframe frames list` — List available device frames
  - [ ] `appframe frames add` — Add custom frame
  - [ ] `appframe upload` — Upload to stores (Phase 10)
  - [ ] `appframe validate` — Validate config without generating
- [ ] Progress indicators (spinner, progress bar) for generation
- [ ] Colored, informative terminal output
- [ ] `npx appframe` works without global install
- [ ] Man page / `--help` for every command

**Deliverables**: Fully functional CLI. User can go from `appframe init` to `appframe generate` and have store-ready screenshots.

---

### Phase 7 — Auto-Capture Integration

**Objective**: Optionally capture screenshots from running iOS Simulator or Android Emulator.

**Checkpoints**:
- [ ] iOS Simulator capture:
  - [ ] Use `xcrun simctl io <device> screenshot <path>` to capture
  - [ ] List available simulators: `xcrun simctl list devices`
  - [ ] Support specifying simulator by name or UDID in config
  - [ ] Capture multiple screens in sequence (user navigates, tool captures on keypress or timer)
- [ ] Android Emulator capture:
  - [ ] Use `adb exec-out screencap -p > <path>` to capture
  - [ ] List available devices: `adb devices`
  - [ ] Support specifying device in config
  - [ ] Same sequential capture flow
- [ ] `appframe capture` command:
  - [ ] `--platform <ios|android>`
  - [ ] `--device <name|id>`
  - [ ] `--output <dir>` (defaults to config's screenshot directory)
  - [ ] `--count <n>` — number of screenshots to capture
  - [ ] `--delay <ms>` — delay between captures (for timed mode)
  - [ ] `--interactive` — press Enter to capture each screenshot
- [ ] Captured screenshots are named and placed correctly for the config to reference

**Deliverables**: `appframe capture` grabs raw screenshots from simulators/emulators with minimal setup.

---

### Phase 8 — Web Preview

**Objective**: Build a local web UI for previewing and tweaking screenshots before final export.

**Checkpoints**:
- [ ] Set up Vite dev server in `packages/web-preview/`
- [ ] Build preview interface:
  - [ ] Renders all screens from the config side-by-side
  - [ ] Shows each screen at actual pixel ratio (scrollable/zoomable)
  - [ ] Screen selector (click to focus on one screen)
- [ ] Interactive controls panel:
  - [ ] Edit headline/subtitle text live
  - [ ] Color picker for theme colors
  - [ ] Template switcher (swap between minimal/bold/dark/playful)
  - [ ] Layout variant selector
  - [ ] Device frame selector
  - [ ] Background type selector (solid, gradient, image)
  - [ ] Font selector from available fonts
  - [ ] 3D angle sliders (for perspective transforms)
- [ ] Locale switcher — preview each language
- [ ] Platform/size switcher — preview iPhone, iPad, Android sizes
- [ ] Export button:
  - [ ] "Export current" — renders the currently previewed screen
  - [ ] "Export all" — triggers full generation
  - [ ] "Save config" — writes current settings back to YAML file
- [ ] `appframe preview` command opens this UI in default browser
- [ ] Hot-reload when config file changes on disk
- [ ] Side-by-side comparison mode (before/after, or two templates)

**Deliverables**: Fully interactive web UI for previewing, tweaking, and exporting screenshots. Connected to the core engine.

---

### Phase 9 — MCP Server (AI Agent Integration)

**Objective**: Build an MCP server that lets AI agents (Claude, etc.) drive appframe collaboratively.

**Checkpoints**:
- [ ] Set up MCP server using `@modelcontextprotocol/sdk`
- [ ] Implement MCP tools:
  - [ ] `appframe_init` — Create a new config for an app
    - Input: app name, description, features, platform, style preference
    - Output: generated YAML config
  - [ ] `appframe_suggest_copy` — Generate promotional headlines for screenshots
    - Input: app metadata, screenshot descriptions, target locale
    - Output: suggested headlines and subtitles for each screen
  - [ ] `appframe_suggest_theme` — Propose a visual theme for an app
    - Input: app metadata, style preference, reference colors
    - Output: complete theme config (colors, font, style, layout suggestions)
  - [ ] `appframe_generate` — Render screenshots
    - Input: config path or inline config
    - Output: paths to generated images
  - [ ] `appframe_preview_screen` — Render a single screen for preview
    - Input: screen config (inline)
    - Output: base64 PNG or file path to preview image
  - [ ] `appframe_list_templates` — List available templates with descriptions
  - [ ] `appframe_list_frames` — List available device frames
  - [ ] `appframe_validate_config` — Validate a config file
  - [ ] `appframe_update_config` — Modify specific fields in an existing config
    - Input: config path, field path, new value
    - Output: updated config
  - [ ] `appframe_capture` — Trigger screenshot capture from simulator/emulator
  - [ ] `appframe_upload` — Upload to stores (when Phase 10 is complete)
- [ ] MCP resources:
  - [ ] Expose current config as a readable resource
  - [ ] Expose template catalog as a resource
  - [ ] Expose generated screenshots as image resources
- [ ] Collaborative workflow support:
  - [ ] Agent suggests → user previews in web UI → agent adjusts → repeat
  - [ ] Agent can read preview state and make targeted adjustments
- [ ] Documentation for connecting to Claude Code, Cursor, or other MCP clients
- [ ] Publish as installable MCP server (`npx @appframe/mcp-server`)

**Deliverables**: Working MCP server. AI agent can drive the full workflow: init → suggest → generate → preview → adjust → export.

---

### Phase 10 — Store Upload (Optional)

**Objective**: Enable direct upload of generated screenshots to App Store Connect and Google Play Console.

**Checkpoints**:
- [ ] App Store Connect integration:
  - [ ] Use App Store Connect API (v2, REST)
  - [ ] Authentication via API key (p8 file + key ID + issuer ID)
  - [ ] Upload screenshots to specific app version + localization
  - [ ] Replace existing screenshots
  - [ ] Set screenshot display order
  - [ ] Config section for ASC credentials (or env vars)
- [ ] Google Play Console integration:
  - [ ] Use Google Play Developer API (v3)
  - [ ] Authentication via service account JSON
  - [ ] Upload screenshots to specific listing + language
  - [ ] Support feature graphic upload
  - [ ] Config section for Google Play credentials (or env vars)
- [ ] `appframe upload` command:
  - [ ] `--platform <ios|android|all>`
  - [ ] `--locale <code>` — upload specific locale
  - [ ] `--dry-run` — show what would be uploaded
  - [ ] Confirmation prompt before uploading (destructive: replaces existing screenshots)
- [ ] Upload progress indicators
- [ ] Error handling for auth failures, quota limits, invalid images
- [ ] Never store credentials in config — env vars or credential file only

**Deliverables**: `appframe upload` pushes generated screenshots to both stores. Credentials are handled securely.

---

### Phase 11 — Polish, Testing & Documentation

**Objective**: Make appframe production-ready and open-source-ready.

**Checkpoints**:
- [ ] Testing:
  - [ ] Unit tests for config validation, template variable injection, frame manifest loading
  - [ ] Integration tests for rendering pipeline (config → PNG output, verify dimensions)
  - [ ] Snapshot tests for template output (visual regression)
  - [ ] CLI tests (command parsing, flag handling)
  - [ ] MCP server tool tests
- [ ] Error handling audit:
  - [ ] Every user-facing error has a clear message and suggested fix
  - [ ] No silent failures
  - [ ] Graceful degradation (missing font falls back, missing frame uses generic)
- [ ] Performance:
  - [ ] Benchmark rendering times
  - [ ] Optimize parallel rendering (browser context pooling)
  - [ ] Lazy-load Playwright (only install when first needed)
- [ ] Documentation:
  - [ ] README with quick start, features, examples
  - [ ] Config reference (every field documented)
  - [ ] Template authoring guide (how to create custom templates)
  - [ ] Frame contribution guide (how to add new device frames)
  - [ ] MCP integration guide
  - [ ] API documentation (for using core as a library)
- [ ] Open source:
  - [ ] CONTRIBUTING.md
  - [ ] CODE_OF_CONDUCT.md
  - [ ] Issue templates (bug report, feature request, new template, new frame)
  - [ ] PR template
  - [ ] GitHub Actions CI (lint, test, build on push)
  - [ ] npm publish workflow
- [ ] Examples:
  - [ ] 3 complete example apps with configs, raw screenshots, and generated output
  - [ ] Each example uses a different template style
  - [ ] README per example explaining the choices

**Deliverables**: Production-quality open-source project ready for `npm publish` and GitHub release.

---

### Phase 12 — Launch

**Objective**: Publish and announce.

**Checkpoints**:
- [ ] Publish to npm: `appframe` (CLI), `@appframe/core`, `@appframe/mcp-server`
- [ ] Create GitHub repo with all code, docs, examples
- [ ] Create GitHub release v1.0.0 with changelog
- [ ] Write launch README with screenshots of appframe's own output (meta!)
- [ ] Test installation from scratch: `npx appframe init` → `npx appframe generate`
- [ ] Verify MCP server installation works: `npx @appframe/mcp-server`

**Deliverables**: Live on npm and GitHub. Anyone can `npx appframe` and start generating screenshots.

---

## Build Order & Dependencies

```
Phase 1 (Scaffolding)
  ↓
Phase 2 (Config)
  ↓
Phase 3 (Frames) ←── can start in parallel with Phase 4
  ↓
Phase 4 (Templates) ←── depends on config schema from Phase 2
  ↓
Phase 5 (Renderer) ←── depends on templates + frames
  ↓
Phase 6 (CLI) ←── depends on renderer
  ↓
Phase 7 (Auto-Capture) ←── independent, can start after Phase 6
Phase 8 (Web Preview) ←── depends on renderer + templates
Phase 9 (MCP Server) ←── depends on core engine (Phase 5)
  ↓
Phase 10 (Store Upload) ←── independent, can start anytime after Phase 6
  ↓
Phase 11 (Polish) ←── after all features complete
  ↓
Phase 12 (Launch)
```

Phases 7, 8, 9, and 10 can be built in parallel once Phase 6 is complete.

---

## Risk Considerations

| Risk | Mitigation |
|------|-----------|
| Device frame licensing | Create our own SVG frames from scratch. Clean, minimal designs. |
| Font licensing | Bundle only open-source fonts (Inter, Space Grotesk, etc.). Support system fonts. |
| Playwright install size (~200MB) | Lazy-install on first use. Document the requirement clearly. Consider optional Sharp-only mode for simpler templates. |
| Store API changes | Isolate upload logic in its own package. Version-pin API clients. |
| Template quality | Start with fewer but polished templates. Quality over quantity. |
| New device releases | Frame manifest is a simple JSON + image. Adding a new device is a 5-minute PR. Document the process. |

---

## Success Criteria for v1.0

1. A user can go from `npx appframe init` to store-ready screenshots in under 5 minutes
2. Output quality matches or exceeds paid tools like appscreens.com
3. An AI agent (via MCP) can drive the full workflow collaboratively
4. Multi-language screenshots generated from a single config
5. Both App Store and Play Store formats supported
6. At least 4 template styles with 3+ layout variants each
7. Clean, well-documented open-source repo that invites contributions
