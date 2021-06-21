import { Item } from "../types/Item";
import { Modifier } from "../types/Modifier";

function mergeable(a: Modifier, b: Modifier) {
  return a.id === b.id && "value" in a && a.param === b.param;
}

export function consolidateMods(item: Item) {
  const mods = item.modifiers!;
  for (const mod of mods) {
    let duplicateIndex: number | undefined;
    while (
      (duplicateIndex = mods.findIndex(
        (other) => mod !== other && mergeable(mod, other)
      )) >= 0
    ) {
      const [duplicate] = mods.splice(duplicateIndex, 1);
      mod.value = (mod.value ?? 0) + (duplicate.value ?? 0);
    }
  }
}
