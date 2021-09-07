import { Stash } from "../stash/types";
import { Character } from "../character/types";

export const SHARED_STASH_NAME = "Shared stash";

export type ItemsOwner = Character | Stash;

export function isStash(owner: ItemsOwner): owner is Stash {
  return "pages" in owner;
}

export function ownerName(owner: ItemsOwner) {
  if (isStash(owner)) {
    return owner.personal
      ? `${owner.filename.slice(0, -4)}'s stash`
      : SHARED_STASH_NAME;
  } else {
    return owner.filename.slice(0, -4);
  }
}
