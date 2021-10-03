import { Item } from "../../items/types/Item";
import { layout } from "../layout";
import { PlugyStash } from "../../plugy-stash/types";
import { makeIndex } from "../../plugy-stash/makeIndex";
import { MISC } from "../../../game-data";
import { sortAndGroupBy } from "./sortAndGroupBy";
import { addPage } from "../../plugy-stash/addPage";
import { moveItem } from "../../items/moving/safeMove";

const ORDER = ["gsy", "gsv", "gsb", "gsr", "gsg", "gsw", "sku"];
const GEM_TYPES = ORDER.map((code) => MISC[code]!.type);
const PAGE_NAMES = ORDER.map((code) => MISC[code]!.name);
// Chipped first, this order has been crafted to work for all gem types
const QUALITIES = ["c", "f", "u", "s", "l", "z", "p"];

function qualityChar(skulls = false) {
  return (item: Item) => QUALITIES.indexOf(item.code.charAt(skulls ? 2 : 1));
}

export function organizeGems(stash: PlugyStash, items: Item[]) {
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
      const page = addPage(stash, PAGE_NAMES[i]);
      if (j === 0) {
        makeIndex(page, i === 0);
      }
    }
    for (const [item, { page, rows, cols }] of positions.entries()) {
      moveItem(stash, item, offset + page, rows[0], cols[0]);
    }
    offset += nbPages;
  }
}
