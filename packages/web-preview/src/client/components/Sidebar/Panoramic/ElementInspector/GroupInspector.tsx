import { Section } from '../../../Controls/Section';
import { RangeSlider } from '../../../Controls/RangeSlider';
import { ELEMENT_TYPE_LABELS, getElementSummary } from '../helpers';
import { useInspectorHandlers } from './useInspectorHandlers';

export function GroupInspector({ index }: { index: number }) {
  const { element, update, instant } = useInspectorHandlers(index);
  if (!element || element.type !== 'group') return null;

  return (
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
  );
}
