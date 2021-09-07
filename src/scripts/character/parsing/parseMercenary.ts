import { SaveFileReader } from "../../stash/parsing/SaveFileReader";
import { parseItemList } from "../../items/parsing/parseItemList";

export function parseMercenary(reader: SaveFileReader) {
  const header = reader.readString(2);
  if (header !== "jf") {
    throw new Error(`Unexpected header ${header} for mercenary data`);
  }
  // TODO: add field to track that this is on a mercenary, not equipped on the character.
  return parseItemList(reader);
}
