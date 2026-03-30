export type CopySlot = 'hero' | 'differentiator' | 'feature' | 'trust' | 'summary';

export interface CopyCandidate {
  id: string;
  slot: CopySlot;
  headline: string;
  sourceFeature?: string;
  wordCount: number;
  score: number;
  rationale: string[];
  issues: string[];
}

export interface CopySlotCandidates {
  slot: CopySlot;
  sourceFeature?: string;
  candidates: CopyCandidate[];
}

export interface CopyCandidateSet {
  appName: string;
  category: string;
  generatedAt: string;
  rules: string[];
  narrative: string[];
  slots: CopySlotCandidates[];
}

export interface CopyScreenSignal {
  slot?: CopySlot;
  sourceRole?: string;
  density?: 'minimal' | 'balanced' | 'dense';
  textRisk?: 'low' | 'medium' | 'high';
  focus?: string;
  unsafeForTextOverlay?: boolean;
  topQuietRatio?: number;
  focusStrength?: number;
  copyDirection?: string;
}

export interface SelectedCopySet {
  hero: CopyCandidate;
  differentiator: CopyCandidate;
  features: CopyCandidate[];
  trust?: CopyCandidate;
  summary: CopyCandidate;
}

const GENERIC_WORDS = new Set([
  'better',
  'best',
  'amazing',
  'powerful',
  'simple',
  'smart',
  'effortless',
  'ultimate',
  'easy',
  'seamless',
]);

const SLOT_RULES = [
  'One idea per headline.',
  'Prefer 3 to 5 words.',
  'Avoid "and" joining two benefits.',
  'Reject vague or generic filler.',
  'Optimize for thumbnail readability.',
];

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'copy';
}

function normalizePhrase(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toHeadline(value: string): string {
  const words = normalizePhrase(value).split(' ').filter(Boolean).slice(0, 5);
  if (words.length === 0) return 'Make the value clear';
  if (words.length <= 3) return words.join(' ');
  return `${words.slice(0, 2).join(' ')}\n${words.slice(2).join(' ')}`;
}

function compactFeature(feature: string): string {
  const cleaned = normalizePhrase(feature);
  if (!cleaned) return 'Core workflow';

  const words = cleaned.split(' ');
  if (words.length <= 4) return cleaned;

  return words.slice(0, 4).join(' ');
}

function buildRoleAwarePhrases(signal: CopyScreenSignal | undefined, fallback: string): string[] {
  const focus = compactFeature(signal?.focus ?? fallback);
  switch (signal?.sourceRole) {
    case 'workflow':
      return [`Plan ${focus.toLowerCase()} fast`, `Do ${focus.toLowerCase()} clearly`];
    case 'detail':
      return [`See ${focus.toLowerCase()} clearly`, `${focus} at a glance`];
    case 'discovery':
      return [`Explore ${focus.toLowerCase()} fast`, `Find ${focus.toLowerCase()} easily`];
    case 'communication':
      return [`Chat ${focus.toLowerCase()} fast`, `${focus} with context`];
    case 'paywall':
      return [`Unlock ${focus.toLowerCase()} clearly`, `See the value fast`];
    case 'home':
      return [`Everything in one view`, `${focus} in one place`];
    default:
      return [`${focus}`, `${focus} in focus`];
  }
}

function signalSlotForIndex(index: number, total: number): CopySlot {
  if (index === 0) return 'hero';
  if (index === 1) return 'differentiator';
  if (index === total - 1) return 'summary';
  if (index === total - 2 && total > 3) return 'trust';
  return 'feature';
}

function resolveSignalsBySlot(
  screenSignals: CopyScreenSignal[] | undefined,
  featureSlots: number,
): {
  hero?: CopyScreenSignal;
  differentiator?: CopyScreenSignal;
  trust?: CopyScreenSignal;
  summary?: CopyScreenSignal;
  features: CopyScreenSignal[];
} {
  if (!screenSignals || screenSignals.length === 0) {
    return { features: [] };
  }

  const assigned = screenSignals.map((signal, index) => ({
    ...signal,
    slot: signal.slot ?? signalSlotForIndex(index, screenSignals.length),
  }));

  return {
    hero: assigned.find((signal) => signal.slot === 'hero'),
    differentiator: assigned.find((signal) => signal.slot === 'differentiator'),
    trust: assigned.find((signal) => signal.slot === 'trust'),
    summary: assigned.find((signal) => signal.slot === 'summary'),
    features: assigned.filter((signal) => signal.slot === 'feature').slice(0, featureSlots),
  };
}

function buildHeroPhrases(
  appName: string,
  appDescription: string,
  features: string[],
  signal?: CopyScreenSignal,
): string[] {
  const firstFeature = compactFeature(signal?.focus ?? features[0] ?? '');
  const description = normalizePhrase(appDescription);
  return [
    ...buildRoleAwarePhrases(signal, firstFeature || appName),
    `${appName} made clear`,
    `Your ${firstFeature.toLowerCase()}`,
    `${description.split(' ').slice(0, 4).join(' ')}`,
    `Do ${firstFeature.toLowerCase()} faster`,
  ];
}

function buildDifferentiatorPhrases(
  features: string[],
  goals: string[],
  signal?: CopyScreenSignal,
): string[] {
  const firstFeature = compactFeature(signal?.focus ?? features[0] ?? goals[0] ?? 'Core workflow');
  const secondFeature = compactFeature(features[1] ?? goals[1] ?? firstFeature);
  return [
    ...(signal?.unsafeForTextOverlay ? [`${firstFeature} without clutter`] : []),
    ...(signal?.density === 'minimal' ? [`${firstFeature} without noise`] : []),
    ...buildRoleAwarePhrases(signal, firstFeature),
    `${firstFeature} without friction`,
    `${firstFeature} with focus`,
    `${secondFeature} in context`,
    `Built around ${firstFeature.toLowerCase()}`,
  ];
}

function buildFeaturePhrases(feature: string, signal?: CopyScreenSignal): string[] {
  const compact = compactFeature(signal?.focus ?? feature);
  const lower = compact.toLowerCase();
  return [
    ...buildRoleAwarePhrases(signal, compact),
    `${compact}`,
    `${compact} at a glance`,
    signal?.unsafeForTextOverlay ? `${compact} without clutter` : `${compact} without noise`,
    `Keep ${lower} moving`,
  ];
}

function buildTrustPhrases(category: string, appName: string, signal?: CopyScreenSignal): string[] {
  switch (category) {
    case 'finance':
      return [
        ...(signal?.focus ? [`Trust ${compactFeature(signal.focus).toLowerCase()} daily`] : []),
        'Built for daily trust',
        `${appName} feels calm`,
        'Clear money decisions',
      ];
    case 'health':
    case 'wellness':
      return [
        ...(signal?.focus ? [`Keep ${compactFeature(signal.focus).toLowerCase()} steady`] : []),
        'Gentle daily progress',
        'Designed for consistency',
        'A calmer routine',
      ];
    case 'productivity':
      return [
        ...(signal?.focus ? [`Keep ${compactFeature(signal.focus).toLowerCase()} on track`] : []),
        'Stay in control',
        'Made for repeat use',
        'Focus without friction',
      ];
    default:
      return [
        ...(signal?.focus ? [`Use ${compactFeature(signal.focus).toLowerCase()} daily`] : []),
        'Made for repeat use',
        'Crafted for every day',
        `${appName} feels polished`,
      ];
  }
}

function buildSummaryPhrases(
  features: string[],
  goals: string[],
  signal?: CopyScreenSignal,
): string[] {
  const items = [signal?.focus ?? '', ...features, ...goals].map(compactFeature).filter(Boolean);
  const first = items[0] ?? 'Core features';
  const second = items[1] ?? 'everyday use';
  return [
    ...(signal?.focus ? [`${first} in one place`] : []),
    `${first} and more`,
    `${first} in one place`,
    `${second} without noise`,
    'Everything that matters',
  ];
}

export function scoreHeadline(
  headline: string,
  slot: CopySlot,
  sourceFeature?: string,
): Omit<CopyCandidate, 'id' | 'slot' | 'headline' | 'sourceFeature'> {
  const normalized = headline.replace(/\n/g, ' ').trim();
  const words = normalized.split(/\s+/).filter(Boolean);
  const lowered = words.map((word) => word.toLowerCase());
  const issues: string[] = [];
  const rationale: string[] = [];
  let score = 72;

  if (words.length >= 3 && words.length <= 5) {
    score += 12;
    rationale.push('Fits the 3-5 word target.');
  } else {
    issues.push('Outside the preferred 3-5 word range.');
    score -= Math.abs(4 - words.length) * 7;
  }

  if (lowered.includes('and')) {
    issues.push('Uses "and", which usually joins multiple ideas.');
    score -= 18;
  }

  const genericCount = lowered.filter((word) => GENERIC_WORDS.has(word)).length;
  if (genericCount > 0) {
    issues.push('Contains generic marketing language.');
    score -= genericCount * 10;
  }

  if (new Set(lowered).size !== lowered.length) {
    issues.push('Repeats words.');
    score -= 6;
  }

  if (slot === 'feature' && sourceFeature) {
    const featureWords = new Set(normalizePhrase(sourceFeature).toLowerCase().split(' ').filter(Boolean));
    const overlap = lowered.filter((word) => featureWords.has(word)).length;
    if (overlap >= 1) {
      score += 8;
      rationale.push('Stays grounded in the source feature.');
    } else {
      issues.push('Feels disconnected from the feature being sold.');
      score -= 10;
    }
  }

  if (slot === 'hero' && words.length <= 4) {
    score += 4;
    rationale.push('Reads quickly at thumbnail size.');
  }

  return {
    wordCount: words.length,
    score: Math.max(0, Math.min(100, score)),
    rationale,
    issues,
  };
}

function buildCandidates(slot: CopySlot, phrases: string[], sourceFeature?: string): CopyCandidate[] {
  const deduped = Array.from(new Set(phrases.map((phrase) => toHeadline(phrase)).filter(Boolean)));
  return deduped
    .map((headline, index) => ({
      id: `${slot}-${slugify(sourceFeature ?? headline)}-${index + 1}`,
      slot,
      headline,
      sourceFeature,
      ...scoreHeadline(headline, slot, sourceFeature),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 4);
}

export function generateCopyCandidates(args: {
  appName: string;
  appDescription: string;
  category: string;
  features: string[];
  goals?: string[];
  screenshotCount?: number;
  screenSignals?: CopyScreenSignal[];
}): CopyCandidateSet {
  const goals = args.goals ?? [];
  const featureSlots = Math.max(1, Math.min(args.features.length || 1, Math.max((args.screenshotCount ?? 4) - 3, 1)));
  const slotSignals = resolveSignalsBySlot(args.screenSignals, featureSlots);
  const narrative = [
    'Lead with the primary outcome.',
    'Reinforce the differentiator.',
    'Spend the middle slides on feature proof.',
    'Close with trust and a concise summary.',
  ];

  const slots: CopySlotCandidates[] = [
    {
      slot: 'hero',
      candidates: buildCandidates(
        'hero',
        buildHeroPhrases(args.appName, args.appDescription, args.features, slotSignals.hero),
      ),
    },
    {
      slot: 'differentiator',
      candidates: buildCandidates(
        'differentiator',
        buildDifferentiatorPhrases(args.features, goals, slotSignals.differentiator),
      ),
    },
    ...Array.from({ length: featureSlots }, (_value, index) => {
      const feature = args.features[index] ?? args.features[0] ?? args.appDescription;
      return {
        slot: 'feature' as const,
        sourceFeature: feature,
        candidates: buildCandidates('feature', buildFeaturePhrases(feature, slotSignals.features[index]), feature),
      };
    }),
    {
      slot: 'trust',
      candidates: buildCandidates('trust', buildTrustPhrases(args.category, args.appName, slotSignals.trust)),
    },
    {
      slot: 'summary',
      candidates: buildCandidates('summary', buildSummaryPhrases(args.features, goals, slotSignals.summary)),
    },
  ];

  return {
    appName: args.appName,
    category: args.category,
    generatedAt: new Date().toISOString(),
    rules: SLOT_RULES,
    narrative,
    slots,
  };
}

export function selectCopySet(candidateSet: CopyCandidateSet): SelectedCopySet {
  const hero = candidateSet.slots.find((slot) => slot.slot === 'hero')?.candidates[0];
  const differentiator = candidateSet.slots.find((slot) => slot.slot === 'differentiator')?.candidates[0];
  const trust = candidateSet.slots.find((slot) => slot.slot === 'trust')?.candidates[0];
  const summary = candidateSet.slots.find((slot) => slot.slot === 'summary')?.candidates[0];
  const features = candidateSet.slots
    .filter((slot) => slot.slot === 'feature')
    .map((slot) => slot.candidates[0])
    .filter((candidate): candidate is CopyCandidate => Boolean(candidate));

  if (!hero || !differentiator || !summary || features.length === 0) {
    throw new Error('Copy candidate set is incomplete and cannot be selected.');
  }

  return {
    hero,
    differentiator,
    features,
    trust,
    summary,
  };
}
