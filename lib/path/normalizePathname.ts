/**
 * Optional helper to normalize trailing slashes for consistent comparisons.
 */
export function normalizePathname(p: string) {
  if (!p) {
    return "/";
  }

  if (p !== "/" && p.endsWith("/")) {
    return p.slice(0, -1);
  }

  return p;
}
