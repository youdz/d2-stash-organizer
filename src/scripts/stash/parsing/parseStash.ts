import { parsePage } from "./parsePage";
import { Stash } from "../types";
import { postProcessStash } from "./postProcessStash";
import { SaveFileReader } from "./SaveFileReader";

// Can't use Node's Buffer because this needs to run in the browser
export function parseStash(raw: Uint8Array) {
  const reader = new SaveFileReader(raw);
  const header = reader.readString(4);
  if (header !== "SSS\0" && header !== "CSTM") {
    throw new Error(
      "This does not look like a plugy stash file (.sss or .d2x)"
    );
  }
  const stash: Stash = {
    personal: header === "CSTM",
    pageFlags: true,
    gold: 0,
    pages: [],
  };
  let firstPage = 10;
  const version = reader.readString(2);
  if (version === "01") {
    // This is either a personal stash or a shared stash without gold
    if (stash.personal) {
      firstPage += 4;
    }
  } else if (version === "02") {
    // this is a shared stash with gold
    stash.gold = reader.readInt32LE();
    firstPage += 4;
  } else {
    throw new Error("Your version of PlugY is too old.");
  }
  // Position the reader's cursor at the beginning of the first stash page
  reader.read(0, firstPage);
  while (!reader.done) {
    try {
      stash.pages.push(parsePage(reader));
    } catch (e) {
      if ("message" in e) {
        throw new Error(
          `${(e as Error).message} on page ${stash.pages.length + 1}`
        );
      }
    }
  }
  stash.pageFlags = typeof stash.pages[0]?.flags !== "undefined";
  postProcessStash(stash);
  return stash;
}
