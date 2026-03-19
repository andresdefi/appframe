import { describe, expect, it } from 'vitest';
import type { AppframeConfig } from '@appframe/core';
import { scoreVariantSet } from './preview-scoring.js';

function makeConfig(mode: 'individual' | 'panoramic', style: AppframeConfig['theme']['style']): AppframeConfig {
  return {
    mode,
    app: {
      name: 'FitFlow',
      description: 'Workout planning',
      platforms: ['ios'],
      features: ['Workout plans'],
    },
    theme: {
      style,
      colors: {
        primary: '#2563EB',
        secondary: '#7C3AED',
        background: '#F8FAFC',
        text: '#0F172A',
        subtitle: '#64748B',
      },
      font: 'inter',
      fontWeight: 600,
    },
    frames: { ios: 'iphone-17-pro', style: mode === 'individual' ? 'flat' : 'flat' },
    screens: mode === 'individual'
      ? [
          {
            screenshot: 'screen-1.png',
            headline: 'Stay on track',
            layout: 'center',
            composition: 'single',
            autoSizeHeadline: true,
            autoSizeSubtitle: false,
            annotations: [],
          },
          {
            screenshot: 'screen-2.png',
            headline: 'Weekly plans ready',
            layout: 'center',
            composition: 'single',
            autoSizeHeadline: true,
            autoSizeSubtitle: false,
            annotations: [],
          },
        ]
      : [],
    ...(mode === 'panoramic'
      ? {
          frameCount: 4,
          panoramic: {
            background: { type: 'solid' as const, color: '#FFFFFF' },
            elements: [
              {
                type: 'text' as const,
                content: 'Stay on track',
                x: 4,
                y: 4,
                fontSize: 4,
                color: '#0F172A',
                fontWeight: 700,
                fontStyle: 'normal' as const,
                textAlign: 'left' as const,
                lineHeight: 1.1,
                maxWidth: 16,
                letterSpacing: 0,
                textTransform: '',
                rotation: 0,
                z: 10,
              },
            ],
          },
        }
      : {}),
    output: {
      platforms: ['ios'],
      ios: { sizes: [6.7], format: 'png' },
      directory: './output',
    },
  };
}

describe('preview scoring', () => {
  it('scores a mixed variant set and recommends one concept', () => {
    const result = scoreVariantSet([
      { id: 'concept-a', name: 'Clean Hero', config: makeConfig('individual', 'minimal'), previewCount: 1 },
      { id: 'concept-c', name: 'Editorial Panorama', config: makeConfig('panoramic', 'editorial'), previewCount: 1 },
    ]);

    expect(result.scored).toHaveLength(2);
    expect(result.recommendedVariantId).toBeTruthy();
    expect(result.scored[0]?.score.total).toBeGreaterThan(0);
  });
});
