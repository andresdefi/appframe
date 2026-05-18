import { Section } from '../../../Controls/Section';
import { ColorPicker } from '../../../Controls/ColorPicker';
import { RangeSlider } from '../../../Controls/RangeSlider';
import { useInspectorHandlers } from './useInspectorHandlers';

export function LabelInspector({ index }: { index: number }) {
  const { element, update, instant } = useInspectorHandlers(index);
  if (!element || element.type !== 'label') return null;

  return (
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
  );
}
