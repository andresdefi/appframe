import { useRef } from 'react';
import { usePreviewStore } from '../../../../store';
import type { PanoramicElement } from '../../../../types';
import { Section } from '../../../Controls/Section';
import { ColorPicker } from '../../../Controls/ColorPicker';
import { RangeSlider } from '../../../Controls/RangeSlider';
import { Select } from '../../../Controls/Select';
import { Checkbox } from '../../../Controls/Checkbox';
import { KOUBOU_COLOR_HEX } from '../../../../utils/presets';
import { uploadImageFile } from '../../../../utils/uploadImageFile';
import { buildFrameGroups } from '../helpers';
import { useInspectorHandlers } from './useInspectorHandlers';

export function DeviceInspector({ index }: { index: number }) {
  const { element, update, instant } = useInspectorHandlers(index);
  const config = usePreviewStore((s) => s.config);
  const deviceFamilies = usePreviewStore((s) => s.deviceFamilies);
  const frames = usePreviewStore((s) => s.frames);
  const platform = usePreviewStore((s) => s.platform);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!element || element.type !== 'device') return null;

  const frameGroups = buildFrameGroups(deviceFamilies, frames, platform);
  const defaultFrameId = config?.frames.ios ?? '';
  const currentFrameId = element.frame ?? defaultFrameId;
  const currentFamily = deviceFamilies.find((f) => f.id === currentFrameId);
  const hasColors = currentFamily && currentFamily.colors.length > 1;
  const isFrameNone = (element.frameStyle ?? 'flat') === 'none';
  const isKoubouPng = currentFamily && currentFamily.screenRect;
  const isFullscreen = element.fullscreenScreenshot ?? false;

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const uploaded = await uploadImageFile(file);
    update({ screenshot: uploaded.url });
  };

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
              formatValue={(v) => `${v}°`}
              onChange={(v) => update({ rotation: v })}
              onInstant={(v) => instant({ rotation: v })}
            />
            <RangeSlider
              label="3D Tilt"
              value={element.deviceTilt ?? 0}
              min={0}
              max={40}
              formatValue={(v) => `${v}°`}
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
}
