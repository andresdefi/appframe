// HTML injection functions for overlay features (spotlight, annotations, zoom callouts).
// Called after templateEngine.render() to inject <style> before </head> and overlay <div>s before </body>.

export interface SpotlightParams {
  x: number;
  y: number;
  w: number;
  h: number;
  shape: 'circle' | 'rectangle';
  dimOpacity: number;
  blur: number;
}

export interface AnnotationParams {
  id: string;
  shape: string;
  x: number;
  y: number;
  w: number;
  h: number;
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
}

export function injectSpotlightHTML(html: string, spotlight: SpotlightParams): string {
  const { x, y, w, h, shape, dimOpacity, blur } = spotlight;

  // SVG mask approach: white background (dimmed) + black cutout (clear)
  const cutout = shape === 'circle'
    ? `<ellipse cx="${x}%" cy="${y}%" rx="${w / 2}%" ry="${h / 2}%" fill="black"/>`
    : `<rect x="${x - w / 2}%" y="${y - h / 2}%" width="${w}%" height="${h}%" fill="black"/>`;

  const blurFilter = blur > 0
    ? `<defs><filter id="spotlight-blur"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>`
    : '';
  const filterAttr = blur > 0 ? ' filter="url(#spotlight-blur)"' : '';

  const style = `<style>
.spotlight-overlay { position: absolute; inset: 0; z-index: 5; pointer-events: none; }
.spotlight-overlay svg { width: 100%; height: 100%; display: block; }
</style>`;

  const overlay = `<div class="spotlight-overlay">
<svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
${blurFilter}
<mask id="spotlight-mask">
<rect x="0" y="0" width="100" height="100" fill="white"/>
${cutout}
</mask>
<rect x="0" y="0" width="100" height="100" fill="rgba(0,0,0,${dimOpacity})" mask="url(#spotlight-mask)"${filterAttr}/>
</svg>
</div>`;

  html = html.replace('</head>', `${style}\n</head>`);
  html = html.replace('</body>', `${overlay}\n</body>`);
  return html;
}

export interface OverlayParams {
  type: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  shapeType?: string;
  shapeColor?: string;
  shapeOpacity?: number;
  shapeBlur?: number;
}

export function injectOverlaysHTML(html: string, overlays: OverlayParams[], canvasWidth: number, canvasHeight: number): string {
  if (overlays.length === 0) return html;

  const style = `<style>
.overlay-item { position: absolute; z-index: 10; pointer-events: none; }
</style>`;

  const items = overlays.map((ov) => {
    const ovX = Math.round(canvasWidth * ov.x / 100);
    const ovY = Math.round(canvasHeight * ov.y / 100);
    const ovSize = Math.round(canvasWidth * ov.size / 100);

    let inner = '';
    if (ov.type === 'shape') {
      const color = ov.shapeColor ?? '#6366f1';
      const shapeOpacity = ov.shapeOpacity ?? 0.5;
      const blur = ov.shapeBlur ? `filter: blur(${ov.shapeBlur}px);` : '';
      if (ov.shapeType === 'circle') {
        inner = `<div style="width:100%;height:100%;border-radius:50%;background:${color};opacity:${shapeOpacity};${blur}"></div>`;
      } else if (ov.shapeType === 'rectangle') {
        inner = `<div style="width:100%;height:100%;border-radius:8px;background:${color};opacity:${shapeOpacity};${blur}"></div>`;
      } else if (ov.shapeType === 'line') {
        inner = `<div style="width:100%;height:4px;margin-top:${Math.round(ovSize / 2 - 2)}px;background:${color};opacity:${shapeOpacity};border-radius:2px;"></div>`;
      }
    } else if (ov.type === 'star-rating') {
      const color = ov.shapeColor ?? '#f59e0b';
      const stars = Array.from({ length: 5 }, (_, i) =>
        `<polygon points="${i * 24 + 12},2 ${i * 24 + 15},9 ${i * 24 + 22},9 ${i * 24 + 16},14 ${i * 24 + 18},22 ${i * 24 + 12},17 ${i * 24 + 6},22 ${i * 24 + 8},14 ${i * 24 + 2},9 ${i * 24 + 9},9"/>`
      ).join('');
      inner = `<svg viewBox="0 0 120 24" fill="${color}" style="width:100%;height:auto;">${stars}</svg>`;
    }

    return `<div class="overlay-item" style="left:${ovX}px;top:${ovY}px;width:${ovSize}px;height:${ovSize}px;transform:rotate(${ov.rotation}deg);opacity:${ov.opacity};">${inner}</div>`;
  }).join('\n');

  const overlay = `<div style="position:absolute;inset:0;z-index:10;pointer-events:none;">${items}</div>`;

  html = html.replace('</head>', `${style}\n</head>`);
  html = html.replace('</body>', `${overlay}\n</body>`);
  return html;
}

export function injectAnnotationsHTML(html: string, annotations: AnnotationParams[], canvasWidth: number): string {
  if (annotations.length === 0) return html;

  const scale = canvasWidth / 1290;
  const roundedRadius = Math.round(canvasWidth * 0.02);

  const style = `<style>
.annotation-overlay { position: absolute; inset: 0; z-index: 6; pointer-events: none; }
.annotation-shape { position: absolute; box-sizing: border-box; }
</style>`;

  const shapes = annotations.map((a) => {
    const sw = Math.round(a.strokeWidth * scale);
    let borderRadius = '0';
    if (a.shape === 'circle') borderRadius = '50%';
    else if (a.shape === 'rounded-rect') borderRadius = `${roundedRadius}px`;

    const fill = a.fillColor ? `background: ${a.fillColor};` : '';

    return `<div class="annotation-shape" style="
      left: ${a.x}%; top: ${a.y}%;
      width: ${a.w}%; height: ${a.h}%;
      border: ${sw}px solid ${a.strokeColor};
      border-radius: ${borderRadius};
      ${fill}
    "></div>`;
  }).join('\n');

  const overlay = `<div class="annotation-overlay">${shapes}</div>`;

  html = html.replace('</head>', `${style}\n</head>`);
  html = html.replace('</body>', `${overlay}\n</body>`);
  return html;
}
