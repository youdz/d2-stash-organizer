import { readGameFile, writeJson } from "./files";
import { getString } from "../strings";

export async function rareNamesToJson() {
  // Index 0 is unused, suffixes start at 1.
  const names = [""];
  for (const line of await readGameFile("RareSuffix")) {
    names.push(getString(line[0].trim()));
  }
  for (const line of await readGameFile("RarePrefix")) {
    names.push(getString(line[0].trim()));
  }
  await writeJson("RareNames", names);
}
