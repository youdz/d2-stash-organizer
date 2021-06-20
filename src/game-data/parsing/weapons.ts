import { readGameFile, writeJson } from "./files";
import { EquipmentTier, Weapon } from "../types";
import { getString } from "../strings";

export async function weaponsToJson() {
  const table = await readGameFile("Weapons");
  const weapons: Record<string, Weapon> = {};
  for (const line of table) {
    const code = line[3].trim();
    const tier =
      code === line[34].trim()
        ? EquipmentTier.NORMAL
        : code === line[35].trim()
        ? EquipmentTier.EXCEPTIONAL
        : EquipmentTier.ELITE;
    weapons[code] = {
      name: getString(line[5].trim()),
      type: line[1].trim(),
      tier,
      maxSockets: Number(line[52]) || 0,
      indestructible: line[26].trim() === "1",
      stackable: line[43] === "1",
      twoHanded: line[13] === "1",
      width: Number(line[41]),
      height: Number(line[42]),
      qlevel: Number(line[27]),
      levelReq: Number(line[28]),
    };
  }
  await writeJson("Weapons", weapons);
  return weapons;
}
