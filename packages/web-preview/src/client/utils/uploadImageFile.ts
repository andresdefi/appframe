import { uploadScreenshot } from './api';
import { usePreviewStore } from '../store';

// Resolve the project the upload should land under. Reads from the live
// store so every caller picks up the active project automatically. The
// server's sanitizeProject no longer falls back to a magic slug, so an
// empty activeProject is a real bug — surface it loudly rather than
// silently routing the upload to the wrong place.
function activeProjectName(): string {
  const name = usePreviewStore.getState().activeProject;
  if (!name) {
    throw new Error(
      'cannot upload before a project is active (App.tsx boot has not completed yet)',
    );
  }
  return name;
}

const SUPPORTED_MIME_PREFIXES = ['image/'];
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

export interface ScreenshotImagePatch {
  screenshotDataUrl: string;
  screenshotName: string;
  screenshotDims: { width: number; height: number };
}

export function isSupportedImageFile(file: File): boolean {
  if (file.type && SUPPORTED_MIME_PREFIXES.some((p) => file.type.startsWith(p))) {
    return true;
  }
  const name = file.name.toLowerCase();
  return SUPPORTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result !== 'string') {
        reject(new Error('FileReader returned a non-string result'));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsDataURL(file);
  });
}

function measureImage(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = dataUrl;
  });
}

/**
 * Read a File, measure it, upload to the server, and return the
 * partial-ScreenState patch ready to feed into `updateScreen` /
 * `useCurrentScreen.update`. If the upload fails (server down, etc.),
 * falls back to the in-memory data URL so the user doesn't lose the
 * image they just dropped.
 */
export async function uploadImageFileToScreen(file: File): Promise<ScreenshotImagePatch> {
  const dataUrl = await readFileAsDataUrl(file);
  const dims = await measureImage(dataUrl);
  try {
    const uploaded = await uploadScreenshot({
      filename: file.name,
      dataUrl,
      project: activeProjectName(),
    });
    return {
      screenshotDataUrl: uploaded.url,
      screenshotName: uploaded.filename,
      screenshotDims: dims,
    };
  } catch (err) {
    console.error('Screenshot upload failed, falling back to in-memory data URL', err);
    return {
      screenshotDataUrl: dataUrl,
      screenshotName: file.name,
      screenshotDims: dims,
    };
  }
}

export interface UploadedImage {
  /** Browser-facing URL (e.g. /api/screenshots/<project>/<filename>) or the
   *  original data URL when the server upload failed. */
  url: string;
  filename: string;
}

/**
 * Upload any image file to the project's screenshots directory and return
 * its URL. Used for backgrounds and overlays — anywhere we previously
 * stored a base64 data URL in state. Falls back to the data URL if the
 * server is unavailable so the user doesn't lose the upload mid-flow.
 */
export async function uploadImageFile(file: File): Promise<UploadedImage> {
  const dataUrl = await readFileAsDataUrl(file);
  try {
    const uploaded = await uploadScreenshot({
      filename: file.name,
      dataUrl,
      project: activeProjectName(),
    });
    return { url: uploaded.url, filename: uploaded.filename };
  } catch (err) {
    console.error('Image upload failed, falling back to in-memory data URL', err);
    return { url: dataUrl, filename: file.name };
  }
}
