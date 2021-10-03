import { open } from "fs/promises";
import { d2rStashToSaveFile } from "./parsing/d2rStashToSaveFile";
import { D2rStash } from "./types";

export async function saveD2rStash(stash: D2rStash, path: string) {
  const fileHandle = await open(path, "w");
  await fileHandle.appendFile(d2rStashToSaveFile(stash));
  await fileHandle.close();
}
