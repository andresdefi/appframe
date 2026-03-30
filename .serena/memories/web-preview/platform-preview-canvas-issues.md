# Per-Platform Preview Canvas — Outstanding Issues

## What Was Done
The platform-aware export sizes feature is **complete on the backend**:
- `STORE_SIZES` has all Apple/Android sizes (iPhone 6.9/6.7/6.5/6.3/5.5, iPad 13/12.9/11, Mac 4 sizes, Watch 6 sizes, Android 4 sizes)
- Platform dropdown in sidebar filters devices and export size dropdowns correctly
- Export button uses the correct platform-specific dimensions
- MCP tool accepts `mac` and `watch` platforms

## What's Broken: Preview Canvas Resizing
The gallery preview currently uses a **fixed 400x868 canvas** (iPhone 6.7" aspect ratio) for ALL platforms. This means Watch shows a tiny device in a tall phone-shaped canvas, Mac shows a tiny laptop in a phone canvas, etc.

### Root Cause
The gallery system in `packages/web-preview/public/index.html` was built for a single fixed canvas size. Multiple interdependent systems assume 400x868:

1. **`buildGallery()`** (~line 1276) — creates iframes and container divs. The iframe is sized with `previewW`/`previewH`.

2. **`scaleAllPreviews()`** (~line 1380) — scales all preview containers to fit the gallery area. Uses `baseScale = Math.min(areaH / previewH, 0.55)`. When `previewH` changes between platforms, the scale calculation breaks.

3. **`loadPreview(index)`** (~line 1570) — sends `body.width = previewW` and `body.height = previewH` to `/api/preview-html`. The server renders HTML at this canvas size. This is where the actual aspect ratio matters.

4. **CSS `.preview-container iframe`** (line 322) — has hardcoded `width: 400px; height: 868px` as initial values.

5. **Gallery card positioning** — each screen card's container is sized with `(previewW * baseScale)` and `(previewH * baseScale)`. The `+ Add Screen` card mirrors these.

### What Happens When You Change Platform
When the platform dropdown changes:
1. `updatePreviewDimensions(platform)` sets new `previewW`/`previewH`
2. `buildGallery()` is called which recreates all iframes at the new size
3. Each iframe's content is re-fetched from `/api/preview-html` with new dimensions
4. `scaleAllPreviews()` recalculates display scale

The problem: `buildGallery()` destroys and recreates DOM elements, but the scaling math doesn't account for wildly different aspect ratios. A 400x868 phone canvas vs a 500x312 Mac canvas vs a 205x251 Watch canvas need very different scaling strategies.

### Specific Issues Observed
- **iPhone gets wider after cycling** — `previewW`/`previewH` are global variables that get updated but the iframe from the previous platform render might still be in the DOM
- **Watch is too zoomed** — the 205x251 canvas scaled up to fit a tall gallery area becomes huge
- **Mac overflows** — the 500x312 landscape canvas doesn't fit in a portrait-oriented gallery
- **Screens disappear when adding new ones** — `buildGallery()` recreates everything but might lose track of screen states
- **Android shows iPhone frame** — the Pixel 10 SVG frame looks like an iPhone. Need proper Android-specific frames or no frame for Android.

### Fix Strategy
The fix needs to handle:

1. **Variable aspect ratios** — the gallery area needs to accommodate portrait (phone, tablet), landscape (Mac), and near-square (Watch) canvases
2. **Consistent scaling** — when there are multiple screens, each card should be the same visual size regardless of how many there are
3. **No state corruption** — switching platforms shouldn't corrupt screenStates or lose iframe references
4. **Proper re-rendering** — each iframe needs to re-fetch HTML from the server with the correct dimensions for the new platform

Suggested approach: instead of using `transform: scale()` on the iframe, use CSS `width/height` on the container and let the iframe scale via `transform: scale(containerWidth / previewW)`. The container should be sized to fit the gallery area, and the iframe inside scales to fit.

### Key Variables
- `previewW` / `previewH` — global, set by `updatePreviewDimensions(platform)`
- `screenStates` — array of per-screen state objects with `iframeEl`, `containerEl`, `loadingEl`
- `baseScale` — computed in `scaleAllPreviews()`, applied to all containers
- `buildGallery()` — destroys and recreates all screen cards
- `loadPreview(index)` — fetches HTML and sets iframe content

### Files to Modify
- `packages/web-preview/public/index.html` — all gallery/scaling logic is here
