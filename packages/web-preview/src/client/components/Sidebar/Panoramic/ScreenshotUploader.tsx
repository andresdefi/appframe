import { useRef } from 'react';
import { usePreviewStore } from '../../../store';
import { uploadImageFile } from '../../../utils/uploadImageFile';

export function ScreenshotUploader() {
  const fileRef = useRef<HTMLInputElement>(null);
  const elements = usePreviewStore((s) => s.panoramicElements);
  const updateElement = usePreviewStore((s) => s.updatePanoramicElement);
  const addElement = usePreviewStore((s) => s.addPanoramicElement);

  const deviceElements = elements
    .map((el, i) => ({ el, i }))
    .filter(({ el }) => el.type === 'device');

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    // Upload sequentially so the server isn't fan-out hammered and the
    // user sees devices populate in order. uploadImageFile falls back
    // to the in-memory data URL if the server is down.
    for (let fileIdx = 0; fileIdx < files.length; fileIdx++) {
      const uploaded = await uploadImageFile(files[fileIdx]!);
      if (fileIdx < deviceElements.length) {
        updateElement(deviceElements[fileIdx]!.i, { screenshot: uploaded.url });
      } else {
        const deviceCount = deviceElements.length + (fileIdx - deviceElements.length);
        addElement({
          type: 'device',
          screenshot: uploaded.url,
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
      }
    }
  };

  return (
    <>
      <button
        className="btn-secondary w-full text-xs"
        onClick={() => fileRef.current?.click()}
      >
        Upload Screenshots
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        aria-label="Upload device screenshots"
        onChange={handleFiles}
      />
      {deviceElements.length > 0 && (
        <div className="mt-2 space-y-1">
          {deviceElements.map(({ el, i }) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-text-dim">
              <span className="w-4 text-center">
                {deviceElements.indexOf(deviceElements.find((d) => d.i === i)!) + 1}
              </span>
              {(el as { screenshot: string }).screenshot.startsWith('data:') ? (
                <img
                  src={(el as { screenshot: string }).screenshot}
                  alt=""
                  className="w-6 h-6 rounded object-cover border border-border"
                />
              ) : (
                <span className="truncate flex-1">{(el as { screenshot: string }).screenshot}</span>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="text-[10px] text-text-dim mt-1.5">
        Select multiple files to assign to device elements in order.
      </p>
    </>
  );
}
