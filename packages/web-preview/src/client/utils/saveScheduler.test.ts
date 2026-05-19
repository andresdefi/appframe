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

  it('flushPending fires the latest payload with mode debounced and cancels the timer', () => {
    const save = vi.fn();
    const scheduler = createSaveScheduler<string>({ debounceMs: 500, save });
    scheduler.schedule(() => 'a');
    expect(scheduler.hasPendingTimer()).toBe(true);
    scheduler.flushPending();
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith('a', 'debounced');
    expect(scheduler.hasPendingTimer()).toBe(false);
    vi.advanceTimersByTime(1000);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('flushPending with no pending save is a no-op', () => {
    const save = vi.fn();
    const scheduler = createSaveScheduler<string>({ debounceMs: 500, save });
    scheduler.flushPending();
    expect(save).not.toHaveBeenCalled();
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

  it('retries the same payload after a failed save (sync throw)', () => {
    const save = vi
      .fn()
      .mockImplementationOnce(() => {
        throw new Error('disk full');
      })
      .mockImplementationOnce(() => undefined);
    const scheduler = createSaveScheduler<{ x: number }>({ debounceMs: 500, save });
    scheduler.schedule(() => ({ x: 1 }));
    vi.advanceTimersByTime(500);
    expect(save).toHaveBeenCalledTimes(1);
    // Same payload — would normally be skipped as a no-op, but the
    // previous attempt rejected so the scheduler must let it through.
    scheduler.schedule(() => ({ x: 1 }));
    vi.advanceTimersByTime(500);
    expect(save).toHaveBeenCalledTimes(2);
  });

  it('retries the same payload after a failed save (rejected promise)', async () => {
    // Pre-build the promises so the test owns a handled reference and
    // we never let an unhandled rejection escape the mock factory.
    const firstFail = Promise.reject(new Error('network'));
    firstFail.catch(() => undefined);
    const save = vi
      .fn<(payload: { x: number }, mode: 'debounced' | 'sync') => Promise<void>>()
      .mockImplementationOnce(() => firstFail)
      .mockImplementationOnce(() => Promise.resolve());
    const scheduler = createSaveScheduler<{ x: number }>({ debounceMs: 500, save });
    scheduler.schedule(() => ({ x: 1 }));
    vi.advanceTimersByTime(500);
    expect(save).toHaveBeenCalledTimes(1);
    // Let the scheduler's rejection handler run before the next
    // schedule() so lastSerialized reverts in time.
    await firstFail.catch(() => undefined);
    scheduler.schedule(() => ({ x: 1 }));
    vi.advanceTimersByTime(500);
    expect(save).toHaveBeenCalledTimes(2);
  });

  it('does not revert when a newer payload landed during the in-flight save', async () => {
    let rejectFirst!: (err: Error) => void;
    const firstPromise = new Promise<void>((_, reject) => {
      rejectFirst = reject;
    });
    const save = vi
      .fn<(payload: { x: number }, mode: 'debounced' | 'sync') => Promise<void>>()
      .mockImplementationOnce(() => firstPromise)
      .mockImplementationOnce(() => Promise.resolve())
      .mockImplementationOnce(() => Promise.resolve());
    const scheduler = createSaveScheduler<{ x: number }>({ debounceMs: 500, save });
    // Fire #1 with x:1; promise stays pending.
    scheduler.schedule(() => ({ x: 1 }));
    vi.advanceTimersByTime(500);
    expect(save).toHaveBeenCalledTimes(1);
    // Fire #2 with x:2 lands while #1 is still in-flight.
    scheduler.schedule(() => ({ x: 2 }));
    vi.advanceTimersByTime(500);
    expect(save).toHaveBeenCalledTimes(2);
    // Now #1 rejects. lastSerialized is x:2, so the revert must be a no-op.
    rejectFirst(new Error('late'));
    await Promise.resolve();
    await Promise.resolve();
    // Re-scheduling x:2 should still be skipped as a no-op since #2 was
    // recorded as successful (lastSerialized was not reverted).
    scheduler.schedule(() => ({ x: 2 }));
    vi.advanceTimersByTime(500);
    expect(save).toHaveBeenCalledTimes(2);
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
