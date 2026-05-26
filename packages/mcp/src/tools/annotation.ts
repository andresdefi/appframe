import { randomUUID } from 'node:crypto';
import type { ToolDefinition } from './types.js';
import {
  isRecord,
  jsonContent,
  normalizeColor,
  readScreen,
  requireIndex,
  requireRecord,
  requireSlug,
  requireString,
} from './helpers.js';

const ANNOTATION_FIELD_SCHEMA = {
  x: { type: 'number', minimum: 0, maximum: 100 },
  y: { type: 'number', minimum: 0, maximum: 100 },
  w: { type: 'number', minimum: 1, maximum: 100 },
  h: { type: 'number', minimum: 1, maximum: 100 },
  shape: { enum: ['rectangle', 'circle', 'rounded-rect'] },
  strokeColor: { type: 'string' },
  strokeWidth: { type: 'number', minimum: 1, maximum: 20 },
  fillColor: { type: 'string' },
  borderRadius: { type: 'number', minimum: 0, maximum: 200 },
};

function normalizeAnnotationColors(patch: Record<string, unknown>): void {
  if (typeof patch.strokeColor === 'string' && patch.strokeColor.length > 0) {
    patch.strokeColor = normalizeColor(patch.strokeColor);
  }
  if (typeof patch.fillColor === 'string' && patch.fillColor.length > 0) {
    patch.fillColor = normalizeColor(patch.fillColor);
  }
}

export const annotationTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'add_annotation',
      description:
        'Add a simple shape annotation (highlight rectangle or circle) ' +
        'to a screen. Coords/sizes are in % of the device screen (0-100). ' +
        '`shape` defaults to "rectangle"; "circle" is also valid. ' +
        '`strokeColor` defaults to red (#FF3B30). `fillColor` is optional ' +
        "(filled vs outlined). Returns the new annotation including the " +
        'generated `id`.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'x', 'y', 'w', 'h'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          ...ANNOTATION_FIELD_SCHEMA,
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'add_annotation');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { slug: _s, index: _i, ...fields } = a;
      void _s; void _i;
      normalizeAnnotationColors(fields);
      const screen = await readScreen(client, slug, index);
      const id = `annot-${randomUUID().slice(0, 8)}`;
      const next = { id, ...fields };
      const existing = Array.isArray(screen.annotations) ? screen.annotations : [];
      const result = await client.patchScreen(slug, index, {
        annotations: [...existing, next],
      });
      return jsonContent({ success: true, savedAt: result.savedAt, id, annotation: next });
    },
  },
  {
    descriptor: {
      name: 'update_annotation',
      description: 'Update fields on an existing annotation by id. Shallow merge.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'annotationId'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          annotationId: { type: 'string', minLength: 1 },
          ...ANNOTATION_FIELD_SCHEMA,
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'update_annotation');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const annotationId = requireString(a, 'annotationId');
      const { slug: _s, index: _i, annotationId: _a, ...patch } = a;
      void _s; void _i; void _a;
      normalizeAnnotationColors(patch);
      const screen = await readScreen(client, slug, index);
      const existing = Array.isArray(screen.annotations) ? screen.annotations : [];
      let foundIdx = -1;
      for (let i = 0; i < existing.length; i++) {
        const an = existing[i];
        if (isRecord(an) && an.id === annotationId) {
          foundIdx = i;
          break;
        }
      }
      if (foundIdx < 0) {
        throw new Error(`annotation id "${annotationId}" not found on screen ${index}`);
      }
      const merged = { ...(existing[foundIdx] as Record<string, unknown>), ...patch };
      const nextAnnotations = existing.slice();
      nextAnnotations[foundIdx] = merged;
      await client.patchScreen(slug, index, { annotations: nextAnnotations });
      return jsonContent({ success: true, annotation: merged });
    },
  },
  {
    descriptor: {
      name: 'remove_annotation',
      description: 'Remove an annotation from a screen by its id.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'annotationId'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          annotationId: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'remove_annotation');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const annotationId = requireString(a, 'annotationId');
      const screen = await readScreen(client, slug, index);
      const existing = Array.isArray(screen.annotations) ? screen.annotations : [];
      const filtered = existing.filter((an) => isRecord(an) && an.id !== annotationId);
      const removed = existing.length - filtered.length;
      if (removed === 0) {
        return jsonContent({ success: false, reason: 'id not found', annotationId });
      }
      await client.patchScreen(slug, index, { annotations: filtered });
      return jsonContent({ success: true, removed, remaining: filtered.length });
    },
  },
];
