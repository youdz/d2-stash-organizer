import { Item } from "../../scripts/items/types/Item";
import {
  ItemLocation,
  ItemStorageType,
} from "../../scripts/items/types/ItemLocation";

export interface ItemLocationDescProps {
  item: Item;
}

export function ItemLocationDesc({ item }: ItemLocationDescProps) {
  let positionedItem = item;

  let socket = "";
  if (item.location === ItemLocation.SOCKET && item.socketedIn) {
    socket = `, socketed in ${item.socketedIn.name}`;
    positionedItem = item.socketedIn;
  }

  let location = "";
  let page = "";
  if (
    positionedItem.location === ItemLocation.STORED &&
    positionedItem.stored === ItemStorageType.STASH
  ) {
    location = positionedItem.character
      ? `${positionedItem.character}'s stash`
      : "Shared stash";
    if (typeof positionedItem.page !== "undefined") {
      page = `, page ${positionedItem.page + 1}`;
    }
  } else {
    location = "Unknown location";
  }

  return (
    <>
      {location}
      {socket}
      {page}
    </>
  );
}
