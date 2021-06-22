import { Stash } from "../types";
import { consolidateMods } from "../../items/post-processing/consolidateMods";
import { describeSingleMod } from "../../items/post-processing/describeSingleMod";
import { addModGroups } from "../../items/post-processing/addModGroups";
import { addSocketedMods } from "../../items/post-processing/addSocketedMods";

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

      consolidateMods(item);
      // Generate descriptions only after consolidating
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
  }
}
