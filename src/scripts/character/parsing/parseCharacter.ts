import { SaveFileReader } from "../../stash/parsing/SaveFileReader";
import { Character } from "../types";
import { parseAttributes } from "./parseAttributes";
import { parseItemList } from "../../items/parsing/parseItemList";
import { parseMercenary } from "./parseMercenary";

// Can't use Node's Buffer because this needs to run in the browser
export function parseCharacter(
  raw: Uint8Array,
  file?: { name: string; lastModified: number }
) {
  const reader = new SaveFileReader(raw);
  const header = reader.readInt32LE().toString(16);
  if (header !== "aa55aa55") {
    throw new Error("This does not look like a Diablo 2 character save (.d2s)");
  }
  const character: Character = {
    filename: file?.name ?? "",
    lastModified: file?.lastModified ?? 0,
    name: reader.readNullTerminatedString(20),
    class: reader.readInt8(40),
    items: [],
  };

  parseAttributes(reader);

  // Skip over skills
  reader.readString(32);

  // Items on the character or in stash
  character.items.push(...parseItemList(reader));
  // Items on a corpse
  character.items.push(...parseItemList(reader));

  const expansionChar = true;
  if (expansionChar) {
    character.items.push(...parseMercenary(reader));
  }

  return character;
}
