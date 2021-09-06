import { Item } from "../../scripts/items/types/Item";
import {
  ItemLocation,
  ItemStorageType,
} from "../../scripts/items/types/ItemLocation";

export interface ItemLocationDescProps {
  item: Item;
}

export function ItemLocationDesc({ item }: ItemLocationDescProps) {
  let location = "";
  let page = "";
  if (
    item.location === ItemLocation.STORED &&
    item.stored === ItemStorageType.STASH
  ) {
    location = item.character ? `${item.character}'s stash` : "Shared stash";
    if (typeof item.page !== "undefined") {
      page = `, page ${item.page + 1}`;
    }
  } else {
    location = "Unknown location";
  }

  return (
    <>
      {location}
      {page}
    </>
  );
}
