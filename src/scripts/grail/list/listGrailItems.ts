import {
  EquipmentTier,
  SetItem,
  UniqueItem,
  WEAPONS,
} from "../../../game-data";
import { UNIQUES_ORDER } from "./uniquesOrder";
import { groupUniquesByTypeAndTier } from "./groupUniques";
import { getBase } from "../../items/getBase";
import { LayoutType } from "../layout";
import {
  GEMS_ORDER,
  OTHERS_ORDER,
  REJUVS_ORDER,
  RUNES_ORDER,
  RUNEWORDS_ORDER,
  UNKNOWN_ORDER,
} from "./othersOrders";

export interface GrailSection {
  name: string;
  shortName: string;
  sets: boolean;
  layout?: LayoutType;
  // Uniques by tier or set items by set
  groups: (UniqueItem | SetItem)[][];
  firstOfCategory: boolean;
}

// Hardcoded is not great but will do for now
export const UNKNOWN_INDEX = 0;
export const REJUVS_INDEX = UNKNOWN_INDEX + UNKNOWN_ORDER.length;
export const GEMS_INDEX = REJUVS_INDEX + REJUVS_ORDER.length;
export const RUNES_INDEX = GEMS_INDEX + GEMS_ORDER.length;
export const RUNEWORDS_INDEX = RUNES_INDEX + RUNES_ORDER.length;
export const UNIQUES_INDEX = RUNEWORDS_INDEX + RUNEWORDS_ORDER.length;
export const SETS_INDEX =
  UNIQUES_INDEX +
  UNIQUES_ORDER.reduce((total, category) => total + category.length, 0);

export function listGrailItems(eth = false) {
  const sections: GrailSection[] = [];

  // Non-grail items
  for (const section of OTHERS_ORDER) {
    sections.push(
      ...section.map((section, index) => ({
        ...section,
        sets: false,
        groups: [],
        firstOfCategory: index === 0,
      }))
    );
  }

  // Uniques
  const uniques = groupUniquesByTypeAndTier();
  for (const section of UNIQUES_ORDER) {
    let firstSubSection = true;
    for (const { name, shortName, types, twoHanded, layout } of section) {
      let tiers: UniqueItem[][] = [[], [], []];
      for (const type of types) {
        for (
          let tier = EquipmentTier.NORMAL;
          tier <= EquipmentTier.ELITE;
          tier++
        ) {
          let toAdd = uniques.get(type)?.[tier];
          if (!toAdd) {
            continue;
          }
          if (eth) {
            toAdd = toAdd.filter(
              (item) =>
                !getBase(item).indestructible &&
                item.modifiers.every(({ prop }) => prop !== "indestruct")
            );
          }
          if (typeof twoHanded !== "undefined") {
            toAdd = toAdd.filter(
              (item) => WEAPONS[item.code]?.twoHanded === twoHanded
            );
          }
          tiers[tier].push(...toAdd);
        }
      }
      tiers = tiers.filter(({ length }) => length > 0);
      for (const tier of tiers) {
        tier.sort((a, b) => a.qlevel - b.qlevel);
      }
      sections.push({
        name,
        shortName,
        sets: false,
        layout: layout ?? "tier-lines",
        groups: tiers,
        firstOfCategory: firstSubSection,
      });
      firstSubSection = false;
    }
  }

  // Sets
  // if (!eth) {
  //   const sets = groupSetItemsBySet();
  //   for (const section of SETS_ORDER) {
  //     let firstSubSection = true;
  //     for (const { set, name, shortName, layout } of section) {
  //       sections.push({
  //         name,
  //         shortName,
  //         sets: true,
  //         layout,
  //         groups: [sets.get(set)!],
  //         firstOfCategory: firstSubSection,
  //       });
  //       firstSubSection = false;
  //     }
  //   }
  // }

  return sections;
}
