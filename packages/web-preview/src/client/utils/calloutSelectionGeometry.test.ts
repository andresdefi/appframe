import { describe, it, expect } from 'vitest';
import { rectToCalloutSource, MIN_DRAG_FRACTION } from './calloutSelectionGeometry';

describe('rectToCalloutSource', () => {
  it('converts a top-left → bottom-right drag into percentages', () => {
    const out = rectToCalloutSource(0.1, 0.2, 0.5, 0.8);
    expect(out).not.toBeNull();
    expect(out!.sourceX).toBeCloseTo(10);
    expect(out!.sourceY).toBeCloseTo(20);
    expect(out!.sourceW).toBeCloseTo(40);
    expect(out!.sourceH).toBeCloseTo(60);
    expect(out!.displayX).toBeCloseTo(30);
    expect(out!.displayY).toBeCloseTo(50);
  });

  it('normalises a bottom-right → top-left drag identically', () => {
    const forward = rectToCalloutSource(0.1, 0.2, 0.5, 0.8);
    const reverse = rectToCalloutSource(0.5, 0.8, 0.1, 0.2);
    expect(reverse).toEqual(forward);
  });

  it('normalises a top-right → bottom-left drag identically', () => {
    const forward = rectToCalloutSource(0.1, 0.2, 0.5, 0.8);
    const crossed = rectToCalloutSource(0.5, 0.2, 0.1, 0.8);
    expect(crossed).toEqual(forward);
  });

  it('returns null below the tiny-drag threshold on either axis', () => {
    // Both axes too small
    expect(rectToCalloutSource(0.5, 0.5, 0.5, 0.5)).toBeNull();
    // X axis below threshold, Y above
    expect(rectToCalloutSource(0.5, 0.1, 0.51, 0.9)).toBeNull();
    // Y axis below threshold, X above
    expect(rectToCalloutSource(0.1, 0.5, 0.9, 0.51)).toBeNull();
  });

  it('accepts a drag exactly at the threshold', () => {
    const out = rectToCalloutSource(0, 0, MIN_DRAG_FRACTION, MIN_DRAG_FRACTION);
    expect(out).not.toBeNull();
  });

  it('clamps coordinates outside [0,1] back into range', () => {
    const out = rectToCalloutSource(-0.5, -0.5, 1.5, 1.5);
    expect(out).not.toBeNull();
    expect(out!.sourceX).toBe(0);
    expect(out!.sourceY).toBe(0);
    expect(out!.sourceW).toBe(100);
    expect(out!.sourceH).toBe(100);
    expect(out!.displayX).toBe(50);
    expect(out!.displayY).toBe(50);
  });

  it('places the card centre at the rectangle centre', () => {
    const out = rectToCalloutSource(0.2, 0.3, 0.6, 0.7);
    expect(out!.displayX).toBeCloseTo(40);
    expect(out!.displayY).toBeCloseTo(50);
  });

  it('handles a rectangle in the lower-right quadrant', () => {
    const out = rectToCalloutSource(0.6, 0.7, 0.9, 0.95);
    expect(out!.sourceX).toBeCloseTo(60);
    expect(out!.sourceY).toBeCloseTo(70);
    expect(out!.sourceW).toBeCloseTo(30);
    expect(out!.sourceH).toBeCloseTo(25);
    expect(out!.displayX).toBeCloseTo(75);
    expect(out!.displayY).toBeCloseTo(82.5);
  });

  it('returns null for NaN inputs without throwing', () => {
    expect(rectToCalloutSource(NaN, 0, 0.5, 0.5)).toBeNull();
  });
});
