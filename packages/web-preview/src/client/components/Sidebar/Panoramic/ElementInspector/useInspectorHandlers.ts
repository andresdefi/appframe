import { useCallback, useMemo } from 'react';
import { usePreviewStore } from '../../../../store';
import type { PanoramicElement } from '../../../../types';
import { usePanoramicInstantPatch } from '../../../../hooks/usePanoramicInstantPatch';
import { getSortedIndex } from '../helpers';

export interface InspectorHandlers<T extends PanoramicElement = PanoramicElement> {
  element: T | undefined;
  update: (partial: Partial<PanoramicElement>) => void;
  instant: (partial: Record<string, number>) => void;
}

export function useInspectorHandlers<T extends PanoramicElement = PanoramicElement>(
  index: number,
): InspectorHandlers<T> {
  const element = usePreviewStore((s) => s.panoramicElements[index]) as T | undefined;
  const elements = usePreviewStore((s) => s.panoramicElements);
  const updateElement = usePreviewStore((s) => s.updatePanoramicElement);
  const { patchElement } = usePanoramicInstantPatch();

  const sortedIndex = useMemo(() => getSortedIndex(elements, index), [elements, index]);

  const update = useCallback(
    (partial: Partial<PanoramicElement>) => {
      updateElement(index, partial);
    },
    [index, updateElement],
  );

  const instant = useCallback(
    (partial: Record<string, number>) => {
      patchElement(sortedIndex, partial);
    },
    [patchElement, sortedIndex],
  );

  return { element, update, instant };
}
