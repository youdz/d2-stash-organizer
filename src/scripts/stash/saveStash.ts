import { open } from "fs/promises";
import { Stash } from "./types";
import { stashToSaveFile } from "./parsing/stashToSaveFile";

export async function saveStash(stash: Stash, path: string) {
  const fileHandle = await open(path, "w");
  await fileHandle.appendFile(stashToSaveFile(stash));
  await fileHandle.close();
}
