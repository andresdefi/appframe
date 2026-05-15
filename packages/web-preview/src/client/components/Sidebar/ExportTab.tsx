import { useState, useEffect, useCallback } from 'react';
import { usePreviewStore } from '../../store';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { exportApprovedArtifact, fetchExport, fetchExportConfig, fetchPanoramicExport, reloadProject } from '../../utils/api';
import { buildExportBody } from '../../utils/previewBody';
import { getDefaultExportSizeKey } from '../../utils/platformSelection';
import { exportScreenClientSide, isClientExportEnabled } from '../../utils/clientExport';

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

function slugifyVariantName(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'variant';
}

export function ExportTab() {
  const platform = usePreviewStore((s) => s.platform);
  const sizes = usePreviewStore((s) => s.sizes);
  const exportSize = usePreviewStore((s) => s.exportSize);
  const setExportSize = usePreviewStore((s) => s.setExportSize);
  const locale = usePreviewStore((s) => s.locale);
  const sessionLocales = usePreviewStore((s) => s.sessionLocales);
  const config = usePreviewStore((s) => s.config);
  const variants = usePreviewStore((s) => s.variants);
  const activeVariantId = usePreviewStore((s) => s.activeVariantId);
  const recordVariantArtifact = usePreviewStore((s) => s.recordVariantArtifact);
  const recordVariantArtifactForVariant = usePreviewStore((s) => s.recordVariantArtifactForVariant);
  const initScreens = usePreviewStore((s) => s.initScreens);
  const triggerRender = usePreviewStore((s) => s.triggerRender);
  const screens = usePreviewStore((s) => s.screens);
  const selectedScreen = usePreviewStore((s) => s.selectedScreen);
  const sessionBacked = usePreviewStore((s) => s.sessionBacked);

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
  const approvedVariant = variants.find((variant) => variant.status === 'approved') ?? null;
  const variantSlug = slugifyVariantName(activeVariant?.name ?? 'variant');

  // --- Panoramic export helpers ---
  const buildPanoramicBody = (frameIndex?: number) => ({
    locale,
    localeConfig: activeLocaleConfig,
    frameCount: panoramicFrameCount,
    frameWidth: previewW,
    frameHeight: previewH,
    background: panoramicBackground,
    elements: panoramicElements,
    effects: panoramicEffects,
    font: config?.theme.font,
    fontWeight: config?.theme.fontWeight,
    frameStyle: config?.frames.style,
    sizeKey: resolvedExportSize,
    frameIndex,
  });

  const handlePanoramicExportAll = async () => {
    setExporting(true);
    let exported = 0;
    const fileNames: string[] = [];
    for (let i = 0; i < panoramicFrameCount; i++) {
      setStatus(`Downloading frame ${i + 1} of ${panoramicFrameCount}...`);
      try {
        const blob = await fetchPanoramicExport(buildPanoramicBody(i));
        const fileName = `${variantSlug}-frame-${i + 1}.png`;
        downloadBlob(blob, fileName);
        fileNames.push(fileName);
        exported++;
      } catch (err) {
        setStatus(`Error on frame ${i + 1}: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
    }
    if (exported > 0) {
      recordVariantArtifact({
        kind: 'frames',
        locale,
        mode: 'panoramic',
        renderer: 'playwright',
        sizeKey: resolvedExportSize,
        fileNames,
        manifestName: `${variantSlug}-manifest.json`,
      });
    }
    setExporting(false);
    setStatus(`Downloaded ${exported} of ${panoramicFrameCount} frames`);
    setToast(`Downloaded ${exported} frames`);
  };

  const handleExportCurrent = async () => {
    const screen = screens[selectedScreen];
    if (!screen) return;
    setExporting(true);
    setStatus(`Downloading screen ${selectedScreen + 1}...`);
    try {
      const blob = await fetchExport(buildExportBody(screen, {
        previewW,
        previewH,
        locale,
        localeConfig: activeLocaleConfig,
        sizeKey: resolvedExportSize,
      }));
      const fileName = `${variantSlug}-screen-${selectedScreen + 1}.png`;
      downloadBlob(blob, fileName);
      setStatus(`Downloaded screen ${selectedScreen + 1}`);
      setToast(`Downloaded ${fileName}`);
    } catch (err) {
      setStatus(`Error on screen ${selectedScreen + 1}: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setExporting(false);
    }
  };

  // Phase 2 client-side path. Gated by localStorage 'appframe.clientExport',
  // sits next to the server Download button so we can A/B by clicking each.
  // Once parity is confirmed across the full export corpus this becomes the
  // default and the server path is deleted (Phase 4 of the migration plan).
  const handleExportCurrentClientSide = async () => {
    const screen = screens[selectedScreen];
    if (!screen) return;
    const sizeSpec = platformSizes.find((s) => s.key === resolvedExportSize);
    if (!sizeSpec) {
      setStatus(`Client export failed: unknown size key ${resolvedExportSize}`);
      return;
    }
    setExporting(true);
    setStatus(`Rendering screen ${selectedScreen + 1} (client)...`);
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
      const fileName = `${variantSlug}-screen-${selectedScreen + 1}.png`;
      downloadBlob(blob, fileName);
      const ms = Math.round(performance.now() - t0);
      setStatus(`Downloaded screen ${selectedScreen + 1} (client, ${ms}ms)`);
      setToast(`Downloaded ${fileName} (client-side, ${ms}ms)`);
    } catch (err) {
      setStatus(`Client export failed: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    if (screens.length === 0) return;
    setExporting(true);
    let exported = 0;
    const fileNames: string[] = [];
    for (let i = 0; i < screens.length; i++) {
      const screen = screens[i];
      if (!screen) continue;
      setStatus(`Downloading screen ${i + 1} of ${screens.length}...`);
      try {
        const blob = await fetchExport(buildExportBody(screen, {
          previewW,
          previewH,
          locale,
          localeConfig: activeLocaleConfig,
          sizeKey: resolvedExportSize,
          }));
        const fileName = `${variantSlug}-screen-${i + 1}.png`;
        downloadBlob(blob, fileName);
        fileNames.push(fileName);
        exported++;
        await new Promise((resolve) => setTimeout(resolve, 350));
      } catch (err) {
        setStatus(`Error on screen ${i + 1}: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
    }
    if (exported > 0) {
      recordVariantArtifact({
        kind: 'screens',
        locale,
        mode: 'individual',
        renderer: 'playwright',
        sizeKey: resolvedExportSize,
        fileNames,
        manifestName: `${variantSlug}-manifest.json`,
      });
    }
    setExporting(false);
    setStatus(`Downloaded ${exported} of ${screens.length} screens`);
    setToast(`Downloaded ${exported} screenshots`);
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

  const handleConfigExport = async () => {
    try {
      setStatus('Building standalone config...');
      const blob = await fetchExportConfig({
        variantName: activeVariant?.name ?? 'Variant',
        mode: isPanoramic ? 'panoramic' : 'individual',
        sessionLocales,
        screens,
        panoramicFrameCount,
        panoramicBackground,
        panoramicElements,
      });
      const fileName = `${variantSlug}.config.yaml`;
      downloadBlob(blob, fileName);
      setStatus(`Downloaded config for ${activeVariant?.name ?? 'current variant'}`);
      setToast(`Downloaded ${fileName}`);
    } catch (err) {
      setStatus(`Config export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleApprovedArtifactExport = async () => {
    if (!sessionBacked || !approvedVariant) return;

    try {
      setStatus(`Exporting approved artifact for ${approvedVariant.name}...`);
      const result = await exportApprovedArtifact({
        activeVariantId,
        locale,
        exportSize: resolvedExportSize,
        mode: isPanoramic ? 'panoramic' : 'individual',
        sessionLocales,
        screens,
        panoramicFrameCount,
        panoramicBackground,
        panoramicElements,
      });

      if (result.variantId) {
        recordVariantArtifactForVariant(result.variantId, result.artifact);
      }

      setStatus(`Approved artifact exported to ${result.outputDir}`);
      setToast(`Exported approved artifact for ${result.variantName}`);
    } catch (err) {
      setStatus(`Approved artifact export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
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

        {isPanoramic ? (
          <button
            className="btn-primary w-full text-xs mt-2"
            onClick={handlePanoramicExportAll}
            disabled={exporting}
          >
            {exporting ? 'Downloading...' : `Download all ${panoramicFrameCount} frames`}
          </button>
        ) : (
          <>
            <button
              className="btn-primary w-full text-xs mt-2"
              onClick={handleExportCurrent}
              disabled={exporting || !screens[selectedScreen]}
            >
              {exporting ? 'Downloading...' : `Download screen ${selectedScreen + 1}`}
            </button>
            {isClientExportEnabled() && (
              <button
                className="btn-secondary w-full text-xs mt-1 text-indigo-200 hover:text-white"
                onClick={handleExportCurrentClientSide}
                disabled={exporting || !screens[selectedScreen]}
                title="Client-side export (modern-screenshot). Flag-gated via localStorage 'appframe.clientExport'."
              >
                {exporting ? 'Rendering...' : `Download screen ${selectedScreen + 1} (client)`}
              </button>
            )}
            <button
              className="btn-secondary w-full text-xs mt-1"
              onClick={handleExportAll}
              disabled={exporting}
            >
              {exporting ? 'Downloading...' : `Download all ${screens.length} screens`}
            </button>
          </>
        )}

        {sessionBacked && (
          <button
            className="btn-secondary w-full text-xs mt-1 text-emerald-300 hover:text-emerald-100"
            onClick={handleApprovedArtifactExport}
            disabled={exporting || !approvedVariant}
          >
            {approvedVariant ? `Export Approved Artifact (${approvedVariant.name})` : 'Export Approved Artifact'}
          </button>
        )}

        <button
          className="btn-secondary w-full text-xs mt-1"
          onClick={handleConfigExport}
          disabled={exporting}
        >
          {sessionBacked ? 'Download Selected Variant Config' : 'Download Current Config'}
        </button>
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
