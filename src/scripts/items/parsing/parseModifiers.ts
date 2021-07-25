import { BinaryStream } from "./binary";
import { Item } from "../types/Item";
import { ItemQuality } from "../types/ItemQuality";
import { ITEM_STATS } from "../../../game-data";
import { ItemParsingError } from "../../errors/ItemParsingError";
import { Modifier } from "../types/Modifier";

const ENHANCED_DEF_STATS = [
  "item_armor_percent",
  "armorclass",
  "item_armor_perlevel",
  "item_armorpercent_perlevel",
];

/*
 * Parses one list of modifiers at a time. Some items have more than one:
 * - Runewords have one for the base item mods, and one for the runeword itself
 * - Sets have one for each increment in set bonuses
 */
function parseModsList({ readInt }: BinaryStream, item: Item) {
  const mods: Modifier[] = [];
  let modId = readInt(9);
  while (modId !== 511) {
    const modInfo = ITEM_STATS[modId];
    if (!modInfo) {
      throw new ItemParsingError(item, `Unknown mod ${modId}`);
    }

    let mod: Modifier = {
      id: modId,
      stat: modInfo.stat,
      priority: modInfo.descPriority,
    };
    if (modInfo.encode === 3) {
      mod = {
        ...mod,
        level: readInt(6) - modInfo.bias,
        spell: readInt(10) - modInfo.bias,
        charges: readInt(8) - modInfo.bias,
        maxCharges: readInt(8) - modInfo.bias,
      };
    } else if (modInfo.encode === 2) {
      mod = {
        ...mod,
        level: readInt(6) - modInfo.bias,
        spell: readInt(10) - modInfo.bias,
        chance: readInt(modInfo.size) - modInfo.bias,
      };
    } else {
      let param = undefined;
      if (modInfo.paramSize) {
        param = readInt(modInfo.paramSize) - modInfo.bias;
      }
      mod = {
        ...mod,
        value: readInt(modInfo.size) - modInfo.bias,
        param,
      };
    }
    mods.push(mod);

    // Special mods we want to have easy access to when rendering in the UI
    if (ENHANCED_DEF_STATS.includes(mod.stat)) {
      item.enhancedDefense = true;
    }
    if (modInfo.stat === "maxdurability") {
      item.extraDurability = mod.value;
    }

    if (modInfo.followedBy) {
      modId = modInfo.followedBy;
    } else {
      modId = readInt(9);
    }
  }
  return mods;
}

export function parseModifiers(stream: BinaryStream, item: Item) {
  item.modifiers = [];

  // Indicates how many items of the same set are needed for each list.
  const flags = item.quality === ItemQuality.SET ? stream.read(5) : undefined;

  if (item.runeword) {
    // Runewords have 2 lists, the base item mods and the runeword mods
    item.modifiers.push(...parseModsList(stream, item));
  }

  item.modifiers.push(...parseModsList(stream, item));

  if (flags) {
    item.setItemModifiers = [];
    for (let i = 0; i < flags.length; i++) {
      if (flags[i] === "1") {
        item.setItemModifiers.push(parseModsList(stream, item));
      } else {
        item.setItemModifiers.push([]);
      }
    }
  }
}
