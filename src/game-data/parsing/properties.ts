import { readGameFile, writeJson } from "./files";
import { Property, PropertyType } from "../types";

function propertyTypeFromFunc(func: string): PropertyType {
  switch (func) {
    case "11":
      return "proc";
    case "19":
      return "charges";
    case "3":
      return "all";
    case "15":
      return "min";
    case "16":
      return "max";
    case "17":
      return "param";
    default:
      return "other";
  }
}

export async function propertiesToJson() {
  const table = await readGameFile("Properties");
  const properties: Record<string, Property> = {};
  for (const line of table) {
    const stats: Property["stats"] = [];
    for (let i = 1; i < 8; i++) {
      const statIndex = 1 + 4 * i;
      if (line[statIndex]) {
        const param = line[statIndex - 2]
          ? Number(line[statIndex - 2])
          : undefined;
        stats.push({
          stat: line[statIndex].trim(),
          param,
          type: propertyTypeFromFunc(line[statIndex - 1]),
        });
      }
    }
    const propId = line[0].trim();
    // Missing special cases
    if (propId === "dmg%") {
      stats.push(
        {
          stat: "item_mindamage_percent",
          type: "other",
        },
        {
          stat: "item_maxdamage_percent",
          type: "all",
        }
      );
    }
    if (propId === "dmg-min") {
      stats.push({
        stat: "mindamage",
        type: "other",
      });
    }
    if (propId === "dmg-max") {
      stats.push({
        stat: "maxdamage",
        type: "other",
      });
    }
    if (propId === "indestruct") {
      stats.push({
        stat: "item_indesctructible",
        type: "other",
      });
    }
    properties[propId] = { stats };
  }
  await writeJson("Properties", properties);
}
