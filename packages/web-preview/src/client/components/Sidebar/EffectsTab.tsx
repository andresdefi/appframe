import { useCurrentScreen } from '../../hooks/useCurrentScreen';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { RangeSlider } from '../Controls/RangeSlider';
import { ColorPicker } from '../Controls/ColorPicker';
import { Checkbox } from '../Controls/Checkbox';
import { CollapsiblePanel } from '../Controls/CollapsiblePanel';
import type { Annotation, Callout, Overlay } from '../../types';

let idCounter = 0;
function nextId(prefix: string) {
  return `${prefix}-${++idCounter}`;
}

export function EffectsTab() {
  const { screen, update } = useCurrentScreen();

  if (!screen) return null;

  // --- Annotations helpers ---
  const updateAnnotation = (idx: number, partial: Partial<Annotation>) => {
    const annotations = screen.annotations.map((a, i) =>
      i === idx ? { ...a, ...partial } : a,
    );
    update({ annotations });
  };

  const removeAnnotation = (idx: number) => {
    update({ annotations: screen.annotations.filter((_, i) => i !== idx) });
  };

  const addAnnotation = () => {
    update({
      annotations: [
        ...screen.annotations,
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

  // --- Callouts helpers ---
  const updateCallout = (idx: number, partial: Partial<Callout>) => {
    const callouts = screen.callouts.map((c, i) =>
      i === idx ? { ...c, ...partial } : c,
    );
    update({ callouts });
  };

  const removeCallout = (idx: number) => {
    update({ callouts: screen.callouts.filter((_, i) => i !== idx) });
  };

  const addCallout = () => {
    update({
      callouts: [
        ...screen.callouts,
        {
          id: nextId('callout'),
          sourceX: 30, sourceY: 40, sourceW: 40, sourceH: 20,
          displayX: 60, displayY: 10,
          displayScale: 1, rotation: 0, borderRadius: 8,
          shadow: true, borderWidth: 0, borderColor: '#ffffff',
        },
      ],
    });
  };

  // --- Overlays helpers ---
  const updateOverlay = (idx: number, partial: Partial<Overlay>) => {
    const overlays = screen.overlays.map((o, i) =>
      i === idx ? { ...o, ...partial } : o,
    );
    update({ overlays });
  };

  const removeOverlay = (idx: number) => {
    update({ overlays: screen.overlays.filter((_, i) => i !== idx) });
  };

  const addOverlay = () => {
    update({
      overlays: [
        ...screen.overlays,
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
      {/* Spotlight */}
      <Section title="Spotlight / Dimming">
        <Checkbox
          label="Enable Spotlight"
          checked={!!screen.spotlight}
          onChange={(checked) =>
            update({
              spotlight: checked
                ? { x: 50, y: 50, w: 30, h: 30, shape: 'rectangle', dimOpacity: 0.6, blur: 0 }
                : null,
            })
          }
        />
        {screen.spotlight && (
          <>
            <Select
              label="Shape"
              value={screen.spotlight.shape}
              onChange={(v) => update({ spotlight: { ...screen.spotlight!, shape: v as 'rectangle' | 'circle' } })}
              options={[
                { value: 'rectangle', label: 'Rectangle' },
                { value: 'circle', label: 'Circle' },
              ]}
            />
            <RangeSlider label="Position X" value={screen.spotlight.x} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, x: v } })} />
            <RangeSlider label="Position Y" value={screen.spotlight.y} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, y: v } })} />
            <RangeSlider label="Width" value={screen.spotlight.w} min={5} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, w: v } })} />
            <RangeSlider label="Height" value={screen.spotlight.h} min={5} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, h: v } })} />
            <RangeSlider label="Dim Opacity" value={Math.round(screen.spotlight.dimOpacity * 100)} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, dimOpacity: v / 100 } })} />
            <RangeSlider label="Background Blur" value={screen.spotlight.blur} min={0} max={30} formatValue={(v) => `${v}px`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, blur: v } })} />
          </>
        )}
      </Section>

      {/* Annotations */}
      <Section title="Annotations">
        <button
          className="w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2"
          onClick={addAnnotation}
        >
          + Add Annotation
        </button>
        {screen.annotations.map((ann, idx) => (
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
                { value: 'rounded-rect', label: 'rounded-rect' },
                { value: 'rectangle', label: 'rectangle' },
                { value: 'circle', label: 'circle' },
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

      {/* Loupe */}
      <Section title="Loupe / Magnification">
        <Checkbox
          label="Enable Loupe"
          checked={!!screen.loupe}
          onChange={(checked) =>
            update({
              loupe: checked
                ? { sourceX: 50, sourceY: 50, displayX: 70, displayY: 20, size: 20, zoom: 2.5, borderWidth: 3, borderColor: '#ffffff' }
                : null,
            })
          }
        />
        {screen.loupe && (
          <>
            <RangeSlider label="Source X" value={screen.loupe.sourceX} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ loupe: { ...screen.loupe!, sourceX: v } })} />
            <RangeSlider label="Source Y" value={screen.loupe.sourceY} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ loupe: { ...screen.loupe!, sourceY: v } })} />
            <RangeSlider label="Display X" value={screen.loupe.displayX} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ loupe: { ...screen.loupe!, displayX: v } })} />
            <RangeSlider label="Display Y" value={screen.loupe.displayY} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ loupe: { ...screen.loupe!, displayY: v } })} />
            <RangeSlider label="Size" value={screen.loupe.size} min={5} max={50} formatValue={(v) => `${v}%`} onChange={(v) => update({ loupe: { ...screen.loupe!, size: v } })} />
            <RangeSlider label="Zoom" value={Math.round(screen.loupe.zoom * 100)} min={150} max={500} step={10} formatValue={(v) => `${(v / 100).toFixed(1)}x`} onChange={(v) => update({ loupe: { ...screen.loupe!, zoom: v / 100 } })} />
            <RangeSlider label="Border Width" value={screen.loupe.borderWidth} min={0} max={10} formatValue={(v) => `${v}px`} onChange={(v) => update({ loupe: { ...screen.loupe!, borderWidth: v } })} />
            <ColorPicker label="Border Color" value={screen.loupe.borderColor} onChange={(v) => update({ loupe: { ...screen.loupe!, borderColor: v } })} />
          </>
        )}
      </Section>

      {/* Callouts */}
      <Section title="Callouts">
        <button
          className="w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2"
          onClick={addCallout}
        >
          + Add Callout
        </button>
        {screen.callouts.map((co, idx) => (
          <CollapsiblePanel
            key={co.id}
            title={`Callout ${idx + 1}`}
            onRemove={() => removeCallout(idx)}
          >
            <RangeSlider label="Source X" value={co.sourceX} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, { sourceX: v })} />
            <RangeSlider label="Source Y" value={co.sourceY} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, { sourceY: v })} />
            <RangeSlider label="Source W" value={co.sourceW} min={1} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, { sourceW: v })} />
            <RangeSlider label="Source H" value={co.sourceH} min={1} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, { sourceH: v })} />
            <RangeSlider label="Display X" value={co.displayX} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, { displayX: v })} />
            <RangeSlider label="Display Y" value={co.displayY} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, { displayY: v })} />
            <RangeSlider label="Scale" value={Math.round(co.displayScale * 100)} min={50} max={300} step={10} formatValue={(v) => `${(v / 100).toFixed(1)}x`} onChange={(v) => updateCallout(idx, { displayScale: v / 100 })} />
            <RangeSlider label="Rotation" value={co.rotation} min={-45} max={45} formatValue={(v) => `${v}\u00B0`} onChange={(v) => updateCallout(idx, { rotation: v })} />
            <RangeSlider label="Radius" value={co.borderRadius} min={0} max={30} formatValue={(v) => `${v}px`} onChange={(v) => updateCallout(idx, { borderRadius: v })} />
          </CollapsiblePanel>
        ))}
      </Section>

      {/* Overlays */}
      <Section title="Overlays">
        <button
          className="w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2"
          onClick={addOverlay}
        >
          + Add Overlay
        </button>
        {screen.overlays.map((ov, idx) => (
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
                { value: 'shape', label: 'shape' },
                { value: 'star-rating', label: 'star-rating' },
                { value: 'icon', label: 'icon' },
                { value: 'badge', label: 'badge' },
                { value: 'custom', label: 'custom' },
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
    </>
  );
}
