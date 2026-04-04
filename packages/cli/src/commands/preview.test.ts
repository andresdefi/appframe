import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const startPreviewServer = vi.fn().mockResolvedValue(undefined);
const registerPreviewSessionReviewHandlers = vi.fn();

let nextProbeError: NodeJS.ErrnoException | null = null;

vi.mock('chalk', () => ({
  default: {
    blue: (s: string) => s,
    green: (s: string) => s,
    dim: (s: string) => s,
    red: (s: string) => s,
  },
}));

vi.mock('@appframe/web-preview', () => ({
  startPreviewServer,
}));

vi.mock('@appframe/mcp-server/preview-hooks', () => ({
  registerPreviewSessionReviewHandlers,
}));

vi.mock('node:net', () => ({
  createServer: vi.fn(() => {
    const handlers: {
      error?: (error: NodeJS.ErrnoException) => void;
      listening?: () => void;
    } = {};

    return {
      once(event: 'error' | 'listening', handler: ((error: NodeJS.ErrnoException) => void) | (() => void)) {
        if (event === 'error') handlers.error = handler as (error: NodeJS.ErrnoException) => void;
        if (event === 'listening') handlers.listening = handler as () => void;
        return this;
      },
      listen() {
        queueMicrotask(() => {
          if (nextProbeError) handlers.error?.(nextProbeError);
          else handlers.listening?.();
        });
      },
      close(callback?: () => void) {
        callback?.();
      },
    };
  }),
}));

import { previewCommand } from './preview.js';

let consoleSpy: ReturnType<typeof vi.spyOn>;
let exitSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.clearAllMocks();
  nextProbeError = null;
  consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
    throw new Error('process.exit');
  }) as never);
});

afterEach(() => {
  consoleSpy.mockRestore();
  exitSpy.mockRestore();
});

describe('preview command', () => {
  it('reports port conflicts distinctly', async () => {
    nextProbeError = Object.assign(new Error('address in use'), { code: 'EADDRINUSE' });

    await expect(
      previewCommand.parseAsync(['node', 'test', '--port', '4400']),
    ).rejects.toThrow('process.exit');

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Port 4400 is already in use.'));
    expect(startPreviewServer).not.toHaveBeenCalled();
  });

  it('reports non-conflict bind failures with the underlying reason', async () => {
    nextProbeError = Object.assign(new Error('operation not permitted'), { code: 'EPERM' });

    await expect(
      previewCommand.parseAsync(['node', 'test', '--port', '4400']),
    ).rejects.toThrow('process.exit');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to bind preview server on port 4400: operation not permitted'),
    );
    expect(startPreviewServer).not.toHaveBeenCalled();
  });

  it('starts the preview server when the probe succeeds', async () => {
    await previewCommand.parseAsync(['node', 'test', '--port', '4400']);

    expect(registerPreviewSessionReviewHandlers).toHaveBeenCalledTimes(1);
    expect(startPreviewServer).toHaveBeenCalledWith({
      configPath: undefined,
      sessionPath: undefined,
      port: 4400,
    });
    expect(exitSpy).not.toHaveBeenCalled();
  });
});
