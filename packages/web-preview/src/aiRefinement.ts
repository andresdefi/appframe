import type { AppframeConfig } from '@appframe/core';

const REFINEMENT_ACTIONS = [
  'premium',
  'shorter-copy',
  'frameless',
  'lighter',
  'darker',
  'bigger-text',
  'reduce-overlap',
] as const;

export type AiRefinementActionId = (typeof REFINEMENT_ACTIONS)[number];

export interface AiRefinementPlan {
  label: string;
  rationale: string;
  actions: AiRefinementActionId[];
  nameSuggestion?: string;
  referenceVariantId?: string;
  referenceVariantName?: string;
}

export interface AiRefinementVariantContext {
  id: string;
  name: string;
  description?: string;
  status?: string;
  provenance?: unknown;
  score?: unknown;
  config: AppframeConfig;
}

function getTextSummary(config: AppframeConfig): string[] {
  const screenHeadlines = config.screens
    .flatMap((screen) => [screen.headline, screen.subtitle ?? null])
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .slice(0, 8);

  const panoramicTexts = (config.panoramic?.elements ?? [])
    .flatMap((element) => {
      if (element.type === 'text' || element.type === 'label' || element.type === 'badge') {
        return [element.content];
      }
      if (element.type === 'card') {
        return [element.eyebrow ?? null, element.title ?? null, element.body ?? null];
      }
      if (element.type === 'proof-chip') {
        return [element.value, element.detail ?? null];
      }
      return [];
    })
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .slice(0, 8);

  return [...screenHeadlines, ...panoramicTexts].slice(0, 10);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function summarizeVariantContext(variant: AiRefinementVariantContext) {
  const provenance = isRecord(variant.provenance) ? variant.provenance : null;
  const score = isRecord(variant.score) ? variant.score : null;

  return {
    id: variant.id,
    name: variant.name,
    description: variant.description ?? '',
    status: variant.status ?? 'draft',
    mode: variant.config.mode,
    style: variant.config.theme.style,
    frameStyle: variant.config.frames.style,
    screenCount: variant.config.screens.length,
    frameCount: variant.config.frameCount ?? null,
    background: variant.config.theme.colors.background,
    textColor: variant.config.theme.colors.text,
    provenance: provenance
      ? {
          origin: typeof provenance.origin === 'string' ? provenance.origin : undefined,
          parentVariantId:
            typeof provenance.parentVariantId === 'string' ? provenance.parentVariantId : undefined,
          parentVariantName:
            typeof provenance.parentVariantName === 'string' ? provenance.parentVariantName : undefined,
          note: typeof provenance.note === 'string' ? provenance.note : undefined,
        }
      : null,
    score: typeof score?.total === 'number' ? score.total : null,
    scoreReason: typeof score?.reason === 'string' ? score.reason : null,
    textSummary: getTextSummary(variant.config),
  };
}

function buildSchema(): Record<string, unknown> {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['label', 'rationale', 'actions'],
    properties: {
      label: { type: 'string', minLength: 3, maxLength: 80 },
      rationale: { type: 'string', minLength: 8, maxLength: 240 },
      actions: {
        type: 'array',
        minItems: 1,
        maxItems: 4,
        items: {
          type: 'string',
          enum: [...REFINEMENT_ACTIONS],
        },
      },
      nameSuggestion: { type: 'string', minLength: 3, maxLength: 60 },
      referenceVariantId: { type: 'string' },
      referenceVariantName: { type: 'string' },
    },
  };
}

export async function planAiRefinement(args: {
  appName: string;
  appDescription?: string;
  prompt: string;
  activeVariantId: string;
  variants: AiRefinementVariantContext[];
}): Promise<AiRefinementPlan> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('AI refinement requires OPENAI_API_KEY');
  }

  const activeVariant = args.variants.find((variant) => variant.id === args.activeVariantId);
  if (!activeVariant) {
    throw new Error(`Active variant ${args.activeVariantId} was not found in the current session`);
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.APPFRAME_REFINEMENT_MODEL ?? 'gpt-4o-mini',
      instructions: [
        'You are planning a safe AppFrame screenshot refinement branch.',
        'Map the user prompt onto the smallest effective sequence of existing refinement actions.',
        'Only use the allowed actions. Do not invent new actions.',
        'Use other variants only as stylistic reference when they help satisfy the prompt.',
        'Prefer 1-3 actions unless the prompt clearly needs 4.',
        'Keep the label concise and branch-friendly.',
        'The rationale should explain why the chosen actions satisfy the request.',
        'Return only JSON matching the schema.',
        `Allowed actions: ${REFINEMENT_ACTIONS.join(', ')}.`,
      ].join('\n'),
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: JSON.stringify({
                app: {
                  name: args.appName,
                  description: args.appDescription ?? '',
                },
                prompt: args.prompt,
                activeVariantId: args.activeVariantId,
                activeVariant: summarizeVariantContext(activeVariant),
                otherVariants: args.variants
                  .filter((variant) => variant.id !== args.activeVariantId)
                  .map((variant) => summarizeVariantContext(variant)),
              }),
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'appframe_refinement_plan',
          strict: true,
          schema: buildSchema(),
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI refinement request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json() as { output_text?: string };
  if (!payload.output_text) {
    throw new Error('AI refinement response did not include output_text');
  }

  const parsed = JSON.parse(payload.output_text) as AiRefinementPlan;
  const actions = Array.isArray(parsed.actions)
    ? parsed.actions.filter((action): action is AiRefinementActionId => (
      typeof action === 'string' && REFINEMENT_ACTIONS.includes(action as AiRefinementActionId)
    ))
    : [];

  if (actions.length === 0) {
    throw new Error('AI refinement response did not include any valid actions');
  }

  return {
    label: typeof parsed.label === 'string' ? parsed.label : 'AI refinement',
    rationale: typeof parsed.rationale === 'string' ? parsed.rationale : 'Mapped prompt to safe refinement actions.',
    actions,
    nameSuggestion: typeof parsed.nameSuggestion === 'string' ? parsed.nameSuggestion : undefined,
    referenceVariantId: typeof parsed.referenceVariantId === 'string' ? parsed.referenceVariantId : undefined,
    referenceVariantName:
      typeof parsed.referenceVariantName === 'string' ? parsed.referenceVariantName : undefined,
  };
}
