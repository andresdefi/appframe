# Appframe Web Preview Overhaul — Progress Tracker

## Phase 0: Sidebar Tab Navigation
- [x] Add tab bar CSS styles
- [x] Add tab bar HTML (5 tabs: Design | Device | Text | Effects | Export)
- [x] Regroup existing sections under `data-tab` attributes
- [x] Add JS tab switching logic
- [x] Active tab preserved via `activeTab` variable (survives screen switches)

## Phase 1: Background System Overhaul
- [x] **Schema** (`schema.ts`): Add `backgroundType`, `backgroundColor`, `backgroundGradient`, `backgroundImage`, `backgroundOverlay`, `deviceShadow`, `borderSimulation`, `cornerRadius`, `loupe`, `callouts`, `overlays`
- [x] **Background Presets** (`background-presets.ts`): Create file with `GRADIENT_PRESETS` and `SOLID_PRESETS`
- [x] **Template Engine** (`engine.ts`): Extend `TemplateContext`, build `gradientCss` string, `buildDeviceShadowCss`
- [x] **Template** (`base.html`): Conditional background rendering, overlay div, border simulation, loupe/callouts/overlays includes
- [x] **Template Partials**: `_base/loupe.html`, `_base/callouts.html`, `_base/overlays.html`
- [x] **Server** (`server.ts`): `parseBody()` + `resolveContext()` extensions
- [x] **Frontend: Background Type Selector**: Radio/segmented control for Preset | Solid | Gradient | Image
- [x] **Frontend: Solid Color Presets**: Grid of swatches + custom color picker
- [x] **Frontend: Gradient Builder**: Preset gallery + direction picker + color stops
- [x] **Frontend: Image Background**: Upload + overlay controls
- [x] **Frontend: Device Shadow**: Opacity, blur, color, Y-offset sliders
- [x] **Config exports**: Updated `config/index.ts` and `core/index.ts`

## Phase 2: Frame Enhancements
- [x] **Size-Aware Frame Filtering**: Filter dropdown by screenshot aspect ratio
- [x] **Show All Frames toggle**: Bypass filter
- [x] **Border Simulation UI**: Frontend controls (thickness, color, radius)
- [x] **Frame Color Swatches**: Visual color circles with hex color mapping
- [x] **Frame Style → Border Sim visibility**: Auto-show/hide when frameless selected

## Phase 3: Device/Image Customization
- [x] **Free-Form Device Drag**: Mouse drag on device in preview (syncs to sliders)
- [x] **Full 360° Rotation**: Changed slider range from ±45 to ±180
- [x] **Corner Radius Control**: Frontend slider (0-50%)
- [x] **Image Cropping Modal**: Canvas-based crop tool with drag handles, rule-of-thirds grid

## Phase 4: Loupe / Magnification
- [x] **Frontend**: Enable checkbox, source/display position sliders, size, zoom, border width/color
- [x] **Save/Sync**: Loupe state in saveControlsToState/syncControlsFromState

## Phase 5: Floating Callouts & Badge Overlays
- [x] **Frontend: Callout Controls**: Add/remove, source region (x/y/w/h), display position, scale, rotation, radius
- [x] **Frontend: Overlay Controls**: Type selector (shape/star-rating/icon/badge/custom), image upload, position/size/rotation/opacity
- [x] **Decorative Shapes**: circle/rectangle/line with color, opacity, blur
- [x] **Save/Sync**: Lists rendered dynamically, state modified directly on objects

## Final Verification
- [x] `pnpm build` — All packages compile
- [x] `pnpm test` — 273 tests pass
- [x] Backward compatible (all new schema fields optional with defaults)
