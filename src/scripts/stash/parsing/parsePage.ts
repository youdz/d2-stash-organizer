import { Page } from "../types";
import { SaveFileReader } from "./SaveFileReader";
import { parseItemList } from "../../items/parsing/parseItemList";

export function parsePage(reader: SaveFileReader): Page {
  const header = reader.readString(2);
  if (header !== "ST") {
    throw new Error(`Unexpected header ${header} for a stash page`);
  }

  // To check if the save file has flags on stash pages,
  // we check if the next null character is immediately followed by "JM"
  reader.peek = true;
  reader.readNullTerminatedString();
  reader.read(1);
  const hasFlags = reader.readString(2) !== "JM";
  reader.peek = false;

  let flags: number | undefined;
  if (hasFlags) {
    flags = reader.readInt8();
    // 3 empty bytes after the flags
    reader.read(3);
  }

  return {
    flags,
    name: reader.readNullTerminatedString(),
    items: parseItemList(reader),
  };
}
