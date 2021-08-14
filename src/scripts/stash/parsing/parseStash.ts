import { parsePage } from "./parsePage";
import { Stash } from "../types";
import { readInt32LE } from "./readInt32LE";
import { indexOf } from "./indexOf";
import { postProcessStash } from "./postProcessStash";

// Can't use Node's Buffer because this needs to run in the browser
export function parseStash(raw: Uint8Array) {
  const header = String.fromCharCode(...raw.slice(0, 4));
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
  let currentPage = 10;
  const version = String.fromCharCode(...raw.slice(4, 6));
  if (version === "01") {
    // This is either a personal stash or a shared stash without gold
    if (stash.personal) {
      currentPage += 4;
    }
  } else if (version === "02") {
    // this is a shared stash with gold
    stash.gold = readInt32LE(raw, 6);
    currentPage += 4;
  } else {
    throw new Error("Your version of PlugY is too old.");
  }
  while (currentPage >= 0) {
    const nextPage = indexOf(raw, "ST", currentPage + 2);
    try {
      stash.pages.push(
        parsePage(raw.slice(currentPage, nextPage >= 0 ? nextPage : undefined))
      );
    } catch (e) {
      if ("message" in e) {
        throw new Error(
          `${(e as Error).message} on page ${stash.pages.length + 1}`
        );
      }
    }
    currentPage = nextPage;
  }
  stash.pageFlags = typeof stash.pages[0]?.flags !== "undefined";
  postProcessStash(stash);
  return stash;
}
