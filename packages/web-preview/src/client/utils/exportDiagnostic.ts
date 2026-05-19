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
  schemaVersion: 1;
  capturedAt: string;
  error: { message: string; name: string; stack?: string };
  context: ExportDiagnosticContext;
  app: { commit?: string; buildAt?: string };
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
}

// Vite injects these from the env at build time. See vite.config.ts.
// They're best-effort: if the build script doesn't populate them the
// diagnostic still has every other field.
declare const __APPFRAME_COMMIT__: string | undefined;
declare const __APPFRAME_BUILD_AT__: string | undefined;

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

function getBuildAt(): string | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return typeof __APPFRAME_BUILD_AT__ !== 'undefined' ? (__APPFRAME_BUILD_AT__ as any) : readDefine('__APPFRAME_BUILD_AT__');
  } catch {
    return readDefine('__APPFRAME_BUILD_AT__');
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

  return {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    error: {
      message: errorObj.message,
      name: errorObj.name,
      ...(errorObj.stack ? { stack: errorObj.stack } : {}),
    },
    context,
    app: {
      ...(getCommit() ? { commit: getCommit()! } : {}),
      ...(getBuildAt() ? { buildAt: getBuildAt()! } : {}),
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
