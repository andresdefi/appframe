import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCurrentScreen } from '../../hooks/useCurrentScreen';
import { useInstantPatch } from '../../hooks/useInstantPatch';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { RangeSlider } from '../Controls/RangeSlider';
import { ColorPicker } from '../Controls/ColorPicker';
import { CollapsiblePanel } from '../Controls/CollapsiblePanel';
import { useConfirmDialog } from '../Controls/ConfirmDialog';
import type { Overlay } from '../../types';
import { uploadImageFile } from '../../utils/uploadImageFile';
import type { CatalogItem, CategoryId } from './Elements/utils';
import {
  OVERLAY_BASE,
  buildShapeSvg,
  fetchArrowSvg,
  fetchBlobSvg,
  fetchIconSvg,
  nextId,
  recolorLucideSvg,
  svgToDataUrl,
  titleForOverlay,
} from './Elements/utils';
import { RootView } from './Elements/RootView';
import { CategoryView } from './Elements/CategoryView';

export function ElementsTab() {
  const { screen, update } = useCurrentScreen();
  const { confirm, dialog } = useConfirmDialog();
  const { patchOverlay } = useInstantPatch();
  const [view, setView] = useState<'root' | CategoryId>('root');
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const rootFileInputRef = useRef<HTMLInputElement | null>(null);

  if (!screen) return null;

  const updateOverlay = (idx: number, partial: Partial<Overlay>) => {
    const overlays = screen.overlays.map((o, i) => (i === idx ? { ...o, ...partial } : o));
    update({ overlays });
  };

  const removeOverlay = async (idx: number) => {
    const ok = await confirm({
      title: 'Remove Element',
      message: `Remove Element ${idx + 1}? This cannot be undone.`,
    });
    if (!ok) return;
    update({ overlays: screen.overlays.filter((_, i) => i !== idx) });
  };

  const addOverlayFromItem = (item: CatalogItem) => {
    const built = item.build();
    const overlay: Overlay = {
      id: nextId('overlay'),
      type: 'shape',
      ...OVERLAY_BASE,
      ...built,
    } as Overlay;
    update({ overlays: [...screen.overlays, overlay] });
  };

  const instantOverlay = (idx: number, partial: Partial<Overlay>) => {
    const ov = screen.overlays[idx];
    if (!ov) return;
    patchOverlay(idx, { ...ov, ...partial });
  };

  const handleCustomUpload = async (idx: number, file: File) => {
    const uploaded = await uploadImageFile(file);
    updateOverlay(idx, { imageDataUrl: uploaded.url });
  };

  const handleRootImageUpload = async (file: File) => {
    const uploaded = await uploadImageFile(file);
    const overlay: Overlay = {
      id: nextId('overlay'),
      type: 'custom',
      imageDataUrl: uploaded.url,
      ...OVERLAY_BASE,
      size: 100,
    } as Overlay;
    update({ overlays: [...screen.overlays, overlay] });
  };

  return (
    <>
      {dialog}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          initial={{ opacity: 0, x: view === 'root' ? -16 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: view === 'root' ? -16 : 16, transition: { duration: 0.15, ease: 'easeIn' } }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {view === 'root' ? (
            <RootView
              onPickCategory={setView}
              onUploadImage={() => rootFileInputRef.current?.click()}
            />
          ) : (
            <CategoryView
              category={view}
              onBack={() => setView('root')}
              onAdd={addOverlayFromItem}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <input
        ref={rootFileInputRef}
        type="file"
        accept="image/png,image/svg+xml,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleRootImageUpload(file);
          e.target.value = '';
        }}
      />

      {/* Elements on this frame — always visible regardless of view */}
      <Section
        title={`Elements on this frame (${screen.overlays.length})`}
        tooltip="Edit positioning and styling for each element you've added."
        defaultCollapsed={view !== 'root'}
      >
        {screen.overlays.length === 0 && (
          <p className="text-[10px] text-text-dim mb-2 leading-relaxed text-pretty">
            No elements yet. Pick one from a category above to add it.
          </p>
        )}
        {screen.overlays.map((ov, idx) => (
          <CollapsiblePanel
            key={ov.id}
            title={titleForOverlay(ov, idx)}
            onRemove={() => removeOverlay(idx)}
          >
            <RangeSlider
              label="Position X"
              value={ov.x}
              min={-50}
              max={150}
              formatValue={(v) => `${v}%`}
              onChange={(v) => updateOverlay(idx, { x: v })}
              onInstant={(v) => instantOverlay(idx, { x: v })}
              resetTo={OVERLAY_BASE.x}
            />
            <RangeSlider
              label="Position Y"
              value={ov.y}
              min={-50}
              max={150}
              formatValue={(v) => `${v}%`}
              onChange={(v) => updateOverlay(idx, { y: v })}
              onInstant={(v) => instantOverlay(idx, { y: v })}
              resetTo={OVERLAY_BASE.y}
            />
            <RangeSlider
              label="Size"
              value={ov.size}
              min={50}
              max={600}
              step={5}
              formatValue={(v) => `${v}px`}
              onChange={(v) => updateOverlay(idx, { size: v })}
              onInstant={(v) => instantOverlay(idx, { size: v })}
              resetTo={OVERLAY_BASE.size}
            />
            <RangeSlider
              label="Rotation"
              value={ov.rotation}
              min={-180}
              max={180}
              formatValue={(v) => `${v}°`}
              onChange={(v) => updateOverlay(idx, { rotation: v })}
              onInstant={(v) => instantOverlay(idx, { rotation: v })}
              resetTo={OVERLAY_BASE.rotation}
            />
            <RangeSlider
              label="Opacity"
              value={Math.round(ov.opacity * 100)}
              min={0}
              max={100}
              formatValue={(v) => `${v}%`}
              onChange={(v) => updateOverlay(idx, { opacity: v / 100 })}
              onInstant={(v) => instantOverlay(idx, { opacity: v / 100 })}
              resetTo={Math.round(OVERLAY_BASE.opacity * 100)}
            />
            <Select
              label="Layer"
              value={ov.layer ?? 'default'}
              onChange={(v) =>
                updateOverlay(idx, { layer: v as NonNullable<Overlay['layer']> })
              }
              options={[
                { value: 'front', label: 'Front (above everything)' },
                { value: 'default', label: 'Default (above text)' },
                { value: 'behind-text', label: 'Behind text' },
                { value: 'behind-device', label: 'Behind device' },
              ]}
            />
            <Select
              label="Blend mode"
              value={ov.blendMode ?? 'normal'}
              onChange={(v) =>
                updateOverlay(idx, { blendMode: v as NonNullable<Overlay['blendMode']> })
              }
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'multiply', label: 'Multiply (darken through)' },
                { value: 'screen', label: 'Screen (lighten through)' },
                { value: 'overlay', label: 'Overlay' },
                { value: 'soft-light', label: 'Soft light' },
                { value: 'hard-light', label: 'Hard light' },
                { value: 'darken', label: 'Darken' },
                { value: 'lighten', label: 'Lighten' },
                { value: 'color-dodge', label: 'Color dodge' },
                { value: 'color-burn', label: 'Color burn' },
                { value: 'difference', label: 'Difference' },
                { value: 'exclusion', label: 'Exclusion' },
              ]}
            />

            {ov.type === 'shape' && (
              <>
                <Select
                  label="Shape"
                  value={ov.shapeType ?? 'circle'}
                  onChange={(v) =>
                    updateOverlay(idx, { shapeType: v as NonNullable<Overlay['shapeType']> })
                  }
                  options={[
                    { value: 'circle', label: 'Circle' },
                    { value: 'rectangle', label: 'Rectangle' },
                    { value: 'line', label: 'Line' },
                    { value: 'arrow', label: 'Arrow' },
                  ]}
                />
                <ColorPicker
                  label="Color"
                  value={ov.shapeColor ?? '#6366f1'}
                  onChange={(v) => updateOverlay(idx, { shapeColor: v })}
                />
                <RangeSlider
                  label="Fill Opacity"
                  value={Math.round((ov.shapeOpacity ?? 0.5) * 100)}
                  min={0}
                  max={100}
                  formatValue={(v) => `${v}%`}
                  onChange={(v) => updateOverlay(idx, { shapeOpacity: v / 100 })}
                  onInstant={(v) => instantOverlay(idx, { shapeOpacity: v / 100 })}
                  resetTo={50}
                />
                <RangeSlider
                  label="Blur"
                  value={ov.shapeBlur ?? 0}
                  min={0}
                  max={50}
                  formatValue={(v) => `${v}px`}
                  onChange={(v) => updateOverlay(idx, { shapeBlur: v })}
                  onInstant={(v) => instantOverlay(idx, { shapeBlur: v })}
                  resetTo={0}
                />
              </>
            )}

            {ov.type === 'star-rating' && (
              <ColorPicker
                label="Color"
                value={ov.shapeColor ?? '#f59e0b'}
                onChange={(v) => updateOverlay(idx, { shapeColor: v })}
              />
            )}

            {ov.type === 'icon' && ov.iconRef && (
              <ColorPicker
                label="Color"
                value={ov.shapeColor ?? '#6366f1'}
                onChange={async (v) => {
                  const ref = ov.iconRef;
                  if (!ref) {
                    updateOverlay(idx, { shapeColor: v });
                    return;
                  }
                  // iconRef format: "<source>:<name>". Lucide icons need a
                  // server fetch + recolour; geometric shapes regenerate
                  // locally.
                  const [source, name] = ref.split(':');
                  if (source === 'shape' && name) {
                    const svg = buildShapeSvg(name, v);
                    if (svg) {
                      updateOverlay(idx, { shapeColor: v, imageDataUrl: svgToDataUrl(svg) });
                      return;
                    }
                  }
                  // Library-fed sources route through their own fetchers
                  // so recolours hit the right /api/elements/<kind>/svg/...
                  // endpoint. The data URL gets rebuilt with the new colour.
                  if (source && name && source !== 'lucide') {
                    const fetcher =
                      source === 'figma-blobs' ? fetchBlobSvg : fetchArrowSvg;
                    try {
                      const rawSvg = await fetcher(source, name);
                      const colored = recolorLucideSvg(rawSvg, v);
                      const dataUrl = svgToDataUrl(colored);
                      updateOverlay(idx, { shapeColor: v, imageDataUrl: dataUrl });
                      return;
                    } catch {
                      updateOverlay(idx, { shapeColor: v });
                      return;
                    }
                  }
                  if (source !== 'lucide' || !name) {
                    updateOverlay(idx, { shapeColor: v });
                    return;
                  }
                  try {
                    const rawSvg = await fetchIconSvg(name);
                    const colored = recolorLucideSvg(rawSvg, v);
                    const dataUrl = svgToDataUrl(colored);
                    updateOverlay(idx, { shapeColor: v, imageDataUrl: dataUrl });
                  } catch {
                    // Keep the colour change even if the SVG refetch fails;
                    // a later retry (or render) will refresh the data URL.
                    updateOverlay(idx, { shapeColor: v });
                  }
                }}
              />
            )}

            {ov.type === 'custom' && (
              <div className="mt-2">
                {ov.imageDataUrl ? (
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={ov.imageDataUrl}
                      alt="Custom element"
                      className="h-10 w-10 object-contain border border-border rounded bg-surface-2 thumb-outline"
                    />
                    <button
                      type="button"
                      className="text-[11px] text-text-dim hover:text-text underline"
                      onClick={() => updateOverlay(idx, { imageDataUrl: undefined })}
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <p className="text-[10px] text-text-dim mb-2 text-pretty">
                    Upload a PNG, SVG, or JPG to use as this element.
                  </p>
                )}
                <input
                  ref={(el) => {
                    fileInputRefs.current[idx] = el;
                  }}
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCustomUpload(idx, file);
                    e.target.value = '';
                  }}
                />
                <button
                  type="button"
                  className="w-full py-1.5 text-xs bg-surface-2 surface-card surface-card-hover rounded-lg text-text-dim hover:text-text transition duration-150 active:scale-[0.97]"
                  onClick={() => fileInputRefs.current[idx]?.click()}
                >
                  {ov.imageDataUrl ? 'Replace image' : 'Choose image'}
                </button>
              </div>
            )}
          </CollapsiblePanel>
        ))}
      </Section>
    </>
  );
}
