import { readGameFile, writeJson } from "./files";
import { Misc, Runeword } from "../types";
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
  }
  await writeJson("Misc", misc);

  let runewords: Runeword[] = [];
  for (const line of await readGameFile("Runes")) {
    // This is a bit crazy, but it's what the games seems to actually do for runeword names
    let index = Number(line[0].split("Runeword")[1]);
    const runes = line
      .slice(14, 20)
      .map((rune) => rune.trim())
      .filter((rune) => !!rune);
    const runeword: Runeword = {
      name: getString(line[0].trim()),
      enabled: line[2].trim() === "1",
      runes,
      levelReq: runes.length
        ? Math.max(...runes.map((rune) => misc[rune]?.levelReq ?? 0))
        : 0,
    };
    // Thereis a bug in the data, there are two Runeword95 but no Runeword96
    if (runewords[index] && !runeword.enabled) index++;
    runewords[index] = runeword;
  }
  runewords = runewords.filter((runeword) => !!runeword);
  await writeJson("Runewords", runewords);
}
