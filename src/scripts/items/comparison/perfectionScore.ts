import {
  ModifierRange,
  PROPERTIES,
  RUNEWORDS,
  SET_ITEMS,
  SKILL_TABS,
  UNIQUE_ITEMS,
} from "../../../game-data";
import { Item } from "../types/Item";
import { ItemQuality } from "../types/ItemQuality";
import { getBase } from "../getBase";
import { Modifier } from "../types/Modifier";

function checkRange(
  { prop, min, max, param }: ModifierRange,
  modifiers: Modifier[],
  callback: (value: number, min: number, max: number) => void
) {
  const { stats } = PROPERTIES[prop];
  for (const { stat, type } of stats) {
    // Some weird cases of "param" like the hp/lvl on Fortitude actually do have a range
    // Well, that one case. It's the only one in the entire game that I can find.
    if (type === "other" || (type === "param" && !param)) {
      let condition = (mod: Modifier) => mod.stat === stat;
      if (prop === "skill") {
        condition = (mod) =>
          "param" in mod && mod.param === param && mod.stat === stat;
      } else if (prop === "skilltab") {
        const skillTab = SKILL_TABS[Number(param)]?.id;
        condition = (mod) =>
          "param" in mod && mod.param === skillTab && mod.stat === stat;
      }
      const modifier = modifiers?.find(condition);
      // dmg-min and dmg-max are sometimes mindamage, sometimes secondary_mindamage
      if (
        (prop === "dmg-min" || prop === "dmg-max") &&
        typeof modifier === "undefined"
      ) {
        // It's the other property, we just ignore this one not to mess up the score
        continue;
      }
      if (modifier) {
        modifier.range = [min!, max!];
      }
      callback(modifier?.value ?? 0, min!, max!);
    } else if (type === "all") {
      // No impact on perfection score, just copying the range too
      const modifier = modifiers?.find((mod: Modifier) => mod.stat === stat);
      if (modifier) {
        modifier.range = [min!, max!];
      }
    }
  }
}

export function computePerfectionScore(item: Item) {
  if (!item.modifiers) return 0;

  let ranges: ModifierRange[];
  if (item.runeword) {
    ranges = RUNEWORDS[item.runewordId!].modifiers;
  } else if (item.quality === ItemQuality.UNIQUE) {
    ranges = UNIQUE_ITEMS[item.unique!].modifiers;
  } else if (item.quality === ItemQuality.SET) {
    ranges = [
      ...SET_ITEMS[item.unique!].baseModifiers,
      ...SET_ITEMS[item.unique!].setModifiers.flat(),
    ];
  } else {
    throw new Error(
      "Only uniques, sets and runewords have a perfection score."
    );
  }
  // We ignore the "Extra bloody" prop not to confuse people with hidden imperfections
  ranges = ranges.filter(({ prop }) => prop !== "bloody");

  const base = getBase(item);

  // Computing an average incrementally
  let score = 0;
  let nbProps = 0;
  function addProp(value: number, min: number, max: number) {
    // Just putting a catch-all here when there is no range
    if (min === max) {
      return;
    }
    score = (nbProps * score + (value - min) / (max - min)) / ++nbProps;
  }

  for (const range of ranges) {
    if (range.min === range.max) {
      continue;
    }
    // Sockets are a special case: sometimes it's min-max, sometimes it's param,
    // and sometimes it's way more than the actual item allows
    if (range.prop === "sock") {
      item.socketsRange = [range.min!, Math.min(range.max!, base.maxSockets)];
      addProp(item.sockets!, ...item.socketsRange);
      continue;
    }
    checkRange(range, item.modifiers, addProp);
  }

  if (
    (item.quality === ItemQuality.UNIQUE || item.quality === ItemQuality.SET) &&
    "def" in base &&
    // % enhanced defense armor always spawn with max def + 1
    !ranges.some(({ prop }) => prop === "ac%")
  ) {
    const defense = item.defense ?? 0;
    const bonus = item.ethereal ? 1.5 : 1;
    item.defenseRange = [
      Math.floor(base.def[0] * bonus),
      Math.floor(base.def[1] * bonus),
    ];
    addProp(defense, ...item.defenseRange);
  }

  item.perfectionScore = nbProps === 0 ? 100 : Math.floor(100 * score);
}
