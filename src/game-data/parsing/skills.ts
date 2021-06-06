import { readGameFile, writeJson } from "./files";
import { getString } from "../strings";
import { Skill } from "../types";

export async function skillsToJson() {
  const skills: Record<string, Skill> = {};
  for (const line of await readGameFile("Skills")) {
    // TODO: import proper name `skillname${id}` ?
    skills[line[0].trim()] = { id: Number(line[1]) };
  }
  await writeJson("Skills", skills);
}
