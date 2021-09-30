import { SaveFileReader } from "../../save-file/SaveFileReader";
import { parseItemList } from "../../items/parsing/parseItemList";
import { Character } from "../types";

export function parseMercenary(reader: SaveFileReader, character: Character) {
  const header = reader.readString(2);
  if (header !== "jf") {
    throw new Error(`Unexpected header ${header} for mercenary data`);
  }
  // If the player has never had a mercenary, there is no item list
  if (character.hasMercenary) {
    const items = parseItemList(reader);
    for (const item of items) {
      item.mercenary = true;
    }
    character.items.push(...items);
  }
}
