import { Item } from "../../items/types/Item";
import { layout } from "../layout";
import { Stash } from "../../stash/types";
import { moveItem } from "../../stash/moveItem";
import { makeIndex } from "../../stash/makeIndex";
import { addPage } from "../../stash/addPage";

export function organizeUnknown(stash: Stash, items: Item[]) {
  if (items.length === 0) return;

  const offset = stash.pages.length;
  const { nbPages, positions } = layout("lines", [items]);
  for (let i = 0; i < nbPages; i++) {
    const page = addPage(stash, "Unrecognized");
    if (i === 0) {
      makeIndex(page, true);
    }
  }
  for (const [item, { page, rows, cols }] of positions.entries()) {
    moveItem(stash, item, offset + page, rows[0], cols[0]);
  }
}
