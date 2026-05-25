import { useRef, useState, useMemo, useCallback } from 'react';
import { useCurrentScreen } from '../../hooks/useCurrentScreen';
import { usePreviewStore } from '../../store';
import { useInstantPatch } from '../../hooks/useInstantPatch';
import type { DeviceFamily, FrameData } from '../../store';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { TileGrid } from '../Controls/TileGrid';
import { RangeSlider } from '../Controls/RangeSlider';
import { ColorPicker } from '../Controls/ColorPicker';
import { Checkbox } from '../Controls/Checkbox';
import { CropModal } from '../Controls/CropModal';
import { useConfirmDialog } from '../Controls/ConfirmDialog';
import { KOUBOU_COLOR_HEX } from '../../utils/presets';
import { getDefaultFrameForPlatform } from '../../utils/deviceFrames';
import { getDefaultExportSizeKey, getPlatformPreviewSize, isPlatformCompatibleWithScreenshot } from '../../utils/platformSelection';
import type {
  FrameStyle,
  LayoutVariant,
  CompositionPreset,
  ExtraDeviceState,
} from '../../types';
import { PLATFORM_DEVICE_DEFAULTS } from '../../types';
import { COMPOSITION_PRESETS } from '../../utils/compositionPresets';
import { uploadScreenshot } from '../../utils/api';
import { uploadImageFile, uploadImageFileToScreen } from '../../utils/uploadImageFile';

const LAYOUT_OPTIONS = [
  { value: 'center', label: 'Center' },
  { value: 'angled-left', label: 'Angled Left' },
  { value: 'angled-right', label: 'Angled Right' },
];

const FRAME_STYLE_OPTIONS = [
  { value: 'flat', label: 'Flat' },
  { value: 'none', label: 'None (frameless)' },
];

const COMPOSITION_OPTIONS = [
  { value: 'single', label: 'Single Device' },
];

const COMPOSITION_GROUPS = [
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
  platform: string,
) {
  const screenshotAR = screenshotDims ? screenshotDims.width / screenshotDims.height : null;
  const allowedCategories = PLATFORM_CATEGORIES[platform] ?? ['iphone'];
  const allowedSvgTags = PLATFORM_SVG_TAGS[platform] ?? [];

  // Koubou groups
  const grouped: Record<string, { value: string; label: string }[]> = {};
  for (const f of deviceFamilies) {
    const cat = f.category || 'other';
    if (!allowedCategories.includes(cat)) continue;
    if (screenshotAR !== null && !isFrameMatchingAspectRatio(f.screenResolution, screenshotAR)) continue;
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
    if (allowedSvgTags.length === 0) continue;
    const frameTags = fr.tags ?? [];
    if (!frameTags.some((t) => allowedSvgTags.includes(t))) continue;
    if (screenshotAR !== null && fr.screenResolution && !isFrameMatchingAspectRatio(fr.screenResolution, screenshotAR)) continue;
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
  const { patchDevice, patchBorder } = useInstantPatch();
  const instantDevice = useCallback(
    (key: string, v: number) => patchDevice({ [key]: v }),
    [patchDevice],
  );
  const { confirm: confirmRemoveDevice, dialog: removeDeviceDialog } = useConfirmDialog();

  // Per-device stacking helpers. slotIdx=0 is the primary device,
  // slotIdx>=1 maps to screen.extraDevices[slotIdx-1]. Effective z-index
  // for each slot resolves: override → preset slot zIndex → 1 (fallback).
  // "Send backward" finds the adjacent lower-z slot and swaps; "Bring
  // forward" goes the other way. Ties break by slot index so the
  // operation is always deterministic.
  const reorder = useMemo(() => {
    if (!screen) return null;
    const preset = COMPOSITION_PRESETS[screen.composition];
    const totalSlots = 1 + screen.extraDevices.length;
    const effectiveZ = Array.from({ length: totalSlots }, (_, i) => {
      if (i === 0) return screen.deviceZIndex ?? preset?.slots[0]?.zIndex ?? 1;
      const extra = screen.extraDevices[i - 1]!;
      return extra.zIndex ?? preset?.slots[i]?.zIndex ?? 1;
    });
    const findAdjacent = (slotIdx: number, dir: 'back' | 'forward'): number | null => {
      const z = effectiveZ[slotIdx]!;
      let best: { idx: number; z: number } | null = null;
      for (let i = 0; i < totalSlots; i++) {
        if (i === slotIdx) continue;
        const oz = effectiveZ[i]!;
        const ok = dir === 'back'
          ? (oz < z || (oz === z && i < slotIdx))
          : (oz > z || (oz === z && i > slotIdx));
        if (!ok) continue;
        if (best === null) { best = { idx: i, z: oz }; continue; }
        // Pick the closest neighbour in the chosen direction.
        const closer = dir === 'back' ? oz > best.z : oz < best.z;
        if (closer) best = { idx: i, z: oz };
      }
      return best?.idx ?? null;
    };
    const swap = (slotIdx: number, dir: 'back' | 'forward') => {
      const otherIdx = findAdjacent(slotIdx, dir);
      if (otherIdx === null) return;
      const z = effectiveZ[slotIdx]!;
      const otherZ = effectiveZ[otherIdx]!;
      const newSlotZ = z === otherZ ? (dir === 'back' ? otherZ - 1 : otherZ + 1) : otherZ;
      const newOtherZ = z === otherZ ? otherZ : z;
      const updates: { deviceZIndex?: number; extraDevices?: ExtraDeviceState[] } = {};
      if (slotIdx === 0) updates.deviceZIndex = newSlotZ;
      else if (otherIdx === 0) updates.deviceZIndex = newOtherZ;
      if (slotIdx > 0 || otherIdx > 0) {
        updates.extraDevices = screen.extraDevices.map((d, i) => {
          const si = i + 1;
          if (si === slotIdx) return { ...d, zIndex: newSlotZ };
          if (si === otherIdx) return { ...d, zIndex: newOtherZ };
          return d;
        });
      }
      update(updates);
    };
    return {
      canSendBack: (slotIdx: number) => findAdjacent(slotIdx, 'back') !== null,
      canSendForward: (slotIdx: number) => findAdjacent(slotIdx, 'forward') !== null,
      sendBack: (slotIdx: number) => swap(slotIdx, 'back'),
      sendForward: (slotIdx: number) => swap(slotIdx, 'forward'),
    };
  }, [screen, update]);

  const handlePlatformChange = (value: string) => {
    setPlatform(value);
    const size = getPlatformPreviewSize(value);
    setPreviewSize(size.w, size.h);
    const defaultExportSize = getDefaultExportSizeKey(sizes, value);
    if (defaultExportSize) setExportSize(defaultExportSize);
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
    () => buildFrameOptions(deviceFamilies, frames, screen.screenshotDims, platform),
    [deviceFamilies, frames, screen.screenshotDims, platform],
  );

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const patch = await uploadImageFileToScreen(file);
    update(patch);
  };

  const handleCropApply = (croppedDataUrl: string) => {
    setShowCrop(false);
    const img = new Image();
    img.onload = async () => {
      const dims = { width: img.naturalWidth, height: img.naturalHeight };
      const baseName = screen.screenshotName || 'cropped.png';
      const ext = baseName.includes('.') ? baseName.slice(baseName.lastIndexOf('.')) : '.png';
      const stem = baseName.slice(0, baseName.length - ext.length).replace(/-cropped(-\d+)?$/, '');
      const filename = `${stem || 'cropped'}-cropped${ext}`;
      try {
        const uploaded = await uploadScreenshot({ filename, dataUrl: croppedDataUrl });
        update({
          screenshotUrl: uploaded.url,
          screenshotName: uploaded.filename,
          screenshotDims: dims,
        });
      } catch (err) {
        console.error('Cropped screenshot upload failed, falling back to in-memory data URL', err);
        update({
          screenshotUrl: croppedDataUrl,
          screenshotDims: dims,
        });
      }
    };
    img.src = croppedDataUrl;
  };

  const pd = PLATFORM_DEVICE_DEFAULTS[platform] ?? PLATFORM_DEVICE_DEFAULTS.iphone!;

  return (
    <>
      {removeDeviceDialog}
      {showCrop && screen.screenshotUrl && (
        <CropModal
          imageDataUrl={screen.screenshotUrl}
          onApply={handleCropApply}
          onCancel={() => setShowCrop(false)}
        />
      )}

      {/* Platform */}
      <Section title="Platform" tooltip="Choose the target platform. This adjusts the preview dimensions and available device frames." defaultCollapsed={false}>
        <Select
          label="Platform"
          value={platform}
          onChange={handlePlatformChange}
          options={PLATFORM_OPTIONS.map((opt) => {
            if (opt.value === platform) return opt;
            const compatible = isPlatformCompatibleWithScreenshot(opt.value, screen.screenshotDims);
            return compatible
              ? opt
              : { ...opt, disabled: true, title: 'Incompatible with the uploaded screenshot aspect ratio' };
          })}
        />
      </Section>

      {/* Screenshot */}
      <Section title="Screenshot">
        {screen.screenshotUrl && (
          <div className="flex items-center gap-2 mb-2">
            <img
              src={screen.screenshotUrl}
              alt=""
              className="w-10 h-10 rounded object-cover border border-border"
            />
            <span className="text-xs text-text-dim truncate flex-1">
              {screen.screenshotName || 'Custom upload'}
            </span>
          </div>
        )}
        {!screen.screenshotUrl && screen.screenshotName && (
          <div className="text-xs text-text-dim mb-2">{screen.screenshotName}</div>
        )}
        <button
          className="btn-secondary w-full text-xs"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Screenshot
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          aria-label="Upload screenshot image"
          onChange={handleScreenshotUpload}
        />
        {screen.screenshotUrl && (
          <div className="flex gap-1 mt-1.5">
            <button
              className="btn-secondary flex-1 text-[11px]"
              onClick={() => setShowCrop(true)}
            >
              Crop
            </button>
            <button
              className="btn-secondary flex-1 text-[11px]"
              onClick={() =>
                update({ screenshotUrl: null, screenshotName: null, screenshotDims: null })
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

        {/* Koubou color swatches */}
        {hasColors && (
          <div className="mb-2.5">
            <label className="block text-xs text-text-dim mb-1">Color Variant</label>
            <div className="flex flex-wrap gap-1">
              {currentFamily.colors.map((c) => (
                <button
                  key={c.name}
                  className={`w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none ${
                    screen.deviceColor === c.name
                      ? 'border-accent ring-1 ring-accent'
                      : 'border-border'
                  }`}
                  style={{
                    background: KOUBOU_COLOR_HEX[c.name] ?? '#888888',
                  }}
                  title={c.name}
                  aria-label={`${c.name} color variant`}
                  aria-pressed={screen.deviceColor === c.name}
                  onClick={() => update({ deviceColor: c.name })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Frame style — hidden for Koubou PNG devices */}
        <TileGrid
          label="Frame Style"
          value={screen.frameStyle}
          onChange={(v) => update({ frameStyle: v as FrameStyle })}
          options={FRAME_STYLE_OPTIONS}
          columns={2}
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
                  min={0}
                  max={20}
                  formatValue={(v) => `${v}px`}
                  onChange={(v) =>
                    update({
                      borderSimulation: { ...screen.borderSimulation!, thickness: v },
                    })
                  }
                  onInstant={(v) => patchBorder({ thickness: v })}
                  resetTo={4}
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
                  onInstant={(v) => patchBorder({ radius: v })}
                  resetTo={40}
                />
              </>
            )}
          </>
        )}
      </Section>

      {/* Device Layout */}
      <Section title="Device Layout" tooltip="Control the size, position, rotation, and tilt of the device in the screenshot frame.">
        <Checkbox
          label="Fullscreen Screenshot"
          checked={screen.isFullscreen}
          onChange={(checked) => update({ isFullscreen: checked })}
        />
        {!screen.isFullscreen && (
          <>
            <TileGrid
              label="Layout"
              value={screen.layout}
              onChange={(v) => update({ layout: v as LayoutVariant })}
              options={LAYOUT_OPTIONS}
              columns={3}
            />
            <RangeSlider
              label="Device Size"
              value={screen.deviceScale}
              min={50}
              max={100}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ deviceScale: v })}
              onInstant={(v) => instantDevice('deviceScale', v)}
              resetTo={pd.deviceScale}
            />
            <RangeSlider
              label="Device Position"
              value={screen.deviceTop}
              min={-90}
              max={90}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ deviceTop: v })}
              onInstant={(v) => instantDevice('deviceTop', v)}
              resetTo={pd.deviceTop}
            />
            <RangeSlider
              label="Horizontal Position"
              value={screen.deviceOffsetX}
              min={-90}
              max={90}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ deviceOffsetX: v })}
              onInstant={(v) => instantDevice('deviceOffsetX', v)}
              resetTo={0}
            />
            <RangeSlider
              label="Device Rotation"
              value={screen.deviceRotation}
              min={-180}
              max={180}
              formatValue={(v) => `${v}\u00B0`}
              onChange={(v) => update({ deviceRotation: v })}
              onInstant={(v) => instantDevice('deviceRotation', v)}
              resetTo={0}
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
                resetTo={pd.deviceAngle}
              />
            )}
            <RangeSlider
              label="3D Tilt"
              value={screen.deviceTilt}
              min={0}
              max={40}
              formatValue={(v) => `${v}\u00B0`}
              onChange={(v) => update({ deviceTilt: v })}
              onInstant={(v) => instantDevice('deviceTilt', v)}
              resetTo={0}
            />
            {isFrameNone && (
              <RangeSlider
                label="Corner Radius"
                value={screen.cornerRadius}
                min={0}
                max={50}
                formatValue={(v) => `${v}%`}
                onChange={(v) => update({ cornerRadius: v })}
                resetTo={0}
              />
            )}
            {/* Layer controls — only meaningful when there's more
                than one device on the canvas. In single-device mode
                the primary has nothing to layer against. */}
            {reorder && screen.extraDevices.length > 0 && (
              <LayerControls
                canSendBack={reorder.canSendBack(0)}
                canSendForward={reorder.canSendForward(0)}
                onSendBack={() => reorder.sendBack(0)}
                onSendForward={() => reorder.sendForward(0)}
              />
            )}
            <button
              className="btn-secondary w-full text-[11px] mt-1"
              onClick={() =>
                update({
                  deviceScale: pd.deviceScale,
                  deviceTop: pd.deviceTop,
                  deviceRotation: 0,
                  deviceOffsetX: 0,
                  deviceAngle: pd.deviceAngle,
                  deviceTilt: 0,
                  cornerRadius: 0,
                  deviceZIndex: null,
                })
              }
            >
              Reset Device Position
            </button>
          </>
        )}
      </Section>

      {/* Device Shadow */}
      <Section
        title="Device Shadow"
        tooltip="Drop shadow behind the device. Opacity fades the whole shadow; Blur softens its edge; Vertical Offset pushes it downward to simulate a higher light angle. Blur at 0 with a large offset produces a crisp silhouette — that's the CSS primitive doing its job, not a bug."
        defaultCollapsed
      >
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
        <div className={!screen.deviceShadow ? 'opacity-40 pointer-events-none' : ''}>
          <RangeSlider
            label="Opacity"
            value={screen.deviceShadow ? Math.round(screen.deviceShadow.opacity * 100) : 25}
            min={0}
            max={100}
            formatValue={(v) => `${v}%`}
            onChange={(v) =>
              update({
                deviceShadow: { ...(screen.deviceShadow ?? { opacity: 0.25, blur: 20, color: '#000000', offsetY: 10 }), opacity: v / 100 },
              })
            }
            resetTo={25}
          />
          <RangeSlider
            label="Blur"
            value={screen.deviceShadow?.blur ?? 20}
            min={0}
            max={50}
            formatValue={(v) => `${v}px`}
            onChange={(v) =>
              update({
                deviceShadow: { ...(screen.deviceShadow ?? { opacity: 0.25, blur: 20, color: '#000000', offsetY: 10 }), blur: v },
              })
            }
            resetTo={20}
          />
          <ColorPicker
            label="Color"
            value={screen.deviceShadow?.color ?? '#000000'}
            onChange={(v) =>
              update({
                deviceShadow: { ...(screen.deviceShadow ?? { opacity: 0.25, blur: 20, color: '#000000', offsetY: 10 }), color: v },
              })
            }
          />
          <RangeSlider
            label="Vertical Offset"
            value={screen.deviceShadow?.offsetY ?? 10}
            min={0}
            max={30}
            formatValue={(v) => `${v}px`}
            onChange={(v) =>
              update({
                deviceShadow: { ...(screen.deviceShadow ?? { opacity: 0.25, blur: 20, color: '#000000', offsetY: 10 }), offsetY: v },
              })
            }
            resetTo={10}
          />
        </div>
      </Section>

      {/* Composition */}
      <Section title="Composition" tooltip="Choose how devices are arranged. Use multi-device layouts to show multiple app screens in one image." defaultCollapsed>
        <Select
          label="Device Arrangement"
          value={screen.composition}
          onChange={(v) => {
            const comp = v as CompositionPreset;
            const preset = COMPOSITION_PRESETS[comp];
            if (!preset) {
              update({ composition: comp });
              return;
            }
            const slot = preset.slots[0]!;
            const extraDevices: ExtraDeviceState[] =
              comp === 'single'
                ? []
                : Array.from({ length: preset.deviceCount - 1 }, () => ({
                    dataUrl: null,
                    name: null,
                    frameId: null,
                    offsetX: null,
                    offsetY: null,
                    scale: null,
                    rotation: null,
                    angle: null,
                    tilt: null,
                    zIndex: null,
                  }));
            update({
              composition: comp,
              deviceOffsetX: slot.offsetX,
              deviceTop: slot.offsetY,
              deviceScale: slot.scale,
              deviceRotation: slot.rotation,
              deviceAngle: slot.angle,
              deviceTilt: slot.tilt,
              extraDevices,
            });
          }}
          options={COMPOSITION_OPTIONS}
          groups={COMPOSITION_GROUPS}
        />

        {screen.extraDevices.length > 0 && (
          <ExtraDeviceSlots
            composition={screen.composition}
            extraDevices={screen.extraDevices}
            reorder={reorder}
            onChangeExtraDevice={(index, partial) => {
              const next = screen.extraDevices.map((d, i) => (i === index ? { ...d, ...partial } : d));
              update({ extraDevices: next });
            }}
            onRemoveExtraDevice={async (index) => {
              const ok = await confirmRemoveDevice({
                title: 'Remove device',
                message: `Remove this device from the screen? This cannot be undone.`,
                confirmLabel: 'Remove',
                destructive: true,
              });
              if (!ok) return;
              update({ extraDevices: screen.extraDevices.filter((_, i) => i !== index) });
            }}
            patchDevice={patchDevice}
          />
        )}

        {/* "+ Add device" appends a new ExtraDeviceState. Works in all
            composition modes — including 'single', where it adds a
            second device that renders via composition-devices.html.
            Extras beyond the preset's deviceCount use a centred
            fallback the user can drag + tune. */}
        <button
          className="btn-secondary w-full text-xs mt-2"
          onClick={() => {
            update({
              extraDevices: [
                ...screen.extraDevices,
                {
                  dataUrl: null,
                  name: null,
                  frameId: null,
                  offsetX: 0,
                  offsetY: 0,
                  scale: 80,
                  rotation: 0,
                  angle: 0,
                  tilt: 0,
                  zIndex: null,
                },
              ],
            });
          }}
        >
          + Add device
        </button>
      </Section>
    </>
  );
}

interface ReorderHandle {
  canSendBack: (slotIdx: number) => boolean;
  canSendForward: (slotIdx: number) => boolean;
  sendBack: (slotIdx: number) => void;
  sendForward: (slotIdx: number) => void;
}

interface ExtraDeviceSlotsProps {
  composition: CompositionPreset;
  extraDevices: ExtraDeviceState[];
  /** Stacking-order controls computed in DeviceTab; null when no screen
   *  is selected (defensive — should never happen at this point in the
   *  tree). */
  reorder: ReorderHandle | null;
  onChangeExtraDevice: (index: number, partial: Partial<ExtraDeviceState>) => void;
  /** Drop the extra at `index` from screen.extraDevices. */
  onRemoveExtraDevice: (index: number) => void;
  // Forwarded to each slot editor so its sliders can call patchDevice
  // with the slot's data-device-idx for live preview feedback.
  patchDevice: (partial: {
    deviceScale?: number;
    deviceTop?: number;
    deviceOffsetX?: number;
    deviceRotation?: number;
    deviceAngle?: number;
    deviceTilt?: number;
  }, deviceIdx?: number) => void;
}

// Fallback slot used for extras beyond the preset's deviceCount (added
// via "+ Add device"). Picks a sensible centred starting point that the
// user can immediately drag or tune via sliders — same defaults used
// when DeviceTab seeds a new extra.
const FALLBACK_SLOT_PRESET = {
  offsetX: 0,
  offsetY: 0,
  scale: 80,
  rotation: 0,
  angle: 0,
  tilt: 0,
} as const;

interface LayerControlsProps {
  label?: string;
  canSendBack: boolean;
  canSendForward: boolean;
  onSendBack: () => void;
  onSendForward: () => void;
}

// Two-button group rendered inside the device sections. "Send back" and
// "Bring forward" each swap z-order with the adjacent slot. Buttons
// disable when the slot is already at an extreme.
function LayerControls({ label = 'Layer', canSendBack, canSendForward, onSendBack, onSendForward }: LayerControlsProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-[11px] text-text-dim w-12 shrink-0">{label}</span>
      <div className="flex flex-1 gap-1">
        <button
          className="btn-secondary flex-1 text-[11px] py-1 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={onSendBack}
          disabled={!canSendBack}
          title="Send this device one step backward"
        >
          ↓ Send back
        </button>
        <button
          className="btn-secondary flex-1 text-[11px] py-1 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={onSendForward}
          disabled={!canSendForward}
          title="Bring this device one step forward"
        >
          ↑ Bring forward
        </button>
      </div>
    </div>
  );
}

function ExtraDeviceSlots({ composition, extraDevices, reorder, onChangeExtraDevice, onRemoveExtraDevice, patchDevice }: ExtraDeviceSlotsProps) {
  const preset = COMPOSITION_PRESETS[composition];
  if (!preset) return null;

  return (
    <>
      {extraDevices.map((extra, i) => {
        const slotIndex = i + 1;
        // Slots within the preset use the preset's per-slot defaults
        // (so "Reset to preset" restores the duo-overlap/etc. shape).
        // Slots beyond preset.deviceCount fall back to a centred default.
        const slotPreset = preset.slots[slotIndex] ?? FALLBACK_SLOT_PRESET;
        // "Remove" only applies to slots the user added manually via
        // "+ Add device" (i.e., beyond the preset's deviceCount).
        // Preset-seeded slots are part of the composition's shape —
        // the user should switch composition to change the layout
        // rather than half-deleting it. For duo-split (deviceCount=2),
        // slot 1 (= the seeded extra) is non-removable; slot 2+ are.
        const isUserAdded = slotIndex >= preset.deviceCount;
        return (
          <ExtraDeviceSlotEditor
            key={i}
            index={i}
            slotIndex={slotIndex}
            extra={extra}
            slotPreset={slotPreset}
            reorder={reorder}
            onChange={(partial) => onChangeExtraDevice(i, partial)}
            onRemove={isUserAdded ? () => onRemoveExtraDevice(i) : undefined}
            patchDevice={patchDevice}
          />
        );
      })}
    </>
  );
}

interface ExtraDeviceSlotEditorProps {
  index: number;
  slotIndex: number;
  extra: ExtraDeviceState;
  slotPreset: { offsetX: number; offsetY: number; scale: number; rotation: number; angle: number; tilt: number };
  reorder: ReorderHandle | null;
  onChange: (partial: Partial<ExtraDeviceState>) => void;
  /** Pass undefined to hide the Remove button (preset-seeded slots
   *  belong to the composition's shape and should be edited by
   *  switching composition, not by deletion). Only user-added slots
   *  beyond preset.deviceCount get a removal affordance. */
  onRemove: (() => void) | undefined;
  patchDevice: (partial: {
    deviceScale?: number;
    deviceTop?: number;
    deviceOffsetX?: number;
    deviceRotation?: number;
    deviceAngle?: number;
    deviceTilt?: number;
  }, deviceIdx?: number) => void;
}

function ExtraDeviceSlotEditor({ slotIndex, extra, slotPreset, reorder, onChange, onRemove, patchDevice }: ExtraDeviceSlotEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const uploaded = await uploadImageFile(file);
    onChange({ dataUrl: uploaded.url, name: uploaded.filename });
  };

  return (
    <Section title={`Slot ${slotIndex + 1}`} defaultCollapsed={slotIndex > 1}>
      {extra.dataUrl && (
        <div className="flex items-center gap-2 mb-2">
          <img
            src={extra.dataUrl}
            alt=""
            className="w-10 h-10 rounded object-cover border border-border"
          />
          <span className="text-xs text-text-dim truncate flex-1">
            {extra.name || 'Custom upload'}
          </span>
        </div>
      )}
      <button
        className="btn-secondary w-full text-xs"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload Screenshot
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        aria-label={`Upload screenshot for slot ${slotIndex + 1}`}
        onChange={handleUpload}
      />
      {extra.dataUrl && (
        <button
          className="btn-secondary w-full text-[11px] mt-1.5"
          onClick={() => onChange({ dataUrl: null, name: null })}
        >
          Revert
        </button>
      )}

      <div className="mt-3">
        <RangeSlider
          label="Horizontal Position"
          value={extra.offsetX ?? slotPreset.offsetX}
          min={-90}
          max={90}
          formatValue={(v) => `${v}%`}
          onChange={(v) => onChange({ offsetX: v })}
          onInstant={(v) => patchDevice({ deviceOffsetX: v }, slotIndex)}
          resetTo={slotPreset.offsetX}
        />
        <RangeSlider
          label="Vertical Position"
          value={extra.offsetY ?? slotPreset.offsetY}
          min={-90}
          max={90}
          formatValue={(v) => `${v}%`}
          onChange={(v) => onChange({ offsetY: v })}
          onInstant={(v) => patchDevice({ deviceTop: v }, slotIndex)}
          resetTo={slotPreset.offsetY}
        />
        <RangeSlider
          label="Scale"
          value={extra.scale ?? slotPreset.scale}
          min={50}
          max={150}
          formatValue={(v) => `${v}%`}
          onChange={(v) => onChange({ scale: v })}
          onInstant={(v) => patchDevice({ deviceScale: v }, slotIndex)}
          resetTo={slotPreset.scale}
        />
        <RangeSlider
          label="Rotation"
          value={extra.rotation ?? slotPreset.rotation}
          min={-180}
          max={180}
          formatValue={(v) => `${v}\u00B0`}
          onChange={(v) => onChange({ rotation: v })}
          onInstant={(v) => patchDevice({ deviceRotation: v }, slotIndex)}
          resetTo={slotPreset.rotation}
        />
        <RangeSlider
          label="Perspective Angle"
          value={extra.angle ?? slotPreset.angle}
          min={-45}
          max={45}
          formatValue={(v) => `${v}\u00B0`}
          onChange={(v) => onChange({ angle: v })}
          onInstant={(v) => patchDevice({ deviceAngle: v }, slotIndex)}
          resetTo={slotPreset.angle}
        />
        <RangeSlider
          label="3D Tilt"
          value={extra.tilt ?? slotPreset.tilt}
          min={-45}
          max={45}
          formatValue={(v) => `${v}\u00B0`}
          onChange={(v) => onChange({ tilt: v })}
          onInstant={(v) => patchDevice({ deviceTilt: v }, slotIndex)}
          resetTo={slotPreset.tilt}
        />
      </div>

      {reorder && (
        <LayerControls
          canSendBack={reorder.canSendBack(slotIndex)}
          canSendForward={reorder.canSendForward(slotIndex)}
          onSendBack={() => reorder.sendBack(slotIndex)}
          onSendForward={() => reorder.sendForward(slotIndex)}
        />
      )}
      <button
        className="btn-secondary w-full text-[11px] mt-1"
        onClick={() =>
          onChange({
            offsetX: null,
            offsetY: null,
            scale: null,
            rotation: null,
            angle: null,
            tilt: null,
            zIndex: null,
          })
        }
      >
        Reset slot to preset
      </button>
      {onRemove && (
        <button
          className="w-full text-[11px] mt-1 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
          onClick={onRemove}
        >
          Remove device
        </button>
      )}
    </Section>
  );
}
