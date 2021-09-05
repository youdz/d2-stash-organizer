import { Item } from "../types/Item";
import { ItemQuality } from "../types/ItemQuality";
import { computePerfectionScore } from "../comparison/perfectionScore";
import { addSocketedMods } from "./addSocketedMods";
import { consolidateMods } from "./consolidateMods";
import { describeMods } from "./describeMods";
import { addSetMods } from "./addSetModifiers";

export function postProcessItem(item: Item) {
  if (
    item.runeword ||
    item.quality === ItemQuality.UNIQUE ||
    item.quality === ItemQuality.SET
  ) {
    computePerfectionScore(item);
  }

  if (item.filledSockets) {
    for (const socketed of item.filledSockets) {
      addSocketedMods(item, socketed);
    }
  }

  if (item.modifiers) {
    consolidateMods(item.modifiers);
    // Generate descriptions only after consolidating
    describeMods(item, item.modifiers);
  }

  if (item.quality === ItemQuality.SET) {
    item.setItemModifiers?.forEach((mods, i) => {
      describeMods(item, mods, ` (${i + 2} items)`);
    });

    addSetMods(item);
    item.setGlobalModifiers?.forEach((mods, i) => {
      describeMods(item, mods, i >= 4 ? "" : ` (${i + 2} items)`);
    });
  }

  if (item.ethereal) {
    item.search += "Ethereal\n";
  }
  if (item.sockets) {
    item.search += `Socketed (${item.sockets})\n`;
  }

  if (item.filledSockets) {
    for (const socketed of item.filledSockets) {
      item.search += `${socketed.name})\n`;
    }
  }

  item.search = item.search.toLowerCase();
}
