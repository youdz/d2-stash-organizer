import { readGameFile, writeJson } from "./files";
import { UniqueItem } from "../types";
import { getString } from "../strings";

export async function uniquesToJson() {
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
    for (let i = 1; i < 13; i++) {
      const modifierIndex = 17 + 4 * i;
      // * mods seem to be meant for negative values, but appear to be ignored by the game
      if (line[modifierIndex] && !line[modifierIndex].startsWith("*")) {
        item.modifiers.push({
          prop: line[modifierIndex].trim().toLocaleLowerCase(),
          param: line[modifierIndex + 1],
          min: Number(line[modifierIndex + 2]),
          max: Number(line[modifierIndex + 3]),
        });
      }
    }
    uniques.push(item);
  }
  await writeJson("UniqueItems", uniques);
}
