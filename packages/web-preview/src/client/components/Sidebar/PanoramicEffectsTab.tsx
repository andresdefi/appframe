import { usePreviewStore } from '../../store';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { RangeSlider } from '../Controls/RangeSlider';
import { ColorPicker } from '../Controls/ColorPicker';
import { Checkbox } from '../Controls/Checkbox';
import { CollapsiblePanel } from '../Controls/CollapsiblePanel';
import { useConfirmDialog } from '../Controls/ConfirmDialog';
import type { Annotation, Overlay } from '../../types';

function nextId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function PanoramicEffectsTab() {
  const effects = usePreviewStore((s) => s.panoramicEffects);
  const update = usePreviewStore((s) => s.updatePanoramicEffects);
  const { confirm, dialog } = useConfirmDialog();

  // --- Annotations helpers ---
  const updateAnnotation = (idx: number, partial: Partial<Annotation>) => {
    const annotations = effects.annotations.map((a, i) =>
      i === idx ? { ...a, ...partial } : a,
    );
    update({ annotations });
  };

  const removeAnnotation = async (idx: number) => {
    const ok = await confirm({ title: 'Remove Annotation', message: `Remove Annotation ${idx + 1}? This cannot be undone.` });
    if (!ok) return;
    update({ annotations: effects.annotations.filter((_, i) => i !== idx) });
  };

  const addAnnotation = () => {
    update({
      annotations: [
        ...effects.annotations,
        {
          id: nextId('ann'),
          shape: 'rounded-rect' as const,
          x: 40,
          y: 40,
          w: 20,
          h: 20,
          strokeColor: '#FF3B30',
          strokeWidth: 4,
        },
      ],
    });
  };

  // --- Overlays helpers ---
  const updateOverlay = (idx: number, partial: Partial<Overlay>) => {
    const overlays = effects.overlays.map((o, i) =>
      i === idx ? { ...o, ...partial } : o,
    );
    update({ overlays });
  };

  const removeOverlay = async (idx: number) => {
    const ok = await confirm({ title: 'Remove Overlay', message: `Remove Overlay ${idx + 1}? This cannot be undone.` });
    if (!ok) return;
    update({ overlays: effects.overlays.filter((_, i) => i !== idx) });
  };

  const addOverlay = () => {
    update({
      overlays: [
        ...effects.overlays,
        {
          id: nextId('overlay'),
          type: 'shape' as const,
          x: 10, y: 10, size: 10,
          rotation: 0, opacity: 1,
          shapeType: 'circle', shapeColor: '#6366f1', shapeOpacity: 0.5, shapeBlur: 10,
        },
      ],
    });
  };

  return (
    <>
      {dialog}
      {/* Spotlight */}
      <Section title="Spotlight / Dimming" tooltip="Dim the panoramic canvas and highlight a specific area to draw attention." defaultCollapsed={false}>
        {!effects.spotlight && (
          <p className="text-[10px] text-text-dim mb-2 leading-relaxed">
            Dim the canvas background and highlight a specific region to guide the viewer&apos;s eye.
          </p>
        )}
        <Checkbox
          label="Enable Spotlight"
          checked={!!effects.spotlight}
          onChange={(checked) =>
            update({
              spotlight: checked
                ? { x: 50, y: 50, w: 30, h: 30, shape: 'rectangle', dimOpacity: 0.6, blur: 0 }
                : null,
            })
          }
        />
        {effects.spotlight && (
          <>
            <Select
              label="Shape"
              value={effects.spotlight.shape}
              onChange={(v) => update({ spotlight: { ...effects.spotlight!, shape: v as 'rectangle' | 'circle' } })}
              options={[
                { value: 'rectangle', label: 'Rectangle' },
                { value: 'circle', label: 'Circle' },
              ]}
            />
            <RangeSlider label="Position X" value={effects.spotlight.x} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...effects.spotlight!, x: v } })} />
            <RangeSlider label="Position Y" value={effects.spotlight.y} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...effects.spotlight!, y: v } })} />
            <RangeSlider label="Width" value={effects.spotlight.w} min={5} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...effects.spotlight!, w: v } })} />
            <RangeSlider label="Height" value={effects.spotlight.h} min={5} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...effects.spotlight!, h: v } })} />
            <RangeSlider label="Dim Opacity" value={Math.round(effects.spotlight.dimOpacity * 100)} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...effects.spotlight!, dimOpacity: v / 100 } })} />
            <RangeSlider label="Background Blur" value={effects.spotlight.blur} min={0} max={30} formatValue={(v) => `${v}px`} onChange={(v) => update({ spotlight: { ...effects.spotlight!, blur: v } })} />
          </>
        )}
      </Section>

      {/* Annotations */}
      <Section title="Annotations" tooltip="Draw shapes over the panoramic canvas to highlight specific areas.">
        {effects.annotations.length === 0 && (
          <p className="text-[10px] text-text-dim mb-2 leading-relaxed">
            Highlight areas of your panoramic canvas with rectangles or circles.
          </p>
        )}
        <button
          className="w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2"
          onClick={addAnnotation}
        >
          + Add Annotation
        </button>
        {effects.annotations.map((ann, idx) => (
          <CollapsiblePanel
            key={ann.id}
            title={`Annotation ${idx + 1}`}
            onRemove={() => removeAnnotation(idx)}
          >
            <Select
              label="Shape"
              value={ann.shape}
              onChange={(v) => updateAnnotation(idx, { shape: v as 'rounded-rect' | 'rectangle' | 'circle' })}
              options={[
                { value: 'rounded-rect', label: 'Rounded Rect' },
                { value: 'rectangle', label: 'Rectangle' },
                { value: 'circle', label: 'Circle' },
              ]}
            />
            <ColorPicker label="Color" value={ann.strokeColor} onChange={(v) => updateAnnotation(idx, { strokeColor: v })} />
            <RangeSlider label="X" value={ann.x} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateAnnotation(idx, { x: v })} />
            <RangeSlider label="Y" value={ann.y} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateAnnotation(idx, { y: v })} />
            <RangeSlider label="Width" value={ann.w} min={1} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateAnnotation(idx, { w: v })} />
            <RangeSlider label="Height" value={ann.h} min={1} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateAnnotation(idx, { h: v })} />
            <RangeSlider label="Stroke" value={ann.strokeWidth} min={1} max={20} formatValue={(v) => `${v}px`} onChange={(v) => updateAnnotation(idx, { strokeWidth: v })} />
          </CollapsiblePanel>
        ))}
      </Section>

      {/* Overlays */}
      <Section title="Overlays" tooltip="Add decorative shapes floating over the panoramic canvas.">
        {effects.overlays.length === 0 && (
          <p className="text-[10px] text-text-dim mb-2 leading-relaxed">
            Add floating shapes, star ratings, or badges over your panoramic canvas for extra visual appeal.
          </p>
        )}
        <button
          className="w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2"
          onClick={addOverlay}
        >
          + Add Overlay
        </button>
        {effects.overlays.map((ov, idx) => (
          <CollapsiblePanel
            key={ov.id}
            title={`Overlay ${idx + 1}`}
            onRemove={() => removeOverlay(idx)}
          >
            <Select
              label="Type"
              value={ov.type}
              onChange={(v) => updateOverlay(idx, { type: v as Overlay['type'] })}
              options={[
                { value: 'shape', label: 'Shape' },
                { value: 'star-rating', label: 'Star Rating' },
                { value: 'icon', label: 'Icon' },
                { value: 'badge', label: 'Badge' },
                { value: 'custom', label: 'Custom' },
              ]}
            />
            <RangeSlider label="X" value={ov.x} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateOverlay(idx, { x: v })} />
            <RangeSlider label="Y" value={ov.y} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateOverlay(idx, { y: v })} />
            <RangeSlider label="Size" value={ov.size} min={1} max={50} formatValue={(v) => `${v}%`} onChange={(v) => updateOverlay(idx, { size: v })} />
            <RangeSlider label="Rotation" value={ov.rotation} min={-180} max={180} formatValue={(v) => `${v}\u00B0`} onChange={(v) => updateOverlay(idx, { rotation: v })} />
            <RangeSlider label="Opacity" value={Math.round(ov.opacity * 100)} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateOverlay(idx, { opacity: v / 100 })} />
            {ov.type === 'shape' && (
              <>
                <Select
                  label="Shape"
                  value={ov.shapeType ?? 'circle'}
                  onChange={(v) => updateOverlay(idx, { shapeType: v as 'circle' | 'rectangle' | 'line' })}
                  options={[
                    { value: 'circle', label: 'Circle' },
                    { value: 'rectangle', label: 'Rectangle' },
                    { value: 'line', label: 'Line' },
                  ]}
                />
                <ColorPicker label="Color" value={ov.shapeColor ?? '#6366f1'} onChange={(v) => updateOverlay(idx, { shapeColor: v })} />
                <RangeSlider label="Shape Opacity" value={Math.round((ov.shapeOpacity ?? 0.5) * 100)} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateOverlay(idx, { shapeOpacity: v / 100 })} />
                <RangeSlider label="Blur" value={ov.shapeBlur ?? 0} min={0} max={50} formatValue={(v) => `${v}px`} onChange={(v) => updateOverlay(idx, { shapeBlur: v })} />
              </>
            )}
          </CollapsiblePanel>
        ))}
      </Section>

      {/* Info about individual-only effects */}
      <div className="px-5 py-3 text-[10px] text-text-dim">
        Loupe and Callouts are available in individual mode as they operate on specific screenshot regions.
      </div>
    </>
  );
}
