import { Stash } from "../types";
import { postProcessItem } from "../../items/post-processing/postProcessItem";

/**
 * Performs all operations that are not actually parsing, but that we need for our scripts and UI.
 * This includes generating human-friendly descriptions for the items,
 * making mods more searchable or sortable, etc.
 */
export function postProcessStash(stash: Stash) {
  for (const { items } of stash.pages) {
    for (const item of items) {
      postProcessItem(item);
    }
  }
}
