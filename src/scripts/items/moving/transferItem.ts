import { Item } from "../types/Item";
import { isStash, ItemsOwner } from "../../save-file/ownership";
import {
  ItemEquipSlot,
  ItemLocation,
  ItemStorageType,
} from "../types/ItemLocation";
import { findSpot } from "./findSpot";
import { getDimensions } from "../../character/dimensions";
import { positionItem } from "./positionItem";
import { PAGE_HEIGHT, PAGE_WIDTH } from "../../stash/dimensions";
import { fromInt } from "../../save-file/binary";
import { FIRST_D2R } from "../../character/parsing/versions";
import { D2R_OFFSET, toD2, toD2R } from "./conversion";

function takeItemFromCurrentOwner(item: Item) {
  if (!item.owner) {
    return;
  }
  if (isStash(item.owner)) {
    for (const page of item.owner.pages) {
      const index = page.items.indexOf(item);
      if (index >= 0) {
        page.items.splice(index, 1);
        break;
      }
    }
  } else {
    const index = item.owner.items.indexOf(item);
    if (index >= 0) {
      item.owner.items.splice(index, 1);
    }
  }
}

function giveItemTo(
  item: Item,
  owner: ItemsOwner,
  storageType: ItemStorageType
) {
  if (item.owner.version !== owner.version) {
    if (owner.version >= FIRST_D2R) {
      toD2R(item);
    } else {
      toD2(item);
    }
  }

  item.owner = owner;
  item.location = ItemLocation.STORED;
  item.equippedInSlot = ItemEquipSlot.NONE;
  item.stored = storageType;
  const offset = owner.version >= FIRST_D2R ? D2R_OFFSET : 0;
  item.raw =
    item.raw.slice(0, 58 + offset) +
    fromInt(item.location, 3) +
    fromInt(item.equippedInSlot, 4) +
    item.raw.slice(65 + offset, 73 + offset) +
    fromInt(item.stored, 3) +
    item.raw.slice(76 + offset);
  item.corpse = false;
  item.mercenary = false;
}

export function transferItem(
  item: Item,
  to: ItemsOwner,
  storageType = ItemStorageType.STASH,
  pageIndex?: number
) {
  // Try to position first, so we don't reach a state with no owner if there is no room
  if (isStash(to)) {
    const page = to.pages[pageIndex ?? 0];
    const position = findSpot(item, page.items, PAGE_HEIGHT, PAGE_WIDTH);
    if (!position) {
      return false;
    }
    positionItem(item, position);
    page.items.push(item);
    item.page = pageIndex;
  } else {
    const itemsInSameStorage = to.items.filter(
      (item) => item.stored === storageType
    );
    const { height, width } = getDimensions(storageType, to);
    const position = findSpot(item, itemsInSameStorage, height, width);
    if (!position) {
      return false;
    }
    positionItem(item, position);
    to.items.push(item);
    delete item.page;
  }

  takeItemFromCurrentOwner(item);
  giveItemTo(item, to, storageType);
  return true;
}
