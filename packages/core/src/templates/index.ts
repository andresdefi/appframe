export { TemplateEngine } from './engine.js';
export type {
  TemplateContext,
  TemplateRenderOptions,
  RenderOptions,
  FontFaceMode,
  DeviceContext,
  PanoramicTemplateContext,
  PanoramicRenderedBackgroundLayer,
  PanoramicRenderedElement,
} from './engine.js';
export { injectSpotlightHTML, injectAnnotationsHTML, injectOverlaysHTML, injectEffectsHTML } from './injectors.js';
export type { SpotlightParams, AnnotationParams, OverlayParams } from './injectors.js';
