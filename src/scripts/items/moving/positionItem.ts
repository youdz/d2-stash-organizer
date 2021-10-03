import { Item } from "../types/Item";
import { fromInt } from "../../save-file/binary";
import { FIRST_D2R } from "../../character/parsing/versions";
import { D2R_OFFSET } from "./conversion";

export function positionItem(item: Item, [col, row]: [number, number]) {
  const offset = item.owner.version >= FIRST_D2R ? D2R_OFFSET : 0;
  item.column = col;
  item.row = row;
  item.raw =
    item.raw.slice(0, 65 + offset) +
    fromInt(col, 4) +
    fromInt(row, 4) +
    item.raw.slice(73 + offset);
}
