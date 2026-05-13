# Multi-Locale Screenshot Sets — Future Work

Status: deferred. Captured 2026-05-13.

## Why we're doing this

Apple and Google's stores accept distinct screenshot sets per locale, and the difference is meaningful — the device screenshots themselves usually show the localized in-app UI, not just translated overlay text. A Spanish set wants Spanish in-app screens; a Japanese set wants Japanese in-app screens. Headlines and subtitles change too, but they're the smaller part.

The current appframe locale model can't represent this. It treats "locale" as a text-overlay toggle on top of a single shared `screens` array. Device screenshots are fixed across locales, headlines/subtitles are swapped via a `sessionLocales` map, and the only path to populating a new locale is an OpenAI auto-translate call that fails silently when `OPENAI_API_KEY` isn't set.

The goal: a user builds one screenshot set (say, Norwegian), then clicks "Add Spanish" / "Add English" / etc. to spin off independent copies. Each copy has its own screens, its own device-screenshot uploads, its own copy. Exports iterate over every locale set × every screen × every output size.

## What we're building

### Data model

Today:

```ts
{
  screens: Screen[],
  locale: 'es',
  sessionLocales: { es: { headlines: ['...'], subtitles: ['...'] } },
}
```

Target:

```ts
{
  localeSets: [
    { locale: 'no', label: 'Norwegian', screens: Screen[] },
    { locale: 'es', label: 'Spanish', screens: Screen[] },
    { locale: 'en', label: 'English', screens: Screen[] },
  ],
  activeLocaleSetIndex: 0,
}
```

Each `Screen` keeps its existing shape (headline, subtitle, device screenshot, frame, layout, effects, overlays). The set is the new container.

### UI shape

The preview area today shows a single horizontal strip of screens. The new model shows N stacked strips:

```
┌─ Norwegian ───────────────────────────────────────┐
│ [screen 1] [screen 2] [screen 3] [+ Add Screen]   │
└───────────────────────────────────────────────────┘
┌─ Spanish ─────────────────────────────────────────┐
│ [screen 1] [screen 2] [screen 3] [+ Add Screen]   │
└───────────────────────────────────────────────────┘
┌─ English ─────────────────────────────────────────┐
│ [screen 1] [screen 2] [screen 3] [+ Add Screen]   │
└───────────────────────────────────────────────────┘

[+ Add Locale]
```

Per-row controls: rename label, set active, delete, optionally collapse. The active row uses live iframes for editing; inactive rows show cached static images that re-render lazily when activated.

### Editing model

Most existing editor actions affect "the current screen." The new model adds the question "in which locale row?" — and the answer is usually "just this row." But there's a class of edits where the user probably wants to mirror the change across all rows:

- Changing the device frame (Pro Max → 17 Pro)
- Changing the layout
- Changing background/effects
- Adding/removing a screen position (a new screen added in Norwegian needs a corresponding slot in Spanish and English)

So edit operations need a `scope: 'this-row' | 'all-rows' | 'ask-me'` choice. Default depends on the edit type — text edits default to this-row, structural edits default to all-rows.

### Export iteration

Today's "Download all N screens" loops N screens × 1 size × 1 locale. New model loops N screens × R locale sets × S sizes. File naming changes from `screen-1.png` to `<locale>/screen-1.png` or `screen-1-<locale>.png`. Export-tab UI gets a "locales to include" multi-select (defaults to all rows that exist).

## Scale targets

Apple supports ~40 storefront locales globally; Google Play supports ~75. A power user with all of them and 10 screens each would have 400-750 preview tiles in the workspace. Realistic working set is more like 5-15 locales for most apps.

**Rendering ceilings:**

- ~100-200 small DOM tiles renders fine in any modern browser
- Live iframes are heavy (~10-30MB each) — only the active row should use them
- Inactive rows use cached static images that lazily refresh when activated or when the data model changes

**The Nunjucks+Playwright render path bottlenecks at ~5-8 locales.** Each tile costs hundreds of ms to render server-side. This is one of the reasons the client-side-export work matters — once rendering moves to React components in the browser, the per-tile cost drops to tens of ms and scaling to 30+ locales becomes feasible. The two refactors are coupled.

## Phased rollout

### Phase 1 — Data model migration (3-5 days)

- Add `localeSets[]` to the Zustand store
- Migrate the existing `screens` array into `localeSets[0].screens`
- Update every selector and action that touches `screens` to go through `localeSets[activeLocaleSetIndex].screens`
- YAML schema: add a `locales: [{ locale: 'no', screens: [...] }, ...]` shape. Older single-set YAMLs auto-migrate to one set on load.
- Backwards compat: existing project YAMLs keep working. The current single-set CLI users see no change.
- **Don't change the UI yet.** Internal refactor only.

### Phase 2 — UI for multiple rows (3-5 days)

- Preview canvas renders N stacked rows
- "+ Add Locale" button creates a new row by duplicating the active row
- Per-row header with label, rename, set-active, delete
- Inactive rows render as static image strips
- Sidebar tabs operate on the active row (current behavior, just scoped)

### Phase 3 — Edit scoping (2-3 days)

- Add the `scope` choice to structural edits (device frame, layout, background, screen add/remove)
- "Apply to all locales" checkbox in the relevant tabs, or a per-edit confirmation modal
- Sensible defaults per edit type

### Phase 4 — Export iteration (1-2 days)

- Export tab gets a locale multi-select
- "Download all" iterates locales × screens × sizes
- File naming convention: `<variant>/<locale>/<n>-<headline-slug>.png`
- For "Export Approved Artifact" in session-backed mode, the manifest captures all locales

### Phase 5 — Drop the OpenAI translation feature entirely (1 hour)

- Remove `packages/web-preview/src/translation.ts`
- Remove `/api/translate-locale` endpoint
- Remove `fetchAutoTranslateLocale` client API
- Update CLAUDE.md to note translation is no longer auto-magic; users translate by hand or by asking their AI agent to translate the active row

AI assistance for translation becomes an agent-driven flow ("ask Claude to translate this row into Spanish") rather than a hardcoded backend dependency.

**Realistic total: 2-3 weeks of focused work.**

## Open questions before starting

1. **YAML schema migration.** Should the YAML format change to put screens inside locales, or keep the current flat shape with a sibling `localized:` map? The flat shape is more backwards-compatible; the nested shape models the actual data better.
2. **Device-screenshot files on disk.** Today each screen has one `screenshot:` path. Per-locale screenshots need either per-locale paths or a path-template (`screens/<n>-<locale>.png`). Path templates are cleaner but require the user to organize files predictably.
3. **What happens when the user adds a 7th screen to the Norwegian row but the Spanish row only has 6?** Auto-create a placeholder in Spanish, or leave Spanish at 6 and warn at export? The "structural edits default to all rows" rule says auto-create.
4. **Variants × locales.** Variants (Concept A / Concept B) already exist as another axis. Are locales orthogonal — every variant has its own locale set — or does a locale's screens carry across all variants? Probably orthogonal, but needs deciding.

## Why we deferred this

- The current text-overlay locale flow technically "works" for the OpenAI happy path, even though it's not what most users actually need
- The data-model refactor in Phase 1 touches central editor state and needs careful testing
- It pairs naturally with the client-side-export plan since both refactors hit the rendering pipeline — better to do them together or sequence them carefully
- Higher-priority items right now: finishing the Download tab audit, more sidebar polish, the before.click feature gaps

## When to pick this up

Pre-conditions:
- Decision made on whether to ship the hosted version (most localization scaling pain shows up in a SaaS context, not local CLI)
- Or: a user complaint about being unable to ship per-locale screenshots
- Or: the client-side-export work lands first, opening the door to cheap multi-tile rendering

The first task on day one: lock the YAML schema (open question 1), since every subsequent decision depends on it.
