import { open } from "fs/promises";
import { Stash } from "./types";
import { generateSaveFile } from "./parsing/generateSaveFile";

export async function saveStash(stash: Stash, path: string) {
  const fileHandle = await open(path, "w");
  await fileHandle.appendFile(generateSaveFile(stash));
  await fileHandle.close();
}
