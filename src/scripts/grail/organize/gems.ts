import { Item } from "../../items/types/Item";
import { layout } from "../layout";
import { PageFlags, Stash } from "../../stash/types";
import { moveItem } from "../../stash/moveItem";
import { makeIndex } from "../../stash/makeIndex";
import { MISC } from "../../../game-data";
import { sortAndGroupBy } from "./sortAndGroupBy";

const ORDER = ["gsy", "gsv", "gsb", "gsr", "gsg", "gsw", "sku"];
const GEM_TYPES = ORDER.map((code) => MISC[code]!.type);
const PAGE_NAMES = ORDER.map((code) => MISC[code]!.name);
// Chipped first, this order has been crafted to work for all gem types
const QUALITIES = ["c", "f", "u", "s", "l", "z", "p"];

function qualityChar(skulls = false) {
  return (item: Item) => QUALITIES.indexOf(item.code.charAt(skulls ? 2 : 1));
}

export function organizeGems(stash: Stash, items: Item[]) {
  if (items.length === 0) return;

  const byType = ORDER.map<Item[]>(() => []);
  for (const item of items) {
    byType[GEM_TYPES.indexOf(MISC[item.code]!.type)].push(item);
  }
  const byTypeAndQuality = byType.map((gems, index) =>
    sortAndGroupBy(gems, qualityChar(index === 6))
  );

  let offset = stash.pages.length;
  for (let i = 0; i < byType.length; i++) {
    const { nbPages, positions } = layout("lines", byTypeAndQuality[i]);
    for (let j = 0; j < nbPages; j++) {
      const page = {
        name: `# ${PAGE_NAMES[i]}`,
        items: [],
        flags: PageFlags.SHARED,
      };
      if (j === 0) {
        makeIndex(page, i === 0);
      }
      stash.pages.push(page);
    }
    for (const [item, { page, rows, cols }] of positions.entries()) {
      moveItem(stash, item, offset + page, rows[0], cols[0]);
    }
    offset += nbPages;
  }
}
