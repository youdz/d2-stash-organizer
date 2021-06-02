import { ItemQuality } from "../../items/types/ItemQuality";
import { Item } from "../../items/types/Item";
import { SET_ITEMS, UNIQUE_ITEMS } from "../../../game-data";

export function getGrailItem(item: Item) {
  if (!item.quality || typeof item.unique === "undefined") {
    return;
  }
  switch (item.quality) {
    case ItemQuality.UNIQUE:
      return UNIQUE_ITEMS[item.unique];
    case ItemQuality.SET:
      return SET_ITEMS[item.unique];
    default:
      return;
  }
}
