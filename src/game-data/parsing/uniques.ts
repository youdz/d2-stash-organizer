import { readGameFile, writeJson } from "./files";
import { Skill, UniqueItem } from "../types";
import { getString } from "../strings";
import { readModifierRange } from "./modifierRange";

export async function uniquesToJson(skills: Skill[]) {
  const table = await readGameFile("UniqueItems");
  const uniques: UniqueItem[] = [];
  for (const line of table) {
    const item: UniqueItem = {
      name: getString(line[0].trim()),
      enabled: line[2].trim() === "1",
      code: line[8].trim(),
      qlevel: Number(line[6]),
      modifiers: [],
    };
    for (let i = 0; i < 12; i++) {
      const modifier = readModifierRange(line, 21 + 4 * i, skills);
      if (modifier) {
        item.modifiers.push(modifier);
      }
    }
    uniques.push(item);
  }
  await writeJson("UniqueItems", uniques);
  return uniques;
}
