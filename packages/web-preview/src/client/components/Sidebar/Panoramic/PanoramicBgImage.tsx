import { useRef } from 'react';
import { uploadImageFile } from '../../../utils/uploadImageFile';

export function PanoramicBgImage({
  imageDataUrl,
  onUpload,
  onRemove,
  buttonLabel = 'Upload Background Image',
  alt = 'Background',
}: {
  imageDataUrl?: string;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
  buttonLabel?: string;
  alt?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const uploaded = await uploadImageFile(file);
    onUpload(uploaded.url);
  };
  return (
    <>
      <button
        className="btn-secondary w-full text-xs mb-2"
        onClick={() => fileRef.current?.click()}
      >
        {buttonLabel}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        aria-label="Upload background image"
        onChange={handleFile}
      />
      {imageDataUrl && (
        <div className="mt-1.5">
          <img
            src={imageDataUrl}
            className="w-full max-h-20 object-cover rounded-md border border-border"
            alt={alt}
          />
          <button
            className="btn-secondary w-full text-[11px] mt-1"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      )}
    </>
  );
}
