import { isAbsolute, relative, resolve } from 'node:path';

/**
 * Strict containment check: is `target` a real descendant of `base`?
 *
 * Pre-existing call sites used `target.startsWith(resolve(base))`,
 * which has the well-known sibling-prefix bug: with base `/tmp/app`,
 * the path `/tmp/app-secrets/file.png` passes the check (the string
 * does start with `/tmp/app`) even though it's a sibling directory.
 *
 * `path.relative` is the canonical fix. The relative form of an
 * inside-path is something like `foo/bar`; anything outside escapes
 * with a leading `..`, lives on a different drive (`isAbsolute`), or
 * collapses to the empty string (target equals base — also not
 * "inside" for our containment use case).
 */
export function isPathInside(base: string, target: string): boolean {
  const rel = relative(resolve(base), resolve(target));
  return rel.length > 0 && !rel.startsWith('..') && !isAbsolute(rel);
}
