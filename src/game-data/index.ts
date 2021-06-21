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
  Skill,
  CharacterClass,
  StatGroup,
} from "./types";

import armors from "../../game-data/json/Armor.json";
import weapons from "../../game-data/json/Weapons.json";
import misc from "../../game-data/json/Misc.json";
import uniqueItems from "../../game-data/json/UniqueItems.json";
import setItems from "../../game-data/json/SetItems.json";
import sets from "../../game-data/json/Sets.json";
import properties from "../../game-data/json/Properties.json";
import itemStats from "../../game-data/json/ItemStatCost.json";
import statGroups from "../../game-data/json/ItemStatGroups.json";
import skills from "../../game-data/json/Skills.json";
import skillTabs from "../../game-data/json/SkillTabs.json";
import charClasses from "../../game-data/json/CharClasses.json";
import rareNames from "../../game-data/json/RareNames.json";
import magicPrefixes from "../../game-data/json/MagicPrefix.json";
import magicSuffixes from "../../game-data/json/MagicSuffix.json";
import runewords from "../../game-data/json/Runewords.json";

// TODO: switch to JSON.parse
export const ARMORS: Record<string, Armor | undefined> = armors;
export const WEAPONS: Record<string, Weapon | undefined> = weapons;
export const MISC: Record<string, Misc | undefined> = misc;
export const UNIQUE_ITEMS: UniqueItem[] = uniqueItems;
export const SET_ITEMS: SetItem[] = setItems;
export const SETS: Record<string, Set> = sets;
export const PROPERTIES = properties as Record<string, Property>;
export const ITEM_STATS: (ItemStat | null)[] = itemStats;
export const STAT_GROUPS: StatGroup[] = statGroups;
export const SKILLS: Skill[] = skills;
export const SKILL_TABS: SkillTab[] = skillTabs;
export const CHAR_CLASSES: CharacterClass[] = charClasses;
export const RARE_NAMES: string[] = rareNames;
export const MAGIC_PREFIXES: MagicAffix[] = magicPrefixes;
export const MAGIC_SUFFIXES: MagicAffix[] = magicSuffixes;
export const RUNEWORDS: Runeword[] = runewords;

export * from "./types";
