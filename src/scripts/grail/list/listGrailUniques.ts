import { UNIQUE_ITEMS } from "../../../game-data";
import { groupUniquesBySection } from "./groupUniques";
import { canBeEthereal } from "./canBeEthereal";

export function listGrailUniques(eth = false) {
  // Ignore disabled and quest items
  let collectible = UNIQUE_ITEMS.filter(
    (item) => item.enabled && item.qlevel > 0
  );
  if (eth) {
    // Ignore indestructible items for the eth version
    collectible = collectible.filter(canBeEthereal);
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
