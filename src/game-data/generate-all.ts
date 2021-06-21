import { armorsToJson } from "./parsing/armors";
import { itemStatsToJson } from "./parsing/itemStats";
import { propertiesToJson } from "./parsing/properties";
import { weaponsToJson } from "./parsing/weapons";
import { setsToJson } from "./parsing/sets";
import { uniquesToJson } from "./parsing/uniques";
import { skillsToJson } from "./parsing/skills";
import { skillTabsToJson } from "./parsing/skillTabs";
import { rareNamesToJson } from "./parsing/rareNames";
import { miscToJson } from "./parsing/misc";
import { magicAffixesToJson } from "./parsing/magicAffixes";
import { runewordsToJson } from "./parsing/runewords";
import { charClassesToJson } from "./parsing/charClasses";
import { statGroupsToJson } from "./parsing/statGroups";

async function generateAll() {
  await armorsToJson();
  await weaponsToJson();
  const misc = await miscToJson();
  const itemStats = await itemStatsToJson();
  await statGroupsToJson(itemStats);
  await propertiesToJson();
  const charClasses = await charClassesToJson();
  const skills = await skillsToJson(charClasses);
  await skillTabsToJson();
  await magicAffixesToJson();
  await rareNamesToJson();
  await uniquesToJson(skills);
  await setsToJson(skills);
  await runewordsToJson(misc, skills);
}

void generateAll();
