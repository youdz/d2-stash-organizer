import {
  isCharacter,
  isPlugyStash,
  ItemsOwner,
} from "../../save-file/ownership";
import { addPage } from "../../plugy-stash/addPage";
import { transferItem } from "./transferItem";
import { ItemStorageType } from "../types/ItemLocation";
import { Item } from "../types/Item";

export function bulkTransfer(
  target: ItemsOwner,
  items: Item[],
  storageType = ItemStorageType.STASH
) {
  if (isPlugyStash(target)) {
    let pageIndex = target.pages.length;
    addPage(target, "Transferred");
    for (const item of items) {
      if (!transferItem(item, target, ItemStorageType.STASH, pageIndex)) {
        // We ran out of space, we insert a new page
        addPage(target, "Transferred");
        pageIndex++;
        // Don't forget to re-transfer the failed item
        transferItem(item, target, ItemStorageType.STASH, pageIndex);
      }
    }
  } else if (isCharacter(target)) {
    for (const item of items) {
      if (!transferItem(item, target, storageType)) {
        throw new Error("Not enough space to transfer all the selected items.");
      }
    }
  } else {
    itemsLoop: for (const item of items) {
      // Retry from page 0 every time, in case the new item is smaller than the previous ones
      let pageIndex = 0;
      while (pageIndex < target.pages.length) {
        if (transferItem(item, target, ItemStorageType.STASH, pageIndex)) {
          continue itemsLoop;
        }
        // We ran out of space on this page, we try the next one
        pageIndex++;
      }
      throw new Error("Not enough space to transfer all the selected items.");
    }
  }
}
