import { Item } from "../../items/types/Item";
import { layout } from "../layout";
import { Stash } from "../../stash/types";
import { makeIndex } from "../../stash/makeIndex";
import { addPage } from "../../stash/addPage";
import { moveItem } from "../../items/moving/safeMove";

function rejuvOrder(a: Item, b: Item) {
  // Large rejuvs first
  return a.code.localeCompare(b.code);
}

// I'd rather copy-paste a bit and have the flexibility to evolve each section separately
export function organizeRejuvs(stash: Stash, items: Item[]) {
  if (items.length === 0) return;

  items.sort(rejuvOrder);
  const offset = stash.pages.length;
  const { nbPages, positions } = layout("lines", [items]);
  for (let i = 0; i < nbPages; i++) {
    const page = addPage(stash, "Rejuvs");
    if (i === 0) {
      makeIndex(page, true);
    }
  }
  for (const [item, { page, rows, cols }] of positions.entries()) {
    moveItem(stash, item, offset + page, rows[0], cols[0]);
  }
}
