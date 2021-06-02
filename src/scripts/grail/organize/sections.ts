export const SECTIONS_ORDER = [
  "unknown",
  "rejuvs",
  "respecs",
  "ubers",
  "gems",
  "runes",
  "runewords",
  "uniques",
  "sets",
] as const;

export type SectionType = typeof SECTIONS_ORDER[number];
