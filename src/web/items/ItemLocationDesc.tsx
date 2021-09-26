import { Item } from "../../scripts/items/types/Item";
import {
  ItemLocation,
  ItemStorageType,
} from "../../scripts/items/types/ItemLocation";
import { isStash, ownerName } from "../../scripts/save-file/ownership";

export interface ItemLocationDescProps {
  item: Item;
}

function locationString(item: Item) {
  if (!item.owner) {
    return "Unknown location";
  }
  const name = ownerName(item.owner);
  switch (item.location) {
    case ItemLocation.STORED:
      switch (item.stored) {
        case ItemStorageType.STASH:
          // This is the case where the item is in a non-PlugY stash
          if (!isStash(item.owner)) {
            return `In ${name}'s stash`;
          }
          return name;
        case ItemStorageType.INVENTORY:
          return `In ${name}'s inventory`;
        case ItemStorageType.CUBE:
          return `In ${name}'s cube`;
        default:
          return "Unknown location";
      }
    case ItemLocation.BELT:
      return `In ${name}'s belt`;
    case ItemLocation.EQUIPPED:
      return `Worn by ${name}`;
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
