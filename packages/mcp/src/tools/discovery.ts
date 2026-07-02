import {
  COMPOSITION_PRESETS,
  STORE_SIZES,
  LOCALE_CATALOG,
} from '@appframe/core';
import type { ToolDefinition } from './types.js';
import {
  isRecord,
  jsonContent,
  requireRecord,
  requireSlug,
  unknownIdError,
} from './helpers.js';
import { getSchemaInfo, listSchemaNames } from './zodIntrospect.js';

// Tools that read project / catalog state. No writes happen here.
// Catalogs are imported directly from @appframe/core (static data) or
// fetched from the preview server (catalog endpoints).

// Catalog tools accept `fields: 'ids'` to return only the entry ids
// (typical token savings: ~90%). Default is the full catalog with
// descriptions. The slim form is enough for the agent to pick a valid
// id; if it needs details about a specific entry, it can fetch the
// full list — but that's rarely needed in practice.
const CATALOG_SLIM_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    fields: { enum: ['ids', 'full'] },
  },
  additionalProperties: false,
} as const;

function slimCatalogResponse(args: unknown, full: unknown): unknown {
  const a = isRecord(args) ? args : {};
  if (a.fields !== 'ids') return full;
  if (Array.isArray(full)) {
    return full.map((entry) => (isRecord(entry) && typeof entry.id === 'string' ? entry.id : entry));
  }
  if (isRecord(full)) {
    // For object-shaped catalogs (e.g. COMPOSITION_PRESETS), return the keys.
    return Object.keys(full);
  }
  return full;
}

// Stable orientation for an agent starting a new session. Returns
// categories + workflow recipes + the editor-state shape primer.
// Updates here should travel with new tool additions so the agent's
// boot-time read stays accurate.
const HELP_OVERVIEW = {
  about:
    'appframe MCP — observe and edit a running appframe screenshot project. ' +
    'Reads via /api/project (live config) and writes via /api/projects/:slug ' +
    '(rich envelope). Browser preview at http://localhost:4400 syncs in real ' +
    'time via SSE; render_preview captures PNGs through that browser.',
  bootSequence: [
    'Call `get_active_project` to find the slug the browser has open.',
    'Call `get_project` once to see the slim AppframeConfig view (every screen, position, font, color).',
    'For rich editor-state on one screen (callouts/overlays/spotlight/loupe), use `get_screen`.',
    'Use list_* tools (list_frames, list_fonts, list_compositions, list_sizes, list_background_presets, list_locales) to discover valid catalog ids before passing them.',
  ],
  toolGroups: {
    discovery: ['get_active_project', 'get_project', 'get_screen', 'list_projects', 'list_frames', 'list_fonts', 'list_koubou_devices', 'list_compositions', 'list_sizes', 'list_background_presets', 'list_locales', 'list_active_locales', 'list_variants', 'get_help'],
    projectLifecycle: ['create_project', 'rename_project', 'duplicate_project', 'delete_project', 'switch_project', 'set_export_size'],
    locales: ['add_locale', 'remove_locale', 'set_active_locale', 'patch_locale_screen', 'set_locale_text'],
    variants: ['create_variant', 'delete_variant', 'set_active_variant', 'rename_variant'],
    perScreenEdits: ['patch_screen', 'set_headline', 'set_subtitle', 'set_background', 'set_font', 'set_device_frame', 'move_device_frame', 'set_device_position', 'set_frame_style', 'set_spotlight', 'set_loupe', 'set_composition', 'set_border_simulation', 'set_device_shadow', 'set_text_position', 'set_text_gradient', 'set_text_shadow'],
    screenLifecycle: ['add_screen', 'remove_screen', 'reorder_screens'],
    callouts: ['add_callout', 'update_callout', 'remove_callout'],
    annotations: ['add_annotation', 'update_annotation', 'remove_annotation'],
    overlays: ['add_overlay', 'update_overlay', 'remove_overlay'],
    assets: ['upload_screenshot', 'set_screenshot'],
    render: ['render_preview'],
  },
  workflows: {
    'open-with-images':
      'create_project + switch_project, then upload_screenshot ×N, add_screen ×N (if needed), set_screenshot per slot, set_headline per screen, reorder_screens, render_preview to verify.',
    'design-variants':
      'create_variant(mode: "duplicate-active") to fork the active set, then patch_screen / set_background / set_font etc. to differentiate. Repeat per variant. set_active_variant flips between them.',
    'localize':
      'list_locales → add_locale(code) to snapshot current screens for that locale, set_active_locale, set_locale_text per screen for translations.',
  },
  screenStateShape: {
    note: 'patch_screen accepts editor-state shape. Top-level keys merge wholesale (nested objects like `spotlight` get replaced entirely).',
    textSlots: ['headline', 'subtitle', 'freeText'],
    perSlotFields: ['<slot>Font', '<slot>FontWeight', '<slot>Size', '<slot>LetterSpacing', '<slot>TextTransform', '<slot>Gradient', '<slot>Shadow'],
    device: ['frameId', 'deviceColor', 'frameStyle ("flat"|"none")', 'deviceScale', 'deviceTop', 'deviceAngle', 'deviceTilt', 'deviceRotation', 'deviceOffsetX'],
    background: ['backgroundType ("solid"|"gradient"|"image")', 'backgroundColor', 'backgroundGradient', 'backgroundImageDataUrl', 'backgroundImageFit', 'backgroundImagePositionX/Y', 'backgroundImageScale', 'backgroundOverlay'],
    effects: ['spotlightEnabled', 'spotlight {x,y,w,h,shape,dimOpacity,blur,borderRadius}', 'loupeEnabled', 'loupe {sourceX,sourceY,displayX,displayY,width,height,zoom,...}', 'borderSimulation {enabled,thickness,color,radius}', 'deviceShadow {opacity,blur,color,offsetY}'],
    arrays: ['callouts[]', 'annotations[]', 'overlays[]', 'extraDevices[]'],
  },
  safetyNotes: [
    'Destructive ops (delete_project, delete_variant, remove_screen) require `confirm: true` — confirm with the user before passing it.',
    'render_preview requires the browser tab to be open at http://localhost:4400.',
    'Always prefer `patch_screen` over `set_*` helpers when you need fields the helpers don\'t expose — the underlying capability is identical.',
  ],
} as const;

export const discoveryTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'get_help',
      description:
        'Return a structured overview of the MCP — categories, tool ' +
        'groups, workflow recipes, the editor-state shape, and safety ' +
        'notes. Call this once at the start of a session to orient ' +
        'before specific tool calls. Cheaper than walking the full ' +
        '`tools/list` and reading every description.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    handler: async () => jsonContent(HELP_OVERVIEW),
  },
  {
    descriptor: {
      name: 'inspect_schema',
      description:
        'Return authoritative field metadata for a named editor-state ' +
        'schema, derived live from the Zod schemas in @appframe/core ' +
        '(so it never drifts from reality). Each field carries `name`, ' +
        '`type`, optional `enum` values, `min`/`max` constraints, ' +
        '`default`, and an `optional` flag. Use this when you need to ' +
        'know exact field types / ranges before constructing a ' +
        '`patch_screen` body — more precise than the hand-written tool ' +
        "descriptions. The \"screen\" schema also lists the editor-state " +
        'device-positioning / frame-style fields (frameStyle, ' +
        'deviceScale, deviceTop, deviceOffsetX, deviceAngle, deviceTilt, ' +
        'deviceRotation, textPositions) that patch_screen accepts but ' +
        'that live outside the slim config schema. Supported `name` ' +
        'values are listed in the response when called without arguments.',
      inputSchema: {
        type: 'object',
        properties: { name: { type: 'string' } },
        additionalProperties: false,
      },
    },
    handler: async (args) => {
      const a = isRecord(args) ? args : {};
      const name = typeof a.name === 'string' ? a.name : '';
      if (name === '') {
        return jsonContent({ available: listSchemaNames() });
      }
      const info = getSchemaInfo(name);
      if (!info) {
        throw unknownIdError('schema', name, listSchemaNames(), 'Call inspect_schema with no arguments to list valid names.');
      }
      return jsonContent(info);
    },
  },
  {
    descriptor: {
      name: 'get_active_project',
      description:
        'Return { slug } for the project the user currently has open in ' +
        'the browser. `slug` is the directory name under ' +
        '~/Documents/appframe/projects/ — pass it to `patch_screen`. Slug ' +
        'is `null` when no browser has connected yet; in that case the ' +
        'user needs to open http://localhost:4400.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    handler: async (_args, { client }) => jsonContent(await client.getActiveProject()),
  },
  {
    descriptor: {
      name: 'get_overview',
      description:
        'High-level summary of one project in a single round-trip. ' +
        'Returns: { meta (displayName, createdAt, lastOpenedAt), ' +
        'screenCount, theme (font, weight, colors), exportSize, ' +
        'activeLocale, locales (codes only), activeVariant, variantCount, ' +
        'composition counts }. Replaces what would otherwise take 4-5 ' +
        'calls (list_projects + get_project + list_variants + ' +
        'list_active_locales + ...). Use as the "what is this project" ' +
        'orientation check at the start of an agent session.',
      inputSchema: {
        type: 'object',
        required: ['slug'],
        properties: { slug: { type: 'string', minLength: 1 } },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'get_overview');
      const slug = requireSlug(a);
      const env = await client.getProjectEnvelope(slug);
      const data = isRecord(env.data) ? env.data : {};
      const screens = Array.isArray(data.screens) ? data.screens : [];
      const variants = Array.isArray(data.variants) ? data.variants : [];
      const sessionLocales = isRecord(data.sessionLocales) ? data.sessionLocales : {};
      const localeScreens = isRecord(data.localeScreens) ? data.localeScreens : {};
      const localeCodes = Array.from(new Set([
        ...Object.keys(sessionLocales),
        ...Object.keys(localeScreens),
      ]));
      const compositionCounts: Record<string, number> = {};
      for (const s of screens) {
        if (isRecord(s)) {
          const c = typeof s.composition === 'string' ? s.composition : 'single';
          compositionCounts[c] = (compositionCounts[c] ?? 0) + 1;
        }
      }
      const theme = isRecord(data.theme) ? data.theme : {};
      const firstScreen = isRecord(screens[0]) ? screens[0] : {};
      return jsonContent({
        slug,
        schemaVersion: env.schemaVersion,
        savedAt: env.savedAt,
        screenCount: screens.length,
        compositionCounts,
        theme: {
          font: typeof theme.font === 'string' ? theme.font : (typeof firstScreen.headlineFont === 'string' ? firstScreen.headlineFont : null),
          fontWeight: typeof theme.fontWeight === 'number' ? theme.fontWeight : null,
          colors: isRecord(theme.colors) ? theme.colors : null,
        },
        exportSize: typeof data.exportSize === 'string' ? data.exportSize : null,
        activeLocale: typeof data.locale === 'string' ? data.locale : 'default',
        locales: localeCodes,
        activeVariantId: typeof data.activeVariantId === 'string' ? data.activeVariantId : null,
        variantCount: variants.length,
      });
    },
  },
  {
    descriptor: {
      name: 'get_project',
      description:
        'Return the full persisted project state from disk (every screen, ' +
        'position, font, color, background, device frame, callout, ' +
        'spotlight, loupe, locales, variants). Reads the on-disk envelope ' +
        '— always reflects the latest writes, unlike the browser\'s ' +
        'in-memory cache. Pass `slug` explicitly or omit to use the ' +
        'active project in the browser.',
      inputSchema: {
        type: 'object',
        properties: {
          slug: {
            type: 'string',
            minLength: 1,
            description:
              'Project slug. Defaults to the active project in the browser.',
          },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = isRecord(args) ? args : {};
      let slug: string;
      if (typeof a.slug === 'string' && a.slug.length > 0) {
        slug = a.slug;
      } else {
        const active = await client.getActiveProject();
        if (!active.slug) {
          throw new Error(
            'No active project — open a project in the browser or pass `slug`',
          );
        }
        slug = active.slug;
      }
      const envelope = await client.getProjectEnvelope(slug);
      return jsonContent({
        slug,
        schemaVersion: envelope.schemaVersion,
        savedAt: envelope.savedAt,
        ...(isRecord(envelope.data) ? envelope.data : {}),
      });
    },
  },
  {
    descriptor: {
      name: 'list_projects',
      description:
        'Return every project saved under ~/Documents/appframe/projects/. ' +
        'Each entry: slug `name`, human `displayName`, ' +
        '`createdAt`/`lastOpenedAt`/`savedAt` timestamps, ' +
        '`hasProjectFile`. Sorted most-recently-opened first.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    handler: async (_args, { client }) => jsonContent(await client.listProjects()),
  },
  {
    descriptor: {
      name: 'list_frames',
      description:
        'Return the catalog of device frames the renderer can apply. ' +
        'Each entry includes the `id` you pass as `frameId` to ' +
        '`patch_screen` (e.g. "iphone-17-pro-max", "ipad-pro-13"). Use ' +
        'this to discover valid frame IDs before editing. Pass ' +
        '`fields: "ids"` for a slim id-only list (~90% smaller).',
      inputSchema: CATALOG_SLIM_INPUT_SCHEMA,
    },
    handler: async (args, { client }) =>
      jsonContent(slimCatalogResponse(args, await client.listFrames())),
  },
  {
    descriptor: {
      name: 'list_fonts',
      description:
        'Return the catalog of bundled fonts. Each entry includes the ' +
        'font id used in `headlineFont` / `subtitleFont` / `freeTextFont` ' +
        '(e.g. "inter", "ultra", "bungee"). Use this to discover valid ' +
        'font ids before calling `set_font` or `patch_screen`. Pass ' +
        '`fields: "ids"` for a slim id-only list (~90% smaller).',
      inputSchema: CATALOG_SLIM_INPUT_SCHEMA,
    },
    handler: async (args, { client }) =>
      jsonContent(slimCatalogResponse(args, await client.listFonts())),
  },
  {
    descriptor: {
      name: 'list_koubou_devices',
      description:
        'Return externally-installed device families (the modern Apple ' +
        'lineup — iPhone 17 / Air / iPad Pro M4 / etc). Disjoint from ' +
        '`list_frames`, which only returns the four bundled SVG frames. ' +
        "Use each entry's `id` as `frameId`. Requires the `koubou` " +
        'Python package installed on the user\'s machine; if it isn\'t, ' +
        'the families list is empty. Pass `fields: "ids"` for a slim ' +
        'id-only list.',
      inputSchema: CATALOG_SLIM_INPUT_SCHEMA,
    },
    handler: async (args, { client }) =>
      jsonContent(slimCatalogResponse(args, await client.listKoubouDevices())),
  },
  {
    descriptor: {
      name: 'list_compositions',
      description:
        'Return the multi-device layout presets a screen can use via the ' +
        '`composition` field. "single" is one device; "duo-overlap" two ' +
        'stacked; "duo-split" two side-by-side; "hero-tilt" one tilted ' +
        'large device; "fanned-cards" a fanned spread. Each entry ' +
        "carries its slot count and default device positions — use the " +
        '`id` as the `composition` value in `patch_screen`. Pass ' +
        '`fields: "ids"` for a slim id-only list.',
      inputSchema: CATALOG_SLIM_INPUT_SCHEMA,
    },
    handler: async (args) => jsonContent(slimCatalogResponse(args, COMPOSITION_PRESETS)),
  },
  {
    descriptor: {
      name: 'list_sizes',
      description:
        'Return the App Store / Play Store target export sizes the ' +
        'renderer ships, grouped by device family. Response shape: ' +
        '`{ iphone, ipad, mac, watch, android }` — each is ' +
        '`{ default, sizes: [{key, name, width, height}, ...] }`. ' +
        '`width`/`height` are the actual EXPORT pixel dimensions (the ' +
        'renderer ships these to Apple / Google). `default` is the ' +
        "platform's preferred size:\n" +
        '  • iphone → "ios-6.9" (1260×2736 — Apple requires for ' +
        'App Store submission)\n' +
        '  • ipad → "ios-ipad-13" (2064×2752 — highest iPad resolution)\n' +
        '  • mac → "mac-2880x1800" (highest 16:10 macOS size)\n' +
        '  • watch → "watch-ultra3" (422×514 — highest watchOS res)\n' +
        '  • android → "android-phone"\n' +
        "Pass any `key` as the project's `exportSize` via `set_export_size`.",
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    handler: async () => {
      // Match the server's /api/sizes transformation exactly:
      //  - split STORE_SIZES "ios" platform into iphone vs ipad based
      //    on the key (App Store treats them as one platform but the UI
      //    and the agent think of them as distinct device families)
      //  - double width/height to the actual export resolution (core
      //    stores half-resolution preview dims; the renderer doubles
      //    on export)
      // Defaults are the highest-resolution / Apple-recommended size
      // per platform — verified against the App Store / Play Store
      // requirements doc.
      const PREFERRED_DEFAULTS: Record<string, string> = {
        iphone: 'ios-6.9',          // Apple requires 6.9" for App Store submission
        ipad: 'ios-ipad-13',         // 2064x2752 — highest iPad resolution
        mac: 'mac-2880x1800',        // highest of the four 16:10 macOS sizes
        watch: 'watch-ultra3',       // 422x514 — highest watchOS resolution
        android: 'android-phone',    // canonical Google Play phone size
      };
      const grouped: Record<
        string,
        { default: string | null; sizes: Array<{ key: string; name: string; width: number; height: number }> }
      > = {};
      for (const [key, info] of Object.entries(STORE_SIZES)) {
        const platform = (info as { platform?: string }).platform ?? 'other';
        let category = platform === 'ios' ? 'iphone' : platform;
        if (platform === 'ios' && key.includes('ipad')) category = 'ipad';
        const group = grouped[category] ?? { default: null, sizes: [] };
        grouped[category] = group;
        group.sizes.push({
          key,
          name: (info as { name: string }).name,
          // Double dims to the actual export resolution — matches
          // what the renderer produces and what Apple / Google expect.
          width: (info as { width: number }).width * 2,
          height: (info as { height: number }).height * 2,
        });
      }
      for (const [platform, group] of Object.entries(grouped)) {
        const preferred = PREFERRED_DEFAULTS[platform];
        if (preferred && group.sizes.some((s) => s.key === preferred)) {
          group.default = preferred;
        } else {
          group.default = group.sizes[0]?.key ?? null;
        }
      }
      return jsonContent(grouped);
    },
  },
  {
    descriptor: {
      name: 'list_background_presets',
      description:
        'Return the categorised background palette the UI Background tab ' +
        'renders: solid color categories (Mono, Vibrant, Pastel, Earth, ' +
        'Brand) and gradient categories (Sunset, Ocean, Cosmic, Aurora, ' +
        'Vivid, Pastel, Glow, Mesh). Response shape: { solids: ' +
        '[{name, colors[]}], gradients: [{name, presets: [{name, ' +
        'colors[], direction, type?, radialPosition?}]}] }. Pick a preset ' +
        'and pass its color / gradient spec to `set_background`. Note: ' +
        '`set_background` ALSO accepts arbitrary colors / gradients — ' +
        'use presets when one fits, invent custom ones otherwise.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    handler: async (_args, { client }) => jsonContent(await client.listBackgroundPresets()),
  },
  {
    descriptor: {
      name: 'list_locales',
      description:
        'Return the catalog of locale codes appframe knows about, with ' +
        'English label and native endonym for each (~50 entries — ' +
        'en-US, fr, ja, zh-Hans, es-MX, ar-SA, etc). Use this to pick a ' +
        'valid `code` for `add_locale`. Distinct from ' +
        '`list_active_locales`, which returns what the current project ' +
        'already has configured. Pass `fields: "ids"` for slim ' +
        'code-only list.',
      inputSchema: CATALOG_SLIM_INPUT_SCHEMA,
    },
    handler: async (args) => {
      // LOCALE_CATALOG entries use `code` not `id`; remap for slim.
      const a = isRecord(args) ? args : {};
      if (a.fields === 'ids') {
        return jsonContent(LOCALE_CATALOG.map((e) => e.code));
      }
      return jsonContent(LOCALE_CATALOG);
    },
  },
  {
    descriptor: {
      name: 'list_active_locales',
      description:
        "Return the locales the given project has configured (i.e. " +
        "snapshotted via `add_locale`), plus the currently-active locale. " +
        'Always includes the implicit "default" locale at the top. Use ' +
        'before `set_active_locale` to find what codes are valid.',
      inputSchema: {
        type: 'object',
        required: ['slug'],
        properties: { slug: { type: 'string', minLength: 1 } },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'list_active_locales');
      const slug = requireSlug(a);
      const envelope = await client.getProjectEnvelope(slug);
      if (!isRecord(envelope.data)) {
        throw new Error('project envelope `data` is not an object');
      }
      const data = envelope.data as Record<string, unknown>;
      const sessionLocales = isRecord(data.sessionLocales) ? data.sessionLocales : {};
      const localeScreens = isRecord(data.localeScreens) ? data.localeScreens : {};
      const codes = Array.from(new Set([
        ...Object.keys(sessionLocales),
        ...Object.keys(localeScreens),
      ]));
      const configured = codes.map((code) => {
        const entry = isRecord(sessionLocales[code]) ? sessionLocales[code] : {};
        return {
          code,
          label: typeof entry.label === 'string' ? entry.label : undefined,
          hasScreens: Array.isArray(localeScreens[code]),
        };
      });
      const active =
        typeof data.locale === 'string' && data.locale.length > 0 ? data.locale : 'default';
      return jsonContent({ active, defaultIncluded: true, configured });
    },
  },
  {
    descriptor: {
      name: 'list_variants',
      description:
        "Return the project's variants array plus the active variant id. " +
        "Each variant carries: id, name, description, status (`draft` | " +
        "`approved`), createdAt/updatedAt, snapshot (frozen state), " +
        "provenance (origin / branchDepth / note), history. Use this " +
        "before `set_active_variant`, `delete_variant`, or " +
        "`rename_variant` to find the variant id you want.",
      inputSchema: {
        type: 'object',
        required: ['slug'],
        properties: { slug: { type: 'string', minLength: 1 } },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'list_variants');
      const slug = requireSlug(a);
      const envelope = await client.getProjectEnvelope(slug);
      if (!isRecord(envelope.data)) {
        throw new Error('project envelope `data` is not an object');
      }
      const data = envelope.data as Record<string, unknown>;
      const variants = Array.isArray(data.variants) ? data.variants : [];
      const active = typeof data.activeVariantId === 'string' ? data.activeVariantId : null;
      return jsonContent({ activeVariantId: active, variants });
    },
  },
];
