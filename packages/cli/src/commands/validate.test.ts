import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { stringify } from 'yaml';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';

vi.mock('chalk', () => ({
  default: {
    red: (s: string) => s,
    green: (s: string) => s,
    yellow: (s: string) => s,
    dim: (s: string) => s,
  },
}));

import { validateCommand } from './validate.js';

let tempDir: string;
let consoleSpy: ReturnType<typeof vi.spyOn>;
let exitSpy: ReturnType<typeof vi.spyOn>;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), 'validate-test-'));
  consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => { throw new Error('process.exit'); }) as never);
});

afterEach(async () => {
  consoleSpy.mockRestore();
  exitSpy.mockRestore();
  await rm(tempDir, { recursive: true, force: true });
});

describe('validate command', () => {
  it('succeeds on valid config', async () => {
    const config = {
      app: { name: 'App', description: 'D', platforms: ['ios'] },
      theme: { style: 'minimal', colors: { primary: '#FFF', secondary: '#000', background: '#FFF', text: '#000' } },
      screens: [{ screenshot: 'test.png', headline: 'Hi' }],
      output: { platforms: ['ios'] },
    };
    const path = join(tempDir, 'appframe.yml');
    await writeFile(path, stringify(config), 'utf-8');

    await validateCommand.parseAsync(['node', 'test', '-c', path]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Config is valid'));
  });

  it('exits with error on missing file', async () => {
    await expect(
      validateCommand.parseAsync(['node', 'test', '-c', '/nonexistent/file.yml']),
    ).rejects.toThrow('process.exit');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('exits with error on invalid config', async () => {
    const path = join(tempDir, 'bad.yml');
    await writeFile(path, stringify({ app: { name: '' } }), 'utf-8');

    await expect(
      validateCommand.parseAsync(['node', 'test', '-c', path]),
    ).rejects.toThrow('process.exit');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
