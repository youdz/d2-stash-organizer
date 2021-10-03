import { ItemStorageType } from "../items/types/ItemLocation";

export const INVENTORY_HEIGHT = 4;
export const INVENTORY_WIDTH = 10;

export const CUBE_HEIGHT = 4;
export const CUBE_WIDTH = 3;

// TODO: different values for D2R
export const STASH_HEIGHT = 8;
export const STASH_WIDTH = 6;

export function getDimensions(storageType: ItemStorageType) {
  switch (storageType) {
    case ItemStorageType.INVENTORY:
      return { height: INVENTORY_HEIGHT, width: INVENTORY_WIDTH };
    case ItemStorageType.CUBE:
      return { height: CUBE_HEIGHT, width: CUBE_WIDTH };
    case ItemStorageType.STASH:
      return { height: STASH_HEIGHT, width: STASH_WIDTH };
    default:
      throw new Error(`No dimensions for storage type ${storageType}`);
  }
}
