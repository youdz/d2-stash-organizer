import { Item } from "../types/Item";
import { BinaryStream } from "../../save-file/binary";
import { getBase } from "../getBase";
import { FIRST_D2R } from "../../character/parsing/versions";
import { readHuffman } from "./huffman";

export function parseSimple(stream: BinaryStream, version: number) {
  const { readBool, readInt, skip } = stream;

  const item: Item = {
    raw: "",

    identified: skip(4) || readBool(),
    socketed: skip(6) || readBool(),
    // TODO: support ears
    simple: skip(9) || readBool(),
    ethereal: readBool(),
    personalized: skip(1) || readBool(),
    runeword: skip(1) || readBool(),

    // Version of the item uses a different size in D2R
    location: skip(version >= FIRST_D2R ? 8 : 15) || readInt(3),
    equippedInSlot: readInt(4),
    column: readInt(4),
    row: readInt(4),
    stored: readInt(3),

    code: "",
    search: "",
  };

  if (version >= FIRST_D2R) {
    item.code = readHuffman(stream, 4).trim();
  } else {
    item.code = String.fromCharCode(
      readInt(8),
      readInt(8),
      readInt(8),
      readInt(8)
    ).trim();
  }

  item.nbFilledSockets = readInt(item.simple ? 1 : 3);
  if (item.socketed && item.nbFilledSockets > 0) {
    // Array to store socketed items
    item.filledSockets = [];
  }

  if (item.simple) {
    item.name = getBase(item).name;
  }

  return item;
}
