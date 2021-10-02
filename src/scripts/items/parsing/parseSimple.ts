import { Item } from "../types/Item";
import { BinaryStream } from "../../save-file/binary";
import { getBase } from "../getBase";

export function parseSimple({ readBool, readInt }: BinaryStream) {
  const item: Item = {
    raw: "",

    identified: readBool(20),
    socketed: readBool(27),
    simple: readBool(37),
    ethereal: readBool(38),
    personalized: readBool(40),
    runeword: readBool(42),

    location: readInt(3, 58),
    equippedInSlot: readInt(4, 61),
    stored: readInt(3, 73),

    column: readInt(4, 65),
    row: readInt(4, 69),

    code: String.fromCharCode(
      readInt(8, 76),
      readInt(8),
      readInt(8),
      readInt(8)
    ).trim(),

    search: "",
  };

  if (item.socketed) {
    item.nbFilledSockets = readInt(3, 108);
    if (item.nbFilledSockets > 0) {
      // Array to store socketed items
      item.filledSockets = [];
    }
  }

  if (item.simple) {
    item.name = getBase(item).name;
  }

  return item;
}
