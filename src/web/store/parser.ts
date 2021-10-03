import { parseCharacter } from "../../scripts/character/parsing/parseCharacter";
import { parsePlugyStash } from "../../scripts/plugy-stash/parsing/parsePlugyStash";
import { plugyStashToSaveFile } from "../../scripts/plugy-stash/parsing/plugyStashToSaveFile";
import { isPlugyStash, ItemsOwner } from "../../scripts/save-file/ownership";
import { characterToSaveFile } from "../../scripts/character/parsing/characterToSaveFile";

const DEFAULT_SHARED_FILENAME = "_LOD_SharedStashSave.sss";
const DEFAULT_PERSONAL_FILENAME = "CharacterName.d2x";
const DEFAULT_CHARACTER_FILENAME = "CharacterName.d2s";

export async function parseSaveFile(file: File) {
  try {
    const raw = new Uint8Array(await file.arrayBuffer());
    if (file.name.endsWith(".d2s")) {
      return parseCharacter(raw, file);
    } else {
      return parsePlugyStash(raw, file);
    }
  } catch (e) {
    if (e instanceof Error) {
      alert(e.message);
    }
    throw e;
  }
}

export function toSaveFile(owner: ItemsOwner) {
  if (isPlugyStash(owner)) {
    return new File(
      [new Blob([plugyStashToSaveFile(owner).buffer])],
      owner.filename ||
        (owner.personal ? DEFAULT_PERSONAL_FILENAME : DEFAULT_SHARED_FILENAME)
    );
  } else {
    return new File(
      [new Blob([characterToSaveFile(owner).buffer])],
      owner.filename || DEFAULT_CHARACTER_FILENAME
    );
  }
}
