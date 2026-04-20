import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';

vi.mock('@appframe/core', () => ({
  loadConfig: vi.fn().mockResolvedValue({
    app: { name: 'App', description: 'D', platforms: ['ios'], features: [] },
    theme: { style: 'minimal', colors: { primary: '#FFF', secondary: '#000', background: '#FFF', text: '#000' }, font: 'inter', fontWeight: 600 },
    frames: { style: 'flat' },
    screens: [{ screenshot: 'test.png', headline: 'Hi', layout: 'center', composition: 'single', annotations: [] }],
    output: { platforms: ['ios'], directory: './output' },
  }),
}));

vi.mock('./apple/client.js', () => {
  function MockAppStoreConnectClient() {
    return {
      uploadScreenshots: vi.fn().mockResolvedValue({
        platform: 'ios', locale: 'en-US', displayType: 'APP_IPHONE_67', uploaded: ['/tmp/a.png'], skipped: [], errors: [],
      }),
    };
  }
  return {
    AppStoreConnectClient: MockAppStoreConnectClient,
    loadAppleCredentials: vi.fn().mockReturnValue({ issuerId: 'i', keyId: 'k', privateKey: 'pk' }),
    resolvePrivateKey: vi.fn().mockImplementation((c: unknown) => Promise.resolve(c)),
  };
});

vi.mock('./google/client.js', () => {
  function MockGooglePlayClient() {
    return {
      createEdit: vi.fn().mockResolvedValue('edit-1'),
      commitEdit: vi.fn().mockResolvedValue(undefined),
      uploadScreenshots: vi.fn().mockResolvedValue({
        platform: 'android', locale: 'en-US', displayType: 'phoneScreenshots', uploaded: ['/tmp/b.png'], skipped: [], errors: [],
      }),
    };
  }
  return {
    GooglePlayClient: MockGooglePlayClient,
    loadGoogleCredentials: vi.fn().mockReturnValue({ serviceAccountPath: '/path/sa.json', packageName: 'com.test' }),
  };
});

import { uploadScreenshots, getUploadPlan } from './uploader.js';

let tempDir: string;

beforeEach(async () => {
  vi.clearAllMocks();
  tempDir = await mkdtemp(join(tmpdir(), 'uploader-test-'));
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

async function createFakeOutput(outputDir: string, platform: string, locale: string, sizeKey: string, files: string[]) {
  const dir = join(outputDir, platform, locale, sizeKey);
  await mkdir(dir, { recursive: true });
  for (const f of files) {
    await writeFile(join(dir, f), Buffer.from('PNG'));
  }
}

describe('uploadScreenshots', () => {
  it('throws when no screenshots found in empty output dir', async () => {
    await expect(
      uploadScreenshots({ configPath: '/tmp/appframe.yml', outputDir: tempDir }),
    ).rejects.toThrow('No screenshots found');
  });

  it('discovers and uploads iOS screenshots', async () => {
    process.env['ASC_APP_ID'] = 'app-123';
    await createFakeOutput(tempDir, 'ios', 'en-US', 'iphone-6.7', ['screen_1.png', 'screen_2.png']);

    const result = await uploadScreenshots({ configPath: '/tmp/appframe.yml', outputDir: tempDir });
    expect(result.plans.length).toBe(1);
    expect(result.plans[0]!.platform).toBe('ios');
    expect(result.plans[0]!.locale).toBe('en-US');
    expect(result.plans[0]!.files.length).toBe(2);
    expect(result.results.length).toBe(1);

    delete process.env['ASC_APP_ID'];
  });

  it('discovers and uploads Android screenshots', async () => {
    await createFakeOutput(tempDir, 'android', 'en-US', 'phone', ['screen_1.png']);
    // Remove iOS dir so only android is found
    process.env['GOOGLE_PLAY_SERVICE_ACCOUNT'] = '/path/sa.json';
    process.env['GOOGLE_PLAY_PACKAGE_NAME'] = 'com.test';

    const result = await uploadScreenshots({ configPath: '/tmp/appframe.yml', outputDir: tempDir });
    expect(result.plans.length).toBe(1);
    expect(result.plans[0]!.platform).toBe('android');

    delete process.env['GOOGLE_PLAY_SERVICE_ACCOUNT'];
    delete process.env['GOOGLE_PLAY_PACKAGE_NAME'];
  });

  it('respects platform filter', async () => {
    process.env['ASC_APP_ID'] = 'app-123';
    await createFakeOutput(tempDir, 'ios', 'en-US', 'iphone-6.7', ['a.png']);
    await createFakeOutput(tempDir, 'android', 'en-US', 'phone', ['b.png']);

    const result = await uploadScreenshots({ configPath: '/tmp/appframe.yml', outputDir: tempDir, platform: 'ios' });
    expect(result.plans.every((p) => p.platform === 'ios')).toBe(true);

    delete process.env['ASC_APP_ID'];
  });

  it('respects locale filter', async () => {
    process.env['ASC_APP_ID'] = 'app-123';
    await createFakeOutput(tempDir, 'ios', 'en-US', 'iphone-6.7', ['a.png']);
    await createFakeOutput(tempDir, 'ios', 'es-ES', 'iphone-6.7', ['b.png']);

    const result = await uploadScreenshots({ configPath: '/tmp/appframe.yml', outputDir: tempDir, locale: 'en-US' });
    expect(result.plans.length).toBe(1);
    expect(result.plans[0]!.locale).toBe('en-US');

    delete process.env['ASC_APP_ID'];
  });

  it('throws when ASC_APP_ID missing for iOS uploads', async () => {
    delete process.env['ASC_APP_ID'];
    await createFakeOutput(tempDir, 'ios', 'en-US', 'iphone-6.7', ['a.png']);

    await expect(
      uploadScreenshots({ configPath: '/tmp/appframe.yml', outputDir: tempDir }),
    ).rejects.toThrow('Missing ASC_APP_ID');
  });
});

describe('getUploadPlan', () => {
  it('returns empty plan when no screenshots exist', async () => {
    const plans = await getUploadPlan({ configPath: '/tmp/appframe.yml', outputDir: tempDir });
    expect(plans).toEqual([]);
  });

  it('returns plans for discovered screenshots', async () => {
    await createFakeOutput(tempDir, 'ios', 'en-US', 'iphone-6.7', ['a.png', 'b.png']);

    const plans = await getUploadPlan({ configPath: '/tmp/appframe.yml', outputDir: tempDir });
    expect(plans.length).toBe(1);
    expect(plans[0]!.files.length).toBe(2);
    expect(plans[0]!.displayType).toBe('APP_IPHONE_67');
  });

  it('maps Android size keys to display types', async () => {
    await createFakeOutput(tempDir, 'android', 'en-US', 'phone', ['a.png']);

    const plans = await getUploadPlan({ configPath: '/tmp/appframe.yml', outputDir: tempDir });
    expect(plans[0]!.displayType).toBe('phoneScreenshots');
  });
});
