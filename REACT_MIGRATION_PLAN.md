# Web Preview: React Migration Plan

## Why Migrate

The current web preview (`packages/web-preview/public/index.html`) is a single ~4300-line vanilla JS file. It works but has growing pains:

- **No component isolation** — all state, UI, and logic live in one file
- **Manual DOM manipulation** — `getElementById`, `createElement`, event listener wiring everywhere
- **State sync is fragile** — `saveControlsToState()` / `syncControlsFromState()` manually sync 50+ fields between DOM and JS objects
- **No Agentation support** — Agentation requires React 18+ for visual annotation feedback
- **Hard to extend** — adding new features (like the overhaul phases) means adding hundreds of lines to an already massive file

## Current Architecture

```
packages/web-preview/
  public/index.html     # ~4300 lines vanilla JS — ALL frontend code
  src/server.ts         # Express server — API routes, template rendering, export
```

**Frontend flow:** HTML sidebar controls → save to `screenStates[]` → POST to `/api/preview-html` → server returns rendered HTML → set `iframe.srcdoc`

**Instant patching:** Some controls (device position, text size, background color/gradient) patch the iframe DOM directly for smooth interaction, with a full re-render on mouseup.

## Proposed React Architecture

```
packages/web-preview/
  src/
    server.ts            # Keep as-is (Express API — no changes needed)
    client/
      App.tsx            # Root: sidebar + preview area layout
      store.ts           # Zustand store for all screen state
      hooks/
        usePreviewRender.ts    # Fetch preview HTML, AbortController
        useInstantPatch.ts     # Direct iframe DOM manipulation for smooth sliders
        useDragPosition.ts     # Device/text drag logic
      components/
        Sidebar/
          TabBar.tsx           # Design | Device | Text | Effects | Export
          DesignTab.tsx        # Background type, solid/gradient/image, preset, colors
          DeviceTab.tsx        # Screenshot upload, frame select, layout, device layout, shadow, border sim
          TextTab.tsx          # Headline/subtitle, typography, gradients, positions
          EffectsTab.tsx       # Spotlight, annotations, loupe, callouts, overlays
          ExportTab.tsx        # Platform, size, renderer, download
        Preview/
          PreviewArea.tsx      # Grid of preview iframes + drag overlays
          ScreenIndicator.tsx  # Screen pagination dots
        Controls/
          RangeSlider.tsx      # Reusable slider with value display + instant patch callback
          ColorPicker.tsx      # Color input with swatch presets
          CollapsiblePanel.tsx # For callouts/overlays/annotations lists
          CropModal.tsx        # Image crop overlay
        Agentation.tsx         # Agentation integration wrapper
      utils/
        api.ts               # Fetch wrappers for all API routes
        presets.ts            # SOLID_PRESETS, GRADIENT_PRESETS, KOUBOU_COLOR_HEX
  index.html               # Minimal Vite entry point
  vite.config.ts           # Vite config with React plugin
```

## State Management (Zustand)

Single store with per-screen state:

```typescript
interface ScreenState {
  headline: string;
  subtitle: string;
  style: TemplateStyle;
  layout: LayoutVariant;
  // ... all current screenState fields
  backgroundType: 'preset' | 'solid' | 'gradient' | 'image';
  backgroundGradient: BackgroundGradient;
  deviceShadow: DeviceShadow | null;
  loupe: Loupe | null;
  callouts: Callout[];
  overlays: Overlay[];
}

interface PreviewStore {
  screens: ScreenState[];
  selectedScreen: number;
  platform: string;
  previewW: number;
  previewH: number;
  // Actions
  updateScreen: (index: number, partial: Partial<ScreenState>) => void;
  setSelectedScreen: (index: number) => void;
}
```

## Key Design Decisions

1. **Keep the Express server as-is** — the API (`/api/preview-html`, `/api/export`, etc.) doesn't change. React just calls the same endpoints.

2. **Iframe preview stays** — the preview is server-rendered HTML in an iframe. React doesn't render the preview itself, just the controls.

3. **Instant patching via refs** — `useInstantPatch` hook gets iframe ref, applies CSS changes directly. React state updates trigger debounced full re-renders.

4. **Vite + React** — the web-preview package already uses Vite-style tooling. Add `@vitejs/plugin-react` and move from static HTML serving to a Vite dev server + built output.

5. **RangeSlider component** — single reusable component that handles: value display, instant patch callback (on input), debounced full render (on change). Eliminates the per-slider boilerplate that's currently ~5 lines each.

6. **Agentation** — add `<Agentation />` component at the root. Enables visual annotation → structured feedback for AI agents.

## Migration Strategy

### Phase 1: Scaffolding

- [x] Set up Vite config with React + Tailwind plugins and API proxy
- [x] Create entry `index.html` and `tsconfig.client.json` for React client
- [x] Create Zustand store with full ScreenState shape (~50 fields)
- [x] Create `types.ts` importing core types (TemplateStyle, LayoutVariant, etc.)
- [x] Build App.tsx with sidebar + preview area layout
- [x] Build TabBar with 5 tabs (Design, Device, Text, Effects, Export)
- [x] Create empty tab shell components
- [x] Create `usePreviewRender` hook with AbortController + debounce
- [x] Create PreviewArea component with iframe rendering
- [x] Create API utility wrappers (`utils/api.ts`)
- [x] Add React, Zustand v4, Vite, Tailwind v4 dependencies to package.json
- [x] Install dependencies and verify Vite dev server starts
- [x] Verify end-to-end: React app loads config, renders iframe preview

### Phase 2: Port Controls

**Reusable components:**
- [x] Build `RangeSlider` component (value display, instant patch, debounced render)
- [x] Build `ColorPicker` component (color input + swatch presets)
- [x] Build `CollapsiblePanel` component (for lists)
- [x] Build `Section` component (titled collapsible section wrapper)
- [x] Build `Select` component (dropdown with optgroup support)
- [x] Build `Checkbox` component

**Design tab:**
- [x] Background type selector (preset/solid/gradient/image)
- [x] Solid color picker
- [x] Gradient editor (type, colors, direction, radial position)
- [x] Background image upload
- [x] Background overlay controls
- [x] Preset color swatches

**Device tab:**
- [x] Screenshot upload
- [x] Frame selector (SVG frames + Koubou devices)
- [x] Koubou color variant swatches
- [x] Frame style selector
- [x] Composition preset selector
- [x] Device layout sliders (scale, top, rotation, offsetX, angle, tilt)
- [x] Device shadow controls
- [x] Border simulation controls
- [x] Corner radius slider
- [x] CropModal component (canvas-based crop with corner handles, rule-of-thirds grid)
- [x] Frame filtering by screenshot aspect ratio (15% tolerance, "Show all frames" toggle)
- [x] Auto-matching best device frame on screenshot upload/crop

**Text tab:**
- [x] Headline + subtitle text inputs
- [x] Font selector + weight slider
- [x] Size sliders (headline/subtitle)
- [x] Rotation sliders
- [x] Color pickers (text, subtitle, primary, secondary, background)
- [x] Headline/subtitle gradient toggles + controls
- [x] Auto-size checkboxes
- [x] Typography overrides (line height, letter spacing, text transform, font style)
- [x] Subtitle opacity + letter spacing
- [x] Text position reset button
- [x] Text drag system (`useDragPosition` hook)

**Effects tab:**
- [x] Spotlight toggle + controls (x, y, w, h, shape, opacity, blur)
- [x] Annotations list (add, edit, remove)
- [x] Loupe toggle + controls (source, display, size, zoom, border)
- [x] Callouts list (add, edit, remove)
- [x] Overlays list (add, edit, remove)

**Export tab:**
- [x] Platform selector (populates size dropdown)
- [x] Size selector
- [x] Renderer selector (Playwright/Koubou)
- [x] Download button
- [x] Reload config button
- [x] Locale selector
- [x] Preview background toggle
- [x] Refresh all button

**Preview area:**
- [x] Screen gallery with horizontal scroll
- [x] Add/remove/reorder screens
- [x] Per-card iframe rendering with AbortController
- [x] Dynamic scaling based on viewport height
- [x] Drag overlays for device/text positioning
- [x] Instant patching hook (`useInstantPatch`)
- [x] Iframe registry for cross-component iframe access

**Build verification:**
- [x] Client typecheck passes (`tsc -p tsconfig.client.json --noEmit`)
- [x] Server typecheck passes (`tsc --noEmit`)
- [x] Vite production build succeeds

### Phase 3: Polish + Agentation

- [ ] Add Agentation integration wrapper
- [ ] Side-by-side verification: compare every control against vanilla version
- [x] Port instant DOM patching for smooth slider interactions (device, text, background)
- [x] Port drag-to-reposition (device + text via overlay + hit-test)
- [x] No keyboard shortcuts to port (vanilla has none)
- [ ] Remove old `public/index.html` (keep until migration fully verified)
- [x] Update server.ts to serve `client-dist/` in production (with SPA fallback)
- [x] Verify `pnpm build` builds both server and client (all 5 packages pass)
- [x] Final TypeScript strict mode pass (client + server both clean)

## Dependencies

```json
{
  "react": "^18.3",
  "react-dom": "^18.3",
  "zustand": "^4",
  "@vitejs/plugin-react": "^4",
  "vite": "^6",
  "tailwindcss": "^4",
  "@tailwindcss/vite": "^4",
  "@types/react": "^18",
  "@types/react-dom": "^18"
}
```

## What Stays the Same

- `server.ts` — Express API routes, template rendering, export pipeline (0 changes)
- `packages/core/` — All core logic (schemas, templates, engine, renderer)
- All API contracts between frontend and server
- The iframe-based preview approach
- Instant DOM patching pattern for smooth sliders
