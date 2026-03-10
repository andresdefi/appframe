import { describe, it, expect } from 'vitest';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFrameManifest, getFrame, listFrames, getDefaultFrame } from './loader.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifestPath = join(__dirname, '..', '..', '..', '..', 'frames', 'manifest.json');

describe('frame loader', () => {
  it('loads the frame manifest', async () => {
    const manifest = await loadFrameManifest(manifestPath);
    expect(manifest.frames.length).toBeGreaterThan(0);
    expect(manifest.version).toBeDefined();
  });

  it('lists all frames', async () => {
    const frames = await listFrames(manifestPath);
    expect(frames.length).toBeGreaterThan(0);
    expect(frames[0]!.id).toBeDefined();
    expect(frames[0]!.name).toBeDefined();
    expect(frames[0]!.platform).toBeDefined();
  });

  it('gets a specific frame by ID', async () => {
    const frame = await getFrame('generic-phone', manifestPath);
    expect(frame).toBeDefined();
    expect(frame!.name).toContain('Generic');
    expect(frame!.platform).toBe('ios');
    expect(frame!.screenArea).toBeDefined();
    expect(frame!.screenArea.width).toBeGreaterThan(0);
    expect(frame!.screenArea.height).toBeGreaterThan(0);
  });

  it('returns undefined for unknown frame ID', async () => {
    const frame = await getFrame('nonexistent-device', manifestPath);
    expect(frame).toBeUndefined();
  });

  it('finds default iOS phone frame', async () => {
    const frame = await getDefaultFrame('ios', 'phone', manifestPath);
    expect(frame).toBeDefined();
    expect(frame!.platform).toBe('ios');
  });

  it('finds default Android phone frame', async () => {
    const frame = await getDefaultFrame('android', 'phone', manifestPath);
    expect(frame).toBeDefined();
    // Generic phone serves both platforms via tags, platform field is 'ios'
    expect(frame!.id).toBe('generic-phone');
  });

  it('frame paths are absolute after loading', async () => {
    const frames = await listFrames(manifestPath);
    for (const frame of frames) {
      expect(frame.framePath.startsWith('/')).toBe(true);
    }
  });

  it('each frame has required screen area properties', async () => {
    const frames = await listFrames(manifestPath);
    for (const frame of frames) {
      expect(frame.screenArea).toHaveProperty('x');
      expect(frame.screenArea).toHaveProperty('y');
      expect(frame.screenArea).toHaveProperty('width');
      expect(frame.screenArea).toHaveProperty('height');
      expect(frame.screenResolution).toHaveProperty('width');
      expect(frame.screenResolution).toHaveProperty('height');
    }
  });
});
