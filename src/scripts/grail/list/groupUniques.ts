import { UNIQUE_ITEMS, UniqueItem } from "../../../game-data";
import { getBase } from "../../items/getBase";

export function groupUniquesByTypeAndTier() {
  const uniquesByType = new Map<string, UniqueItem[][]>();
  for (const item of UNIQUE_ITEMS) {
    // Skip disabled and quest items
    if (!item.enabled || item.qlevel === 0) continue;

    const base = getBase(item);
    let tiers = uniquesByType.get(base.type);
    if (!tiers) {
      tiers = [];
      uniquesByType.set(base.type, tiers);
    }
    let tier = tiers[base.tier];
    if (!tier) {
      tier = [];
      tiers[base.tier] = tier;
    }
    tier.push(item);
  }
  return uniquesByType;
}
