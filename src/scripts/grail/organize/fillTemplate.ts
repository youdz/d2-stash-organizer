import { PlugyStash } from "../../plugy-stash/types";
import { Item } from "../../items/types/Item";
import { SetItem, UniqueItem } from "../../../game-data";
import { LayoutResult } from "../layout";
import { getGrailItem } from "../list/getGrailItem";
import { moveItem } from "../../items/moving/safeMove";

export function fillTemplate(
  stash: PlugyStash,
  items: Item[],
  { positions }: LayoutResult<UniqueItem | SetItem>,
  pageOffset: number
) {
  const done = new Map<UniqueItem | SetItem, number>();
  // Items we could not position
  const remaining = [];

  for (const item of items) {
    const unique = getGrailItem(item);
    if (!unique) {
      remaining.push(item);
      continue;
    }
    const nbDone = done.get(unique) ?? 0;
    const position = positions.get(unique);
    if (!position) {
      throw new Error(`Unknown position for grail item ${unique.name}`);
    }

    const { page, rows, cols } = position;
    if (nbDone >= rows.length * cols.length) {
      // No more space for this one, it goes in the extras
      remaining.push(item);
      continue;
    }
    moveItem(
      stash,
      item,
      page + pageOffset,
      rows[nbDone % rows.length],
      cols[Math.floor(nbDone / rows.length)]
    );
    done.set(unique, nbDone + 1);
  }

  return remaining;
}
