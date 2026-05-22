// Sanity tests that catch drift between MCP code and the Zod schemas in
// @appframe/core. If a field gets renamed in core, the MCP would
// silently keep writing the old name and the data would land
// nowhere — the browser hydrate would ignore unknown keys. These tests
// surface that immediately.

import { describe, it, expect } from 'vitest';
import { appframeConfigSchema } from '@appframe/core';

// Unwrap ZodOptional / ZodDefault layers to get to the underlying
// ZodObject so we can read its `.shape`.
function unwrap(schema: unknown): { shape: Record<string, unknown> } | null {
  let cur = schema as { _def?: { innerType?: unknown }; shape?: Record<string, unknown> };
  while (cur && cur._def && cur._def.innerType && !cur.shape) {
    cur = cur._def.innerType as typeof cur;
  }
  return cur && cur.shape ? (cur as { shape: Record<string, unknown> }) : null;
}

const screenSchema = unwrap(
  // appframeConfigSchema.shape.screens is ZodDefault → ZodArray → screen element
  (appframeConfigSchema.shape.screens as { _def: { innerType: { element: unknown } } })
    ._def.innerType.element,
);

describe('schema drift: editor-state field names referenced by MCP code', () => {
  it('screen schema introspection works', () => {
    expect(screenSchema).not.toBeNull();
    expect(Object.keys(screenSchema!.shape).length).toBeGreaterThan(20);
  });

  // Field names the MCP handlers write directly in patches / defaults
  // that ALSO exist in the slim AppframeConfig screen schema (the part
  // we can introspect here). If any of these vanish, the MCP code is
  // shouting into the void for the AppframeConfig consumers.
  //
  // Editor-state-only fields (spotlightEnabled, loupeEnabled,
  // headlineGradient at screen level, subtitleGradient at screen level,
  // textPositions, headlineShadow / subtitleShadow / freeTextShadow,
  // frameId, deviceColor, deviceScale/Top/Angle/Tilt/Rotation/OffsetX,
  // screenshotUrl, screenshotName) live in the rich envelope's
  // ScreenState shape but aren't on the slim AppframeConfig screen
  // schema. Theme-level gradients (theme.headlineGradient) are checked
  // separately below.
  const REFERENCED_SCREEN_FIELDS = [
    'headline', 'subtitle',
    'layout', 'composition',
    'device',
    'background',
    'spotlight', 'loupe', 'borderSimulation', 'deviceShadow',
    'callouts', 'annotations', 'overlays',
    'backgroundType', 'backgroundColor', 'backgroundGradient',
    'backgroundImage', 'backgroundImageFit',
    'backgroundImagePositionX', 'backgroundImagePositionY', 'backgroundImageScale',
    'backgroundOverlay',
    'cornerRadius',
    'headlineFont', 'headlineFontWeight',
    'subtitleFont', 'subtitleFontWeight',
    'freeText', 'freeTextEnabled', 'freeTextSize', 'freeTextFont', 'freeTextFontWeight',
  ];

  for (const field of REFERENCED_SCREEN_FIELDS) {
    it(`screen schema still has \`${field}\``, () => {
      expect(field in screenSchema!.shape).toBe(true);
    });
  }

  // Inner shape of spotlight — defaults the MCP applies must match.
  it('spotlight inner shape covers MCP defaults', () => {
    const spot = unwrap((screenSchema!.shape.spotlight as { _def: { innerType: unknown } })._def.innerType);
    expect(spot).not.toBeNull();
    const expected = ['x', 'y', 'w', 'h', 'shape', 'dimOpacity', 'blur', 'borderRadius'];
    for (const k of expected) {
      expect(k in spot!.shape).toBe(true);
    }
  });

  it('loupe inner shape covers MCP defaults', () => {
    const loupe = unwrap((screenSchema!.shape.loupe as { _def: { innerType: unknown } })._def.innerType);
    expect(loupe).not.toBeNull();
    const expected = [
      'sourceX', 'sourceY', 'displayX', 'displayY',
      'width', 'height', 'zoom',
      'cornerRadius', 'borderWidth', 'borderColor',
      'shadow', 'shadowColor', 'shadowRadius', 'shadowOffsetX', 'shadowOffsetY',
      'xOffset', 'yOffset',
    ];
    for (const k of expected) {
      expect(k in loupe!.shape).toBe(true);
    }
  });

  it('borderSimulation inner shape covers MCP defaults', () => {
    const bs = unwrap((screenSchema!.shape.borderSimulation as { _def: { innerType: unknown } })._def.innerType);
    expect(bs).not.toBeNull();
    expect('enabled' in bs!.shape).toBe(true);
    expect('thickness' in bs!.shape).toBe(true);
    expect('color' in bs!.shape).toBe(true);
    expect('radius' in bs!.shape).toBe(true);
  });

  it('theme schema still carries headlineGradient and subtitleGradient', () => {
    // Per-screen gradients live in editor-state ScreenState (rich
    // envelope) but the slim AppframeConfig stores them on the theme.
    // The browser's editorState.ts derives theme.headlineGradient from
    // screen 0's value; the MCP writes `headlineGradient` at the screen
    // level inside the rich envelope. Both paths need to keep working.
    const theme = unwrap(appframeConfigSchema.shape.theme);
    expect(theme).not.toBeNull();
    expect('headlineGradient' in theme!.shape).toBe(true);
    expect('subtitleGradient' in theme!.shape).toBe(true);
  });

  it('deviceShadow inner shape covers MCP defaults', () => {
    const ds = unwrap((screenSchema!.shape.deviceShadow as { _def: { innerType: unknown } })._def.innerType);
    expect(ds).not.toBeNull();
    expect('opacity' in ds!.shape).toBe(true);
    expect('blur' in ds!.shape).toBe(true);
    expect('color' in ds!.shape).toBe(true);
    expect('offsetY' in ds!.shape).toBe(true);
  });
});
