import { readGameFile, writeJson } from "./files";
import { Gem, Skill, UniqueItem } from "../types";
import { getString } from "../strings";
import { readModifierRange } from "./modifierRange";

export async function gemsToJson(skills: Skill[]) {
  const table = await readGameFile("Gems");
  const gems: Record<string, Gem> = {};
  for (const line of table) {
    const code = line[3].trim();
    const gem: Gem = {
      weapon: [],
      armor: [],
      shield: [],
    };
    (["weapon", "armor", "shield"] as const).forEach((list, index) => {
      for (let i = 0; i < 3; i++) {
        const modifier = readModifierRange(
          line,
          5 + 12 * index + 4 * i,
          skills
        );
        if (modifier) {
          gem[list].push(modifier);
        }
      }
    });
    gems[code] = gem;
  }
  await writeJson("Gems", gems);
  return gems;
}
