import { Set, SET_ITEMS, SetItem, UniqueItem } from "../../../game-data";
import { Item } from "../../items/types/Item";
import { getGrailItem } from "./getGrailItem";
import { UniqueSection } from "./uniquesOrder";
import { listGrailUniques } from "./listGrailUniques";
import { groupBySet } from "./groupSets";
import { Stash } from "../../stash/types";
import { getAllItems } from "../../stash/getAllItems";
import { canBeEthereal } from "./canBeEthereal";

export interface GrailStatus {
  item: UniqueItem | SetItem;
  normal: boolean;
  // Undefined means not applicable
  ethereal?: boolean;
  perfect: boolean;
}

export function grailProgress(stash: Stash) {
  const found = new Map<UniqueItem | SetItem, Item[]>();
  for (const item of getAllItems(stash)) {
    const grailItem = getGrailItem(item);
    if (!grailItem) continue;
    let existing = found.get(grailItem);
    if (!existing) {
      existing = [];
      found.set(grailItem, existing);
    }
    existing.push(item);
  }

  const progress = new Map<UniqueSection | Set, GrailStatus[][]>();

  for (const [section, uniques] of listGrailUniques()) {
    progress.set(
      section,
      uniques.map((tier) =>
        tier.map((item) => {
          return {
            item,
            normal: !!found.get(item),
            ethereal: canBeEthereal(item)
              ? !!found.get(item)?.some(({ ethereal }) => ethereal)
              : undefined,
            perfect: !!found
              .get(item)
              ?.some(({ perfectionScore }) => perfectionScore === 100),
          };
        })
      )
    );
  }

  for (const [set, setItems] of groupBySet(SET_ITEMS)) {
    progress.set(set, [
      setItems.map((item) => ({
        item,
        normal: !!found.get(item),
        ethereal: undefined,
        perfect: !!found
          .get(item)
          ?.some(({ perfectionScore }) => perfectionScore === 100),
      })),
    ]);
  }

  return progress;
}

export function grailSummary(stash: Stash) {
  const summary = {
    nbNormal: 0,
    totalNormal: 0,
    nbEth: 0,
    totalEth: 0,
    nbPerfect: 0,
  };
  for (const tiers of grailProgress(stash).values()) {
    for (const tier of tiers) {
      for (const { normal, ethereal, perfect } of tier) {
        summary.totalNormal++;
        if (normal) {
          summary.nbNormal++;
        }
        if (perfect) {
          summary.nbPerfect++;
        }
        if (typeof ethereal !== "undefined") {
          summary.totalEth++;
          if (ethereal) {
            summary.nbEth++;
          }
        }
      }
    }
  }
  return summary;
}

export function printGrailProgress(stash: Stash) {
  for (const [section, tiers] of grailProgress(stash)) {
    console.log(`\x1b[35m${section.name}\x1b[39m`);
    for (const tier of tiers) {
      for (const { item, normal, ethereal, perfect } of tier) {
        let line = item.name;
        line += normal
          ? ` \x1b[32mnormal ✔\x1b[39m`
          : ` \x1b[31mnormal ✘\x1b[39m`;
        if (typeof ethereal !== "undefined") {
          line += ethereal
            ? ` \x1b[32meth ✔\x1b[39m`
            : ` \x1b[31meth ✘\x1b[39m`;
        }
        line += perfect
          ? ` \x1b[32mperfect ✔\x1b[39m`
          : ` \x1b[31mperfect ✘\x1b[39m`;
        console.log(line);
      }
      console.log("");
    }
  }
}
