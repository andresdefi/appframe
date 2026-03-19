import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { join } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { analyzeScreenshotSet, buildVariantSetPlan, inferCategory } from './design-planning.js';
import { materializeVariantPlan } from './plan-materializer.js';
import {
  generateCopyCandidates,
  scoreHeadline,
  selectCopySet,
  type CopyCandidateSet,
  type SelectedCopySet,
} from './copy-planning.js';
import { createSessionFromManifest } from './variant-session-lib.js';
import { renderVariantPreviews, scoreVariantPreviews } from './variant-session-tools.js';

type DesignVariantPlan = {
  id: string;
  name: string;
  mode: 'individual' | 'panoramic';
  style: string;
  recipe: string;
  rationale: string;
  screenPlan: string[];
};

function parseJsonInput<T>(label: string, raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Invalid ${label}: ${message}`);
  }
}

function defaultAutopilotOutputDir(appName: string): string {
  const slug = appName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return join(process.cwd(), 'output', 'autopilot', slug || 'app');
}

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function buildVariantPlans(
  variantCount: number,
  features: string[],
  screenshotCount: number,
): DesignVariantPlan[] {
  const featureSummary = features.length > 0 ? features : ['core product flow'];
  const variants: DesignVariantPlan[] = [
    {
      id: 'concept-a',
      name: 'Clean Hero',
      mode: 'individual',
      style: 'minimal',
      recipe: 'clean-hero',
      rationale:
        'Safe first-pass concept focused on clarity, thumbnail legibility, and a strong headline-to-device hierarchy.',
      screenPlan: [
        'Hero slide with the strongest outcome statement and clean centered device.',
        `Feature slides that each sell one idea from: ${featureSummary.slice(0, 3).join(', ')}.`,
        'Closing trust or summary slide with reduced visual complexity.',
      ],
    },
    {
      id: 'concept-b',
      name: 'Dynamic Individual',
      mode: 'individual',
      style: 'bold',
      recipe: 'layered-momentum',
      rationale:
        'Higher-energy concept using stronger contrast, more visual rhythm, and frameless rounded screenshots when they read cleaner.',
      screenPlan: [
        'Hero slide with oversized typography and one dominant screenshot.',
        'Mid-sequence slides keep one dominant idea per frame while pushing more contrast and motion.',
        'Final slide compresses supporting features into a punchier visual summary.',
      ],
    },
    {
      id: 'concept-c',
      name: 'Editorial Panorama',
      mode: 'panoramic',
      style: 'editorial',
      recipe: 'editorial-panorama',
      rationale:
        'Connected premium storytelling with stronger whitespace, slower pacing, and a more editorial visual voice.',
      screenPlan: [
        `Use ${Math.max(screenshotCount, 4)} connected frames with shared background and deliberate whitespace.`,
        'Place devices and headline blocks to read as one connected sequence instead of isolated slides.',
        'Let frame breaks mark narrative beats rather than restarting the layout each time.',
      ],
    },
    {
      id: 'concept-d',
      name: 'Bold Panorama',
      mode: 'panoramic',
      style: 'branded',
      recipe: 'bold-panorama',
      rationale:
        'Campaign-like panoramic concept with stronger brand color, larger transitions, and a more cinematic feel.',
      screenPlan: [
        `Use ${Math.max(screenshotCount, 4)} connected frames with stronger color blocking and motion.`,
        'Mix headline-led moments with hero devices and supporting image assets across the strip.',
        'Close with a stronger branded finish instead of a quiet editorial ending.',
      ],
    },
  ];

  if (variantCount >= 5) {
    variants.push({
      id: 'concept-e',
      name: 'Brand Poster',
      mode: 'individual',
      style: 'branded',
      recipe: 'brand-poster',
      rationale:
        'Poster-like concept that leans on strong brand color, graphic assets, and direct benefit messaging.',
      screenPlan: [
        'Brand-led hero slide with the product promise first.',
        'Feature slides that use graphic assets around the screenshots rather than only framing them.',
        'Summary slide with strong visual closure and minimal copy.',
      ],
    });
  }

  return variants.slice(0, variantCount);
}

export function registerSuggestionTools(server: McpServer): void {
  server.tool(
    'appframe_analyze_screenshot_set',
    'Analyze a raw screenshot set for likely roles, hero priority, density, and text-risk. Use this before planning variants so the agent works from explicit screenshot understanding instead of guessing from filenames.',
    {
      screenshots: z
        .array(
          z.object({
            path: z.string().describe('Absolute path to a raw screenshot'),
            note: z.string().optional().describe('Optional note about what the screenshot shows'),
          }),
        )
        .min(1)
        .describe('Raw screenshot inventory'),
    },
    async ({ screenshots }) => {
      const analysis = await analyzeScreenshotSet(screenshots);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                screenshots: analysis,
                summary: {
                  count: analysis.length,
                  topHeroCandidate: analysis[0]?.path ?? null,
                },
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.tool(
    'appframe_plan_variant_set',
    'Plan a concrete AppFrame concept set from app metadata and a screenshot inventory. Returns selected source screens plus variant-by-variant structure, including which concepts are supported now versus which still need future layout expansion.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Short product description'),
      platforms: z.array(z.enum(['ios', 'android'])).describe('Target platforms'),
      features: z.array(z.string()).describe('Key product features or selling points'),
      screenshots: z
        .array(
          z.object({
            path: z.string().describe('Absolute path to a raw screenshot'),
            note: z.string().optional().describe('Optional note about what the screenshot shows'),
          }),
        )
        .min(1)
        .describe('Raw screenshot inventory'),
      goals: z.array(z.string()).optional().describe('What the screenshots should emphasize'),
      variantCount: z.number().min(2).max(5).default(4).describe('How many concepts to plan'),
      screenCount: z
        .number()
        .min(3)
        .max(10)
        .optional()
        .describe('How many source screens to select for the plan'),
    },
    async ({
      appName,
      appDescription,
      platforms,
      features,
      screenshots,
      goals,
      variantCount,
      screenCount,
    }) => {
      const plan = await buildVariantSetPlan({
        appName,
        appDescription,
        platforms,
        features,
        screenshots,
        goals,
        variantCount,
        screenCount,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(plan, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    'appframe_generate_copy_candidates',
    'Generate structured App Store screenshot copy candidates with explicit hero, differentiator, feature, trust, and summary slots. Use this before planning layouts so all concepts share the same narrative backbone.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Short product description'),
      features: z.array(z.string()).describe('Prioritized features'),
      goals: z.array(z.string()).optional().describe('Optional marketing goals'),
      category: z.string().optional().describe('Optional category override'),
      screenshotCount: z.number().min(1).max(10).optional().describe('Expected slide count'),
    },
    async ({ appName, appDescription, features, goals, category, screenshotCount }) => {
      const candidateSet = generateCopyCandidates({
        appName,
        appDescription,
        category: category ?? inferCategory(appDescription, features),
        features,
        goals,
        screenshotCount,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(candidateSet, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    'appframe_score_copy_candidates',
    'Score an existing copy candidate set and return a slot-by-slot view of the best headline options plus issues that should be fixed before layout generation.',
    {
      candidateSetJson: z.string().describe('JSON output from appframe_generate_copy_candidates'),
    },
    async ({ candidateSetJson }) => {
      try {
        const candidateSet = parseJsonInput<CopyCandidateSet>('candidateSetJson', candidateSetJson);
        const scored = candidateSet.slots.map((slot) => ({
          slot: slot.slot,
          sourceFeature: slot.sourceFeature ?? null,
          candidates: slot.candidates.map((candidate) => ({
            ...candidate,
            rescored: scoreHeadline(candidate.headline, candidate.slot, candidate.sourceFeature),
          })),
        }));

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  appName: candidateSet.appName,
                  generatedAt: candidateSet.generatedAt,
                  slots: scored,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return {
          content: [{ type: 'text' as const, text: `Failed to score copy candidates: ${message}` }],
        };
      }
    },
  );

  server.tool(
    'appframe_select_copy_set',
    'Select the best copy candidate for each slot from a generated candidate set. The selected copy set should be reused across all concepts unless the user asks for a different narrative.',
    {
      candidateSetJson: z.string().describe('JSON output from appframe_generate_copy_candidates'),
    },
    async ({ candidateSetJson }) => {
      try {
        const candidateSet = parseJsonInput<CopyCandidateSet>('candidateSetJson', candidateSetJson);
        const selected = selectCopySet(candidateSet);

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(selected, null, 2),
            },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return {
          content: [{ type: 'text' as const, text: `Failed to select copy set: ${message}` }],
        };
      }
    },
  );

  server.tool(
    'appframe_materialize_variant_plan',
    'Materialize a planned variant set into real AppFrame YAML config files. Use this after appframe_plan_variant_set to turn concept plans into renderable current-AppFrame configs.',
    {
      planJson: z
        .string()
        .describe(
          'The JSON output from appframe_plan_variant_set or equivalent VariantSetPlan JSON',
        ),
      outputDir: z.string().describe('Absolute directory where config files should be written'),
      primaryColor: z.string().optional().describe('Optional primary brand color override'),
      secondaryColor: z.string().optional().describe('Optional secondary brand color override'),
      font: z.string().optional().describe('Optional font override'),
      assetImagePath: z
        .string()
        .optional()
        .describe(
          'Optional absolute path to a logo or supporting image asset for panoramic concepts',
        ),
      manifestPath: z
        .string()
        .optional()
        .describe('Optional absolute path for the generated manifest JSON'),
      selectedCopySetJson: z
        .string()
        .optional()
        .describe('Optional SelectedCopySet JSON used to materialize real copy into the configs'),
    },
    async ({
      planJson,
      outputDir,
      primaryColor,
      secondaryColor,
      font,
      assetImagePath,
      manifestPath,
      selectedCopySetJson,
    }) => {
      try {
        const plan = JSON.parse(planJson) as Awaited<ReturnType<typeof buildVariantSetPlan>>;
        const selectedCopySet = selectedCopySetJson
          ? parseJsonInput<SelectedCopySet>('selectedCopySetJson', selectedCopySetJson)
          : undefined;
        const result = await materializeVariantPlan({
          plan,
          outputDir,
          primaryColor,
          secondaryColor,
          font,
          assetImagePath,
          manifestPath,
          selectedCopySet,
        });

        const lines = result.variants.map(
          (variant) => `- ${variant.id} (${variant.mode}): ${variant.configPath}`,
        );
        return {
          content: [
            {
              type: 'text' as const,
              text: `Materialized ${result.variants.length} variants.\nManifest: ${result.manifestPath}\n\n${lines.join('\n')}`,
            },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to materialize variant plan: ${message}`,
            },
          ],
        };
      }
    },
  );

  server.tool(
    'appframe_run_autopilot',
    'Run the full AppFrame autopilot pipeline: analyze screenshots, generate/select copy, plan 4 concepts, materialize configs, create a variant session, render previews, score variants, and return a preview-ready session path.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Short product description'),
      platforms: z.array(z.enum(['ios', 'android'])).describe('Target platforms'),
      features: z.array(z.string()).min(1).describe('Prioritized features'),
      screenshots: z
        .array(
          z.object({
            path: z.string().describe('Absolute path to a raw screenshot'),
            note: z.string().optional().describe('Optional note about what the screenshot shows'),
          }),
        )
        .min(1)
        .describe('Raw screenshot inventory'),
      goals: z.array(z.string()).optional().describe('Optional marketing goals'),
      primaryColor: z.string().optional().describe('Optional primary brand color'),
      secondaryColor: z.string().optional().describe('Optional secondary brand color'),
      font: z.string().optional().describe('Optional font override'),
      assetImagePath: z.string().optional().describe('Optional logo or supporting asset'),
      outputDir: z.string().optional().describe('Optional output directory for autopilot artifacts'),
      sessionPath: z.string().optional().describe('Optional output path for the variant session JSON'),
      manifestPath: z.string().optional().describe('Optional output path for the materialized manifest JSON'),
      screenCount: z.number().min(3).max(10).optional().describe('Optional screen count to plan'),
      variantCount: z.number().min(4).max(5).default(4).describe('How many concepts to produce'),
    },
    async ({
      appName,
      appDescription,
      platforms,
      features,
      screenshots,
      goals,
      primaryColor,
      secondaryColor,
      font,
      assetImagePath,
      outputDir,
      sessionPath,
      manifestPath,
      screenCount,
      variantCount,
    }) => {
      try {
        const resolvedOutputDir = outputDir ?? defaultAutopilotOutputDir(appName);
        await mkdir(resolvedOutputDir, { recursive: true });

        const analysis = await analyzeScreenshotSet(screenshots);
        const copyCandidates = generateCopyCandidates({
          appName,
          appDescription,
          category: inferCategory(appDescription, features),
          features,
          goals,
          screenshotCount: screenCount ?? Math.min(5, screenshots.length),
        });
        const selectedCopySet = selectCopySet(copyCandidates);
        const plan = await buildVariantSetPlan({
          appName,
          appDescription,
          platforms,
          features,
          screenshots,
          goals,
          variantCount,
          screenCount,
        });

        const analysisPath = join(resolvedOutputDir, 'analysis.json');
        const copyCandidatesPath = join(resolvedOutputDir, 'copy-candidates.json');
        const selectedCopySetPath = join(resolvedOutputDir, 'selected-copy.json');
        const planPath = join(resolvedOutputDir, 'variant-plan.json');

        await Promise.all([
          writeFile(analysisPath, JSON.stringify(analysis, null, 2), 'utf-8'),
          writeFile(copyCandidatesPath, JSON.stringify(copyCandidates, null, 2), 'utf-8'),
          writeFile(selectedCopySetPath, JSON.stringify(selectedCopySet, null, 2), 'utf-8'),
          writeFile(planPath, JSON.stringify(plan, null, 2), 'utf-8'),
        ]);

        const materialized = await materializeVariantPlan({
          plan,
          outputDir: join(resolvedOutputDir, 'configs'),
          primaryColor,
          secondaryColor,
          font,
          assetImagePath,
          manifestPath,
          selectedCopySet,
        });

        const previewCommand = `appframe preview --session ${sessionPath ?? join(resolvedOutputDir, 'autopilot.session.json')}`;
        const createdSession = await createSessionFromManifest({
          manifestPath: materialized.manifestPath,
          sessionPath: sessionPath ?? join(resolvedOutputDir, 'autopilot.session.json'),
          screenshotAnalysis: analysis,
          copyCandidates,
          selectedCopySet,
          conceptPlan: plan,
          runManifestPath: join(resolvedOutputDir, 'autopilot-run.json'),
          previewCommand,
        });

        const previewResult = await renderVariantPreviews({
          sessionPath: createdSession.sessionPath,
          outputDir: join(resolvedOutputDir, 'preview-artifacts'),
          platform: platforms.includes('ios') ? 'ios' : platforms[0] ?? 'ios',
        });
        const scoreResult = await scoreVariantPreviews({
          sessionPath: createdSession.sessionPath,
        });

        const runManifestPath = join(resolvedOutputDir, 'autopilot-run.json');
        await writeFile(
          runManifestPath,
          JSON.stringify(
            {
              app: { appName, appDescription, platforms },
              generatedAt: new Date().toISOString(),
              analysisPath,
              copyCandidatesPath,
              selectedCopySetPath,
              planPath,
              materializedManifestPath: materialized.manifestPath,
              sessionPath: createdSession.sessionPath,
              previewPaths: previewResult.previewArtifacts,
              recommendedVariantId: scoreResult.recommendedVariantId,
              recommendationReason: scoreResult.recommendationReason,
              previewCommand,
            },
            null,
            2,
          ),
          'utf-8',
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  outputDir: resolvedOutputDir,
                  runManifestPath,
                  sessionPath: createdSession.sessionPath,
                  materializedManifestPath: materialized.manifestPath,
                  recommendedVariantId: scoreResult.recommendedVariantId,
                  recommendationReason: scoreResult.recommendationReason,
                  previewCommand,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return {
          content: [{ type: 'text' as const, text: `Failed to run autopilot: ${message}` }],
        };
      }
    },
  );

  server.tool(
    'appframe_create_design_brief',
    'Create a structured design brief and concept plan for AI-driven App Store screenshot generation. Use this before generating variants when the agent needs an explicit brief, concept set, evaluation rubric, and implementation priorities.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Short product description'),
      platforms: z.array(z.enum(['ios', 'android'])).describe('Target platforms'),
      features: z.array(z.string()).describe('Key product features or selling points'),
      screenshots: z
        .array(
          z.object({
            path: z.string().describe('Path to a raw app screenshot'),
            note: z.string().optional().describe('Optional note about what the screenshot shows'),
          }),
        )
        .describe('Available raw screenshots'),
      goals: z
        .array(z.string())
        .optional()
        .describe('What the user wants the screenshots to emphasize'),
      brandColors: z.array(z.string()).optional().describe('Known brand colors as hex values'),
      references: z.array(z.string()).optional().describe('Reference styles or URLs'),
      variantCount: z.number().min(2).max(5).default(4).describe('How many concepts to plan'),
    },
    async ({
      appName,
      appDescription,
      platforms,
      features,
      screenshots,
      goals,
      brandColors,
      references,
      variantCount,
    }) => {
      const category = inferCategory(appDescription, features);
      const variants = buildVariantPlans(variantCount, features, screenshots.length);
      const visualGoals = dedupe([
        ...(goals ?? []),
        'Readable at thumbnail size',
        'One idea per slide',
        'Clear visual hierarchy',
      ]);

      const assetNeeds = dedupe([
        'App icon in transparent PNG or SVG',
        brandColors && brandColors.length > 0
          ? 'Verified brand color palette'
          : 'Primary and secondary brand colors',
        screenshots.length < 4 ? 'More screenshot coverage across the core product flow' : '',
        'Optional supporting assets: logo lockup, badges, rating proof, or textured graphics',
      ]);

      const capabilityAreas = [
        {
          name: 'Richer Scene Graph',
          status: 'in_progress',
          next: 'Use panoramic image elements for logos, supporting artwork, and layered editorial assets.',
        },
        {
          name: 'Design Recipe System',
          status: 'planned',
          next: 'Map concepts onto explicit recipes like clean-hero, stacked-cards, and cinematic-panoramic.',
        },
        {
          name: 'Screenshot Understanding',
          status: 'planned',
          next: 'Analyze screenshots for focal points, whitespace, and collision-free copy zones.',
        },
        {
          name: 'Generate-Then-Rank Loop',
          status: 'planned',
          next: 'Render multiple candidate concepts, then score for readability and diversity.',
        },
        {
          name: 'Real Agent Tooling',
          status: 'in_progress',
          next: 'Use this design brief as the planning layer ahead of variant generation and approval.',
        },
      ];

      const output = {
        app: {
          name: appName,
          description: appDescription,
          category,
          platforms,
        },
        screenshotInventory: screenshots.map((s, index) => ({
          index: index + 1,
          path: s.path,
          note: s.note ?? null,
        })),
        designObjectives: visualGoals,
        assetNeeds,
        references: references ?? [],
        brandColors: brandColors ?? [],
        conceptPlans: variants,
        evaluationRubric: [
          'Headline remains readable at thumbnail size.',
          'Text does not collide with dense UI regions.',
          'Each slide sells exactly one idea.',
          'The concept set is visually differentiated, not superficial recolors.',
          'The chosen visuals match the app category and brand tone.',
        ],
        implementationWorkstreams: capabilityAreas,
      };

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(output, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    'appframe_suggest_copy',
    'Suggest promotional headlines and subtitles for App Store screenshots based on app metadata. Returns a copywriting framework and guidelines that should be used to generate copy for user review.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Description of what the app does'),
      features: z.array(z.string()).describe('Key features of the app'),
      screenCount: z.number().describe('Number of screenshot screens to generate copy for'),
      locale: z
        .string()
        .optional()
        .describe('Target language (e.g., "en", "es", "pt"). Default: English'),
      tone: z
        .string()
        .optional()
        .describe('Desired tone: professional, casual, bold, playful, minimal'),
    },
    async ({ appName, appDescription, features, screenCount, locale, tone }) => {
      const language = locale ?? 'en';
      const toneGuide = tone ?? 'professional';

      const prompt = `Generate ${screenCount} promotional headline/subtitle pairs for "${appName}" App Store screenshots.

App: ${appName}
Description: ${appDescription}
Features: ${features.join(', ')}
Language: ${language}
Tone: ${toneGuide}

## Copywriting Framework

Use one of these three approaches per headline:

1. **Paint a moment** — The reader pictures themselves doing it.
   Example: "Check your coffee without opening the app."

2. **State an outcome** — What life looks like after using the app.
   Example: "A home for every coffee you buy."

3. **Kill a pain** — Name a problem and destroy it.
   Example: "Never waste a great bag of coffee."

## Iron Rules

- One idea per headline. Never join two things with "and."
- Short, common words. 1-2 syllables. No jargon unless domain-specific.
- 3-5 words per line. Must be readable at thumbnail size in the App Store.
- Line breaks are intentional — use \\n to control where lines break.
- Subtitles are optional. When used, they add context (6-12 words).

## What NEVER Works

- Feature lists: "Log every item with tags, categories, and notes"
- Two ideas with "and": "Track X and never miss Y"
- Vague aspirational: "Every item, tracked"
- Marketing buzzwords: "AI-powered tips" (unless it genuinely is AI)
- Generic CTAs: "Download now" or "Try it today"

## Slide Narrative Arc

| Slot | Purpose |
|------|---------|
| #1 | Hero — app's main benefit, the one thing it does best |
| #2 | Differentiator — what makes it unique vs alternatives |
| #3 | Ecosystem — widgets, watch, extensions (skip if N/A) |
| #4+ | Core features — one per slide, most important first |
| 2nd to last | Trust signal — "made for people who [X]" |
| Last | Summary — remaining features or coming soon |

## Output Format

Return suggestions as a JSON array. For each slide, provide 2 options using different approaches:
[
  {
    "slide": 1,
    "feature": "which feature this highlights",
    "option_a": { "headline": "...", "subtitle": "...", "approach": "paint a moment|state an outcome|kill a pain" },
    "option_b": { "headline": "...", "subtitle": "...", "approach": "paint a moment|state an outcome|kill a pain" }
  },
  ...
]`;

      return {
        content: [
          {
            type: 'text' as const,
            text: prompt,
          },
        ],
      };
    },
  );

  server.tool(
    'appframe_suggest_theme',
    'Suggest a visual theme (colors, style, font) for an app based on its character. Returns a theme config that should be reviewed by the user.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Description of the app'),
      appCategory: z
        .string()
        .describe('App category (e.g., finance, games, productivity, health, social)'),
      existingBrandColors: z
        .array(z.string())
        .optional()
        .describe('Existing brand colors as hex values'),
      preference: z.string().optional().describe('Style preference hint from user'),
    },
    async ({ appName, appDescription, appCategory, existingBrandColors, preference }) => {
      const prompt = `Suggest a visual theme for "${appName}" App Store screenshots.

App: ${appName}
Description: ${appDescription}
Category: ${appCategory}
${existingBrandColors ? `Brand colors: ${existingBrandColors.join(', ')}` : 'No existing brand colors'}
${preference ? `User preference: ${preference}` : ''}

Choose from these template styles:
- minimal: Clean, light, Apple-style. Best for: productivity, finance, health, utilities
- bold: Vibrant gradients, big text. Best for: social, entertainment, lifestyle
- glow: Premium, sleek, glowing accents on dark backgrounds. Best for: finance, pro tools, music, photography
- playful: Colorful, fun shapes. Best for: games, education, kids, casual
- clean: Zero decoration, huge screenshot, just text + device. Best for: any app wanting a modern, no-frills look (like YouTube, Uber, Base)
- branded: Strong brand color background, large device. Best for: apps with a strong brand identity (like Vipps, FINN, Blocket)
- editorial: Elegant, muted tones, refined typography. Best for: lifestyle, wellness, premium apps (like Lively, Tiimo, BankID)

Available fonts: inter, space-grotesk, poppins, montserrat, dm-sans, plus-jakarta-sans, raleway, playfair-display

Return a theme config as JSON:
{
  "style": "minimal|bold|glow|playful|clean|branded|editorial",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "background": "#hex",
    "text": "#hex",
    "subtitle": "#hex"
  },
  "font": "inter|space-grotesk|poppins|montserrat|dm-sans|plus-jakarta-sans|raleway|playfair-display",
  "fontWeight": 600,
  "reasoning": "Why this theme fits the app"
}`;

      return {
        content: [
          {
            type: 'text' as const,
            text: prompt,
          },
        ],
      };
    },
  );

  server.tool(
    'appframe_generate_variants',
    'Generate 4 complete appframe config variants with the default AppFrame concept mix: 2 individual concepts and 2 panoramic concepts. Returns YAML config guidance for each variant.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Short description of the app'),
      platforms: z.array(z.enum(['ios', 'android'])).describe('Target platforms'),
      features: z.array(z.string()).describe('Key features of the app'),
      screens: z
        .array(
          z.object({
            screenshot: z.string().describe('Path to screenshot file'),
            headline: z.string().describe('Headline text'),
            subtitle: z.string().optional().describe('Optional subtitle'),
          }),
        )
        .describe('Screen definitions with headlines'),
      primaryColor: z.string().optional().describe('Primary brand color as hex'),
      secondaryColor: z.string().optional().describe('Secondary brand color as hex'),
      font: z.string().optional().describe('Preferred font'),
      variantCount: z
        .number()
        .min(4)
        .max(5)
        .default(4)
        .describe('Number of variants to generate (default 4)'),
    },
    async ({
      appName,
      appDescription,
      platforms,
      features,
      screens,
      primaryColor,
      secondaryColor,
      font,
      variantCount,
    }) => {
      const prompt = `Generate ${variantCount} complete appframe YAML config variants for "${appName}".

App: ${appName}
Description: ${appDescription}
Platforms: ${platforms.join(', ')}
Features: ${features.join(', ')}
${primaryColor ? `Primary color: ${primaryColor}` : ''}
${secondaryColor ? `Secondary color: ${secondaryColor}` : ''}
${font ? `Font: ${font}` : ''}

Screens (${screens.length} total):
${screens.map((s, i) => `  ${i + 1}. "${s.headline}"${s.subtitle ? ` — "${s.subtitle}"` : ''} [${s.screenshot}]`).join('\n')}

## Generate These Variants

### Variant A: Clean & Safe
- Style: \`minimal\` or \`clean\`
- All screens use \`layout: center\`, \`composition: single\`
- Light, consistent background across all slides
- Safe, professional look
- Font weight: 600

### Variant B: Dynamic Individual
- Style: \`bold\` or \`glow\`
- Keep it in \`individual\` mode
- Use more dramatic visual presence and stronger contrast
- Frameless is allowed, but must use rounded corners
- Font weight: 700-800

### Variant C: Editorial Panorama
- Mode: \`panoramic\`
- Style: \`editorial\`
- Premium connected sequence with stronger whitespace
- More refined, slower pacing across the strip

### Variant D: Bold Panorama
- Mode: \`panoramic\`
- Style: \`branded\` or \`bold\`
- Stronger brand color, larger transitions, campaign-like energy

## Output Format

Return each variant as a complete, valid appframe YAML config block. Separate variants with:
--- VARIANT A ---
(yaml)
--- VARIANT B ---
(yaml)
--- VARIANT C ---
(yaml)
--- VARIANT D ---
(yaml)

Each config must include: app, theme, frames, screens, output sections.
Each screen must include: screenshot, headline, layout, composition.
Vary the compositions and per-screen backgrounds between variants.
The headlines and subtitles should be identical across variants — only the visual design changes.`;

      return {
        content: [
          {
            type: 'text' as const,
            text: prompt,
          },
        ],
      };
    },
  );
}
