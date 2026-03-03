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

export interface ZoomCalloutParams {
  id: string;
  sourceX: number;
  sourceY: number;
  sourceW: number;
  sourceH: number;
  targetX: number;
  targetY: number;
  magnification: number;
  connectorStyle: string;
  borderColor: string;
  borderWidth: number;
  shadow: boolean;
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

export function injectZoomCalloutsHTML(
  html: string,
  callouts: ZoomCalloutParams[],
  screenshotDataUrl: string,
  canvasWidth: number,
): string {
  if (callouts.length === 0) return html;

  const scale = canvasWidth / 1290;

  const style = `<style>
.zoom-overlay { position: absolute; inset: 0; z-index: 7; pointer-events: none; }
.zoom-source { position: absolute; box-sizing: border-box; border: 2px dashed rgba(255,255,255,0.6); }
.zoom-target { position: absolute; overflow: hidden; border-radius: ${Math.round(8 * scale)}px; }
.zoom-target-inner { position: absolute; inset: 0; background-size: 100% 100%; background-repeat: no-repeat; }
.zoom-connector { position: absolute; inset: 0; }
.zoom-connector line { stroke-width: ${Math.max(1, Math.round(1.5 * scale))}; }
</style>`;

  const elements = callouts.map((c) => {
    const bw = Math.round(c.borderWidth * scale);
    const shadowCss = c.shadow ? `box-shadow: 0 ${Math.round(4 * scale)}px ${Math.round(16 * scale)}px rgba(0,0,0,0.4);` : '';

    // Source region indicator
    const source = `<div class="zoom-source" style="
      left: ${c.sourceX}%; top: ${c.sourceY}%;
      width: ${c.sourceW}%; height: ${c.sourceH}%;
    "></div>`;

    // Magnified view: use background-position/size to show source region magnified
    const mag = c.magnification;
    // Background size = 100% * mag (to magnify)
    const bgSizeW = mag * 100;
    const bgSizeH = mag * 100;
    // Background position: offset to center the source region
    // sourceX% of canvas maps to sourceX% of the target inner's bg-position, but magnified
    const bgPosX = -(c.sourceX * mag - 50);
    const bgPosY = -(c.sourceY * mag - 50);

    // Target size = source size * magnification (clamped to reasonable max)
    const targetW = c.sourceW * mag;
    const targetH = c.sourceH * mag;

    const target = `<div class="zoom-target" style="
      left: ${c.targetX}%; top: ${c.targetY}%;
      width: ${targetW}%; height: ${targetH}%;
      border: ${bw}px solid ${c.borderColor};
      ${shadowCss}
    "><div class="zoom-target-inner" style="
      background-image: url('${screenshotDataUrl}');
      background-size: ${bgSizeW}% ${bgSizeH}%;
      background-position: ${bgPosX}% ${bgPosY}%;
    "></div></div>`;

    // Connector line (SVG)
    const srcCX = c.sourceX + c.sourceW / 2;
    const srcCY = c.sourceY + c.sourceH / 2;
    const tgtCX = c.targetX + targetW / 2;
    const tgtCY = c.targetY + targetH / 2;

    let connector = '';
    if (c.connectorStyle === 'line') {
      connector = `<svg class="zoom-connector" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="${srcCX}" y1="${srcCY}" x2="${tgtCX}" y2="${tgtCY}" stroke="${c.borderColor}" stroke-opacity="0.6"/>
      </svg>`;
    } else if (c.connectorStyle === 'elbow') {
      const midX = tgtCX;
      connector = `<svg class="zoom-connector" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="${srcCX},${srcCY} ${midX},${srcCY} ${midX},${tgtCY}" fill="none" stroke="${c.borderColor}" stroke-opacity="0.6" stroke-width="${Math.max(1, Math.round(1.5 * scale))}"/>
      </svg>`;
    }

    return source + target + connector;
  }).join('\n');

  const overlay = `<div class="zoom-overlay">${elements}</div>`;

  html = html.replace('</head>', `${style}\n</head>`);
  html = html.replace('</body>', `${overlay}\n</body>`);
  return html;
}
