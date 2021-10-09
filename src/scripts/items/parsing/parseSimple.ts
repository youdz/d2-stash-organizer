import { Item } from "../types/Item";
import { BinaryStream } from "../../save-file/binary";
import { getBase } from "../getBase";
import { FIRST_D2R } from "../../character/parsing/versions";
import { decodeHuffman } from "./huffman";
import { ItemsOwner } from "../../save-file/ownership";

export function parseSimple(stream: BinaryStream, owner: ItemsOwner) {
  const { read, readBool, readInt, skip } = stream;

  const item: Item = {
    raw: "",
    owner,

    identified: skip(4) || readBool(),
    socketed: skip(6) || readBool(),
    // TODO: support ears
    simple: skip(9) || readBool(),
    ethereal: readBool(),
    personalized: skip(1) || readBool(),
    runeword: skip(1) || readBool(),

    // Version of the item uses a different size in D2R
    version:
      skip(5) ||
      (owner.version >= FIRST_D2R ? read(3) : readInt(10).toString()),

    location: readInt(3),
    equippedInSlot: readInt(4),
    column: readInt(4),
    row: readInt(4),
    stored: readInt(3),

    code: "",
    search: "",
  };

  if (owner.version >= FIRST_D2R) {
    item.code = decodeHuffman(stream, 4).trim();
  } else {
    item.code = String.fromCharCode(
      readInt(8),
      readInt(8),
      readInt(8),
      readInt(8)
    ).trim();
  }

  // Checking base for all items, not just simple ones. That way we fail early if something goes wrong.
  const base = getBase(item);

  // Items that check for the difficulty they were found in have 2 extra bits for the difficulty
  if (base.trackQuestDifficulty) {
    read(2);
  }

  item.nbFilledSockets = readInt(item.simple ? 1 : 3);
  if (item.socketed && item.nbFilledSockets > 0) {
    // Array to store socketed items
    item.filledSockets = [];
  }

  if (item.simple) {
    item.name = base.name;
  }

  return item;
}
