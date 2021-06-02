import { Item } from "../../items/types/Item";
import { layout, LayoutResult } from "../layout";
import { PageFlags, Stash } from "../../stash/types";
import { moveItem } from "../../stash/moveItem";
import { makeIndex } from "../../stash/makeIndex";
import { SET_ITEMS, SetItem, SETS } from "../../../game-data";
import { EQUIPMENT_TYPES } from "../list/uniquesOrder";
import { SETS_ORDER } from "../list/setsOrder";
import { fillTemplate } from "./fillTemplate";
import { getBase } from "../../items/getBase";

function groupBySet<T extends Item | SetItem>(items: T[]) {
  const bySet = new Map<string, T[]>();
  // We create all of them because we still want empty pages for the grail
  for (const setId of Object.keys(SETS)) {
    bySet.set(setId, []);
  }
  for (const item of items) {
    const setItem =
      "set" in item ? (item as SetItem) : SET_ITEMS[(item as Item).unique!];
    bySet.get(setItem.set)!.push(item);
  }
  return bySet;
}

function createTemplates() {
  const allItems = groupBySet(SET_ITEMS);
  const templates = new Map<string, LayoutResult<SetItem>>();
  for (const setId of Object.keys(SETS)) {
    templates.set(setId, layout("set", [allItems.get(setId)!]));
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
      const mainPage = {
        name: `# ${name}`,
        items: [],
        flags: PageFlags.SHARED,
      };
      makeIndex(mainPage, i === 0);
      stash.pages.push(mainPage);

      // Make one instance of the set pretty
      const remaining = fillTemplate(
        stash,
        bySet.get(set)!,
        templates.get(set)!,
        offset
      );
      offset++;

      // Dump extras in subsequent pages
      if (remaining.length > 0) {
        remaining.sort(extrasOrder);
        const { nbPages, positions } = layout("lines", [remaining]);
        for (let j = 0; j < nbPages; j++) {
          stash.pages.push({
            name: `# Extra ${shortName}`,
            items: [],
            flags: PageFlags.SHARED,
          });
        }
        for (const [item, { page, rows, cols }] of positions.entries()) {
          moveItem(stash, item, offset + page, rows[0], cols[0]);
        }
        offset += nbPages;
      }
    });
  }
}
