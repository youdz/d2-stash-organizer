import { Modifier } from "../types/Modifier";
import { describeSingleMod } from "./describeSingleMod";
import { addModGroups } from "./addModGroups";
import { Item } from "../types/Item";

// TODO: (low priority) order of charges on Todesfaelle Flamme is wrong
function sortByPriority(modifiers: Modifier[]) {
  modifiers.sort(
    ({ priority: a, param: c }, { priority: b, param: d }) =>
      b - a || (d ?? 0) - (c ?? 0)
  );
}

export function describeMods(item: Item, mods: Modifier[], append = "") {
  for (const mod of mods) {
    mod.description = describeSingleMod(mod);
    if (mod.description && append) {
      mod.description += append;
    }
  }
  addModGroups(mods);
  sortByPriority(mods);
  for (const { description } of mods) {
    if (description) {
      item.search += `${description}\n`;
    }
  }
}
