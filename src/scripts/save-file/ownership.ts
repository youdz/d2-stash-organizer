import { PlugyStash } from "../plugy-stash/types";
import { Character } from "../character/types";

export const SHARED_STASH_NAME = "Shared stash";

export type ItemsOwner = Character | PlugyStash;

export function isPlugyStash(owner: ItemsOwner): owner is PlugyStash {
  return "personal" in owner;
}

export function ownerName(owner: ItemsOwner) {
  if (isPlugyStash(owner)) {
    return owner.personal
      ? `${owner.filename.slice(0, -4)}'s stash`
      : SHARED_STASH_NAME;
  } else {
    return owner.filename.slice(0, -4);
  }
}
