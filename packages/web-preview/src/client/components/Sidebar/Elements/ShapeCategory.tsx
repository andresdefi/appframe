import { useState } from 'react';
import { Section } from '../../Controls/Section';
import { ColorPicker } from '../../Controls/ColorPicker';
import type { CatalogItem, ShapeDef } from './utils';
import { SHAPE_LIBRARY, buildShapeSvg, svgToDataUrl } from './utils';

interface ShapeCategoryViewProps {
  onBack: () => void;
  onAdd: (item: CatalogItem) => void;
}

export function ShapeCategoryView({ onBack, onAdd }: ShapeCategoryViewProps) {
  const [color, setColor] = useState('#6366f1');

  const handleAdd = (shape: ShapeDef) => {
    const svg = buildShapeSvg(shape.id, color);
    if (!svg) return;
    const dataUrl = svgToDataUrl(svg);
    const item: CatalogItem = {
      id: `shape-${shape.id}`,
      label: shape.label,
      preview: <span />,
      build: () => ({
        type: 'icon',
        imageDataUrl: dataUrl,
        iconRef: `shape:${shape.id}`,
        shapeColor: color,
        size: 100,
      }),
    };
    onAdd(item);
  };

  return (
    <Section title="" defaultCollapsed={false}>
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-1 text-[12px] text-text-dim hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1 transition-transform duration-150 active:scale-[0.97]"
      >
        <span aria-hidden>‹</span>
        <span>Back</span>
      </button>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-semibold text-text text-balance">Shapes</div>
        <div className="text-[10px] text-text-dim">{SHAPE_LIBRARY.length} primitives</div>
      </div>
      <div className="mb-3">
        <ColorPicker label="Shape color" value={color} onChange={setColor} />
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {SHAPE_LIBRARY.map((shape) => (
          <ShapeTile key={shape.id} shape={shape} color={color} onClick={() => handleAdd(shape)} />
        ))}
      </div>
    </Section>
  );
}

function ShapeTile({
  shape,
  color,
  onClick,
}: {
  shape: ShapeDef;
  color: string;
  onClick: () => void;
}) {
  const dataUrl = svgToDataUrl(buildShapeSvg(shape.id, color) ?? '');
  return (
    <button
      type="button"
      onClick={onClick}
      title={shape.label}
      className="aspect-square rounded-lg bg-surface-2 surface-card surface-card-hover hover:bg-surface-2/80 transition duration-150 active:scale-[0.97] flex items-center justify-center text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <img src={dataUrl} alt={shape.label} className="block w-2/3 h-2/3 object-contain thumb-outline rounded-sm" />
    </button>
  );
}
