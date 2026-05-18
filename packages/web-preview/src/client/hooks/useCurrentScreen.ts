import { useCallback } from 'react';
import { usePreviewStore, selectScreensForLocale } from '../store';
import type { ScreenState } from '../types';

/**
 * Returns the active locale's screen at `selectedScreen` index plus an
 * `update` helper that writes to the active locale's data. Locale-aware:
 * when a non-default locale is active, reads/writes go to that locale's
 * snapshot (state.localeScreens[locale]); when default is active, they
 * go to state.screens.
 */
export function useCurrentScreen() {
  const selectedScreen = usePreviewStore((s) => s.selectedScreen);
  const screen = usePreviewStore(
    (s) => selectScreensForLocale(s, s.locale)[s.selectedScreen],
  );
  const updateScreen = usePreviewStore((s) => s.updateScreen);

  const update = useCallback(
    (partial: Partial<ScreenState>) => {
      updateScreen(selectedScreen, partial);
    },
    [selectedScreen, updateScreen],
  );

  return { screen, selectedScreen, update };
}
