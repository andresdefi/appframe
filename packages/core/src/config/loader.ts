import { readFile, writeFile } from 'node:fs/promises';
import { parse, stringify } from 'yaml';
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

export async function saveConfig(configPath: string, config: AppframeConfig): Promise<void> {
  const content = stringify(config, { indent: 2, indentSeq: true });
  await writeFile(configPath, content, 'utf-8');
}
