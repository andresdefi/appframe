import { readFile } from 'node:fs/promises';
import type { AppframeConfig } from './schema.js';
import { validateConfig } from './validator.js';

export async function loadConfig(configPath: string): Promise<AppframeConfig> {
  const content = await readFile(configPath, 'utf-8');

  // Dynamic import for yaml parser — will be added as dependency
  const { parse } = await import('yaml');
  const raw: unknown = parse(content);

  return validateConfig(raw);
}
