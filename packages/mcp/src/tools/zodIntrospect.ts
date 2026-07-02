// Light Zod (v4) introspection — extracts field names, types, and
// constraints (min/max/enum) from the schemas in @appframe/core so the
// agent can read authoritative field metadata at runtime instead of
// trusting the hand-written tool descriptions. When core's schemas
// change, the agent's view changes too.
//
// Zod v4 exposes the actual constraints on the instance (`minValue`,
// `maxValue`, `entries` for enums) rather than buried in `_def.checks`
// like v3 did.

import { appframeConfigSchema } from '@appframe/core';

interface SchemaField {
  name: string;
  type: string;
  optional?: boolean;
  enum?: readonly string[];
  min?: number;
  max?: number;
  default?: unknown;
  description?: string;
}

interface SchemaInfo {
  name: string;
  fields: SchemaField[];
}

// Walk past ZodOptional / ZodDefault / ZodNullable wrappers to the
// underlying type. Returns the unwrapped schema + whether it was
// optional + any default value seen along the way.
function unwrapZod(schema: unknown): {
  schema: unknown;
  optional: boolean;
  defaultValue?: unknown;
} {
  let cur = schema as {
    _def?: {
      innerType?: unknown;
      type?: string;
      defaultValue?: unknown;
    };
  };
  let optional = false;
  let defaultValue: unknown;
  while (cur?._def?.innerType) {
    const t = cur._def.type;
    if (t === 'optional' || t === 'nullable') optional = true;
    if (t === 'default' && cur._def.defaultValue !== undefined) {
      defaultValue = cur._def.defaultValue;
    }
    cur = cur._def.innerType as typeof cur;
  }
  return { schema: cur, optional, defaultValue };
}

function describeField(name: string, raw: unknown): SchemaField {
  // Pull description BEFORE unwrapping — `.describe()` returns a new
  // instance with the description on the outermost wrapper. The inner
  // (constraint-bearing) instance won't have it.
  const description = (raw as { description?: string }).description;
  const { schema: zod, optional, defaultValue } = unwrapZod(raw);
  const z = zod as {
    _def?: { type?: string; entries?: Record<string, string> };
    minValue?: number;
    maxValue?: number;
  };
  const type = z._def?.type ?? 'unknown';
  const field: SchemaField = { name, type };
  if (optional) field.optional = true;
  if (defaultValue !== undefined) field.default = defaultValue;
  // Zod v4 enums expose values via `entries`. Hand back as an array.
  if (type === 'enum' && z._def?.entries) {
    field.enum = Object.values(z._def.entries);
  }
  if (typeof z.minValue === 'number') field.min = z.minValue;
  if (typeof z.maxValue === 'number') field.max = z.maxValue;
  if (typeof description === 'string' && description.length > 0) {
    field.description = description;
  }
  return field;
}

function describeShape(name: string, raw: unknown): SchemaInfo {
  const { schema: zod } = unwrapZod(raw);
  const shape = (zod as { shape?: Record<string, unknown> }).shape;
  if (!shape) {
    return { name, fields: [] };
  }
  const fields = Object.entries(shape).map(([fieldName, fieldSchema]) =>
    describeField(fieldName, fieldSchema),
  );
  return { name, fields };
}

// Editor-state-only screen fields. `patch_screen` accepts the rich
// editor-state shape (web-preview's `ScreenState`), but several
// device-positioning + frame-style fields live ONLY there — they are
// NOT part of the slim Zod `screenConfigSchema` introspected above, so
// the automatic walk can't surface them. Without these, an agent
// driving the MCP can't discover frameStyle / deviceScale / deviceTop /
// etc. and has to read core source (the exact gap this list closes).
// Types, ranges, and defaults mirror the source of truth:
//   - packages/core/src/config/schema.ts (~lines 428-694; frameStyleSchema,
//     panoramicDeviceElementSchema share the same ranges/defaults)
//   - packages/core/src/templates/engine.ts (~lines 129-133, RenderContext)
//   - packages/web-preview/src/client/types.ts (ScreenState)
const EDITOR_STATE_SCREEN_FIELDS: SchemaField[] = [
  {
    name: 'frameStyle',
    type: 'enum',
    enum: ['flat', 'none'],
    default: 'flat',
    optional: true,
    description:
      "Device frame rendering style. 'flat' draws the device frame; 'none' removes the frame entirely — pair with borderSimulation (set_border_simulation) to draw a colored bezel. Helper: set_frame_style.",
  },
  {
    name: 'deviceScale',
    type: 'number',
    min: 50,
    max: 100,
    default: 92,
    optional: true,
    description:
      'Device width as a percent of canvas width. Helper: set_device_position (or move_device_frame `scale`).',
  },
  {
    name: 'deviceTop',
    type: 'number',
    min: -80,
    max: 80,
    default: 15,
    optional: true,
    description:
      'Device vertical position as a percent of canvas height. Lower values push the device down. Helper: set_device_position (or move_device_frame `top`).',
  },
  {
    name: 'deviceOffsetX',
    type: 'number',
    min: -80,
    max: 80,
    default: 0,
    optional: true,
    description:
      'Horizontal offset from center as a percent of canvas width. Helper: set_device_position (or move_device_frame `offsetX`).',
  },
  {
    name: 'deviceAngle',
    type: 'number',
    min: 2,
    max: 45,
    default: 8,
    optional: true,
    description:
      'Perspective angle in degrees for angled layouts. Helper: set_device_position (or move_device_frame `angle`).',
  },
  {
    name: 'deviceTilt',
    type: 'number',
    min: 0,
    max: 40,
    default: 0,
    optional: true,
    description:
      '3D tilt angle in degrees (rotateX) for perspective compositions. Helper: move_device_frame `tilt`.',
  },
  {
    name: 'deviceRotation',
    type: 'number',
    min: -180,
    max: 180,
    default: 0,
    optional: true,
    description: 'Pure 2D rotation of the device in degrees. Helper: move_device_frame `rotation`.',
  },
  {
    name: 'textPositions',
    type: 'object',
    optional: true,
    default: { headline: null, subtitle: null, freeText: null },
    description:
      'Per-slot manual text placement. Object with headline / subtitle / freeText keys, each { x, y, width? } as a percent of canvas (or null to auto-position). Helper: set_text_position.',
  },
];

// Build the catalog once at module load — Zod schemas don't change at
// runtime. Names are the agent-facing keys.
function buildCatalog(): Record<string, SchemaInfo> {
  const screenSchemaRaw =
    (appframeConfigSchema.shape.screens as { _def: { innerType: { element: unknown } } })
      ._def.innerType.element;
  const screen = unwrapZod(screenSchemaRaw).schema as { shape: Record<string, unknown> };

  // Append the editor-state-only fields the Zod walk can't see, skipping
  // any that the slim schema already covers (so a future core change
  // that promotes one into screenConfigSchema doesn't double-list it).
  const screenInfo = describeShape('screen', screenSchemaRaw);
  const known = new Set(screenInfo.fields.map((f) => f.name));
  for (const extra of EDITOR_STATE_SCREEN_FIELDS) {
    if (!known.has(extra.name)) screenInfo.fields.push(extra);
  }

  return {
    screen: screenInfo,
    spotlight: describeShape('spotlight', screen.shape.spotlight),
    loupe: describeShape('loupe', screen.shape.loupe),
    borderSimulation: describeShape('borderSimulation', screen.shape.borderSimulation),
    deviceShadow: describeShape('deviceShadow', screen.shape.deviceShadow),
    backgroundGradient: describeShape('backgroundGradient', screen.shape.backgroundGradient),
    backgroundOverlay: describeShape('backgroundOverlay', screen.shape.backgroundOverlay),
    theme: describeShape('theme', appframeConfigSchema.shape.theme),
    app: describeShape('app', appframeConfigSchema.shape.app),
  };
}

const CATALOG = buildCatalog();

export function listSchemaNames(): string[] {
  return Object.keys(CATALOG);
}

export function getSchemaInfo(name: string): SchemaInfo | null {
  return CATALOG[name] ?? null;
}
