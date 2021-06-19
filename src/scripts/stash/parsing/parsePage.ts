import { parseItem } from "../../items/parsing/parseItem";
import { ItemLocation } from "../../items/types/ItemLocation";
import { Page } from "../types";
import { indexOf } from "./indexOf";

export function parsePage(raw: Uint8Array) {
  const header = String.fromCharCode(...raw.slice(0, 2));
  if (header !== "ST") {
    throw new Error(`Unexpected header ${header} for a stash page`);
  }

  const nameEnd = indexOf(raw, "JM");
  const hasFlags = raw.indexOf(0) + 1 !== nameEnd;
  const page: Page = {
    flags: hasFlags ? raw[2] : undefined,
    // Possibly 4 bytes of flags before the name, and one empty byte at the end
    name: String.fromCharCode(...raw.slice(hasFlags ? 6 : 2, nameEnd - 1)),
    // Number of items: "JM" + raw.readInt16LE(nameEnd + 2),
    items: [],
  };
  // After that comes the first item
  let currentItem = indexOf(raw, "JM", nameEnd + 2);
  while (currentItem >= 0) {
    let nextItem = indexOf(raw, "JM", currentItem + 2);
    // Sometimes the item ID will contain "JM", we have to skip over that "JM"
    while (14 < nextItem - currentItem && nextItem - currentItem < 18) {
      nextItem = indexOf(raw, "JM", nextItem + 2);
    }
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
