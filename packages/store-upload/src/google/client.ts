import { readFile } from 'node:fs/promises';
import type { GooglePlayImageType, UploadResult } from '../types.js';
import { getAccessToken, loadServiceAccount } from './auth.js';

const GP_BASE = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications';
const GP_UPLOAD_BASE = 'https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications';

export class GooglePlayClient {
  private accessToken: string | null = null;

  constructor(private serviceAccountPath: string) {}

  private async getToken(): Promise<string> {
    if (!this.accessToken) {
      const sa = await loadServiceAccount(this.serviceAccountPath);
      this.accessToken = await getAccessToken(sa);
    }
    return this.accessToken;
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const token = await this.getToken();
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Google Play API ${res.status}: ${body}`);
    }

    if (res.status === 204) return {} as T;
    return res.json() as Promise<T>;
  }

  /**
   * Create a new edit for a package.
   */
  async createEdit(packageName: string): Promise<string> {
    const res = await this.request<{ id: string }>(
      `${GP_BASE}/${packageName}/edits`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' },
    );
    return res.id;
  }

  /**
   * Commit an edit to apply changes.
   */
  async commitEdit(packageName: string, editId: string): Promise<void> {
    await this.request(
      `${GP_BASE}/${packageName}/edits/${editId}:commit`,
      { method: 'POST' },
    );
  }

  /**
   * Delete all existing images of a given type for a locale.
   */
  async clearImages(
    packageName: string,
    editId: string,
    locale: string,
    imageType: GooglePlayImageType,
  ): Promise<void> {
    await this.request(
      `${GP_BASE}/${packageName}/edits/${editId}/listings/${locale}/${imageType}`,
      { method: 'DELETE' },
    );
  }

  /**
   * Upload a single image.
   */
  async uploadImage(
    packageName: string,
    editId: string,
    locale: string,
    imageType: GooglePlayImageType,
    filePath: string,
  ): Promise<void> {
    const token = await this.getToken();
    const fileBuffer = await readFile(filePath);

    const res = await fetch(
      `${GP_UPLOAD_BASE}/${packageName}/edits/${editId}/listings/${locale}/${imageType}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'image/png',
        },
        body: fileBuffer,
      },
    );

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Upload failed: ${res.status} ${body}`);
    }
  }

  /**
   * Full upload flow: create edit → clear images → upload all → commit.
   */
  async uploadScreenshots(options: {
    packageName: string;
    editId?: string;
    locale: string;
    imageType: GooglePlayImageType;
    screenshotPaths: string[];
    dryRun?: boolean;
  }): Promise<UploadResult> {
    const result: UploadResult = {
      platform: 'android',
      locale: options.locale,
      displayType: options.imageType,
      uploaded: [],
      skipped: [],
      errors: [],
    };

    if (options.dryRun) {
      result.uploaded = options.screenshotPaths;
      return result;
    }

    const ownEdit = !options.editId;
    const editId = options.editId ?? await this.createEdit(options.packageName);

    try {
      // Clear existing images
      await this.clearImages(options.packageName, editId, options.locale, options.imageType);

      // Upload new ones
      for (const filePath of options.screenshotPaths) {
        const fileName = filePath.split('/').pop() ?? 'screenshot.png';
        try {
          await this.uploadImage(options.packageName, editId, options.locale, options.imageType, filePath);
          result.uploaded.push(filePath);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          result.errors.push(`${fileName}: ${msg}`);
        }
      }

      // Commit if we created the edit
      if (ownEdit) {
        await this.commitEdit(options.packageName, editId);
      }
    } catch (err) {
      if (ownEdit) {
        // Attempt to clean up the edit on failure
        try {
          await this.request(
            `${GP_BASE}/${options.packageName}/edits/${editId}`,
            { method: 'DELETE' },
          );
        } catch {
          // Ignore cleanup errors
        }
      }
      throw err;
    }

    return result;
  }
}

/**
 * Load Google Play credentials from environment variables.
 */
export function loadGoogleCredentials(): { serviceAccountPath: string; packageName: string } {
  const serviceAccountPath = process.env['GOOGLE_PLAY_SERVICE_ACCOUNT'];
  const packageName = process.env['GOOGLE_PLAY_PACKAGE_NAME'];

  if (!serviceAccountPath) {
    throw new Error('Missing GOOGLE_PLAY_SERVICE_ACCOUNT environment variable (path to service account JSON)');
  }
  if (!packageName) {
    throw new Error('Missing GOOGLE_PLAY_PACKAGE_NAME environment variable');
  }

  return { serviceAccountPath, packageName };
}
