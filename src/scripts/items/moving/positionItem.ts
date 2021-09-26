import { Item } from "../types/Item";
import { fromInt } from "../../save-file/binary";

export function positionItem(item: Item, [col, row]: [number, number]) {
  item.column = col;
  item.row = row;
  item.raw =
    item.raw.slice(0, 65) +
    fromInt(col, 4) +
    fromInt(row, 4) +
    item.raw.slice(73);
}
