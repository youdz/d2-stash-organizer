import { PlugyStash } from "../../plugy-stash/types";
import { Item } from "../types/Item";
import { collision } from "./collision";
import { positionItem } from "./positionItem";

export function moveItem(
  stash: PlugyStash,
  item: Item,
  toPage: number,
  row: number,
  col: number
) {
  // FIXME: this is legacy, we should use transferItem now for organization
  // Remove from the current page
  for (const page of stash.pages) {
    const index = page.items.indexOf(item);
    if (index >= 0) {
      page.items.splice(index, 1);
      break;
    }
  }
  if (!stash.pages[toPage]) {
    throw new Error(
      "Cannot move an item to a page that has not been created yet"
    );
  }

  const target: Item = { ...item, row, column: col };
  const itemInSameSpot = stash.pages[toPage].items.find((other) =>
    collision(target, other)
  );
  if (itemInSameSpot) {
    throw new Error(
      `Trying to move ${item.name} to the same spot as ${itemInSameSpot.name}`
    );
  }
  stash.pages[toPage].items.push(item);
  item.owner = stash;
  item.page = toPage;
  positionItem(item, [col, row]);
}
