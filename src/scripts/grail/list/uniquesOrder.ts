import { LayoutType } from "../layout";

export interface UniqueSection {
  name: string;
  shortName: string;
  types: string[];
  twoHanded?: boolean;
  layout?: LayoutType;
}

export const UNIQUES_ORDER: UniqueSection[][] = [
  [
    {
      name: "Rings",
      shortName: "rings",
      types: ["ring"],
      layout: "single-line",
    },
    {
      name: "Amulets",
      shortName: "amulets",
      types: ["amul"],
      // TODO: Better layout for amulets. Maybe TWO_LINES?
    },
    {
      name: "Charms",
      shortName: "charms",
      types: ["scha", "mcha", "lcha"],
      // Maybe we can do better on this
      layout: "single-column",
    },
    {
      name: "Jewels",
      shortName: "jewels",
      types: ["jewl"],
      layout: "single-line",
    },
  ],
  [
    { name: "Armor", shortName: "armor", types: ["tors"] },
    { name: "Helms", shortName: "helms", types: ["helm", "circ"] },
    { name: "Gloves", shortName: "gloves", types: ["glov"] },
    {
      name: "Belts",
      shortName: "belts",
      types: ["belt"],
      layout: "tier-columns",
    },
    { name: "Boots", shortName: "boots", types: ["boot"] },
    { name: "Shields", shortName: "shields", types: ["shie"] },
  ],
  [
    {
      name: "One-hand axes",
      shortName: "axes",
      types: ["axe"],
      twoHanded: false,
    },
    {
      name: "Two-hand axes",
      shortName: "axes",
      types: ["axe"],
      twoHanded: true,
    },
    { name: "Bows", shortName: "bows", types: ["bow"] },
    { name: "Crossbows", shortName: "crossbows", types: ["xbow"] },
    { name: "Daggers", shortName: "daggers", types: ["knif"] },
    {
      name: "One-hand maces",
      shortName: "maces",
      types: ["club", "mace", "hamm", "scep"],
      twoHanded: false,
    },
    {
      name: "Two-hand maces",
      shortName: "maces",
      types: ["club", "mace", "hamm", "scep"],
      twoHanded: true,
    },
    { name: "Polearms", shortName: "polearms", types: ["pole"] },
    { name: "Spears", shortName: "spears", types: ["spea"] },
    { name: "Staves", shortName: "staves", types: ["staf"] },
    {
      name: "One-hand swords",
      shortName: "swords",
      types: ["swor"],
      twoHanded: false,
    },
    {
      name: "Two-hand swords",
      shortName: "swords",
      types: ["swor"],
      twoHanded: true,
    },
    {
      name: "Throwing",
      shortName: "throwing",
      types: ["taxe", "tkni", "jave"],
    },
    { name: "Wands", shortName: "wands", types: ["wand"] },
  ],
  [
    { name: "Amazon", shortName: "Amazon", types: ["ajav", "abow", "aspe"] },
    { name: "Assassin", shortName: "Assassin", types: ["h2h", "h2h2"] },
    { name: "Barbarian", shortName: "Barbarian", types: ["phlm"] },
    { name: "Druid", shortName: "Druid", types: ["pelt"] },
    { name: "Necromancer", shortName: "Necro", types: ["head"] },
    { name: "Paladin", shortName: "Paladin", types: ["ashd"] },
    { name: "Sorceress", shortName: "Sorceress", types: ["orb"] },
  ],
];

export const EQUIPMENT_TYPES: string[] = [];
export const TYPES_TO_UNIQUES_SECTION = new Map<string, UniqueSection>();

for (const category of UNIQUES_ORDER) {
  for (const section of category) {
    EQUIPMENT_TYPES.push(...section.types);
    for (const type of section.types) {
      if (typeof section.twoHanded === "undefined") {
        TYPES_TO_UNIQUES_SECTION.set(type, section);
      } else {
        TYPES_TO_UNIQUES_SECTION.set(
          `${type}-${Number(section.twoHanded)}`,
          section
        );
      }
    }
  }
}
