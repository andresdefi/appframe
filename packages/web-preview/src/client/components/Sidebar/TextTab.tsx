import { useCallback, useMemo } from 'react';
import { useCurrentScreen } from '../../hooks/useCurrentScreen';
import { usePreviewStore } from '../../store';
import { useInstantPatch } from '../../hooks/useInstantPatch';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { RangeSlider } from '../Controls/RangeSlider';
import { ColorPicker } from '../Controls/ColorPicker';
import { Checkbox } from '../Controls/Checkbox';
import { RichTextEditor, richTextToPlain } from '../Controls/RichTextEditor';
import { buildFontGroups } from '../../utils/fontGroups';
import { getLocaleLabel } from '@appframe/core/locales';

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
  const activeLocale = usePreviewStore((s) => s.locale);
  const isDefault = activeLocale === 'default';
  const fonts = usePreviewStore((s) => s.fonts);
  const { patchText } = useInstantPatch();
  const instantText = useCallback(
    (key: string, v: number) => patchText({ [key]: v }),
    [patchText],
  );

  const fontGroups = useMemo(() => buildFontGroups(fonts), [fonts]);

  if (!screen) return null;

  // Snapshot model: every TextTab control writes to the active locale's
  // own ScreenState via `update` (locale-aware routing in the store).
  // Everything is editable per locale — text content, typography, colors,
  // position, gradients. No locking inside the Text tab.
  const hasSubtitle = richTextToPlain(screen.subtitle).length > 0;

  return (
    <>
      {!isDefault && (
        <div className="mx-3 mt-3 p-2.5 rounded-md bg-surface-2/60 text-[11px] text-text-dim leading-snug">
          Editing <span className="text-text font-medium">{getLocaleLabel(activeLocale)}</span>.
          This locale is an independent copy — changes here don't affect Default or other locales.
        </div>
      )}
      {/* Headline */}
      <Section
        title="Headline"
        tooltip="Edit the headline text and its typography. Use the toolbar color button: applies to the selection, or sets the base color when nothing is selected."
        defaultCollapsed={false}
      >
        <RichTextEditor
          label=""
          value={screen.headline}
          onChange={(html) => update({ headline: html })}
          onInstant={(html) => patchText({ headlineHtml: html })}
          baseColor={screen.colors.text}
          onBaseColor={(v) => update({ colors: { ...screen.colors, text: v } })}
          onBaseColorInstant={(v) => patchText({ headlineColor: v })}
        />
        <div>
          <Select
            label="Font"
            value={screen.headlineFont}
            onChange={(v) => update({ headlineFont: v })}
            groups={fontGroups}
          />
          <RangeSlider
            label="Weight"
            value={screen.headlineFontWeight}
            min={100}
            max={900}
            step={100}
            formatValue={(v) => String(v)}
            onChange={(v) => update({ headlineFontWeight: v })}
          />
          <RangeSlider
            label="Size"
            value={screen.headlineSize < 40 ? 40 : screen.headlineSize}
            min={40}
            max={200}
            formatValue={(v) => `${v}px`}
            onChange={(v) => update({ headlineSize: v })}
            onInstant={(v) => instantText('headlineSize', v)}
            resetTo={0}
            resetLabel="Auto"
          />
          <RangeSlider
            label="Rotation"
            value={screen.headlineRotation}
            min={-30}
            max={30}
            formatValue={(v) => `${v}°`}
            onChange={(v) => update({ headlineRotation: v })}
            onInstant={(v) => instantText('headlineRotation', v)}
            resetTo={0}
          />
          <RangeSlider
            label="Line Height"
            value={screen.headlineLineHeight}
            min={80}
            max={180}
            formatValue={(v) => (v === 0 ? 'Auto' : (v / 100).toFixed(2))}
            onChange={(v) => update({ headlineLineHeight: v })}
            resetTo={0}
            resetLabel="Auto"
          />
          <RangeSlider
            label="Letter Spacing"
            value={screen.headlineLetterSpacing}
            min={-5}
            max={10}
            formatValue={(v) => (v === 0 ? 'Auto' : `${v / 100}em`)}
            onChange={(v) => update({ headlineLetterSpacing: v })}
            resetTo={0}
            resetLabel="Auto"
          />
          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <Select
                label="Case"
                value={screen.headlineTextTransform}
                onChange={(v) => update({ headlineTextTransform: v })}
                options={TEXT_TRANSFORM_OPTIONS}
              />
            </div>
            <div className="flex-1">
              <Select
                label="Style"
                value={screen.headlineFontStyle}
                onChange={(v) => update({ headlineFontStyle: v })}
                options={FONT_STYLE_OPTIONS}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Subtitle */}
      <Section
        title="Subtitle"
        tooltip="Edit the subtitle text and its typography."
        defaultCollapsed
      >
        <RichTextEditor
          label=""
          value={screen.subtitle}
          onChange={(html) => update({ subtitle: html })}
          onInstant={(html) => patchText({ subtitleHtml: html })}
          baseColor={screen.colors.subtitle}
          onBaseColor={(v) => update({ colors: { ...screen.colors, subtitle: v } })}
          onBaseColorInstant={(v) => patchText({ subtitleColor: v })}
          minHeight={48}
        />
        {hasSubtitle && (
          <div>
            <Select
              label="Font"
              value={screen.subtitleFont}
              onChange={(v) => update({ subtitleFont: v })}
              groups={fontGroups}
            />
            <RangeSlider
              label="Weight"
              value={screen.subtitleFontWeight}
              min={100}
              max={900}
              step={100}
              formatValue={(v) => String(v)}
              onChange={(v) => update({ subtitleFontWeight: v })}
            />
            <RangeSlider
              label="Size"
              value={screen.subtitleSize < 20 ? 20 : screen.subtitleSize}
              min={20}
              max={120}
              formatValue={(v) => `${v}px`}
              onChange={(v) => update({ subtitleSize: v })}
              onInstant={(v) => instantText('subtitleSize', v)}
              resetTo={0}
              resetLabel="Auto"
            />
            <RangeSlider
              label="Rotation"
              value={screen.subtitleRotation}
              min={-30}
              max={30}
              formatValue={(v) => `${v}°`}
              onChange={(v) => update({ subtitleRotation: v })}
              onInstant={(v) => instantText('subtitleRotation', v)}
              resetTo={0}
            />
            <RangeSlider
              label="Opacity"
              value={screen.subtitleOpacity}
              min={0}
              max={100}
              formatValue={(v) => (v === 0 ? 'Auto' : `${v}%`)}
              onChange={(v) => update({ subtitleOpacity: v })}
              resetTo={0}
              resetLabel="Auto"
            />
            <RangeSlider
              label="Letter Spacing"
              value={screen.subtitleLetterSpacing}
              min={-5}
              max={10}
              formatValue={(v) => (v === 0 ? 'Auto' : `${v / 100}em`)}
              onChange={(v) => update({ subtitleLetterSpacing: v })}
              resetTo={0}
              resetLabel="Auto"
            />
            <Select
              label="Case"
              value={screen.subtitleTextTransform}
              onChange={(v) => update({ subtitleTextTransform: v })}
              options={TEXT_TRANSFORM_OPTIONS}
            />
          </div>
        )}
      </Section>

      {/* Free Text */}
      <Section
        title="Free Text"
        tooltip="Optional third text slot, draggable in the canvas."
        defaultCollapsed={!screen.freeTextEnabled}
      >
        <div className="mb-2">
          <Checkbox
            label="Enable free text"
            checked={screen.freeTextEnabled}
            onChange={(checked) => update({ freeTextEnabled: checked })}
          />
        </div>
        {screen.freeTextEnabled && (
          <>
            <RichTextEditor
              label=""
              value={screen.freeText}
              onChange={(html) => update({ freeText: html })}
              onInstant={(html) => patchText({ freeTextHtml: html })}
              baseColor={screen.colors.freeText}
              onBaseColor={(v) => update({ colors: { ...screen.colors, freeText: v } })}
              onBaseColorInstant={(v) => patchText({ freeTextColor: v })}
              minHeight={48}
            />
            <div>
              <Select
                label="Font"
                value={screen.freeTextFont}
                onChange={(v) => update({ freeTextFont: v })}
                groups={fontGroups}
              />
              <RangeSlider
                label="Weight"
                value={screen.freeTextFontWeight}
                min={100}
                max={900}
                step={100}
                formatValue={(v) => String(v)}
                onChange={(v) => update({ freeTextFontWeight: v })}
              />
              <RangeSlider
                label="Size"
                value={screen.freeTextSize < 20 ? 20 : screen.freeTextSize}
                min={20}
                max={120}
                formatValue={(v) => `${v}px`}
                onChange={(v) => update({ freeTextSize: v })}
                onInstant={(v) => instantText('freeTextSize', v)}
                resetTo={0}
                resetLabel="Auto"
              />
              <RangeSlider
                label="Rotation"
                value={screen.freeTextRotation}
                min={-30}
                max={30}
                formatValue={(v) => `${v}°`}
                onChange={(v) => update({ freeTextRotation: v })}
                onInstant={(v) => instantText('freeTextRotation', v)}
                resetTo={0}
              />
              <RangeSlider
                label="Letter Spacing"
                value={screen.freeTextLetterSpacing}
                min={-5}
                max={10}
                formatValue={(v) => (v === 0 ? 'Auto' : `${v / 100}em`)}
                onChange={(v) => update({ freeTextLetterSpacing: v })}
                resetTo={0}
                resetLabel="Auto"
              />
              <Select
                label="Case"
                value={screen.freeTextTextTransform}
                onChange={(v) => update({ freeTextTextTransform: v })}
                options={TEXT_TRANSFORM_OPTIONS}
              />
            </div>
          </>
        )}
      </Section>

      {/* Text Position */}
      <Section title="Text Position" tooltip="Drag text elements in the preview to reposition, or reset to default positions.">
        <span className="text-[11px] text-text-dim leading-tight block mb-1.5">
          Drag the headline or subtitle in the preview to reposition them.
        </span>
        <button
          className="btn-secondary w-full text-[11px]"
          onClick={() =>
            update({ textPositions: { headline: null, subtitle: null, freeText: null } })
          }
        >
          Reset to Default
        </button>
      </Section>

      {/* Text Gradient */}
      <Section title="Text Gradient" tooltip="Apply a gradient color effect to headline or subtitle text." defaultCollapsed>
        <div>
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
              formatValue={(v) => `${v}°`}
              onChange={(v) =>
                update({
                  headlineGradient: { ...screen.headlineGradient!, direction: v },
                })
              }
              resetTo={90}
            />
          </>
        )}

        {hasSubtitle && (
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
        )}
        {hasSubtitle && screen.subtitleGradient && (
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
              formatValue={(v) => `${v}°`}
              onChange={(v) =>
                update({
                  subtitleGradient: { ...screen.subtitleGradient!, direction: v },
                })
              }
              resetTo={90}
            />
          </>
        )}
        </div>
      </Section>
    </>
  );
}
