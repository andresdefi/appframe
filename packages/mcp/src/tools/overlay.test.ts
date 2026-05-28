import { describe, it, expect } from 'vitest';
import { overlayTools } from './overlay.js';
import type { AppframeClient } from '../client.js';

// Minimal client stub. The overlay handlers only touch three methods —
// fetchLucideIconSvg (added for this fix), readScreen, and patchScreen
// — so the stub doesn't need to satisfy the full AppframeClient shape.
function makeClientStub(opts: {
  iconSvg?: string;
  existingOverlays?: unknown[];
} = {}): {
  client: AppframeClient;
  patchedPayload: () => Record<string, unknown> | null;
  iconFetchCalls: () => string[];
} {
  let captured: Record<string, unknown> | null = null;
  const iconCalls: string[] = [];
  const client = {
    async fetchLucideIconSvg(name: string) {
      iconCalls.push(name);
      return (
        opts.iconSvg ??
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 0L24 24H0Z"/></svg>`
      );
    },
    async readScreen(_slug: string, _index: number) {
      return {
        schemaVersion: 1,
        savedAt: '2026-05-28T00:00:00.000Z',
        index: 0,
        screen: { overlays: opts.existingOverlays ?? [] },
      };
    },
    async patchScreen(_slug: string, _index: number, patch: Record<string, unknown>) {
      captured = patch;
      return { success: true, savedAt: '2026-05-28T00:00:01.000Z' };
    },
  } as unknown as AppframeClient;
  return { client, patchedPayload: () => captured, iconFetchCalls: () => iconCalls };
}

const addOverlay = overlayTools.find((t) => t.descriptor.name === 'add_overlay')!;
const updateOverlay = overlayTools.find((t) => t.descriptor.name === 'update_overlay')!;

function lastOverlay(payload: Record<string, unknown> | null): Record<string, unknown> {
  const overlays = payload?.overlays;
  if (!Array.isArray(overlays) || overlays.length === 0) {
    throw new Error('expected patchScreen payload to include a non-empty overlays array');
  }
  const ov = overlays[overlays.length - 1];
  if (!ov || typeof ov !== 'object') throw new Error('overlay not an object');
  return ov as Record<string, unknown>;
}

describe('add_overlay icon resolution', () => {
  it('bakes lucide SVG + shapeColor into imageDataUrl', async () => {
    // Regression: the MCP previously saved icon overlays with iconRef
    // but no imageDataUrl, so the renderer (which reads imageDataUrl,
    // not iconRef) had nothing to draw.
    const { client, patchedPayload, iconFetchCalls } = makeClientStub();
    await addOverlay.handler(
      {
        slug: 'demo',
        index: 0,
        type: 'icon',
        iconRef: 'lucide:sparkle',
        shapeColor: '#E63946',
        x: 50,
        y: 50,
        size: 100,
      },
      { client },
    );
    expect(iconFetchCalls()).toEqual(['sparkle']);
    const overlay = lastOverlay(patchedPayload());
    expect(overlay.iconRef).toBe('lucide:sparkle');
    expect(typeof overlay.imageDataUrl).toBe('string');
    const dataUrl = overlay.imageDataUrl as string;
    expect(dataUrl.startsWith('data:image/svg+xml;utf8,')).toBe(true);
    const decoded = decodeURIComponent(dataUrl.replace('data:image/svg+xml;utf8,', ''));
    // The chosen colour must have replaced lucide's `currentColor`
    // sentinel so the icon renders in the agent-requested colour
    // inside an <img> (which doesn't resolve currentColor). The
    // overlay tool runs `normalizeOverlayColors` first, which converts
    // the input hex to the display-p3 storage form, so the baked
    // colour is the normalized value (matching the UI's ColorPicker
    // output).
    expect(decoded).not.toContain('currentColor');
    expect(overlay.shapeColor).toEqual(expect.stringMatching(/^color\(display-p3 /));
    expect(decoded).toContain(overlay.shapeColor as string);
  });

  it('respects an explicit imageDataUrl override (no icon fetch)', async () => {
    const { client, patchedPayload, iconFetchCalls } = makeClientStub();
    const customDataUrl = 'data:image/svg+xml;utf8,%3Csvg%2F%3E';
    await addOverlay.handler(
      {
        slug: 'demo',
        index: 0,
        type: 'icon',
        iconRef: 'lucide:sparkle',
        imageDataUrl: customDataUrl,
        x: 0,
        y: 0,
      },
      { client },
    );
    expect(iconFetchCalls()).toEqual([]);
    const overlay = lastOverlay(patchedPayload());
    expect(overlay.imageDataUrl).toBe(customDataUrl);
  });

  it('throws a helpful error for non-lucide iconRef sources', async () => {
    const { client } = makeClientStub();
    await expect(
      addOverlay.handler(
        {
          slug: 'demo',
          index: 0,
          type: 'icon',
          iconRef: 'feather:arrow-up',
          x: 0,
          y: 0,
        },
        { client },
      ),
    ).rejects.toThrow(/lucide/);
  });

  it('leaves non-icon overlays untouched', async () => {
    // Shape overlays carry their colour in shapeColor and use
    // shapeType for rendering — no imageDataUrl needed.
    const { client, patchedPayload, iconFetchCalls } = makeClientStub();
    await addOverlay.handler(
      {
        slug: 'demo',
        index: 0,
        type: 'shape',
        shapeType: 'circle',
        shapeColor: '#FF0000',
        x: 0,
        y: 0,
      },
      { client },
    );
    expect(iconFetchCalls()).toEqual([]);
    const overlay = lastOverlay(patchedPayload());
    expect(overlay.imageDataUrl).toBeUndefined();
    expect(overlay.shapeColor).toBeDefined();
  });
});

describe('update_overlay icon resolution', () => {
  it('re-bakes the SVG when shapeColor changes on an existing icon overlay', async () => {
    const existing = [
      {
        id: 'overlay-abc',
        type: 'icon',
        iconRef: 'lucide:sparkle',
        shapeColor: '#000000',
        imageDataUrl: 'data:image/svg+xml;utf8,%3Csvg%20stroke%3D%22%23000000%22%2F%3E',
        x: 10,
        y: 10,
      },
    ];
    const { client, patchedPayload } = makeClientStub({ existingOverlays: existing });
    await updateOverlay.handler(
      {
        slug: 'demo',
        index: 0,
        overlayId: 'overlay-abc',
        shapeColor: '#00FF00',
      },
      { client },
    );
    const overlay = lastOverlay(patchedPayload());
    expect(overlay.id).toBe('overlay-abc');
    // normalizeOverlayColors converts the input hex to display-p3
    // storage form before the icon is re-baked, so both the saved
    // shapeColor and the value inside the SVG should match.
    expect(overlay.shapeColor).toEqual(expect.stringMatching(/^color\(display-p3 /));
    const decoded = decodeURIComponent(
      (overlay.imageDataUrl as string).replace('data:image/svg+xml;utf8,', ''),
    );
    expect(decoded).toContain(overlay.shapeColor as string);
  });

  it('does not refetch the SVG when the patch only moves the overlay', async () => {
    const baked =
      'data:image/svg+xml;utf8,' +
      encodeURIComponent('<svg stroke="#123456"/>');
    const existing = [
      {
        id: 'overlay-abc',
        type: 'icon',
        iconRef: 'lucide:sparkle',
        shapeColor: '#123456',
        imageDataUrl: baked,
      },
    ];
    const { client, patchedPayload, iconFetchCalls } = makeClientStub({
      existingOverlays: existing,
    });
    await updateOverlay.handler(
      { slug: 'demo', index: 0, overlayId: 'overlay-abc', x: 80, y: 80 },
      { client },
    );
    expect(iconFetchCalls()).toEqual([]);
    const overlay = lastOverlay(patchedPayload());
    // Existing baked data URL preserved verbatim.
    expect(overlay.imageDataUrl).toBe(baked);
  });
});
