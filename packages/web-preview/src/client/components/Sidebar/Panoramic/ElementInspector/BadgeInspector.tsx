import { Section } from '../../../Controls/Section';
import { ColorPicker } from '../../../Controls/ColorPicker';
import { RangeSlider } from '../../../Controls/RangeSlider';
import { useInspectorHandlers } from './useInspectorHandlers';

export function BadgeInspector({ index }: { index: number }) {
  const { element, update, instant } = useInspectorHandlers(index);
  if (!element || element.type !== 'badge') return null;

  return (
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
        <ColorPicker label="Text" value={element.color} onChange={(v) => update({ color: v })} />
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
  );
}
