import {
  ModifierRange,
  PROPERTIES,
  RUNEWORDS,
  SET_ITEMS,
  UNIQUE_ITEMS,
} from "../../../game-data";
import { Item } from "../types/Item";
import { ItemQuality } from "../types/ItemQuality";
import { getBase } from "../getBase";

export function perfectionScore(item: Item) {
  let ranges: ModifierRange[];
  if (item.runeword) {
    ranges = RUNEWORDS[item.runewordId!].modifiers;
  } else if (item.quality === ItemQuality.UNIQUE) {
    ranges = UNIQUE_ITEMS[item.unique!].modifiers;
  } else if (item.quality === ItemQuality.SET) {
    const setItem = SET_ITEMS[item.unique!];
    ranges = [...setItem.baseModifiers, ...setItem.setModifiers];
  } else {
    throw new Error(
      "Only uniques, sets and runewords have a perfection score."
    );
  }

  const base = getBase(item);

  // Computing an average incrementally
  let score = 0;
  let nbProps = 0;
  function addProp(value: number, min: number, max: number) {
    score = (nbProps * score + (value - min) / (max - min)) / ++nbProps;
  }

  for (const { prop, min, max } of ranges) {
    if (min === max) {
      continue;
    }
    // Sockets are a special case: sometimes it's min-max, sometimes it's param,
    // and sometimes it's way more than the actual item allows
    if (prop === "sock") {
      addProp(item.sockets!, min!, Math.min(max!, base.maxSockets));
      continue;
    }

    const { stats } = PROPERTIES[prop];
    for (const { stat, type } of stats) {
      // FIXME: hp/lvl can have a range, see Fortitude
      if (type === "other") {
        const modifier = item.modifiers?.find((mod) => mod.stat === stat);
        let value = 0;
        // I don't believe we can ever not go through that if, but let's be safe
        if (modifier && "value" in modifier) {
          value = modifier.value;
        }
        addProp(value, min!, max!);
      }
    }
  }

  // % enhanced defense armor always spawn with max def + 1
  if (
    (item.quality === ItemQuality.UNIQUE || item.quality === ItemQuality.SET) &&
    "def" in base &&
    !ranges.some(({ prop }) => prop === "ac%")
  ) {
    let defense = item.defense ?? 0;
    if (item.ethereal) {
      defense = defense / 1.5;
    }
    addProp(defense, base.def[0], base.def[1]);
  }

  return nbProps === 0 ? 100 : Math.floor(100 * score);
}
