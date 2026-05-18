import type { PanoramicElement } from '../../../../types';
import { Section } from '../../../Controls/Section';
import { ColorPicker } from '../../../Controls/ColorPicker';
import { RangeSlider } from '../../../Controls/RangeSlider';
import { Select } from '../../../Controls/Select';
import { Checkbox } from '../../../Controls/Checkbox';
import { useInspectorHandlers } from './useInspectorHandlers';

export function CardInspector({ index }: { index: number }) {
  const { element, update, instant } = useInspectorHandlers(index);
  if (!element || element.type !== 'card') return null;

  return (
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
  );
}
