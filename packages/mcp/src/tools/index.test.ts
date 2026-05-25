import { describe, it, expect } from 'vitest';
import { ALL_TOOLS } from './index.js';

describe('ALL_TOOLS catalog integrity', () => {
  it('has at least 50 tools (no silent regressions on category drops)', () => {
    expect(ALL_TOOLS.length).toBeGreaterThanOrEqual(50);
  });

  it('every tool has a descriptor with name, description, inputSchema', () => {
    for (const t of ALL_TOOLS) {
      expect(t.descriptor).toBeDefined();
      expect(typeof t.descriptor.name).toBe('string');
      expect(t.descriptor.name.length).toBeGreaterThan(0);
      expect(typeof t.descriptor.description).toBe('string');
      expect(t.descriptor.description!.length).toBeGreaterThan(20);
      expect(t.descriptor.inputSchema).toBeDefined();
      expect(t.descriptor.inputSchema.type).toBe('object');
    }
  });

  it('every tool has a handler function', () => {
    for (const t of ALL_TOOLS) {
      expect(typeof t.handler).toBe('function');
    }
  });

  it('tool names are unique', () => {
    const names = ALL_TOOLS.map((t) => t.descriptor.name);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    expect(dupes).toEqual([]);
  });

  it('tool names follow snake_case convention', () => {
    for (const t of ALL_TOOLS) {
      expect(t.descriptor.name).toMatch(/^[a-z][a-z0-9_]*$/);
    }
  });

  it('inputSchema declares `additionalProperties: false` to reject unknown args', () => {
    for (const t of ALL_TOOLS) {
      const schema = t.descriptor.inputSchema as { additionalProperties?: boolean };
      expect(schema.additionalProperties).toBe(false);
    }
  });

  it('every write tool requires `slug`', () => {
    // Tools that don't operate on a project: project-creation + reads
    // that pick the project implicitly + catalog reads.
    const slugFree = new Set([
      'get_active_project',
      'get_project',
      'list_projects',
      'list_frames',
      'list_fonts',
      'list_koubou_devices',
      'list_compositions',
      'list_sizes',
      'list_background_presets',
      'list_locales',
      'list_variants', // takes slug, see schema
      'create_project',
      'rename_project', // takes from/to instead of slug
      'duplicate_project',
      'get_help',
      'inspect_schema',
      'batch',
    ]);
    for (const t of ALL_TOOLS) {
      if (slugFree.has(t.descriptor.name)) continue;
      const schema = t.descriptor.inputSchema as {
        required?: string[];
        properties?: Record<string, unknown>;
      };
      expect(
        schema.required?.includes('slug') || !!schema.properties?.slug,
        `tool ${t.descriptor.name} should reference slug`,
      ).toBe(true);
    }
  });

  it('destructive tools require confirm: true in schema', () => {
    const destructive = [
      'delete_project',
      'delete_variant',
      'remove_screen',
      'delete_screenshot',
      'cleanup_unused_screenshots',
      'undo_last_write',
    ];
    for (const name of destructive) {
      const t = ALL_TOOLS.find((x) => x.descriptor.name === name);
      expect(t, `tool ${name} should exist`).toBeDefined();
      const schema = t!.descriptor.inputSchema as {
        required?: string[];
        properties?: Record<string, unknown>;
      };
      expect(schema.required, `${name} required`).toContain('confirm');
      expect(schema.properties?.confirm).toBeDefined();
    }
  });
});
