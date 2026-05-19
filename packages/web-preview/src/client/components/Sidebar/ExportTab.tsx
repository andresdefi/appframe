import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePreviewStore } from '../../store';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { Checkbox } from '../Controls/Checkbox';
import { reloadProject } from '../../utils/api';
import { buildExportBody } from '../../utils/previewBody';
import { getDefaultExportSizeKey } from '../../utils/platformSelection';
import { exportScreenClientSide, exportPanoramicSlicesClientSide } from '../../utils/clientExport';
import { bundleAsZip, type ZipEntry } from '../../utils/zipExport';
import { composeExportSlug } from '../../utils/exportSlug';
import { getLocaleLabel } from '@appframe/core/locales';

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 bg-surface-2 surface-card text-text text-xs font-medium pl-3 pr-4 py-2 rounded-full animate-in fade-in slide-in-from-top-2"
    >
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-500/20 text-green-400 shrink-0" aria-hidden="true">
        <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none">
          <path d="M2.5 6.5l2.5 2.5L9.5 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {message}
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  requestAnimationFrame(() => {
    a.click();
  });
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 60_000);
}


export function ExportTab() {
  const platform = usePreviewStore((s) => s.platform);
  const sizes = usePreviewStore((s) => s.sizes);
  const exportSize = usePreviewStore((s) => s.exportSize);
  const setExportSize = usePreviewStore((s) => s.setExportSize);
  const locale = usePreviewStore((s) => s.locale);
  const sessionLocales = usePreviewStore((s) => s.sessionLocales);
  const localeScreensMap = usePreviewStore((s) => s.localeScreens);
  const localePanoramicMap = usePreviewStore((s) => s.localePanoramicElements);
  const config = usePreviewStore((s) => s.config);
  const variants = usePreviewStore((s) => s.variants);
  const activeVariantId = usePreviewStore((s) => s.activeVariantId);
  const recordVariantArtifact = usePreviewStore((s) => s.recordVariantArtifact);
  const initScreens = usePreviewStore((s) => s.initScreens);
  const triggerRender = usePreviewStore((s) => s.triggerRender);
  const screens = usePreviewStore((s) => s.screens);
  const selectedScreen = usePreviewStore((s) => s.selectedScreen);
  // Panoramic state
  const isPanoramic = usePreviewStore((s) => s.isPanoramic);
  const panoramicFrameCount = usePreviewStore((s) => s.panoramicFrameCount);
  const panoramicBackground = usePreviewStore((s) => s.panoramicBackground);
  const panoramicElements = usePreviewStore((s) => s.panoramicElements);
  const panoramicEffects = usePreviewStore((s) => s.panoramicEffects);
  const previewW = usePreviewStore((s) => s.previewW);
  const previewH = usePreviewStore((s) => s.previewH);

  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  // List of locales available for export in the current mode. Default is
  // always first; added locales follow in insertion order. Snapshot
  // model: `localeScreens` carries Individual data, `localePanoramicElements`
  // carries Panoramic data — each mode has its own list.
  const availableLocales = useMemo<string[]>(
    () =>
      isPanoramic
        ? ['default', ...Object.keys(localePanoramicMap)]
        : ['default', ...Object.keys(localeScreensMap)],
    [isPanoramic, localeScreensMap, localePanoramicMap],
  );

  // Selected-for-export set, keyed by locale code. Defaults to every
  // available locale checked; resyncs when locales are added/removed
  // (rare while the Download tab is open). User toggles persist within
  // the tab session; resetting back to "all on" when the locale list
  // changes is acceptable since edits to the list happen in the
  // Locales tab, not here.
  const [selectedLocales, setSelectedLocales] = useState<Set<string>>(
    () => new Set(availableLocales),
  );
  useEffect(() => {
    setSelectedLocales(new Set(availableLocales));
  }, [availableLocales]);

  const toggleLocaleForExport = useCallback((code: string) => {
    setSelectedLocales((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }, []);

  const platformSizes = sizes[platform] ?? [];
  const sizeOptions = platformSizes.map((s) => ({
    value: s.key,
    label: `${s.name} (${s.width}×${s.height})`,
  }));
  const resolvedExportSize = exportSize || getDefaultExportSizeKey(sizes, platform) || '';

  useEffect(() => {
    if (!exportSize && resolvedExportSize) {
      setExportSize(resolvedExportSize);
    }
  }, [exportSize, resolvedExportSize, setExportSize]);


  const activeLocaleConfig = locale === 'default' ? undefined : sessionLocales[locale];
  const activeVariant = variants.find((variant) => variant.id === activeVariantId) ?? null;
  const activeProjectDisplayName = usePreviewStore((s) => s.activeProjectDisplayName);
  // Filename prefix. Always lead with the project identity; append the
  // variant slug only when 2+ variants exist (otherwise there's nothing
  // to disambiguate against). Logic lives in utils/exportSlug.ts and
  // is unit-tested there.
  const exportSlug = composeExportSlug(
    activeProjectDisplayName,
    activeVariant?.name,
    variants.length,
  );

  // --- Panoramic export helpers ---
  // Panoramic body for a specific locale. Default uses state.panoramicElements;
  // other locales use their own snapshot from localePanoramicElements.
  const buildPanoramicBodyForLocale = (localeCode: string, frameIndex?: number) => {
    const elementsForLocale =
      localeCode === 'default'
        ? panoramicElements
        : localePanoramicMap[localeCode] ?? panoramicElements;
    const cfg = localeCode === 'default' ? undefined : sessionLocales[localeCode];
    return {
      locale: localeCode,
      localeConfig: cfg,
      frameCount: panoramicFrameCount,
      frameWidth: previewW,
      frameHeight: previewH,
      background: panoramicBackground,
      elements: elementsForLocale,
      effects: panoramicEffects,
      font: config?.theme.font,
      fontWeight: config?.theme.fontWeight,
      frameStyle: config?.frames.style,
      sizeKey: resolvedExportSize,
      frameIndex,
    };
  };
  // Panoramic batch export. Rasterizes the wide canvas once and slices it
  // into N per-frame PNGs — one render plus N cheap canvas crops, no
  // per-frame server round-trips. Slices are bundled into one ZIP so
  // the user gets a single download with the right folder structure
  // (forward-compatible with multi-locale's output/<locale>/ layout).
  const handlePanoramicExportAll = async () => {
    if (!config) return;
    const sizeSpec = platformSizes.find((s) => s.key === resolvedExportSize);
    if (!sizeSpec) {
      setStatus(`Export failed: unknown size key ${resolvedExportSize}`);
      return;
    }
    const localesToExport = availableLocales.filter((code) => selectedLocales.has(code));
    if (localesToExport.length === 0) {
      setStatus('Select at least one locale to export');
      return;
    }
    const useFolders = localesToExport.length > 1;
    setExporting(true);
    setStatus(`Rendering ${panoramicFrameCount} frames × ${localesToExport.length} locale${localesToExport.length === 1 ? '' : 's'}...`);
    const t0 = performance.now();
    try {
      const entries: ZipEntry[] = [];
      const fileNames: string[] = [];
      for (const localeCode of localesToExport) {
        const localeLabel = localeCode === 'default' ? 'Default' : getLocaleLabel(localeCode);
        setStatus(`Rendering ${localeLabel} panoramic...`);
        const slices = await exportPanoramicSlicesClientSide(
          buildPanoramicBodyForLocale(localeCode) as unknown as Record<string, unknown>,
          panoramicFrameCount,
          sizeSpec.width,
          sizeSpec.height,
        );
        for (let i = 0; i < slices.length; i++) {
          const fileName = `frame-${i + 1}.png`;
          const relPath = useFolders ? `${localeCode}/${fileName}` : fileName;
          entries.push({ relPath, blob: slices[i]! });
          fileNames.push(relPath);
        }
      }
      if (entries.length > 0) {
        setStatus(`Bundling ${entries.length} frames...`);
        const zipBlob = await bundleAsZip(entries);
        downloadBlob(zipBlob, `${exportSlug}-frames.zip`);
        recordVariantArtifact({
          kind: 'frames',
          locale,
          mode: 'panoramic',
          renderer: 'modern-screenshot',
          sizeKey: resolvedExportSize,
          fileNames,
        });
      }
      const ms = Math.round(performance.now() - t0);
      setStatus(`Downloaded ${entries.length} frames in ${ms}ms`);
      setToast(`Downloaded ${entries.length} frames across ${localesToExport.length} locale${localesToExport.length === 1 ? '' : 's'}`);
    } catch (err) {
      setStatus(`Export failed: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setExporting(false);
    }
  };

  const handleExportCurrent = async () => {
    const screen = screens[selectedScreen];
    if (!screen) return;
    const sizeSpec = platformSizes.find((s) => s.key === resolvedExportSize);
    if (!sizeSpec) {
      setStatus(`Export failed: unknown size key ${resolvedExportSize}`);
      return;
    }
    setExporting(true);
    setStatus(`Rendering screen ${selectedScreen + 1}...`);
    const t0 = performance.now();
    try {
      const body = buildExportBody(screen, {
        previewW,
        previewH,
        locale,
        localeConfig: activeLocaleConfig,
        sizeKey: resolvedExportSize,
      });
      const blob = await exportScreenClientSide(
        body as unknown as Record<string, unknown>,
        sizeSpec.width,
        sizeSpec.height,
      );
      const fileName = `${exportSlug}-screen-${selectedScreen + 1}.png`;
      downloadBlob(blob, fileName);
      const ms = Math.round(performance.now() - t0);
      setStatus(`Downloaded screen ${selectedScreen + 1} in ${ms}ms`);
      setToast(`Downloaded ${fileName}`);
    } catch (err) {
      setStatus(`Error on screen ${selectedScreen + 1}: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    if (screens.length === 0) return;
    const sizeSpec = platformSizes.find((s) => s.key === resolvedExportSize);
    if (!sizeSpec) {
      setStatus(`Export failed: unknown size key ${resolvedExportSize}`);
      return;
    }
    // Locale list to render. Iterate in availableLocales order (Default
    // first) but filter to the user's checked set.
    const localesToExport = availableLocales.filter((code) => selectedLocales.has(code));
    if (localesToExport.length === 0) {
      setStatus('Select at least one locale to export');
      return;
    }
    // Multiple locales → put each in its own folder. Single locale →
    // keep files at the ZIP root for backward-compatibility with the
    // pre-multi-locale flat layout.
    const useFolders = localesToExport.length > 1;

    setExporting(true);
    const entries: ZipEntry[] = [];
    const fileNames: string[] = [];
    const t0 = performance.now();
    let totalRendered = 0;
    let totalExpected = 0;
    // Each locale carries its own screen snapshot in localeScreens[code]
    // (Default uses state.screens). Iterate locale × screens, rendering
    // each via the locale's own ScreenState so per-locale text, position,
    // and screenshots all flow through buildExportBody unchanged.
    for (const localeCode of localesToExport) {
      const localeScreens = localeCode === 'default' ? screens : localeScreensMap[localeCode];
      if (!localeScreens || localeScreens.length === 0) continue;
      totalExpected += localeScreens.length;
      const localeLabel = localeCode === 'default' ? 'Default' : getLocaleLabel(localeCode);
      const localeCfg = localeCode === 'default' ? undefined : sessionLocales[localeCode];
      for (let i = 0; i < localeScreens.length; i++) {
        const screen = localeScreens[i];
        if (!screen) continue;
        setStatus(`Rendering ${localeLabel} screen ${i + 1} of ${localeScreens.length}...`);
        try {
          const body = buildExportBody(screen, {
            previewW,
            previewH,
            locale: localeCode,
            localeConfig: localeCfg,
            sizeKey: resolvedExportSize,
          });
          const blob = await exportScreenClientSide(
            body as unknown as Record<string, unknown>,
            sizeSpec.width,
            sizeSpec.height,
          );
          const fileName = `screen-${i + 1}.png`;
          const relPath = useFolders ? `${localeCode}/${fileName}` : fileName;
          entries.push({ relPath, blob });
          fileNames.push(relPath);
          totalRendered++;
        } catch (err) {
          setStatus(
            `Error on ${localeLabel} screen ${i + 1}: ${err instanceof Error ? err.message : 'Unknown'}`,
          );
        }
      }
    }
    if (entries.length > 0) {
      setStatus(`Bundling ${entries.length} screens...`);
      const zipBlob = await bundleAsZip(entries);
      downloadBlob(zipBlob, `${exportSlug}-screens.zip`);
      // For variant-history bookkeeping. Record the active locale at
      // export time (closest single value for a multi-locale export);
      // could grow to a list later if a variant should remember which
      // locales it shipped with.
      recordVariantArtifact({
        kind: 'screens',
        locale,
        mode: 'individual',
        renderer: 'modern-screenshot',
        sizeKey: resolvedExportSize,
        fileNames,
      });
    }
    const ms = Math.round(performance.now() - t0);
    setExporting(false);
    setStatus(`Downloaded ${totalRendered} of ${totalExpected} screens in ${ms}ms`);
    setToast(`Downloaded ${totalRendered} screenshots across ${localesToExport.length} locale${localesToExport.length === 1 ? '' : 's'}`);
  };

  const handleReload = async () => {
    try {
      const cfg = await reloadProject();
      initScreens(cfg, platform);
      triggerRender();
      setStatus('Project reloaded from disk');
    } catch (err) {
      setStatus(`Reload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Empty state
  if (!isPanoramic && screens.length === 0) {
    return (
      <Section title="Download" tooltip="Choose output size and renderer, then download your screenshots." defaultCollapsed={false}>
        <p className="text-xs text-text-dim text-center py-4">
          No screens to download.{' '}
          <button
            className="text-accent hover:text-accent-hover underline"
            onClick={() => usePreviewStore.getState().setActiveTab('background')}
          >
            Go to Background tab
          </button>{' '}
          to get started.
        </p>
      </Section>
    );
  }

  return (
    <>
      {toast && <Toast message={toast} onDone={clearToast} />}
      <Section title="Download" tooltip="Choose output size and renderer, then download your screenshots." defaultCollapsed={false}>
        {activeVariant && (
          <div className="text-[10px] text-text-dim mb-2">
            Exporting <span className="text-text">{activeVariant.name}</span> ({activeVariant.status})
          </div>
        )}
        <Select
          label="Output Size"
          value={resolvedExportSize}
          onChange={setExportSize}
          options={sizeOptions}
        />

        {availableLocales.length > 1 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-wider text-text-dim">
                Locales to export
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="text-[10px] text-text-dim hover:text-text underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  onClick={() => setSelectedLocales(new Set(availableLocales))}
                  disabled={selectedLocales.size === availableLocales.length}
                >
                  All
                </button>
                <span className="text-text-dim/40 text-[10px]">/</span>
                <button
                  type="button"
                  className="text-[10px] text-text-dim hover:text-text underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  onClick={() => setSelectedLocales(new Set())}
                  disabled={selectedLocales.size === 0}
                >
                  None
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              {availableLocales.map((code) => {
                const label = code === 'default' ? 'Default' : (sessionLocales[code]?.label ?? getLocaleLabel(code));
                return (
                  <label
                    key={code}
                    className="flex items-center gap-2 px-2 py-1 rounded-md text-[11px] hover:bg-surface-2/60 cursor-pointer"
                  >
                    <Checkbox
                      label=""
                      checked={selectedLocales.has(code)}
                      onChange={() => toggleLocaleForExport(code)}
                    />
                    <span className="flex-1 text-text truncate">{label}</span>
                    {code !== 'default' && (
                      <span className="text-[9px] uppercase tracking-wider text-text-dim/70 font-normal">
                        {code}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {isPanoramic ? (
          <button
            className="btn-primary w-full text-xs mt-2"
            onClick={handlePanoramicExportAll}
            disabled={exporting || selectedLocales.size === 0}
          >
            {exporting
              ? 'Rendering...'
              : selectedLocales.size === 0
                ? 'Select at least one locale'
                : selectedLocales.size === 1
                  ? `Download all ${panoramicFrameCount} frames`
                  : `Download ${selectedLocales.size * panoramicFrameCount} frames (${selectedLocales.size} locales)`}
          </button>
        ) : (
          <>
            {/* "Download all" is the primary action — it's what users
                actually want once their project is finalized. The
                single-screen download stays as a secondary affordance
                for quick spot-checks. */}
            <button
              className="btn-primary w-full text-xs mt-2"
              onClick={handleExportAll}
              disabled={exporting || selectedLocales.size === 0}
            >
              {exporting
                ? 'Rendering...'
                : selectedLocales.size === 0
                  ? 'Select at least one locale'
                  : selectedLocales.size === 1
                    ? `Download all ${screens.length} screens`
                    : `Download ${selectedLocales.size * screens.length} screens (${selectedLocales.size} locales)`}
            </button>
            <button
              className="btn-secondary w-full text-xs mt-1"
              onClick={handleExportCurrent}
              disabled={exporting || !screens[selectedScreen]}
            >
              {exporting ? 'Rendering...' : `Download screen ${selectedScreen + 1} (current locale)`}
            </button>
          </>
        )}
      </Section>

      <Section title="Actions" tooltip="Refresh previews or reload the project from disk. Reloading resets unsaved session-only locale changes.">
        <div className="flex gap-2">
          <button
            className="btn-primary flex-1 text-xs"
            onClick={triggerRender}
          >
            Refresh All
          </button>
          <button
            className="btn-secondary flex-1 text-xs"
            onClick={handleReload}
          >
            Reload Project
          </button>
        </div>
        <div className={`text-[10px] mt-2 ${status.startsWith('Download error') || status.startsWith('Reload failed') || status.startsWith('Error') ? 'text-red-400' : status.startsWith('Downloaded') || status === 'Project reloaded from disk' ? 'text-green-400' : 'text-text-dim'}`}>
          {status}
        </div>
      </Section>
    </>
  );
}
