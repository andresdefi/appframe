import { beforeEach, describe, expect, it, vi } from 'vitest';

const webPreviewMocks = vi.hoisted(() => ({
  startPreviewServer: vi.fn().mockResolvedValue(undefined),
}));

const probeState = vi.hoisted(() => ({
  nextProbeError: null as NodeJS.ErrnoException | null,
}));

vi.mock('@appframe/web-preview', () => ({
  startPreviewServer: webPreviewMocks.startPreviewServer,
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
          if (probeState.nextProbeError) handlers.error?.(probeState.nextProbeError);
          else handlers.listening?.();
        });
      },
      close(callback?: () => void) {
        callback?.();
      },
    };
  }),
}));

vi.mock('@appframe/core', () => ({
  generatePanoramicScreenshots: vi.fn(),
  generateScreenshots: vi.fn(),
  loadConfig: vi.fn(),
  validateConfig: vi.fn(() => ({ success: true, config: {} })),
}));

import { openPreviewSession } from './variant-session-tools.js';

beforeEach(() => {
  vi.clearAllMocks();
  probeState.nextProbeError = null;
});

describe('openPreviewSession', () => {
  it('starts preview and returns the live localhost URL', async () => {
    const result = await openPreviewSession({
      sessionPath: '/tmp/focusflow.session.json',
      port: 4414,
    });

    expect(webPreviewMocks.startPreviewServer).toHaveBeenCalledWith({
      configPath: undefined,
      sessionPath: '/tmp/focusflow.session.json',
      port: 4414,
    });
    expect(result).toEqual({
      url: 'http://localhost:4414',
      port: 4414,
      sessionPath: '/tmp/focusflow.session.json',
      configPath: null,
    });
  });

  it('rejects port conflicts clearly', async () => {
    probeState.nextProbeError = Object.assign(new Error('address in use'), { code: 'EADDRINUSE' });

    await expect(openPreviewSession({
      sessionPath: '/tmp/focusflow.session.json',
      port: 4400,
    })).rejects.toThrow('Port 4400 is already in use.');

    expect(webPreviewMocks.startPreviewServer).not.toHaveBeenCalled();
  });

  it('requires a session or config path', async () => {
    await expect(openPreviewSession({ port: 4400 })).rejects.toThrow(
      'Preview launch requires either a sessionPath or a configPath.',
    );
  });
});
