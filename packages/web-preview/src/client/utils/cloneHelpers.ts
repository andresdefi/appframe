// Tiny shared helpers used by the store and its extracted snapshot module.
// Lives in utils/ so neither parent depends on the other.

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
