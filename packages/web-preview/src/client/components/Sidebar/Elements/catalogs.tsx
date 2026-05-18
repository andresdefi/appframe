import type { CatalogItem, CategoryId } from './utils';
import { PreviewArrow, PreviewCircle, PreviewLine, PreviewRectangle, PreviewStarRating } from './previewTiles';

export const CATALOGS: Record<CategoryId, CatalogItem[]> = {
  shapes: [
    {
      id: 'circle',
      label: 'Circle',
      preview: <PreviewCircle />,
      build: () => ({ type: 'shape', shapeType: 'circle', shapeColor: '#6366f1', shapeOpacity: 0.5 }),
    },
    {
      id: 'rectangle',
      label: 'Rectangle',
      preview: <PreviewRectangle />,
      build: () => ({ type: 'shape', shapeType: 'rectangle', shapeColor: '#6366f1', shapeOpacity: 0.5 }),
    },
    {
      id: 'line',
      label: 'Line',
      preview: <PreviewLine />,
      build: () => ({ type: 'shape', shapeType: 'line', shapeColor: '#6366f1', shapeOpacity: 0.8 }),
    },
    {
      id: 'arrow',
      label: 'Arrow',
      preview: <PreviewArrow />,
      build: () => ({ type: 'shape', shapeType: 'arrow', shapeColor: '#6366f1', shapeOpacity: 1 }),
    },
  ],
  arrows: [
    {
      id: 'arrow-right',
      label: 'Arrow right',
      preview: <PreviewArrow />,
      build: () => ({ type: 'shape', shapeType: 'arrow', shapeColor: '#6366f1', shapeOpacity: 1, rotation: 0 }),
    },
    {
      id: 'arrow-down',
      label: 'Arrow down',
      preview: <PreviewArrow rotate={90} />,
      build: () => ({ type: 'shape', shapeType: 'arrow', shapeColor: '#6366f1', shapeOpacity: 1, rotation: 90 }),
    },
    {
      id: 'arrow-left',
      label: 'Arrow left',
      preview: <PreviewArrow rotate={180} />,
      build: () => ({ type: 'shape', shapeType: 'arrow', shapeColor: '#6366f1', shapeOpacity: 1, rotation: 180 }),
    },
    {
      id: 'arrow-up',
      label: 'Arrow up',
      preview: <PreviewArrow rotate={-90} />,
      build: () => ({ type: 'shape', shapeType: 'arrow', shapeColor: '#6366f1', shapeOpacity: 1, rotation: -90 }),
    },
  ],
  icons: [],
  decor: [],
  blobs: [],
  stars: [
    {
      id: 'star-rating',
      label: 'Star rating',
      preview: <PreviewStarRating />,
      build: () => ({ type: 'star-rating', shapeColor: '#f59e0b', size: 100 }),
    },
  ],
};
