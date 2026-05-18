import { useMemo } from 'react';
import { usePreviewStore } from '../../../../store';
import type { PanoramicElement } from '../../../../types';
import { Section } from '../../../Controls/Section';
import { ColorPicker } from '../../../Controls/ColorPicker';
import { RangeSlider } from '../../../Controls/RangeSlider';
import { Select } from '../../../Controls/Select';
import { Checkbox } from '../../../Controls/Checkbox';
import { GRADIENT_PRESETS } from '../../../../utils/presets';
import { buildFontGroups } from '../../../../utils/fontGroups';
import { useInspectorHandlers } from './useInspectorHandlers';

export function TextInspector({ index }: { index: number }) {
  const { element, update, instant } = useInspectorHandlers(index);
  const config = usePreviewStore((s) => s.config);
  const fonts = usePreviewStore((s) => s.fonts);
  const fontGroups = useMemo(() => buildFontGroups(fonts), [fonts]);

  if (!element || element.type !== 'text') return null;

  return (
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
        <ColorPicker label="Color" value={element.color} onChange={(v) => update({ color: v })} />
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
          formatValue={(v) => `${v}°`}
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
                  formatValue={(v) => `${v}°`}
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
  );
}
