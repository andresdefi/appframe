import { readFile } from 'node:fs/promises';
import type { AppframeConfig } from '@appframe/core';
import type { ModelAssistedVisualRanking } from './preview-scoring.js';

const REQUEST_TIMEOUT_MS = 20_000;
const MAX_IMAGE_BYTES = 3_500_000;

export interface VisualModelScoringStatus {
  status: 'used' | 'skipped' | 'failed';
  reason: string;
  model?: string;
  variantCount: number;
}

interface VisualRankingCandidate {
  id: string;
  name: string;
  config: AppframeConfig;
  previewFilePaths: string[];
}

interface VisualRankingResponse {
  rankings: Array<{
    variantId: string;
    rank: number;
    score: number;
    confidence: number;
    reason: string;
  }>;
}

interface PreparedCandidate {
  id: string;
  name: string;
  config: AppframeConfig;
  imageDataUrl: string;
}

function getMimeType(filePath: string): string | null {
  const normalized = filePath.toLowerCase();
  if (normalized.endsWith('.png')) return 'image/png';
  if (normalized.endsWith('.jpg') || normalized.endsWith('.jpeg')) return 'image/jpeg';
  if (normalized.endsWith('.webp')) return 'image/webp';
  return null;
}

function buildSchema(variantIds: string[]): Record<string, unknown> {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['rankings'],
    properties: {
      rankings: {
        type: 'array',
        minItems: variantIds.length,
        maxItems: variantIds.length,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['variantId', 'rank', 'score', 'confidence', 'reason'],
          properties: {
            variantId: {
              type: 'string',
              enum: variantIds,
            },
            rank: {
              type: 'integer',
              minimum: 1,
              maximum: variantIds.length,
            },
            score: {
              type: 'number',
              minimum: 0,
              maximum: 100,
            },
            confidence: {
              type: 'number',
              minimum: 0,
              maximum: 1,
            },
            reason: {
              type: 'string',
              minLength: 8,
              maxLength: 180,
            },
          },
        },
      },
    },
  };
}

function summarizeCandidate(candidate: PreparedCandidate): Record<string, unknown> {
  return {
    id: candidate.id,
    name: candidate.name,
    mode: candidate.config.mode,
    style: candidate.config.theme.style,
    frameStyle: candidate.config.frames.style,
    screenCount: candidate.config.screens.length,
    frameCount: candidate.config.frameCount ?? null,
  };
}

async function toDataUrl(filePath: string): Promise<string | null> {
  const mimeType = getMimeType(filePath);
  if (!mimeType) return null;

  const image = await readFile(filePath);
  if (image.byteLength > MAX_IMAGE_BYTES) return null;

  return `data:${mimeType};base64,${image.toString('base64')}`;
}

function normalizeResponse(
  payload: VisualRankingResponse,
  variantIds: Set<string>,
): ModelAssistedVisualRanking[] {
  if (!Array.isArray(payload.rankings)) {
    throw new Error('Visual scoring response did not include a rankings array.');
  }

  const seenIds = new Set<string>();
  const seenRanks = new Set<number>();
  const rankings: ModelAssistedVisualRanking[] = [];

  for (const entry of payload.rankings) {
    if (!entry || typeof entry !== 'object') continue;
    if (typeof entry.variantId !== 'string' || !variantIds.has(entry.variantId)) continue;
    if (typeof entry.rank !== 'number' || !Number.isInteger(entry.rank)) continue;
    if (typeof entry.score !== 'number' || !Number.isFinite(entry.score)) continue;
    if (typeof entry.confidence !== 'number' || !Number.isFinite(entry.confidence)) continue;
    if (typeof entry.reason !== 'string' || entry.reason.trim().length === 0) continue;
    if (seenIds.has(entry.variantId) || seenRanks.has(entry.rank)) continue;

    seenIds.add(entry.variantId);
    seenRanks.add(entry.rank);
    rankings.push({
      variantId: entry.variantId,
      rank: entry.rank,
      score: entry.score,
      confidence: entry.confidence,
      reason: entry.reason.trim(),
    });
  }

  if (rankings.length !== variantIds.size) {
    throw new Error(`Visual scoring returned ${rankings.length} valid rankings for ${variantIds.size} variants.`);
  }

  return rankings;
}

export async function requestVisualModelRanking(args: {
  enabled?: boolean;
  variants: VisualRankingCandidate[];
}): Promise<{
  rankings: ModelAssistedVisualRanking[];
  status: VisualModelScoringStatus;
}> {
  if (!args.enabled) {
    return {
      rankings: [],
      status: {
        status: 'skipped',
        reason: 'Live AI visual scoring was not requested.',
        variantCount: 0,
      },
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.APPFRAME_VISUAL_SCORING_MODEL ?? 'gpt-4o-mini';
  if (!apiKey) {
    return {
      rankings: [],
      status: {
        status: 'skipped',
        reason: 'Live AI visual scoring requires OPENAI_API_KEY.',
        model,
        variantCount: 0,
      },
    };
  }

  const preparedCandidates = (await Promise.all(args.variants.map(async (variant) => {
    const previewFilePath = variant.previewFilePaths.find((filePath) => getMimeType(filePath) !== null);
    if (!previewFilePath) return null;

    const imageDataUrl = await toDataUrl(previewFilePath);
    if (!imageDataUrl) return null;

    return {
      id: variant.id,
      name: variant.name,
      config: variant.config,
      imageDataUrl,
    } satisfies PreparedCandidate;
  }))).filter((candidate): candidate is PreparedCandidate => candidate !== null);

  if (preparedCandidates.length < 2) {
    return {
      rankings: [],
      status: {
        status: 'skipped',
        reason: 'Live AI visual scoring needs at least two preview images under the size limit.',
        model,
        variantCount: preparedCandidates.length,
      },
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        instructions: [
          'You are ranking rendered mobile app screenshot concepts for app-store quality.',
          'Judge only the provided images and the variant metadata.',
          'Prioritize thumbnail readability, hierarchy clarity, text-to-image separation, controlled clutter, and polished visual rhythm.',
          'For panoramic variants, also judge cross-frame continuity and seam smoothness.',
          'Reward concepts that are recommendation-worthy, not just novel.',
          'Return only JSON matching the schema.',
        ].join('\n'),
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: JSON.stringify({
                  task: 'Rank these rendered AppFrame concepts from strongest to weakest.',
                  variants: preparedCandidates.map((candidate) => summarizeCandidate(candidate)),
                }),
              },
              ...preparedCandidates.flatMap((candidate) => ([
                {
                  type: 'input_text',
                  text: `Variant ${candidate.id}: ${candidate.name} (${candidate.config.mode}, ${candidate.config.theme.style})`,
                },
                {
                  type: 'input_image',
                  image_url: candidate.imageDataUrl,
                  detail: 'low',
                },
              ])),
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'appframe_visual_ranking',
            strict: true,
            schema: buildSchema(preparedCandidates.map((candidate) => candidate.id)),
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        rankings: [],
        status: {
          status: 'failed',
          reason: `Live AI visual scoring failed: ${response.status} ${errorText}`,
          model,
          variantCount: preparedCandidates.length,
        },
      };
    }

    const payload = await response.json() as { output_text?: string };
    if (!payload.output_text) {
      return {
        rankings: [],
        status: {
          status: 'failed',
          reason: 'Live AI visual scoring response did not include output_text.',
          model,
          variantCount: preparedCandidates.length,
        },
      };
    }

    const parsed = JSON.parse(payload.output_text) as VisualRankingResponse;
    const rankings = normalizeResponse(parsed, new Set(preparedCandidates.map((candidate) => candidate.id)));

    return {
      rankings,
      status: {
        status: 'used',
        reason: `Live AI visual scoring ranked ${rankings.length} preview concepts.`,
        model,
        variantCount: rankings.length,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      rankings: [],
      status: {
        status: 'failed',
        reason: `Live AI visual scoring failed: ${message}`,
        model,
        variantCount: preparedCandidates.length,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}
