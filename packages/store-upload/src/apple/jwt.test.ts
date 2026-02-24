import { describe, it, expect } from 'vitest';
import { generateKeyPairSync } from 'node:crypto';
import { generateJwt } from './jwt.js';

describe('generateJwt', () => {
  // Generate a fresh ES256 key pair for testing
  const { privateKey } = generateKeyPairSync('ec', {
    namedCurve: 'P-256',
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    publicKeyEncoding: { type: 'spki', format: 'pem' },
  });

  it('generates a valid JWT with three parts', () => {
    const jwt = generateJwt({
      issuerId: 'test-issuer',
      keyId: 'test-key',
      privateKey: privateKey as string,
    });

    const parts = jwt.split('.');
    expect(parts).toHaveLength(3);
  });

  it('has correct header with ES256 and key ID', () => {
    const jwt = generateJwt({
      issuerId: 'test-issuer',
      keyId: 'MY_KEY_123',
      privateKey: privateKey as string,
    });

    const header = JSON.parse(Buffer.from(jwt.split('.')[0]!, 'base64url').toString());
    expect(header.alg).toBe('ES256');
    expect(header.kid).toBe('MY_KEY_123');
    expect(header.typ).toBe('JWT');
  });

  it('has correct payload with issuer and audience', () => {
    const jwt = generateJwt({
      issuerId: 'issuer-id-456',
      keyId: 'test-key',
      privateKey: privateKey as string,
    });

    const payload = JSON.parse(Buffer.from(jwt.split('.')[1]!, 'base64url').toString());
    expect(payload.iss).toBe('issuer-id-456');
    expect(payload.aud).toBe('appstoreconnect-v1');
    expect(payload.exp).toBeGreaterThan(payload.iat);
    expect(payload.exp - payload.iat).toBe(20 * 60); // 20 minutes
  });

  it('produces different tokens on each call (different iat)', async () => {
    const jwt1 = generateJwt({
      issuerId: 'test',
      keyId: 'test',
      privateKey: privateKey as string,
    });

    // Small delay to ensure different timestamp
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const jwt2 = generateJwt({
      issuerId: 'test',
      keyId: 'test',
      privateKey: privateKey as string,
    });

    expect(jwt1).not.toBe(jwt2);
  });
});
