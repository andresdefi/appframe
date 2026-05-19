# Variant export naming plan

Status: done in commit TBD. Drafted 2026-05-19 while implementing the Codex review plan; revised 2026-05-19 once live testing exposed an incorrect assumption about the variant model.

## The original complaint

After creating a variant, "Download all N screens" produced `variant-2-screens.zip` (or `variant-2-frames.zip` in panoramic mode). The project's display name was nowhere in the filename. The user wanted the project name back in the filename.

## What the variant model actually looks like

A first pass at this plan assumed projects had a "base" state distinct from variants, reachable when `activeVariantId === null`. Reading the code (`packages/web-preview/src/client/store.ts:897-923`, `initScreens`) revealed otherwise:

- Every project that goes through `initScreens` immediately gets a single variant called **"Concept A"** created from the current screens, and `activeVariantId` is set to that variant's id.
- `activeVariantId === null` essentially never occurs in normal usage. There is no separate base state hiding behind the variants list — "Concept A" *is* the base.
- "Create Variant" from the Variants tab adds a sibling (named `Variant 2`, `Variant 3`, …). The user sees the original work as "Concept A" plus the new ones.

So the model doesn't need a synthetic "Base" card on top of the variants list — Concept A already plays that role.

## What shipped

One commit, one rule, no UI change:

`packages/web-preview/src/client/utils/exportSlug.ts` (new) exposes:

```ts
composeExportSlug(projectDisplayName, activeVariantName, variantCount): string
```

- Always leads with the project slug.
- Appends the active variant's slug **only when `variantCount > 1`** — i.e. only when there are actually multiple variants to disambiguate against.

`ExportTab.tsx` calls it once and reuses the result for `*-screens.zip`, `*-frames.zip`, and the single-screen "Download screen N" path.

### Filename matrix

| State | Filename |
|-------|----------|
| New project "Spentio" (1 variant: Concept A) | `spentio-screens.zip` |
| New project "Spentio" + added Variant 2 (2 variants) | `spentio-concept-a-screens.zip` when Concept A active, `spentio-variant-2-screens.zip` when Variant 2 active |
| Delete Concept A, keep only Variant 2 (1 variant) | `spentio-screens.zip` (variant suffix drops once it stops being ambiguous) |

### Why not a synthetic "Base" card

Considered and rejected. Two reasons:

1. The model doesn't support an "unvarianted" state. Adding one would mean refactoring `initScreens` to not auto-create Concept A, plus rebuilding all the places that assume a variant is always active. That's a much larger product change.
2. The actual user need ("get back to the original set") is met by clicking the existing Concept A card in the variants list. The original report conflated "filename is wrong" with "I can't find the base" — fixing the filename rule answers both, because once the variant suffix only appears when meaningful, the original Concept A is recoverable by deleting all other variants.

If the team later wants a real "base set" distinct from variants, that's its own design pass, not a refactor inside this filename change.

## Verification checklist

- [x] Tests in `exportSlug.test.ts` cover: no variant, single variant (any name), 2+ variants, empty inputs, punctuation, casing.
- [ ] New project "Spentio" with one auto-generated Concept A: filename = `spentio-screens.zip`.
- [ ] Add Variant 2, select it, export: filename = `spentio-variant-2-screens.zip`.
- [ ] Select Concept A, export: filename = `spentio-concept-a-screens.zip`.
- [ ] Delete Concept A: filename = `spentio-screens.zip` (variant suffix drops because only one variant remains).
- [ ] Panoramic equivalent for the frame export path.
- [ ] All tests green; live Safari smoke pass.
