import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@appframe/core', () => ({
  validateConfigOrThrow: vi.fn((config: unknown) => config),
}));

import { buildSessionSavePayload, usePreviewStore } from './store';
import { mergeSessionSaveRequest } from '../sessionPersistence';

function resetStore() {
  usePreviewStore.setState({
    config: null,
    sessionLocales: {},
    variants: [],
    activeVariantId: null,
    recommendedVariantId: null,
    recommendationReason: null,
    autopilotAnalysis: [],
    autopilotSelectedCopySet: null,
    autopilotConceptPlan: null,
    autopilotRefinementHistory: [],
    sessionSaveBaseline: null,
    sessionBacked: false,
    platform: 'iphone',
    previewW: 400,
    previewH: 868,
    selectedScreen: 0,
    activeTab: 'background',
    locale: 'default',
    previewBg: 'dark',
    renderVersion: 0,
    isPanoramic: false,
    panoramicFrameCount: 5,
    panoramicBackground: { type: 'solid', color: '#ffffff', layers: [] },
    panoramicElements: [],
    panoramicEffects: { spotlight: null, annotations: [], overlays: [] },
    selectedElementIndex: null,
    fonts: [],
    frames: [],
    deviceFamilies: [],
    koubouAvailable: false,
    sizes: {},
    exportSize: '',
    exportRenderer: 'playwright',
    screens: [],
    isSavingSession: false,
  });
}

function makeIndividualConfig() {
  return {
    mode: 'individual',
    app: {
      name: 'FocusFlow',
      description: 'Stay on top of your routine',
      platforms: ['ios'],
      features: ['Daily planning', 'Habit tracking'],
    },
    theme: {
      style: 'minimal',
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
    frames: { style: 'flat' },
    screens: [
      {
        screenshot: 'screenshots/home.png',
        headline: 'Plan each day with clarity',
        subtitle: 'Organize what matters first',
        layout: 'center',
        composition: 'single',
        autoSizeHeadline: true,
        autoSizeSubtitle: false,
        annotations: [],
      },
      {
        screenshot: 'screenshots/habits.png',
        headline: 'Track habits that stick',
        subtitle: 'Keep momentum visible',
        layout: 'angled-right',
        composition: 'single',
        autoSizeHeadline: true,
        autoSizeSubtitle: false,
        annotations: [],
      },
    ],
    output: {
      platforms: ['ios'],
      directory: './output',
    },
  };
}

function makePanoramicConfig() {
  return {
    ...makeIndividualConfig(),
    mode: 'panoramic',
    theme: {
      style: 'editorial',
      colors: {
        primary: '#A78BFA',
        secondary: '#38BDF8',
        background: '#0F172A',
        text: '#F8FAFC',
        subtitle: '#CBD5E1',
      },
      font: 'inter',
      fontWeight: 700,
    },
    frames: { style: 'flat' },
    frameCount: 4,
    panoramic: {
      background: {
        type: 'solid',
        color: '#0F172A',
        layers: [{ type: 'solid', color: '#1E293B', opacity: 0.8 }],
      },
      elements: [
        {
          type: 'device',
          screenshot: 'screenshots/home.png',
          frame: 'iphone-16',
          frameStyle: 'flat',
          x: 8,
          y: 22,
          width: 16,
          rotation: 0,
          z: 5,
        },
        {
          type: 'text',
          content: 'Own your day',
          x: 5,
          y: 6,
          fontSize: 4,
          color: '#F8FAFC',
          fontWeight: 700,
          fontStyle: 'normal',
          textAlign: 'left',
          lineHeight: 1.1,
          maxWidth: 18,
          z: 10,
        },
        {
          type: 'proof-chip',
          x: 74,
          y: 72,
          width: 18,
          height: 10,
          value: '12 day streak',
          valueSize: 2.2,
          detail: 'Built for repeat use',
          detailSize: 1.3,
          backgroundColor: '#1E293B',
          borderColor: '#334155',
          color: '#F8FAFC',
          mutedColor: '#CBD5E1',
          z: 12,
        },
      ],
    },
  };
}

function makeSession(
  config: ReturnType<typeof makeIndividualConfig> | ReturnType<typeof makePanoramicConfig>,
  variantId: string,
  variantName: string,
  autopilotOverrides?: Record<string, unknown>,
) {
  return {
    version: 2,
    sourceConfigPath: '/tmp/source.config.yaml',
    createdAt: '2026-03-20T10:00:00.000Z',
    updatedAt: '2026-03-20T10:00:00.000Z',
    activeVariantId: variantId,
    variants: [
      {
        id: variantId,
        name: variantName,
        description: 'Autopilot concept',
        status: 'draft',
        config,
        artifacts: [],
        previewArtifacts: [],
        copyAssignments: [],
        history: [
          {
            id: 'history-created',
            createdAt: '2026-03-20T10:00:00.000Z',
            type: 'created',
            label: 'Variant created from autopilot plan',
          },
        ],
        provenance: {
          origin: 'autopilot',
          branchDepth: 0,
          note: 'Generated from autopilot.',
        },
      },
    ],
    autopilot: {
      mode: 'autopilot',
      recommendedVariantId: variantId,
      recommendationReason: 'Strong hierarchy',
      refinementHistory: [],
      ...autopilotOverrides,
    },
  };
}

describe('preview session refinement round-trips', () => {
  beforeEach(() => {
    resetStore();
  });

  it('round-trips an AI-backed panoramic refinement branch without losing parent-derived config', () => {
    const fallbackConfig = makeIndividualConfig();
    const panoramicSession = makeSession(makePanoramicConfig(), 'concept-d', 'Bold Panorama');

    usePreviewStore.getState().hydrateSession(panoramicSession as any);
    usePreviewStore.getState().applyAiRefinementPlanToActive({
      prompt: 'Make this more premium but reduce overlap',
      label: 'AI refinement: premium panorama',
      detail: 'Used premium styling and overlap reduction to keep the strip more editorial.',
      actions: ['premium', 'reduce-overlap'],
      nameSuggestion: 'Bold Panorama Premium',
      referenceVariantName: 'Editorial Panorama',
    });

    const state = usePreviewStore.getState();
    expect(state.activeVariantId).not.toBe('concept-d');

    const payload = buildSessionSavePayload({
      activeVariantId: state.activeVariantId!,
      recommendedVariantId: state.recommendedVariantId,
      recommendationReason: state.recommendationReason,
      autopilotAnalysis: state.autopilotAnalysis,
      autopilotSelectedCopySet: state.autopilotSelectedCopySet,
      autopilotConceptPlan: state.autopilotConceptPlan,
      autopilotRefinementHistory: state.autopilotRefinementHistory,
      variants: state.variants,
    });

    const mergedSession = mergeSessionSaveRequest({
      session: panoramicSession,
      body: payload,
      fallbackConfig,
      updatedAt: '2026-03-20T12:00:00.000Z',
    });

    const activeVariant = mergedSession.variants.find((variant) => variant.id === payload.activeVariantId)!;
    expect((activeVariant.provenance as { origin?: string }).origin).toBe('refinement');
    expect((activeVariant.config as { theme: { style: string } }).theme.style).toBe('editorial');
    expect((activeVariant.config as { panoramic?: { background?: { color?: string } } }).panoramic?.background?.color).toBe('#F5F0E8');
    expect((activeVariant.editorSnapshot as { panoramicBackground?: { color?: string } }).panoramicBackground?.color).toBe('#F5F0E8');
    expect((activeVariant.history as Array<{ detail?: string }>)[0]?.detail).toContain('Prompt: Make this more premium but reduce overlap');
    expect((mergedSession.autopilot as { refinementHistory: Array<{ mode?: string; actions?: string[] }> }).refinementHistory[0]).toMatchObject({
      mode: 'ai',
      actions: ['premium', 'reduce-overlap'],
    });

    resetStore();
    usePreviewStore.getState().hydrateSession(mergedSession as any);
    const roundTrippedState = usePreviewStore.getState();
    const roundTrippedVariant = roundTrippedState.variants.find((variant) => variant.id === payload.activeVariantId)!;
    expect(roundTrippedState.activeVariantId).toBe(payload.activeVariantId);
    expect(roundTrippedVariant.provenance?.origin).toBe('refinement');
    expect(roundTrippedVariant.snapshot.panoramicBackground.color).toBe('#F5F0E8');
    expect(roundTrippedState.autopilotRefinementHistory[0]).toMatchObject({
      mode: 'ai',
      actions: ['premium', 'reduce-overlap'],
      referenceVariantName: 'Editorial Panorama',
    });
  });

  it('round-trips a manual refinement branch with locale editor state intact', () => {
    const baseConfig = makeIndividualConfig();
    const individualSession = makeSession(baseConfig, 'concept-a', 'Clean Hero');

    usePreviewStore.getState().hydrateSession(individualSession as any);
    usePreviewStore.getState().upsertLocaleConfig('nb', {
      screens: [
        { headline: 'Planlegg dagen', subtitle: 'Start med det viktigste' },
        { headline: 'Hold vanene i gang', subtitle: 'Se fremgangen tydelig' },
      ],
    });
    usePreviewStore.getState().updateScreen(0, {
      headline: 'Own every plan with clarity',
    });
    usePreviewStore.getState().applyRefinementToActive('shorter-copy');

    const state = usePreviewStore.getState();
    const payload = buildSessionSavePayload({
      activeVariantId: state.activeVariantId!,
      recommendedVariantId: state.recommendedVariantId,
      recommendationReason: state.recommendationReason,
      autopilotAnalysis: state.autopilotAnalysis,
      autopilotSelectedCopySet: state.autopilotSelectedCopySet,
      autopilotConceptPlan: state.autopilotConceptPlan,
      autopilotRefinementHistory: state.autopilotRefinementHistory,
      variants: state.variants,
    });

    const mergedSession = mergeSessionSaveRequest({
      session: individualSession,
      body: payload,
      fallbackConfig: baseConfig,
      updatedAt: '2026-03-20T12:05:00.000Z',
    });

    const activeVariant = mergedSession.variants.find((variant) => variant.id === payload.activeVariantId)!;
    expect((activeVariant.provenance as { origin?: string; parentVariantId?: string }).origin).toBe('refinement');
    expect((activeVariant.provenance as { parentVariantId?: string }).parentVariantId).toBe('concept-a');
    expect((activeVariant.editorSnapshot as {
      screens?: Array<{ headline?: string }>;
      sessionLocales?: Record<string, { screens?: Array<{ headline?: string }> }>;
    }).screens?.[0]?.headline).toBe('Own every plan with');
    expect((activeVariant.editorSnapshot as {
      sessionLocales?: Record<string, { screens?: Array<{ headline?: string }> }>;
    }).sessionLocales?.nb?.screens?.[0]?.headline).toBe('Planlegg dagen');
    expect((mergedSession.autopilot as { refinementHistory: Array<{ mode?: string; actions?: string[] }> }).refinementHistory[0]).toMatchObject({
      mode: 'manual',
      actions: ['shorter-copy'],
    });

    resetStore();
    usePreviewStore.getState().hydrateSession(mergedSession as any);
    const roundTrippedState = usePreviewStore.getState();
    const roundTrippedVariant = roundTrippedState.variants.find((variant) => variant.id === payload.activeVariantId)!;
    expect(roundTrippedVariant.snapshot.screens[0]?.headline).toBe('Own every plan with');
    expect(roundTrippedVariant.snapshot.sessionLocales.nb?.screens?.[0]?.headline).toBe('Planlegg dagen');
    expect(roundTrippedVariant.history[0]?.detail).toContain('Actions: Shorten copy');
    expect(roundTrippedState.autopilotRefinementHistory[0]).toMatchObject({
      mode: 'manual',
      actions: ['shorter-copy'],
    });
  });

  it('persists semantic-family review overrides through session save round-trips', () => {
    const baseConfig = makeIndividualConfig();
    const session = makeSession(baseConfig, 'concept-a', 'Clean Hero', {
      screenshotAnalysis: [
        {
          path: 'screenshots/home.png',
          role: 'detail',
          semanticFlavor: 'reward',
          semanticFlavorConfidence: 'low',
          semanticFlavorReason: ['Reward cues were stronger than the generic detail fallback.'],
          semanticFlavorAlternatives: [
            { flavor: 'reward', score: 5 },
            { flavor: 'commerce', score: 3 },
          ],
          semanticFlavorNeedsReview: true,
          heroPriority: 72,
          inferredOrder: 1,
          focus: 'center',
          unsafeForTextOverlay: false,
        },
      ],
      conceptPlan: {
        selectedScreens: [
          {
            path: 'screenshots/home.png',
            role: 'detail',
            semanticFlavor: 'reward',
            semanticFlavorConfidence: 'low',
            semanticFlavorReason: ['Reward cues were stronger than the generic detail fallback.'],
            semanticFlavorAlternatives: [
              { flavor: 'reward', score: 5 },
              { flavor: 'commerce', score: 3 },
            ],
            semanticFlavorNeedsReview: true,
            inferredOrder: 1,
            unsafeForTextOverlay: false,
          },
        ],
        variants: [],
      },
    });

    usePreviewStore.getState().hydrateSession(session as any);
    usePreviewStore.getState().setAutopilotSemanticFlavorOverride('screenshots/home.png', 'document');

    const state = usePreviewStore.getState();
    expect(state.autopilotAnalysis[0]).toMatchObject({
      semanticFlavor: 'document',
      semanticFlavorOverride: 'document',
      inferredSemanticFlavor: 'reward',
      inferredSemanticFlavorConfidence: 'low',
    });
    expect(state.autopilotConceptPlan?.selectedScreens?.[0]).toMatchObject({
      semanticFlavor: 'document',
      semanticFlavorOverride: 'document',
    });

    const payload = buildSessionSavePayload({
      activeVariantId: state.activeVariantId!,
      recommendedVariantId: state.recommendedVariantId,
      recommendationReason: state.recommendationReason,
      autopilotAnalysis: state.autopilotAnalysis,
      autopilotSelectedCopySet: state.autopilotSelectedCopySet,
      autopilotConceptPlan: state.autopilotConceptPlan,
      autopilotRefinementHistory: state.autopilotRefinementHistory,
      variants: state.variants,
    });

    const mergedSession = mergeSessionSaveRequest({
      session,
      body: payload,
      fallbackConfig: baseConfig,
      updatedAt: '2026-03-20T12:10:00.000Z',
    });

    expect((mergedSession.autopilot as { screenshotAnalysis?: Array<Record<string, unknown>> }).screenshotAnalysis?.[0]).toMatchObject({
      semanticFlavor: 'document',
      semanticFlavorOverride: 'document',
      inferredSemanticFlavor: 'reward',
      semanticFlavorNeedsReview: true,
    });

    resetStore();
    usePreviewStore.getState().hydrateSession(mergedSession as any);
    const roundTrippedState = usePreviewStore.getState();
    expect(roundTrippedState.autopilotAnalysis[0]).toMatchObject({
      semanticFlavor: 'document',
      semanticFlavorOverride: 'document',
      inferredSemanticFlavor: 'reward',
      inferredSemanticFlavorConfidence: 'low',
      semanticFlavorReason: ['Reward cues were stronger than the generic detail fallback.'],
      semanticFlavorAlternatives: [
        { flavor: 'reward', score: 5 },
        { flavor: 'commerce', score: 3 },
      ],
      semanticFlavorNeedsReview: true,
    });
    expect(roundTrippedState.autopilotConceptPlan?.selectedScreens?.[0]).toMatchObject({
      semanticFlavor: 'document',
      semanticFlavorOverride: 'document',
      semanticFlavorNeedsReview: true,
    });
  });

  it('can clear and reset semantic-family review overrides', () => {
    const baseConfig = makeIndividualConfig();
    const session = makeSession(baseConfig, 'concept-a', 'Clean Hero', {
      screenshotAnalysis: [
        {
          path: 'screenshots/home.png',
          role: 'detail',
          semanticFlavor: 'reward',
          semanticFlavorConfidence: 'low',
          heroPriority: 72,
          inferredOrder: 1,
          focus: 'center',
          unsafeForTextOverlay: false,
        },
      ],
      conceptPlan: {
        selectedScreens: [
          {
            path: 'screenshots/home.png',
            role: 'detail',
            semanticFlavor: 'reward',
            semanticFlavorConfidence: 'low',
            inferredOrder: 1,
            unsafeForTextOverlay: false,
          },
        ],
        variants: [],
      },
    });

    usePreviewStore.getState().hydrateSession(session as any);
    usePreviewStore.getState().setAutopilotSemanticFlavorOverride('screenshots/home.png', 'none');
    let state = usePreviewStore.getState();
    expect(state.autopilotAnalysis[0]).toMatchObject({
      semanticFlavor: undefined,
      semanticFlavorOverride: 'none',
      inferredSemanticFlavor: 'reward',
    });

    usePreviewStore.getState().setAutopilotSemanticFlavorOverride('screenshots/home.png', null);
    state = usePreviewStore.getState();
    expect(state.autopilotAnalysis[0]).toMatchObject({
      semanticFlavor: 'reward',
      semanticFlavorConfidence: 'low',
      semanticFlavorOverride: null,
      inferredSemanticFlavor: 'reward',
      inferredSemanticFlavorConfidence: 'low',
    });
    expect(state.autopilotConceptPlan?.selectedScreens?.[0]).toMatchObject({
      semanticFlavor: 'reward',
      semanticFlavorOverride: null,
    });
  });

  it('supports bulk semantic-family review updates and reset', () => {
    const baseConfig = makeIndividualConfig();
    const session = makeSession(baseConfig, 'concept-a', 'Clean Hero', {
      screenshotAnalysis: [
        {
          path: 'screenshots/home.png',
          role: 'detail',
          semanticFlavor: 'reward',
          semanticFlavorConfidence: 'low',
          semanticFlavorNeedsReview: true,
          heroPriority: 72,
          inferredOrder: 1,
          focus: 'center',
          unsafeForTextOverlay: false,
        },
        {
          path: 'screenshots/settings.png',
          role: 'settings',
          semanticFlavor: 'support',
          semanticFlavorConfidence: 'low',
          semanticFlavorNeedsReview: true,
          heroPriority: 30,
          inferredOrder: 2,
          focus: 'controls',
          unsafeForTextOverlay: true,
        },
      ],
      conceptPlan: {
        selectedScreens: [
          {
            path: 'screenshots/home.png',
            role: 'detail',
            semanticFlavor: 'reward',
            semanticFlavorConfidence: 'low',
            semanticFlavorNeedsReview: true,
            inferredOrder: 1,
            unsafeForTextOverlay: false,
          },
          {
            path: 'screenshots/settings.png',
            role: 'settings',
            semanticFlavor: 'support',
            semanticFlavorConfidence: 'low',
            semanticFlavorNeedsReview: true,
            inferredOrder: 2,
            unsafeForTextOverlay: true,
          },
        ],
        variants: [],
      },
    });

    usePreviewStore.getState().hydrateSession(session as any);
    usePreviewStore.getState().setAutopilotSemanticFlavorOverrides(
      ['screenshots/home.png', 'screenshots/settings.png'],
      'none',
    );

    let state = usePreviewStore.getState();
    expect(state.autopilotAnalysis.map((entry) => entry.semanticFlavorOverride)).toEqual(['none', 'none']);
    expect(state.autopilotConceptPlan?.selectedScreens?.map((entry) => entry.semanticFlavorOverride)).toEqual(['none', 'none']);

    usePreviewStore.getState().resetAutopilotSemanticFlavorOverrides();
    state = usePreviewStore.getState();
    expect(state.autopilotAnalysis.map((entry) => entry.semanticFlavorOverride)).toEqual([null, null]);
    expect(state.autopilotAnalysis.map((entry) => entry.semanticFlavor)).toEqual(['reward', 'support']);
    expect(state.autopilotConceptPlan?.selectedScreens?.map((entry) => entry.semanticFlavorOverride)).toEqual([null, null]);
  });
});
