import { Item } from "../types/Item";
import { SET_ITEMS, SETS } from "../../../game-data";
import { ItemQuality } from "../types/ItemQuality";
import { generateFixedMods } from "./generateFixedMods";

/**
 * Adds global set modifiers to the item
 */
export function addSetMods(item: Item) {
  const set =
    item.quality === ItemQuality.SET && SETS[SET_ITEMS[item.unique!].set];
  if (!set) return;

  item.setGlobalModifiers = set.modifiers.map((notRanges) =>
    generateFixedMods(notRanges)
  );
}
