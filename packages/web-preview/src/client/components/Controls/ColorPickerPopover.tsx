import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

interface Rgb { r: number; g: number; b: number }
interface Hsv { h: number; s: number; v: number }

function hsvToRgb(h: number, s: number, v: number): Rgb {
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
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function rgbToHsv(r: number, g: number, b: number): Hsv {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h = h * 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

function rgbToHex({ r, g, b }: Rgb): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function hexToRgb(hex: string): Rgb | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return {
    r: parseInt(m[1]!, 16),
    g: parseInt(m[2]!, 16),
    b: parseInt(m[3]!, 16),
  };
}

interface ColorPickerPopoverProps {
  triggerRef: RefObject<HTMLElement>;
  value: string;
  onChange: (hex: string) => void;
  onInstant?: (hex: string) => void;
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

  const initialRgb = hexToRgb(value) ?? { r: 0, g: 0, b: 0 };
  const [hsv, setHsv] = useState<Hsv>(() => rgbToHsv(initialRgb.r, initialRgb.g, initialRgb.b));
  const [hexInput, setHexInput] = useState(value.toUpperCase());

  useEffect(() => {
    const rgb = hexToRgb(value);
    if (!rgb) return;
    setHsv((prev) => {
      const next = rgbToHsv(rgb.r, rgb.g, rgb.b);
      return next.s === 0 ? { ...next, h: prev.h } : next;
    });
    setHexInput(rgbToHex(rgb).toUpperCase());
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
    const rgb = hsvToRgb(nextHsv.h, nextHsv.s, nextHsv.v);
    const hex = rgbToHex(rgb);
    setHexInput(hex);
    onChange(hex);
  }, [onChange]);

  const tickInstant = useCallback((nextHsv: Hsv) => {
    if (!onInstant) return;
    const rgb = hsvToRgb(nextHsv.h, nextHsv.s, nextHsv.v);
    onInstant(rgbToHex(rgb));
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
    const rgb = hexToRgb(hexInput);
    if (rgb) {
      const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setHsv(newHsv);
      const hex = rgbToHex(rgb);
      setHexInput(hex);
      onChange(hex);
    } else {
      const rgb2 = hexToRgb(value);
      if (rgb2) setHexInput(rgbToHex(rgb2));
    }
  };

  const pureHue = hsvToRgb(hsv.h, 1, 1);
  const pureHueHex = rgbToHex(pureHue);

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
            linear-gradient(to top, #000, transparent),
            linear-gradient(to right, #fff, ${pureHueHex})
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
          background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
          touchAction: 'none',
        }}
        onPointerDown={handleHueDown}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 -ml-2 rounded-full border-2 border-white pointer-events-none shadow-md"
          style={{ left: `${(hsv.h / 360) * 100}%`, background: pureHueHex }}
        />
      </div>

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
        className="input-shell w-full text-center text-[13px] font-mono uppercase tabular-nums mt-3"
        spellCheck={false}
        aria-label="Hex color"
        maxLength={7}
      />
    </div>
  );
}
