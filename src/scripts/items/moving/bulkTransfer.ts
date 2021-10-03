import { isStash, ItemsOwner } from "../../save-file/ownership";
import { addPage } from "../../stash/addPage";
import { transferItem } from "./transferItem";
import { ItemStorageType } from "../types/ItemLocation";
import { Item } from "../types/Item";

export function bulkTransfer(
  target: ItemsOwner,
  items: Item[],
  storageType = ItemStorageType.STASH
) {
  if (isStash(target)) {
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
  } else {
    for (const item of items) {
      if (!transferItem(item, target, storageType)) {
        throw new Error("Not enough space to transfer all the selected items.");
      }
    }
  }
}
