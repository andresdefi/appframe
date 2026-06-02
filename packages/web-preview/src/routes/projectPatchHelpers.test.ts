import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Response } from 'express';
import type { AppframeConfig } from '@appframe/core';

// Replace the disk-write with a stub so writeAndBroadcast exercises the
// in-memory config refresh without touching the filesystem. Everything
// else (errors, history) is imported for real.
vi.mock('../projectStorage.js', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    writeProject: vi.fn(async () => ({ savedAt: '2026-01-01T00:00:00.000Z' })),
  };
});

import { writeAndBroadcast } from './projectPatchHelpers.js';
import type { RouteContext } from './context.js';

function baseConfig(): AppframeConfig {
  return {
    mode: 'individual',
    app: { name: 'T', description: 'T', platforms: ['ios'], features: [] },
    theme: {
      colors: {
        primary: '#000000',
        secondary: '#666666',
        background: '#FFFFFF',
        text: '#000000',
        subtitle: '#666666',
      },
      font: 'inter',
      fontWeight: 600,
    },
    frames: { style: 'flat' },
    screens: [
      {
        screenshot: 'screenshots/default-1.png',
        headline: 'Default EN',
        subtitle: '',
        layout: 'center',
        composition: 'single',
        annotations: [],
      },
    ],
    output: { platforms: ['ios'], directory: './output' },
  } as unknown as AppframeConfig;
}

// Editor-state envelope `data` carrying an es-ES locale whose single
// screen overrides BOTH the headline and the screenshot relative to the
// default — the exact shape an MCP patch_locale_screen / set_screenshot
// write produces on disk.
function envelopeData() {
  return {
    mode: 'individual',
    screens: [{ headline: 'Default EN', subtitle: '', layout: 'center', composition: 'single' }],
    sessionLocales: { 'es-ES': { label: 'Spanish' } },
    localeScreens: {
      'es-ES': [
        {
          headline: 'ES override',
          subtitle: '',
          layout: 'center',
          composition: 'single',
          screenshotName: 'es-override.png',
        },
      ],
    },
  };
}

function fakeRes(): Response {
  return { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

function makeCtx(activeSlug: string | null): {
  ctx: RouteContext;
  setConfig: ReturnType<typeof vi.fn>;
  current: { config: AppframeConfig };
} {
  const current = { config: baseConfig() };
  const setConfig = vi.fn((next: AppframeConfig) => {
    current.config = next;
  });
  const ctx = {
    configDir: '/tmp',
    resolvedConfigPath: '/tmp/appframe.json',
    getConfig: () => current.config,
    setConfig,
    templateEngine: {} as RouteContext['templateEngine'],
    screenshotStorage: {} as RouteContext['screenshotStorage'],
    projectStorage: {} as RouteContext['projectStorage'],
    broadcastEvent: vi.fn(),
    getActiveProjectSlug: () => activeSlug,
    setActiveProjectSlug: vi.fn(),
  } as unknown as RouteContext;
  return { ctx, setConfig, current };
}

describe('writeAndBroadcast — in-memory config refresh', () => {
  beforeEach(() => vi.clearAllMocks());

  it('refreshes config.locales for the ACTIVE project so a locale render is not stale', async () => {
    const { ctx, setConfig, current } = makeCtx('my-project');

    const result = await writeAndBroadcast(ctx, 'my-project', envelopeData(), fakeRes(), undefined, 'test');

    expect(result).toEqual({ savedAt: '2026-01-01T00:00:00.000Z' });
    expect(setConfig).toHaveBeenCalledTimes(1);
    const es = current.config.locales?.['es-ES'];
    // Both the locale text AND the per-locale screenshot must land in the
    // refreshed config — render/export read text from here and fall back
    // to it for the screenshot path.
    expect(es?.screens?.[0]?.headline).toBe('ES override');
    expect(es?.screens?.[0]?.screenshot).toContain('es-override.png');
  });

  it('does NOT refresh config when the write targets a non-active project', async () => {
    const { ctx, setConfig } = makeCtx('other-project');

    await writeAndBroadcast(ctx, 'my-project', envelopeData(), fakeRes(), undefined, 'test');

    expect(setConfig).not.toHaveBeenCalled();
  });

  it('still broadcasts (and refreshes) on a no-op unchanged write', async () => {
    const { ctx, setConfig, current } = makeCtx('my-project');
    const data = envelopeData();

    // previousData === nextData → the unchanged fast-path.
    const result = await writeAndBroadcast(ctx, 'my-project', data, fakeRes(), data, 'test');

    expect(result).toEqual({ savedAt: '' });
    expect(ctx.broadcastEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'project-changed', unchanged: true }),
    );
    expect(setConfig).toHaveBeenCalledTimes(1);
    expect(current.config.locales?.['es-ES']?.screens?.[0]?.headline).toBe('ES override');
  });
});
