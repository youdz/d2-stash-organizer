import { readGameFile, writeJson } from "./files";
import { getString } from "../strings";
import { CharacterClass, Skill } from "../types";

export async function skillsToJson(charClasses: CharacterClass[]) {
  const skills: Skill[] = [];
  const descriptions = await readGameFile("SkillDesc");
  for (const line of await readGameFile("Skills")) {
    const description = descriptions.find(
      ([name]) =>
        name.toLocaleLowerCase() === line[0].trim().toLocaleLowerCase()
    );
    const charClass = charClasses.findIndex(
      ({ code }) => code === line[2].trim()
    );
    skills[Number(line[1])] = {
      code: line[0].trim(),
      name: getString(description?.[7].trim() ?? line[0].trim()),
      ...(charClass >= 0 && { charClass }),
    };
  }
  await writeJson("Skills", skills);
  return skills;
}
