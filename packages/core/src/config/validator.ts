import { ZodError } from 'zod';
import { appframeConfigSchema } from './schema.js';
import type { AppframeConfig } from './schema.js';

export interface ValidationResult {
  success: true;
  config: AppframeConfig;
}

export interface ValidationError {
  success: false;
  errors: FormattedError[];
}

export interface FormattedError {
  path: string;
  message: string;
}

export function validateConfig(raw: unknown): ValidationResult | ValidationError {
  try {
    const config = appframeConfigSchema.parse(raw);
    return { success: true, config };
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
