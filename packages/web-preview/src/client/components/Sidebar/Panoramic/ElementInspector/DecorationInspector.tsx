import { Section } from '../../../Controls/Section';
import { ColorPicker } from '../../../Controls/ColorPicker';
import { RangeSlider } from '../../../Controls/RangeSlider';
import { Select } from '../../../Controls/Select';
import { useInspectorHandlers } from './useInspectorHandlers';

export function DecorationInspector({ index }: { index: number }) {
  const { element, update, instant } = useInspectorHandlers(index);
  if (!element || element.type !== 'decoration') return null;

  return (
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
        formatValue={(v) => `${v}°`}
        onChange={(v) => update({ rotation: v })}
        onInstant={(v) => instant({ rotation: v })}
      />
      <ColorPicker label="Color" value={element.color} onChange={(v) => update({ color: v })} />
    </Section>
  );
}
