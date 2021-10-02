import { SaveFileReader } from "../../save-file/SaveFileReader";
import { parseItemList } from "../../items/parsing/parseItemList";
import { Character } from "../types";

export function parseCorpses(reader: SaveFileReader, character: Character) {
  const header = reader.readString(2);
  if (header !== "JM") {
    throw new Error(`Unexpected header ${header} for corpse data`);
  }
  // The game actually only keeps a single corpse when leaving a game,
  // so it's not worth a huge effort to try and adapt to every case.
  const nbCorpses = reader.readInt16LE();
  character.hasCorpse = nbCorpses > 0;
  for (let i = 0; i < nbCorpses; i++) {
    // Corpse position, we don't care
    reader.read(12);
    const items = parseItemList(reader, character.version);
    for (const item of items) {
      item.corpse = true;
    }
    character.items.push(...items);
  }
}
