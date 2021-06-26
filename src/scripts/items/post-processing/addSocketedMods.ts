import { Item } from "../types/Item";
import { ARMORS, GEMS, ModifierRange } from "../../../game-data";
import { ItemParsingError } from "../../errors/ItemParsingError";
import { generateFixedMods } from "./generateFixedMods";

/**
 * Adds mods from sockets to the base item
 */
export function addSocketedMods(socketedItem: Item, socketable: Item) {
  if (!socketedItem.modifiers) {
    socketedItem.modifiers = [];
  }
  if (socketable.code === "jew") {
    // Jewel
    socketedItem.modifiers.push(...socketable.modifiers!);
  } else {
    // Gem or rune
    const gem = GEMS[socketable.code];
    if (!gem) {
      throw new ItemParsingError(
        socketedItem,
        "Only gems, runes and jewels can be put in sockets"
      );
    }
    const base = ARMORS[socketedItem.code];
    let ranges: ModifierRange[];
    if (!base) {
      // Not an armor, so it has to be a weapon
      ranges = gem.weapon;
    } else if (
      base.type === "shie" ||
      base.type === "head" ||
      base.type === "ashd"
    ) {
      ranges = gem.shield;
    } else {
      ranges = gem.armor;
    }
    socketedItem.modifiers.push(...generateFixedMods(ranges));
  }
}
