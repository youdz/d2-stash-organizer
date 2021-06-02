import { MISC } from "../../../game-data";

export const UNKNOWN_ORDER = [
  { name: "Unrecognized", shortName: "Unrecognized" },
];

export const REJUVS_ORDER = [{ name: "Rejuvs", shortName: "Rejuvs" }];

export const GEMS_ORDER = ["gsy", "gsv", "gsb", "gsr", "gsg", "gsw", "sku"].map(
  (code) => ({
    name: MISC[code]!.name,
    shortName: MISC[code]!.name,
    gem: MISC[code]?.type,
  })
);

export const RUNES_ORDER = [{ name: "Runes", shortName: "Runes" }];

export const RUNEWORDS_ORDER = [
  { name: "Runewords", shortName: "Runewords" },
  { name: "Bases", shortName: "Bases" },
];

export const OTHERS_ORDER = [
  UNKNOWN_ORDER,
  REJUVS_ORDER,
  GEMS_ORDER,
  RUNES_ORDER,
  RUNEWORDS_ORDER,
];
