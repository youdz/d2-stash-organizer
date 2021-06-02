import { readFile, writeFile } from "fs/promises";

export const TXT_FOLDER = "game-data/txt";
export const JSON_FOLDER = "game-data/json";

export async function readGameFile(filename: string) {
  const raw = await readFile(`${TXT_FOLDER}/${filename}.txt`, {
    encoding: "utf-8",
  });
  return raw
    .trim()
    .split("\n")
    .slice(1)
    .filter((line) => !line.startsWith("Expansion"))
    .map((line) => line.split("\t"));
}

export async function writeJson(filename: string, data: unknown) {
  await writeFile(
    `${JSON_FOLDER}/${filename}.json`,
    JSON.stringify(data, undefined, 2)
  );
}
