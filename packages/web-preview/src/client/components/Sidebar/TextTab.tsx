import { useCallback } from 'react';
import { useCurrentScreen } from '../../hooks/useCurrentScreen';
import { usePreviewStore } from '../../store';
import { useInstantPatch } from '../../hooks/useInstantPatch';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { RangeSlider } from '../Controls/RangeSlider';
import { ColorPicker } from '../Controls/ColorPicker';
import { Checkbox } from '../Controls/Checkbox';

const TEXT_TRANSFORM_OPTIONS = [
  { value: '', label: 'Auto' },
  { value: 'none', label: 'None' },
  { value: 'uppercase', label: 'Uppercase' },
  { value: 'lowercase', label: 'Lowercase' },
  { value: 'capitalize', label: 'Capitalize' },
];

const FONT_STYLE_OPTIONS = [
  { value: '', label: 'Auto' },
  { value: 'normal', label: 'Normal' },
  { value: 'italic', label: 'Italic' },
];

export function TextTab() {
  const { screen, update } = useCurrentScreen();
  const fonts = usePreviewStore((s) => s.fonts);
  const { patchText } = useInstantPatch();
  const instantText = useCallback(
    (key: string, v: number) => patchText({ [key]: v }),
    [patchText],
  );

  if (!screen) return null;

  const fontOptions = fonts.map((f) => ({ value: f.name, label: f.name }));

  return (
    <>
      {/* Text inputs */}
      <Section title="Text">
        <div className="mb-2.5">
          <label className="block text-xs text-text-dim mb-1">Headline</label>
          <textarea
            rows={2}
            value={screen.headline}
            onChange={(e) => update({ headline: e.target.value })}
            className="w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[60px]"
          />
        </div>
        <div className="mb-2.5">
          <label className="block text-xs text-text-dim mb-1">Subtitle</label>
          <input
            type="text"
            value={screen.subtitle}
            onChange={(e) => update({ subtitle: e.target.value })}
            placeholder="Optional subtitle"
            className="w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent"
          />
        </div>
        <ColorPicker
          label="Headline Color"
          value={screen.colors.text}
          onChange={(v) => update({ colors: { ...screen.colors, text: v } })}
        />
        <ColorPicker
          label="Subtitle Color"
          value={screen.colors.subtitle}
          onChange={(v) => update({ colors: { ...screen.colors, subtitle: v } })}
        />
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <Select
          label="Font"
          value={screen.font}
          onChange={(v) => update({ font: v })}
          options={fontOptions}
        />
        <RangeSlider
          label="Font Weight"
          value={screen.fontWeight}
          min={400}
          max={800}
          step={100}
          formatValue={(v) => String(v)}
          onChange={(v) => update({ fontWeight: v })}
        />
        <RangeSlider
          label="Headline Size"
          value={screen.headlineSize}
          min={0}
          max={200}
          formatValue={(v) => (v === 0 ? 'Auto' : `${v}px`)}
          onChange={(v) => update({ headlineSize: v })}
          onInstant={(v) => instantText('headlineSize', v)}
          disabled={screen.autoSizeHeadline}
        />
        <RangeSlider
          label="Subtitle Size"
          value={screen.subtitleSize}
          min={0}
          max={120}
          formatValue={(v) => (v === 0 ? 'Auto' : `${v}px`)}
          onChange={(v) => update({ subtitleSize: v })}
          onInstant={(v) => instantText('subtitleSize', v)}
          disabled={screen.autoSizeSubtitle}
        />
        <Checkbox
          label="Auto-size Headline"
          checked={screen.autoSizeHeadline}
          onChange={(v) => update({ autoSizeHeadline: v })}
        />
        <Checkbox
          label="Auto-size Subtitle"
          checked={screen.autoSizeSubtitle}
          onChange={(v) => update({ autoSizeSubtitle: v })}
        />
        <RangeSlider
          label="Headline Rotation"
          value={screen.headlineRotation}
          min={-30}
          max={30}
          formatValue={(v) => `${v}\u00B0`}
          onChange={(v) => update({ headlineRotation: v })}
          onInstant={(v) => instantText('headlineRotation', v)}
        />
        <RangeSlider
          label="Subtitle Rotation"
          value={screen.subtitleRotation}
          min={-30}
          max={30}
          formatValue={(v) => `${v}\u00B0`}
          onChange={(v) => update({ subtitleRotation: v })}
          onInstant={(v) => instantText('subtitleRotation', v)}
        />
        <RangeSlider
          label="Headline Line Height"
          value={screen.headlineLineHeight}
          min={80}
          max={180}
          formatValue={(v) => (v === 0 ? 'Auto' : (v / 100).toFixed(2))}
          onChange={(v) => update({ headlineLineHeight: v })}
        />
        <RangeSlider
          label="Headline Letter Spacing"
          value={screen.headlineLetterSpacing}
          min={-5}
          max={10}
          formatValue={(v) => (v === 0 ? 'Auto' : `${v / 100}em`)}
          onChange={(v) => update({ headlineLetterSpacing: v })}
        />
        <div className="flex gap-2 mb-2">
          <div className="flex-1">
            <Select
              label="Headline Case"
              value={screen.headlineTextTransform}
              onChange={(v) => update({ headlineTextTransform: v })}
              options={TEXT_TRANSFORM_OPTIONS}
            />
          </div>
          <div className="flex-1">
            <Select
              label="Headline Style"
              value={screen.headlineFontStyle}
              onChange={(v) => update({ headlineFontStyle: v })}
              options={FONT_STYLE_OPTIONS}
            />
          </div>
        </div>
        <RangeSlider
          label="Subtitle Opacity"
          value={screen.subtitleOpacity}
          min={0}
          max={100}
          formatValue={(v) => (v === 0 ? 'Auto' : `${v}%`)}
          onChange={(v) => update({ subtitleOpacity: v })}
        />
        <RangeSlider
          label="Subtitle Letter Spacing"
          value={screen.subtitleLetterSpacing}
          min={-5}
          max={10}
          formatValue={(v) => (v === 0 ? 'Auto' : `${v / 100}em`)}
          onChange={(v) => update({ subtitleLetterSpacing: v })}
        />
        <Select
          label="Subtitle Case"
          value={screen.subtitleTextTransform}
          onChange={(v) => update({ subtitleTextTransform: v })}
          options={TEXT_TRANSFORM_OPTIONS}
        />
      </Section>

      {/* Text Position */}
      <Section title="Text Position">
        <span className="text-[11px] text-text-dim leading-tight block mb-1.5">
          Drag the headline or subtitle in the preview to reposition them.
        </span>
        <button
          className="w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
          onClick={() =>
            update({ textPositions: { headline: null, subtitle: null } })
          }
        >
          Reset to Default
        </button>
      </Section>

      {/* Text Gradient */}
      <Section title="Text Gradient">
        <Checkbox
          label="Enable Headline Gradient"
          checked={!!screen.headlineGradient}
          onChange={(checked) =>
            update({
              headlineGradient: checked
                ? { colors: ['#6366f1', '#ec4899'], direction: 90 }
                : null,
            })
          }
        />
        {screen.headlineGradient && (
          <>
            <ColorPicker
              label="Start"
              value={screen.headlineGradient.colors[0] ?? '#6366f1'}
              onChange={(v) =>
                update({
                  headlineGradient: {
                    ...screen.headlineGradient!,
                    colors: [v, screen.headlineGradient!.colors[1] ?? '#ec4899'],
                  },
                })
              }
            />
            <ColorPicker
              label="End"
              value={screen.headlineGradient.colors[1] ?? '#ec4899'}
              onChange={(v) =>
                update({
                  headlineGradient: {
                    ...screen.headlineGradient!,
                    colors: [screen.headlineGradient!.colors[0] ?? '#6366f1', v],
                  },
                })
              }
            />
            <RangeSlider
              label="Direction"
              value={screen.headlineGradient.direction}
              min={0}
              max={360}
              formatValue={(v) => `${v}\u00B0`}
              onChange={(v) =>
                update({
                  headlineGradient: { ...screen.headlineGradient!, direction: v },
                })
              }
            />
          </>
        )}

        <div className="mt-2.5">
          <Checkbox
            label="Enable Subtitle Gradient"
            checked={!!screen.subtitleGradient}
            onChange={(checked) =>
              update({
                subtitleGradient: checked
                  ? { colors: ['#6366f1', '#ec4899'], direction: 90 }
                  : null,
              })
            }
          />
        </div>
        {screen.subtitleGradient && (
          <>
            <ColorPicker
              label="Start"
              value={screen.subtitleGradient.colors[0] ?? '#6366f1'}
              onChange={(v) =>
                update({
                  subtitleGradient: {
                    ...screen.subtitleGradient!,
                    colors: [v, screen.subtitleGradient!.colors[1] ?? '#ec4899'],
                  },
                })
              }
            />
            <ColorPicker
              label="End"
              value={screen.subtitleGradient.colors[1] ?? '#ec4899'}
              onChange={(v) =>
                update({
                  subtitleGradient: {
                    ...screen.subtitleGradient!,
                    colors: [screen.subtitleGradient!.colors[0] ?? '#6366f1', v],
                  },
                })
              }
            />
            <RangeSlider
              label="Direction"
              value={screen.subtitleGradient.direction}
              min={0}
              max={360}
              formatValue={(v) => `${v}\u00B0`}
              onChange={(v) =>
                update({
                  subtitleGradient: { ...screen.subtitleGradient!, direction: v },
                })
              }
            />
          </>
        )}
      </Section>
    </>
  );
}
