import { postProcessItem } from "../../items/post-processing/postProcessItem";
import { D2rStash } from "../types";

/**
 * Performs all operations that are not actually parsing, but that we need for our scripts and UI.
 * This includes generating human-friendly descriptions for the items,
 * making mods more searchable or sortable, etc.
 */
export function postProcessStash(stash: D2rStash) {
  stash.pages.forEach(({ items }, pageIndex) => {
    for (const item of items) {
      item.owner = stash;
      item.page = pageIndex;
      postProcessItem(item);
    }
  });
}
