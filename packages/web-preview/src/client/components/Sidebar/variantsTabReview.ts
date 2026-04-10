import type { AutopilotReviewControls } from '../../store';

function hasPanoramicReviewControlValue(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasPanoramicBeatReviewControls(value: {
  layoutArchetype?: string | null;
  supportSystem?: string | null;
} | undefined): boolean {
  return Boolean(
    value
    && (
      hasPanoramicReviewControlValue(value.layoutArchetype)
      || hasPanoramicReviewControlValue(value.supportSystem)
    ),
  );
}

export function countReviewedPanoramicControlVariants(controls: AutopilotReviewControls): number {
  return Object.values(controls).filter((entry) =>
    Boolean(
      entry
      && (
        hasPanoramicReviewControlValue(entry.recipe)
        || hasPanoramicReviewControlValue(entry.continuityMotif)
        || hasPanoramicReviewControlValue(entry.supportSystem)
        || hasPanoramicReviewControlValue(entry.pacing)
        || hasPanoramicReviewControlValue(entry.proofDensity)
        || hasPanoramicReviewControlValue(entry.decorativeIntensity)
        || hasPanoramicReviewControlValue(entry.surfaceStyle)
        || hasPanoramicReviewControlValue(entry.fontFamily)
        || hasPanoramicReviewControlValue(entry.deviceLayout)
        || hasPanoramicReviewControlValue(entry.textPlacement)
        || hasPanoramicBeatReviewControls(entry.beatOverrides?.open)
        || hasPanoramicBeatReviewControls(entry.beatOverrides?.intensify)
        || hasPanoramicBeatReviewControls(entry.beatOverrides?.resolve)
      ),
    )).length;
}

export function hasReviewedRebuildInputs(args: {
  reviewedSemanticFlavorCount: number;
  reviewedPanoramicControlVariantCount: number;
}): boolean {
  return args.reviewedSemanticFlavorCount > 0 || args.reviewedPanoramicControlVariantCount > 0;
}

export function describeReviewedRebuildInputs(args: {
  reviewedSemanticFlavorCount: number;
  reviewedPanoramicControlVariantCount: number;
}): string {
  const hasSemanticOverrides = args.reviewedSemanticFlavorCount > 0;
  const hasPanoramicControls = args.reviewedPanoramicControlVariantCount > 0;

  if (hasSemanticOverrides && hasPanoramicControls) {
    return 'reviewed screenshot-family state and saved panoramic art-direction controls';
  }
  if (hasSemanticOverrides) {
    return 'reviewed screenshot-family state';
  }
  if (hasPanoramicControls) {
    return 'saved panoramic art-direction controls';
  }
  return 'reviewed session state';
}
