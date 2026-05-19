import { useRef } from 'react';
import type { PanoramicElement } from '../../../../types';
import { Section } from '../../../Controls/Section';
import { ColorPicker } from '../../../Controls/ColorPicker';
import { RangeSlider } from '../../../Controls/RangeSlider';
import { Select } from '../../../Controls/Select';
import { Checkbox } from '../../../Controls/Checkbox';
import { uploadImageFile } from '../../../../utils/uploadImageFile';
import { useInspectorHandlers } from './useInspectorHandlers';

export function ImageInspector({ index }: { index: number }) {
  const { element, update, instant } = useInspectorHandlers(index);
  const imageInputRef = useRef<HTMLInputElement>(null);

  if (!element || (element.type !== 'image' && element.type !== 'logo')) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const uploaded = await uploadImageFile(file);
    update({ src: uploaded.url } as Partial<PanoramicElement>);
  };

  return (
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
          resetTo={12}
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
          resetTo={element.type === 'logo' ? 10 : 12}
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
          resetTo={element.type === 'logo' ? 0.96 : 1}
        />
        <RangeSlider
          label="Rotation"
          value={element.rotation}
          min={-180}
          max={180}
          formatValue={(v) => `${v}°`}
          onChange={(v) => update({ rotation: v })}
          onInstant={(v) => instant({ rotation: v })}
          resetTo={0}
        />
        <RangeSlider
          label="Border Radius"
          value={element.borderRadius}
          min={0}
          max={100}
          formatValue={(v) => `${v}px`}
          onChange={(v) => update({ borderRadius: v })}
          resetTo={element.type === 'logo' ? 24 : 0}
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
              resetTo={1.2}
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
              resetTo={20}
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
              resetTo={24}
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
              resetTo={8}
            />
          </>
        )}
      </Section>
    </>
  );
}
