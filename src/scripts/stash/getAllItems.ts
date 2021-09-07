import { isStash, ItemsOwner } from "../save-file/ownership";

export function getAllItems(owner: ItemsOwner, skipPages = 0) {
  if (isStash(owner)) {
    const all = [];
    for (const { items } of owner.pages.slice(skipPages)) {
      all.push(...items);
    }
    return all;
  } else {
    // No pages to skip for characters
    return owner.items;
  }
}
