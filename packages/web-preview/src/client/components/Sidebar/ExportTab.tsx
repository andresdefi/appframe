import { useState, useEffect, useCallback } from 'react';
import { usePreviewStore } from '../../store';
import type { LocaleConfig } from '../../types';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { fetchAutoTranslateLocale, fetchExport, fetchPanoramicExport, reloadProject } from '../../utils/api';
import { buildExportBody } from '../../utils/previewBody';
import { getDefaultExportSizeKey } from '../../utils/platformSelection';
import { getAvailableLocales, getLocaleLabel } from '../../utils/locales';

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div role="alert" aria-live="polite" className="fixed top-4 right-4 z-50 bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-in fade-in">
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
  const exportRenderer = usePreviewStore((s) => s.exportRenderer);
  const setExportRenderer = usePreviewStore((s) => s.setExportRenderer);
  const koubouAvailable = usePreviewStore((s) => s.koubouAvailable);
  const locale = usePreviewStore((s) => s.locale);
  const sessionLocales = usePreviewStore((s) => s.sessionLocales);
  const setLocale = usePreviewStore((s) => s.setLocale);
  const upsertLocaleConfig = usePreviewStore((s) => s.upsertLocaleConfig);
  const previewBg = usePreviewStore((s) => s.previewBg);
  const setPreviewBg = usePreviewStore((s) => s.setPreviewBg);
  const config = usePreviewStore((s) => s.config);
  const variants = usePreviewStore((s) => s.variants);
  const activeVariantId = usePreviewStore((s) => s.activeVariantId);
  const recordVariantArtifact = usePreviewStore((s) => s.recordVariantArtifact);
  const initScreens = usePreviewStore((s) => s.initScreens);
  const triggerRender = usePreviewStore((s) => s.triggerRender);
  const screens = usePreviewStore((s) => s.screens);

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

  const koubouDisabled = !koubouAvailable || platform === 'android';
  const rendererOptions = [
    { value: 'playwright', label: 'Playwright (fast)' },
    { value: 'koubou', label: 'Koubou (pixel-perfect)', disabled: koubouDisabled, title: koubouDisabled ? (!koubouAvailable ? 'Koubou server not running' : 'Koubou is not available for Android') : undefined },
  ];

  const activeLocaleConfig = locale === 'default' ? undefined : sessionLocales[locale];
  const availableLocales = getAvailableLocales(config, sessionLocales);
  const activeVariant = variants.find((variant) => variant.id === activeVariantId) ?? null;
  const variantSlug = slugifyVariantName(activeVariant?.name ?? 'variant');
  const localeOptions = availableLocales.map((value) => ({
    value,
    label: getLocaleLabel(value),
  }));

  const handleLocaleChange = useCallback(async (nextLocale: string) => {
    if (nextLocale === 'default' || sessionLocales[nextLocale]) {
      setLocale(nextLocale);
      setStatus(nextLocale === 'default' ? 'Using current working copy' : `Using ${getLocaleLabel(nextLocale)}`);
      return;
    }

    setStatus(`Generating ${getLocaleLabel(nextLocale)} for this session...`);
    try {
      const result = await fetchAutoTranslateLocale(nextLocale, {
        screens: screens.map((screen) => ({
          headline: screen.headline,
          subtitle: screen.subtitle || null,
        })),
        panoramicElements,
      });
      upsertLocaleConfig(result.locale, result.localeConfig as LocaleConfig);
      setLocale(result.locale);
      setStatus(`Added ${getLocaleLabel(result.locale)} to this session`);
      setToast(`Added ${getLocaleLabel(result.locale)}`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Automatic translation failed');
    }
  }, [panoramicElements, screens, sessionLocales, setLocale, upsertLocaleConfig]);

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
      const manifestName = `${variantSlug}-manifest.json`;
      const manifest = {
        variantId: activeVariant?.id ?? null,
        variantName: activeVariant?.name ?? 'Variant',
        status: activeVariant?.status ?? 'draft',
        mode: 'panoramic',
        locale,
        sizeKey: resolvedExportSize,
        renderer: 'playwright',
        fileNames,
        exportedAt: new Date().toISOString(),
      };
      downloadBlob(new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' }), manifestName);
      recordVariantArtifact({
        kind: 'frames',
        locale,
        mode: 'panoramic',
        sizeKey: resolvedExportSize,
        renderer: 'playwright',
        fileNames,
        manifestName,
      });
    }
    setExporting(false);
    setStatus(`Downloaded ${exported} of ${panoramicFrameCount} frames`);
    setToast(`Downloaded ${exported} frames`);
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
          renderer: exportRenderer,
        }));
        const fileName = `${variantSlug}-screen-${i + 1}.png`;
        downloadBlob(blob, fileName);
        fileNames.push(fileName);
        exported++;
      } catch (err) {
        setStatus(`Error on screen ${i + 1}: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
    }
    if (exported > 0) {
      const manifestName = `${variantSlug}-manifest.json`;
      const manifest = {
        variantId: activeVariant?.id ?? null,
        variantName: activeVariant?.name ?? 'Variant',
        status: activeVariant?.status ?? 'draft',
        mode: 'individual',
        locale,
        sizeKey: resolvedExportSize,
        renderer: exportRenderer,
        fileNames,
        exportedAt: new Date().toISOString(),
      };
      downloadBlob(new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' }), manifestName);
      recordVariantArtifact({
        kind: 'screens',
        locale,
        mode: 'individual',
        sizeKey: resolvedExportSize,
        renderer: exportRenderer,
        fileNames,
        manifestName,
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
        {!isPanoramic && koubouAvailable && (
          <Select
            label="Renderer"
            value={exportRenderer}
            onChange={setExportRenderer}
            options={rendererOptions}
          />
        )}

        {isPanoramic ? (
          <button
            className="w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1"
            onClick={handlePanoramicExportAll}
            disabled={exporting}
          >
            {exporting ? 'Downloading...' : `Download all ${panoramicFrameCount} frames`}
          </button>
        ) : (
          <>
            <button
              className="w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1"
              onClick={handleExportAll}
              disabled={exporting}
            >
              {exporting ? 'Downloading...' : `Download all ${screens.length} screens`}
            </button>
          </>
        )}
      </Section>

      {availableLocales.length > 1 && (
        <Section title="Locale" tooltip="Select the language for localized previews and exports. Session translations are used immediately, and imported project locales remain available.">
          <Select
            label="Language"
            value={locale}
            onChange={handleLocaleChange}
            options={localeOptions}
          />
        </Section>
      )}

      <Section title="Preview Background" tooltip="Change the editor background color. This does not affect exported images.">
        <div className="flex gap-3">
          {(['dark', 'light'] as const).map((bg) => (
            <label key={bg} className="text-xs text-text-dim cursor-pointer flex items-center gap-1">
              <input
                type="radio"
                checked={previewBg === bg}
                onChange={() => setPreviewBg(bg)}
                className="accent-accent"
              />
              {bg.charAt(0).toUpperCase() + bg.slice(1)}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Actions" tooltip="Refresh previews or reload the project from disk. Reloading resets unsaved session-only locale changes.">
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 text-xs bg-accent hover:bg-accent-hover text-white rounded-md"
            onClick={triggerRender}
          >
            Refresh All
          </button>
          <button
            className="flex-1 py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
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
