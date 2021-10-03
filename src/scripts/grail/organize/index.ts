import { PlugyStash } from "../../plugy-stash/types";
import { Item } from "../../items/types/Item";
import { deletePages } from "../../plugy-stash/deletePages";
import { groupBySection } from "./groupBySection";
import { SECTIONS_ORDER } from "./sections";
import { organizeUnknown } from "./unknown";
import { getAllItems } from "../../plugy-stash/getAllItems";
import { organizeRejuvs } from "./rejuvs";
import { organizeGems } from "./gems";
import { organizeRunes } from "./runes";
import { organizeRunewords } from "./runewords";
import { organizeSets } from "./sets";
import { organizeUniques } from "./uniques";
import { organizeRespecs } from "./respecs";
import { organizeUbers } from "./ubers";
import { addPage } from "../../plugy-stash/addPage";

/**
 * Counts every item, even socketed ones.
 */
function countEveryItem(items: Item[]) {
  let total = items.length;
  for (const item of items) {
    if (item.filledSockets) {
      total += item.filledSockets.length;
    }
  }
  return total;
}

export function organize(
  stash: PlugyStash,
  additionalItems: Item[] = [],
  offset = 0,
  emptyPages = 0
) {
  const expectedTotal =
    countEveryItem(getAllItems(stash)) + countEveryItem(additionalItems);
  const toOrganize = deletePages(stash, offset);
  toOrganize.push(...additionalItems);
  for (let i = 0; i < emptyPages; i++) {
    addPage(stash, "Misc");
  }
  const bySection = groupBySection(toOrganize);
  for (const sectionId of SECTIONS_ORDER) {
    const items = bySection.get(sectionId);
    if (!items) continue;
    switch (sectionId) {
      case "unknown":
        organizeUnknown(stash, items);
        break;
      case "rejuvs":
        organizeRejuvs(stash, items);
        break;
      case "respecs":
        organizeRespecs(stash, items);
        break;
      case "ubers":
        organizeUbers(stash, items);
        break;
      case "gems":
        organizeGems(stash, items);
        break;
      case "runes":
        organizeRunes(stash, items);
        break;
      case "runewords":
        organizeRunewords(stash, items);
        break;
      case "sets":
        organizeSets(stash, items);
        break;
      case "uniques":
        organizeUniques(stash, items);
        break;
      default:
        throw new Error(`Unknown section sectionId`);
    }
  }
  if (countEveryItem(getAllItems(stash)) !== expectedTotal) {
    throw new Error("Lost items in the process, cancelling");
  }
}
