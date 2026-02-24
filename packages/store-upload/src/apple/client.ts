import { readFile } from 'node:fs/promises';
import type {
  AppStoreConnectCredentials,
  AppStoreDisplayType,
  UploadResult,
} from '../types.js';
import { generateJwt } from './jwt.js';

const ASC_BASE = 'https://api.appstoreconnect.apple.com/v1';

interface AscResponse<T> {
  data: T;
  included?: unknown[];
}

interface AscScreenshotSet {
  id: string;
  type: 'appScreenshotSets';
  attributes: {
    screenshotDisplayType: AppStoreDisplayType;
  };
}

interface AscScreenshot {
  id: string;
  type: 'appScreenshots';
  attributes: {
    fileName: string;
    fileSize: number;
    uploadOperations?: AscUploadOperation[];
  };
}

interface AscUploadOperation {
  method: string;
  url: string;
  length: number;
  offset: number;
  requestHeaders: Array<{ name: string; value: string }>;
}

export class AppStoreConnectClient {
  private jwt: string;

  constructor(private credentials: AppStoreConnectCredentials) {
    this.jwt = generateJwt(credentials);
  }

  private refreshToken(): void {
    this.jwt = generateJwt(this.credentials);
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = path.startsWith('http') ? path : `${ASC_BASE}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.jwt}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (res.status === 401) {
      this.refreshToken();
      const retry = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      if (!retry.ok) {
        const body = await retry.text();
        throw new Error(`ASC API ${retry.status}: ${body}`);
      }
      return retry.json() as Promise<T>;
    }

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`ASC API ${res.status}: ${body}`);
    }

    if (res.status === 204) return {} as T;
    return res.json() as Promise<T>;
  }

  /**
   * Find the live or editable app store version for an app.
   */
  async findVersion(appId: string): Promise<string> {
    const res = await this.request<AscResponse<Array<{ id: string; attributes: { versionString: string; appStoreState: string } }>>>(
      `/apps/${appId}/appStoreVersions?filter[appStoreState]=PREPARE_FOR_SUBMISSION,DEVELOPER_REJECTED,REJECTED,METADATA_REJECTED,WAITING_FOR_REVIEW,IN_REVIEW,PENDING_DEVELOPER_RELEASE,READY_FOR_SALE&limit=1`,
    );

    const version = res.data[0];
    if (!version) {
      throw new Error(`No editable version found for app ${appId}. Create a new version in App Store Connect first.`);
    }
    return version.id;
  }

  /**
   * Get or create a screenshot set for a given locale and display type.
   */
  async getOrCreateScreenshotSet(
    localizationId: string,
    displayType: AppStoreDisplayType,
  ): Promise<string> {
    const res = await this.request<AscResponse<AscScreenshotSet[]>>(
      `/appStoreVersionLocalizations/${localizationId}/appScreenshotSets`,
    );

    const existing = res.data.find(
      (s) => s.attributes.screenshotDisplayType === displayType,
    );
    if (existing) return existing.id;

    // Create new set
    const created = await this.request<AscResponse<AscScreenshotSet>>(
      '/appScreenshotSets',
      {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'appScreenshotSets',
            attributes: { screenshotDisplayType: displayType },
            relationships: {
              appStoreVersionLocalization: {
                data: { type: 'appStoreVersionLocalizations', id: localizationId },
              },
            },
          },
        }),
      },
    );

    return created.data.id;
  }

  /**
   * Get the localization ID for a version + locale.
   */
  async getLocalizationId(versionId: string, locale: string): Promise<string> {
    const res = await this.request<AscResponse<Array<{ id: string; attributes: { locale: string } }>>>(
      `/appStoreVersions/${versionId}/appStoreVersionLocalizations`,
    );

    const loc = res.data.find((l) => l.attributes.locale === locale);
    if (!loc) {
      throw new Error(`Locale "${locale}" not found for this version. Available: ${res.data.map(l => l.attributes.locale).join(', ')}`);
    }
    return loc.id;
  }

  /**
   * Upload a single screenshot to a screenshot set.
   * Returns the screenshot ID on success.
   */
  async uploadScreenshot(
    screenshotSetId: string,
    filePath: string,
    fileName: string,
  ): Promise<string> {
    const fileBuffer = await readFile(filePath);
    const fileSize = fileBuffer.length;

    // 1. Reserve the screenshot
    const reservation = await this.request<AscResponse<AscScreenshot>>(
      '/appScreenshots',
      {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'appScreenshots',
            attributes: { fileName, fileSize },
            relationships: {
              appScreenshotSet: {
                data: { type: 'appScreenshotSets', id: screenshotSetId },
              },
            },
          },
        }),
      },
    );

    const screenshotId = reservation.data.id;
    const operations = reservation.data.attributes.uploadOperations ?? [];

    // 2. Upload each chunk
    for (const op of operations) {
      const chunk = fileBuffer.subarray(op.offset, op.offset + op.length);
      const headers: Record<string, string> = {};
      for (const h of op.requestHeaders) {
        headers[h.name] = h.value;
      }

      const uploadRes = await fetch(op.url, {
        method: op.method,
        headers,
        body: chunk,
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload chunk failed: ${uploadRes.status}`);
      }
    }

    // 3. Commit the upload
    await this.request(`/appScreenshots/${screenshotId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          type: 'appScreenshots',
          id: screenshotId,
          attributes: {
            uploaded: true,
            sourceFileChecksum: null,
          },
        },
      }),
    });

    return screenshotId;
  }

  /**
   * Delete all existing screenshots in a set before uploading new ones.
   */
  async clearScreenshotSet(screenshotSetId: string): Promise<number> {
    const res = await this.request<AscResponse<AscScreenshot[]>>(
      `/appScreenshotSets/${screenshotSetId}/appScreenshots`,
    );

    let deleted = 0;
    for (const ss of res.data) {
      await this.request(`/appScreenshots/${ss.id}`, { method: 'DELETE' });
      deleted++;
    }
    return deleted;
  }

  /**
   * Full upload flow: find version → localization → screenshot set → clear → upload all files.
   */
  async uploadScreenshots(options: {
    appId: string;
    versionId?: string;
    locale: string;
    displayType: AppStoreDisplayType;
    screenshotPaths: string[];
    dryRun?: boolean;
  }): Promise<UploadResult> {
    const result: UploadResult = {
      platform: 'ios',
      locale: options.locale,
      displayType: options.displayType,
      uploaded: [],
      skipped: [],
      errors: [],
    };

    if (options.dryRun) {
      result.uploaded = options.screenshotPaths;
      return result;
    }

    const versionId = options.versionId ?? await this.findVersion(options.appId);
    const locId = await this.getLocalizationId(versionId, options.locale);
    const setId = await this.getOrCreateScreenshotSet(locId, options.displayType);

    // Clear existing screenshots
    await this.clearScreenshotSet(setId);

    // Upload new ones
    for (const filePath of options.screenshotPaths) {
      const fileName = filePath.split('/').pop() ?? 'screenshot.png';
      try {
        await this.uploadScreenshot(setId, filePath, fileName);
        result.uploaded.push(filePath);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        result.errors.push(`${fileName}: ${msg}`);
      }
    }

    return result;
  }
}

/**
 * Load App Store Connect credentials from environment variables.
 */
export function loadAppleCredentials(): AppStoreConnectCredentials {
  const issuerId = process.env['ASC_ISSUER_ID'];
  const keyId = process.env['ASC_KEY_ID'];
  const privateKey = process.env['ASC_PRIVATE_KEY'];
  const privateKeyPath = process.env['ASC_PRIVATE_KEY_PATH'];

  if (!issuerId) throw new Error('Missing ASC_ISSUER_ID environment variable');
  if (!keyId) throw new Error('Missing ASC_KEY_ID environment variable');

  if (!privateKey && !privateKeyPath) {
    throw new Error('Missing ASC_PRIVATE_KEY or ASC_PRIVATE_KEY_PATH environment variable');
  }

  return {
    issuerId,
    keyId,
    privateKey: privateKey ?? `file:${privateKeyPath}`,
  };
}

/**
 * Resolve the private key — handles inline key or file path.
 */
export async function resolvePrivateKey(credentials: AppStoreConnectCredentials): Promise<AppStoreConnectCredentials> {
  if (credentials.privateKey.startsWith('file:')) {
    const path = credentials.privateKey.slice(5);
    const key = await readFile(path, 'utf-8');
    return { ...credentials, privateKey: key };
  }
  return credentials;
}
