import {normalizePathname} from "./normalizePathname";

/**
 * Optional helper to check if a given current path matches a target href.
 * - Exact when `exact` is true
 * - Otherwise, prefix match on path segment boundary
 */
export function isActivePath(
  currentPath: string,
  targetHref: string,
  exact = false,
) {
  const a = normalizePathname(currentPath);
  const b = normalizePathname(targetHref);

  if (exact) {
    return a === b;
  }

  return a === b || a.startsWith(b + "/");
}
