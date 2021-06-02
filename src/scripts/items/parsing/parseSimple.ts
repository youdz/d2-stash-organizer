import { Item } from "../types/Item";
import { BinaryStream } from "./binary";
import { getBase } from "../getBase";

export function parseSimple({ raw, readBool, readInt }: BinaryStream) {
  const item: Item = {
    raw,

    identified: readBool(20),
    socketed: readBool(27),
    simple: readBool(37),
    ethereal: readBool(38),
    runeword: readBool(42),

    location: readInt(3, 58),
    // TODO: handle not stored to support character saves
    stored: readInt(3, 73),

    column: readInt(4, 65),
    row: readInt(4, 69),

    code: String.fromCharCode(
      readInt(8, 76),
      readInt(8),
      readInt(8),
      readInt(8)
    ).trim(),
  };

  if (item.socketed && readInt(3, 108)) {
    // Array to store socketed items
    item.filledSockets = [];
  }

  if (item.simple) {
    item.name = getBase(item).name;
  }

  return item;
}
