import { useRef, useCallback, useMemo, useState } from 'react';
import { usePreviewStore } from '../../store';
import type { FrameData, DeviceFamily } from '../../store';
import type { PanoramicElement } from '../../types';
import { PLATFORM_PREVIEW_SIZES } from '../../types';
import { usePanoramicInstantPatch } from '../../hooks/usePanoramicInstantPatch';
import { Section } from '../Controls/Section';
import { ColorPicker } from '../Controls/ColorPicker';
import { RangeSlider } from '../Controls/RangeSlider';
import { Select } from '../Controls/Select';
import { Checkbox } from '../Controls/Checkbox';
import { GRADIENT_PRESETS, SOLID_PRESETS, KOUBOU_COLOR_HEX } from '../../utils/presets';
import { buildFontGroups } from '../../utils/fontGroups';
import { useConfirmDialog } from '../Controls/ConfirmDialog';

const ELEMENT_TYPE_LABELS: Record<string, string> = {
  device: 'Device',
  text: 'Text',
  label: 'Label',
  decoration: 'Decoration',
};

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

function buildFrameGroups(
  deviceFamilies: DeviceFamily[],
  frames: FrameData[],
  platform?: string,
) {
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
  const sorted = elements
    .map((el, i) => ({ z: el.z, i }))
    .sort((a, b) => a.z - b.z);
  return sorted.findIndex((s) => s.i === storeIndex);
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
  const { confirm, dialog } = useConfirmDialog();
  const { patchElement } = usePanoramicInstantPatch();

  const sortedIndex = useMemo(
    () => getSortedIndex(elements, index),
    [elements, index],
  );

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

  return (
    <div>
      {dialog}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <span className="text-xs font-medium">
          {ELEMENT_TYPE_LABELS[element.type]} #{elements.slice(0, index).filter((e) => e.type === element.type).length + 1}
        </span>
        <button
          className="text-[10px] text-red-400 hover:text-red-300"
          onClick={async () => {
            const typeNum = elements.slice(0, index).filter((e) => e.type === element.type).length + 1;
            const ok = await confirm({ title: 'Remove Element', message: `Remove ${ELEMENT_TYPE_LABELS[element.type]} #${typeNum}? This cannot be undone.` });
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

      {/* ========== DEVICE ========== */}
      {element.type === 'device' && (() => {
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
                onClick={() => update({ screenshot: config?.screens[0]?.screenshot ?? 'screenshots/screen-1.png' })}
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
                      onClick={() => update({ deviceColor: c.name } as Partial<PanoramicElement>)}
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
                {(element as { borderSimulation?: { thickness: number; color: string; radius: number } }).borderSimulation && (() => {
                  const bs = (element as { borderSimulation: { thickness: number; color: string; radius: number } }).borderSimulation;
                  return (
                    <>
                      <RangeSlider label="Thickness" value={bs.thickness} min={1} max={20} formatValue={(v) => `${v}px`} onChange={(v) => update({ borderSimulation: { ...bs, thickness: v } } as Partial<PanoramicElement>)} />
                      <ColorPicker label="Color" value={bs.color} onChange={(v) => update({ borderSimulation: { ...bs, color: v } } as Partial<PanoramicElement>)} />
                      <RangeSlider label="Radius" value={bs.radius} min={0} max={60} formatValue={(v) => `${v}px`} onChange={(v) => update({ borderSimulation: { ...bs, radius: v } } as Partial<PanoramicElement>)} />
                    </>
                  );
                })()}
              </>
            )}
          </Section>

          <Section title="Device Layout" tooltip="Control device scale, position, and fullscreen mode.">
            <Checkbox
              label="Fullscreen Screenshot"
              checked={isFullscreen}
              onChange={(checked) => update({ fullscreenScreenshot: checked } as Partial<PanoramicElement>)}
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

          <Section title="Device Shadow" tooltip="Add a custom shadow beneath the device frame." defaultCollapsed>
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
                <RangeSlider label="Opacity" value={Math.round(element.shadow.opacity * 100)} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ shadow: { ...element.shadow!, opacity: v / 100 } })} />
                <RangeSlider label="Blur" value={element.shadow.blur} min={0} max={50} formatValue={(v) => `${v}px`} onChange={(v) => update({ shadow: { ...element.shadow!, blur: v } })} />
                <ColorPicker label="Color" value={element.shadow.color} onChange={(v) => update({ shadow: { ...element.shadow!, color: v } })} />
                <RangeSlider label="Y Offset" value={element.shadow.offsetY} min={0} max={30} formatValue={(v) => `${v}px`} onChange={(v) => update({ shadow: { ...element.shadow!, offsetY: v } })} />
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

          <Section title="Typography" tooltip="Control font family, weight, size, and styling for this element.">
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

          <Section title="Text Gradient" tooltip="Apply a gradient color effect to the text." defaultCollapsed>
            <Checkbox
              label="Enable Gradient"
              checked={!!(element as { gradient?: unknown }).gradient}
              onChange={(checked) =>
                update({
                  gradient: checked
                    ? { type: 'linear', colors: ['#6366f1', '#ec4899'], direction: 135, radialPosition: 'center' }
                    : undefined,
                } as Partial<PanoramicElement>)
              }
            />
            {(element as { gradient?: { type: string; colors: string[]; direction: number; radialPosition: string } }).gradient && (() => {
              const g = (element as { gradient: { type: string; colors: string[]; direction: number; radialPosition: string } }).gradient;
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
          <ColorPicker
            label="Color"
            value={element.color}
            onChange={(v) => update({ color: v })}
          />
        </Section>
      )}
    </div>
  );
}

function PanoramicBgImage({
  imageDataUrl,
  onUpload,
  onRemove,
}: {
  imageDataUrl?: string;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
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
        Upload Background Image
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
            alt="Background"
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
            x: 10 + deviceCount * 20,
            y: 15,
            width: 12,
            rotation: 0,
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
              <span className="w-4 text-center">{deviceElements.indexOf(deviceElements.find(d => d.i === i)!) + 1}</span>
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
  const { patchBackground } = usePanoramicInstantPatch();

  const handlePlatformChange = useCallback(
    (v: string) => {
      setPlatformRaw(v);
      const size = PLATFORM_PREVIEW_SIZES[v];
      if (size) setPreviewSize(size.w, size.h);
    },
    [setPlatformRaw, setPreviewSize],
  );

  const instantBgColor = useCallback(
    (color: string) => patchBackground({ type: 'solid', color }),
    [patchBackground],
  );

  const instantGradient = useCallback(
    (overrides?: { direction?: number; colors?: string[] }) => {
      const g = background.gradient ?? { type: 'linear' as const, colors: ['#6366f1', '#ec4899'], direction: 135, radialPosition: 'center' as const };
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
    const screenshot = config?.screens[deviceCount]?.screenshot
      ?? config?.screens[0]?.screenshot
      ?? 'screenshots/screen-1.png';
    addElement({
      type: 'device',
      screenshot,
      x: 10 + deviceCount * 20,
      y: 15,
      width: 12,
      rotation: 0,
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
        <RangeSlider label="Frame Count" value={frameCount} min={2} max={10} onChange={setFrameCount} />
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
                <label key={t} className="text-xs text-text-dim cursor-pointer flex items-center gap-1">
                  <input
                    type="radio"
                    checked={bgGradient.type === t}
                    onChange={() =>
                      updateBackground({ gradient: { ...bgGradient, type: t } })
                    }
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
                onChange={(v) =>
                  updateBackground({ gradient: { ...bgGradient, direction: v } })
                }
                onInstant={(v) => instantGradient({ direction: v })}
              />
            )}

            {bgGradient.type === 'radial' && (
              <Select
                label="Center"
                value={bgGradient.radialPosition ?? 'center'}
                onChange={(v) =>
                  updateBackground({
                    gradient: { ...bgGradient, radialPosition: v as 'center' | 'top' | 'bottom' | 'left' | 'right' },
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
                    overlay: checked
                      ? { color: '#000000', opacity: 0.3 }
                      : undefined,
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

      {/* Screenshots — bulk upload */}
      <Section title="Screenshots">
        <ScreenshotUploader />
      </Section>

      {/* Elements */}
      <Section title={`Elements (${elements.length})`}>
        {/* Add buttons */}
        <div className="grid grid-cols-4 gap-1 mb-3">
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
        </div>

        {/* Element list */}
        {elements.length === 0 && (
          <p className="text-xs text-text-dim text-center py-4">
            Add devices, text, or decorations to build your panoramic layout.
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
              <span className="font-medium">{ELEMENT_TYPE_LABELS[el.type]} #{typeNum}</span>
              <span className="text-text-dim ml-1">
                ({Math.round(el.x)}%, {Math.round(el.y)}%)
              </span>
              {el.type === 'text' && (
                <span className="text-text-dim ml-1 truncate" title={(el as { content: string }).content}>
                  &mdash; {(el as { content: string }).content.slice(0, 20)}
                </span>
              )}
              {el.type === 'label' && (
                <span className="text-text-dim ml-1 truncate" title={(el as { content: string }).content}>
                  &mdash; {(el as { content: string }).content.slice(0, 20)}
                </span>
              )}
            </button>
            );
          })}
        </div>
      </Section>

      {/* Element Inspector */}
      {selectedElementIndex !== null && (
        <ElementInspector index={selectedElementIndex} />
      )}

      {/* Info note about effects */}
      <div className="px-5 py-3 text-[10px] text-text-dim">
        Spotlight, annotations, and overlays are available in the Effects tab.
      </div>
    </div>
  );
}
