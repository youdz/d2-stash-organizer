import { SaveFileReader } from "../../save-file/SaveFileReader";
import { D2rStash } from "../types";
import { parsePage } from "./parsePage";
import { postProcessStash } from "./postProcessStash";

// Can't use Node's Buffer because this needs to run in the browser
export function parseD2rStash(
  raw: Uint8Array,
  file?: { name: string; lastModified?: number }
) {
  const reader = new SaveFileReader(raw);
  reader.peek = true;
  const header = reader.readInt32LE().toString(16);
  if (header !== "aa55aa55") {
    throw new Error("This does not look like a Diablo 2 stash save (.d2i)");
  }

  const stash: D2rStash = {
    filename: file?.name ?? "",
    lastModified: file?.lastModified ?? 0,
    // TODO: can different pages have different versions?
    version: reader.readInt32LE(8),
    pages: [],
  };
  reader.peek = false;

  while (!reader.done) {
    stash.pages.push(parsePage(reader, stash));
  }

  postProcessStash(stash);
  return stash;
}
