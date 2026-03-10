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
  generic-phone     → (Android not supported by Koubou — fallback to Playwright)
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

## Phase 2: Import Koubou's Device Frames ✓

Bring Koubou's 100+ device frames into appframe's preview system.

### 2.1 Frame Catalog Sync
- [x] Survey all Koubou device frames and their identifiers
- [x] Map Koubou frame names to appframe frame manifest entries
- [x] For preview: serve Koubou PNG frames directly via `/api/koubou-frame/:familyId` endpoint
- [x] Add `screenOffset` and `framePngSize` metadata to 10 Koubou-only devices (Mac + Watch)
- [x] Build synthetic `FrameDefinition` from catalog metadata for PNG frame positioning
- [x] Add `getKoubouFramesDir()` and `getKoubouFramePath()` frame path resolver
- [x] Update all 8 templates + composition template to render PNG frames alongside SVG frames

### 2.2 Frame Selection UI
- [x] Update Web UI frame dropdown to show full Koubou device catalog (grouped by category)
- [x] Group frames by device family (iPhone 16, iPhone 15, iPad, Mac, Watch)
- [x] Show frame preview thumbnail below dropdown for Koubou PNG devices
- [x] Auto-select appropriate frame based on uploaded screenshot dimensions (`findMatchingDeviceFamily()`)
- [x] Remove "Koubou export only" badge for devices with PNG frame data

### 2.3 Verification
- [x] `pnpm build` compiles without errors
- [x] `/api/koubou-devices` returns 36 families; all 10 Mac/Watch have `screenOffset` + `framePngSize`
- [x] All 10 `/api/koubou-frame/:id` endpoints return 200 image/png
- [x] Non-existent device returns 404
- [x] MacBook Air 2022 HTML preview includes PNG frame URL + screenshot-clip
- [x] Watch Ultra HTML preview includes PNG frame with correct positioning
- [x] iPhone 16 Pro Max still uses SVG frame (no regression)
- [x] Graceful degradation: `resolveContext()` verifies PNG exists on disk before setting `framePngUrl`
- [x] Graceful degradation: frontend thumbnail `onerror` hides panel if frame unavailable
- [x] PNG frames converted from relative URLs to inline base64 data URLs so Playwright `page.setContent()` can render them
- [x] Watch screens use per-device `screenBorderRadius` instead of hardcoded `0` (Ultra: 35, Series 7 45mm: 65, Series 4 44mm: 55, Series 4 40mm: 50)
- [x] Visual inspection in browser — verified pixel-perfect screenshot alignment inside all 10 PNG frames (Mac + Watch). Fixed Watch corner masking by rendering screenshot behind the frame PNG (the frame's opaque bezel naturally masks edges/corners via transparency). Fine-tuned `screenOffset` and `screenBorderRadius` values for all 4 Watch devices using PIL pixel measurements of the actual Koubou frame PNGs.

---

## Phase 3: Add Koubou-Exclusive Features to Appframe ✓

Expose Koubou's advanced features through appframe's Web UI.

### 3.1 Gradient Text ✓
- [x] Add gradient text option in Web UI (start color, end color, direction)
- [x] Map to Koubou's gradient text config in translator
- [x] Preview via CSS `background-clip: text` in HTML preview (close approximation)

### 3.2 Annotations & Highlights ✓
- [x] Add annotation layer in Web UI: click on the preview to place highlights
- [x] Support highlight shapes: circle, rounded rect, rectangle
- [x] Configure stroke color, fill, blur background
- [x] Map to Koubou highlight elements in translator

### 3.3 Zoom Callouts ✓
- [x] Add zoom callout tool: select source region, place magnified callout
- [x] Configure magnification level, connector style, shadow
- [x] Map to Koubou zoom_callout elements in translator
- [x] Preview via CSS transform: scale() with connector SVG overlay

### 3.4 Spotlight/Dimming Effect ✓
- [x] Add spotlight mode: dim everything except a highlighted area
- [x] Map to Koubou's blur_background feature

### 3.5 Auto-Sizing Text ✓
Auto-fit headline/subtitle text within a bounding box. High impact for localization where text lengths vary wildly (German headlines are often 2x longer than English).

- [x] Add `autoSize: true` option to screen config (opt-in, off by default)
- [x] HTML preview: use JS binary search on `font-size` to fit text within the headline/subtitle bounding box without overflow
- [x] Web UI: add "Auto-size" toggle next to headline/subtitle size sliders
- [x] When enabled, disable the manual size slider
- [x] Works per-locale: each language auto-sizes independently so short English and long German both look good

---

## Phase 4: Localization Integration ✓

Leverage Koubou's xcstrings localization for multi-language screenshot generation.

### 4.1 xcstrings Support
- [x] Add xcstrings import/export to appframe config
- [x] When Koubou is available, use its native xcstrings workflow
- [x] Map appframe's `locales` YAML section to Koubou localization config
- [x] Generate localized screenshots for all languages in one `kou generate` pass

### 4.2 Localized Asset Resolution
- [x] Support per-locale screenshots (different app screenshots per language)
- [x] Follow Koubou's convention: `{lang}/screenshot.png` directory structure
- [x] Fallback chain: locale-specific → base language → default

---

## Phase 5: Unified CLI Experience ✓

Single command that handles everything.

### 5.1 Smart Export ✓
- [x] `appframe generate` auto-detects Koubou and uses it when available
- [x] Falls back to Playwright when Koubou is not installed
- [x] `appframe generate --renderer playwright|koubou` for explicit selection
- [x] Show which renderer is being used in output

### 5.2 Koubou Config Preview ✓
- [x] `appframe koubou-config` command that outputs the translated Koubou YAML without rendering
- [x] Useful for debugging and for users who want to customize the Koubou config directly
- [x] `appframe koubou-config --screen 0` for a single screen (0-based index, `-n` flag)

### 5.3 Live Mode Integration ✓
- [x] When user exports from Web UI, use Koubou for final render
- [x] Web UI preview stays HTML-based (fast), export button triggers Koubou (pixel-perfect)
- [x] Show "Rendering with Koubou..." status in UI during export
- [x] `/api/koubou-status` endpoint with cached detection (resets on config reload)
- [x] Renderer dropdown (Playwright/Koubou) shown when Koubou detected
- [x] Koubou option auto-disabled for Android sizes
- [x] `renderSingleScreenWithKoubou()` core function bridges Web UI params to Koubou pipeline

---

## Phase 6: Test Coverage ✓

Brought appframe from 4 test files (~36 tests) to **26 test files with 281 test cases** across all 5 packages.

**Before:** 4 test files covering config validation, frame loading, store sizes, and JWT signing.
**After:** 26 test files, 281 tests, all passing. Coverage report via `pnpm test:coverage`.

### Infrastructure ✓
- [x] Installed `@vitest/coverage-v8`, `supertest`, `@types/supertest`
- [x] Updated `vitest.config.ts` with v8 coverage config (reporters: text, lcov, html)
- [x] Added `pnpm test:coverage` script
- [x] Created `packages/core/src/test-utils.ts` with `createMinimalConfig()`, `createTempDir()`/`cleanupTempDir()`, `mockScreenshotBuffer()`/`mockScreenshotDataUrl()`
- [x] Fixed stale compiled `.js` files in `src/` that confused v8 coverage (schema.ts was reporting 0%)

### 6.1 Core: Koubou Integration Tests ✓
**`packages/core/src/koubou/catalog.test.ts`** — 20 tests
- [x] `getKoubouDeviceFamilies()` returns all families with valid fields
- [x] All portrait koubouIds are unique across the catalog
- [x] Category distribution check (iphone/ipad/mac/watch counts)
- [x] `getKoubouDeviceFamily()` returns match or null
- [x] `getKoubouDeviceId()` handles default color, specific color, landscape, unknown family, color fallback
- [x] `getKoubouFamilyByFrameId()` returns most recent device or null
- [x] `getKoubouColorNames()` for multi-color, single-color, unknown families
- [x] `findMatchingDeviceFamily()` handles exact match, tolerance, landscape, no match

**`packages/core/src/koubou/translator.test.ts`** — 38 tests
- [x] `mapSizeToKoubou()` maps all 8 known sizes + unknown → null
- [x] `mapDeviceToKoubou()` with/without color, unknown → null
- [x] `translateConfig()` structure: project fields, all 8 background styles, text elements (headline/subtitle presence, fullscreen omission, font resolution), image elements, compositions, screen name sanitization
- [x] `translateConfig()` spotlight, annotation, and zoom callout element generation
- [x] `translateConfig()` per-screen background override, device resolution via frames config, frame: false for none style, canvas-width-proportional font sizing
- [x] `translateConfigWithLocale()` overrides headline, subtitle, and screenshot path
- [x] `translateConfigWithLocalization()` adds localization block, throws without config.localization

**`packages/core/src/koubou/detector.test.ts`** — 4 tests
- [x] Returns `{ available: false }` when no binary found
- [x] Returns `{ available: true, binaryPath, version }` when `which kou` succeeds
- [x] Checks fallback paths when `which` fails
- [x] Handles version command failure gracefully

**`packages/core/src/koubou/pipeline.test.ts`** — 18 tests
- [x] `generateKoubouConfig()` returns valid YAML, filters by screenIndex, throws for out-of-range, uses localization path, accepts explicit outputSize
- [x] `generateWithKoubou()` throws when not installed, throws for Android, runs kou and collects output files, calls onProgress, throws on kou failure, generates with inline locales, generates with native localization (xcstrings), filters by screenIndex
- [x] `renderSingleScreenWithKoubou()` throws when not installed, throws for invalid data URL, writes temp screenshot and returns PNG buffer, throws when Koubou produces no output

**`packages/core/src/koubou/frames.test.ts`** — 5 tests
- [x] `getKoubouFramesDir()` returns null when not detected, path when found, null when no frames dir
- [x] `getKoubouFramePath()` returns null when unavailable, PNG path when exists

**`packages/core/src/koubou/assets.test.ts`** — 4 tests
- [x] `resolveLocalizedAsset()` locale-specific path, base language fallback, original path fallback, skips base when locale equals base

### 6.2 Core: Config & Schema Tests ✓
**`packages/core/src/config/schema.test.ts`** — 38 tests
- [x] Hex color regex: accepts 3/6/8 digit, rejects invalid
- [x] All enum schemas (platform, templateStyle, frameStyle, layoutVariant, compositionPreset): accept valid, reject unknown
- [x] Each schema (appConfig, theme, frame, screen, spotlight, annotation, zoomCallout, localization, output): valid input + defaults + rejection of invalid values
- [x] `appframeConfigSchema` refinements: mismatched locale/screen counts, both locales+localization, baseLanguage not in languages

**`packages/core/src/config/loader.test.ts`** — 5 tests
- [x] `loadConfig()` reads valid YAML, throws for missing file, malformed YAML, invalid structure, fills Zod defaults

### 6.3 Core: Template Engine Tests ✓
**`packages/core/src/templates/engine.test.ts`** — 6 tests
- [x] Renders HTML for all 8 styles
- [x] Rendered HTML contains headline, subtitle (when provided), screenshot data URL, font CSS

**`packages/core/src/templates/injectors.test.ts`** — 14 tests
- [x] `injectSpotlightHTML` injects style + overlay, handles circle/rectangle shapes, blur on/off
- [x] `injectAnnotationsHTML` returns unchanged for empty, injects shapes with correct styles, handles fill color
- [x] `injectZoomCalloutsHTML` returns unchanged for empty, creates source/target/connector divs, handles line/elbow/none styles

### 6.4 Core: Renderer Tests ✓
**`packages/core/src/renderer/renderer.test.ts`** — 5 tests (mocks Playwright)
- [x] `init()` launches chromium, creates context with deviceScaleFactor=2
- [x] `render()` sets viewport, content, waits for fonts, screenshots, returns correct dimensions
- [x] `close()` closes browser/context, handles not-initialized state
- [x] `render()` auto-initializes if not called init()

**`packages/core/src/renderer/pipeline.test.ts`** — 11 tests (mocks renderer, engine, loader)
- [x] `generateScreenshots()` correct file count, platform/screen/locale filtering, onProgress, naming convention
- [x] Generates for inline locales (default + locale), xcstrings localization mode, android platform
- [x] Handles screens with spotlight, annotations, and zoom callouts
- [x] Respects templateOverride

### 6.5 Core: Fonts & Composition Tests ✓
**`packages/core/src/fonts/loader.test.ts`** — 9 tests
- [x] `FONT_CATALOG` has 8 entries with valid structure, unique IDs, includes Inter
- [x] `getFontName()` resolves known IDs, returns raw for unknown
- [x] `loadFontFaces()` returns @font-face CSS, empty for unknown, caches results

**`packages/core/src/composer/presets.test.ts`** — 6 tests
- [x] All 9 presets present with required fields, IDs match keys
- [x] Single-device presets have 1 slot, multi-device have 2-3
- [x] All slots have fields within reasonable ranges

### 6.6 CLI Command Tests ✓
**`packages/cli/src/commands/frames.test.ts`** — 2 tests
- [x] `frames list` calls listFrames
- [x] `frames list --koubou` calls getKoubouDeviceFamilies

**`packages/cli/src/commands/validate.test.ts`** — 3 tests
- [x] Success on valid config, exit(1) on missing file, exit(1) on invalid config

**`packages/cli/src/commands/generate.test.ts`** — 7 tests
- [x] Playwright/Koubou/auto renderer selection, auto selects koubou when available
- [x] `--dry-run` flag, error handling for generation and config load failures

### 6.7 Web Preview Server Tests ✓
**`packages/web-preview/src/server.test.ts`** — 9 tests (supertest with mocked core)
- [x] `GET /api/config` returns 200 + JSON
- [x] `GET /api/frames` returns 200 + array
- [x] `GET /api/templates` returns 8 styles
- [x] `GET /api/fonts` returns font catalog
- [x] `GET /api/compositions` returns presets
- [x] `GET /api/koubou-devices` returns families + grouped
- [x] `GET /api/koubou-status` returns availability, caches result
- [x] `POST /api/reload` returns success, resets caches

### 6.8 Store Upload Tests ✓
**`packages/store-upload/src/apple/client.test.ts`** — 20 tests
- [x] `loadAppleCredentials()` from env vars, throws for missing fields, uses file path
- [x] `resolvePrivateKey()` reads file when starts with 'file:', returns unchanged for inline
- [x] `findVersion` finds editable version, throws when none found
- [x] `getLocalizationId` returns locale ID, throws for missing locale
- [x] `getOrCreateScreenshotSet` returns existing or creates new
- [x] `clearScreenshotSet` deletes all screenshots
- [x] `uploadScreenshot` reserves, uploads chunks, commits
- [x] `uploadScreenshots` full flow, dry run, error recording, explicit versionId
- [x] Handles 401 retry

**`packages/store-upload/src/google/client.test.ts`** — 8 tests
- [x] `loadGoogleCredentials()` from env vars, throws for missing
- [x] `createEdit()` / `commitEdit()` API interactions
- [x] `uploadScreenshots()` full flow, dry run, cleanup on error

**`packages/store-upload/src/google/auth.test.ts`** — 4 tests
- [x] `loadServiceAccount()` parses JSON, rejects invalid
- [x] `getAccessToken()` generates JWT, exchanges for token, handles failure

**`packages/store-upload/src/uploader.test.ts`** — 9 tests
- [x] `uploadScreenshots()` throws for no files, discovers and uploads iOS/Android, respects platform/locale filter, throws for missing ASC_APP_ID
- [x] `getUploadPlan()` returns empty for no files, discovers plans, maps Android size keys

### Coverage Summary

| Package | Stmts | Funcs | Key Files |
|---------|-------|-------|-----------|
| core/config | 100% | 100% | schema, loader, validator |
| core/koubou | 87% | 93% | catalog (100%), translator (87%), detector (100%), pipeline (91%) |
| core/renderer | 91% | 90% | renderer (100%), pipeline (91%), sizes (100%) |
| core/templates | 100% | 100% | engine, injectors |
| core/fonts | 79% | 91% | loader |
| core/composer | 100% | 100% | presets |
| store-upload/apple | 97% | 100% | client, jwt |
| store-upload/google | 93% | 100% | client, auth |
| store-upload | 96% | 100% | uploader |

Remaining uncovered lines are error catch blocks with `/* ignore */` (cleanup paths), minor defensive branches, and the web-preview server.ts (tested via route-level supertest, not via `startPreviewServer` which initializes Playwright).

---

## Implementation Priority

1. **Phase 1.1-1.2** (Koubou detection + config translator) — foundation, unblocks everything ✓
2. **Phase 1.4** (Export pipeline) — immediate value, Koubou quality for exports ✓
3. **Phase 2** (Device frames) — biggest visual upgrade for previews ✓
4. **Phase 3.1** (Gradient text) — quick win, high visual impact ✓
5. **Phase 3.5** (Auto-sizing text) — quick win, critical for localization ✓
6. **Phase 5.1** (Smart export) — polish the CLI experience ✓
7. **Phase 3.2-3.4** (Annotations) — advanced features ✓
8. **Phase 4** (Localization) — important for production use ✓
9. **Phase 6** (Test coverage) — 26 test files, 281 tests, all passing ✓

---

## Architecture Notes

### Why Two Renderers?

| | HTML/Playwright (Preview) | Koubou (Export) |
|---|---|---|
| Speed | Instant (iframe) | Seconds per image |
| Interactivity | Full (sliders, drag-drop) | None (batch) |
| Device frames | SVG overlays (limited) | 100+ photorealistic |
| Text rendering | CSS fonts | Custom font files + gradients |
| Annotations | CSS overlays (spotlight, highlights, zoom callouts) | Full (highlights, zoom, spotlight) |
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
| Low test coverage causes regressions | Phase 6 test suite; write tests for each new feature before merging |
| Auto-sized text renders differently in HTML vs Koubou | Use same algorithm (binary search on font size); accept minor variance |
