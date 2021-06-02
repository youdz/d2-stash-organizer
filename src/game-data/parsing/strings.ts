import { readGameFile, writeJson } from "./files";

export async function stringsToJson() {
  const allStrings: Record<string, string> = {};
  for (let i = 1; i < 5; i++) {
    for (const [code, value] of await readGameFile(`strings/strings${i}`)) {
      allStrings[code.trim()] = value.trim();
    }
  }
  await writeJson("Strings", allStrings);
}
