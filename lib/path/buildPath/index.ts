import {encode} from "./encode";
import {joinPathParts} from "./joinPathParts";

type PathParams = Record<
  string,
  string | number | Array<string | number> | undefined
>;

type QueryParams = Record<
  string,
  string | number | boolean | Array<string | number | boolean> | undefined
>;

/**
 * Build a URL-like path from a Next.js route template.
 *
 * Supports:
 * - [profileId] (required segment)
 * - [...slug] (catch-all, expects array)
 * - [[...slug]] (optional catch-all, array or omitted)
 * - Adds query string from `query` (optional)
 *
 * Examples:
 *  buildPath("/users/[profileId]", { id: 123 }) -> "/users/123"
 *  buildPath("/blog/[...slug]", { slug: ["2024", "hello"] }) -> "/blog/2024/hello"
 *  buildPath("/docs/[[...rest]]", {}) -> "/docs"
 *  buildPath("/search", {}, { q: "next js", page: 2 }) -> "/search?q=next%20js&page=2"
 */
export function buildPath(
  template: string,
  params: PathParams = {},
  query?: QueryParams,
): string {
  if (!template.startsWith("/")) {
    throw new Error(`Route template must start with "/": ${template}`);
  }

  // Replace dynamic segments: [profileId], [...slug], [[...slug]]
  const path = template
    .split("/")
    .map((segment) => {
      // [[...param]] optional catch-all
      if (/^\[\[\.\.\.(.+)\]\]$/.test(segment)) {
        const key = segment.match(/^\[\[\.\.\.(.+)\]\]$/)![1];
        const value = params[key];

        if (value == null) {
          return ""; // remove the segment entirely
        }

        if (!Array.isArray(value)) {
          throw new Error(
            `Param "${key}" must be an array for optional catch-all [[...${key}]]`,
          );
        }

        return joinPathParts(value);
      }

      // [...param] catch-all
      if (/^\[\.\.\.(.+)\]$/.test(segment)) {
        const key = segment.match(/^\[\.\.\.(.+)\]$/)![1];
        const value = params[key];

        if (!Array.isArray(value) || value.length === 0) {
          throw new Error(
            `Param "${key}" must be a non-empty array for catch-all [...${key}]`,
          );
        }

        return joinPathParts(value);
      }

      // [param] required single segment
      if (/^\[(.+)\]$/.test(segment)) {
        const key = segment.match(/^\[(.+)\]$/)![1];
        const value = params[key];

        if (value == null || Array.isArray(value)) {
          throw new Error(
            `Param "${key}" is required and must be a string/number for [${key}]`,
          );
        }

        return encode(value);
      }

      // literal
      return segment;
    })
    .filter(Boolean) // remove blanks from optional catch-all
    .join("/");

  if (!query || Object.keys(query).length === 0) {
    return path ? `/${path}` : "/";
  }

  const usp = new URLSearchParams();

  for (const [k, v] of Object.entries(query)) {
    if (v === undefined) {
      continue;
    }

    if (Array.isArray(v)) {
      for (const item of v) {
        usp.append(k, String(item));
      }
    } else {
      usp.set(k, String(v));
    }
  }

  const qs = usp.toString();
  const href = path ? `/${path}` : "/";

  return qs ? `${href}?${qs}` : href;
}
