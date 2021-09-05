import { parseItem } from "../../items/parsing/parseItem";
import { ItemLocation } from "../../items/types/ItemLocation";
import { Page } from "../types";
import { Item } from "../../items/types/Item";
import { SaveFileReader } from "./SaveFileReader";

export function parsePage(reader: SaveFileReader) {
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

  const page: Page = {
    flags,
    name: reader.readNullTerminatedString(),
    items: [],
  };
  // Number of items, which ignore: "JM" + reader.readInt16LE()
  reader.read(4);

  function pageDone() {
    reader.peek = true;
    const done = reader.done || reader.readString(2) === "ST";
    reader.peek = false;
    return done;
  }

  // After that comes the first item
  while (!pageDone()) {
    const currentItemRaw = [];
    let parsedItem: Item | false = false;
    // Sometimes the item ID will contain "JM" or "ST", we have to skip over that
    while (!parsedItem) {
      currentItemRaw.push(...reader.readUntil(["JM", "ST"], 2));
      parsedItem = parseItem(Uint8Array.from(currentItemRaw));
    }
    if (parsedItem.location === ItemLocation.SOCKET) {
      const socketedItem = page.items[page.items.length - 1];
      if (!socketedItem.filledSockets) {
        throw new Error("Trying to socket a non-socketed item");
      }
      socketedItem.filledSockets.push(parsedItem);
    } else {
      page.items.push(parsedItem);
    }
  }
  return page;
}
