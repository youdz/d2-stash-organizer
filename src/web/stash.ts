import { Stash } from "../scripts/stash/types";
import { parseSharedStash } from "../scripts/stash/parsing/parseSharedStash";

const LOCAL_STORAGE_KEY = "stash";

const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
let STASH: Stash | null = stored && JSON.parse(stored);

export function getStash() {
  return STASH;
}

export async function saveStash(file: File) {
  STASH = parseSharedStash(new Uint8Array(await file.arrayBuffer()));
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(STASH));
  return STASH;
}
