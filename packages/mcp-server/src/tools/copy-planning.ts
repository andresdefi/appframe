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
  locale?: string;
  requestedLocale?: string;
  usesLocaleFallback?: boolean;
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
  locale?: string;
  requestedLocale?: string;
  usesLocaleFallback?: boolean;
  hero: CopyCandidate;
  differentiator: CopyCandidate;
  features: CopyCandidate[];
  trust?: CopyCandidate;
  summary: CopyCandidate;
}

type SupportedCopyLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt';

interface CopyLocaleInfo {
  locale: string;
  requestedLocale: string;
  language: SupportedCopyLanguage;
  usesFallback: boolean;
}

interface CopyLexicon {
  genericWords: Set<string>;
  overlapStopWords: Set<string>;
  actionWords: Set<string>;
  structureWords: Set<string>;
  benefitWords: Set<string>;
  joinWords: Set<string>;
}

const EN_GENERIC_WORDS = [
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
];

const EN_OVERLAP_STOP_WORDS = [
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
];

const EN_ACTION_WORDS = [
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
];

const EN_STRUCTURE_WORDS = [
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
];

const EN_BENEFIT_WORDS = [
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
];

const LOCALE_LEXICONS: Record<SupportedCopyLanguage, CopyLexicon> = {
  en: {
    genericWords: new Set(EN_GENERIC_WORDS),
    overlapStopWords: new Set(EN_OVERLAP_STOP_WORDS),
    actionWords: new Set(EN_ACTION_WORDS),
    structureWords: new Set(EN_STRUCTURE_WORDS),
    benefitWords: new Set(EN_BENEFIT_WORDS),
    joinWords: new Set(['and']),
  },
  es: {
    genericWords: new Set(['mejor', 'increible', 'increíble', 'potente', 'simple', 'inteligente', 'facil', 'fácil']),
    overlapStopWords: new Set(['a', 'al', 'con', 'de', 'del', 'el', 'en', 'la', 'las', 'lo', 'los', 'para', 'por', 'sin', 'tu', 'un', 'una', 'y']),
    actionWords: new Set(['abre', 'activa', 'avanza', 'chatea', 'crea', 'descubre', 'encuentra', 'entra', 'haz', 'mueve', 'planifica', 'sigue', 'usa', 've']),
    structureWords: new Set(['a', 'al', 'con', 'de', 'del', 'el', 'en', 'la', 'las', 'lo', 'los', 'para', 'por', 'sin', 'tu', 'un', 'una', 'y']),
    benefitWords: new Set(['calma', 'clara', 'claro', 'claridad', 'confianza', 'contexto', 'diario', 'facil', 'fácil', 'flujo', 'rapido', 'rápido', 'seguro', 'visible']),
    joinWords: new Set(['e', 'y']),
  },
  fr: {
    genericWords: new Set(['fluide', 'incroyable', 'intelligent', 'meilleur', 'puissant', 'simple']),
    overlapStopWords: new Set(['a', 'au', 'aux', 'avec', 'dans', 'de', 'des', 'du', 'en', 'et', 'la', 'le', 'les', 'pour', 'sans', 'sur', 'un', 'une', 'votre']),
    actionWords: new Set(['avance', 'cree', 'crée', 'decouvre', 'découvre', 'entre', 'garde', 'ouvre', 'planifie', 'reste', 'suis', 'utilise', 'vois']),
    structureWords: new Set(['a', 'au', 'aux', 'avec', 'dans', 'de', 'des', 'du', 'en', 'et', 'la', 'le', 'les', 'pour', 'sans', 'sur', 'un', 'une', 'votre']),
    benefitWords: new Set(['calme', 'clair', 'claire', 'clarte', 'clarté', 'confiance', 'contexte', 'fluide', 'net', 'rapide', 'visible']),
    joinWords: new Set(['et']),
  },
  de: {
    genericWords: new Set(['besser', 'beste', 'einfach', 'nahtlos', 'powerful', 'smart', 'stark']),
    overlapStopWords: new Set(['am', 'an', 'auf', 'aus', 'bei', 'das', 'dein', 'dem', 'den', 'der', 'die', 'ein', 'eine', 'für', 'im', 'in', 'mit', 'ohne', 'und', 'zu']),
    actionWords: new Set(['chatte', 'entdecke', 'halte', 'mach', 'nutze', 'öffne', 'plane', 'schaffe', 'sieh', 'spiele', 'starte', 'bleib']),
    structureWords: new Set(['am', 'an', 'auf', 'aus', 'bei', 'das', 'dein', 'dem', 'den', 'der', 'die', 'ein', 'eine', 'für', 'im', 'in', 'mit', 'ohne', 'und', 'zu']),
    benefitWords: new Set(['alltag', 'fokus', 'klar', 'klarheit', 'kontext', 'ruhig', 'schnell', 'sichtbar', 'vertrauen']),
    joinWords: new Set(['und']),
  },
  pt: {
    genericWords: new Set(['fluido', 'incrivel', 'incrível', 'inteligente', 'melhor', 'poderoso', 'simples']),
    overlapStopWords: new Set(['a', 'as', 'com', 'da', 'das', 'de', 'do', 'dos', 'e', 'em', 'no', 'nos', 'na', 'nas', 'o', 'os', 'para', 'por', 'sem', 'seu', 'sua', 'um', 'uma']),
    actionWords: new Set(['abra', 'avance', 'ache', 'chateie', 'crie', 'descubra', 'entre', 'faça', 'faca', 'mantenha', 'planeje', 'siga', 'use', 'veja']),
    structureWords: new Set(['a', 'as', 'com', 'da', 'das', 'de', 'do', 'dos', 'e', 'em', 'no', 'nos', 'na', 'nas', 'o', 'os', 'para', 'por', 'sem', 'seu', 'sua', 'um', 'uma']),
    benefitWords: new Set(['calma', 'claro', 'clareza', 'confianca', 'confiança', 'contexto', 'diario', 'diário', 'fluxo', 'rapido', 'rápido', 'visivel', 'visível']),
    joinWords: new Set(['e']),
  },
};

const SLOT_RULES = [
  'One idea per headline.',
  'Pair each headline with a supporting subtitle when possible.',
  'Prefer 3 to 5 words.',
  'Avoid "and" joining two benefits.',
  'Reject vague or generic filler.',
  'Optimize for thumbnail readability.',
];

function normalizeLocaleTag(locale: string | undefined): string {
  const normalized = (locale ?? 'en').trim().replace(/_/g, '-');
  return normalized.length > 0 ? normalized : 'en';
}

function resolveCopyLocale(locale: string | undefined): CopyLocaleInfo {
  const requestedLocale = normalizeLocaleTag(locale);
  const languageCode = requestedLocale.split('-')[0]?.toLowerCase() ?? 'en';
  const language = (['en', 'es', 'fr', 'de', 'pt'] as const).includes(languageCode as SupportedCopyLanguage)
    ? (languageCode as SupportedCopyLanguage)
    : 'en';

  return {
    locale: language === 'en'
      ? (languageCode === 'en' ? requestedLocale : 'en')
      : requestedLocale,
    requestedLocale,
    language,
    usesFallback: language === 'en' && languageCode !== 'en',
  };
}

function getCopyLexicon(locale: string | undefined): CopyLexicon {
  return LOCALE_LEXICONS[resolveCopyLocale(locale).language];
}

function slugify(value: string): string {
  const slug = value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'copy';
}

function normalizePhrase(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[_-]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
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

function comparisonWords(value: string, locale?: string): string[] {
  const lexicon = getCopyLexicon(locale);
  return normalizePhrase(value)
    .toLowerCase()
    .split(' ')
    .filter((word) => word.length > 2 && !lexicon.overlapStopWords.has(word));
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

function labelLikeWords(value: string, locale?: string): string[] {
  const lexicon = getCopyLexicon(locale);
  return normalizePhrase(value)
    .toLowerCase()
    .split(' ')
    .filter((word) => word.length >= 3)
    .filter((word) => !lexicon.actionWords.has(word) && !lexicon.structureWords.has(word) && !lexicon.benefitWords.has(word));
}

function pluralLabelCount(words: string[]): number {
  return words.filter((word) => word.endsWith('s') && !word.endsWith('ss')).length;
}

function readsLikeFeatureListHeadline(headline: string, locale?: string): boolean {
  const words = normalizePhrase(headline).toLowerCase().split(' ').filter(Boolean);
  if (words.length < 3) return false;

  const labelWords = labelLikeWords(headline, locale);
  if (labelWords.length < Math.max(2, words.length - 1)) return false;

  return pluralLabelCount(labelWords) >= 2 || labelWords.length === words.length;
}

function readsLikeFeatureLabelHeadline(headline: string, sourceFeature?: string, locale?: string): boolean {
  const normalizedHeadline = normalizePhrase(headline).toLowerCase();
  if (!normalizedHeadline) return false;

  const words = normalizedHeadline.split(' ').filter(Boolean);
  const labelWords = labelLikeWords(headline, locale);
  const matchesSourceFeature = Boolean(
    sourceFeature
    && normalizedHeadline === normalizePhrase(sourceFeature).toLowerCase(),
  );

  return matchesSourceFeature
    || (
      words.length >= 2
      && labelWords.length >= words.length - 1
      && !readsLikeFeatureListHeadline(headline, locale)
    );
}

function repeatsEmbeddedText(headline: string, signal: CopyScreenSignal | undefined, locale?: string): boolean {
  const headlineNormalized = normalizePhrase(headline).toLowerCase();
  if (!headlineNormalized) return false;

  const headlineWords = new Set(comparisonWords(headlineNormalized, locale));
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

    const phraseWords = comparisonWords(normalizedPhrase, locale);
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

function buildLocalizedRoleAwarePhrases(
  locale: string | undefined,
  signal: CopyScreenSignal | undefined,
  focusSource: string,
): string[] {
  const { language } = resolveCopyLocale(locale);
  if (language === 'en') return [];

  const focus = compactFeature(focusSource);
  const lower = focus.toLowerCase();
  switch (language) {
    case 'es':
      switch (signal?.sourceRole) {
        case 'workflow':
          return [`Planifica ${lower} rápido`, `${focus} sin fricción`];
        case 'detail':
          return [`${focus} de un vistazo`, `Ve ${lower} claro`];
        case 'discovery':
          return [`Descubre ${lower} rápido`, `Encuentra ${lower} fácil`];
        case 'communication':
          return ['Habla con contexto', `${focus} en tiempo real`];
        case 'paywall':
          return [`Desbloquea ${lower} claro`, 'Ve el valor rápido'];
        case 'home':
          return ['Todo en un lugar', `${focus} en un lugar`];
        default:
          return [`${focus}`, `${focus} en foco`];
      }
    case 'fr':
      switch (signal?.sourceRole) {
        case 'workflow':
          return [`Planifie ${lower} vite`, `${focus} sans friction`];
        case 'detail':
          return [`${focus} d un coup`, `Vois ${lower} net`];
        case 'discovery':
          return [`Trouve ${lower} vite`, `Découvre ${lower} mieux`];
        case 'communication':
          return ['Échange avec contexte', `${focus} en direct`];
        case 'paywall':
          return [`Débloque ${lower} vite`, 'Vois la valeur vite'];
        case 'home':
          return ['Tout en un lieu', `${focus} au même endroit`];
        default:
          return [`${focus}`, `${focus} au centre`];
      }
    case 'de':
      switch (signal?.sourceRole) {
        case 'workflow':
          return [`Plane ${lower} schnell`, `${focus} ohne Reibung`];
        case 'detail':
          return [`${focus} auf einen Blick`, `Sieh ${lower} klar`];
        case 'discovery':
          return [`Finde ${lower} schnell`, `Entdecke ${lower} klar`];
        case 'communication':
          return ['Chat mit Kontext', `${focus} in Echtzeit`];
        case 'paywall':
          return [`Schalte ${lower} frei`, 'Wert sofort sehen'];
        case 'home':
          return ['Alles an einem Ort', `${focus} im Blick`];
        default:
          return [`${focus}`, `${focus} im Fokus`];
      }
    case 'pt':
      switch (signal?.sourceRole) {
        case 'workflow':
          return [`Planeje ${lower} rápido`, `${focus} sem atrito`];
        case 'detail':
          return [`${focus} num relance`, `Veja ${lower} claro`];
        case 'discovery':
          return [`Descubra ${lower} rápido`, `Encontre ${lower} fácil`];
        case 'communication':
          return ['Converse com contexto', `${focus} em tempo real`];
        case 'paywall':
          return [`Desbloqueie ${lower} fácil`, 'Veja o valor rápido'];
        case 'home':
          return ['Tudo em um lugar', `${focus} em um lugar`];
        default:
          return [`${focus}`, `${focus} em foco`];
      }
  }
}

function buildLocalizedCategoryHeroPhrases(
  locale: string | undefined,
  category: string,
  focus: string,
  appName: string,
): string[] {
  const { language } = resolveCopyLocale(locale);
  const lower = focus.toLowerCase();
  switch (language) {
    case 'es':
      switch (category) {
        case 'finance':
          return ['Ve tu dinero claro', `Mueve ${lower} con calma`, 'Decide con confianza'];
        case 'health':
        case 'wellness':
          return ['Tu progreso sigue firme', `Mantén ${lower} en calma`, 'Cada paso cuenta'];
        case 'productivity':
          return ['Tu día en orden', `Haz ${lower} sin ruido`, 'Todo sigue claro'];
        case 'social':
          return ['Tu comunidad activa', `Sigue ${lower} de cerca`, `${appName} no se pierde`];
        case 'creative':
          return ['Ideas en movimiento', `Da forma a ${lower}`, 'Crea con claridad'];
        case 'games':
          return ['Entra en la acción', `Mantén ${lower} vivo`, 'Juega con ritmo'];
        default:
          return [];
      }
    case 'fr':
      switch (category) {
        case 'finance':
          return ['Vois ton argent net', `Gère ${lower} au calme`, 'Décide avec confiance'];
        case 'health':
        case 'wellness':
          return ['Le progrès tient bon', `Garde ${lower} serein`, 'Chaque pas compte'];
        case 'productivity':
          return ['Ta journée reste claire', `Gère ${lower} sans bruit`, 'Tout reste net'];
        case 'social':
          return ['La communauté reste proche', `Suis ${lower} en direct`, `${appName} suit le rythme`];
        case 'creative':
          return ['Les idées prennent forme', `Fais avancer ${lower}`, 'Crée avec clarté'];
        case 'games':
          return ['Entre dans l action', `Garde ${lower} vivant`, 'Joue avec rythme'];
        default:
          return [];
      }
    case 'de':
      switch (category) {
        case 'finance':
          return ['Sieh Geld ganz klar', `Steuere ${lower} ruhig`, 'Entscheide mit Vertrauen'];
        case 'health':
        case 'wellness':
          return ['Fortschritt bleibt stabil', `Halte ${lower} ruhig`, 'Jeder Schritt zählt'];
        case 'productivity':
          return ['Dein Tag bleibt klar', `Halte ${lower} im Fluss`, 'Alles bleibt im Blick'];
        case 'social':
          return ['Nähe in jedem Thread', `Bleib bei ${lower}`, `${appName} bleibt dran`];
        case 'creative':
          return ['Ideen nehmen Form an', `Bring ${lower} nach vorn`, 'Gestalte mit Klarheit'];
        case 'games':
          return ['Direkt in die Action', `Halte ${lower} am Leben`, 'Spiel mit Tempo'];
        default:
          return [];
      }
    case 'pt':
      switch (category) {
        case 'finance':
          return ['Veja seu dinheiro claro', `Cuide de ${lower} calmo`, 'Decida com confiança'];
        case 'health':
        case 'wellness':
          return ['Seu progresso segue firme', `Mantenha ${lower} leve`, 'Cada passo conta'];
        case 'productivity':
          return ['Seu dia em ordem', `Toque ${lower} sem ruído`, 'Tudo fica claro'];
        case 'social':
          return ['Sua comunidade por perto', `Acompanhe ${lower} ao vivo`, `${appName} acompanha tudo`];
        case 'creative':
          return ['Ideias em movimento', `Dê forma a ${lower}`, 'Crie com clareza'];
        case 'games':
          return ['Entre na ação', `Mantenha ${lower} vivo`, 'Jogue com ritmo'];
        default:
          return [];
      }
    default:
      return [];
  }
}

function buildLocalizedCategoryDifferentiatorPhrases(
  locale: string | undefined,
  category: string,
  firstFeature: string,
  secondFeature: string,
): string[] {
  const { language } = resolveCopyLocale(locale);
  const firstLower = firstFeature.toLowerCase();
  const secondLower = secondFeature.toLowerCase();
  switch (language) {
    case 'es':
      switch (category) {
        case 'finance':
          return [`${firstFeature} con contexto`, `${secondFeature} con confianza`];
        case 'health':
        case 'wellness':
          return [`${firstFeature} sin presión`, `${secondFeature} con calma`];
        case 'productivity':
          return [`${firstFeature} bajo control`, `${secondFeature} sin desvíos`];
        default:
          return [`${firstFeature} con claridad`, `Mantén ${secondLower} en marcha`];
      }
    case 'fr':
      switch (category) {
        case 'finance':
          return [`${firstFeature} avec contexte`, `${secondFeature} avec confiance`];
        case 'health':
        case 'wellness':
          return [`${firstFeature} sans pression`, `${secondFeature} avec calme`];
        case 'productivity':
          return [`${firstFeature} sous contrôle`, `${secondFeature} sans détour`];
        default:
          return [`${firstFeature} avec clarté`, `Garde ${secondLower} en mouvement`];
      }
    case 'de':
      switch (category) {
        case 'finance':
          return [`${firstFeature} mit Kontext`, `${secondFeature} mit Vertrauen`];
        case 'health':
        case 'wellness':
          return [`${firstFeature} ohne Druck`, `${secondFeature} mit Ruhe`];
        case 'productivity':
          return [`${firstFeature} unter Kontrolle`, `${secondFeature} ohne Drift`];
        default:
          return [`${firstFeature} mit Klarheit`, `Halte ${secondLower} im Fluss`];
      }
    case 'pt':
      switch (category) {
        case 'finance':
          return [`${firstFeature} com contexto`, `${secondFeature} com confiança`];
        case 'health':
        case 'wellness':
          return [`${firstFeature} sem pressão`, `${secondFeature} com calma`];
        case 'productivity':
          return [`${firstFeature} sob controle`, `${secondFeature} sem desvio`];
        default:
          return [`${firstFeature} com clareza`, `Mantenha ${secondLower} fluindo`];
      }
    default:
      return [`${firstFeature} ${firstLower}`, `${secondFeature} ${secondLower}`];
  }
}

function buildLocalizedCategoryFeaturePhrases(
  locale: string | undefined,
  category: string,
  feature: string,
): string[] {
  const { language } = resolveCopyLocale(locale);
  const lower = feature.toLowerCase();
  switch (language) {
    case 'es':
      switch (category) {
        case 'finance':
          return [`${feature} con confianza`, `Mantén ${lower} visible`];
        case 'health':
        case 'wellness':
          return [`${feature} que acompaña`, `Mantén ${lower} estable`];
        case 'productivity':
          return [`${feature} sin fricción`, `Mueve ${lower} más rápido`];
        default:
          return [`${feature} con claridad`, `${feature} al instante`];
      }
    case 'fr':
      switch (category) {
        case 'finance':
          return [`${feature} avec confiance`, `Garde ${lower} visible`];
        case 'health':
        case 'wellness':
          return [`${feature} qui tient`, `Garde ${lower} stable`];
        case 'productivity':
          return [`${feature} sans friction`, `Fais avancer ${lower}`];
        default:
          return [`${feature} avec clarté`, `${feature} en un coup`];
      }
    case 'de':
      switch (category) {
        case 'finance':
          return [`${feature} mit Vertrauen`, `Halte ${lower} sichtbar`];
        case 'health':
        case 'wellness':
          return [`${feature} die bleibt`, `Halte ${lower} stabil`];
        case 'productivity':
          return [`${feature} ohne Reibung`, `Bring ${lower} voran`];
        default:
          return [`${feature} mit Klarheit`, `${feature} sofort sehen`];
      }
    case 'pt':
      switch (category) {
        case 'finance':
          return [`${feature} com confiança`, `Mantenha ${lower} visível`];
        case 'health':
        case 'wellness':
          return [`${feature} que permanece`, `Mantenha ${lower} estável`];
        case 'productivity':
          return [`${feature} sem atrito`, `Faça ${lower} andar`];
        default:
          return [`${feature} com clareza`, `${feature} num relance`];
      }
    default:
      return [];
  }
}

function buildLocalizedCategorySummaryPhrases(
  locale: string | undefined,
  category: string,
  first: string,
  second: string,
): string[] {
  const { language } = resolveCopyLocale(locale);
  switch (language) {
    case 'es':
      switch (category) {
        case 'finance':
          return ['Todo tu dinero claro', `${first} con calma`, `${second} con confianza`];
        case 'health':
        case 'wellness':
          return ['Todo sigue en ritmo', `${first} cada día`, `${second} con calma`];
        case 'productivity':
          return ['Todo sigue en curso', `${first} para el día`, `${second} bajo control`];
        default:
          return ['Todo lo que importa', `${first} y más`, `${second} en un lugar`];
      }
    case 'fr':
      switch (category) {
        case 'finance':
          return ['Tout l argent clair', `${first} au calme`, `${second} avec confiance`];
        case 'health':
        case 'wellness':
          return ['Tout garde le rythme', `${first} chaque jour`, `${second} avec calme`];
        case 'productivity':
          return ['Tout reste en cours', `${first} pour la journée`, `${second} sous contrôle`];
        default:
          return ['Tout ce qui compte', `${first} et plus`, `${second} au même endroit`];
      }
    case 'de':
      switch (category) {
        case 'finance':
          return ['Dein Geld ganz klar', `${first} mit Ruhe`, `${second} mit Vertrauen`];
        case 'health':
        case 'wellness':
          return ['Alles bleibt im Takt', `${first} jeden Tag`, `${second} mit Ruhe`];
        case 'productivity':
          return ['Alles bleibt im Fluss', `${first} für den Tag`, `${second} unter Kontrolle`];
        default:
          return ['Alles was zählt', `${first} und mehr`, `${second} an einem Ort`];
      }
    case 'pt':
      switch (category) {
        case 'finance':
          return ['Seu dinheiro mais claro', `${first} com calma`, `${second} com confiança`];
        case 'health':
        case 'wellness':
          return ['Tudo segue no ritmo', `${first} todo dia`, `${second} com calma`];
        case 'productivity':
          return ['Tudo segue fluindo', `${first} para o dia`, `${second} sob controle`];
        default:
          return ['Tudo que importa', `${first} e mais`, `${second} em um lugar`];
      }
    default:
      return [];
  }
}

function buildLocalizedSubtitles(args: {
  locale: string | undefined;
  slot: CopySlot;
  category: string;
  focus: string;
  appName?: string;
  signal?: CopyScreenSignal;
}): string[] {
  const { language } = resolveCopyLocale(args.locale);
  if (language === 'en') return [];

  const lower = args.focus.toLowerCase();
  const dense = args.signal?.unsafeForTextOverlay ?? false;
  switch (language) {
    case 'es':
      switch (args.slot) {
        case 'hero':
          return [
            `Abre con ${lower} y deja claro el beneficio principal.`,
            dense ? 'Mantén el mensaje corto para no chocar con la interfaz.' : `Usa ${lower} para que la primera promesa sea obvia.`,
          ];
        case 'differentiator':
          return [
            `Haz que ${lower} demuestre por qué el producto se siente distinto.`,
            'Muestra control, contexto y ritmo sin caer en una lista.',
          ];
        case 'feature':
          return [
            `Aterriza la prueba en ${lower} sin llenar toda la pantalla.`,
            `Mantén el detalle centrado en ${lower} y su beneficio real.`,
          ];
        case 'trust':
          return [
            `Haz que ${lower} se sienta confiable para volver cada día.`,
            'Cierra con credibilidad y madurez de producto, no con relleno.',
          ];
        case 'summary':
          return [
            'Cierra con el beneficio amplio en vez de repetir la apertura.',
            dense ? 'Usa una línea breve para mantener despejada la UI.' : `Usa ${lower} para resumir el valor que aún queda.`,
          ];
      }
    case 'fr':
      switch (args.slot) {
        case 'hero':
          return [
            `Ouvre avec ${lower} et rends la promesse centrale évidente.`,
            dense ? 'Garde la ligne courte pour éviter la collision avec l interface.' : `Utilise ${lower} pour rendre le premier bénéfice immédiat.`,
          ];
        case 'differentiator':
          return [
            `Laisse ${lower} prouver pourquoi le produit paraît plus net.`,
            'Montre contrôle, contexte et rythme sans liste de fonctions.',
          ];
        case 'feature':
          return [
            `Ancre la preuve dans ${lower} sans surcharger l écran.`,
            `Garde le détail centré sur ${lower} et son vrai usage.`,
          ];
        case 'trust':
          return [
            `Fais sentir que ${lower} mérite un retour chaque jour.`,
            'Termine sur la crédibilité et la maturité produit.',
          ];
        case 'summary':
          return [
            'Ferme sur le bénéfice large plutôt que répéter l ouverture.',
            dense ? 'Garde la dernière ligne courte pour laisser respirer l écran.' : `Utilise ${lower} pour résumer la valeur restante.`,
          ];
      }
    case 'de':
      switch (args.slot) {
        case 'hero':
          return [
            `Starte mit ${lower} und mache das Hauptversprechen sofort klar.`,
            dense ? 'Halte die Zeile kurz damit die UI frei bleibt.' : `Nutze ${lower} damit der erste Nutzen direkt lesbar ist.`,
          ];
        case 'differentiator':
          return [
            `Lass ${lower} zeigen warum das Produkt bewusster wirkt.`,
            'Zeig Kontrolle, Kontext und Tempo statt einer Funktionsliste.',
          ];
        case 'feature':
          return [
            `Verankere den Beweis in ${lower} ohne den Screen zu füllen.`,
            `Halte das Detail bei ${lower} und dem echten Nutzen.`,
          ];
        case 'trust':
          return [
            `Lass ${lower} vertrauenswürdig für den Alltag wirken.`,
            'Schließe mit Glaubwürdigkeit und Produktreife ab.',
          ];
        case 'summary':
          return [
            'Schließe mit dem breiten Nutzen statt die Eröffnung zu wiederholen.',
            dense ? 'Halte die Schlusszeile kurz damit die UI frei bleibt.' : `Nutze ${lower} für den restlichen Gesamtwert.`,
          ];
      }
    case 'pt':
      switch (args.slot) {
        case 'hero':
          return [
            `Abra com ${lower} e deixe a promessa principal evidente.`,
            dense ? 'Mantenha a linha curta para não disputar com a interface.' : `Use ${lower} para tornar o primeiro benefício imediato.`,
          ];
        case 'differentiator':
          return [
            `Deixe ${lower} provar por que o produto parece mais intencional.`,
            'Mostre controle, contexto e ritmo sem lista de recursos.',
          ];
        case 'feature':
          return [
            `Puxe a prova de ${lower} sem lotar a tela.`,
            `Mantenha o detalhe focado em ${lower} e no benefício real.`,
          ];
        case 'trust':
          return [
            `Faça ${lower} parecer confiável para voltar todo dia.`,
            'Feche com credibilidade e maturidade de produto.',
          ];
        case 'summary':
          return [
            'Feche com o benefício amplo em vez de repetir a abertura.',
            dense ? 'Use uma linha curta para preservar o respiro da UI.' : `Use ${lower} para resumir o valor que ainda resta.`,
          ];
      }
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
  locale?: string,
  signal?: CopyScreenSignal,
): string[] {
  const firstFeature = resolveSignalFocus(signal, signal?.focus ?? features[0] ?? '', features[0] ?? appName);
  if (resolveCopyLocale(locale).language !== 'en') {
    return [
      ...buildLocalizedRoleAwarePhrases(locale, signal, firstFeature || appName),
      ...buildLocalizedCategoryHeroPhrases(locale, category, firstFeature || appName, appName),
      `${appName} ${resolveCopyLocale(locale).language === 'de' ? 'ganz klar' : resolveCopyLocale(locale).language === 'fr' ? 'plus clair' : resolveCopyLocale(locale).language === 'pt' ? 'mais claro' : 'más claro'}`,
      resolveCopyLocale(locale).language === 'de'
        ? `${firstFeature} im Blick`
        : resolveCopyLocale(locale).language === 'fr'
          ? `${firstFeature} bien visible`
          : resolveCopyLocale(locale).language === 'pt'
            ? `${firstFeature} em destaque`
            : `${firstFeature} bien claro`,
      resolveCopyLocale(locale).language === 'de'
        ? `Mehr ${firstFeature.toLowerCase()} sofort`
        : resolveCopyLocale(locale).language === 'fr'
          ? `${firstFeature} plus vite`
          : resolveCopyLocale(locale).language === 'pt'
            ? `${firstFeature} mais rápido`
            : `${firstFeature} más rápido`,
    ];
  }
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
  locale?: string,
  signal?: CopyScreenSignal,
): string[] {
  const fallbackFeature = features[0] ?? goals[0] ?? 'Core workflow';
  const firstFeature = resolveSignalFocus(signal, signal?.focus ?? fallbackFeature, fallbackFeature);
  const secondFeature = compactFeature(features[1] ?? goals[1] ?? firstFeature);
  if (resolveCopyLocale(locale).language !== 'en') {
    const language = resolveCopyLocale(locale).language;
    return [
      ...(signal?.unsafeForTextOverlay
        ? [language === 'de' ? `${firstFeature} ohne Chaos` : language === 'fr' ? `${firstFeature} sans bruit` : language === 'pt' ? `${firstFeature} sem ruído` : `${firstFeature} sin ruido`]
        : []),
      ...(signal?.density === 'minimal'
        ? [language === 'de' ? `${firstFeature} ohne Ablenkung` : language === 'fr' ? `${firstFeature} sans distraction` : language === 'pt' ? `${firstFeature} sem distração` : `${firstFeature} sin distracción`]
        : []),
      ...buildLocalizedRoleAwarePhrases(locale, signal, firstFeature),
      ...buildLocalizedCategoryDifferentiatorPhrases(locale, category, firstFeature, secondFeature),
      language === 'de'
        ? `${firstFeature} mit Fokus`
        : language === 'fr'
          ? `${firstFeature} avec focus`
          : language === 'pt'
            ? `${firstFeature} com foco`
            : `${firstFeature} con foco`,
      language === 'de'
        ? `${secondFeature} mit Kontext`
        : language === 'fr'
          ? `${secondFeature} avec contexte`
          : language === 'pt'
            ? `${secondFeature} com contexto`
            : `${secondFeature} con contexto`,
    ];
  }
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

function buildFeaturePhrases(category: string, feature: string, locale?: string, signal?: CopyScreenSignal): string[] {
  const compact = resolveSignalFocus(signal, signal?.focus ?? feature, feature);
  const lower = compact.toLowerCase();
  if (resolveCopyLocale(locale).language !== 'en') {
    const language = resolveCopyLocale(locale).language;
    return [
      ...buildLocalizedRoleAwarePhrases(locale, signal, compact),
      ...buildLocalizedCategoryFeaturePhrases(locale, category, compact),
      `${compact}`,
      language === 'de'
        ? `${compact} im Blick`
        : language === 'fr'
          ? `${compact} d un coup`
          : language === 'pt'
            ? `${compact} num relance`
            : `${compact} al instante`,
      signal?.unsafeForTextOverlay
        ? (language === 'de'
          ? `${compact} ohne Chaos`
          : language === 'fr'
            ? `${compact} sans foule`
            : language === 'pt'
              ? `${compact} sem ruído`
              : `${compact} sin ruido`)
        : (language === 'de'
          ? `${compact} ohne Lärm`
          : language === 'fr'
            ? `${compact} sans bruit`
            : language === 'pt'
              ? `${compact} sem ruído`
              : `${compact} sin ruido`),
      language === 'de'
        ? `Mehr ${lower} sofort`
        : language === 'fr'
          ? `Plus de ${lower} vite`
          : language === 'pt'
            ? `Mais ${lower} já`
            : `Más ${lower} ya`,
    ];
  }
  return [
    ...buildRoleAwarePhrases(signal, compact),
    ...buildCategoryFeaturePhrases(category, compact),
    `${compact}`,
    `${compact} at a glance`,
    signal?.unsafeForTextOverlay ? `${compact} without clutter` : `${compact} without noise`,
    `Keep ${lower} moving`,
  ];
}

function buildTrustPhrases(category: string, appName: string, locale?: string, signal?: CopyScreenSignal): string[] {
  const focus = signal?.focus
    ? resolveSignalFocus(signal, signal.focus, appName)
    : '';
  if (resolveCopyLocale(locale).language !== 'en') {
    const language = resolveCopyLocale(locale).language;
    switch (language) {
      case 'es':
        return [
          ...(focus ? [`${focus} para cada día`] : []),
          'Hecho para volver',
          'Confianza en cada paso',
          `${appName} se siente sólido`,
        ];
      case 'fr':
        return [
          ...(focus ? [`${focus} chaque jour`] : []),
          'Conçu pour revenir',
          'Confiance à chaque pas',
          `${appName} paraît solide`,
        ];
      case 'de':
        return [
          ...(focus ? [`${focus} jeden Tag`] : []),
          'Gemacht zum Wiederkommen',
          'Vertrauen bei jedem Schritt',
          `${appName} wirkt solide`,
        ];
      case 'pt':
        return [
          ...(focus ? [`${focus} todo dia`] : []),
          'Feito para voltar',
          'Confiança em cada passo',
          `${appName} parece sólido`,
        ];
    }
  }
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
  locale?: string,
  signal?: CopyScreenSignal,
): string[] {
  const focus = signal?.focus
    ? resolveSignalFocus(signal, signal.focus, features[0] ?? goals[0] ?? 'Core features')
    : '';
  const items = [focus, ...features, ...goals].map(compactFeature).filter(Boolean);
  const first = items[0] ?? 'Core features';
  const second = items[1] ?? 'everyday use';
  if (resolveCopyLocale(locale).language !== 'en') {
    return [
      ...buildLocalizedCategorySummaryPhrases(locale, category, first, second),
      ...(focus ? [resolveCopyLocale(locale).language === 'de'
        ? `${first} an einem Ort`
        : resolveCopyLocale(locale).language === 'fr'
          ? `${first} au même endroit`
          : resolveCopyLocale(locale).language === 'pt'
            ? `${first} em um lugar`
            : `${first} en un lugar`] : []),
      resolveCopyLocale(locale).language === 'de'
        ? `${first} und mehr`
        : resolveCopyLocale(locale).language === 'fr'
          ? `${first} et plus`
          : resolveCopyLocale(locale).language === 'pt'
            ? `${first} e mais`
            : `${first} y más`,
      resolveCopyLocale(locale).language === 'de'
        ? 'Alles was zählt'
        : resolveCopyLocale(locale).language === 'fr'
          ? 'Tout ce qui compte'
          : resolveCopyLocale(locale).language === 'pt'
            ? 'Tudo que importa'
            : 'Todo lo que importa',
    ];
  }
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
  locale?: string,
  signal?: CopyScreenSignal,
): string[] {
  const focus = resolveSignalFocus(signal, signal?.focus ?? features[0] ?? 'core workflow', features[0] ?? 'core workflow');
  if (resolveCopyLocale(locale).language !== 'en') {
    return buildLocalizedSubtitles({
      locale,
      slot: 'hero',
      category,
      focus,
      signal,
    });
  }
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
  locale?: string,
  signal?: CopyScreenSignal,
): string[] {
  const fallback = goals[0] ?? features[0] ?? 'core workflow';
  const focus = resolveSignalFocus(signal, signal?.focus ?? fallback, fallback);
  if (resolveCopyLocale(locale).language !== 'en') {
    return buildLocalizedSubtitles({
      locale,
      slot: 'differentiator',
      category,
      focus,
      signal,
    });
  }
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
  locale?: string,
  signal?: CopyScreenSignal,
): string[] {
  const focus = resolveSignalFocus(signal, signal?.focus ?? feature, feature);
  if (resolveCopyLocale(locale).language !== 'en') {
    return buildLocalizedSubtitles({
      locale,
      slot: 'feature',
      category,
      focus,
      signal,
    });
  }
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
  locale?: string,
  signal?: CopyScreenSignal,
): string[] {
  const focus = signal?.focus
    ? resolveSignalFocus(signal, signal.focus, appName)
    : appName;
  if (resolveCopyLocale(locale).language !== 'en') {
    return buildLocalizedSubtitles({
      locale,
      slot: 'trust',
      category,
      focus,
      appName,
      signal,
    });
  }
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
  locale?: string,
  signal?: CopyScreenSignal,
): string[] {
  const focus = signal?.focus
    ? resolveSignalFocus(signal, signal.focus, features[0] ?? goals[0] ?? 'the product')
    : compactFeature(features[0] ?? goals[0] ?? 'the product');
  if (resolveCopyLocale(locale).language !== 'en') {
    return buildLocalizedSubtitles({
      locale,
      slot: 'summary',
      category,
      focus,
      signal,
    });
  }
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
  locale?: string,
): Omit<CopyCandidate, 'id' | 'slot' | 'headline' | 'sourceFeature'> {
  const lexicon = getCopyLexicon(locale);
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

  const joinWord = lowered.find((word) => lexicon.joinWords.has(word));
  if (joinWord) {
    issues.push(`Uses "${joinWord}", which usually joins multiple ideas.`);
    score -= 18;
  }

  if (readsLikeFeatureListHeadline(normalized, locale)) {
    issues.push('Reads like a feature list instead of a benefit-led headline.');
    score -= 30;
  } else if (readsLikeFeatureLabelHeadline(normalized, sourceFeature, locale)) {
    issues.push('Reads like a feature label instead of a clear value statement.');
    score -= 16;
  }

  const genericCount = lowered.filter((word) => lexicon.genericWords.has(word)).length;
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
  locale?: string;
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
  const lexicon = getCopyLexicon(args.locale);
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

  const overlap = lexicalOverlap(args.headline.replace(/\n/g, ' '), subtitle, args.locale);
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

  const genericCount = lowered.filter((word) => lexicon.genericWords.has(word)).length;
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

  if (repeatsEmbeddedText(subtitle, args.signal, args.locale)) {
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
  locale?: string;
}): Omit<CopyCandidate, 'id' | 'slot' | 'headline' | 'sourceFeature' | 'origin'> & { subtitle?: string } {
  const headlineScore = scoreHeadline(args.headline, args.slot, args.sourceFeature, args.locale);
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
  locale?: string,
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
        locale,
        signal,
      });
      if (repeatsEmbeddedText(headline, signal, locale)) {
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
  locale?: string;
  index: number;
}): CopyCandidate {
  const sourceFeature = args.external.sourceFeature ?? args.slotSourceFeature;
  const headline = toHeadline(args.external.headline);
  const scored = scoreCopyCandidate({
    headline,
    subtitle: args.external.subtitle,
    slot: args.external.slot,
    sourceFeature,
    locale: args.locale,
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
        locale: candidateSet.locale,
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
  locale?: string;
  goals?: string[];
  screenshotCount?: number;
  screenSignals?: CopyScreenSignal[];
  externalCopy?: ExternalCopyCandidateInput[];
}): CopyCandidateSet {
  const localeInfo = resolveCopyLocale(args.locale);
  const goals = args.goals ?? [];
  const featureSlots = Math.max(1, Math.min(args.features.length || 1, Math.max((args.screenshotCount ?? 4) - 3, 1)));
  const slotSignals = resolveSignalsBySlot(args.screenSignals, featureSlots);
  const narrative = localeInfo.language === 'en'
    ? [
        'Lead with the primary outcome.',
        'Reinforce the differentiator.',
        'Spend the middle slides on feature proof.',
        'Close with trust and a concise summary.',
      ]
    : localeInfo.language === 'de'
      ? [
          'Starte mit dem Hauptnutzen.',
          'Stärke danach den Unterschied.',
          'Nutze die Mitte für echten Produktbeweis.',
          'Schließe mit Vertrauen und einer klaren Zusammenfassung.',
        ]
      : localeInfo.language === 'fr'
        ? [
            'Ouvre avec le bénéfice principal.',
            'Renforce ensuite le différenciateur.',
            'Garde le milieu pour la preuve produit.',
            'Ferme avec confiance et un résumé net.',
          ]
        : localeInfo.language === 'pt'
          ? [
              'Abra com o principal benefício.',
              'Reforce depois o diferencial.',
              'Use o meio para a prova do produto.',
              'Feche com confiança e um resumo claro.',
            ]
          : [
              'Abre con el beneficio principal.',
              'Refuerza después el diferenciador.',
              'Usa el centro para la prueba de producto.',
              'Cierra con confianza y un resumen claro.',
            ];
  const rules = localeInfo.language === 'en'
    ? SLOT_RULES
    : localeInfo.language === 'de'
      ? [
          'Eine Idee pro Headline.',
          'Füge wenn möglich eine stützende Unterzeile hinzu.',
          'Bevorzuge 3 bis 5 Wörter.',
          'Vermeide Verknüpfer für zwei Vorteile.',
          'Lehne vage Füllsprache ab.',
          'Optimiere für gute Lesbarkeit im Thumbnail.',
        ]
      : localeInfo.language === 'fr'
        ? [
            'Une idée par titre.',
            'Ajoute une sous-ligne utile quand c est possible.',
            'Privilégie 3 à 5 mots.',
            'Évite les liaisons qui vendent deux bénéfices.',
            'Écarte le flou marketing.',
            'Optimise pour la lisibilité en miniature.',
          ]
        : localeInfo.language === 'pt'
          ? [
              'Uma ideia por título.',
              'Adicione uma linha de apoio quando fizer sentido.',
              'Prefira 3 a 5 palavras.',
              'Evite conectivos que juntam dois benefícios.',
              'Rejeite linguagem vaga.',
              'Otimize para leitura em miniatura.',
            ]
          : [
              'Una idea por titular.',
              'Añade un subtítulo de apoyo cuando sea posible.',
              'Prefiere 3 a 5 palabras.',
              'Evita conectores que unan dos beneficios.',
              'Rechaza el relleno vago.',
              'Optimiza la lectura en miniatura.',
            ];

  const slots: CopySlotCandidates[] = [
    {
      slot: 'hero',
      candidates: buildCandidates(
        'hero',
        buildHeroPhrases(args.appName, args.appDescription, args.category, args.features, localeInfo.locale, slotSignals.hero),
        buildHeroSubtitles(args.category, args.features, localeInfo.locale, slotSignals.hero),
        undefined,
        localeInfo.locale,
        slotSignals.hero,
      ),
    },
    {
      slot: 'differentiator',
      candidates: buildCandidates(
        'differentiator',
        buildDifferentiatorPhrases(args.category, args.features, goals, localeInfo.locale, slotSignals.differentiator),
        buildDifferentiatorSubtitles(args.category, args.features, goals, localeInfo.locale, slotSignals.differentiator),
        undefined,
        localeInfo.locale,
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
          buildFeaturePhrases(args.category, feature, localeInfo.locale, slotSignals.features[index]),
          buildFeatureSubtitles(args.category, feature, localeInfo.locale, slotSignals.features[index]),
          feature,
          localeInfo.locale,
          slotSignals.features[index],
        ),
      };
    }),
    {
      slot: 'trust',
      candidates: buildCandidates(
        'trust',
        buildTrustPhrases(args.category, args.appName, localeInfo.locale, slotSignals.trust),
        buildTrustSubtitles(args.category, args.appName, localeInfo.locale, slotSignals.trust),
        undefined,
        localeInfo.locale,
        slotSignals.trust,
      ),
    },
    {
      slot: 'summary',
      candidates: buildCandidates(
        'summary',
        buildSummaryPhrases(args.category, args.features, goals, localeInfo.locale, slotSignals.summary),
        buildSummarySubtitles(args.category, args.features, goals, localeInfo.locale, slotSignals.summary),
        undefined,
        localeInfo.locale,
        slotSignals.summary,
      ),
    },
  ];

  const candidateSet: CopyCandidateSet = {
    appName: args.appName,
    category: args.category,
    locale: localeInfo.locale,
    requestedLocale: localeInfo.requestedLocale,
    usesLocaleFallback: localeInfo.usesFallback,
    generatedAt: new Date().toISOString(),
    rules,
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

function meaningfulLeadWord(headline: string, locale?: string): string | null {
  return comparisonWords(headline, locale)[0] ?? null;
}

function leadingBigram(headline: string, locale?: string): string {
  return comparisonWords(headline, locale).slice(0, 2).join(' ');
}

function lexicalOverlap(left: string, right: string, locale?: string): number {
  const rightWords = new Set(comparisonWords(right, locale));
  return comparisonWords(left, locale).filter((word) => rightWords.has(word)).length;
}

function normalizedSourceFeature(sourceFeature?: string): string {
  return normalizePhrase(sourceFeature ?? '').toLowerCase();
}

function scoreSelectedCopyCombination(candidates: CopyCandidate[], locale?: string): number {
  let score = candidates.reduce((sum, candidate) => sum + candidate.score, 0);

  for (let index = 0; index < candidates.length; index += 1) {
    const current = candidates[index]!;
    const currentHeadline = current.headline.replace(/\n/g, ' ');
    const currentKey = normalizedHeadlineKey(currentHeadline);
    const currentLeadWord = meaningfulLeadWord(currentHeadline, locale);
    const currentBigram = leadingBigram(currentHeadline, locale);
    const currentFeature = normalizedSourceFeature(current.sourceFeature);

    for (let compareIndex = index + 1; compareIndex < candidates.length; compareIndex += 1) {
      const compare = candidates[compareIndex]!;
      const compareHeadline = compare.headline.replace(/\n/g, ' ');
      const compareKey = normalizedHeadlineKey(compareHeadline);

      if (currentKey && currentKey === compareKey) {
        score -= 60;
        continue;
      }

      const overlap = lexicalOverlap(currentHeadline, compareHeadline, locale);
      if (overlap >= 2) {
        score -= overlap * 12;
      } else if (
        overlap === 1
        && (current.slot === 'hero' || current.slot === 'summary' || compare.slot === 'hero' || compare.slot === 'summary')
      ) {
        score -= 6;
      }

      const compareLeadWord = meaningfulLeadWord(compareHeadline, locale);
      if (
        currentLeadWord
        && compareLeadWord
        && currentLeadWord === compareLeadWord
        && current.slot !== 'feature'
        && compare.slot !== 'feature'
      ) {
        score -= 8;
      }

      const compareBigram = leadingBigram(compareHeadline, locale);
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
      const score = scoreSelectedCopyCombination(selected, mergedCandidateSet.locale);
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
    locale: mergedCandidateSet.locale ?? 'en',
    requestedLocale: mergedCandidateSet.requestedLocale ?? mergedCandidateSet.locale ?? 'en',
    usesLocaleFallback: mergedCandidateSet.usesLocaleFallback ?? false,
    hero,
    differentiator,
    features,
    trust,
    summary,
  };
}
