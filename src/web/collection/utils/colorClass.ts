import { ItemQuality } from "../../../scripts/items/types/ItemQuality";
import { Item } from "../../../scripts/items/types/Item";

export function colorClass(item: Item) {
  if (item.runeword) {
    return "unique";
  }
  switch (item.quality) {
    case ItemQuality.MAGIC:
      return "magic";
    case ItemQuality.RARE:
      return "rare";
    case ItemQuality.UNIQUE:
      return "unique";
    case ItemQuality.SET:
      return "set";
    case ItemQuality.CRAFTED:
      return "crafted";
  }
  if (!!item.sockets || item.ethereal) {
    return "socketed";
  }
  return "";
}
