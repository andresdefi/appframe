import type { ToolDefinition } from './types.js';
import {
  isRecord,
  jsonContent,
  requireRecord,
  requireSlug,
} from './helpers.js';

export const projectValidateTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'validate_project',
      description:
        'Pre-flight check before export. Walks every locale x screen and ' +
        'reports missing screenshots, malformed headline/subtitle HTML, ' +
        'and locales with empty screen arrays. Returns `{ ok: true }` ' +
        'when no issues found, or `{ ok: false, issues }` with ' +
        'actionable details.',
      inputSchema: {
        type: 'object',
        required: ['slug'],
        properties: {
          slug: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'validate_project');
      const slug = requireSlug(a);

      const [env, assets] = await Promise.all([
        client.getProjectEnvelope(slug),
        client.listAssets(slug),
      ]);

      const data = env.data as Record<string, unknown>;
      const baseScreens = Array.isArray(data.screens) ? data.screens : [];
      const sessionLocales = isRecord(data.sessionLocales)
        ? (data.sessionLocales as Record<string, unknown>)
        : {};
      const localeScreens = isRecord(data.localeScreens)
        ? (data.localeScreens as Record<string, unknown>)
        : {};

      const missingScreenshots: Array<{ locale: string; index: number; field: string }> = [];
      const malformedHtml: Array<{ locale: string; index: number; field: string; reason: string }> = [];
      const localesWithoutScreens: string[] = [];
      const emptyText: Array<{ locale: string; index: number; field: string }> = [];

      const assetFiles = new Set(assets.assets.map(a => a.filename));

      function checkScreen(screen: unknown, locale: string, index: number): void {
        if (!isRecord(screen)) return;

        for (const field of ['screenshotUrl', 'screenshotName'] as const) {
          const val = screen[field];
          if (typeof val === 'string' && val.length > 0 && field === 'screenshotName') {
            if (!assetFiles.has(val)) {
              missingScreenshots.push({ locale, index, field: 'screenshot' });
            }
          }
        }

        for (const field of ['headline', 'subtitle'] as const) {
          const val = screen[field];
          if (typeof val !== 'string' || val.length === 0) continue;
          const html = val.trim();
          if (html.includes('<') && !html.includes('>')) {
            malformedHtml.push({ locale, index, field, reason: 'unclosed tag' });
          }
          const opens = (html.match(/<[a-z]/gi) ?? []).length;
          const closes = (html.match(/<\//gi) ?? []).length;
          if (opens > 0 && closes === 0) {
            malformedHtml.push({ locale, index, field, reason: 'no closing tags' });
          }
          const stripped = html.replace(/<[^>]*>/g, '').trim();
          if (stripped.length === 0 && opens > 0) {
            emptyText.push({ locale, index, field });
          }
        }
      }

      for (let i = 0; i < baseScreens.length; i++) {
        checkScreen(baseScreens[i], 'default', i);
      }

      for (const code of Object.keys(sessionLocales)) {
        const screens = localeScreens[code];
        if (!Array.isArray(screens) || screens.length === 0) {
          localesWithoutScreens.push(code);
          continue;
        }
        for (let i = 0; i < screens.length; i++) {
          checkScreen(screens[i], code, i);
        }
      }

      const referencedButMissing = assets.referencedButMissing ?? [];

      const ok =
        missingScreenshots.length === 0 &&
        malformedHtml.length === 0 &&
        localesWithoutScreens.length === 0 &&
        referencedButMissing.length === 0;

      return jsonContent({
        ok,
        issues: {
          missingScreenshots: [...missingScreenshots, ...referencedButMissing.map(f => ({ locale: '(any)', index: -1, field: f }))],
          malformedHtml,
          localesWithoutScreens,
          emptyText,
        },
      });
    },
  },
];
