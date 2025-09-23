import {encode} from "./encode";

export function joinPathParts(parts: Array<string | number>) {
  return parts.map((p) => encode(String(p))).join("/");
}
