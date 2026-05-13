import { useRef, useCallback } from 'react';
import { useCurrentScreen } from '../../hooks/useCurrentScreen';
import { usePreviewStore } from '../../store';
import { useInstantPatch } from '../../hooks/useInstantPatch';
import { ColorPicker } from '../Controls/ColorPicker';
import { RangeSlider } from '../Controls/RangeSlider';
import { Checkbox } from '../Controls/Checkbox';
import { Select } from '../Controls/Select';
import { BackgroundCategory } from '../Controls/BackgroundCategory';
import { SOLID_PRESETS, GRADIENT_PRESETS } from '../../utils/presets';
import type { GradientPreset } from '../../utils/presets';

const RADIAL_POSITIONS = [
  { value: 'center', label: 'Center' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

function gradientToCss(p: GradientPreset): string {
  const colors = p.colors.join(', ');
  if (p.type === 'radial') {
    return `radial-gradient(circle at ${p.radialPosition ?? 'center'}, ${colors})`;
  }
  return `linear-gradient(${p.direction}deg, ${colors})`;
}

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

  // Legacy screens may still carry backgroundType: 'preset' — treat as solid
  // for UI purposes so the radios match one option.
  const bgType = screen.backgroundType === 'preset' ? 'solid' : screen.backgroundType;
  const uiMode = bgType;
  const currentColor = screen.backgroundColor;
  const isCurrentSolid = uiMode === 'solid';

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const { selectedScreen, updateScreen } = usePreviewStore.getState();
      updateScreen(selectedScreen, { backgroundImageDataUrl: dataUrl });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const applySolidPreset = (hex: string) => {
    update({ backgroundType: 'solid', backgroundColor: hex });
  };

  const applyGradientPreset = (preset: GradientPreset) => {
    update({
      backgroundType: 'gradient',
      backgroundGradient: {
        type: preset.type ?? 'linear',
        colors: [...preset.colors],
        direction: preset.direction,
        radialPosition: preset.radialPosition ?? 'center',
      },
    });
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
    <div className="mx-3 mt-4 mb-4 px-1">
      {/* The entire Background tab IS the Background context — no need for
          a wrapping "BACKGROUND" Section header. Content is rendered flush
          with the tab; each subgroup (Solid / Gradient / Image / Customize)
          gets its own inline title via BackgroundCategory or local divs. */}
      {/* Custom color picker — opens the HSV popover */}
        <ColorPicker
          label="Custom color"
          value={screen.backgroundColor}
          onChange={(v) => update({ backgroundType: 'solid', backgroundColor: v })}
          onInstant={instantBgColor}
        />

        {/* Solid catalog */}
        <BackgroundCategory
          name="Solid"
          items={SOLID_PRESETS}
          initialCount={5}
          renderTile={(hex) => {
            const selected = isCurrentSolid && currentColor.toLowerCase() === hex.toLowerCase();
            return (
              <button
                key={hex}
                type="button"
                className={`aspect-square rounded-md transition-all duration-150 active:scale-[0.95] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent thumb-outline ${
                  selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : 'hover:scale-[1.06]'
                }`}
                style={{ background: hex }}
                title={hex}
                aria-label={`Solid ${hex}`}
                aria-pressed={selected}
                onClick={() => applySolidPreset(hex)}
              />
            );
          }}
        />

        {/* Gradient catalog */}
        <BackgroundCategory
          name="Gradient"
          items={GRADIENT_PRESETS}
          initialCount={5}
          renderTile={(preset) => {
            const css = gradientToCss(preset);
            return (
              <button
                key={preset.name}
                type="button"
                className="aspect-square rounded-lg transition-all duration-150 active:scale-[0.95] hover:scale-[1.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent thumb-outline"
                style={{ background: css }}
                title={preset.name}
                aria-label={`Apply ${preset.name} gradient`}
                onClick={() => applyGradientPreset(preset)}
              />
            );
          }}
        />

        {/* Customize Gradient — sits between Gradient catalog and Image,
            only when a gradient bg is active. Inlined under a small title
            so it doesn't need a separate Section. */}
        {uiMode === 'gradient' && (
          <div className="mb-5">
            <div className="text-sm font-semibold text-text mb-2 px-1">Customize gradient</div>
            <div className="flex gap-3 mb-2">
              {(['linear', 'radial'] as const).map((t) => (
                <label key={t} className="text-xs text-text-dim cursor-pointer flex items-center gap-1">
                  <input
                    type="radio"
                    name="gradient-type"
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

            {screen.backgroundGradient.type === 'linear' && (
              <RangeSlider
                label="Direction"
                value={screen.backgroundGradient.direction}
                min={0}
                max={360}
                formatValue={(v) => `${v}°`}
                onChange={(v) =>
                  update({
                    backgroundGradient: { ...screen.backgroundGradient, direction: v },
                  })
                }
                onInstant={(v) => instantGradient({ direction: v })}
              />
            )}

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
                className="btn-secondary w-full text-[11px]"
                onClick={addGradientStop}
              >
                + Add Color Stop
              </button>
            )}
          </div>
        )}

        {/* Image section — peer row with its own controls */}
        <div className="mb-5">
          <div className="text-sm font-semibold text-text mb-2 px-1">Image</div>
          {!screen.backgroundImageDataUrl ? (
            <button
              className="btn-secondary w-full text-xs"
              onClick={() => bgImageInputRef.current?.click()}
            >
              Upload background image
            </button>
          ) : (
            <>
              <div className="relative">
                <img
                  src={screen.backgroundImageDataUrl}
                  className="w-full max-h-24 object-cover rounded-xl thumb-outline"
                  alt="Background"
                />
              </div>
              <div className="flex gap-1.5 mt-2">
                <button
                  className="btn-secondary flex-1 text-[11px]"
                  onClick={() => bgImageInputRef.current?.click()}
                >
                  Replace
                </button>
                <button
                  className="btn-secondary flex-1 text-[11px]"
                  onClick={() => update({ backgroundImageDataUrl: null })}
                >
                  Remove
                </button>
              </div>
            </>
          )}
          <input
            ref={bgImageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            aria-label="Upload background image"
            onChange={handleBgImageUpload}
          />
          {uiMode === 'image' && (
            <div className="mt-3">
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
                    label="Overlay color"
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
          )}
        </div>
    </div>
  );
}
