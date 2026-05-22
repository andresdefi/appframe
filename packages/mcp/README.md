# @appframe/mcp

Model Context Protocol server that lets AI agents (Claude Code, Cursor, Zed, etc.) observe and edit a running appframe preview.

The MCP wraps the local preview server's HTTP API (`http://localhost:4400` by default) and uses Server-Sent Events for live UI sync. The agent reads the same project state the browser UI shows and writes through the same persistence path the UI uses — every screen, position, font, color, background, device frame, callout, annotation, overlay, spotlight, loupe, locale, variant.

## Setup

1. From the repo root, install + build everything once:

   ```sh
   pnpm install
   pnpm build
   ```

2. Start the preview server (must stay running):

   ```sh
   pnpm preview
   ```

   Open <http://localhost:4400> in your browser — agent edits sync to this tab live via SSE, and `render_preview` captures PNGs through it. The browser tab needs to stay open for live-sync features.

3. Register the MCP with your agent. For Claude Code, add to `~/.claude/mcp.json` (or run `claude mcp add`):

   ```json
   {
     "mcpServers": {
       "appframe": {
         "command": "node",
         "args": ["<ABSOLUTE_PATH_TO_REPO>/packages/mcp/dist/bin.js"]
       }
     }
   }
   ```

   Replace `<ABSOLUTE_PATH_TO_REPO>` with where you cloned this repo (e.g. `/Users/you/appframe`). Use `APPFRAME_PREVIEW_URL` if the preview server runs on a non-default port.

## Tool surface (58 tools)

| Group | Tools |
|---|---|
| Discovery | `get_active_project`, `get_project`, `get_screen`, `list_projects`, `list_frames`, `list_fonts`, `list_koubou_devices`, `list_compositions`, `list_sizes`, `list_background_presets`, `list_locales`, `list_active_locales`, `list_variants`, `get_help` |
| Project lifecycle / config | `create_project`, `rename_project`, `duplicate_project`, `delete_project`, `switch_project`, `set_export_size` |
| Locales | `add_locale`, `remove_locale`, `set_active_locale`, `patch_locale_screen`, `set_locale_text` |
| Variants | `create_variant`, `delete_variant`, `set_active_variant`, `rename_variant` |
| Per-screen edits | `patch_screen`, `set_headline`, `set_subtitle`, `set_background`, `set_font`, `set_device_frame`, `move_device_frame`, `set_spotlight`, `set_loupe`, `set_composition`, `set_border_simulation`, `set_device_shadow`, `set_text_position`, `set_text_gradient`, `set_text_shadow` |
| Screen lifecycle | `add_screen`, `remove_screen`, `reorder_screens` |
| Callouts | `add_callout`, `update_callout`, `remove_callout` |
| Annotations | `add_annotation`, `update_annotation`, `remove_annotation` |
| Overlays | `add_overlay`, `update_overlay`, `remove_overlay` |
| Assets | `upload_screenshot`, `set_screenshot` |
| Render | `render_preview` |

Call `get_help` for a structured overview of categories, common workflows, and the editor-state shape.

## Common workflows

**"Open appframe with these images and arrange them":**

```text
create_project("My App Screenshots")
switch_project("my-app-screenshots")
upload_screenshot × N        # one per image
add_screen × N               # if you need more slots
set_screenshot per slot      # assign each image
set_headline per screen
reorder_screens([...])       # final ordering
render_preview               # see all screens
```

**"Give me 3 design directions for this set":**

```text
list_variants
create_variant(mode: "duplicate-active", name: "Concept B")
patch_screen × N             # differentiate
create_variant(mode: "duplicate-active", name: "Concept C")
patch_screen × N             # differentiate
# repeat for Concept D
set_active_variant("variant-A-id")   # return to original
```

**"Localize to Spanish":**

```text
list_locales                  # find code, e.g. "es-MX"
add_locale(code: "es-MX")     # snapshot current screens
set_active_locale("es-MX")
set_locale_text per screen    # translate headlines/subtitles
```

## Architecture

- **Read path**: `get_project` (live config) for the slim AppframeConfig view; `get_project_envelope` (via `getProjectEnvelope` client method) for the rich editor-state shape.
- **Write path**: every write hits the project envelope on disk (`/api/projects/:slug/...`), then broadcasts an SSE `project-changed` event. The browser refetches and applies via `hydrateProjectSnapshot` — the same restore code the project picker uses.
- **Never** writes through `/api/config` for edits — that's the slim AppframeConfig projection and loses callouts / gradients / spotlight flags when round-tripped.
- **Render**: SSE → browser runs modern-screenshot → POSTs PNG back. Ephemeral, no disk writes.

## Smoke test

With the preview server running and a browser tab open:

```sh
{
  printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}'
  printf '%s\n' '{"jsonrpc":"2.0","method":"notifications/initialized"}'
  printf '%s\n' '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
  printf '%s\n' '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_active_project","arguments":{}}}'
  sleep 1
} | node packages/mcp/dist/bin.js
```

Expected: 58 tools listed, `get_active_project` returns `{ "slug": "<your-active-project>" }`.
