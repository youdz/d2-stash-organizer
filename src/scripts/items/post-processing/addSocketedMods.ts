import { Item } from "../types/Item";
import {
  ARMORS,
  GEMS,
  ITEM_STATS,
  ModifierRange,
  PROPERTIES,
  SKILL_TABS,
} from "../../../game-data";
import { ItemParsingError } from "../../errors/ItemParsingError";
import { Modifier } from "../types/Modifier";

// No socketable item can imbue extra sockets, but I want this logic
// to be clean somewhere in case I need it in the future.
const SPECIAL_PROPS = ["sock"];

function generateMods(ranges: ModifierRange[]) {
  const modifiers: Modifier[] = [];
  for (const { prop, min, max, param } of ranges) {
    if (SPECIAL_PROPS.includes(prop)) {
      continue;
    }
    const { stats } = PROPERTIES[prop];
    for (const { stat, type } of stats) {
      // Check if this frequent findIndex impacts performance
      const statId = ITEM_STATS.findIndex(
        (itemStat) => itemStat?.stat === stat
      );
      if (!statId) {
        throw new Error(`Unknown mod ${stat}`);
      }
      const previous = modifiers[modifiers.length - 1];
      const shared: Modifier = {
        id: statId,
        stat,
        priority: ITEM_STATS[statId]!.descPriority,
      };
      switch (type) {
        case "proc":
          modifiers.push({
            ...shared,
            level: max!,
            spell: Number(param!),
            chance: min!,
          });
          break;
        case "charges":
          modifiers.push({
            ...shared,
            level: max!,
            spell: Number(param!),
            charges: min!,
            maxCharges: min!,
          });
          break;
        case "all":
          if (!("value" in previous)) {
            throw new Error("No previous mod to copy");
          }
          modifiers.push({
            ...shared,
            value: previous.value,
            param: previous.param,
          });
          break;
        case "min":
          modifiers.push({
            ...shared,
            value: min!,
          });
          break;
        case "max":
          modifiers.push({
            ...shared,
            value: max!,
          });
          break;
        case "param":
          modifiers.push({
            ...shared,
            value: Number(param!),
          });
          break;
        case "other":
          if (min !== max) {
            throw new Error("Socketable items cannot have a ranged modifier");
          }
          modifiers.push({
            ...shared,
            value: max!,
            param: param
              ? stat === "item_addskill_tab"
                ? SKILL_TABS[Number(param)].id
                : Number(param)
              : undefined,
          });
      }
    }
  }
  return modifiers;
}

/**
 * Adds mods from sockets to the base item
 */
export function addSocketedMods(socketedItem: Item, socketable: Item) {
  if (!socketedItem.modifiers) {
    socketedItem.modifiers = [];
  }
  if (socketable.code === "jew") {
    // Jewel
    socketedItem.modifiers.push(...socketable.modifiers!);
  } else {
    // Gem or rune
    const gem = GEMS[socketable.code];
    if (!gem) {
      throw new ItemParsingError(
        socketedItem,
        "Only gems, runes and jewels can be put in sockets"
      );
    }
    const base = ARMORS[socketedItem.code];
    let ranges: ModifierRange[];
    if (!base) {
      // Not an armor, so it has to be a weapon
      ranges = gem.weapon;
    } else if (
      base.type === "shie" ||
      base.type === "head" ||
      base.type === "ashd"
    ) {
      ranges = gem.shield;
    } else {
      ranges = gem.armor;
    }
    socketedItem.modifiers.push(...generateMods(ranges));
  }
}
