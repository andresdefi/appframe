import type { AutopilotReviewControls } from '../../store';

function hasPanoramicReviewControlValue(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function countReviewedPanoramicControlVariants(controls: AutopilotReviewControls): number {
  return Object.values(controls).filter((entry) =>
    Boolean(
      entry
      && (
        hasPanoramicReviewControlValue(entry.recipe)
        || hasPanoramicReviewControlValue(entry.continuityMotif)
        || hasPanoramicReviewControlValue(entry.supportSystem)
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
    return 'reviewed screenshot-family state and saved panoramic recipe controls';
  }
  if (hasSemanticOverrides) {
    return 'reviewed screenshot-family state';
  }
  if (hasPanoramicControls) {
    return 'saved panoramic recipe controls';
  }
  return 'reviewed session state';
}
