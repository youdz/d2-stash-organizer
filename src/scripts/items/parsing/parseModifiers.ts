import { BinaryStream } from "./binary";
import { Item } from "../types/Item";
import { ItemQuality } from "../types/ItemQuality";
import { ITEM_STATS } from "../../../game-data";
import { ItemParsingError } from "../../errors/ItemParsingError";
import { describeSingleMod } from "./describeSingleMod";
import { Modifier } from "../types/Modifier";
import { addModGroups } from "./addModGroups";
import { consolidateMods } from "./consolidateMods";

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

    if (modInfo.followedBy) {
      modId = modInfo.followedBy;
    } else {
      modId = readInt(9);
    }
  }
  item.modifiers!.push(...mods);
}

export function parseModifiers(stream: BinaryStream, item: Item) {
  item.modifiers = [];

  if (item.quality === ItemQuality.SET) {
    // Actually indicates how many items of the same set are needed for each list,
    // but we're only interested in the number of lists here.
    const nbLists = stream.read(5).split("1").length;
    for (let i = 0; i < nbLists - 1; i++) {
      parseModsList(stream, item);
    }
  }

  if (item.runeword) {
    // Runewords have 2 lists, the base item mods and the runeword mods
    parseModsList(stream, item);
  }

  parseModsList(stream, item);

  // TODO: move all this to a post-processing phase on the whole stack. It's not parsing
  consolidateMods(item);
  // Generate descriptions after consolidating
  for (const mod of item.modifiers) {
    mod.description = describeSingleMod(mod);
  }

  addModGroups(item);
  // FIXME: by sorting here, we break sets order. If we sort earlier, then groups and runewords are broken.
  item.modifiers.sort(
    ({ priority: a, param: c }, { priority: b, param: d }) =>
      b - a || (d ?? 0) - (c ?? 0)
  );
  item.description?.push(
    ...item.modifiers
      .map(({ description }) => description)
      .filter((desc): desc is string => !!desc)
  );
}
