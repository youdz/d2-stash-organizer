import { UniqueItem } from "../../../game-data";
import { getBase } from "../../items/getBase";
import { Item } from "../../items/types/Item";
import {
  TYPES_TO_UNIQUES_SECTION,
  UNIQUES_ORDER,
  UniqueSection,
} from "./uniquesOrder";

export function groupUniquesBySection<T extends Item | UniqueItem>(
  items: T[],
  withTiers: boolean
) {
  const grouped = new Map<UniqueSection, T[][]>();
  // We start by adding every section in order,
  // because Map guarantees insertion order on iteration
  for (const category of UNIQUES_ORDER) {
    for (const section of category) {
      grouped.set(section, []);
    }
  }

  for (const item of items) {
    const base = getBase(item);
    const section =
      TYPES_TO_UNIQUES_SECTION.get(base.type) ||
      ("twoHanded" in base &&
        TYPES_TO_UNIQUES_SECTION.get(`${base.type}-${Number(base.twoHanded)}`));
    if (!section) {
      continue;
    }
    const group = grouped.get(section)!;
    const tierIndex = withTiers ? base.tier : 0;
    let tier = group[tierIndex];
    if (!tier) {
      tier = [];
      group[tierIndex] = tier;
    }
    tier.push(item);
  }
  // Discard empty tiers
  for (const [section, tiers] of grouped) {
    grouped.set(
      section,
      tiers.filter(({ length }) => length > 0)
    );
  }
  return grouped;
}
