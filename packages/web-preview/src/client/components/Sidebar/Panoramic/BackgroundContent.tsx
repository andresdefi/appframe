import { useCallback, useState } from 'react';
import type { PanoramicBackgroundLayer } from '../../../types';
import { usePreviewStore } from '../../../store';
import { usePanoramicInstantPatch } from '../../../hooks/usePanoramicInstantPatch';
import { Section } from '../../Controls/Section';
import { ColorPicker } from '../../Controls/ColorPicker';
import { RangeSlider } from '../../Controls/RangeSlider';
import { Select } from '../../Controls/Select';
import { Checkbox } from '../../Controls/Checkbox';
import { GRADIENT_PRESETS, SOLID_PRESETS } from '../../../utils/presets';
import { getDefaultExportSizeKey, getPlatformPreviewSize } from '../../../utils/platformSelection';
import { PanoramicBgImage } from './PanoramicBgImage';
import {
  BLEND_MODE_OPTIONS,
  PLATFORM_OPTIONS,
  getBackgroundLayerLabel,
} from './helpers';

export function PanoramicBackgroundContent() {
  const frameCount = usePreviewStore((s) => s.panoramicFrameCount);
  const setFrameCount = usePreviewStore((s) => s.setPanoramicFrameCount);
  const background = usePreviewStore((s) => s.panoramicBackground);
  const updateBackground = usePreviewStore((s) => s.updatePanoramicBackground);
  const platform = usePreviewStore((s) => s.platform);
  const setPlatformRaw = usePreviewStore((s) => s.setPlatform);
  const setPreviewSize = usePreviewStore((s) => s.setPreviewSize);
  const sizes = usePreviewStore((s) => s.sizes);
  const setExportSize = usePreviewStore((s) => s.setExportSize);
  const syncPanoramicDevicesForPlatform = usePreviewStore((s) => s.syncPanoramicDevicesForPlatform);
  const { patchBackground } = usePanoramicInstantPatch();
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);

  const handlePlatformChange = useCallback(
    (v: string) => {
      setPlatformRaw(v);
      syncPanoramicDevicesForPlatform(v);
      const size = getPlatformPreviewSize(v);
      setPreviewSize(size.w, size.h);
      const defaultExportSize = getDefaultExportSizeKey(sizes, v);
      if (defaultExportSize) setExportSize(defaultExportSize);
    },
    [setExportSize, setPlatformRaw, setPreviewSize, sizes, syncPanoramicDevicesForPlatform],
  );

  const instantBgColor = useCallback(
    (color: string) => patchBackground({ type: 'solid', color }),
    [patchBackground],
  );

  const instantGradient = useCallback(
    (overrides?: { direction?: number; colors?: string[] }) => {
      const g = background.gradient ?? {
        type: 'linear' as const,
        colors: ['#6366f1', '#ec4899'],
        direction: 135,
        radialPosition: 'center' as const,
      };
      patchBackground({
        type: 'gradient',
        gradientType: g.type,
        colors: overrides?.colors ?? g.colors,
        direction: overrides?.direction ?? g.direction,
        radialPosition: g.radialPosition,
      });
    },
    [background.gradient, patchBackground],
  );

  const bgType = background.type;
  const bgColor = background.color ?? '#000000';
  const bgGradient = background.gradient ?? {
    type: 'linear' as const,
    colors: ['#6366f1', '#ec4899'],
    direction: 135,
    radialPosition: 'center' as const,
  };
  const layers = background.layers ?? [];
  const selectedLayer =
    layers.length > 0 ? layers[Math.min(selectedLayerIndex, layers.length - 1)] : null;

  const replaceLayers = useCallback(
    (nextLayers: PanoramicBackgroundLayer[]) => updateBackground({ layers: nextLayers }),
    [updateBackground],
  );

  const updateLayer = useCallback(
    (index: number, patch: PanoramicBackgroundLayer) => {
      const nextLayers = [...layers];
      nextLayers[index] = patch;
      replaceLayers(nextLayers);
    },
    [layers, replaceLayers],
  );

  const addLayer = useCallback(
    (kind: PanoramicBackgroundLayer['kind']) => {
      const next =
        kind === 'gradient'
          ? {
              kind: 'gradient' as const,
              gradientType: 'mesh' as const,
              colors: ['#60A5FA', '#A78BFA', '#F472B6'],
              direction: 135,
              radialPosition: 'center' as const,
              opacity: 0.8,
              blendMode: 'soft-light' as const,
              blur: 0,
            }
          : kind === 'image'
            ? {
                kind: 'image' as const,
                image: '',
                fit: 'cover' as const,
                position: 'center' as const,
                scale: 100,
                opacity: 0.24,
                blendMode: 'overlay' as const,
                blur: 0,
              }
            : kind === 'glow'
              ? {
                  kind: 'glow' as const,
                  color: '#FFFFFF',
                  x: 50,
                  y: 28,
                  width: 38,
                  height: 32,
                  opacity: 0.35,
                  blur: 90,
                  blendMode: 'screen' as const,
                }
              : {
                  kind: 'solid' as const,
                  color: '#0F172A',
                  opacity: 0.16,
                  blendMode: 'overlay' as const,
                  blur: 0,
                };
      const nextLayers = [...layers, next];
      replaceLayers(nextLayers);
      setSelectedLayerIndex(nextLayers.length - 1);
    },
    [layers, replaceLayers],
  );

  return (
    <div>
      <Section title="Canvas" defaultCollapsed={false}>
        <Select
          label="Platform"
          value={platform}
          onChange={handlePlatformChange}
          options={PLATFORM_OPTIONS}
        />
        <RangeSlider
          label="Frame Count"
          value={frameCount}
          min={2}
          max={10}
          onChange={setFrameCount}
        />
      </Section>

      <Section title="Background">
        <div className="flex gap-3 mb-2.5">
          {(['solid', 'gradient', 'image', 'preset'] as const).map((t) => (
            <label key={t} className="text-xs text-text-dim cursor-pointer flex items-center gap-1">
              <input
                type="radio"
                name="pano-bg-type"
                value={t}
                checked={bgType === t}
                onChange={() => updateBackground({ type: t })}
                className="accent-accent"
              />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>

        {bgType === 'preset' && (
          <Select
            label="Style Preset"
            value={background.preset ?? ''}
            onChange={(v) => updateBackground({ preset: v })}
            options={[
              { value: '', label: 'Select a preset...' },
              { value: 'minimal', label: 'Minimal' },
              { value: 'bold', label: 'Bold' },
              { value: 'glow', label: 'Glow' },
              { value: 'playful', label: 'Playful' },
              { value: 'clean', label: 'Clean' },
              { value: 'branded', label: 'Branded' },
              { value: 'editorial', label: 'Editorial' },
            ]}
          />
        )}

        {bgType === 'solid' && (
          <ColorPicker
            label="Color"
            value={bgColor}
            onChange={(v) => updateBackground({ color: v })}
            onInstant={instantBgColor}
            presets={SOLID_PRESETS}
          />
        )}

        {bgType === 'gradient' && (
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
                    updateBackground({
                      gradient: {
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

            <div className="flex gap-3 mb-2">
              {(['linear', 'radial'] as const).map((t) => (
                <label
                  key={t}
                  className="text-xs text-text-dim cursor-pointer flex items-center gap-1"
                >
                  <input
                    type="radio"
                    checked={bgGradient.type === t}
                    onChange={() => updateBackground({ gradient: { ...bgGradient, type: t } })}
                    className="accent-accent"
                  />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
            </div>

            {bgGradient.type === 'linear' && (
              <RangeSlider
                label="Direction"
                value={bgGradient.direction}
                min={0}
                max={360}
                formatValue={(v) => `${v}\u00B0`}
                onChange={(v) => updateBackground({ gradient: { ...bgGradient, direction: v } })}
                onInstant={(v) => instantGradient({ direction: v })}
              />
            )}

            {bgGradient.type === 'radial' && (
              <Select
                label="Center"
                value={bgGradient.radialPosition ?? 'center'}
                onChange={(v) =>
                  updateBackground({
                    gradient: {
                      ...bgGradient,
                      radialPosition: v as 'center' | 'top' | 'bottom' | 'left' | 'right',
                    },
                  })
                }
                options={[
                  { value: 'center', label: 'Center' },
                  { value: 'top', label: 'Top' },
                  { value: 'bottom', label: 'Bottom' },
                  { value: 'left', label: 'Left' },
                  { value: 'right', label: 'Right' },
                ]}
              />
            )}

            {bgGradient.colors.map((color, i) => (
              <ColorPicker
                key={i}
                label={`Stop ${i + 1}`}
                value={color}
                onChange={(v) => {
                  const colors = [...bgGradient.colors];
                  colors[i] = v;
                  updateBackground({ gradient: { ...bgGradient, colors } });
                }}
              />
            ))}

            {bgGradient.colors.length < 5 && (
              <button
                className="btn-secondary w-full text-[11px]"
                onClick={() => {
                  const colors = [...bgGradient.colors, '#ffffff'];
                  updateBackground({ gradient: { ...bgGradient, colors } });
                }}
              >
                + Add Color Stop
              </button>
            )}
          </>
        )}

        {bgType === 'image' && (
          <>
            <PanoramicBgImage
              imageDataUrl={background.image}
              onUpload={(dataUrl) => updateBackground({ image: dataUrl })}
              onRemove={() => updateBackground({ image: undefined })}
            />
            <div className="mt-2">
              <Checkbox
                label="Dim Overlay"
                checked={!!background.overlay}
                onChange={(checked) =>
                  updateBackground({
                    overlay: checked ? { color: '#000000', opacity: 0.3 } : undefined,
                  })
                }
              />
              {background.overlay && (
                <>
                  <ColorPicker
                    label="Color"
                    value={background.overlay.color}
                    onChange={(v) =>
                      updateBackground({
                        overlay: { ...background.overlay!, color: v },
                      })
                    }
                  />
                  <RangeSlider
                    label="Opacity"
                    value={Math.round(background.overlay.opacity * 100)}
                    min={0}
                    max={100}
                    formatValue={(v) => `${v}%`}
                    onChange={(v) =>
                      updateBackground({
                        overlay: { ...background.overlay!, opacity: v / 100 },
                      })
                    }
                  />
                </>
              )}
            </div>
          </>
        )}
      </Section>

      <Section title={`Layer Stack (${layers.length})`} defaultCollapsed>
        <div className="grid grid-cols-2 gap-1 mb-3">
          <button
            className="btn-secondary text-[11px]"
            onClick={() => addLayer('gradient')}
          >
            + Gradient
          </button>
          <button
            className="btn-secondary text-[11px]"
            onClick={() => addLayer('image')}
          >
            + Image
          </button>
          <button
            className="btn-secondary text-[11px]"
            onClick={() => addLayer('glow')}
          >
            + Glow
          </button>
          <button
            className="btn-secondary text-[11px]"
            onClick={() => addLayer('solid')}
          >
            + Solid
          </button>
        </div>

        {layers.length === 0 && (
          <p className="text-xs text-text-dim">
            Add layered gradients, textures, and glow passes on top of the base background.
          </p>
        )}

        {layers.length > 0 && (
          <>
            <div className="space-y-1 mb-3">
              {layers.map((layer, index) => (
                <button
                  key={`${layer.kind}-${index}`}
                  className={`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${
                    index === selectedLayerIndex
                      ? 'bg-accent/15 text-accent border border-accent/30'
                      : 'bg-surface-2 border border-border hover:border-accent/30'
                  }`}
                  onClick={() => setSelectedLayerIndex(index)}
                >
                  <span className="font-medium">{getBackgroundLayerLabel(layer)}</span>
                  <span className="text-text-dim ml-1">#{index + 1}</span>
                </button>
              ))}
            </div>

            {selectedLayer && (
              <>
                <div className="flex gap-1 mb-3">
                  <button
                    className="btn-secondary flex-1 text-[11px] disabled:opacity-40"
                    disabled={selectedLayerIndex === 0}
                    onClick={() => {
                      const nextLayers = [...layers];
                      [nextLayers[selectedLayerIndex - 1], nextLayers[selectedLayerIndex]] = [
                        nextLayers[selectedLayerIndex]!,
                        nextLayers[selectedLayerIndex - 1]!,
                      ];
                      replaceLayers(nextLayers);
                      setSelectedLayerIndex(selectedLayerIndex - 1);
                    }}
                  >
                    Move Up
                  </button>
                  <button
                    className="btn-secondary flex-1 text-[11px] disabled:opacity-40"
                    disabled={selectedLayerIndex === layers.length - 1}
                    onClick={() => {
                      const nextLayers = [...layers];
                      [nextLayers[selectedLayerIndex], nextLayers[selectedLayerIndex + 1]] = [
                        nextLayers[selectedLayerIndex + 1]!,
                        nextLayers[selectedLayerIndex]!,
                      ];
                      replaceLayers(nextLayers);
                      setSelectedLayerIndex(selectedLayerIndex + 1);
                    }}
                  >
                    Move Down
                  </button>
                  <button
                    className="flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-red-300 hover:text-red-200"
                    onClick={() => {
                      const nextLayers = layers.filter((_, index) => index !== selectedLayerIndex);
                      replaceLayers(nextLayers);
                      setSelectedLayerIndex(Math.max(0, Math.min(selectedLayerIndex, nextLayers.length - 1)));
                    }}
                  >
                    Remove
                  </button>
                </div>

                <Select
                  label="Blend Mode"
                  value={selectedLayer.blendMode}
                  onChange={(value) =>
                    updateLayer(selectedLayerIndex, { ...selectedLayer, blendMode: value as typeof selectedLayer.blendMode })
                  }
                  options={BLEND_MODE_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
                />
                <RangeSlider
                  label="Opacity"
                  value={Math.round(selectedLayer.opacity * 100)}
                  min={0}
                  max={100}
                  formatValue={(v) => `${v}%`}
                  onChange={(value) =>
                    updateLayer(selectedLayerIndex, { ...selectedLayer, opacity: value / 100 } as PanoramicBackgroundLayer)
                  }
                />
                <RangeSlider
                  label="Blur"
                  value={selectedLayer.blur}
                  min={0}
                  max={240}
                  formatValue={(v) => `${v}px`}
                  onChange={(value) =>
                    updateLayer(selectedLayerIndex, { ...selectedLayer, blur: value } as PanoramicBackgroundLayer)
                  }
                />

                {selectedLayer.kind === 'solid' && (
                  <ColorPicker
                    label="Color"
                    value={selectedLayer.color}
                    onChange={(value) =>
                      updateLayer(selectedLayerIndex, { ...selectedLayer, color: value })
                    }
                  />
                )}

                {selectedLayer.kind === 'gradient' && (
                  <>
                    <Select
                      label="Gradient Type"
                      value={selectedLayer.gradientType}
                      onChange={(value) =>
                        updateLayer(selectedLayerIndex, {
                          ...selectedLayer,
                          gradientType: value as typeof selectedLayer.gradientType,
                        })
                      }
                      options={[
                        { value: 'linear', label: 'Linear' },
                        { value: 'radial', label: 'Radial' },
                        { value: 'mesh', label: 'Mesh' },
                      ]}
                    />
                    {selectedLayer.gradientType === 'linear' && (
                      <RangeSlider
                        label="Direction"
                        value={selectedLayer.direction}
                        min={0}
                        max={360}
                        formatValue={(v) => `${v}\u00B0`}
                        onChange={(value) =>
                          updateLayer(selectedLayerIndex, { ...selectedLayer, direction: value })
                        }
                      />
                    )}
                    {selectedLayer.gradientType === 'radial' && (
                      <Select
                        label="Center"
                        value={selectedLayer.radialPosition}
                        onChange={(value) =>
                          updateLayer(selectedLayerIndex, {
                            ...selectedLayer,
                            radialPosition: value as typeof selectedLayer.radialPosition,
                          })
                        }
                        options={[
                          { value: 'center', label: 'Center' },
                          { value: 'top', label: 'Top' },
                          { value: 'bottom', label: 'Bottom' },
                          { value: 'left', label: 'Left' },
                          { value: 'right', label: 'Right' },
                        ]}
                      />
                    )}
                    {selectedLayer.colors.map((color, colorIndex) => (
                      <ColorPicker
                        key={colorIndex}
                        label={`Stop ${colorIndex + 1}`}
                        value={color}
                        onChange={(value) => {
                          const colors = [...selectedLayer.colors];
                          colors[colorIndex] = value;
                          updateLayer(selectedLayerIndex, { ...selectedLayer, colors });
                        }}
                      />
                    ))}
                  </>
                )}

                {selectedLayer.kind === 'image' && (
                  <>
                    <PanoramicBgImage
                      imageDataUrl={selectedLayer.image}
                      onUpload={(dataUrl) => updateLayer(selectedLayerIndex, { ...selectedLayer, image: dataUrl })}
                      onRemove={() => updateLayer(selectedLayerIndex, { ...selectedLayer, image: '' })}
                      buttonLabel="Upload Layer Image"
                      alt="Background layer"
                    />
                    <Select
                      label="Fit"
                      value={selectedLayer.fit}
                      onChange={(value) =>
                        updateLayer(selectedLayerIndex, { ...selectedLayer, fit: value as typeof selectedLayer.fit })
                      }
                      options={[
                        { value: 'cover', label: 'Cover' },
                        { value: 'contain', label: 'Contain' },
                        { value: 'tile', label: 'Tile' },
                      ]}
                    />
                    <Select
                      label="Position"
                      value={selectedLayer.position}
                      onChange={(value) =>
                        updateLayer(selectedLayerIndex, {
                          ...selectedLayer,
                          position: value as typeof selectedLayer.position,
                        })
                      }
                      options={[
                        { value: 'center', label: 'Center' },
                        { value: 'top', label: 'Top' },
                        { value: 'bottom', label: 'Bottom' },
                        { value: 'left', label: 'Left' },
                        { value: 'right', label: 'Right' },
                      ]}
                    />
                    <RangeSlider
                      label="Scale"
                      value={selectedLayer.scale}
                      min={10}
                      max={400}
                      formatValue={(v) => `${v}%`}
                      onChange={(value) => updateLayer(selectedLayerIndex, { ...selectedLayer, scale: value })}
                    />
                  </>
                )}

                {selectedLayer.kind === 'glow' && (
                  <>
                    <ColorPicker
                      label="Glow Color"
                      value={selectedLayer.color}
                      onChange={(value) => updateLayer(selectedLayerIndex, { ...selectedLayer, color: value })}
                    />
                    <RangeSlider
                      label="X"
                      value={selectedLayer.x}
                      min={-50}
                      max={150}
                      formatValue={(v) => `${v}%`}
                      onChange={(value) => updateLayer(selectedLayerIndex, { ...selectedLayer, x: value })}
                    />
                    <RangeSlider
                      label="Y"
                      value={selectedLayer.y}
                      min={-50}
                      max={150}
                      formatValue={(v) => `${v}%`}
                      onChange={(value) => updateLayer(selectedLayerIndex, { ...selectedLayer, y: value })}
                    />
                    <RangeSlider
                      label="Width"
                      value={selectedLayer.width}
                      min={1}
                      max={200}
                      formatValue={(v) => `${v}%`}
                      onChange={(value) => updateLayer(selectedLayerIndex, { ...selectedLayer, width: value })}
                    />
                    <RangeSlider
                      label="Height"
                      value={selectedLayer.height}
                      min={1}
                      max={200}
                      formatValue={(v) => `${v}%`}
                      onChange={(value) => updateLayer(selectedLayerIndex, { ...selectedLayer, height: value })}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </Section>
    </div>
  );
}
