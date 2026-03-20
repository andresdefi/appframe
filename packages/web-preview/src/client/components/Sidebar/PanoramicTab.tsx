import { useRef, useCallback, useMemo, useState } from 'react';
import { usePreviewStore } from '../../store';
import type { FrameData, DeviceFamily } from '../../store';
import type { PanoramicBackgroundLayer, PanoramicElement } from '../../types';
import { usePanoramicInstantPatch } from '../../hooks/usePanoramicInstantPatch';
import { Section } from '../Controls/Section';
import { ColorPicker } from '../Controls/ColorPicker';
import { RangeSlider } from '../Controls/RangeSlider';
import { Select } from '../Controls/Select';
import { Checkbox } from '../Controls/Checkbox';
import { GRADIENT_PRESETS, SOLID_PRESETS, KOUBOU_COLOR_HEX } from '../../utils/presets';
import { getDefaultFrameForPlatform } from '../../utils/deviceFrames';
import { buildFontGroups } from '../../utils/fontGroups';
import { getDefaultExportSizeKey, getPlatformPreviewSize } from '../../utils/platformSelection';
import { useConfirmDialog } from '../Controls/ConfirmDialog';

const ELEMENT_TYPE_LABELS: Record<string, string> = {
  device: 'Device',
  text: 'Text',
  label: 'Label',
  decoration: 'Decoration',
  image: 'Image',
  logo: 'Logo',
  crop: 'Crop',
  card: 'Card',
  badge: 'Badge',
  'proof-chip': 'Proof Chip',
  group: 'Group',
};

const BLEND_MODE_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'soft-light', label: 'Soft Light' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'lighten', label: 'Lighten' },
  { value: 'darken', label: 'Darken' },
] as const;

const PLATFORM_CATEGORIES: Record<string, string[]> = {
  iphone: ['iphone'],
  android: ['iphone'],
  ipad: ['ipad'],
  mac: ['mac'],
  watch: ['watch'],
};

const PLATFORM_SVG_TAGS: Record<string, string[]> = {
  iphone: ['default-ios', 'default-android'],
  android: ['default-ios', 'default-android'],
  ipad: ['default-ipad', 'fallback-tablet'],
  mac: [],
  watch: [],
};

function buildFrameGroups(deviceFamilies: DeviceFamily[], frames: FrameData[], platform?: string) {
  const allowedCategories = platform ? (PLATFORM_CATEGORIES[platform] ?? ['iphone']) : null;
  const allowedSvgTags = platform ? (PLATFORM_SVG_TAGS[platform] ?? []) : null;

  const grouped: Record<string, { value: string; label: string }[]> = {};
  for (const f of deviceFamilies) {
    const cat = f.category || 'other';
    if (allowedCategories && !allowedCategories.includes(cat)) continue;
    const list = grouped[cat] ?? [];
    list.push({ value: f.id, label: f.name });
    grouped[cat] = list;
  }
  const groups = Object.entries(grouped).map(([label, options]) => ({
    label: label.charAt(0).toUpperCase() + label.slice(1),
    options,
  }));

  const svgFrames: { value: string; label: string }[] = [];
  for (const fr of frames) {
    if (allowedSvgTags && allowedSvgTags.length > 0) {
      const frameTags = fr.tags ?? [];
      if (!frameTags.some((t) => allowedSvgTags.includes(t))) continue;
    } else if (allowedSvgTags && allowedSvgTags.length === 0) {
      continue;
    }
    svgFrames.push({ value: fr.id, label: fr.name });
  }
  if (svgFrames.length > 0) {
    groups.push({ label: 'SVG Frames', options: svgFrames });
  }
  return groups;
}

/**
 * Compute the sorted index for an element (since the template sorts by z-index).
 * This maps the store's element index to the data-index in the rendered HTML.
 */
function getSortedIndex(elements: PanoramicElement[], storeIndex: number): number {
  const sorted = elements.map((el, i) => ({ z: el.z, i })).sort((a, b) => a.z - b.z);
  return sorted.findIndex((s) => s.i === storeIndex);
}

function getElementSummary(element: PanoramicElement): string | null {
  if (element.type === 'text' || element.type === 'label') {
    return element.content.slice(0, 20);
  }
  if (element.type === 'badge') {
    return element.content.slice(0, 20);
  }
  if (element.type === 'proof-chip') {
    return element.value.slice(0, 20);
  }
  if (element.type === 'card') {
    return (element.title ?? element.body ?? 'Card').slice(0, 20);
  }
  if (element.type === 'logo') {
    return 'Brand mark';
  }
  if (element.type === 'group') {
    return `${element.children.length} items`;
  }
  return null;
}

function buildDefaultGroupElement(
  screenshot: string,
  x: number,
  y: number,
  rotation: number,
): PanoramicElement {
  return {
    type: 'group',
    x,
    y,
    width: 18,
    height: 28,
    rotation,
    opacity: 1,
    z: 8,
    children: [
      {
        type: 'crop',
        screenshot,
        x: 0,
        y: 0,
        width: 100,
        height: 62,
        focusX: 50,
        focusY: 40,
        zoom: 1.6,
        rotation: rotation > 0 ? -6 : 6,
        borderRadius: 24,
        z: 1,
      },
      {
        type: 'card',
        x: 10,
        y: 54,
        width: 82,
        height: 36,
        eyebrow: 'Highlight',
        title: 'Support detail',
        body: 'Grouped proof card.',
        align: 'left',
        backgroundColor: '#FFFFFF',
        opacity: 0.96,
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 24,
        padding: 2,
        rotation: 0,
        eyebrowColor: '#64748B',
        titleColor: '#0F172A',
        bodyColor: '#475569',
        eyebrowSize: 3.5,
        titleSize: 7.5,
        bodySize: 4.2,
        z: 2,
      },
    ],
  };
}

function ElementInspector({ index }: { index: number }) {
  const element = usePreviewStore((s) => s.panoramicElements[index]);
  const elements = usePreviewStore((s) => s.panoramicElements);
  const updateElement = usePreviewStore((s) => s.updatePanoramicElement);
  const removeElement = usePreviewStore((s) => s.removePanoramicElement);
  const config = usePreviewStore((s) => s.config);
  const deviceFamilies = usePreviewStore((s) => s.deviceFamilies);
  const frames = usePreviewStore((s) => s.frames);
  const fonts = usePreviewStore((s) => s.fonts);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { confirm, dialog } = useConfirmDialog();
  const { patchElement } = usePanoramicInstantPatch();

  const sortedIndex = useMemo(() => getSortedIndex(elements, index), [elements, index]);

  const update = useCallback(
    (partial: Partial<PanoramicElement>) => {
      updateElement(index, partial);
    },
    [index, updateElement],
  );

  const instant = useCallback(
    (partial: Record<string, number>) => {
      patchElement(sortedIndex, partial);
    },
    [patchElement, sortedIndex],
  );

  if (!element) return null;

  const platform = usePreviewStore((s) => s.platform);
  const frameGroups = buildFrameGroups(deviceFamilies, frames, platform);
  const defaultFrameId = config?.frames.ios ?? '';
  const currentFrameId = element.type === 'device' ? (element.frame ?? defaultFrameId) : '';
  const currentFamily = deviceFamilies.find((f) => f.id === currentFrameId);
  const hasColors = currentFamily && currentFamily.colors.length > 1;

  const fontGroups = useMemo(() => buildFontGroups(fonts), [fonts]);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      update({ screenshot: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      update({ src: ev.target?.result as string } as Partial<PanoramicElement>);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div>
      {dialog}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <span className="text-xs font-medium">
          {ELEMENT_TYPE_LABELS[element.type]} #
          {elements.slice(0, index).filter((e) => e.type === element.type).length + 1}
        </span>
        <button
          className="text-[10px] text-red-400 hover:text-red-300"
          onClick={async () => {
            const typeNum =
              elements.slice(0, index).filter((e) => e.type === element.type).length + 1;
            const ok = await confirm({
              title: 'Remove Element',
              message: `Remove ${ELEMENT_TYPE_LABELS[element.type]} #${typeNum}? This cannot be undone.`,
            });
            if (ok) removeElement(index);
          }}
        >
          Remove
        </button>
      </div>

      {/* Position — all element types */}
      <Section title="Position" defaultCollapsed={false}>
        <RangeSlider
          label="X %"
          value={element.x}
          min={-50}
          max={150}
          step={0.5}
          formatValue={(v) => `${v}%`}
          onChange={(v) => update({ x: v })}
          onInstant={(v) => instant({ x: v })}
        />
        <RangeSlider
          label="Y %"
          value={element.y}
          min={-50}
          max={150}
          step={0.5}
          formatValue={(v) => `${v}%`}
          onChange={(v) => update({ y: v })}
          onInstant={(v) => instant({ y: v })}
        />
        <RangeSlider
          label="Z-Index"
          value={element.z}
          min={0}
          max={100}
          onChange={(v) => update({ z: v })}
        />
      </Section>

      {element.type === 'group' && (
        <>
          <Section
            title="Group Layout"
            tooltip="Move and scale the full grouped composition as one unit."
          >
            <RangeSlider
              label="Width"
              value={element.width}
              min={4}
              max={100}
              step={0.5}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ width: v })}
              onInstant={(v) => instant({ width: v })}
            />
            <RangeSlider
              label="Height"
              value={element.height}
              min={4}
              max={100}
              step={0.5}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ height: v })}
              onInstant={(v) => instant({ height: v })}
            />
            <RangeSlider
              label="Rotation"
              value={element.rotation}
              min={-180}
              max={180}
              formatValue={(v) => `${v}\u00B0`}
              onChange={(v) => update({ rotation: v })}
              onInstant={(v) => instant({ rotation: v })}
            />
            <RangeSlider
              label="Opacity"
              value={element.opacity}
              min={0}
              max={1}
              step={0.05}
              formatValue={(v) => `${Math.round(v * 100)}%`}
              onChange={(v) => update({ opacity: v })}
              onInstant={(v) => instant({ opacity: v })}
            />
          </Section>

          <Section
            title="Children"
            tooltip="Child elements are positioned relative to this group box."
            defaultCollapsed
          >
            <div className="space-y-1">
              {element.children.map((child, childIndex) => (
                <div
                  key={childIndex}
                  className="rounded-md border border-border bg-surface-2 px-2.5 py-2 text-[11px] text-text-dim"
                >
                  <span className="font-medium text-text">
                    {ELEMENT_TYPE_LABELS[child.type]} #{childIndex + 1}
                  </span>
                  <span className="ml-1">
                    ({Math.round(child.x)}%, {Math.round(child.y)}%)
                  </span>
                  {getElementSummary(child) && (
                    <span className="ml-1 truncate">&mdash; {getElementSummary(child)}</span>
                  )}
                </div>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* ========== DEVICE ========== */}
      {element.type === 'device' &&
        (() => {
          const isFrameNone = (element.frameStyle ?? 'flat') === 'none';
          const isKoubouPng = currentFamily && currentFamily.screenRect;
          const isFullscreen = element.fullscreenScreenshot ?? false;
          return (
            <>
              <Section title="Screenshot">
                {element.screenshot.startsWith('data:') ? (
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={element.screenshot}
                      alt=""
                      className="w-10 h-10 rounded object-cover border border-border"
                    />
                    <span className="text-xs text-text-dim truncate flex-1">Custom upload</span>
                  </div>
                ) : (
                  <div className="text-xs text-text-dim mb-2 truncate">{element.screenshot}</div>
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
                  aria-label="Upload screenshot image"
                  onChange={handleScreenshotUpload}
                />
                {element.screenshot.startsWith('data:') && (
                  <button
                    className="w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1"
                    onClick={() =>
                      update({
                        screenshot: config?.screens[0]?.screenshot ?? 'screenshots/screen-1.png',
                      })
                    }
                  >
                    Revert to File
                  </button>
                )}
              </Section>

              <Section title="Device Frame">
                <Select
                  label="Frame"
                  value={currentFrameId}
                  onChange={(v) => {
                    const family = deviceFamilies.find((f) => f.id === v);
                    const isPng = family && family.screenRect;
                    if (isPng && isFrameNone) {
                      update({ frame: v, frameStyle: 'flat' } as Partial<PanoramicElement>);
                    } else {
                      update({ frame: v } as Partial<PanoramicElement>);
                    }
                  }}
                  groups={frameGroups}
                />
                {hasColors && (
                  <div className="mb-2.5">
                    <label className="block text-xs text-text-dim mb-1">Color Variant</label>
                    <div className="flex flex-wrap gap-1">
                      {currentFamily.colors.map((c) => (
                        <button
                          key={c.name}
                          className={`w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent ${element.deviceColor === c.name ? 'border-accent ring-1 ring-accent' : 'border-border'}`}
                          style={{ background: KOUBOU_COLOR_HEX[c.name] ?? '#888888' }}
                          title={c.name}
                          aria-label={`${c.name} color variant`}
                          aria-pressed={element.deviceColor === c.name}
                          onClick={() =>
                            update({ deviceColor: c.name } as Partial<PanoramicElement>)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
                <Select
                  label="Frame Style"
                  value={element.frameStyle ?? 'flat'}
                  onChange={(v) => update({ frameStyle: v } as Partial<PanoramicElement>)}
                  options={[
                    { value: 'flat', label: 'Flat' },
                    { value: 'none', label: 'None (frameless)' },
                  ]}
                  hidden={!!isKoubouPng}
                />
                {/* Border simulation — only when frameless */}
                {isFrameNone && (
                  <>
                    <Checkbox
                      label="Border Simulation"
                      checked={!!(element as { borderSimulation?: unknown }).borderSimulation}
                      onChange={(checked) =>
                        update({
                          borderSimulation: checked
                            ? { enabled: true, thickness: 4, color: '#1a1a1a', radius: 40 }
                            : undefined,
                        } as Partial<PanoramicElement>)
                      }
                    />
                    {(
                      element as {
                        borderSimulation?: { thickness: number; color: string; radius: number };
                      }
                    ).borderSimulation &&
                      (() => {
                        const bs = (
                          element as {
                            borderSimulation: { thickness: number; color: string; radius: number };
                          }
                        ).borderSimulation;
                        return (
                          <>
                            <RangeSlider
                              label="Thickness"
                              value={bs.thickness}
                              min={1}
                              max={20}
                              formatValue={(v) => `${v}px`}
                              onChange={(v) =>
                                update({
                                  borderSimulation: { ...bs, thickness: v },
                                } as Partial<PanoramicElement>)
                              }
                            />
                            <ColorPicker
                              label="Color"
                              value={bs.color}
                              onChange={(v) =>
                                update({
                                  borderSimulation: { ...bs, color: v },
                                } as Partial<PanoramicElement>)
                              }
                            />
                            <RangeSlider
                              label="Radius"
                              value={bs.radius}
                              min={0}
                              max={60}
                              formatValue={(v) => `${v}px`}
                              onChange={(v) =>
                                update({
                                  borderSimulation: { ...bs, radius: v },
                                } as Partial<PanoramicElement>)
                              }
                            />
                          </>
                        );
                      })()}
                  </>
                )}
              </Section>

              <Section
                title="Device Layout"
                tooltip="Control device scale, position, and fullscreen mode."
              >
                <Checkbox
                  label="Fullscreen Screenshot"
                  checked={isFullscreen}
                  onChange={(checked) =>
                    update({ fullscreenScreenshot: checked } as Partial<PanoramicElement>)
                  }
                />
                {!isFullscreen && (
                  <>
                    <RangeSlider
                      label="Device Size"
                      value={element.width}
                      min={5}
                      max={60}
                      step={0.5}
                      formatValue={(v) => `${v}%`}
                      onChange={(v) => update({ width: v })}
                      onInstant={(v) => instant({ width: v })}
                    />
                    <RangeSlider
                      label="Device Rotation"
                      value={element.rotation}
                      min={-180}
                      max={180}
                      formatValue={(v) => `${v}\u00B0`}
                      onChange={(v) => update({ rotation: v })}
                      onInstant={(v) => instant({ rotation: v })}
                    />
                    <RangeSlider
                      label="3D Tilt"
                      value={element.deviceTilt ?? 0}
                      min={0}
                      max={40}
                      formatValue={(v) => `${v}\u00B0`}
                      onChange={(v) => update({ deviceTilt: v } as Partial<PanoramicElement>)}
                    />
                    {isFrameNone && (
                      <RangeSlider
                        label="Corner Radius"
                        value={element.cornerRadius ?? 0}
                        min={0}
                        max={50}
                        formatValue={(v) => `${v}%`}
                        onChange={(v) => update({ cornerRadius: v } as Partial<PanoramicElement>)}
                      />
                    )}
                  </>
                )}
              </Section>

              <Section
                title="Device Shadow"
                tooltip="Add a custom shadow beneath the device frame."
                defaultCollapsed
              >
                <Checkbox
                  label="Custom Shadow"
                  checked={!!element.shadow}
                  onChange={(checked) =>
                    update({
                      shadow: checked
                        ? { opacity: 0.25, blur: 20, color: '#000000', offsetY: 10 }
                        : undefined,
                    } as Partial<PanoramicElement>)
                  }
                />
                {element.shadow && (
                  <>
                    <RangeSlider
                      label="Opacity"
                      value={Math.round(element.shadow.opacity * 100)}
                      min={0}
                      max={100}
                      formatValue={(v) => `${v}%`}
                      onChange={(v) => update({ shadow: { ...element.shadow!, opacity: v / 100 } })}
                    />
                    <RangeSlider
                      label="Blur"
                      value={element.shadow.blur}
                      min={0}
                      max={50}
                      formatValue={(v) => `${v}px`}
                      onChange={(v) => update({ shadow: { ...element.shadow!, blur: v } })}
                    />
                    <ColorPicker
                      label="Color"
                      value={element.shadow.color}
                      onChange={(v) => update({ shadow: { ...element.shadow!, color: v } })}
                    />
                    <RangeSlider
                      label="Y Offset"
                      value={element.shadow.offsetY}
                      min={0}
                      max={30}
                      formatValue={(v) => `${v}px`}
                      onChange={(v) => update({ shadow: { ...element.shadow!, offsetY: v } })}
                    />
                  </>
                )}
              </Section>
            </>
          );
        })()}

      {/* ========== TEXT ========== */}
      {element.type === 'text' && (
        <>
          <Section title="Content">
            <div className="mb-2.5">
              <label className="block text-xs text-text-dim mb-1">Headline</label>
              <textarea
                rows={3}
                value={element.content}
                onChange={(e) => update({ content: e.target.value })}
                className="w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[60px]"
              />
            </div>
            <ColorPicker
              label="Color"
              value={element.color}
              onChange={(v) => update({ color: v })}
            />
          </Section>

          <Section
            title="Typography"
            tooltip="Control font family, weight, size, and styling for this element."
          >
            <Select
              label="Font"
              value={(element as { font?: string }).font ?? config?.theme.font ?? 'inter'}
              onChange={(v) => update({ font: v } as Partial<PanoramicElement>)}
              groups={fontGroups}
            />
            <RangeSlider
              label="Font Size"
              value={element.fontSize}
              min={0.5}
              max={20}
              step={0.1}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ fontSize: v })}
              onInstant={(v) => instant({ fontSize: v })}
            />
            <RangeSlider
              label="Font Weight"
              value={element.fontWeight}
              min={100}
              max={900}
              step={100}
              formatValue={(v) => String(v)}
              onChange={(v) => update({ fontWeight: v })}
              onInstant={(v) => instant({ fontWeight: v })}
            />
            <Select
              label="Alignment"
              value={element.textAlign}
              onChange={(v) => update({ textAlign: v as 'left' | 'center' | 'right' })}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
              ]}
            />
            <RangeSlider
              label="Line Height"
              value={element.lineHeight}
              min={0.8}
              max={2}
              step={0.05}
              formatValue={(v) => v.toFixed(2)}
              onChange={(v) => update({ lineHeight: v })}
            />
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <Select
                  label="Case"
                  value={(element as { textTransform?: string }).textTransform ?? ''}
                  onChange={(v) => update({ textTransform: v } as Partial<PanoramicElement>)}
                  options={[
                    { value: '', label: 'Auto' },
                    { value: 'none', label: 'None' },
                    { value: 'uppercase', label: 'Uppercase' },
                    { value: 'lowercase', label: 'Lowercase' },
                    { value: 'capitalize', label: 'Capitalize' },
                  ]}
                />
              </div>
              <div className="flex-1">
                <Select
                  label="Style"
                  value={element.fontStyle}
                  onChange={(v) => update({ fontStyle: v as 'normal' | 'italic' })}
                  options={[
                    { value: 'normal', label: 'Normal' },
                    { value: 'italic', label: 'Italic' },
                  ]}
                />
              </div>
            </div>
            <RangeSlider
              label="Letter Spacing"
              value={(element as { letterSpacing?: number }).letterSpacing ?? 0}
              min={-5}
              max={10}
              formatValue={(v) => (v === 0 ? 'Auto' : `${v / 100}em`)}
              onChange={(v) => update({ letterSpacing: v } as Partial<PanoramicElement>)}
            />
            <RangeSlider
              label="Rotation"
              value={(element as { rotation?: number }).rotation ?? 0}
              min={-30}
              max={30}
              formatValue={(v) => `${v}\u00B0`}
              onChange={(v) => update({ rotation: v } as Partial<PanoramicElement>)}
            />
          </Section>

          <Section
            title="Text Gradient"
            tooltip="Apply a gradient color effect to the text."
            defaultCollapsed
          >
            <Checkbox
              label="Enable Gradient"
              checked={!!(element as { gradient?: unknown }).gradient}
              onChange={(checked) =>
                update({
                  gradient: checked
                    ? {
                        type: 'linear',
                        colors: ['#6366f1', '#ec4899'],
                        direction: 135,
                        radialPosition: 'center',
                      }
                    : undefined,
                } as Partial<PanoramicElement>)
              }
            />
            {(
              element as {
                gradient?: {
                  type: string;
                  colors: string[];
                  direction: number;
                  radialPosition: string;
                };
              }
            ).gradient &&
              (() => {
                const g = (
                  element as {
                    gradient: {
                      type: string;
                      colors: string[];
                      direction: number;
                      radialPosition: string;
                    };
                  }
                ).gradient;
                return (
                  <>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {GRADIENT_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          className="w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none"
                          style={{
                            background: `linear-gradient(${preset.direction}deg, ${preset.colors.join(', ')})`,
                          }}
                          title={preset.name}
                          aria-label={`Apply ${preset.name} gradient`}
                          onClick={() =>
                            update({
                              gradient: {
                                type: 'linear',
                                colors: [...preset.colors],
                                direction: preset.direction,
                                radialPosition: 'center',
                              },
                            } as Partial<PanoramicElement>)
                          }
                        />
                      ))}
                    </div>
                    <RangeSlider
                      label="Direction"
                      value={g.direction}
                      min={0}
                      max={360}
                      formatValue={(v) => `${v}\u00B0`}
                      onChange={(v) =>
                        update({ gradient: { ...g, direction: v } } as Partial<PanoramicElement>)
                      }
                    />
                    {g.colors.map((color, i) => (
                      <ColorPicker
                        key={i}
                        label={`Stop ${i + 1}`}
                        value={color}
                        onChange={(v) => {
                          const colors = [...g.colors];
                          colors[i] = v;
                          update({ gradient: { ...g, colors } } as Partial<PanoramicElement>);
                        }}
                      />
                    ))}
                  </>
                );
              })()}
          </Section>

          <Section title="Layout">
            <Checkbox
              label="Limit width"
              checked={element.maxWidth !== undefined}
              onChange={(checked) =>
                update({
                  maxWidth: checked ? 25 : undefined,
                } as Partial<PanoramicElement>)
              }
            />
            {element.maxWidth !== undefined && (
              <RangeSlider
                label="Max Width %"
                value={element.maxWidth}
                min={5}
                max={100}
                step={0.5}
                formatValue={(v) => `${v}%`}
                onChange={(v) => update({ maxWidth: v })}
              />
            )}
          </Section>
        </>
      )}

      {/* ========== IMAGE / LOGO ========== */}
      {(element.type === 'image' || element.type === 'logo') && (
        <>
          <Section title={element.type === 'logo' ? 'Logo Asset' : 'Image Asset'}>
            {element.src.startsWith('data:') ? (
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={element.src}
                  alt=""
                  className="w-10 h-10 rounded object-cover border border-border"
                />
                <span className="text-xs text-text-dim truncate flex-1">Custom upload</span>
              </div>
            ) : (
              <div className="text-xs text-text-dim mb-2 truncate">{element.src}</div>
            )}
            <button
              className="w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
              onClick={() => imageInputRef.current?.click()}
            >
              {element.type === 'logo' ? 'Upload Logo' : 'Upload Image'}
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              aria-label="Upload panoramic image"
              onChange={handleImageUpload}
            />
          </Section>

          <Section title="Layout">
            <RangeSlider
              label="Width"
              value={element.width}
              min={0.5}
              max={100}
              step={0.5}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ width: v })}
              onInstant={(v) => instant({ width: v })}
            />
            <RangeSlider
              label="Height"
              value={element.height}
              min={0.5}
              max={100}
              step={0.5}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ height: v })}
              onInstant={(v) => instant({ height: v })}
            />
            <Select
              label="Fit"
              value={element.fit}
              onChange={(v) => update({ fit: v as 'contain' | 'cover' })}
              options={[
                { value: 'contain', label: 'Contain' },
                { value: 'cover', label: 'Cover' },
              ]}
            />
            <RangeSlider
              label="Opacity"
              value={element.opacity}
              min={0}
              max={1}
              step={0.05}
              formatValue={(v) => `${Math.round(v * 100)}%`}
              onChange={(v) => update({ opacity: v })}
              onInstant={(v) => instant({ opacity: v })}
            />
            <RangeSlider
              label="Rotation"
              value={element.rotation}
              min={-180}
              max={180}
              formatValue={(v) => `${v}\u00B0`}
              onChange={(v) => update({ rotation: v })}
              onInstant={(v) => instant({ rotation: v })}
            />
            <RangeSlider
              label="Border Radius"
              value={element.borderRadius}
              min={0}
              max={100}
              formatValue={(v) => `${v}px`}
              onChange={(v) => update({ borderRadius: v })}
            />
            {element.type === 'logo' && (
              <>
                <RangeSlider
                  label="Padding"
                  value={element.padding}
                  min={0}
                  max={10}
                  step={0.1}
                  formatValue={(v) => `${v}%`}
                  onChange={(v) => update({ padding: v })}
                />
                <ColorPicker
                  label="Background"
                  value={element.backgroundColor ?? '#FFFFFF'}
                  onChange={(v) => update({ backgroundColor: v })}
                />
              </>
            )}
          </Section>

          <Section title="Shadow" defaultCollapsed>
            <Checkbox
              label="Custom Shadow"
              checked={!!element.shadow}
              onChange={(checked) =>
                update({
                  shadow: checked
                    ? { opacity: 0.2, blur: 24, color: '#000000', offsetY: 8 }
                    : undefined,
                } as Partial<PanoramicElement>)
              }
            />
            {element.shadow && (
              <>
                <RangeSlider
                  label="Opacity"
                  value={Math.round(element.shadow.opacity * 100)}
                  min={0}
                  max={100}
                  formatValue={(v) => `${v}%`}
                  onChange={(v) =>
                    update({
                      shadow: { ...element.shadow!, opacity: v / 100 },
                    } as Partial<PanoramicElement>)
                  }
                />
                <RangeSlider
                  label="Blur"
                  value={element.shadow.blur}
                  min={0}
                  max={50}
                  formatValue={(v) => `${v}px`}
                  onChange={(v) =>
                    update({ shadow: { ...element.shadow!, blur: v } } as Partial<PanoramicElement>)
                  }
                />
                <ColorPicker
                  label="Color"
                  value={element.shadow.color}
                  onChange={(v) =>
                    update({
                      shadow: { ...element.shadow!, color: v },
                    } as Partial<PanoramicElement>)
                  }
                />
                <RangeSlider
                  label="Y Offset"
                  value={element.shadow.offsetY}
                  min={0}
                  max={30}
                  formatValue={(v) => `${v}px`}
                  onChange={(v) =>
                    update({
                      shadow: { ...element.shadow!, offsetY: v },
                    } as Partial<PanoramicElement>)
                  }
                />
              </>
            )}
          </Section>
        </>
      )}

      {/* ========== CROP ========== */}
      {element.type === 'crop' && (
        <>
          <Section title="Source Screenshot">
            {element.screenshot.startsWith('data:') ? (
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={element.screenshot}
                  alt=""
                  className="w-10 h-10 rounded object-cover border border-border"
                />
                <span className="text-xs text-text-dim truncate flex-1">Custom upload</span>
              </div>
            ) : (
              <div className="text-xs text-text-dim mb-2 truncate">{element.screenshot}</div>
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
              aria-label="Upload crop screenshot"
              onChange={handleScreenshotUpload}
            />
          </Section>

          <Section title="Crop Frame">
            <RangeSlider
              label="Width"
              value={element.width}
              min={1}
              max={100}
              step={0.5}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ width: v })}
              onInstant={(v) => instant({ width: v })}
            />
            <RangeSlider
              label="Height"
              value={element.height}
              min={1}
              max={100}
              step={0.5}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ height: v })}
              onInstant={(v) => instant({ height: v })}
            />
            <RangeSlider
              label="Zoom"
              value={element.zoom}
              min={1}
              max={4}
              step={0.05}
              formatValue={(v) => `${v.toFixed(2)}x`}
              onChange={(v) => update({ zoom: v })}
            />
            <RangeSlider
              label="Focus X"
              value={element.focusX}
              min={0}
              max={100}
              step={1}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ focusX: v })}
            />
            <RangeSlider
              label="Focus Y"
              value={element.focusY}
              min={0}
              max={100}
              step={1}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ focusY: v })}
            />
            <RangeSlider
              label="Rotation"
              value={element.rotation}
              min={-180}
              max={180}
              formatValue={(v) => `${v}\u00B0`}
              onChange={(v) => update({ rotation: v })}
              onInstant={(v) => instant({ rotation: v })}
            />
            <RangeSlider
              label="Border Radius"
              value={element.borderRadius}
              min={0}
              max={100}
              formatValue={(v) => `${v}px`}
              onChange={(v) => update({ borderRadius: v })}
            />
          </Section>

          <Section title="Shadow" defaultCollapsed>
            <Checkbox
              label="Custom Shadow"
              checked={!!element.shadow}
              onChange={(checked) =>
                update({
                  shadow: checked
                    ? { opacity: 0.22, blur: 28, color: '#000000', offsetY: 10 }
                    : undefined,
                } as Partial<PanoramicElement>)
              }
            />
            {element.shadow && (
              <>
                <RangeSlider
                  label="Opacity"
                  value={Math.round(element.shadow.opacity * 100)}
                  min={0}
                  max={100}
                  formatValue={(v) => `${v}%`}
                  onChange={(v) =>
                    update({ shadow: { ...element.shadow!, opacity: v / 100 } } as Partial<PanoramicElement>)
                  }
                />
                <RangeSlider
                  label="Blur"
                  value={element.shadow.blur}
                  min={0}
                  max={60}
                  formatValue={(v) => `${v}px`}
                  onChange={(v) =>
                    update({ shadow: { ...element.shadow!, blur: v } } as Partial<PanoramicElement>)
                  }
                />
                <ColorPicker
                  label="Color"
                  value={element.shadow.color}
                  onChange={(v) =>
                    update({ shadow: { ...element.shadow!, color: v } } as Partial<PanoramicElement>)
                  }
                />
                <RangeSlider
                  label="Y Offset"
                  value={element.shadow.offsetY}
                  min={0}
                  max={40}
                  formatValue={(v) => `${v}px`}
                  onChange={(v) =>
                    update({ shadow: { ...element.shadow!, offsetY: v } } as Partial<PanoramicElement>)
                  }
                />
              </>
            )}
          </Section>
        </>
      )}

      {/* ========== CARD ========== */}
      {element.type === 'card' && (
        <>
          <Section title="Card Content">
            <div className="mb-2.5">
              <label className="block text-xs text-text-dim mb-1">Eyebrow</label>
              <input
                type="text"
                className="w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] outline-none focus:border-accent"
                value={element.eyebrow ?? ''}
                onChange={(e) => update({ eyebrow: e.target.value || undefined })}
              />
            </div>
            <div className="mb-2.5">
              <label className="block text-xs text-text-dim mb-1">Title</label>
              <textarea
                rows={2}
                value={element.title ?? ''}
                onChange={(e) => update({ title: e.target.value || undefined })}
                className="w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[48px]"
              />
            </div>
            <div className="mb-2.5">
              <label className="block text-xs text-text-dim mb-1">Body</label>
              <textarea
                rows={3}
                value={element.body ?? ''}
                onChange={(e) => update({ body: e.target.value || undefined })}
                className="w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[64px]"
              />
            </div>
          </Section>

          <Section title="Card Layout">
            <RangeSlider
              label="Width"
              value={element.width}
              min={1}
              max={100}
              step={0.5}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ width: v })}
              onInstant={(v) => instant({ width: v })}
            />
            <RangeSlider
              label="Height"
              value={element.height}
              min={1}
              max={100}
              step={0.5}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ height: v })}
              onInstant={(v) => instant({ height: v })}
            />
            <Select
              label="Alignment"
              value={element.align}
              onChange={(v) => update({ align: v as 'left' | 'center' })}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
              ]}
            />
            <RangeSlider
              label="Padding"
              value={element.padding}
              min={0}
              max={10}
              step={0.1}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ padding: v })}
            />
            <RangeSlider
              label="Opacity"
              value={element.opacity}
              min={0}
              max={1}
              step={0.05}
              formatValue={(v) => `${Math.round(v * 100)}%`}
              onChange={(v) => update({ opacity: v })}
              onInstant={(v) => instant({ opacity: v })}
            />
            <RangeSlider
              label="Rotation"
              value={element.rotation}
              min={-180}
              max={180}
              formatValue={(v) => `${v}\u00B0`}
              onChange={(v) => update({ rotation: v })}
              onInstant={(v) => instant({ rotation: v })}
            />
            <RangeSlider
              label="Border Radius"
              value={element.borderRadius}
              min={0}
              max={100}
              formatValue={(v) => `${v}px`}
              onChange={(v) => update({ borderRadius: v })}
            />
            <RangeSlider
              label="Border Width"
              value={element.borderWidth}
              min={0}
              max={20}
              formatValue={(v) => `${v}px`}
              onChange={(v) => update({ borderWidth: v })}
            />
          </Section>

          <Section title="Card Colors" defaultCollapsed>
            <ColorPicker
              label="Background"
              value={element.backgroundColor}
              onChange={(v) => update({ backgroundColor: v })}
            />
            <ColorPicker
              label="Border"
              value={element.borderColor ?? '#E2E8F0'}
              onChange={(v) => update({ borderColor: v })}
            />
            <ColorPicker
              label="Eyebrow"
              value={element.eyebrowColor}
              onChange={(v) => update({ eyebrowColor: v })}
            />
            <ColorPicker
              label="Title"
              value={element.titleColor}
              onChange={(v) => update({ titleColor: v })}
            />
            <ColorPicker
              label="Body"
              value={element.bodyColor}
              onChange={(v) => update({ bodyColor: v })}
            />
          </Section>

          <Section title="Typography" defaultCollapsed>
            <RangeSlider
              label="Eyebrow Size"
              value={element.eyebrowSize}
              min={0.5}
              max={6}
              step={0.1}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ eyebrowSize: v })}
            />
            <RangeSlider
              label="Title Size"
              value={element.titleSize}
              min={0.5}
              max={10}
              step={0.1}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ titleSize: v })}
            />
            <RangeSlider
              label="Body Size"
              value={element.bodySize}
              min={0.5}
              max={6}
              step={0.1}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ bodySize: v })}
            />
          </Section>

          <Section title="Shadow" defaultCollapsed>
            <Checkbox
              label="Custom Shadow"
              checked={!!element.shadow}
              onChange={(checked) =>
                update({
                  shadow: checked
                    ? { opacity: 0.18, blur: 24, color: '#000000', offsetY: 8 }
                    : undefined,
                } as Partial<PanoramicElement>)
              }
            />
            {element.shadow && (
              <>
                <RangeSlider
                  label="Opacity"
                  value={Math.round(element.shadow.opacity * 100)}
                  min={0}
                  max={100}
                  formatValue={(v) => `${v}%`}
                  onChange={(v) =>
                    update({ shadow: { ...element.shadow!, opacity: v / 100 } } as Partial<PanoramicElement>)
                  }
                />
                <RangeSlider
                  label="Blur"
                  value={element.shadow.blur}
                  min={0}
                  max={60}
                  formatValue={(v) => `${v}px`}
                  onChange={(v) =>
                    update({ shadow: { ...element.shadow!, blur: v } } as Partial<PanoramicElement>)
                  }
                />
                <ColorPicker
                  label="Color"
                  value={element.shadow.color}
                  onChange={(v) =>
                    update({ shadow: { ...element.shadow!, color: v } } as Partial<PanoramicElement>)
                  }
                />
                <RangeSlider
                  label="Y Offset"
                  value={element.shadow.offsetY}
                  min={0}
                  max={40}
                  formatValue={(v) => `${v}px`}
                  onChange={(v) =>
                    update({ shadow: { ...element.shadow!, offsetY: v } } as Partial<PanoramicElement>)
                  }
                />
              </>
            )}
          </Section>
        </>
      )}

      {/* ========== BADGE ========== */}
      {element.type === 'badge' && (
        <>
          <Section title="Badge Content">
            <div className="mb-2.5">
              <label className="block text-xs text-text-dim mb-1">Text</label>
              <input
                type="text"
                className="w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] outline-none focus:border-accent"
                value={element.content}
                onChange={(e) => update({ content: e.target.value })}
              />
            </div>
          </Section>

          <Section title="Badge Layout">
            <RangeSlider
              label="Width"
              value={element.width}
              min={1}
              max={100}
              step={0.5}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ width: v })}
              onInstant={(v) => instant({ width: v })}
            />
            <RangeSlider
              label="Height"
              value={element.height}
              min={0.5}
              max={40}
              step={0.5}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ height: v })}
              onInstant={(v) => instant({ height: v })}
            />
            <RangeSlider
              label="Font Size"
              value={element.fontSize}
              min={0.5}
              max={6}
              step={0.1}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ fontSize: v })}
            />
            <RangeSlider
              label="Rotation"
              value={element.rotation}
              min={-180}
              max={180}
              formatValue={(v) => `${v}\u00B0`}
              onChange={(v) => update({ rotation: v })}
              onInstant={(v) => instant({ rotation: v })}
            />
            <RangeSlider
              label="Border Radius"
              value={element.borderRadius}
              min={0}
              max={100}
              formatValue={(v) => `${v}px`}
              onChange={(v) => update({ borderRadius: v })}
            />
            <RangeSlider
              label="Opacity"
              value={element.opacity}
              min={0}
              max={1}
              step={0.05}
              formatValue={(v) => `${Math.round(v * 100)}%`}
              onChange={(v) => update({ opacity: v })}
              onInstant={(v) => instant({ opacity: v })}
            />
          </Section>

          <Section title="Badge Style" defaultCollapsed>
            <ColorPicker
              label="Text"
              value={element.color}
              onChange={(v) => update({ color: v })}
            />
            <ColorPicker
              label="Background"
              value={element.backgroundColor}
              onChange={(v) => update({ backgroundColor: v })}
            />
            <ColorPicker
              label="Border"
              value={element.borderColor ?? '#FFFFFF'}
              onChange={(v) => update({ borderColor: v })}
            />
            <RangeSlider
              label="Border Width"
              value={element.borderWidth}
              min={0}
              max={8}
              step={0.5}
              formatValue={(v) => `${v}px`}
              onChange={(v) => update({ borderWidth: v })}
            />
          </Section>
        </>
      )}

      {element.type === 'proof-chip' && (
        <>
          <Section title="Proof Chip Content">
            <div className="mb-2.5">
              <label className="block text-xs text-text-dim mb-1">Value</label>
              <input
                type="text"
                className="w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] outline-none focus:border-accent"
                value={element.value}
                onChange={(e) => update({ value: e.target.value })}
              />
            </div>
            <div className="mb-2.5">
              <label className="block text-xs text-text-dim mb-1">Detail</label>
              <input
                type="text"
                className="w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] outline-none focus:border-accent"
                value={element.detail ?? ''}
                onChange={(e) => update({ detail: e.target.value || undefined })}
                placeholder="App Store rating"
              />
            </div>
            <RangeSlider
              label="Rating"
              value={element.rating ?? 0}
              min={0}
              max={5}
              step={0.1}
              formatValue={(v) => (v === 0 ? 'Off' : `${v.toFixed(1)}★`)}
              onChange={(v) => update({ rating: v === 0 ? undefined : Number(v.toFixed(1)) })}
            />
          </Section>

          <Section title="Proof Chip Layout">
            <RangeSlider
              label="Width"
              value={element.width}
              min={1}
              max={100}
              step={0.5}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ width: v })}
              onInstant={(v) => instant({ width: v })}
            />
            <RangeSlider
              label="Height"
              value={element.height}
              min={1}
              max={40}
              step={0.5}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ height: v })}
              onInstant={(v) => instant({ height: v })}
            />
            <RangeSlider
              label="Value Size"
              value={element.valueSize}
              min={0.5}
              max={8}
              step={0.1}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ valueSize: v })}
            />
            <RangeSlider
              label="Detail Size"
              value={element.detailSize}
              min={0.5}
              max={6}
              step={0.1}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ detailSize: v })}
            />
            <RangeSlider
              label="Padding"
              value={element.padding}
              min={0}
              max={10}
              step={0.1}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ padding: v })}
            />
            <RangeSlider
              label="Rotation"
              value={element.rotation}
              min={-180}
              max={180}
              formatValue={(v) => `${v}\u00B0`}
              onChange={(v) => update({ rotation: v })}
              onInstant={(v) => instant({ rotation: v })}
            />
            <RangeSlider
              label="Opacity"
              value={element.opacity}
              min={0}
              max={1}
              step={0.05}
              formatValue={(v) => `${Math.round(v * 100)}%`}
              onChange={(v) => update({ opacity: v })}
              onInstant={(v) => instant({ opacity: v })}
            />
          </Section>

          <Section title="Proof Chip Style" defaultCollapsed>
            <ColorPicker label="Text" value={element.color} onChange={(v) => update({ color: v })} />
            <ColorPicker label="Muted Text" value={element.mutedColor} onChange={(v) => update({ mutedColor: v })} />
            <ColorPicker label="Star Color" value={element.starColor} onChange={(v) => update({ starColor: v })} />
            <ColorPicker
              label="Background"
              value={element.backgroundColor}
              onChange={(v) => update({ backgroundColor: v })}
            />
            <ColorPicker
              label="Border"
              value={element.borderColor ?? '#CBD5E1'}
              onChange={(v) => update({ borderColor: v })}
            />
            <RangeSlider
              label="Border Width"
              value={element.borderWidth}
              min={0}
              max={8}
              step={0.5}
              formatValue={(v) => `${v}px`}
              onChange={(v) => update({ borderWidth: v })}
            />
            <RangeSlider
              label="Border Radius"
              value={element.borderRadius}
              min={0}
              max={100}
              formatValue={(v) => `${v}px`}
              onChange={(v) => update({ borderRadius: v })}
            />
          </Section>
        </>
      )}

      {/* ========== LABEL ========== */}
      {element.type === 'label' && (
        <Section title="Label">
          <div className="mb-2.5">
            <label className="block text-xs text-text-dim mb-1">Content</label>
            <input
              type="text"
              className="w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] outline-none focus:border-accent"
              value={element.content}
              onChange={(e) => update({ content: e.target.value })}
            />
          </div>
          <RangeSlider
            label="Font Size"
            value={element.fontSize}
            min={0.5}
            max={10}
            step={0.1}
            formatValue={(v) => `${v}%`}
            onChange={(v) => update({ fontSize: v })}
            onInstant={(v) => instant({ fontSize: v })}
          />
          <ColorPicker
            label="Text Color"
            value={element.color}
            onChange={(v) => update({ color: v })}
          />
          <ColorPicker
            label="Background"
            value={element.backgroundColor ?? '#00000033'}
            onChange={(v) => update({ backgroundColor: v })}
          />
          <RangeSlider
            label="Padding"
            value={element.padding}
            min={0}
            max={5}
            step={0.1}
            formatValue={(v) => `${v}%`}
            onChange={(v) => update({ padding: v })}
          />
          <RangeSlider
            label="Border Radius"
            value={element.borderRadius}
            min={0}
            max={30}
            formatValue={(v) => `${v}px`}
            onChange={(v) => update({ borderRadius: v })}
          />
        </Section>
      )}

      {/* ========== DECORATION ========== */}
      {element.type === 'decoration' && (
        <Section title="Decoration">
          <Select
            label="Shape"
            value={element.shape}
            onChange={(v) => update({ shape: v as 'circle' | 'rectangle' | 'line' | 'dot-grid' })}
            options={[
              { value: 'circle', label: 'Circle' },
              { value: 'rectangle', label: 'Rectangle' },
              { value: 'line', label: 'Line' },
              { value: 'dot-grid', label: 'Dot Grid' },
            ]}
          />
          <RangeSlider
            label="Width"
            value={element.width}
            min={0.5}
            max={100}
            step={0.5}
            formatValue={(v) => `${v}%`}
            onChange={(v) => update({ width: v })}
            onInstant={(v) => instant({ width: v })}
          />
          {element.height !== undefined && (
            <RangeSlider
              label="Height"
              value={element.height}
              min={0.5}
              max={100}
              step={0.5}
              formatValue={(v) => `${v}%`}
              onChange={(v) => update({ height: v })}
              onInstant={(v) => instant({ height: v })}
            />
          )}
          <RangeSlider
            label="Opacity"
            value={element.opacity}
            min={0}
            max={1}
            step={0.05}
            formatValue={(v) => `${Math.round(v * 100)}%`}
            onChange={(v) => update({ opacity: v })}
            onInstant={(v) => instant({ opacity: v })}
          />
          <RangeSlider
            label="Rotation"
            value={element.rotation}
            min={-180}
            max={180}
            formatValue={(v) => `${v}\u00B0`}
            onChange={(v) => update({ rotation: v })}
            onInstant={(v) => instant({ rotation: v })}
          />
          <ColorPicker label="Color" value={element.color} onChange={(v) => update({ color: v })} />
        </Section>
      )}
    </div>
  );
}

function PanoramicBgImage({
  imageDataUrl,
  onUpload,
  onRemove,
  buttonLabel = 'Upload Background Image',
  alt = 'Background',
}: {
  imageDataUrl?: string;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
  buttonLabel?: string;
  alt?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpload(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  return (
    <>
      <button
        className="w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2"
        onClick={() => fileRef.current?.click()}
      >
        {buttonLabel}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        aria-label="Upload background image"
        onChange={handleFile}
      />
      {imageDataUrl && (
        <div className="mt-1.5">
          <img
            src={imageDataUrl}
            className="w-full max-h-20 object-cover rounded-md border border-border"
            alt={alt}
          />
          <button
            className="w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      )}
    </>
  );
}

function getBackgroundLayerLabel(layer: PanoramicBackgroundLayer): string {
  switch (layer.kind) {
    case 'gradient':
      return layer.gradientType === 'mesh' ? 'Mesh Gradient' : `${layer.gradientType} Gradient`;
    case 'image':
      return layer.fit === 'tile' ? 'Texture Layer' : 'Image Layer';
    case 'glow':
      return 'Glow Layer';
    case 'solid':
      return 'Solid Layer';
  }
}

function ScreenshotUploader() {
  const fileRef = useRef<HTMLInputElement>(null);
  const elements = usePreviewStore((s) => s.panoramicElements);
  const updateElement = usePreviewStore((s) => s.updatePanoramicElement);
  const addElement = usePreviewStore((s) => s.addPanoramicElement);

  const deviceElements = elements
    .map((el, i) => ({ el, i }))
    .filter(({ el }) => el.type === 'device');

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    files.forEach((file, fileIdx) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (fileIdx < deviceElements.length) {
          // Assign to existing device element
          updateElement(deviceElements[fileIdx]!.i, { screenshot: dataUrl });
        } else {
          // Create a new device element for this screenshot
          const deviceCount = deviceElements.length + (fileIdx - deviceElements.length);
          addElement({
            type: 'device',
            screenshot: dataUrl,
            frameStyle: 'flat',
            x: 10 + deviceCount * 20,
            y: 15,
            width: 12,
            rotation: 0,
            deviceScale: 92,
            deviceTop: 15,
            deviceOffsetX: 0,
            deviceAngle: 8,
            deviceTilt: 0,
            cornerRadius: 0,
            fullscreenScreenshot: false,
            z: 5,
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  return (
    <>
      <button
        className="w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
        onClick={() => fileRef.current?.click()}
      >
        Upload Screenshots
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        aria-label="Upload device screenshots"
        onChange={handleFiles}
      />
      {deviceElements.length > 0 && (
        <div className="mt-2 space-y-1">
          {deviceElements.map(({ el, i }) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-text-dim">
              <span className="w-4 text-center">
                {deviceElements.indexOf(deviceElements.find((d) => d.i === i)!) + 1}
              </span>
              {(el as { screenshot: string }).screenshot.startsWith('data:') ? (
                <img
                  src={(el as { screenshot: string }).screenshot}
                  alt=""
                  className="w-6 h-6 rounded object-cover border border-border"
                />
              ) : (
                <span className="truncate flex-1">{(el as { screenshot: string }).screenshot}</span>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="text-[10px] text-text-dim mt-1.5">
        Select multiple files to assign to device elements in order.
      </p>
    </>
  );
}

const PLATFORM_OPTIONS = [
  { value: 'iphone', label: 'iPhone' },
  { value: 'ipad', label: 'iPad' },
  { value: 'mac', label: 'Mac' },
  { value: 'watch', label: 'Apple Watch' },
  { value: 'android', label: 'Android' },
];

export function PanoramicTab() {
  const frameCount = usePreviewStore((s) => s.panoramicFrameCount);
  const elements = usePreviewStore((s) => s.panoramicElements);
  const selectedElementIndex = usePreviewStore((s) => s.selectedElementIndex);
  const setSelectedElement = usePreviewStore((s) => s.setSelectedElement);
  const addElement = usePreviewStore((s) => s.addPanoramicElement);
  const setFrameCount = usePreviewStore((s) => s.setPanoramicFrameCount);
  const background = usePreviewStore((s) => s.panoramicBackground);
  const updateBackground = usePreviewStore((s) => s.updatePanoramicBackground);
  const config = usePreviewStore((s) => s.config);
  const platform = usePreviewStore((s) => s.platform);
  const setPlatformRaw = usePreviewStore((s) => s.setPlatform);
  const setPreviewSize = usePreviewStore((s) => s.setPreviewSize);
  const sizes = usePreviewStore((s) => s.sizes);
  const setExportSize = usePreviewStore((s) => s.setExportSize);
  const syncPanoramicDevicesForPlatform = usePreviewStore((s) => s.syncPanoramicDevicesForPlatform);
  const deviceFamilies = usePreviewStore((s) => s.deviceFamilies);
  const { patchBackground } = usePanoramicInstantPatch();

  const handlePlatformChange = useCallback(
    (v: string) => {
      setPlatformRaw(v);
      syncPanoramicDevicesForPlatform(v);
      const size = getPlatformPreviewSize(v);
      setPreviewSize(size.w, size.h);
      const defaultExportSize = getDefaultExportSizeKey(sizes, v);
      if (defaultExportSize) setExportSize(defaultExportSize);
    },
    [setExportSize, setPlatformRaw, setPreviewSize, sizes, syncPanoramicDevicesForPlatform],
  );

  const instantBgColor = useCallback(
    (color: string) => patchBackground({ type: 'solid', color }),
    [patchBackground],
  );

  const instantGradient = useCallback(
    (overrides?: { direction?: number; colors?: string[] }) => {
      const g = background.gradient ?? {
        type: 'linear' as const,
        colors: ['#6366f1', '#ec4899'],
        direction: 135,
        radialPosition: 'center' as const,
      };
      patchBackground({
        type: 'gradient',
        gradientType: g.type,
        colors: overrides?.colors ?? g.colors,
        direction: overrides?.direction ?? g.direction,
        radialPosition: g.radialPosition,
      });
    },
    [background.gradient, patchBackground],
  );

  const addDevice = () => {
    // Use the next available screenshot from config
    const deviceCount = elements.filter((e) => e.type === 'device').length;
    const screenshot =
      config?.screens[deviceCount]?.screenshot ??
      config?.screens[0]?.screenshot ??
      'screenshots/screen-1.png';
    const defaultFrame = getDefaultFrameForPlatform(platform, deviceFamilies);
    addElement({
      type: 'device',
      screenshot,
      frame: defaultFrame,
      deviceColor: '',
      frameStyle: 'flat',
      x: 10 + deviceCount * 20,
      y: 15,
      width: 12,
      rotation: 0,
      deviceScale: 92,
      deviceTop: 15,
      deviceOffsetX: 0,
      deviceAngle: 8,
      deviceTilt: 0,
      cornerRadius: 0,
      fullscreenScreenshot: false,
      z: 5,
    });
  };

  const addText = () => {
    const textCount = elements.filter((e) => e.type === 'text').length;
    addElement({
      type: 'text',
      content: 'New headline',
      x: 5 + textCount * 20,
      y: 5,
      fontSize: 3.5,
      color: '#FFFFFF',
      fontWeight: 700,
      fontStyle: 'normal',
      textAlign: 'left',
      lineHeight: 1.15,
      letterSpacing: 0,
      textTransform: '',
      rotation: 0,
      maxWidth: 25,
      z: 10,
    });
  };

  const addLabel = () => {
    addElement({
      type: 'label',
      content: 'New Label',
      x: 50,
      y: 50,
      fontSize: 1.5,
      color: '#FFFFFF',
      backgroundColor: '#00000044',
      padding: 0.5,
      borderRadius: 8,
      z: 15,
    });
  };

  const addDecoration = () => {
    addElement({
      type: 'decoration',
      shape: 'circle',
      x: 50,
      y: 50,
      width: 5,
      height: 8,
      color: config?.theme.colors.primary ?? '#6366F1',
      opacity: 0.15,
      rotation: 0,
      z: 0,
    });
  };

  const addImage = () => {
    const imageCount = elements.filter((e) => e.type === 'image').length;
    addElement({
      type: 'image',
      src: config?.screens[0]?.screenshot ?? 'screenshots/screen-1.png',
      x: 8 + imageCount * 12,
      y: 58,
      width: 12,
      height: 12,
      fit: 'contain',
      opacity: 1,
      rotation: 0,
      borderRadius: 0,
      z: 6,
    });
  };

  const addCrop = () => {
    const cropCount = elements.filter((e) => e.type === 'crop').length;
    addElement({
      type: 'crop',
      screenshot: config?.screens[cropCount]?.screenshot ?? config?.screens[0]?.screenshot ?? 'screenshots/screen-1.png',
      x: 14 + cropCount * 14,
      y: 56,
      width: 12,
      height: 18,
      focusX: 50,
      focusY: 40,
      zoom: 1.5,
      rotation: cropCount % 2 === 0 ? -4 : 4,
      borderRadius: 24,
      z: 7,
    });
  };

  const addGroup = () => {
    const groupCount = elements.filter((e) => e.type === 'group').length;
    const screenshot =
      config?.screens[groupCount]?.screenshot ??
      config?.screens[0]?.screenshot ??
      'screenshots/screen-1.png';
    addElement(buildDefaultGroupElement(screenshot, 12 + groupCount * 14, 52, groupCount % 2 === 0 ? -4 : 4));
  };

  const addCard = () => {
    const cardCount = elements.filter((e) => e.type === 'card').length;
    addElement({
      type: 'card',
      x: 8 + cardCount * 12,
      y: 62,
      width: 18,
      height: 18,
      eyebrow: 'Highlight',
      title: 'Support detail',
      body: 'Use short proof or context here.',
      align: 'left',
      backgroundColor: '#FFFFFF',
      opacity: 0.96,
      borderColor: '#E2E8F0',
      borderWidth: 1,
      borderRadius: 28,
      padding: 2.2,
      rotation: 0,
      eyebrowColor: '#64748B',
      titleColor: '#0F172A',
      bodyColor: '#475569',
      eyebrowSize: 1.1,
      titleSize: 2.2,
      bodySize: 1.3,
      z: 9,
    });
  };

  // Background state
  const bgType = background.type;
  const bgColor = background.color ?? '#000000';
  const bgGradient = background.gradient ?? {
    type: 'linear' as const,
    colors: ['#6366f1', '#ec4899'],
    direction: 135,
    radialPosition: 'center' as const,
  };

  return (
    <div>
      {/* Canvas */}
      <Section title="Canvas" defaultCollapsed={false}>
        <Select
          label="Platform"
          value={platform}
          onChange={handlePlatformChange}
          options={PLATFORM_OPTIONS}
        />
        <RangeSlider
          label="Frame Count"
          value={frameCount}
          min={2}
          max={10}
          onChange={setFrameCount}
        />
      </Section>

      {/* Background */}
      <Section title="Background">
        {/* Type selector */}
        <div className="flex gap-3 mb-2.5">
          {(['solid', 'gradient', 'image', 'preset'] as const).map((t) => (
            <label key={t} className="text-xs text-text-dim cursor-pointer flex items-center gap-1">
              <input
                type="radio"
                name="pano-bg-type"
                value={t}
                checked={bgType === t}
                onChange={() => updateBackground({ type: t })}
                className="accent-accent"
              />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>

        {/* Preset */}
        {bgType === 'preset' && (
          <Select
            label="Style Preset"
            value={background.preset ?? ''}
            onChange={(v) => updateBackground({ preset: v })}
            options={[
              { value: '', label: 'Select a preset...' },
              { value: 'minimal', label: 'Minimal' },
              { value: 'bold', label: 'Bold' },
              { value: 'glow', label: 'Glow' },
              { value: 'playful', label: 'Playful' },
              { value: 'clean', label: 'Clean' },
              { value: 'branded', label: 'Branded' },
              { value: 'editorial', label: 'Editorial' },
            ]}
          />
        )}

        {/* Solid */}
        {bgType === 'solid' && (
          <ColorPicker
            label="Color"
            value={bgColor}
            onChange={(v) => updateBackground({ color: v })}
            onInstant={instantBgColor}
            presets={SOLID_PRESETS}
          />
        )}

        {/* Gradient */}
        {bgType === 'gradient' && (
          <>
            {/* Presets */}
            <div className="flex flex-wrap gap-1 mb-2">
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  className="w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none"
                  style={{
                    background: `linear-gradient(${preset.direction}deg, ${preset.colors.join(', ')})`,
                  }}
                  title={preset.name}
                  aria-label={`Apply ${preset.name} gradient`}
                  onClick={() =>
                    updateBackground({
                      gradient: {
                        type: 'linear',
                        colors: [...preset.colors],
                        direction: preset.direction,
                        radialPosition: 'center',
                      },
                    })
                  }
                />
              ))}
            </div>

            {/* Linear / Radial */}
            <div className="flex gap-3 mb-2">
              {(['linear', 'radial'] as const).map((t) => (
                <label
                  key={t}
                  className="text-xs text-text-dim cursor-pointer flex items-center gap-1"
                >
                  <input
                    type="radio"
                    checked={bgGradient.type === t}
                    onChange={() => updateBackground({ gradient: { ...bgGradient, type: t } })}
                    className="accent-accent"
                  />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
            </div>

            {bgGradient.type === 'linear' && (
              <RangeSlider
                label="Direction"
                value={bgGradient.direction}
                min={0}
                max={360}
                formatValue={(v) => `${v}\u00B0`}
                onChange={(v) => updateBackground({ gradient: { ...bgGradient, direction: v } })}
                onInstant={(v) => instantGradient({ direction: v })}
              />
            )}

            {bgGradient.type === 'radial' && (
              <Select
                label="Center"
                value={bgGradient.radialPosition ?? 'center'}
                onChange={(v) =>
                  updateBackground({
                    gradient: {
                      ...bgGradient,
                      radialPosition: v as 'center' | 'top' | 'bottom' | 'left' | 'right',
                    },
                  })
                }
                options={[
                  { value: 'center', label: 'Center' },
                  { value: 'top', label: 'Top' },
                  { value: 'bottom', label: 'Bottom' },
                  { value: 'left', label: 'Left' },
                  { value: 'right', label: 'Right' },
                ]}
              />
            )}

            {/* Color stops */}
            {bgGradient.colors.map((color, i) => (
              <ColorPicker
                key={i}
                label={`Stop ${i + 1}`}
                value={color}
                onChange={(v) => {
                  const colors = [...bgGradient.colors];
                  colors[i] = v;
                  updateBackground({ gradient: { ...bgGradient, colors } });
                }}
              />
            ))}

            {bgGradient.colors.length < 5 && (
              <button
                className="w-full text-[11px] py-1 bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
                onClick={() => {
                  const colors = [...bgGradient.colors, '#ffffff'];
                  updateBackground({ gradient: { ...bgGradient, colors } });
                }}
              >
                + Add Color Stop
              </button>
            )}
          </>
        )}

        {/* Image */}
        {bgType === 'image' && (
          <>
            <PanoramicBgImage
              imageDataUrl={background.image}
              onUpload={(dataUrl) => updateBackground({ image: dataUrl })}
              onRemove={() => updateBackground({ image: undefined })}
            />
            <div className="mt-2">
              <Checkbox
                label="Dim Overlay"
                checked={!!background.overlay}
                onChange={(checked) =>
                  updateBackground({
                    overlay: checked ? { color: '#000000', opacity: 0.3 } : undefined,
                  })
                }
              />
              {background.overlay && (
                <>
                  <ColorPicker
                    label="Color"
                    value={background.overlay.color}
                    onChange={(v) =>
                      updateBackground({
                        overlay: { ...background.overlay!, color: v },
                      })
                    }
                  />
                  <RangeSlider
                    label="Opacity"
                    value={Math.round(background.overlay.opacity * 100)}
                    min={0}
                    max={100}
                    formatValue={(v) => `${v}%`}
                    onChange={(v) =>
                      updateBackground({
                        overlay: { ...background.overlay!, opacity: v / 100 },
                      })
                    }
                  />
                </>
              )}
            </div>
          </>
        )}

        <Section title={`Layer Stack (${layers.length})`} defaultCollapsed>
          <div className="grid grid-cols-2 gap-1 mb-3">
            <button
              className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
              onClick={() => addLayer('gradient')}
            >
              + Gradient
            </button>
            <button
              className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
              onClick={() => addLayer('image')}
            >
              + Image
            </button>
            <button
              className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
              onClick={() => addLayer('glow')}
            >
              + Glow
            </button>
            <button
              className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
              onClick={() => addLayer('solid')}
            >
              + Solid
            </button>
          </div>

          {layers.length === 0 && (
            <p className="text-xs text-text-dim">
              Add layered gradients, textures, and glow passes on top of the base background.
            </p>
          )}

          {layers.length > 0 && (
            <>
              <div className="space-y-1 mb-3">
                {layers.map((layer, index) => (
                  <button
                    key={`${layer.kind}-${index}`}
                    className={`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${
                      index === selectedLayerIndex
                        ? 'bg-accent/15 text-accent border border-accent/30'
                        : 'bg-surface-2 border border-border hover:border-accent/30'
                    }`}
                    onClick={() => setSelectedLayerIndex(index)}
                  >
                    <span className="font-medium">{getBackgroundLayerLabel(layer)}</span>
                    <span className="text-text-dim ml-1">#{index + 1}</span>
                  </button>
                ))}
              </div>

              {selectedLayer && (
                <>
                  <div className="flex gap-1 mb-3">
                    <button
                      className="flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text disabled:opacity-40"
                      disabled={selectedLayerIndex === 0}
                      onClick={() => {
                        const nextLayers = [...layers];
                        [nextLayers[selectedLayerIndex - 1], nextLayers[selectedLayerIndex]] = [
                          nextLayers[selectedLayerIndex],
                          nextLayers[selectedLayerIndex - 1],
                        ];
                        replaceLayers(nextLayers);
                        setSelectedLayerIndex(selectedLayerIndex - 1);
                      }}
                    >
                      Move Up
                    </button>
                    <button
                      className="flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text disabled:opacity-40"
                      disabled={selectedLayerIndex === layers.length - 1}
                      onClick={() => {
                        const nextLayers = [...layers];
                        [nextLayers[selectedLayerIndex], nextLayers[selectedLayerIndex + 1]] = [
                          nextLayers[selectedLayerIndex + 1],
                          nextLayers[selectedLayerIndex],
                        ];
                        replaceLayers(nextLayers);
                        setSelectedLayerIndex(selectedLayerIndex + 1);
                      }}
                    >
                      Move Down
                    </button>
                    <button
                      className="flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-red-300 hover:text-red-200"
                      onClick={() => {
                        const nextLayers = layers.filter((_, index) => index !== selectedLayerIndex);
                        replaceLayers(nextLayers);
                        setSelectedLayerIndex(Math.max(0, Math.min(selectedLayerIndex, nextLayers.length - 1)));
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <Select
                    label="Blend Mode"
                    value={selectedLayer.blendMode}
                    onChange={(value) =>
                      updateLayer(selectedLayerIndex, { ...selectedLayer, blendMode: value as typeof selectedLayer.blendMode })
                    }
                    options={BLEND_MODE_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
                  />
                  <RangeSlider
                    label="Opacity"
                    value={Math.round(selectedLayer.opacity * 100)}
                    min={0}
                    max={100}
                    formatValue={(v) => `${v}%`}
                    onChange={(value) =>
                      updateLayer(selectedLayerIndex, { ...selectedLayer, opacity: value / 100 } as PanoramicBackgroundLayer)
                    }
                  />
                  <RangeSlider
                    label="Blur"
                    value={selectedLayer.blur}
                    min={0}
                    max={240}
                    formatValue={(v) => `${v}px`}
                    onChange={(value) =>
                      updateLayer(selectedLayerIndex, { ...selectedLayer, blur: value } as PanoramicBackgroundLayer)
                    }
                  />

                  {selectedLayer.kind === 'solid' && (
                    <ColorPicker
                      label="Color"
                      value={selectedLayer.color}
                      onChange={(value) =>
                        updateLayer(selectedLayerIndex, { ...selectedLayer, color: value })
                      }
                    />
                  )}

                  {selectedLayer.kind === 'gradient' && (
                    <>
                      <Select
                        label="Gradient Type"
                        value={selectedLayer.gradientType}
                        onChange={(value) =>
                          updateLayer(selectedLayerIndex, {
                            ...selectedLayer,
                            gradientType: value as typeof selectedLayer.gradientType,
                          })
                        }
                        options={[
                          { value: 'linear', label: 'Linear' },
                          { value: 'radial', label: 'Radial' },
                          { value: 'mesh', label: 'Mesh' },
                        ]}
                      />
                      {selectedLayer.gradientType === 'linear' && (
                        <RangeSlider
                          label="Direction"
                          value={selectedLayer.direction}
                          min={0}
                          max={360}
                          formatValue={(v) => `${v}\u00B0`}
                          onChange={(value) =>
                            updateLayer(selectedLayerIndex, { ...selectedLayer, direction: value })
                          }
                        />
                      )}
                      {selectedLayer.gradientType === 'radial' && (
                        <Select
                          label="Center"
                          value={selectedLayer.radialPosition}
                          onChange={(value) =>
                            updateLayer(selectedLayerIndex, {
                              ...selectedLayer,
                              radialPosition: value as typeof selectedLayer.radialPosition,
                            })
                          }
                          options={[
                            { value: 'center', label: 'Center' },
                            { value: 'top', label: 'Top' },
                            { value: 'bottom', label: 'Bottom' },
                            { value: 'left', label: 'Left' },
                            { value: 'right', label: 'Right' },
                          ]}
                        />
                      )}
                      {selectedLayer.colors.map((color, colorIndex) => (
                        <ColorPicker
                          key={colorIndex}
                          label={`Stop ${colorIndex + 1}`}
                          value={color}
                          onChange={(value) => {
                            const colors = [...selectedLayer.colors];
                            colors[colorIndex] = value;
                            updateLayer(selectedLayerIndex, { ...selectedLayer, colors });
                          }}
                        />
                      ))}
                    </>
                  )}

                  {selectedLayer.kind === 'image' && (
                    <>
                      <PanoramicBgImage
                        imageDataUrl={selectedLayer.image}
                        onUpload={(dataUrl) => updateLayer(selectedLayerIndex, { ...selectedLayer, image: dataUrl })}
                        onRemove={() => updateLayer(selectedLayerIndex, { ...selectedLayer, image: '' })}
                        buttonLabel="Upload Layer Image"
                        alt="Background layer"
                      />
                      <Select
                        label="Fit"
                        value={selectedLayer.fit}
                        onChange={(value) =>
                          updateLayer(selectedLayerIndex, { ...selectedLayer, fit: value as typeof selectedLayer.fit })
                        }
                        options={[
                          { value: 'cover', label: 'Cover' },
                          { value: 'contain', label: 'Contain' },
                          { value: 'tile', label: 'Tile' },
                        ]}
                      />
                      <Select
                        label="Position"
                        value={selectedLayer.position}
                        onChange={(value) =>
                          updateLayer(selectedLayerIndex, {
                            ...selectedLayer,
                            position: value as typeof selectedLayer.position,
                          })
                        }
                        options={[
                          { value: 'center', label: 'Center' },
                          { value: 'top', label: 'Top' },
                          { value: 'bottom', label: 'Bottom' },
                          { value: 'left', label: 'Left' },
                          { value: 'right', label: 'Right' },
                        ]}
                      />
                      <RangeSlider
                        label="Scale"
                        value={selectedLayer.scale}
                        min={10}
                        max={400}
                        formatValue={(v) => `${v}%`}
                        onChange={(value) => updateLayer(selectedLayerIndex, { ...selectedLayer, scale: value })}
                      />
                    </>
                  )}

                  {selectedLayer.kind === 'glow' && (
                    <>
                      <ColorPicker
                        label="Glow Color"
                        value={selectedLayer.color}
                        onChange={(value) => updateLayer(selectedLayerIndex, { ...selectedLayer, color: value })}
                      />
                      <RangeSlider
                        label="X"
                        value={selectedLayer.x}
                        min={-50}
                        max={150}
                        formatValue={(v) => `${v}%`}
                        onChange={(value) => updateLayer(selectedLayerIndex, { ...selectedLayer, x: value })}
                      />
                      <RangeSlider
                        label="Y"
                        value={selectedLayer.y}
                        min={-50}
                        max={150}
                        formatValue={(v) => `${v}%`}
                        onChange={(value) => updateLayer(selectedLayerIndex, { ...selectedLayer, y: value })}
                      />
                      <RangeSlider
                        label="Width"
                        value={selectedLayer.width}
                        min={1}
                        max={200}
                        formatValue={(v) => `${v}%`}
                        onChange={(value) => updateLayer(selectedLayerIndex, { ...selectedLayer, width: value })}
                      />
                      <RangeSlider
                        label="Height"
                        value={selectedLayer.height}
                        min={1}
                        max={200}
                        formatValue={(v) => `${v}%`}
                        onChange={(value) => updateLayer(selectedLayerIndex, { ...selectedLayer, height: value })}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Section>
      </Section>

      {/* Screenshots — bulk upload */}
      <Section title="Screenshots">
        <ScreenshotUploader />
      </Section>

      {/* Elements */}
      <Section title={`Elements (${elements.length})`}>
        {/* Add buttons */}
        <div className="grid grid-cols-5 gap-1 mb-3">
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addDevice}
          >
            + Device
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addText}
          >
            + Text
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addLabel}
          >
            + Label
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addDecoration}
          >
            + Decoration
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addImage}
          >
            + Image
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addCrop}
          >
            + Crop
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addCard}
          >
            + Card
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addGroup}
          >
            + Group
          </button>
        </div>

        {/* Element list */}
        {elements.length === 0 && (
          <p className="text-xs text-text-dim text-center py-4">
            Add devices, text, cards, crops, groups, images, or decorations to build your panoramic layout.
          </p>
        )}
        <div className="space-y-1">
          {elements.map((el, i) => {
            const typeNum = elements.slice(0, i).filter((e) => e.type === el.type).length + 1;
            return (
              <button
                key={i}
                className={`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${
                  i === selectedElementIndex
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'bg-surface-2 border border-border hover:border-accent/30'
                }`}
                onClick={() => setSelectedElement(i === selectedElementIndex ? null : i)}
              >
                <span className="font-medium">
                  {ELEMENT_TYPE_LABELS[el.type]} #{typeNum}
                </span>
                <span className="text-text-dim ml-1">
                  ({Math.round(el.x)}%, {Math.round(el.y)}%)
                </span>
                {getElementSummary(el) && (
                  <span className="text-text-dim ml-1 truncate" title={getElementSummary(el) ?? ''}>
                    &mdash; {getElementSummary(el)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Element Inspector */}
      {selectedElementIndex !== null && <ElementInspector index={selectedElementIndex} />}

      {/* Info note about effects */}
      <div className="px-5 py-3 text-[10px] text-text-dim">
        Spotlight, annotations, and overlays are available in the Effects tab.
      </div>
    </div>
  );
}

// --- Tab sub-components for the header-bar tab layout ---

export function PanoramicBackgroundContent() {
  const frameCount = usePreviewStore((s) => s.panoramicFrameCount);
  const setFrameCount = usePreviewStore((s) => s.setPanoramicFrameCount);
  const background = usePreviewStore((s) => s.panoramicBackground);
  const updateBackground = usePreviewStore((s) => s.updatePanoramicBackground);
  const platform = usePreviewStore((s) => s.platform);
  const setPlatformRaw = usePreviewStore((s) => s.setPlatform);
  const setPreviewSize = usePreviewStore((s) => s.setPreviewSize);
  const sizes = usePreviewStore((s) => s.sizes);
  const setExportSize = usePreviewStore((s) => s.setExportSize);
  const syncPanoramicDevicesForPlatform = usePreviewStore((s) => s.syncPanoramicDevicesForPlatform);
  const { patchBackground } = usePanoramicInstantPatch();
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);

  const handlePlatformChange = useCallback(
    (v: string) => {
      setPlatformRaw(v);
      syncPanoramicDevicesForPlatform(v);
      const size = getPlatformPreviewSize(v);
      setPreviewSize(size.w, size.h);
      const defaultExportSize = getDefaultExportSizeKey(sizes, v);
      if (defaultExportSize) setExportSize(defaultExportSize);
    },
    [setExportSize, setPlatformRaw, setPreviewSize, sizes, syncPanoramicDevicesForPlatform],
  );

  const instantBgColor = useCallback(
    (color: string) => patchBackground({ type: 'solid', color }),
    [patchBackground],
  );

  const instantGradient = useCallback(
    (overrides?: { direction?: number; colors?: string[] }) => {
      const g = background.gradient ?? {
        type: 'linear' as const,
        colors: ['#6366f1', '#ec4899'],
        direction: 135,
        radialPosition: 'center' as const,
      };
      patchBackground({
        type: 'gradient',
        gradientType: g.type,
        colors: overrides?.colors ?? g.colors,
        direction: overrides?.direction ?? g.direction,
        radialPosition: g.radialPosition,
      });
    },
    [background.gradient, patchBackground],
  );

  const bgType = background.type;
  const bgColor = background.color ?? '#000000';
  const bgGradient = background.gradient ?? {
    type: 'linear' as const,
    colors: ['#6366f1', '#ec4899'],
    direction: 135,
    radialPosition: 'center' as const,
  };
  const layers = background.layers ?? [];
  const selectedLayer =
    layers.length > 0 ? layers[Math.min(selectedLayerIndex, layers.length - 1)] : null;

  const replaceLayers = useCallback(
    (nextLayers: PanoramicBackgroundLayer[]) => updateBackground({ layers: nextLayers }),
    [updateBackground],
  );

  const updateLayer = useCallback(
    (index: number, patch: PanoramicBackgroundLayer) => {
      const nextLayers = [...layers];
      nextLayers[index] = patch;
      replaceLayers(nextLayers);
    },
    [layers, replaceLayers],
  );

  const addLayer = useCallback(
    (kind: PanoramicBackgroundLayer['kind']) => {
      const next =
        kind === 'gradient'
          ? {
              kind: 'gradient' as const,
              gradientType: 'mesh' as const,
              colors: ['#60A5FA', '#A78BFA', '#F472B6'],
              direction: 135,
              radialPosition: 'center' as const,
              opacity: 0.8,
              blendMode: 'soft-light' as const,
              blur: 0,
            }
          : kind === 'image'
            ? {
                kind: 'image' as const,
                image: '',
                fit: 'cover' as const,
                position: 'center' as const,
                scale: 100,
                opacity: 0.24,
                blendMode: 'overlay' as const,
                blur: 0,
              }
            : kind === 'glow'
              ? {
                  kind: 'glow' as const,
                  color: '#FFFFFF',
                  x: 50,
                  y: 28,
                  width: 38,
                  height: 32,
                  opacity: 0.35,
                  blur: 90,
                  blendMode: 'screen' as const,
                }
              : {
                  kind: 'solid' as const,
                  color: '#0F172A',
                  opacity: 0.16,
                  blendMode: 'overlay' as const,
                  blur: 0,
                };
      const nextLayers = [...layers, next];
      replaceLayers(nextLayers);
      setSelectedLayerIndex(nextLayers.length - 1);
    },
    [layers, replaceLayers],
  );

  return (
    <div>
      <Section title="Canvas" defaultCollapsed={false}>
        <Select
          label="Platform"
          value={platform}
          onChange={handlePlatformChange}
          options={PLATFORM_OPTIONS}
        />
        <RangeSlider
          label="Frame Count"
          value={frameCount}
          min={2}
          max={10}
          onChange={setFrameCount}
        />
      </Section>

      <Section title="Background">
        <div className="flex gap-3 mb-2.5">
          {(['solid', 'gradient', 'image', 'preset'] as const).map((t) => (
            <label key={t} className="text-xs text-text-dim cursor-pointer flex items-center gap-1">
              <input
                type="radio"
                name="pano-bg-type"
                value={t}
                checked={bgType === t}
                onChange={() => updateBackground({ type: t })}
                className="accent-accent"
              />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>

        {bgType === 'preset' && (
          <Select
            label="Style Preset"
            value={background.preset ?? ''}
            onChange={(v) => updateBackground({ preset: v })}
            options={[
              { value: '', label: 'Select a preset...' },
              { value: 'minimal', label: 'Minimal' },
              { value: 'bold', label: 'Bold' },
              { value: 'glow', label: 'Glow' },
              { value: 'playful', label: 'Playful' },
              { value: 'clean', label: 'Clean' },
              { value: 'branded', label: 'Branded' },
              { value: 'editorial', label: 'Editorial' },
            ]}
          />
        )}

        {bgType === 'solid' && (
          <ColorPicker
            label="Color"
            value={bgColor}
            onChange={(v) => updateBackground({ color: v })}
            onInstant={instantBgColor}
            presets={SOLID_PRESETS}
          />
        )}

        {bgType === 'gradient' && (
          <>
            <div className="flex flex-wrap gap-1 mb-2">
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  className="w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none"
                  style={{
                    background: `linear-gradient(${preset.direction}deg, ${preset.colors.join(', ')})`,
                  }}
                  title={preset.name}
                  aria-label={`Apply ${preset.name} gradient`}
                  onClick={() =>
                    updateBackground({
                      gradient: {
                        type: 'linear',
                        colors: [...preset.colors],
                        direction: preset.direction,
                        radialPosition: 'center',
                      },
                    })
                  }
                />
              ))}
            </div>

            <div className="flex gap-3 mb-2">
              {(['linear', 'radial'] as const).map((t) => (
                <label
                  key={t}
                  className="text-xs text-text-dim cursor-pointer flex items-center gap-1"
                >
                  <input
                    type="radio"
                    checked={bgGradient.type === t}
                    onChange={() => updateBackground({ gradient: { ...bgGradient, type: t } })}
                    className="accent-accent"
                  />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
            </div>

            {bgGradient.type === 'linear' && (
              <RangeSlider
                label="Direction"
                value={bgGradient.direction}
                min={0}
                max={360}
                formatValue={(v) => `${v}\u00B0`}
                onChange={(v) => updateBackground({ gradient: { ...bgGradient, direction: v } })}
                onInstant={(v) => instantGradient({ direction: v })}
              />
            )}

            {bgGradient.type === 'radial' && (
              <Select
                label="Center"
                value={bgGradient.radialPosition ?? 'center'}
                onChange={(v) =>
                  updateBackground({
                    gradient: {
                      ...bgGradient,
                      radialPosition: v as 'center' | 'top' | 'bottom' | 'left' | 'right',
                    },
                  })
                }
                options={[
                  { value: 'center', label: 'Center' },
                  { value: 'top', label: 'Top' },
                  { value: 'bottom', label: 'Bottom' },
                  { value: 'left', label: 'Left' },
                  { value: 'right', label: 'Right' },
                ]}
              />
            )}

            {bgGradient.colors.map((color, i) => (
              <ColorPicker
                key={i}
                label={`Stop ${i + 1}`}
                value={color}
                onChange={(v) => {
                  const colors = [...bgGradient.colors];
                  colors[i] = v;
                  updateBackground({ gradient: { ...bgGradient, colors } });
                }}
              />
            ))}

            {bgGradient.colors.length < 5 && (
              <button
                className="w-full text-[11px] py-1 bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
                onClick={() => {
                  const colors = [...bgGradient.colors, '#ffffff'];
                  updateBackground({ gradient: { ...bgGradient, colors } });
                }}
              >
                + Add Color Stop
              </button>
            )}
          </>
        )}

        {bgType === 'image' && (
          <>
            <PanoramicBgImage
              imageDataUrl={background.image}
              onUpload={(dataUrl) => updateBackground({ image: dataUrl })}
              onRemove={() => updateBackground({ image: undefined })}
            />
            <div className="mt-2">
              <Checkbox
                label="Dim Overlay"
                checked={!!background.overlay}
                onChange={(checked) =>
                  updateBackground({
                    overlay: checked ? { color: '#000000', opacity: 0.3 } : undefined,
                  })
                }
              />
              {background.overlay && (
                <>
                  <ColorPicker
                    label="Color"
                    value={background.overlay.color}
                    onChange={(v) =>
                      updateBackground({
                        overlay: { ...background.overlay!, color: v },
                      })
                    }
                  />
                  <RangeSlider
                    label="Opacity"
                    value={Math.round(background.overlay.opacity * 100)}
                    min={0}
                    max={100}
                    formatValue={(v) => `${v}%`}
                    onChange={(v) =>
                      updateBackground({
                        overlay: { ...background.overlay!, opacity: v / 100 },
                      })
                    }
                  />
                </>
              )}
            </div>
          </>
        )}
      </Section>
    </div>
  );
}

export function PanoramicDeviceContent() {
  const elements = usePreviewStore((s) => s.panoramicElements);
  const selectedElementIndex = usePreviewStore((s) => s.selectedElementIndex);
  const setSelectedElement = usePreviewStore((s) => s.setSelectedElement);
  const addElement = usePreviewStore((s) => s.addPanoramicElement);
  const config = usePreviewStore((s) => s.config);

  const filtered = elements
    .map((el, i) => ({ el, i }))
    .filter(
      ({ el }) =>
        el.type === 'device' ||
        el.type === 'decoration' ||
        el.type === 'image' ||
        el.type === 'logo' ||
        el.type === 'crop' ||
        el.type === 'group',
    );

  const addDevice = () => {
    const deviceCount = elements.filter((e) => e.type === 'device').length;
    const screenshot =
      config?.screens[deviceCount]?.screenshot ??
      config?.screens[0]?.screenshot ??
      'screenshots/screen-1.png';
    addElement({
      type: 'device',
      screenshot,
      frameStyle: 'flat',
      x: 10 + deviceCount * 20,
      y: 15,
      width: 12,
      rotation: 0,
      deviceScale: 92,
      deviceTop: 15,
      deviceOffsetX: 0,
      deviceAngle: 8,
      deviceTilt: 0,
      cornerRadius: 0,
      fullscreenScreenshot: false,
      z: 5,
    });
  };

  const addDecoration = () => {
    addElement({
      type: 'decoration',
      shape: 'circle',
      x: 50,
      y: 50,
      width: 5,
      height: 8,
      color: config?.theme.colors.primary ?? '#6366F1',
      opacity: 0.15,
      rotation: 0,
      z: 0,
    });
  };

  const addImage = () => {
    const imageCount = elements.filter((e) => e.type === 'image').length;
    addElement({
      type: 'image',
      src: config?.screens[0]?.screenshot ?? 'screenshots/screen-1.png',
      x: 8 + imageCount * 12,
      y: 58,
      width: 12,
      height: 12,
      fit: 'contain',
      opacity: 1,
      rotation: 0,
      borderRadius: 0,
      z: 6,
    });
  };

  const addCrop = () => {
    const cropCount = elements.filter((e) => e.type === 'crop').length;
    addElement({
      type: 'crop',
      screenshot: config?.screens[cropCount]?.screenshot ?? config?.screens[0]?.screenshot ?? 'screenshots/screen-1.png',
      x: 14 + cropCount * 14,
      y: 56,
      width: 12,
      height: 18,
      focusX: 50,
      focusY: 40,
      zoom: 1.5,
      rotation: cropCount % 2 === 0 ? -4 : 4,
      borderRadius: 24,
      z: 7,
    });
  };

  const addLogo = () => {
    const logoCount = elements.filter((e) => e.type === 'logo').length;
    addElement({
      type: 'logo',
      src: config?.screens[0]?.screenshot ?? 'screenshots/screen-1.png',
      x: 76 + logoCount * 3,
      y: 6,
      width: 12,
      height: 10,
      fit: 'contain',
      opacity: 0.96,
      rotation: 0,
      padding: 1.2,
      backgroundColor: '#FFFFFFE6',
      borderRadius: 24,
      z: 8,
    });
  };

  const addGroup = () => {
    const groupCount = elements.filter((e) => e.type === 'group').length;
    const screenshot =
      config?.screens[groupCount]?.screenshot ??
      config?.screens[0]?.screenshot ??
      'screenshots/screen-1.png';
    addElement(buildDefaultGroupElement(screenshot, 12 + groupCount * 14, 52, groupCount % 2 === 0 ? -4 : 4));
  };

  const showInspector =
    selectedElementIndex !== null &&
    elements[selectedElementIndex] &&
    (elements[selectedElementIndex]!.type === 'device' ||
      elements[selectedElementIndex]!.type === 'decoration' ||
      elements[selectedElementIndex]!.type === 'image' ||
      elements[selectedElementIndex]!.type === 'logo' ||
      elements[selectedElementIndex]!.type === 'crop' ||
      elements[selectedElementIndex]!.type === 'group');

  return (
    <div>
      <Section title="Screenshots">
        <ScreenshotUploader />
      </Section>

      <Section title={`Devices & Decorations (${filtered.length})`} defaultCollapsed={false}>
        <div className="grid grid-cols-3 gap-1 mb-3">
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addDevice}
          >
            + Device
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addDecoration}
          >
            + Decoration
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addImage}
          >
            + Image
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addLogo}
          >
            + Logo
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addCrop}
          >
            + Crop
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addGroup}
          >
            + Group
          </button>
        </div>

        {filtered.length === 0 && (
          <p className="text-xs text-text-dim text-center py-4">
            Add devices, logos, crops, groups, images, or decorations to place screenshots on the panoramic canvas.
          </p>
        )}
        <div className="space-y-1">
          {filtered.map(({ el, i }) => {
            const typeNum = elements.slice(0, i).filter((e) => e.type === el.type).length + 1;
            return (
              <button
                key={i}
                className={`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${
                  i === selectedElementIndex
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'bg-surface-2 border border-border hover:border-accent/30'
                }`}
                onClick={() => setSelectedElement(i === selectedElementIndex ? null : i)}
              >
                <span className="font-medium">
                  {ELEMENT_TYPE_LABELS[el.type]} #{typeNum}
                </span>
                <span className="text-text-dim ml-1">
                  ({Math.round(el.x)}%, {Math.round(el.y)}%)
                </span>
                {getElementSummary(el) && (
                  <span className="text-text-dim ml-1 truncate" title={getElementSummary(el) ?? ''}>
                    &mdash; {getElementSummary(el)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {showInspector && <ElementInspector index={selectedElementIndex!} />}
    </div>
  );
}

export function PanoramicTextContent() {
  const elements = usePreviewStore((s) => s.panoramicElements);
  const selectedElementIndex = usePreviewStore((s) => s.selectedElementIndex);
  const setSelectedElement = usePreviewStore((s) => s.setSelectedElement);
  const addElement = usePreviewStore((s) => s.addPanoramicElement);

  const filtered = elements
    .map((el, i) => ({ el, i }))
    .filter(
      ({ el }) =>
        el.type === 'text' ||
        el.type === 'label' ||
        el.type === 'card' ||
        el.type === 'badge' ||
        el.type === 'proof-chip',
    );

  const addText = () => {
    const textCount = elements.filter((e) => e.type === 'text').length;
    addElement({
      type: 'text',
      content: 'New headline',
      x: 5 + textCount * 20,
      y: 5,
      fontSize: 3.5,
      color: '#FFFFFF',
      fontWeight: 700,
      fontStyle: 'normal',
      textAlign: 'left',
      lineHeight: 1.15,
      letterSpacing: 0,
      textTransform: '',
      rotation: 0,
      maxWidth: 25,
      z: 10,
    });
  };

  const addLabel = () => {
    addElement({
      type: 'label',
      content: 'New Label',
      x: 50,
      y: 50,
      fontSize: 1.5,
      color: '#FFFFFF',
      backgroundColor: '#00000044',
      padding: 0.5,
      borderRadius: 8,
      z: 15,
    });
  };

  const addCard = () => {
    const cardCount = elements.filter((e) => e.type === 'card').length;
    addElement({
      type: 'card',
      x: 8 + cardCount * 12,
      y: 62,
      width: 18,
      height: 18,
      eyebrow: 'Highlight',
      title: 'Support detail',
      body: 'Use short proof or context here.',
      align: 'left',
      backgroundColor: '#FFFFFF',
      opacity: 0.96,
      borderColor: '#E2E8F0',
      borderWidth: 1,
      borderRadius: 28,
      padding: 2.2,
      rotation: 0,
      eyebrowColor: '#64748B',
      titleColor: '#0F172A',
      bodyColor: '#475569',
      eyebrowSize: 1.1,
      titleSize: 2.2,
      bodySize: 1.3,
      z: 9,
    });
  };

  const addBadge = () => {
    const badgeCount = elements.filter((e) => e.type === 'badge').length;
    addElement({
      type: 'badge',
      content: 'New badge',
      x: 8 + badgeCount * 12,
      y: 18,
      width: 16,
      height: 5,
      color: '#0F172A',
      backgroundColor: '#FFFFFF',
      opacity: 0.96,
      borderColor: '#CBD5E1',
      borderWidth: 1,
      borderRadius: 100,
      fontSize: 1.1,
      fontWeight: 700,
      letterSpacing: 12,
      textTransform: 'uppercase',
      rotation: 0,
      z: 12,
    });
  };

  const addProofChip = () => {
    const proofCount = elements.filter((e) => e.type === 'proof-chip').length;
    addElement({
      type: 'proof-chip',
      value: '4.9 out of 5',
      detail: 'App Store rating',
      rating: 5,
      maxRating: 5,
      x: 8 + proofCount * 14,
      y: 24,
      width: 18,
      height: 9,
      color: '#0F172A',
      mutedColor: '#64748B',
      starColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      opacity: 0.98,
      borderColor: '#E2E8F0',
      borderWidth: 1,
      borderRadius: 28,
      valueSize: 1.8,
      detailSize: 1,
      padding: 1.4,
      rotation: 0,
      z: 11,
    });
  };

  const showInspector =
    selectedElementIndex !== null &&
    elements[selectedElementIndex] &&
    (elements[selectedElementIndex]!.type === 'text' ||
      elements[selectedElementIndex]!.type === 'label' ||
      elements[selectedElementIndex]!.type === 'card' ||
      elements[selectedElementIndex]!.type === 'badge' ||
      elements[selectedElementIndex]!.type === 'proof-chip');

  return (
    <div>
      <Section title={`Text & Labels (${filtered.length})`} defaultCollapsed={false}>
        <div className="grid grid-cols-5 gap-1 mb-3">
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addText}
          >
            + Text
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addLabel}
          >
            + Label
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addCard}
          >
            + Card
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addBadge}
          >
            + Badge
          </button>
          <button
            className="py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors"
            onClick={addProofChip}
          >
            + Proof
          </button>
        </div>

        {filtered.length === 0 && (
          <p className="text-xs text-text-dim text-center py-4">
            Add text elements, labels, badges, proof chips, and support cards.
          </p>
        )}
        <div className="space-y-1">
          {filtered.map(({ el, i }) => {
            const typeNum = elements.slice(0, i).filter((e) => e.type === el.type).length + 1;
            return (
              <button
                key={i}
                className={`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${
                  i === selectedElementIndex
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'bg-surface-2 border border-border hover:border-accent/30'
                }`}
                onClick={() => setSelectedElement(i === selectedElementIndex ? null : i)}
              >
                <span className="font-medium">
                  {ELEMENT_TYPE_LABELS[el.type]} #{typeNum}
                </span>
                <span className="text-text-dim ml-1">
                  ({Math.round(el.x)}%, {Math.round(el.y)}%)
                </span>
                {(el.type === 'text' || el.type === 'label' || el.type === 'badge') && (
                  <span
                    className="text-text-dim ml-1 truncate"
                    title={(el as { content: string }).content}
                  >
                    &mdash; {(el as { content: string }).content.slice(0, 20)}
                  </span>
                )}
                {el.type === 'proof-chip' && (
                  <span className="text-text-dim ml-1 truncate" title={el.value}>
                    &mdash; {el.value.slice(0, 20)}
                  </span>
                )}
                {el.type === 'card' && (
                  <span
                    className="text-text-dim ml-1 truncate"
                    title={(el.title ?? el.body ?? '').toString()}
                  >
                    &mdash; {(el.title ?? el.body ?? 'Card').slice(0, 20)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {showInspector && <ElementInspector index={selectedElementIndex!} />}
    </div>
  );
}
