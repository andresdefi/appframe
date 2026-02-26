# Appframe + Koubou Integration Plan

Combine appframe's interactive Web UI and automation pipeline with Koubou's rendering engine to create the best App Store screenshot tool.

## The Vision

```
┌─────────────────────────────────────────────────┐
│                   APPFRAME                       │
│                                                  │
│  Web UI (live preview, sliders, drag-and-drop)   │
│  Template system (glow, bold, minimal, etc.)     │
│  Multi-device compositions                       │
│  AI automation pipeline                          │
│  MCP server for agent integration                │
│                                                  │
│         ┌──────────────────────┐                 │
│         │   Config Translator  │                 │
│         │  appframe.yml → kou  │                 │
│         └──────────┬───────────┘                 │
│                    │                             │
│         ┌──────────▼───────────┐                 │
│         │       KOUBOU         │                 │
│         │                      │                 │
│         │  100+ device frames  │                 │
│         │  Gradient text       │                 │
│         │  Annotations/zoom    │                 │
│         │  Spotlight effects   │                 │
│         │  xcstrings i18n      │                 │
│         │  Pixel-perfect PNG   │                 │
│         └──────────────────────┘                 │
└─────────────────────────────────────────────────┘
```

**Two rendering modes:**
- **Preview mode** — HTML/CSS via iframe (instant, interactive, current system)
- **Export mode** — Koubou generates final PNGs (pixel-perfect, 100+ device frames)

---

## Phase 1: Koubou as Export Backend

Replace Playwright with Koubou for final screenshot export. Keep HTML preview for the Web UI.

### 1.1 Install & Detect Koubou
- [x] Add Koubou as an optional dependency (`pip install koubou` or `brew install koubou`)
- [x] Add `kou` binary detection in CLI (`which kou` check)
- [x] Graceful fallback: if Koubou not installed, use existing Playwright export
- [x] Add `appframe setup` command that installs Koubou automatically
- [x] Document installation in README

### 1.2 Config Translator: appframe.yml → Koubou YAML
- [x] Create `packages/core/src/koubou/translator.ts` module
- [x] Map appframe template styles to Koubou background configs:
  ```
  glow     → linear gradient, dark colors, accent glow
  bold     → solid or radial gradient, vibrant colors
  minimal  → solid light background
  clean    → solid white/light background
  playful  → radial gradient, warm colors
  branded  → solid brand color background
  editorial → solid muted/warm background
  fullscreen → no background, image fills canvas
  ```
- [x] Map appframe device frames to Koubou device names:
  ```
  iphone-16-pro-max → "iPhone 16 Pro Max Portrait"
  iphone-16-pro     → "iPhone 16 Pro Portrait"
  pixel-10          → (Android not supported by Koubou — fallback to Playwright)
  ```
- [x] Map appframe layout variants to Koubou image positioning:
  ```
  center       → position: ["50%", "55%"], scale: 0.85, frame: true
  angled-left  → position + rotation (if Koubou supports rotation, else approximate)
  angled-right → position + rotation
  floating     → position: ["50%", "58%"], scale: 0.80, frame: true, drop shadow
  ```
- [x] Map headline/subtitle to Koubou text elements:
  ```yaml
  - type: "text"
    content: "Trust No One"
    position: ["50%", "8%"]
    size: 52
    color: "#F8FAFC"
    weight: "bold"
    font: "Inter-Bold.ttf"
    alignment: "center"
  - type: "text"
    content: "The ultimate party bluffing game"
    position: ["50%", "14%"]
    size: 22
    color: "#94A3B8"
    alignment: "center"
  ```
- [x] Map appframe colors to Koubou background gradient configs
- [x] Map font selection to Koubou font names (resolved from FONT_CATALOG; requires system-installed fonts)
- [x] Output a valid Koubou YAML config file

### 1.3 Multi-Device Composition Support
- [x] For single-device presets (peek-right, tilt-left, etc.): map to Koubou image positioning with offset/rotation
- [x] For multi-device compositions (duo-overlap, fanned-cards): generate multiple image elements in Koubou content array with different positions, scales, and z-ordering
- [x] Check if Koubou supports image rotation — confirmed: `rotation` key works natively on image elements

### 1.4 Export Pipeline
- [x] Add `--renderer koubou` flag to `appframe generate` command
- [x] Generate Koubou YAML config per screen
- [x] Call `kou generate <config.yaml>` for each screen
- [x] Collect output PNGs and rename to appframe naming convention
- [x] Clean up temporary Koubou YAML files
- [x] Report progress and results

### 1.5 Verification
- [x] Generate same screenshots with both Playwright and Koubou backends
- [x] Visual comparison to ensure feature parity
- [x] Performance comparison (speed of export)

**Verification Results:**
| | Playwright | Koubou |
|---|---|---|
| Frame quality | SVG overlay (flat) | Photorealistic 3D bezel |
| Background | CSS gradient with glow effects | Linear/radial gradient |
| Text font | Embedded woff2 (exact match) | System font fallback (Arial if font not installed) |
| Output size | Exact App Store dimensions | Exact App Store dimensions |
| Speed (2 images) | ~3s | ~15s |
| File size | ~270KB | ~530KB (more detail) |

---

## Phase 2: Import Koubou's Device Frames

Bring Koubou's 100+ device frames into appframe's preview system.

### 2.1 Frame Catalog Sync
- [ ] Survey all Koubou device frames and their identifiers
- [ ] Map Koubou frame names to appframe frame manifest entries
- [ ] For preview: extract frame images from Koubou's frame assets and convert to SVG or PNG overlays for HTML preview
- [ ] Update `frames/manifest.json` with new frame entries referencing Koubou frames
- [ ] Add frame metadata: screen area coordinates, border radius, resolution

### 2.2 Frame Selection UI
- [ ] Update Web UI frame dropdown to show full Koubou device catalog
- [ ] Group frames by device family (iPhone 16, iPhone 15, iPad, Mac, Watch)
- [ ] Show frame preview thumbnail in dropdown
- [ ] Auto-select appropriate frame based on export target size

---

## Phase 3: Add Koubou-Exclusive Features to Appframe

Expose Koubou's advanced features through appframe's Web UI.

### 3.1 Gradient Text
- [ ] Add gradient text option in Web UI (start color, end color, direction)
- [ ] Map to Koubou's gradient text config in translator
- [ ] Preview via CSS `background-clip: text` in HTML preview (close approximation)

### 3.2 Annotations & Highlights
- [ ] Add annotation layer in Web UI: click on the preview to place highlights
- [ ] Support highlight shapes: circle, rounded rect, rectangle
- [ ] Configure stroke color, fill, blur background
- [ ] Map to Koubou highlight elements in translator

### 3.3 Zoom Callouts
- [ ] Add zoom callout tool: select source region, place magnified callout
- [ ] Configure magnification level, connector style, shadow
- [ ] Map to Koubou zoom_callout elements in translator
- [ ] Preview via CSS transform: scale() with connector SVG overlay

### 3.4 Spotlight/Dimming Effect
- [ ] Add spotlight mode: dim everything except a highlighted area
- [ ] Map to Koubou's blur_background feature

---

## Phase 4: Localization Integration

Leverage Koubou's xcstrings localization for multi-language screenshot generation.

### 4.1 xcstrings Support
- [ ] Add xcstrings import/export to appframe config
- [ ] When Koubou is available, use its native xcstrings workflow
- [ ] Map appframe's `locales` YAML section to Koubou localization config
- [ ] Generate localized screenshots for all languages in one `kou generate` pass

### 4.2 Localized Asset Resolution
- [ ] Support per-locale screenshots (different app screenshots per language)
- [ ] Follow Koubou's convention: `{lang}/screenshot.png` directory structure
- [ ] Fallback chain: locale-specific → base language → default

---

## Phase 5: Unified CLI Experience

Single command that handles everything.

### 5.1 Smart Export
- [ ] `appframe generate` auto-detects Koubou and uses it when available
- [ ] Falls back to Playwright when Koubou is not installed
- [ ] `appframe generate --renderer playwright|koubou` for explicit selection
- [ ] Show which renderer is being used in output

### 5.2 Koubou Config Preview
- [ ] `appframe koubou-config` command that outputs the translated Koubou YAML without rendering
- [ ] Useful for debugging and for users who want to customize the Koubou config directly
- [ ] `appframe koubou-config --screen 1` for a single screen

### 5.3 Live Mode Integration
- [ ] When user exports from Web UI, use Koubou for final render
- [ ] Web UI preview stays HTML-based (fast), export button triggers Koubou (pixel-perfect)
- [ ] Show "Rendering with Koubou..." status in UI during export

---

## Implementation Priority

1. **Phase 1.1-1.2** (Koubou detection + config translator) — foundation, unblocks everything
2. **Phase 1.4** (Export pipeline) — immediate value, Koubou quality for exports
3. **Phase 2** (Device frames) — biggest visual upgrade for previews
4. **Phase 3.1** (Gradient text) — quick win, high visual impact
5. **Phase 5.1** (Smart export) — polish the CLI experience
6. **Phase 3.2-3.4** (Annotations) — advanced features
7. **Phase 4** (Localization) — important for production use

---

## Architecture Notes

### Why Two Renderers?

| | HTML/Playwright (Preview) | Koubou (Export) |
|---|---|---|
| Speed | Instant (iframe) | Seconds per image |
| Interactivity | Full (sliders, drag-drop) | None (batch) |
| Device frames | SVG overlays (limited) | 100+ photorealistic |
| Text rendering | CSS fonts | Custom font files + gradients |
| Annotations | Not supported | Full (highlights, zoom, spotlight) |
| Output quality | Good (2x Playwright) | Pixel-perfect |

The HTML renderer is for **editing speed**. Koubou is for **export quality**. Users edit fast in the Web UI, then get Koubou-quality output when they export.

### Config Translation Example

**Input (appframe.yml):**
```yaml
theme:
  style: glow
  colors:
    primary: "#A78BFA"
    secondary: "#7C3AED"
    background: "#0A0A0F"
    text: "#F8FAFC"
    subtitle: "#94A3B8"
  font: inter
  fontWeight: 700

screens:
  - screenshot: screenshots/home.png
    headline: "Trust No One"
    subtitle: "The ultimate party bluffing game"
    layout: center
```

**Output (koubou config):**
```yaml
project:
  name: "Impostor"
  output_dir: "./output"
  device: "iPhone 16 Pro Max Portrait"
  output_size: "iPhone6_9"

defaults:
  background:
    type: "linear"
    colors: ["#0A0A0F", "#1a0a2e"]
    direction: 180

screenshots:
  screen_1:
    content:
      - type: "text"
        content: "Trust No One"
        position: ["50%", "6%"]
        size: 52
        color: "#F8FAFC"
        weight: "bold"
        font: "fonts/Inter-Bold.ttf"
        alignment: "center"
      - type: "text"
        content: "The ultimate party bluffing game"
        position: ["50%", "12%"]
        size: 22
        color: "#94A3B8"
        weight: "normal"
        font: "fonts/Inter-Regular.ttf"
        alignment: "center"
      - type: "image"
        asset: "screenshots/home.png"
        position: ["50%", "55%"]
        scale: 0.85
        frame: true
```

### Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Koubou doesn't support image rotation | Pre-rotate images with sharp/Jimp before passing to Koubou |
| Python dependency friction | Make Koubou optional; Playwright fallback always works |
| Koubou YAML API changes | Pin Koubou version; translator targets specific API version |
| Preview ≠ Export visual mismatch | Document that preview is approximate; export is final quality |
| Multi-device compositions not natively supported by Koubou | Generate multiple image elements with manual positioning |
