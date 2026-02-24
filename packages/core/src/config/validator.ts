import type { AppframeConfig } from './schema.js';

export function validateConfig(raw: unknown): AppframeConfig {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Config must be a YAML object');
  }

  const config = raw as Record<string, unknown>;

  if (!config['app'] || typeof config['app'] !== 'object') {
    throw new Error('Config must have an "app" section');
  }

  if (!config['theme'] || typeof config['theme'] !== 'object') {
    throw new Error('Config must have a "theme" section');
  }

  if (!config['screens'] || !Array.isArray(config['screens'])) {
    throw new Error('Config must have a "screens" array');
  }

  if (!config['output'] || typeof config['output'] !== 'object') {
    throw new Error('Config must have an "output" section');
  }

  // TODO: Deep validation with JSON Schema (Phase 2)
  return raw as AppframeConfig;
}
