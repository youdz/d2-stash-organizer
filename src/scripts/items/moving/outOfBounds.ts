import { Item } from "../types/Item";
import { getBase } from "../getBase";

export function outOfBounds(item: Item, maxHeight: number, maxWidth: number) {
  const { height, width } = getBase(item);
  return item.row + height > maxHeight || item.column + width > maxWidth;
}
