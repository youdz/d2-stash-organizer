import { UNIQUE_ITEMS } from "../../../game-data";
import { groupUniquesBySection } from "./groupUniques";
import { getBase } from "../../items/getBase";

export function listGrailUniques(eth = false) {
  // Ignore disabled and quest items
  let collectible = UNIQUE_ITEMS.filter(
    (item) => item.enabled && item.qlevel > 0
  );
  if (eth) {
    // Ignore indestructible items for the eth version
    collectible = collectible.filter(
      (item) =>
        !getBase(item).indestructible &&
        item.modifiers.every(({ prop }) => prop !== "indestruct")
    );
  }
  const uniques = groupUniquesBySection(collectible, true);
  // Sort each section by qlevel
  for (const tiers of uniques.values()) {
    for (const tier of tiers) {
      tier.sort((a, b) => a.qlevel - b.qlevel);
    }
  }
  return uniques;
}
