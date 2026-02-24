import { createSign } from 'node:crypto';
import { readFile } from 'node:fs/promises';

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  token_uri: string;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * Load and parse a Google Cloud service account JSON key file.
 */
export async function loadServiceAccount(jsonPath: string): Promise<ServiceAccountKey> {
  const content = await readFile(jsonPath, 'utf-8');
  const key = JSON.parse(content) as ServiceAccountKey;

  if (!key.client_email || !key.private_key || !key.token_uri) {
    throw new Error('Invalid service account JSON: missing required fields');
  }

  return key;
}

/**
 * Generate a signed JWT and exchange it for an access token via Google OAuth2.
 * Scope: androidpublisher (Google Play Developer API).
 */
export async function getAccessToken(serviceAccount: ServiceAccountKey): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/androidpublisher',
    aud: serviceAccount.token_uri,
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const sign = createSign('SHA256');
  sign.update(signingInput);
  const signature = sign.sign(serviceAccount.private_key).toString('base64url');

  const jwt = `${signingInput}.${signature}`;

  const res = await fetch(serviceAccount.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google OAuth failed (${res.status}): ${body}`);
  }

  const token = (await res.json()) as TokenResponse;
  return token.access_token;
}
