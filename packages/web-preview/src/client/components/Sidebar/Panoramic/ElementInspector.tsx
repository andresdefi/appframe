import { useRef, useCallback, useMemo } from 'react';
import { usePreviewStore } from '../../../store';
import type { PanoramicElement } from '../../../types';
import { usePanoramicInstantPatch } from '../../../hooks/usePanoramicInstantPatch';
import { Section } from '../../Controls/Section';
import { ColorPicker } from '../../Controls/ColorPicker';
import { RangeSlider } from '../../Controls/RangeSlider';
import { Select } from '../../Controls/Select';
import { Checkbox } from '../../Controls/Checkbox';
import { GRADIENT_PRESETS, KOUBOU_COLOR_HEX } from '../../../utils/presets';
import { buildFontGroups } from '../../../utils/fontGroups';
import { useConfirmDialog } from '../../Controls/ConfirmDialog';
import { uploadImageFile } from '../../../utils/uploadImageFile';
import {
  ELEMENT_TYPE_LABELS,
  buildFrameGroups,
  getElementSummary,
  getSortedIndex,
} from './helpers';

export function ElementInspector({ index }: { index: number }) {
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

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const uploaded = await uploadImageFile(file);
    update({ screenshot: uploaded.url });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const uploaded = await uploadImageFile(file);
    update({ src: uploaded.url } as Partial<PanoramicElement>);
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
                {element.screenshot.startsWith('data:') && (
                  <button
                    className="btn-secondary w-full text-[11px] mt-1"
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
                className="input-shell w-full text-[13px] font-inherit resize-y min-h-[60px]"
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
              className="btn-secondary w-full text-xs"
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
                className="input-shell w-full text-[13px]"
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
                className="input-shell w-full text-[13px] font-inherit resize-y min-h-[48px]"
              />
            </div>
            <div className="mb-2.5">
              <label className="block text-xs text-text-dim mb-1">Body</label>
              <textarea
                rows={3}
                value={element.body ?? ''}
                onChange={(e) => update({ body: e.target.value || undefined })}
                className="input-shell w-full text-[13px] font-inherit resize-y min-h-[64px]"
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
                className="input-shell w-full text-[13px]"
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
                className="input-shell w-full text-[13px]"
                value={element.value}
                onChange={(e) => update({ value: e.target.value })}
              />
            </div>
            <div className="mb-2.5">
              <label className="block text-xs text-text-dim mb-1">Detail</label>
              <input
                type="text"
                className="input-shell w-full text-[13px]"
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
              className="input-shell w-full text-[13px]"
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
