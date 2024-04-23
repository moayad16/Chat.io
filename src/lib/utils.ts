export function converToAscii(str: string) {
  return str.replace(/[^\x00-\x7F]/g, "");
}
