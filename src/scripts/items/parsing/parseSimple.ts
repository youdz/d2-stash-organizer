import { Item } from "../types/Item";
import { BinaryStream } from "./binary";
import { getBase } from "../getBase";
import { RESPECS } from "../../grail/organize/respecs";
import { UBERS } from "../../grail/organize/ubers";

export function parseSimple({ raw, readBool, readInt }: BinaryStream) {
  const item: Item = {
    raw,

    identified: readBool(20),
    socketed: readBool(27),
    simple: readBool(37),
    ethereal: readBool(38),
    personalized: readBool(40),
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

    search: "",
  };

  if (item.socketed && readInt(3, 108)) {
    // Array to store socketed items
    item.filledSockets = [];
  }

  // These items seem to sometimes be simple, sometimes not, at random
  if (RESPECS.includes(item.code) || UBERS.includes(item.code)) {
    item.simple = true;
  }

  if (item.simple) {
    item.name = getBase(item).name;
  }

  return item;
}
