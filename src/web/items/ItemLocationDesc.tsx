import { Item } from "../../scripts/items/types/Item";
import {
  ItemLocation,
  ItemStorageType,
} from "../../scripts/items/types/ItemLocation";

export interface ItemLocationDescProps {
  item: Item;
}

function locationString(item: Item) {
  switch (item.location) {
    case ItemLocation.STORED:
      switch (item.stored) {
        case ItemStorageType.STASH:
          // Quite hacky, this is the case where the item is in a non-PlugY stash
          if (!item.owner.endsWith("stash")) {
            return `In ${item.owner}'s stash`;
          }
          return item.owner;
        case ItemStorageType.INVENTORY:
          return `In ${item.owner}'s inventory`;
        case ItemStorageType.CUBE:
          return `In ${item.owner}'s cube`;
        default:
          return "Unknown location";
      }
    case ItemLocation.BELT:
      return `In ${item.owner}'s belt`;
    case ItemLocation.EQUIPPED:
      return `Worn by ${item.owner}`;
    default:
      return "Unknown location";
  }
}

export function ItemLocationDesc({ item }: ItemLocationDescProps) {
  let positionedItem = item;
  let socket = "";
  if (item.location === ItemLocation.SOCKET) {
    positionedItem = item.socketedIn!;
    socket = `, socketed in ${positionedItem.name}`;
  }

  const location = locationString(positionedItem);
  const page =
    typeof item.page !== "undefined" ? `, page ${item.page + 1}` : "";
  return (
    <>
      {location}
      {page}
      {socket}
    </>
  );
}
