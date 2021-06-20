import { Item } from "../types/Item";
import { ARMORS } from "../../../game-data";
import { Modifier } from "../types/Modifier";

function sortModifiers(mods: Modifier[]) {
  return [...mods].sort((a, b) => {
    const nameComp = a.stat.localeCompare(b.stat);
    if (nameComp !== 0) {
      return nameComp;
    }
    if ("spell" in a && "spell" in b) {
      return a.spell! - b.spell!;
    }
    if ("param" in a && "param" in b) {
      return (a.param ?? 0) - (b.param ?? 0);
    }
    // Should be impossible
    return 0;
  });
}

// Meant to compare identical uniques or set items
export function compare(
  item1: Item,
  item2: Item
): { stat: string; value: number }[] {
  const difference = [];
  difference.push({
    stat: "sockets",
    value: (item1.sockets ?? 0) - (item2.sockets ?? 0),
  });

  if (ARMORS[item1.code]) {
    difference.push({
      stat: "defense",
      value: (item1.defense ?? 0) - (item2.defense ?? 0),
    });
  }

  // Little trick so that eth and non-eth versions are never strictly better or worse
  if (item1.ethereal !== item2.ethereal) {
    difference.push(
      { stat: "ethereal", value: -1 },
      { stat: "ethereal", value: 1 }
    );
  }

  const mods1 = sortModifiers(item1.modifiers ?? []);
  const mods2 = sortModifiers(item2.modifiers ?? []);

  let next1 = mods1.pop();
  let next2 = mods2.pop();
  while (next1 && next2) {
    if (next1.stat < next2.stat) {
      difference.push({ stat: next2.stat, value: -1 });
      next2 = mods2.pop();
      continue;
    }
    if (next1.stat > next2.stat) {
      difference.push({ stat: next1.stat, value: 1 });
      next1 = mods1.pop();
      continue;
    }
    if ("value" in next1 && "value" in next2) {
      difference.push({ stat: next1.stat, value: next1.value! - next2.value! });
    }
    // Spell charges and chances to cast have no variation, no point comparing them
    next1 = mods1.pop();
    next2 = mods2.pop();
  }

  return difference.filter((diff) => diff.value !== 0);
}
