import { useCurrentScreen } from '../../hooks/useCurrentScreen';
import { useInstantPatch } from '../../hooks/useInstantPatch';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { RangeSlider } from '../Controls/RangeSlider';
import { ColorPicker } from '../Controls/ColorPicker';
import { Checkbox } from '../Controls/Checkbox';
import { CollapsiblePanel } from '../Controls/CollapsiblePanel';
import { useConfirmDialog } from '../Controls/ConfirmDialog';
import type { Annotation, Callout, Overlay } from '../../types';

function nextId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function EffectsTab() {
  const { screen, update } = useCurrentScreen();
  const { confirm, dialog } = useConfirmDialog();
  const { patchSpotlight, patchAnnotation, patchLoupe, patchCallout } = useInstantPatch();

  if (!screen) return null;

  const instantSpotlight = (partial: Partial<NonNullable<typeof screen.spotlight>>) => {
    if (!screen.spotlight) return;
    patchSpotlight({ ...screen.spotlight, ...partial });
  };

  const instantAnnotation = (idx: number, partial: Partial<Annotation>) => {
    patchAnnotation(idx, partial);
  };

  const instantLoupe = (partial: Partial<NonNullable<typeof screen.loupe>>) => {
    if (!screen.loupe) return;
    patchLoupe({ ...screen.loupe, ...partial });
  };

  const instantCallout = (idx: number, partial: Partial<Callout>) => {
    const co = screen.callouts[idx];
    if (!co) return;
    patchCallout(idx, { ...co, ...partial });
  };

  // --- Annotations helpers ---
  const updateAnnotation = (idx: number, partial: Partial<Annotation>) => {
    const annotations = screen.annotations.map((a, i) =>
      i === idx ? { ...a, ...partial } : a,
    );
    update({ annotations });
  };

  const removeAnnotation = async (idx: number) => {
    const ok = await confirm({ title: 'Remove Annotation', message: `Remove Annotation ${idx + 1}? This cannot be undone.` });
    if (!ok) return;
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

  const removeCallout = async (idx: number) => {
    const ok = await confirm({ title: 'Remove Callout', message: `Remove Callout ${idx + 1}? This cannot be undone.` });
    if (!ok) return;
    update({ callouts: screen.callouts.filter((_, i) => i !== idx) });
  };

  const addCallout = () => {
    // Card defaults to centered (displayX/Y = 50, the card's centre) at a
    // wide-but-short shape — good starting point for "highlight a feature
    // row" layouts. White card + padding gives the App Store emphasis look.
    update({
      callouts: [
        ...screen.callouts,
        {
          id: nextId('callout'),
          sourceX: 0, sourceY: 0, // unused — content tracks displayX/Y
          sourceW: 80, sourceH: 10,
          displayX: 50, displayY: 50,
          displayScale: 1, rotation: 0, borderRadius: 16,
          shadow: true, borderWidth: 0, borderColor: '#ffffff',
          background: '#ffffff', padding: 0, cardScale: 1,
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

  const removeOverlay = async (idx: number) => {
    const ok = await confirm({ title: 'Remove Overlay', message: `Remove Overlay ${idx + 1}? This cannot be undone.` });
    if (!ok) return;
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
      {dialog}
      {/* Spotlight */}
      <Section title="Spotlight / Dimming" tooltip="Dim the background and highlight a specific area of your screenshot to draw attention." defaultCollapsed={false}>
        {!screen.spotlight && (
          <p className="text-[10px] text-text-dim mb-2 leading-relaxed">
            Dim the screenshot background and highlight a specific region to guide the viewer&apos;s eye.
          </p>
        )}
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
            <RangeSlider label="Position X" value={screen.spotlight.x} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, x: v } })} onInstant={(v) => instantSpotlight({ x: v })} />
            <RangeSlider label="Position Y" value={screen.spotlight.y} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, y: v } })} onInstant={(v) => instantSpotlight({ y: v })} />
            <RangeSlider label="Width" value={screen.spotlight.w} min={5} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, w: v } })} onInstant={(v) => instantSpotlight({ w: v })} />
            <RangeSlider label="Height" value={screen.spotlight.h} min={5} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, h: v } })} onInstant={(v) => instantSpotlight({ h: v })} />
            <RangeSlider label="Dim Opacity" value={Math.round(screen.spotlight.dimOpacity * 100)} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, dimOpacity: v / 100 } })} onInstant={(v) => instantSpotlight({ dimOpacity: v / 100 })} />
          </>
        )}
      </Section>

      {/* Annotations */}
      <Section title="Annotations" tooltip="Draw shapes (rectangles, circles) over the screenshot to highlight specific UI elements.">
        {screen.annotations.length === 0 && (
          <p className="text-[10px] text-text-dim mb-2 leading-relaxed">
            Highlight areas of your screenshot with rectangles or circles. Great for drawing attention to specific features.
          </p>
        )}
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
                { value: 'rounded-rect', label: 'Rounded Rect' },
                { value: 'rectangle', label: 'Rectangle' },
                { value: 'circle', label: 'Circle' },
              ]}
            />
            <ColorPicker label="Color" value={ann.strokeColor} onChange={(v) => updateAnnotation(idx, { strokeColor: v })} />
            <RangeSlider label="X" value={ann.x} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateAnnotation(idx, { x: v })} onInstant={(v) => instantAnnotation(idx, { x: v })} />
            <RangeSlider label="Y" value={ann.y} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateAnnotation(idx, { y: v })} onInstant={(v) => instantAnnotation(idx, { y: v })} />
            <RangeSlider label="Width" value={ann.w} min={1} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateAnnotation(idx, { w: v })} onInstant={(v) => instantAnnotation(idx, { w: v })} />
            <RangeSlider label="Height" value={ann.h} min={1} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateAnnotation(idx, { h: v })} onInstant={(v) => instantAnnotation(idx, { h: v })} />
            <RangeSlider label="Stroke" value={ann.strokeWidth} min={1} max={20} formatValue={(v) => `${v}px`} onChange={(v) => updateAnnotation(idx, { strokeWidth: v })} onInstant={(v) => instantAnnotation(idx, { strokeWidth: v })} />
          </CollapsiblePanel>
        ))}
      </Section>

      {/* Loupe */}
      <Section title="Loupe / Magnification" tooltip="Magnify a region of the screenshot and display it enlarged elsewhere on the frame.">
        <Checkbox
          label="Loupe"
          checked={!!screen.loupe}
          onChange={(checked) =>
            update({
              loupe: checked
                ? { width: 0.5, height: 0.33, sourceX: 0, sourceY: 0, displayX: 50, displayY: 50, zoom: 2.5, cornerRadius: 0, borderWidth: 0, borderColor: '#ffffff', shadow: true, shadowColor: '#000000', shadowRadius: 30, shadowOffsetX: 0, shadowOffsetY: 0, xOffset: 0, yOffset: 0 }
                : null,
            })
          }
        />
        {(() => {
          const defaults = { width: 0.5, height: 0.33, sourceX: 0, sourceY: 0, displayX: 50, displayY: 50, zoom: 2.5, cornerRadius: 0, borderWidth: 0, borderColor: '#ffffff', shadow: true, shadowColor: '#000000', shadowRadius: 30, shadowOffsetX: 0, shadowOffsetY: 0, xOffset: 0, yOffset: 0 };
          const l = screen.loupe ?? defaults;
          const upd = (partial: Record<string, unknown>) => update({ loupe: { ...l, ...partial } });
          return (
            <div className={!screen.loupe ? 'opacity-40 pointer-events-none' : ''}>
              <RangeSlider label="Width" value={l.width} min={0.05} max={1} step={0.01} formatValue={(v) => v.toFixed(2)} onChange={(v) => upd({ width: v })} onInstant={(v) => instantLoupe({ width: v })} />
              <RangeSlider label="Height" value={l.height} min={0.05} max={1} step={0.01} formatValue={(v) => v.toFixed(2)} onChange={(v) => upd({ height: v })} onInstant={(v) => instantLoupe({ height: v })} />
              <RangeSlider label="Position X" value={l.displayX ?? 50} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => upd({ displayX: v })} onInstant={(v) => instantLoupe({ displayX: v })} />
              <RangeSlider label="Position Y" value={l.displayY ?? 50} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => upd({ displayY: v })} onInstant={(v) => instantLoupe({ displayY: v })} />
              <RangeSlider label="Zoom" value={l.zoom ?? 2.5} min={1} max={5} step={0.1} formatValue={(v) => `${v.toFixed(1)}x`} onChange={(v) => upd({ zoom: v })} onInstant={(v) => instantLoupe({ zoom: v })} />
              <RangeSlider label="Corner Radius" value={Math.min(l.cornerRadius ?? 0, 50)} min={0} max={50} formatValue={(v) => `${v}%`} onChange={(v) => upd({ cornerRadius: v })} onInstant={(v) => instantLoupe({ cornerRadius: v })} />
              <Checkbox
                label="Border"
                checked={(l.borderWidth ?? 0) > 0}
                onChange={(checked) => upd({ borderWidth: checked ? 3 : 0 })}
              />
              {(l.borderWidth ?? 0) > 0 && (
                <>
                  <RangeSlider label="Border Width" value={l.borderWidth} min={1} max={10} formatValue={(v) => `${v}px`} onChange={(v) => upd({ borderWidth: v })} onInstant={(v) => instantLoupe({ borderWidth: v })} />
                  <ColorPicker label="Border Color" value={l.borderColor} onChange={(v) => upd({ borderColor: v })} />
                </>
              )}
              <Checkbox
                label="Shadow"
                checked={!!l.shadow}
                onChange={(checked) => upd({ shadow: checked })}
              />
              {l.shadow && (
                <>
                  <ColorPicker label="Shadow Color" value={l.shadowColor ?? '#000000'} onChange={(v) => upd({ shadowColor: v })} />
                  <RangeSlider label="Shadow Radius" value={l.shadowRadius ?? 30} min={0} max={100} formatValue={(v) => `${v}`} onChange={(v) => upd({ shadowRadius: v })} onInstant={(v) => instantLoupe({ shadowRadius: v })} />
                  <RangeSlider label="Shadow X Offset" value={l.shadowOffsetX ?? 0} min={-50} max={50} formatValue={(v) => `${v}`} onChange={(v) => upd({ shadowOffsetX: v })} onInstant={(v) => instantLoupe({ shadowOffsetX: v })} />
                  <RangeSlider label="Shadow Y Offset" value={l.shadowOffsetY ?? 0} min={-50} max={50} formatValue={(v) => `${v}`} onChange={(v) => upd({ shadowOffsetY: v })} onInstant={(v) => instantLoupe({ shadowOffsetY: v })} />
                </>
              )}
            </div>
          );
        })()}
      </Section>

      {/* Callouts */}
      <Section title="Callouts" tooltip="Crop and enlarge a portion of the screenshot, displayed as a floating callout card.">
        {screen.callouts.length === 0 && (
          <p className="text-[10px] text-text-dim mb-2 leading-relaxed">
            Zoom into a specific area and display it as a floating card. Perfect for showcasing small UI details.
          </p>
        )}
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
            <RangeSlider label="Callout Width" value={co.sourceW} min={1} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, { sourceW: v })} onInstant={(v) => instantCallout(idx, { sourceW: v })} />
            <RangeSlider label="Vertical Size" value={co.sourceH} min={1} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, { sourceH: v })} onInstant={(v) => instantCallout(idx, { sourceH: v })} />
            <RangeSlider label="Horizontal Placement" value={co.displayX} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, { displayX: v })} onInstant={(v) => instantCallout(idx, { displayX: v })} />
            <RangeSlider label="Vertical Placement" value={co.displayY} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, { displayY: v })} onInstant={(v) => instantCallout(idx, { displayY: v })} />
            <RangeSlider label="Zoom" value={Math.round(co.displayScale * 100)} min={50} max={300} step={1} formatValue={(v) => `${(v / 100).toFixed(2)}x`} onChange={(v) => updateCallout(idx, { displayScale: v / 100 })} onInstant={(v) => instantCallout(idx, { displayScale: v / 100 })} />
            <RangeSlider label="Card Popout" value={Math.round((co.cardScale ?? 1) * 100)} min={50} max={300} step={1} formatValue={(v) => `${(v / 100).toFixed(2)}x`} onChange={(v) => updateCallout(idx, { cardScale: v / 100 })} onInstant={(v) => instantCallout(idx, { cardScale: v / 100 })} />
            <RangeSlider label="Rotation" value={co.rotation} min={-45} max={45} formatValue={(v) => `${v}\u00B0`} onChange={(v) => updateCallout(idx, { rotation: v })} onInstant={(v) => instantCallout(idx, { rotation: v })} />
            <RangeSlider label="Corner Radius" value={co.borderRadius} min={0} max={30} formatValue={(v) => `${v}px`} onChange={(v) => updateCallout(idx, { borderRadius: v })} onInstant={(v) => instantCallout(idx, { borderRadius: v })} />
            <RangeSlider label="Card Padding" value={co.padding ?? 0} min={0} max={10} step={0.5} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, { padding: v })} onInstant={(v) => instantCallout(idx, { padding: v })} />
            <Checkbox
              label="Card Background"
              checked={!!co.background}
              onChange={(checked) => updateCallout(idx, { background: checked ? '#ffffff' : undefined })}
            />
            {co.background && (
              <ColorPicker label="Background Color" value={co.background} onChange={(v) => updateCallout(idx, { background: v })} />
            )}
          </CollapsiblePanel>
        ))}
      </Section>

      {/* Overlays */}
      <Section title="Overlays" tooltip="Add decorative shapes, stars, icons, or badges floating over the screenshot.">
        {screen.overlays.length === 0 && (
          <p className="text-[10px] text-text-dim mb-2 leading-relaxed">
            Add floating shapes, star ratings, icons, or badges over your screenshot for extra visual appeal.
          </p>
        )}
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
    </>
  );
}
