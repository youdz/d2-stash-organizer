import { BinaryStream } from "./binary";
import { Item } from "../types/Item";
import { ARMORS, WEAPONS } from "../../../game-data";

export function parseQuantified({ read, readInt }: BinaryStream, item: Item) {
  const baseArmor = ARMORS[item.code];
  const baseWeapon = WEAPONS[item.code];
  if (baseArmor) {
    // NOTE:
    // Any piece of armor that spawns with +% Enhanced Defense
    // has a base defense of maxac+1 (normal maximum base defense + 1).
    item.defense = readInt(11) - 10;
  }

  if (baseArmor || baseWeapon) {
    const maxDurability = readInt(8);
    // Indestructible items have max durability 0 and no current durability
    if (maxDurability) {
      item.durability = [readInt(8), maxDurability];
      // Skipping unknown extra bit
      read(1);
    }
  }

  if (baseWeapon?.stackable) {
    item.quantity = readInt(9);
  }

  if (item.socketed) {
    item.sockets = readInt(4);
  }
}
