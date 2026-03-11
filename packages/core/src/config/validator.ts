import { ZodError } from 'zod';
import { appframeConfigSchema } from './schema.js';
import type { AppframeConfig } from './schema.js';

export interface ValidationResult {
  success: true;
  config: AppframeConfig;
  warnings: FormattedWarning[];
}

export interface ValidationError {
  success: false;
  errors: FormattedError[];
}

export interface FormattedError {
  path: string;
  message: string;
}

export interface FormattedWarning {
  path: string;
  message: string;
}

const HEADLINE_MAX_LENGTH = 40;

function collectWarnings(config: AppframeConfig): FormattedWarning[] {
  const warnings: FormattedWarning[] = [];

  config.screens.forEach((screen, i) => {
    if (screen.headline.length > HEADLINE_MAX_LENGTH) {
      warnings.push({
        path: `screens.${i}.headline`,
        message: `Headline is ${screen.headline.length} chars — consider keeping it under ${HEADLINE_MAX_LENGTH} for readability at thumbnail size`,
      });
    }
  });

  return warnings;
}

export function validateConfig(raw: unknown): ValidationResult | ValidationError {
  try {
    const config = appframeConfigSchema.parse(raw);
    const warnings = collectWarnings(config);
    return { success: true, config, warnings };
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      return { success: false, errors };
    }
    throw err;
  }
}

export function validateConfigOrThrow(raw: unknown): AppframeConfig {
  const result = validateConfig(raw);
  if (!result.success) {
    const messages = result.errors
      .map((e) => (e.path ? `  ${e.path}: ${e.message}` : `  ${e.message}`))
      .join('\n');
    throw new Error(`Invalid appframe config:\n${messages}`);
  }
  return result.config;
}
