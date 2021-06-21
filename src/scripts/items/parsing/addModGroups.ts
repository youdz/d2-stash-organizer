import { Item } from "../types/Item";
import { STAT_GROUPS, StatGroup } from "../../../game-data";
import { Modifier } from "../types/Modifier";
import { describeSingleMod } from "./describeSingleMod";

function addGroup(group: StatGroup, item: Item) {
  // This function relies on a specific order for these mods (see poison)
  const mods =
    item.modifiers?.filter(({ id }) => group.statsInGroup.includes(id)) ?? [];
  // We assume a mods have been merged so we cannot have duplicates
  if (mods.length !== group.statsInGroup.length) {
    return false;
  }
  if (group.allEqual && mods.some(({ value }) => value !== mods[0].value)) {
    return false;
  }
  // On some rare items we can get increase in min damage that's larger than the increase in max damage.
  // The game solves this by displaying them separately.
  if (group.isRange && (mods[0].value ?? 0) > (mods[1].value ?? 0)) {
    return false;
  }
  // Damage increase on non-weapons is awkward, it has all 4 mods that apply in the multiple groups.
  if (
    group.stat === "group:secondary-dmg" ||
    group.stat === "group:min-dmg" ||
    group.stat === "group:max-dmg"
  ) {
    // We already wrong the range down, ignore these "duplicate" groups
    if (item.modifiers?.find((mod) => mod.stat === "group:primary-dmg")) {
      // We still have to remember to delete the description from the mods,
      // primary-dmg only contains 2, not all 4.
      for (const mod of mods) {
        delete mod.description;
      }
      return false;
    }
  }

  const extraMod: Modifier = {
    id: -1,
    stat: group.stat,
    priority: group.descPriority,
    value: group.allEqual ? mods[0].value : undefined,
    values: mods.map(({ value }) => value ?? 0),
  };
  extraMod.description = describeSingleMod(extraMod, group);
  item.modifiers?.push(extraMod);

  // Clear descriptions of items in group so they are not displayed
  for (const mod of mods) {
    delete mod.description;
  }
  return true;
}

export function addModGroups(item: Item) {
  for (const group of STAT_GROUPS) {
    addGroup(group, item);
  }
}
