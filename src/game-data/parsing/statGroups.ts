import { readGameFile, writeJson } from "./files";
import { ItemStat, StatGroup } from "../types";
import { getString } from "../strings";

export async function statGroupsToJson(itemStats: ItemStat[]) {
  const table = await readGameFile("ItemStatCost");
  const baseGroups: Omit<StatGroup, "descPriority">[] = [];
  /*
   * I tried to make this more dynamic, but there are only 2 groups from .txt files,
   * and a ton of additional ones that seem to be manually handled by the game code.
   * So I'm giving up on keeping the 2 dynamic, it's pointless.
   *
   * ORDER MATTERS! Ce have some special logic to ignore later groups
   * if previous ones have matched
   */

  // +X to all attributes
  baseGroups.push({
    stat: "all-attr",
    statsInGroup: [0, 1, 2, 3],
    allEqual: true,
    descPos: getString("Moditem2allattrib"),
    descNeg: getString("Moditem2allattrib"),
    descFunc: 1,
    descVal: 1,
  });

  // All resistances +X
  baseGroups.push({
    stat: "all-res",
    statsInGroup: [39, 41, 43, 45],
    allEqual: true,
    descPos: getString("strModAllResistances"),
    descNeg: getString("strModAllResistances"),
    descFunc: 19,
  });

  // +X% enhanced damage
  baseGroups.push({
    stat: "enhanced-dmg",
    statsInGroup: [17, 18],
    allEqual: true,
    descPos: getString("strModEnhancedDamage"),
    descNeg: getString("strModEnhancedDamage"),
    descFunc: 4,
    descVal: 1,
  });

  // Flat added damage, with a little hack:
  // - descPos = description if constant damage
  // - descNeg = description if range
  baseGroups.push({
    stat: "primary-dmg",
    statsInGroup: [21, 22],
    isRange: true,
    descPos: getString("strModMinDamage"),
    descNeg: getString("strModMinDamageRange"),
    descFunc: 100,
  });
  baseGroups.push({
    stat: "secondary-dmg",
    statsInGroup: [23, 24],
    isRange: true,
    descPos: getString("strModMinDamage"),
    descNeg: getString("strModMinDamageRange"),
    descFunc: 100,
  });
  baseGroups.push({
    stat: "fire-dmg",
    statsInGroup: [48, 49],
    isRange: true,
    descPos: getString("strModFireDamage"),
    descNeg: getString("strModFireDamageRange"),
    descFunc: 100,
  });
  baseGroups.push({
    stat: "light-dmg",
    statsInGroup: [50, 51],
    isRange: true,
    descPos: getString("strModLightningDamage"),
    descNeg: getString("strModLightningDamageRange"),
    descFunc: 100,
  });
  baseGroups.push({
    stat: "magic-dmg",
    statsInGroup: [52, 53],
    isRange: true,
    descPos: getString("strModMagicDamage"),
    descNeg: getString("strModMagicDamageRange"),
    descFunc: 100,
  });
  baseGroups.push({
    stat: "cold-dmg",
    statsInGroup: [54, 55, 56],
    isRange: true,
    descPos: getString("strModColdDamage"),
    descNeg: getString("strModColdDamageRange"),
    descFunc: 100,
  });
  baseGroups.push({
    stat: "poison-dmg",
    statsInGroup: [57, 58, 59],
    isRange: true,
    descPos: getString("strModPoisonDamage"),
    descNeg: getString("strModPoisonDamageRange"),
    descFunc: 101,
  });

  // +X to minimum or maximum damage
  baseGroups.push({
    stat: "min-dmg",
    statsInGroup: [21, 23],
    allEqual: true,
    descPos: getString("ModStr1g"),
    descNeg: getString("ModStr1g"),
    descFunc: 1,
    descVal: 1,
  });
  baseGroups.push({
    stat: "max-dmg",
    statsInGroup: [22, 24],
    allEqual: true,
    descPos: getString("ModStr1f"),
    descNeg: getString("ModStr1f"),
    descFunc: 1,
    descVal: 1,
  });

  const statGroups: StatGroup[] = baseGroups.map((group) => ({
    ...group,
    stat: `group:${group.stat}`,
    descPriority: itemStats.reduce(
      (max, { descPriority }, id) =>
        group.statsInGroup.includes(id) ? Math.max(max, descPriority) : max,
      0
    ),
  }));

  await writeJson("ItemStatGroups", statGroups);
  return statGroups;
}
