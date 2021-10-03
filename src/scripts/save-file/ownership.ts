import { PlugyStash } from "../plugy-stash/types";
import { Character } from "../character/types";
import { D2rStash } from "../d2r-stash/types";

export const PLUGY_SHARED_STASH_NAME = "PlugY shared stash";
export const NON_PLUGY_SHARED_STASH_NAME = "Offline stash";
export const D2R_SHARED_STASH_NAME = "D2R shared stash";

export type ItemsOwner = Character | D2rStash | PlugyStash;

export function isStash(owner: ItemsOwner): owner is D2rStash | PlugyStash {
  return "pages" in owner;
}

export function isPlugyStash(owner: ItemsOwner): owner is PlugyStash {
  return "personal" in owner;
}

export function isCharacter(owner: ItemsOwner): owner is Character {
  return "items" in owner;
}

export function ownerName(owner: ItemsOwner) {
  if (isPlugyStash(owner)) {
    return owner.personal
      ? `${owner.filename.slice(0, -4)}'s stash`
      : owner.nonPlugY
      ? NON_PLUGY_SHARED_STASH_NAME
      : PLUGY_SHARED_STASH_NAME;
  } else if (isCharacter(owner)) {
    return owner.filename.slice(0, -4);
  } else {
    return D2R_SHARED_STASH_NAME;
  }
}
