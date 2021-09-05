import { Item } from "../../scripts/items/types/Item";
import { isSimpleItem } from "../collection/utils/isSimpleItem";
import { ItemLocation } from "../../scripts/items/types/ItemLocation";

/**
 * Groups simple items together with a quantity, leaves others alone
 */
export function groupItems(items: Item[]) {
  const grouped = new Map<string, { item: Item; quantity: number }>();
  let uid = 0;
  for (const item of items) {
    if (isSimpleItem(item)) {
      let existing = grouped.get(item.code);
      if (!existing) {
        existing = { item, quantity: 0 };
        grouped.set(item.code, existing);
      } else if (
        existing.item.location !== ItemLocation.STORED &&
        item.location === ItemLocation.STORED
      ) {
        existing.item = item;
      }
      existing.quantity++;
    } else {
      grouped.set(`${uid++}`, { item, quantity: 1 });
    }
  }
  return Array.from(grouped.values());
}
