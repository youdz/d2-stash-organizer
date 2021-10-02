import { SaveFileReader } from "../../save-file/SaveFileReader";
import { Character } from "../types";
import { parseAttributes } from "./parseAttributes";
import { parseItemList } from "../../items/parsing/parseItemList";
import { parseMercenary } from "./parseMercenary";
import { postProcessCharacter } from "./postProcessCharacter";
import { parseCorpses } from "./parseCorpses";

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
    version: reader.readInt32LE(4),
    name: reader.readNullTerminatedString(20),
    class: reader.readInt8(40),
    hasCorpse: false,
    hasMercenary: !!reader.readInt32LE(179),
    characterData: new Uint8Array(),
    golem: new Uint8Array(),
    items: [],
  };

  parseAttributes(reader);

  // Skip over skills
  reader.readString(32);

  character.characterData = reader.read(reader.nextIndex - 16, 16);

  // Items on the character or in stash
  character.items.push(...parseItemList(reader, character.version));

  // Items on a corpse
  parseCorpses(reader, character);

  // TODO: classic characters
  const expansionChar = true;
  if (expansionChar) {
    parseMercenary(reader, character);
    character.golem = reader.readRemaining();
  }

  postProcessCharacter(character);
  return character;
}
