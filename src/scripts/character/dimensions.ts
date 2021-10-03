import { ItemStorageType } from "../items/types/ItemLocation";
import { Character } from "./types";
import { LAST_LEGACY } from "./parsing/versions";

export const INVENTORY_HEIGHT = 4;
export const INVENTORY_WIDTH = 10;

export const CUBE_HEIGHT = 4;
export const CUBE_WIDTH = 3;

// TODO: classic stash
export const D2_STASH_HEIGHT = 8;
export const D2_STASH_WIDTH = 6;
export const D2R_STASH_HEIGHT = 10;
export const D2R_STASH_WIDTH = 10;

export function getDimensions(
  storageType: ItemStorageType,
  character: Character
) {
  switch (storageType) {
    case ItemStorageType.INVENTORY:
      return { height: INVENTORY_HEIGHT, width: INVENTORY_WIDTH };
    case ItemStorageType.CUBE:
      return { height: CUBE_HEIGHT, width: CUBE_WIDTH };
    case ItemStorageType.STASH:
      if (character.version <= LAST_LEGACY) {
        return { height: D2_STASH_HEIGHT, width: D2_STASH_WIDTH };
      } else {
        return { height: D2R_STASH_HEIGHT, width: D2R_STASH_WIDTH };
      }
    default:
      throw new Error(`No dimensions for storage type ${storageType}`);
  }
}
