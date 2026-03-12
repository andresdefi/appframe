import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerSuggestionTools(server: McpServer): void {
  server.tool(
    'appframe_suggest_copy',
    'Suggest promotional headlines and subtitles for App Store screenshots based on app metadata. Returns a copywriting framework and guidelines that should be used to generate copy for user review.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Description of what the app does'),
      features: z.array(z.string()).describe('Key features of the app'),
      screenCount: z.number().describe('Number of screenshot screens to generate copy for'),
      locale: z.string().optional().describe('Target language (e.g., "en", "es", "pt"). Default: English'),
      tone: z.string().optional().describe('Desired tone: professional, casual, bold, playful, minimal'),
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
        content: [{
          type: 'text' as const,
          text: prompt,
        }],
      };
    },
  );

  server.tool(
    'appframe_suggest_theme',
    'Suggest a visual theme (colors, style, font) for an app based on its character. Returns a theme config that should be reviewed by the user.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Description of the app'),
      appCategory: z.string().describe('App category (e.g., finance, games, productivity, health, social)'),
      existingBrandColors: z.array(z.string()).optional().describe('Existing brand colors as hex values'),
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
        content: [{
          type: 'text' as const,
          text: prompt,
        }],
      };
    },
  );

  server.tool(
    'appframe_generate_variants',
    'Generate 2-3 complete appframe config variants with different design strategies for the user to choose from. Returns YAML configs for each variant.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Short description of the app'),
      platforms: z.array(z.enum(['ios', 'android'])).describe('Target platforms'),
      features: z.array(z.string()).describe('Key features of the app'),
      screens: z.array(z.object({
        screenshot: z.string().describe('Path to screenshot file'),
        headline: z.string().describe('Headline text'),
        subtitle: z.string().optional().describe('Optional subtitle'),
      })).describe('Screen definitions with headlines'),
      primaryColor: z.string().optional().describe('Primary brand color as hex'),
      secondaryColor: z.string().optional().describe('Secondary brand color as hex'),
      font: z.string().optional().describe('Preferred font'),
      variantCount: z.number().min(2).max(3).default(3).describe('Number of variants to generate (2-3)'),
    },
    async ({ appName, appDescription, platforms, features, screens, primaryColor, secondaryColor, font, variantCount }) => {
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

### Variant B: Dynamic & Varied
- Style: \`bold\` or \`glow\`
- Mix compositions: single, duo-overlap, duo-split, hero-tilt, fanned-cards
- Use per-screen \`background\` overrides to alternate light/dark
- More dramatic visual presence
- Font weight: 700-800

### Variant C: Elegant & Editorial (only if variantCount is 3)
- Style: \`editorial\` or \`branded\`
- Subtle angled layouts
- Warm, sophisticated color palette
- Use playfair-display or raleway font
- Font weight: 500-600

## Output Format

Return each variant as a complete, valid appframe YAML config block. Separate variants with:
--- VARIANT A ---
(yaml)
--- VARIANT B ---
(yaml)
--- VARIANT C ---
(yaml)

Each config must include: app, theme, frames, screens, output sections.
Each screen must include: screenshot, headline, layout, composition.
Vary the compositions and per-screen backgrounds between variants.
The headlines and subtitles should be identical across variants — only the visual design changes.`;

      return {
        content: [{
          type: 'text' as const,
          text: prompt,
        }],
      };
    },
  );
}
