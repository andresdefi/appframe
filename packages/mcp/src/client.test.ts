// Client-level tests. Cover the bits that don't need a real server:
// retry behaviour, error shape, baseUrl handling.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AppframeClient, AppframeClientError } from './client.js';

describe('AppframeClient.baseUrl', () => {
  it('strips trailing slashes', () => {
    const c = new AppframeClient({ baseUrl: 'http://localhost:4400/' });
    expect(c.baseUrl).toBe('http://localhost:4400');
  });
  it('falls back to APPFRAME_PREVIEW_URL', () => {
    const old = process.env.APPFRAME_PREVIEW_URL;
    process.env.APPFRAME_PREVIEW_URL = 'http://example.test:9999';
    const c = new AppframeClient();
    expect(c.baseUrl).toBe('http://example.test:9999');
    process.env.APPFRAME_PREVIEW_URL = old;
  });
});

describe('AppframeClient retry-once', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('retries once on network error and succeeds', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('connection refused'))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      );
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;
    const c = new AppframeClient({ baseUrl: 'http://localhost:4400' });
    const result = await c.health();
    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries once on 5xx and succeeds', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('upstream error', { status: 503 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      );
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;
    const c = new AppframeClient({ baseUrl: 'http://localhost:4400' });
    const result = await c.health();
    expect(result).toEqual({ status: 'ok' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does NOT retry on 4xx', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('bad request', { status: 400 }));
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;
    const c = new AppframeClient({ baseUrl: 'http://localhost:4400' });
    await expect(c.health()).rejects.toBeInstanceOf(AppframeClientError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('gives up after retry exhaustion on persistent network error', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValue(new TypeError('connection refused'));
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;
    const c = new AppframeClient({ baseUrl: 'http://localhost:4400' });
    await expect(c.health()).rejects.toBeInstanceOf(AppframeClientError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
