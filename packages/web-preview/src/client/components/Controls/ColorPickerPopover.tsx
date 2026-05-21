import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { displayP3ToHex, hexToDisplayP3, parseDisplayP3 } from '@appframe/core/color/p3';

/** Unit RGB — components in 0..1. The picker operates in this space
 *  throughout (Display-P3 components), so click positions on the SV
 *  pad can reach colours outside the sRGB gamut. */
interface RgbUnit { r: number; g: number; b: number }
interface Hsv { h: number; s: number; v: number }

function hsvToRgbUnit(h: number, s: number, v: number): RgbUnit {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return { r: r + m, g: g + m, b: b + m };
}

function rgbUnitToHsv({ r, g, b }: RgbUnit): Hsv {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = h * 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

/** Format the picker's P3 components as the canonical storage string. */
function p3String(rgb: RgbUnit): string {
  return `color(display-p3 ${rgb.r.toFixed(4)} ${rgb.g.toFixed(4)} ${rgb.b.toFixed(4)})`;
}

/** Read the parent's value as P3 components in 0..1. Hex inputs convert
 *  losslessly via `hexToDisplayP3`; P3 inputs parse directly. Returns
 *  null when the value isn't a colour the picker recognises. */
function valueToP3Unit(value: string): RgbUnit | null {
  const hexMatch = /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.exec(value.trim());
  if (hexMatch) {
    const p3 = parseDisplayP3(hexToDisplayP3('#' + hexMatch[1]!));
    return p3;
  }
  return parseDisplayP3(value);
}

/** Normalise the hex-input field's textual content into a usable 6-char
 *  hex literal (lowercased, with leading #), or null if invalid. */
function normaliseHexInput(raw: string): string | null {
  const m = /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.exec(raw.trim());
  if (!m) return null;
  let h = m[1]!;
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return '#' + h.toLowerCase();
}

interface ColorPickerPopoverProps {
  triggerRef: RefObject<HTMLElement>;
  /** Hex or `color(display-p3 r g b)` storage form. */
  value: string;
  /** Always receives the canonical P3 storage string. */
  onChange: (next: string) => void;
  onInstant?: (next: string) => void;
  onClose: () => void;
}

const POPOVER_WIDTH = 256;
const POPOVER_HEIGHT = 320;

export function ColorPickerPopover({
  triggerRef,
  value,
  onChange,
  onInstant,
  onClose,
}: ColorPickerPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const padRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  // HSV state lives in Display-P3 space. The SV pad's right edge =
  // P3-primary at the current hue (not the sRGB-primary), so clicks at
  // S=1, V=1 produce a wider-gamut colour than an sRGB picker could.
  const initialP3 = valueToP3Unit(value) ?? { r: 0, g: 0, b: 0 };
  const [hsv, setHsv] = useState<Hsv>(() => rgbUnitToHsv(initialP3));
  const initialHexDisplay = displayP3ToHex(p3String(initialP3));
  const [hexInput, setHexInput] = useState((initialHexDisplay ?? '#000000').toUpperCase());

  useEffect(() => {
    const p3 = valueToP3Unit(value);
    if (!p3) return;
    setHsv((prev) => {
      const next = rgbUnitToHsv(p3);
      return next.s === 0 ? { ...next, h: prev.h } : next;
    });
    const hex = displayP3ToHex(p3String(p3));
    if (hex) setHexInput(hex.toUpperCase());
  }, [value]);

  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  useEffect(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    let left = r.right + 8;
    if (left + POPOVER_WIDTH > window.innerWidth - 8) {
      left = r.left - POPOVER_WIDTH - 8;
    }
    let top = r.top - 32;
    top = Math.max(8, Math.min(top, window.innerHeight - POPOVER_HEIGHT - 8));
    setPos({ left, top });
  }, [triggerRef]);

  useEffect(() => {
    const handleDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const t = setTimeout(() => document.addEventListener('mousedown', handleDown), 0);
    document.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose, triggerRef]);

  const commit = useCallback((nextHsv: Hsv) => {
    const rgb = hsvToRgbUnit(nextHsv.h, nextHsv.s, nextHsv.v);
    const p3 = p3String(rgb);
    const hexDisplay = displayP3ToHex(p3);
    if (hexDisplay) setHexInput(hexDisplay.toUpperCase());
    onChange(p3);
  }, [onChange]);

  const tickInstant = useCallback((nextHsv: Hsv) => {
    if (!onInstant) return;
    const rgb = hsvToRgbUnit(nextHsv.h, nextHsv.s, nextHsv.v);
    onInstant(p3String(rgb));
  }, [onInstant]);

  const startDrag = useCallback((
    el: HTMLElement,
    e: React.PointerEvent,
    onTick: (xUnit: number, yUnit: number) => Hsv,
  ) => {
    const rect = el.getBoundingClientRect();
    let lastHsv: Hsv | null = null;
    const update = (clientX: number, clientY: number) => {
      const xUnit = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const yUnit = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      const next = onTick(xUnit, yUnit);
      lastHsv = next;
      setHsv(next);
      tickInstant(next);
    };
    update(e.clientX, e.clientY);
    const handleMove = (ev: PointerEvent) => update(ev.clientX, ev.clientY);
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      if (lastHsv) commit(lastHsv);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  }, [commit, tickInstant]);

  const handlePadDown = (e: React.PointerEvent) => {
    if (!padRef.current) return;
    startDrag(padRef.current, e, (x, y) => ({ h: hsv.h, s: x, v: 1 - y }));
  };

  const handleHueDown = (e: React.PointerEvent) => {
    if (!hueRef.current) return;
    startDrag(hueRef.current, e, (x) => ({ h: x * 360, s: hsv.s, v: hsv.v }));
  };

  const applyHexInput = () => {
    const hex = normaliseHexInput(hexInput);
    if (hex) {
      // Hex → P3 (lossless). Store as P3, re-derive HSV from the P3
      // components so the picker cursor lands on the matching point.
      const p3 = parseDisplayP3(hexToDisplayP3(hex));
      if (p3) {
        setHsv(rgbUnitToHsv(p3));
        setHexInput(hex.toUpperCase());
        onChange(p3String(p3));
        return;
      }
    }
    // Bad input — revert the field to the current value's clamped hex.
    const fallback = valueToP3Unit(value);
    if (fallback) {
      const back = displayP3ToHex(p3String(fallback));
      if (back) setHexInput(back.toUpperCase());
    }
  };

  // Pad gradient: black bottom + white-to-P3-primary horizontal stripe.
  // Using `color(display-p3 …)` stops lets the right edge reach the
  // wider-gamut primary, so dragging the cursor there picks a colour
  // sRGB displays can't render.
  const padHue = hsvToRgbUnit(hsv.h, 1, 1);
  const padHueP3 = p3String(padHue);

  // Out-of-gamut indicator on the hex field — the displayed hex is a
  // clamped sRGB approximation when the picked P3 colour sits outside
  // the sRGB triangle. The actual stored value is the unclamped P3.
  const currentP3 = hsvToRgbUnit(hsv.h, hsv.s, hsv.v);
  const currentP3Str = p3String(currentP3);
  const clampedHex = displayP3ToHex(currentP3Str);
  const hexLooksClamped =
    clampedHex !== null &&
    (() => {
      // Compare the P3 of the displayed hex to currentP3. If they
      // differ by more than rounding noise, the displayed hex is a
      // clamp of an out-of-gamut value.
      const rebuilt = parseDisplayP3(hexToDisplayP3(clampedHex));
      if (!rebuilt) return false;
      const delta = Math.max(
        Math.abs(rebuilt.r - currentP3.r),
        Math.abs(rebuilt.g - currentP3.g),
        Math.abs(rebuilt.b - currentP3.b),
      );
      return delta > 0.01;
    })();

  return (
    <div
      ref={containerRef}
      className="fixed z-[10000] bg-surface-2 surface-card rounded-2xl p-4 animate-in fade-in zoom-in-95"
      style={{ left: pos.left, top: pos.top, width: POPOVER_WIDTH }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="text-sm font-semibold text-text mb-3">Color picker</div>

      <div
        ref={padRef}
        className="relative w-full aspect-[4/3] rounded-xl cursor-crosshair overflow-hidden select-none"
        style={{
          background: `
            linear-gradient(to top, color(display-p3 0 0 0), transparent),
            linear-gradient(to right, color(display-p3 1 1 1), ${padHueP3})
          `,
          touchAction: 'none',
        }}
        onPointerDown={handlePadDown}
      >
        <div
          className="absolute w-3.5 h-3.5 -ml-[7px] -mt-[7px] rounded-full border-2 border-white pointer-events-none shadow-md"
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }}
        />
      </div>

      <div
        ref={hueRef}
        className="relative w-full h-3 rounded-full cursor-pointer mt-3 select-none"
        style={{
          background:
            'linear-gradient(to right, color(display-p3 1 0 0) 0%, color(display-p3 1 1 0) 17%, color(display-p3 0 1 0) 33%, color(display-p3 0 1 1) 50%, color(display-p3 0 0 1) 67%, color(display-p3 1 0 1) 83%, color(display-p3 1 0 0) 100%)',
          touchAction: 'none',
        }}
        onPointerDown={handleHueDown}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 -ml-2 rounded-full border-2 border-white pointer-events-none shadow-md"
          style={{ left: `${(hsv.h / 360) * 100}%`, background: padHueP3 }}
        />
      </div>

      <div className="relative mt-3">
        <input
          type="text"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          onBlur={applyHexInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              applyHexInput();
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="input-shell w-full text-center text-[13px] font-mono uppercase tabular-nums"
          spellCheck={false}
          aria-label="Hex color (sRGB approximation when out of gamut)"
          maxLength={7}
        />
        {hexLooksClamped && (
          // Subtle marker that the displayed hex is a clamped sRGB
          // approximation — the stored P3 value carries the full
          // wide-gamut colour the user picked.
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-text-dim"
            title="Out-of-sRGB-gamut colour. The shown hex is a clamped sRGB approximation; the stored P3 value preserves the full colour."
            aria-label="Approximated hex (out of sRGB gamut)"
          >
            P3
          </span>
        )}
      </div>
    </div>
  );
}
