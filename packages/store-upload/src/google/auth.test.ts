import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateKeyPairSync } from 'node:crypto';

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
}));

import { loadServiceAccount, getAccessToken } from './auth.js';
import { readFile } from 'node:fs/promises';

const mockReadFile = vi.mocked(readFile);

// Generate a real RSA key pair for signing
const { privateKey: testPrivateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
});

const validServiceAccount = {
  client_email: 'test@project.iam.gserviceaccount.com',
  private_key: testPrivateKey,
  token_uri: 'https://oauth2.googleapis.com/token',
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('loadServiceAccount', () => {
  it('parses valid service account JSON', async () => {
    mockReadFile.mockResolvedValue(JSON.stringify(validServiceAccount) as unknown as Buffer);
    const sa = await loadServiceAccount('/path/to/key.json');
    expect(sa.client_email).toBe('test@project.iam.gserviceaccount.com');
    expect(sa.private_key).toBeTruthy();
    expect(sa.token_uri).toBeTruthy();
  });

  it('rejects invalid JSON (missing fields)', async () => {
    mockReadFile.mockResolvedValue(JSON.stringify({ client_email: 'test' }) as unknown as Buffer);
    await expect(loadServiceAccount('/path/to/bad.json')).rejects.toThrow('Invalid service account JSON');
  });
});

describe('getAccessToken', () => {
  it('generates JWT and exchanges for token', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ access_token: 'ya29.test-token', expires_in: 3600, token_type: 'Bearer' }),
    });

    const token = await getAccessToken(validServiceAccount);
    expect(token).toBe('ya29.test-token');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://oauth2.googleapis.com/token',
      expect.objectContaining({ method: 'POST' }),
    );

    vi.restoreAllMocks();
  });

  it('throws on OAuth failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve('invalid_grant'),
    });

    await expect(getAccessToken(validServiceAccount)).rejects.toThrow('Google OAuth failed');

    vi.restoreAllMocks();
  });
});
