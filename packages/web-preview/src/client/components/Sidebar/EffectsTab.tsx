import { useCurrentScreen } from '../../hooks/useCurrentScreen';
import { useInstantPatch } from '../../hooks/useInstantPatch';
import { usePreviewStore } from '../../store';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { RangeSlider } from '../Controls/RangeSlider';
import { ColorPicker } from '../Controls/ColorPicker';
import { Checkbox } from '../Controls/Checkbox';
import { CollapsiblePanel } from '../Controls/CollapsiblePanel';
import { useConfirmDialog } from '../Controls/ConfirmDialog';
import type { Annotation, Callout } from '../../types';

function nextId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

// Clamp a sourceX/sourceY value so the source rectangle stays on the
// screenshot. `maxOrigin` is `100 - sourceW` (or `100 - sourceH`) — the
// rightmost origin that still keeps the right/bottom edge inside.
function clampPct(v: number, maxOrigin: number): number {
  if (v < 0) return 0;
  if (v > maxOrigin) return maxOrigin < 0 ? 0 : maxOrigin;
  return v;
}

export function EffectsTab() {
  const { screen, update } = useCurrentScreen();
  const { confirm, dialog } = useConfirmDialog();
  const { patchSpotlight, patchAnnotation, patchLoupe, patchCallout } = useInstantPatch();
  const locale = usePreviewStore((s) => s.locale);
  const calloutSelection = usePreviewStore((s) => s.calloutSelection);
  const beginCalloutSelection = usePreviewStore((s) => s.beginCalloutSelection);
  const cancelCalloutSelection = usePreviewStore((s) => s.cancelCalloutSelection);

  if (!screen) return null;

  // v1 supports flat/front-facing devices only; angled layouts apply a
  // perspective + rotateY that warps pointer-to-screenshot-% mapping.
  // Composition modes other than 'single' aren't wired through the
  // single-device source rect math yet — disable in those modes too so
  // we don't silently produce wrong sourceX/Y.
  const selectAreaDisabledReason: string | null = (() => {
    if (locale !== 'default') return 'Switch to Default locale to edit callouts.';
    if (screen.layout === 'angled-left' || screen.layout === 'angled-right') {
      return 'Select Area is unavailable for angled layouts. Switch to a centred layout to use it.';
    }
    if (screen.composition && screen.composition !== 'single') {
      return 'Select Area is unavailable in multi-device compositions.';
    }
    if (!screen.screenshotUrl) return 'Upload a screenshot to use Select Area.';
    return null;
  })();
  // Selection mode is either "new callout" (reselectIdx === null) or
  // "reselect existing callout N". The same overlay handles both — only
  // the sidebar UI and the post-drag store mutation differ.
  const reselectIdx =
    calloutSelection !== null && calloutSelection.reselectIdx !== null
      ? calloutSelection.reselectIdx
      : null;
  const inSelectionMode = calloutSelection !== null;

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
          shape: 'rectangle' as const,
          x: 50,
          y: 50,
          w: 20,
          h: 20,
          strokeColor: '#FF3B30',
          strokeWidth: 4,
          borderRadius: 12,
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

  // Width/Height slider helpers — for `sourceLocked` callouts (the drag-
  // to-select flow), growing the source rectangle should keep its centre
  // pinned so the visible content stays put. Without this, the slider
  // anchors growth on the top-left corner and the cropped content slides
  // out of frame. For legacy callouts (no flag) sourceX/sourceY are
  // ignored at render time, so we leave them untouched.
  const resizeSourceX = (co: Callout, nextW: number): Partial<Callout> => {
    if (!co.sourceLocked) return { sourceW: nextW };
    const centerU = co.sourceX + co.sourceW / 2;
    const nextX = clampPct(centerU - nextW / 2, 100 - nextW);
    return { sourceW: nextW, sourceX: nextX };
  };
  const resizeSourceY = (co: Callout, nextH: number): Partial<Callout> => {
    if (!co.sourceLocked) return { sourceH: nextH };
    const centerV = co.sourceY + co.sourceH / 2;
    const nextY = clampPct(centerV - nextH / 2, 100 - nextH);
    return { sourceH: nextH, sourceY: nextY };
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

  return (
    <>
      {dialog}
      {/* Spotlight */}
      <Section title="Spotlight / Dimming" tooltip="Dim the screenshot background and highlight a specific region to guide the viewer's eye." defaultCollapsed={false}>
        <Checkbox
          label="Enable Spotlight"
          checked={screen.spotlightEnabled}
          onChange={(checked) =>
            update({
              spotlightEnabled: checked,
              // Initialise default shape on first enable; subsequent
              // toggles keep whatever the user tuned.
              spotlight: checked && !screen.spotlight
                ? { x: 50, y: 50, w: 30, h: 30, shape: 'rectangle', dimOpacity: 0.6, blur: 0, borderRadius: 0 }
                : screen.spotlight,
            })
          }
        />
        {screen.spotlightEnabled && screen.spotlight && (
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
            <RangeSlider label="Position X" value={screen.spotlight.x} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, x: v } })} onInstant={(v) => instantSpotlight({ x: v })} resetTo={50} />
            <RangeSlider label="Position Y" value={screen.spotlight.y} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, y: v } })} onInstant={(v) => instantSpotlight({ y: v })} resetTo={50} />
            <RangeSlider label="Width" value={screen.spotlight.w} min={5} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, w: v } })} onInstant={(v) => instantSpotlight({ w: v })} resetTo={30} />
            <RangeSlider label="Height" value={screen.spotlight.h} min={5} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, h: v } })} onInstant={(v) => instantSpotlight({ h: v })} resetTo={30} />
            <RangeSlider label="Dim Opacity" value={Math.round(screen.spotlight.dimOpacity * 100)} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => update({ spotlight: { ...screen.spotlight!, dimOpacity: v / 100 } })} onInstant={(v) => instantSpotlight({ dimOpacity: v / 100 })} resetTo={60} />
            {screen.spotlight.shape === 'rectangle' && (
              <RangeSlider
                label="Corner Radius"
                value={screen.spotlight.borderRadius ?? 0}
                min={0}
                max={200}
                formatValue={(v) => `${v}px`}
                onChange={(v) => update({ spotlight: { ...screen.spotlight!, borderRadius: v } })}
                onInstant={(v) => instantSpotlight({ borderRadius: v })}
                resetTo={0}
              />
            )}
          </>
        )}
      </Section>

      {/* Annotations */}
      <Section title="Annotations" tooltip="Draw shapes (rectangles, circles) over the screenshot to highlight specific UI elements.">
        {screen.annotations.length === 0 && (
          <p className="text-[10px] text-text-dim mb-2 leading-relaxed text-pretty">
            Highlight areas of your screenshot with rectangles or circles. Great for drawing attention to specific features.
          </p>
        )}
        <button
          className="w-full py-1.5 text-xs bg-surface-2 surface-card surface-card-hover rounded-lg text-text-dim hover:text-text mb-2 transition duration-150 active:scale-[0.97]"
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
              value={ann.shape === 'rounded-rect' ? 'rectangle' : ann.shape}
              onChange={(v) => updateAnnotation(idx, { shape: v as 'rectangle' | 'circle' })}
              options={[
                { value: 'rectangle', label: 'Rectangle' },
                { value: 'circle', label: 'Circle' },
              ]}
            />
            <ColorPicker label="Color" value={ann.strokeColor} onChange={(v) => updateAnnotation(idx, { strokeColor: v })} />
            <RangeSlider label="Position X" value={ann.x} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateAnnotation(idx, { x: v })} onInstant={(v) => instantAnnotation(idx, { x: v })} resetTo={50} />
            <RangeSlider label="Position Y" value={ann.y} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateAnnotation(idx, { y: v })} onInstant={(v) => instantAnnotation(idx, { y: v })} resetTo={50} />
            <RangeSlider label="Width" value={ann.w} min={1} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateAnnotation(idx, { w: v })} onInstant={(v) => instantAnnotation(idx, { w: v })} resetTo={20} />
            <RangeSlider label="Height" value={ann.h} min={1} max={100} formatValue={(v) => `${v}%`} onChange={(v) => updateAnnotation(idx, { h: v })} onInstant={(v) => instantAnnotation(idx, { h: v })} resetTo={20} />
            <RangeSlider label="Stroke Width" value={ann.strokeWidth} min={1} max={20} formatValue={(v) => `${v}px`} onChange={(v) => updateAnnotation(idx, { strokeWidth: v })} onInstant={(v) => instantAnnotation(idx, { strokeWidth: v })} resetTo={4} />
            {ann.shape !== 'circle' && (
              <RangeSlider
                label="Corner Radius"
                value={ann.borderRadius ?? 0}
                min={0}
                max={200}
                formatValue={(v) => `${v}px`}
                onChange={(v) => updateAnnotation(idx, { borderRadius: v })}
                onInstant={(v) => instantAnnotation(idx, { borderRadius: v })}
                resetTo={12}
              />
            )}
          </CollapsiblePanel>
        ))}
      </Section>

      {/* Loupe */}
      <Section title="Loupe / Magnification" tooltip="Magnify a region of the screenshot and display it enlarged elsewhere on the frame.">
        <Checkbox
          label="Loupe"
          checked={screen.loupeEnabled}
          onChange={(checked) =>
            update({
              loupeEnabled: checked,
              loupe: checked && !screen.loupe
                ? { width: 0.5, height: 0.33, sourceX: 0, sourceY: 0, displayX: 50, displayY: 50, zoom: 2.5, cornerRadius: 0, borderWidth: 0, borderColor: '#ffffff', shadow: true, shadowColor: '#000000', shadowRadius: 30, shadowOffsetX: 0, shadowOffsetY: 0, xOffset: 0, yOffset: 0 }
                : screen.loupe,
            })
          }
        />
        {(() => {
          const defaults = { width: 0.5, height: 0.33, sourceX: 0, sourceY: 0, displayX: 50, displayY: 50, zoom: 2.5, cornerRadius: 0, borderWidth: 0, borderColor: '#ffffff', shadow: true, shadowColor: '#000000', shadowRadius: 30, shadowOffsetX: 0, shadowOffsetY: 0, xOffset: 0, yOffset: 0 };
          const l = screen.loupe ?? defaults;
          const upd = (partial: Record<string, unknown>) => update({ loupe: { ...l, ...partial } });
          return (
            <div className={!screen.loupeEnabled ? 'opacity-40 pointer-events-none' : ''}>
              <RangeSlider label="Position X" value={l.displayX ?? 50} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => upd({ displayX: v })} onInstant={(v) => instantLoupe({ displayX: v })} resetTo={50} />
              <RangeSlider label="Position Y" value={l.displayY ?? 50} min={0} max={100} formatValue={(v) => `${v}%`} onChange={(v) => upd({ displayY: v })} onInstant={(v) => instantLoupe({ displayY: v })} resetTo={50} />
              <RangeSlider label="Width" value={l.width} min={0.05} max={1} step={0.01} formatValue={(v) => v.toFixed(2)} onChange={(v) => upd({ width: v })} onInstant={(v) => instantLoupe({ width: v })} resetTo={0.5} />
              <RangeSlider label="Height" value={l.height} min={0.05} max={1} step={0.01} formatValue={(v) => v.toFixed(2)} onChange={(v) => upd({ height: v })} onInstant={(v) => instantLoupe({ height: v })} resetTo={0.33} />
              <RangeSlider label="Zoom" value={l.zoom ?? 2.5} min={1} max={5} step={0.1} formatValue={(v) => `${v.toFixed(1)}x`} onChange={(v) => upd({ zoom: v })} onInstant={(v) => instantLoupe({ zoom: v })} resetTo={2.5} />
              <RangeSlider label="Corner Radius" value={l.cornerRadius ?? 0} min={0} max={200} formatValue={(v) => `${v}px`} onChange={(v) => upd({ cornerRadius: v })} onInstant={(v) => instantLoupe({ cornerRadius: v })} resetTo={0} />
              <Checkbox
                label="Border"
                checked={(l.borderWidth ?? 0) > 0}
                onChange={(checked) => upd({ borderWidth: checked ? 3 : 0 })}
              />
              {(l.borderWidth ?? 0) > 0 && (
                <>
                  <RangeSlider label="Border Width" value={l.borderWidth} min={1} max={10} formatValue={(v) => `${v}px`} onChange={(v) => upd({ borderWidth: v })} onInstant={(v) => instantLoupe({ borderWidth: v })} resetTo={3} />
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
                  <RangeSlider label="Shadow Radius" value={l.shadowRadius ?? 30} min={0} max={100} formatValue={(v) => `${v}`} onChange={(v) => upd({ shadowRadius: v })} onInstant={(v) => instantLoupe({ shadowRadius: v })} resetTo={30} />
                  <RangeSlider label="Shadow X Offset" value={l.shadowOffsetX ?? 0} min={-50} max={50} formatValue={(v) => `${v}`} onChange={(v) => upd({ shadowOffsetX: v })} onInstant={(v) => instantLoupe({ shadowOffsetX: v })} resetTo={0} />
                  <RangeSlider label="Shadow Y Offset" value={l.shadowOffsetY ?? 0} min={-50} max={50} formatValue={(v) => `${v}`} onChange={(v) => upd({ shadowOffsetY: v })} onInstant={(v) => instantLoupe({ shadowOffsetY: v })} resetTo={0} />
                </>
              )}
            </div>
          );
        })()}
      </Section>

      {/* Callouts */}
      <Section title="Callouts" tooltip="Crop and enlarge a portion of the screenshot, displayed as a floating callout card.">
        {screen.callouts.length === 0 && (
          <p className="text-[10px] text-text-dim mb-2 leading-relaxed text-pretty">
            Zoom into a specific area and display it as a floating card. Perfect for showcasing small UI details.
          </p>
        )}
        {/* Drag-to-select source area. The primary creation path now —
            Add Callout below stays as the slider-first fallback for
            cases where Select Area is disabled (angled layouts,
            multi-device compositions, non-default locale). The same
            banner also surfaces during Reselect Area for an existing
            callout, with copy distinguishing which callout's source
            is being redrawn. */}
        {inSelectionMode ? (
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-2 py-1.5 text-[11px] text-text">
            <span className="flex-1 leading-snug">
              {reselectIdx !== null
                ? `Drag on the canvas to redraw Callout ${reselectIdx + 1}'s source, or press Esc to cancel.`
                : 'Drag on the canvas to select an area, or press Esc to cancel.'}
            </span>
            <button
              className="shrink-0 rounded px-1.5 py-0.5 text-text-dim hover:text-text"
              onClick={cancelCalloutSelection}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="w-full py-1.5 text-xs bg-surface-2 surface-card surface-card-hover rounded-lg text-text-dim hover:text-text mb-2 transition duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-text-dim"
            onClick={() => beginCalloutSelection(null)}
            disabled={selectAreaDisabledReason !== null}
            title={selectAreaDisabledReason ?? 'Drag on the canvas to crop a callout source area'}
          >
            Select Area
          </button>
        )}
        <button
          className="w-full py-1.5 text-xs bg-surface-2 surface-card surface-card-hover rounded-lg text-text-dim hover:text-text mb-2 transition duration-150 active:scale-[0.97]"
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
            {/* Reselect Area — redraw this callout's source rectangle by
                dragging on the canvas, instead of nudging Width/Height
                sliders by hand. Reselecting any callout also migrates it
                into the decoupled sourceLocked rendering (see ScreenCard
                commit handler), so legacy slider-only callouts get the
                pop-out behaviour the moment the user expresses a fresh
                intent about their source area. */}
            <button
              className="w-full py-1 mb-2 text-[11px] bg-surface-2 surface-card surface-card-hover rounded-md text-text-dim hover:text-text transition duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-text-dim"
              onClick={() => beginCalloutSelection(idx)}
              disabled={selectAreaDisabledReason !== null}
              title={selectAreaDisabledReason ?? `Drag on the canvas to redraw Callout ${idx + 1}'s source area`}
            >
              Reselect Area
            </button>
            <RangeSlider label="Position X" value={co.displayX} min={0} max={100} step={0.1} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, { displayX: v })} onInstant={(v) => instantCallout(idx, { displayX: v })} resetTo={50} />
            <RangeSlider label="Position Y" value={co.displayY} min={0} max={100} step={0.1} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, { displayY: v })} onInstant={(v) => instantCallout(idx, { displayY: v })} resetTo={50} />
            <RangeSlider label="Width" value={co.sourceW} min={1} max={100} step={0.1} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, resizeSourceX(co, v))} onInstant={(v) => instantCallout(idx, resizeSourceX(co, v))} resetTo={80} />
            <RangeSlider label="Height" value={co.sourceH} min={1} max={100} step={0.1} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, resizeSourceY(co, v))} onInstant={(v) => instantCallout(idx, resizeSourceY(co, v))} resetTo={10} />
            <RangeSlider label="Zoom" value={Math.round(co.displayScale * 100)} min={50} max={300} step={1} formatValue={(v) => `${(v / 100).toFixed(2)}x`} onChange={(v) => updateCallout(idx, { displayScale: v / 100 })} onInstant={(v) => instantCallout(idx, { displayScale: v / 100 })} resetTo={100} />
            <RangeSlider label="Card Popout" value={Math.round((co.cardScale ?? 1) * 100)} min={50} max={300} step={1} formatValue={(v) => `${(v / 100).toFixed(2)}x`} onChange={(v) => updateCallout(idx, { cardScale: v / 100 })} onInstant={(v) => instantCallout(idx, { cardScale: v / 100 })} resetTo={100} />
            <RangeSlider label="Rotation" value={co.rotation} min={-45} max={45} formatValue={(v) => `${v}\u00B0`} onChange={(v) => updateCallout(idx, { rotation: v })} onInstant={(v) => instantCallout(idx, { rotation: v })} resetTo={0} />
            <RangeSlider label="Card Padding" value={co.padding ?? 0} min={0} max={10} step={0.5} formatValue={(v) => `${v}%`} onChange={(v) => updateCallout(idx, { padding: v })} onInstant={(v) => instantCallout(idx, { padding: v })} resetTo={0} />
            <RangeSlider label="Corner Radius" value={co.borderRadius} min={0} max={30} formatValue={(v) => `${v}px`} onChange={(v) => updateCallout(idx, { borderRadius: v })} onInstant={(v) => instantCallout(idx, { borderRadius: v })} resetTo={16} />
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
    </>
  );
}
