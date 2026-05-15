# Save / auto-save — planning context for a fresh session

Status: open. JuanIsOnline reported it as part of issue #3 (2026-05-15):

> I accidentally hit the back button, and when I went forward, I lost all
> my work. Is there a way to save a project somewhere and have it
> auto-save whenever something changes?

This doc is the brief for a future Claude Code session picking up that
work. Start a new session and tell Claude: "read `docs/save-feature-plan.md`
and implement it."

## The user-visible problem

When the user opens the web preview without a config or session file
(i.e. just `pnpm preview`), all of their editing happens in the in-memory
Zustand store. A browser back-button click, a refresh, or an accidental
tab close throws away everything they did. There's no recovery, no
checkpoint, no autosave indicator.

## What exists today

Save infrastructure is partly in place from the old session-mode
workflow that was removed in earlier phases:

- **`POST /api/save`** (server.ts ~310): writes the current live config
  out to a YAML file *if* the server was started with `--config <path>`.
  Returns 400 with "Preview was not started with a config file" when no
  path was supplied at launch.
- **`POST /api/session/save`** (server.ts ~206): writes a richer JSON
  session record (variants + editor snapshots) when started with
  `--session <path>`.
- **`packages/web-preview/src/sessionPersistence.ts`**: server-side
  helpers for serializing the session record.
- **`hydrateSession` in `store.ts`**: client-side path to restore from
  a fetched session record on app load (called from `App.tsx:98`).
- **`sessionBacked` boolean in the store**: tracks whether a session
  file is bound.

So the *bones* of save exist, but they only kick in when the preview
server was launched with file paths. The default "just run `pnpm preview`"
case has no persistence.

## What needs to be built

The shape of the fix depends on how persistent the user wants saved
state to be. Three rough tiers:

### Tier 1 — localStorage autosave (cheapest, most universal)

- Serialize the active editor state (`screens`, `panoramicElements`,
  `panoramicBackground`, etc.) to `localStorage` on every change,
  debounced ~500ms
- On app load, if `localStorage` has saved state AND no session file
  was provided at launch, offer to restore it
- An "unsaved changes" / "saved Xs ago" indicator somewhere visible

Pros: works in every browser, zero server changes, survives back-button.
Cons: localStorage is per-origin, so users with multiple browser profiles
or who clear site data lose it. Capped at ~5MB which might be tight if
they have lots of base64-embedded screenshots in state.

### Tier 2 — Always persist to a default disk path

- If no `--config` was passed, the server picks a default
  (e.g. `~/.appframe/sessions/default.yaml` or `./.appframe.session.json`)
- Every change autosaves through `/api/save`
- App boots already loaded from disk

Pros: real persistence, survives browser changes.
Cons: server has to manage a path. Users running `pnpm preview` in
different directories would conflict on the default path unless it's
scoped to cwd.

### Tier 3 — Both, with localStorage as the offline path

- localStorage for "current session" (so back-button never loses work)
- Server-backed save for explicit "save this as a project" snapshots
- The two are complementary, not exclusive

Probably the right end state, but tier 1 alone closes the bug.

## Recommendation for the new session

Start with **tier 1** in isolation:

1. Add a Zustand middleware or a single subscriber that watches the
   relevant slices of state and writes a debounced JSON blob to
   `localStorage` under a key like `appframe.localSession.v1`.
2. On app boot in `App.tsx`, after the initial server fetches but
   before the user can interact, check for `localStorage` state and
   prompt to restore (small toast or banner: "Restore unsaved changes
   from your last session?")
3. Schema-version the blob so future format changes can migrate or
   discard cleanly.
4. Don't bother with the server-backed `/api/save` improvements yet —
   that's tier 2 and can ship as a follow-up.

## Relevant files

- `packages/web-preview/src/client/store.ts` — Zustand store, where the
  save subscriber attaches
- `packages/web-preview/src/client/App.tsx:58-124` — app boot effect,
  where the restore prompt fits
- `packages/web-preview/src/client/utils/api.ts` — existing API helpers
  (mostly unused for tier 1)
- `packages/web-preview/src/sessionPersistence.ts` — keep around, will
  matter for tier 2

## Out of scope for the new session

- Cross-device sync (would require a real backend)
- Multi-project / multi-document tabs (no current UI surface)
- Conflict resolution between localStorage and server-saved state —
  tier 2 problem
- Undo/redo history persistence — separate feature

## Why this is a separate session

The save problem touches the store, the boot flow, the UI for the
restore prompt, and possibly serialization helpers. Spinning it up
in a fresh session keeps context tight and avoids polluting the
client-side export migration / UI bug fix threads that were the focus
of the previous session.
