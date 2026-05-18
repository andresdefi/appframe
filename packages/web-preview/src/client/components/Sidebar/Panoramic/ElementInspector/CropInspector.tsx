import { useRef } from 'react';
import type { PanoramicElement } from '../../../../types';
import { Section } from '../../../Controls/Section';
import { ColorPicker } from '../../../Controls/ColorPicker';
import { RangeSlider } from '../../../Controls/RangeSlider';
import { Checkbox } from '../../../Controls/Checkbox';
import { uploadImageFile } from '../../../../utils/uploadImageFile';
import { useInspectorHandlers } from './useInspectorHandlers';

export function CropInspector({ index }: { index: number }) {
  const { element, update, instant } = useInspectorHandlers(index);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!element || element.type !== 'crop') return null;

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const uploaded = await uploadImageFile(file);
    update({ screenshot: uploaded.url });
  };

  return (
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
          formatValue={(v) => `${v}°`}
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
  );
}
