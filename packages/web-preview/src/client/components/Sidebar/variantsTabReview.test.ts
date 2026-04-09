import { describe, expect, it } from 'vitest';
import {
  countReviewedPanoramicControlVariants,
  describeReviewedRebuildInputs,
  hasReviewedRebuildInputs,
} from './variantsTabReview';

describe('variantsTabReview helpers', () => {
  it('counts only panoramic variants with saved review control values', () => {
    expect(countReviewedPanoramicControlVariants({
      'concept-c': {
        recipe: 'cinematic-panorama',
      },
      'concept-d': {
        recipe: '   ',
        continuityMotif: null,
        supportSystem: '',
      },
      'concept-e': {
        pacing: 'calmer',
      },
      'concept-f': undefined,
    })).toBe(2);
  });

  it('reports whether reviewed rebuild inputs exist', () => {
    expect(hasReviewedRebuildInputs({
      reviewedSemanticFlavorCount: 1,
      reviewedPanoramicControlVariantCount: 0,
    })).toBe(true);
    expect(hasReviewedRebuildInputs({
      reviewedSemanticFlavorCount: 0,
      reviewedPanoramicControlVariantCount: 2,
    })).toBe(true);
    expect(hasReviewedRebuildInputs({
      reviewedSemanticFlavorCount: 0,
      reviewedPanoramicControlVariantCount: 0,
    })).toBe(false);
  });

  it('describes the reviewed rebuild source clearly', () => {
    expect(describeReviewedRebuildInputs({
      reviewedSemanticFlavorCount: 2,
      reviewedPanoramicControlVariantCount: 1,
    })).toBe('reviewed screenshot-family state and saved panoramic art-direction controls');
    expect(describeReviewedRebuildInputs({
      reviewedSemanticFlavorCount: 2,
      reviewedPanoramicControlVariantCount: 0,
    })).toBe('reviewed screenshot-family state');
    expect(describeReviewedRebuildInputs({
      reviewedSemanticFlavorCount: 0,
      reviewedPanoramicControlVariantCount: 1,
    })).toBe('saved panoramic art-direction controls');
  });
});
