import { Item } from "../../items/types/Item";
import { Set, SET_ITEMS, SetItem, SETS } from "../../../game-data";
import { SETS_ORDER } from "./setsOrder";

export function groupBySet<T extends Item | SetItem>(items: T[]) {
  const bySet = new Map<Set, T[]>();
  // We create all of them because we still want empty pages for the grail
  // Using SET_ORDER so iteration order on the map is nice
  for (const section of SETS_ORDER) {
    for (const { set } of section) {
      bySet.set(SETS[set], []);
    }
  }
  for (const item of items) {
    const setItem =
      "set" in item ? (item as SetItem) : SET_ITEMS[(item as Item).unique!];
    bySet.get(SETS[setItem.set])!.push(item);
  }
  return bySet;
}
