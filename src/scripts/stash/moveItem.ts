import { Stash } from "./types";
import { Item } from "../items/types/Item";
import { fromInt } from "../items/parsing/binary";
import { getBase } from "../items/getBase";
import { characterName } from "./characterName";

export function collision(a: Item, b: Item) {
  const { width: wa, height: ha } = getBase(a);
  const { width: wb, height: hb } = getBase(b);
  return (
    a.row + ha > b.row &&
    b.row + hb > a.row &&
    a.column + wa > b.column &&
    b.column + wb > a.column
  );
}

export function moveItem(
  stash: Stash,
  item: Item,
  toPage: number,
  row: number,
  col: number
) {
  // FIXME: does not work if item comes from another stash
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
      "Cannot move an item to a page that has not bee created yet"
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
  item.character = characterName(stash);
  item.page = toPage;
  item.row = row;
  item.column = col;
  // TODO: Set item location and storage type if it was not stored before
  item.raw =
    item.raw.slice(0, 65) +
    fromInt(col, 4) +
    fromInt(row, 4) +
    item.raw.slice(73);
}
