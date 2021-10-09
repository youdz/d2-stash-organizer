import { D2rPage, D2rStash } from "../types";
import { SaveFileReader } from "../../save-file/SaveFileReader";
import { parseItemList } from "../../items/parsing/parseItemList";

export function parsePage(reader: SaveFileReader, stash: D2rStash) {
  const header = reader.readInt32LE().toString(16);
  if (header !== "aa55aa55") {
    throw new Error(`Unexpected header ${header} for a stash page`);
  }

  reader.read(8);
  const page: D2rPage = {
    gold: reader.readInt32LE(),
    items: [],
  };

  // Position at the start of the list
  reader.read(48);
  page.items.push(...parseItemList(reader, stash));

  return page;
}
