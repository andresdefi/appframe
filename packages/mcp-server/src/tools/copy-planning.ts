export type CopySlot = 'hero' | 'differentiator' | 'feature' | 'trust' | 'summary';

export interface CopyCandidate {
  id: string;
  slot: CopySlot;
  headline: string;
  subtitle?: string;
  sourceFeature?: string;
  wordCount: number;
  subtitleWordCount?: number;
  score: number;
  rationale: string[];
  issues: string[];
  origin?: 'generated' | 'external';
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

export interface ExternalCopyCandidateInput {
  slot: CopySlot;
  headline: string;
  subtitle?: string;
  sourceFeature?: string;
}

export interface CopyScreenSignal {
  slot?: CopySlot;
  sourceRole?: string;
  density?: 'minimal' | 'balanced' | 'dense';
  textRisk?: 'low' | 'medium' | 'high';
  focus?: string;
  embeddedText?: string[];
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

const OVERLAP_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'at',
  'for',
  'from',
  'in',
  'into',
  'of',
  'on',
  'or',
  'the',
  'to',
  'up',
  'with',
  'your',
]);

const ACTION_WORDS = new Set([
  'be',
  'bring',
  'brings',
  'build',
  'built',
  'chat',
  'choose',
  'clear',
  'close',
  'create',
  'crafted',
  'do',
  'designed',
  'explore',
  'feel',
  'feels',
  'find',
  'focus',
  'keep',
  'keeps',
  'make',
  'made',
  'move',
  'moves',
  'open',
  'own',
  'plan',
  'run',
  'see',
  'shape',
  'show',
  'shows',
  'solve',
  'stay',
  'stays',
  'track',
  'turn',
  'turns',
  'unlock',
  'use',
]);

const STRUCTURE_WORDS = new Set([
  'a',
  'an',
  'around',
  'as',
  'at',
  'by',
  'for',
  'from',
  'in',
  'into',
  'of',
  'on',
  'that',
  'the',
  'through',
  'to',
  'with',
  'without',
  'your',
]);

const BENEFIT_WORDS = new Set([
  'active',
  'all',
  'better',
  'bright',
  'calm',
  'clear',
  'clarity',
  'close',
  'confident',
  'confidence',
  'context',
  'control',
  'daily',
  'easy',
  'easier',
  'fast',
  'faster',
  'focus',
  'focused',
  'gentle',
  'human',
  'immersive',
  'matters',
  'momentum',
  'moving',
  'one',
  'polished',
  'progress',
  'quickly',
  'readable',
  'ready',
  'steady',
  'trust',
  'visible',
  'view',
  'everything',
  'every',
]);

const SLOT_RULES = [
  'One idea per headline.',
  'Pair each headline with a supporting subtitle when possible.',
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

function toSubtitle(value: string | undefined): string | undefined {
  const words = normalizePhrase(value ?? '').split(' ').filter(Boolean).slice(0, 12);
  if (words.length === 0) return undefined;
  return words.join(' ');
}

function compactFeature(feature: string): string {
  const cleaned = normalizePhrase(feature);
  if (!cleaned) return 'Core workflow';

  const words = cleaned.split(' ');
  if (words.length <= 4) return cleaned;

  return words.slice(0, 4).join(' ');
}

function comparisonWords(value: string): string[] {
  return normalizePhrase(value)
    .toLowerCase()
    .split(' ')
    .filter((word) => word.length > 2 && !OVERLAP_STOP_WORDS.has(word));
}

function normalizedEmbeddedPhrases(signal: CopyScreenSignal | undefined): string[] {
  if (!signal?.embeddedText?.length) return [];

  const seen = new Set<string>();
  return signal.embeddedText
    .map((value) => compactFeature(value))
    .filter((value) => {
      const normalized = normalizePhrase(value).toLowerCase();
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    })
    .slice(0, 4);
}

function labelLikeWords(value: string): string[] {
  return normalizePhrase(value)
    .toLowerCase()
    .split(' ')
    .filter((word) => word.length >= 3)
    .filter((word) => !ACTION_WORDS.has(word) && !STRUCTURE_WORDS.has(word) && !BENEFIT_WORDS.has(word));
}

function pluralLabelCount(words: string[]): number {
  return words.filter((word) => word.endsWith('s') && !word.endsWith('ss')).length;
}

function readsLikeFeatureListHeadline(headline: string): boolean {
  const words = normalizePhrase(headline).toLowerCase().split(' ').filter(Boolean);
  if (words.length < 3) return false;

  const labelWords = labelLikeWords(headline);
  if (labelWords.length < Math.max(2, words.length - 1)) return false;

  return pluralLabelCount(labelWords) >= 2 || labelWords.length === words.length;
}

function readsLikeFeatureLabelHeadline(headline: string, sourceFeature?: string): boolean {
  const normalizedHeadline = normalizePhrase(headline).toLowerCase();
  if (!normalizedHeadline) return false;

  const words = normalizedHeadline.split(' ').filter(Boolean);
  const labelWords = labelLikeWords(headline);
  const matchesSourceFeature = Boolean(
    sourceFeature
    && normalizedHeadline === normalizePhrase(sourceFeature).toLowerCase(),
  );

  return matchesSourceFeature
    || (
      words.length >= 2
      && labelWords.length >= words.length - 1
      && !readsLikeFeatureListHeadline(headline)
    );
}

function repeatsEmbeddedText(headline: string, signal: CopyScreenSignal | undefined): boolean {
  const headlineNormalized = normalizePhrase(headline).toLowerCase();
  if (!headlineNormalized) return false;

  const headlineWords = new Set(comparisonWords(headlineNormalized));
  return normalizedEmbeddedPhrases(signal).some((phrase) => {
    const normalizedPhrase = normalizePhrase(phrase).toLowerCase();
    if (!normalizedPhrase) return false;
    if (
      headlineNormalized === normalizedPhrase
      || headlineNormalized.includes(normalizedPhrase)
      || normalizedPhrase.includes(headlineNormalized)
    ) {
      return true;
    }

    const phraseWords = comparisonWords(normalizedPhrase);
    if (phraseWords.length === 0 || headlineWords.size === 0) return false;
    const overlap = phraseWords.filter((word) => headlineWords.has(word)).length;
    return overlap >= Math.min(2, phraseWords.length) && overlap >= Math.min(2, headlineWords.size);
  });
}

function resolveSignalFocus(
  signal: CopyScreenSignal | undefined,
  preferred: string,
  fallback: string,
): string {
  const preferredFocus = compactFeature(preferred);
  if (!preferredFocus) return compactFeature(fallback);
  if (!repeatsEmbeddedText(preferredFocus, signal)) return preferredFocus;
  return compactFeature(fallback) || preferredFocus;
}

function buildRoleAwarePhrases(signal: CopyScreenSignal | undefined, focusSource: string): string[] {
  const focus = compactFeature(focusSource);
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

function buildCategoryHeroPhrases(
  category: string,
  focus: string,
  appName: string,
): string[] {
  const lower = focus.toLowerCase();
  switch (category) {
    case 'finance':
      return ['See your money clearly', `Run ${lower} with clarity`, 'Calm money decisions'];
    case 'health':
    case 'wellness':
      return ['Build steady progress', `Keep ${lower} steady`, 'Feel your progress'];
    case 'productivity':
      return ['Run your day clearly', `Keep ${lower} moving`, 'Stay on top daily'];
    case 'social':
      return ['Keep every thread close', `Stay in ${lower}`, `${appName} keeps up`];
    case 'creative':
      return ['Shape ideas visually', `Bring ${lower} forward`, 'Create without drag'];
    case 'games':
      return ['Jump into the action', `Keep ${lower} flowing`, 'Stay in the game'];
    default:
      return [];
  }
}

function buildCategoryDifferentiatorPhrases(
  category: string,
  firstFeature: string,
  secondFeature: string,
): string[] {
  const secondLower = secondFeature.toLowerCase();
  switch (category) {
    case 'finance':
      return [`${firstFeature} with confidence`, `${secondFeature} with context`];
    case 'health':
    case 'wellness':
      return [`${firstFeature} with calm`, `${secondFeature} without pressure`];
    case 'productivity':
      return [`${firstFeature} with control`, `${secondFeature} without drift`];
    case 'social':
      return [`${firstFeature} with context`, `Keep ${secondLower} flowing`];
    case 'creative':
      return [`${firstFeature} with polish`, `See ${secondLower} clearly`];
    case 'games':
      return [`${firstFeature} with momentum`, `Keep ${secondLower} alive`];
    default:
      return [`${firstFeature} with clarity`, `Keep ${secondLower} moving`];
  }
}

function buildCategoryFeaturePhrases(category: string, feature: string): string[] {
  const lower = feature.toLowerCase();
  switch (category) {
    case 'finance':
      return [`Keep ${lower} visible`, `${feature} with confidence`];
    case 'health':
    case 'wellness':
      return [`Keep ${lower} steady`, `${feature} that sticks`];
    case 'productivity':
      return [`Move ${lower} faster`, `${feature} without drag`];
    case 'social':
      return [`Keep ${lower} active`, `${feature} in context`];
    case 'creative':
      return [`Show ${lower} beautifully`, `${feature} with polish`];
    case 'games':
      return [`Push ${lower} further`, `${feature} with momentum`];
    default:
      return [];
  }
}

function buildCategorySummaryPhrases(
  category: string,
  first: string,
  second: string,
): string[] {
  switch (category) {
    case 'finance':
      return ['All your money clarity', `${first} with calm`, `${second} with confidence`];
    case 'health':
    case 'wellness':
      return ['Progress that feels steady', `${first} for every day`, `${second} with ease`];
    case 'productivity':
      return ['Everything stays on track', `${first} for the day`, `${second} with control`];
    case 'social':
      return ['Everything stays in sync', `${first} for every thread`, `${second} without lag`];
    case 'creative':
      return ['Everything stays in flow', `${first} for every idea`, `${second} with polish`];
    case 'games':
      return ['Everything stays in play', `${first} for the run`, `${second} with momentum`];
    default:
      return [];
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
  category: string,
  features: string[],
  signal?: CopyScreenSignal,
): string[] {
  const firstFeature = resolveSignalFocus(signal, signal?.focus ?? features[0] ?? '', features[0] ?? appName);
  const description = normalizePhrase(appDescription);
  return [
    ...buildRoleAwarePhrases(signal, firstFeature || appName),
    ...buildCategoryHeroPhrases(category, firstFeature || appName, appName),
    `${appName} made clear`,
    `Your ${firstFeature.toLowerCase()}`,
    `${description.split(' ').slice(0, 4).join(' ')}`,
    `Do ${firstFeature.toLowerCase()} faster`,
  ];
}

function buildDifferentiatorPhrases(
  category: string,
  features: string[],
  goals: string[],
  signal?: CopyScreenSignal,
): string[] {
  const fallbackFeature = features[0] ?? goals[0] ?? 'Core workflow';
  const firstFeature = resolveSignalFocus(signal, signal?.focus ?? fallbackFeature, fallbackFeature);
  const secondFeature = compactFeature(features[1] ?? goals[1] ?? firstFeature);
  return [
    ...(signal?.unsafeForTextOverlay ? [`${firstFeature} without clutter`] : []),
    ...(signal?.density === 'minimal' ? [`${firstFeature} without noise`] : []),
    ...buildRoleAwarePhrases(signal, firstFeature),
    ...buildCategoryDifferentiatorPhrases(category, firstFeature, secondFeature),
    `${firstFeature} without friction`,
    `${firstFeature} with focus`,
    `${secondFeature} in context`,
    `Built around ${firstFeature.toLowerCase()}`,
  ];
}

function buildFeaturePhrases(category: string, feature: string, signal?: CopyScreenSignal): string[] {
  const compact = resolveSignalFocus(signal, signal?.focus ?? feature, feature);
  const lower = compact.toLowerCase();
  return [
    ...buildRoleAwarePhrases(signal, compact),
    ...buildCategoryFeaturePhrases(category, compact),
    `${compact}`,
    `${compact} at a glance`,
    signal?.unsafeForTextOverlay ? `${compact} without clutter` : `${compact} without noise`,
    `Keep ${lower} moving`,
  ];
}

function buildTrustPhrases(category: string, appName: string, signal?: CopyScreenSignal): string[] {
  const focus = signal?.focus
    ? resolveSignalFocus(signal, signal.focus, appName)
    : '';
  switch (category) {
    case 'finance':
      return [
        ...(focus ? [`Trust ${focus.toLowerCase()} daily`] : []),
        'Built for daily trust',
        `${appName} feels calm`,
        'Clear money decisions',
      ];
    case 'health':
    case 'wellness':
      return [
        ...(focus ? [`Keep ${focus.toLowerCase()} steady`] : []),
        'Gentle daily progress',
        'Designed for consistency',
        'A calmer routine',
      ];
    case 'productivity':
      return [
        ...(focus ? [`Keep ${focus.toLowerCase()} on track`] : []),
        'Stay in control',
        'Made for repeat use',
        'Focus without friction',
      ];
    default:
      return [
        ...(focus ? [`Use ${focus.toLowerCase()} daily`] : []),
        'Made for repeat use',
        'Crafted for every day',
        `${appName} feels polished`,
      ];
  }
}

function buildSummaryPhrases(
  category: string,
  features: string[],
  goals: string[],
  signal?: CopyScreenSignal,
): string[] {
  const focus = signal?.focus
    ? resolveSignalFocus(signal, signal.focus, features[0] ?? goals[0] ?? 'Core features')
    : '';
  const items = [focus, ...features, ...goals].map(compactFeature).filter(Boolean);
  const first = items[0] ?? 'Core features';
  const second = items[1] ?? 'everyday use';
  return [
    ...buildCategorySummaryPhrases(category, first, second),
    ...(focus ? [`${first} in one place`] : []),
    `${first} and more`,
    `${first} in one place`,
    `${second} without noise`,
    'Everything that matters',
  ];
}

function buildHeroSubtitles(
  category: string,
  features: string[],
  signal?: CopyScreenSignal,
): string[] {
  const focus = resolveSignalFocus(signal, signal?.focus ?? features[0] ?? 'core workflow', features[0] ?? 'core workflow');
  const lower = focus.toLowerCase();
  switch (category) {
    case 'finance':
      return [
        'See balances, budgets, and spending in one calmer view.',
        `Keep ${lower} readable before the next money decision.`,
      ];
    case 'health':
    case 'wellness':
      return [
        'Turn daily health signals into progress you can actually follow.',
        `Keep ${lower} visible without adding pressure to the routine.`,
      ];
    case 'productivity':
      return [
        'Show the workflow, priorities, and next step in one pass.',
        `Keep ${lower} moving without losing the bigger plan.`,
      ];
    case 'social':
      return [
        'Open on the conversation or community moment worth returning to.',
        `Keep ${lower} readable even when the screen is busy.`,
      ];
    case 'creative':
      return [
        'Lead with the visual moment that proves the product has taste.',
        `Use ${lower} to show polish, control, and momentum together.`,
      ];
    case 'games':
      return [
        'Set the tone fast, then let the strongest action beat carry the story.',
        `Keep ${lower} front and center without slowing the pace.`,
      ];
    default:
      return [
        'Start with the clearest product outcome before adding supporting detail.',
        `Use ${lower} to make the first benefit obvious at a glance.`,
      ];
  }
}

function buildDifferentiatorSubtitles(
  category: string,
  features: string[],
  goals: string[],
  signal?: CopyScreenSignal,
): string[] {
  const fallback = goals[0] ?? features[0] ?? 'core workflow';
  const focus = resolveSignalFocus(signal, signal?.focus ?? fallback, fallback);
  const lower = focus.toLowerCase();
  switch (category) {
    case 'finance':
      return [
        `Show how ${lower} stays legible even when the numbers get dense.`,
        'Use the second beat to prove control, context, and confidence together.',
      ];
    case 'health':
    case 'wellness':
      return [
        `Use ${lower} to show the calmer rhythm behind the routine.`,
        'Make the differentiator feel repeatable, not intense or one-off.',
      ];
    case 'productivity':
      return [
        `Let ${lower} prove the flow stays obvious under real workload.`,
        'Use the second slide to show clarity, pace, and control together.',
      ];
    default:
      return [
        `Use ${lower} to show why this product feels more intentional.`,
        'Prove the product rhythm, not just a list of controls.',
      ];
  }
}

function buildFeatureSubtitles(
  category: string,
  feature: string,
  signal?: CopyScreenSignal,
): string[] {
  const focus = resolveSignalFocus(signal, signal?.focus ?? feature, feature);
  const lower = focus.toLowerCase();
  switch (category) {
    case 'finance':
      return [
        `Zoom in on ${lower} so the proof feels trustworthy, not abstract.`,
        `Keep the subtitle grounded in how ${lower} helps the next decision.`,
      ];
    case 'health':
    case 'wellness':
      return [
        `Show how ${lower} supports steady habits over time.`,
        `Use this slide to keep ${lower} practical and repeatable.`,
      ];
    case 'productivity':
      return [
        `Use the screen detail to show how ${lower} removes daily friction.`,
        `Keep the proof anchored in ${lower}, not every secondary control.`,
      ];
    default:
      return [
        `Pull forward the proof inside ${lower} without crowding the screen.`,
        `Keep the subtitle focused on why ${lower} matters in real use.`,
      ];
  }
}

function buildTrustSubtitles(
  category: string,
  appName: string,
  signal?: CopyScreenSignal,
): string[] {
  const focus = signal?.focus
    ? resolveSignalFocus(signal, signal.focus, appName)
    : appName;
  const lower = focus.toLowerCase();
  switch (category) {
    case 'finance':
      return [
        `Reassure with ${lower}, clarity, and proof that feels dependable.`,
        'Use this beat to show reliability without slipping into boilerplate.',
      ];
    case 'health':
    case 'wellness':
      return [
        `Make ${lower} feel supportive enough to come back to every day.`,
        'Use a calmer proof line so the trust beat still feels human.',
      ];
    default:
      return [
        `Show why ${lower} is polished enough for repeat use.`,
        'Land on credibility, consistency, and product maturity together.',
      ];
  }
}

function buildSummarySubtitles(
  category: string,
  features: string[],
  goals: string[],
  signal?: CopyScreenSignal,
): string[] {
  const focus = signal?.focus
    ? resolveSignalFocus(signal, signal.focus, features[0] ?? goals[0] ?? 'the product')
    : compactFeature(features[0] ?? goals[0] ?? 'the product');
  const avoidBusyUi = signal?.unsafeForTextOverlay ?? false;
  switch (category) {
    case 'finance':
      return [
        'Close on the broader money story instead of repeating the opening claim.',
        avoidBusyUi
          ? `Keep the final value around ${focus.toLowerCase()} clear of the busy UI.`
          : `Use ${focus.toLowerCase()} to close with a calmer, broader payoff.`,
      ];
    case 'productivity':
      return [
        'End with the system-level payoff, not another feature bullet.',
        `Let ${focus.toLowerCase()} reinforce the bigger workflow win.`,
      ];
    default:
      return [
        'Close on the remaining benefit so the set finishes with range.',
        avoidBusyUi
          ? 'Keep the closing message short enough to stay clear of the UI.'
          : `Use ${focus.toLowerCase()} to wrap the story without echoing the hero.`,
      ];
  }
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

  if (readsLikeFeatureListHeadline(normalized)) {
    issues.push('Reads like a feature list instead of a benefit-led headline.');
    score -= 30;
  } else if (readsLikeFeatureLabelHeadline(normalized, sourceFeature)) {
    issues.push('Reads like a feature label instead of a clear value statement.');
    score -= 16;
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

function scoreSubtitle(args: {
  headline: string;
  subtitle?: string;
  slot: CopySlot;
  sourceFeature?: string;
  signal?: CopyScreenSignal;
}): {
  subtitle?: string;
  subtitleWordCount?: number;
  scoreAdjustment: number;
  rationale: string[];
  issues: string[];
} {
  const subtitle = toSubtitle(args.subtitle);
  if (!subtitle) {
    return {
      subtitle: undefined,
      subtitleWordCount: undefined,
      scoreAdjustment: -4,
      rationale: [],
      issues: ['Missing supporting subtitle.'],
    };
  }

  const words = subtitle.split(/\s+/).filter(Boolean);
  const lowered = words.map((word) => word.toLowerCase());
  const issues: string[] = [];
  const rationale: string[] = [];
  let scoreAdjustment = 0;

  if (words.length >= 6 && words.length <= 11) {
    scoreAdjustment += 10;
    rationale.push('Adds a readable support line without becoming paragraph copy.');
  } else {
    issues.push('Subtitle length is outside the preferred 6-11 word range.');
    scoreAdjustment -= Math.abs(8 - words.length) * 2;
  }

  const overlap = lexicalOverlap(args.headline.replace(/\n/g, ' '), subtitle);
  if (overlap >= 3) {
    issues.push('Subtitle repeats too much of the headline.');
    scoreAdjustment -= overlap * 5;
  } else if (overlap <= 1) {
    rationale.push('Adds support without echoing the headline.');
  }

  if (/[,&/]/.test(subtitle)) {
    issues.push('Subtitle reads like a feature list.');
    scoreAdjustment -= 8;
  }

  const genericCount = lowered.filter((word) => GENERIC_WORDS.has(word)).length;
  if (genericCount > 0) {
    issues.push('Subtitle uses generic marketing language.');
    scoreAdjustment -= genericCount * 6;
  }

  if (args.slot === 'feature' && args.sourceFeature) {
    const featureWords = new Set(normalizePhrase(args.sourceFeature).toLowerCase().split(' ').filter(Boolean));
    const featureOverlap = lowered.filter((word) => featureWords.has(word)).length;
    if (featureOverlap >= 1) {
      scoreAdjustment += 6;
      rationale.push('Subtitle stays grounded in the feature proof.');
    } else {
      issues.push('Subtitle is not clearly grounded in the feature proof.');
      scoreAdjustment -= 6;
    }
  }

  if (args.signal?.unsafeForTextOverlay && words.length > 10) {
    issues.push('Subtitle may be too long for a UI-dense screen.');
    scoreAdjustment -= 4;
  }

  if (repeatsEmbeddedText(subtitle, args.signal)) {
    issues.push('Subtitle repeats embedded UI text instead of reframing the benefit.');
    scoreAdjustment -= 18;
  }

  return {
    subtitle,
    subtitleWordCount: words.length,
    scoreAdjustment,
    rationale,
    issues,
  };
}

export function scoreCopyCandidate(args: {
  headline: string;
  subtitle?: string;
  slot: CopySlot;
  sourceFeature?: string;
  signal?: CopyScreenSignal;
}): Omit<CopyCandidate, 'id' | 'slot' | 'headline' | 'sourceFeature' | 'origin'> & { subtitle?: string } {
  const headlineScore = scoreHeadline(args.headline, args.slot, args.sourceFeature);
  const subtitleScore = scoreSubtitle(args);

  return {
    subtitle: subtitleScore.subtitle,
    wordCount: headlineScore.wordCount,
    subtitleWordCount: subtitleScore.subtitleWordCount,
    score: Math.max(0, Math.min(100, headlineScore.score + subtitleScore.scoreAdjustment)),
    rationale: [...headlineScore.rationale, ...subtitleScore.rationale],
    issues: [...headlineScore.issues, ...subtitleScore.issues],
  };
}

function buildCandidates(
  slot: CopySlot,
  headlinePhrases: string[],
  subtitlePhrases: string[],
  sourceFeature?: string,
  signal?: CopyScreenSignal,
): CopyCandidate[] {
  const dedupedHeadlines = Array.from(new Set(headlinePhrases.map((phrase) => toHeadline(phrase)).filter(Boolean)));
  const dedupedSubtitles = Array.from(new Set(subtitlePhrases.map((phrase) => toSubtitle(phrase)).filter(Boolean))) as string[];
  const subtitleOptions = dedupedSubtitles.length > 0 ? dedupedSubtitles : [undefined];

  const candidates = dedupedHeadlines.flatMap((headline) => (
    subtitleOptions.map((subtitle, index) => {
      const scored = scoreCopyCandidate({
        headline,
        subtitle,
        slot,
        sourceFeature,
        signal,
      });
      if (repeatsEmbeddedText(headline, signal)) {
        scored.score = Math.max(0, scored.score - 24);
        scored.issues = [
          ...scored.issues,
          'Repeats embedded UI text instead of reframing the product benefit.',
        ];
      }

      return {
        id: `${slot}-${slugify(sourceFeature ?? `${headline}-${subtitle ?? 'subtitle'}`)}-${index + 1}`,
        slot,
        headline,
        subtitle: scored.subtitle,
        sourceFeature,
        origin: 'generated' as const,
        ...scored,
      };
    })
  ));

  const byKey = new Map<string, CopyCandidate>();
  for (const candidate of candidates) {
    const key = `${normalizedHeadlineKey(candidate.headline)}::${normalizePhrase(candidate.subtitle ?? '').toLowerCase()}`;
    const existing = byKey.get(key);
    if (!existing || candidate.score > existing.score) {
      byKey.set(key, candidate);
    }
  }

  return Array.from(byKey.values())
    .sort((left, right) => right.score - left.score)
    .slice(0, 4);
}

function scoreExternalCandidate(args: {
  external: ExternalCopyCandidateInput;
  slotSourceFeature?: string;
  signal?: CopyScreenSignal;
  index: number;
}): CopyCandidate {
  const sourceFeature = args.external.sourceFeature ?? args.slotSourceFeature;
  const headline = toHeadline(args.external.headline);
  const scored = scoreCopyCandidate({
    headline,
    subtitle: args.external.subtitle,
    slot: args.external.slot,
    sourceFeature,
    signal: args.signal,
  });

  return {
    id: `${args.external.slot}-${slugify(sourceFeature ?? headline)}-external-${args.index + 1}`,
    slot: args.external.slot,
    headline,
    subtitle: scored.subtitle,
    sourceFeature,
    origin: 'external',
    ...scored,
  };
}

export function mergeExternalCopyCandidates(
  candidateSet: CopyCandidateSet,
  externalCopy: ExternalCopyCandidateInput[],
  screenSignals?: CopyScreenSignal[],
): CopyCandidateSet {
  if (externalCopy.length === 0) return candidateSet;

  const featureSlots = candidateSet.slots.filter((slot) => slot.slot === 'feature').length;
  const slotSignals = resolveSignalsBySlot(screenSignals, featureSlots);
  let featureIndex = 0;

  return {
    ...candidateSet,
    slots: candidateSet.slots.map((slotGroup) => {
      const signal = (() => {
        switch (slotGroup.slot) {
          case 'hero':
            return slotSignals.hero;
          case 'differentiator':
            return slotSignals.differentiator;
          case 'trust':
            return slotSignals.trust;
          case 'summary':
            return slotSignals.summary;
          case 'feature':
            return slotSignals.features[featureIndex];
        }
      })();

      if (slotGroup.slot === 'feature') featureIndex += 1;

      const matchingExternal = externalCopy
        .filter((candidate) => candidate.slot === slotGroup.slot)
        .filter((candidate) => (
          slotGroup.slot !== 'feature'
            || !candidate.sourceFeature
            || normalizedSourceFeature(candidate.sourceFeature) === normalizedSourceFeature(slotGroup.sourceFeature)
        ));

      if (matchingExternal.length === 0) return slotGroup;

      const rescored = matchingExternal.map((external, index) => scoreExternalCandidate({
        external,
        slotSourceFeature: slotGroup.sourceFeature,
        signal,
        index,
      }));

      const byKey = new Map<string, CopyCandidate>();
      for (const candidate of [...slotGroup.candidates, ...rescored]) {
        const key = `${normalizedHeadlineKey(candidate.headline)}::${normalizePhrase(candidate.subtitle ?? '').toLowerCase()}`;
        const existing = byKey.get(key);
        if (!existing || candidate.score > existing.score) {
          byKey.set(key, candidate);
        }
      }

      return {
        ...slotGroup,
        candidates: Array.from(byKey.values())
          .sort((left, right) => right.score - left.score)
          .slice(0, 6),
      };
    }),
  };
}

export function generateCopyCandidates(args: {
  appName: string;
  appDescription: string;
  category: string;
  features: string[];
  goals?: string[];
  screenshotCount?: number;
  screenSignals?: CopyScreenSignal[];
  externalCopy?: ExternalCopyCandidateInput[];
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
        buildHeroPhrases(args.appName, args.appDescription, args.category, args.features, slotSignals.hero),
        buildHeroSubtitles(args.category, args.features, slotSignals.hero),
        undefined,
        slotSignals.hero,
      ),
    },
    {
      slot: 'differentiator',
      candidates: buildCandidates(
        'differentiator',
        buildDifferentiatorPhrases(args.category, args.features, goals, slotSignals.differentiator),
        buildDifferentiatorSubtitles(args.category, args.features, goals, slotSignals.differentiator),
        undefined,
        slotSignals.differentiator,
      ),
    },
    ...Array.from({ length: featureSlots }, (_value, index) => {
      const feature = args.features[index] ?? args.features[0] ?? args.appDescription;
      return {
        slot: 'feature' as const,
        sourceFeature: feature,
        candidates: buildCandidates(
          'feature',
          buildFeaturePhrases(args.category, feature, slotSignals.features[index]),
          buildFeatureSubtitles(args.category, feature, slotSignals.features[index]),
          feature,
          slotSignals.features[index],
        ),
      };
    }),
    {
      slot: 'trust',
      candidates: buildCandidates(
        'trust',
        buildTrustPhrases(args.category, args.appName, slotSignals.trust),
        buildTrustSubtitles(args.category, args.appName, slotSignals.trust),
        undefined,
        slotSignals.trust,
      ),
    },
    {
      slot: 'summary',
      candidates: buildCandidates(
        'summary',
        buildSummaryPhrases(args.category, args.features, goals, slotSignals.summary),
        buildSummarySubtitles(args.category, args.features, goals, slotSignals.summary),
        undefined,
        slotSignals.summary,
      ),
    },
  ];

  const candidateSet: CopyCandidateSet = {
    appName: args.appName,
    category: args.category,
    generatedAt: new Date().toISOString(),
    rules: SLOT_RULES,
    narrative,
    slots,
  };

  return args.externalCopy?.length
    ? mergeExternalCopyCandidates(candidateSet, args.externalCopy, args.screenSignals)
    : candidateSet;
}

function normalizedHeadlineKey(headline: string): string {
  return normalizePhrase(headline).toLowerCase();
}

function meaningfulLeadWord(headline: string): string | null {
  return comparisonWords(headline)[0] ?? null;
}

function leadingBigram(headline: string): string {
  return comparisonWords(headline).slice(0, 2).join(' ');
}

function lexicalOverlap(left: string, right: string): number {
  const rightWords = new Set(comparisonWords(right));
  return comparisonWords(left).filter((word) => rightWords.has(word)).length;
}

function normalizedSourceFeature(sourceFeature?: string): string {
  return normalizePhrase(sourceFeature ?? '').toLowerCase();
}

function scoreSelectedCopyCombination(candidates: CopyCandidate[]): number {
  let score = candidates.reduce((sum, candidate) => sum + candidate.score, 0);

  for (let index = 0; index < candidates.length; index += 1) {
    const current = candidates[index]!;
    const currentHeadline = current.headline.replace(/\n/g, ' ');
    const currentKey = normalizedHeadlineKey(currentHeadline);
    const currentLeadWord = meaningfulLeadWord(currentHeadline);
    const currentBigram = leadingBigram(currentHeadline);
    const currentFeature = normalizedSourceFeature(current.sourceFeature);

    for (let compareIndex = index + 1; compareIndex < candidates.length; compareIndex += 1) {
      const compare = candidates[compareIndex]!;
      const compareHeadline = compare.headline.replace(/\n/g, ' ');
      const compareKey = normalizedHeadlineKey(compareHeadline);

      if (currentKey && currentKey === compareKey) {
        score -= 60;
        continue;
      }

      const overlap = lexicalOverlap(currentHeadline, compareHeadline);
      if (overlap >= 2) {
        score -= overlap * 12;
      } else if (
        overlap === 1
        && (current.slot === 'hero' || current.slot === 'summary' || compare.slot === 'hero' || compare.slot === 'summary')
      ) {
        score -= 6;
      }

      const compareLeadWord = meaningfulLeadWord(compareHeadline);
      if (
        currentLeadWord
        && compareLeadWord
        && currentLeadWord === compareLeadWord
        && current.slot !== 'feature'
        && compare.slot !== 'feature'
      ) {
        score -= 8;
      }

      const compareBigram = leadingBigram(compareHeadline);
      if (currentBigram && compareBigram && currentBigram === compareBigram) {
        score -= 10;
      }

      const compareFeature = normalizedSourceFeature(compare.sourceFeature);
      if (currentFeature && compareFeature && currentFeature === compareFeature) {
        score -= 8;
      }
    }
  }

  return score;
}

export function selectCopySet(
  candidateSet: CopyCandidateSet,
  externalCopy: ExternalCopyCandidateInput[] = [],
): SelectedCopySet {
  const mergedCandidateSet = externalCopy.length > 0
    ? mergeExternalCopyCandidates(candidateSet, externalCopy)
    : candidateSet;
  const orderedSlots = mergedCandidateSet.slots
    .filter((slot) => slot.candidates.length > 0)
    .sort((left, right) => {
      const order = (slot: CopySlot): number => {
        switch (slot) {
          case 'hero':
            return 0;
          case 'differentiator':
            return 1;
          case 'feature':
            return 2;
          case 'trust':
            return 3;
          case 'summary':
            return 4;
        }
      };
      return order(left.slot) - order(right.slot);
    });

  let bestSelection: CopyCandidate[] | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  const search = (slotIndex: number, selected: CopyCandidate[]): void => {
    if (slotIndex >= orderedSlots.length) {
      const score = scoreSelectedCopyCombination(selected);
      if (score > bestScore) {
        bestScore = score;
        bestSelection = [...selected];
      }
      return;
    }

    const slot = orderedSlots[slotIndex]!;
    for (const candidate of slot.candidates) {
      selected.push(candidate);
      search(slotIndex + 1, selected);
      selected.pop();
    }
  };

  search(0, []);

  const finalSelection: CopyCandidate[] = bestSelection ?? [];
  const hero = finalSelection.find((candidate) => candidate.slot === 'hero');
  const differentiator = finalSelection.find((candidate) => candidate.slot === 'differentiator');
  const trust = finalSelection.find((candidate) => candidate.slot === 'trust');
  const summary = finalSelection.find((candidate) => candidate.slot === 'summary');
  const features = finalSelection.filter((candidate) => candidate.slot === 'feature');

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
