import { Item } from "../types/Item";
import { isStash, ItemsOwner, ownerName } from "../../save-file/ownership";
import { ItemLocation, ItemStorageType } from "../types/ItemLocation";
import { findSpot } from "./findSpot";
import { getDimensions } from "../../character/dimensions";
import { positionItem } from "./positionItem";
import { PAGE_HEIGHT, PAGE_WIDTH } from "../../stash/dimensions";

function takeItemFrom(item: Item, owner: ItemsOwner) {
  if (isStash(owner)) {
    for (const page of owner.pages) {
      const index = page.items.indexOf(item);
      if (index >= 0) {
        page.items.splice(index, 1);
        break;
      }
    }
  } else {
    const index = owner.items.indexOf(item);
    if (index >= 0) {
      owner.items.splice(index, 1);
    }
  }
}

function giveItemTo(
  item: Item,
  owner: ItemsOwner,
  storageType: ItemStorageType
) {
  if (isStash(owner)) {
    // TODO: where to add to the stash
  } else {
    owner.items.push(item);
  }
  item.owner = ownerName(owner);
  item.location = ItemLocation.STORED;
  item.stored = storageType;
  item.mercenary = false;
}

export function transferItem(
  item: Item,
  from: ItemsOwner,
  to: ItemsOwner,
  storageType = ItemStorageType.STASH,
  pageIndex?: number
) {
  // Try to position first, so we don't reach a state with no owner if there is no room
  if (isStash(to)) {
    // TODO: insert a new page right after with the same name if it overflows.
    const position = findSpot(
      item,
      to.pages[pageIndex ?? 0].items,
      PAGE_HEIGHT,
      PAGE_WIDTH
    );
    if (!position) {
      return false;
    }
    positionItem(item, position);
    item.page = pageIndex;
  } else {
    const itemsInSameStorage = to.items.filter(
      (item) => item.stored === storageType
    );
    const { height, width } = getDimensions(storageType);
    const position = findSpot(item, itemsInSameStorage, height, width);
    if (!position) {
      return false;
    }
    positionItem(item, position);
    // TODO: this will need to be smarter for D2R stash
    delete item.page;
  }

  takeItemFrom(item, from);
  giveItemTo(item, to, storageType);
  return true;
}
