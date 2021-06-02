import { Item } from "../../items/types/Item";
import { layout } from "../layout";
import { PageFlags, Stash } from "../../stash/types";
import { moveItem } from "../../stash/moveItem";
import { makeIndex } from "../../stash/makeIndex";

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
    const page = { name: "# Rejuvs", items: [], flags: PageFlags.SHARED };
    if (i === 0) {
      makeIndex(page, true);
    }
    stash.pages.push(page);
  }
  for (const [item, { page, rows, cols }] of positions.entries()) {
    moveItem(stash, item, offset + page, rows[0], cols[0]);
  }
}
