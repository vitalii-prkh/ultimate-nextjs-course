export function encode(v: string | number) {
  return encodeURIComponent(String(v));
}
