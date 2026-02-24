# appframe

Open-source tool for generating professional App Store & Play Store promotional screenshots.

## Tech Stack
- TypeScript (strict mode) with Node.js
- pnpm monorepo with 5 packages: core, cli, mcp-server, web-preview, store-upload
- Playwright for HTML-to-PNG rendering
- Nunjucks + Tailwind CSS for templates
- Commander.js for CLI
- YAML for per-app config files

## Code Conventions
- ESM modules (`"type": "module"`) everywhere
- Named exports only
- Functional patterns preferred
- Types defined in dedicated schema files, imported with `type` keyword
- `import type` enforced by TypeScript (`verbatimModuleSyntax`)

## Project Structure
- `packages/core/` — Config loading, template engine, rendering pipeline, frame management
- `packages/cli/` — Commander.js CLI, depends on core
- `packages/mcp-server/` — MCP server for AI agent integration, depends on core
- `packages/web-preview/` — Vite-based local preview UI, depends on core
- `packages/store-upload/` — App Store Connect + Google Play API upload, depends on core
- `frames/` — Device frame SVG/PNG assets with manifest.json
- `fonts/` — Bundled open-source fonts
- `examples/` — Example app configs and screenshots

## Build
- `pnpm build` — Build all packages
- `pnpm dev` — Watch mode for all packages
- `pnpm lint` — ESLint
- `pnpm format` — Prettier

## Testing
- Vitest for unit and integration tests
- Test files co-located: `*.test.ts` next to source files
