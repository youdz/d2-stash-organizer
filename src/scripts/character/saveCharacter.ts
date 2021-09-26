import { open } from "fs/promises";
import { Character } from "./types";
import { characterToSaveFile } from "./parsing/characterToSaveFile";

export async function saveCharacter(character: Character, path: string) {
  const fileHandle = await open(path, "w");
  await fileHandle.appendFile(characterToSaveFile(character));
  await fileHandle.close();
}
