import { useEffect } from 'react';
import { usePreviewStore } from '../store';
import { captureVariantThumbnail } from '../utils/variantThumbnailCapture';

/**
 * Background-fill thumbnails on variant cards. Watches the variants
 * list and schedules a capture for anything with a null/missing
 * `thumbnail` field. Captures run one at a time per variant id via the
 * single-flight queue in variantThumbnailCapture, so this hook can fire
 * on every render without piling work up.
 *
 * Invalidation happens in the store (selectVariant nulls the outgoing
 * variant's thumbnail), not here.
 */
export function useVariantThumbnails(): void {
  const variants = usePreviewStore((s) => s.variants);
  const config = usePreviewStore((s) => s.config);
  const sessionLocales = usePreviewStore((s) => s.sessionLocales);
  const setVariantThumbnail = usePreviewStore((s) => s.setVariantThumbnail);

  useEffect(() => {
    if (!config) return;
    let cancelled = false;
    for (const variant of variants) {
      if (variant.thumbnail) continue;
      // Fire-and-forget. The store action handles writes; a stale
      // variant id at write time just no-ops.
      void captureVariantThumbnail(variant, { config, sessionLocales })
        .then((dataUrl) => {
          if (cancelled) return;
          setVariantThumbnail(variant.id, dataUrl);
        })
        .catch((err) => {
          // Swallow: a failed capture just leaves the placeholder up.
          // The user can switch variants to retry by triggering the
          // selectVariant invalidation path.
          console.warn(`variant thumbnail capture failed for ${variant.id}`, err);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [variants, config, sessionLocales, setVariantThumbnail]);
}
