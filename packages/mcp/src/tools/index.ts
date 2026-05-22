import type { ToolDefinition } from './types.js';
import { annotationTools } from './annotation.js';
import { assetTools } from './asset.js';
import { calloutTools } from './callout.js';
import { discoveryTools } from './discovery.js';
import { localeTools } from './locale.js';
import { overlayTools } from './overlay.js';
import { projectTools } from './project.js';
import { screenLifecycleTools } from './screen-lifecycle.js';
import { screenTools } from './screen.js';
import { variantTools } from './variant.js';

// Order is purely cosmetic for tools/list responses. Group by domain so
// MCP clients that surface the catalog see a logical ordering.
export const ALL_TOOLS: ToolDefinition[] = [
  ...discoveryTools,
  ...projectTools,
  ...localeTools,
  ...variantTools,
  ...screenTools,
  ...screenLifecycleTools,
  ...calloutTools,
  ...annotationTools,
  ...overlayTools,
  ...assetTools,
];

export type { ContentResult, ToolDefinition, ToolHandler, ToolHandlerContext } from './types.js';
