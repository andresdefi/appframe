import { useCallback, useId, useMemo } from 'react';
import { useCurrentScreen } from '../../hooks/useCurrentScreen';
import { usePreviewStore } from '../../store';
import { useInstantPatch } from '../../hooks/useInstantPatch';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { RangeSlider } from '../Controls/RangeSlider';
import { ColorPicker } from '../Controls/ColorPicker';
import { Checkbox } from '../Controls/Checkbox';
import { buildFontGroups } from '../../utils/fontGroups';
import type { ScreenState } from '../../types';

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

type ElementKey = 'eyebrow' | 'headline' | 'subtitle';

export function TextTab() {
  const { screen, update } = useCurrentScreen();
  const fonts = usePreviewStore((s) => s.fonts);
  const { patchText } = useInstantPatch();
  const instantText = useCallback(
    (key: string, v: number) => patchText({ [key]: v }),
    [patchText],
  );

  const fontGroups = useMemo(() => buildFontGroups(fonts), [fonts]);

  const eyebrowId = useId();
  const headlineId = useId();
  const subtitleId = useId();

  if (!screen) return null;

  const hasSubtitle = screen.subtitle.length > 0;
  const hasEyebrow = screen.eyebrow.length > 0;

  function setOverrideFont(element: ElementKey, value: string) {
    if (!screen) return;
    const fontKey = `${element}Font` as const;
    const patch: Partial<ScreenState> = {};
    if (value === screen.font) {
      patch[fontKey] = null;
    } else {
      patch[fontKey] = value;
    }
    update(patch);
  }

  function setOverrideWeight(element: ElementKey, value: number) {
    if (!screen) return;
    const weightKey = `${element}FontWeight` as const;
    const patch: Partial<ScreenState> = {};
    if (value === screen.fontWeight) {
      patch[weightKey] = null;
    } else {
      patch[weightKey] = value;
    }
    update(patch);
  }

  function resetElementOverrides(element: ElementKey) {
    if (element === 'eyebrow') {
      update({ eyebrowFont: null, eyebrowFontWeight: null });
    } else if (element === 'headline') {
      update({ headlineFont: null, headlineFontWeight: null });
    } else {
      update({ subtitleFont: null, subtitleFontWeight: null });
    }
  }

  const effectiveEyebrowFont = screen.eyebrowFont ?? screen.font;
  const effectiveEyebrowWeight = screen.eyebrowFontWeight ?? screen.fontWeight;
  const effectiveHeadlineFont = screen.headlineFont ?? screen.font;
  const effectiveHeadlineWeight = screen.headlineFontWeight ?? screen.fontWeight;
  const effectiveSubtitleFont = screen.subtitleFont ?? screen.font;
  const effectiveSubtitleWeight = screen.subtitleFontWeight ?? screen.fontWeight;

  const eyebrowHasOverride =
    screen.eyebrowFont !== null || screen.eyebrowFontWeight !== null;
  const headlineHasOverride =
    screen.headlineFont !== null || screen.headlineFontWeight !== null;
  const subtitleHasOverride =
    screen.subtitleFont !== null || screen.subtitleFontWeight !== null;

  return (
    <>
      {/* Text inputs */}
      <Section title="Text" tooltip="Edit the eyebrow, headline, and subtitle text that appears above or below the device frame." defaultCollapsed={false}>
        {hasEyebrow && (
          <div className="mb-2.5">
            <label htmlFor={eyebrowId} className="block text-xs text-text-dim mb-1">
              Eyebrow <span className="text-text-dim opacity-60">(small label above the headline)</span>
            </label>
            <input
              id={eyebrowId}
              type="text"
              value={screen.eyebrow}
              onChange={(e) => update({ eyebrow: e.target.value })}
              placeholder='e.g. "Split View"'
              className="w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent"
            />
          </div>
        )}
        <div className="mb-2.5">
          <label htmlFor={headlineId} className="block text-xs text-text-dim mb-1">Headline</label>
          <textarea
            id={headlineId}
            rows={2}
            value={screen.headline}
            onChange={(e) => update({ headline: e.target.value })}
            className="w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[60px]"
          />
        </div>
        {hasSubtitle && (
          <div className="mb-2.5">
            <label htmlFor={subtitleId} className="block text-xs text-text-dim mb-1">Subtitle</label>
            <input
              id={subtitleId}
              type="text"
              value={screen.subtitle}
              onChange={(e) => update({ subtitle: e.target.value })}
              placeholder="Optional subtitle"
              className="w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent"
            />
          </div>
        )}
        <ColorPicker
          label="Headline Color"
          value={screen.colors.text}
          onChange={(v) => update({ colors: { ...screen.colors, text: v } })}
        />
        {hasSubtitle && (
          <ColorPicker
            label="Subtitle Color"
            value={screen.colors.subtitle}
            onChange={(v) => update({ colors: { ...screen.colors, subtitle: v } })}
          />
        )}
        <ColorPicker
          label="Accent Color (eyebrow, links)"
          value={screen.accentColor || screen.colors.primary}
          onChange={(v) => update({ accentColor: v })}
        />
      </Section>

      {/* Typography */}
      <Section title="Typography" tooltip="Control font family, weight, size, rotation, spacing, and text transformations.">
        <Checkbox
          label="Include eyebrow"
          checked={hasEyebrow}
          onChange={(checked) => {
            if (checked) {
              // Reveal the input; leave text empty so the user can type.
              return;
            }
            update({ eyebrow: '' });
          }}
        />
        <Checkbox
          label="Include subtitle"
          checked={hasSubtitle}
          onChange={(checked) => {
            if (checked) {
              // Reveal the input; leave text empty so the user can type.
              return;
            }
            update({ subtitle: '', subtitleGradient: null });
          }}
        />

        <div className="mb-3 px-1">
          <div className="text-[11px] font-medium text-text-dim uppercase tracking-wider mb-2">
            Defaults (used when an element has no override)
          </div>
          <Select
            label="Font"
            value={screen.font}
            onChange={(v) => update({ font: v })}
            groups={fontGroups}
          />
          <RangeSlider
            label="Font Weight"
            value={screen.fontWeight}
            min={100}
            max={900}
            step={100}
            formatValue={(v) => String(v)}
            onChange={(v) => update({ fontWeight: v })}
          />
        </div>

        {hasEyebrow && (
          <Section title="Eyebrow" defaultCollapsed>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] text-text-dim">
                {eyebrowHasOverride ? 'Custom override active' : 'Using defaults'}
              </span>
              <button
                type="button"
                onClick={() => resetElementOverrides('eyebrow')}
                disabled={!eyebrowHasOverride}
                className="text-[11px] text-accent hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
              >
                Reset to default
              </button>
            </div>
            <Select
              label="Font"
              value={effectiveEyebrowFont}
              onChange={(v) => setOverrideFont('eyebrow', v)}
              groups={fontGroups}
            />
            <RangeSlider
              label="Weight"
              value={effectiveEyebrowWeight}
              min={100}
              max={900}
              step={100}
              formatValue={(v) => String(v)}
              onChange={(v) => setOverrideWeight('eyebrow', v)}
            />
            <RangeSlider
              label="Eyebrow Size"
              value={screen.eyebrowSize}
              min={0}
              max={80}
              formatValue={(v) => (v === 0 ? 'Auto' : `${v}px`)}
              onChange={(v) => update({ eyebrowSize: v })}
            />
          </Section>
        )}

        <Section title="Headline" defaultCollapsed={false}>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] text-text-dim">
              {headlineHasOverride ? 'Custom override active' : 'Using defaults'}
            </span>
            <button
              type="button"
              onClick={() => resetElementOverrides('headline')}
              disabled={!headlineHasOverride}
              className="text-[11px] text-accent hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
            >
              Reset to default
            </button>
          </div>
          <Select
            label="Font"
            value={effectiveHeadlineFont}
            onChange={(v) => setOverrideFont('headline', v)}
            groups={fontGroups}
          />
          <RangeSlider
            label="Weight"
            value={effectiveHeadlineWeight}
            min={100}
            max={900}
            step={100}
            formatValue={(v) => String(v)}
            onChange={(v) => setOverrideWeight('headline', v)}
          />
          <RangeSlider
            label="Headline Size"
            value={screen.headlineSize < 40 ? 40 : screen.headlineSize}
            min={40}
            max={200}
            formatValue={(v) => `${v}px`}
            onChange={(v) => update({ headlineSize: v })}
            onInstant={(v) => instantText('headlineSize', v)}
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
        </Section>

        {hasSubtitle && (
          <Section title="Subtitle" defaultCollapsed>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] text-text-dim">
                {subtitleHasOverride ? 'Custom override active' : 'Using defaults'}
              </span>
              <button
                type="button"
                onClick={() => resetElementOverrides('subtitle')}
                disabled={!subtitleHasOverride}
                className="text-[11px] text-accent hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
              >
                Reset to default
              </button>
            </div>
            <Select
              label="Font"
              value={effectiveSubtitleFont}
              onChange={(v) => setOverrideFont('subtitle', v)}
              groups={fontGroups}
            />
            <RangeSlider
              label="Weight"
              value={effectiveSubtitleWeight}
              min={100}
              max={900}
              step={100}
              formatValue={(v) => String(v)}
              onChange={(v) => setOverrideWeight('subtitle', v)}
            />
            <RangeSlider
              label="Subtitle Size"
              value={screen.subtitleSize < 20 ? 20 : screen.subtitleSize}
              min={20}
              max={120}
              formatValue={(v) => `${v}px`}
              onChange={(v) => update({ subtitleSize: v })}
              onInstant={(v) => instantText('subtitleSize', v)}
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
        )}
      </Section>

      {/* Text Position */}
      <Section title="Text Position" tooltip="Drag text elements in the preview to reposition, or reset to default positions.">
        <span className="text-[11px] text-text-dim leading-tight block mb-1.5">
          Drag the headline or subtitle in the preview to reposition them.
        </span>
        <button
          className="w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
          onClick={() =>
            update({ textPositions: { eyebrow: null, headline: null, subtitle: null } })
          }
        >
          Reset to Default
        </button>
      </Section>

      {/* Text Gradient */}
      <Section title="Text Gradient" tooltip="Apply a gradient color effect to headline or subtitle text." defaultCollapsed>
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
