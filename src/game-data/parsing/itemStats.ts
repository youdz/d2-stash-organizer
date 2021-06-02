import { readGameFile, writeJson } from "./files";
import { ItemStat } from "../types";
import { getString } from "../strings";

export async function itemStatsToJson() {
  const table = await readGameFile("ItemStatCost");
  const itemStats: ItemStat[] = [];
  for (const line of table) {
    if (
      line[0].startsWith("unused") ||
      line[0].endsWith("_bytime") ||
      !line[21]
    ) {
      continue;
    }
    const id = Number(line[1]);
    const item: ItemStat = {
      stat: line[0].trim(),
      encode: Number(line[14]),
      size: Number(line[21]),
      bias: Number(line[22]),
      paramSize: Number(line[23]),
      descPriority: Number(line[39]),
      descFunc: Number(line[40]),
      descVal: Number(line[41]),
      descPos: getString(line[42].trim()),
      descNeg: getString(line[43].trim()),
    };
    if (
      (item.encode === 2 && (item.size !== 7 || item.paramSize !== 16)) ||
      (item.encode === 3 && (item.size !== 16 || item.paramSize !== 16))
    ) {
      throw new Error("Invalid SkillOnEvent mod");
    }
    // Somehow these are "merged" with the next mod in the save file,
    // but there doesn't seem to be an indication of it in the text file.
    if ([17, 48, 50, 52, 54, 55, 57, 58].includes(id)) {
      item.followedBy = id + 1;
    }
    itemStats[id] = item;
  }
  await writeJson("ItemStatCost", itemStats);
}
