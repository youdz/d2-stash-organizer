import { Item } from "../../items/types/Item";
import { layout } from "../layout";
import { Stash } from "../../stash/types";
import { makeIndex } from "../../stash/makeIndex";
import { addPage } from "../../stash/addPage";
import { moveItem } from "../../items/moving/safeMove";

export function organizeRunes(stash: Stash, items: Item[]) {
  const offset = stash.pages.length;
  const { nbPages, positions } = layout("runes", [items]);
  for (let i = 0; i < nbPages; i++) {
    const page = addPage(stash, "Runes");
    if (i === 0) {
      makeIndex(page, true);
    }
  }
  for (const [item, { page, rows, cols }] of positions.entries()) {
    moveItem(stash, item, offset + page, rows[0], cols[0]);
  }
}
