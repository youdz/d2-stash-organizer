import { readGameFile, writeJson } from "./files";
import { SetItem, Set, Skill } from "../types";
import { getString } from "../strings";
import { readModifierRange } from "./modifierRange";

export async function setsToJson(skills: Skill[]) {
  const itemsTable = await readGameFile("SetItems");
  const setItems: SetItem[] = [];
  for (const line of itemsTable) {
    const item: SetItem = {
      name: getString(line[0].trim()),
      code: line[2].trim(),
      set: line[1].trim(),
      qlevel: Number(line[5]),
      levelReq: Number(line[6]),
      baseModifiers: [],
      setModifiers: [],
    };
    for (let i = 1; i < 20; i++) {
      const modifier = readModifierRange(line, 13 + 4 * i, skills);
      if (modifier) {
        item[i > 9 ? "setModifiers" : "baseModifiers"].push(modifier);
      }
    }
    setItems.push(item);
  }
  await writeJson("SetItems", setItems);

  const setsTable = await readGameFile("Sets");
  const sets: Record<string, Set> = {};
  for (const line of setsTable) {
    const setId = line[0].trim();
    sets[setId] = {
      name: getString(line[1].trim()),
      levelReq: setItems
        .filter(({ set }) => setId === set)
        .reduce((max, { levelReq }) => Math.max(max, levelReq), 0),
    };
  }
  await writeJson("Sets", sets);
}
