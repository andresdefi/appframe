import { useEffect, useState } from 'react';
import {
  buildShapeSvg,
  fetchArrowSvg,
  fetchBlobSvg,
  fetchBlobsCatalog,
  fetchIconSvg,
  recolorLucideSvg,
  svgToDataUrl,
} from './utils';

export function PreviewCircle() {
  return (
    <svg width="60%" height="60%" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="currentColor" />
    </svg>
  );
}

export function PreviewRectangle() {
  return (
    <svg width="65%" height="65%" viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor" />
    </svg>
  );
}

export function PreviewLine() {
  return (
    <svg width="70%" height="20%" viewBox="0 0 24 4" aria-hidden>
      <rect x="0" y="0" width="24" height="4" rx="2" fill="currentColor" />
    </svg>
  );
}

export function PreviewArrow({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg
      width="65%"
      height="65%"
      viewBox="0 0 24 24"
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      <g stroke="currentColor" fill="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="3" y1="12" x2="17" y2="12" />
        <polygon points="15,7 21,12 15,17" />
      </g>
    </svg>
  );
}

export function PreviewStarRating() {
  return (
    <svg width="80%" height="40%" viewBox="0 0 24 6" aria-hidden>
      <g fill="currentColor">
        {[0, 1, 2, 3, 4].map((i) => (
          <polygon
            key={i}
            points={`${i * 5 + 2.5},0.5 ${i * 5 + 3.2},2.2 ${i * 5 + 4.7},2.4 ${i * 5 + 3.5},3.5 ${i * 5 + 3.9},5.2 ${i * 5 + 2.5},4.3 ${i * 5 + 1.1},5.2 ${i * 5 + 1.5},3.5 ${i * 5 + 0.3},2.4 ${i * 5 + 1.8},2.2`}
          />
        ))}
      </g>
    </svg>
  );
}

export function PlaceholderTile() {
  return <div className="w-3 h-3 rounded-full bg-border" aria-hidden />;
}

// Mini preview of a geometric shape primitive on the root Shapes card.
export function ShapePreviewTile({ shapeId }: { shapeId: string }) {
  const svg = buildShapeSvg(shapeId, '#94a3b8');
  if (!svg) return <PlaceholderTile />;
  return (
    <img
      src={svgToDataUrl(svg)}
      alt={shapeId}
      className="block w-3/5 h-3/5 object-contain thumb-outline rounded-sm"
    />
  );
}

// Mini preview of a Figma-sourced blob on the root Blobs card.
export function BlobPreviewTile({ name }: { name: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    // Catalog provides the version stamp; pre-warm it so the cache-bust
    // query string is applied on the first render.
    fetchBlobsCatalog()
      .then(() => fetchBlobSvg('figma-blobs', name))
      .then((svg) => {
        if (active) setDataUrl(svgToDataUrl(recolorLucideSvg(svg, '#94a3b8')));
      })
      .catch(() => {
        // Tile stays as the placeholder dot on failure.
      });
    return () => {
      active = false;
    };
  }, [name]);
  return dataUrl ? (
    <img src={dataUrl} alt={name} className="block w-3/5 h-3/5 object-contain thumb-outline rounded-sm" />
  ) : (
    <PlaceholderTile />
  );
}

// Mini preview of a handyarrows arrow on the root Arrows card.
export function HandyArrowPreviewTile({ name }: { name: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    fetchArrowSvg('handyarrows', name)
      .then((svg) => {
        if (active) setDataUrl(svgToDataUrl(recolorLucideSvg(svg, '#94a3b8')));
      })
      .catch(() => {
        // Tile stays as the placeholder dot on failure.
      });
    return () => {
      active = false;
    };
  }, [name]);
  return dataUrl ? (
    <img src={dataUrl} alt={name} className="block w-3/5 h-3/5 object-contain thumb-outline rounded-sm" />
  ) : (
    <PlaceholderTile />
  );
}

// Tiny tile that fetches a single Lucide icon and renders it as a preview.
// Used inside category cards on the root view.
export function LucidePreviewTile({ name }: { name: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    fetchIconSvg(name)
      .then((svg) => {
        if (active) setDataUrl(svgToDataUrl(recolorLucideSvg(svg, '#94a3b8')));
      })
      .catch(() => {
        // Tile stays as the placeholder dot on failure.
      });
    return () => {
      active = false;
    };
  }, [name]);
  return dataUrl ? (
    <img src={dataUrl} alt={name} className="block w-3/5 h-3/5 object-contain thumb-outline rounded-sm" />
  ) : (
    <PlaceholderTile />
  );
}
