import { Item } from "../../items/types/Item";
import { layout } from "../layout";
import { PageFlags, Stash } from "../../stash/types";
import { moveItem } from "../../stash/moveItem";
import { makeIndex } from "../../stash/makeIndex";
import { RUNEWORDS } from "../../../game-data";
import { getBase } from "../../items/getBase";
import { EQUIPMENT_TYPES } from "../list/uniquesOrder";

function runewordsOrder(a: Item, b: Item) {
  return RUNEWORDS[a.runewordId!].levelReq - RUNEWORDS[b.runewordId!].levelReq;
}

function basesOrder(a: Item, b: Item) {
  const baseA = getBase(a);
  const baseB = getBase(b);

  return (
    // Same object order as uniques
    EQUIPMENT_TYPES.indexOf(baseA.type) - EQUIPMENT_TYPES.indexOf(baseB.type) ||
    // Highest tier first
    baseB.qlevel - baseA.qlevel ||
    // Most sockets first
    (b.sockets ?? 0) - (a.sockets ?? 0) ||
    // Superior first
    (b.quality ?? 0) - (a.quality ?? 0)
  );
}

export function organizeRunewords(stash: Stash, both: Item[]) {
  if (both.length === 0) return;

  const runewords = [];
  const bases = [];
  for (const item of both) {
    if (item.runeword) {
      runewords.push(item);
    } else {
      bases.push(item);
    }
  }
  runewords.sort(runewordsOrder);
  bases.sort(basesOrder);

  let offset = stash.pages.length;
  [["Runewords", runewords] as const, ["Bases", bases] as const].forEach(
    ([name, items], i) => {
      const { nbPages, positions } = layout("lines", [items]);
      for (let j = 0; j < nbPages; j++) {
        const page = { name: `# ${name}`, items: [], flags: PageFlags.SHARED };
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
  );
}
