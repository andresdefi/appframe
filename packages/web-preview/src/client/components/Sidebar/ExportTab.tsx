import { useState } from 'react';
import { usePreviewStore } from '../../store';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { fetchExport, reloadConfig } from '../../utils/api';

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

  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState('Ready');

  const platformSizes = sizes[platform] ?? [];
  const sizeOptions = platformSizes.map((s) => ({
    value: s.key,
    label: `${s.name} (${s.width}×${s.height})`,
  }));

  const rendererOptions = [
    { value: 'playwright', label: 'Playwright (fast)' },
    { value: 'koubou', label: 'Koubou (pixel-perfect)', disabled: !koubouAvailable || platform === 'android' },
  ];

  // Build locale options from config
  const localeOptions = [{ value: 'default', label: 'Default' }];
  if (config?.locales) {
    for (const key of Object.keys(config.locales)) {
      localeOptions.push({ value: key, label: key });
    }
  }

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

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `screenshot-${selectedScreen + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const sizeKb = Math.round(blob.size / 1024);
      setStatus(`Exported (${sizeKb}KB)`);
    } catch (err) {
      setStatus(`Export error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setExporting(false);
    }
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

  return (
    <>
      <Section title="Export">
        <Select
          label="Output Size"
          value={exportSize}
          onChange={setExportSize}
          options={sizeOptions}
        />
        {koubouAvailable && (
          <Select
            label="Renderer"
            value={exportRenderer}
            onChange={setExportRenderer}
            options={rendererOptions}
          />
        )}
        <button
          className="w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : 'Download Screenshot'}
        </button>
      </Section>

      <Section title="Locale">
        <Select
          label=""
          value={locale}
          onChange={setLocale}
          options={localeOptions}
        />
      </Section>

      <Section title="Preview Background">
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

      <Section title="">
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
        <div className="text-[10px] text-text-dim mt-2">{status}</div>
      </Section>
    </>
  );
}
