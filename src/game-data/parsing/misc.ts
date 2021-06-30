import { readGameFile, writeJson } from "./files";
import { Misc } from "../types";
import { getString } from "../strings";

export async function miscToJson() {
  const misc: Record<string, Misc> = {};
  for (const line of await readGameFile("Misc")) {
    const code = line[13].trim();
    misc[code] = {
      name: getString(line[15].trim()),
      type: line[32].trim(),
      tier: 0,
      maxSockets: Number(line[20]),
      indestructible: line[10].trim() === "1",
      width: Number(line[17]),
      height: Number(line[18]),
      qlevel: Number(line[5]),
      levelReq: Number(line[6]),
    };
    // Token of absolution name is messed up, has the description at the start
    if (code === "toa") {
      misc[code].name = misc[code].name.split("\\n")[1];
    }
  }
  await writeJson("Misc", misc);
  return misc;
}
