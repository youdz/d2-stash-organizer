import { Item } from "../types/Item";
import { getBase } from "../getBase";

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
