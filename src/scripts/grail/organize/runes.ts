import { Item } from "../../items/types/Item";
import { layout } from "../layout";
import { PlugyStash } from "../../plugy-stash/types";
import { makeIndex } from "../../plugy-stash/makeIndex";
import { addPage } from "../../plugy-stash/addPage";
import { moveItem } from "../../items/moving/safeMove";

export function organizeRunes(stash: PlugyStash, items: Item[]) {
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
