import { useCallback } from 'react';
import { usePreviewStore } from '../store';
import type { ScreenState } from '../types';

export function useCurrentScreen() {
  const selectedScreen = usePreviewStore((s) => s.selectedScreen);
  const screen = usePreviewStore((s) => s.screens[s.selectedScreen]);
  const updateScreen = usePreviewStore((s) => s.updateScreen);

  const update = useCallback(
    (partial: Partial<ScreenState>) => {
      updateScreen(selectedScreen, partial);
    },
    [selectedScreen, updateScreen],
  );

  return { screen, selectedScreen, update };
}
