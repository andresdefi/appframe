import type { AppframeConfig, LocaleConfig, PanoramicElement } from '@appframe/core';

interface TranslatableScreen {
  headline: string;
  subtitle?: string | null;
}

interface TranslatablePanoramicText {
  index: number;
  content: string;
}

interface TranslationResponse {
  screens: TranslatableScreen[];
  panoramicTexts: Array<{ index: number; content: string }>;
}

function getTargetLanguageName(locale: string): string {
  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
    return displayNames.of(locale.replace(/_/g, '-')) ?? locale;
  } catch {
    return locale;
  }
}

function getTranslatablePanoramicTexts(elements: PanoramicElement[]): TranslatablePanoramicText[] {
  return elements.flatMap((element, index) => (
    element.type === 'text' || element.type === 'label'
      ? [{ index, content: element.content }]
      : []
  ));
}

function buildSchema(screenCount: number, panoramicTextCount: number): Record<string, unknown> {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['screens', 'panoramicTexts'],
    properties: {
      screens: {
        type: 'array',
        minItems: screenCount,
        maxItems: screenCount,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['headline', 'subtitle'],
          properties: {
            headline: { type: 'string' },
            subtitle: { type: ['string', 'null'] },
          },
        },
      },
      panoramicTexts: {
        type: 'array',
        minItems: panoramicTextCount,
        maxItems: panoramicTextCount,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['index', 'content'],
          properties: {
            index: { type: 'integer' },
            content: { type: 'string' },
          },
        },
      },
    },
  };
}

export async function autoTranslateLocale(
  config: AppframeConfig,
  locale: string,
  source?: {
    screens?: TranslatableScreen[];
    panoramicElements?: PanoramicElement[];
  },
): Promise<LocaleConfig> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Automatic translation requires OPENAI_API_KEY');
  }

  const screens: TranslatableScreen[] = source?.screens ?? config.screens.map((screen) => ({
    headline: screen.headline,
    subtitle: screen.subtitle ?? null,
  }));
  const basePanoramicElements = source?.panoramicElements ?? config.panoramic?.elements;
  const panoramicTexts = basePanoramicElements
    ? getTranslatablePanoramicTexts(basePanoramicElements)
    : [];

  const targetLanguage = getTargetLanguageName(locale);
  const schema = buildSchema(screens.length, panoramicTexts.length);
  const prompt = [
    `Translate the following App Store / Play Store marketing copy into ${targetLanguage} (${locale}).`,
    'Keep the copy concise and natural for mobile app marketing.',
    'Preserve line breaks, emphasis, and overall meaning.',
    'Do not add commentary. Return only valid JSON that matches the provided schema.',
  ].join('\n');

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.APPFRAME_TRANSLATION_MODEL ?? 'gpt-4o-mini',
      instructions: prompt,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: JSON.stringify({
                locale,
                screens,
                panoramicTexts,
              }),
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'appframe_locale_translation',
          strict: true,
          schema,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Translation request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json() as { output_text?: string };
  if (!payload.output_text) {
    throw new Error('Translation response did not include output_text');
  }

  const translated = JSON.parse(payload.output_text) as TranslationResponse;
  const localeConfig: LocaleConfig = {
    screens: translated.screens.map((screen) => ({
      headline: screen.headline,
      subtitle: screen.subtitle ?? undefined,
    })),
  };

  if (basePanoramicElements) {
    const overrides = basePanoramicElements.map(() => ({}));
    for (const text of translated.panoramicTexts) {
      overrides[text.index] = { content: text.content };
    }
    localeConfig.panoramic = {
      elements: overrides,
    };
  }

  return localeConfig;
}
