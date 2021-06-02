import { PageFlags, Stash } from "../../stash/types";
import { deletePages } from "../../stash/deletePages";
import { groupBySection } from "./groupBySection";
import { SECTIONS_ORDER } from "./sections";
import { organizeUnknown } from "./unknown";
import { getAllItems } from "../../stash/getAllItems";
import { organizeRejuvs } from "./rejuvs";
import { organizeGems } from "./gems";
import { organizeRunes } from "./runes";
import { organizeRunewords } from "./runewords";
import { organizeSets } from "./sets";
import { organizeUniques } from "./uniques";
import { organizeRespecs } from "./respecs";
import { organizeUbers } from "./ubers";

export function organize(stash: Stash, offset = 0, emptyPages = 0) {
  const before = getAllItems(stash);
  const expectedTotal = before.length;
  const toOrganize = deletePages(stash, offset);
  for (let i = 0; i < emptyPages; i++) {
    stash.pages.push({ name: `# Misc`, items: [], flags: PageFlags.SHARED });
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
  if (getAllItems(stash).length !== expectedTotal) {
    throw new Error("Lost items in the process, cancelling");
  }
}
