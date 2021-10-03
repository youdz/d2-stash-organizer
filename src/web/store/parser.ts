import { parseCharacter } from "../../scripts/character/parsing/parseCharacter";
import { parsePlugyStash } from "../../scripts/plugy-stash/parsing/parsePlugyStash";
import { plugyStashToSaveFile } from "../../scripts/plugy-stash/parsing/plugyStashToSaveFile";
import {
  isCharacter,
  isPlugyStash,
  ItemsOwner,
} from "../../scripts/save-file/ownership";
import { characterToSaveFile } from "../../scripts/character/parsing/characterToSaveFile";
import { d2rStashToSaveFile } from "../../scripts/d2r-stash/parsing/d2rStashToSaveFile";
import { parseD2rStash } from "../../scripts/d2r-stash/parsing/parseD2rStash";

const DEFAULT_SHARED_FILENAME = "_LOD_SharedStashSave.sss";
const DEFAULT_PERSONAL_FILENAME = "CharacterName.d2x";
const DEFAULT_CHARACTER_FILENAME = "CharacterName.d2s";
const DEFAULT_D2R_SHARED_FILENAME = "SharedStashSoftCoreV2.d2i";

export async function parseSaveFile(file: File) {
  try {
    const raw = new Uint8Array(await file.arrayBuffer());
    if (file.name.endsWith(".d2s")) {
      return parseCharacter(raw, file);
    } else if (file.name.endsWith(".d2i")) {
      return parseD2rStash(raw, file);
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
  let raw: Uint8Array;
  let defaultName: string;
  if (isPlugyStash(owner)) {
    raw = plugyStashToSaveFile(owner);
    defaultName = owner.personal
      ? DEFAULT_PERSONAL_FILENAME
      : DEFAULT_SHARED_FILENAME;
  } else if (isCharacter(owner)) {
    raw = characterToSaveFile(owner);
    defaultName = DEFAULT_CHARACTER_FILENAME;
  } else {
    raw = d2rStashToSaveFile(owner);
    defaultName = DEFAULT_D2R_SHARED_FILENAME;
  }
  return new File([new Blob([raw.buffer])], owner.filename || defaultName);
}
