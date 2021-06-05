import { Item } from "../../items/types/Item";
import { layout, LayoutResult } from "../layout";
import { Stash } from "../../stash/types";
import { moveItem } from "../../stash/moveItem";
import { makeIndex } from "../../stash/makeIndex";
import { UNIQUE_ITEMS, UniqueItem } from "../../../game-data";
import { UNIQUES_ORDER, UniqueSection } from "../list/uniquesOrder";
import { fillTemplate } from "./fillTemplate";
import { getBase } from "../../items/getBase";
import { groupUniquesBySection } from "../list/groupUniques";
import { listGrailUniques } from "../list/listGrailUniques";
import { canBeEthereal } from "../list/canBeEthereal";
import { addPage } from "../../stash/addPage";

function createTemplates(eth: boolean) {
  const uniques = listGrailUniques(eth);
  const templates = new Map<UniqueSection, LayoutResult<UniqueItem>>();
  for (const [section, items] of uniques) {
    templates.set(section, layout(section.layout ?? "tier-lines", items));
  }
  return templates;
}

function extrasOrder(a: Item, b: Item) {
  // Contains rares, crafted and magic items too
  // TODO: this doesn't look great for charms
  const baseA = getBase(a);
  const baseB = getBase(b);
  return (
    // Uniques first
    (b.quality ?? 0) - (a.quality ?? 0) ||
    // Highest tier first
    baseB.qlevel - baseA.qlevel ||
    // Highest qlevel uniques first
    (b.unique ? UNIQUE_ITEMS[b.unique].qlevel : 0) -
      (a.unique ? UNIQUE_ITEMS[a.unique].qlevel : 0)
  );
}

export function organizeUniques(stash: Stash, items: Item[]) {
  const bySection = groupUniquesBySection(items, false);
  const normalTemplates = createTemplates(false);
  const ethTemplates = createTemplates(true);
  let offset = stash.pages.length;
  for (const category of UNIQUES_ORDER) {
    category.forEach((section, i) => {
      const { name, shortName } = section;
      // Always create the pages for the section, even if we have no items
      const normalTemplate = normalTemplates.get(section)!;
      const ethTemplate = ethTemplates.get(section);
      if (!normalTemplate) {
        throw new Error(`No template for ${name}`);
      }
      for (let j = 0; j < normalTemplate.nbPages; j++) {
        const page = addPage(stash, name);
        if (j === 0) {
          makeIndex(page, i === 0);
        }
      }
      for (let j = 0; j < (ethTemplate?.nbPages ?? 0); j++) {
        addPage(stash, `Eth ${shortName}`);
      }

      const itemsInSection = bySection.get(section)?.[0];
      if (!itemsInSection) {
        offset += normalTemplate.nbPages + (ethTemplate?.nbPages ?? 0);
        return;
      }

      // Handle non-eth first so that eth versions don't take non-eth spots unless necessary
      itemsInSection?.sort((a, b) => Number(a.ethereal) - Number(b.ethereal));

      // Position one instance of each item in its normal spot
      let remaining = fillTemplate(
        stash,
        itemsInSection,
        normalTemplate,
        offset
      );
      offset += normalTemplate.nbPages;
      // Position one instance of each remaining eth item in its eth spot
      if (ethTemplate) {
        const remainingAfterEth = remaining.filter(
          (item) => !item.ethereal || !canBeEthereal(item)
        );
        remainingAfterEth.push(
          ...fillTemplate(
            stash,
            // The extra canBeEthereal is to ignore always-eth uniques
            remaining.filter((item) => item.ethereal && canBeEthereal(item)),
            ethTemplate,
            offset
          )
        );
        remaining = remainingAfterEth;
        offset += ethTemplate.nbPages;
      }

      // Dump extras in subsequent pages
      if (remaining.length > 0) {
        remaining.sort(extrasOrder);
        const byQuality = remaining.reduce<Item[][]>((groups, item) => {
          let lastGroup = groups.length - 1;
          if (groups[lastGroup]?.[0]?.quality !== item.quality) {
            lastGroup = groups.push([]) - 1;
          }
          groups[lastGroup].push(item);
          return groups;
        }, []);
        const { nbPages, positions } = layout("lines", byQuality);
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
