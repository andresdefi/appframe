import { createSign } from 'node:crypto';
import type { AppStoreConnectCredentials } from '../types.js';

/**
 * Generate a signed JWT for App Store Connect API.
 * Uses ES256 algorithm as required by Apple.
 * Tokens are valid for 20 minutes (max allowed).
 */
export function generateJwt(credentials: AppStoreConnectCredentials): string {
  const now = Math.floor(Date.now() / 1000);
  const expiration = now + 20 * 60; // 20 minutes

  const header = {
    alg: 'ES256',
    kid: credentials.keyId,
    typ: 'JWT',
  };

  const payload = {
    iss: credentials.issuerId,
    iat: now,
    exp: expiration,
    aud: 'appstoreconnect-v1',
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const sign = createSign('SHA256');
  sign.update(signingInput);
  const signature = sign.sign(credentials.privateKey);

  // ES256 signature from Node crypto is DER-encoded — convert to raw r||s (64 bytes)
  const rawSignature = derToRaw(signature);
  const encodedSignature = base64url(rawSignature);

  return `${signingInput}.${encodedSignature}`;
}

function base64url(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64url');
}

/**
 * Convert DER-encoded ECDSA signature to raw r||s format (64 bytes for P-256).
 */
function derToRaw(der: Buffer): Buffer {
  // DER: 0x30 <len> 0x02 <rlen> <r> 0x02 <slen> <s>
  let offset = 2; // skip 0x30 + total length
  if (der[1]! > 0x80) offset += der[1]! - 0x80;

  // Read r
  offset++; // skip 0x02
  const rLen = der[offset]!;
  offset++;
  let r = der.subarray(offset, offset + rLen);
  offset += rLen;

  // Read s
  offset++; // skip 0x02
  const sLen = der[offset]!;
  offset++;
  let s = der.subarray(offset, offset + sLen);

  // Trim leading zero bytes (padding for positive integers)
  if (r.length > 32) r = r.subarray(r.length - 32);
  if (s.length > 32) s = s.subarray(s.length - 32);

  // Pad to 32 bytes if shorter
  const raw = Buffer.alloc(64);
  r.copy(raw, 32 - r.length);
  s.copy(raw, 64 - s.length);

  return raw;
}
