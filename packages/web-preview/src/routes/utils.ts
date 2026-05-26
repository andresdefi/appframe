// Small validation helpers shared across route handlers. Kept in one place
// so we don't end up with subtly different definitions of expectString /
// expectArray / etc. drifting between modules.

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function expectOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function expectNumber(v: unknown): number | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  return undefined;
}

export function expectString(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'string') return v;
  return undefined;
}

export function expectBoolean(v: unknown): boolean | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'boolean') return v;
  return undefined;
}

export function expectObject(v: unknown): Record<string, unknown> | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>;
  return undefined;
}

export function expectArray(v: unknown): unknown[] | undefined {
  if (v === undefined || v === null) return undefined;
  if (Array.isArray(v)) return v;
  return undefined;
}

const LOCALE_CODE_RE = /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$/;

export function validateLocaleCode(code: string): string | null {
  if (!LOCALE_CODE_RE.test(code)) return null;
  return code;
}

export function wantsFullReturn(req: { query: Record<string, unknown>; body?: unknown }): boolean {
  if (req.query.return === 'full') return true;
  if (typeof req.body === 'object' && req.body !== null && !Array.isArray(req.body)) {
    return (req.body as Record<string, unknown>).return === 'full';
  }
  return false;
}

export function slugifyName(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'variant';
}
