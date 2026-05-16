import type { Express } from 'express';
import type { PanoramicElement } from '@appframe/core';
import { autoTranslateLocale } from '../translation.js';
import { expectString, expectArray, expectObject } from './utils.js';
import type { RouteContext } from './context.js';

export function registerTranslateRoutes(app: Express, ctx: RouteContext): void {
  app.post('/api/translate-locale', async (req, res) => {
    try {
      const config = ctx.getConfig();
      const body = req.body as Record<string, unknown>;
      const locale = expectString(body.locale);

      if (!locale || locale === 'default') {
        res.status(400).json({ error: 'A non-default locale is required' });
        return;
      }
      if (config.localization) {
        res.status(400).json({
          error: 'Automatic translation is not available when using native localization mode',
        });
        return;
      }

      const existingLocale = config.locales?.[locale];
      if (existingLocale) {
        res.json({ locale, localeConfig: existingLocale });
        return;
      }

      const sourceScreens = expectArray(body.screens)
        ?.map((screen) => expectObject(screen))
        .filter((screen): screen is Record<string, unknown> => screen !== undefined)
        .map((screen) => ({
          headline: expectString(screen.headline) ?? '',
          subtitle: expectString(screen.subtitle) ?? null,
        }));
      const sourcePanoramicElements = expectArray(body.panoramicElements) as
        | PanoramicElement[]
        | undefined;

      const localeConfig = await autoTranslateLocale(config, locale, {
        screens: sourceScreens && sourceScreens.length > 0 ? sourceScreens : undefined,
        panoramicElements: sourcePanoramicElements,
      });

      res.json({ locale, localeConfig });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      const status = message.includes('OPENAI_API_KEY') ? 503 : 500;
      res.status(status).json({ error: message });
    }
  });
}
