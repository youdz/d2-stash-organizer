import {
  Armor,
  ARMORS,
  Misc,
  MISC,
  SetItem,
  UniqueItem,
  Weapon,
  WEAPONS,
} from "../../game-data";
import { Item } from "./types/Item";

export function getBase(
  item: UniqueItem | SetItem | Item
): Armor | Weapon | Misc {
  const base = ARMORS[item.code] || WEAPONS[item.code] || MISC[item.code];
  if (!base) {
    throw new Error(
      `Could not find base ${item.code} for ${item.name ?? "unknown item"}`
    );
  }
  return base;
}
