import { Stash } from "../../scripts/stash/types";
import { parseStash } from "../../scripts/stash/parsing/parseStash";
import { generateSaveFile } from "../../scripts/stash/parsing/generateSaveFile";

const LOCAL_STORAGE_KEY = "stash";
const DEFAULT_SHARED_FILENAME = "_LOD_SharedStashSave.sss";
const DEFAULT_PERSONAL_FILENAME = "CharacterName.d2x";

const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
let STASH: Stash | null = stored && JSON.parse(stored);

export function getStash() {
  return STASH;
}

export async function saveStash(stash: File | Stash) {
  if (stash instanceof File) {
    const filename = stash.name;
    try {
      stash = parseStash(new Uint8Array(await stash.arrayBuffer()));
    } catch (e) {
      if ("message" in e) {
        alert((e as Error).message);
      }
      throw e;
    }

    stash.filename = filename;
  }
  STASH = stash;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stash));
  return stash;
}

export function downloadStash(stash: Stash) {
  const elem = window.document.createElement("a");
  elem.href = window.URL.createObjectURL(
    new Blob([generateSaveFile(stash).buffer])
  );
  elem.download =
    stash.filename ??
    (stash.personal ? DEFAULT_PERSONAL_FILENAME : DEFAULT_SHARED_FILENAME);
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}
