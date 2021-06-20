import { writeJson } from "./files";
import { SkillTab } from "../types";

const IN_ORDER = [
  "Bow and Crossbow Skills",
  "Passive and Magic Skills",
  "Javelin and Spear Skills",
  "Fire Skills",
  "Lightning Skills",
  "Cold Skills",
  "Curses Skills",
  "Poison and Bone Skills",
  "Necromancer Summoning Skills",
  "Paladin Combat Skills",
  "Offensive Auras Skills",
  "Defensive Auras Skills",
  "Barbarian Combat Skills",
  "Masteries Skills",
  "Warcries Skills",
  "Druid Summoning Skills",
  "Shape Shifting Skills",
  "Elemental Skills",
  "Traps Skills",
  "Shadow Disciplines Skills",
  "Martial Arts Skills",
];

export async function skillTabsToJson() {
  const tabs: SkillTab[] = [];
  for (let i = 0; i < IN_ORDER.length; i++) {
    const charClass = Math.floor(i / 3);
    tabs.push({
      id: i + 5 * charClass,
      name: IN_ORDER[i],
      charClass,
    });
  }
  await writeJson("SkillTabs", tabs);
}
