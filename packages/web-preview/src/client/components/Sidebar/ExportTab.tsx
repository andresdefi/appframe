import { useState, useEffect, useCallback } from 'react';
import { usePreviewStore } from '../../store';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { fetchExport, fetchPanoramicExport, reloadConfig } from '../../utils/api';

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
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
  const setLocale = usePreviewStore((s) => s.setLocale);
  const previewBg = usePreviewStore((s) => s.previewBg);
  const setPreviewBg = usePreviewStore((s) => s.setPreviewBg);
  const config = usePreviewStore((s) => s.config);
  const initScreens = usePreviewStore((s) => s.initScreens);
  const triggerRender = usePreviewStore((s) => s.triggerRender);
  const selectedScreen = usePreviewStore((s) => s.selectedScreen);
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

  const koubouDisabled = !koubouAvailable || platform === 'android';
  const rendererOptions = [
    { value: 'playwright', label: 'Playwright (fast)' },
    { value: 'koubou', label: 'Koubou (pixel-perfect)', disabled: koubouDisabled, title: koubouDisabled ? (!koubouAvailable ? 'Koubou server not running' : 'Koubou is not available for Android') : undefined },
  ];

  // Build locale options from config
  const localeOptions = [{ value: 'default', label: 'Default' }];
  if (config?.locales) {
    for (const key of Object.keys(config.locales)) {
      localeOptions.push({ value: key, label: key });
    }
  }

  // --- Panoramic export helpers ---
  const buildPanoramicBody = (frameIndex?: number) => ({
    frameCount: panoramicFrameCount,
    frameWidth: previewW,
    frameHeight: previewH,
    background: panoramicBackground,
    elements: panoramicElements,
    effects: panoramicEffects,
    font: config?.theme.font,
    fontWeight: config?.theme.fontWeight,
    frameStyle: config?.frames.style,
    sizeKey: exportSize,
    frameIndex,
  });

  const handlePanoramicExportAll = async () => {
    setExporting(true);
    let exported = 0;
    for (let i = 0; i < panoramicFrameCount; i++) {
      setStatus(`Exporting frame ${i + 1} of ${panoramicFrameCount}...`);
      try {
        const blob = await fetchPanoramicExport(buildPanoramicBody(i));
        downloadBlob(blob, `frame-${i + 1}.png`);
        exported++;
      } catch (err) {
        setStatus(`Error on frame ${i + 1}: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
    }
    setExporting(false);
    setStatus(`Exported ${exported} of ${panoramicFrameCount} frames`);
    setToast(`Exported ${exported} frames`);
  };

  const handlePanoramicExportFull = async () => {
    setExporting(true);
    setStatus('Exporting full panoramic canvas...');
    try {
      const blob = await fetchPanoramicExport(buildPanoramicBody());
      downloadBlob(blob, 'panoramic-full.png');
      const sizeKb = Math.round(blob.size / 1024);
      setStatus(`Exported panoramic (${sizeKb}KB)`);
      setToast(`Panoramic canvas exported (${sizeKb}KB)`);
    } catch (err) {
      setStatus(`Export error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setExporting(false);
    }
  };

  // --- Individual export helpers ---
  const handleExport = async () => {
    const screen = screens[selectedScreen];
    if (!screen) return;

    setExporting(true);
    setStatus(exportRenderer === 'koubou'
      ? `Rendering screen ${selectedScreen + 1} with Koubou...`
      : `Exporting screen ${selectedScreen + 1}...`);

    try {
      const blob = await fetchExport({
        screenIndex: screen.screenIndex,
        sizeKey: exportSize,
        renderer: exportRenderer,
        headline: screen.headline,
        subtitle: screen.subtitle || undefined,
        style: screen.style,
        layout: screen.layout,
        colors: screen.colors,
        font: screen.font,
        fontWeight: screen.fontWeight,
        frameId: screen.frameId,
        frameStyle: screen.frameStyle,
        deviceColor: screen.deviceColor || undefined,
        deviceScale: screen.deviceScale,
        deviceTop: screen.deviceTop,
        screenshotDataUrl: screen.screenshotDataUrl || undefined,
      });

      downloadBlob(blob, `screenshot-${selectedScreen + 1}.png`);

      const sizeKb = Math.round(blob.size / 1024);
      setStatus(`Exported (${sizeKb}KB)`);
      setToast(`Screen ${selectedScreen + 1} exported (${sizeKb}KB)`);
    } catch (err) {
      setStatus(`Export error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    if (screens.length === 0) return;
    setExporting(true);
    let exported = 0;
    for (let i = 0; i < screens.length; i++) {
      const screen = screens[i];
      if (!screen) continue;
      setStatus(`Exporting screen ${i + 1} of ${screens.length}...`);
      try {
        const blob = await fetchExport({
          screenIndex: screen.screenIndex,
          sizeKey: exportSize,
          renderer: exportRenderer,
          headline: screen.headline,
          subtitle: screen.subtitle || undefined,
          style: screen.style,
          layout: screen.layout,
          colors: screen.colors,
          font: screen.font,
          fontWeight: screen.fontWeight,
          frameId: screen.frameId,
          frameStyle: screen.frameStyle,
          deviceColor: screen.deviceColor || undefined,
          deviceScale: screen.deviceScale,
          deviceTop: screen.deviceTop,
          screenshotDataUrl: screen.screenshotDataUrl || undefined,
        });
        downloadBlob(blob, `screenshot-${i + 1}.png`);
        exported++;
      } catch (err) {
        setStatus(`Error on screen ${i + 1}: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
    }
    setExporting(false);
    setStatus(`Exported ${exported} of ${screens.length} screens`);
    setToast(`Exported ${exported} screenshots`);
  };

  const handleReload = async () => {
    try {
      const cfg = await reloadConfig();
      initScreens(cfg, platform);
      triggerRender();
      setStatus('Config reloaded');
    } catch (err) {
      setStatus(`Reload error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Empty state
  if (!isPanoramic && screens.length === 0) {
    return (
      <Section title="Export" tooltip="Choose output size and renderer, then download your screenshots." defaultCollapsed={false}>
        <p className="text-xs text-text-dim text-center py-4">
          No screens to export.{' '}
          <button
            className="text-accent hover:text-accent-hover underline"
            onClick={() => usePreviewStore.getState().setActiveTab('design')}
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
      <Section title="Export" tooltip="Choose output size and renderer, then download your screenshots." defaultCollapsed={false}>
        <Select
          label="Output Size"
          value={exportSize}
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
          <>
            <button
              className="w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1"
              onClick={handlePanoramicExportAll}
              disabled={exporting}
            >
              {exporting ? 'Exporting...' : `Export All ${panoramicFrameCount} Frames`}
            </button>
            <button
              className="w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text disabled:opacity-50 mt-1"
              onClick={handlePanoramicExportFull}
              disabled={exporting}
            >
              {exporting ? 'Exporting...' : 'Export Full Canvas'}
            </button>
          </>
        ) : (
          <>
            <button
              className="w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? 'Exporting...' : 'Download Screenshot'}
            </button>
            {screens.length > 1 && (
              <button
                className="w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text disabled:opacity-50 mt-1"
                onClick={handleExportAll}
                disabled={exporting}
              >
                {exporting ? 'Exporting...' : `Export All ${screens.length} Screens`}
              </button>
            )}
          </>
        )}
      </Section>

      {!isPanoramic && (
        <Section title="Locale" tooltip="Select a locale to export localized screenshots. Configure locales in your YAML config file.">
          <Select
            label="Language"
            value={locale}
            onChange={setLocale}
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

      <Section title="Actions" tooltip="Refresh previews or reload the YAML configuration file from disk.">
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
            Reload Config
          </button>
        </div>
        <div className={`text-[10px] mt-2 ${status.startsWith('Export error') || status.startsWith('Reload error') || status.startsWith('Error') ? 'text-red-400' : status.startsWith('Exported') || status === 'Config reloaded' ? 'text-green-400' : 'text-text-dim'}`}>
          {status}
        </div>
      </Section>
    </>
  );
}
