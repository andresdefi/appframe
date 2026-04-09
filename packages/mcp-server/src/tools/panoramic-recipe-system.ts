export type PanoramicRecipeFamily = 'editorial' | 'bold';
export type PanoramicRecipeArchetype =
  | 'confidence'
  | 'wellness'
  | 'workflow'
  | 'conversation'
  | 'gallery'
  | 'world'
  | 'default';
export type PanoramicSupportSystem =
  | 'quote-stack'
  | 'metric-ladder'
  | 'signal-chain'
  | 'milestone-band'
  | 'curation-shelf'
  | 'proof-column';
export type PanoramicRhythmRole = 'open' | 'intensify' | 'resolve';
export type PanoramicContinuityMotif =
  | 'text-rail'
  | 'proof-lane'
  | 'signal-wave'
  | 'progress-track'
  | 'curation-run'
  | 'poster-anchor';

interface PanoramicRecipeMeta {
  family: PanoramicRecipeFamily;
  archetype: PanoramicRecipeArchetype;
}

interface PanoramicRecipeLayoutProfile {
  open: string;
  intensify: string;
  resolve: string;
  relay: string;
}

interface PanoramicRecipeDefaults {
  continuityMotif: PanoramicContinuityMotif;
  supportSystems: Record<PanoramicRhythmRole | 'relay', PanoramicSupportSystem>;
}

export interface PanoramicRecipeProfile {
  recipe: string;
  family: PanoramicRecipeFamily;
  archetype: PanoramicRecipeArchetype;
  defaultContinuityMotif: PanoramicContinuityMotif;
  layouts: PanoramicRecipeLayoutProfile;
  supportSystems: Record<PanoramicRhythmRole | 'relay', PanoramicSupportSystem>;
}

const DEFAULT_RECIPE_META: PanoramicRecipeMeta = { family: 'bold', archetype: 'default' };

const RECIPE_META: Record<string, PanoramicRecipeMeta> = {
  'editorial-panorama': { family: 'editorial', archetype: 'default' },
  'bold-panorama': { family: 'bold', archetype: 'default' },
  'editorial-confidence': { family: 'editorial', archetype: 'confidence' },
  'proof-panorama': { family: 'bold', archetype: 'confidence' },
  'wellness-panorama': { family: 'editorial', archetype: 'wellness' },
  'progress-panorama': { family: 'bold', archetype: 'wellness' },
  'workflow-panorama': { family: 'editorial', archetype: 'workflow' },
  'momentum-panorama': { family: 'bold', archetype: 'workflow' },
  'conversation-panorama': { family: 'editorial', archetype: 'conversation' },
  'launch-panorama': { family: 'bold', archetype: 'conversation' },
  'gallery-panorama': { family: 'editorial', archetype: 'gallery' },
  'portfolio-panorama': { family: 'bold', archetype: 'gallery' },
  'world-panorama': { family: 'editorial', archetype: 'world' },
  'cinematic-panorama': { family: 'bold', archetype: 'world' },
};

const ARCHETYPE_DEFAULTS: Record<PanoramicRecipeArchetype, PanoramicRecipeDefaults> = {
  confidence: {
    continuityMotif: 'proof-lane',
    supportSystems: {
      open: 'metric-ladder',
      intensify: 'proof-column',
      resolve: 'quote-stack',
      relay: 'metric-ladder',
    },
  },
  wellness: {
    continuityMotif: 'progress-track',
    supportSystems: {
      open: 'milestone-band',
      intensify: 'metric-ladder',
      resolve: 'milestone-band',
      relay: 'milestone-band',
    },
  },
  workflow: {
    continuityMotif: 'progress-track',
    supportSystems: {
      open: 'milestone-band',
      intensify: 'metric-ladder',
      resolve: 'milestone-band',
      relay: 'milestone-band',
    },
  },
  conversation: {
    continuityMotif: 'signal-wave',
    supportSystems: {
      open: 'signal-chain',
      intensify: 'signal-chain',
      resolve: 'signal-chain',
      relay: 'signal-chain',
    },
  },
  gallery: {
    continuityMotif: 'curation-run',
    supportSystems: {
      open: 'curation-shelf',
      intensify: 'curation-shelf',
      resolve: 'curation-shelf',
      relay: 'curation-shelf',
    },
  },
  world: {
    continuityMotif: 'poster-anchor',
    supportSystems: {
      open: 'curation-shelf',
      intensify: 'curation-shelf',
      resolve: 'curation-shelf',
      relay: 'curation-shelf',
    },
  },
  default: {
    continuityMotif: 'text-rail',
    supportSystems: {
      open: 'quote-stack',
      intensify: 'proof-column',
      resolve: 'quote-stack',
      relay: 'metric-ladder',
    },
  },
};

const ARCHETYPE_LAYOUTS: Record<
  PanoramicRecipeArchetype,
  Record<PanoramicRecipeFamily, PanoramicRecipeLayoutProfile>
> = {
  confidence: {
    editorial: {
      open: 'proof-opener',
      intensify: 'proof-bridge',
      resolve: 'quiet-proof-close',
      relay: 'detail-relay',
    },
    bold: {
      open: 'campaign-proof-opener',
      intensify: 'trust-punch',
      resolve: 'campaign-proof-close',
      relay: 'proof-relay',
    },
  },
  wellness: {
    editorial: {
      open: 'airy-opener',
      intensify: 'proof-bridge',
      resolve: 'soft-close',
      relay: 'gentle-relay',
    },
    bold: {
      open: 'momentum-opener',
      intensify: 'proof-punch',
      resolve: 'payoff-close',
      relay: 'progress-relay',
    },
  },
  workflow: {
    editorial: {
      open: 'text-rail-opener',
      intensify: 'step-proof-bridge',
      resolve: 'control-close',
      relay: 'step-relay',
    },
    bold: {
      open: 'task-poster-opener',
      intensify: 'proof-rail-punch',
      resolve: 'decisive-close',
      relay: 'staggered-task-relay',
    },
  },
  conversation: {
    editorial: {
      open: 'split-opener',
      intensify: 'response-proof-bridge',
      resolve: 'echo-close',
      relay: 'signal-relay',
    },
    bold: {
      open: 'signal-opener',
      intensify: 'momentum-proof-punch',
      resolve: 'crowd-close',
      relay: 'signal-surge-relay',
    },
  },
  gallery: {
    editorial: {
      open: 'gallery-opener',
      intensify: 'gallery-proof-bridge',
      resolve: 'gallery-close',
      relay: 'gallery-relay',
    },
    bold: {
      open: 'showcase-opener',
      intensify: 'showcase-proof-punch',
      resolve: 'portfolio-close',
      relay: 'showcase-relay',
    },
  },
  world: {
    editorial: {
      open: 'poster-opener',
      intensify: 'world-proof-bridge',
      resolve: 'atmosphere-close',
      relay: 'world-relay',
    },
    bold: {
      open: 'cinematic-opener',
      intensify: 'cinematic-proof-punch',
      resolve: 'trailer-close',
      relay: 'cinematic-relay',
    },
  },
  default: {
    editorial: {
      open: 'editorial-opener',
      intensify: 'proof-bridge',
      resolve: 'quiet-close',
      relay: 'editorial-relay',
    },
    bold: {
      open: 'campaign-opener',
      intensify: 'proof-punch',
      resolve: 'payoff-close',
      relay: 'campaign-relay',
    },
  },
};

export function panoramicRecipeFamily(recipe: string): PanoramicRecipeFamily {
  return (RECIPE_META[recipe] ?? DEFAULT_RECIPE_META).family;
}

export function panoramicRecipeArchetype(recipe: string): PanoramicRecipeArchetype {
  return (RECIPE_META[recipe] ?? DEFAULT_RECIPE_META).archetype;
}

export function getPanoramicRecipeProfile(recipe: string): PanoramicRecipeProfile {
  const meta = RECIPE_META[recipe] ?? DEFAULT_RECIPE_META;
  const defaults = ARCHETYPE_DEFAULTS[meta.archetype];
  return {
    recipe,
    family: meta.family,
    archetype: meta.archetype,
    defaultContinuityMotif: defaults.continuityMotif,
    layouts: ARCHETYPE_LAYOUTS[meta.archetype][meta.family],
    supportSystems: defaults.supportSystems,
  };
}

export function resolvePanoramicRhythmRole(args: {
  storyBeat: string;
  index: number;
  total: number;
}): PanoramicRhythmRole {
  if (args.storyBeat === 'hero' || args.index === 0) return 'open';
  if (args.storyBeat === 'summary' || args.index === args.total - 1) return 'resolve';
  return 'intensify';
}

export function resolvePanoramicLayoutArchetype(args: {
  recipe: string;
  storyBeat: string;
  index: number;
  total: number;
}): string {
  return resolvePanoramicLayoutArchetypeForFamily({
    ...args,
    family: getPanoramicRecipeProfile(args.recipe).family,
  });
}

export function resolvePanoramicLayoutArchetypeForFamily(args: {
  recipe: string;
  family: PanoramicRecipeFamily;
  storyBeat: string;
  index: number;
  total: number;
}): string {
  const profile = getPanoramicRecipeProfile(args.recipe);
  const rhythmRole = resolvePanoramicRhythmRole(args);
  const layouts = ARCHETYPE_LAYOUTS[profile.archetype][args.family];

  if (args.storyBeat === 'trust') return layouts.intensify;
  if (rhythmRole === 'open') return layouts.open;
  if (rhythmRole === 'resolve') return layouts.resolve;
  return layouts.relay;
}

export function defaultPanoramicSupportSystem(args: {
  recipe: string;
  storyBeat: string;
  index: number;
  total: number;
}): PanoramicSupportSystem {
  const profile = getPanoramicRecipeProfile(args.recipe);
  const rhythmRole = resolvePanoramicRhythmRole(args);

  if (args.storyBeat === 'trust') return profile.supportSystems.intensify;
  if (rhythmRole === 'open') return profile.supportSystems.open;
  if (rhythmRole === 'resolve') return profile.supportSystems.resolve;
  return profile.supportSystems.relay;
}

export function panoramicSupportSystemLabel(system: PanoramicSupportSystem): string {
  switch (system) {
    case 'quote-stack':
      return 'quote stack';
    case 'metric-ladder':
      return 'metric ladder';
    case 'signal-chain':
      return 'signal chain';
    case 'milestone-band':
      return 'milestone band';
    case 'curation-shelf':
      return 'curation shelf';
    case 'proof-column':
      return 'proof column';
  }
}

export function panoramicContinuityMotifLabel(motif: PanoramicContinuityMotif): string {
  switch (motif) {
    case 'text-rail':
      return 'text rail';
    case 'proof-lane':
      return 'proof lane';
    case 'signal-wave':
      return 'signal wave';
    case 'progress-track':
      return 'progress track';
    case 'curation-run':
      return 'curation run';
    case 'poster-anchor':
      return 'poster anchor';
  }
}
