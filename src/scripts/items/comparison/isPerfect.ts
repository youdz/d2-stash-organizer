import { Item } from "../types/Item";
import { ItemQuality } from "../types/ItemQuality";
import { compare } from "./compare";
import { generatePerfectItem } from "./generatePerfectItem";
import { SET_ITEMS, UNIQUE_ITEMS } from "../../../game-data";

export function isPerfect(item: Item) {
  if (typeof item.unique === "undefined") {
    throw new Error("Only uniques and set items can be tested for perfection.");
  }
  const list = item.quality === ItemQuality.SET ? SET_ITEMS : UNIQUE_ITEMS;
  const diff = compare(item, generatePerfectItem(list[item.unique]));
  return diff.every(({ stat, value }) => stat === "ethereal" || value >= 0);
}

// Temporary
export function checkAllUniquesAndSets(items: Item[]) {
  for (const item of items) {
    if (
      item.quality === ItemQuality.UNIQUE ||
      item.quality === ItemQuality.SET
    ) {
      if (isPerfect(item)) {
        console.log(`\x1b[32m${item.name} ✔\x1b[39m`);
      } else {
        console.log(`\x1b[31m${item.name} ✘\x1b[39m`);
      }
    }
  }
}
