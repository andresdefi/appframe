import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { validateConfigOrThrow } from './validator.js';
import type { AppframeConfig } from './schema.js';

export async function loadConfig(configPath: string): Promise<AppframeConfig> {
  let content: string;
  try {
    content = await readFile(configPath, 'utf-8');
  } catch {
    throw new Error(`Config file not found: ${configPath}`);
  }

  let raw: unknown;
  try {
    raw = parse(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    throw new Error(`Failed to parse YAML config: ${message}`);
  }

  return validateConfigOrThrow(raw);
}
