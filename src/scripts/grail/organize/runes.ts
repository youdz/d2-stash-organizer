import { Item } from "../../items/types/Item";
import { layout } from "../layout";
import { PageFlags, Stash } from "../../stash/types";
import { moveItem } from "../../stash/moveItem";
import { makeIndex } from "../../stash/makeIndex";

export function organizeRunes(stash: Stash, items: Item[]) {
  const offset = stash.pages.length;
  const { nbPages, positions } = layout("runes", [items]);
  for (let i = 0; i < nbPages; i++) {
    const page = { name: "# Runes", items: [], flags: PageFlags.SHARED };
    if (i === 0) {
      makeIndex(page, true);
    }
    stash.pages.push(page);
  }
  for (const [item, { page, rows, cols }] of positions.entries()) {
    moveItem(stash, item, offset + page, rows[0], cols[0]);
  }
}
