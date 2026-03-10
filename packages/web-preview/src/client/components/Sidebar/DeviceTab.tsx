import { useRef, useState, useMemo, useCallback } from 'react';
import { useCurrentScreen } from '../../hooks/useCurrentScreen';
import { usePreviewStore } from '../../store';
import { useInstantPatch } from '../../hooks/useInstantPatch';
import type { DeviceFamily, FrameData } from '../../store';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { RangeSlider } from '../Controls/RangeSlider';
import { ColorPicker } from '../Controls/ColorPicker';
import { Checkbox } from '../Controls/Checkbox';
import { CropModal } from '../Controls/CropModal';
import { KOUBOU_COLOR_HEX } from '../../utils/presets';
import type { FrameStyle, LayoutVariant } from '../../types';
import { PLATFORM_DEVICE_DEFAULTS, PLATFORM_PREVIEW_SIZES } from '../../types';

const LAYOUT_OPTIONS = [
  { value: 'center', label: 'Center' },
  { value: 'angled-left', label: 'Angled Left' },
  { value: 'angled-right', label: 'Angled Right' },
  { value: 'floating', label: 'Floating' },
];

const FRAME_STYLE_OPTIONS = [
  { value: 'flat', label: 'Flat' },
  { value: 'floating', label: 'Floating' },
  { value: 'none', label: 'None (frameless)' },
];

const COMPOSITION_OPTIONS = [
  { value: 'single', label: 'Single Device' },
];

const COMPOSITION_GROUPS = [
  {
    label: 'Edge Bleed (1 device)',
    options: [
      { value: 'peek-right', label: 'Peek Right' },
      { value: 'peek-left', label: 'Peek Left' },
      { value: 'tilt-left', label: 'Tilt Left' },
      { value: 'tilt-right', label: 'Tilt Right' },
    ],
  },
  {
    label: 'Multi-Device',
    options: [
      { value: 'duo-overlap', label: 'Duo Overlap (2)' },
      { value: 'duo-split', label: 'Duo Split (2)' },
      { value: 'hero-tilt', label: 'Hero + Background (2)' },
      { value: 'fanned-cards', label: 'Fanned Cards (3)' },
    ],
  },
];

const PLATFORM_OPTIONS = [
  { value: 'iphone', label: 'iPhone' },
  { value: 'ipad', label: 'iPad' },
  { value: 'mac', label: 'Mac' },
  { value: 'watch', label: 'Apple Watch' },
  { value: 'android', label: 'Android' },
];

const PLATFORM_TO_CATEGORY: Record<string, string> = {
  iphone: 'iphone',
  android: 'iphone',
  ipad: 'ipad',
  mac: 'mac',
  watch: 'watch',
};

function getDefaultFrameForPlatform(platform: string, deviceFamilies: DeviceFamily[]): string {
  if (platform === 'android') return 'generic-phone';
  const category = PLATFORM_TO_CATEGORY[platform] ?? 'iphone';
  const match = deviceFamilies
    .filter((f) => f.category === category)
    .sort((a, b) => b.year - a.year)[0];
  if (match) return match.id;
  if (category === 'ipad') return 'ipad-pro-13';
  return 'generic-phone';
}

const FRAME_FILTER_TOLERANCE = 0.15;

function isFrameMatchingAspectRatio(
  frameRes: { width: number; height: number },
  screenshotAR: number,
): boolean {
  const fAR = frameRes.width / frameRes.height;
  return (
    Math.abs(screenshotAR - fAR) / fAR < FRAME_FILTER_TOLERANCE ||
    Math.abs(screenshotAR - 1 / fAR) / (1 / fAR) < FRAME_FILTER_TOLERANCE
  );
}

function findBestDeviceMatch(
  width: number,
  height: number,
  deviceFamilies: DeviceFamily[],
  frames: FrameData[],
): string | null {
  const tolerance = 0.1;
  let bestMatch: DeviceFamily | null = null;
  let bestYear = -1;
  let exactMatch: DeviceFamily | null = null;

  for (const f of deviceFamilies) {
    const res = f.screenResolution;
    const wR = Math.abs(width - res.width) / res.width;
    const hR = Math.abs(height - res.height) / res.height;
    let isMatch = wR <= tolerance && hR <= tolerance;
    if (!isMatch) {
      const wRL = Math.abs(width - res.height) / res.height;
      const hRL = Math.abs(height - res.width) / res.width;
      isMatch = wRL <= tolerance && hRL <= tolerance;
    }
    if (isMatch) {
      if (res.width === width && res.height === height) exactMatch = f;
      if (f.year > bestYear) {
        bestYear = f.year;
        bestMatch = f;
      }
    }
  }

  for (const fr of frames) {
    if (!fr.screenResolution) continue;
    const sRes = fr.screenResolution;
    const swR = Math.abs(width - sRes.width) / sRes.width;
    const shR = Math.abs(height - sRes.height) / sRes.height;
    if (swR <= tolerance && shR <= tolerance) {
      if (sRes.width === width && sRes.height === height && !exactMatch) return fr.id;
      if (!bestMatch || fr.year > bestYear) return fr.id;
    }
  }

  if (exactMatch) return exactMatch.id;
  if (bestMatch) return bestMatch.id;
  return null;
}

// Map platform to the Koubou categories it should show
const PLATFORM_CATEGORIES: Record<string, string[]> = {
  iphone: ['iphone'],
  android: ['iphone'], // Android uses phone-shaped frames
  ipad: ['ipad'],
  mac: ['mac'],
  watch: ['watch'],
};

// Map platform to the SVG frame tags that should match
const PLATFORM_SVG_TAGS: Record<string, string[]> = {
  iphone: ['default-ios', 'default-android'],
  android: ['default-ios', 'default-android'],
  ipad: ['default-ipad', 'fallback-tablet'],
  mac: [],
  watch: [],
};

function buildFrameOptions(
  deviceFamilies: DeviceFamily[],
  frames: FrameData[],
  screenshotDims: { width: number; height: number } | null,
  showAllFrames: boolean,
  platform: string,
) {
  const screenshotAR = screenshotDims ? screenshotDims.width / screenshotDims.height : null;
  const shouldFilterAR = !showAllFrames && screenshotAR !== null;
  const allowedCategories = PLATFORM_CATEGORIES[platform] ?? ['iphone'];
  const allowedSvgTags = PLATFORM_SVG_TAGS[platform] ?? [];

  // Koubou groups
  const grouped: Record<string, { value: string; label: string }[]> = {};
  for (const f of deviceFamilies) {
    const cat = f.category || 'other';
    if (!showAllFrames && !allowedCategories.includes(cat)) continue;
    if (shouldFilterAR && !isFrameMatchingAspectRatio(f.screenResolution, screenshotAR)) continue;
    const list = grouped[cat] ?? [];
    list.push({ value: f.id, label: f.name });
    grouped[cat] = list;
  }

  const groups = Object.entries(grouped).map(([label, options]) => ({
    label: label.charAt(0).toUpperCase() + label.slice(1),
    options,
  }));

  // SVG frame groups
  const svgFrames: { value: string; label: string }[] = [];
  for (const fr of frames) {
    if (!showAllFrames && allowedSvgTags.length > 0) {
      const frameTags = fr.tags ?? [];
      if (!frameTags.some((t) => allowedSvgTags.includes(t))) continue;
    } else if (!showAllFrames && allowedSvgTags.length === 0) {
      continue; // No SVG frames for this platform (mac, watch)
    }
    if (shouldFilterAR && fr.screenResolution && !isFrameMatchingAspectRatio(fr.screenResolution, screenshotAR)) continue;
    svgFrames.push({ value: fr.id, label: fr.name });
  }
  if (svgFrames.length > 0) {
    groups.push({ label: 'SVG Frames', options: svgFrames });
  }

  return groups;
}

export function DeviceTab() {
  const { screen, update } = useCurrentScreen();
  const platform = usePreviewStore((s) => s.platform);
  const setPlatform = usePreviewStore((s) => s.setPlatform);
  const setPreviewSize = usePreviewStore((s) => s.setPreviewSize);
  const sizes = usePreviewStore((s) => s.sizes);
  const setExportSize = usePreviewStore((s) => s.setExportSize);
  const triggerRender = usePreviewStore((s) => s.triggerRender);
  const updateScreen = usePreviewStore((s) => s.updateScreen);
  const screens = usePreviewStore((s) => s.screens);
  const deviceFamilies = usePreviewStore((s) => s.deviceFamilies);
  const frames = usePreviewStore((s) => s.frames);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [showAllFrames, setShowAllFrames] = useState(false);
  const { patchDevice } = useInstantPatch();
  const instantDevice = useCallback(
    (key: string, v: number) => patchDevice({ [key]: v }),
    [patchDevice],
  );

  const handlePlatformChange = (value: string) => {
    setPlatform(value);
    const size = PLATFORM_PREVIEW_SIZES[value] ?? PLATFORM_PREVIEW_SIZES.iphone!;
    setPreviewSize(size.w, size.h);
    const platSizes = sizes[value] ?? [];
    if (platSizes.length > 0) {
      setExportSize(platSizes[0]!.key);
    }
    const defaultFrame = getDefaultFrameForPlatform(value, deviceFamilies);
    for (let i = 0; i < screens.length; i++) {
      updateScreen(i, { frameId: defaultFrame, deviceColor: '' });
    }
    triggerRender();
  };

  if (!screen) return null;

  const currentFamily = deviceFamilies.find((f) => f.id === screen.frameId);
  const hasColors = currentFamily && currentFamily.colors.length > 1;
  const isKoubouPng = currentFamily && currentFamily.screenRect;
  const isFrameNone = screen.frameStyle === 'none';
  const showAngle = screen.layout === 'angled-left' || screen.layout === 'angled-right';

  const frameGroups = useMemo(
    () => buildFrameOptions(deviceFamilies, frames, screen.screenshotDims, showAllFrames, platform),
    [deviceFamilies, frames, screen.screenshotDims, showAllFrames, platform],
  );

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      // Extract image dimensions for frame filtering + auto-matching
      const img = new Image();
      img.onload = () => {
        const dims = { width: img.naturalWidth, height: img.naturalHeight };
        update({
          screenshotDataUrl: dataUrl,
          screenshotName: file.name,
          screenshotDims: dims,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropApply = (croppedDataUrl: string) => {
    setShowCrop(false);
    // Re-extract dimensions from cropped image — keep current frame selection
    const img = new Image();
    img.onload = () => {
      const dims = { width: img.naturalWidth, height: img.naturalHeight };
      update({
        screenshotDataUrl: croppedDataUrl,
        screenshotDims: dims,
      });
    };
    img.src = croppedDataUrl;
  };

  const pd = PLATFORM_DEVICE_DEFAULTS[platform] ?? PLATFORM_DEVICE_DEFAULTS.iphone!;

  return (
    <>
      {showCrop && screen.screenshotDataUrl && (
        <CropModal
          imageDataUrl={screen.screenshotDataUrl}
          onApply={handleCropApply}
          onCancel={() => setShowCrop(false)}
        />
      )}

      {/* Platform */}
      <Section title="Platform">
        <Select
          label=""
          value={platform}
          onChange={handlePlatformChange}
          options={PLATFORM_OPTIONS}
        />
      </Section>

      {/* Screenshot */}
      <Section title="Screenshot">
        {screen.screenshotDataUrl && (
          <div className="flex items-center gap-2 mb-2">
            <img
              src={screen.screenshotDataUrl}
              alt=""
              className="w-10 h-10 rounded object-cover border border-border"
            />
            <span className="text-xs text-text-dim truncate flex-1">
              {screen.screenshotName || 'Custom upload'}
            </span>
          </div>
        )}
        {!screen.screenshotDataUrl && screen.screenshotName && (
          <div className="text-xs text-text-dim mb-2">{screen.screenshotName}</div>
        )}
        <button
          className="w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Screenshot
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleScreenshotUpload}
        />
        {screen.screenshotDataUrl && (
          <div className="flex gap-1 mt-1.5">
            <button
              className="flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
              onClick={() => setShowCrop(true)}
            >
              Crop
            </button>
            <button
              className="flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
              onClick={() =>
                update({ screenshotDataUrl: null, screenshotName: null, screenshotDims: null })
              }
            >
              Revert
            </button>
          </div>
        )}
      </Section>

      {/* Device Frame */}
      <Section title="Device Frame">
        <Select
          label="Device"
          value={screen.frameId}
          onChange={(v) => {
            // Auto-reset frameStyle when selecting a Koubou PNG device
            const family = deviceFamilies.find((f) => f.id === v);
            const isPng = family && family.screenRect;
            if (isPng && screen.frameStyle === 'none') {
              update({ frameId: v, frameStyle: 'flat' });
            } else {
              update({ frameId: v });
            }
          }}
          groups={frameGroups}
        />

        {screen.screenshotDims && (
          <Checkbox
            label="Show all frames"
            checked={showAllFrames}
            onChange={setShowAllFrames}
          />
        )}

        {/* Koubou color swatches */}
        {hasColors && (
          <div className="mb-2.5">
            <label className="block text-xs text-text-dim mb-1">Color Variant</label>
            <div className="flex flex-wrap gap-1">
              {currentFamily.colors.map((c) => (
                <button
                  key={c.name}
                  className={`w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform ${
                    screen.deviceColor === c.name
                      ? 'border-accent ring-1 ring-accent'
                      : 'border-border'
                  }`}
                  style={{
                    background: KOUBOU_COLOR_HEX[c.name] ?? '#888888',
                  }}
                  title={c.name}
                  onClick={() => update({ deviceColor: c.name })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Frame style — hidden for Koubou PNG devices */}
        <Select
          label="Frame Style"
          value={screen.frameStyle}
          onChange={(v) => update({ frameStyle: v as FrameStyle })}
          options={FRAME_STYLE_OPTIONS}
          hidden={!!isKoubouPng}
        />

        {/* Border simulation — only when frame style is "none" */}
        {isFrameNone && (
          <>
            <Checkbox
              label="Border Simulation"
              checked={!!screen.borderSimulation}
              onChange={(checked) =>
                update({
                  borderSimulation: checked
                    ? { enabled: true, thickness: 4, color: '#1a1a1a', radius: 40 }
                    : null,
                })
              }
            />
            {screen.borderSimulation && (
              <>
                <RangeSlider
                  label="Thickness"
                  value={screen.borderSimulation.thickness}
                  min={1}
                  max={20}
                  formatValue={(v) => `${v}px`}
                  onChange={(v) =>
                    update({
                      borderSimulation: { ...screen.borderSimulation!, thickness: v },
                    })
                  }
                />
                <ColorPicker
                  label="Color"
                  value={screen.borderSimulation.color}
                  onChange={(v) =>
                    update({
                      borderSimulation: { ...screen.borderSimulation!, color: v },
                    })
                  }
                />
                <RangeSlider
                  label="Radius"
                  value={screen.borderSimulation.radius}
                  min={0}
                  max={60}
                  formatValue={(v) => `${v}px`}
                  onChange={(v) =>
                    update({
                      borderSimulation: { ...screen.borderSimulation!, radius: v },
                    })
                  }
                />
              </>
            )}
          </>
        )}
      </Section>

      {/* Device Layout */}
      <Section title="Device Layout">
        <Select
          label="Layout"
          value={screen.layout}
          onChange={(v) => update({ layout: v as LayoutVariant })}
          options={LAYOUT_OPTIONS}
        />
        <RangeSlider
          label="Device Size"
          value={screen.deviceScale}
          min={50}
          max={100}
          formatValue={(v) => `${v}%`}
          onChange={(v) => update({ deviceScale: v })}
          onInstant={(v) => instantDevice('deviceScale', v)}
        />
        <RangeSlider
          label="Device Position"
          value={screen.deviceTop}
          min={-80}
          max={80}
          formatValue={(v) => `${v}%`}
          onChange={(v) => update({ deviceTop: v })}
          onInstant={(v) => instantDevice('deviceTop', v)}
        />
        <RangeSlider
          label="Horizontal Position"
          value={screen.deviceOffsetX}
          min={-80}
          max={80}
          formatValue={(v) => String(v)}
          onChange={(v) => update({ deviceOffsetX: v })}
          onInstant={(v) => instantDevice('deviceOffsetX', v)}
        />
        <RangeSlider
          label="Device Rotation"
          value={screen.deviceRotation}
          min={-180}
          max={180}
          formatValue={(v) => `${v}\u00B0`}
          onChange={(v) => update({ deviceRotation: v })}
          onInstant={(v) => instantDevice('deviceRotation', v)}
        />
        {showAngle && (
          <RangeSlider
            label="Perspective Angle"
            value={screen.deviceAngle}
            min={2}
            max={45}
            formatValue={(v) => `${v}\u00B0`}
            onChange={(v) => update({ deviceAngle: v })}
            onInstant={(v) => instantDevice('deviceAngle', v)}
          />
        )}
        <RangeSlider
          label="3D Tilt"
          value={screen.deviceTilt}
          min={0}
          max={20}
          formatValue={(v) => `${v}\u00B0`}
          onChange={(v) => update({ deviceTilt: v })}
          onInstant={(v) => instantDevice('deviceTilt', v)}
        />
        {isFrameNone && (
          <RangeSlider
            label="Corner Radius"
            value={screen.cornerRadius}
            min={0}
            max={50}
            formatValue={(v) => `${v}%`}
            onChange={(v) => update({ cornerRadius: v })}
          />
        )}
        <button
          className="w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1"
          onClick={() =>
            update({
              deviceScale: pd.deviceScale,
              deviceTop: pd.deviceTop,
              deviceRotation: 0,
              deviceOffsetX: 0,
              deviceAngle: pd.deviceAngle,
              deviceTilt: 0,
              cornerRadius: 0,
            })
          }
        >
          Reset Device Position
        </button>
      </Section>

      {/* Device Shadow */}
      <Section title="Device Shadow">
        <Checkbox
          label="Custom Shadow"
          checked={!!screen.deviceShadow}
          onChange={(checked) =>
            update({
              deviceShadow: checked
                ? { opacity: 0.25, blur: 20, color: '#000000', offsetY: 10 }
                : null,
            })
          }
        />
        {screen.deviceShadow && (
          <>
            <RangeSlider
              label="Opacity"
              value={Math.round(screen.deviceShadow.opacity * 100)}
              min={0}
              max={100}
              formatValue={(v) => `${v}%`}
              onChange={(v) =>
                update({
                  deviceShadow: { ...screen.deviceShadow!, opacity: v / 100 },
                })
              }
            />
            <RangeSlider
              label="Blur"
              value={screen.deviceShadow.blur}
              min={0}
              max={50}
              formatValue={(v) => `${v}px`}
              onChange={(v) =>
                update({
                  deviceShadow: { ...screen.deviceShadow!, blur: v },
                })
              }
            />
            <ColorPicker
              label="Color"
              value={screen.deviceShadow.color}
              onChange={(v) =>
                update({
                  deviceShadow: { ...screen.deviceShadow!, color: v },
                })
              }
            />
            <RangeSlider
              label="Y Offset"
              value={screen.deviceShadow.offsetY}
              min={0}
              max={30}
              formatValue={(v) => `${v}px`}
              onChange={(v) =>
                update({
                  deviceShadow: { ...screen.deviceShadow!, offsetY: v },
                })
              }
            />
          </>
        )}
      </Section>

      {/* Composition */}
      <Section title="Composition">
        <Select
          label="Device Arrangement"
          value={screen.composition}
          onChange={(v) => update({ composition: v as typeof screen.composition })}
          options={COMPOSITION_OPTIONS}
          groups={COMPOSITION_GROUPS}
        />
        <span className="text-[10px] text-text-dim leading-tight block -mt-1.5 mb-2">
          Edge bleed presets overflow screen edges — pair adjacent screens for cross-screen effects.
        </span>
      </Section>
    </>
  );
}
