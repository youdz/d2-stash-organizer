import { Stash } from "../scripts/stash/types";
import { parseSharedStash } from "../scripts/stash/parsing/parseSharedStash";

const LOCAL_STORAGE_KEY = "stash";

const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
let STASH: Stash | null = stored && JSON.parse(stored);

export function getStash() {
  return STASH;
}

export async function saveStash(stash: File | Stash) {
  if (stash instanceof File) {
    stash = parseSharedStash(new Uint8Array(await stash.arrayBuffer()));
  }
  STASH = stash;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stash));
  return stash;
}
