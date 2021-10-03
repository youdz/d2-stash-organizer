import { Item } from "../../items/types/Item";
import { layout } from "../layout";
import { PlugyStash } from "../../plugy-stash/types";
import { makeIndex } from "../../plugy-stash/makeIndex";
import { sortAndGroupBy } from "./sortAndGroupBy";
import { addPage } from "../../plugy-stash/addPage";
import { moveItem } from "../../items/moving/safeMove";

// Order to display them in
export const RESPECS = ["tes", "ceh", "bet", "fed", "toa"];

export function organizeRespecs(stash: PlugyStash, items: Item[]) {
  if (items.length === 0) return;

  const groups = sortAndGroupBy(items, (item) => RESPECS.indexOf(item.code));
  const offset = stash.pages.length;
  const { nbPages, positions } = layout("lines", groups);
  for (let i = 0; i < nbPages; i++) {
    const page = addPage(stash, "Respecs");
    if (i === 0) {
      makeIndex(page, false);
    }
  }
  for (const [item, { page, rows, cols }] of positions.entries()) {
    moveItem(stash, item, offset + page, rows[0], cols[0]);
  }
}
