# Stable Callouts improvement plan

Status: open. Created 2026-05-20 after clarifying that this is a separate track from `docs/component-extraction-plan.md`.

## Product framing

This is the **stable Callouts** improvement track. It should keep the current rectangle/square crop model, but make it easier and more visual to create the before.click-style "pop out of the screen" effect.

This is separate from **Magic Callout (Beta)**:

- **Callouts** stay manual, predictable, rectangle-based, and production-safe.
- **Magic Callout (Beta)** handles click-to-detect component boundaries, non-rectangular masks, SAM/model loading, and any-shape extraction.

Do not couple this work to SAM, model weights, cutout storage, or automatic segmentation. The goal here is to improve the existing Callouts UX without risking the current tool.

## What the user means

The reference flow is:

1. User activates Callouts.
2. User drags across a region of the screenshot.
3. The dragged rectangle is visibly marked on the screenshot while dragging.
4. Releasing creates a callout from that selected rectangle.
5. The callout appears as a floating card/pop-out over the canvas, with shadow, optional background, padding, corner radius, scale, rotation, and direct drag controls.

The important improvement is reducing slider-first precision work. Today the user has to manually tune `sourceW`, `sourceH`, and placement until the selected area is right. The improved flow should make the selected area come directly from the pointer gesture.

## Scope

### In scope

- Add a drag-to-select mode for rectangular callout source areas.
- Show a live selection rectangle over the active screenshot.
- Create a new callout from the selected rectangle on pointer release.
- Support editing an existing callout's source rectangle visually.
- Keep the current slider controls as fine-tuning, not the primary creation path.
- Improve pop-out defaults so a new callout looks polished immediately.
- Preserve existing project files and existing `screen.callouts[]` behavior.

### Out of scope

- Non-rectangular masks.
- Component boundary detection.
- SAM, MobileSAM, WebGPU/WASM model work.
- Transparent-background cutout asset storage.
- Cross-screen reusable component libraries.
- Inpainting or rebuilding the source screenshot behind the callout.

## UX design

### Entry point

Keep this inside the existing **Callouts** section in the Effects sidebar, not a separate beta section.

Add an explicit command:

- **Select Area**: enters source-selection mode for the active screen.

If the screen has no source screenshot, disable the command and show a short tooltip/error.

### Creation flow

1. User clicks **Select Area**.
2. The active screen card enters callout selection mode.
3. A crosshair cursor appears over the screenshot/device content.
4. User drags from one corner to the opposite corner.
5. While dragging:
   - draw a translucent selection overlay
   - show a thin border around the selected area
   - optionally dim the rest of the screenshot
6. On release:
   - convert the rectangle into `sourceX`, `sourceY`, `sourceW`, `sourceH`
   - create a new callout
   - place it slightly offset from the selected area, or centered on the canvas if offset would go off-screen
   - apply polished defaults

### Edit flow

Each callout panel should offer:

- **Reselect Area**: user drags a new source rectangle for that callout.
- existing sliders for precise numeric adjustment.
- direct canvas dragging for the popped callout card, preserving current behavior.

This avoids forcing users to delete/recreate a callout when they selected the wrong area.

### Pop-out defaults

A newly-created callout should look intentionally designed:

- `displayScale: 1`
- `cardScale: 1.1` or `1.15`
- `rotation: 0`
- `borderRadius: 16`
- `shadow: true`
- `borderWidth: 0`
- `background: #ffffff` only when useful for the selected design; otherwise transparent should remain possible.
- `padding: 0` by default, with a small quick preset available.

The default should be conservative: a clean pop-out, not an over-styled sticker.

## Coordinate model

The existing `Callout` schema already stores the required source rectangle:

- `sourceX`
- `sourceY`
- `sourceW`
- `sourceH`
- `displayX`
- `displayY`
- `displayScale`
- `cardScale`
- `rotation`
- `borderRadius`
- `shadow`
- `background`
- `padding`

The improvement should map pointer selection into those existing fields instead of inventing a new schema.

Important: the selection rectangle must be calculated in the rendered screenshot/device coordinate space, not the whole app canvas. If the device is scaled, rotated, tilted, or offset, the hit testing/conversion must still map back to the screenshot crop percentages correctly.

If exact support for angled/tilted devices is too complex for the first pass, ship v1 only for flat/front-facing device transforms and disable Select Area with a clear tooltip when the transform is unsupported. Do not silently produce wrong source coordinates.

## Implementation plan

### Phase 1 — Selection-mode state and overlay

- Add UI state for "selecting new callout" and "reselecting callout N".
- Add a pointer-capture overlay in the active `ScreenCard`.
- Draw the live selection rectangle during drag.
- Cancel with Escape or by clicking Cancel in the sidebar.

Relevant files:

- `packages/web-preview/src/client/components/Sidebar/EffectsTab.tsx`
- `packages/web-preview/src/client/components/Preview/ScreenCard.tsx`
- `packages/web-preview/src/client/hooks/useDragPosition.ts`

### Phase 2 — Rectangle to callout conversion

- Convert the selected screenshot-space rectangle into callout percentages.
- Create/update the `Callout` entry in `screen.callouts`.
- Preserve existing project serialization since the fields already exist.
- Keep all existing slider controls.

Relevant files:

- `packages/core/src/config/schema.ts`
- `packages/web-preview/src/client/types.ts`
- `packages/web-preview/src/client/store.ts`
- `packages/web-preview/src/client/utils/screenSerialization.ts`

### Phase 3 — Polished pop-out placement

- Add placement heuristics so the new callout appears offset from the source area when possible.
- Keep it within canvas bounds when the selected area is near an edge.
- Apply better shadow/background defaults.
- Ensure direct dragging of the callout still works.

Relevant files:

- `packages/core/templates/_base/callouts.html`
- `packages/core/src/templates/engine.ts`
- `packages/web-preview/src/client/hooks/useInstantPatch.ts`
- `packages/web-preview/src/client/hooks/useDragPosition.ts`

### Phase 4 — Reselect and refinement

- Add **Reselect Area** per callout.
- Keep source-area sliders for precision.
- Add small nudge controls only if slider precision remains awkward after drag selection.

### Phase 5 — Visual polish and reliability

- Selection overlay should be visible over light and dark screenshots.
- Cursor and selection handles should not conflict with existing drag/reorder/drop interactions.
- The interaction should be blocked on non-default locales if structural effects are locked there, matching existing locale rules.

## Testing

### Unit

- Rectangle normalization handles dragging in all directions.
- Tiny drags below a threshold do not create accidental callouts.
- Rectangle-to-callout conversion clamps to valid 0-100 percent ranges.
- Pop-out placement keeps `displayX` / `displayY` inside bounds.

### Integration

- Creating a callout through drag selection persists through save/load.
- Reselecting an existing callout updates only that callout.
- Existing callout project files still load unchanged.
- Non-default locale behavior matches current structural-lock rules.

### E2E

- User clicks **Select Area**, drags over a visible screenshot region, releases, and sees a popped callout created.
- User drags the popped callout card and the position persists.
- User reselects the source area and the callout crop updates.
- Existing slider controls still work after a drag-created callout.

## Acceptance criteria

- A user can create the rectangular pop-out effect from the reference screenshots without manually tuning width/height sliders first.
- Current Callouts projects continue to render the same.
- No Magic Callout Beta behavior or model-loading code is required.
- The feature feels stable enough to live in the existing Callouts section, not behind the beta toggle.
