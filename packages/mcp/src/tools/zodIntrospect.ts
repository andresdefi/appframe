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

// Build the catalog once at module load — Zod schemas don't change at
// runtime. Names are the agent-facing keys.
function buildCatalog(): Record<string, SchemaInfo> {
  const screenSchemaRaw =
    (appframeConfigSchema.shape.screens as { _def: { innerType: { element: unknown } } })
      ._def.innerType.element;
  const screen = unwrapZod(screenSchemaRaw).schema as { shape: Record<string, unknown> };

  return {
    screen: describeShape('screen', screenSchemaRaw),
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
