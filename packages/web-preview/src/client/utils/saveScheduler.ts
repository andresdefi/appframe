export interface SaveScheduler<TPayload> {
  /** Compute the next payload and schedule a save `debounceMs` from now. */
  schedule: (compute: () => TPayload) => void;
  /** Cancel any pending save and run save() synchronously with the latest computed payload (if any has changed since the last persisted value). Used on tab close. */
  flushSync: () => void;
  /** Stop accepting new schedules, clear pending timers. */
  dispose: () => void;
  /** Read-only state hooks for tests. */
  readonly hasPendingTimer: () => boolean;
}

export interface SaveSchedulerOptions<TPayload> {
  debounceMs: number;
  save: (payload: TPayload, mode: 'debounced' | 'sync') => void;
  /** Optional equality check on the serialized payload to skip no-op saves. Default: JSON.stringify equality. */
  serialize?: (payload: TPayload) => string;
  /** Optional injection for tests. */
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => unknown;
  clearTimer?: (handle: unknown) => void;
}

export function createSaveScheduler<TPayload>(
  options: SaveSchedulerOptions<TPayload>,
): SaveScheduler<TPayload> {
  const serialize = options.serialize ?? ((p) => JSON.stringify(p));
  const setTimer =
    options.setTimer ??
    ((fn, ms) => {
      // Use globalThis to keep this file environment-agnostic (node + browser).
      return (globalThis as { setTimeout: typeof setTimeout }).setTimeout(fn, ms);
    });
  const clearTimer =
    options.clearTimer ??
    ((handle) => {
      (globalThis as { clearTimeout: typeof clearTimeout }).clearTimeout(
        handle as ReturnType<typeof setTimeout>,
      );
    });

  let timer: unknown = null;
  let pendingCompute: (() => TPayload) | null = null;
  let lastSerialized: string | null = null;
  let disposed = false;

  function fire(mode: 'debounced' | 'sync'): void {
    if (!pendingCompute) return;
    const payload = pendingCompute();
    pendingCompute = null;
    const serialized = serialize(payload);
    if (serialized === lastSerialized) return;
    lastSerialized = serialized;
    options.save(payload, mode);
  }

  return {
    schedule(compute) {
      if (disposed) return;
      pendingCompute = compute;
      if (timer !== null) clearTimer(timer);
      timer = setTimer(() => {
        timer = null;
        fire('debounced');
      }, options.debounceMs);
    },
    flushSync() {
      if (disposed) return;
      if (timer !== null) {
        clearTimer(timer);
        timer = null;
      }
      fire('sync');
    },
    dispose() {
      disposed = true;
      if (timer !== null) {
        clearTimer(timer);
        timer = null;
      }
      pendingCompute = null;
    },
    hasPendingTimer: () => timer !== null,
  };
}
