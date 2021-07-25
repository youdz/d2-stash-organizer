import { Stash } from "../types";
import { consolidateMods } from "../../items/post-processing/consolidateMods";
import { describeSingleMod } from "../../items/post-processing/describeSingleMod";
import { addModGroups } from "../../items/post-processing/addModGroups";
import { addSocketedMods } from "../../items/post-processing/addSocketedMods";
import { ItemQuality } from "../../items/types/ItemQuality";
import { Modifier } from "../../items/types/Modifier";

// TODO: (low priority) order of charges on Todesfaelle Flamme is wrong
function sortByPriority(modifiers: Modifier[]) {
  modifiers.sort(
    ({ priority: a, param: c }, { priority: b, param: d }) =>
      b - a || (d ?? 0) - (c ?? 0)
  );
}

/**
 * Performs all operations that are not actually parsing, but that we need for our scripts and UI.
 * This includes generating human-friendly descriptions for the items,
 * making mods more searchable or sortable, etc.
 */
export function postProcess(stash: Stash) {
  for (const { items } of stash.pages) {
    for (const item of items) {
      if (item.filledSockets) {
        for (const socketed of item.filledSockets) {
          addSocketedMods(item, socketed);
        }
      }

      if (item.modifiers) {
        consolidateMods(item.modifiers);
        // Generate descriptions only after consolidating
        for (const mod of item.modifiers) {
          mod.description = describeSingleMod(mod);
        }
        addModGroups(item.modifiers);
        sortByPriority(item.modifiers);
        for (const { description } of item.modifiers) {
          if (description) {
            item.search += `${description}\n`;
          }
        }
      }

      if (item.quality === ItemQuality.SET) {
        item.setModifiers?.forEach((mods, i) => {
          for (const mod of mods) {
            mod.description = `${describeSingleMod(mod)} (${i + 2} items)`;
          }
          addModGroups(mods);
          sortByPriority(mods);
          for (const { description } of mods) {
            if (description) {
              item.search += `${description}\n`;
            }
          }
        });
      }

      if (item.ethereal) {
        item.search += "Ethereal";
      }
      if (item.sockets) {
        item.search += `Socketed (${item.sockets})`;
      }

      item.search = item.search.toLowerCase();
    }
  }
}
