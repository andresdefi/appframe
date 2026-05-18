import { useEffect, useState } from 'react';
import { Section } from '../../Controls/Section';
import { ColorPicker } from '../../Controls/ColorPicker';
import type { ArrowSourceDef, CatalogItem } from './utils';
import {
  fetchArrowSvg,
  fetchArrowsCatalog,
  getCachedArrowsCatalog,
  recolorLucideSvg,
  svgToDataUrl,
} from './utils';

interface ArrowCategoryViewProps {
  onBack: () => void;
  onAdd: (item: CatalogItem) => void;
}

export function ArrowCategoryView({ onBack, onAdd }: ArrowCategoryViewProps) {
  const [catalog, setCatalog] = useState<ArrowSourceDef[] | null>(getCachedArrowsCatalog());
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState('#111111');
  const [renderLimit, setRenderLimit] = useState(96);

  useEffect(() => {
    if (catalog) return;
    let active = true;
    fetchArrowsCatalog()
      .then((sources) => {
        if (active) setCatalog(sources);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      active = false;
    };
  }, [catalog]);

  const totalCount = (catalog ?? []).reduce((n, s) => n + s.arrows.length, 0);

  const handleAdd = async (source: string, name: string) => {
    try {
      const rawSvg = await fetchArrowSvg(source, name);
      const colored = recolorLucideSvg(rawSvg, color);
      const dataUrl = svgToDataUrl(colored);
      const item: CatalogItem = {
        id: `arrow-${source}-${name}`,
        label: name,
        preview: <span />,
        build: () => ({
          type: 'icon',
          imageDataUrl: dataUrl,
          iconRef: `${source}:${name}`,
          shapeColor: color,
          size: 100,
        }),
      };
      onAdd(item);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
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
        <div className="text-[13px] font-semibold text-text text-balance">Arrows</div>
        <div className="text-[10px] text-text-dim">{catalog ? `${totalCount} total` : '…'}</div>
      </div>
      <div className="mb-3">
        <ColorPicker label="Arrow color" value={color} onChange={setColor} />
      </div>

      {error && <p className="text-[11px] text-red-400 mb-2">Failed to load arrows: {error}</p>}
      {!catalog && !error && <p className="text-[11px] text-text-dim">Loading arrows…</p>}
      {catalog && (
        <>
          {catalog.map((source) => {
            const visible = source.arrows.slice(0, renderLimit);
            return (
              <div key={source.id} className="mb-4">
                <div className="text-[11px] font-medium text-text-dim mb-1.5">{source.title}</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {visible.map((entry) => (
                    <ArrowTile
                      key={`${source.id}-${entry.name}`}
                      source={source.id}
                      name={entry.name}
                      color={color}
                      onClick={() => handleAdd(source.id, entry.name)}
                    />
                  ))}
                </div>
                {source.arrows.length > renderLimit && (
                  <button
                    type="button"
                    onClick={() => setRenderLimit((n) => n + 96)}
                    className="w-full mt-2 py-1.5 text-[11px] bg-surface-2 surface-card surface-card-hover rounded-lg text-text-dim hover:text-text transition duration-150 active:scale-[0.97]"
                  >
                    Show more ({source.arrows.length - renderLimit} remaining)
                  </button>
                )}
                <div className="text-[10px] text-text-dim mt-1.5 leading-snug text-pretty">
                  By{' '}
                  <a
                    href={source.attributionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-text"
                  >
                    {source.attribution}
                  </a>{' '}
                  · {source.license}
                </div>
              </div>
            );
          })}
        </>
      )}
    </Section>
  );
}

interface ArrowTileProps {
  source: string;
  name: string;
  color: string;
  onClick: () => void;
}

function ArrowTile({ source, name, color, onClick }: ArrowTileProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    fetchArrowSvg(source, name)
      .then((svg) => {
        if (active) setDataUrl(svgToDataUrl(recolorLucideSvg(svg, color)));
      })
      .catch(() => {
        // Tile stays blank on failure.
      });
    return () => {
      active = false;
    };
  }, [source, name, color]);
  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      className="aspect-square rounded-lg bg-surface-2 surface-card surface-card-hover hover:bg-surface-2/80 transition duration-150 active:scale-[0.97] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {dataUrl ? (
        <img src={dataUrl} alt={name} className="block w-2/3 h-2/3 object-contain thumb-outline rounded-sm" />
      ) : (
        <span className="w-3 h-3 rounded-full bg-border" aria-hidden />
      )}
    </button>
  );
}
