import { Item } from "../../scripts/items/types/Item";
import { isSimpleItem } from "../collection/utils/isSimpleItem";
import {
  ItemLocation,
  ItemStorageType,
} from "../../scripts/items/types/ItemLocation";

/**
 * Groups simple items together with a quantity, leaves others alone
 */
export function groupItems(items: Item[]) {
  const grouped = new Map<string, Item[]>();
  let uid = 0;
  for (const item of items) {
    if (isSimpleItem(item)) {
      const existing = grouped.get(item.code);
      if (!existing) {
        grouped.set(item.code, [item]);
      } else if (
        // Prioritize items in stash to display the location
        (existing[0].location !== ItemLocation.STORED &&
          item.location === ItemLocation.STORED) ||
        (existing[0].stored !== ItemStorageType.STASH &&
          item.stored === ItemStorageType.STASH)
      ) {
        existing.unshift(item);
      } else {
        existing.push(item);
      }
    } else {
      grouped.set(`${uid++}`, [item]);
    }
  }
  return Array.from(grouped.values());
}
