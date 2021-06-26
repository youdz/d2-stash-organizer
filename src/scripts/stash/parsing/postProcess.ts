import { Stash } from "../types";
import { consolidateMods } from "../../items/post-processing/consolidateMods";
import { describeSingleMod } from "../../items/post-processing/describeSingleMod";
import { addModGroups } from "../../items/post-processing/addModGroups";
import { addSocketedMods } from "../../items/post-processing/addSocketedMods";
import { ItemQuality } from "../../items/types/ItemQuality";
import { Modifier } from "../../items/types/Modifier";

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
      if (!item.modifiers) {
        continue;
      }

      consolidateMods(item.modifiers);
      // Generate descriptions only after consolidating
      for (const mod of item.modifiers) {
        mod.description = describeSingleMod(mod);
      }
      addModGroups(item.modifiers);
      sortByPriority(item.modifiers);
      item.description?.push(
        ...item.modifiers
          .map(({ description }) => description)
          .filter((desc): desc is string => !!desc)
      );

      if (item.quality === ItemQuality.SET) {
        // FIXME: this needs to be more explicit for UI to display.
        item.description?.push("");
        item.setModifiers?.forEach((mods, i) => {
          for (const mod of mods) {
            mod.description = `${describeSingleMod(mod)} (${i + 2} items)`;
          }
          addModGroups(mods);
          sortByPriority(mods);
          item.description?.push(
            ...mods
              .map(({ description }) => description)
              .filter((desc): desc is string => !!desc)
          );
        });
      }
    }
  }
}
