import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { loadConfig } from '@appframe/core';
import type { UploadOptions, UploadResult } from './types.js';
import { AppStoreConnectClient, loadAppleCredentials, resolvePrivateKey } from './apple/client.js';
import { GooglePlayClient, loadGoogleCredentials } from './google/client.js';

interface UploadPlan {
  platform: 'ios' | 'android';
  locale: string;
  displayType: string;
  files: string[];
}

interface UploadSummary {
  plans: UploadPlan[];
  results: UploadResult[];
  totalUploaded: number;
  totalErrors: number;
}

/**
 * Discover generated screenshot files in the output directory, organized by platform/locale/size.
 * Expected structure: output/{platform}/{locale}/{size_key}/screen-*.png
 */
async function discoverScreenshots(outputDir: string, platform?: 'ios' | 'android', locale?: string): Promise<UploadPlan[]> {
  const plans: UploadPlan[] = [];

  const platforms = platform ? [platform] : ['ios', 'android'] as const;

  for (const plat of platforms) {
    const platDir = join(outputDir, plat);
    if (!await exists(platDir)) continue;

    const localeDirs = await readdir(platDir);
    for (const loc of localeDirs) {
      if (locale && loc !== locale) continue;
      const localeDir = join(platDir, loc);
      const locStat = await stat(localeDir);
      if (!locStat.isDirectory()) continue;

      const sizeDirs = await readdir(localeDir);
      for (const sizeKey of sizeDirs) {
        const sizeDir = join(localeDir, sizeKey);
        const sizeStat = await stat(sizeDir);
        if (!sizeStat.isDirectory()) continue;

        const files = (await readdir(sizeDir))
          .filter((f) => f.endsWith('.png'))
          .sort()
          .map((f) => join(sizeDir, f));

        if (files.length === 0) continue;

        const displayType = mapSizeKeyToDisplayType(plat, sizeKey);

        plans.push({
          platform: plat,
          locale: loc,
          displayType,
          files,
        });
      }
    }
  }

  return plans;
}

function mapSizeKeyToDisplayType(platform: 'ios' | 'android', sizeKey: string): string {
  if (platform === 'ios') {
    const iosMap: Record<string, string> = {
      'iphone-6.7': 'APP_IPHONE_67',
      'iphone-6.5': 'APP_IPHONE_65',
      'ipad-12.9-gen3': 'APP_IPAD_PRO_3GEN_129',
      'ipad-12.9': 'APP_IPAD_PRO_129',
    };
    return iosMap[sizeKey] ?? sizeKey;
  }

  const androidMap: Record<string, string> = {
    'phone': 'phoneScreenshots',
    'tablet-7': 'sevenInchScreenshots',
    'tablet-10': 'tenInchScreenshots',
    'feature-graphic': 'featureGraphic',
  };
  return androidMap[sizeKey] ?? sizeKey;
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Upload screenshots to App Store Connect and/or Google Play.
 * Discovers files from the output directory and uploads them.
 */
export async function uploadScreenshots(options: UploadOptions): Promise<UploadSummary> {
  const config = await loadConfig(options.configPath);
  const outputDir = options.outputDir ?? join(options.configPath, '..', config.output?.directory ?? './output');

  const plans = await discoverScreenshots(outputDir, options.platform, options.locale);

  if (plans.length === 0) {
    throw new Error(`No screenshots found in ${outputDir}. Run 'appframe generate' first.`);
  }

  const results: UploadResult[] = [];

  // Group plans by platform
  const iosPlans = plans.filter((p) => p.platform === 'ios');
  const androidPlans = plans.filter((p) => p.platform === 'android');

  // Upload to App Store Connect
  if (iosPlans.length > 0) {
    const credentials = await resolvePrivateKey(loadAppleCredentials());
    const client = new AppStoreConnectClient(credentials);
    const appId = process.env['ASC_APP_ID'];
    if (!appId) throw new Error('Missing ASC_APP_ID environment variable');

    for (const plan of iosPlans) {
      const result = await client.uploadScreenshots({
        appId,
        locale: plan.locale,
        displayType: plan.displayType as import('./types.js').AppStoreDisplayType,
        screenshotPaths: plan.files,
        dryRun: options.dryRun,
      });
      results.push(result);
    }
  }

  // Upload to Google Play
  if (androidPlans.length > 0) {
    const { serviceAccountPath, packageName } = loadGoogleCredentials();
    const client = new GooglePlayClient(serviceAccountPath);
    const editId = options.dryRun ? undefined : await client.createEdit(packageName);

    for (const plan of androidPlans) {
      const result = await client.uploadScreenshots({
        packageName,
        editId,
        locale: plan.locale,
        imageType: plan.displayType as import('./types.js').GooglePlayImageType,
        screenshotPaths: plan.files,
        dryRun: options.dryRun,
      });
      results.push(result);
    }

    // Commit the edit after all uploads
    if (editId && !options.dryRun) {
      await client.commitEdit(packageName, editId);
    }
  }

  return {
    plans,
    results,
    totalUploaded: results.reduce((sum, r) => sum + r.uploaded.length, 0),
    totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
  };
}

/**
 * Get an upload plan without uploading (for dry-run display).
 */
export async function getUploadPlan(options: UploadOptions): Promise<UploadPlan[]> {
  const config = await loadConfig(options.configPath);
  const outputDir = options.outputDir ?? join(options.configPath, '..', config.output?.directory ?? './output');
  return discoverScreenshots(outputDir, options.platform, options.locale);
}
