import { writeJson } from "./files";
import { CharacterClass, SkillTab } from "../types";
import { getString } from "../strings";

const CLASSES: CharacterClass[] = [
  {
    code: "ama",
    name: getString("Amazon"),
    skillsMod: getString("ModStr3a"),
    classOnly: getString("AmaOnly"),
  },
  {
    code: "sor",
    name: getString("Sorceress"),
    skillsMod: getString("ModStr3d"),
    classOnly: getString("SorOnly"),
  },
  {
    code: "nec",
    name: getString("Necromancer"),
    skillsMod: getString("ModStr3c"),
    classOnly: getString("NecOnly"),
  },
  {
    code: "pal",
    name: getString("Paladin"),
    skillsMod: getString("ModStr3b"),
    classOnly: getString("PalOnly"),
  },
  {
    code: "bar",
    name: getString("Barbarian"),
    skillsMod: getString("ModStr3e"),
    classOnly: getString("BarOnly"),
  },
  {
    code: "dru",
    name: getString("druidstr"),
    skillsMod: getString("ModStre8a"),
    classOnly: getString("DruOnly"),
  },
  {
    code: "ass",
    name: getString("assassinstr"),
    skillsMod: getString("ModStre8b"),
    classOnly: getString("AssOnly"),
  },
];

export async function charClassesToJson() {
  await writeJson("CharClasses", CLASSES);
  return CLASSES;
}
