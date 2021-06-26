import { readGameFile, writeJson } from "./files";
import { Set, SetItem, Skill } from "../types";
import { getString } from "../strings";
import { readModifierRange } from "./modifierRange";

export async function setsToJson(setItems: SetItem[], skills: Skill[]) {
  const setsTable = await readGameFile("Sets");
  const sets: Record<string, Set> = {};
  for (const line of setsTable) {
    const setId = line[0].trim();
    const set: Set = {
      name: getString(line[1].trim()),
      levelReq: setItems
        .filter(({ set }) => setId === set)
        .reduce((max, { levelReq }) => Math.max(max, levelReq), 0),
      modifiers: [],
    };
    for (let i = 0; i < 4; i++) {
      const partial = [];
      for (let j = 0; j < 2; j++) {
        const modifier = readModifierRange(line, 4 + 4 * (2 * i + j), skills);
        if (modifier) {
          partial.push(modifier);
        }
      }
      set.modifiers.push(partial);
    }
    const full = [];
    for (let i = 0; i < 8; i++) {
      const modifier = readModifierRange(line, 36 + 4 * i, skills);
      if (modifier) {
        full.push(modifier);
      }
    }
    set.modifiers.push(full);
    sets[setId] = set;
  }
  await writeJson("Sets", sets);
  return sets;
}
