import { Section } from '../../../Controls/Section';
import { ColorPicker } from '../../../Controls/ColorPicker';
import { RangeSlider } from '../../../Controls/RangeSlider';
import { useInspectorHandlers } from './useInspectorHandlers';

export function ProofChipInspector({ index }: { index: number }) {
  const { element, update, instant } = useInspectorHandlers(index);
  if (!element || element.type !== 'proof-chip') return null;

  return (
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
          formatValue={(v) => `${v}°`}
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
  );
}
