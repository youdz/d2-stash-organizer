import { Item } from "../../items/types/Item";
import { layout, LayoutResult } from "../layout";
import { PageFlags, Stash } from "../../stash/types";
import { moveItem } from "../../stash/moveItem";
import { makeIndex } from "../../stash/makeIndex";
import { UNIQUE_ITEMS, UniqueItem } from "../../../game-data";
import {
  TYPES_TO_UNIQUES_SECTION,
  UNIQUES_ORDER,
  UniqueSection,
} from "../list/uniquesOrder";
import { fillTemplate } from "./fillTemplate";
import { getBase } from "../../items/getBase";

// TODO: this is a mess, need to break it down and clean it up

function groupBySection<T extends Item | UniqueItem>(
  items: T[],
  withTiers: boolean
) {
  const grouped = new Map<UniqueSection, T[][]>();
  for (const item of items) {
    const base = getBase(item);
    const section =
      TYPES_TO_UNIQUES_SECTION.get(base.type) ||
      ("twoHanded" in base &&
        TYPES_TO_UNIQUES_SECTION.get(`${base.type}-${Number(base.twoHanded)}`));
    if (!section) {
      continue;
    }
    let group = grouped.get(section);
    if (!group) {
      group = [];
      grouped.set(section, group);
    }
    const tierIndex = withTiers ? base.tier : 0;
    let tier = group[tierIndex];
    if (!tier) {
      tier = [];
      group[tierIndex] = tier;
    }
    tier.push(item);
  }
  // Discard empty tiers
  for (const [section, tiers] of grouped) {
    grouped.set(
      section,
      tiers.filter(({ length }) => length > 0)
    );
  }
  return grouped;
}

function createTemplates(eth: boolean) {
  // Ignore disabled and quest items
  let collectible = UNIQUE_ITEMS.filter(
    (item) => item.enabled && item.qlevel > 0
  );
  if (eth) {
    // Ignore indestructible items for the eth version
    collectible = collectible.filter(
      (item) =>
        !getBase(item).indestructible &&
        item.modifiers.every(({ prop }) => prop !== "indestruct")
    );
  }
  const uniques = groupBySection(collectible, true);
  // Sort each section by qlevel
  for (const tiers of uniques.values()) {
    for (const tier of tiers) {
      tier.sort((a, b) => a.qlevel - b.qlevel);
    }
  }
  const templates = new Map<UniqueSection, LayoutResult<UniqueItem>>();
  for (const category of UNIQUES_ORDER) {
    for (const section of category) {
      const items = uniques.get(section);
      if (!items) continue;
      templates.set(section, layout(section.layout ?? "tier-lines", items));
    }
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
  const bySection = groupBySection(items, false);
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
        const page = { name: `# ${name}`, items: [], flags: PageFlags.SHARED };
        if (j === 0) {
          makeIndex(page, i === 0);
        }
        stash.pages.push(page);
      }
      for (let j = 0; j < (ethTemplate?.nbPages ?? 0); j++) {
        stash.pages.push({
          name: `# Eth ${shortName}`,
          items: [],
          flags: PageFlags.SHARED,
        });
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
        const remainingAfterEth = remaining.filter((item) => !item.ethereal);
        remainingAfterEth.push(
          ...fillTemplate(
            stash,
            remaining.filter((item) => item.ethereal),
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
