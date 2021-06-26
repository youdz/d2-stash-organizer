import { readGameFile, writeJson } from "./files";
import { SetItem, Skill } from "../types";
import { getString } from "../strings";
import { readModifierRange } from "./modifierRange";

export async function setItemsToJson(skills: Skill[]) {
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
    for (let i = 0; i < 9; i++) {
      const modifier = readModifierRange(line, 17 + 4 * i, skills);
      if (modifier) {
        item.baseModifiers.push(modifier);
      }
    }
    for (let i = 0; i < 5; i++) {
      const partial = [];
      for (let j = 0; j < 2; j++) {
        const modifier = readModifierRange(line, 53 + 4 * (2 * i + j), skills);
        if (modifier) {
          partial.push(modifier);
        }
      }
      item.setModifiers.push(partial);
    }
    setItems.push(item);
  }
  await writeJson("SetItems", setItems);
  return setItems;
}
