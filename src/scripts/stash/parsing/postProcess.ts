import { Stash } from "../types";
import { consolidateMods } from "../../items/post-processing/consolidateMods";
import { addSocketedMods } from "../../items/post-processing/addSocketedMods";
import { ItemQuality } from "../../items/types/ItemQuality";
import { addSetMods } from "../../items/post-processing/addSetModifiers";
import { describeMods } from "../../items/post-processing/describeMods";

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
        describeMods(item, item.modifiers);
      }

      if (item.quality === ItemQuality.SET) {
        item.setItemModifiers?.forEach((mods, i) => {
          describeMods(item, mods, ` (${i + 2} items)`);
        });

        addSetMods(item);
        item.setGlobalModifiers?.forEach((mods, i) => {
          describeMods(item, mods, i >= 4 ? "" : ` (${i + 2} items)`);
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
