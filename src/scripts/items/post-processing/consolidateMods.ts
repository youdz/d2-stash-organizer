import { Modifier } from "../types/Modifier";

function mergeable(a: Modifier, b: Modifier) {
  return a.id === b.id && "value" in a && a.param === b.param;
}

/**
 * Sums identical mods from different sources on an item.
 * For instance, +25 all res on a shield and +19 all res from a Perfect Diamond
 * is consolidated into a single +44 all res.
 */
export function consolidateMods(mods: Modifier[]) {
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
