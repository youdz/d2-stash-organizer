import { Item } from "../../items/types/Item";
import { layout, LayoutResult } from "../layout";
import { Stash } from "../../stash/types";
import { moveItem } from "../../stash/moveItem";
import { makeIndex } from "../../stash/makeIndex";
import { Set, SET_ITEMS, SetItem, SETS } from "../../../game-data";
import { EQUIPMENT_TYPES } from "../list/uniquesOrder";
import { SETS_ORDER } from "../list/setsOrder";
import { fillTemplate } from "./fillTemplate";
import { getBase } from "../../items/getBase";
import { groupBySet } from "../list/groupSets";
import { addPage } from "../../stash/addPage";

function createTemplates() {
  const allItems = groupBySet(SET_ITEMS);
  const templates = new Map<Set, LayoutResult<SetItem>>();
  for (const [set, items] of allItems) {
    templates.set(set, layout("set", [items]));
  }
  return templates;
}

function extrasOrder(a: Item, b: Item) {
  return (
    EQUIPMENT_TYPES.indexOf(getBase(a).type) -
    EQUIPMENT_TYPES.indexOf(getBase(b).type)
  );
}

export function organizeSets(stash: Stash, items: Item[]) {
  const bySet = groupBySet(items);
  const templates = createTemplates();
  let offset = stash.pages.length;
  for (const category of SETS_ORDER) {
    category.forEach(({ name, shortName, set }, i) => {
      // Create the main page for the set
      const mainPage = addPage(stash, name);
      makeIndex(mainPage, i === 0);

      // Make one instance of the set pretty
      const remaining = fillTemplate(
        stash,
        bySet.get(SETS[set])!,
        templates.get(SETS[set])!,
        offset
      );
      offset++;

      // Dump extras in subsequent pages
      if (remaining.length > 0) {
        remaining.sort(extrasOrder);
        const { nbPages, positions } = layout("lines", [remaining]);
        for (let j = 0; j < nbPages; j++) {
          addPage(stash, `Extra ${shortName}`);
        }
        for (const [item, { page, rows, cols }] of positions.entries()) {
          moveItem(stash, item, offset + page, rows[0], cols[0]);
        }
        offset += nbPages;
      }
    });
  }
}
