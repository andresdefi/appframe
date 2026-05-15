import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSaveScheduler } from './saveScheduler';

describe('createSaveScheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('coalesces N changes within the debounce window into one save', () => {
    const save = vi.fn();
    const scheduler = createSaveScheduler<number>({ debounceMs: 500, save });
    let value = 1;
    for (let i = 0; i < 5; i++) {
      value = i + 1;
      scheduler.schedule(() => value);
      vi.advanceTimersByTime(50); // 50ms apart, well under 500ms
    }
    expect(save).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith(5, 'debounced');
  });

  it('saves once per gap when changes are spaced beyond the debounce', () => {
    const save = vi.fn();
    const scheduler = createSaveScheduler<number>({ debounceMs: 500, save });
    scheduler.schedule(() => 1);
    vi.advanceTimersByTime(600);
    scheduler.schedule(() => 2);
    vi.advanceTimersByTime(600);
    scheduler.schedule(() => 3);
    vi.advanceTimersByTime(600);
    expect(save).toHaveBeenCalledTimes(3);
    expect(save.mock.calls.map((c) => c[0])).toEqual([1, 2, 3]);
  });

  it('flushSync fires pending save synchronously and cancels the timer', () => {
    const save = vi.fn();
    const scheduler = createSaveScheduler<string>({ debounceMs: 500, save });
    scheduler.schedule(() => 'a');
    expect(scheduler.hasPendingTimer()).toBe(true);
    scheduler.flushSync();
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith('a', 'sync');
    expect(scheduler.hasPendingTimer()).toBe(false);
    // Subsequent advancement should not double-fire.
    vi.advanceTimersByTime(1000);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('flushSync with no pending save is a no-op', () => {
    const save = vi.fn();
    const scheduler = createSaveScheduler<string>({ debounceMs: 500, save });
    scheduler.flushSync();
    expect(save).not.toHaveBeenCalled();
  });

  it('skips no-op saves with the same serialized payload', () => {
    const save = vi.fn();
    const scheduler = createSaveScheduler<{ x: number }>({ debounceMs: 500, save });
    scheduler.schedule(() => ({ x: 1 }));
    vi.advanceTimersByTime(500);
    expect(save).toHaveBeenCalledTimes(1);
    scheduler.schedule(() => ({ x: 1 })); // same content
    vi.advanceTimersByTime(500);
    expect(save).toHaveBeenCalledTimes(1);
    scheduler.schedule(() => ({ x: 2 })); // different
    vi.advanceTimersByTime(500);
    expect(save).toHaveBeenCalledTimes(2);
  });

  it('flushSync also skips no-ops', () => {
    const save = vi.fn();
    const scheduler = createSaveScheduler<{ x: number }>({ debounceMs: 500, save });
    scheduler.schedule(() => ({ x: 1 }));
    scheduler.flushSync();
    expect(save).toHaveBeenCalledTimes(1);
    scheduler.schedule(() => ({ x: 1 }));
    scheduler.flushSync();
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('uses the latest computed value at fire time (not the value at schedule time)', () => {
    const save = vi.fn();
    const scheduler = createSaveScheduler<number>({ debounceMs: 500, save });
    let val = 1;
    scheduler.schedule(() => val);
    val = 99;
    vi.advanceTimersByTime(500);
    expect(save).toHaveBeenCalledWith(99, 'debounced');
  });

  it('dispose stops accepting schedules and clears the timer', () => {
    const save = vi.fn();
    const scheduler = createSaveScheduler<number>({ debounceMs: 500, save });
    scheduler.schedule(() => 1);
    scheduler.dispose();
    vi.advanceTimersByTime(1000);
    expect(save).not.toHaveBeenCalled();
    scheduler.schedule(() => 2);
    scheduler.flushSync();
    expect(save).not.toHaveBeenCalled();
  });
});
