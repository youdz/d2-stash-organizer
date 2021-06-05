import { UniqueItem } from "../../../game-data";
import { Item } from "../../items/types/Item";
import { getGrailItem } from "./getGrailItem";
import { getBase } from "../../items/getBase";

export function canBeEthereal(item: Item | UniqueItem) {
  if (!("enabled" in item)) {
    item = getGrailItem(item) as UniqueItem;
  }
  if (!item) {
    return false;
  }
  return (
    !getBase(item).indestructible &&
    item.modifiers.every(({ prop }) => prop !== "indestruct")
  );
}
