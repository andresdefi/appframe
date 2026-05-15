# Save / auto-save — planning context for a fresh session

Status: Phases 1-4 shipped on 2026-05-15. Phase 5 (file watcher) is intentionally deferred until CLI/MCP returns. JuanIsOnline reported the original bug as part of issue #3:

> I accidentally hit the back button, and when I went forward, I lost all my work. Is there a way to save a project somewhere and have it auto-save whenever something changes?

What landed:

| Phase | Commit | What shipped |
|-------|--------|-------------|
| 1 | `a581378` | Screenshot extraction: uploads now go through `POST /api/screenshots/upload` and live on disk under `~/Documents/appframe/projects/<project>/screenshots/<name>.png`. The Zustand store only carries the URL, so saves stay small. 25 new tests. |
| 2 | `7cf7cdd` | Single-project autosave: 500ms debounced `PUT /api/projects/<project>` writes the snapshot to `appframe.json` atomically (tmp + rename). `beforeunload` + `visibilitychange→hidden` flush via fetch `keepalive`. Schema-versioned envelope, corrupt/future-schema surfaces as page-level error rather than overwriting the file. +23 tests. |
| 3 | `6ef030f` | Multi-project + picker UI: `meta.json` next to `appframe.json` carries `displayName`, `createdAt`, `lastOpenedAt`. List / Create / Rename / Duplicate / Delete / Touch endpoints. Project chip in HeaderBar opens a picker modal. Human-readable display names ("Impostor Party Game") auto-slugify to filesystem-safe directory names; collisions auto-suffix. Boot auto-resumes the most-recently-opened project. +20 tests. |
| 4 | `c684046` | Legacy retire: `/api/save`, `/api/session`, `/api/session/save`, `/api/session-asset` endpoints deleted. `sessionPersistence.ts` gone (the one survivor, `buildConfigFromEditorState`, moved to `editorState.ts`). `--session` CLI flag removed. Client side: `hydrateSession`, `saveSession`, `sessionBacked`, etc. — all gone. Variants now persist as part of the project snapshot (`projectSnapshotFromState`) instead of via the dead session pipeline, so the Variants tab keeps working. Net -559 lines. |

Status at the end of Phase 4: 234 tests passing, typecheck + lint clean, manual verification across the picker, switch-no-bleed, restart-and-resume, and Variants tab flows.

The sections below are kept as-is for historical context — they're the brief the implementing session worked from, plus the testing checklist that informed each phase's coverage. Edit when picking up Phase 5 or revisiting any design decision.

---

This doc is the brief for a future Claude Code session picking up that work. Start a new session and tell Claude: "read `docs/save-feature-plan.md` and implement it."

## The user-visible problem

When the user opens the web preview (just `pnpm preview`), all of their editing happens in the in-memory Zustand store. A back-button click, a refresh, an accidental tab close, or a machine reboot throws away everything they did. The expected behavior — like Figma, Notion, or any modern design tool — is that work persists automatically and reappears when the user comes back.

## What the user wants (from a 2026-05-15 planning conversation)

1. **Edits save automatically** as the user makes them — no Save button to forget.
2. **Edits survive everything**: back button, refresh, browser close, machine reboot.
3. **Edits reappear on relaunch.** Closing localhost on Tuesday and reopening on Thursday brings back the project the user was working on.
4. **Multi-project support.** Working on more than one screenshot project at a time, with a way to switch between them.
5. **CLI / MCP-friendly format.** When the CLI / MCP server comes back, Claude needs to be able to see and edit the same projects the UI writes — by reading and writing the same files.

The old `session-backed` infrastructure (`/api/save`, `/api/session/save`, `sessionBacked` boolean in the store, `hydrateSession`, `sessionPersistence.ts`) was built for a different workflow where appframe was launched directly from a Claude conversation. That workflow is dead and the infrastructure should be retired as part of this feature, not preserved.

## Why not localStorage

The first instinct was a localStorage autosave. It doesn't work: each screen carries a ~2MB base64 screenshot data URI in state, so a 3-screen project already blows past the 5MB cap. Disk-backed storage is the only realistic option.

## Why JSON, not YAML

YAML was the historical config format. Three reasons to switch:

1. **MCP / Claude integration is a stated goal.** Claude reading and writing files via MCP is dramatically more reliable with JSON — strict format, one way to write each value, parse errors loud and at known locations. YAML's indentation rules and quoting ambiguity create subtle ways for an automated edit to silently break a config.
2. **It's pre-1.0 and getting rebuilt.** No user data in the wild to migrate.
3. **No `yaml` dep needed in core.** `JSON.parse` / `JSON.stringify` are built in.

The minor downsides — no comments, slightly more braces — don't matter much; the UI is the primary editor, users rarely hand-edit project files.

## Storage layout

Visible to the user in Finder / Explorer — not a hidden dotfile dir. Convention follows Figma, OBS, Notion:

```
~/Documents/appframe/
└── projects/
    ├── my-cool-app/
    │   ├── appframe.json        ← the project (config + variants + state)
    │   ├── screenshots/         ← uploaded PNGs, referenced by path
    │   │   ├── home.png
    │   │   └── checkout.png
    │   └── meta.json            ← lastOpenedAt, thumbnail, etc.
    └── another-project/
        └── ...
```

Each project is a self-contained directory. The user can zip it, email it, back it up, git-track it, move it to another machine. When MCP comes back, Claude just reads files in that directory — no special protocol.

## Auto-save behavior

Drags and sliders already use an "instant patch" pattern (verified in `useDragPosition.ts:205-218` and `useInstantPatch.ts`) — the iframe DOM updates at 60fps but the Zustand store only commits on release. A 3-second device drag produces **one** store update, not 180.

`pushSnapshot()` (the undo-stack push in `store.ts:792`) only fires inside store action functions, which only run on committed edits. So one user-level edit = one store change = one undo step = one save trigger.

Given that, autosave is straightforward:

- **500ms trailing debounce.** Every store change schedules a save 500ms in the future; subsequent changes within that window cancel and reschedule. Covers the keystroke-typing case where each character is a store update.
- **Flush on `beforeunload`.** If the user closes the tab with a pending save, force it through before the page unloads.
- **Flush on `visibilitychange` to hidden.** More reliable than `beforeunload` on mobile.

Save load in practice: ~10-20 saves over a typical 5-minute editing session. Trivial.

## The size problem (and the fix)

Today, uploaded screenshots live in the Zustand store as base64 data URIs (~2MB each). Saving the whole store directly means a ~10MB+ JSON file per write — still doable, but heavy and noticeable on rapid edits.

**Extract screenshots to disk early in the build order.** When the user uploads a PNG, the server writes it to `~/Documents/appframe/projects/<project>/screenshots/<filename>.png` and stores only the relative path in the project JSON. The project file drops from ~10MB to ~50-200KB. Saves become near-instant regardless of project size. Bonus: exports get faster too (no base64 decode step).

This isn't optional — the autosave UX depends on it staying responsive.

## Build order

The phases below are sized so that each one ships a complete user-facing improvement and the most critical fix lands first.

### Phase 1 — Screenshot extraction (do first)

Move uploaded PNGs out of Zustand state and onto disk. Keep paths in the store. This is the prerequisite for any disk-backed save being responsive.

Files: a new server endpoint that accepts a PNG blob + project name, writes to disk, returns a path. Client-side upload flow patched to call it. Existing `screenshotDataUrl` references in the export flow updated to either read the file from disk or accept the path.

### Phase 2 — Single-project disk save

Pick a default location (`~/Documents/appframe/projects/default/`). Auto-save the active project there with 500ms debounce + beforeunload/visibilitychange flush. On `pnpm preview` boot, if that default project exists, load it. Otherwise start fresh and create the default project directory on first edit.

This alone closes the "lost on back-button" bug.

### Phase 3 — Multi-project + picker

Server scans `~/Documents/appframe/projects/` on boot, returns a list of projects with metadata. UI shows a project picker on launch: list of recent projects (sorted by `lastOpenedAt`), thumbnails from `meta.json`, "New project" button, "Rename" / "Delete" / "Duplicate" actions. After picking, the active project name is held in client state and routed into the save endpoint. Switching projects from inside the app is a separate dropdown / menu in the header.

### Phase 4 — Retire the old session-backed infrastructure

Once Phase 2+3 ships, the legacy `/api/save`, `/api/session/save`, `hydrateSession`, `sessionBacked` boolean, and `sessionPersistence.ts` are dead. Delete them.

### Phase 5 (later, when CLI/MCP returns) — File watcher

Add a `chokidar`-style file watcher on the active project's `appframe.json`. When Claude edits the file via MCP, the watcher pushes the new state into the running web UI via WebSocket or SSE so the user sees Claude's edits in real time.

## Testing

Each phase needs tests landing alongside the code, not as a follow-up. The goal is that "I edited something, then closed the tab, then reopened" works *every time*, not just on the happy path. The current test infrastructure (Vitest for unit/integration, Playwright for e2e in `e2e/`) is the right home for these.

### Phase 1 — Screenshot extraction

- **Unit:** upload helper takes a Blob + project name, writes to the expected path, returns the relative path. Round-trip: write a known PNG, read it back, compare bytes.
- **Integration:** server endpoint accepts multipart/form-data (or base64 JSON, whichever is chosen), refuses paths that escape the project dir (`../../etc/passwd` style), enforces a sane size cap, returns 4xx on duplicates without clobbering.
- **Migration:** when the export flow encounters a screen whose `screenshot` is a data URI (legacy) instead of a path, it still renders correctly. Don't break old in-memory state mid-migration.

### Phase 2 — Single-project disk save

- **Unit:** the debounced save subscriber. Fire N store changes inside a 500ms window → exactly 1 save call. Fire N changes spaced 600ms apart → N save calls. `beforeunload` with a pending save → flushes synchronously.
- **Integration:** save endpoint writes the JSON atomically (write to `appframe.json.tmp` then rename) so a crash mid-write never leaves a half-written file that loses everything. Load endpoint round-trips: write a project, fetch it, deep-equal the state.
- **Schema versioning:** the saved JSON includes a `schemaVersion` field. The loader handles a missing version (assume v0/legacy), a current version (pass through), and a future version (refuse with a clear error rather than silently dropping fields).
- **Boot behavior:** server with no default project → fresh start. Server with default project on disk → loads it. Server with a corrupted project file → reports an error to the client UI instead of silently nuking the file.

### Phase 3 — Multi-project + picker

- **Unit:** project listing function scans the directory, sorts by `lastOpenedAt`, ignores files that aren't valid projects (no `appframe.json` inside), survives a project dir with broken `meta.json`.
- **Integration:** create / rename / duplicate / delete endpoints. Rename rejects collisions. Delete is reversible *only* if implemented as a trash dir (probably not worth it for v1 — a confirm dialog client-side is enough).
- **E2E (Playwright):** open two tabs against the same project — second tab's edits should be visible after a reload (last-write-wins is fine for v1; conflict resolution is a Phase 5 concern). Switch projects mid-session: state in memory swaps cleanly without bleeding the old project's screens into the new one.

### Phase 4 — Retiring session-backed code

- **Pure code-deletion phase.** The existing test suite already covers what's left; the test work is just making sure no tests still depend on the deleted endpoints / store helpers. Grep the test files; any failures here mean a stale dependency that needs porting to the new path or just deleting alongside.

### Phase 5 — File watcher (when MCP returns)

- **Unit:** watcher debounces filesystem events (an editor writing the file often touches it twice; debounce ~100ms so we don't double-broadcast).
- **Integration:** watcher detects out-of-band edits to `appframe.json`, pushes the new state to connected WebSocket clients. The receiving UI applies the change without resetting cursor focus / scroll position.
- **Loopback safety:** the watcher MUST ignore its own writes. When the UI's own save lands on disk, the watcher shouldn't bounce that back as an external change. Test with rapid round-trips.

### Cross-cutting

A handful of tests are worth their own scope, separate from any phase:

- **No data loss on crash.** Simulate a crash mid-save (kill the write between `tmp` and `rename`) → the project on disk is either the previous good state or the new state, never a half-written file.
- **Disk-full / read-only / permission-denied.** Save endpoint returns a meaningful error, the UI surfaces it as a toast, the user keeps their in-memory state until they can resolve the issue.
- **The "I closed the tab right after typing" case** via Playwright: type a character, dispatch a `beforeunload` event, navigate away, navigate back. The character is there.

## Relevant files for the implementation session

- `packages/web-preview/src/client/store.ts` — Zustand store, where the autosave subscriber attaches
- `packages/web-preview/src/client/App.tsx:58-124` — app boot effect, where the project picker / restore flow lives
- `packages/web-preview/src/client/utils/api.ts` — existing API helpers; add `saveProject`, `loadProject`, `listProjects`, `uploadScreenshot`
- `packages/web-preview/src/server.ts` — new endpoints for save/load/list/upload + screenshot serving
- `packages/web-preview/src/sessionPersistence.ts` — to be deleted in Phase 4
- `packages/web-preview/src/server.test.ts` — existing server-endpoint tests; the new endpoints land here
- `e2e/` — Playwright tests; new specs for the autosave + picker user flows

## Out of scope

- Cross-device sync (user can sync `~/Documents/appframe/` via iCloud / Dropbox themselves)
- Persisting the undo/redo stack across sessions (undo stays session-scoped, as is standard for design tools — Figma, Sketch, Notion, etc. all do this)
- Conflict resolution if Claude (via MCP) and the user edit at the same time — handle in Phase 5 when the watcher is added
- Version history / named snapshots (a future separate feature, different data model)
