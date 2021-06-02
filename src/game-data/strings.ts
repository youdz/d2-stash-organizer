import * as strings from "../../game-data/json/Strings.json";

const STRINGS: Record<string, string> = strings;

export function getString(code: string) {
  return STRINGS[code] ?? code;
}
