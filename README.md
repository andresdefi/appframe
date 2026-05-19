# appframe

Open-source local editor for generating professional App Store & Play Store promotional screenshots.

Take raw app screenshots, drop them into a local browser-based editor, dress them up with device frames, headlines, styled backgrounds, and professional compositions — and export store-ready PNGs.

<p align="center">
  <img src="docs/screenshots/web-preview-hero.png" alt="appframe web preview — visual editor with gradient backgrounds, device frames, and real-time preview" width="100%" />
</p>

## Screenshots Are Ads, Not Docs

The #1 mistake developers make with store screenshots: showing UI instead of selling outcomes. Every screenshot should sell **one idea**. You're not documenting features — you're selling a feeling, an outcome, or killing a pain point.

**Good**: "Never miss a workout again." (kills a pain)
**Bad**: "View your workout history with filters, tags, and calendar sync" (feature list)

See [Writing Great Copy](#writing-great-copy) below.

## Features

- **8 template styles**: minimal, bold, glow, playful, clean, branded, editorial, fullscreen
- **9 composition presets**: single, peek-right/left, tilt-right/left, duo-overlap, duo-split, hero-tilt, fanned-cards
- **Bundled device frames**: a handful of SVG frames for iPhone, iPad, and Android — the catalog is intentionally small; the bundled-frames quality pass is an open TODO. The Koubou integration (optional, externally installed) opens access to a larger photorealistic frame catalog.
- **Multi-platform output**: iOS, Android, Mac, and Apple Watch at exact store-required dimensions
- **Multi-locale support**: per-locale text, typography, position, and screenshots, all editable side-by-side
- **Variants**: alternate canvases inside a project, each with its own thumbnail, that you can flip between to compare
- **Local-first**: everything lives in `~/Documents/appframe/projects/<slug>/` — no cloud, no account, no telemetry
- **Bundled web fonts**: inter, space-grotesk, poppins, montserrat, dm-sans, plus-jakarta-sans, raleway, playfair-display

## Quick Start

```bash
git clone https://github.com/andresdefi/appframe.git
cd appframe
pnpm install
pnpm build
pnpm preview
```

Then open http://localhost:4400. The editor auto-creates an `Untitled 1` project with three placeholder screens on first launch.

## What the Editor Does

### Background, Device & Text Controls

Configure backgrounds (solid, gradient, image, or preset), select device frames and platforms, edit headlines and subtitles, and adjust typography — all with instant visual feedback.

<p align="center">
  <img src="docs/screenshots/web-preview-gradient.png" alt="Background panel with gradient presets" width="49%" />
  <img src="docs/screenshots/web-preview-device.png" alt="Device panel with platform selection, frame, layout, shadow, and composition controls" width="49%" />
</p>
<p align="center">
  <img src="docs/screenshots/web-preview-text.png" alt="Text panel with headline, subtitle, typography, position, and gradient controls" width="49%" />
  <img src="docs/screenshots/web-preview-extras.png" alt="Extras panel with spotlight, annotations, loupe, callouts, and overlays" width="49%" />
</p>

### Panoramic Mode

Switch to Panoramic mode for a continuous canvas layout where elements can span across frame boundaries — ideal for creating a cohesive visual story across all your App Store screenshots.

<p align="center">
  <img src="docs/screenshots/web-preview-panoramic.png" alt="Panoramic mode — continuous canvas with draggable text and device elements across frames" width="100%" />
</p>

### Export

Choose output sizes for any device class and export individual screens or all of them at once. Multi-locale projects produce one ZIP with a folder per locale; single-locale projects keep files flat at the archive root.

<p align="center">
  <img src="docs/screenshots/web-preview-export.png" alt="Export panel with output size and batch export" width="100%" />
</p>

## Writing Great Copy

Write all headlines **before** designing layouts. Bad copy ruins good design.

### Three Approaches

Use one per slide:

| Approach | What it does | Example |
|----------|-------------|---------|
| **Paint a moment** | Reader pictures themselves doing it | "Check your coffee without opening the app." |
| **State an outcome** | What life looks like after | "A home for every coffee you buy." |
| **Kill a pain** | Name a problem and destroy it | "Never waste a great bag of coffee." |

### The Rules

1. **One idea per headline.** Never join two things with "and."
2. **Short, common words.** 1-2 syllables. No jargon unless domain-specific.
3. **3-5 words per line.** Must be readable at thumbnail size in the App Store.
4. **Line breaks are intentional.** Use the headline editor's newlines to control where lines break.

### What Never Works

- Feature lists: "Log every item with tags, categories, and notes"
- Two ideas with "and": "Track expenses and never miss a bill"
- Vague aspirational: "Every moment, captured"
- Marketing buzzwords: "AI-powered insights" (unless it genuinely is AI)

### Slide Framework

| Slot | Purpose |
|------|---------|
| #1 | **Hero** — app's main benefit, the one thing it does best |
| #2 | **Differentiator** — what makes it unique vs alternatives |
| #3 | **Ecosystem** — widgets, watch, extensions (skip if N/A) |
| #4+ | **Core features** — one per slide, most important first |
| 2nd to last | **Trust signal** — "made for people who [X]" |
| Last | **Summary** — remaining features or coming soon |

## Template Styles

| Style | Description | Best for |
|-------|-------------|----------|
| **minimal** | Clean, light, Apple-style with subtle shadows | Productivity, finance, health, utilities |
| **bold** | Vibrant gradients, large heavy typography, uppercase | Social, entertainment, lifestyle |
| **glow** | Dark premium with glowing color accents | Finance, pro tools, music, photography |
| **playful** | Colorful shapes, fun decorations | Games, education, kids, casual |
| **clean** | Zero decoration, just text + device | Modern no-frills look (YouTube, Uber) |
| **branded** | Strong brand color as background | Apps with strong brand identity |
| **editorial** | Elegant muted tones, italic headings | Lifestyle, wellness, premium |
| **fullscreen** | Full-bleed screenshot, no device frame | Immersive apps |

## Composition Presets

Vary layouts across slides — never use the same composition for every screenshot.

| Preset | Devices | Effect |
|--------|---------|--------|
| `single` | 1 | Default centered device |
| `peek-right` | 1 | Device bleeds off right edge |
| `peek-left` | 1 | Device bleeds off left edge |
| `tilt-left` | 1 | Dramatic tilt overflowing left |
| `tilt-right` | 1 | Dramatic tilt overflowing right |
| `duo-overlap` | 2 | Two overlapping devices |
| `duo-split` | 2 | Two devices on opposite edges |
| `hero-tilt` | 2 | Large hero + smaller background device |
| `fanned-cards` | 3 | Three devices fanned out |

Composition presets set initial device positioning — fine-tune scale, rotation, offset, and angle from there in the Device tab.

**Tip**: Pair `peek-right` on one slide with `peek-left` on the next — when viewed in the App Store, devices appear to span across screenshots.

## Output Sizes

### iOS (App Store)

| Display | Output size |
|---------|-------------|
| iPhone 6.9" | 1260 x 2736 |
| iPhone 6.5" | 1284 x 2778 |
| iPhone 6.3" | 1206 x 2622 |
| iPad 13" | 2064 x 2752 |
| iPad 12.9" | 2048 x 2732 |
| iPad 11" | 1668 x 2388 |

### Android (Google Play)

| Display | Output size |
|---------|-------------|
| Phone | 1080 x 1920 |
| 7" Tablet | 1200 x 1920 |
| 10" Tablet | 1800 x 2560 |
| Feature Graphic | 1024 x 500 |

## Project Storage

Each project lives at `~/Documents/appframe/projects/<slug>/`:

- **`appframe.json`** — full project state (screens, variants, panoramic data, per-locale snapshots).
- **`meta.json`** — small index (displayName, timestamps).
- **`screenshots/`** — uploaded screenshot files referenced by `appframe.json`.

Files are written atomically (`.tmp` + rename), so a crash mid-save never corrupts a project.

## Live `/api/config`

While the preview server is running, the editor's full state is exposed read-only at `http://localhost:4400/api/config`. Tools and agents on the same machine can poll it to see what the editor is currently showing — useful for build pipelines or automated review flows. The endpoint is bound to `127.0.0.1` only by default; cross-origin requests are rejected.

## Development

```bash
pnpm typecheck      # tsc for core + web-preview (server + client)
pnpm lint           # ESLint over packages/*/src/**/*.{ts,tsx}
pnpm test           # Vitest unit + integration
pnpm build          # Build both packages
pnpm preview        # Start the local web editor at http://localhost:4400
pnpm dev            # Watch mode (parallel across packages)
pnpm test:e2e       # Playwright end-to-end tests (dev-only)
```

### Project Structure

```
packages/
  core/           Config schema, template engine, rendering pipeline, frame management
  web-preview/    Express server + React/Vite editor UI
frames/           Bundled device frame SVGs + manifest
fonts/            Bundled open-source web fonts
docs/             Plans + screenshots
```

## Requirements

- Node.js `^20.19.0 || ^22.13.0 || >=24.0.0`
- pnpm 9.15+ (the repo's `packageManager` field)
- A modern Chromium-based browser (Safari and Firefox work too)

## License

MIT — see [LICENSE](LICENSE).

Bundled artwork from third-party creators (hand-drawn arrows, Lucide
icons, device frames, fonts) retains its original license. See
[NOTICE.md](NOTICE.md) for attribution and license details.
