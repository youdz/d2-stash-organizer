import { Misc, Runeword, Skill } from "../types";
import { readGameFile, writeJson } from "./files";
import { getString } from "../strings";
import { readModifierRange } from "./modifierRange";

export async function runewordsToJson(
  misc: Record<string, Misc>,
  skills: Skill[]
) {
  let runewords: Runeword[] = [];
  for (const line of await readGameFile("Runes")) {
    // This is a bit crazy, but it's what the game seems to actually do for runeword names
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
      modifiers: [],
    };
    for (let i = 1; i < 8; i++) {
      const modifier = readModifierRange(line, 16 + 4 * i, skills);
      if (modifier) {
        runeword.modifiers.push(modifier);
      }
    }
    // Thereis a bug in the data, there are two Runeword95 but no Runeword96
    if (runewords[index] && !runeword.enabled) index++;
    runewords[index] = runeword;
  }
  runewords = runewords.filter((runeword) => !!runeword);
  await writeJson("Runewords", runewords);
  return runewords;
}
