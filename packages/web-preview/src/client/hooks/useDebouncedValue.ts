import { useEffect, useState } from 'react';

/**
 * Returns a value that lags `delay` ms behind the input. Useful to smooth
 * out rapid mutations (slider drags, fast typing) so downstream effects
 * fire once after the user settles instead of once per tick.
 *
 * Used by the inactive-locale rows to debounce capture-key changes during
 * structural edits — without it, dragging a font-size slider on Default
 * would churn the capture queue at ~60 keys/sec, cancelling and re-queuing
 * captures for every other locale.
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
