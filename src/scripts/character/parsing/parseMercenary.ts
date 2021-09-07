import { SaveFileReader } from "../../save-file/SaveFileReader";
import { parseItemList } from "../../items/parsing/parseItemList";

export function parseMercenary(reader: SaveFileReader) {
  const header = reader.readString(2);
  if (header !== "jf") {
    throw new Error(`Unexpected header ${header} for mercenary data`);
  }
  const items = parseItemList(reader);
  for (const item of items) {
    item.mercenary = true;
  }
  return items;
}
