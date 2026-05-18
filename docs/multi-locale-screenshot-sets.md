# Multi-Locale Screenshot Sets — Plan

Status: in progress. Original doc captured 2026-05-13; revised 2026-05-17
after analyzing against the current codebase and locking the UX shape.
Revised again 2026-05-18 after the Download tab cleanup landed the
export infrastructure (ZIP bundling, folder layout, per-project slug
naming) ahead of Phase 5 — see the Phase 5 row for what that leaves
to do.

## Why we're doing this

Apple and Google's stores accept distinct screenshot sets per locale, and
the difference is meaningful — the device screenshots themselves usually
show the localized in-app UI, not just translated overlay text. A Spanish
set wants Spanish in-app screens; a Japanese set wants Japanese in-app
screens. Headlines and subtitles change too, but they're the smaller
part.

The current locale flow can't represent this cleanly. It exposes a hidden
OpenAI auto-translate path that swaps overlay text only; device
screenshots are fixed across locales. We're replacing it with a
fork-from-default model: the user finishes the default set, then adds
locales as forks that can diverge in text and/or screenshots.

## Mental model

**Default is canonical.** Structural fields — frame, layout, background,
effects, composition, device position — live on the default `screens[i]`
and apply to every locale. A change to the default device frame shows up
in Spanish, French, and Japanese automatically.

**Locales only carry text + optional screenshot.** A `locales[code]`
entry holds, per screen, the overridden headline, subtitle, free text,
and optionally a localized screenshot path. Everything else cascades from
default.

**Locales are added after the default is finished.** Editing a non-default
locale in the sidebar is scoped to Text + Screenshot only; structural
tabs are disabled with a "switch to Default to edit structural settings"
hint. This is a UI affordance, not a data-model constraint — the model
inherently can't store structural overrides per locale.

## Why the original doc's data-model refactor isn't needed

The 2026-05-13 doc proposed introducing a `localeSets[]` array as a major
schema refactor. Re-reading the schema today
(`packages/core/src/config/schema.ts:438-441`):

```ts
locales: Record<string, LocaleConfig>
LocaleConfig = { screens?: { headline, subtitle, screenshot? }[], panoramic? }
```

This already models exactly what we want: default `screens` + sparse
per-locale overrides. The "add a `localeSets[]` array" refactor was
proposing a more aggressive restructuring that doesn't match the actual
edit shape. We're keeping the existing schema and adding `label?:
string` to `LocaleConfig` for the display name.

## UI shape

The preview canvas renders one row per locale, stacked vertically:

```
┌─ Default ─────────────────────────────────────────┐
│ [screen 1] [screen 2] [screen 3] [+ Add Screen]   │
└───────────────────────────────────────────────────┘
┌─ Spanish ─────────────────────────────────────────┐
│ [screen 1] [screen 2] [screen 3]                  │
└───────────────────────────────────────────────────┘
┌─ Portuguese ──────────────────────────────────────┐
│ [screen 1] [screen 2] [screen 3]                  │
└───────────────────────────────────────────────────┘

[+ Add Locale]
```

- **Active row** uses live iframes for editing (same `ScreenCard` shape
  as today).
- **Inactive rows** show cached static PNGs captured via
  `modern-screenshot`, refreshed lazily when the underlying data changes
  (intersection-observer-gated so off-screen rows don't recapture on
  every edit).
- **Row header** shows the locale label, set-active button, and remove.
- **+ Add Locale** opens a picker (search a built-in list of ~80 ISO
  codes + display names matching Apple's storefronts). On select: copy
  the default screens' text into `locales[code]`, prompt "Reuse default
  screenshots, or upload new ones?", and create the new row.

The current Variants axis stays orthogonal — every variant has its own
locale set.

## Format / file naming

YAML vs JSON is a non-issue here: the web preview persists each project
as `appframe.json`. `loadConfig()` still parses YAML, but only for the
preview server's `--config` flag (see `packages/web-preview/src/bin.ts`);
no other consumer remains since the CLI package was deleted. Schema
(Zod) is format-agnostic — the in-memory shape is what matters.

Per-locale screenshot files live at
`locales[code].screens[i].screenshot` — an explicit path per locale per
screen. No path-template convention; the user uploads through the UI
and the server writes it.

Export layout (inside the ZIP, at the archive root): `<locale>/screen-N.png`
(or in panoramic mode, `<locale>/frame-N.png`). macOS Archive Utility
wraps the multi-entry ZIP in a folder named after the archive
(`<project-slug>-screens/`), so the extracted shape is
`<project-slug>-screens/<locale>/screen-N.png`. The pre-multi-locale
shape (already shipped) is the same minus the `<locale>/` layer:
`<project-slug>-screens/screen-N.png`.

## What gets removed

- **`packages/web-preview/src/translation.ts`** — the OpenAI auto-translate
  call. Manual fork-and-edit replaces it; agents can be asked to
  translate a locale row directly.
- **`packages/web-preview/src/routes/translate.ts`** and the
  `/api/translate-locale` endpoint.
- **`localization` schema block** in `packages/core/src/config/schema.ts`
  (the xcstrings mode). It has zero UI, zero docs, exists as a parallel
  code path through `previewShared.ts` and `devices/assets.ts`, and the
  schema enforces it's mutually exclusive with `locales`. With the
  fork-from-default model we don't need a second path.
- Any client API helpers that called the translation endpoint.

## Phased rollout

| Phase | Work | Effort |
|-------|------|--------|
| 1 | Add `label?: string` to `LocaleConfig`; "Add Locale" / "Remove Locale" store actions; built-in locale catalog (~80 ISO codes + display names) in `packages/core/src/locales/catalog.ts`. New `Locales` pill in the header tab strip between Elements and Download, with a `LocalesTab` sidebar that shows the locale list (Default + added) and a "+ Add Locale" picker with a "Reuse default screenshots?" prompt. Canvas stays single-row this phase; clicking a locale in the sidebar just switches `state.locale` so the existing read path renders that locale's text | 1 session |
| 2 | Stacked-rows preview canvas (active = live iframes, inactive = cached PNGs captured via `modern-screenshot`, refresh gated by intersection observer + data-change subscription) | 2 sessions |
| 3 | Sidebar scoping + edit routing: (a) disable structural tabs when active row is non-default with inline hint; (b) route headline / subtitle / free-text edits to `sessionLocales[locale].screens[i]` instead of `screens[i]` whenever the active locale isn't default. Today those edits write straight to the default `screens` array; the store already has `upsertLocaleConfig` for the override path — Phase 3 wires the Text tab through it. | 1 session |
| 4 | Per-locale screenshot upload affordance on non-default rows; falls back to default when not set | 1 session |
| 5 | Export iteration. Infrastructure is **already built** as of commit 8121361 (ZIP bundling via `bundleAsZip`, per-project slug naming, folder-from-relPath layout). What's left: (a) add a locale multi-select control to the Download tab so the user picks which locales to include, defaulting to all; (b) change the relPath builder from `screen-N.png` to `${locale}/screen-N.png`; (c) iterate the render loop over selected locales × screens. No manifest — the `manifestName` field was dropped from `VariantArtifact` in the same cleanup, and nothing was reading it anyway | 0.5 session |
| 6 | Drop `translation.ts`, `/api/translate-locale`, the `localization` xcstrings schema, and dead branches in `previewShared.ts` / `devices/assets.ts` | 1 session |

~5.5–7.5 focused sessions (down from the previous estimate now that
Phase 5 is mostly pre-built).

## Scale ceiling

With client-side export shipped, the rendering pipeline is React +
`modern-screenshot`, not the Nunjucks + server-Playwright path the
original doc was sized against. The old "5–8 locales" ceiling no longer
applies.

Practical ceilings on a typical laptop (13" MacBook Air, Safari):

- **Up to ~15 locales × 10 screens** → comfortable. ~150 cached <img>
  tiles, sub-second row switching, snappy refresh on structural edits
  even with the visible-rows-only optimization off.
- **15–30 locales** → workable. Need intersection-observer-gated refresh
  (only re-capture rows visible or about to scroll into view) and edit
  debouncing on the default row so a slider drag doesn't trigger a full
  refresh cascade.
- **30–40+ locales (Apple's full storefront set)** → requires a visible
  "regenerating…" indicator after structural edits + lazy off-screen
  refresh. Achievable but the UI needs to communicate the cost.

Real numbers depend on screen complexity (more effects/overlays = bigger
captured PNGs); we'll know firmer ceilings once Phase 2 ships and we can
profile on real projects.

## Open decisions (locked)

- **Schema reshape:** none. Keep `locales: Record<string, LocaleConfig>`;
  add `label?: string`.
- **Structural edits on non-default rows:** disallowed at the UI level
  (sidebar scoping), enforced by the data model (locales can't store
  structural fields).
- **Locale labels:** ISO code as the key, optional display name as the UI
  label. Built-in catalog of ~80 codes shipped with the picker.
- **`localization` (xcstrings) mode:** dropped.
- **OpenAI auto-translate:** dropped.
- **Variants × locales:** orthogonal — every variant has its own
  `locales` map.
