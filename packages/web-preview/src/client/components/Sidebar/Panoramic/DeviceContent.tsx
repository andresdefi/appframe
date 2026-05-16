import { usePreviewStore } from '../../../store';
import { Section } from '../../Controls/Section';
import { Select } from '../../Controls/Select';
import { ElementInspector } from './ElementInspector';
import { ScreenshotUploader } from './ScreenshotUploader';
import {
  ELEMENT_TYPE_LABELS,
  buildDefaultGroupElement,
  getElementSummary,
} from './helpers';

export function PanoramicDeviceContent() {
  const elements = usePreviewStore((s) => s.panoramicElements);
  const selectedElementIndex = usePreviewStore((s) => s.selectedElementIndex);
  const setSelectedElement = usePreviewStore((s) => s.setSelectedElement);
  const addElement = usePreviewStore((s) => s.addPanoramicElement);
  const config = usePreviewStore((s) => s.config);

  const filtered = elements
    .map((el, i) => ({ el, i }))
    .filter(
      ({ el }) =>
        el.type === 'device' ||
        el.type === 'decoration' ||
        el.type === 'image' ||
        el.type === 'logo' ||
        el.type === 'crop' ||
        el.type === 'group',
    );

  const addDevice = () => {
    const deviceCount = elements.filter((e) => e.type === 'device').length;
    const screenshot =
      config?.screens[deviceCount]?.screenshot ??
      config?.screens[0]?.screenshot ??
      'screenshots/screen-1.png';
    addElement({
      type: 'device',
      screenshot,
      frameStyle: 'flat',
      x: 10 + deviceCount * 20,
      y: 15,
      width: 12,
      rotation: 0,
      deviceScale: 92,
      deviceTop: 15,
      deviceOffsetX: 0,
      deviceAngle: 8,
      deviceTilt: 0,
      cornerRadius: 0,
      fullscreenScreenshot: false,
      z: 5,
    });
  };

  const addDecoration = () => {
    addElement({
      type: 'decoration',
      shape: 'circle',
      x: 50,
      y: 50,
      width: 5,
      height: 8,
      color: config?.theme.colors.primary ?? '#6366F1',
      opacity: 0.15,
      rotation: 0,
      z: 0,
    });
  };

  const addImage = () => {
    const imageCount = elements.filter((e) => e.type === 'image').length;
    addElement({
      type: 'image',
      src: config?.screens[0]?.screenshot ?? 'screenshots/screen-1.png',
      x: 8 + imageCount * 12,
      y: 58,
      width: 12,
      height: 12,
      fit: 'contain',
      opacity: 1,
      rotation: 0,
      borderRadius: 0,
      z: 6,
    });
  };

  const addCrop = () => {
    const cropCount = elements.filter((e) => e.type === 'crop').length;
    addElement({
      type: 'crop',
      screenshot: config?.screens[cropCount]?.screenshot ?? config?.screens[0]?.screenshot ?? 'screenshots/screen-1.png',
      x: 14 + cropCount * 14,
      y: 56,
      width: 12,
      height: 18,
      focusX: 50,
      focusY: 40,
      zoom: 1.5,
      rotation: cropCount % 2 === 0 ? -4 : 4,
      borderRadius: 24,
      z: 7,
    });
  };

  const addLogo = () => {
    const logoCount = elements.filter((e) => e.type === 'logo').length;
    addElement({
      type: 'logo',
      src: config?.screens[0]?.screenshot ?? 'screenshots/screen-1.png',
      x: 76 + logoCount * 3,
      y: 6,
      width: 12,
      height: 10,
      fit: 'contain',
      opacity: 0.96,
      rotation: 0,
      padding: 1.2,
      backgroundColor: '#FFFFFFE6',
      borderRadius: 24,
      z: 8,
    });
  };

  const addGroup = () => {
    const groupCount = elements.filter((e) => e.type === 'group').length;
    const screenshot =
      config?.screens[groupCount]?.screenshot ??
      config?.screens[0]?.screenshot ??
      'screenshots/screen-1.png';
    addElement(buildDefaultGroupElement(screenshot, 12 + groupCount * 14, 52, groupCount % 2 === 0 ? -4 : 4));
  };

  const showInspector =
    selectedElementIndex !== null &&
    elements[selectedElementIndex] &&
    (elements[selectedElementIndex]!.type === 'device' ||
      elements[selectedElementIndex]!.type === 'decoration' ||
      elements[selectedElementIndex]!.type === 'image' ||
      elements[selectedElementIndex]!.type === 'logo' ||
      elements[selectedElementIndex]!.type === 'crop' ||
      elements[selectedElementIndex]!.type === 'group');

  return (
    <div>
      <Section title="Screenshots">
        <ScreenshotUploader />
      </Section>

      <Section title={`Devices & Decorations (${filtered.length})`} defaultCollapsed={false}>
        <div className="grid grid-cols-3 gap-1 mb-3">
          <button
            className="btn-secondary text-[11px]"
            onClick={addDevice}
          >
            + Device
          </button>
          <button
            className="btn-secondary text-[11px]"
            onClick={addDecoration}
          >
            + Decoration
          </button>
          <button
            className="btn-secondary text-[11px]"
            onClick={addImage}
          >
            + Image
          </button>
          <button
            className="btn-secondary text-[11px]"
            onClick={addLogo}
          >
            + Logo
          </button>
          <button
            className="btn-secondary text-[11px]"
            onClick={addCrop}
          >
            + Crop
          </button>
          <button
            className="btn-secondary text-[11px]"
            onClick={addGroup}
          >
            + Group
          </button>
        </div>

        {filtered.length === 0 && (
          <p className="text-xs text-text-dim text-center py-4">
            Add devices, logos, crops, groups, images, or decorations to place screenshots on the panoramic canvas.
          </p>
        )}
        <div className="space-y-1">
          {filtered.map(({ el, i }) => {
            const typeNum = elements.slice(0, i).filter((e) => e.type === el.type).length + 1;
            return (
              <button
                key={i}
                className={`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${
                  i === selectedElementIndex
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'bg-surface-2 border border-border hover:border-accent/30'
                }`}
                onClick={() => setSelectedElement(i === selectedElementIndex ? null : i)}
              >
                <span className="font-medium">
                  {ELEMENT_TYPE_LABELS[el.type]} #{typeNum}
                </span>
                <span className="text-text-dim ml-1">
                  ({Math.round(el.x)}%, {Math.round(el.y)}%)
                </span>
                {getElementSummary(el) && (
                  <span className="text-text-dim ml-1 truncate" title={getElementSummary(el) ?? ''}>
                    &mdash; {getElementSummary(el)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {showInspector && <ElementInspector index={selectedElementIndex!} />}
    </div>
  );
}
