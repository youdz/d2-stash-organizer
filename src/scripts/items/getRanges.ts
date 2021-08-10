import {ModifierRange, RUNEWORDS, SET_ITEMS, UNIQUE_ITEMS} from "../../game-data";
import {Item} from "./types/Item";
import {ItemQuality} from "./types/ItemQuality";

export function getRanges(item: Item): ModifierRange[] {
  let ranges: ModifierRange[] = [];
  if (item.runeword) {
    ranges = RUNEWORDS[item.runewordId!].modifiers;
  } else if (item.quality === ItemQuality.UNIQUE) {
    ranges = UNIQUE_ITEMS[item.unique!].modifiers;
  } else if (item.quality === ItemQuality.SET) {
    ranges = SET_ITEMS[item.unique!].baseModifiers;
  } else {
    return ranges;
  }
  // We ignore the "Extra bloody" prop not to confuse people with hidden imperfections
  ranges = ranges.filter(({prop}) => prop !== "bloody");
  return ranges;
}
