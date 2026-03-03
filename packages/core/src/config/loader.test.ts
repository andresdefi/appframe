import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { stringify } from 'yaml';
import { loadConfig } from './loader.js';
import { createTempDir, cleanupTempDir } from '../test-utils.js';

let tempDir: string;

beforeEach(async () => {
  tempDir = await createTempDir('loader-test-');
});

afterEach(async () => {
  await cleanupTempDir(tempDir);
});

describe('loadConfig', () => {
  it('reads and validates a valid YAML config', async () => {
    const configData = {
      app: { name: 'Test', description: 'D', platforms: ['ios'] },
      theme: { style: 'minimal', colors: { primary: '#FFF', secondary: '#000', background: '#FFF', text: '#000' } },
      screens: [{ screenshot: 'test.png', headline: 'Hello' }],
      output: { platforms: ['ios'] },
    };
    const path = join(tempDir, 'appframe.yml');
    await writeFile(path, stringify(configData), 'utf-8');

    const config = await loadConfig(path);
    expect(config.app.name).toBe('Test');
    expect(config.theme.font).toBe('inter'); // default filled
  });

  it('throws for missing file', async () => {
    await expect(loadConfig('/nonexistent/path.yml')).rejects.toThrow('Config file not found');
  });

  it('throws for malformed YAML', async () => {
    const path = join(tempDir, 'bad.yml');
    await writeFile(path, ':\n  - bad:\n  yaml: [', 'utf-8');

    await expect(loadConfig(path)).rejects.toThrow('Failed to parse YAML');
  });

  it('throws for invalid config structure', async () => {
    const path = join(tempDir, 'invalid.yml');
    await writeFile(path, stringify({ app: {} }), 'utf-8');

    await expect(loadConfig(path)).rejects.toThrow('Invalid appframe config');
  });

  it('fills Zod defaults', async () => {
    const configData = {
      app: { name: 'Test', description: 'D', platforms: ['ios'] },
      theme: { style: 'bold', colors: { primary: '#FFF', secondary: '#000', background: '#FFF', text: '#000' } },
      screens: [{ screenshot: 'test.png', headline: 'Hello' }],
      output: { platforms: ['ios'] },
    };
    const path = join(tempDir, 'defaults.yml');
    await writeFile(path, stringify(configData), 'utf-8');

    const config = await loadConfig(path);
    expect(config.frames.style).toBe('flat');
    expect(config.output.directory).toBe('./output');
    expect(config.screens[0]!.layout).toBe('center');
  });
});
