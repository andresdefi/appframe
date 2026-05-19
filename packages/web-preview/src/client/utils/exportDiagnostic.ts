/**
 * Capture a structured diagnostic blob when an export / capture fails.
 * The user copies the JSON to clipboard via a button in the Export tab,
 * pastes it into a bug report / issue / chat — and we get everything
 * needed to reproduce without a round-trip of "what platform / size /
 * variant were you on?"
 *
 * Local-only by design: pulls from the live store and from
 * navigator.userAgent. Nothing leaves the user's machine until they
 * explicitly paste the JSON somewhere.
 */

import type { PreviewStore } from '../store';
import type { ScreenState, PanoramicElement, PanoramicBackground, PanoramicEffects } from '../types';
import { selectScreensForLocale } from '../store';
import { getRecentActions } from './recentActions';
import { getRecentLogs } from './consoleCapture';

export interface ExportDiagnosticContext {
  kind:
    | 'export-all-screens'
    | 'export-current-screen'
    | 'export-panoramic-all-frames'
    | 'export-panoramic-current-frame';
  // Per-screen index when the failure happened mid-loop, otherwise undefined.
  failingScreenIndex?: number;
  // The locale that was actively rendering when the failure landed.
  failingLocale?: string;
  // Output size key (e.g. 'ios-6.9') and resolved dimensions.
  sizeKey?: string;
  sizeWidth?: number;
  sizeHeight?: number;
}

export interface ExportDiagnostic {
  // Bumped when the shape changes meaningfully so downstream tooling
  // (if any) can read old reports without crashing.
  schemaVersion: 2;
  capturedAt: string;
  error: { message: string; name: string; stack?: string };
  context: ExportDiagnosticContext;
  app: { commit?: string };
  browser: { userAgent: string };
  project: {
    slug: string;
    displayName: string;
    isPanoramic: boolean;
    platform: string;
    activeLocale: string;
    screensCount: number;
    variantsCount: number;
    localesCount: number;
    activeVariant: { id: string; name: string; status: string } | null;
  };
  // The exact input that triggered the failure. For individual mode
  // this is the single ScreenState at the failing locale + index.
  // For panoramic it's the whole canvas (background + elements +
  // effects + frame count). Lets us replay the exact case without
  // asking the user for their project file.
  failingInput:
    | { mode: 'individual'; screen: ScreenState | null }
    | {
        mode: 'panoramic';
        frameCount: number;
        background: PanoramicBackground;
        elements: PanoramicElement[];
        effects: PanoramicEffects;
      }
    | null;
  // Lead-up: short ring buffer of recent significant store changes,
  // newest last. Pulled from utils/recentActions.
  recentActions: { t: string; label: string }[];
  // Console messages captured in the same browser tab, newest last.
  // Includes warnings from background pipelines (autosave failures,
  // capture queue noise, etc) that often explain why a foreground
  // failure happened.
  recentLogs: { t: string; level: 'log' | 'info' | 'warn' | 'error'; message: string }[];
}

// Vite injects this from the env at build time. See vite.config.ts.
// Best-effort: if the build script doesn't populate it the diagnostic
// still has every other field.
declare const __APPFRAME_COMMIT__: string | undefined;

function readDefine(name: string): string | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const v = (globalThis as any)[name];
    return typeof v === 'string' && v.length > 0 ? v : undefined;
  } catch {
    return undefined;
  }
}

function getCommit(): string | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return typeof __APPFRAME_COMMIT__ !== 'undefined' ? (__APPFRAME_COMMIT__ as any) : readDefine('__APPFRAME_COMMIT__');
  } catch {
    return readDefine('__APPFRAME_COMMIT__');
  }
}

export function buildExportDiagnostic(
  err: unknown,
  state: Pick<
    PreviewStore,
    | 'activeProject'
    | 'activeProjectDisplayName'
    | 'isPanoramic'
    | 'platform'
    | 'locale'
    | 'screens'
    | 'variants'
    | 'activeVariantId'
    | 'sessionLocales'
    | 'localeScreens'
    | 'localePanoramicElements'
    | 'panoramicFrameCount'
    | 'panoramicBackground'
    | 'panoramicElements'
    | 'panoramicEffects'
  >,
  context: ExportDiagnosticContext,
): ExportDiagnostic {
  const errorObj =
    err instanceof Error
      ? err
      : new Error(typeof err === 'string' ? err : 'Unknown error');
  const activeVariant = state.activeVariantId
    ? state.variants.find((v) => v.id === state.activeVariantId)
    : null;
  // Locale count: default + added locales in whichever mode is active.
  // Mirrors how the editor surfaces them so the number matches the UI.
  const localesCount = state.isPanoramic
    ? 1 + Object.keys(state.localePanoramicElements ?? {}).length
    : 1 + Object.keys(state.localeScreens ?? {}).length;

  // Failing input — the actual content the rasterizer choked on.
  // Individual: the specific ScreenState at the failing locale/index.
  // Panoramic: the whole canvas snapshot (it's not per-screen there).
  let failingInput: ExportDiagnostic['failingInput'] = null;
  if (state.isPanoramic) {
    failingInput = {
      mode: 'panoramic',
      frameCount: state.panoramicFrameCount,
      background: state.panoramicBackground,
      elements: state.panoramicElements,
      effects: state.panoramicEffects,
    };
  } else if (
    typeof context.failingScreenIndex === 'number' &&
    typeof context.failingLocale === 'string'
  ) {
    const localeScreens = selectScreensForLocale(state, context.failingLocale);
    failingInput = {
      mode: 'individual',
      screen: localeScreens[context.failingScreenIndex] ?? null,
    };
  }

  return {
    schemaVersion: 2,
    capturedAt: new Date().toISOString(),
    error: {
      message: errorObj.message,
      name: errorObj.name,
      ...(errorObj.stack ? { stack: errorObj.stack } : {}),
    },
    context,
    app: {
      ...(getCommit() ? { commit: getCommit()! } : {}),
    },
    browser: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    },
    project: {
      slug: state.activeProject,
      displayName: state.activeProjectDisplayName,
      isPanoramic: state.isPanoramic,
      platform: state.platform,
      activeLocale: state.locale,
      screensCount: state.screens.length,
      variantsCount: state.variants.length,
      localesCount,
      activeVariant: activeVariant
        ? { id: activeVariant.id, name: activeVariant.name, status: activeVariant.status }
        : null,
    },
    failingInput,
    recentActions: getRecentActions(),
    recentLogs: getRecentLogs(),
  };
}

export function formatDiagnostic(diag: ExportDiagnostic): string {
  return JSON.stringify(diag, null, 2);
}

/** Write a diagnostic to the clipboard. Falls back to a returned blob
 * URL the caller can offer as a download if the clipboard API is
 * unavailable (older browsers, insecure contexts). */
export async function copyDiagnosticToClipboard(diag: ExportDiagnostic): Promise<void> {
  const text = formatDiagnostic(diag);
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback: copy via a temporary textarea + execCommand. Older path,
  // works in non-secure contexts (Safari < 13.1, some embeddings).
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.top = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(ta);
  }
}
