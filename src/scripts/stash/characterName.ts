import { Stash } from "./types";

export function characterName(stash: Stash) {
  return stash.personal ? stash.filename.slice(0, -4) : "";
}
