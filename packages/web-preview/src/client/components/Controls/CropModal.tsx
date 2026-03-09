import { useEffect, useRef, useCallback } from 'react';

interface CropModalProps {
  imageDataUrl: string;
  onApply: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

type DragMode = 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'new' | null;

function getHandle(
  mx: number,
  my: number,
  crop: CropRect,
): Exclude<DragMode, null> {
  const hs = 12;
  const corners: { name: 'nw' | 'ne' | 'sw' | 'se'; x: number; y: number }[] = [
    { name: 'nw', x: crop.x, y: crop.y },
    { name: 'ne', x: crop.x + crop.w, y: crop.y },
    { name: 'sw', x: crop.x, y: crop.y + crop.h },
    { name: 'se', x: crop.x + crop.w, y: crop.y + crop.h },
  ];
  for (const c of corners) {
    if (Math.abs(mx - c.x) < hs && Math.abs(my - c.y) < hs) return c.name;
  }
  if (mx > crop.x && mx < crop.x + crop.w && my > crop.y && my < crop.y + crop.h) return 'move';
  return 'new';
}

const CURSOR_MAP: Record<string, string> = {
  nw: 'nw-resize',
  ne: 'ne-resize',
  sw: 'sw-resize',
  se: 'se-resize',
  move: 'move',
  new: 'crosshair',
};

export function CropModal({ imageDataUrl, onApply, onCancel }: CropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const cropRef = useRef<CropRect>({ x: 0, y: 0, w: 0, h: 0 });
  const scaleRef = useRef(1);
  const dragRef = useRef<{
    mode: DragMode;
    startX: number;
    startY: number;
    startCrop: CropRect;
  }>({ mode: null, startX: 0, startY: 0, startCrop: { x: 0, y: 0, w: 0, h: 0 } });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const crop = cropRef.current;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, cw, ch);

    // Dim outside crop
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, cw, crop.y);
    ctx.fillRect(0, crop.y + crop.h, cw, ch - crop.y - crop.h);
    ctx.fillRect(0, crop.y, crop.x, crop.h);
    ctx.fillRect(crop.x + crop.w, crop.y, cw - crop.x - crop.w, crop.h);

    // Crop border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x, crop.y, crop.w, crop.h);

    // Corner handles
    const hs = 8;
    ctx.fillStyle = '#fff';
    const pts: [number, number][] = [
      [crop.x, crop.y],
      [crop.x + crop.w, crop.y],
      [crop.x, crop.y + crop.h],
      [crop.x + crop.w, crop.y + crop.h],
    ];
    for (const [px, py] of pts) {
      ctx.fillRect(px - hs / 2, py - hs / 2, hs, hs);
    }

    // Rule-of-thirds grid
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(crop.x + (crop.w * i) / 3, crop.y);
      ctx.lineTo(crop.x + (crop.w * i) / 3, crop.y + crop.h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(crop.x, crop.y + (crop.h * i) / 3);
      ctx.lineTo(crop.x + crop.w, crop.y + (crop.h * i) / 3);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const maxW = window.innerWidth * 0.8;
      const maxH = window.innerHeight * 0.7;
      const displayScale = Math.min(maxW / iw, maxH / ih, 1);
      scaleRef.current = displayScale;

      const cw = Math.round(iw * displayScale);
      const ch = Math.round(ih * displayScale);

      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = cw;
      canvas.height = ch;

      cropRef.current = {
        x: Math.round(cw * 0.1),
        y: Math.round(ch * 0.1),
        w: Math.round(cw * 0.8),
        h: Math.round(ch * 0.8),
      };

      draw();
    };
    img.src = imageDataUrl;
  }, [imageDataUrl, draw]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const handle = getHandle(mx, my, cropRef.current);
    const crop = cropRef.current;

    dragRef.current = {
      mode: handle === 'new' ? 'se' : handle,
      startX: mx,
      startY: my,
      startCrop: { ...crop },
    };

    if (handle === 'new') {
      cropRef.current = { x: mx, y: my, w: 0, h: 0 };
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cw = canvas.width;
      const ch = canvas.height;
      const drag = dragRef.current;

      if (!drag.mode) {
        const h = getHandle(e.clientX - rect.left, e.clientY - rect.top, cropRef.current);
        canvas.style.cursor = CURSOR_MAP[h] ?? 'crosshair';
        return;
      }

      const mx = Math.max(0, Math.min(cw, e.clientX - rect.left));
      const my = Math.max(0, Math.min(ch, e.clientY - rect.top));
      const dx = mx - drag.startX;
      const dy = my - drag.startY;
      const sc = drag.startCrop;
      const crop = cropRef.current;

      if (drag.mode === 'move') {
        crop.x = Math.max(0, Math.min(cw - sc.w, sc.x + dx));
        crop.y = Math.max(0, Math.min(ch - sc.h, sc.y + dy));
      } else if (drag.mode === 'se') {
        crop.w = Math.max(10, mx - crop.x);
        crop.h = Math.max(10, my - crop.y);
      } else if (drag.mode === 'nw') {
        crop.x = Math.min(sc.x + sc.w - 10, sc.x + dx);
        crop.y = Math.min(sc.y + sc.h - 10, sc.y + dy);
        crop.w = sc.w - (crop.x - sc.x);
        crop.h = sc.h - (crop.y - sc.y);
      } else if (drag.mode === 'ne') {
        crop.y = Math.min(sc.y + sc.h - 10, sc.y + dy);
        crop.w = Math.max(10, sc.w + dx);
        crop.h = sc.h - (crop.y - sc.y);
      } else if (drag.mode === 'sw') {
        crop.x = Math.min(sc.x + sc.w - 10, sc.x + dx);
        crop.w = sc.w - (crop.x - sc.x);
        crop.h = Math.max(10, sc.h + dy);
      }

      draw();
    };

    const handleMouseUp = () => {
      dragRef.current.mode = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draw]);

  const handleApply = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const crop = cropRef.current;
    const displayScale = scaleRef.current;

    const sx = Math.round(crop.x / displayScale);
    const sy = Math.round(crop.y / displayScale);
    let sw = Math.round(crop.w / displayScale);
    let sh = Math.round(crop.h / displayScale);
    sw = Math.min(sw, img.naturalWidth - sx);
    sh = Math.min(sh, img.naturalHeight - sy);

    const outCanvas = document.createElement('canvas');
    outCanvas.width = sw;
    outCanvas.height = sh;
    const outCtx = outCanvas.getContext('2d');
    if (!outCtx) return;
    outCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    onApply(outCanvas.toDataURL('image/png'));
  }, [onApply]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <div className="text-white text-base font-semibold mb-3">Crop Screenshot</div>
      <canvas
        ref={canvasRef}
        className="border border-white/30"
        style={{ cursor: 'crosshair' }}
        onMouseDown={handleMouseDown}
      />
      <div className="flex gap-2 mt-3">
        <button
          className="px-6 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent-hover"
          onClick={handleApply}
        >
          Apply Crop
        </button>
        <button
          className="px-6 py-2 text-sm bg-surface-2 text-text-dim border border-border rounded-md hover:text-text"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
