import { BinaryStream } from "./binary";
import { Item } from "../types/Item";
import { ItemQuality } from "../types/ItemQuality";
import { ITEM_STATS } from "../../../game-data";
import { Modifier } from "../types/Modifier";

/*
 * Parses one list of modifiers at a time. Some items have more than one:
 * - Runewords have one for the base item mods, and one for the runeword itself
 * - Sets have one for each increment in set bonuses
 */
function parseModsList({ readInt }: BinaryStream, mods: Modifier[]) {
  let modId = readInt(9);
  while (modId !== 511) {
    const modInfo = ITEM_STATS[modId];
    if (!modInfo) {
      throw new Error(`Unknown mod ${modId}`);
    }
    if (modInfo.encode === 3) {
      mods.push({
        stat: modInfo.stat,
        level: readInt(6) - modInfo.bias,
        spell: readInt(10) - modInfo.bias,
        charges: readInt(8) - modInfo.bias,
        maxCharges: readInt(8) - modInfo.bias,
      });
    } else if (modInfo.encode === 2) {
      mods.push({
        stat: modInfo.stat,
        level: readInt(6) - modInfo.bias,
        spell: readInt(10) - modInfo.bias,
        chance: readInt(modInfo.size) - modInfo.bias,
      });
    } else {
      let param = undefined;
      if (modInfo.paramSize) {
        param = readInt(modInfo.paramSize) - modInfo.bias;
      }
      mods.push({
        stat: modInfo.stat,
        value: readInt(modInfo.size) - modInfo.bias,
        param,
      });
    }

    if (modInfo.followedBy) {
      modId = modInfo.followedBy;
    } else {
      modId = readInt(9);
    }
  }
}

export function parseModifiers(stream: BinaryStream, item: Item) {
  item.modifiers = [];

  if (item.quality === ItemQuality.SET) {
    // Actually indicates how many items of the same set are needed for each list,
    // but we're only interested in the number of lists here.
    const nbLists = stream.read(5).split("1").length;
    for (let i = 0; i < nbLists - 1; i++) {
      parseModsList(stream, item.modifiers);
    }
  }

  if (item.runeword) {
    // Runewords have 2 lists, the base item mods and the runeword mods
    parseModsList(stream, item.modifiers);
  }

  parseModsList(stream, item.modifiers);
}
