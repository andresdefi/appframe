import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('./auth.js', () => ({
  loadServiceAccount: vi.fn().mockResolvedValue({
    client_email: 'test@test.iam.gserviceaccount.com',
    private_key: 'fake-key',
    token_uri: 'https://oauth2.googleapis.com/token',
  }),
  getAccessToken: vi.fn().mockResolvedValue('mock-access-token'),
}));

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn().mockResolvedValue(Buffer.from('PNG')),
}));

import { GooglePlayClient, loadGoogleCredentials } from './client.js';

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

describe('loadGoogleCredentials', () => {
  it('loads credentials from env vars', () => {
    process.env['GOOGLE_PLAY_SERVICE_ACCOUNT'] = '/path/to/sa.json';
    process.env['GOOGLE_PLAY_PACKAGE_NAME'] = 'com.test.app';

    const creds = loadGoogleCredentials();
    expect(creds.serviceAccountPath).toBe('/path/to/sa.json');
    expect(creds.packageName).toBe('com.test.app');

    delete process.env['GOOGLE_PLAY_SERVICE_ACCOUNT'];
    delete process.env['GOOGLE_PLAY_PACKAGE_NAME'];
  });

  it('throws for missing service account', () => {
    delete process.env['GOOGLE_PLAY_SERVICE_ACCOUNT'];
    delete process.env['GOOGLE_PLAY_PACKAGE_NAME'];
    expect(() => loadGoogleCredentials()).toThrow('Missing GOOGLE_PLAY_SERVICE_ACCOUNT');
  });

  it('throws for missing package name', () => {
    process.env['GOOGLE_PLAY_SERVICE_ACCOUNT'] = '/path';
    delete process.env['GOOGLE_PLAY_PACKAGE_NAME'];
    expect(() => loadGoogleCredentials()).toThrow('Missing GOOGLE_PLAY_PACKAGE_NAME');
    delete process.env['GOOGLE_PLAY_SERVICE_ACCOUNT'];
  });
});

describe('GooglePlayClient', () => {
  it('createEdit returns edit ID', async () => {
    mockFetchResponses.push({ status: 200, ok: true, body: { id: 'edit-123' } });

    const client = new GooglePlayClient('/path/to/sa.json');
    const editId = await client.createEdit('com.test.app');
    expect(editId).toBe('edit-123');
  });

  it('commitEdit calls commit endpoint', async () => {
    mockFetchResponses.push({ status: 200, ok: true, body: {} });

    const client = new GooglePlayClient('/path/to/sa.json');
    await client.commitEdit('com.test.app', 'edit-123');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('edit-123:commit'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('uploadScreenshots dry run returns paths', async () => {
    const client = new GooglePlayClient('/path/to/sa.json');
    const result = await client.uploadScreenshots({
      packageName: 'com.test.app',
      locale: 'en-US',
      imageType: 'phoneScreenshots',
      screenshotPaths: ['/tmp/a.png'],
      dryRun: true,
    });
    expect(result.uploaded).toEqual(['/tmp/a.png']);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('uploadScreenshots full flow', async () => {
    // createEdit
    mockFetchResponses.push({ status: 200, ok: true, body: { id: 'edit-1' } });
    // clearImages
    mockFetchResponses.push({ status: 204, ok: true, body: {} });
    // uploadImage
    mockFetchResponses.push({ status: 200, ok: true, body: {} });
    // commitEdit
    mockFetchResponses.push({ status: 200, ok: true, body: {} });

    const client = new GooglePlayClient('/path/to/sa.json');
    const result = await client.uploadScreenshots({
      packageName: 'com.test.app',
      locale: 'en-US',
      imageType: 'phoneScreenshots',
      screenshotPaths: ['/tmp/a.png'],
    });
    expect(result.uploaded).toEqual(['/tmp/a.png']);
    expect(result.errors).toHaveLength(0);
  });

  it('cleans up edit on failure', async () => {
    // createEdit
    mockFetchResponses.push({ status: 200, ok: true, body: { id: 'edit-fail' } });
    // clearImages fails
    mockFetchResponses.push({ status: 500, ok: false, body: 'Internal error' });
    // delete edit (cleanup)
    mockFetchResponses.push({ status: 200, ok: true, body: {} });

    const client = new GooglePlayClient('/path/to/sa.json');
    await expect(client.uploadScreenshots({
      packageName: 'com.test.app',
      locale: 'en-US',
      imageType: 'phoneScreenshots',
      screenshotPaths: ['/tmp/a.png'],
    })).rejects.toThrow();
  });
});
