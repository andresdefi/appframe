import type { JSX } from 'react';
import { motion } from 'framer-motion';
import type { CategoryId } from './utils';
import {
  BlobPreviewTile,
  HandyArrowPreviewTile,
  LucidePreviewTile,
  ShapePreviewTile,
} from './previewTiles';

interface CategoryDef {
  id: CategoryId;
  label: string;
  // Three preview tiles shown inside the category card.
  preview: JSX.Element[];
}

const ROOT_CATEGORIES: CategoryDef[] = [
  {
    id: 'shapes',
    label: 'Shapes',
    preview: [
      <ShapePreviewTile key="circle" shapeId="circle" />,
      <ShapePreviewTile key="hexagon" shapeId="hexagon" />,
      <ShapePreviewTile key="star-5" shapeId="star-5" />,
      <ShapePreviewTile key="pentagon" shapeId="pentagon" />,
      <ShapePreviewTile key="starburst-8" shapeId="starburst-8" />,
      <ShapePreviewTile key="rounded-square" shapeId="rounded-square" />,
    ],
  },
  {
    id: 'arrows',
    label: 'Arrows',
    preview: [
      <HandyArrowPreviewTile key="1" name="arrow-1" />,
      <HandyArrowPreviewTile key="3" name="arrow-3" />,
      <HandyArrowPreviewTile key="10" name="arrow-10" />,
      <HandyArrowPreviewTile key="50" name="arrow-50" />,
      <HandyArrowPreviewTile key="80" name="arrow-80" />,
      <HandyArrowPreviewTile key="120" name="arrow-120" />,
    ],
  },
  {
    id: 'icons',
    label: 'Icons',
    preview: [
      <LucidePreviewTile key="camera" name="camera" />,
      <LucidePreviewTile key="heart" name="heart" />,
      <LucidePreviewTile key="bell" name="bell" />,
      <LucidePreviewTile key="star" name="star" />,
      <LucidePreviewTile key="search" name="search" />,
      <LucidePreviewTile key="settings" name="settings" />,
    ],
  },
  {
    id: 'blobs',
    label: 'Blobs',
    preview: [
      <BlobPreviewTile key="1" name="blob-1" />,
      <BlobPreviewTile key="3" name="blob-3" />,
      <BlobPreviewTile key="7" name="blob-7" />,
      <BlobPreviewTile key="11" name="blob-11" />,
      <BlobPreviewTile key="15" name="blob-15" />,
      <BlobPreviewTile key="19" name="blob-19" />,
    ],
  },
];

interface RootViewProps {
  onPickCategory: (id: CategoryId) => void;
  onUploadImage: () => void;
}

export function RootView({ onPickCategory, onUploadImage }: RootViewProps) {
  return (
    <div className="mx-3 mt-4 mb-4 px-1">
      <motion.div
        className="grid grid-cols-2 gap-2 mb-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
        }}
      >
        {ROOT_CATEGORIES.map((cat) => (
          <motion.div
            key={cat.id}
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
            }}
          >
            <CategoryCard category={cat} onClick={() => onPickCategory(cat.id)} />
          </motion.div>
        ))}
      </motion.div>
      <button
        type="button"
        className="w-full py-2 text-xs bg-surface-2 surface-card surface-card-hover rounded-lg text-text-dim hover:text-text transition duration-150 active:scale-[0.97]"
        onClick={onUploadImage}
      >
        Upload custom image
      </button>
    </div>
  );
}

function CategoryCard({ category, onClick }: { category: CategoryDef; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-full w-full text-left rounded-lg bg-surface-2 surface-card surface-card-hover p-2.5 hover:bg-surface-2/80 transition duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="grid grid-cols-3 gap-1 mb-2">
        {category.preview.map((node, i) => (
          <div
            key={i}
            className="aspect-square flex items-center justify-center text-text-dim"
          >
            {node}
          </div>
        ))}
      </div>
      <div className="text-[12px] font-medium text-text text-balance">{category.label}</div>
    </button>
  );
}
