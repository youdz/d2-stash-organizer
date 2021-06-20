import { readGameFile, writeJson } from "./files";
import { Armor, EquipmentTier } from "..";
import { getString } from "../strings";

export async function armorsToJson() {
  const table = await readGameFile("Armor");
  const armors: Record<string, Armor> = {};
  for (const line of table) {
    const code = line[17].trim();
    const tier =
      code === line[23].trim()
        ? EquipmentTier.NORMAL
        : code === line[24].trim()
        ? EquipmentTier.EXCEPTIONAL
        : EquipmentTier.ELITE;
    armors[code] = {
      name: getString(line[18].trim()),
      type: line[48].trim(),
      tier,
      def: [Number(line[5]), Number(line[6])],
      maxSockets: Number(line[31]),
      indestructible: line[12].trim() === "1",
      width: Number(line[28]),
      height: Number(line[29]),
      qlevel: Number(line[13]),
      levelReq: Number(line[14]),
    };
  }
  await writeJson("Armor", armors);
  return armors;
}
