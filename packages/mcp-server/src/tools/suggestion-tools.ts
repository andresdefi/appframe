import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerSuggestionTools(server: McpServer): void {
  server.tool(
    'appframe_suggest_copy',
    'Suggest promotional headlines and subtitles for App Store screenshots based on app metadata. Returns suggestions that should be reviewed and approved by the user.',
    {
      appName: z.string().describe('Name of the app'),
      appDescription: z.string().describe('Description of what the app does'),
      features: z.array(z.string()).describe('Key features of the app'),
      screenCount: z.number().describe('Number of screenshot screens to generate copy for'),
      locale: z.string().optional().describe('Target language (e.g., "en", "es", "pt"). Default: English'),
      tone: z.string().optional().describe('Desired tone: professional, casual, bold, playful, minimal'),
    },
    async ({ appName, appDescription, features, screenCount, locale, tone }) => {
      // This tool provides structure for the AI agent to generate copy.
      // The actual copy generation is done by the LLM calling this tool —
      // this returns a prompt/template that guides the generation.

      const language = locale ?? 'en';
      const toneGuide = tone ?? 'professional';

      const prompt = `Generate ${screenCount} promotional headline/subtitle pairs for "${appName}" App Store screenshots.

App: ${appName}
Description: ${appDescription}
Features: ${features.join(', ')}
Language: ${language}
Tone: ${toneGuide}

Guidelines:
- Headlines should be short (2-6 words), impactful, benefit-driven
- Subtitles should add context (6-12 words), optional
- Each screen should highlight a different feature/benefit
- Use active, engaging language
- Do NOT use generic phrases like "Download now" or "Try it today"
- Match the tone: ${toneGuide}

Return the suggestions as a JSON array:
[
  { "headline": "...", "subtitle": "...", "feature": "which feature this highlights" },
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
- dark: Premium, sleek, glowing accents. Best for: finance, pro tools, music, photography
- playful: Colorful, fun shapes. Best for: games, education, kids, casual

Return a theme config as JSON:
{
  "style": "minimal|bold|dark|playful",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "background": "#hex",
    "text": "#hex",
    "subtitle": "#hex"
  },
  "font": "inter|space-grotesk",
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
}
