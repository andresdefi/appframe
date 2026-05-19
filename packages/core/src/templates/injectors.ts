// HTML injection functions for overlay features (spotlight, annotations, zoom callouts).
// Called after templateEngine.render() to inject <style> before </head> and overlay <div>s before </body>.
//
// Each effect is built as a pair of strings (style + body) via build*Pieces helpers
// so the per-effect inject*HTML functions and the batched injectEffectsHTML can
// share the same generators. The batched form does a single </head> + </body>
// replace pass — important when all three effects are active on the same render.

export interface SpotlightParams {
  x: number;
  y: number;
  w: number;
  h: number;
  shape: 'circle' | 'rectangle';
  dimOpacity: number;
  blur: number;
  /** Corner radius (px) for the rectangle shape. Ignored when shape is circle. */
  borderRadius?: number;
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
  /** Corner radius in pixels for the rectangle shape. Ignored when shape
   *  is 'circle'. Legacy `shape: 'rounded-rect'` is treated as
   *  `shape: 'rectangle'` with a sensible default when this is missing
   *  or 0. */
  borderRadius?: number;
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

interface EffectPieces {
  style: string;
  body: string;
}

function buildSpotlightPieces(spotlight: SpotlightParams): EffectPieces {
  const { x, y, w, h, shape, dimOpacity, blur, borderRadius } = spotlight;

  // Box-shadow cutout approach: a transparent rectangle (or circle, via
  // border-radius: 50%) positioned where the spotlight should land, with a
  // huge box-shadow spread painting the dim everywhere outside it. No SVG,
  // no <mask>, no url(#id) references — which means it survives
  // foreignObject serialization in client-side rasterizers (html-to-image,
  // modern-screenshot, dom-to-image-more). The blur parameter of box-shadow
  // provides the soft-edge effect that the previous feGaussianBlur did.
  //
  // The container clips the shadow to canvas bounds; otherwise the 9999px
  // spread would paint off-screen on browsers where overflow happens to be
  // visible. .spotlight-overlay matches the canvas extent exactly.
  const left = x - w / 2;
  const top = y - h / 2;
  const radius =
    shape === 'circle'
      ? '50%'
      : `${borderRadius && borderRadius > 0 ? borderRadius : 0}px`;

  const style = `<style>
.spotlight-overlay { position: absolute; inset: 0; z-index: 5; pointer-events: none; overflow: hidden; }
.spotlight-cutout {
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${w}%;
  height: ${h}%;
  border-radius: ${radius};
  box-shadow: 0 0 ${blur > 0 ? blur : 0}px 9999px rgba(0,0,0,${dimOpacity});
  /* Pickable: the editor's drag overlay hit-tests this rect to start a
     drag. The wrapper stays pointer-events:none so dim regions don't
     intercept clicks on the rest of the canvas. */
  pointer-events: auto;
}
</style>`;

  const body = `<div class="spotlight-overlay"><div class="spotlight-cutout"></div></div>`;
  return { style, body };
}

function buildAnnotationsPieces(annotations: AnnotationParams[], canvasWidth: number): EffectPieces {
  const scale = canvasWidth / 1290;
  const roundedRadius = Math.round(canvasWidth * 0.02);

  const style = `<style>
.annotation-overlay { position: absolute; inset: 0; z-index: 6; pointer-events: none; }
.annotation-shape { position: absolute; box-sizing: border-box; pointer-events: auto; cursor: move; }
</style>`;

  const shapes = annotations.map((a, idx) => {
    const sw = Math.round(a.strokeWidth * scale);
    let borderRadius = '0';
    if (a.shape === 'circle') {
      borderRadius = '50%';
    } else if (a.shape === 'rounded-rect') {
      // Legacy alias: explicit borderRadius wins, otherwise fall back to
      // the historical roundedRadius constant so existing projects keep
      // looking the same until they're re-saved.
      const px = a.borderRadius && a.borderRadius > 0 ? a.borderRadius : roundedRadius;
      borderRadius = `${px}px`;
    } else if (a.borderRadius && a.borderRadius > 0) {
      borderRadius = `${a.borderRadius}px`;
    }

    const fill = a.fillColor ? `background: ${a.fillColor};` : '';

    // x / y are the CENTER coordinates (consistent with spotlight). Render
    // with left = x - w/2, top = y - h/2 so the visual center stays put
    // when the user resizes via the Width / Height sliders.
    const left = a.x - a.w / 2;
    const top = a.y - a.h / 2;
    return `<div class="annotation-shape" data-idx="${idx}" style="
      left: ${left}%; top: ${top}%;
      width: ${a.w}%; height: ${a.h}%;
      border: ${sw}px solid ${a.strokeColor};
      border-radius: ${borderRadius};
      ${fill}
    "></div>`;
  }).join('\n');

  const body = `<div class="annotation-overlay">${shapes}</div>`;
  return { style, body };
}

function buildOverlaysPieces(overlays: OverlayParams[], canvasWidth: number, canvasHeight: number): EffectPieces {
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

  const body = `<div style="position:absolute;inset:0;z-index:10;pointer-events:none;">${items}</div>`;
  return { style, body };
}

/**
 * Inject one or more effects in a single pass. With all three active this
 * runs one `</head>` replace and one `</body>` replace, instead of six
 * (two per effect when the per-effect injectors are called in sequence).
 */
export function injectEffectsHTML(
  html: string,
  effects: {
    spotlight?: SpotlightParams;
    annotations?: AnnotationParams[];
    overlays?: OverlayParams[];
  },
  canvasWidth: number,
  canvasHeight: number,
): string {
  const styles: string[] = [];
  const bodies: string[] = [];

  if (effects.spotlight) {
    const p = buildSpotlightPieces(effects.spotlight);
    styles.push(p.style);
    bodies.push(p.body);
  }
  if (effects.annotations && effects.annotations.length > 0) {
    const p = buildAnnotationsPieces(effects.annotations, canvasWidth);
    styles.push(p.style);
    bodies.push(p.body);
  }
  if (effects.overlays && effects.overlays.length > 0) {
    const p = buildOverlaysPieces(effects.overlays, canvasWidth, canvasHeight);
    styles.push(p.style);
    bodies.push(p.body);
  }

  if (styles.length === 0 && bodies.length === 0) return html;

  return html
    .replace('</head>', `${styles.join('\n')}\n</head>`)
    .replace('</body>', `${bodies.join('\n')}\n</body>`);
}

// Per-effect API kept for callers that have only one effect — same
// behavior as before, share the same builders.

export function injectSpotlightHTML(html: string, spotlight: SpotlightParams): string {
  const { style, body } = buildSpotlightPieces(spotlight);
  return html
    .replace('</head>', `${style}\n</head>`)
    .replace('</body>', `${body}\n</body>`);
}

export function injectOverlaysHTML(html: string, overlays: OverlayParams[], canvasWidth: number, canvasHeight: number): string {
  if (overlays.length === 0) return html;
  const { style, body } = buildOverlaysPieces(overlays, canvasWidth, canvasHeight);
  return html
    .replace('</head>', `${style}\n</head>`)
    .replace('</body>', `${body}\n</body>`);
}

export function injectAnnotationsHTML(html: string, annotations: AnnotationParams[], canvasWidth: number): string {
  if (annotations.length === 0) return html;
  const { style, body } = buildAnnotationsPieces(annotations, canvasWidth);
  return html
    .replace('</head>', `${style}\n</head>`)
    .replace('</body>', `${body}\n</body>`);
}
