import { open } from "fs/promises";
import { PlugyStash } from "./types";
import { plugyStashToSaveFile } from "./parsing/plugyStashToSaveFile";

export async function savePlugyStash(stash: PlugyStash, path: string) {
  const fileHandle = await open(path, "w");
  await fileHandle.appendFile(plugyStashToSaveFile(stash));
  await fileHandle.close();
}
