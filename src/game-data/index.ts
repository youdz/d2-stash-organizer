import {
  Armor,
  ItemStat,
  Property,
  SetItem,
  Set,
  UniqueItem,
  Weapon,
  SkillTab,
  Misc,
  Runeword,
  MagicAffix,
} from "./types";

import * as armors from "../../game-data/json/Armor.json";
import * as weapons from "../../game-data/json/Weapons.json";
import * as misc from "../../game-data/json/Misc.json";
import * as uniqueItems from "../../game-data/json/UniqueItems.json";
import * as setItems from "../../game-data/json/SetItems.json";
import * as sets from "../../game-data/json/Sets.json";
import * as properties from "../../game-data/json/Properties.json";
import * as itemStats from "../../game-data/json/ItemStatCost.json";
import * as skillTabs from "../../game-data/json/SkillTabs.json";
import * as rareNames from "../../game-data/json/RareNames.json";
import * as magicPrefixes from "../../game-data/json/MagicPrefix.json";
import * as magicSuffixes from "../../game-data/json/MagicSuffix.json";
import * as runewords from "../../game-data/json/Runewords.json";

export const ARMORS: Record<string, Armor | undefined> = armors;
export const WEAPONS: Record<string, Weapon | undefined> = weapons;
export const MISC: Record<string, Misc | undefined> = misc;
export const UNIQUE_ITEMS: UniqueItem[] = uniqueItems;
export const SET_ITEMS: SetItem[] = setItems;
export const SETS: Record<string, Set> = sets;
export const PROPERTIES = properties as Record<string, Property>;
export const ITEM_STATS: (ItemStat | null)[] = itemStats;
export const SKILL_TABS: SkillTab[] = skillTabs;
export const RARE_NAMES: string[] = rareNames;
export const MAGIC_PREFIXES: MagicAffix[] = magicPrefixes;
export const MAGIC_SUFFIXES: MagicAffix[] = magicSuffixes;
export const RUNEWORDS: Runeword[] = runewords;

export * from "./types";
