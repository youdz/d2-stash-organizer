import { readGameFile, writeJson } from "./files";
import { SetItem, Set } from "../types";
import { getString } from "../strings";

export async function setsToJson() {
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
      const modifierIndex = 13 + 4 * i;
      // * mods seem to be meant for negative values, but appear to be ignored by the game
      if (line[modifierIndex] && !line[modifierIndex].startsWith("*")) {
        item[i > 9 ? "setModifiers" : "baseModifiers"].push({
          prop: line[modifierIndex].trim().toLocaleLowerCase(),
          param: line[modifierIndex + 1],
          min: Number(line[modifierIndex + 2]),
          max: Number(line[modifierIndex + 3]),
        });
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
