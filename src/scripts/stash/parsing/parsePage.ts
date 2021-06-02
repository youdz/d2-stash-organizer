import { strict as assert } from "assert";
import { parseItem } from "../../items/parsing/parseItem";
import { ItemLocation } from "../../items/types/ItemLocation";
import { Page } from "../types";

export function parsePage(raw: Buffer) {
  assert.equal(raw.toString("utf-8", 0, 2), "ST");
  const nameEnd = raw.indexOf("JM");
  const page: Page = {
    flags: raw[2],
    // 4 bytes of flags before the name, and one empty byte at the end
    name: raw.toString("utf-8", 6, nameEnd - 1),
    // Number of items: "JM" + raw.readInt16LE(nameEnd + 2),
    items: [],
  };
  // After that comes the first item
  let currentItem = raw.indexOf("JM", nameEnd + 2);
  while (currentItem >= 0) {
    const nextItem = raw.indexOf("JM", currentItem + 2);
    const parsedItem = parseItem(
      raw.slice(currentItem, nextItem >= 0 ? nextItem : undefined)
    );
    if (parsedItem.location === ItemLocation.SOCKET) {
      const socketedItem = page.items[page.items.length - 1];
      if (!socketedItem.filledSockets) {
        throw new Error("Trying to socket a non-socketed item");
      }
      socketedItem.filledSockets.push(parsedItem);
    } else {
      page.items.push(parsedItem);
    }
    currentItem = nextItem;
  }
  return page;
}
