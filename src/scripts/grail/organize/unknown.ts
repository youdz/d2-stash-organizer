import { Item } from "../../items/types/Item";
import { layout } from "../layout";
import { PageFlags, Stash } from "../../stash/types";
import { moveItem } from "../../stash/moveItem";
import { makeIndex } from "../../stash/makeIndex";

export function organizeUnknown(stash: Stash, items: Item[]) {
  if (items.length === 0) return;

  const offset = stash.pages.length;
  const { nbPages, positions } = layout("lines", [items]);
  for (let i = 0; i < nbPages; i++) {
    const page = { name: "# Unrecognized", items: [], flags: PageFlags.SHARED };
    if (i === 0) {
      makeIndex(page, true);
    }
    stash.pages.push(page);
  }
  for (const [item, { page, rows, cols }] of positions.entries()) {
    moveItem(stash, item, offset + page, rows[0], cols[0]);
  }
}
