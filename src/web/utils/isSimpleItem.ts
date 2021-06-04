import { Item } from "../../scripts/items/types/Item";
import { RESPECS } from "../../scripts/grail/organize/respecs";
import { UBERS } from "../../scripts/grail/organize/ubers";

export function isSimpleItem(item: Item) {
  // For some reason Essences and organs are not simple
  return (
    item.simple || RESPECS.includes(item.code) || UBERS.includes(item.code)
  );
}
