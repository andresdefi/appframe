import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn().mockImplementation((_path: string, encoding?: string) => {
    if (encoding === 'utf-8') return Promise.resolve('fake-key-content');
    return Promise.resolve(Buffer.from('fake-file-content'));
  }),
}));

vi.mock('./jwt.js', () => ({
  generateJwt: vi.fn().mockReturnValue('mock-jwt-token'),
}));

import { AppStoreConnectClient, loadAppleCredentials, resolvePrivateKey } from './client.js';

const mockFetchResponses: Array<{ status: number; body: unknown; ok: boolean }> = [];

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchResponses.length = 0;

  global.fetch = vi.fn().mockImplementation(() => {
    const response = mockFetchResponses.shift() ?? { status: 200, body: {}, ok: true };
    return Promise.resolve({
      ok: response.ok,
      status: response.status,
      json: () => Promise.resolve(response.body),
      text: () => Promise.resolve(JSON.stringify(response.body)),
    });
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('loadAppleCredentials', () => {
  it('loads credentials from env vars', () => {
    process.env['ASC_ISSUER_ID'] = 'issuer-123';
    process.env['ASC_KEY_ID'] = 'key-456';
    process.env['ASC_PRIVATE_KEY'] = 'BEGIN PRIVATE KEY...';

    const creds = loadAppleCredentials();
    expect(creds.issuerId).toBe('issuer-123');
    expect(creds.keyId).toBe('key-456');
    expect(creds.privateKey).toBe('BEGIN PRIVATE KEY...');

    delete process.env['ASC_ISSUER_ID'];
    delete process.env['ASC_KEY_ID'];
    delete process.env['ASC_PRIVATE_KEY'];
  });

  it('throws for missing issuer ID', () => {
    delete process.env['ASC_ISSUER_ID'];
    delete process.env['ASC_KEY_ID'];
    delete process.env['ASC_PRIVATE_KEY'];
    expect(() => loadAppleCredentials()).toThrow('Missing ASC_ISSUER_ID');
  });

  it('throws for missing key ID', () => {
    process.env['ASC_ISSUER_ID'] = 'test';
    delete process.env['ASC_KEY_ID'];
    delete process.env['ASC_PRIVATE_KEY'];
    expect(() => loadAppleCredentials()).toThrow('Missing ASC_KEY_ID');

    delete process.env['ASC_ISSUER_ID'];
  });

  it('throws for missing private key', () => {
    process.env['ASC_ISSUER_ID'] = 'test';
    process.env['ASC_KEY_ID'] = 'test';
    delete process.env['ASC_PRIVATE_KEY'];
    delete process.env['ASC_PRIVATE_KEY_PATH'];
    expect(() => loadAppleCredentials()).toThrow('Missing ASC_PRIVATE_KEY');

    delete process.env['ASC_ISSUER_ID'];
    delete process.env['ASC_KEY_ID'];
  });

  it('uses file path when ASC_PRIVATE_KEY_PATH is set', () => {
    process.env['ASC_ISSUER_ID'] = 'test';
    process.env['ASC_KEY_ID'] = 'test';
    delete process.env['ASC_PRIVATE_KEY'];
    process.env['ASC_PRIVATE_KEY_PATH'] = '/path/to/key.p8';

    const creds = loadAppleCredentials();
    expect(creds.privateKey).toBe('file:/path/to/key.p8');

    delete process.env['ASC_ISSUER_ID'];
    delete process.env['ASC_KEY_ID'];
    delete process.env['ASC_PRIVATE_KEY_PATH'];
  });
});

describe('resolvePrivateKey', () => {
  it('reads file when key starts with file:', async () => {
    const creds = await resolvePrivateKey({
      issuerId: 'i', keyId: 'k', privateKey: 'file:/tmp/key.p8',
    });
    expect(creds.privateKey).toBe('fake-key-content');
  });

  it('returns credentials unchanged for inline key', async () => {
    const creds = await resolvePrivateKey({
      issuerId: 'i', keyId: 'k', privateKey: 'inline-key-data',
    });
    expect(creds.privateKey).toBe('inline-key-data');
  });
});

describe('AppStoreConnectClient', () => {
  it('findVersion finds editable version', async () => {
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: [{ id: 'v1', attributes: { versionString: '1.0', appStoreState: 'PREPARE_FOR_SUBMISSION' } }] },
    });

    const client = new AppStoreConnectClient({ issuerId: 'i', keyId: 'k', privateKey: 'pk' });
    const versionId = await client.findVersion('app-123');
    expect(versionId).toBe('v1');
  });

  it('findVersion throws when no version found', async () => {
    mockFetchResponses.push({ status: 200, ok: true, body: { data: [] } });

    const client = new AppStoreConnectClient({ issuerId: 'i', keyId: 'k', privateKey: 'pk' });
    await expect(client.findVersion('app-123')).rejects.toThrow('No editable version found');
  });

  it('handles 401 retry', async () => {
    // First call: 401
    mockFetchResponses.push({ status: 401, ok: false, body: {} });
    // Retry succeeds
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: [{ id: 'v1', attributes: { versionString: '1.0', appStoreState: 'READY_FOR_SALE' } }] },
    });

    const client = new AppStoreConnectClient({ issuerId: 'i', keyId: 'k', privateKey: 'pk' });
    const versionId = await client.findVersion('app-123');
    expect(versionId).toBe('v1');
  });

  it('uploadScreenshots dry run returns paths without uploading', async () => {
    const client = new AppStoreConnectClient({ issuerId: 'i', keyId: 'k', privateKey: 'pk' });
    const result = await client.uploadScreenshots({
      appId: 'app-123',
      locale: 'en-US',
      displayType: 'APP_IPHONE_67',
      screenshotPaths: ['/tmp/a.png', '/tmp/b.png'],
      dryRun: true,
    });
    expect(result.uploaded).toEqual(['/tmp/a.png', '/tmp/b.png']);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('getLocalizationId returns locale ID', async () => {
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: [
        { id: 'loc-1', attributes: { locale: 'en-US' } },
        { id: 'loc-2', attributes: { locale: 'es-ES' } },
      ] },
    });

    const client = new AppStoreConnectClient({ issuerId: 'i', keyId: 'k', privateKey: 'pk' });
    const locId = await client.getLocalizationId('v1', 'es-ES');
    expect(locId).toBe('loc-2');
  });

  it('getLocalizationId throws for missing locale', async () => {
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: [{ id: 'loc-1', attributes: { locale: 'en-US' } }] },
    });

    const client = new AppStoreConnectClient({ issuerId: 'i', keyId: 'k', privateKey: 'pk' });
    await expect(client.getLocalizationId('v1', 'ja-JP')).rejects.toThrow('Locale "ja-JP" not found');
  });

  it('getOrCreateScreenshotSet returns existing set ID', async () => {
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: [{ id: 'set-1', type: 'appScreenshotSets', attributes: { screenshotDisplayType: 'APP_IPHONE_67' } }] },
    });

    const client = new AppStoreConnectClient({ issuerId: 'i', keyId: 'k', privateKey: 'pk' });
    const setId = await client.getOrCreateScreenshotSet('loc-1', 'APP_IPHONE_67');
    expect(setId).toBe('set-1');
  });

  it('getOrCreateScreenshotSet creates new set when none exists', async () => {
    // No existing sets
    mockFetchResponses.push({ status: 200, ok: true, body: { data: [] } });
    // Create new set
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: { id: 'new-set-1', type: 'appScreenshotSets', attributes: { screenshotDisplayType: 'APP_IPHONE_67' } } },
    });

    const client = new AppStoreConnectClient({ issuerId: 'i', keyId: 'k', privateKey: 'pk' });
    const setId = await client.getOrCreateScreenshotSet('loc-1', 'APP_IPHONE_67');
    expect(setId).toBe('new-set-1');
  });

  it('clearScreenshotSet deletes all existing screenshots', async () => {
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: [
        { id: 'ss-1', type: 'appScreenshots', attributes: { fileName: 'a.png' } },
        { id: 'ss-2', type: 'appScreenshots', attributes: { fileName: 'b.png' } },
      ] },
    });
    // Two delete calls
    mockFetchResponses.push({ status: 204, ok: true, body: {} });
    mockFetchResponses.push({ status: 204, ok: true, body: {} });

    const client = new AppStoreConnectClient({ issuerId: 'i', keyId: 'k', privateKey: 'pk' });
    const deleted = await client.clearScreenshotSet('set-1');
    expect(deleted).toBe(2);
  });

  it('uploadScreenshot reserves, uploads chunks, and commits', async () => {
    // Reserve
    mockFetchResponses.push({
      status: 200, ok: true,
      body: {
        data: {
          id: 'ss-new',
          type: 'appScreenshots',
          attributes: {
            fileName: 'test.png',
            fileSize: 100,
            uploadOperations: [{
              method: 'PUT',
              url: 'https://upload.example.com/chunk',
              length: 100,
              offset: 0,
              requestHeaders: [{ name: 'Content-Type', value: 'application/octet-stream' }],
            }],
          },
        },
      },
    });
    // Chunk upload (direct fetch, not through this.request)
    mockFetchResponses.push({ status: 200, ok: true, body: {} });
    // Commit
    mockFetchResponses.push({ status: 200, ok: true, body: {} });

    const client = new AppStoreConnectClient({ issuerId: 'i', keyId: 'k', privateKey: 'pk' });
    const ssId = await client.uploadScreenshot('set-1', '/tmp/test.png', 'test.png');
    expect(ssId).toBe('ss-new');
  });

  it('uploadScreenshots full flow: findVersion -> localize -> set -> clear -> upload', async () => {
    // findVersion
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: [{ id: 'v1', attributes: { versionString: '1.0', appStoreState: 'PREPARE_FOR_SUBMISSION' } }] },
    });
    // getLocalizationId
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: [{ id: 'loc-1', attributes: { locale: 'en-US' } }] },
    });
    // getOrCreateScreenshotSet
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: [{ id: 'set-1', type: 'appScreenshotSets', attributes: { screenshotDisplayType: 'APP_IPHONE_67' } }] },
    });
    // clearScreenshotSet
    mockFetchResponses.push({ status: 200, ok: true, body: { data: [] } });
    // uploadScreenshot: reserve
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: { id: 'ss-1', type: 'appScreenshots', attributes: { fileName: 'a.png', fileSize: 50, uploadOperations: [] } } },
    });
    // uploadScreenshot: commit
    mockFetchResponses.push({ status: 200, ok: true, body: {} });

    const client = new AppStoreConnectClient({ issuerId: 'i', keyId: 'k', privateKey: 'pk' });
    const result = await client.uploadScreenshots({
      appId: 'app-123',
      locale: 'en-US',
      displayType: 'APP_IPHONE_67',
      screenshotPaths: ['/tmp/a.png'],
    });
    expect(result.uploaded).toEqual(['/tmp/a.png']);
    expect(result.errors).toHaveLength(0);
  });

  it('uploadScreenshots records errors for individual file failures', async () => {
    // findVersion
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: [{ id: 'v1', attributes: { versionString: '1.0', appStoreState: 'PREPARE_FOR_SUBMISSION' } }] },
    });
    // getLocalizationId
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: [{ id: 'loc-1', attributes: { locale: 'en-US' } }] },
    });
    // getOrCreateScreenshotSet
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: [{ id: 'set-1', type: 'appScreenshotSets', attributes: { screenshotDisplayType: 'APP_IPHONE_67' } }] },
    });
    // clearScreenshotSet
    mockFetchResponses.push({ status: 200, ok: true, body: { data: [] } });
    // uploadScreenshot fails (non-ok)
    mockFetchResponses.push({ status: 500, ok: false, body: 'Internal Server Error' });

    const client = new AppStoreConnectClient({ issuerId: 'i', keyId: 'k', privateKey: 'pk' });
    const result = await client.uploadScreenshots({
      appId: 'app-123',
      locale: 'en-US',
      displayType: 'APP_IPHONE_67',
      screenshotPaths: ['/tmp/fail.png'],
    });
    expect(result.uploaded).toHaveLength(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('uploadScreenshots accepts explicit versionId', async () => {
    // getLocalizationId (skips findVersion)
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: [{ id: 'loc-1', attributes: { locale: 'en-US' } }] },
    });
    // getOrCreateScreenshotSet
    mockFetchResponses.push({
      status: 200, ok: true,
      body: { data: [{ id: 'set-1', type: 'appScreenshotSets', attributes: { screenshotDisplayType: 'APP_IPHONE_67' } }] },
    });
    // clearScreenshotSet
    mockFetchResponses.push({ status: 200, ok: true, body: { data: [] } });

    const client = new AppStoreConnectClient({ issuerId: 'i', keyId: 'k', privateKey: 'pk' });
    const result = await client.uploadScreenshots({
      appId: 'app-123',
      versionId: 'explicit-v1',
      locale: 'en-US',
      displayType: 'APP_IPHONE_67',
      screenshotPaths: [],
    });
    expect(result.uploaded).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });
});
