# Variant export naming + base-set access plan

Status: open. Drafted 2026-05-19 while implementing the Codex review plan. The user surfaced this twice during live testing of unrelated fixes — once after H3 verification, once after M1 verification — and asked it be tracked in its own doc.

Not in scope for the Codex review plan. Belongs to the variants surface area, which is mostly Phase 9 / P1 territory in `codex-review-plan.md`.

## The two symptoms

1. **Project name disappears in export filenames.** After creating a variant, "Download all N screens" produces `variant-2-screens.zip` (or `variant-2-frames.zip` in panoramic mode). The project's display name is nowhere in the filename. Sample: a project called "Impostor Party Game" with one variant called "Variant 2" exports as `variant-2-screens.zip`, not `impostor-party-game-variant-2-screens.zip`.
2. **No way back to the base (non-variant) set.** Once any variant is created and selected, every export is variant-scoped. The original screens you had before creating the first variant are still in the project's state, but the sidebar only lists the variant cards — there's no "Default" / "Base" / "No variant" selector that lets you export the pre-variant set.

Both symptoms arise from the same root cause: the export pipeline treats the variant as the only filename identity, and the variants UI has no "no variant active" affordance.

## Where the code is today

- Export filename is computed in `packages/web-preview/src/client/components/Sidebar/ExportTab.tsx:143-147`:
  ```ts
  const exportSlug = activeVariant
    ? slugifyVariantName(activeVariant.name)
    : slugifyVariantName(activeProjectDisplayName || 'project');
  ```
  When `activeVariant` is set, the project name is dropped entirely. The ternary's "no variant" branch already uses the project name, so the *plumbing* for the project name is there — it's just discarded once a variant is active.
- The ZIP filename is `${exportSlug}-screens.zip` / `${exportSlug}-frames.zip` (ExportTab.tsx:221, 344).
- The store keeps `activeVariantId: string | null` and `variants: VariantRecord[]`. `null` means "no variant active". So the model already supports the concept of a base set — but `createVariant` flips the active id to the new variant immediately and there's no UI to flip it back to `null`.

## Proposed fix (one plan, two commits)

### Commit 1: project name in variant export filenames

Change the slug to combine both:

```ts
const projectSlug = slugifyVariantName(activeProjectDisplayName || 'project');
const exportSlug = activeVariant
  ? `${projectSlug}-${slugifyVariantName(activeVariant.name)}`
  : projectSlug;
```

Result: a variant export becomes `impostor-party-game-variant-2-screens.zip`. A no-variant export stays `impostor-party-game-screens.zip` — no regression for users without variants.

Edge cases to think through:
- Project name and variant name collide / one is empty: `slugifyVariantName('')` returns ''. Guard so we don't emit `--screens.zip`.
- Single-screen "Download screen N" path uses the same `exportSlug` (line 265). Same change applies, no special-casing.

Test: new vitest assertion against `slugifyVariantName` composition and the ExportTab logic.

### Commit 2: "Base set" entry in the Variants tab

Decide: is the base set a *peer* of the variants (selectable card alongside them) or a *root* (always shown at top, can't be deleted)? Recommended: peer with these properties:
- Always present, not deletable.
- Doesn't appear in the `variants[]` array — it's the state when `activeVariantId === null`.
- VariantsTab renders a synthetic card at the top of the list labeled "Base" (or "Default") with the project's display name and a thumbnail of the current pre-variant screens.
- Clicking it sets `activeVariantId = null` via a new store action `clearActiveVariant()`.

UX questions to settle before implementation:
- Where does the "Base" name come from? Project displayName is the obvious choice.
- Should the base set's snapshot live inside the variant store, or is it just "whatever's in `state.screens` / `state.panoramicElements` when no variant is active"? The latter is simpler and matches today's model.
- Does selecting the base set blow away unsaved changes on the active variant? It shouldn't — the existing `syncActiveVariantRecord` already snapshots the active variant when state changes. Need to confirm it fires on selection change.

Touch points (rough):
- `packages/web-preview/src/client/store.ts`: new action `clearActiveVariant`, possibly tweak `selectVariant` to accept `null`.
- `packages/web-preview/src/client/components/Sidebar/Variants/VariantsTab.tsx`: render the synthetic card, wire the click.
- Tests in `store.test.ts`: round-trip variant ↔ base, assert state is preserved on both ends.

Risk: low. The model already supports `activeVariantId === null`; this just adds a UI affordance to reach that state again.

## What stays out

- Variant thumbnails (P1 in codex-review-plan.md). Independent feature.
- Per-variant project metadata (display names, descriptions). Variants already have `name` and `description`; not changing.
- Multi-locale and the snapshot-at-add-time model — none of this touches `localeScreens` / `localePanoramicElements`.

## Verification checklist

- [ ] Export a project with no variant: filename matches `<project>-screens.zip` (no regression).
- [ ] Create a variant called "Variant 2" inside project "Impostor Party Game"; export filename is `impostor-party-game-variant-2-screens.zip`.
- [ ] Panoramic mode equivalent: `<project>-<variant>-frames.zip`.
- [ ] Click the new "Base" card; canvas reverts to the pre-variant screens. Export filename returns to `<project>-screens.zip`.
- [ ] Click back into "Variant 2"; canvas restores the variant state, exports use the variant slug.
- [ ] All tests green; live Safari smoke pass on both flows.
