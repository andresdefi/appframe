import { useRef, useCallback } from 'react';
import { useCurrentScreen } from '../../hooks/useCurrentScreen';
import { useInstantPatch } from '../../hooks/useInstantPatch';
import { Section } from '../Controls/Section';
import { ColorPicker } from '../Controls/ColorPicker';
import { RangeSlider } from '../Controls/RangeSlider';
import { Checkbox } from '../Controls/Checkbox';
import { Select } from '../Controls/Select';
import { SOLID_PRESETS, GRADIENT_PRESETS } from '../../utils/presets';
import type { BackgroundType, TemplateStyle } from '../../types';

const TEMPLATE_OPTIONS = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'bold', label: 'Bold' },
  { value: 'glow', label: 'Glow' },
  { value: 'playful', label: 'Playful' },
  { value: 'clean', label: 'Clean' },
  { value: 'branded', label: 'Branded' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'fullscreen', label: 'Fullscreen Screenshot' },
];

const BG_TYPES: { value: BackgroundType; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'image', label: 'Image' },
  { value: 'preset', label: 'Preset' },
];

const RADIAL_POSITIONS = [
  { value: 'center', label: 'Center' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

export function DesignTab() {
  const { screen, update } = useCurrentScreen();
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const { patchBackground } = useInstantPatch();

  const instantBgColor = useCallback(
    (color: string) => patchBackground({ type: 'solid', color }),
    [patchBackground],
  );

  const instantGradient = useCallback(
    (overrides?: { direction?: number; colors?: string[] }) => {
      if (!screen) return;
      const g = screen.backgroundGradient;
      patchBackground({
        type: 'gradient',
        gradientType: g.type,
        colors: overrides?.colors ?? g.colors,
        direction: overrides?.direction ?? g.direction,
        radialPosition: g.radialPosition,
      });
    },
    [screen, patchBackground],
  );

  if (!screen) return null;

  const bgType = screen.backgroundType;

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      update({ backgroundImageDataUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addGradientStop = () => {
    const colors = [...screen.backgroundGradient.colors];
    if (colors.length >= 5) return;
    colors.push('#ffffff');
    update({
      backgroundGradient: { ...screen.backgroundGradient, colors },
    });
  };

  return (
    <>
      <Section title="Background">
        {/* Background type radio */}
        <div className="flex gap-3 mb-2.5">
          {BG_TYPES.map((bt) => (
            <label key={bt.value} className="text-xs text-text-dim cursor-pointer flex items-center gap-1">
              <input
                type="radio"
                name="bg-type"
                value={bt.value}
                checked={bgType === bt.value}
                onChange={() => update({ backgroundType: bt.value })}
                className="accent-accent"
              />
              {bt.label}
            </label>
          ))}
        </div>

        {/* Preset controls */}
        {bgType === 'preset' && (
          <Select
            label="Style Preset"
            value={screen.style}
            onChange={(v) => update({ style: v as TemplateStyle })}
            options={TEMPLATE_OPTIONS}
          />
        )}

        {/* Solid color controls */}
        {bgType === 'solid' && (
          <ColorPicker
            label="Color"
            value={screen.backgroundColor}
            onChange={(v) => update({ backgroundColor: v })}
            onInstant={instantBgColor}
            presets={SOLID_PRESETS}
          />
        )}

        {/* Gradient controls */}
        {bgType === 'gradient' && (
          <>
            {/* Gradient presets */}
            <div className="flex flex-wrap gap-1 mb-2">
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  className="w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    background: `linear-gradient(${preset.direction}deg, ${preset.colors.join(', ')})`,
                  }}
                  title={preset.name}
                  onClick={() =>
                    update({
                      backgroundGradient: {
                        type: 'linear',
                        colors: [...preset.colors],
                        direction: preset.direction,
                        radialPosition: 'center',
                      },
                    })
                  }
                />
              ))}
            </div>

            {/* Linear/Radial toggle */}
            <div className="flex gap-3 mb-2">
              {(['linear', 'radial'] as const).map((t) => (
                <label key={t} className="text-xs text-text-dim cursor-pointer flex items-center gap-1">
                  <input
                    type="radio"
                    checked={screen.backgroundGradient.type === t}
                    onChange={() =>
                      update({
                        backgroundGradient: { ...screen.backgroundGradient, type: t },
                      })
                    }
                    className="accent-accent"
                  />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
            </div>

            <RangeSlider
              label="Direction"
              value={screen.backgroundGradient.direction}
              min={0}
              max={360}
              formatValue={(v) => `${v}\u00B0`}
              onChange={(v) =>
                update({
                  backgroundGradient: { ...screen.backgroundGradient, direction: v },
                })
              }
              onInstant={(v) => instantGradient({ direction: v })}
            />

            {screen.backgroundGradient.type === 'radial' && (
              <Select
                label="Center"
                value={screen.backgroundGradient.radialPosition}
                onChange={(v) =>
                  update({
                    backgroundGradient: { ...screen.backgroundGradient, radialPosition: v as 'center' | 'top' | 'bottom' | 'left' | 'right' },
                  })
                }
                options={RADIAL_POSITIONS}
              />
            )}

            {/* Color stops */}
            {screen.backgroundGradient.colors.map((color, i) => (
              <ColorPicker
                key={i}
                label={`Stop ${i + 1}`}
                value={color}
                onChange={(v) => {
                  const colors = [...screen.backgroundGradient.colors];
                  colors[i] = v;
                  update({
                    backgroundGradient: { ...screen.backgroundGradient, colors },
                  });
                }}
              />
            ))}

            {screen.backgroundGradient.colors.length < 5 && (
              <button
                className="w-full text-[11px] py-1 bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
                onClick={addGradientStop}
              >
                + Add Color Stop
              </button>
            )}
          </>
        )}

        {/* Image controls */}
        {bgType === 'image' && (
          <>
            <button
              className="w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2"
              onClick={() => bgImageInputRef.current?.click()}
            >
              Upload Background Image
            </button>
            <input
              ref={bgImageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleBgImageUpload}
            />

            {screen.backgroundImageDataUrl && (
              <div className="mt-1.5">
                <img
                  src={screen.backgroundImageDataUrl}
                  className="w-full max-h-20 object-cover rounded-md border border-border"
                  alt="Background"
                />
                <button
                  className="w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1"
                  onClick={() => update({ backgroundImageDataUrl: null })}
                >
                  Remove
                </button>
              </div>
            )}

            {/* Overlay */}
            <div className="mt-2">
              <Checkbox
                label="Dim Overlay"
                checked={!!screen.backgroundOverlay}
                onChange={(checked) =>
                  update({
                    backgroundOverlay: checked
                      ? { color: '#000000', opacity: 0.3 }
                      : null,
                  })
                }
              />
              {screen.backgroundOverlay && (
                <>
                  <ColorPicker
                    label="Color"
                    value={screen.backgroundOverlay.color}
                    onChange={(v) =>
                      update({
                        backgroundOverlay: { ...screen.backgroundOverlay!, color: v },
                      })
                    }
                  />
                  <RangeSlider
                    label="Opacity"
                    value={Math.round(screen.backgroundOverlay.opacity * 100)}
                    min={0}
                    max={100}
                    formatValue={(v) => `${v}%`}
                    onChange={(v) =>
                      update({
                        backgroundOverlay: { ...screen.backgroundOverlay!, opacity: v / 100 },
                      })
                    }
                  />
                </>
              )}
            </div>
          </>
        )}
      </Section>

      {/* Colors section — only visible in preset mode */}
      <Section title="Colors" hidden={bgType !== 'preset'}>
        <ColorPicker
          label="Primary"
          value={screen.colors.primary}
          onChange={(v) => update({ colors: { ...screen.colors, primary: v } })}
        />
        <ColorPicker
          label="Secondary"
          value={screen.colors.secondary}
          onChange={(v) => update({ colors: { ...screen.colors, secondary: v } })}
        />
        <ColorPicker
          label="Background"
          value={screen.colors.background}
          onChange={(v) => update({ colors: { ...screen.colors, background: v } })}
        />
        <ColorPicker
          label="Text"
          value={screen.colors.text}
          onChange={(v) => update({ colors: { ...screen.colors, text: v } })}
        />
        <ColorPicker
          label="Subtitle"
          value={screen.colors.subtitle}
          onChange={(v) => update({ colors: { ...screen.colors, subtitle: v } })}
        />
      </Section>
    </>
  );
}
