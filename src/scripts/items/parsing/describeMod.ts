import { Modifier } from "../types/Modifier";
import {
  CHAR_CLASSES,
  ITEM_STATS,
  ItemStat,
  Skill,
  SKILL_TABS,
  SKILLS,
  SkillTab,
} from "../../../game-data";

export function describeMod(modifier: Modifier): string | undefined {
  const modInfo = ITEM_STATS[modifier.id];
  if (!modInfo) return;

  let modValue = modifier.value;
  if (modInfo.stat.endsWith("perlevel")) {
    if (modInfo.stat.includes("tohit")) {
      modValue = modValue! / 2;
    } else {
      modValue = modValue! / 8;
    }
  }

  let modDesc = (modValue ?? 0) < 0 ? modInfo.descNeg : modInfo.descPos;
  let valueDesc: string | undefined;
  let skill: Skill | undefined;
  let skillTab: SkillTab | undefined;
  switch (modInfo.descFunc) {
    case 1:
    case 6:
    case 12:
      valueDesc = `+${modValue}`;
      break;
    case 2:
    case 7:
      valueDesc = `${modValue}%`;
      break;
    case 3:
    case 9:
      valueDesc = `${modValue}`;
      break;
    case 4:
    case 8:
      valueDesc = (modValue ?? 0) < 0 ? `${modValue}%` : `+${modValue}%`;
      break;
    case 5:
      valueDesc = `${Math.floor((modValue! * 100) / 128)}%`;
      break;
    case 11:
      modDesc = modDesc.replace("%d", `${100 / modValue!}`);
      break;
    case 13:
      modDesc = CHAR_CLASSES[modifier.param!].skillsMod;
      valueDesc = `+${modValue}`;
      break;
    case 14:
      skillTab = SKILL_TABS.find(({ id }) => id === modifier.param);
      if (!skillTab) {
        throw new Error(`Unknown skill tab ${skillTab}`);
      }
      modDesc = `+${modValue} to ${skillTab.name} ${
        CHAR_CLASSES[skillTab.charClass].classOnly
      }`;
      break;
    case 15:
      modDesc = modDesc
        // Extra % because the actual one is doubled to escape it
        .replace("%d%", `${modifier.chance}`)
        .replace("%d", `${modifier.level}`)
        .replace("%s", `${SKILLS[modifier.spell!].name}`);
      break;
    case 16:
      modDesc = modDesc
        .replace("%d", `${modValue}`)
        .replace("%s", `${SKILLS[modifier.param!].name}`);
      break;
    case 20:
      valueDesc = `${-modValue!}%`;
      break;
    case 22:
      valueDesc = `${modValue}%`;
      // We need to do the monster type, but I can't find a single item with this.
      break;
    case 23:
      valueDesc = `${modValue}%`;
      // We need to do the monster, but I can't find a single item with this.
      break;
    case 24:
      modDesc = `Level ${modifier.level} ${
        SKILLS[modifier.spell!].name
      } ${modDesc
        .replace("%d", `${modifier.charges}`)
        .replace("%d", `${modifier.maxCharges}`)}`;
      break;
    case 27:
      skill = SKILLS[modifier.param!];
      modDesc = `+${modValue} to ${skill.name} ${
        CHAR_CLASSES[skill.charClass!].classOnly
      }`;
      break;
    case 28:
      modDesc = `+${modValue} to ${SKILLS[modifier.param!].name}`;
      break;
  }

  if (modDesc) {
    let fullDesc = "";
    switch (modInfo.descVal) {
      case 0:
        fullDesc = modDesc;
        break;
      case 1:
        fullDesc = `${valueDesc} ${modDesc}`;
        break;
      case 2:
        fullDesc = `${modDesc} ${valueDesc}`;
        break;
    }
    if (6 <= modInfo.descFunc && modInfo.descFunc <= 9) {
      fullDesc += ` ${modInfo.descAdditional}`;
    }
    return fullDesc;
  }
}
